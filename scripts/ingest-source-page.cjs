#!/usr/bin/env node
'use strict';

/**
 * One-step source page ingestion for FS page synthesis:
 *   node scripts/ingest-source-page.cjs <local-html-path-or-url> <page-slug> [--render] [--dry-run] [--max-images=120]
 *
 * 1. Reads local HTML (or fetches/renders public URL HTML; stops immediately if gated by auth/anti-bot).
 * 2. When --render is passed:
 *    - Scrolls live page in headless Chrome to trigger lazy-loaded sections/images;
 *    - Captures per-section source screenshots into reference-inputs/<page-slug>/source-screens/;
 *    - Builds reference-inputs/<page-slug>/page-ir.json with strict separation between visibleText
 *      and collapsedDrawers (e.g., collapsed Usage Rules / modals).
 * 3. Extracts all visible image URLs (including CSS background:url(...) and data-bg/gift-card-bg-img),
 *    automatically upgrades Shopify low-res &width=100 thumbnail URLs to full HD for content images,
 *    downloads real images to pages/assets/<page-slug>/, and writes reference-inputs/<page-slug>/assets-map.json.
 * 4. Runs scripts/scan-source-page.cjs on the source HTML and writes reference-inputs/<page-slug>/scan-report.json.
 */

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const http = require('node:http');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const { JSDOM } = require(path.join(ROOT, 'design-system/node_modules/jsdom'));

function fetchBuffer(url, redirects = 3) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          Accept: 'text/html,image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        },
        timeout: 15000,
      },
      (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
          const next = new URL(res.headers.location, url).href;
          res.resume();
          return resolve(fetchBuffer(next, redirects - 1));
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || '' }));
      }
    );
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`Timeout fetching ${url}`));
    });
  });
}

function upgradeHighResImageUrl(urlStr, { keepThumbnail = false } = {}) {
  if (!urlStr || keepThumbnail) return urlStr;
  try {
    const u = new URL(urlStr);
    // Shopify CDN lazy-load placeholders often pass ?v=...&width=100; strip small width param to fetch full HD
    if ((/cdn\.shopify\.com|\/cdn\/shop\/files\//i.test(u.href)) && u.searchParams.has('width')) {
      const w = Number(u.searchParams.get('width'));
      if (w > 0 && w <= 240) {
        u.searchParams.delete('width');
        return u.href;
      }
    }
  } catch (_) {}
  return urlStr;
}

function normalizeImageUrl(raw, baseUrl, opts = {}) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim().replace(/^['"]|['"]$/g, '');
  if (!trimmed || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return null;
  try {
    let resolved = null;
    if (trimmed.startsWith('//')) resolved = 'https:' + trimmed;
    else if (/^https?:\/\//i.test(trimmed)) resolved = trimmed;
    else if (baseUrl) resolved = new URL(trimmed, baseUrl).href;
    return resolved ? upgradeHighResImageUrl(resolved, opts) : null;
  } catch (_) {}
  return null;
}

function extractCssUrls(text, baseUrl) {
  const results = [];
  if (!text || typeof text !== 'string') return results;
  const re = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
  let m;
  while ((m = re.exec(text)) !== null) {
    const u = normalizeImageUrl(m[2], baseUrl, { keepThumbnail: false });
    if (u) results.push(u);
  }
  return results;
}

function guessExt(url, contentType = '') {
  if (/image\/svg/i.test(contentType)) return '.svg';
  if (/image\/webp/i.test(contentType)) return '.webp';
  if (/image\/png/i.test(contentType)) return '.png';
  if (/image\/gif/i.test(contentType)) return '.gif';
  if (/image\/jpe?g/i.test(contentType)) return '.jpg';
  const clean = url.split(/[?#]/)[0];
  const ext = path.extname(clean).toLowerCase();
  if (['.webp', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.avif'].includes(ext)) return ext;
  return '.jpg';
}

async function renderLivePage(url, refDir, dryRun = false) {
  const puppeteer = require('puppeteer-core');
  const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise((r) => setTimeout(r, 2500));
    const initialHtml = await page.content();
    if (/cf-turnstile|g-recaptcha|hcaptcha|verify you are human/i.test(initialHtml) && initialHtml.length < 30000) {
      throw new Error('BLOCKED: Target URL appears gated by anti-bot/CAPTCHA challenge.');
    }
    // Smooth scroll to trigger lazy-loaded sections and images
    await page.evaluate(async () => {
      const step = 600;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });

    const screensDir = path.join(refDir, 'source-screens');
    if (!dryRun) {
      fs.mkdirSync(screensDir, { recursive: true });
    }

    const pageIr = await page.evaluate((sourceUrl) => {
      const isHiddenOrCollapsed = (el) => {
        let cur = el;
        while (cur && cur !== document.body) {
          if (cur.hidden || cur.getAttribute('aria-hidden') === 'true') return true;
          const cls = typeof cur.className === 'string' ? cur.className : '';
          if (/bottom-rules|modal|dialog|popup|drawer|tooltip/i.test(cls) && !/\bis-open\b/i.test(cls)) return true;
          const st = window.getComputedStyle(cur);
          if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') return true;
          if (st.height === '0px' && st.overflow === 'hidden') return true;
          cur = cur.parentElement;
        }
        return false;
      };

      const collectVisibleText = (root) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const chunks = [];
        let node;
        while ((node = walker.nextNode())) {
          const val = node.nodeValue.replace(/\s+/g, ' ').trim();
          if (!val) continue;
          const parent = node.parentElement;
          if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|SVG)$/i.test(parent.tagName)) continue;
          if (isHiddenOrCollapsed(parent)) continue;
          chunks.push(val);
        }
        return chunks.join(' | ');
      };

      const main = document.querySelector('main') || document.body;
      const secs = [...main.querySelectorAll(':scope > section, :scope > div[id*="section"], :scope > div[class*="section"]')].filter(
        (el) => el.getBoundingClientRect().height > 40
      );

      return {
        schemaVersion: 'fs-page-ir/1.1.0',
        source: sourceUrl,
        capturedAt: new Date().toISOString().slice(0, 10),
        sections: secs.map((sec, idx) => {
          const rect = sec.getBoundingClientRect();
          const headings = [...sec.querySelectorAll('h1,h2,h3,[class*="title"]')]
            .filter((h) => !isHiddenOrCollapsed(h))
            .map((h) => h.textContent.replace(/\s+/g, ' ').trim())
            .filter((t) => t && t.length <= 100)
            .slice(0, 8);
          const tabs = [...sec.querySelectorAll('[role="tab"], [data-tab], [class*="tab-item"], [class*="nav-item"]')]
            .filter((t) => !isHiddenOrCollapsed(t))
            .map((t) => t.textContent.replace(/\s+/g, ' ').trim())
            .filter(Boolean);
          const imgs = [...sec.querySelectorAll('img')]
            .filter((i) => i.getBoundingClientRect().width > 16)
            .map((i) => {
              const r = i.getBoundingClientRect();
              const attrW = Number(i.getAttribute('width')) || 0;
              const isInlineIcon = (attrW > 0 && attrW <= 48) || (r.width > 0 && r.width <= 48 && r.height <= 48);
              return {
                src: i.currentSrc || i.src,
                rawSrc: i.getAttribute('src') || '',
                alt: (i.alt || '').trim(),
                renderedWidth: Math.round(r.width),
                renderedHeight: Math.round(r.height),
                role: isInlineIcon ? 'inline-icon' : 'content-image',
              };
            })
            .filter((i) => i.src && /^https?:/i.test(i.src));

          // Collect collapsed rule drawers separately so they are never flattened onto card faces
          const drawerNodes = [...sec.querySelectorAll('[class*="bottom-rules"], details, [class*="collapse-body"], [class*="accordion-content"]')];
          const collapsedDrawers = drawerNodes
            .map((d) => d.textContent.replace(/\s+/g, ' ').trim())
            .filter(Boolean)
            .slice(0, 8);

          const links = [...sec.querySelectorAll('a[href], button')]
            .filter((a) => !isHiddenOrCollapsed(a))
            .map((a) => ({
              tag: a.tagName.toLowerCase(),
              text: a.textContent.replace(/\s+/g, ' ').trim(),
              href: a.href || '',
              className: typeof a.className === 'string' ? a.className : '',
            }))
            .filter((a) => a.text && a.text.length <= 60)
            .slice(0, 24);

          return {
            index: idx + 1,
            id: sec.id || `section-${idx + 1}`,
            bounds: { y: Math.max(0, Math.round(rect.top + window.scrollY)), height: Math.round(rect.height) },
            headings: [...new Set(headings)],
            tabs: [...new Set(tabs)],
            visibleText: collectVisibleText(sec).slice(0, 2400),
            collapsedDrawers: [...new Set(collapsedDrawers)],
            imageCount: imgs.length,
            images: imgs.slice(0, 24),
            actions: links,
            hasForm: !!sec.querySelector('form, input[type="email"]'),
            hasVideo: !!sec.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]'),
          };
        }),
      };
    }, url);

    // Capture per-section source screenshots in the same Puppeteer session
    const sourceScreens = [];
    if (!dryRun) {
      for (const sec of pageIr.sections) {
        const fname = `sec-${String(sec.index).padStart(2, '0')}.png`;
        const fpath = path.join(screensDir, fname);
        try {
          await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 60)), sec.bounds.y);
          await new Promise((r) => setTimeout(r, 120));
          await page.screenshot({ path: fpath });
          sec.sourceScreenshot = `reference-inputs/${path.basename(refDir)}/source-screens/${fname}`;
          sourceScreens.push(sec.sourceScreenshot);
        } catch (_) {}
      }
    }

    const html = await page.content();
    return { html, pageIr, sourceScreens };
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((a) => a.startsWith('--')));
  const positional = args.filter((a) => !a.startsWith('--'));
  const dryRun = flags.has('--dry-run');
  const useRender = flags.has('--render');
  const maxArg = [...flags].find((f) => f.startsWith('--max-images='));
  const maxImages = maxArg ? Number(maxArg.split('=')[1]) || 120 : 120;

  const [input, slug] = positional;
  if (!input || !slug || !/^[a-z0-9][a-z0-9-_]*$/i.test(slug)) {
    console.error('Usage: node scripts/ingest-source-page.cjs <local-html-or-url> <page-slug> [--render] [--dry-run]');
    process.exit(1);
  }

  const refDir = path.join(ROOT, 'reference-inputs', slug);
  const assetsDir = path.join(ROOT, 'pages/assets', slug);
  let htmlPath;
  let html;
  let pageIr = null;
  let sourceScreens = [];
  let baseUrl = null;

  if (/^https?:\/\//i.test(input)) {
    baseUrl = input;
    if (useRender) {
      const rendered = await renderLivePage(input, refDir, dryRun);
      html = rendered.html;
      pageIr = rendered.pageIr;
      sourceScreens = rendered.sourceScreens || [];
    } else {
      const { buffer } = await fetchBuffer(input);
      html = buffer.toString('utf8');
      if (/cf-turnstile|g-recaptcha|hcaptcha|verify you are human/i.test(html) && html.length < 25000) {
        console.error('BLOCKED: Target URL appears gated by an anti-bot or human verification challenge. Provide a saved local HTML instead.');
        process.exit(2);
      }
    }
    htmlPath = path.join(refDir, 'live-main.html');
    if (!dryRun) {
      fs.mkdirSync(refDir, { recursive: true });
      fs.writeFileSync(htmlPath, html, 'utf8');
      if (pageIr) fs.writeFileSync(path.join(refDir, 'page-ir.json'), JSON.stringify(pageIr, null, 2) + '\n', 'utf8');
    }
  } else {
    htmlPath = path.resolve(ROOT, input);
    if (!fs.existsSync(htmlPath)) {
      console.error('Input HTML not found:', htmlPath);
      process.exit(1);
    }
    html = fs.readFileSync(htmlPath, 'utf8');
  }

  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const imageUrls = [];
  const seen = new Set();

  for (const img of doc.querySelectorAll('img, source')) {
    const attrW = Number(img.getAttribute('width')) || 0;
    const attrH = Number(img.getAttribute('height')) || 0;
    const isInlineIcon = attrW > 0 && attrW <= 48 && (attrH === 0 || attrH <= 48);
    const role = isInlineIcon ? 'inline-icon' : 'content-image';

    const candidates = [
      img.getAttribute('data-original'),
      img.getAttribute('data-src'),
      img.getAttribute('src'),
      (img.getAttribute('srcset') || '').split(',').pop()?.trim().split(/\s+/)[0],
      (img.getAttribute('data-srcset') || '').split(',').pop()?.trim().split(/\s+/)[0],
    ];
    for (const c of candidates) {
      const u = normalizeImageUrl(c, baseUrl, { keepThumbnail: isInlineIcon });
      if (u && !seen.has(u)) {
        seen.add(u);
        imageUrls.push({
          url: u,
          alt: (img.getAttribute('alt') || '').trim(),
          role,
        });
        break;
      }
    }
  }

  // Also scan CSS background images and custom bg attributes (e.g. gift-card-bg-img, data-bg, style="background:url(...)")
  for (const el of doc.querySelectorAll('[style*="url("], [data-bg], [data-background], [gift-card-bg-img]')) {
    const rawAttrs = [
      el.getAttribute('gift-card-bg-img'),
      el.getAttribute('data-bg'),
      el.getAttribute('data-background'),
    ].filter(Boolean);
    for (const raw of rawAttrs) {
      const u = normalizeImageUrl(raw, baseUrl, { keepThumbnail: false });
      if (u && !seen.has(u)) {
        seen.add(u);
        imageUrls.push({ url: u, alt: 'Background image', role: 'background' });
      }
    }
    const styleUrls = extractCssUrls(el.getAttribute('style') || '', baseUrl);
    for (const u of styleUrls) {
      if (!seen.has(u)) {
        seen.add(u);
        imageUrls.push({ url: u, alt: 'CSS background image', role: 'background' });
      }
    }
  }
  dom.window.close();

  const selectedImages = imageUrls.slice(0, maxImages);
  const assetsMap = [];

  if (!dryRun && selectedImages.length) {
    fs.mkdirSync(assetsDir, { recursive: true });
    fs.mkdirSync(refDir, { recursive: true });
  }

  for (let i = 0; i < selectedImages.length; i++) {
    const item = selectedImages[i];
    const shortHash = crypto.createHash('sha1').update(item.url).digest('hex').slice(0, 8);
    const ext = guessExt(item.url);
    const filename = `img-${String(i + 1).padStart(2, '0')}-${shortHash}${ext}`;
    const relAsset = `assets/${slug}/${filename}`;
    if (dryRun) {
      assetsMap.push({ index: i + 1, url: item.url, localPath: relAsset, alt: item.alt, role: item.role, status: 'dry-run' });
      continue;
    }
    const existing = fs.existsSync(assetsDir)
      ? fs.readdirSync(assetsDir).find((f) => f.includes(`-${shortHash}.`) && fs.statSync(path.join(assetsDir, f)).size > 0)
      : null;
    if (existing) {
      assetsMap.push({
        index: i + 1,
        url: item.url,
        localPath: `assets/${slug}/${existing}`,
        alt: item.alt,
        role: item.role,
        bytes: fs.statSync(path.join(assetsDir, existing)).size,
        status: 'cached',
      });
      continue;
    }
    try {
      const { buffer, contentType } = await fetchBuffer(item.url);
      const finalExt = guessExt(item.url, contentType);
      const finalName = `img-${String(i + 1).padStart(2, '0')}-${shortHash}${finalExt}`;
      fs.writeFileSync(path.join(assetsDir, finalName), buffer);
      assetsMap.push({
        index: i + 1,
        url: item.url,
        localPath: `assets/${slug}/${finalName}`,
        alt: item.alt,
        role: item.role,
        bytes: buffer.length,
        status: 'downloaded',
      });
    } catch (e) {
      assetsMap.push({ index: i + 1, url: item.url, alt: item.alt, role: item.role, status: 'failed', error: e.message });
    }
  }

  // Run scan-source-page.cjs
  const scanTarget = fs.existsSync(htmlPath) ? htmlPath : input;
  const scanRes = spawnSync(process.execPath, [path.join(ROOT, 'scripts/scan-source-page.cjs'), scanTarget, '--json'], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const scanReport = scanRes.status === 0 ? JSON.parse(scanRes.stdout) : { error: scanRes.stderr || 'scan failed' };

  if (!dryRun) {
    fs.mkdirSync(refDir, { recursive: true });
    fs.writeFileSync(path.join(refDir, 'assets-map.json'), JSON.stringify(assetsMap, null, 2) + '\n', 'utf8');
    fs.writeFileSync(path.join(refDir, 'scan-report.json'), JSON.stringify(scanReport, null, 2) + '\n', 'utf8');
  }

  console.log(
    JSON.stringify(
      {
        slug,
        dryRun,
        source: input,
        discoveredImages: imageUrls.length,
        processedImages: assetsMap.length,
        downloadedOrCached: assetsMap.filter((a) => ['downloaded', 'cached', 'dry-run'].includes(a.status)).length,
        backgroundImagesFound: assetsMap.filter((a) => a.role === 'background').length,
        sourceScreenshotsCaptured: sourceScreens.length,
        sectionsFound: scanReport.sectionCount || (scanReport.sections || []).length || 0,
        signalsSummary: scanReport.summary || null,
        outputs: dryRun
          ? []
          : [
              path.relative(ROOT, path.join(refDir, 'assets-map.json')),
              path.relative(ROOT, path.join(refDir, 'scan-report.json')),
              ...(pageIr ? [path.relative(ROOT, path.join(refDir, 'page-ir.json'))] : []),
            ],
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
