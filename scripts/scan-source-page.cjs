#!/usr/bin/env node
'use strict';

/**
 * Source Page Pre-Scanner (Read-only)
 *
 * Extracts objective structural & interactive signals from a frozen source HTML
 * page before component mapping, preventing silent omission of carousels,
 * scroll-synced anchor navs, forms/iframes, or grouped CTAs.
 *
 * Usage:
 *   node scripts/scan-source-page.cjs <path/to/source.html> [--json]
 */

const fs = require('node:fs');
const path = require('node:path');
const L = require('./local-component-library.cjs');

const norm = (s) => String(s || '').replace(/\s+/g, ' ').trim();

function visibleText(el) {
  const clone = el.cloneNode(true);
  for (const n of clone.querySelectorAll('script, style, template, noscript')) n.remove();
  return norm(clone.textContent);
}

function detectSignals(el) {
  const clsAndAttrs = [el, ...el.querySelectorAll('*')]
    .map((n) => `${n.className || ''} ${n.getAttribute('role') || ''} ${n.id || ''}`)
    .join(' ')
    .toLowerCase();

  const anchors = [...el.querySelectorAll('a[href]')];
  const hashAnchors = anchors
    .map((a) => ({ label: norm(a.textContent), href: a.getAttribute('href') }))
    .filter((a) => /^#[\w-]+/.test(a.href || '') && a.label);
  const uniqueHashTargets = new Set(hashAnchors.map((a) => a.href));

  const hasCarouselClass = /\b(swiper|carousel|slider|slick|splide|glide|flickity)\b/.test(clsAndAttrs);
  const hasPagination = /\b(pagination|swiper-pagination|slick-dots|carousel-dots)\b/.test(clsAndAttrs)
    || el.querySelectorAll('[class*="dot"], [class*="pagination"] button, [class*="pagination"] span').length >= 2;
  const hasCarouselNav = /\b(swiper-button-next|swiper-button-prev|slick-next|carousel-next)\b/.test(clsAndAttrs);
  const hasSecondaryNav = /\b(secondary[_-]?nav|anchor[_-]?nav|sticky[_-]?nav)\b/.test(clsAndAttrs);

  const hasTabRole = el.querySelectorAll('[role="tablist"], [role="tab"]').length > 0
    || /\b(tab-nav|tabs-nav|tab-list|tab-header|tabs_icon|video_tab)\b/.test(clsAndAttrs);

  const hasFaqOrCollapse = el.querySelectorAll('details, summary, [aria-expanded]').length >= 2
    || /\b(accordion|faq|collapse)\b/.test(clsAndAttrs);

  const forms = el.querySelectorAll('form').length;
  const inputs = el.querySelectorAll('input:not([type="hidden"]), select, textarea').length;
  const iframes = [...el.querySelectorAll('iframe')].map((f) => f.getAttribute('src') || '(inline)');
  const videos = el.querySelectorAll('video').length;
  const images = [...el.querySelectorAll('img')].filter((img) => img.getAttribute('src') || img.getAttribute('data-src')).length;

  const signals = [];
  if (hasCarouselClass || (hasPagination && hasCarouselNav)) signals.push('carousel-or-slider');
  if (uniqueHashTargets.size >= 3 || hasSecondaryNav) signals.push('section-anchor-nav');
  if (hasTabRole) signals.push('tabs-or-facets');
  if (hasFaqOrCollapse) signals.push('collapse-or-faq');
  if (forms > 0 || inputs > 0) signals.push('form-controls');
  if (iframes.length > 0) signals.push('embedded-iframe');
  if (videos > 0) signals.push('video-media');

  const textLen = visibleText(el).length;
  const isShortCtaOnly = textLen > 0 && textLen <= 120 && images === 0 && anchors.length + el.querySelectorAll('button').length >= 1 && signals.length === 0;
  if (isShortCtaOnly) signals.push('short-cta-check-grouping');

  return {
    signals,
    counts: {
      images,
      links: anchors.length,
      buttons: el.querySelectorAll('button').length,
      forms,
      inputs,
      iframes: iframes.length,
      videos,
      hashAnchorTargets: uniqueHashTargets.size,
    },
    hashAnchors: uniqueHashTargets.size >= 2 ? hashAnchors.slice(0, 10) : [],
    iframes: iframes.slice(0, 5),
    hasPagination,
    hasCarouselClass,
  };
}

function extractStructuredContent(el) {
  const headings = [...el.querySelectorAll('h1, h2, h3, h4')]
    .map((h) => ({ tag: h.tagName.toLowerCase(), text: norm(h.textContent) }))
    .filter((h) => h.text && h.text.length <= 160);
  const seenHeadings = new Set();
  const uniqueHeadings = [];
  for (const h of headings) {
    if (seenHeadings.has(h.text)) continue;
    seenHeadings.add(h.text);
    uniqueHeadings.push(h);
    if (uniqueHeadings.length >= 24) break;
  }

  // Carousel detection + item count
  const carouselNodes = [...el.querySelectorAll('.swiper, .swiper-wrapper, .slick-slider, .splide, [data-carousel], [class*="carousel"], [class*="slider"]')];
  const slideNodes = [...el.querySelectorAll('.swiper-slide, .slick-slide, .splide__slide, [data-carousel-item], [class*="carousel-item"], [class*="slide-item"]')];
  const navBtnCount = el.querySelectorAll('.swiper-button-next, .swiper-button-prev, .slick-next, .slick-prev, [class*="carousel-next"], [class*="carousel-prev"], [aria-label*="Next" i], [aria-label*="Previous" i]').length;
  const dotCount = el.querySelectorAll('.swiper-pagination-bullet, .slick-dots li, [class*="carousel-dot"], [class*="pagination"] button').length;
  const hasCarousel = carouselNodes.length > 0 || slideNodes.length >= 3 || (navBtnCount >= 2 && dotCount >= 2);
  const carouselMeta = hasCarousel
    ? {
        detectedBy: carouselNodes.length ? 'carousel-container' : slideNodes.length >= 3 ? 'slide-items' : 'nav-and-dots',
        itemCount: slideNodes.length || carouselNodes.reduce((m, c) => Math.max(m, c.children.length), 0),
      }
    : null;

  // FAQ / Accordion Q&A pairs
  const faqItems = [];
  const seenQ = new Set();
  const pushFaq = (q, a) => {
    const question = norm(q);
    const answer = norm(a).slice(0, 800);
    if (!question || question.length < 4 || question.length > 260 || seenQ.has(question)) return;
    seenQ.add(question);
    faqItems.push({ question, answer });
  };
  for (const det of el.querySelectorAll('details')) {
    const sum = det.querySelector('summary');
    if (!sum) continue;
    const clone = det.cloneNode(true);
    const cloneSum = clone.querySelector('summary');
    if (cloneSum) cloneSum.remove();
    pushFaq(sum.textContent, visibleText(clone));
  }
  for (const trigger of el.querySelectorAll('[aria-expanded][aria-controls], button[class*="faq"], button[class*="accordion"], [class*="faq-question"], [class*="accordion-header"]')) {
    const ctrlId = trigger.getAttribute('aria-controls');
    let panel = ctrlId ? el.querySelector(`[id="${ctrlId.replace(/"/g, '\\"')}"]`) : null;
    if (!panel) {
      const next = trigger.nextElementSibling || trigger.parentElement?.nextElementSibling;
      if (next && /answer|content|body|panel|collapse|desc/i.test(`${next.className || ''} ${next.getAttribute('role') || ''}`)) {
        panel = next;
      }
    }
    if (panel) pushFaq(trigger.textContent, visibleText(panel));
  }

  // Tables (spec tables & comparison matrices)
  const tables = [];
  for (const tbl of el.querySelectorAll('table')) {
    const headers = [...tbl.querySelectorAll('thead th, tr:first-child th')].map((th) => norm(th.textContent)).filter(Boolean);
    const allRows = [...tbl.querySelectorAll('tbody tr, tr')];
    const rows = [];
    for (const tr of allRows) {
      const cells = [...tr.querySelectorAll('th, td')].map((c) => norm(c.textContent));
      if (cells.length && cells.some(Boolean)) rows.push(cells);
      if (rows.length >= 40) break;
    }
    if (rows.length) {
      tables.push({ headers: headers.slice(0, 12), rowCount: allRows.length, rows });
    }
    if (tables.length >= 6) break;
  }

  // Repeated card / item blocks
  const cards = [];
  const cardSelector = [
    'article',
    '.swiper-slide',
    '.slick-slide',
    '[class*="card"]',
    '[class*="product-item"]',
    '[class*="grid-item"]',
    '[class*="feature-item"]',
    '[class*="review-item"]',
  ].join(', ');
  const rawCards = [...el.querySelectorAll(cardSelector)].filter((c) => {
    // Skip wrappers that contain nested cards of the same selector
    if (c.querySelector('article, .swiper-slide, .slick-slide')) return false;
    const t = visibleText(c);
    return t.length >= 8 && t.length <= 1200;
  });
  const seenCardKeys = new Set();
  for (const c of rawCards) {
    const titleEl = c.querySelector('h1, h2, h3, h4, h5, [class*="title"], [class*="name"], strong');
    const title = norm(titleEl?.textContent).slice(0, 180);
    const descEl = c.querySelector('p, [class*="desc"], [class*="subtitle"], [class*="summary"], [class*="body"]');
    const subtitle = norm(descEl?.textContent).slice(0, 320);
    const priceEl = c.querySelector('[class*="price"]');
    const price = norm(priceEl?.textContent).slice(0, 60);
    const linkEl = c.querySelector('a[href]');
    const imgEl = c.querySelector('img');
    const imgSrc = imgEl?.getAttribute('data-original') || imgEl?.getAttribute('data-src') || imgEl?.getAttribute('src') || '';
    if (!title && !imgSrc) continue;
    const dedupeKey = `${title}|${imgSrc}`;
    if (seenCardKeys.has(dedupeKey)) continue;
    seenCardKeys.add(dedupeKey);
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

  return {
    headings: uniqueHeadings,
    hasCarousel,
    carouselMeta,
    cards,
    faqItems: faqItems.slice(0, 24),
    tables,
  };
}

function buildStaticPageIr(doc, sourceUrl = '') {
  const container = doc.querySelector('main') || doc.body;
  const rawChildren = [...container.children].filter(
    (el) => !['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'LINK', 'META', 'HEADER', 'FOOTER'].includes(el.tagName)
  );
  const sections = [];
  rawChildren.forEach((sec, idx) => {
    const hidden = sec.hasAttribute('hidden')
      || /display\s*:\s*none/i.test(sec.getAttribute('style') || '')
      || /\b(modal|popup|dialog|drawer|cookie|announcement)\b/i.test(sec.className || '');
    const visText = visibleText(sec);
    if (hidden || visText.length < 10) return;

    const structured = extractStructuredContent(sec);
    const tabs = [...sec.querySelectorAll('[role="tab"], [data-tab], [class*="tab-item"], [class*="nav-item"]')]
      .map((t) => norm(t.textContent))
      .filter(Boolean);
    const imgs = [...sec.querySelectorAll('img')]
      .map((i) => ({
        src: i.getAttribute('data-original') || i.getAttribute('data-src') || i.getAttribute('src') || '',
        alt: (i.getAttribute('alt') || '').trim(),
      }))
      .filter((i) => i.src && !i.src.startsWith('data:'));
    const actions = [...sec.querySelectorAll('a[href], button')]
      .map((a) => ({
        tag: a.tagName.toLowerCase(),
        text: norm(a.textContent),
        href: a.getAttribute('href') || '',
      }))
      .filter((a) => a.text && a.text.length <= 60)
      .slice(0, 24);

    sections.push({
      index: sections.length + 1,
      id: sec.id || `section-${idx + 1}`,
      headings: structured.headings.map((h) => h.text),
      headingNodes: structured.headings,
      tabs: [...new Set(tabs)].slice(0, 16),
      visibleText: visText.slice(0, 6000),
      hasCarousel: structured.hasCarousel,
      carouselMeta: structured.carouselMeta,
      cards: structured.cards,
      faqItems: structured.faqItems,
      tables: structured.tables,
      imageCount: imgs.length,
      images: imgs.slice(0, 24),
      actions,
      hasForm: !!sec.querySelector('form, input[type="email"], textarea'),
      hasVideo: !!sec.querySelector('video, iframe[src*="youtube"], iframe[src*="vimeo"]'),
    });
  });

  return {
    schemaVersion: 'fs-page-ir/1.2.0',
    extractionMode: 'static-dom',
    source: sourceUrl || '(local-html)',
    capturedAt: new Date().toISOString().slice(0, 10),
    sections,
  };
}

function scanSourceHtml(html, filePath = '') {
  const JSDOM = L.domAPI();
  const dom = new JSDOM(html);
  try {
    const doc = dom.window.document;
    const container = doc.querySelector('main') || doc.body;
    const rawChildren = [...container.children].filter(
      (el) => !['SCRIPT', 'STYLE', 'TEMPLATE', 'NOSCRIPT', 'LINK', 'META'].includes(el.tagName)
    );

    const sections = rawChildren.map((el, idx) => {
      const hidden = el.hasAttribute('hidden')
        || /display\s*:\s*none/i.test(el.getAttribute('style') || '')
        || /\b(modal|popup|dialog|drawer)\b/i.test(el.className || '');
      const headingEl = el.querySelector('h1, h2, h3');
      const heading = norm(headingEl?.textContent) || visibleText(el).slice(0, 72) || '(no text)';
      const info = detectSignals(el);
      const structured = extractStructuredContent(el);
      return {
        index: idx + 1,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        hiddenOrOverlay: hidden,
        heading,
        subHeadings: structured.headings.map((h) => h.text).slice(0, 8),
        hasCarousel: structured.hasCarousel || info.signals.includes('carousel-or-slider'),
        carouselMeta: structured.carouselMeta,
        cardCount: structured.cards.length,
        faqCount: structured.faqItems.length,
        tableCount: structured.tables.length,
        ...info,
      };
    });

    return {
      source: filePath ? path.relative(L.ROOT, path.resolve(filePath)) : '(inline)',
      totalBlocks: sections.length,
      visibleBlocks: sections.filter((s) => !s.hiddenOrOverlay).length,
      sections,
    };
  } finally {
    dom.window.close();
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) {
    console.error('Usage: node scripts/scan-source-page.cjs <path/to/source.html> [--json]');
    process.exit(1);
  }
  const abs = path.resolve(file);
  const result = scanSourceHtml(fs.readFileSync(abs, 'utf8'), abs);
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Source: ${result.source} (${result.visibleBlocks} visible / ${result.totalBlocks} total blocks)\n`);
    for (const s of result.sections) {
      const flag = s.hiddenOrOverlay ? '[overlay/hidden]' : '[visible]';
      const sig = s.signals.length ? ` | signals: ${s.signals.join(', ')}` : '';
      console.log(
        `${String(s.index).padStart(2, '0')}. ${flag} ${s.id ? `#${s.id} ` : ''}"${s.heading.slice(0, 60)}" (img:${s.counts.images}, a:${s.counts.links}, btn:${s.counts.buttons}${sig})`
      );
    }
  }
}

module.exports = { scanSourceHtml, extractStructuredContent, buildStaticPageIr };
