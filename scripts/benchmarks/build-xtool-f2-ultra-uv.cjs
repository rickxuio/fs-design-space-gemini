'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const H = require(path.join(ROOT, 'scripts/page-helpers.cjs'));

const SLUG = 'xtool-f2-ultra-uv';
const REF_REL = `reference-inputs/${SLUG}/content.json`;
const RELEASE = H.getActiveRelease();

const GALLERY = [
  { src: 'assets/xtool-f2-ultra-uv/img-93-9ceec35b.webp', alt: 'xTool F2 Ultra UV 5W UV Laser Engraver Front View' },
  { src: 'assets/xtool-f2-ultra-uv/img-94-fab742b4.webp', alt: 'UV Laser Master of Glass 3D Inner Engraving' },
  { src: 'assets/xtool-f2-ultra-uv/img-95-22833a68.webp', alt: 'Key Capabilities Overview' },
  { src: 'assets/xtool-f2-ultra-uv/img-96-6f7d2015.webp', alt: 'Material Compatibility Showcase' },
  { src: 'assets/xtool-f2-ultra-uv/img-97-9e504302.webp', alt: 'Micron-Level Cold Processing Detail' },
  { src: 'assets/xtool-f2-ultra-uv/img-98-7b2320d7.webp', alt: 'Burn-Free Wood and Crystal Engraving' },
];

const PACKAGES = [
  {
    id: 'standalone',
    label: 'F2 Ultra UV Standalone',
    priceNum: 3799,
    msrpNum: 4299,
    savedNum: 500,
    img: GALLERY[0].src,
  },
  {
    id: 'gift-pack',
    label: 'Gift Pack Bundle',
    priceNum: 3999,
    msrpNum: 4599,
    savedNum: 600,
    img: GALLERY[1].src,
  },
  {
    id: 'conveyor',
    label: 'F2 Ultra UV + Conveyor',
    priceNum: 4399,
    msrpNum: 4999,
    savedNum: 600,
    img: GALLERY[2].src,
  },
  {
    id: 'deluxe',
    label: 'F2 Ultra UV Deluxe Bundle',
    priceNum: 4899,
    msrpNum: 5699,
    savedNum: 800,
    img: GALLERY[3].src,
  },
];

const ADDONS = [
  { id: 'care-2yr', name: 'uv-addon-care', label: '2-Year Extended Protection Plan (+$299.00)', priceNum: 299 },
  { id: 'rotary-ra2', name: 'uv-addon-rotary', label: 'RA2 Pro 4-in-1 Rotary Attachment (+$249.00)', priceNum: 249 },
];

const HIGHLIGHTS = [
  'Master of Glass: Excels in 3D inner engraving, embossing, cutting, and fine engraving.',
  'Unmatched Material Compatibility: Unlock more materials, even those that others cannot.',
  'Micron-Level Precision: Brings every detail to life with stunning clarity.',
  'Burn-Free Edges: With cold processing, no prep or polishing—perfection in one step.',
  'User-Friendly: Dual 48MP cameras, one-click 2D to 3D, 15,000 mm/s speed.',
];

const ROI_CARDS = [
  {
    id: 'roi-1',
    img: 'assets/xtool-f2-ultra-uv/content-roi-1.webp',
    title: '"Paid for itself in 2.5 months: 6x Faster Engraving."',
    desc: 'As an engineer, efficiency is everything. UV replaces the 1-hour messy coating, engraving, and washing process with 10-minute direct engraving. This efficiency boost handled a 102-piece wedding order effortlessly.',
  },
  {
    id: 'roi-2',
    img: 'assets/xtool-f2-ultra-uv/content-roi-2.webp',
    title: '"3.75x Sales Growth: From Garage to Warehouse"',
    desc: 'Since going full-time, UV became my growth engine. Adding premium details to our signature wedding bundles surged monthly sales by 3.75x and expanded our business from a garage corner to a warehouse.',
  },
  {
    id: 'roi-3',
    img: 'assets/xtool-f2-ultra-uv/content-roi-3.webp',
    title: '"20X Markup Secret: High-Profit 3D Inner Glass Engraving"',
    desc: '3D inner engraving is a new profit tier. We transform crystals into $40-$75 premium memorial pieces. At pop-up markets, live internal engraving draws crowds and secures high-margin repeat growth.',
  },
  {
    id: 'roi-4',
    img: 'assets/xtool-f2-ultra-uv/content-roi-4.webp',
    title: '"Zero Charring: Cleanest Wood & Glass Results"',
    desc: 'In my home studio, quality is everything. While CO2 leaves burn marks, UV delivers a clean frosty look on glass and wood with zero charring for high-end photo-etched memorial gifts.',
  },
];

const CRYSTAL_GALLERY = [
  { img: 'assets/xtool-f2-ultra-uv/content-crystal-1.webp', title: '3D Photo Crystals — Profit per Unit: $38-$44' },
  { img: 'assets/xtool-f2-ultra-uv/content-crystal-2.webp', title: 'Crystal Ornament — Profit per Unit: $20-$22' },
  { img: 'assets/xtool-f2-ultra-uv/content-crystal-3.webp', title: 'Crystal Keychains — Profit per Unit: $8.4' },
  { img: 'assets/xtool-f2-ultra-uv/content-crystal-4.webp', title: 'Whiskey Glasses — Profit per Unit: $20' },
];

const MATERIALS = [
  { id: 'mat-1', img: 'assets/xtool-f2-ultra-uv/content-materials-1.webp', title: 'K9 Rectangle Crystal', price: '$15.99', href: 'https://www.xtool.com/collections/material' },
  { id: 'mat-2', img: 'assets/xtool-f2-ultra-uv/content-materials-2.webp', title: 'Square Rubber Wood LED Light Base with Groove', price: '$21.99', href: 'https://www.xtool.com/collections/material' },
  { id: 'mat-3', img: 'assets/xtool-f2-ultra-uv/content-materials-3.webp', title: 'Round Rubber Wood LED Light Base with Groove', price: '$83.99', href: 'https://www.xtool.com/collections/material' },
  { id: 'mat-4', img: 'assets/xtool-f2-ultra-uv/content-materials-4.webp', title: 'K9 Portrait Crystal Cube Block', price: '$15.99', href: 'https://www.xtool.com/collections/material' },
  { id: 'mat-5', img: 'assets/xtool-f2-ultra-uv/content-materials-5.webp', title: 'Multicolored LED Lights K5 Crystal Heart Keychain (10pcs)', price: '$15.99', href: 'https://www.xtool.com/collections/material' },
  { id: 'mat-6', img: 'assets/xtool-f2-ultra-uv/content-materials-6.webp', title: 'Multicolored LED Lights K5 Crystal Rectangular Keychain (10pcs)', price: '$15.99', href: 'https://www.xtool.com/collections/material' },
];

const KOLS = [
  {
    id: 'kol-1',
    img: 'assets/xtool-f2-ultra-uv/content-kol-1.jpg',
    title: 'Cornelius Creations',
    desc: '"We are getting some super fine detail and probably the cleanest engraving—actually, it is the cleanest engraving out of any external laser so far."',
  },
  {
    id: 'kol-2',
    img: 'assets/xtool-f2-ultra-uv/content-kol-2.jpg',
    title: 'Six Eight Woodworks',
    desc: '"From a small business perspective, if you want to just batch out a ton of whiskey tumblers and glassware, it makes the entire workflow effortless."',
  },
  {
    id: 'kol-3',
    img: 'assets/xtool-f2-ultra-uv/content-kol-3.jpg',
    title: 'Make or Break Shop',
    desc: '"What xTool has done a really good job of is making this process fairly simple. You can just import a 3D model and place it wherever you want inside the crystal."',
  },
];

const MEDIA_QUOTES = [
  {
    source: "Tom's Hardware",
    quote: '"Laser engravers are pretty powerful tools, but never did I think one would be able to engrave INSIDE glass so easily."',
  },
  {
    source: 'Hackster.io',
    quote: '"The xTool F2 Ultra UV is a fast UV laser that cuts and engraves wood without char, engraves plastic, and does amazing things with crystal and glass."',
  },
  {
    source: 'Creative Bloq',
    quote: '"If you want a UV laser, the xTool F2 Ultra UV is the one to get right now. It is a more polished machine and the software is dramatically better."',
  },
  {
    source: '01net',
    quote: '"With the F2 Ultra UV, xTool introduces a technology tool that enables sophisticated personalization and small-batch production for studios and SMBs."',
  },
];

const DUOS = [
  {
    id: 'duo-1',
    img: 'assets/xtool-f2-ultra-uv/content-duo-1.webp',
    title: 'xTool P+F Ultimate Duo',
    desc: 'Maximize efficiency and profitability—the best choice for business owners with enough budget.',
    price: '$6,899.00',
    msrp: '$7,599.00',
    saved: 'Saved $2,098.00',
  },
  {
    id: 'duo-2',
    img: 'assets/xtool-f2-ultra-uv/content-duo-2.webp',
    title: 'F2 Ultra MOPA+UV Ultimate Business Duo',
    desc: 'Your ultimate material master—create 3D crystal engraving, 100+ metal color marking, embossing, and cutting—unlock more high-value customization opportunities.',
    price: '$7,299.00',
    msrp: '$7,999.00',
    saved: 'Saved $1,280.00',
  },
];

const SPEC_ROWS = [
  ['Laser Type', '5W 355 nm UV Laser', 'Processing Mode', 'Laser Engraving & Laser Cutting'],
  ['Inner Engraving Area', '2.8" x 2.8" (70 mm x 70 mm)', 'Surface Engraving Area', '7.9" x 7.9" (200 mm x 200 mm)'],
  ['Area with Conveyor', '7.9" x 19.7" (200 mm x 500 mm)', 'Max. Working Speed', '590.55 ips (15,000 mm/s)'],
  ['Max. Cutting (Basswood)', '0.59" (15 mm) in Multiple Passes', 'Max. Cutting (Acrylic)', '0.47" (12 mm) in Multiple Passes'],
  ['Max. Processing Height', '5.9" (150 mm)', 'Max. Rotary Diameter', '5.9" (150 mm)'],
  ['Supported Software', 'xTool Studio / LightBurn', 'Operating System', 'Windows / macOS'],
  ['Connection Method', 'USB / Wi-Fi / IP', 'Supported Files', '2D: SVG, DXF, PNG, JPG | 3D: STL, OBJ, 3MF, GLB'],
  ['Built-in Camera', '48 MP Dual Cameras', 'Ranging & Focus', 'LiDAR Ranging System + Autofocus'],
  ['Laser Spot Size', '0.02 x 0.02 mm', 'Positioning Accuracy', '0.0079" (0.2 mm)'],
  ['Motion Resolution', '0.00005" (0.00133 mm) Inner Engraving', 'Vector Fitting Resolution', '0.00004" (0.001 mm)'],
];

const FAQS = [
  {
    q: 'Why choose the F2 Ultra UV for glass and crystal customization?',
    a: 'F2 Ultra UV delivers an all-in-one, commercial-grade solution for high-speed, crack-free glass customization. It supports 3D inner engraving, fine surface engraving, embossing, and precision cutting without messy pre-treatment or cleaning.',
  },
  {
    q: 'What materials can the 5W 355 nm UV laser engrave and cut?',
    a: 'It engraves glass, crystal, acrylic, wood, metal, leather, plastic, rubber, silicone, and ceramic. It also cuts glass, plastics (PE, PP, EVA, PET), fabric, leather, non-transparent acrylic, paper, and wood with burn-free cold processing.',
  },
  {
    q: 'How fast is batch production and does it support rotary or conveyor?',
    a: 'With speeds up to 15,000 mm/s (590.55 ips), dual 48MP cameras, and support for conveyor expansion (200 x 500 mm) as well as rotary attachments up to 150 mm diameter, it streamlines scalable batch orders.',
  },
  {
    q: 'Which software and 3D file formats are supported?',
    a: 'F2 Ultra UV works seamlessly with xTool Studio and LightBurn on Windows and macOS via USB, Wi-Fi, or IP. It supports 2D formats (SVG, DXF, JPG, PNG, BMP, WEBP) and 3D formats (STL, OBJ, AMF, 3MF, GLB, PLY) with one-click 2D-to-3D conversion.',
  },
  {
    q: 'What is the difference between UV cold processing and CO2 lasers?',
    a: 'Unlike CO2 lasers that rely on heat and often cause burn marks or micro-cracks on delicate glass and wood, the 355 nm UV laser uses cold photochemical processing with a 0.02 x 0.02 mm spot for smooth, frosty, zero-charring results.',
  },
];

const REVIEWS = [
  {
    author: 'Kaouthar',
    date: '2026-10-04',
    rating: 5,
    title: 'I love my F2 ultra UV!',
    body: 'Awesome machine! High quality engraving on wood, acrylic and crystal. That is what I use it for. If the area of engraving was bigger, that would be a dream!',
  },
  {
    author: 'Stephen H.',
    date: '2026-09-19',
    rating: 5,
    title: 'Amazing machine!!',
    body: 'Had the F2 Ultra UV for over a week now and do not regret anything about it!! Love this machine and the glass capabilities, plus other capabilities. My wife loves the solar system demo file and the whale.',
  },
  {
    author: 'Alex',
    date: '2026-08-26',
    rating: 5,
    title: 'Amazing Quality & Performance!',
    body: 'Absolutely love the F2 Ultra UV! The quality is excellent; it is fast, precise, and very easy to use. We are really happy with our purchase and excited to create more products with it.',
  },
  {
    author: 'Sean',
    date: '2026-08-06',
    rating: 4,
    title: 'Fantastic Versatile Machine',
    body: 'This has been an amazing machine to use across crystal keepsakes and custom woodwork. Setup took about 15 minutes and dual camera alignment is spot on.',
  },
];

const QUESTIONS = [
  {
    author: 'Marcus D.',
    date: '2026-10-12',
    q: 'Can F2 Ultra UV engrave inside standard K9 crystal blocks without cracking?',
    a: 'Yes. The 5W 355 nm UV laser uses cold photochemical processing with a 0.02 x 0.02 mm spot size, producing crisp 3D inner point clouds inside K9 crystals up to 70 x 70 mm without thermal stress or surface cracking.',
  },
  {
    author: 'Elena R.',
    date: '2026-09-28',
    q: 'Does it require any coating spray before engraving clear drinking glasses?',
    a: 'No pre-treatment, black paint, or washing is needed. The 355 nm wavelength is directly absorbed by clear glass and crystal for immediate frosty white engraving.',
  },
  {
    author: 'David K.',
    date: '2026-09-05',
    q: 'Is LightBurn supported out of the box alongside xTool Studio?',
    a: 'Yes, both xTool Studio (Windows/macOS) and LightBurn are supported via USB, Wi-Fi, or IP connection. One-click 2D-to-3D inner crystal conversion is built into xTool Studio.',
  },
];

// 1. Write content reference for sourceAbsent audit
const refItems = [
  ...ROI_CARDS.map((c) => ({ objectId: c.id, title: c.title, description: c.desc })),
  ...MATERIALS.map((c) => ({ objectId: c.id, title: c.title, price: c.price })),
  ...KOLS.map((c) => ({ objectId: c.id, title: c.title, description: c.desc })),
];
fs.writeFileSync(
  path.join(ROOT, REF_REL),
  JSON.stringify(
    {
      kind: 'original-page-content-reference',
      source: 'https://www.xtool.com/collections/machine/products/xtool-f2-ultra-uv-5w-uv-laser-engraver',
      capturedAt: '2026-11-23',
      modules: [{ id: 'pdp', items: refItems }],
    },
    null,
    2
  ) + '\n',
  'utf8'
);

// 2. Canonical components
const breadcrumbHtml = H.compTag('library-breadcrumb', 'default', {
  items: [
    '<div class="ds-breadcrumb__item"><a href="https://www.fs.com/" class="ds-breadcrumb__link">Home</a><span class="ds-breadcrumb__separator" aria-hidden="true">/</span></div>',
    '<div class="ds-breadcrumb__item"><a href="#features" class="ds-breadcrumb__link">Laser Engravers</a><span class="ds-breadcrumb__separator" aria-hidden="true">/</span></div>',
    '<div class="ds-breadcrumb__item"><span class="ds-breadcrumb__current">xTool F2 Ultra UV 5W UV Laser Engraver</span></div>',
  ].join(''),
});

const roiCardsHtml = ROI_CARDS.map((c) =>
  H.compTag(
    'library-card',
    'spliced-vertical-single-event-bordered',
    H.cardProps(
      { id: c.id, title: c.title, desc: c.desc },
      c.img,
      REF_REL,
      { omitCategory: true, omitDesc: false, omitLink: true }
    )
  )
).join('\n');

const materialsCarouselHtml = H.compTag('library-carousel', 'external-cards', {
  columns: 4,
  accessibleLabel: 'Materials for F2 Ultra UV',
  items: MATERIALS.map((m) => ({
    component: 'library-card',
    fragment: 'spliced-vertical-single-event-bordered',
    props: H.cardProps(
      { id: m.id, title: m.title, cta: 'Learn more', href: m.href },
      m.img,
      REF_REL,
      { omitCategory: true, omitDesc: true, omitLink: false }
    ),
  })),
});

const kolCardsHtml = KOLS.map((k) =>
  H.compTag(
    'library-card',
    'spliced-vertical-single-event',
    H.cardProps(k, k.img, REF_REL, { omitCategory: true, omitDesc: false, omitLink: true })
  )
).join('\n');

const faqHtml = H.compTag('library-collapse', 'faq', {
  items: H.faqItemsHtml('uv-faq', FAQS, RELEASE),
});

const rateSummaryHtml = H.compTag('library-rate', 'summary', {
  counts: [108, 2, 0, 0, 0],
  filterCallback: 'onUvReviewFilter',
});

const reviewsTabHtml = H.compTag('library-tab', 'standard', {
  items: H.tabItemsHtml(['Reviews (110)', 'Questions (12)'], 'uv-rev-panel'),
});

const infoDialogHtml = H.compTag('library-dialog', 'information', {
  title: 'Financing, Tax Exemption & Rewards',
  body: [
    '<p>Flexible purchasing programs available for qualified studio and commercial buyers.</p>',
    '<div class="ds-dialog__section"><h3 class="ds-dialog__subtitle">0% APR Monthly Financing</h3><div class="ds-dialog__content"><p>Split your purchase over 24 monthly installments starting at $159/mo with 0% APR for qualified accounts. Prequalification checks do not impact your credit score.</p></div></div>',
    '<div class="ds-dialog__section"><h3 class="ds-dialog__subtitle">Business Tax Exemption (3%–13%)</h3><div class="ds-dialog__content"><p>Submit your resale certificate or non-profit/educational tax-exempt form to apply 3%–13% tax savings to today and future orders.</p></div></div>',
    '<div class="ds-dialog__section"><h3 class="ds-dialog__subtitle">Member Rewards</h3><div class="ds-dialog__content"><p>Earn 5,698 reward points on this order, redeemable for $113.00 off future blank crystals, rotary kits, or spare parts.</p></div></div>',
  ].join(''),
});

const pageCss = `${H.basePageCss()}
/* Original-page-first PDP layout rhythm with full interactive controls */
.pdp-top-section { padding: 24px 0 40px; background: #FFFFFF; }
.pdp-breadcrumb-row { margin-bottom: 20px; }
.pdp-buybox { display: grid; grid-template-columns: minmax(0, 620fr) minmax(0, 520fr); gap: 60px; align-items: start; }
.pdp-gallery__stage { position: relative; width: 100%; aspect-ratio: 4 / 3; background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 20px; box-sizing: border-box; }
.pdp-gallery__main-img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; }
.pdp-gallery__nav { appearance: none; position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; border: 1px solid #DEE0E3; background: rgba(255, 255, 255, 0.92); color: #19191A; font-size: 18px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.15s ease, background-color 0.15s ease; }
.pdp-gallery__nav:hover { border-color: #19191A; background: #FFFFFF; }
.pdp-gallery__nav--prev { left: 14px; }
.pdp-gallery__nav--next { right: 14px; }
.pdp-gallery__counter { position: absolute; right: 14px; bottom: 12px; padding: 2px 10px; border-radius: 999px; background: rgba(25, 25, 26, 0.72); color: #FFFFFF; font-size: 12px; line-height: 18px; }
.pdp-gallery__thumbs { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.pdp-gallery__thumb { appearance: none; padding: 4px; background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 4px; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; cursor: pointer; box-sizing: border-box; }
.pdp-gallery__thumb.is-active, .pdp-gallery__thumb:hover { border-color: #19191A; }
.pdp-gallery__thumb-img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }

.pdp-info__title { margin: 0 0 10px; font-size: 28px; line-height: 36px; font-weight: 600; color: #19191A; }
.pdp-info__rating-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; font-size: 13px; line-height: 20px; color: #707070; }
.pdp-info__rating-link { color: #0060BF; text-decoration: none; }
.pdp-info__rating-link:hover { text-decoration: underline; }
.pdp-highlights { list-style: none; margin: 0 0 20px; padding: 0 0 20px; border-bottom: 1px solid #DEE0E3; display: flex; flex-direction: column; gap: 6px; }
.pdp-highlights__item { font-size: 13px; line-height: 20px; color: #4B4B4D; padding-left: 14px; position: relative; }
.pdp-highlights__item::before { content: "•"; position: absolute; left: 0; color: #19191A; }
.pdp-price-split { display: flex; align-items: flex-start; gap: 28px; margin-bottom: 10px; }
.pdp-price-col { display: flex; flex-direction: column; gap: 4px; }
.pdp-price-col--msrp { padding-left: 28px; border-left: 1px solid #DEE0E3; }
.pdp-price-col__lbl { font-size: 12px; line-height: 18px; color: #707070; }
.pdp-price-col__val { font-size: 26px; line-height: 34px; font-weight: 600; color: #19191A; }
.pdp-price-col__msrp-val { font-size: 20px; line-height: 34px; font-weight: 400; color: #707070; text-decoration: line-through; }
.pdp-price-saved-pill { display: inline-flex; align-items: center; align-self: flex-start; height: 22px; padding: 0 8px; border-radius: 4px; background: #C00000; color: #FFFFFF; font-size: 12px; line-height: 20px; font-weight: 600; margin-top: 2px; }
.pdp-financing { margin: 8px 0 14px; font-size: 14px; line-height: 22px; font-weight: 600; color: #19191A; }
.pdp-financing__btn { appearance: none; border: 0; background: transparent; padding: 0; margin-top: 2px; font-family: inherit; font-size: 12px; line-height: 18px; color: #0060BF; cursor: pointer; display: inline-block; }
.pdp-financing__btn:hover { text-decoration: underline; }
.pdp-perk-stack { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.pdp-perk-btn { appearance: none; width: 100%; background: #FAFBFB; border: 1px solid #DEE0E3; border-radius: 6px; padding: 10px 14px; font-family: inherit; font-size: 12px; line-height: 18px; color: #4B4B4D; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; text-align: left; transition: border-color 0.15s ease; }
.pdp-perk-btn:hover { border-color: #19191A; color: #19191A; }
.pdp-perk-plus { font-size: 16px; line-height: 1; color: #707070; flex-shrink: 0; }
.pdp-pkg-label { font-size: 13px; line-height: 20px; font-weight: 600; color: #19191A; margin: 0 0 10px; }
.pdp-pkg-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 18px; }
.pdp-pkg-btn { appearance: none; text-align: left; padding: 10px 12px; border-radius: 6px; border: 1px solid #DEE0E3; background: #FFFFFF; cursor: pointer; font-family: inherit; display: flex; flex-direction: column; gap: 2px; transition: border-color 0.15s ease; }
.pdp-pkg-btn:hover, .pdp-pkg-btn.is-active { border-color: #19191A; background: #FAFBFB; }
.pdp-pkg-btn__name { font-size: 13px; line-height: 18px; font-weight: 600; color: #19191A; }
.pdp-pkg-btn__price { font-size: 12px; line-height: 18px; color: #707070; }
.pdp-addons-box { border: 1px solid #DEE0E3; border-radius: 6px; padding: 12px 14px; margin-bottom: 20px; background: #FFFFFF; display: flex; flex-direction: column; gap: 10px; }
.pdp-cta-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.editorial-head { margin-bottom: 24px; text-align: left; }
.editorial-head__title { margin: 0 0 8px; font-size: 28px; line-height: 36px; font-weight: 600; color: #19191A; }
.editorial-head__desc { margin: 0; font-size: 14px; line-height: 22px; color: #707070; max-width: 780px; }

.pdp-media-panel { width: 100%; border-radius: 8px; overflow: hidden; background: #FFFFFF; }
.pdp-media-panel__img { width: 100%; height: auto; display: block; }
.pdp-sub-block { margin-top: 32px; }

.crystal-mosaic { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
.crystal-tile { border-radius: 8px; overflow: hidden; background: #14110F; }
.crystal-tile__img { width: 100%; height: auto; display: block; }

/* Material card price + quick add extension */
.mat-price-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; }
.mat-price-cur { font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; }
.mat-quick-add { appearance: none; border: 1px solid #DEE0E3; background: #FFFFFF; color: #19191A; border-radius: 4px; height: 28px; padding: 0 10px; font-family: inherit; font-size: 12px; line-height: 20px; font-weight: 600; cursor: pointer; }
.mat-quick-add:hover { border-color: #C00000; color: #C00000; }

.pdp-media-quote-box { margin-top: 28px; background: #FFFFFF; border-radius: 8px; padding: 32px 48px; text-align: center; }
.pdp-media-quote__source { font-size: 13px; line-height: 20px; font-weight: 600; color: #707070; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px; }
.pdp-media-quote__text { max-width: 820px; margin: 0 auto; font-size: 18px; line-height: 28px; font-weight: 600; color: #19191A; }
.testimonial-dots { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 20px; }
.testimonial-dot { appearance: none; border: 0; padding: 0; flex: 0 0 auto; width: 8px; height: 8px; border-radius: 4px; background: #707070; opacity: 0.4; cursor: pointer; }
.testimonial-dot.is-active { width: 20px; opacity: 1; }

.pdp-hub-card { display: grid; grid-template-columns: minmax(0, 460fr) minmax(0, 740fr); gap: 0; background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; overflow: hidden; align-items: center; }
.pdp-hub-card__body { padding: 36px 40px; }
.pdp-hub-card__title { margin: 0 0 12px; font-size: 24px; line-height: 32px; font-weight: 600; color: #19191A; }
.pdp-hub-card__desc { margin: 0 0 24px; font-size: 14px; line-height: 22px; color: #707070; }
.pdp-hub-card__media { height: 100%; min-height: 340px; }
.pdp-hub-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }

.duo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.duo-card { background: #FFFFFF; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; }
.duo-card__media { width: 100%; height: 280px; background: #FFFFFF; padding: 20px 24px 0; box-sizing: border-box; display: flex; align-items: center; justify-content: center; }
.duo-card__img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
.duo-card__body { padding: 24px 28px 28px; display: flex; flex-direction: column; flex: 1; }
.duo-card__title { margin: 0 0 8px; font-size: 20px; line-height: 28px; font-weight: 600; color: #19191A; }
.duo-card__desc { margin: 0 0 20px; font-size: 14px; line-height: 22px; color: #707070; flex: 1; }
.duo-card__price-row { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.duo-card__price { font-size: 22px; line-height: 30px; font-weight: 600; color: #19191A; }
.duo-card__msrp { font-size: 14px; line-height: 22px; color: #707070; text-decoration: line-through; }
.duo-card__saved { display: inline-flex; align-items: center; height: 22px; padding: 0 8px; border-radius: 4px; background: #FFEBDD; color: #F56300; font-size: 12px; line-height: 20px; font-weight: 600; }
.duo-card__actions { display: flex; align-items: center; gap: 12px; }

.pdp-spec-table { width: 100%; border-collapse: collapse; background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; overflow: hidden; table-layout: fixed; }
.pdp-spec-table th, .pdp-spec-table td { padding: 12px 16px; border: 1px solid #DEE0E3; font-size: 13px; line-height: 20px; text-align: left; vertical-align: top; }
.pdp-spec-table th { width: 20%; background: #FAFBFB; color: #19191A; font-weight: 600; }
.pdp-spec-table td { width: 30%; color: #4B4B4D; }

/* Reviews & Q&A Tabs + Interactive Filter/Sort */
.pdp-reviews-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; border-bottom: 1px solid #DEE0E3; }
.pdp-reviews-controls { display: flex; align-items: center; gap: 12px; padding-bottom: 8px; }
.pdp-sort-btn { appearance: none; border: 1px solid #DEE0E3; background: #FFFFFF; color: #19191A; border-radius: 4px; height: 32px; padding: 0 12px; font-family: inherit; font-size: 12px; line-height: 20px; cursor: pointer; }
.pdp-sort-btn.is-active { border-color: #19191A; font-weight: 600; background: #FAFBFB; }
.pdp-filter-chip { appearance: none; border: 0; background: #F6F6F8; color: #19191A; border-radius: 999px; height: 28px; padding: 0 12px; font-family: inherit; font-size: 12px; cursor: pointer; }
.pdp-filter-chip[hidden] { display: none; }
.pdp-reviews-layout { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 24px; align-items: start; }
.pdp-reviews-summary { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 24px; }
.pdp-reviews-list { display: flex; flex-direction: column; gap: 16px; }
.pdp-review-card { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 20px 24px; }
.pdp-review-card[hidden] { display: none; }
.pdp-review-card__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; gap: 12px; }
.pdp-review-card__title { margin: 0; font-size: 15px; line-height: 22px; font-weight: 600; color: #19191A; }
.pdp-review-card__meta { font-size: 12px; line-height: 18px; color: #707070; white-space: nowrap; }
.pdp-review-card__body { margin: 0; font-size: 14px; line-height: 22px; color: #4B4B4D; }
.pdp-qa-list { display: flex; flex-direction: column; gap: 16px; }
.pdp-qa-card { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 20px 24px; }
.pdp-qa-card__q { margin: 0 0 8px; font-size: 15px; line-height: 22px; font-weight: 600; color: #19191A; }
.pdp-qa-card__a { margin: 0 0 8px; font-size: 14px; line-height: 22px; color: #4B4B4D; }
.pdp-qa-card__meta { font-size: 12px; line-height: 18px; color: #707070; }

/* Sticky Bottom Quick Buy Bar (z-index: 45, safely below 115 Header Mega Menu) */
.pdp-sticky-bar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 45; background: #FFFFFF; border-top: 1px solid #DEE0E3; box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08); transform: translateY(110%); visibility: hidden; pointer-events: none; transition: transform 0.2s ease; }
.pdp-sticky-bar.is-visible { transform: translateY(0); visibility: visible; pointer-events: auto; }
.pdp-sticky-bar__in { max-width: 1200px; margin: 0 auto; height: 68px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.pdp-sticky-bar__left { display: flex; flex-direction: column; min-width: 0; }
.pdp-sticky-bar__title { font-size: 14px; line-height: 20px; font-weight: 600; color: #19191A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pdp-sticky-bar__sub { font-size: 12px; line-height: 18px; color: #707070; }
.pdp-sticky-bar__right { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
.pdp-sticky-bar__price { font-size: 20px; line-height: 28px; font-weight: 600; color: #19191A; }
.pdp-sticky-bar__msrp { font-size: 13px; line-height: 20px; color: #707070; text-decoration: line-through; }

.pdp-cart-toast { position: fixed; right: 24px; bottom: 84px; z-index: 60; background: #19191A; color: #FFFFFF; padding: 10px 16px; border-radius: 6px; font-size: 13px; line-height: 20px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18); opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.pdp-cart-toast.is-show { opacity: 1; }
`;

const pageSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>xTool F2 Ultra UV 5W UV Laser Engraver</title>
  <style>${pageCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}

  <main>
    <!-- 1. Buy-Box -->
    <section class="pdp-top-section" id="buy-box">
      <div class="container">
        <div class="pdp-breadcrumb-row">${breadcrumbHtml}</div>
        <div class="pdp-buybox">
          <div class="pdp-gallery">
            <div class="pdp-gallery__stage">
              <button type="button" class="pdp-gallery__nav pdp-gallery__nav--prev" id="pdp-gal-prev" aria-label="Previous image">&#8249;</button>
              <img class="pdp-gallery__main-img" id="pdp-main-img" src="${H.esc(GALLERY[0].src)}" alt="${H.esc(GALLERY[0].alt)}">
              <button type="button" class="pdp-gallery__nav pdp-gallery__nav--next" id="pdp-gal-next" aria-label="Next image">&#8250;</button>
              <span class="pdp-gallery__counter" id="pdp-gal-counter">1 / ${GALLERY.length}</span>
            </div>
            <div class="pdp-gallery__thumbs" role="list" aria-label="Product gallery thumbnails">
              ${GALLERY.map(
                (g, i) =>
                  `<button type="button" class="pdp-gallery__thumb${i === 0 ? ' is-active' : ''}" data-gallery-idx="${i}" aria-label="View image ${i + 1}"><img class="pdp-gallery__thumb-img" src="${H.esc(g.src)}" alt="${H.esc(g.alt)}"></button>`
              ).join('')}
            </div>
          </div>

          <div class="pdp-info">
            <h1 class="pdp-info__title">xTool F2 Ultra UV 5W UV Laser Engraver</h1>
            <div class="pdp-info__rating-row">
              ${H.compTag('library-rate', 'display', {})}
              <a class="pdp-info__rating-link" href="#reviews">110 reviews</a>
            </div>

            <ul class="pdp-highlights">
              ${HIGHLIGHTS.map((h) => `<li class="pdp-highlights__item">${H.esc(h)}</li>`).join('')}
            </ul>

            <div class="pdp-price-split">
              <div class="pdp-price-col">
                <span class="pdp-price-col__lbl">Final Price</span>
                <span class="pdp-price-col__val" id="pdp-price-current">$3,799.00</span>
                <span class="pdp-price-saved-pill" id="pdp-price-saved">Saved $500.00</span>
              </div>
              <div class="pdp-price-col pdp-price-col--msrp">
                <span class="pdp-price-col__lbl">MSRP</span>
                <span class="pdp-price-col__msrp-val" id="pdp-price-msrp">$4,299.00</span>
              </div>
            </div>

            <div class="pdp-financing">
              <div id="pdp-price-monthly">or $159/mo, 0% APR for 24 months</div>
              <button type="button" class="pdp-financing__btn" data-open-info-dialog="">Prequalify or view other financing options +</button>
            </div>

            <div class="pdp-perk-stack">
              <button type="button" class="pdp-perk-btn" data-open-info-dialog="">
                <span>Tax exemption: 3% - 13% tax savings for today and future orders.</span>
                <span class="pdp-perk-plus" aria-hidden="true">+</span>
              </button>
              <button type="button" class="pdp-perk-btn" data-open-info-dialog="">
                <span>Member rewards: Earn 5,698 points today, redeem for $113.00 off on your next order.</span>
                <span class="pdp-perk-plus" aria-hidden="true">+</span>
              </button>
            </div>

            <p class="pdp-pkg-label">Package</p>
            <div class="pdp-pkg-grid" role="group" aria-label="Package selection">
              ${PACKAGES.map(
                (p, i) =>
                  `<button type="button" class="pdp-pkg-btn${i === 0 ? ' is-active' : ''}" data-pkg-idx="${i}" aria-pressed="${i === 0 ? 'true' : 'false'}"><span class="pdp-pkg-btn__name">${H.esc(p.label)}</span><span class="pdp-pkg-btn__price">$${p.priceNum.toLocaleString('en-US')}.00</span></button>`
              ).join('')}
            </div>

            <p class="pdp-pkg-label">Optional Protection &amp; Accessories</p>
            <div class="pdp-addons-box" id="pdp-addons">
              ${ADDONS.map((a) =>
                H.compTag('library-checkbox', 'sm', {
                  label: a.label,
                  name: a.name,
                  value: String(a.priceNum),
                  changeCallback: 'onUvAddonChange',
                })
              ).join('\n')}
            </div>

            <div class="pdp-cta-row">
              ${H.compTag('library-input-number', 'outline-sm', { value: 1, min: 1, max: 99, accessibleLabel: 'Quantity', changeCallback: 'onUvQtyChange' })}
              ${H.compTag('library-button', 'filled-red', { label: 'Add to Cart', size: 'xl-regular', actionCallback: 'onUvAddToCart' })}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Features Full-Width Showcase -->
    <section class="page-section page-section--gray" id="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Features</h2>
        </div>
        <div class="pdp-media-panel">
          <img class="pdp-media-panel__img" src="assets/xtool-f2-ultra-uv/content-features-1.webp" alt="xTool F2 Ultra UV Features Overview">
        </div>
      </div>
    </section>

    <!-- 3. Real Users. Real Results. Real ROI. -->
    <section class="page-section" id="user-stories">
      <div class="container">
        <div class="editorial-head">
          <h2 class="editorial-head__title">Real Users. Real Results. Real ROI.</h2>
          <p class="editorial-head__desc">Real users, real businesses, incredible returns. See how xTool F2 Ultra UV is fueling growth for creators just like you.</p>
        </div>
        <div class="grid grid--4">
          ${roiCardsHtml}
        </div>
      </div>
    </section>

    <!-- 4. High-Margin Crystal Engraving & Batch Reliability -->
    <section class="page-section page-section--gray">
      <div class="container">
        <div class="editorial-head">
          <h2 class="editorial-head__title">Grow Your Business with High-Margin Crystal Engraving</h2>
          <p class="editorial-head__desc">Create the intricate 3D crystal keepsakes trending on Etsy with F2 Ultra UV, perfect for weddings, graduations, championships, and more.</p>
        </div>
        <div class="crystal-mosaic">
          ${CRYSTAL_GALLERY.map(
            (c) => `<div class="crystal-tile"><img class="crystal-tile__img" src="${H.esc(c.img)}" alt="${H.esc(c.title)}"></div>`
          ).join('\n')}
        </div>

        <div class="pdp-sub-block">
          <div class="editorial-head">
            <h2 class="editorial-head__title">Right from the First Piece. Reliable Every Batch.</h2>
          </div>
          <div class="pdp-media-panel">
            <img class="pdp-media-panel__img" src="assets/xtool-f2-ultra-uv/content-batch-1.png" alt="Right from the First Piece Reliable Every Batch">
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Materials for F2 Ultra UV -->
    <section class="page-section" id="materials">
      <div class="container">
        <div class="editorial-head">
          <h2 class="editorial-head__title">Materials for F2 Ultra UV</h2>
        </div>
        ${materialsCarouselHtml}
      </div>
    </section>

    <!-- 6. Genuine Praise from Real Users & Media Quotes -->
    <section class="page-section page-section--gray">
      <div class="container">
        <div class="editorial-head">
          <h2 class="editorial-head__title">Genuine Praise from Real Users</h2>
        </div>
        <div class="grid grid--3">
          ${kolCardsHtml}
        </div>
        <div class="pdp-media-quote-box" id="media-quote-box">
          <p class="pdp-media-quote__source" id="media-quote-source">${H.esc(MEDIA_QUOTES[0].source)}</p>
          <p class="pdp-media-quote__text" id="media-quote-text">${H.esc(MEDIA_QUOTES[0].quote)}</p>
          <div class="testimonial-dots" role="tablist" aria-label="Media quotes pagination">
            ${MEDIA_QUOTES.map(
              (q, i) =>
                `<button type="button" class="testimonial-dot${i === 0 ? ' is-active' : ''}" data-quote-idx="${i}" aria-label="Quote ${i + 1}: ${H.esc(q.source)}"></button>`
            ).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Service Hubs & Demo Rooms -->
    <section class="page-section" id="service-hubs">
      <div class="container">
        <div class="pdp-hub-card">
          <div class="pdp-hub-card__body">
            <h2 class="pdp-hub-card__title">2,000+ Service Hubs &amp; Demo Rooms Across North America</h2>
            <p class="pdp-hub-card__desc">Experience the ultimate reassurance with a comprehensive pre- and post-sale network. Visit our premier Demo Rooms to see the machine in action, get expert technical answers, and checkout with 100% confidence.</p>
            ${H.compTag('library-button', 'outline-black', { label: 'Book Your Demo', size: 'xl', actionCallback: 'onUvBookDemo' })}
          </div>
          <div class="pdp-hub-card__media">
            <img class="pdp-hub-card__img" src="assets/xtool-f2-ultra-uv/content-servicehub-1.webp" alt="2,000+ Service Hubs and Demo Rooms Across North America">
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Ultimate Business Duo Bundles & In the Box -->
    <section class="page-section page-section--gray" id="bundles">
      <div class="container">
        <div class="duo-grid">
          ${DUOS.map(
            (d) => `<div class="duo-card">
              <div class="duo-card__media">
                <img class="duo-card__img" src="${H.esc(d.img)}" alt="${H.esc(d.title)}">
              </div>
              <div class="duo-card__body">
                <h3 class="duo-card__title">${H.esc(d.title)}</h3>
                <p class="duo-card__desc">${H.esc(d.desc)}</p>
                <div class="duo-card__price-row">
                  <span class="duo-card__price">${H.esc(d.price)}</span>
                  <span class="duo-card__msrp">${H.esc(d.msrp)}</span>
                  <span class="duo-card__saved">${H.esc(d.saved)}</span>
                </div>
                <div class="duo-card__actions">
                  ${H.compTag('library-button', 'filled-red', { label: 'Add to Cart', size: 'xl-regular', actionCallback: 'onUvAddToCart' })}
                  ${H.compTag('library-button', 'outline-black', { label: 'Learn more', size: 'xl', actionCallback: 'scrollToBuyBox' })}
                </div>
              </div>
            </div>`
          ).join('\n')}
        </div>

        <div class="pdp-sub-block">
          <div class="section-header">
            <h2 class="section-header__title">In the Box</h2>
          </div>
          <div class="pdp-media-panel">
            <img class="pdp-media-panel__img" src="assets/xtool-f2-ultra-uv/content-inthebox-1.webp" alt="What is in the box for xTool F2 Ultra UV">
          </div>
        </div>
      </div>
    </section>

    <!-- 9. Specifications -->
    <section class="page-section" id="specs">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Specifications</h2>
        </div>
        <table class="pdp-spec-table">
          <tbody>
            ${SPEC_ROWS.map(
              ([k1, v1, k2, v2]) =>
                `<tr><th scope="row">${H.esc(k1)}</th><td>${H.esc(v1)}</td><th scope="row">${H.esc(k2)}</th><td>${H.esc(v2)}</td></tr>`
            ).join('\n')}
          </tbody>
        </table>
      </div>
    </section>

    <!-- 10. FAQ -->
    <section class="page-section page-section--gray" id="faq">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">FAQ</h2>
        </div>
        ${faqHtml}
      </div>
    </section>

    <!-- 11. Customer Reviews & Questions Tabs + Interactive Filter/Sort -->
    <section class="page-section" id="reviews">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Customer Reviews</h2>
          <p class="section-header__desc">4.98 out of 5 average rating based on 110 verified buyer reviews.</p>
        </div>

        <div class="pdp-reviews-toolbar">
          ${reviewsTabHtml}
          <div class="pdp-reviews-controls" id="pdp-rev-controls">
            <button type="button" class="pdp-filter-chip" id="pdp-rev-clear" hidden="">Clear star filter ×</button>
            <button type="button" class="pdp-sort-btn is-active" data-rev-sort="recent">Most Recent</button>
            <button type="button" class="pdp-sort-btn" data-rev-sort="rating">Highest Rating</button>
          </div>
        </div>

        <div id="uv-rev-panel-0">
          <div class="pdp-reviews-layout">
            <div class="pdp-reviews-summary">
              ${rateSummaryHtml}
            </div>
            <div class="pdp-reviews-list" id="pdp-reviews-list">
              ${REVIEWS.map(
                (r) => `<div class="pdp-review-card" data-review-rating="${r.rating}" data-review-date="${r.date}">
                  <div class="pdp-review-card__head">
                    <h3 class="pdp-review-card__title">${H.esc(r.title)}</h3>
                    <span class="pdp-review-card__meta">${r.rating}.0 ★ · ${H.esc(r.author)} · ${H.esc(r.date)}</span>
                  </div>
                  <p class="pdp-review-card__body">${H.esc(r.body)}</p>
                </div>`
              ).join('\n')}
            </div>
          </div>
        </div>

        <div id="uv-rev-panel-1" hidden="">
          <div class="pdp-qa-list">
            ${QUESTIONS.map(
              (item) => `<div class="pdp-qa-card">
                <p class="pdp-qa-card__q">Q: ${H.esc(item.q)}</p>
                <p class="pdp-qa-card__a">A: ${H.esc(item.a)}</p>
                <div class="pdp-qa-card__meta">Asked by ${H.esc(item.author)} · ${H.esc(item.date)}</div>
              </div>`
            ).join('\n')}
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Native FS Information Dialog for Financing / Tax Exemption / Rewards -->
  ${infoDialogHtml}

  <!-- Sticky Bottom Quick Buy Bar -->
  <div class="pdp-sticky-bar" id="pdp-sticky-bar" aria-label="Quick purchase bar">
    <div class="pdp-sticky-bar__in">
      <div class="pdp-sticky-bar__left">
        <span class="pdp-sticky-bar__title" id="sticky-title">xTool F2 Ultra UV — F2 Ultra UV Standalone</span>
        <span class="pdp-sticky-bar__sub">Order today, ships in 1 business day</span>
      </div>
      <div class="pdp-sticky-bar__right">
        <span class="pdp-sticky-bar__price" id="sticky-price">$3,799.00</span>
        <span class="pdp-sticky-bar__msrp" id="sticky-msrp">$4,299.00</span>
        ${H.compTag('library-button', 'filled-red', { label: 'Add to Cart', size: 'xl-regular', actionCallback: 'onUvAddToCart' })}
      </div>
    </div>
  </div>

  <div class="pdp-cart-toast" id="pdp-toast" role="status" aria-live="polite"></div>

  ${H.compTag('library-navigation', 'footer', {})}

  <script>
    (function () {
      var GALLERY = ${JSON.stringify(GALLERY)};
      var PACKAGES = ${JSON.stringify(PACKAGES)};
      var QUOTES = ${JSON.stringify(MEDIA_QUOTES)};

      // 1. Gallery Prev/Next + Counter + Thumbnails
      var galIdx = 0;
      var mainImg = document.getElementById('pdp-main-img');
      var galCounter = document.getElementById('pdp-gal-counter');
      var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-idx]'));
      function setGallery(idx) {
        galIdx = (idx + GALLERY.length) % GALLERY.length;
        var item = GALLERY[galIdx];
        if (mainImg) { mainImg.src = item.src; mainImg.alt = item.alt; }
        if (galCounter) galCounter.textContent = (galIdx + 1) + ' / ' + GALLERY.length;
        thumbs.forEach(function (b, i) { b.classList.toggle('is-active', i === galIdx); });
      }
      thumbs.forEach(function (btn) {
        btn.addEventListener('click', function () { setGallery(Number(btn.getAttribute('data-gallery-idx'))); });
      });
      var prevBtn = document.getElementById('pdp-gal-prev');
      var nextBtn = document.getElementById('pdp-gal-next');
      if (prevBtn) prevBtn.addEventListener('click', function () { setGallery(galIdx - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { setGallery(galIdx + 1); });

      // 2. Package + Add-ons + Quantity Dynamic Pricing & Sticky Bar Sync
      var pkgBtns = Array.prototype.slice.call(document.querySelectorAll('[data-pkg-idx]'));
      var priceCur = document.getElementById('pdp-price-current');
      var priceMsrp = document.getElementById('pdp-price-msrp');
      var priceSaved = document.getElementById('pdp-price-saved');
      var priceMo = document.getElementById('pdp-price-monthly');
      var stickyTitle = document.getElementById('sticky-title');
      var stickyPrice = document.getElementById('sticky-price');
      var stickyMsrp = document.getElementById('sticky-msrp');
      var activePkg = PACKAGES[0];
      var qty = 1;

      function fmtMoney(n) {
        return '$' + n.toLocaleString('en-US') + '.00';
      }
      function getAddonSum() {
        var sum = 0;
        document.querySelectorAll('#pdp-addons input[type="checkbox"]:checked').forEach(function (cb) {
          sum += Number(cb.value) || 0;
        });
        return sum;
      }
      function syncPrice() {
        var addonSum = getAddonSum();
        var unitTotal = activePkg.priceNum + addonSum;
        var total = unitTotal * qty;
        var msrpTotal = (activePkg.msrpNum + addonSum) * qty;
        var savedTotal = activePkg.savedNum * qty;
        var monthly = Math.ceil(total / 24);
        if (priceCur) priceCur.textContent = fmtMoney(total);
        if (priceMsrp) priceMsrp.textContent = fmtMoney(msrpTotal);
        if (priceSaved) priceSaved.textContent = 'Saved ' + fmtMoney(savedTotal);
        if (priceMo) priceMo.textContent = 'or $' + monthly + '/mo, 0% APR for 24 months';
        if (stickyTitle) stickyTitle.textContent = 'xTool F2 Ultra UV — ' + activePkg.label + (qty > 1 ? ' (×' + qty + ')' : '');
        if (stickyPrice) stickyPrice.textContent = fmtMoney(total);
        if (stickyMsrp) stickyMsrp.textContent = fmtMoney(msrpTotal);
      }

      pkgBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var idx = Number(btn.getAttribute('data-pkg-idx'));
          activePkg = PACKAGES[idx] || PACKAGES[0];
          pkgBtns.forEach(function (b, i) {
            b.classList.toggle('is-active', i === idx);
            b.setAttribute('aria-pressed', i === idx ? 'true' : 'false');
          });
          setGallery(idx);
          syncPrice();
        });
      });

      window.onUvAddonChange = function () { syncPrice(); };
      window.onUvQtyChange = function () {
        var inp = document.querySelector('#buy-box .ds-input-number__input');
        qty = Math.max(1, Number(inp ? inp.value : 1) || 1);
        syncPrice();
      };

      // 3. Financing / Tax Exemption / Rewards Native Dialog
      var infoDialog = document.querySelector('dialog[data-library-component="library-dialog"]');
      document.querySelectorAll('[data-open-info-dialog]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (infoDialog && typeof infoDialog.showModal === 'function') infoDialog.showModal();
        });
      });

      // 4. Sticky Bottom Buy Bar Visibility
      var stickyBar = document.getElementById('pdp-sticky-bar');
      var buyBox = document.getElementById('buy-box');
      if (stickyBar && buyBox) {
        window.addEventListener('scroll', function () {
          var rect = buyBox.getBoundingClientRect();
          stickyBar.classList.toggle('is-visible', rect.bottom < 0);
        }, { passive: true });
      }

      // 5. Media Quotes Pagination
      var quoteSrc = document.getElementById('media-quote-source');
      var quoteTxt = document.getElementById('media-quote-text');
      var qDots = Array.prototype.slice.call(document.querySelectorAll('[data-quote-idx]'));
      qDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          var idx = Number(dot.getAttribute('data-quote-idx'));
          var q = QUOTES[idx] || QUOTES[0];
          if (quoteSrc) quoteSrc.textContent = q.source;
          if (quoteTxt) quoteTxt.textContent = q.quote;
          qDots.forEach(function (d, i) { d.classList.toggle('is-active', i === idx); });
        });
      });

      // 6. Reviews / Questions Tabs + Star Filter + Sort
      var revControls = document.getElementById('pdp-rev-controls');
      var revPanel0 = document.getElementById('uv-rev-panel-0');
      var revPanel1 = document.getElementById('uv-rev-panel-1');
      var revTabs = Array.prototype.slice.call(document.querySelectorAll('#reviews [data-tab-item]'));
      revTabs.forEach(function (tab, idx) {
        tab.addEventListener('click', function () {
          if (revPanel0) revPanel0.hidden = idx !== 0;
          if (revPanel1) revPanel1.hidden = idx !== 1;
          if (revControls) revControls.style.visibility = idx === 0 ? 'visible' : 'hidden';
        });
      });

      var activeStar = null;
      var clearChip = document.getElementById('pdp-rev-clear');
      var revList = document.getElementById('pdp-reviews-list');
      function applyReviewFilter() {
        if (!revList) return;
        revList.querySelectorAll('[data-review-rating]').forEach(function (card) {
          var r = Number(card.getAttribute('data-review-rating'));
          card.hidden = activeStar !== null && r !== activeStar;
        });
        if (clearChip) {
          clearChip.hidden = activeStar === null;
          if (activeStar !== null) clearChip.textContent = activeStar + ' Stars Filter ×';
        }
      }
      window.onUvReviewFilter = function (e) {
        var val = e && e.detail ? Number(e.detail.rating || e.detail.value) : null;
        activeStar = (val && activeStar !== val) ? val : null;
        applyReviewFilter();
      };
      if (clearChip) {
        clearChip.addEventListener('click', function () {
          activeStar = null;
          applyReviewFilter();
        });
      }
      document.querySelectorAll('[data-rev-sort]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var mode = btn.getAttribute('data-rev-sort');
          document.querySelectorAll('[data-rev-sort]').forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          if (!revList) return;
          var cards = Array.prototype.slice.call(revList.children);
          cards.sort(function (a, b) {
            if (mode === 'rating') return Number(b.getAttribute('data-review-rating')) - Number(a.getAttribute('data-review-rating'));
            return String(b.getAttribute('data-review-date')).localeCompare(String(a.getAttribute('data-review-date')));
          });
          cards.forEach(function (c) { revList.appendChild(c); });
        });
      });

      // 7. Toast & Quick Cart Handlers
      var toastEl = document.getElementById('pdp-toast');
      var toastTimer;
      function showToast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('is-show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2400);
      }

      document.addEventListener('click', function (e) {
        var matBtn = e.target.closest('[data-mat-add]');
        if (matBtn) {
          showToast('Added ' + matBtn.getAttribute('data-mat-add') + ' to cart.');
        }
      });

      window.onUvAddToCart = function () {
        var total = (activePkg.priceNum + getAddonSum()) * qty;
        showToast('Added ' + activePkg.label + ' ×' + qty + ' (' + fmtMoney(total) + ') to cart.');
      };
      window.onUvBookDemo = function () {
        showToast('Demo inquiry opened for ' + activePkg.label + '.');
      };
      window.scrollToBuyBox = function () {
        if (buyBox) buyBox.scrollIntoView({ behavior: 'smooth' });
      };
    })();
  </script>
</body>
</html>
`;

const outRel = 'pages/xtool-f2-ultra-uv-pc.html';
let assembled = H.assembleLocalPage(pageSource, outRel);

// Inject data-fs-extend="product-price" + quick "+ Add" button into the 6 Material cards inside #materials carousel
const { JSDOM } = require(path.join(ROOT, 'design-system/node_modules/jsdom'));
const dom = new JSDOM(assembled);
const matBodies = dom.window.document.querySelectorAll('#materials .ds-card__body');
matBodies.forEach((body, idx) => {
  const m = MATERIALS[idx];
  if (!m) return;
  const priceDiv = dom.window.document.createElement('div');
  priceDiv.className = 'mat-price-row';
  priceDiv.setAttribute('data-fs-extend', 'product-price');
  priceDiv.innerHTML = `<span class="mat-price-cur">${H.esc(m.price)}</span><button type="button" class="mat-quick-add" data-mat-add="${H.esc(m.title)}">+ Add</button>`;
  const linkEl = body.querySelector('.ds-card__link');
  if (linkEl) body.insertBefore(priceDiv, linkEl);
  else body.appendChild(priceDiv);
});
assembled = dom.serialize();

fs.writeFileSync(path.join(ROOT, outRel), assembled, 'utf8');
console.log('Generated (Full Interactive PDP):', outRel, 'release:', RELEASE.slice(0, 12));
