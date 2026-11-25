#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const H = require('../page-helpers.cjs');

const ROOT = path.resolve(__dirname, '../..');
const SLUG = 'se-smart-panels';
const SOURCE_REF = `reference-inputs/${SLUG}/content.json`;
const RELEASE = H.getActiveRelease();

const HERO_SLIDES = [
  {
    title: 'Smart Panels give your electrical system a voice',
    description:
      'Get relevant and informative data to make the right decisions, at the right time with Smart Panels and EcoStruxure technologies.',
    primaryLabel: 'Watch the video',
    primaryAction: 'video',
    secondaryLabel: 'View the brochure',
    secondaryHref:
      'https://download.se.com/files?p_enDocType=Brochure&p_File_Name=998-20135902_GMA-US.pdf&p_Doc_Ref=998-20135902_GMA-US',
    image: `assets/${SLUG}/hero-1.jpg`,
  },
  {
    title: 'Introducing EcoStruxure™ Power',
    description:
      'IoT-connected solutions ready to improve every aspect of your power distribution system. Take total control with real-time data and smart analytics for predictive maintenance.',
    primaryLabel: 'Discover EcoStruxure Power',
    primaryHref: 'https://www.se.com/sg/en/work/campaign/innovation/power-distribution',
    secondaryLabel: '',
    secondaryHref: '',
    image: `assets/${SLUG}/hero-2.jpg`,
  },
  {
    title: 'How can you get the proper expertise on Smart Panels?',
    description:
      'The EcoXpert programme will provide the right digital expertise and competency certification. It is a worldwide network of expert system integrators, applications providers, and technology companies.',
    primaryLabel: 'Discover the partner programme',
    primaryHref: 'https://www.se.com/sg/en/partners/ecoxpert',
    secondaryLabel: '',
    secondaryHref: '',
    image: `assets/${SLUG}/hero-3.jpg`,
  },
];

const PILLARS = [
  {
    objectId: 'pillar-protect',
    title: 'Protect',
    description:
      'Help safeguard people and equipment with reliable, high-performance technology in every breaker and residual current device.',
    image: `assets/${SLUG}/feat-protect.jpg`,
    alt: 'Smart Panel circuit breaker protection',
  },
  {
    objectId: 'pillar-measure',
    title: 'Measure',
    description:
      'Smart sensors and connected offers enable your panel to send you all the data you need for better energy efficiency with alarming and maintenance notifications.',
    image: `assets/${SLUG}/feat-measure.jpg`,
    alt: 'Engineer installing smart energy sensors inside electrical panel',
  },
  {
    objectId: 'pillar-connect',
    title: 'Connect',
    description:
      'Smart Panels connect via Ethernet or wirelessly, so you can use minimal bandwidth and monitor your building in real-time.',
    image: `assets/${SLUG}/feat-connect.jpg`,
    alt: 'Connecting Ethernet cable to Smart Panel communication module',
  },
];

const RELATED_PRODUCTS = [
  {
    objectId: 'prod-01',
    title: 'MasterPact MTZ',
    description: 'High-current air circuit breakers with embedded digital metering and connectivity.',
    image: `assets/${SLUG}/prod-01-masterpact.jpg`,
    href: 'https://www.se.com/sg/en/product-range/63545-masterpact-mtz/',
  },
  {
    objectId: 'prod-02',
    title: 'Din rail modular devices',
    description: 'Modular protection, control, and energy metering devices for final distribution.',
    image: `assets/${SLUG}/prod-02-dinrail.jpg`,
    href: 'https://www.se.com/sg/en/product-category/1600-din-rail-modular-devices/',
  },
  {
    objectId: 'prod-03',
    title: 'PowerLogic™ PowerTag',
    description: 'Wireless energy sensors delivering real-time load monitoring and power alarming.',
    image: `assets/${SLUG}/prod-03-powertag.jpg`,
    href: 'https://www.se.com/sg/en/product-range/63626-powerlogic-powertag/',
  },
  {
    objectId: 'prod-04',
    title: 'Power Monitoring and Control',
    description: 'Meters, gateways, and software for facility-wide power quality and energy visibility.',
    image: `assets/${SLUG}/prod-04-powermon.jpg`,
    href: 'https://www.se.com/sg/en/product-category/4100-power-monitoring-and-control/',
  },
  {
    objectId: 'prod-05',
    title: 'Enerlin’X IFE, EIFE, IFM',
    description: 'Ethernet and Modbus communication interfaces for connected circuit breakers.',
    image: `assets/${SLUG}/prod-05-enerlinx.jpg`,
    href: 'https://www.se.com/sg/en/product-range/62413-enerlinx-ife-eife-ifm/',
  },
  {
    objectId: 'prod-06',
    title: 'Acti 9 Smartlink Modbus',
    description: 'Smart communication gateway aggregating metering and status data from DIN rail devices.',
    image: `assets/${SLUG}/prod-06-acti9.jpg`,
    href: 'https://www.se.com/sg/en/product-range/61356-acti-9-smartlink-modbus/',
  },
  {
    objectId: 'prod-07',
    title: 'MicroLogic',
    description: 'Electronic trip units providing advanced protection, measurement, and diagnostics.',
    image: `assets/${SLUG}/prod-07-micrologic.jpg`,
    href: 'https://www.se.com/sg/en/product-range/1008-micrologic/',
  },
  {
    objectId: 'prod-08',
    title: 'EcoStruxure™ Panel Server',
    description: 'High-performance IoT gateway connecting wireless and wired devices to cloud analytics.',
    image: `assets/${SLUG}/prod-08-panelserver.jpg`,
    href: 'https://www.se.com/sg/en/product-range/40739468-ecostruxure-panel-server/',
  },
  {
    objectId: 'prod-09',
    title: 'ComPacT NSX, new generation',
    description: 'Moulded case circuit breakers engineered for reliability and wireless auxiliary connectivity.',
    image: `assets/${SLUG}/prod-09-nsx.jpg`,
    href: 'https://www.se.com/sg/en/product-range/39910531-compact-nsx-new-generation/',
  },
  {
    objectId: 'prod-10',
    title: 'ComPacT NSXm, new generation',
    description: 'Compact circuit breakers with EverLink connectors and integrated energy monitoring.',
    image: `assets/${SLUG}/prod-10-nsxm.jpg`,
    href: 'https://www.se.com/sg/en/product-range/39910433-compact-nsxm-new-generation/',
  },
];

const ECO_SLIDES = [
  {
    title: 'Introducing EcoStruxure Power',
    description:
      'EcoStruxure Power delivers safe, highly reliable, and energy-efficient electrical distribution systems for low and medium voltage architectures.',
    linkLabel: 'Learn more about EcoStruxure Power',
    href: 'https://www.se.com/sg/en/work/campaign/innovation/power-distribution',
    image: `assets/${SLUG}/eco-slide-1.jpg`,
    alt: 'Introducing EcoStruxure Power overview video',
  },
  {
    title: 'Think big. Partner up.',
    description:
      'The Schneider Electric Partner Program provides software, tools, and educational resources you can use to stay on top of the latest trends, and ahead of the competition.',
    linkLabel: 'Learn more about our Partner Programme',
    href: 'https://www.se.com/sg/en/partners/',
    image: `assets/${SLUG}/eco-slide-2.jpg`,
    alt: 'Schneider Electric Partner Program',
  },
  {
    title: 'Discover Masterpact MTZ',
    description:
      'Integrate seamlessly and improve uptime with Smart Panels and EcoStruxure energy and asset monitoring technologies.',
    linkLabel: 'Explore MasterPact MTZ',
    href: 'https://www.se.com/sg/en/product-range/63545-masterpact-mtz/',
    image: `assets/${SLUG}/eco-slide-3.jpg`,
    alt: 'MasterPact MTZ connected circuit breaker inside Smart Panel',
  },
];

const BLOG_ARTICLES = [
  {
    title: 'The Fire-Preventing Advantages of IIoT Digitised Power',
    href: 'https://blog.se.com/power-management-metering-monitoring-power-quality/2020/06/02/the-fire-preventing-advantages-of-iiot-digitized-power/',
  },
  {
    title: 'Business Interruption Prevention-The Advantages of IIoT Digitised Power',
    href: 'https://blog.se.com/power-management-metering-monitoring-power-quality/2020/07/22/business-interruption-prevention-the-advantages-of-iiot-digitized-power/',
  },
  {
    title: 'Compliance & Risk Management – The Advantages of IIoT Digitised Power',
    href: 'https://blog.se.com/power-management-metering-monitoring-power-quality/2020/10/15/compliance-risk-management-the-advantages-of-iiot-digitized-power/',
  },
  {
    title: '21 Power Distribution Facts',
    href: 'https://blog.se.com/power-management-metering-monitoring-power-quality/2019/07/18/infographic-21-power-distribution-facts/',
  },
];

const HELP_CARDS = [
  {
    objectId: 'help-selector',
    title: 'Product Selector',
    description: 'Quickly and easily find the right products and accessories for your applications.',
    href: 'https://www.se.com/sg/en/work/support/product-selector/',
    icon: `assets/${SLUG}/icon-product-selector.svg`,
  },
  {
    objectId: 'help-quote',
    title: 'Get a Quote',
    description: 'Start your sales enquiry online and an expert will connect with you.',
    href: 'https://www.se.com/sg/en/work/support/customer-care/contact-sales.jsp',
    icon: `assets/${SLUG}/icon-get-quote.svg`,
  },
  {
    objectId: 'help-buy',
    title: 'Where to buy?',
    description: 'Easily find the nearest Schneider Electric distributor in your location.',
    href: 'https://www.se.com/sg/en/locate/325',
    icon: `assets/${SLUG}/icon-where-to-buy.svg`,
  },
  {
    objectId: 'help-centre',
    title: 'Help Centre',
    description: 'Find support resources for all your needs, in one place.',
    href: 'https://www.se.com/sg/en/work/support/',
    icon: `assets/${SLUG}/icon-help-centre.svg`,
  },
];

// 1. Breadcrumb
const breadcrumbItemsHtml = [
  { text: 'Home', href: 'https://www.se.com/sg/en/' },
  { text: 'For Your Business', href: 'https://www.se.com/sg/en/work' },
  { text: 'Smart Panels', href: null },
]
  .map((b) =>
    b.href
      ? `<div class="ds-breadcrumb__item"><a href="${H.esc(b.href)}" class="ds-breadcrumb__link">${H.esc(b.text)}</a><span class="ds-breadcrumb__separator" aria-hidden="true">/</span></div>`
      : `<div class="ds-breadcrumb__item"><span class="ds-breadcrumb__current">${H.esc(b.text)}</span></div>`
  )
  .join('');

// 2. Hero Banner (native dual white-outline CTA)
const heroBanner = H.compTag('library-banner', 'hero-responsive', {
  title: HERO_SLIDES[0].title,
  description: HERO_SLIDES[0].description,
  actionLabel: HERO_SLIDES[0].primaryLabel,
  actionCallback: 'handleHeroPrimaryAction',
  secondaryActionLabel: HERO_SLIDES[0].secondaryLabel,
  secondaryActionHref: HERO_SLIDES[0].secondaryHref,
  surface: 'image',
});

// 3. Intro Horizontal Card
const introCard = H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
  title: 'Say hello to Smart Panels, an EcoStruxure Power solution',
  description:
    'Now your electrical panel is your partner. By connecting cutting-edge hardware with innovative software, Smart Panels enable you to pinpoint overloads and inefficiencies proactively, make informed decisions that improve operational efficiency, and finally stop chasing vague alarms.',
  image: `<img src="assets/${SLUG}/intro-panel.jpg" alt="Smart Panel connected electrical switchboard">`,
  imagePosition: 'left',
  sourceAbsent: { reference: SOURCE_REF, objectId: 'intro-panel', slots: ['link'] },
});

// 4. Three Pillars (white section -> bordered vertical cards, no invented CTA)
const pillarsHtml = PILLARS.map((p) =>
  H.compTag('library-card', 'spliced-vertical-single-event-bordered', {
    title: p.title,
    description: `<p>${H.esc(p.description)}</p>`,
    image: `<img src="${H.esc(p.image)}" alt="${H.esc(p.alt)}">`,
    sourceAbsent: { reference: SOURCE_REF, objectId: p.objectId, slots: ['category', 'link'] },
  })
).join('\n');

// 5. Why Smart Panels? Video Horizontal Card
const whyCard = H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
  title: 'Why Smart Panels?',
  description:
    'Smart Panels are simple, Ethernet-connected solutions for managing power distribution. They give your electrical equipment the ability to directly communicate to you. Instead of spending hours or days gathering the information you need, it arrives in real time. Data is presented clearly on your computer or smart device, giving you the big picture so you can easily keep track of your building’s electrical system status.',
  image: `<img src="assets/${SLUG}/why-video.jpg" alt="Say Hello to Smart Panels overview video">`,
  linkLabel: 'Watch overview video',
  href: '#why-smart-panels-video',
  imagePosition: 'left',
});

// 6. Commission Banner (single white-outline CTA)
const commissionBanner = H.compTag('library-banner', 'hero-responsive', {
  title: 'Easy set-up with EcoStruxure Power Commission',
  description:
    'Configure and commission your Smart Panels easily with EcoStruxure Power Commission software, featuring smart device discovery, connectivity testing and one-click manufacturer test reporting.',
  actionLabel: 'Discover now',
  actionCallback: 'openCommissionLink',
  surface: 'image',
});

// 7. EcoXperts Horizontal Card
const ecoxpertCard = H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
  title: 'Design, build, test and connect your digital panels',
  description:
    'Digital Panel certified EcoXperts are panel builders and electrical contractors with extensive knowledge and proven competence in delivering efficient, tested, and ethernet-ready panels. With this certification, panel builders and electrical contractors receive training to design, build, configure, test, commission, and connect their digital panels to EcoStruxure Facility Expert. Certified EcoXperts are sought-after experts in their field and bring the expertise of the EcoStruxure Power architecture to their customers.',
  image: `<img src="assets/${SLUG}/ecoxpert-panel.jpg" alt="Digital Panel certified EcoXpert engineers testing electrical panels">`,
  linkLabel: 'Join EcoXperts',
  href: 'https://www.se.com/sg/en/partners/ecoxpert',
  imagePosition: 'left',
});

// 8. Related Products Carousel (native library-carousel/external-cards, 4 columns)
const relatedCarousel = H.compTag('library-carousel', 'external-cards', {
  columns: 4,
  accessibleLabel: 'Related Products',
  items: RELATED_PRODUCTS.map((p) => ({
    component: 'library-card',
    fragment: 'spliced-vertical-single-event',
    props: {
      title: p.title,
      description: `<p>${H.esc(p.description)}</p>`,
      image: `<img src="${H.esc(p.image)}" alt="${H.esc(p.title)}">`,
      linkLabel: 'View product',
      href: p.href,
      sourceAbsent: { reference: SOURCE_REF, objectId: p.objectId, slots: ['category'] },
    },
  })),
});

// 9. Introducing EcoStruxure Power (interactive 3-slide horizontal card)
const ecoFeatureCard = H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
  title: ECO_SLIDES[0].title,
  description: ECO_SLIDES[0].description,
  image: `<img src="${H.esc(ECO_SLIDES[0].image)}" alt="${H.esc(ECO_SLIDES[0].alt)}">`,
  linkLabel: ECO_SLIDES[0].linkLabel,
  href: ECO_SLIDES[0].href,
  imagePosition: 'left',
});

// 10. Need Help? 4-column IconCard (duotone-line 48x48 Lucide-synthesized FS icons)
const helpCardsHtml = HELP_CARDS.map((c) =>
  H.compTag('library-icon-card', 'left-single-event', {
    icon: c.icon,
    title: c.title,
    description: c.description,
    titleHref: c.href,
    sourceAbsent: { reference: SOURCE_REF, objectId: c.objectId, slots: ['bullets', 'link'] },
  })
).join('\n');

// 11. Video Dialog (library-dialog/information)
const videoDialog = H.compTag('library-dialog', 'information', {
  title: 'Smart Panels Overview Video',
  body: `<div class="ds-dialog__section"><h3 class="ds-dialog__subtitle">Give Your Electrical System a Voice</h3><div class="ds-dialog__content"><p>Discover how Ethernet-connected Smart Panels with EcoStruxure Power technologies deliver real-time energy monitoring, proactive overload alerts, and predictive maintenance insights across your facility.</p></div></div>`,
});

const pageCss = `${H.basePageCss()}
.sp-breadcrumb-bar { background: #FFFFFF; border-bottom: 1px solid #F2F2F2; padding: 12px 0; }
.sp-hero-wrap { position: relative; background-image: url('assets/${SLUG}/hero-1.jpg'); background-size: cover; background-position: center; overflow: hidden; transition: background-image 0.3s ease; }
.sp-hero-wrap::before { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.52); pointer-events: none; z-index: 0; }
.sp-banner-layer { position: relative; z-index: 1; }
.sp-hero-dots { position: relative; z-index: 2; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 0 0 20px; margin-top: -12px; }
.sp-dot { width: 8px; height: 8px; border-radius: 999px; border: none; padding: 0; background: #FFFFFF; opacity: 0.4; cursor: pointer; transition: width 0.2s ease, opacity 0.2s ease; }
.sp-dot[aria-selected="true"] { width: 20px; opacity: 1; }
.sp-commission-wrap { position: relative; background-image: url('assets/${SLUG}/commission-banner.jpg'); background-size: cover; background-position: center; overflow: hidden; }
.sp-commission-wrap::before { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.55); pointer-events: none; z-index: 0; }
.sp-intro-card-wrap { background: #FFFFFF; border-radius: 8px; padding: 32px; }
.sp-eco-dots { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 24px; }
.sp-eco-dot { width: 8px; height: 8px; border-radius: 999px; border: none; padding: 0; background: #707070; opacity: 0.4; cursor: pointer; transition: width 0.2s ease, opacity 0.2s ease; }
.sp-eco-dot[aria-selected="true"] { width: 20px; opacity: 1; }
.sp-blog-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
.sp-blog-card { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 24px; border-radius: 8px; background: #FFFFFF; color: #19191A; text-decoration: none; font-size: 16px; line-height: 24px; font-weight: 600; transition: box-shadow 0.2s ease; }
.sp-blog-card__title { text-decoration: none; }
.sp-blog-card:hover { color: #19191A; box-shadow: 0 4px 16px rgba(25, 25, 26, 0.08); }
.sp-blog-card:hover .sp-blog-card__title { text-decoration: underline; text-underline-offset: 3px; }
.sp-blog-card__arrow { flex: 0 0 auto; font-size: 18px; line-height: 1; color: #707070; }
.sp-blog-card:hover .sp-blog-card__arrow { color: #19191A; }
.sp-help-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
.sp-dialog-backdrop { position: fixed; inset: 0; background: rgba(25, 25, 26, 0.55); display: flex; align-items: center; justify-content: center; z-index: 1200; padding: 24px; }
.sp-dialog-backdrop[hidden] { display: none; }
`;

const mainHtml = `
  <main>
    <div class="sp-breadcrumb-bar">
      <div class="container">
        ${H.compTag('library-breadcrumb', 'default', { items: breadcrumbItemsHtml })}
      </div>
    </div>

    <section id="hero" class="sp-hero-wrap" aria-label="Smart Panels Hero Carousel">
      <div class="sp-banner-layer">${heroBanner}</div>
      <div class="sp-hero-dots" role="tablist" aria-label="Hero slides" data-fs-extend="hero-slide-dots">
        <button type="button" class="sp-dot" role="tab" aria-selected="true" aria-label="Slide 1" data-hero-dot="0"></button>
        <button type="button" class="sp-dot" role="tab" aria-selected="false" aria-label="Slide 2" data-hero-dot="1"></button>
        <button type="button" class="sp-dot" role="tab" aria-selected="false" aria-label="Slide 3" data-hero-dot="2"></button>
      </div>
    </section>

    <section id="intro" class="page-section page-section--gray">
      <div class="container">
        <div class="sp-intro-card-wrap sp-intro-media-fit" data-fs-extend="intro-panel-surface">
          ${introCard}
        </div>
      </div>
    </section>

    <section id="pillars" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Protect, Measure, and Connect</h2>
          <p class="section-desc">End-to-end connected electrical distribution capabilities built into every Smart Panel.</p>
        </div>
        <div class="grid grid--3">
          ${pillarsHtml}
        </div>
      </div>
    </section>

    <section id="why-smart-panels" class="page-section page-section--gray">
      <div class="container">
        <div class="sp-intro-card-wrap" data-fs-extend="why-panel-surface">
          ${whyCard}
        </div>
      </div>
    </section>

    <section id="power-commission" class="sp-commission-wrap" aria-label="EcoStruxure Power Commission">
      <div class="sp-banner-layer">${commissionBanner}</div>
    </section>

    <section id="ecoxperts" class="page-section">
      <div class="container">
        ${ecoxpertCard}
      </div>
    </section>

    <section id="related-products" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Related Products</h2>
          <p class="section-desc">Explore connected circuit breakers, wireless sensors, gateways, and power monitoring devices for Smart Panels.</p>
        </div>
        <div class="sp-products-fit" data-fs-extend="product-image-contain">
          ${relatedCarousel}
        </div>
      </div>
    </section>

    <section id="ecostruxure-power" class="page-section">
      <div class="container">
        <div id="sp-eco-stage">
          ${ecoFeatureCard}
        </div>
        <div class="sp-eco-dots" role="tablist" aria-label="EcoStruxure Power slides" data-fs-extend="eco-slide-dots">
          <button type="button" class="sp-eco-dot" role="tab" aria-selected="true" aria-label="Slide 1" data-eco-dot="0"></button>
          <button type="button" class="sp-eco-dot" role="tab" aria-selected="false" aria-label="Slide 2" data-eco-dot="1"></button>
          <button type="button" class="sp-eco-dot" role="tab" aria-selected="false" aria-label="Slide 3" data-eco-dot="2"></button>
        </div>
      </div>
    </section>

    <section id="stay-up-to-date" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Stay up to date</h2>
          <p class="section-desc">Visit our blog to get the latest on trends, technologies, best practices, and hot topics in your market. Join the conversation today!</p>
        </div>
        <div class="sp-blog-grid" data-fs-extend="blog-article-links">
          ${BLOG_ARTICLES.map(
            (a) =>
              `<a class="sp-blog-card" href="${H.esc(a.href)}" target="_blank" rel="noopener noreferrer"><span class="sp-blog-card__title">${H.esc(a.title)}</span><span class="sp-blog-card__arrow" aria-hidden="true">›</span></a>`
          ).join('\n')}
        </div>
      </div>
    </section>

    <section id="need-help" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Need help?</h2>
          <p class="section-desc">Access product selection tools, sales enquiries, local distributors, and technical support resources.</p>
        </div>
        <div class="sp-help-grid">
          ${helpCardsHtml}
        </div>
      </div>
    </section>

    <div id="sp-video-backdrop" class="sp-dialog-backdrop" hidden>
      ${videoDialog}
    </div>
  </main>`;

const pageJs = `
(function () {
  var heroSlides = ${JSON.stringify(HERO_SLIDES)};
  var ecoSlides = ${JSON.stringify(ECO_SLIDES)};
  var heroIdx = 0;

  var videoBackdrop = document.getElementById('sp-video-backdrop');
  function openVideoDialog() {
    if (videoBackdrop) videoBackdrop.hidden = false;
  }
  function closeVideoDialog() {
    if (videoBackdrop) videoBackdrop.hidden = true;
  }
  if (videoBackdrop) {
    videoBackdrop.addEventListener('click', function (e) {
      if (e.target === videoBackdrop || e.target.closest('.ds-dialog__close-position')) closeVideoDialog();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeVideoDialog();
  });

  // Hero primary action
  var heroPrimaryBtn = document.querySelector('#hero [data-library-event-actioncallback="handleHeroPrimaryAction"]');
  if (heroPrimaryBtn) {
    heroPrimaryBtn.addEventListener('click', function () {
      var s = heroSlides[heroIdx];
      if (s.primaryAction === 'video') openVideoDialog();
      else if (s.primaryHref) window.open(s.primaryHref, '_blank', 'noopener');
    });
  }

  // Why Smart Panels video trigger
  var whyLink = document.querySelector('#why-smart-panels a[href="#why-smart-panels-video"]');
  if (whyLink) {
    whyLink.addEventListener('click', function (e) {
      e.preventDefault();
      openVideoDialog();
    });
  }

  // Commission CTA
  var commBtn = document.querySelector('#power-commission [data-library-event-actioncallback="openCommissionLink"]');
  if (commBtn) {
    commBtn.addEventListener('click', function () {
      window.open('https://www.se.com/sg/en/product-range/62980-ecostruxure-power-commission/', '_blank', 'noopener');
    });
  }

  // Hero 3-slide dots
  var heroWrap = document.getElementById('hero');
  var heroDots = document.querySelectorAll('[data-hero-dot]');
  heroDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      heroIdx = Number(dot.getAttribute('data-hero-dot')) || 0;
      var s = heroSlides[heroIdx];
      if (heroWrap) heroWrap.style.backgroundImage = "url('" + s.image + "')";
      var t = heroWrap && heroWrap.querySelector('.ds-banner__title');
      var d = heroWrap && heroWrap.querySelector('.ds-banner__desc');
      var pText = heroPrimaryBtn && heroPrimaryBtn.querySelector('.ds-btn__text');
      var secBtn = heroWrap && heroWrap.querySelector('[data-banner-secondary-action]');
      if (t) t.textContent = s.title;
      if (d) d.textContent = s.description;
      if (pText) pText.textContent = s.primaryLabel;
      if (secBtn) {
        if (s.secondaryLabel) {
          secBtn.style.display = '';
          var sp = secBtn.querySelector('.ds-btn__text');
          if (sp) sp.textContent = s.secondaryLabel;
          if (s.secondaryHref) secBtn.setAttribute('href', s.secondaryHref);
        } else {
          secBtn.style.display = 'none';
        }
      }
      heroDots.forEach(function (b, idx) {
        b.setAttribute('aria-selected', idx === heroIdx ? 'true' : 'false');
      });
    });
  });

  // EcoStruxure Power 3-slide switcher
  var ecoStage = document.getElementById('sp-eco-stage');
  var ecoDots = document.querySelectorAll('[data-eco-dot]');
  ecoDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = Number(dot.getAttribute('data-eco-dot')) || 0;
      var s = ecoSlides[idx];
      if (!ecoStage || !s) return;
      var img = ecoStage.querySelector('img');
      var title = ecoStage.querySelector('.ds-card__title');
      var desc = ecoStage.querySelector('.ds-card__desc');
      var link = ecoStage.querySelector('a.ds-text-btn');
      var linkText = link && link.querySelector('.ds-text-btn__text');
      if (img) { img.setAttribute('src', s.image); img.setAttribute('alt', s.alt); }
      if (title) title.textContent = s.title;
      if (desc) desc.textContent = s.description;
      if (link) link.setAttribute('href', s.href);
      if (linkText) linkText.textContent = s.linkLabel;
      ecoDots.forEach(function (b, i) {
        b.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    });
  });
})();
`;

const outRel = `pages/${SLUG}-pc.html`;
const pageSourceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Panels Overview — FS Design Standard</title>
  <style>${pageCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}
  ${mainHtml}
  ${H.compTag('library-navigation', 'footer', {})}
  <script>${pageJs}</script>
</body>
</html>`;
H.assembleLocalPage(pageSourceHtml, outRel);
console.log('Generated:', outRel, 'release:', RELEASE.slice(0, 12));
