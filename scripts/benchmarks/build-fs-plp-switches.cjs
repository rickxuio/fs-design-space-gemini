'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const H = require(path.join(ROOT, 'scripts/page-helpers.cjs'));

const SLUG = 'fs-plp-switches';
const REF_REL = `reference-inputs/${SLUG}/content.json`;
const RELEASE = H.getActiveRelease();

const rawData = JSON.parse(
  fs.readFileSync(path.join(ROOT, `reference-inputs/${SLUG}/source-data.json`), 'utf8')
);
const assetMap = JSON.parse(
  fs.readFileSync(path.join(ROOT, `reference-inputs/${SLUG}/assets-map.json`), 'utf8')
);

function localAsset(url) {
  if (!assetMap[url]) throw new Error('Missing local asset for: ' + url);
  return assetMap[url];
}

// 1. Write reference-inputs/fs-plp-switches/content.json
const refObjects = rawData.products.map((p, i) => ({
  objectId: `plp-prod-${i}`,
  title: p.title,
  price: p.price,
  sku: p.sku,
}));
fs.writeFileSync(
  path.join(ROOT, REF_REL),
  JSON.stringify(
    {
      kind: 'original-page-content-reference',
      source: rawData.url,
      capturedAt: '2026-11-22',
      modules: [{ id: 'main', items: refObjects }],
    },
    null,
    2
  ) + '\n',
  'utf8'
);

// Assign realistic subcategory slugs to each of the 12 switches for in-place tab filtering
const subcatKeys = [
  '1-2.5g',
  '10-25g',
  '40-100g',
  '200-400g',
  'license',
  'accessories',
];

function inferSubcat(p) {
  const t = p.title.toLowerCase();
  if (t.includes('40gb') || t.includes('100gb')) return '40-100g';
  if (t.includes('25gb') || t.includes('10gb rj45') || t.includes('20 x 10gb')) return '10-25g';
  return '1-2.5g';
}

// 2. Breadcrumb (library-breadcrumb/default)
const breadcrumbItemsHtml = rawData.breadcrumbs
  .map((b, i) => {
    const isLast = i === rawData.breadcrumbs.length - 1;
    if (isLast) {
      return `<div class="ds-breadcrumb__item"><span class="ds-breadcrumb__current">${H.esc(b.text)}</span></div>`;
    }
    return `<div class="ds-breadcrumb__item"><a href="${H.esc(b.href)}" class="ds-breadcrumb__link">${H.esc(b.text)}</a><span class="ds-breadcrumb__separator" aria-hidden="true">/</span></div>`;
  })
  .join('');

// 3. Sub-category icon navigation strip (6 interactive SPA tiles matching live fs.com .category_nav)
const subCatsHtml = rawData.categoryTabs
  .map(
    (t, idx) => `<button type="button" class="plp-subcat" data-subcat-idx="${idx}" data-subcat-key="${subcatKeys[idx]}" data-subcat-title="${H.esc(t.title)}" aria-pressed="false">
      <span class="plp-subcat__check" aria-hidden="true"><img src="assets/fs-plp-switches/icon-check.svg" alt="" width="10" height="10"></span>
      <div class="plp-subcat__img-wrap">
        <img class="plp-subcat__img" src="${H.esc(localAsset(t.imageUrl))}" alt="${H.esc(t.title)}">
      </div>
      <span class="plp-subcat__title">${H.esc(t.title)}</span>
    </button>`
  )
  .join('\n');

// 4. Filter bar dropdowns (library-select/multi-checkbox for Port Count, PoE, Downlink Ports + More Filters popover + Clear All + Sort library-dropdown/command-text)
function buildCheckboxOptions(list, prefix) {
  return list
    .map(
      (opt, idx) =>
        `<div class="ds-select__option" role="option" aria-selected="false" id="${prefix}-opt-${idx}"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current=""><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">${H.esc(opt)}</span></label></div>`
    )
    .join('');
}

const portCountSelect = H.compTag('library-select', 'multi-checkbox', {
  options: buildCheckboxOptions(rawData.filters.portCount, 'plp-port'),
  changeCallback: 'onPlpFilterChange',
});

const poeSelect = H.compTag('library-select', 'multi-checkbox', {
  options: buildCheckboxOptions(rawData.filters.poe, 'plp-poe'),
  changeCallback: 'onPlpFilterChange',
});

const downlinkSelect = H.compTag('library-select', 'multi-checkbox', {
  options: buildCheckboxOptions(rawData.filters.downlinkPorts, 'plp-downlink'),
  changeCallback: 'onPlpFilterChange',
});

const sortDropdownItems = rawData.filters.sortOptions
  .map((opt) => {
    const val = opt.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="${val}"><span class="ds-dropdown-command__label">${H.esc(opt)}</span></button>`;
  })
  .join('');

const sortDropdown = H.compTag('library-dropdown', 'command-text', {
  triggerLabel: 'Popularity',
  panelIdentity: 'plp-sort-panel',
  items: sortDropdownItems,
  actionCallback: 'onPlpSortChange',
});

// More Filters 2-column popover groups (matching live fs.com 320x428 scrollable popover)
const moreFilterGroups = [
  { name: 'Switch Layer', items: ['L2+ Managed', 'L3 Managed'] },
  { name: 'Network Role', items: ['Access', 'Distribution', 'Core'] },
  { name: 'Management & Automation', items: ['AmpCon', 'WebUI', 'CLI', 'SNMP', 'SSH', 'NETCONF', 'RESTCONF', 'Ansible'] },
  { name: 'Key Features', items: ['EVPN-VXLAN', 'BGP', 'OSPF', 'MLAG', 'QoS', 'VLAN', 'VRF', '802.1X'] },
  { name: 'Stock Status', fullRow: true, items: ['In stock at the U.S. Warehouse'] },
];

const moreFiltersPopoverHtml = moreFilterGroups
  .map(
    (g) => `<div class="plp-more-group">
      <div class="plp-more-group__title">${H.esc(g.name)}</div>
      <div class="plp-more-group__grid${g.fullRow ? ' plp-more-group__grid--full' : ''}">
        ${g.items
          .map(
            (item) => `<button type="button" class="plp-more-opt" data-more-opt="${H.esc(item)}" aria-pressed="false">
              <span class="plp-more-opt__box" aria-hidden="true"></span>
              <span class="plp-more-opt__label">${H.esc(item)}</span>
            </button>`
          )
          .join('')}
      </div>
    </div>`
  )
  .join('');

// 5. 12 Product Cards (4 cols x 3 rows) using native library-card/embedded-product-plp + library-tag/semantic-new|semantic-hot
const productsHtml = rawData.products
  .map((p, idx) => {
    const badgeHtml =
      p.badge === 'New'
        ? '<span class="ds-tag ds-tag--semantic ds-tag--new ds-tag--emphasis" data-tag-source-new="official"><span class="ds-tag__label">New</span></span>'
        : '<span class="ds-tag ds-tag--semantic ds-tag--hot ds-tag--emphasis" data-tag-source-hot="official"><span class="ds-tag__label">Hot</span></span>';

    const subcat = inferSubcat(p);
    const hasUsStock = p.stockLines.some((l) => l.includes('U.S. Warehouse')) ? '1' : '0';
    const layer = p.title.includes('L3') ? 'L3 Managed' : 'L2+ Managed';

    const cardTag = H.compTag('library-card', 'embedded-product-plp', {
      image: `<img class="ds-card__product-image" src="${H.esc(localAsset(p.imageUrl))}" alt="${H.esc(p.title)}">`,
      title: p.title,
      specs: p.specs.join(' | '),
      price: p.price,
      stock: p.stockLines[0] || 'In stock',
      ...(p.stockLines[1] ? { stockSecondary: p.stockLines[1] } : {}),
      soldCount: String(p.sold || '0'),
      reviewCount: String(p.reviews || '0'),
      badge: badgeHtml,
    });

    return `<div class="plp-card-item" data-plp-card="${idx}" data-sku="${H.esc(p.sku)}" data-subcat="${subcat}" data-port="${H.esc(p.portCount)}" data-poe="${H.esc(p.poe)}" data-downlink="${H.esc(p.downlink)}" data-layer="${H.esc(layer)}" data-us-stock="${hasUsStock}" data-specs="${H.esc(p.specs.join('|'))}" data-price="${p.priceNum}" data-sold="${p.soldNum}" data-reviews="${p.reviewNum}" data-is-new="${p.badge === 'New' ? '1' : '0'}">${cardTag}</div>`;
  })
  .join('\n');

const paginationItemsHtml = [
  '<button type="button" class="ds-pagination__btn" data-page-nav="prev" disabled aria-label="Previous page">&lsaquo;</button>',
  '<button type="button" class="ds-pagination__btn ds-pagination__btn--active" data-page-num="1" aria-current="page">1</button>',
  '<button type="button" class="ds-pagination__btn" data-page-num="2">2</button>',
  '<button type="button" class="ds-pagination__btn" data-page-num="3">3</button>',
  '<button type="button" class="ds-pagination__btn" data-page-num="4">4</button>',
  '<button type="button" class="ds-pagination__btn" data-page-num="5">5</button>',
  '<button type="button" class="ds-pagination__btn" data-page-num="6">6</button>',
  '<button type="button" class="ds-pagination__btn" data-page-nav="next" aria-label="Next page">&rsaquo;</button>',
].join('');
const paginationTag = H.compTag('library-pagination', 'default', {
  items: paginationItemsHtml,
  changeCallback: 'onPlpPageChange',
  accessibleLabel: 'Pagination',
});

const pageCss = `${H.basePageCss()}
.plp-section { padding: 40px 0; background: #FFFFFF; }
.plp-breadcrumb-row { margin-bottom: 16px; }
.plp-page-title { margin: 0 0 24px; font-size: 24px; line-height: 32px; font-weight: 600; color: #19191A; text-align: left; }
.plp-subcat-strip { display: flex; align-items: stretch; gap: 16px; padding: 0 0 24px; border-bottom: 1px solid #F2F2F2; margin-bottom: 20px; }
.plp-subcat { appearance: none; position: relative; width: 120px; min-height: 96px; padding: 12px 8px 10px; border: 1px solid transparent; border-radius: 8px; background: transparent; display: flex; flex-direction: column; align-items: center; text-align: center; color: #19191A; gap: 8px; cursor: pointer; font-family: inherit; box-sizing: border-box; transition: background-color 0.15s ease, border-color 0.15s ease; }
.plp-subcat:hover { background: #F6F6F8; }
.plp-subcat.is-active { background: #F6F6F8; border-color: #19191A; }
.plp-subcat__check { display: none; position: absolute; top: 6px; right: 6px; width: 16px; height: 16px; border-radius: 50%; background: #4B4B4D; color: #FFFFFF; font-size: 10px; line-height: 16px; text-align: center; }
.plp-subcat.is-active .plp-subcat__check { display: inline-block; }
.plp-subcat__img-wrap { width: 64px; height: 42px; display: flex; align-items: center; justify-content: center; }
.plp-subcat__img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; mix-blend-mode: multiply; }
.plp-subcat__title { font-size: 12px; line-height: 16px; font-weight: 400; color: #19191A; }
.plp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.plp-filters-left { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.plp-filter-slot { width: auto; min-width: 0; }
.plp-more-wrap { position: relative; }
.plp-more-filters-btn { appearance: none; display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 16px; border-radius: 999px; border: 1px solid #E5E5E5; background: #FFFFFF; color: #19191A; font-family: inherit; font-size: 12px; line-height: 20px; font-weight: 400; cursor: pointer; transition: border-color 0.15s ease; }
.plp-more-filters-btn:hover, .plp-more-filters-btn.is-open, .plp-more-filters-btn.is-checked { border-color: #19191A; }
.plp-more-popover { position: absolute; top: calc(100% + 8px); left: 0; z-index: 30; width: 320px; max-height: 428px; overflow-y: auto; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 8px; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12); padding: 16px; box-sizing: border-box; }
.plp-more-popover[hidden] { display: none; }
.plp-more-group { margin-bottom: 16px; }
.plp-more-group:last-child { margin-bottom: 0; }
.plp-more-group__title { font-size: 12px; line-height: 18px; font-weight: 600; color: #19191A; margin-bottom: 8px; }
.plp-more-group__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; }
.plp-more-group__grid--full { grid-template-columns: 1fr; }
.plp-more-opt { appearance: none; border: 0; background: transparent; padding: 2px 0; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-family: inherit; font-size: 12px; line-height: 18px; color: #707070; text-align: left; }
.plp-more-opt:hover, .plp-more-opt.is-checked { color: #19191A; }
.plp-more-opt__box { width: 14px; height: 14px; border-radius: 2px; border: 1px solid #DEE0E3; background: #FFFFFF; flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; }
.plp-more-opt.is-checked .plp-more-opt__box { background: #19191A; border-color: #19191A; color: #FFFFFF; }
.plp-more-opt.is-checked .plp-more-opt__box::after { content: '\\2713'; font-size: 10px; line-height: 1; }
.plp-clear-all-btn { appearance: none; border: 0; background: transparent; padding: 0 4px; color: #707070; font-family: inherit; font-size: 12px; line-height: 20px; font-style: italic; cursor: pointer; }
.plp-clear-all-btn:hover { color: #19191A; text-decoration: underline; }
.plp-clear-all-btn[hidden] { display: none; }
.plp-filters-right { display: flex; align-items: center; gap: 16px; }
.plp-results-count { font-size: 12px; line-height: 20px; color: #707070; }
.plp-sort-wrap { display: inline-flex; align-items: center; height: 36px; box-sizing: border-box; padding: 0 16px; border-radius: 999px; border: 1px solid #E5E5E5; background: #FFFFFF; transition: border-color 0.15s ease; }
.plp-sort-wrap:hover { border-color: #19191A; }
.plp-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.plp-card-item { display: grid; height: 100%; }
.plp-pagination-wrap { margin-top: 32px; display: flex; justify-content: center; }
.plp-cart-toast { position: fixed; right: 24px; bottom: 24px; z-index: 60; background: #19191A; color: #FFFFFF; padding: 10px 16px; border-radius: 6px; font-size: 13px; line-height: 20px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18); opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.plp-cart-toast.is-show { opacity: 1; }
`;

const pageSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PicOS® Enterprise Switches - FS</title>
  <style>${pageCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}

  <main>
    <section id="plp-catalog" class="page-section plp-section">
      <div class="container">
        <div class="plp-breadcrumb-row">
          ${H.compTag('library-breadcrumb', 'default', { items: breadcrumbItemsHtml })}
        </div>

        <h1 id="plp-page-title" class="plp-page-title">PicOS® Enterprise Switches</h1>

        <nav class="plp-subcat-strip" aria-label="Switch subcategories">
          ${subCatsHtml}
        </nav>

        <div class="plp-toolbar">
          <div class="plp-filters-left">
            <div class="plp-filter-slot plp-filter-slot--port" data-filter-group="port">${portCountSelect}</div>
            <div class="plp-filter-slot plp-filter-slot--poe" data-filter-group="poe">${poeSelect}</div>
            <div class="plp-filter-slot plp-filter-slot--downlink" data-filter-group="downlink">${downlinkSelect}</div>
            <div class="plp-more-wrap">
              <button type="button" id="plp-more-filters-trigger" class="plp-more-filters-btn" aria-haspopup="true" aria-expanded="false" aria-controls="plp-more-filters-popover">
                <span id="plp-more-filters-label">More Filters</span>
                <img src="../fs-components/component-specs/library/releases/${RELEASE}/components/icons/mastergo-library/%E7%B3%BB%E7%BB%9FIcon/65994-008368.svg" alt="" width="14" height="14">
              </button>
              <div id="plp-more-filters-popover" class="plp-more-popover" hidden>
                ${moreFiltersPopoverHtml}
              </div>
            </div>
            <button type="button" id="plp-clear-all-btn" class="plp-clear-all-btn" hidden>Clear All</button>
          </div>
          <div class="plp-filters-right">
            <span id="plp-results-count" class="plp-results-count">69 Results</span>
            <div class="plp-sort-wrap">${sortDropdown}</div>
          </div>
        </div>

        <div id="plp-product-grid" class="grid grid--4 plp-grid">
          ${productsHtml}
        </div>

        <div class="plp-pagination-wrap">
          ${paginationTag}
        </div>
      </div>
    </section>

    <div id="plp-cart-toast" class="plp-cart-toast" role="status" aria-live="polite"></div>
  </main>

  ${H.compTag('library-navigation', 'footer', {})}

  <script>
    (function () {
      var baseTitle = 'PicOS® Enterprise Switches';
      var activeSubcat = null;
      var activeMoreOpts = [];

      // 1. Style pill-shape filter triggers matching live fs.com (32px height, 999px radius, #E5E5E5 -> #19191A active border)
      var placeholders = { port: 'Port Count', poe: 'PoE', downlink: 'Downlink Ports' };
      Object.keys(placeholders).forEach(function (key) {
        var slot = document.querySelector('[data-filter-group="' + key + '"]');
        if (!slot) return;
        var selectEl = slot.querySelector('.ds-select');
        var trigger = slot.querySelector('.ds-select__trigger');
        var val = slot.querySelector('.ds-select__value');
        var panel = slot.querySelector('.ds-select__panel');
        var list = slot.querySelector('.ds-select__list');
        if (selectEl) {
          selectEl.style.width = 'auto';
          selectEl.style.display = 'inline-block';
        }
        if (trigger) {
          trigger.style.width = 'auto';
          trigger.style.minWidth = '0';
          trigger.style.height = '36px';
          trigger.style.borderRadius = '999px';
          trigger.style.padding = '0 16px';
          trigger.style.gap = '6px';
          trigger.style.justifyContent = 'center';
          trigger.style.borderColor = '#E5E5E5';
          trigger.style.fontSize = '12px';
          trigger.style.boxShadow = 'none';
          trigger.style.outline = 'none';
          var syncTriggerBorder = function () {
            var isOpen = trigger.getAttribute('aria-expanded') === 'true';
            var hasVal = slot.querySelectorAll('[role="option"][aria-selected="true"]').length > 0;
            trigger.style.borderColor = (isOpen || hasVal) ? '#19191A' : '#E5E5E5';
            trigger.style.boxShadow = 'none';
          };
          new MutationObserver(syncTriggerBorder).observe(trigger, { attributes: true, attributeFilter: ['aria-expanded'] });
          trigger.addEventListener('focus', function () { trigger.style.boxShadow = 'none'; trigger.style.outline = 'none'; });
        }
        if (val) {
          val.setAttribute('data-placeholder', placeholders[key]);
          val.textContent = placeholders[key];
          val.style.color = '#19191A';
          val.style.flex = '0 0 auto';
          val.style.whiteSpace = 'nowrap';
        }
        if (panel) {
          panel.style.width = 'max-content';
          panel.style.minWidth = '180px';
          panel.style.right = 'auto';
          panel.style.padding = '12px 16px';
          panel.style.borderRadius = '8px';
          panel.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
          panel.style.border = '1px solid #F0F0F2';
          panel.style.maxHeight = 'none';
          var opts = panel.querySelectorAll('.ds-select__option');
          if (list && opts.length > 4) {
            list.style.display = 'grid';
            list.style.gridTemplateColumns = 'repeat(2, minmax(120px, max-content))';
            list.style.gap = '4px 20px';
            list.style.padding = '0';
          } else if (list) {
            list.style.padding = '0';
          }
          opts.forEach(function (opt) {
            opt.style.padding = '6px 4px';
            opt.style.minHeight = '32px';
            opt.style.height = 'auto';
          });
          panel.querySelectorAll('.ds-select__option-label').forEach(function (lbl) {
            lbl.style.whiteSpace = 'nowrap';
            lbl.style.fontSize = '12px';
            lbl.style.lineHeight = '20px';
            lbl.style.color = '#707070';
          });
        }
      });

      // Align Sort dropdown trigger text to 12px Regular (#19191A) matching filter pills & live fs.com
      var sortTrigger = document.querySelector('.plp-sort-wrap .ds-dropdown-command__trigger');
      var sortLabel = document.querySelector('.plp-sort-wrap .ds-dropdown-command__trigger-label');
      if (sortTrigger) {
        sortTrigger.style.fontSize = '12px';
        sortTrigger.style.lineHeight = '20px';
        sortTrigger.style.fontWeight = '400';
        sortTrigger.style.color = '#19191A';
      }
      if (sortLabel) {
        sortLabel.style.fontSize = '12px';
        sortLabel.style.lineHeight = '20px';
        sortLabel.style.fontWeight = '400';
        sortLabel.style.color = '#19191A';
      }

      var grid = document.getElementById('plp-product-grid');
      var cards = Array.prototype.slice.call(document.querySelectorAll('[data-plp-card]'));
      var resultsEl = document.getElementById('plp-results-count');
      var pageTitleEl = document.getElementById('plp-page-title');
      var breadcrumbCurrentEl = document.querySelector('.ds-breadcrumb__current');
      var clearAllBtn = document.getElementById('plp-clear-all-btn');
      var moreBtn = document.getElementById('plp-more-filters-trigger');
      var moreLabel = document.getElementById('plp-more-filters-label');
      var morePopover = document.getElementById('plp-more-filters-popover');

      function getSelected(groupKey) {
        var slot = document.querySelector('[data-filter-group="' + groupKey + '"]');
        if (!slot) return [];
        return Array.prototype.slice
          .call(slot.querySelectorAll('[role="option"][aria-selected="true"] .ds-select__option-label'))
          .map(function (el) { return el.textContent.trim(); });
      }

      function updateFilterPillBadge(groupKey, selectedList) {
        var slot = document.querySelector('[data-filter-group="' + groupKey + '"]');
        if (!slot) return;
        var trigger = slot.querySelector('.ds-select__trigger');
        var val = slot.querySelector('.ds-select__value');
        var base = placeholders[groupKey];
        if (val) {
          val.textContent = selectedList.length ? base + ' (' + selectedList.length + ')' : base;
          val.style.color = '#19191A';
        }
        if (trigger) {
          trigger.style.borderColor = selectedList.length ? '#19191A' : '#E5E5E5';
        }
      }

      function applyAllFilters() {
        var ports = getSelected('port');
        var poes = getSelected('poe');
        var downlinks = getSelected('downlink');

        updateFilterPillBadge('port', ports);
        updateFilterPillBadge('poe', poes);
        updateFilterPillBadge('downlink', downlinks);

        if (moreLabel) {
          moreLabel.textContent = activeMoreOpts.length ? 'More Filters (' + activeMoreOpts.length + ')' : 'More Filters';
        }
        if (moreBtn) {
          moreBtn.classList.toggle('is-checked', activeMoreOpts.length > 0);
        }

        var anyFilter = ports.length || poes.length || downlinks.length || activeMoreOpts.length;
        if (clearAllBtn) clearAllBtn.hidden = !anyFilter;

        var visibleCount = 0;
        cards.forEach(function (card) {
          var okSubcat = !activeSubcat || card.dataset.subcat === activeSubcat;
          var okPort = !ports.length || ports.indexOf(card.dataset.port) !== -1;
          var okPoe = !poes.length || poes.indexOf(card.dataset.poe) !== -1;
          var okDown = !downlinks.length || downlinks.indexOf(card.dataset.downlink) !== -1;
          var okMore = !activeMoreOpts.length || activeMoreOpts.every(function (opt) {
            if (opt === 'In stock at the U.S. Warehouse') return card.dataset.usStock === '1';
            if (opt === 'L2+ Managed' || opt === 'L3 Managed') return card.dataset.layer === opt;
            return (card.dataset.specs || '').toLowerCase().indexOf(opt.toLowerCase()) !== -1;
          });
          var show = okSubcat && okPort && okPoe && okDown && okMore;
          card.style.display = show ? '' : 'none';
          if (show) visibleCount++;
        });

        if (resultsEl) {
          resultsEl.textContent = (anyFilter || activeSubcat ? visibleCount : 69) + ' Results';
        }
      }

      // 2. Top 6 Subcategory Tiles: hover #F6F6F8; click sets active black border + top-right check + updates title/breadcrumb/grid
      var subcatBtns = Array.prototype.slice.call(document.querySelectorAll('[data-subcat-key]'));
      subcatBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.subcatKey;
          var title = btn.dataset.subcatTitle;
          var isSame = activeSubcat === key;
          activeSubcat = isSame ? null : key;
          subcatBtns.forEach(function (b) {
            var active = b.dataset.subcatKey === activeSubcat;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-pressed', String(active));
          });
          if (pageTitleEl) pageTitleEl.textContent = activeSubcat ? title : baseTitle;
          if (breadcrumbCurrentEl) breadcrumbCurrentEl.textContent = activeSubcat ? title : baseTitle;
          applyAllFilters();
        });
      });

      // 3. Instant multi-select inside Port Count / PoE / Downlink Ports
      document.querySelectorAll('[data-filter-group] [role="option"]').forEach(function (opt) {
        opt.addEventListener('click', function () {
          setTimeout(applyAllFilters, 20);
        });
      });

      // 4. More Filters 320x428 scrollable 2-col dropdown popover (NOT modal)
      if (moreBtn && morePopover) {
        moreBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var open = morePopover.hidden;
          morePopover.hidden = !open;
          moreBtn.setAttribute('aria-expanded', String(open));
          moreBtn.classList.toggle('is-open', open);
        });
        document.addEventListener('click', function (e) {
          if (!morePopover.hidden && !morePopover.contains(e.target) && !moreBtn.contains(e.target)) {
            morePopover.hidden = true;
            moreBtn.setAttribute('aria-expanded', 'false');
            moreBtn.classList.remove('is-open');
          }
        });
        morePopover.querySelectorAll('[data-more-opt]').forEach(function (optBtn) {
          optBtn.addEventListener('click', function () {
            var val = optBtn.dataset.moreOpt;
            var idx = activeMoreOpts.indexOf(val);
            if (idx === -1) activeMoreOpts.push(val);
            else activeMoreOpts.splice(idx, 1);
            var checked = idx === -1;
            optBtn.classList.toggle('is-checked', checked);
            optBtn.setAttribute('aria-pressed', String(checked));
            applyAllFilters();
          });
        });
      }

      // 5. Clear All italic button
      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function () {
          document.querySelectorAll('[data-filter-group] [role="option"][aria-selected="true"]').forEach(function (opt) {
            opt.click();
          });
          activeMoreOpts = [];
          document.querySelectorAll('[data-more-opt].is-checked').forEach(function (b) {
            b.classList.remove('is-checked');
            b.setAttribute('aria-pressed', 'false');
          });
          setTimeout(applyAllFilters, 30);
        });
      }

      // 6. Sort dropdown (Popularity / Newest / Price / Rate)
      var sortTriggerLabel = document.querySelector('.plp-sort-wrap .ds-dropdown-command__trigger-label');
      document.querySelectorAll('.plp-sort-wrap [role="menuitem"]').forEach(function (item) {
        item.addEventListener('click', function () {
          var mode = item.value;
          if (sortTriggerLabel) sortTriggerLabel.textContent = item.textContent.trim();
          var sorted = cards.slice().sort(function (a, b) {
            if (mode === 'price-low-to-high') return Number(a.dataset.price) - Number(b.dataset.price);
            if (mode === 'price-high-to-low') return Number(b.dataset.price) - Number(a.dataset.price);
            if (mode === 'newest-first') return Number(b.dataset.isNew) - Number(a.dataset.isNew);
            if (mode === 'rate-high-to-low') return Number(b.dataset.reviews) - Number(a.dataset.reviews);
            return Number(a.dataset.plpCard) - Number(b.dataset.plpCard);
          });
          sorted.forEach(function (c) { grid.appendChild(c); });
        });
      });

      // 7. Add to Cart button feedback + subtle toast (listening to native ds-cart--product-card buttons)
      var toastEl = document.getElementById('plp-cart-toast');
      var toastTimer = null;
      document.querySelectorAll('.plp-card-item .ds-cart--product-card').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.plp-card-item');
          var sku = item ? item.dataset.sku : 'Product';
          var text = btn.querySelector('.ds-cart__text');
          if (text) text.textContent = 'Added';
          if (toastEl) {
            toastEl.textContent = sku + ' added to cart';
            toastEl.classList.add('is-show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 1800);
          }
          setTimeout(function () {
            if (text) text.textContent = 'Add';
          }, 1500);
        });
      });

      // 8. Native library-pagination/default change event hook
      window.onPlpPageChange = function (event) {
        if (toastEl && event && event.detail) {
          toastEl.textContent = 'Page ' + event.detail.page + ' of ' + event.detail.totalPages;
          toastEl.classList.add('is-show');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 1400);
        }
      };
    })();
  </script>
</body>
</html>
`;

const outRel = 'pages/fs-plp-switches-pc.html';
H.assembleLocalPage(pageSource, outRel, { write: true });
console.log('Generated:', outRel, 'release:', RELEASE.slice(0, 12));
