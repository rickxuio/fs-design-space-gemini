'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const H = require(path.join(ROOT, 'scripts/page-helpers.cjs'));

const SLUG = 'fs-account-center';
const RELEASE = H.getActiveRelease();
const ICON_BASE = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons`;
const MG_COMMON_ICON = `${ICON_BASE}/mastergo-library/%E9%80%9A%E7%94%A8Icon`;
const MG_SYS_ICON = `${ICON_BASE}/mastergo-library/%E7%B3%BB%E7%BB%9FIcon`;

// Reuse authentic FS product photos already localized in pages/assets/
const THUMBS = {
  sfp: 'assets/fs-homepage/img-77-02103018.jpg',
  switch1: 'assets/fs-plp-switches/img-07-072f7dc4.webp',
  cable: 'assets/fs-homepage/img-79-ed09e534.jpg',
  switch2: 'assets/fs-plp-switches/img-09-f20b98e9.webp',
  qsfp: 'assets/fs-homepage/img-78-504f2f94.jpg',
  switch3: 'assets/fs-plp-switches/img-08-ef08e9a9.webp',
};

// Verify every thumb exists on disk, fall back safely if hash differs
const plpAssetsDir = path.join(ROOT, 'pages/assets/fs-plp-switches');
const plpWebps = fs.readdirSync(plpAssetsDir).filter((f) => f.endsWith('.webp')).sort();
if (!fs.existsSync(path.join(ROOT, 'pages', THUMBS.switch1))) THUMBS.switch1 = 'assets/fs-plp-switches/' + plpWebps[0];
if (!fs.existsSync(path.join(ROOT, 'pages', THUMBS.switch2))) THUMBS.switch2 = 'assets/fs-plp-switches/' + plpWebps[2];
if (!fs.existsSync(path.join(ROOT, 'pages', THUMBS.switch3))) THUMBS.switch3 = 'assets/fs-plp-switches/' + plpWebps[1];

const ORDERS = [
  {
    id: 'FS191011177503',
    from: 'Online',
    by: 'KRALIEX.E',
    date: '07/03/2021',
    total: 'US$ 337.21',
    status: 'Pending',
    statusKey: 'pending',
    dotColor: '#F5B800',
    actionLabel: 'Pay Now',
    primary: true,
  },
  {
    id: 'FS191011177504',
    from: 'Online',
    by: 'KRALIEX.E',
    date: '07/03/2021',
    total: 'US$ 337.21',
    status: 'In Production',
    statusKey: 'open',
    dotColor: '#10A300',
    actionLabel: 'View Order',
    primary: false,
  },
  {
    id: 'FS191011177505',
    from: 'Online',
    by: 'KRALIEX.E',
    date: '07/03/2021',
    total: 'US$ 337.21',
    status: 'Canceled',
    statusKey: 'canceled',
    dotColor: '#89898C',
    actionLabel: 'View Order',
    primary: false,
  },
];

const QUOTES = [
  {
    id: 'FS191011177503',
    by: 'KRALIEX.E',
    date: '07/03/2022',
    total: 'US$ 337.21',
    status: 'Active',
    expire: 'Expire on Jan 6, 2022',
    dotColor: '#10A300',
    actionLabel: 'Checkout',
    primary: true,
    thumbs: [THUMBS.sfp],
  },
  {
    id: 'FS191011177504',
    by: 'KRALIEX.E',
    date: '07/03/2022',
    total: 'US$ 337.21',
    status: 'Expired',
    expire: 'Expire on Jan 6, 2022',
    dotColor: '#89898C',
    actionLabel: 'Add to Cart',
    primary: false,
    thumbs: [THUMBS.switch1],
  },
  {
    id: 'FS191011177505',
    by: 'KRALIEX.E',
    date: '07/03/2022',
    total: 'US$ 337.21',
    status: 'Expired',
    expire: 'Expire on Jan 6, 2022',
    dotColor: '#89898C',
    actionLabel: 'Add to Cart',
    primary: false,
    thumbs: [THUMBS.cable, THUMBS.switch2, THUMBS.sfp, THUMBS.switch1, THUMBS.qsfp, THUMBS.switch3],
  },
];

const CASES = [
  { id: 'CN202203240011', date: '07/03/2021', type: 'Order & Payment Issue', status: 'New', contact: 'Rita.He' },
  { id: 'CN202203240011', date: '07/03/2021', type: 'Order Status', status: 'Working', contact: 'Rita.He' },
  { id: 'CN202203240011', date: '07/03/2021', type: 'Product & Technical Support', status: 'Need More Information', contact: 'Rita.He' },
  { id: 'CN202203240011', date: '07/03/2021', type: 'Customize Product', status: 'Need More Information', contact: 'Rita.He' },
];

// Native library-dropdown/command-dot helper
function buildRowMoreMenu(panelId, items) {
  const itemsHtml = items
    .map(
      (it) =>
        `<button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="${H.esc(it.value)}"><span class="ds-dropdown-command__label">${H.esc(it.label)}</span></button>`
    )
    .join('');
  return H.compTag('library-dropdown', 'command-dot', {
    panelIdentity: panelId,
    items: itemsHtml,
    actionCallback: 'onAccountRowCommand',
  });
}

// Left Sidebar Menu (exact MasterGo hierarchy: Your Account [expanded], Your Interactions, Account Setting)
const sidebarNavHtml = `
<div class="acct-nav-card">
  <div class="acct-nav-group">
    <button type="button" class="acct-nav-group__head" data-acct-group-toggle="grp-account" aria-expanded="true" aria-controls="grp-account">
      <span>Your Account</span>
      <img class="acct-nav-chevron" src="${ICON_BASE}/icon-chevron-down.svg" alt="">
    </button>
    <ul id="grp-account" class="acct-nav-list">
      <li><button type="button" class="acct-nav-item is-active" data-acct-nav="account-center"><span class="acct-nav-item__label">Account Center</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="orders"><span class="acct-nav-item__label">Orders</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="quotes"><span class="acct-nav-item__label">Quotes</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="saved-carts"><span class="acct-nav-item__label">Saved Carts</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="invoices"><span class="acct-nav-item__label">Invoices</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="credits"><span class="acct-nav-item__label">Credits</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="rmas"><span class="acct-nav-item__label">RMAs</span></button></li>
    </ul>
  </div>
  <div class="acct-nav-group">
    <button type="button" class="acct-nav-group__head" data-acct-group-toggle="grp-interactions" aria-expanded="false" aria-controls="grp-interactions">
      <span>Your Interactions</span>
      <img class="acct-nav-chevron is-collapsed" src="${ICON_BASE}/icon-chevron-down.svg" alt="">
    </button>
    <ul id="grp-interactions" class="acct-nav-list" hidden>
      <li><button type="button" class="acct-nav-item" data-acct-nav="cases"><span class="acct-nav-item__label">Cases</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="messages"><span class="acct-nav-item__label">Messages</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="reviews"><span class="acct-nav-item__label">Product Reviews</span></button></li>
    </ul>
  </div>
  <div class="acct-nav-group">
    <button type="button" class="acct-nav-group__head" data-acct-group-toggle="grp-settings" aria-expanded="false" aria-controls="grp-settings">
      <span>Account Setting</span>
      <img class="acct-nav-chevron is-collapsed" src="${ICON_BASE}/icon-chevron-down.svg" alt="">
    </button>
    <ul id="grp-settings" class="acct-nav-list" hidden>
      <li><button type="button" class="acct-nav-item" data-acct-nav="profile"><span class="acct-nav-item__label">Company Profile</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="addresses"><span class="acct-nav-item__label">Address Book</span></button></li>
      <li><button type="button" class="acct-nav-item" data-acct-nav="security"><span class="acct-nav-item__label">Security &amp; Users</span></button></li>
    </ul>
  </div>
</div>

<div class="acct-mgr-card">
  <div class="acct-mgr-card__title">Your Account Manager</div>
  <div class="acct-mgr-person">
    <img class="acct-mgr-svg" src="${MG_COMMON_ICON}/2536-3359.svg" alt="" width="16" height="16">
    <div>
      <div class="acct-mgr-name">Mollie.Hu</div>
      <div class="acct-mgr-email">mollie.hu@feisu.com</div>
    </div>
  </div>
  <div class="acct-mgr-divider"></div>
  <div class="acct-mgr-contact">
    <div class="acct-mgr-row">
      <img class="acct-mgr-svg" src="${MG_COMMON_ICON}/1634-7872.svg" alt="" width="16" height="16">
      <div>
        <div class="acct-mgr-phone">+1 (888) 468 7419</div>
        <div class="acct-mgr-sub">5x24 Phone Support</div>
      </div>
    </div>
    <a class="acct-mgr-action" href="#start-chat" data-acct-toast="Connecting to Mollie.Hu live chat...">
      <img class="acct-mgr-svg" src="${MG_COMMON_ICON}/53104-019975.svg" alt="" width="16" height="16">
      <span>Start a Chat</span>
    </a>
    <a class="acct-mgr-action" href="mailto:mollie.hu@feisu.com">
      <img class="acct-mgr-svg" src="${MG_COMMON_ICON}/53104-020284.svg" alt="" width="16" height="16">
      <span>Email Us</span>
    </a>
  </div>
</div>
`;

// Orders rows
const orderRowsHtml = ORDERS.map((o, idx) => {
  const btnHtml = o.primary
    ? H.compTag('library-button', 'filled-red', {
        label: o.actionLabel,
        size: 'm',
        actionCallback: 'onOrderAction',
      })
    : H.compTag('library-button', 'outline-black', {
        label: o.actionLabel,
        size: 'xl',
        actionCallback: 'onOrderAction',
      });
  const moreMenu = buildRowMoreMenu(`acct-order-more-${idx}`, [
    { value: 'view', label: 'View Order Details' },
    { value: 'invoice', label: 'Download Invoice' },
    { value: 'reorder', label: 'Buy Again' },
  ]);
  return `<div class="acct-order-row" data-order-row="" data-status-key="${o.statusKey}" data-search-text="${H.esc((o.id + ' ' + o.by + ' ' + o.status).toLowerCase())}">
    <div class="acct-col-id"><a class="acct-id-link" href="#order-${H.esc(o.id)}">${H.esc(o.id)}</a></div>
    <div class="acct-col-from">${H.esc(o.from)}</div>
    <div class="acct-col-by">${H.esc(o.by)}</div>
    <div class="acct-col-date">${H.esc(o.date)}</div>
    <div class="acct-col-total">${H.esc(o.total)}</div>
    <div class="acct-col-status">
      <span class="acct-status-dot acct-status-dot--${o.statusKey}" aria-hidden="true"></span>
      <span class="acct-status-text">${H.esc(o.status)}</span>
    </div>
    <div class="acct-col-actions">
      <div class="acct-row-btn" data-row-toast="${H.esc(o.actionLabel + ': ' + o.id)}">${btnHtml}</div>
      ${moreMenu}
    </div>
  </div>`;
}).join('\n');

// Quotes rows
const quoteRowsHtml = QUOTES.map((q, idx) => {
  const btnHtml = q.primary
    ? H.compTag('library-button', 'filled-red', {
        label: q.actionLabel,
        size: 'm',
        actionCallback: 'onQuoteAction',
      })
    : H.compTag('library-button', 'outline-black', {
        label: q.actionLabel,
        size: 'xl',
        actionCallback: 'onQuoteAction',
      });
  const moreMenu = buildRowMoreMenu(`acct-quote-more-${idx}`, [
    { value: 'pdf', label: 'Download PDF Quote' },
    { value: 'duplicate', label: 'Duplicate Quote' },
    { value: 'email', label: 'Email Quote' },
  ]);
  const thumbsHtml = q.thumbs
    .map((src) => `<div class="acct-quote-thumb"><img class="acct-quote-thumb__img" src="${H.esc(src)}" alt="Product item"></div>`)
    .join('');
  return `<div class="acct-quote-block" data-quote-row="" data-search-text="${H.esc((q.id + ' ' + q.by + ' ' + q.status).toLowerCase())}">
    <div class="acct-quote-row">
      <div class="acct-qcol-id"><a class="acct-id-link" href="#quote-${H.esc(q.id)}">${H.esc(q.id)}</a></div>
      <div class="acct-qcol-by">${H.esc(q.by)}</div>
      <div class="acct-qcol-date">${H.esc(q.date)}</div>
      <div class="acct-qcol-total">${H.esc(q.total)}</div>
      <div class="acct-qcol-status">
        <div class="acct-status-line">
          <span class="acct-status-dot acct-status-dot--${q.status === 'Active' ? 'open' : 'canceled'}" aria-hidden="true"></span>
          <span class="acct-status-text">${H.esc(q.status)}</span>
        </div>
        <div class="acct-status-sub">${H.esc(q.expire)}</div>
      </div>
      <div class="acct-col-actions">
        <div class="acct-row-btn" data-row-toast="${H.esc(q.actionLabel + ': ' + q.id)}">${btnHtml}</div>
        ${moreMenu}
      </div>
    </div>
    <div class="acct-quote-thumbs">${thumbsHtml}</div>
  </div>`;
}).join('\n');

// Cases rows
const caseRowsHtml = CASES.map(
  (c) => `<div class="acct-case-row" data-case-row="" data-search-text="${H.esc((c.id + ' ' + c.type + ' ' + c.status + ' ' + c.contact).toLowerCase())}">
    <div class="acct-ccol-id"><a class="acct-id-link" href="#case-${H.esc(c.id)}">${H.esc(c.id)}</a></div>
    <div class="acct-ccol-date">${H.esc(c.date)}</div>
    <div class="acct-ccol-type">${H.esc(c.type)}</div>
    <div class="acct-ccol-status">${H.esc(c.status)}</div>
    <div class="acct-ccol-contact">${H.esc(c.contact)}</div>
  </div>`
).join('\n');

const pageCss = `${H.basePageCss()}
.acct-section { padding: 40px 0; background: #FFFFFF; }
.acct-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 24px; align-items: start; }
.acct-sidebar { display: flex; flex-direction: column; gap: 16px; }
.acct-nav-card { background: #FAFBFB; border-radius: 8px; padding: 12px 0; }
.acct-nav-group__head { appearance: none; width: 100%; border: 0; background: transparent; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between; font-family: inherit; font-size: 13px; line-height: 20px; font-weight: 600; color: #19191A; cursor: pointer; text-align: left; }
.acct-nav-chevron { width: 12px; height: 12px; transition: transform 0.15s ease; transform: rotate(180deg); }
.acct-nav-chevron.is-collapsed { transform: rotate(0deg); }
.acct-nav-list { margin: 0; padding: 0; list-style: none; }
.acct-nav-list[hidden] { display: none; }
.acct-nav-item { appearance: none; width: 100%; border: 0; background: transparent; padding: 9px 20px 9px 32px; text-align: left; font-family: inherit; font-size: 13px; line-height: 20px; font-weight: 400; color: #4B4B4D; cursor: pointer; display: block; }
.acct-nav-item:hover { color: #19191A; background: #F2F2F2; }
.acct-nav-item.is-active { background: #FFFFFF; color: #19191A; font-weight: 600; }
.acct-nav-item.is-active .acct-nav-item__label { display: inline-block; padding-bottom: 3px; border-bottom: 2px solid #C00000; }
.acct-mgr-card { background: #FAFBFB; border-radius: 8px; padding: 20px; }
.acct-mgr-card__title { font-size: 12px; line-height: 18px; color: #707070; margin-bottom: 14px; }
.acct-mgr-person { display: flex; align-items: flex-start; gap: 8px; }
.acct-mgr-svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; display: block; opacity: 0.78; }
.acct-mgr-action .acct-mgr-svg { margin-top: 0; }
.acct-mgr-name { font-size: 13px; line-height: 20px; font-weight: 600; color: #19191A; }
.acct-mgr-email { font-size: 12px; line-height: 18px; color: #4B4B4D; word-break: break-all; }
.acct-mgr-divider { height: 1px; background: #ECEEF0; margin: 14px 0; }
.acct-mgr-contact { display: flex; flex-direction: column; gap: 10px; }
.acct-mgr-row { display: flex; align-items: flex-start; gap: 8px; }
.acct-mgr-phone { font-size: 12px; line-height: 18px; font-weight: 600; color: #19191A; }
.acct-mgr-sub { font-size: 11px; line-height: 16px; color: #707070; }
.acct-mgr-action { display: flex; align-items: center; gap: 8px; font-size: 12px; line-height: 20px; color: #19191A; text-decoration: none; }
.acct-mgr-action:hover { color: #0060BF; text-decoration: underline; }
.acct-main { display: flex; flex-direction: column; gap: 20px; min-width: 0; }
.acct-greeting__title { margin: 0 0 4px; font-size: 24px; line-height: 32px; font-weight: 600; color: #19191A; }
.acct-greeting__sub { margin: 0; font-size: 13px; line-height: 20px; color: #707070; }
.acct-greeting__num { color: #19191A; font-weight: 600; }
.acct-info-banner { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 6px; background: #F4F7FC; font-size: 13px; line-height: 20px; color: #4B4B4D; }
.acct-info-banner__icon { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #0060BF; color: #0060BF; font-size: 11px; line-height: 13px; font-weight: 600; text-align: center; flex-shrink: 0; box-sizing: border-box; }
.acct-info-banner__link { color: #0060BF; text-decoration: none; margin-left: 4px; }
.acct-info-banner__link:hover { text-decoration: underline; }
.acct-card { background: #FFFFFF; border: 1px solid #F0F0F2; border-radius: 8px; padding: 24px; box-sizing: border-box; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05); }
.acct-card__head { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.acct-card__head--divided { padding-bottom: 18px; margin-bottom: 16px; border-bottom: 1px solid #F0F0F2; }
.acct-card__title { margin: 0; font-size: 18px; line-height: 26px; font-weight: 600; color: #19191A; }
.acct-card__tools { display: flex; align-items: center; gap: 16px; }
.acct-view-all { font-size: 13px; line-height: 20px; color: #0060BF; text-decoration: none; white-space: nowrap; }
.acct-view-all:hover { text-decoration: underline; }
.acct-search-wrap { position: relative; width: 240px; }
.acct-search-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; opacity: 0.55; pointer-events: none; z-index: 2; }
.acct-kpi-strip { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 12px 0 24px; margin-bottom: 8px; }
.acct-kpi-item { appearance: none; border: 0; border-right: 1px solid #ECEEF0; background: transparent; padding: 6px 12px; display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; font-family: inherit; border-radius: 4px; transition: background-color 0.15s ease; }
.acct-kpi-item:last-child { border-right: 0; }
.acct-kpi-item:hover { background: #FAFBFB; }
.acct-kpi-item.is-active { background: #F4F7FC; }
.acct-kpi-item:hover .acct-kpi-label, .acct-kpi-item.is-active .acct-kpi-label, .acct-kpi-item.is-active .acct-kpi-num { color: #0060BF; }
.acct-kpi-num { font-size: 24px; line-height: 32px; font-weight: 600; color: #19191A; }
.acct-kpi-label { font-size: 12px; line-height: 18px; font-weight: 600; color: #19191A; }
.acct-empty-row { padding: 24px 0; text-align: center; font-size: 13px; color: #707070; }
.acct-empty-row[hidden] { display: none; }
.acct-table-head { display: grid; padding: 10px 0 12px; border-bottom: 1px solid #ECEEF0; font-size: 12px; line-height: 18px; font-weight: 600; color: #19191A; }
.acct-table-head--orders { grid-template-columns: 1.4fr 0.7fr 1fr 0.9fr 0.9fr 1.2fr 152px; gap: 12px; }
.acct-table-head--quotes { grid-template-columns: 1.4fr 1fr 0.95fr 0.95fr 1.5fr 152px; gap: 12px; }
.acct-table-head--cases { grid-template-columns: 1.3fr 1fr 1.7fr 1.5fr 0.9fr; gap: 12px; }
.acct-order-row { display: grid; grid-template-columns: 1.4fr 0.7fr 1fr 0.9fr 0.9fr 1.2fr 152px; gap: 12px; align-items: center; padding: 18px 0; border-bottom: 1px solid #F2F2F2; font-size: 13px; line-height: 20px; color: #19191A; }
.acct-order-row:last-child { border-bottom: 0; padding-bottom: 4px; }
.acct-quote-block { padding: 18px 0; border-bottom: 1px solid #F2F2F2; }
.acct-quote-block:last-child { border-bottom: 0; padding-bottom: 4px; }
.acct-quote-row { display: grid; grid-template-columns: 1.4fr 1fr 0.95fr 0.95fr 1.5fr 152px; gap: 12px; align-items: center; font-size: 13px; line-height: 20px; color: #19191A; }
.acct-quote-thumbs { display: flex; align-items: center; gap: 12px; margin-top: 14px; flex-wrap: wrap; }
.acct-quote-thumb { width: 52px; height: 52px; border-radius: 4px; background: #FFFFFF; padding: 4px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
.acct-quote-thumb__img { max-width: 100%; max-height: 100%; object-fit: contain; mix-blend-mode: multiply; display: block; }
.acct-case-row { display: grid; grid-template-columns: 1.3fr 1fr 1.7fr 1.5fr 0.9fr; gap: 12px; align-items: center; padding: 16px 0; border-bottom: 1px solid #F2F2F2; font-size: 13px; line-height: 20px; color: #19191A; }
.acct-case-row:last-child { border-bottom: 0; padding-bottom: 4px; }
.acct-ccol-contact { text-align: right; }
.acct-table-head--cases > :last-child { text-align: right; }
.acct-id-link { color: #19191A; text-decoration: underline; }
.acct-id-link:hover { color: #0060BF; }
.acct-col-status { display: flex; align-items: center; gap: 6px; }
.acct-status-line { display: flex; align-items: center; gap: 6px; }
.acct-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.acct-status-dot--pending { background: #F5B800; }
.acct-status-dot--open { background: #10A300; }
.acct-status-dot--canceled { background: #89898C; }
.acct-status-text { font-weight: 600; color: #19191A; }
.acct-status-sub { font-size: 12px; line-height: 18px; color: #707070; margin-top: 2px; }
.acct-col-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }
.acct-toast { position: fixed; right: 24px; bottom: 24px; z-index: 60; background: #19191A; color: #FFFFFF; padding: 10px 16px; border-radius: 6px; font-size: 13px; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.acct-toast.is-show { opacity: 1; }
`;

const pageSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Center - FS Business Account</title>
  <style>${pageCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}

  <main>
    <section id="account-center" class="page-section acct-section">
      <div class="container">
        <div class="acct-layout">
          <aside class="acct-sidebar" aria-label="Account navigation">
            ${sidebarNavHtml}
          </aside>

          <div class="acct-main">
            <header class="acct-greeting">
              <h1 class="acct-greeting__title">Hello Rain!</h1>
              <p class="acct-greeting__sub">Business Account #: <span class="acct-greeting__num">456590</span></p>
            </header>

            <div class="acct-info-banner" role="note">
              <span class="acct-info-banner__icon" aria-hidden="true">i</span>
              <span>We have found a business account that matches your email address.<a class="acct-info-banner__link" href="#account-details" data-acct-toast="Viewing matched business account #456590">See more</a></span>
            </div>

            <div id="orders-panel" class="acct-card">
              <div class="acct-card__head acct-card__head--divided">
                <h2 class="acct-card__title">Orders</h2>
                <div class="acct-card__tools">
                  <a class="acct-view-all" href="#orders-panel" data-reset-filter="orders" data-acct-toast="Showing all Orders">View All Orders</a>
                  <div class="acct-search-wrap" data-acct-search="orders" data-fs-extend="search-input-icon">
                    ${H.compTag('library-input', 'white', {
                      label: 'Search Orders',
                      placeholder: 'Case #, Content',
                      name: 'orders-search',
                    })}
                    <img class="acct-search-icon" src="${ICON_BASE}/icon-search.svg" alt="" width="16" height="16">
                  </div>
                </div>
              </div>

              <div class="acct-kpi-strip" role="group" aria-label="Order status summary">
                <button type="button" class="acct-kpi-item" data-kpi-filter="pending">
                  <span class="acct-kpi-num">6</span>
                  <span class="acct-kpi-label">Pending</span>
                </button>
                <button type="button" class="acct-kpi-item" data-kpi-filter="open">
                  <span class="acct-kpi-num">7</span>
                  <span class="acct-kpi-label">Open</span>
                </button>
                <button type="button" class="acct-kpi-item" data-kpi-filter="completed">
                  <span class="acct-kpi-num">4</span>
                  <span class="acct-kpi-label">Completed</span>
                </button>
                <button type="button" class="acct-kpi-item" data-kpi-filter="canceled">
                  <span class="acct-kpi-num">4</span>
                  <span class="acct-kpi-label">Canceled</span>
                </button>
              </div>

              <div class="acct-table-head acct-table-head--orders">
                <div>Order #</div>
                <div>From</div>
                <div>Purchased By</div>
                <div>Created Date</div>
                <div>Order Total</div>
                <div>Status</div>
                <div></div>
              </div>
              <div id="acct-orders-list">
                ${orderRowsHtml}
                <div class="acct-empty-row" id="acct-orders-empty" hidden>No matching orders in recent view. Click "View All Orders" to reset.</div>
              </div>
            </div>

            <div id="quotes-panel" class="acct-card">
              <div class="acct-card__head">
                <h2 class="acct-card__title">Quotes</h2>
                <div class="acct-card__tools">
                  <a class="acct-view-all" href="#quotes-panel" data-reset-filter="quotes" data-acct-toast="Showing all Quotes">View All Quotes</a>
                  <div class="acct-search-wrap" data-acct-search="quotes" data-fs-extend="search-input-icon">
                    ${H.compTag('library-input', 'white', {
                      label: 'Search Quotes',
                      placeholder: 'Search Quotes',
                      name: 'quotes-search',
                    })}
                    <img class="acct-search-icon" src="${ICON_BASE}/icon-search.svg" alt="" width="16" height="16">
                  </div>
                </div>
              </div>

              <div class="acct-table-head acct-table-head--quotes">
                <div>Quote #</div>
                <div>Requested By</div>
                <div>Purchased Date</div>
                <div>Grand Total</div>
                <div>Status</div>
                <div></div>
              </div>
              <div id="acct-quotes-list">
                ${quoteRowsHtml}
                <div class="acct-empty-row" id="acct-quotes-empty" hidden>No matching quotes found.</div>
              </div>
            </div>

            <div id="cases-panel" class="acct-card">
              <div class="acct-card__head">
                <h2 class="acct-card__title">Cases</h2>
                <div class="acct-card__tools">
                  <a class="acct-view-all" href="#cases-panel" data-reset-filter="cases" data-acct-toast="Showing all Cases">View All Cases</a>
                  <div class="acct-search-wrap" data-acct-search="cases" data-fs-extend="search-input-icon">
                    ${H.compTag('library-input', 'white', {
                      label: 'Search Cases',
                      placeholder: 'Case #, Content',
                      name: 'cases-search',
                    })}
                    <img class="acct-search-icon" src="${ICON_BASE}/icon-search.svg" alt="" width="16" height="16">
                  </div>
                </div>
              </div>

              <div class="acct-table-head acct-table-head--cases">
                <div>Case #</div>
                <div>Created Date</div>
                <div>Type</div>
                <div>Status</div>
                <div>Contact Full Name</div>
              </div>
              <div id="acct-cases-list">
                ${caseRowsHtml}
                <div class="acct-empty-row" id="acct-cases-empty" hidden>No matching cases found.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div id="acct-toast" class="acct-toast" role="status" aria-live="polite"></div>
  </main>

  ${H.compTag('library-navigation', 'footer', {})}

  <script>
    (function () {
      // 1. Compact search input styling (hide visible label while preserving accessible label, 36px height)
      document.querySelectorAll('.acct-search-wrap .ds-input-field__label').forEach(function (lbl) {
        lbl.style.position = 'absolute';
        lbl.style.width = '1px';
        lbl.style.height = '1px';
        lbl.style.overflow = 'hidden';
        lbl.style.clip = 'rect(0, 0, 0, 0)';
      });
      document.querySelectorAll('.acct-search-wrap .ds-input-field__input').forEach(function (inp) {
        inp.style.height = '36px';
        inp.style.fontSize = '13px';
        inp.style.paddingRight = '34px';
      });
      // Compact action button width matching MasterGo (~104px, 36px height, 13px font)
      document.querySelectorAll('.acct-row-btn .ds-btn').forEach(function (btn) {
        btn.style.minWidth = '104px';
        btn.style.height = '36px';
        btn.style.fontSize = '13px';
        btn.style.padding = '0 14px';
      });

      // 2. Sidebar accordion groups & active nav item switching
      document.querySelectorAll('[data-acct-group-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var targetId = btn.getAttribute('data-acct-group-toggle');
          var panel = document.getElementById(targetId);
          var chev = btn.querySelector('.acct-nav-chevron');
          if (!panel) return;
          var willOpen = panel.hidden;
          panel.hidden = !willOpen;
          btn.setAttribute('aria-expanded', String(willOpen));
          if (chev) chev.classList.toggle('is-collapsed', !willOpen);
        });
      });

      var navItems = Array.prototype.slice.call(document.querySelectorAll('[data-acct-nav]'));
      navItems.forEach(function (btn) {
        btn.addEventListener('click', function () {
          navItems.forEach(function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          var targetMap = { orders: 'orders-panel', quotes: 'quotes-panel', cases: 'cases-panel' };
          var sec = document.getElementById(targetMap[btn.dataset.acctNav]);
          if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      // 3. Orders KPI click filter + Live search filters
      var kpiBtns = Array.prototype.slice.call(document.querySelectorAll('[data-kpi-filter]'));
      var orderRows = Array.prototype.slice.call(document.querySelectorAll('[data-order-row]'));
      var ordersInput = document.querySelector('input[name="orders-search"]');
      var ordersEmpty = document.getElementById('acct-orders-empty');
      var activeKpi = null;

      function applyOrdersFilter() {
        var q = ordersInput ? ordersInput.value.trim().toLowerCase() : '';
        var visible = 0;
        orderRows.forEach(function (row) {
          var matchKpi = !activeKpi || row.dataset.statusKey === activeKpi;
          var matchQ = !q || (row.dataset.searchText || '').indexOf(q) !== -1;
          var show = matchKpi && matchQ;
          row.style.display = show ? '' : 'none';
          if (show) visible += 1;
        });
        if (ordersEmpty) ordersEmpty.hidden = visible > 0;
      }

      kpiBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.kpiFilter;
          activeKpi = activeKpi === key ? null : key;
          kpiBtns.forEach(function (b) { b.classList.toggle('is-active', b.dataset.kpiFilter === activeKpi); });
          applyOrdersFilter();
        });
      });
      if (ordersInput) ordersInput.addEventListener('input', applyOrdersFilter);

      function wireSearch(inputName, rowSelector, emptyId) {
        var inp = document.querySelector('input[name="' + inputName + '"]');
        var rows = Array.prototype.slice.call(document.querySelectorAll(rowSelector));
        var emptyEl = document.getElementById(emptyId);
        if (!inp) return;
        inp.addEventListener('input', function () {
          var q = inp.value.trim().toLowerCase();
          var visible = 0;
          rows.forEach(function (row) {
            var txt = row.dataset.searchText || '';
            var show = !q || txt.indexOf(q) !== -1;
            row.style.display = show ? '' : 'none';
            if (show) visible += 1;
          });
          if (emptyEl) emptyEl.hidden = visible > 0;
        });
      }
      wireSearch('quotes-search', '[data-quote-row]', 'acct-quotes-empty');
      wireSearch('cases-search', '[data-case-row]', 'acct-cases-empty');

      document.querySelectorAll('[data-reset-filter]').forEach(function (link) {
        link.addEventListener('click', function () {
          var which = link.dataset.resetFilter;
          if (which === 'orders') {
            activeKpi = null;
            kpiBtns.forEach(function (b) { b.classList.remove('is-active'); });
            if (ordersInput) ordersInput.value = '';
            applyOrdersFilter();
          } else if (which === 'quotes') {
            var qi = document.querySelector('input[name="quotes-search"]');
            if (qi) { qi.value = ''; qi.dispatchEvent(new Event('input')); }
          } else if (which === 'cases') {
            var ci = document.querySelector('input[name="cases-search"]');
            if (ci) { ci.value = ''; ci.dispatchEvent(new Event('input')); }
          }
        });
      });

      // 5. Toast feedback for action buttons, row command menus & manager links
      var toast = document.getElementById('acct-toast');
      var toastTimer = null;
      function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('is-show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove('is-show'); }, 2000);
      }
      window.onAccountRowCommand = function (detail) {
        var label = (detail && (detail.label || detail.value)) || 'Action selected';
        showToast(label);
      };
      document.querySelectorAll('.ds-dropdown-command__item').forEach(function (item) {
        item.addEventListener('click', function () {
          showToast(item.textContent.trim());
        });
      });
      document.querySelectorAll('[data-acct-toast]').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.preventDefault();
          showToast(el.dataset.acctToast);
        });
      });
      document.querySelectorAll('[data-row-toast]').forEach(function (el) {
        el.addEventListener('click', function () {
          showToast(el.dataset.rowToast);
        });
      });
    })();
  </script>
</body>
</html>
`;

const outRel = 'pages/fs-account-center-pc.html';
H.assembleLocalPage(pageSource, outRel, { write: true });
console.log('Generated:', outRel, 'release:', RELEASE.slice(0, 12));
