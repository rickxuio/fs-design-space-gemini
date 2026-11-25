#!/usr/bin/env node
'use strict';

/**
 * Component Visual Diff Tool (Parent-Child Cascade Visual Verification + Pixel Diff Highlight)
 *
 * Captures 1440px canonical preview screenshots for a target component AND all
 * transitively affected parent components before and after edits, computes exact
 * per-pixel RGBA diffs with a #C00000 highlight overlay, and generates a 3-column
 * HTML comparison report (Before | After | Pixel Diff).
 *
 * Usage:
 *   npm run component:visual-diff -- button --baseline
 *   npm run component:visual-diff -- button --compare
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const puppeteer = require('puppeteer-core');
const { impact } = require('./local-component-maintenance.cjs');

const ROOT = path.resolve(__dirname, '..');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function parseArgs(argv) {
  const args = argv.slice(2);
  let component = '';
  let mode = '';
  for (const a of args) {
    if (a === '--baseline') mode = 'baseline';
    else if (a === '--compare') mode = 'compare';
    else if (!a.startsWith('--') && !component) component = a.replace(/^library-/, '').trim();
  }
  if (!component || !mode) {
    console.error('Usage: npm run component:visual-diff -- <component> --baseline | --compare');
    process.exit(1);
  }
  return { component, mode };
}

function resolveAffectedTargets(component) {
  const catalog = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'fs-components/component-specs/library/catalog.json'), 'utf8')
  );
  const imp = impact(component);
  const rawList = [component, ...(imp.parents || [])];
  const unique = [...new Set(rawList.map((c) => String(c).replace(/^library-/, '')))];

  const targets = [];
  for (const id of unique) {
    const entry = catalog.components['library-' + id];
    if (!entry || !entry.preview) continue;
    const absPreview = path.join(ROOT, entry.preview);
    if (!fs.existsSync(absPreview)) continue;
    targets.push({
      id,
      name: entry.name || id,
      previewRel: entry.preview,
      previewAbs: absPreview,
      isSelf: id === component
    });
  }
  return targets;
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

async function captureTargets(targets, destDir, browser) {
  fs.mkdirSync(destDir, { recursive: true });
  const meta = {};
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  try {
    for (const t of targets) {
      await page.goto('file://' + t.previewAbs, { waitUntil: 'networkidle0' });
      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight
      }));
      const outPng = path.join(destDir, `${t.id}.png`);
      await page.screenshot({ path: outPng, fullPage: true });
      const buf = fs.readFileSync(outPng);
      meta[t.id] = {
        ...metrics,
        bytes: buf.length,
        hash: sha256(buf),
        file: `${t.id}.png`
      };
      console.log(`  Captured ${t.id} (${t.isSelf ? 'target' : 'parent'}): ${metrics.scrollWidth}x${metrics.scrollHeight}px`);
    }
  } finally {
    await page.close();
  }
  fs.writeFileSync(path.join(destDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n', 'utf8');
  return meta;
}

async function computePixelDiffs(targets, outDir, baseMeta, afterMeta, browser) {
  const diffDir = path.join(outDir, 'diff');
  fs.mkdirSync(diffDir, { recursive: true });
  const diffStats = {};
  const page = await browser.newPage();

  try {
    for (const t of targets) {
      const b = baseMeta[t.id];
      const a = afterMeta[t.id];
      if (!b || !a) continue;
      if (b.hash === a.hash) {
        diffStats[t.id] = { changedPixels: 0, totalPixels: b.scrollWidth * b.scrollHeight, changedPercent: 0, diffFile: null };
        continue;
      }
      const bB64 = fs.readFileSync(path.join(outDir, 'baseline', b.file)).toString('base64');
      const aB64 = fs.readFileSync(path.join(outDir, 'after', a.file)).toString('base64');

      const res = await page.evaluate(
        async (base64A, base64B) => {
          function loadImg(b64) {
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = 'data:image/png;base64,' + b64;
            });
          }
          const [imgA, imgB] = await Promise.all([loadImg(base64A), loadImg(base64B)]);
          const w = Math.max(imgA.width, imgB.width);
          const h = Math.max(imgA.height, imgB.height);
          const cA = document.createElement('canvas');
          const cB = document.createElement('canvas');
          const cD = document.createElement('canvas');
          cA.width = cB.width = cD.width = w;
          cA.height = cB.height = cD.height = h;
          const ctxA = cA.getContext('2d');
          const ctxB = cB.getContext('2d');
          const ctxD = cD.getContext('2d');
          ctxA.drawImage(imgA, 0, 0);
          ctxB.drawImage(imgB, 0, 0);
          const dA = ctxA.getImageData(0, 0, w, h).data;
          const dB = ctxB.getImageData(0, 0, w, h).data;
          const out = ctxD.createImageData(w, h);
          const dO = out.data;

          let changedPixels = 0;
          const threshold = 10;
          for (let i = 0; i < dA.length; i += 4) {
            const diff =
              Math.abs(dA[i] - dB[i]) +
              Math.abs(dA[i + 1] - dB[i + 1]) +
              Math.abs(dA[i + 2] - dB[i + 2]) +
              Math.abs(dA[i + 3] - dB[i + 3]);
            if (diff > threshold) {
              changedPixels++;
              // Highlight changed pixels in FS Brand Red (#C00000)
              dO[i] = 192;
              dO[i + 1] = 0;
              dO[i + 2] = 0;
              dO[i + 3] = 255;
            } else {
              // Dimmed grayscale context
              const lum = Math.round((dB[i] * 0.299 + dB[i + 1] * 0.587 + dB[i + 2] * 0.114) * 0.35 + 165);
              dO[i] = lum;
              dO[i + 1] = lum;
              dO[i + 2] = lum;
              dO[i + 3] = 255;
            }
          }
          ctxD.putImageData(out, 0, 0);
          return {
            changedPixels,
            totalPixels: w * h,
            changedPercent: Number(((changedPixels / (w * h)) * 100).toFixed(4)),
            dataUrl: cD.toDataURL('image/png')
          };
        },
        bB64,
        aB64
      );

      const diffFile = `${t.id}-diff.png`;
      const pngBytes = Buffer.from(res.dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
      fs.writeFileSync(path.join(diffDir, diffFile), pngBytes);
      diffStats[t.id] = {
        changedPixels: res.changedPixels,
        totalPixels: res.totalPixels,
        changedPercent: res.changedPercent,
        diffFile
      };
      console.log(`  Diff ${t.id}: ${res.changedPixels.toLocaleString()} px changed (${res.changedPercent}%)`);
    }
  } finally {
    await page.close();
  }
  return diffStats;
}

function buildHtmlReport(component, targets, baseMeta, afterMeta, diffStats, outDir) {
  const rows = targets
    .map((t) => {
      const b = baseMeta[t.id];
      const a = afterMeta[t.id];
      const d = diffStats[t.id] || { changedPixels: 0, changedPercent: 0, diffFile: null };
      const changed = !b || !a || b.hash !== a.hash;
      const dh = b && a ? a.scrollHeight - b.scrollHeight : 0;
      const badge = changed
        ? `<span class="badge badge--changed">CHANGED · ${d.changedPixels.toLocaleString()} px (${d.changedPercent}%)${dh !== 0 ? ` · ${dh > 0 ? '+' : ''}${dh}px H` : ''}</span>`
        : `<span class="badge badge--same">IDENTICAL (0 px)</span>`;
      return `
      <section class="card">
        <div class="card-head">
          <div>
            <h2>${t.name} <code>${t.id}</code> ${t.isSelf ? '<span class="role">Target</span>' : '<span class="role role--parent">Affected Parent</span>'}</h2>
            <p class="sub">${t.previewRel}</p>
          </div>
          ${badge}
        </div>
        <div class="pair ${d.diffFile ? 'pair--3' : ''}">
          <div class="col">
            <h3>Before (Baseline)${b ? ` — ${b.scrollWidth}×${b.scrollHeight}px` : ''}</h3>
            ${b ? `<img src="baseline/${b.file}" alt="baseline ${t.id}">` : '<p class="missing">No baseline captured</p>'}
          </div>
          <div class="col">
            <h3>After (Current)${a ? ` — ${a.scrollWidth}×${a.scrollHeight}px` : ''}</h3>
            ${a ? `<img src="after/${a.file}" alt="after ${t.id}">` : '<p class="missing">No after screenshot</p>'}
          </div>
          ${
            d.diffFile
              ? `<div class="col">
            <h3>Pixel Diff Highlight (#C00000)</h3>
            <img src="diff/${d.diffFile}" alt="pixel diff ${t.id}">
          </div>`
              : ''
          }
        </div>
      </section>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Visual Diff Report — ${component}</title>
  <style>
    body { margin: 0; padding: 32px; font-family: "Open Sans", -apple-system, sans-serif; background: #FAFBFB; color: #19191A; }
    header { max-width: 1480px; margin: 0 auto 24px; }
    h1 { margin: 0 0 8px; font-size: 24px; }
    .meta { color: #707070; font-size: 14px; margin: 0; }
    .card { max-width: 1480px; margin: 0 auto 24px; background: #FFFFFF; border-radius: 8px; padding: 24px; }
    .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #E5E5E5; padding-bottom: 12px; }
    .card-head h2 { margin: 0; font-size: 18px; }
    .sub { margin: 4px 0 0; font-size: 12px; color: #707070; }
    .role { display: inline-block; margin-left: 8px; padding: 2px 8px; font-size: 12px; border-radius: 4px; background: #F3F4F6; color: #19191A; }
    .role--parent { background: #FFF1F0; color: #C00000; }
    .badge { padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .badge--same { background: #E8F5E9; color: #1B5E20; }
    .badge--changed { background: #FFF3E0; color: #E65100; }
    .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
    .pair--3 { grid-template-columns: 1fr 1fr 1fr; }
    .col h3 { margin: 0 0 8px; font-size: 13px; color: #4B4B4D; }
    .col img { width: 100%; height: auto; border: 1px solid #E5E5E5; border-radius: 4px; display: block; }
    .missing { color: #C00000; font-size: 13px; }
  </style>
</head>
<body>
  <header>
    <h1>Component Visual Diff Report: <code>${component}</code></h1>
    <p class="meta">Generated ${new Date().toISOString()} · Targets inspected: ${targets.length} (target + affected parents)</p>
  </header>
  ${rows}
</body>
</html>`;

  const reportFile = path.join(outDir, 'report.html');
  fs.writeFileSync(reportFile, html, 'utf8');
  return reportFile;
}

async function main() {
  const { component, mode } = parseArgs(process.argv);
  const targets = resolveAffectedTargets(component);
  if (!targets.length) {
    console.error(`No preview targets found for component: ${component}`);
    process.exit(1);
  }

  const outDir = path.join(ROOT, 'maintenance', 'visual-diff', component);
  console.log(`[visual-diff] ${component} (${mode}) -> ${targets.length} preview(s): ${targets.map((t) => t.id).join(', ')}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox']
  });

  try {
    if (mode === 'baseline') {
      await captureTargets(targets, path.join(outDir, 'baseline'), browser);
      console.log(`Baseline saved to ${path.relative(ROOT, path.join(outDir, 'baseline'))}`);
    } else {
      const baseMetaPath = path.join(outDir, 'baseline', 'meta.json');
      if (!fs.existsSync(baseMetaPath)) {
        console.error(`Missing baseline for ${component}. Run --baseline first.`);
        process.exit(1);
      }
      const baseMeta = JSON.parse(fs.readFileSync(baseMetaPath, 'utf8'));
      const afterMeta = await captureTargets(targets, path.join(outDir, 'after'), browser);
      const diffStats = await computePixelDiffs(targets, outDir, baseMeta, afterMeta, browser);
      const reportPath = buildHtmlReport(component, targets, baseMeta, afterMeta, diffStats, outDir);
      const changed = targets.filter((t) => !baseMeta[t.id] || baseMeta[t.id].hash !== afterMeta[t.id].hash);
      console.log(`Visual diff report -> ${path.relative(ROOT, reportPath)}`);
      console.log(`Summary: ${changed.length}/${targets.length} preview(s) changed${changed.length ? ': ' + changed.map((c) => c.id).join(', ') : ''}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
