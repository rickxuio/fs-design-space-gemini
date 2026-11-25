'use strict';

const fs = require('node:fs');
const path = require('node:path');
const H = require('../page-helpers.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_REL = 'pages/alibabacloud-automotive-pc.html';
const REF_PATH = 'reference-inputs/alibabacloud-automotive/content.json';

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineLink(label, href) {
  return `<div data-component="library-text-button" data-fragment="inline-blue-link" data-props='${esc(JSON.stringify({ label, href }))}'></div>`;
}

function renderFilledRedBtn(label, href) {
  if (href && href.startsWith('#')) {
    return `<div data-component="library-button" data-fragment="filled-red" data-props='${esc(JSON.stringify({ label, size: 'xl-regular', actionCallback: 'scrollToContact' }))}'></div>`;
  }
  return `<a class="auto-btn-anchor" href="${esc(href)}" target="_blank" rel="noopener noreferrer"><div data-component="library-button" data-fragment="filled-red" data-props='${esc(JSON.stringify({ label, size: 'xl-regular' }))}'></div></a>`;
}

function renderNeutralTag(text) {
  return `<span class="auto-tag">${esc(text)}</span>`;
}

// ---------------------------------------------------------------------------
// Data — 100% faithfully sourced from Alibaba Cloud Automotive Solutions
// ---------------------------------------------------------------------------

const ANCHOR_ITEMS = [
  { id: 'whats-new', label: "What's New" },
  { id: 'overview', label: 'Overview' },
  { id: 'why-alibaba-cloud', label: 'Why Alibaba Cloud' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'customers', label: 'Customers' },
  { id: 'ai-tools', label: 'AI Tools' }
];

const FEATURED_NEWS = {
  tag: 'Automotive Industry News',
  title: 'Leading Chinese Automakers Announce Integration with Qwen at 2026 Beijing Auto Show',
  desc: 'On the opening day of the 2026 Beijing Auto Show, leading Chinese automakers announced the integration of Qwen into their intelligent vehicle systems. In the near future, select models from these manufacturers will offer Qwen-powered AI services directly within the cabin, enabling users to book hotels, purchase attraction tickets, order food delivery, track parcels, and more.',
  linkLabel: 'Read More',
  href: 'https://www.alibabacloud.com/blog/leading-chinese-automakers-announce-integration-with-qwen-at-2026-beijing-auto-show_603065',
  image: 'assets/alibabacloud-automotive/img-02-4543cc0d.webp',
  imageAlt: 'Leading Chinese automakers Qwen booth at 2026 Beijing Auto Show'
};

const SUB_NEWS = [
  {
    tag: 'Automotive Industry News',
    title: 'BMW Intelligent Cockpit Based on Qwen',
    desc: 'BMW introduced three AI agents powered by the Qwen models, addressing every facet of the driving journey.',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/blog/leading-chinese-automakers-announce-integration-with-qwen-at-2026-beijing-auto-show_603065'
  },
  {
    tag: 'Automotive Industry News',
    title: 'Accelerating EV innovation in Malaysia',
    desc: 'Alibaba Cloud partners with PRO-NET to advance Malaysia’s cloud-first, AI-powered new energy mobility ecosystem.',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/blog/alibaba-cloud-enables-ryt-bank%E2%80%99s-smart-digital-banking-and-pro-net%E2%80%99s-national-ev-platform-through-strategic-collaborations_602716'
  },
  {
    tag: 'Campaign',
    title: 'AI Savings Plans',
    desc: 'Save Up to 47%: Unlock Savings Across Every Modality (Video, Text, Image, and Speech)',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/campaign/ai-tools-for-e-commerse-and-advertising#plans'
  },
  {
    tag: 'Analyst Report',
    title: 'Leader of Agentic AI Cloud Providers',
    desc: 'Alibaba Cloud named as a Leader in the “Omdia Market Radar: Agentic AI Cloud Titans in Asia & Oceania, 2026”.',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/en/solutions/automotive'
  }
];

const WHY_PILLARS = [
  {
    objectId: 'why-ai-built',
    icon: 'assets/alibabacloud-automotive/icon-why-ai.svg',
    title: 'AI Built for Automotive',
    desc: 'Leverage Qwen models and automotive-optimized AI pipelines that accelerate perception model development, automate data labeling, and deliver ultra-low latency cockpit inference.'
  },
  {
    objectId: 'why-ecosystem',
    icon: 'assets/alibabacloud-automotive/icon-why-ecosystem.svg',
    title: 'Ecosystem Intelligence',
    desc: "Enrich your solutions with data and capabilities from Alibaba's logistics, navigation, and marketplace ecosystem, combined with proven deployment experience and partner integrations that generic cloud providers cannot replicate."
  },
  {
    objectId: 'why-ops',
    icon: 'assets/alibabacloud-automotive/icon-why-ops.svg',
    title: 'Operational Excellence',
    desc: 'Unify your tooling on a single platform that dramatically reduces tool sprawl, deploys production-ready automotive AI templates in under an hour, and automates MLOps to compress model deployment from weeks to hours.'
  },
  {
    objectId: 'why-security',
    icon: 'assets/alibabacloud-automotive/icon-why-security.svg',
    title: 'Industry-Certified Security',
    desc: "Operate on ISO 26262 ASIL-D compliant infrastructure with end-to-end V2X encryption, full regulatory compliance, and a dedicated automotive security operations center that meets the industry's strictest standards."
  },
  {
    objectId: 'why-reliability',
    icon: 'assets/alibabacloud-automotive/icon-why-reliability.svg',
    title: 'Proven Reliability and Performance',
    desc: 'Rely on high-availability infrastructure with multi-zone redundancy, massive AI compute clusters, high-speed networking, and proven resilience at peak scale, so your critical services remain stable under heavy workloads.'
  },
  {
    objectId: 'why-cost',
    icon: 'assets/alibabacloud-automotive/icon-why-cost.svg',
    title: 'Cost Optimization',
    desc: 'Eliminate upfront capital expenditure with pay-as-you-go HPC, reduce simulation costs through intelligent spot instance scheduling, and optimize storage spending with automatic hot and cold data tiering.'
  }
];

const SOLUTIONS = [
  {
    id: 'sol-ad',
    title: 'Accelerate Autonomous Driving Innovation',
    challenge:
      'Autonomous driving development is slowing under the weight of explosive sensor data growth and manual workflows that stretch development timelines. How do you deliver the experience your customers expect when your infrastructure cannot scale and every cycle costs you weeks?',
    solution:
      'Object Storage Service (OSS) and Data Lake Analytics ingest and preprocess petabyte-scale sensor data without infrastructure bottlenecks. AI-powered auto-labeling then transforms that data into training-ready assets, compressing annotation cycles while improving accuracy. Elastic high-performance computing clusters run millions of simulation scenarios in parallel, validating models in hours instead of weeks. Pre-trained perception models eliminate months of foundational development, so your team iterates faster and reaches autonomy milestones ahead of schedule.',
    productsLabel: 'Core Products',
    products: ['OSS + Data Lake Analytics', 'PAI (Platform for AI)', 'E-HPC', 'Alibaba Cloud Model Studio'],
    productNote: 'Ingests and processes massive sensor datasets with the scalability autonomous programs demand.',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/solutions/data-lake',
    image: 'assets/alibabacloud-automotive/img-08-977e82eb.webp',
    imageAlt: 'Autonomous driving sensor perception and simulation scene'
  },
  {
    id: 'sol-cockpit',
    title: 'Deliver Smarter, More Connected Customer Journey',
    challenge:
      'Drivers expect intuitive and personalized experiences, which means a one-size-fits-all voice assistant and slow software updates will push your customers away. How do you turn the cockpit that your customers interact with every day into a competitive advantage?',
    solution:
      'Our intelligent cockpit platform redefines the in-vehicle experience with a multimodal AI assistant that understands voice, vision, and gesture with high accuracy across dozens of languages. Advanced driver monitoring enhances safety through gaze tracking and fatigue detection, while intelligent personalization provides information on routes, climate, and entertainment tailored to each driver. OTA delta upgrades minimize downtime and ensure seamless, reliable software evolution.',
    productsLabel: 'Core Product',
    products: ['Qwen'],
    productNote: 'Powers natural voice and visual interactions that make every drive feel intuitive and responsive.',
    linkLabel: 'Learn More',
    href: 'https://modelstudio.console.alibabacloud.com/ap-southeast-1',
    image: 'assets/alibabacloud-automotive/img-10-e371d2be.webp',
    imageAlt: 'Intelligent connected vehicle cockpit multimodal assistant'
  },
  {
    id: 'sol-supply',
    title: 'Build Resilient, Data-Driven Supply Chains',
    challenge:
      'Global automotive supply chains remain vulnerable to hidden disruptions beyond Tier-1 suppliers, while traditional forecasting methods struggle to anticipate rapid market shifts. How do you protect margins and maintain production continuity when visibility and predictive accuracy fall short?',
    solution:
      'Our supply chain solution delivers end-to-end visibility with a real-time control tower that monitors multi-tier suppliers, flags risks before they disrupt operations, and surfaces optimization strategies when anomalies appear. It predicts demand with high accuracy by integrating sales trends and external signals. You can also use our Digital Twin to simulate the supply chain, enabling inventory optimization and confident scenario planning.',
    productsLabel: 'Core Products',
    products: ['Supply Chain Control Tower', 'AI Demand Forecasting Engine', 'Digital Twin Platform'],
    productNote: 'Provides unified, real-time visibility across your entire supplier network so you can act before disruptions impact production.',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/en/solutions/supply-chain/dchain#J_8529741030',
    image: 'assets/alibabacloud-automotive/img-14-cd951406.webp',
    imageAlt: 'Resilient data-driven automotive supply chain digital twin'
  }
];

const AI_TOOL_CARDS = [
  {
    title: 'The Right Models for Your Business',
    tags: ['All Modality', 'Try for Free'],
    desc: 'Compare capabilities, free quotas, and pricing for the models powering your simulation data pipeline.',
    linkLabel: 'See All Models',
    href: 'https://www.alibabacloud.com/en/campaign/ai-data-construction?#pricing-section',
    image: 'assets/alibabacloud-automotive/img-16-fda805da.webp',
    imageAlt: 'Multimodal AI Model Family capabilities overview'
  },
  {
    title: 'Get Started with Token Plan',
    tags: ['For Individuals', 'For Teams'],
    desc: 'Starting from $6 / month, with discount of up to 35% off.',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/campaign/ai-tools-for-e-commerse-and-advertising#plans',
    image: 'assets/alibabacloud-automotive/img-17-9f5217ad.webp',
    imageAlt: 'Token Plan flexible pricing illustration'
  },
  {
    title: 'Token Discount for New Users',
    tags: ['From $4 / month'],
    desc: 'Take an extra $2 off your Token Plan.',
    linkLabel: 'Learn More',
    href: 'https://www.alibabacloud.com/campaign/ai-coupon',
    image: 'assets/alibabacloud-automotive/img-18-c8c9b203.webp',
    imageAlt: 'New user Token Plan coupon illustration'
  }
];

// ---------------------------------------------------------------------------
// Section Builders
// ---------------------------------------------------------------------------

function buildHeroSection() {
  const props = {
    title: 'Alibaba Cloud for Automotive',
    description: 'Turn automotive complexity into competitive advantage with AI',
    actionLabel: 'Talk to an Automotive Specialist',
    actionCallback: 'scrollToContact',
    secondaryActionLabel: 'AI Tools for Automotive',
    secondaryActionHref: 'https://www.alibabacloud.com/campaign/ai-data-construction',
    surface: 'image'
  };
  return `
  <section id="hero" class="auto-hero-section">
    <div class="auto-hero-content">
      <div data-component="library-banner" data-fragment="hero-responsive" data-props='${esc(JSON.stringify(props))}'></div>
    </div>
  </section>`;
}

function buildAnchorNavSection() {
  const tabsHtml = ANCHOR_ITEMS.map((item, idx) => {
    const activeCls = idx === 0 ? ' ds-anchor-nav__tab--active' : '';
    return `<div class="ds-anchor-nav__tab${activeCls}" data-anchor-tab="">${esc(item.label)}</div>`;
  }).join('');

  const props = {
    tabs: tabsHtml,
    actionLabel: 'Contact Us',
    actionCallback: 'scrollToContact'
  };

  return `
  <nav id="anchor-nav" class="auto-anchor-sticky" aria-label="Section navigation">
    <div data-component="library-anchor-nav" data-fragment="anchor-nav" data-props='${esc(JSON.stringify(props))}'></div>
  </nav>`;
}

function buildWhatsNewSection() {
  const featuredLink = renderInlineLink(FEATURED_NEWS.linkLabel, FEATURED_NEWS.href);
  const subCardsHtml = SUB_NEWS.map((card) => {
    const linkHtml = renderInlineLink(card.linkLabel, card.href);
    return `
      <article class="auto-news-card" data-fs-extend="news-grid-card">
        <div class="auto-news-card__top">
          ${renderNeutralTag(card.tag)}
          <h3 class="auto-news-card__title">
            <a class="auto-card-title-link" href="${esc(card.href)}" target="_blank" rel="noopener noreferrer">${esc(card.title)}</a>
          </h3>
          <p class="auto-news-card__desc">${esc(card.desc)}</p>
        </div>
        <div class="auto-news-card__footer">${linkHtml}</div>
      </article>`;
  }).join('');

  return `
  <section id="whats-new" class="auto-section auto-section--gray">
    <div class="auto-container">
      <div class="auto-section-header">
        <h2 class="auto-section-title">What's New</h2>
      </div>

      <article class="auto-featured-news" data-fs-extend="featured-news-split-card">
        <div class="auto-featured-news__body">
          ${renderNeutralTag(FEATURED_NEWS.tag)}
          <h3 class="auto-featured-news__title">
            <a class="auto-card-title-link" href="${esc(FEATURED_NEWS.href)}" target="_blank" rel="noopener noreferrer">${esc(FEATURED_NEWS.title)}</a>
          </h3>
          <p class="auto-featured-news__desc">${esc(FEATURED_NEWS.desc)}</p>
          <div class="auto-featured-news__cta">${featuredLink}</div>
        </div>
        <div class="auto-featured-news__media">
          <img class="auto-featured-news__img" src="${esc(FEATURED_NEWS.image)}" alt="${esc(FEATURED_NEWS.imageAlt)}">
        </div>
      </article>

      <div class="auto-news-grid">${subCardsHtml}</div>
    </div>
  </section>`;
}

function buildOverviewSection() {
  return `
  <section id="overview" class="auto-section auto-section--white">
    <div class="auto-container">
      <div class="auto-overview-grid" data-fs-extend="overview-split-layout">
        <div class="auto-overview-copy">
          <h2 class="auto-overview-title">The AI-Driven Automotive Shift</h2>
          <p class="auto-overview-p">The automotive industry today faces pressure from explosive autonomous vehicle data, supply chains under strain, and rising consumer expectations for intelligent in-vehicle experiences.</p>
          <p class="auto-overview-p">Alibaba Cloud's comprehensive automotive AI platform empowers manufacturers to transform these challenges into competitive advantages, delivering petabyte-scale data processing for accelerated autonomy development, predictive supply chain intelligence for operational resilience, and next-generation cockpit experiences powered by multimodal AI. Built on enterprise-grade infrastructure, our solution enables automakers to innovate faster, reduce costs, and lead in the software-defined vehicle era.</p>
        </div>
        <div class="auto-overview-media">
          <img class="auto-overview-img" src="assets/alibabacloud-automotive/img-03-cb0fe955.webp" alt="Isometric illustration of AI-driven automotive platform shift">
        </div>
      </div>
    </div>
  </section>`;
}

function buildWhySection() {
  const cardsHtml = WHY_PILLARS.map((item) => {
    return `
      <article class="auto-why-card" data-fs-extend="why-pillar-static-card">
        <div class="auto-why-card__icon-wrap">
          <img class="auto-why-card__icon" src="${esc(item.icon)}" alt="${esc(item.title)}" width="36" height="36">
        </div>
        <div class="auto-why-card__body">
          <h3 class="auto-why-card__title">${esc(item.title)}</h3>
          <p class="auto-why-card__desc">${esc(item.desc)}</p>
        </div>
      </article>`;
  }).join('');

  return `
  <section id="why-alibaba-cloud" class="auto-section auto-section--gray">
    <div class="auto-container">
      <div class="auto-section-header">
        <h2 class="auto-section-title">Why Alibaba Cloud</h2>
      </div>
      <div class="auto-why-grid">${cardsHtml}</div>
    </div>
  </section>`;
}

function buildSolutionsSection() {
  const itemsHtml = SOLUTIONS.map((sol, idx) => {
    const expanded = idx === 0;
    const linkHtml = renderInlineLink(sol.linkLabel, sol.href);
    const pillsHtml = sol.products.map((p) => `<span class="auto-sol-pill">${esc(p)}</span>`).join('');
    return `
      <article class="auto-sol-item${expanded ? ' is-open' : ''}" data-sol-item="" data-fs-extend="solution-accordion-card">
        <button class="auto-sol-trigger" type="button" aria-expanded="${expanded ? 'true' : 'false'}" aria-controls="${esc(sol.id)}-panel">
          <span class="auto-sol-trigger__title">${esc(sol.title)}</span>
          <span class="auto-sol-trigger__indicator" aria-hidden="true"><img src="${expanded ? 'assets/alibabacloud-automotive/icon-minus.svg' : 'assets/alibabacloud-automotive/icon-plus.svg'}" alt="" width="16" height="16"></span>
        </button>
        <div class="auto-sol-panel" id="${esc(sol.id)}-panel"${expanded ? '' : ' hidden'}>
          <div class="auto-sol-panel__grid">
            <div class="auto-sol-panel__copy">
              <div class="auto-sol-block">
                <h3 class="auto-sol-subhead">The Challenge</h3>
                <p class="auto-sol-text">${esc(sol.challenge)}</p>
              </div>
              <div class="auto-sol-block">
                <h3 class="auto-sol-subhead">Our Solution</h3>
                <p class="auto-sol-text">${esc(sol.solution)}</p>
              </div>
              <div class="auto-sol-block">
                <h3 class="auto-sol-subhead">${esc(sol.productsLabel)}</h3>
                <div class="auto-sol-pills">${pillsHtml}</div>
                <p class="auto-sol-note">${esc(sol.productNote)}</p>
              </div>
              <div class="auto-sol-cta">${linkHtml}</div>
            </div>
            <div class="auto-sol-panel__media">
              <img class="auto-sol-img" src="${esc(sol.image)}" alt="${esc(sol.imageAlt)}">
            </div>
          </div>
        </div>
      </article>`;
  }).join('');

  return `
  <section id="solutions" class="auto-section auto-section--white">
    <div class="auto-container">
      <div class="auto-section-header">
        <h2 class="auto-section-title">Alibaba Cloud Turns Automotive Complexity into AI-Powered Advantage</h2>
      </div>
      <div class="auto-sol-list">${itemsHtml}</div>
    </div>
  </section>`;
}

function buildCustomersSection() {
  const ctaHtml = renderInlineLink(
    'Read More',
    'https://www.alibabacloud.com/blog/alibaba-cloud-enables-ryt-bank%E2%80%99s-smart-digital-banking-and-pro-net%E2%80%99s-national-ev-platform-through-strategic-collaborations_602716'
  );
  return `
  <section id="customers" class="auto-section auto-section--gray">
    <div class="auto-container">
      <div class="auto-section-header">
        <h2 class="auto-section-title">Alibaba Cloud Accelerates EV Innovation in Malaysia</h2>
      </div>
      <article class="auto-testimonial-card" data-fs-extend="customer-testimonial-split-card">
        <div class="auto-testimonial-card__body">
          <blockquote class="auto-testimonial-quote">“Alibaba Cloud has been a key partner to PRO-NET, and their support in building our cloud-first and data-driven foundation has been instrumental as we advance Malaysia’s new energy mobility ecosystem. As we move into the next phase with AI, this impactful collaboration will empower us to unlock deeper insights, elevate customer experiences, and accelerate our vision of shaping a smarter, more connected future of mobility for Malaysia”</blockquote>
          <p class="auto-testimonial-author">— Zhang Qiang, Chief Executive Officer of PRO-NET</p>
          <div class="auto-testimonial-cta">${ctaHtml}</div>
        </div>
        <div class="auto-testimonial-card__media">
          <img class="auto-testimonial-img" src="assets/alibabacloud-automotive/img-15-d740888f.webp" alt="Alibaba Cloud and PRO-NET strategic partnership in Malaysia">
        </div>
      </article>
    </div>
  </section>`;
}

function buildAiToolsSection() {
  const heroLink = renderInlineLink('Learn More', 'https://www.alibabacloud.com/campaign/ai-data-construction');
  const cardsHtml = AI_TOOL_CARDS.map((card) => {
    const tagsHtml = card.tags.map((t) => renderNeutralTag(t)).join('');
    const linkHtml = renderInlineLink(card.linkLabel, card.href);
    return `
      <article class="auto-tool-card" data-fs-extend="ai-tool-grid-card">
        <div class="auto-tool-card__media">
          <img class="auto-tool-card__img" src="${esc(card.image)}" alt="${esc(card.imageAlt)}">
        </div>
        <div class="auto-tool-card__body">
          <div class="auto-tool-card__tags">${tagsHtml}</div>
          <h3 class="auto-tool-card__title">
            <a class="auto-card-title-link" href="${esc(card.href)}" target="_blank" rel="noopener noreferrer">${esc(card.title)}</a>
          </h3>
          <p class="auto-tool-card__desc">${esc(card.desc)}</p>
          <div class="auto-tool-card__footer">${linkHtml}</div>
        </div>
      </article>`;
  }).join('');

  return `
  <section id="ai-tools" class="auto-section auto-section--white">
    <div class="auto-container">
      <div class="auto-section-header">
        <h2 class="auto-section-title">Try Our AI Tools for Automotive</h2>
      </div>

      <article class="auto-tool-featured" data-fs-extend="ai-tool-featured-split-card">
        <div class="auto-tool-featured__body">
          <h3 class="auto-tool-featured__title">Physical-World AI Simulation &amp; Data Pipeline</h3>
          <p class="auto-tool-featured__desc">Turn real-world data bottlenecks into your competitive advantage. Reconstruct, augment, and synthesize infinite physical-world scenarios at scale.</p>
          <div class="auto-tool-featured__cta">${heroLink}</div>
        </div>
        <div class="auto-tool-featured__media">
          <img class="auto-tool-featured__img" src="assets/alibabacloud-automotive/img-19-5fc562f8.webp" alt="Physical-world AI simulation pipeline for automotive">
        </div>
      </article>

      <div class="auto-tool-grid">${cardsHtml}</div>
    </div>
  </section>`;
}

function buildReadyCtaSection() {
  const btnHtml = renderFilledRedBtn('Talk to an Automotive Specialist', '#contact-us');
  return `
  <section id="ready-cta" class="auto-cta-band" data-fs-extend="bottom-dark-cta-band">
    <div class="auto-cta-band__scrim">
      <div class="auto-container auto-cta-band__inner">
        <h2 class="auto-cta-band__title">Ready to Transform Your Automotive Business?</h2>
        <p class="auto-cta-band__desc">From autonomous driving to intelligent cockpit — our automotive specialists are ready to help.</p>
        <div class="auto-cta-band__action">${btnHtml}</div>
      </div>
    </div>
  </section>`;
}

function buildContactSection() {
  const formProps = {
    sourceFields: {
      reference: REF_PATH,
      objectId: 'automotive-contact-form'
    },
    submitLabel: 'Register Now',
    submitCallback: 'handleAutomotiveInquiry'
  };

  return `
  <section id="contact-us" class="auto-section auto-section--gray">
    <div class="auto-container">
      <div class="auto-section-header">
        <h2 class="auto-section-title">Contact Us</h2>
        <p class="auto-section-desc">Connect with our automotive cloud and AI specialists to discuss autonomous driving, intelligent cockpit, or supply chain initiatives.</p>
      </div>
      <div class="inquiry-form-card" data-fs-extend="contact-form-container">
        <div data-component="library-form" data-fragment="gray" data-props='${esc(JSON.stringify(formProps))}'></div>
      </div>
    </div>
  </section>`;
}

// ---------------------------------------------------------------------------
// Page CSS (FS Tokens, zero gradients, zero descendant tag selectors)
// ---------------------------------------------------------------------------

const PAGE_CSS = `${H.basePageCss()}
  .auto-container {
    box-sizing: border-box;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0;
  }

  .auto-section {
    padding: 40px 0;
    scroll-margin-top: 68px;
  }
  .auto-section--white { background: #FFFFFF; }
  .auto-section--gray { background: #FAFBFB; }

  .auto-section-header {
    text-align: center;
    margin-bottom: 24px;
  }
  .auto-section-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: #19191A;
  }
  .auto-section-desc {
    margin: 12px auto 0;
    max-width: 960px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #4B4B4D;
  }

  /* Hero section — automotive AI background + solid dark scrim for crisp white text */
  .auto-hero-section {
    position: relative;
    width: 100%;
    background-image: url("assets/alibabacloud-automotive/img-19-5fc562f8.webp");
    background-size: cover;
    background-position: center;
    overflow: hidden;
  }
  .auto-hero-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.58);
    pointer-events: none;
    z-index: 0;
  }
  .auto-hero-content {
    position: relative;
    z-index: 1;
  }
  .auto-btn-anchor {
    display: inline-block;
    text-decoration: none;
  }

  /* Sticky Anchor Nav */
  .auto-anchor-sticky {
    position: sticky;
    top: 0;
    z-index: 40;
    background: #FFFFFF;
    border-bottom: 1px solid #E5E5E5;
  }

  /* Neutral independent tag */
  .auto-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 4px;
    background: #F3F4F6;
    color: #4B4B4D;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    width: fit-content;
  }

  /* Card clickable title — stays #19191A with black underline on hover */
  .auto-card-title-link {
    color: #19191A;
    text-decoration: none;
  }
  .auto-card-title-link:hover {
    color: #19191A;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  /* Section 3: What's New (on #FAFBFB gray -> white cards have NO border) */
  .auto-featured-news {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    background: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .auto-featured-news__body {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .auto-featured-news__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #19191A;
  }
  .auto-featured-news__desc {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #4B4B4D;
  }
  .auto-featured-news__cta {
    margin-top: auto;
    padding-top: 8px;
  }
  .auto-featured-news__media {
    min-height: 280px;
    background: #19191A;
  }
  .auto-featured-news__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .auto-news-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
  .auto-news-card {
    background: #FFFFFF;
    border-radius: 8px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
  }
  .auto-news-card__top {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .auto-news-card__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #19191A;
  }
  .auto-news-card__desc {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #4B4B4D;
  }
  .auto-news-card__footer {
    margin-top: auto;
  }

  /* Section 4: Overview */
  .auto-overview-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: center;
  }
  .auto-overview-title {
    margin: 0 0 16px;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: #19191A;
  }
  .auto-overview-p {
    margin: 0 0 14px;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #4B4B4D;
  }
  .auto-overview-p:last-child {
    margin-bottom: 0;
  }
  .auto-overview-media {
    border-radius: 8px;
    overflow: hidden;
    background: #FAFBFB;
  }
  .auto-overview-img {
    display: block;
    width: 100%;
    height: auto;
    object-fit: contain;
  }

  /* Section 5: Why Alibaba Cloud (3x2 open icon-text grid directly on #FAFBFB, no card box or hover shadow) */
  .auto-why-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px 36px;
  }
  .auto-why-card {
    background: transparent;
    padding: 8px 4px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    min-width: 0;
  }
  .auto-why-card__icon-wrap {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .auto-why-card__icon {
    display: block;
    width: 36px;
    height: 36px;
  }
  .auto-why-card__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }
  .auto-why-card__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #19191A;
  }
  .auto-why-card__desc {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #4B4B4D;
  }

  /* Section 6: Solutions Accordion (white cards on #FFFFFF -> MUST have border) */
  .auto-sol-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .auto-sol-item {
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    overflow: hidden;
  }
  .auto-sol-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    background: #FFFFFF;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
  }
  .auto-sol-trigger:hover {
    background: #FAFBFB;
  }
  .auto-sol-trigger__title {
    font-size: 18px;
    font-weight: 600;
    line-height: 26px;
    color: #19191A;
  }
  .auto-sol-trigger__indicator {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    background: #FAFBFB;
    border: 1px solid #E5E5E5;
    font-size: 18px;
    font-weight: 600;
    line-height: 1;
    color: #19191A;
  }
  .auto-sol-item.is-open .auto-sol-trigger {
    border-bottom: 1px solid #E5E5E5;
  }
  .auto-sol-panel {
    padding: 24px;
  }
  .auto-sol-panel__grid {
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    gap: 32px;
    align-items: start;
  }
  .auto-sol-panel__copy {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .auto-sol-subhead {
    margin: 0 0 6px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #19191A;
  }
  .auto-sol-text {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #4B4B4D;
  }
  .auto-sol-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
  }
  .auto-sol-pill {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 4px;
    background: #FAFBFB;
    border: 1px solid #E5E5E5;
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    color: #19191A;
  }
  .auto-sol-note {
    margin: 0;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: #6B6B6E;
  }
  .auto-sol-cta {
    padding-top: 4px;
  }
  .auto-sol-panel__media {
    border-radius: 8px;
    overflow: hidden;
    background: #FAFBFB;
  }
  .auto-sol-img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 360px;
    object-fit: cover;
  }

  /* Section 7: Customer Testimonial (white card on #FAFBFB -> NO border) */
  .auto-testimonial-card {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 32px;
    align-items: center;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 32px;
  }
  .auto-testimonial-card__body {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .auto-testimonial-quote {
    margin: 0;
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
    color: #19191A;
  }
  .auto-testimonial-author {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: #4B4B4D;
  }
  .auto-testimonial-cta {
    padding-top: 4px;
  }
  .auto-testimonial-card__media {
    border-radius: 8px;
    overflow: hidden;
  }
  .auto-testimonial-img {
    display: block;
    width: 100%;
    height: 300px;
    object-fit: cover;
  }

  /* Section 8: AI Tools (white cards on #FFFFFF -> MUST have border) */
  .auto-tool-featured {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .auto-tool-featured__body {
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
  }
  .auto-tool-featured__title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #19191A;
  }
  .auto-tool-featured__desc {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #4B4B4D;
  }
  .auto-tool-featured__media {
    background: #FAFBFB;
  }
  .auto-tool-featured__img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 240px;
    max-height: 300px;
    object-fit: cover;
  }

  .auto-tool-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
  .auto-tool-card {
    background: #FFFFFF;
    border: 1px solid #E5E5E5;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .auto-tool-card__media {
    aspect-ratio: 16 / 10;
    background: #FAFBFB;
    border-bottom: 1px solid #E5E5E5;
    overflow: hidden;
  }
  .auto-tool-card__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .auto-tool-card__body {
    padding: 20px 24px 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 10px;
  }
  .auto-tool-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .auto-tool-card__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: #19191A;
  }
  .auto-tool-card__desc {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #4B4B4D;
  }
  .auto-tool-card__footer {
    margin-top: auto;
    padding-top: 8px;
  }

  /* Section 9: Bottom Dark CTA Band (solid scrim, zero gradient) */
  .auto-cta-band {
    background-color: #19191A;
    background-image: url("assets/alibabacloud-automotive/img-08-977e82eb.webp");
    background-size: cover;
    background-position: center;
  }
  .auto-cta-band__scrim {
    background: rgba(0, 0, 0, 0.72);
    padding: 56px 0;
  }
  .auto-cta-band__inner {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  .auto-cta-band__title {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    line-height: 36px;
    color: #FFFFFF;
  }
  .auto-cta-band__desc {
    margin: 0;
    max-width: 720px;
    font-size: 15px;
    font-weight: 400;
    line-height: 24px;
    color: #E5E5E5;
  }
  .auto-cta-band__action {
    margin-top: 12px;
  }

  /* Section 10: Contact Us Form (white card on #FAFBFB -> NO border, full-width form) */
  .inquiry-form-card {
    box-sizing: border-box;
    background: #FFFFFF;
    border-radius: 8px;
    padding: 32px;
    width: 100%;
  }
  #contact-us .inquiry-form-card > form {
    width: 100%;
    max-width: none;
  }

  @media (max-width: 1180px) {
    .auto-news-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .auto-why-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

// ---------------------------------------------------------------------------
// Page Script — Anchor Nav, Accordion, Smooth Scroll, Form Feedback
// ---------------------------------------------------------------------------

const PAGE_SCRIPT = `
(function () {
  var anchorIds = ${JSON.stringify(ANCHOR_ITEMS.map((i) => i.id))};

  window.scrollToContact = function () {
    var target = document.getElementById('contact-us');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.handleAutomotiveInquiry = function (evt) {
    if (evt && evt.preventDefault) evt.preventDefault();
    var form = document.querySelector('#contact-us form');
    if (!form) return;
    var status = form.querySelector('.ds-form__status');
    if (status) {
      status.textContent = 'Thank you. Your automotive specialist inquiry has been recorded (preview demo mode).';
      status.hidden = false;
    }
  };

  // Wire AnchorNav tabs by DOM index
  var tabs = Array.from(document.querySelectorAll('#anchor-nav .ds-anchor-nav__tab'));
  function setActiveTab(activeIndex) {
    tabs.forEach(function (tab, i) {
      tab.classList.toggle('ds-anchor-nav__tab--active', i === activeIndex);
    });
  }
  tabs.forEach(function (tab, idx) {
    function activate() {
      setActiveTab(idx);
      var target = document.getElementById(anchorIds[idx]);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    tab.addEventListener('click', activate);
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  // Wire AnchorNav right CTA button & Hero primary button
  var anchorCta = document.querySelector('#anchor-nav .ds-anchor-nav__action button');
  if (anchorCta) anchorCta.addEventListener('click', window.scrollToContact);
  var heroBtns = document.querySelectorAll('#hero .ds-banner__actions button');
  if (heroBtns[0]) heroBtns[0].addEventListener('click', window.scrollToContact);

  // Sync active anchor tab on scroll
  if ('IntersectionObserver' in window && tabs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = anchorIds.indexOf(entry.target.id);
          if (idx !== -1) setActiveTab(idx);
        }
      });
    }, { rootMargin: '-120px 0px -65% 0px', threshold: 0 });
    anchorIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }

  // Wire Solution Accordion
  var solItems = Array.from(document.querySelectorAll('[data-sol-item]'));
  solItems.forEach(function (item) {
    var trigger = item.querySelector('.auto-sol-trigger');
    var panel = item.querySelector('.auto-sol-panel');
    var indicator = item.querySelector('.auto-sol-trigger__indicator');
    if (!trigger || !panel) return;
    trigger.addEventListener('click', function () {
      var isOpen = item.classList.contains('is-open');
      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
      var indicatorImg = indicator && indicator.querySelector('img');
      if (indicatorImg) indicatorImg.setAttribute('src', !isOpen ? 'assets/alibabacloud-automotive/icon-minus.svg' : 'assets/alibabacloud-automotive/icon-plus.svg');
    });
  });
})();
`;

function main() {
  const sourceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alibaba Cloud for Automotive — FS Design Standard</title>
  <style>${PAGE_CSS}</style>
</head>
<body>
  <div data-component="library-navigation" data-fragment="header" data-props='{}'></div>

  <main>
    ${buildHeroSection()}
    ${buildAnchorNavSection()}
    ${buildWhatsNewSection()}
    ${buildOverviewSection()}
    ${buildWhySection()}
    ${buildSolutionsSection()}
    ${buildCustomersSection()}
    ${buildAiToolsSection()}
    ${buildReadyCtaSection()}
    ${buildContactSection()}
  </main>

  <div data-component="library-navigation" data-fragment="footer" data-props='{}'></div>
  <script>${PAGE_SCRIPT}</script>
</body>
</html>`;

  H.assembleLocalPage(sourceHtml, OUT_REL);
  console.log(`Built ${OUT_REL} (release: ${H.getActiveRelease().slice(0, 12)})`);
}

main();
