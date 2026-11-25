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
const { buildStaticPageIr } = require('./scan-source-page.cjs');

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
  const browserImageCache = new Map();
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    );
    page.on('response', async (res) => {
      try {
        if (res.status() !== 200) return;
        const ct = res.headers()['content-type'] || '';
        const u = res.url();
        if (!/^https?:/i.test(u)) return;
        if (/^image\//i.test(ct) || /\.(?:png|jpe?g|webp|svg|avif|gif)(?:[?#]|$)/i.test(u)) {
          const buf = await res.buffer();
          if (buf && buf.length > 200) {
            browserImageCache.set(u, { buffer: buf, contentType: ct });
          }
        }
      } catch (_) {}
    });
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await new Promise((r) => setTimeout(r, 3000));
    const initialHtml = await page.content();
    if (/cf-turnstile|g-recaptcha|hcaptcha|verify you are human/i.test(initialHtml) && initialHtml.length < 30000) {
      throw new Error('BLOCKED: Target URL appears gated by anti-bot/CAPTCHA challenge.');
    }
    // Smooth scroll to trigger lazy-loaded sections and images
    await page.evaluate(async () => {
      const step = 650;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });

    const screensDir = path.join(refDir, 'source-screens');
    if (!dryRun) {
      fs.mkdirSync(screensDir, { recursive: true });
    }

    const pageIr = await page.evaluate((sourceUrl) => {
      const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();
      const isHiddenOrCollapsed = (el) => {
        let cur = el;
        while (cur && cur !== document.body) {
          if (cur.hidden || cur.getAttribute?.('aria-hidden') === 'true') return true;
          const cls = typeof cur.className === 'string' ? cur.className : '';
          if (/bottom-rules|modal|dialog|popup|drawer|tooltip/i.test(cls) && !/\bis-open\b/i.test(cls)) return true;
          const st = window.getComputedStyle(cur);
          if (st.display === 'none' || st.visibility === 'hidden' || st.opacity === '0') return true;
          if (st.height === '0px' && st.overflow === 'hidden') return true;
          cur = cur.parentElement;
        }
        return false;
      };

      const walkDeep = (root, fn) => {
        if (!root) return;
        if (root.shadowRoot) walkDeep(root.shadowRoot, fn);
        const kids = root.children || [];
        for (const ch of kids) {
          fn(ch);
          walkDeep(ch, fn);
        }
      };

      const queryAllDeep = (root, selector) => {
        const out = [];
        walkDeep(root, (el) => {
          try {
            if (el.matches && el.matches(selector)) out.push(el);
          } catch (_) {}
        });
        return out;
      };

      const collectVisibleText = (root) => {
        const chunks = [];
        const walkText = (node) => {
          if (!node) return;
          if (node.shadowRoot) walkText(node.shadowRoot);
          for (const ch of node.childNodes || []) {
            if (ch.nodeType === 3) {
              const val = ch.nodeValue.replace(/\s+/g, ' ').trim();
              if (val && ch.parentElement && !/^(SCRIPT|STYLE|NOSCRIPT|SVG)$/i.test(ch.parentElement.tagName) && !isHiddenOrCollapsed(ch.parentElement)) {
                chunks.push(val);
              }
            } else if (ch.nodeType === 1) {
              if (!/^(SCRIPT|STYLE|NOSCRIPT|SVG)$/i.test(ch.tagName) && !isHiddenOrCollapsed(ch)) {
                walkText(ch);
              }
            }
          }
        };
        walkText(root);
        return chunks.join(' | ');
      };

      // Unwrap nested single-child wrapper containers (AEM / React / ICE) to find real visual sections
      const discoverSections = () => {
        let container = document.querySelector('main') || document.body;
        const directSections = [...container.querySelectorAll(':scope > section, :scope > div[id*="section"], :scope > div[class*="section"]')].filter(
          (el) => el.getBoundingClientRect().height > 80 && !isHiddenOrCollapsed(el)
        );
        if (directSections.length >= 3) return directSections;

        // Unwrap down to the first container with >= 3 visible substantial block children;
        // if one child dominates > 55% of total page height (e.g. body = [topBanner, mainWrapper, footer]), keep unwrapping it.
        const pageH = Math.max(document.body.scrollHeight, 1000);
        for (let depth = 0; depth < 8; depth++) {
          const visibleBlocks = [...container.children].filter((el) => {
            const tag = el.tagName.toLowerCase();
            if (['header', 'footer', 'nav', 'script', 'style', 'noscript'].includes(tag)) return false;
            const r = el.getBoundingClientRect();
            return r.height >= 80 && r.width >= 600 && !isHiddenOrCollapsed(el);
          });
          const dominant = visibleBlocks.find((el) => el.getBoundingClientRect().height > pageH * 0.55);
          if (dominant && visibleBlocks.length <= 5) {
            container = dominant;
            continue;
          }
          if (visibleBlocks.length >= 3) return visibleBlocks;
          if (visibleBlocks.length === 1) {
            container = visibleBlocks[0];
          } else {
            break;
          }
        }
        return directSections.length ? directSections : [...container.children].filter((el) => el.getBoundingClientRect().height >= 80 && !isHiddenOrCollapsed(el));
      };

      const secs = discoverSections().slice(0, 24);

      return {
        schemaVersion: 'fs-page-ir/1.3.0',
        extractionMode: 'live-render',
        source: sourceUrl,
        capturedAt: new Date().toISOString().slice(0, 10),
        sections: secs.map((sec, idx) => {
          const rect = sec.getBoundingClientRect();
          const headingNodes = queryAllDeep(sec, 'h1,h2,h3,h4,[class*="title"]')
            .filter((h) => !isHiddenOrCollapsed(h))
            .map((h) => ({ tag: h.tagName.toLowerCase(), text: norm(h.textContent) }))
            .filter((h) => h.text && h.text.length <= 160);
          const seenH = new Set();
          const uniqueHeadingNodes = [];
          for (const h of headingNodes) {
            if (seenH.has(h.text)) continue;
            seenH.add(h.text);
            uniqueHeadingNodes.push(h);
            if (uniqueHeadingNodes.length >= 24) break;
          }
          const headings = uniqueHeadingNodes.map((h) => h.text);
          const tabNodes = queryAllDeep(sec, '[role="tab"], [data-tab], [class*="tab-item"], [class*="nav-item"], [class*="category-item"], [class*="menu-item"]')
            .filter((t) => !isHiddenOrCollapsed(t) && norm(t.textContent).length > 0 && norm(t.textContent).length <= 50);
          const tabs = [...new Set(tabNodes.map((t) => norm(t.textContent)))];

          // Detect vertical left sidebar tabs vs horizontal top tabs
          let tabOrientation = 'none';
          if (tabNodes.length >= 3) {
            const tabRects = tabNodes.slice(0, 6).map((t) => t.getBoundingClientRect());
            const xs = tabRects.map((r) => r.left);
            const ys = tabRects.map((r) => r.top);
            const xSpread = Math.max(...xs) - Math.min(...xs);
            const ySpread = Math.max(...ys) - Math.min(...ys);
            const leftSide = Math.min(...xs) < rect.left + rect.width * 0.3;
            tabOrientation = ySpread > xSpread * 1.4 && leftSide ? 'left-vertical' : 'top-horizontal';
          }

          // Four-tier image role classification (preserving 36-260px third-party logos)
          const rawImgs = [];
          const seenImgSrc = new Set();
          for (const i of queryAllDeep(sec, 'img')) {
            const r = i.getBoundingClientRect();
            const src = i.currentSrc || i.src || i.getAttribute('data-src') || '';
            if (!src || !/^https?:/i.test(src) || r.width < 16 || r.height < 12 || seenImgSrc.has(src)) continue;
            seenImgSrc.add(src);
            const w = Math.round(r.width);
            const h = Math.round(r.height);
            let role = 'content-image';
            if (w >= 900) role = 'hero-banner-bg';
            else if (w <= 32 && h <= 32) role = 'inline-icon';
            else if (w >= 36 && w <= 260 && h >= 18 && h <= 150 && (w / Math.max(h, 1) >= 1.15 || /logo|badge|cert|trust|partner|gartner|forrester|omdia/i.test(`${src} ${i.alt || ''} ${i.className || ''}`))) {
              role = 'third-party-logo';
            }
            rawImgs.push({
              src,
              rawSrc: i.getAttribute('src') || '',
              alt: (i.alt || '').trim(),
              renderedWidth: w,
              renderedHeight: h,
              role,
            });
          }
          // Also inspect CSS background-image inside section
          walkDeep(sec, (el) => {
            const bg = window.getComputedStyle(el).backgroundImage;
            if (!bg || !bg.startsWith('url(')) return;
            const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
            if (!m || !/^https?:/i.test(m[1]) || seenImgSrc.has(m[1])) return;
            const r = el.getBoundingClientRect();
            if (r.width < 180 || r.height < 100) return;
            seenImgSrc.add(m[1]);
            rawImgs.push({
              src: m[1],
              rawSrc: m[1],
              alt: 'CSS background',
              renderedWidth: Math.round(r.width),
              renderedHeight: Math.round(r.height),
              role: r.width >= 900 ? 'hero-banner-bg' : 'content-image',
            });
          });
          const imgs = rawImgs;

          // Carousel detection
          const carouselNodes = [...sec.querySelectorAll('.swiper, .swiper-wrapper, .slick-slider, .splide, [data-carousel], [class*="carousel"], [class*="slider"]')];
          const slideNodes = [...sec.querySelectorAll('.swiper-slide, .slick-slide, .splide__slide, [data-carousel-item], [class*="carousel-item"], [class*="slide-item"]')];
          const navBtnCount = sec.querySelectorAll('.swiper-button-next, .swiper-button-prev, .slick-next, .slick-prev, [class*="carousel-next"], [class*="carousel-prev"], [aria-label*="Next" i], [aria-label*="Previous" i]').length;
          const dotCount = sec.querySelectorAll('.swiper-pagination-bullet, .slick-dots li, [class*="carousel-dot"], [class*="pagination"] button').length;
          const hasCarousel = carouselNodes.length > 0 || slideNodes.length >= 3 || (navBtnCount >= 2 && dotCount >= 2);
          const carouselMeta = hasCarousel
            ? {
                detectedBy: carouselNodes.length ? 'carousel-container' : slideNodes.length >= 3 ? 'slide-items' : 'nav-and-dots',
                itemCount: slideNodes.length || carouselNodes.reduce((m, c) => Math.max(m, c.children.length), 0),
              }
            : null;

          // Structured FAQ Q&A extraction
          const faqItems = [];
          const seenQ = new Set();
          const pushFaq = (q, a) => {
            const question = norm(q);
            const answer = norm(a).slice(0, 800);
            if (!question || question.length < 4 || question.length > 260 || seenQ.has(question)) return;
            seenQ.add(question);
            faqItems.push({ question, answer });
          };
          for (const det of sec.querySelectorAll('details')) {
            const sum = det.querySelector('summary');
            if (!sum) continue;
            const clone = det.cloneNode(true);
            const cloneSum = clone.querySelector('summary');
            if (cloneSum) cloneSum.remove();
            pushFaq(sum.textContent, clone.textContent);
          }
          for (const trigger of sec.querySelectorAll('[aria-expanded][aria-controls], button[class*="faq"], button[class*="accordion"], [class*="faq-question"], [class*="accordion-header"]')) {
            const ctrlId = trigger.getAttribute('aria-controls');
            let panel = ctrlId ? sec.querySelector(`[id="${ctrlId.replace(/"/g, '\\"')}"]`) : null;
            if (!panel) {
              const next = trigger.nextElementSibling || trigger.parentElement?.nextElementSibling;
              if (next && /answer|content|body|panel|collapse|desc/i.test(`${next.className || ''} ${next.getAttribute('role') || ''}`)) {
                panel = next;
              }
            }
            if (panel) pushFaq(trigger.textContent, panel.textContent);
          }

          // Structured Table extraction
          const tables = [];
          for (const tbl of sec.querySelectorAll('table')) {
            const headers = [...tbl.querySelectorAll('thead th, tr:first-child th')].map((th) => norm(th.textContent)).filter(Boolean);
            const allRows = [...tbl.querySelectorAll('tbody tr, tr')];
            const rows = [];
            for (const tr of allRows) {
              const cells = [...tr.querySelectorAll('th, td')].map((c) => norm(c.textContent));
              if (cells.length && cells.some(Boolean)) rows.push(cells);
              if (rows.length >= 40) break;
            }
            if (rows.length) tables.push({ headers: headers.slice(0, 12), rowCount: allRows.length, rows });
            if (tables.length >= 6) break;
          }

          // Structured Card / Item extraction
          const cards = [];
          const seenCardKeys = new Set();
          for (const c of sec.querySelectorAll('article, .swiper-slide, .slick-slide, [class*="card"], [class*="product-item"], [class*="grid-item"], [class*="feature-item"], [class*="review-item"]')) {
            if (c.querySelector('article, .swiper-slide, .slick-slide')) continue;
            const textLen = norm(c.textContent).length;
            if (textLen < 8 || textLen > 1200) continue;
            const titleEl = c.querySelector('h1, h2, h3, h4, h5, [class*="title"], [class*="name"], strong');
            const title = norm(titleEl?.textContent).slice(0, 180);
            const descEl = c.querySelector('p, [class*="desc"], [class*="subtitle"], [class*="summary"], [class*="body"]');
            const subtitle = norm(descEl?.textContent).slice(0, 320);
            const priceEl = c.querySelector('[class*="price"]');
            const price = norm(priceEl?.textContent).slice(0, 60);
            const linkEl = c.querySelector('a[href]');
            const imgEl = c.querySelector('img');
            const imgSrc = imgEl?.currentSrc || imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || '';
            if (!title && !imgSrc) continue;
            const key = `${title}|${imgSrc}`;
            if (seenCardKeys.has(key)) continue;
            seenCardKeys.add(key);
            cards.push({
              title,
              subtitle: subtitle === title ? '' : subtitle,
              price,
              linkText: norm(linkEl?.textContent).slice(0, 60),
              href: linkEl?.getAttribute('href') || '',
              image: imgSrc,
            });
            if (cards.length >= 24) break;
          }

          // Collect collapsed rule drawers separately so they are never flattened onto card faces
          const drawerNodes = [...sec.querySelectorAll('[class*="bottom-rules"], details, [class*="collapse-body"], [class*="accordion-content"]')];
          const collapsedDrawers = drawerNodes
            .map((d) => norm(d.textContent))
            .filter(Boolean)
            .slice(0, 8);

          const links = [...sec.querySelectorAll('a[href], button')]
            .filter((a) => !isHiddenOrCollapsed(a))
            .map((a) => ({
              tag: a.tagName.toLowerCase(),
              text: norm(a.textContent),
              href: a.href || '',
              className: typeof a.className === 'string' ? a.className : '',
            }))
            .filter((a) => a.text && a.text.length <= 60)
            .slice(0, 24);

          // Section Anatomy signals (for zero-downgrade first-pass synthesis)
          const thirdPartyLogos = imgs.filter((im) => im.role === 'third-party-logo');
          const hasIndependentTag = queryAllDeep(sec, '[class*="tag"], [class*="badge"], [class*="chip"], [class*="pill"]')
            .some((el) => {
              if (isHiddenOrCollapsed(el)) return false;
              const t = norm(el.textContent);
              return t.length >= 2 && t.length <= 36;
            });
          const hasCheckSvgOrGlyph =
            queryAllDeep(sec, 'svg, [class*="check"], [class*="tick"], li').some((el) =>
              /check|tick/i.test(`${el.className || ''} ${el.getAttribute?.('aria-label') || ''}`)
            ) || /[✓✔]/.test(sec.textContent || '');
          const hasListItems = queryAllDeep(sec, 'ul li, ol li').length >= 2;
          const listMarker = hasCheckSvgOrGlyph ? 'check-icon' : hasListItems ? 'bullet-dot' : 'none';

          const trailingActions = links
            .filter((l) => /all |view all|learn more|explore|discover|try |start |apply|migrate/i.test(l.text))
            .map((l) => l.text)
            .slice(0, 8);

          let layoutPattern = 'standard-section';
          if (idx === 0 && (imgs.some((im) => im.role === 'hero-banner-bg') || rect.height >= 360)) {
            layoutPattern = hasIndependentTag || hasCheckSvgOrGlyph ? 'hero-with-inner-addons' : 'hero-banner';
          } else if (tabOrientation === 'left-vertical') {
            layoutPattern = 'sidebar-nav-matrix';
          } else if (tabOrientation === 'top-horizontal') {
            layoutPattern = 'top-tabs-grid';
          } else if (hasCarousel) {
            layoutPattern = 'multi-card-carousel';
          } else if (thirdPartyLogos.length >= 4 && cards.length <= 2) {
            layoutPattern = 'logo-trust-wall';
          }

          return {
            index: idx + 1,
            id: sec.id || `section-${idx + 1}`,
            bounds: { y: Math.max(0, Math.round(rect.top + window.scrollY)), height: Math.round(rect.height) },
            headings,
            headingNodes: uniqueHeadingNodes,
            tabs: [...new Set(tabs)],
            anatomy: {
              layoutPattern,
              tabOrientation,
              hasIndependentTag,
              listMarker,
              thirdPartyLogoCount: thirdPartyLogos.length,
              trailingActions: [...new Set(trailingActions)],
            },
            visibleText: collectVisibleText(sec).slice(0, 6000),
            hiddenCopy: (() => {
              const vis = collectVisibleText(sec);
              const out = [];
              sec.querySelectorAll('p, li, h3, h4, dd, td, [class*="desc" i], [class*="text" i]').forEach((el) => {
                if (el.closest('script, style, svg, noscript')) return;
                const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
                if (t.length >= 16 && t.length <= 360 && !vis.includes(t) && !out.includes(t)) {
                  out.push(t);
                }
              });
              return out.slice(0, 24);
            })(),
            collapsedDrawers: [...new Set(collapsedDrawers)],
            hasCarousel,
            carouselMeta,
            cards,
            faqItems: faqItems.slice(0, 24),
            tables,
            inlineSvgCount: Array.from(sec.querySelectorAll('svg')).filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width >= 10 && r.height >= 10 && r.width <= 96 && r.height <= 96;
            }).length,
            imageCount: imgs.length,
            images: imgs.slice(0, 32),
            actions: links,
            hasForm: !!sec.querySelector('form, input[type="email"], textarea'),
            hasVideo: !!sec.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]'),
          };
        }),
      };
    }, url);

    // Dismiss/hide cookie consent dialogs, promo modals, backdrop scrims, and floating overlays
    const dismissOverlaysInPage = async () => {
      await page.evaluate(() => {
        const overlaySelectors = [
          '[id*="cookie" i]', '[class*="cookie" i]',
          '[id*="onetrust" i]', '[class*="onetrust" i]',
          '[id*="consent" i]', '[class*="consent" i]',
          '[class*="gdpr" i]', '[id*="gdpr" i]',
          '[aria-label*="cookie" i]', '[aria-label*="consent" i]',
          '[role="dialog"]', '[aria-modal="true"]',
          '[class*="modal" i]', '[id*="modal" i]',
          '[class*="popup" i]', '[id*="popup" i]',
          '[class*="overlay" i]', '[class*="backdrop" i]'
        ];
        for (const sel of overlaySelectors) {
          try {
            document.querySelectorAll(sel).forEach((el) => {
              if (el.tagName === 'HEADER' || el.tagName === 'NAV' || el.closest('header, nav')) return;
              const st = getComputedStyle(el);
              if (st.position === 'fixed' || st.position === 'sticky' || st.position === 'absolute' && Number(st.zIndex) >= 100 || Number(st.zIndex) >= 100) {
                el.style.setProperty('display', 'none', 'important');
              }
            });
          } catch (_) {}
        }
        // Hide any non-header fixed element covering the center of the viewport, bottom bar, or floating widget
        const vh = window.innerHeight || 900;
        const vw = window.innerWidth || 1440;
        document.querySelectorAll('body *').forEach((el) => {
          if (el.tagName === 'HEADER' || el.tagName === 'NAV' || el.closest('header, nav')) return;
          const st = getComputedStyle(el);
          if (st.position !== 'fixed') return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          const isTopStickyNav = r.top <= 90 && r.height <= 90 && r.width >= vw * 0.7;
          if (isTopStickyNav) return;
          const coversCenter = r.left <= vw * 0.5 && r.right >= vw * 0.5 && r.top <= vh * 0.5 && r.bottom >= vh * 0.5;
          const isFullBackdrop = r.width >= vw * 0.8 && r.height >= vh * 0.8;
          const isBottomBar = r.bottom >= vh - 20 && r.top > vh * 0.4;
          const isFloatingWidget = r.height < 420 && r.width < 520 && r.top > 120;
          if (coversCenter || isFullBackdrop || isBottomBar || isFloatingWidget) {
            el.style.setProperty('display', 'none', 'important');
          }
        });
      });
    };
    await dismissOverlaysInPage();
    await new Promise((r) => setTimeout(r, 150));

    // Capture per-section source screenshots in the same Puppeteer session (multi-part for tall sections > 900px)
    const sourceScreens = [];
    if (!dryRun) {
      const stepH = 780;
      for (const sec of pageIr.sections) {
        const parts = Math.min(4, Math.max(1, Math.ceil((sec.bounds.height || 0) / 900)));
        sec.sourceScreenshots = [];
        for (let p = 0; p < parts; p++) {
          const suffix = p === 0 ? '' : `-p${p + 1}`;
          const fname = `sec-${String(sec.index).padStart(2, '0')}${suffix}.png`;
          const fpath = path.join(screensDir, fname);
          const scrollY = Math.max(0, (sec.bounds.y || 0) - (p === 0 ? 60 : 0) + p * stepH);
          try {
            await page.evaluate((y) => window.scrollTo(0, y), scrollY);
            await new Promise((r) => setTimeout(r, 120));
            await dismissOverlaysInPage();
            await page.screenshot({ path: fpath });
            const rel = `reference-inputs/${path.basename(refDir)}/source-screens/${fname}`;
            if (p === 0) sec.sourceScreenshot = rel;
            sec.sourceScreenshots.push(rel);
            sourceScreens.push(rel);
          } catch (_) {}
        }
      }
    }

    const html = await page.content();
    return { html, pageIr, sourceScreens, browserImageCache };
  } finally {
    await browser.close();
  }
}

async function main() {
  const args = process.argv.slice(2);
  let urlOpt = null;
  let slugOpt = null;
  const flags = new Set();
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--url' && args[i + 1]) {
      urlOpt = args[++i];
    } else if (a.startsWith('--url=')) {
      urlOpt = a.slice(6);
    } else if (a === '--slug' && args[i + 1]) {
      slugOpt = args[++i];
    } else if (a.startsWith('--slug=')) {
      slugOpt = a.slice(7);
    } else if (a.startsWith('--')) {
      flags.add(a);
    } else {
      positional.push(a);
    }
  }
  const dryRun = flags.has('--dry-run');
  const useRender = flags.has('--render');
  const maxArg = [...flags].find((f) => f.startsWith('--max-images='));
  const maxImages = maxArg ? Number(maxArg.split('=')[1]) || 120 : 120;

  const input = urlOpt || positional[0];
  const slug = slugOpt || positional[1];
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
  let browserImageCache = new Map();
  let baseUrl = null;

  if (/^https?:\/\//i.test(input)) {
    baseUrl = input;
    if (useRender) {
      const rendered = await renderLivePage(input, refDir, dryRun);
      html = rendered.html;
      pageIr = rendered.pageIr;
      sourceScreens = rendered.sourceScreens || [];
      browserImageCache = rendered.browserImageCache || new Map();
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
  if (!pageIr) {
    pageIr = buildStaticPageIr(doc, baseUrl || path.relative(ROOT, htmlPath));
  }
  const imageUrls = [];
  const seen = new Set();

  // Prioritize structured images captured from live browser render (includes Shadow DOM & four-tier roles)
  if (pageIr && Array.isArray(pageIr.sections)) {
    for (const sec of pageIr.sections) {
      for (const im of sec.images || []) {
        const u = normalizeImageUrl(im.src, baseUrl, { keepThumbnail: im.role === 'inline-icon' || im.role === 'third-party-logo' });
        if (u && !seen.has(u)) {
          seen.add(u);
          imageUrls.push({
            url: u,
            alt: im.alt || '',
            role: im.role || 'content-image',
          });
        }
      }
    }
  }

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
      const cachedRes = browserImageCache.get(item.url);
      const { buffer, contentType } = cachedRes || (await fetchBuffer(item.url));
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
        status: cachedRes ? 'downloaded-browser' : 'downloaded',
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
    if (pageIr) {
      fs.writeFileSync(path.join(refDir, 'page-ir.json'), JSON.stringify(pageIr, null, 2) + '\n', 'utf8');
    }
  }

  console.log(
    JSON.stringify(
      {
        slug,
        dryRun,
        source: input,
        discoveredImages: imageUrls.length,
        processedImages: assetsMap.length,
        downloadedOrCached: assetsMap.filter((a) => ['downloaded', 'downloaded-browser', 'cached', 'dry-run'].includes(a.status)).length,
        thirdPartyLogosFound: assetsMap.filter((a) => a.role === 'third-party-logo').length,
        backgroundImagesFound: assetsMap.filter((a) => a.role === 'background' || a.role === 'hero-banner-bg').length,
        sourceScreenshotsCaptured: sourceScreens.length,
        liveSectionsFound: Array.isArray(pageIr?.sections) ? pageIr.sections.length : 0,
        sectionsFound: scanReport.sectionCount || (scanReport.sections || []).length || 0,
        anatomySummary: Array.isArray(pageIr?.sections)
          ? pageIr.sections.map((s) => ({
              index: s.index,
              heading: (s.headings && s.headings[0]) || s.id,
              ...(s.anatomy || {}),
            }))
          : null,
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
