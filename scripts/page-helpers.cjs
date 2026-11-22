'use strict';

/**
 * FS Design System — Shared Page Synthesis Helper Library
 *
 * Eliminates repetitive boilerplate & prop-format trial-and-error across
 * URL, Screenshot, and PRD inputs (converging on unified Page IR).
 */

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const http = require('node:http');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const { JSDOM } = require(path.join(ROOT, 'design-system/node_modules/jsdom'));

const CATALOG_PATH = path.join(ROOT, 'fs-components/component-specs/library/catalog.json');
function getActiveRelease() {
  return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8')).version;
}
const ACTIVE_RELEASE = getActiveRelease();

// 100% 48px FS Red/Black Dual-Tone Business Icons (all whitelisted in icon-card.json; zero 16px UI control icons)
const OFFICIAL_ICON_CARD_ICONS = {
  development: 'components/icons/icon-benefit-development.svg',
  community: 'components/icons/icon-benefit-community.svg',
  payment: 'components/icons/mastergo-library/定制Icon/33189-58768.svg',
  support: 'components/icons/mastergo-library/定制Icon/33189-58740.svg',
  security: 'components/icons/mastergo-library/定制Icon/33189-58763.svg',
  global: 'components/icons/mastergo-library/定制Icon/2632-3490.svg',
  fast: 'components/icons/mastergo-library/定制Icon/33189-58732.svg',
  quality: 'components/icons/mastergo-library/定制Icon/33189-58777.svg',
  device: 'components/icons/mastergo-library/定制Icon/66567-76227.svg',
  solar: 'components/icons/mastergo-library/定制Icon/62712-75472.svg',
  milestone: 'components/icons/mastergo-library/定制Icon/33189-58745.svg',
  reward: 'components/icons/mastergo-library/定制Icon/66567-76458.svg',
};

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function compTag(component, fragment, props = {}) {
  return `<div data-component="${component}" data-fragment="${fragment}" data-props='${esc(JSON.stringify(props))}'></div>`;
}

function tabItemsHtml(labels, panelPrefix = '') {
  return labels
    .map((label, i) => {
      const active = i === 0 ? ' ds-tab__item--active' : '';
      const indicator = i === 0 ? '<div class="ds-tab__indicator"></div>' : '';
      const ctrl = panelPrefix ? ` aria-controls="${panelPrefix}-${i}"` : '';
      return `<div class="ds-tab__item${active}" data-tab-item=""${ctrl}><div class="ds-tab__item-inner"><span class="ds-tab__item-text">${esc(label)}</span>${indicator}</div></div>`;
    })
    .join('');
}

function unorderedListItemsHtml(lines) {
  return lines
    .map(
      (line) =>
        `<div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">${esc(line)}</p></div>`
    )
    .join('');
}

function faqItemsHtml(prefix, items, release = getActiveRelease()) {
  const arrow = `../fs-components/component-specs/library/releases/${release}/components/icons/icon-collapse-faq-down-current.svg`;
  return items
    .map((item, idx) => {
      const pos = idx === 0 ? 'first' : idx === items.length - 1 ? 'last' : 'middle';
      const divider = idx === items.length - 1 ? 'off' : 'on';
      const ansId = `${prefix}-ans-${idx}`;
      const q = item.q || item.title || '';
      const a = item.a || item.desc || '';
      return `<div class="ds-collapse ds-collapse--faq-source-row ds-collapse__item" data-faq-position="${pos}" data-faq-state="collapsed" data-faq-divider="${divider}"><button class="ds-collapse__header ds-collapse__faq-source-header" type="button" aria-expanded="false" aria-controls="${ansId}"><span class="ds-collapse__faq-source-title">${esc(q)}</span><img class="ds-collapse__faq-source-arrow" src="${arrow}" alt=""></button><p class="ds-collapse__body ds-collapse__faq-source-body" id="${ansId}" hidden aria-hidden="true">${esc(a)}</p></div>`;
    })
    .join('');
}

function sidebarMenuHtml(groups) {
  return `<ul class="ds-menu-navigation__list">${groups
    .map((g, i) =>
      i === 0
        ? `<li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="${esc(g.id)}" aria-pressed="true"><span class="ds-menu-navigation__item-label">${esc(g.label)}</span></button></li>`
        : `<li><button class="ds-menu-navigation__item" type="button" data-value="${esc(g.id)}"><span class="ds-menu-navigation__item-label">${esc(g.label)}</span></button></li>`
    )
    .join('')}</ul>`;
}

function cardProps(item, imgSrc, refRel, { omitCategory = true, omitDesc = false, omitLink = false, categoryText = '' } = {}) {
  const absentSlots = [];
  const props = {
    image: `<img src="${esc(imgSrc)}" alt="${esc(item.title)}">`,
    title: item.title,
  };
  if (omitCategory) absentSlots.push('category');
  else props.category = categoryText || item.category || '';

  if (omitDesc || !item.desc) absentSlots.push('description');
  else props.description = `<p>${esc(item.desc)}</p>`;

  if (omitLink || !item.cta) {
    absentSlots.push('link');
  } else {
    props.linkLabel = item.cta;
    props.href = item.href || '#';
  }

  if (absentSlots.length) {
    props.sourceAbsent = {
      reference: refRel,
      objectId: item.id,
      slots: absentSlots,
    };
  }
  return props;
}

function iconCardProps(item, refRel) {
  const icon = OFFICIAL_ICON_CARD_ICONS[item.icon] || item.icon || OFFICIAL_ICON_CARD_ICONS.development;
  const props = {
    icon,
    title: item.title,
    description: item.desc || item.title,
  };
  const absent = [];
  if (!item.bullets) absent.push('bullets');
  else props.bullets = item.bullets;
  if (!item.link) absent.push('link');
  else props.link = item.link;
  if (absent.length) {
    props.sourceAbsent = {
      reference: refRel,
      objectId: item.id,
      slots: absent,
    };
  }
  return props;
}

function heroBanner({ imgSrc, title, description, actionLabel, actionCallback = 'onHeroCta' }) {
  return `<section class="hero-surface" aria-label="${esc(title)}">
  <img class="hero-surface__bg" src="${esc(imgSrc)}" alt="${esc(title)}">
  <div class="hero-surface__scrim"></div>
  <div class="hero-surface__inner">
    ${compTag('library-banner', 'hero-responsive', {
      title,
      description,
      actionLabel,
      actionCallback,
      surface: 'image',
    })}
  </div>
</section>`;
}

function buildContentReference(refDir, sourceUrl, objects) {
  fs.mkdirSync(refDir, { recursive: true });
  const items = objects.map((obj) => {
    const rec = { objectId: obj.id, title: obj.title };
    if (obj.category) rec.category = obj.category;
    if (obj.desc) rec.description = obj.desc;
    if (obj.cta) rec.link = obj.cta;
    if (obj.bullets) rec.bullets = obj.bullets;
    return rec;
  });
  const out = path.join(refDir, 'content.json');
  fs.writeFileSync(
    out,
    JSON.stringify(
      {
        kind: 'original-page-content-reference',
        source: sourceUrl,
        capturedAt: new Date().toISOString().slice(0, 10),
        modules: [{ id: 'main', items }],
      },
      null,
      2
    ) + '\n',
    'utf8'
  );
  return out;
}

function assembleLocalPage(pageSourceHtml, outPath, options = {}) {
  const { assemblePage, loadRegistry } = require(path.join(ROOT, 'build.js'));
  const registry = options.registry || loadRegistry();
  const absOut = path.isAbsolute(outPath) ? outPath : path.join(ROOT, outPath);
  const targetDir = options.targetDir || path.dirname(absOut);
  const sourceFile = options.sourceFile || path.basename(absOut);
  const { html } = assemblePage(pageSourceHtml, registry, new Map(), sourceFile, { targetDir });
  if (options.write !== false) {
    fs.mkdirSync(path.dirname(absOut), { recursive: true });
    fs.writeFileSync(absOut, html, 'utf8');
  }
  return html;
}

function fetchBuffer(url, redirects = 3) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location && redirects > 0) {
        res.resume();
        return resolve(fetchBuffer(new URL(res.headers.location, url).href, redirects - 1));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] || '' }));
    });
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error(`Timeout: ${url}`)));
  });
}

function guessExt(url, ct = '') {
  if (/webp/i.test(ct)) return '.webp';
  if (/png/i.test(ct)) return '.png';
  if (/svg/i.test(ct)) return '.svg';
  const ext = path.extname(url.split(/[?#]/)[0]).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.avif'].includes(ext) ? ext : '.jpg';
}

async function downloadImages(urls, assetsDir, slug, concurrency = 8) {
  fs.mkdirSync(assetsDir, { recursive: true });
  const unique = [...new Set(urls.filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u)))];
  const urlMap = new Map();
  let idx = 0;
  async function worker() {
    while (idx < unique.length) {
      const i = idx++;
      const url = unique[i];
      const hash = crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
      const existing = fs.readdirSync(assetsDir).find((f) => f.includes(`-${hash}.`));
      if (existing) {
        urlMap.set(url, `assets/${slug}/${existing}`);
        continue;
      }
      const { buffer, contentType } = await fetchBuffer(url);
      const ext = guessExt(url, contentType);
      const fname = `img-${String(i + 1).padStart(2, '0')}-${hash}${ext}`;
      fs.writeFileSync(path.join(assetsDir, fname), buffer);
      urlMap.set(url, `assets/${slug}/${fname}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, unique.length || 1) }, worker));
  return urlMap;
}

function extractOfficialTagSnippets(buildMod, registry, targetDir) {
  const bm = buildMod || require(path.join(ROOT, 'build.js'));
  const reg = registry || bm.loadRegistry();
  const dir = targetDir || path.join(ROOT, 'pages');
  const getTag = (fragment) => {
    const html = bm.assemblePage(
      `<!doctype html><html><head></head><body>${compTag('library-tag', fragment, {})}</body></html>`,
      reg,
      new Map(),
      `tag-${fragment}.html`,
      { targetDir: dir }
    ).html;
    const d = new JSDOM(html);
    const out = d.window.document.querySelector('[data-library-component="library-tag"]').outerHTML;
    d.window.close();
    return out;
  };
  return {
    'semantic-new': getTag('semantic-new'),
    featured: getTag('featured'),
  };
}

function basePageCss() {
  return `
body { margin: 0; font-family: "Open Sans", Arial, sans-serif; color: #19191A; background: #FFFFFF; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.container { max-width: 1200px; width: 100%; margin: 0 auto; padding: 0; box-sizing: border-box; }
.page-section { padding: 40px 0; background: #FFFFFF; }
.page-section--gray { background: #FAFBFB; }
.section-header { text-align: center; margin-bottom: 24px; }
.section-header__tag { display: flex; justify-content: center; margin-bottom: 8px; }
.section-header__title { margin: 0; font-size: 24px; line-height: 32px; font-weight: 600; color: #19191A; }
.section-header__desc { margin: 12px auto 0; max-width: 960px; font-size: 14px; line-height: 22px; font-weight: 400; color: #4B4B4D; }
.section-header__action { margin-top: 12px; display: flex; justify-content: center; }
.center-tabs-layout { display: flex; justify-content: center; margin-bottom: 24px; }
.grid { display: grid; gap: 20px; align-items: stretch; }
.grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.card-full-link { display: grid; text-decoration: none; color: inherit; height: 100%; }
.hero-surface { position: relative; width: 100%; overflow: hidden; background: #19191A; }
.hero-surface__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.hero-surface__scrim { position: absolute; inset: 0; background: rgba(0, 0, 0, 0.48); z-index: 1; }
.hero-surface__inner { position: relative; z-index: 2; }
.store-card-tag-row { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
.store-card-price-row { display: flex; align-items: baseline; gap: 8px; margin-top: 8px; }
.store-price-current { font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; }
.store-price-compare { font-size: 13px; line-height: 20px; color: #707070; text-decoration: line-through; }
.subscribe-card-1200 { display: grid; grid-template-columns: 600px 600px; width: 1200px; max-width: 100%; min-height: 338px; background: #FFFFFF; border-radius: 8px; overflow: hidden; box-sizing: border-box; }
.subscribe-card-1200__media { height: 338px; overflow: hidden; }
.subscribe-card-1200__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.subscribe-card-1200__body { padding: 40px 48px; display: flex; flex-direction: column; justify-content: center; box-sizing: border-box; }
.subscribe-form__row { display: flex; align-items: flex-end; gap: 12px; margin-bottom: 16px; }
@media (max-width: 1220px) { .subscribe-card-1200 { grid-template-columns: 1fr 1fr; width: 100%; } }
`.trim();
}

module.exports = {
  ACTIVE_RELEASE,
  getActiveRelease,
  OFFICIAL_ICON_CARD_ICONS,
  esc,
  compTag,
  tabItemsHtml,
  unorderedListItemsHtml,
  faqItemsHtml,
  sidebarMenuHtml,
  cardProps,
  iconCardProps,
  heroBanner,
  buildContentReference,
  assembleLocalPage,
  downloadImages,
  extractOfficialTagSnippets,
  basePageCss,
};
