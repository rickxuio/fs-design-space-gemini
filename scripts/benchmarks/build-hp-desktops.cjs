#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const H = require('../page-helpers.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const SLUG = 'hp-desktops';
const OUT_FILE = path.join(ROOT, 'pages', `${SLUG}-pc.html`);
const SOURCE_REF = `reference-inputs/${SLUG}/content.json`;
const SOURCE_REF_ABS = path.join(ROOT, SOURCE_REF);

const CATEGORIES = [
  {
    objectId: 'cat-01',
    title: 'All-in-One PCs',
    description: 'These devices combine the computer and display into a single unit to enhance your productivity!',
    href: 'https://www.hp.com/us-en/shop/vwa/desktops/segm=Home&form=All-in-One',
    image: `assets/${SLUG}/cat-01.jpg`,
    alt: 'All-in-One desktop workspace',
  },
  {
    objectId: 'cat-02',
    title: 'Desktops for home',
    description: "For work, play, gaming, or entertainment, there's an HP desktop or All-in-One just for you.",
    href: 'https://www.hp.com/us-en/shop/vwa/desktops/segm=Home',
    image: `assets/${SLUG}/cat-02.jpg`,
    alt: 'HP desktops and All-in-One lineup for home',
  },
  {
    objectId: 'cat-03',
    title: 'Dominate the game',
    description: 'Power up with the ultimate gaming PC, built with cutting-edge processors and next-gen graphics.',
    href: 'https://www.hp.com/us-en/shop/slp/hp-gaming/desktops',
    image: `assets/${SLUG}/cat-03.jpg`,
    alt: 'OMEN gaming desktop PC',
  },
  {
    objectId: 'cat-04',
    title: 'HP OmniDesk PCs',
    description: 'Meet the latest collection: Designed with built-in AI to streamline your everyday tasks effortlessly.',
    href: 'https://www.hp.com/us-en/shop/mdp/hp-omnidesk/hp-omnidesk-desktop',
    image: `assets/${SLUG}/cat-04.jpg`,
    alt: 'HP OmniDesk PC workspace',
  },
  {
    objectId: 'cat-05',
    title: 'HP OmniStudio & OmniStudio X PCs',
    description: 'All-in-one desktops with immersive displays, and built-in AI tools to help you create, collaborate, and stay productive.',
    href: 'https://www.hp.com/us-en/shop/vwa/desktops/brand=OmniStudio,OmniStudio-X',
    image: `assets/${SLUG}/cat-05.jpg`,
    alt: 'HP OmniStudio All-in-One desktop',
  },
  {
    objectId: 'cat-06',
    title: 'Desktops for work',
    description: 'Power every workday with secure, high-performance business desktops.',
    href: 'https://www.hp.com/us-en/shop/vwa/desktops/segm=Business',
    image: `assets/${SLUG}/cat-06.jpg`,
    alt: 'Business desktop workstation',
  },
];

const LIFESTYLE_TABS = [
  {
    label: 'High performance',
    viewAllLabel: 'View All High performance',
    viewAllHref: 'https://www.hp.com/us-en/shop/mlp/desktops/envy---sprout',
    products: [
      {
        title: 'HyperX OMEN MAX 45L Gaming Desktop',
        subtitle: 'Revolutionary cooling. Limitless performance.',
        msrp: '$3,959.99',
        price: '$2,809.99',
        href: 'https://www.hp.com/us-en/shop/mdp/envy---sprout/hyperx-omen-max-45l-gaming-desktop-desktops-tab4-module1-hyperxomenmax45l',
        image: `assets/${SLUG}/p-omen45l.webp`,
      },
      {
        title: 'HP OmniStudio X',
        subtitle: 'Ultimate entertainment. Genuine connections.',
        msrp: '$1,760.99',
        price: '$879.99',
        href: 'https://www.hp.com/us-en/shop/mdp/envy---sprout/hp-omnistudio-3074457345617987669--1',
        image: `assets/${SLUG}/p-omnistudiox.webp`,
      },
      {
        title: 'HyperX OMEN 35L Gaming Desktop',
        subtitle: "Get ready, it's play time.",
        msrp: '$2,579.99',
        price: '$1,869.99',
        href: 'https://www.hp.com/us-en/shop/mdp/envy---sprout/hyperx-omen-35l-tower-3074457345618127171--1',
        image: `assets/${SLUG}/p-omen35l.webp`,
      },
    ],
  },
  {
    label: 'All-in-Ones',
    viewAllLabel: 'View All All-in-Ones',
    viewAllHref: 'https://www.hp.com/us-en/shop/mlp/desktops/all-in-ones-349502--1',
    products: [
      {
        title: 'HP OmniStudio 24',
        subtitle: 'Built for home. Ready for everyone.',
        msrp: '$800.99',
        price: '$549.99',
        href: 'https://www.hp.com/us-en/shop/mdp/all-in-ones-349502--1/hp-omnistudio-24-3074457345618100673--1',
        image: `assets/${SLUG}/p-omnistudio24.webp`,
      },
      {
        title: 'HP OmniStudio 27',
        subtitle: 'Peak performer by day, entertainer by night.',
        msrp: '$1,129.99',
        price: '$649.99',
        href: 'https://www.hp.com/us-en/shop/mdp/all-in-ones-349502--1/hp-omnistudio-27-3074457345618100674--1',
        image: `assets/${SLUG}/p-omnistudio27.webp`,
      },
      {
        title: 'HP OmniStudio X',
        subtitle: 'Ultimate entertainment. Genuine connections.',
        msrp: '$1,760.99',
        price: '$879.99',
        href: 'https://www.hp.com/us-en/shop/mdp/all-in-ones-349502--1/omnistudio',
        image: `assets/${SLUG}/p-omnistudiox.webp`,
      },
    ],
  },
  {
    label: 'Gaming',
    viewAllLabel: 'View All Gaming',
    viewAllHref: 'https://www.hp.com/us-en/shop/mlp/desktops/gaming-367001--1',
    products: [
      {
        title: 'HyperX OMEN 35L Gaming Desktop',
        subtitle: "Get ready, it's play time.",
        msrp: '$2,579.99',
        price: '$1,869.99',
        href: 'https://www.hp.com/us-en/shop/mdp/gaming-367001--1/hyperx-omen-35l-tower-3074457345618127169--1',
        image: `assets/${SLUG}/p-omen35l.webp`,
      },
      {
        title: 'HyperX OMEN MAX 45L Gaming Desktop',
        subtitle: 'Revolutionary cooling. Limitless performance.',
        msrp: '$3,959.99',
        price: '$2,809.99',
        href: 'https://www.hp.com/us-en/shop/mdp/gaming-367001--1/hyperx-omen-max-45l-gaming-desktop-desktops-tab4-module8-hyperxomenmax45l',
        image: `assets/${SLUG}/p-omen45l.webp`,
      },
      {
        title: 'OMEN 16L Gaming Desktop',
        subtitle: 'Enter your new gaming era.',
        msrp: '$1,499.99',
        price: '$1,099.99',
        href: 'https://www.hp.com/us-en/shop/mdp/gaming-367001--1/omen-16l-gaming-desktop-3074457345618008169--1',
        image: `assets/${SLUG}/p-omen16l.webp`,
      },
    ],
  },
  {
    label: 'Great value',
    viewAllLabel: 'View All Great value',
    viewAllHref: 'https://www.hp.com/us-en/shop/mlp/desktops/hp---pavilion',
    products: [
      {
        title: 'HP OmniDesk Slim',
        subtitle: 'Slim, productive, and connected.',
        msrp: '$889.99',
        price: '$619.99',
        href: 'https://www.hp.com/us-en/shop/mdp/hp---pavilion/hp-omnidesk-slim',
        image: `assets/${SLUG}/p-omnidesk-slim.webp`,
      },
      {
        title: 'HP OmniStudio 24',
        subtitle: 'Built for home. Ready for everyone.',
        msrp: '$800.99',
        price: '$549.99',
        href: 'https://www.hp.com/us-en/shop/mdp/hp---pavilion/hp-omnistudio-24-3074457345618167170--1',
        image: `assets/${SLUG}/p-omnistudio24.webp`,
      },
      {
        title: 'HP OmniDesk Mini',
        subtitle: 'More space to think. Full power to create.',
        msrp: '$799.99',
        price: '$399.99',
        href: 'https://www.hp.com/us-en/shop/mdp/hp---pavilion/hp-omnidesk-mini',
        image: `assets/${SLUG}/p-omnidesk-mini.webp`,
      },
    ],
  },
  {
    label: 'Towers',
    viewAllLabel: 'View All Towers',
    viewAllHref: 'https://www.hp.com/us-en/shop/mlp/desktops/towers-349501--1',
    products: [
      {
        title: 'HP OmniDesk Mini',
        subtitle: 'More space to think. Full power to create.',
        msrp: '$799.99',
        price: '$399.99',
        href: 'https://www.hp.com/us-en/shop/mdp/towers-349501--1/hp-omnidesk-mini-3074457345618166676--1',
        image: `assets/${SLUG}/p-omnidesk-mini.webp`,
      },
      {
        title: 'HP OmniDesk Slim',
        subtitle: 'Slim, productive, and connected.',
        msrp: '$889.99',
        price: '$619.99',
        href: 'https://www.hp.com/us-en/shop/mdp/towers-349501--1/hp-omnidesk-slim-3074457345618166677--1',
        image: `assets/${SLUG}/p-omnidesk-slim.webp`,
      },
      {
        title: 'HP OmniDesk',
        subtitle: 'Effortless tech for at-home productivity.',
        msrp: '$1,029.99',
        price: '$559.99',
        href: 'https://www.hp.com/us-en/shop/mdp/towers-349501--1/hp-omnidesk-desktop-3074457345618013171--1',
        image: `assets/${SLUG}/p-omnidesk.webp`,
      },
    ],
  },
  {
    label: 'Business',
    viewAllLabel: 'View All Business',
    viewAllHref: 'https://www.hp.com/us-en/shop/mlp/desktops/elitedesk--prodesk---workstations',
    products: [
      {
        title: 'HP ProDesk 2 Mini (Intel)',
        subtitle: 'Compact business power designed for space-conscious teams.',
        msrp: '',
        price: '$2,086.00',
        href: 'https://www.hp.com/us-en/shop/mdp/elitedesk--prodesk---workstations/hp-prodesk-2-mini-(intel)-3074457345618166673--1',
        image: `assets/${SLUG}/p-prodesk2mini.webp`,
      },
      {
        title: 'HP EliteBoard (AMD)',
        subtitle: 'Desktop-grade power. Keyboard-sized freedom.',
        msrp: '$1,549.00',
        price: '$1,299.00',
        href: 'https://www.hp.com/us-en/shop/mdp/elitedesk--prodesk---workstations/hp-eliteboard-(amd)-3074457345618116671--1',
        image: `assets/${SLUG}/p-eliteboard.webp`,
      },
      {
        title: 'HP EliteStudio 8 All-in-One',
        subtitle: 'Collaborate seamlessly with a sophisticated AiO design',
        msrp: '$2,965.00',
        price: '$1,799.00',
        href: 'https://www.hp.com/us-en/shop/mdp/elitedesk--prodesk---workstations/hp-elitestudio-8-all-in-one-3074457345618081673--1',
        image: `assets/${SLUG}/p-elitestudio8.webp`,
      },
    ],
  },
];

const BRANDS = [
  { objectId: 'brand-01', title: 'HP OmniStudio', description: 'Ultimate entertainment. Genuine connections.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/hp-omnistudio', image: `assets/${SLUG}/p-omnistudiox.webp` },
  { objectId: 'brand-02', title: 'HP OmniDesk', description: 'Effortless tech for at-home productivity.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/hp-omnidesk', image: `assets/${SLUG}/p-omnidesk-mini.webp` },
  { objectId: 'brand-03', title: 'HP Desktop', description: 'Practically priced and feature-rich.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/hp--1', image: `assets/${SLUG}/b-hpdesktop.webp` },
  { objectId: 'brand-04', title: 'HP EliteBoard (AMD)', description: 'Desktop-grade power. Keyboard-sized freedom.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/eliteboard-(amd)', image: `assets/${SLUG}/p-eliteboard.webp` },
  { objectId: 'brand-05', title: 'HP Pro', description: 'Commercial-grade reliability, hardware security solutions.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/pro', image: `assets/${SLUG}/b-hppro.webp` },
  { objectId: 'brand-06', title: 'HyperX OMEN', description: 'Revolutionary cooling. Limitless performance.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/hyperx-omen-desktops-tab9-module22', image: `assets/${SLUG}/p-omen35l.webp` },
  { objectId: 'brand-07', title: 'OMEN', description: 'Gaming reinvented. Ominous.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/hp-omen-407503--1', image: `assets/${SLUG}/b-omen.webp` },
  { objectId: 'brand-08', title: 'Z by HP', description: 'Max performance, Remote Boost, ISV certification.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/z-workstation', image: `assets/${SLUG}/b-zbyhp.webp` },
  { objectId: 'brand-09', title: 'HP Thin Clients', description: 'ITDM design, cloud computing, fleet managed.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/thin-clients', image: `assets/${SLUG}/b-thinclients.webp` },
  { objectId: 'brand-10', title: 'HP Elite desktops', description: 'Expandability, quite design, enhanced manageability.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/elite-349506--1', image: `assets/${SLUG}/b-elitedesktops.webp` },
  { objectId: 'brand-11', title: 'HP EliteDesk 8', description: 'Designed to perform, impress, and protect.', href: 'https://www.hp.com/us-en/shop/mlp/desktops/hp-elitedesk-8-mini-(intel)-3074457345618066175--1', image: `assets/${SLUG}/b-elitedesk8.webp` },
  { objectId: 'brand-12', title: 'HP EliteStudio 8 All-in-One', description: 'Collaborate seamlessly with a sophisticated AiO design', href: 'https://www.hp.com/us-en/shop/mlp/desktops/hp-elitestudio-8-all-in-one-3074457345618081671--1', image: `assets/${SLUG}/p-elitestudio8.webp` },
];

const OFFERS = [
  {
    objectId: 'offer-01',
    title: 'Power your productivity',
    description: "Explore HP monitors engineered for today's AI-powered workflows.",
    href: 'https://www.hp.com/us-en/shop/slp/hp-monitors/hp-series-5-pro',
    image: `assets/${SLUG}/offer-01.jpg`,
    alt: 'HP 49-inch ultrawide monitor',
  },
  {
    objectId: 'offer-02',
    title: 'Accelerate your creativity',
    description: 'HP desktops with AMD Ryzen™ AI processors power accelerate rendering, editing, and AI-powered tools so your creativity stays in motion.',
    href: 'https://www.hp.com/us-en/shop/slp/amd-ryzen/desktops',
    image: `assets/${SLUG}/offer-02.jpg`,
    alt: 'HP desktop tower with AMD Ryzen AI',
  },
];

const ARTICLES = [
  {
    objectId: 'art-01',
    title: 'Meet the New HP OMEN Obelisk Gaming Desktop',
    description: 'Learn all about the new HP® OMEN Obelisk gaming desktop and its features for pro gamers on HP® Tech Takes.',
    href: 'https://www.hp.com/us-en/shop/tech-takes/hp-omen-obelisk-gaming-desktop',
    image: `assets/${SLUG}/art-01.jpg`,
  },
  {
    objectId: 'art-02',
    title: 'The 10 Best HP Desktops for Everyday Use',
    description: 'Discover which are the 10 Best HP Desktops for everyday use at home, PC gaming and for work convenience on HP® Tech Takes.',
    href: 'https://www.hp.com/us-en/shop/tech-takes/best-10-hp-desktops-for-everyday-use',
    image: `assets/${SLUG}/art-02.jpg`,
  },
  {
    objectId: 'art-03',
    title: "Best Desktop Computers to Gift: HP's Top Holiday PC Picks",
    description: "Find the perfect desktop computer gift for everyone on your list with HP's top holiday picks, from family PCs to gaming powerhouses with exceptional value.",
    href: 'https://www.hp.com/us-en/shop/tech-takes/5-best-hp-desktops-to-give-as-gifts',
    image: `assets/${SLUG}/art-03.jpg`,
  },
  {
    objectId: 'art-04',
    title: '5 Best Desktop Computers for Business from HP',
    description: 'Powerful, secure desktop computers still reign supreme for running a small- or medium-sized business. Here are the best 5 desktop computers for business from HP.',
    href: 'https://www.hp.com/us-en/shop/tech-takes/5-best-desktop-computers-for-business',
    image: `assets/${SLUG}/art-04.jpg`,
  },
  {
    objectId: 'art-05',
    title: 'Best Gifts for Someone Who Works from Home',
    description: 'Looking for the perfect gift for that person in your life who works remotely? Check out our picks for the perfect present for work-from-home professionals.',
    href: 'https://www.hp.com/us-en/shop/tech-takes/best-gifts-for-someone-who-works-from-home',
    image: `assets/${SLUG}/art-05.jpg`,
  },
  {
    objectId: 'art-06',
    title: 'Workstation vs. desktop: Key differences for your business',
    description: 'Learn the key differences between workstations and desktops to determine which is best for your business needs. Explore HP’s powerful workstation options.',
    href: 'https://www.hp.com/us-en/shop/tech-takes/workstation-vs-desktop-business',
    image: `assets/${SLUG}/art-06.jpg`,
  },
  {
    objectId: 'art-07',
    title: 'Desktops vs. Laptops vs. All-in-Ones for Small Businesses',
    description: 'Explore a comprehensive comparison of desktops, laptops, and all-in-ones to determine the ideal PC solution for your small business. Weigh the pros, cons, and cost implications to make an informed choice.',
    href: 'https://www.hp.com/us-en/shop/tech-takes/desktops-vs-laptops-all-in-ones-smb',
    image: `assets/${SLUG}/art-07.jpg`,
  },
];

// Write original-page-content-reference for sourceAbsent validation
fs.mkdirSync(path.dirname(SOURCE_REF_ABS), { recursive: true });
fs.writeFileSync(
  SOURCE_REF_ABS,
  JSON.stringify(
    {
      kind: 'original-page-content-reference',
      source: 'https://www.hp.com/us-en/shop/cat/desktops',
      capturedAt: '2026-11-24',
      modules: [
        {
          id: 'categories',
          items: CATEGORIES.map((c) => ({ objectId: c.objectId, title: c.title, description: c.description, link: 'Shop' })),
        },
        {
          id: 'brands',
          items: BRANDS.map((b) => ({ objectId: b.objectId, title: b.title, description: b.description, link: 'Shop' })),
        },
        {
          id: 'offers',
          items: OFFERS.map((o) => ({ objectId: o.objectId, title: o.title, description: o.description, link: 'Shop' })),
        },
        {
          id: 'articles',
          items: ARTICLES.map((a) => ({ objectId: a.objectId, title: a.title, description: a.description, link: 'Read more' })),
        },
      ],
    },
    null,
    2
  )
);

function buildPage() {
  const customCss = `
    ${H.basePageCss()}
    .hero-surface__scrim { background: rgba(0, 0, 0, 0.35); }
    .hp-breadcrumb-bar {
      background: #FFFFFF;
      border-bottom: 1px solid #F0F0F2;
    }
    .hp-breadcrumb-inner {
      max-width: 1200px;
      margin: 0 auto;
      min-height: 44px;
      padding: 10px 0;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }
    .hp-trending-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 24px;
    }
    .hp-trending-title {
      margin: 0;
      font-size: 24px;
      line-height: 32px;
      font-weight: 600;
      color: #19191A;
    }
    .hp-partner-strip {
      display: flex;
      align-items: center;
      gap: 20px;
      flex-shrink: 0;
    }
    .hp-partner-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #4B4B4D;
    }
    .hp-partner-intel {
      height: 32px;
      width: auto;
      display: block;
    }
    .hp-partner-win11 {
      height: 28px;
      width: auto;
      display: block;
    }
    .hp-partner-caption {
      display: flex;
      flex-direction: column;
      font-size: 11px;
      line-height: 15px;
      color: #4B4B4D;
    }
    .hp-partner-caption-strong {
      font-weight: 600;
      color: #19191A;
    }
    .hp-partner-footer {
      display: flex;
      justify-content: center;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid #EAECEF;
    }

    /* Lifestyle tabbed 3-column product showcase (Gray section -> borderless white cards) */
    .hp-tab-bar {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .hp-lifestyle-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    .hp-prod-card {
      background: #FFFFFF;
      border-radius: 8px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 16px;
      transition: box-shadow 0.2s ease;
    }
    .hp-prod-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }
    .hp-prod-media {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FAFBFB;
      border-radius: 4px;
      padding: 16px;
    }
    .hp-prod-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }
    .hp-prod-title {
      margin: 14px 0 6px;
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      color: #19191A;
    }
    .hp-prod-sub {
      margin: 0;
      font-size: 13px;
      line-height: 20px;
      color: #646466;
    }
    .hp-prod-foot {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 12px;
      border-top: 1px solid #F0F0F2;
    }
    .hp-prod-prices {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }
    .hp-prod-msrp {
      font-size: 13px;
      color: #71717A;
      text-decoration: line-through;
    }
    .hp-prod-sale {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      color: #C00000;
    }
    .hp-view-all-row {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }
    .hp-hidden-tpl {
      display: none;
    }

    /* Section 9: Pre-Footer Quick Links & Need help? (White Section -> borderless clean horizontal strip) */
    .hp-support-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      padding: 8px 0;
    }
    .hp-quick-links {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px 32px;
      flex: 1;
    }
    .hp-quick-link {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: #19191A;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      white-space: nowrap;
      transition: color 0.15s;
    }
    .hp-quick-link:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .hp-quick-icon {
      width: 20px;
      height: 20px;
      display: block;
      flex-shrink: 0;
      opacity: 0.78;
    }
    .hp-help-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-left: 32px;
      border-left: 1px solid #EAECEF;
      flex-shrink: 0;
    }
    .hp-help-avatar-wrap {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #F4F5F7;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .hp-help-avatar {
      width: 22px;
      height: 22px;
      display: block;
      opacity: 0.78;
    }
    .hp-help-title {
      margin: 0 0 2px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: #19191A;
    }
    .hp-help-actions {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .hp-help-link {
      font-size: 13px;
      line-height: 20px;
      color: #0060BF;
      text-decoration: none;
    }
    .hp-help-link:hover {
      text-decoration: underline;
    }

    /* Section 10: Pre-Footer Horizontal Disclosure Bar (Pattern 14, Gray Band) */
    .hp-info-band {
      background: #FAFBFB;
      border-top: 1px solid #EAECEF;
      padding: 18px 0;
    }
    .hp-info-triggers {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
    }
    .hp-info-trigger {
      appearance: none;
      border: none;
      background: transparent;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 28px;
      font-family: inherit;
      font-size: 13px;
      line-height: 20px;
      font-weight: 600;
      color: #4B4B4D;
      cursor: pointer;
      position: relative;
      transition: color 0.15s ease;
    }
    .hp-info-trigger + .hp-info-trigger {
      border-left: 1px solid #E5E5E5;
    }
    .hp-info-trigger:hover,
    .hp-info-trigger[aria-expanded="true"] {
      color: #19191A;
    }
    .hp-info-trigger[aria-expanded="true"]::after {
      content: "";
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: -2px;
      height: 2px;
      background: #C00000;
    }
    .hp-info-chevron {
      width: 14px;
      height: 14px;
      display: block;
      opacity: 0.65;
      transition: transform 0.2s ease, opacity 0.15s ease;
    }
    .hp-info-trigger[aria-expanded="true"] .hp-info-chevron {
      transform: rotate(180deg);
      opacity: 1;
    }
    .hp-info-drawer {
      margin-top: 18px;
      background: #FFFFFF;
      border-radius: 8px;
      padding: 24px 28px;
    }
    .hp-info-drawer[hidden] {
      display: none;
    }
    .hp-info-links-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px 24px;
    }
    .hp-info-link {
      font-size: 13px;
      line-height: 20px;
      color: #4B4B4D;
      text-decoration: none;
    }
    .hp-info-link:hover {
      color: #19191A;
      text-decoration: underline;
    }
    .hp-info-guide-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 24px;
    }
    .hp-info-guide-title {
      margin: 0 0 8px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 600;
      color: #19191A;
    }
    .hp-info-guide-text {
      margin: 0;
      font-size: 13px;
      line-height: 20px;
      color: #4B4B4D;
    }
    .hp-info-disclaimer {
      margin: 0;
      font-size: 12px;
      line-height: 20px;
      color: #6B6E75;
    }
  `;

  const partnerBadgesHtml = `
    <div class="hp-partner-strip">
      <a class="hp-partner-link" href="https://www.hp.com/us-en/shop/cv/hp-intel">
        <img class="hp-partner-intel" src="assets/${SLUG}/badge-intel.png" alt="Intel Core Ultra Series 3">
        <span class="hp-partner-caption">
          <span class="hp-partner-caption-strong">Intel® Core™ Ultra Series 3</span>
          <span>That’s the power of Intel Inside®</span>
        </span>
      </a>
      <a class="hp-partner-link" href="https://www.hp.com/us-en/software/microsoft-windows-11.html">
        <img class="hp-partner-win11" src="assets/${SLUG}/badge-win11.jpg" alt="Get to know Windows 11 devices">
      </a>
    </div>
  `;

  const categoryCardsHtml = CATEGORIES.map((c) =>
    H.compTag('library-card', 'spliced-vertical-single-event-bordered', {
      title: c.title,
      description: `<p>${H.esc(c.description)}</p>`,
      image: `<img src="${H.esc(c.image)}" alt="${H.esc(c.alt)}">`,
      linkLabel: 'Shop',
      href: c.href,
      sourceAbsent: { reference: SOURCE_REF, objectId: c.objectId, slots: ['category'] },
    })
  ).join('\n');

  const firstTab = LIFESTYLE_TABS[0];
  const initialLifestyleCardsHtml = firstTab.products
    .map(
      (p) => `
      <article class="hp-prod-card">
        <div>
          <div class="hp-prod-media"><img class="hp-prod-img" src="${H.esc(p.image)}" alt="${H.esc(p.title)}"></div>
          <h3 class="hp-prod-title">${H.esc(p.title)}</h3>
          <p class="hp-prod-sub">${H.esc(p.subtitle)}</p>
        </div>
        <div class="hp-prod-foot">
          <div class="hp-prod-prices">
            ${p.msrp ? `<span class="hp-prod-msrp">${H.esc(p.msrp)}</span>` : ''}
            <span class="hp-prod-sale">${H.esc(p.price)}</span>
          </div>
          <div>
            ${H.compTag('library-button', 'outline-black', {
              label: 'Shop',
              actionCallback: 'onProductShop',
            })}
          </div>
        </div>
      </article>
    `
    )
    .join('\n');

  const brandCarouselHtml = H.compTag('library-carousel', 'external-cards', {
    columns: 4,
    accessibleLabel: 'Shop our desktop brands',
    items: BRANDS.map((b) => ({
      component: 'library-card',
      fragment: 'spliced-vertical-single-event',
      props: {
        title: b.title,
        description: `<p>${H.esc(b.description)}</p>`,
        image: `<img src="${H.esc(b.image)}" alt="${H.esc(b.title)}">`,
        linkLabel: 'Shop',
        href: b.href,
        sourceAbsent: { reference: SOURCE_REF, objectId: b.objectId, slots: ['category'] },
      },
    })),
  });

  const offerCardsHtml = OFFERS.map((o) =>
    H.compTag('library-card', 'spliced-vertical-single-event-bordered', {
      title: o.title,
      description: `<p>${H.esc(o.description)}</p>`,
      image: `<img src="${H.esc(o.image)}" alt="${H.esc(o.alt)}">`,
      linkLabel: 'Shop',
      href: o.href,
      sourceAbsent: { reference: SOURCE_REF, objectId: o.objectId, slots: ['category'] },
    })
  ).join('\n');

  const articlesCarouselHtml = H.compTag('library-carousel', 'external-cards', {
    columns: 4,
    accessibleLabel: 'Related articles',
    items: ARTICLES.map((a) => ({
      component: 'library-card',
      fragment: 'spliced-vertical-single-event',
      props: {
        title: a.title,
        description: `<p>${H.esc(a.description)}</p>`,
        image: `<img src="${H.esc(a.image)}" alt="${H.esc(a.title)}">`,
        linkLabel: 'Read more',
        href: a.href,
        sourceAbsent: { reference: SOURCE_REF, objectId: a.objectId, slots: ['category'] },
      },
    })),
  });

  const mainHtml = `
    <!-- Section 1: Breadcrumb -->
    <div class="hp-breadcrumb-bar">
      <div class="hp-breadcrumb-inner">
        ${H.compTag('library-breadcrumb', 'default', {
          items: '<div class="ds-breadcrumb__item"><a href="https://www.hp.com/us-en/shop" class="ds-breadcrumb__link">Home</a><span class="ds-breadcrumb__separator" aria-hidden="true">/</span></div><div class="ds-breadcrumb__item"><span class="ds-breadcrumb__current">Desktops</span></div>',
        })}
      </div>
    </div>

    <!-- Section 2: Black Friday Sale Hero Banner (FS Default Left-Aligned 360px) -->
    <section class="hero-surface" aria-label="Black Friday Sale">
      <img class="hero-surface__bg" src="assets/${SLUG}/hero-bf.jpg" alt="All-in-One and tower desktops">
      <div class="hero-surface__scrim"></div>
      <div class="hero-surface__inner">
        ${H.compTag('library-banner', 'hero-responsive', {
          title: 'Black Friday Sale',
          description: 'Save up to 50% on select desktop doorbusters, plus pay with HP Financing. Protect your brand-new PC and get 35% off select HP Care Packs.',
          actionLabel: 'Shop',
          actionHref: 'https://www.hp.com/us-en/shop/slp/black-friday-sale/desktops',
          surface: 'image',
          height: '360',
          align: 'left',
        })}
      </div>
    </section>

    <!-- Section 3: Trending desktops: See what's new! (White Section -> Bordered 3x2 Cards) -->
    <section id="trending-desktops" class="page-section">
      <div class="container">
        <div class="hp-trending-head" data-fs-extend="trending-header-with-partner-badges">
          <h1 class="hp-trending-title">Trending desktops: See what’s new!</h1>
          ${partnerBadgesHtml}
        </div>
        <div class="grid grid--3">
          ${categoryCardsHtml}
        </div>
      </div>
    </section>

    <!-- Section 4: A desktop for every lifestyle (Gray Section -> Tabs + 3-Col Borderless White Product Cards) -->
    <section id="lifestyle-desktops" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">A desktop for every lifestyle</h2>
        </div>
        <div class="hp-tab-bar" id="hp-lifestyle-tabs">
          ${H.compTag('library-tab', 'product', {
            items: LIFESTYLE_TABS.map((t, i) => {
              const icons = [
                `assets/${SLUG}/tab-performance.svg`,
                `assets/${SLUG}/tab-aio.svg`,
                `assets/${SLUG}/tab-gaming.svg`,
                `assets/${SLUG}/tab-value.svg`,
                `assets/${SLUG}/tab-towers.svg`,
                `assets/${SLUG}/tab-business.svg`,
              ];
              return `<div class="ds-tab__item${i === 0 ? ' ds-tab__item--active' : ''}" data-tab-item=""><div class="ds-tab__item-icon"><img src="${icons[i]}" alt=""></div><div class="ds-tab__item-inner"><span class="ds-tab__item-text">${H.esc(t.label)}</span>${i === 0 ? '<div class="ds-tab__indicator"></div>' : ''}</div></div>`;
            }).join(''),
          })}
        </div>
        <div class="hp-lifestyle-grid" id="hp-lifestyle-grid" data-fs-extend="lifestyle-product-cards">
          ${initialLifestyleCardsHtml}
        </div>
        <div class="hp-view-all-row" id="hp-view-all-wrap">
          ${H.compTag('library-text-button', 'inline-blue-link', {
            label: firstTab.viewAllLabel,
            href: firstTab.viewAllHref,
          })}
        </div>
        <div class="hp-hidden-tpl" id="hp-shop-btn-tpl" aria-hidden="true">
          ${H.compTag('library-button', 'outline-black', {
            label: 'Shop',
            actionCallback: 'onProductShop',
          })}
        </div>
      </div>
    </section>

    <!-- Section 5: Holiday Gift Guide (White Section -> Horizontal Full-Width Card) -->
    <section id="holiday-gift-guide" class="page-section">
      <div class="container">
        ${H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
          title: 'Holiday Gift Guide',
          description: 'Discover exceptional technology chosen to inspire and delight.',
          image: `<img src="assets/${SLUG}/promo-holiday.jpg" alt="Holiday Gift Guide laptop and desktop">`,
          linkLabel: 'Shop',
          href: 'https://www.hp.com/us-en/shop/slp/holiday-gift-guide',
          imagePosition: 'right',
        })}
      </div>
    </section>

    <!-- Section 6: Shop our desktop brands (Gray Section -> 4-Col External Cards Carousel) -->
    <section id="desktop-brands" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Shop our desktop brands</h2>
        </div>
        ${brandCarouselHtml}
      </div>
    </section>

    <!-- Section 7: Two-Column Promo Offers (White Section -> 2-Col Bordered Cards) -->
    <section id="promo-offers" class="page-section">
      <div class="container">
        <div class="grid grid--2">
          ${offerCardsHtml}
        </div>
      </div>
    </section>

    <!-- Section 8: Related articles (Gray Section -> 4-Col External Cards Carousel) -->
    <section id="related-articles" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Related articles</h2>
        </div>
        ${articlesCarouselHtml}
      </div>
    </section>

    <!-- Section 9: Quick Links & Need help? (White Section -> Bordered Cards) -->
    <section id="support-quick-links" class="page-section">
      <div class="container">
        <div class="hp-support-row" data-fs-extend="pre-footer-quick-links">
          <div class="hp-quick-links">
            <a class="hp-quick-link" href="https://www.hp.com/us-en/shop/cv/coupons-promo">
              <img class="hp-quick-icon" src="assets/${SLUG}/svc-coupons.svg" alt="">
              <span>Coupons &amp; Promos</span>
            </a>
            <a class="hp-quick-link" href="tel:877-203-4758">
              <img class="hp-quick-icon" src="assets/${SLUG}/svc-phone.svg" alt="">
              <span>Order by Phone 877-203-4758</span>
            </a>
            <a class="hp-quick-link" href="tel:888-860-9635">
              <img class="hp-quick-icon" src="assets/${SLUG}/svc-advisor.svg" alt="">
              <span>HP Sales Advisors</span>
            </a>
            <a class="hp-quick-link" href="https://www.hp.com/us-en/shop/cat/business-solutions">
              <img class="hp-quick-icon" src="assets/${SLUG}/svc-business.svg" alt="">
              <span>HP for Business</span>
            </a>
            <a class="hp-quick-link" href="https://www.hp.com/us-en/shop/slp/holiday-gift-guide">
              <img class="hp-quick-icon" src="assets/${SLUG}/svc-gift.svg" alt="">
              <span>HP Holiday Gift Guide</span>
            </a>
          </div>
          <div class="hp-help-card">
            <div class="hp-help-avatar-wrap"><img class="hp-help-avatar" src="assets/${SLUG}/svc-support-rep.svg" alt="Chat with a sales rep"></div>
            <div>
              <h2 class="hp-help-title">Need help?</h2>
              <div class="hp-help-actions">
                <a class="hp-help-link" href="#support-quick-links">Chat with a sales rep</a>
                <a class="hp-help-link" href="https://www.hp.com/us-en/shop/SendEmailView?catalogId=10051&amp;langId=-1&amp;storeId=10151">Send us an email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 10: Pre-Footer Horizontal Disclosure Bar (Pattern 14 — no forced FAQ component) -->
    <section id="more-information" class="hp-info-band" data-fs-extend="pre-footer-disclosure-bar">
      <div class="container">
        <div class="hp-info-triggers" role="group" aria-label="Additional desktop information">
          <button type="button" class="hp-info-trigger" data-hp-drawer="links" aria-expanded="false" aria-controls="hp-drawer-links">
            <span>More Useful Links</span>
            <img class="hp-info-chevron" src="assets/${SLUG}/icon-chevron-down.svg" alt="">
          </button>
          <button type="button" class="hp-info-trigger" data-hp-drawer="products" aria-expanded="false" aria-controls="hp-drawer-products">
            <span>More About These Products</span>
            <img class="hp-info-chevron" src="assets/${SLUG}/icon-chevron-down.svg" alt="">
          </button>
          <button type="button" class="hp-info-trigger" data-hp-drawer="disclaimers" aria-expanded="false" aria-controls="hp-drawer-disclaimers">
            <span>Site Disclaimers</span>
            <img class="hp-info-chevron" src="assets/${SLUG}/icon-chevron-down.svg" alt="">
          </button>
        </div>

        <div id="hp-drawer-links" class="hp-info-drawer" data-hp-panel="links" hidden>
          <div class="hp-info-links-grid">
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/cat/desktops">Learn About Business Desktop Computers</a>
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/cv/weekly-deals">Weekly Deals on HP Desktop Computers</a>
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/cat/desktops">Best Desktops For Home &amp; Office</a>
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/slp/desktop-deals">Desktop Deals (Updated Daily)</a>
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/cat/desktops">Learn About Desktops &amp; All-in-One Computers</a>
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/mdp/desktops/hp-envy-desktop">HP Envy Desktops</a>
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/slp/ai-pc">AI PCs</a>
            <a class="hp-info-link" href="https://www.hp.com/us-en/shop/cat/desktops">HP OmniDesk Desktop PCs</a>
          </div>
        </div>

        <div id="hp-drawer-products" class="hp-info-drawer" data-hp-panel="products" hidden>
          <div class="hp-info-guide-grid">
            <div>
              <h3 class="hp-info-guide-title">HyperX OMEN Gaming</h3>
              <p class="hp-info-guide-text">HyperX OMEN gaming desktops ship with RTX 5080 / RTX 5090 graphics, up to 32GB DDR5 RAM, and Wi-Fi 7 connectivity in a tool-free chassis.</p>
            </div>
            <div>
              <h3 class="hp-info-guide-title">HP Z Workstations</h3>
              <p class="hp-info-guide-text">HP Z4 &amp; Z8 workstations configure with Xeon W-3400 processors, up to 256GB ECC RAM, and ISV-certified NVIDIA RTX 4000/5000 Ada graphics for CAD, simulation, and AI workloads.</p>
            </div>
            <div>
              <h3 class="hp-info-guide-title">HP Business Desktops</h3>
              <p class="hp-info-guide-text">HP EliteDesk towers and HP EliteOne all-in-ones deliver Intel vPro manageability and HP Wolf Security for enterprise fleets.</p>
            </div>
          </div>
        </div>

        <div id="hp-drawer-disclaimers" class="hp-info-drawer" data-hp-panel="disclaimers" hidden>
          <p class="hp-info-disclaimer">Product availability, features, and specifications mentioned in this content are subject to change without notice and may vary by country or region. Microsoft and Windows are registered trademarks of Microsoft Corporation. Intel, Intel Core, and Intel Inside are trademarks of Intel Corporation.</p>
        </div>
      </div>
    </section>
  `;

  const inlineScript = `
  (function () {
    const LIFESTYLE_TABS = ${JSON.stringify(LIFESTYLE_TABS)};
    window.onProductShop = function () {
      const target = document.getElementById('desktop-brands');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    };

    const tabHost = document.getElementById('hp-lifestyle-tabs');
    const gridEl = document.getElementById('hp-lifestyle-grid');
    const viewAllWrap = document.getElementById('hp-view-all-wrap');
    const shopBtnTpl = document.getElementById('hp-shop-btn-tpl')?.innerHTML || '';

    if (tabHost && gridEl) {
      const renderTab = (idx) => {
        const tab = LIFESTYLE_TABS[idx] || LIFESTYLE_TABS[0];
        gridEl.innerHTML = tab.products
          .map(
            (p) =>
              '<article class="hp-prod-card">' +
                '<div>' +
                  '<div class="hp-prod-media"><img class="hp-prod-img" src="' + p.image + '" alt="' + p.title + '"></div>' +
                  '<h3 class="hp-prod-title">' + p.title + '</h3>' +
                  '<p class="hp-prod-sub">' + p.subtitle + '</p>' +
                '</div>' +
                '<div class="hp-prod-foot">' +
                  '<div class="hp-prod-prices">' +
                    (p.msrp ? '<span class="hp-prod-msrp">' + p.msrp + '</span>' : '') +
                    '<span class="hp-prod-sale">' + p.price + '</span>' +
                  '</div>' +
                  '<div>' + shopBtnTpl + '</div>' +
                '</div>' +
              '</article>'
          )
          .join('');
        gridEl.querySelectorAll('[data-library-event-actioncallback="onProductShop"]').forEach((b) => {
          b.addEventListener('click', window.onProductShop);
        });
        if (viewAllWrap) {
          const link = viewAllWrap.querySelector('a');
          const lbl = viewAllWrap.querySelector('.ds-text-btn__text');
          if (link) link.setAttribute('href', tab.viewAllHref);
          if (lbl) lbl.textContent = tab.viewAllLabel;
        }
      };

      const handleSwitch = (e) => {
        const item = e.target.closest('[data-tab-item]');
        if (!item) return;
        const all = Array.from(tabHost.querySelectorAll('[data-tab-item]'));
        const idx = all.indexOf(item);
        if (idx >= 0) renderTab(idx);
      };
      tabHost.addEventListener('click', handleSwitch);
      tabHost.addEventListener('mouseover', handleSwitch);
      tabHost.addEventListener('ds:tab-change', (e) => {
        if (typeof e.detail?.index === 'number') renderTab(e.detail.index);
      });
    }

    const triggers = Array.from(document.querySelectorAll('[data-hp-drawer]'));
    const panels = Array.from(document.querySelectorAll('[data-hp-panel]'));
    triggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-hp-drawer');
        const wasOpen = btn.getAttribute('aria-expanded') === 'true';
        triggers.forEach((t) => t.setAttribute('aria-expanded', 'false'));
        panels.forEach((p) => { p.hidden = true; });
        if (!wasOpen) {
          btn.setAttribute('aria-expanded', 'true');
          const target = panels.find((p) => p.getAttribute('data-hp-panel') === key);
          if (target) target.hidden = false;
        }
      });
    });
  })();
  `;

  const pageSourceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1440">
  <title>Desktop Computers & All-in-One PCs | FS</title>
  <style>${customCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}
  <main>
    ${mainHtml}
  </main>
  ${H.compTag('library-navigation', 'footer', {})}
  <script>${inlineScript}</script>
</body>
</html>`;

  H.assembleLocalPage(pageSourceHtml, OUT_FILE);
  console.log('Built:', path.relative(ROOT, OUT_FILE));
}

buildPage();
