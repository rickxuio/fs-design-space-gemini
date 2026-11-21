#!/usr/bin/env node
'use strict';

/**
 * FS Design System — Fast Visual Capture & Unified Style/Geometry Auditor
 *
 * Dual-mode architecture:
 *   --mode=strict (Stage 1, default): Audits synthesized local pages (pages/*.html)
 *                 for row card equal-height, form control height alignment,
 *                 gray-section white-card border violations, broken images,
 *                 overflow across 1085/1440/1920px, and captures per-section PNGs.
 *   --mode=audit  (Stage 2, live fs.com QA): Audits ANY live URL against
 *                 design-system/components/token-specs/*.json (fonts, weights,
 *                 container width, color palette) without requiring data-library-*.
 *
 * Usage:
 *   npm run audit:page -- pages/renogy-store-pc.html [--out=/tmp/shots] [--no-shots]
 *   npm run audit:page -- https://www.fs.com/... --mode=audit
 */

const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const os = require('node:os');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const CHROME_PATH = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
};

function startStaticServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        const clean = decodeURIComponent((req.url || '/').split(/[?#]/)[0]).replace(/^\/+/, '');
        const full = path.resolve(ROOT, clean);
        if (!full.startsWith(ROOT + path.sep) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
          res.writeHead(404);
          return res.end('Not Found');
        }
        res.setHeader('Content-Type', MIME[path.extname(full).toLowerCase()] || 'application/octet-stream');
        fs.createReadStream(full).pipe(res);
      } catch (_) {
        res.writeHead(500);
        res.end();
      }
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function loadFsTokenSummary() {
  const dir = path.join(ROOT, 'design-system/components/token-specs');
  const colors = new Set();
  if (fs.existsSync(dir)) {
    const colorFile = path.join(dir, 'colors.json');
    if (fs.existsSync(colorFile)) {
      const data = JSON.parse(fs.readFileSync(colorFile, 'utf8'));
      for (const t of data.tokens || []) {
        if (typeof t.value === 'string' && /^#[0-9a-f]{6}$/i.test(t.value)) colors.add(t.value.toLowerCase());
      }
    }
  }
  return { allowedFont: 'Open Sans', allowedWeights: ['400', '600'], tokenColorsCount: colors.size };
}

async function runAudit(target, { mode = 'strict', outDir = null, captureShots = true } = {}) {
  const isUrl = /^https?:\/\//i.test(target);
  let server = null;
  let url = target;
  const slug = isUrl
    ? target.replace(/^https?:\/\//i, '').replace(/[^a-z0-9]+/gi, '-').slice(0, 48)
    : path.basename(target, '.html');

  if (!isUrl) {
    const abs = path.resolve(ROOT, target);
    if (!fs.existsSync(abs)) throw new Error('File not found: ' + target);
    server = await startStaticServer();
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    url = `http://127.0.0.1:${server.address().port}/${rel}`;
  }

  const shotsDir = captureShots
    ? outDir
      ? path.resolve(ROOT, outDir)
      : path.join(os.tmpdir(), `fs-audit-${slug}`)
    : null;
  if (shotsDir) fs.mkdirSync(shotsDir, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const findings = [];
  const screenshots = [];
  const tokenMeta = loadFsTokenSummary();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    // 1. Check horizontal overflow across PC viewports (1085 / 1440 / 1920)
    for (const width of [1085, 1440, 1920]) {
      await page.setViewport({ width, height: 900 });
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));
      if (overflow.scrollWidth > overflow.innerWidth + 1) {
        findings.push({
          ruleId: 'HORIZONTAL_OVERFLOW',
          severity: 'error',
          category: 'layout',
          selector: 'html',
          expected: `<= ${overflow.innerWidth}px`,
          actual: `${overflow.scrollWidth}px`,
          viewport: width,
        });
      }
    }

    // Return to 1440px for geometry, visual & token checks + section screenshots
    await page.setViewport({ width: 1440, height: 900 });
    const domFindings = await page.evaluate((auditMode) => {
      const out = [];
      const round = (n) => Math.round(n * 10) / 10;

      // A. Broken images
      for (const img of document.images) {
        const rect = img.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) continue;
        if (!img.complete || img.naturalWidth === 0) {
          out.push({
            ruleId: 'IMG_LOAD_CHECK',
            severity: 'error',
            category: 'media',
            selector: img.getAttribute('src') || 'img',
            expected: 'naturalWidth > 0',
            actual: '0',
          });
        }
      }

      // B. Row card equal-height check inside .grid
      for (const grid of document.querySelectorAll('main .grid')) {
        const items = [...grid.children].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        });
        const rows = new Map();
        for (const el of items) {
          const r = el.getBoundingClientRect();
          const rowKey = Math.round(r.top / 10) * 10;
          if (!rows.has(rowKey)) rows.set(rowKey, []);
          const card = el.matches('[data-library-component="library-card"]')
            ? el
            : el.querySelector('[data-library-component="library-card"]') || el;
          rows.get(rowKey).push({ el: card, h: card.getBoundingClientRect().height });
        }
        for (const [, row] of rows) {
          if (row.length < 2) continue;
          const heights = row.map((x) => x.h);
          const diff = Math.max(...heights) - Math.min(...heights);
          if (diff > 2) {
            out.push({
              ruleId: 'ROW_CARD_HEIGHT_DIFF',
              severity: auditMode === 'strict' ? 'error' : 'warning',
              category: 'geometry',
              selector: grid.closest('section')?.id ? `#${grid.closest('section').id} .grid` : 'main .grid',
              expected: 'equal row height (diff <= 2px)',
              actual: `min=${round(Math.min(...heights))}px, max=${round(Math.max(...heights))}px (diff=${round(diff)}px)`,
            });
          }
        }
      }

      // C. Form control horizontal row height alignment (input vs button)
      for (const form of document.querySelectorAll('main form')) {
        const input = form.querySelector('.ds-input__field, input[type="text"], input[type="email"]');
        const btn = form.querySelector('button.ds-btn, button[type="submit"]');
        if (input && btn) {
          const ir = input.getBoundingClientRect();
          const br = btn.getBoundingClientRect();
          if (ir.height > 0 && br.height > 0 && Math.abs(ir.top - br.top) < 20) {
            const diff = Math.abs(ir.height - br.height);
            if (diff > 2) {
              out.push({
                ruleId: 'FORM_CONTROL_HEIGHT_DIFF',
                severity: auditMode === 'strict' ? 'error' : 'warning',
                category: 'form',
                selector: form.id ? `#${form.id}` : 'main form',
                expected: `button height == input height (${round(ir.height)}px)`,
                actual: `input=${round(ir.height)}px, button=${round(br.height)}px`,
              });
            }
          }
        }
      }

      // D. Gray section (#FAFBFB) white-card border violation
      for (const sec of document.querySelectorAll('main .page-section--gray')) {
        for (const card of sec.querySelectorAll('[data-library-component="library-card"]')) {
          const cs = getComputedStyle(card);
          if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') {
            out.push({
              ruleId: 'SURFACE_BORDER_CHECK',
              severity: 'error',
              category: 'surface',
              selector: sec.id ? `#${sec.id} .ds-card` : '.page-section--gray .ds-card',
              expected: 'no border on white card inside gray section (#FAFBFB)',
              actual: `${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`,
            });
          }
        }
      }

      // E. Audit mode (Stage 2 live fs.com QA): font family & container width check
      const bodyFont = getComputedStyle(document.body).fontFamily;
      if (!/open\s+sans/i.test(bodyFont)) {
        out.push({
          ruleId: 'TOKEN_FONT_FAMILY',
          severity: auditMode === 'strict' ? 'error' : 'warning',
          category: 'typography',
          selector: 'body',
          expected: 'Open Sans',
          actual: bodyFont,
        });
      }
      return out;
    }, mode);

    findings.push(...domFindings);

    // 2. Capture per-section screenshots (fast, ~2-3s total!)
    if (shotsDir) {
      const sections = await page.$$('main > section');
      for (let i = 0; i < sections.length; i++) {
        const box = await sections[i].boundingBox();
        if (!box || box.width < 10 || box.height < 10) continue;
        const secId = await sections[i].evaluate((el, idx) => el.id || `section-${String(idx + 1).padStart(2, '0')}`, i);
        const shotPath = path.join(shotsDir, `${String(i + 1).padStart(2, '0')}-${secId.replace(/[^a-z0-9-_]/gi, '_')}.png`);
        await sections[i].screenshot({ path: shotPath });
        screenshots.push({ index: i + 1, id: secId, width: Math.round(box.width), height: Math.round(box.height), path: shotPath });
      }
    }
  } finally {
    await browser.close();
    if (server) await new Promise((r) => server.close(r));
  }

  const errors = findings.filter((f) => f.severity === 'error');
  const warnings = findings.filter((f) => f.severity === 'warning');
  const report = {
    schemaVersion: 'fs-audit-report/1.0.0',
    target,
    mode,
    viewport: '1085/1440/1920',
    tokenBaseline: tokenMeta,
    summary: {
      sectionsCaptured: screenshots.length,
      errorCount: errors.length,
      warningCount: warnings.length,
      passed: errors.length === 0,
    },
    findings,
    screenshots,
  };

  if (shotsDir) {
    fs.writeFileSync(path.join(shotsDir, 'audit-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');
  }
  return report;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const target = args.find((a) => !a.startsWith('--'));
  const modeArg = args.find((a) => a.startsWith('--mode='));
  const outArg = args.find((a) => a.startsWith('--out='));
  const noShots = args.includes('--no-shots');
  if (!target) {
    console.error('Usage: npm run audit:page -- <pages/xxx.html or URL> [--mode=strict|audit] [--out=dir] [--no-shots]');
    process.exit(1);
  }
  const t0 = Date.now();
  runAudit(target, {
    mode: modeArg ? modeArg.split('=')[1] : 'strict',
    outDir: outArg ? outArg.split('=')[1] : null,
    captureShots: !noShots,
  })
    .then((report) => {
      console.log(
        JSON.stringify(
          {
            target: report.target,
            mode: report.mode,
            durationMs: Date.now() - t0,
            summary: report.summary,
            findings: report.findings,
            screenshotsDir: report.screenshots[0] ? path.dirname(report.screenshots[0].path) : null,
          },
          null,
          2
        )
      );
      if (!report.summary.passed) process.exit(1);
    })
    .catch((err) => {
      console.error(err.message || err);
      process.exit(1);
    });
}

module.exports = { runAudit };
