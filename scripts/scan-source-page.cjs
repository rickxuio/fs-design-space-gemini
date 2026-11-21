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
      return {
        index: idx + 1,
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        hiddenOrOverlay: hidden,
        heading,
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

module.exports = { scanSourceHtml };
