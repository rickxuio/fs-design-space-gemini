'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const H = require(path.join(ROOT, 'scripts/page-helpers.cjs'));

const SLUG = 'fs-homepage';
const REF_REL = `reference-inputs/${SLUG}/content.json`;
const RELEASE = H.getActiveRelease();

const rawData = JSON.parse(
  fs.readFileSync(path.join(ROOT, `reference-inputs/${SLUG}/source-data.json`), 'utf8')
);
const assetMap = JSON.parse(
  fs.readFileSync(path.join(ROOT, `reference-inputs/${SLUG}/assets-map.json`), 'utf8')
);

function localAsset(url) {
  if (!url) return '';
  const clean = url.replace(/[);,\s]+$/, '');
  if (assetMap[clean]) return assetMap[clean];
  throw new Error('Missing local asset for: ' + clean);
}

function absHref(href) {
  if (!href || href.startsWith('javascript')) return '#more-info';
  if (/^https?:\/\//i.test(href)) return href;
  return 'https://www.fs.com' + (href.startsWith('/') ? href : '/' + href);
}

const heroSlideHrefs = [
  'https://www.fs.com/shipping_delivery.html',
  'https://www.fs.com/specials/accelerated-ethernet-switching-for-ai-and-cloud-184.html',
  'https://www.fs.com/solutions/1.6t-optical-interconnect-for-infiniband-b300-ai-clusters-s0101.html',
  'https://www.fs.com/solutions/building-400g-dci-networks-with-d7000-series-10077.html',
  'https://www.fs.com/solutions/enterprise-buildings-and-campus-cabling-solution-s10176.html',
  'https://www.fs.com/specials/ampcon-campus-platform-193.html',
  'https://www.fs.com/solutions/ai-cluster-cabling-solution-for-h100-h200-b200-b300-s10183.html',
];

const HERO_SLIDES = rawData.heroSlides.map((s, i) => {
  const m = (s.bgStyle || '').match(/https:\/\/resource\.fs\.com\/[^"\\);,\s]+/);
  return {
    title: s.title,
    subtitle: s.subtitle,
    ctaLabel: 'Learn more',
    href: heroSlideHrefs[i] || 'https://www.fs.com/',
    hasVideoBtn: i === 0,
    videoHref: 'https://www.fs.com/shipping_delivery.html',
    bg: localAsset(m ? m[0] : ''),
  };
});

const PRODUCT_TABS = rawData.productTabs.map((t, ti) => ({
  id: `prod-tab-${ti}`,
  title: t.tabLabel,
  icon: localAsset(t.tabIcon),
  cards: t.cards.map((c, ci) => ({
    id: `cat-${ti}-${ci}`,
    title: c.title,
    href: absHref(c.href),
    img: localAsset(c.imgSrc),
    subLinks: (c.subLinks || []).map((sl) => ({
      text: sl.text,
      href: absHref(sl.href),
    })),
  })),
}));

const secByIdx = Object.fromEntries(rawData.sections2to8.map((s) => [s.sectionIndex, s]));

const NEW_PRODUCTS = secByIdx[2].items.map((item, i) => ({
  id: `new-prod-${i}`,
  title: item.title,
  desc: item.description,
  href: absHref(item.href),
  img: localAsset(item.imageUrl),
}));

const RECOMMENDED = secByIdx[3].items.map((item, i) => ({
  id: `rec-prod-${i}`,
  title: item.title,
  desc: item.description,
  href: absHref(item.href),
  img: localAsset(item.imageUrl),
}));

const PICOS_PLATFORM = secByIdx[4].items.map((item, i) => ({
  id: `picos-plat-${i}`,
  title: item.title,
  desc: item.description,
  href: absHref(item.href),
  img: localAsset(item.imageUrl),
}));

const FEATURE_SOLUTIONS = secByIdx[5].items.map((item, i) => ({
  id: `feat-sol-${i}`,
  title: item.title,
  desc: item.description,
  href: absHref(item.href),
  img: localAsset(item.imageUrl),
}));

const FS_CERTIFIED = secByIdx[6].items.map((item, i) => ({
  id: `home-cert-${i}`,
  title: item.title,
  desc: item.description,
  href: absHref(item.href),
  icon: localAsset(item.iconUrl),
}));

const CASE_STUDIES = secByIdx[7].items.map((item, i) => ({
  id: `home-case-${i}`,
  title: item.title,
  location: item.location,
  tags: item.tags || [],
  href: absHref(item.href),
  img: localAsset(item.imageUrl),
}));

const MORE_INFO = secByIdx[8].items.map((item, i) => ({
  id: `more-info-${i}`,
  title: item.title,
  desc: item.description,
  href: absHref(item.href),
  icon: localAsset(item.iconUrl),
}));

// 1. Write reference-inputs/fs-homepage/content.json
const refObjects = [
  ...PRODUCT_TABS.flatMap((t) => t.cards.map((c) => ({ objectId: c.id, title: c.title }))),
  ...NEW_PRODUCTS.map((p) => ({ objectId: p.id, title: p.title, description: p.desc })),
  ...RECOMMENDED.map((p) => ({ objectId: p.id, title: p.title, description: p.desc })),
  ...PICOS_PLATFORM.map((p) => ({ objectId: p.id, title: p.title, description: p.desc })),
  ...FEATURE_SOLUTIONS.map((p) => ({ objectId: p.id, title: p.title, description: p.desc })),
  ...FS_CERTIFIED.map((c) => ({ objectId: c.id, title: c.title, description: c.desc })),
  ...CASE_STUDIES.map((c) => ({ objectId: c.id, title: c.title, category: c.location })),
  ...MORE_INFO.map((m) => ({ objectId: m.id, title: m.title, description: m.desc })),
];

const refPath = path.join(ROOT, REF_REL);
fs.mkdirSync(path.dirname(refPath), { recursive: true });
fs.writeFileSync(
  refPath,
  JSON.stringify(
    {
      kind: 'original-page-content-reference',
      source: 'https://www.fs.com/',
      capturedAt: '2026-11-22',
      modules: [{ id: 'main', items: refObjects }],
    },
    null,
    2
  ) + '\n',
  'utf8'
);

// 2. Build Section 1: 8-Tab Product Directory (library-tab/product + 1 visible library-carousel/external-cards dynamically switched across all 8 tabs)
const productTabItemsHtml = PRODUCT_TABS.map((t, i) => {
  const active = i === 0 ? ' ds-tab__item--active' : '';
  const indicator = i === 0 ? '<div class="ds-tab__indicator"></div>' : '';
  return `<div class="ds-tab__item${active}" data-tab-item=""><div class="ds-tab__item-icon"><img src="${H.esc(t.icon)}" alt="${H.esc(t.title)}"></div><div class="ds-tab__item-inner"><span class="ds-tab__item-text">${H.esc(t.title)}</span>${indicator}</div></div>`;
}).join('');

const productTabPanelsHtml = `<div id="home-cat-panel-0" class="home-cat-panel">${H.compTag('library-carousel', 'external-cards', {
  columns: 4,
  accessibleLabel: 'Product categories',
  items: PRODUCT_TABS[0].cards.map((c) => ({
    component: 'library-card',
    fragment: 'spliced-vertical-single-event',
    props: {
      image: `<img src="${H.esc(c.img)}" alt="${H.esc(c.title)}">`,
      title: c.title,
      sourceAbsent: {
        reference: REF_REL,
        objectId: c.id,
        slots: ['category', 'description', 'link'],
      },
    },
  })),
})}</div>`;

// 3. Build Section 2 & 3: New Products & Recommended (4-col library-carousel/external-cards on white section with #FAFAFA cards)
function buildProductCarousel(items, label) {
  return H.compTag('library-carousel', 'external-cards', {
    columns: 4,
    accessibleLabel: label,
    items: items.map((p) => ({
      component: 'library-card',
      fragment: 'spliced-vertical-single-event',
      props: {
        image: `<img src="${H.esc(p.img)}" alt="${H.esc(p.title)}">`,
        title: p.title,
        description: `<p>${H.esc(p.desc)}</p>`,
        sourceAbsent: {
          reference: REF_REL,
          objectId: p.id,
          slots: ['category', 'link'],
        },
      },
    })),
  });
}

// 4. Build Section 4 & 5: PicOS Software Platform & Feature Solutions (4-col cards wrapped in full-card links, #F2F2F2 subtle border)
function buildFourColBorderedCards(items) {
  return items
    .map(
      (item) => `<a class="card-full-link home-soft-card" href="${H.esc(item.href)}" target="_blank" rel="noopener">
      ${H.compTag('library-card', 'spliced-vertical-single-event', {
        image: `<img src="${H.esc(item.img)}" alt="${H.esc(item.title)}">`,
        title: item.title,
        description: `<p>${H.esc(item.desc)}</p>`,
        sourceAbsent: {
          reference: REF_REL,
          objectId: item.id,
          slots: ['category', 'link'],
        },
      })}
    </a>`
    )
    .join('\n');
}

// 5. Build Section 6: FS Certified (3x2 library-icon-card/center-single-event with official SVGs + titleHref)
const certifiedHtml = FS_CERTIFIED.map((c) =>
  H.compTag('library-icon-card', 'center-single-event', {
    icon: c.icon,
    title: c.title,
    titleHref: c.href,
    description: c.desc,
    sourceAbsent: {
      reference: REF_REL,
      objectId: c.id,
      slots: ['bullets', 'link'],
    },
  })
).join('\n');

// 6. Build Section 7: Case Studies (3-col cards with category + industry tags, #F2F2F2 subtle border)
const caseStudiesHtml = CASE_STUDIES.map(
  (c) => `<a class="card-full-link home-soft-card" data-extend-target="${c.id}" href="${H.esc(c.href)}" target="_blank" rel="noopener">
    ${H.compTag('library-card', 'spliced-vertical-single-event', {
      image: `<img src="${H.esc(c.img)}" alt="${H.esc(c.title)}">`,
      category: c.location,
      title: c.title,
      sourceAbsent: {
        reference: REF_REL,
        objectId: c.id,
        slots: ['description', 'link'],
      },
    })}
  </a>`
).join('\n');

// 7. Build Section 8: Get more Information (3-col library-icon-card/left-single-event with official SVGs + titleHref)
const moreInfoHtml = MORE_INFO.map((m) =>
  H.compTag('library-icon-card', 'left-single-event', {
    icon: m.icon,
    title: m.title,
    titleHref: m.href,
    description: m.desc,
    sourceAbsent: {
      reference: REF_REL,
      objectId: m.id,
      slots: ['bullets', 'link'],
    },
  })
).join('\n');

const heroDotsHtml = HERO_SLIDES.map(
  (_, i) =>
    `<button type="button" class="testimonial-dot${i === 0 ? ' is-active' : ''}" data-hero-dot="${i}" aria-label="Slide ${i + 1}"></button>`
).join('');

const pageCss = `${H.basePageCss()}
.hero-surface { min-height: 420px; display: flex; align-items: center; }
.hero-surface__scrim { background: rgba(0, 0, 0, 0.22); }
.hero-surface__inner { width: 100%; max-width: 1200px; margin: 0 auto; padding: 0 44px; box-sizing: border-box; }
.hero-nav-control { position: absolute; top: 50%; transform: translateY(-50%); width: 56px; height: 56px; z-index: 3; }
.hero-nav-control--prev { left: max(12px, calc((100% - 1200px) / 2 - 108px)); }
.hero-nav-control--next { right: max(12px, calc((100% - 1200px) / 2 - 108px)); }
@media (max-width: 1280px) {
  .hero-surface__inner { padding: 0 76px; }
  .hero-nav-control--prev { left: 16px; }
  .hero-nav-control--next { right: 16px; }
}
.hero-dots-bar { position: absolute; left: 0; right: 0; bottom: 16px; z-index: 3; display: flex; justify-content: center; align-items: center; gap: 10px; }
.hero-dots-bar .testimonial-dot { position: relative; overflow: hidden; background: rgba(255, 255, 255, 0.5); opacity: 1; }
.hero-dots-bar .testimonial-dot.is-active { width: 40px; background: rgba(255, 255, 255, 0.4); opacity: 1; }
.hero-dots-bar .testimonial-dot.is-active::after { content: ''; position: absolute; inset: 0; background: #FFFFFF; border-radius: inherit; transform: translateX(-100%); animation: homeHeroProgress 3s linear forwards; }
.hero-surface:hover .hero-dots-bar .testimonial-dot.is-active::after { animation-play-state: paused; }
@keyframes homeHeroProgress { from { transform: translateX(-100%); } to { transform: translateX(0); } }
.hero-watch-btn { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 42px; padding: 0 24px; border-radius: 4px; border: 1px solid #FFFFFF; background: rgba(255, 255, 255, 0.1); color: #FFFFFF; font-family: inherit; font-size: 14px; line-height: 22px; font-weight: 600; text-decoration: none; cursor: pointer; box-sizing: border-box; transition: background-color 0.2s ease; }
.hero-watch-btn:hover { background: rgba(255, 255, 255, 0.2); }
.hero-watch-btn__play { display: inline-flex; align-items: center; justify-content: center; width: 12px; height: 12px; font-size: 10px; line-height: 1; }
.home-tabs-bar { display: flex; justify-content: center; margin-bottom: 24px; }
.home-sublinks { margin: 12px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.home-sublink { color: #707070; font-size: 12px; line-height: 20px; font-weight: 400; text-decoration: none; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.15s ease; }
.home-sublink:hover { color: #19191A; text-decoration: underline; }
.home-title-arrow { width: 12px; height: 12px; margin-left: 3px; flex-shrink: 0; display: inline-block; vertical-align: middle; }
.case-tags-row { margin-top: 12px; display: flex; align-items: center; flex-wrap: nowrap; gap: 0; color: #707070; font-size: 12px; line-height: 20px; white-space: nowrap; }
.case-tags-divider { display: inline-block; width: 1px; height: 10px; background: #E5E5E5; margin: 0 8px; flex-shrink: 0; }
.testimonial-dot { appearance: none; border: 0; padding: 0; flex: 0 0 auto; width: 8px; height: 8px; border-radius: 4px; background: #707070; opacity: 0.4; cursor: pointer; transition: width 0.2s ease, opacity 0.2s ease; }
.testimonial-dot.is-active { width: 20px; opacity: 1; }
`;

const pageSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FS | AI Infrastructure, Data Center, Enterprise Networking and Software Solutions</title>
  <style>${pageCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}

  <main>
    <section id="hero" class="hero-surface ds-carousel" aria-label="Featured Highlights">
      <img id="hero-bg-img" class="hero-surface__bg" src="${H.esc(HERO_SLIDES[0].bg)}" alt="${H.esc(HERO_SLIDES[0].title)}">
      <div class="hero-surface__scrim"></div>
      <div class="hero-surface__inner">
        ${H.compTag('library-banner', 'hero-responsive', {
          title: HERO_SLIDES[0].title,
          description: HERO_SLIDES[0].subtitle,
          actionLabel: HERO_SLIDES[0].ctaLabel,
          actionCallback: 'onHeroLearnMore',
          surface: 'image',
        })}
      </div>
      <div class="hero-nav-control hero-nav-control--prev ds-carousel__controls">
        ${H.compTag('library-carousel', 'navigation-solid-xl-left', {
          accessibleLabel: 'Previous hero slide',
          actionCallback: 'onHeroPrev',
        })}
      </div>
      <div class="hero-nav-control hero-nav-control--next ds-carousel__controls">
        ${H.compTag('library-carousel', 'navigation-solid-xl-right', {
          accessibleLabel: 'Next hero slide',
          actionCallback: 'onHeroNext',
        })}
      </div>
      <div class="hero-dots-bar" role="tablist" aria-label="Hero slides">
        ${heroDotsHtml}
      </div>
    </section>

    <section id="product-directory" class="page-section">
      <div class="container">
        <div class="home-tabs-bar">
          ${H.compTag('library-tab', 'product', {
            items: productTabItemsHtml,
          })}
        </div>
        ${productTabPanelsHtml}
      </div>
    </section>

    <section id="new-products" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">New Products</h2>
        </div>
        ${buildProductCarousel(NEW_PRODUCTS, 'New Products')}
      </div>
    </section>

    <section id="recommended" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Recommended</h2>
        </div>
        ${buildProductCarousel(RECOMMENDED, 'Recommended Products')}
      </div>
    </section>

    <section id="picos-platform" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">PicOS Software Platform</h2>
        </div>
        <div class="grid grid--4">
          ${buildFourColBorderedCards(PICOS_PLATFORM)}
        </div>
      </div>
    </section>

    <section id="feature-solutions" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Feature Solutions</h2>
        </div>
        <div class="grid grid--4">
          ${buildFourColBorderedCards(FEATURE_SOLUTIONS)}
        </div>
      </div>
    </section>

    <section id="fs-certified" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">FS Certified</h2>
        </div>
        <div class="grid grid--3">
          ${certifiedHtml}
        </div>
      </div>
    </section>

    <section id="case-studies" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Case Studies</h2>
        </div>
        <div class="grid grid--3">
          ${caseStudiesHtml}
        </div>
      </div>
    </section>

    <section id="more-info" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Get more Information</h2>
        </div>
        <div class="grid grid--3">
          ${moreInfoHtml}
        </div>
      </div>
    </section>
  </main>

  ${H.compTag('library-navigation', 'footer', {})}

  <script>
    (function () {
      var heroSlides = ${JSON.stringify(HERO_SLIDES)};
      var currentSlide = 0;
      var bgImg = document.getElementById('hero-bg-img');
      var titleEl = document.querySelector('#hero .ds-banner__title');
      var descEl = document.querySelector('#hero .ds-banner__desc');
      var watchBtn = document.getElementById('hero-watch-video-btn');
      var heroActionsEl = document.querySelector('#hero .ds-banner__actions');
      var prevHeroBtn = document.querySelector('[data-library-event-actioncallback="onHeroPrev"]');
      var nextHeroBtn = document.querySelector('[data-library-event-actioncallback="onHeroNext"]');
      var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));

      // 0. Hero button gap (24px) & 56px banner arrows matching live fs.com
      if (heroActionsEl) heroActionsEl.style.gap = '24px';
      [prevHeroBtn, nextHeroBtn].forEach(function (btn) {
        if (!btn) return;
        btn.style.width = '56px';
        btn.style.height = '56px';
      });

      // 1. Product Directory 8 Tabs: 64x64 dual-tone SVG (no grayscale filter), 13px/20px labels, 12px gap
      document.querySelectorAll('#product-directory .ds-tab__item-icon').forEach(function (box) {
        box.style.width = '64px';
        box.style.height = '64px';
        var img = box.querySelector('img');
        if (img) {
          img.style.width = '64px';
          img.style.height = '64px';
          img.style.filter = 'none';
        }
      });
      document.querySelectorAll('#product-directory .ds-tab__item').forEach(function (item) {
        item.style.paddingTop = '16px';
        item.style.paddingBottom = '0';
      });
      document.querySelectorAll('#product-directory .ds-tab__item-inner').forEach(function (inner) {
        inner.style.paddingTop = '12px';
        inner.style.gap = '14px';
      });
      document.querySelectorAll('#product-directory .ds-tab__item-text').forEach(function (el) {
        el.style.fontSize = '13px';
        el.style.lineHeight = '20px';
        el.style.textAlign = 'center';
      });

      // 2. Product Directory Category Cards: 145px #FAFAFA top image box + 1px solid #F2F2F2 lower body border (exact live fs.com)
      document.querySelectorAll('#product-directory [data-library-component="library-card"]').forEach(function (card) {
        var box = card.querySelector('.ds-card__image');
        var body = card.querySelector('.ds-card__body');
        if (box) {
          box.style.background = '#FAFAFA';
          box.style.height = '145px';
          box.style.aspectRatio = 'auto';
          box.style.padding = '8px 24px';
          box.style.boxSizing = 'border-box';
          var img = box.querySelector('img');
          if (img) {
            img.style.objectFit = 'contain';
            img.style.mixBlendMode = 'multiply';
          }
        }
        if (body) {
          body.style.border = '1px solid #F2F2F2';
          body.style.borderTop = 'none';
          body.style.borderBottomLeftRadius = '8px';
          body.style.borderBottomRightRadius = '8px';
        }
      });

      // 3. New Products & Recommended: white section with #FAFAFA borderless gray cards, 180px image, 12px/20px desc (exact live fs.com)
      document.querySelectorAll('#new-products [data-library-component="library-card"], #recommended [data-library-component="library-card"]').forEach(function (card) {
        card.style.background = '#FAFAFA';
        var box = card.querySelector('.ds-card__image');
        var body = card.querySelector('.ds-card__body');
        var desc = card.querySelector('.ds-card__desc');
        if (box) {
          box.style.background = '#FAFAFA';
          box.style.height = '200px';
          box.style.aspectRatio = 'auto';
          box.style.padding = '20px 28px 0';
          box.style.boxSizing = 'border-box';
          var img = box.querySelector('img');
          if (img) {
            img.style.objectFit = 'contain';
            img.style.mixBlendMode = 'multiply';
          }
        }
        if (body) {
          body.style.background = '#FAFAFA';
          body.style.padding = '16px 20px 20px';
        }
        if (desc) {
          desc.style.fontSize = '12px';
          desc.style.lineHeight = '20px';
        }
      });

      // 4. PicOS Software Platform, Feature Solutions & Case Studies: exact 1px solid #F2F2F2 light border & 12px/20px desc
      document.querySelectorAll('.home-soft-card [data-library-component="library-card"]').forEach(function (card) {
        var body = card.querySelector('.ds-card__body');
        var desc = card.querySelector('.ds-card__desc');
        if (body) {
          body.style.border = '1px solid #F2F2F2';
          body.style.borderTop = 'none';
          body.style.borderBottomLeftRadius = '8px';
          body.style.borderBottomRightRadius = '8px';
        }
        if (desc) {
          desc.style.fontSize = '12px';
          desc.style.lineHeight = '20px';
        }
      });

      // 4.5. Live fs.com card hover behavior: pointer cursor + title underline + lift shadow across New Products, Recommended, PicOS, Feature Solutions & Case Studies
      var newProdHrefs = ${JSON.stringify(NEW_PRODUCTS.map((p) => p.href))};
      var recProdHrefs = ${JSON.stringify(RECOMMENDED.map((p) => p.href))};
      function bindProductCardClick(selector, hrefs) {
        document.querySelectorAll(selector).forEach(function (card, idx) {
          card.style.cursor = 'pointer';
          if (hrefs[idx]) {
            card.addEventListener('click', function () {
              window.open(hrefs[idx], '_blank', 'noopener');
            });
          }
        });
      }
      bindProductCardClick('#new-products [data-library-component="library-card"]', newProdHrefs);
      bindProductCardClick('#recommended [data-library-component="library-card"]', recProdHrefs);

      document.querySelectorAll('#new-products [data-library-component="library-card"], #recommended [data-library-component="library-card"], #picos-platform [data-library-component="library-card"], #feature-solutions [data-library-component="library-card"], #case-studies [data-library-component="library-card"]').forEach(function (card) {
        card.style.cursor = 'pointer';
        card.style.transition = 'box-shadow 0.2s ease';
        var titleNode = card.querySelector('.ds-card__title');
        card.addEventListener('mouseenter', function () {
          card.style.boxShadow = '0 15px 15px -10px rgba(0, 0, 0, 0.15)';
          if (titleNode) titleNode.style.textDecoration = 'underline';
        });
        card.addEventListener('mouseleave', function () {
          card.style.boxShadow = '';
          if (titleNode) titleNode.style.textDecoration = '';
        });
      });

      // 5. FS Certified & Get more Information: exact 64x64 / 36x36 icons & 12px/20px desc on #FAFAFA cards
      document.querySelectorAll('#fs-certified [data-library-component="library-icon-card"]').forEach(function (card) {
        card.style.background = '#FAFAFA';
        var icon = card.querySelector('.ds-icon-card__icon');
        var desc = card.querySelector('.ds-icon-card__desc');
        if (icon) { icon.style.width = '64px'; icon.style.height = '64px'; }
        if (desc) { desc.style.fontSize = '12px'; desc.style.lineHeight = '20px'; }
      });
      document.querySelectorAll('#more-info [data-library-component="library-icon-card"]').forEach(function (card) {
        card.style.background = '#FAFAFA';
        card.style.padding = '32px';
        var icon = card.querySelector('.ds-icon-card__icon');
        var desc = card.querySelector('.ds-icon-card__desc');
        if (icon) { icon.style.width = '36px'; icon.style.height = '36px'; }
        if (desc) { desc.style.fontSize = '12px'; desc.style.lineHeight = '20px'; }
      });

      function setHeroSlide(idx) {
        currentSlide = (idx + heroSlides.length) % heroSlides.length;
        var s = heroSlides[currentSlide];
        if (!s) return;
        if (bgImg) { bgImg.src = s.bg; bgImg.alt = s.title; }
        if (titleEl) titleEl.textContent = s.title;
        if (descEl) descEl.textContent = s.subtitle;
        if (watchBtn) watchBtn.style.display = s.hasVideoBtn ? 'inline-flex' : 'none';
        dots.forEach(function (d, i) {
          d.classList.remove('is-active');
          if (i === currentSlide) {
            void d.offsetWidth;
            d.classList.add('is-active');
          }
        });
      }

      var heroEl = document.getElementById('hero');
      var heroHovered = false;
      if (heroEl) {
        heroEl.addEventListener('mouseenter', function () { heroHovered = true; });
        heroEl.addEventListener('mouseleave', function () { heroHovered = false; });
      }
      setInterval(function () {
        if (!heroHovered) setHeroSlide(currentSlide + 1);
      }, 3000);

      if (prevHeroBtn) {
        prevHeroBtn.addEventListener('click', function () {
          setHeroSlide(currentSlide - 1);
        });
      }
      if (nextHeroBtn) {
        nextHeroBtn.addEventListener('click', function () {
          setHeroSlide(currentSlide + 1);
        });
      }

      dots.forEach(function (dot, idx) {
        dot.addEventListener('click', function () {
          setHeroSlide(idx);
        });
      });

      window.onHeroLearnMore = function () {
        var s = heroSlides[currentSlide];
        if (s && s.href) window.open(s.href, '_blank', 'noopener');
      };

      var productTabsData = ${JSON.stringify(PRODUCT_TABS)};
      var tabItems = Array.prototype.slice.call(document.querySelectorAll('#product-directory .ds-tab__item'));
      var catPanel = document.getElementById('home-cat-panel-0');
      var catCards = catPanel ? Array.prototype.slice.call(catPanel.querySelectorAll('[data-library-component="library-card"]')) : [];
      var catViewport = catPanel ? catPanel.querySelector('[data-rail-viewport]') : null;

      function activateProductTab(idx) {
        tabItems.forEach(function (t, i) {
          var active = i === idx;
          t.classList.toggle('ds-tab__item--active', active);
          var inner = t.querySelector('.ds-tab__item-inner');
          var ind = t.querySelector('.ds-tab__indicator');
          if (active && !ind && inner) {
            var div = document.createElement('div');
            div.className = 'ds-tab__indicator';
            inner.appendChild(div);
          } else if (!active && ind) {
            ind.remove();
          }
        });
        var tabData = productTabsData[idx];
        if (!tabData) return;
        catCards.forEach(function (card, ci) {
          var item = tabData.cards[ci] || tabData.cards[0];
          if (!item) return;
          var img = card.querySelector('.ds-card__image img');
          var title = card.querySelector('.ds-card__title');
          var subList = card.querySelector('.home-sublinks');
          if (img) { img.src = item.img; img.alt = item.title; }
          if (title) title.textContent = item.title;
          if (subList) {
            subList.innerHTML = item.subLinks.map(function (sl) {
              return '<li><a class="home-sublink" href="' + sl.href + '" target="_blank" rel="noopener">' + sl.text + '</a></li>';
            }).join('');
          }
        });
        if (catViewport) catViewport.scrollTo({ left: 0, behavior: 'instant' });
      }

      tabItems.forEach(function (tab, idx) {
        tab.addEventListener('click', function () { activateProductTab(idx); });
        tab.addEventListener('mouseenter', function () { activateProductTab(idx); });
      });
    })();
  </script>
</body>
</html>
`;

const outRel = 'pages/fs-homepage-pc.html';
const rawHtml = H.assembleLocalPage(pageSource, outRel, { write: false });
const { JSDOM } = require(path.join(ROOT, 'design-system/node_modules/jsdom'));
const dom = new JSDOM(rawHtml);
const doc = dom.window.document;

// 0. Inject Watch video button into Hero Banner actions (Slide 0)
const heroActions = doc.querySelector('#hero .ds-banner__actions');
if (heroActions) {
  const watchLink = doc.createElement('a');
  watchLink.id = 'hero-watch-video-btn';
  watchLink.className = 'hero-watch-btn';
  watchLink.setAttribute('data-fs-extend', 'hero-watch-video-action');
  watchLink.href = HERO_SLIDES[0].videoHref;
  watchLink.target = '_blank';
  watchLink.rel = 'noopener';
  watchLink.innerHTML = '<span>Watch video</span><span class="hero-watch-btn__play" aria-hidden="true">&#9654;</span>';
  heroActions.appendChild(watchLink);
}

// 1. Inject sub-category links into all 8 tabs' category cards
PRODUCT_TABS.forEach((t, ti) => {
  const panel = doc.getElementById(`home-cat-panel-${ti}`);
  if (!panel) return;
  const cards = panel.querySelectorAll('[data-library-component="library-card"]');
  t.cards.forEach((c, ci) => {
    const card = cards[ci];
    const body = card && card.querySelector('.ds-card__body');
    if (body && c.subLinks.length) {
      const ul = doc.createElement('ul');
      ul.className = 'home-sublinks';
      ul.setAttribute('data-fs-extend', 'category-sublinks');
      ul.innerHTML = c.subLinks
        .map(
          (sl) =>
            `<li><a class="home-sublink" href="${H.esc(sl.href)}" target="_blank" rel="noopener">${H.esc(sl.text)}</a></li>`
        )
        .join('');
      body.appendChild(ul);
    }
  });
});

// 2. Inject trailing '>' arrow into FS Certified & Get more Information icon-card titles
const arrowSrc = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons/icon-text-button-arrow-right-regular.svg`;
doc.querySelectorAll('#fs-certified .ds-icon-card__title-slot > a, #more-info .ds-icon-card__title-slot > a').forEach((a) => {
  const arrow = doc.createElement('img');
  arrow.className = 'home-title-arrow';
  arrow.setAttribute('data-fs-extend', 'icon-card-title-arrow');
  arrow.src = arrowSrc;
  arrow.alt = '';
  a.appendChild(arrow);
});

// 3. Inject industry tags into Case Studies cards
CASE_STUDIES.forEach((c) => {
  const host = doc.querySelector(`[data-extend-target="${c.id}"]`);
  const body = host && host.querySelector('.ds-card__body');
  if (body && c.tags.length) {
    const row = doc.createElement('div');
    row.className = 'case-tags-row';
    row.setAttribute('data-fs-extend', 'case-industry-tags');
    row.innerHTML = c.tags
      .map((tag, idx) =>
        idx === 0
          ? `<span>${H.esc(tag)}</span>`
          : `<span class="case-tags-divider" aria-hidden="true"></span><span>${H.esc(tag)}</span>`
      )
      .join('');
    body.appendChild(row);
  }
});

fs.writeFileSync(path.join(ROOT, outRel), dom.serialize(), 'utf8');
dom.window.close();
console.log('Generated:', outRel, 'release:', RELEASE.slice(0, 12));
