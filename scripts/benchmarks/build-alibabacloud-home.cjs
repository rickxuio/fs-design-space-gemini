#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const H = require('../page-helpers.cjs');

const ROOT = path.resolve(__dirname, '../..');
const SLUG = 'alibabacloud-home';
const SOURCE_REF = `reference-inputs/${SLUG}/content.json`;
const RELEASE = H.getActiveRelease();

const TRUST_RECOGNITIONS = [
  { org: 'Hugging Face', logo: `assets/${SLUG}/trust-1-hf.png`, text: '#1 most downloaded open-source LLM model. Over 4 billion.' },
  { org: 'Omdia', logo: `assets/${SLUG}/trust-2-omdia.png`, text: 'Leader in Global Enterprise-Level MaaS' },
  { org: 'Forrester', logo: `assets/${SLUG}/trust-3-forrester.png`, text: 'Recognized Leader in AI Infrastructure Solutions' },
  { org: 'Gartner', logo: `assets/${SLUG}/trust-4-gartner.png`, text: 'Leader in Cloud AI Infrastructure' },
  { org: 'Olympics', logo: `assets/${SLUG}/trust-5-olympics.png`, text: 'Official Cloud Partner of the Olympics' },
  { org: 'Salesforce', logo: `assets/${SLUG}/trust-6-salesforce.png`, text: "Integrated with the world's #1 CRM" },
];

const QUICK_PROMOS = [
  {
    title: 'Migrate & Save',
    desc: 'Superior Performance At Lower Pricing.',
    href: 'https://www.alibabacloud.com/en/solutions/migration',
  },
  {
    title: 'Qwen4-Max Now Live with Token Plan',
    desc: 'Start from $3/mo - Enjoy all-in-one access to industry leading models.',
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
  {
    title: 'Wan3.0 Premium Video Lower Cost',
    desc: 'Any input, complete stories — up to 30 seconds of video in a single generation.',
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
  {
    title: 'Enterprise AI Agents for Every Daily Task',
    desc: 'Multi-model agents for workplace productivity and coding.',
    href: 'https://www.alibabacloud.com/en/solutions/ai',
  },
];

const STACK_PILLARS = [
  { title: 'Full Stack', desc: 'From development to deployment' },
  { title: 'Multi-Region', desc: 'Supports 119 languages and dialects' },
  { title: 'Open Source', desc: 'Most downloaded LLM, over 4 billion downloads' },
  { title: 'Multi-Modal', desc: 'Handles text, image, and video inputs' },
];

const STACK_TABS = [
  {
    id: 'all-in-one',
    title: 'All in One. AI + Cloud.',
    desc: 'IaaS, MaaS, PaaS seamlessly unified. From infrastructure to models to apps—launch your first workload in minutes. Start your free trial today.',
    cta: 'Start for Free',
    href: 'https://www.alibabacloud.com/en/free',
    highlightLayer: 0,
  },
  {
    id: 'model-studio',
    title: 'Model Studio',
    desc: 'Model Studio enables fast development of Gen AI apps using foundational models like Qwen-Max and Qwen-VL. Developers can focus on building without worrying about infrastructure, with secure workloads running in isolated VPC networks for data privacy.',
    cta: 'Learn More',
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
    highlightLayer: 0,
  },
  {
    id: 'pai',
    title: 'Platform for AI',
    desc: "Platform for AI (PAI) is Alibaba Cloud's scalable, cost-effective platform for machine learning and deep learning. It offers tools for the entire AI development cycle, from data labeling and model building to training, optimization, and deployment.",
    cta: 'Learn More',
    href: 'https://www.alibabacloud.com/en/product/machine-learning',
    highlightLayer: 1,
  },
];

const QWEN_BULLETS = [
  '#1 world largest open-source model family',
  'Efficient and precise model service calls',
  'Comprehensive multimodal models',
  'Trillion-scale data training',
  'Industry-leading algorithm',
];

const QWEN_MODELS = [
  {
    objectId: 'qwen-video',
    title: 'Video Generation Models',
    tag: 'Wan3.0-Video',
    description:
      'All-in-one video generation model with unified support for reference, editing, replication, and driving.',
    icon: `assets/${SLUG}/icon-qwen-video.svg`,
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
  {
    objectId: 'qwen-vision',
    title: 'Visual Understanding Models',
    tag: 'Qwen-3.8-Flash',
    description:
      'Latest cost-optimized multimodal model, fast reasoning for coding, agent workflows, and visual understanding.',
    icon: `assets/${SLUG}/icon-qwen-vision.svg`,
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
  {
    objectId: 'qwen-image',
    title: 'Image Generation',
    tag: 'Qwen-Image-3.0',
    description:
      'Reduces the AI-like feel in generated images, enhancing realism with exceptional text rendering.',
    icon: `assets/${SLUG}/icon-qwen-image.svg`,
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
  {
    objectId: 'qwen-text',
    title: 'Text Generation',
    tag: 'Qwen4-Max',
    description:
      'Most capable 2.4T MoE flagship, built for professional work, creative production, and long-horizon autonomous tasks.',
    icon: `assets/${SLUG}/icon-qwen-text.svg`,
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
  {
    objectId: 'qwen-multimodal',
    title: 'Multimodal Large-scale Models',
    tag: 'Qwen3.8-Omni-Flash',
    description:
      'Cost-optimized omni-modal agentic model turning audio, video, and images into text across editing and narration.',
    icon: `assets/${SLUG}/icon-qwen-multimodal.svg`,
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
  {
    objectId: 'qwen-speech',
    title: 'Speech Recognition Model',
    tag: 'Qwen-Audio-3.1-ASR-Message',
    description:
      'ASR model for seamless long-audio transcription tuned by custom languages and industry hotwords.',
    icon: `assets/${SLUG}/icon-qwen-speech.svg`,
    href: 'https://www.alibabacloud.com/en/product/modelstudio',
  },
];

const PRODUCT_CATEGORIES = [
  {
    id: 'selected',
    label: 'Selected Products',
    items: [
      { title: 'Elastic Compute Service (ECS)', badge: 'Forrester', desc: 'Host your website and scale enterprise workloads anywhere.', href: 'https://www.alibabacloud.com/en/product/ecs' },
      { title: 'Container Service for Kubernetes (ACK)', badge: 'Gartner', desc: 'Run and scale containerized applications on managed Kubernetes infrastructure.', href: 'https://www.alibabacloud.com/en/product/kubernetes' },
      { title: 'Elastic IP Address (EIP)', badge: '', desc: 'Manage your public IPs independently to improve internet network quality.', href: 'https://www.alibabacloud.com/en/product/eip' },
      { title: 'ApsaraDB RDS', badge: 'Gartner', desc: 'Store and manage your business data, with automated monitoring and backups.', href: 'https://www.alibabacloud.com/en/product/apsaradb-for-rds' },
      { title: 'Object Storage Service (OSS)', badge: '', desc: 'Store large amounts of data in the cloud and access it anywhere, anytime.', href: 'https://www.alibabacloud.com/en/product/oss' },
      { title: 'Domain Names and Website', badge: '', desc: 'Get the perfect domain name to suit your every need.', href: 'https://www.alibabacloud.com/en/domain' },
      { title: 'Alibaba Cloud Model Studio', badge: 'Omdia', desc: 'Supercharge your AI journey effortlessly with industry-leading GenAI models.', href: 'https://www.alibabacloud.com/en/product/modelstudio' },
      { title: 'Quick BI', badge: 'Gartner', desc: 'AI-Native business intelligence platform for analytics and visualization workflows.', href: 'https://www.alibabacloud.com/en/product/quickbi' },
      { title: 'Qoder CN', badge: '', desc: 'An AI coding assistant that helps developers code faster and more easily.', href: 'https://www.alibabacloud.com/en/product/qoder' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    items: [
      { title: 'Alibaba Cloud Model Studio', badge: 'Omdia', desc: 'Unified enterprise MaaS platform for Qwen, Wan, and third-party foundation models.', href: 'https://www.alibabacloud.com/en/product/modelstudio' },
      { title: 'Platform for AI (PAI)', badge: 'Forrester', desc: 'End-to-end machine learning platform from data labeling to distributed training and inference.', href: 'https://www.alibabacloud.com/en/product/machine-learning' },
      { title: 'Qoder AI Coding Assistant', badge: '', desc: 'Autonomous coding agent supporting multi-file reasoning, tool calling, and code review.', href: 'https://www.alibabacloud.com/en/product/qoder' },
    ],
  },
  {
    id: 'computing',
    label: 'Computing',
    items: [
      { title: 'Elastic Compute Service (ECS)', badge: 'Forrester', desc: 'Scalable virtual machines with GPU, ARM, and high-frequency enterprise instances.', href: 'https://www.alibabacloud.com/en/product/ecs' },
      { title: 'Container Service for Kubernetes (ACK)', badge: 'Gartner', desc: 'Enterprise-grade managed Kubernetes for cloud-native and AI inference workloads.', href: 'https://www.alibabacloud.com/en/product/kubernetes' },
      { title: 'Simple Application Server (SAS)', badge: '', desc: 'All-in-one server with pre-configured images for fast website and app deployment.', href: 'https://www.alibabacloud.com/en/product/swas' },
    ],
  },
  {
    id: 'storage',
    label: 'Storage',
    items: [
      { title: 'Object Storage Service (OSS)', badge: '', desc: 'Encrypted, durable cloud object storage with 99.9999999999% data durability.', href: 'https://www.alibabacloud.com/en/product/oss' },
      { title: 'Elastic Block Storage (EBS)', badge: '', desc: 'Low-latency, high-IOPS NVMe SSD block storage for enterprise databases and AI workloads.', href: 'https://www.alibabacloud.com/en/product/ebs' },
      { title: 'File Storage NAS', badge: '', desc: 'Shared POSIX-compliant distributed file system for containers, media, and AI training.', href: 'https://www.alibabacloud.com/en/product/nas' },
    ],
  },
  {
    id: 'networking',
    label: 'Networking',
    items: [
      { title: 'Elastic IP Address (EIP)', badge: '', desc: 'Independent static public IP resources dynamically bound to cloud instances.', href: 'https://www.alibabacloud.com/en/product/eip' },
      { title: 'Cloud Enterprise Network (CEN)', badge: '', desc: 'Global low-latency private backbone interconnecting VPCs and on-premises data centers.', href: 'https://www.alibabacloud.com/en/product/cen' },
      { title: 'Alibaba Cloud CDN', badge: '', desc: '3200+ global edge nodes accelerating static, video, and API delivery.', href: 'https://www.alibabacloud.com/en/product/cdn' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    items: [
      { title: 'Security Center', badge: '', desc: 'Unified workload protection, vulnerability scanning, and real-time threat detection.', href: 'https://www.alibabacloud.com/en/product/security-center' },
      { title: 'Web Application Firewall (WAF)', badge: '', desc: 'Protects web apps and AI APIs from OWASP threats, bots, and DDoS floods.', href: 'https://www.alibabacloud.com/en/product/waf' },
      { title: 'Key Management Service (KMS)', badge: '', desc: 'FIPS-validated encryption key lifecycle management and hardware security modules.', href: 'https://www.alibabacloud.com/en/product/kms' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    items: [
      { title: 'ApsaraDB RDS', badge: 'Gartner', desc: 'Managed relational database service supporting MySQL, PostgreSQL, and SQL Server.', href: 'https://www.alibabacloud.com/en/product/apsaradb-for-rds' },
      { title: 'PolarDB', badge: 'Gartner', desc: 'Cloud-native relational database with decoupled compute-storage architecture.', href: 'https://www.alibabacloud.com/en/product/polardb' },
      { title: 'Tair (Redis® OSS-compatible)', badge: 'Gartner', desc: 'In-memory database delivering sub-millisecond caching and vector search for AI apps.', href: 'https://www.alibabacloud.com/en/product/tair' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics Computing',
    items: [
      { title: 'MaxCompute', badge: 'Forrester', desc: 'Serverless enterprise data warehouse for petabyte-scale batch and AI data processing.', href: 'https://www.alibabacloud.com/en/product/maxcompute' },
      { title: 'Quick BI', badge: 'Gartner', desc: 'AI-Native business intelligence platform for analytics and visualization workflows.', href: 'https://www.alibabacloud.com/en/product/quickbi' },
      { title: 'Hologres', badge: '', desc: 'Real-time interactive analytics engine unifying OLAP, serving, and vector retrieval.', href: 'https://www.alibabacloud.com/en/product/hologres' },
    ],
  },
  {
    id: 'container-middleware',
    label: 'Container & Middleware',
    items: [
      { title: 'Container Service for Kubernetes (ACK)', badge: 'Gartner', desc: 'Run and scale containerized applications on managed Kubernetes infrastructure.', href: 'https://www.alibabacloud.com/en/product/kubernetes' },
      { title: 'Microservices Engine (MSE)', badge: '', desc: 'Managed ZooKeeper, Nacos, and cloud-native API gateway for distributed architectures.', href: 'https://www.alibabacloud.com/en/product/mse' },
      { title: 'ApsaraMQ for RocketMQ', badge: '', desc: 'High-throughput, low-latency distributed messaging for event-driven cloud systems.', href: 'https://www.alibabacloud.com/en/product/rocketmq' },
    ],
  },
];

const INDUSTRY_CASES = [
  {
    id: 'ai-native',
    label: 'AI Native',
    cards: [
      {
        title: 'Role Play',
        desc: 'Using Qwen-Plus-Character’s native data to eliminate "translation-ese" and persona breakage, turning utility usage into emotional attachment.',
      },
      {
        title: 'AI Coding',
        desc: 'Qwen3-Coder-Plus is a powerful Coding Agent that excels in tool calling and environment interaction to achieve autonomous programming.',
      },
      {
        title: 'Vision Language',
        desc: 'Whether operating complex GUI interfaces or capturing millisecond-level anomalies in massive surveillance streams, Qwen-VL provides cognitive-grade visual automation.',
      },
      {
        title: 'AI Short Video',
        desc: 'Leveraging Qwen’s narrative depth and Wan-Video’s cinematic consistency for intelligent script expansion, storyboard generation, and automated dubbing.',
      },
    ],
  },
  {
    id: 'fsi',
    label: 'FSI',
    cards: [
      { title: 'Intelligent Risk Control', desc: 'Real-time fraud detection and credit scoring powered by distributed graph computing and LLM reasoning.' },
      { title: 'Core Banking Modernization', desc: 'Active-active multi-zone cloud-native databases delivering 99.999% financial availability.' },
      { title: 'AI Wealth Advisory', desc: 'Compliant enterprise knowledge assistants synthesizing market research and portfolio insights.' },
      { title: 'Regulatory Compliance', desc: '150+ international security and financial compliance certifications across Asia and Europe.' },
    ],
  },
  {
    id: 'retail',
    label: 'Retail',
    cards: [
      { title: 'AI Shopping Assistant', desc: 'Multimodal product discovery and personalized skincare or apparel recommendations.' },
      { title: 'Omnichannel Supply Chain', desc: 'Demand forecasting and elastic inventory routing for peak global shopping events.' },
      { title: 'Visual Merchandising', desc: 'Automated studio-grade product imagery and localized campaign assets via Qwen-Image.' },
      { title: 'Unified Customer Data', desc: 'Real-time analytics and CRM integration driving higher conversion and retention.' },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    cards: [
      { title: 'AI Video Production', desc: 'End-to-end script-to-video generation, dubbing, and multi-language subtitling.' },
      { title: 'Global Live Streaming', desc: 'Ultra-low-latency global media transcoding and 3200+ edge CDN nodes.' },
      { title: 'Smart Content Moderation', desc: 'Automated multimodal safety review across video, audio, image, and text streams.' },
      { title: 'Media Asset Search', desc: 'Semantic indexing enabling instant frame-level retrieval across petabyte archives.' },
    ],
  },
  {
    id: 'games',
    label: 'Games',
    cards: [
      { title: 'AI NPC & Narrative', desc: 'Dynamic in-game character interactions powered by low-latency Qwen inference.' },
      { title: 'Global Game Acceleration', desc: 'Cross-border private backbone minimizing ping for worldwide multiplayer launches.' },
      { title: 'Anti-DDoS & Anti-Cheat', desc: 'Tbps-scale DDoS mitigation safeguarding launch days and live esports tournaments.' },
      { title: 'Elastic Matchmaking', desc: 'Auto-scaling Kubernetes clusters handling sudden player concurrency spikes.' },
    ],
  },
  {
    id: 'isv',
    label: 'ISV',
    cards: [
      { title: 'SaaS AI Copilot', desc: 'Embed enterprise-grade Qwen models into SaaS workflows with isolated VPC privacy.' },
      { title: 'Multi-Tenant Architecture', desc: 'Standardized billing, IAM isolation, and automated global region rollout.' },
      { title: 'Marketplace Distribution', desc: 'Reach millions of enterprise buyers through Alibaba Cloud AI Marketplace.' },
      { title: 'DevOps Acceleration', desc: 'AI-assisted coding, CI/CD automation, and unified observability out of the box.' },
    ],
  },
];

const INNOVATORS = [
  {
    company: 'OpenRouter',
    logo: `assets/${SLUG}/logo-1-openrouter.png`,
    quote: "OpenRouter highlights the global momentum and strong performance of Alibaba Cloud's open-weight Qwen series.",
    products: ['Qwen'],
    image: `assets/${SLUG}/case-1-openrouter.png`,
  },
  {
    company: 'iFIT',
    logo: `assets/${SLUG}/logo-2-ifit.png`,
    quote: 'Discover how iFIT partners with Alibaba Cloud to deliver seamless, compliant, and localized digital fitness experiences for its global members.',
    products: ['Qwen', 'Elastic Compute Service (ECS)', 'CDN', 'Salesforce on Alibaba Cloud'],
    image: `assets/${SLUG}/case-2-ifit.png`,
  },
  {
    company: 'Duolingo',
    logo: `assets/${SLUG}/logo-3-duolingo.png`,
    quote: 'Discover how Duolingo partners with Alibaba Cloud to improve app performance for its 300 million learners globally.',
    products: ['CDN', 'CEN'],
    image: `assets/${SLUG}/case-3-duolingo.png`,
  },
  {
    company: 'Shiseido & Drunk Elephant',
    logo: `assets/${SLUG}/logo-4-shiseido.png`,
    quote: "Discover how Shiseido and Drunk Elephant use Alibaba Cloud's AI for personalized skincare advice and product recommendations via WeChat.",
    products: ['Qwen', 'Model Studio', 'ACK'],
    image: `assets/${SLUG}/case-4-shiseido.png`,
  },
  {
    company: 'Futureverse',
    logo: `assets/${SLUG}/logo-5-futureverse.png`,
    quote: "Discover how Futureverse uses Alibaba Cloud's AI infrastructure to enhance AI-generated music and drive innovation in the metaverse.",
    products: ['PAI-Lingjun'],
    image: `assets/${SLUG}/case-5-futureverse.png`,
  },
  {
    company: 'Align Technology',
    logo: `assets/${SLUG}/logo-6-align.png`,
    quote: 'Discover how Align Technology uses Alibaba Cloud to enable their doctors to access and update patient records efficiently.',
    products: ['ECS', 'OSS', 'CDN'],
    image: `assets/${SLUG}/case-6-align.png`,
  },
];

// 1. Hero Banner (native dual white-outline buttons)
const heroBanner = H.compTag('library-banner', 'hero-responsive', {
  title: 'Everything You Need in One Powerful AI Cloud Platform',
  description:
    'For AI Builders shaping the future and Enterprises scaling AI securely. Redefining AI economics with unmatched speed, intelligence and affordability.',
  actionLabel: 'Start For Free',
  actionCallback: 'openFreeTrial',
  secondaryActionLabel: 'Qwen4-Max Now Live',
  secondaryActionHref: '#qwen-models',
  surface: 'image',
});

// 2. Qwen check-icon highlights list
const qwenBulletsList = `<ul class="ac-check-list">${QWEN_BULLETS.map(
  (b) => `<li class="ac-check-list__item"><img class="ac-check-list__icon" src="assets/${SLUG}/icon-check-16.svg" alt="" aria-hidden="true"><span>${H.esc(b)}</span></li>`
).join('')}</ul>`;

// 3. Qwen 6 IconCards (duotone-line 48x48 Lucide-synthesized FS icons)
const qwenCardsHtml = QWEN_MODELS.map((m) =>
  H.compTag('library-icon-card', 'left-single-event', {
    icon: m.icon,
    title: m.title,
    description: m.description,
    titleHref: m.href,
    sourceAbsent: { reference: SOURCE_REF, objectId: m.objectId, slots: ['bullets', 'link'] },
  })
).join('\n');

// 4. Product Category Sidebar Navigation (faithful to source left vertical nav)
const productSidebarHtml = PRODUCT_CATEGORIES.map(
  (cat, idx) =>
    `<button type="button" class="ac-prod-nav__item" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" data-prod-cat="${cat.id}">${H.esc(cat.label)}</button>`
).join('\n');

// 5. Mid-page Free Trial Banner
const trialBanner = H.compTag('library-banner', 'hero-responsive', {
  title: 'Start Your Free Trial',
  description: '80+ Cloud products, Free AI tokens. Everything you need to build, train, and deploy.',
  actionLabel: 'Start For Free',
  actionCallback: 'openFreeTrial',
  surface: 'image',
});

// 6. Industry Tabs (native library-tab/standard-center)
const industryTabsHtml = INDUSTRY_CASES.map(
  (ind, idx) =>
    `<div class="ds-tab__item${idx === 0 ? ' ds-tab__item--active' : ''}" data-tab-item=""><div class="ds-tab__item-inner"><span class="ds-tab__item-text">${H.esc(ind.label)}</span>${idx === 0 ? '<div class="ds-tab__indicator"></div>' : ''}</div></div>`
).join('');
const industryTabs = H.compTag('library-tab', 'standard-center', { items: industryTabsHtml });

// 7. Analyst Leadership Horizontal Card
const analystCard = H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
  title: 'Leader in Strategic Cloud Platform Services',
  description:
    'Recognized by Gartner® Magic Quadrant™ for Strategic Cloud Platform Services, 2026 — validating full-stack AI infrastructure, global reliability, and enterprise-grade Model as a Service.',
  image: `<img src="assets/${SLUG}/analyst-gartner.png" alt="Gartner Magic Quadrant Strategic Cloud Platform Services 2026">`,
  linkLabel: 'View More Analyst Reports',
  href: 'https://www.alibabacloud.com/en/analyst-reports',
  imagePosition: 'right',
});

const pageCss = `${H.basePageCss()}
.ac-hero-wrap { position: relative; background-image: url('assets/${SLUG}/hero-ai-bg.png'); background-size: cover; background-position: center; overflow: hidden; }
.ac-hero-wrap::before { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.58); pointer-events: none; z-index: 0; }
.ac-banner-layer { position: relative; z-index: 1; }
.ac-hero-badge-slot { margin-bottom: 14px; }
.ac-credit-pill { display: inline-flex; align-items: center; gap: 10px; padding: 5px 14px; border-radius: 999px; background: rgba(255, 255, 255, 0.14); border: 1px solid rgba(255, 255, 255, 0.35); color: #FFFFFF; text-decoration: none; font-size: 13px; line-height: 20px; font-weight: 400; }
.ac-credit-pill__cta { font-weight: 600; color: #FFFFFF; }
.ac-credit-pill:hover { background: rgba(255, 255, 255, 0.22); }
.ac-credit-pill:hover .ac-credit-pill__cta { text-decoration: underline; text-underline-offset: 2px; }
.ac-hero-perks-inline { display: flex; flex-wrap: wrap; align-items: center; gap: 24px; margin-top: 20px; font-size: 14px; line-height: 22px; color: rgba(255, 255, 255, 0.92); font-weight: 400; }
.ac-hero-perks__item { display: inline-flex; align-items: center; gap: 6px; }
.ac-hero-perks__check { color: #FFFFFF; font-weight: 600; }

.ac-stack-links { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-top: 24px; }
.ac-stack-link-card { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 18px 20px; text-decoration: none; color: #19191A; display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 14px; line-height: 20px; font-weight: 600; transition: box-shadow 0.2s ease; }
.ac-stack-link-card:hover { box-shadow: 0 4px 16px rgba(25, 25, 26, 0.08); }
.ac-stack-link-card:hover .ac-stack-link-card__text { text-decoration: underline; text-underline-offset: 3px; }
.ac-stack-link-card__arrow { flex: 0 0 auto; color: #707070; font-size: 16px; }
.ac-stack-link-card:hover .ac-stack-link-card__arrow { color: #19191A; }
.ac-section-action-bar { display: flex; justify-content: center; margin-top: 24px; gap: 24px; }
.ac-section-action-bar--compact { margin-top: 0; margin-bottom: 28px; }
.ac-case-tags-label { font-size: 12px; line-height: 18px; color: #707070; font-weight: 600; margin-bottom: -6px; }
.ac-compliance-split { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 20px; margin-bottom: 24px; align-items: stretch; }
.ac-cert-grid-6 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.ac-sec-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.ac-sec-card { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 22px 20px; text-decoration: none; color: #19191A; display: flex; flex-direction: column; justify-content: center; transition: box-shadow 0.2s ease; }
.ac-sec-card:hover { box-shadow: 0 4px 16px rgba(25, 25, 26, 0.08); }
.ac-sec-card__text { font-size: 15px; line-height: 22px; font-weight: 600; color: #19191A; margin: 0; }
.ac-sec-card:hover .ac-sec-card__text { text-decoration: underline; text-underline-offset: 3px; }

.ac-trust-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
.ac-trust-card { background: #FFFFFF; border-radius: 8px; padding: 20px 16px; display: flex; flex-direction: column; gap: 10px; }
.ac-trust-card__logo-wrap { height: 28px; display: flex; align-items: center; }
.ac-trust-card__logo { max-height: 28px; max-width: 100%; width: auto; object-fit: contain; display: block; }
.ac-trust-card__text { font-size: 12px; line-height: 18px; color: #707070; }

.ac-promo-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
.ac-promo-card { background: #FFFFFF; border-radius: 8px; padding: 20px; text-decoration: none; color: #19191A; display: flex; flex-direction: column; gap: 8px; transition: box-shadow 0.2s ease; }
.ac-promo-card:hover { box-shadow: 0 4px 16px rgba(25, 25, 26, 0.08); }
.ac-promo-card__title { font-size: 15px; line-height: 22px; font-weight: 600; color: #19191A; }
.ac-promo-card:hover .ac-promo-card__title { text-decoration: underline; text-underline-offset: 3px; }
.ac-promo-card__desc { font-size: 13px; line-height: 20px; color: #707070; flex: 1; }

.ac-pillars-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; margin-bottom: 28px; }
.ac-pillar-item { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 20px; }
.ac-pillar-item__title { font-size: 18px; line-height: 26px; font-weight: 600; color: #19191A; margin: 0 0 6px; }
.ac-pillar-item__desc { font-size: 14px; line-height: 22px; color: #707070; margin: 0; }

.ac-stack-split { display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 24px; align-items: stretch; }
.ac-stack-nav { display: flex; flex-direction: column; gap: 12px; }
.ac-stack-btn { text-align: left; background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 18px 20px; cursor: pointer; font-family: inherit; transition: border-color 0.15s ease, background-color 0.15s ease; }
.ac-stack-btn[aria-selected="true"] { border-color: #19191A; background: #FAFBFB; }
.ac-stack-btn__title { font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; margin: 0 0 6px; display: block; }
.ac-stack-btn__desc { font-size: 13px; line-height: 20px; color: #707070; margin: 0; display: block; }

.ac-arch-panel { background: #FAFBFB; border: 1px solid #DEE0E3; border-radius: 8px; padding: 28px; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
.ac-arch-layer { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 18px 20px; transition: border-color 0.15s ease; }
.ac-arch-layer--active { border-color: #19191A; }
.ac-arch-layer__head { font-size: 15px; line-height: 22px; font-weight: 600; color: #19191A; margin: 0 0 12px; display: flex; align-items: center; justify-content: space-between; }
.ac-arch-layer__tag { font-size: 12px; font-weight: 600; color: #707070; }
.ac-arch-chips { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
.ac-arch-chip { background: #FAFBFB; border: 1px solid #E5E7EB; border-radius: 4px; padding: 8px 10px; font-size: 13px; line-height: 18px; color: #4B4B4D; text-align: center; }

.ac-qwen-layout { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 24px; align-items: start; }
.ac-qwen-summary { background: #FFFFFF; border-radius: 8px; padding: 28px 24px; display: flex; flex-direction: column; gap: 16px; }
.ac-qwen-summary__lead { font-size: 15px; line-height: 24px; font-weight: 600; color: #19191A; margin: 0; }
.ac-check-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.ac-check-list__item { display: flex; align-items: flex-start; gap: 8px; font-size: 14px; line-height: 22px; color: #4B4B4D; }
.ac-check-list__icon { width: 16px; height: 16px; flex: 0 0 16px; margin-top: 3px; display: block; }
.ac-qwen-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
.ac-qwen-tag-row { margin: 4px 0 2px; }
.ac-qwen-tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; background: #EBECEF; color: #4B4B4D; font-size: 12px; line-height: 18px; font-weight: 600; }

.ac-tabs-wrap--center { display: flex; justify-content: center; margin-bottom: 24px; }
.ac-prod-layout { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 24px; align-items: start; }
.ac-prod-sidebar { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 12px 0; display: flex; flex-direction: column; }
.ac-prod-nav__item { width: 100%; text-align: left; background: transparent; border: none; border-left: 3px solid transparent; padding: 11px 20px; font-family: inherit; font-size: 14px; line-height: 20px; font-weight: 400; color: #4B4B4D; cursor: pointer; transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
.ac-prod-nav__item:hover { background: #FAFBFB; color: #19191A; }
.ac-prod-nav__item[aria-selected="true"] { background: #FAFBFB; color: #19191A; font-weight: 600; border-left-color: #C00000; }
.ac-prod-sidebar__footer { border-top: 1px solid #F2F2F2; margin-top: 8px; padding: 14px 20px 4px; }
.ac-prod-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
.ac-prod-card { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 24px; text-decoration: none; color: #19191A; display: flex; flex-direction: column; gap: 10px; transition: box-shadow 0.2s ease; }
.ac-prod-card:hover { box-shadow: 0 4px 16px rgba(25, 25, 26, 0.08); }
.ac-prod-card__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.ac-prod-card__title { font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; }
.ac-prod-card:hover .ac-prod-card__title { text-decoration: underline; text-underline-offset: 3px; }
.ac-prod-card__badge { flex: 0 0 auto; font-size: 11px; line-height: 16px; font-weight: 600; color: #4B4B4D; background: #F4F5F6; border-radius: 4px; padding: 2px 8px; }
.ac-prod-card__desc { font-size: 14px; line-height: 22px; color: #707070; margin: 0; flex: 1; }
.ac-prod-panel[hidden] { display: none; }

.ac-trial-wrap { position: relative; background-image: url('assets/${SLUG}/trial-bg.png'); background-size: cover; background-position: center; overflow: hidden; }
.ac-trial-wrap::before { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.58); pointer-events: none; z-index: 0; }

.ac-ind-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; align-items: stretch; }
.ac-ind-card { background: #FFFFFF; border-radius: 8px; padding: 24px; display: flex; flex-direction: column; gap: 10px; }
.ac-ind-card__title { font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; margin: 0; }
.ac-ind-card__desc { font-size: 14px; line-height: 22px; color: #707070; margin: 0; flex: 1; }
.ac-ind-panel[hidden] { display: none; }

.ac-case-stage { display: grid; grid-template-columns: 560px minmax(0, 1fr); background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; overflow: hidden; }
.ac-case-media { height: 340px; overflow: hidden; background: #19191A; }
.ac-case-media__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.ac-case-body { padding: 36px 40px; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
.ac-case-company-logo-wrap { height: 32px; display: flex; align-items: center; }
.ac-case-company-logo { max-height: 32px; max-width: 180px; width: auto; object-fit: contain; display: block; }
.ac-case-quote { font-size: 20px; line-height: 30px; font-weight: 600; color: #19191A; margin: 0; }
.ac-case-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.ac-case-tag { font-size: 12px; line-height: 18px; color: #4B4B4D; background: #F4F5F6; padding: 4px 10px; border-radius: 4px; }
.ac-case-dots { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; }
.ac-dot { width: 8px; height: 8px; border-radius: 999px; border: none; padding: 0; background: #707070; opacity: 0.4; cursor: pointer; transition: width 0.2s ease, opacity 0.2s ease; }
.ac-dot[aria-selected="true"] { width: 20px; opacity: 1; }
.ac-case-logos { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
.ac-case-logo-btn { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 6px; padding: 10px 12px; height: 64px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.15s ease, background-color 0.15s ease; }
.ac-case-logo-btn[aria-selected="true"] { border-color: #19191A; background: #FAFBFB; }
.ac-case-logo-img { max-height: 44px; max-width: 100%; object-fit: contain; display: block; }

.ac-analyst-wrap { background: #FFFFFF; border-radius: 8px; padding: 32px; }

.ac-kpi-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-bottom: 24px; }
.ac-kpi-card { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 28px 24px; text-align: center; }
.ac-kpi-num { font-size: 32px; line-height: 40px; font-weight: 600; color: #19191A; margin: 0 0 6px; }
.ac-kpi-label { font-size: 14px; line-height: 22px; color: #707070; margin: 0; }

.ac-cert-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
.ac-cert-card { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 14px; display: flex; align-items: center; justify-content: center; height: 76px; }
.ac-cert-img { max-width: 100%; max-height: 48px; object-fit: contain; display: block; }

.ac-cta-strip { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.ac-cta-tile { background: #FFFFFF; border: 1px solid #DEE0E3; border-radius: 8px; padding: 22px 24px; text-decoration: none; color: #19191A; display: flex; align-items: center; justify-content: space-between; font-size: 16px; line-height: 24px; font-weight: 600; transition: box-shadow 0.2s ease; }
.ac-cta-tile:hover { box-shadow: 0 4px 16px rgba(25, 25, 26, 0.08); }
.ac-cta-tile:hover .ac-cta-tile__label { text-decoration: underline; text-underline-offset: 3px; }
.ac-cta-tile__arrow { color: #707070; font-size: 18px; line-height: 1; }
.ac-cta-tile:hover .ac-cta-tile__arrow { color: #19191A; }
`;

const mainHtml = `
  <main>
    <section id="hero" class="ac-hero-wrap" aria-label="AI Cloud Platform Hero">
      <div class="ac-banner-layer">${heroBanner}</div>
    </section>

    <section id="recognitions" class="page-section page-section--gray">
      <div class="container">
        <div class="ac-trust-grid" data-fs-extend="analyst-recognitions">
          ${TRUST_RECOGNITIONS.map(
            (r) =>
              `<div class="ac-trust-card"><div class="ac-trust-card__logo-wrap"><img class="ac-trust-card__logo" src="${H.esc(r.logo)}" alt="${H.esc(r.org)}"></div><div class="ac-trust-card__text">${H.esc(r.text)}</div></div>`
          ).join('\n')}
        </div>
        <div class="ac-promo-grid" data-fs-extend="quick-promos">
          ${QUICK_PROMOS.map(
            (p) =>
              `<a class="ac-promo-card" href="${H.esc(p.href)}" target="_blank" rel="noopener noreferrer"><span class="ac-promo-card__title">${H.esc(p.title)}</span><span class="ac-promo-card__desc">${H.esc(p.desc)}</span></a>`
          ).join('\n')}
        </div>
      </div>
    </section>

    <section id="full-stack" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Explore Our Global Full-Stack AI + Cloud Services</h2>
          <p class="section-desc">We offer a comprehensive IT infrastructure combining Cloud + AI across development, training, and global deployment.</p>
        </div>
        <div class="ac-pillars-grid" data-fs-extend="stack-pillars">
          ${STACK_PILLARS.map(
            (p) => `<div class="ac-pillar-item"><h3 class="ac-pillar-item__title">${H.esc(p.title)}</h3><p class="ac-pillar-item__desc">${H.esc(p.desc)}</p></div>`
          ).join('\n')}
        </div>
        <div class="ac-stack-split" data-fs-extend="stack-architecture">
          <div class="ac-stack-nav" role="tablist" aria-label="Full-Stack layers">
            ${STACK_TABS.map(
              (t, i) =>
                `<button type="button" class="ac-stack-btn" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" data-stack-tab="${i}"><span class="ac-stack-btn__title">${H.esc(t.title)}</span><span class="ac-stack-btn__desc">${H.esc(t.desc)}</span></button>`
            ).join('\n')}
          </div>
          <div class="ac-arch-panel">
            <div class="ac-arch-layer ac-arch-layer--active" data-arch-layer="0">
              <div class="ac-arch-layer__head"><span>Model as a Service (MaaS)</span><span class="ac-arch-layer__tag">Qwen · Wan</span></div>
              <div class="ac-arch-chips">
                <div class="ac-arch-chip">Foundation Models</div>
                <div class="ac-arch-chip">Training</div>
                <div class="ac-arch-chip">Inference</div>
                <div class="ac-arch-chip">Development Tools</div>
              </div>
            </div>
            <div class="ac-arch-layer" data-arch-layer="1">
              <div class="ac-arch-layer__head"><span>Platform as a Service (PaaS)</span><span class="ac-arch-layer__tag">PAI · Cloud Native</span></div>
              <div class="ac-arch-chips">
                <div class="ac-arch-chip">Data Labeling</div>
                <div class="ac-arch-chip">Model Building</div>
                <div class="ac-arch-chip">Container &amp; K8s</div>
                <div class="ac-arch-chip">Analytics &amp; BI</div>
              </div>
            </div>
            <div class="ac-arch-layer" data-arch-layer="2">
              <div class="ac-arch-layer__head"><span>Infrastructure as a Service (IaaS)</span><span class="ac-arch-layer__tag">Global Core</span></div>
              <div class="ac-arch-chips">
                <div class="ac-arch-chip">Security</div>
                <div class="ac-arch-chip">Compute</div>
                <div class="ac-arch-chip">Storage</div>
                <div class="ac-arch-chip">Network</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ac-stack-links" data-fs-extend="stack-quick-links">
          <a class="ac-stack-link-card" href="https://www.alibabacloud.com/en/solutions/migration" target="_blank" rel="noopener noreferrer"><span class="ac-stack-link-card__text">Migrate and save</span><span class="ac-stack-link-card__arrow" aria-hidden="true">›</span></a>
          <a class="ac-stack-link-card" href="https://www.alibabacloud.com/en/free" target="_blank" rel="noopener noreferrer"><span class="ac-stack-link-card__text">Unlock $200 Instant Credits for Your AI Workloads</span><span class="ac-stack-link-card__arrow" aria-hidden="true">›</span></a>
          <a class="ac-stack-link-card" href="#industry-use-cases"><span class="ac-stack-link-card__text">Learn more about AI use cases</span><span class="ac-stack-link-card__arrow" aria-hidden="true">›</span></a>
          <a class="ac-stack-link-card" href="#qwen-models"><span class="ac-stack-link-card__text">Try our popular models for free</span><span class="ac-stack-link-card__arrow" aria-hidden="true">›</span></a>
        </div>
      </div>
    </section>

    <section id="qwen-models" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Get to Know QWEN — #1 Most Downloaded Open-Source Model</h2>
          <p class="section-desc">Try with Free Tokens · 400+ Models. Over 4 billion downloads. Outperforms on intelligence, speed and affordability.</p>
        </div>
        <div class="ac-qwen-layout">
          <div class="ac-qwen-summary" data-fs-extend="qwen-highlights">
            <p class="ac-qwen-summary__lead">QWEN models are best-in-class AI models developed by Alibaba Cloud</p>
            ${qwenBulletsList}
            <div>
              ${H.compTag('library-text-button', 'inline-black', { label: 'All Models', href: 'https://www.alibabacloud.com/en/product/modelstudio' })}
            </div>
          </div>
          <div class="ac-qwen-grid">
            ${qwenCardsHtml}
          </div>
        </div>
      </div>
    </section>

    <section id="solutions-matrix" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">End-to-End AI and Cloud Solutions For All Your Needs</h2>
          <p class="section-desc">Browse featured compute, AI, database, storage, networking, and security services built for enterprise scale.</p>
        </div>
        <div class="ac-prod-layout">
          <aside id="ac-prod-nav" class="ac-prod-sidebar" role="tablist" aria-label="Product categories" data-fs-extend="product-sidebar-nav">
            ${productSidebarHtml}
            <div class="ac-prod-sidebar__footer">
              ${H.compTag('library-text-button', 'inline-black', { label: 'All Products', href: 'https://www.alibabacloud.com/en/products' })}
            </div>
          </aside>
          <div>
            ${PRODUCT_CATEGORIES.map(
              (cat, idx) => `
              <div class="ac-prod-panel" data-prod-panel="${cat.id}"${idx === 0 ? '' : ' hidden'}>
                <div class="ac-prod-grid" data-fs-extend="product-matrix-cards">
                  ${cat.items
                    .map(
                      (item) => `
                    <a class="ac-prod-card" href="${H.esc(item.href)}" target="_blank" rel="noopener noreferrer">
                      <div class="ac-prod-card__top">
                        <span class="ac-prod-card__title">${H.esc(item.title)}</span>
                        ${item.badge ? `<span class="ac-prod-card__badge">${H.esc(item.badge)}</span>` : ''}
                      </div>
                      <p class="ac-prod-card__desc">${H.esc(item.desc)}</p>
                    </a>`
                    )
                    .join('\n')}
                </div>
              </div>`
            ).join('\n')}
          </div>
        </div>
      </div>
    </section>

    <section id="free-trial" class="ac-trial-wrap" aria-label="Start Your Free Trial">
      <div class="ac-banner-layer">${trialBanner}</div>
    </section>

    <section id="industry-use-cases" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Industry Use Cases</h2>
          <p class="section-desc">Tailored AI and cloud architectures across AI Native, Financial Services, Retail, Media, Games, and ISV ecosystems.</p>
        </div>
        <div id="ac-ind-tabs" class="ac-tabs-wrap--center">
          ${industryTabs}
        </div>
        ${INDUSTRY_CASES.map(
          (ind, idx) => `
          <div class="ac-ind-panel" data-ind-panel="${ind.id}"${idx === 0 ? '' : ' hidden'}>
            <div class="ac-ind-grid" data-fs-extend="industry-scenario-cards">
              ${ind.cards
                .map(
                  (c) => `<div class="ac-ind-card"><h3 class="ac-ind-card__title">${H.esc(c.title)}</h3><p class="ac-ind-card__desc">${H.esc(c.desc)}</p></div>`
                )
                .join('\n')}
            </div>
          </div>`
        ).join('\n')}
        <div class="ac-section-action-bar" data-fs-extend="industry-solution-links">
          ${H.compTag('library-text-button', 'inline-black', { label: 'View all solutions', href: 'https://www.alibabacloud.com/en/solutions' })}
          ${H.compTag('library-text-button', 'inline-black', { label: 'Learn More', href: 'https://www.alibabacloud.com/en/solutions/ai' })}
        </div>
      </div>
    </section>

    <section id="innovators" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Loved by Innovators All Over the World</h2>
          <p class="section-desc">See how leading global teams build with Qwen, Model Studio, and Alibaba Cloud infrastructure.</p>
        </div>
        <div class="ac-case-stage" data-fs-extend="customer-story-carousel">
          <div class="ac-case-media">
            <img id="ac-case-img" class="ac-case-media__img" src="${H.esc(INNOVATORS[0].image)}" alt="${H.esc(INNOVATORS[0].company)} case study">
          </div>
          <div class="ac-case-body">
            <div class="ac-case-company-logo-wrap">
              <img id="ac-case-company-logo" class="ac-case-company-logo" src="${H.esc(INNOVATORS[0].logo)}" alt="${H.esc(INNOVATORS[0].company)}">
            </div>
            <p id="ac-case-quote" class="ac-case-quote">${H.esc(INNOVATORS[0].quote)}</p>
            <div class="ac-case-tags-label">Related Products</div>
            <div id="ac-case-tags" class="ac-case-tags">
              ${INNOVATORS[0].products.map((p) => `<span class="ac-case-tag">${H.esc(p)}</span>`).join('')}
            </div>
          </div>
        </div>
        <div class="ac-case-dots" role="tablist" aria-label="Customer stories" data-fs-extend="customer-story-dots">
          ${INNOVATORS.map(
            (inv, i) =>
              `<button type="button" class="ac-dot" role="tab" aria-selected="${i === 0 ? 'true' : 'false'}" aria-label="${H.esc(inv.company)}" data-case-idx="${i}"></button>`
          ).join('\n')}
        </div>
        <div class="ac-case-logos" data-fs-extend="customer-logo-switcher">
          ${INNOVATORS.map(
            (inv, i) =>
              `<button type="button" class="ac-case-logo-btn" aria-selected="${i === 0 ? 'true' : 'false'}" aria-label="${H.esc(inv.company)}" data-case-logo="${i}"><img class="ac-case-logo-img" src="${H.esc(inv.logo)}" alt="${H.esc(inv.company)}"></button>`
          ).join('\n')}
        </div>
      </div>
    </section>

    <section id="analyst-leadership" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Our Leadership Status Awarded by Global Analysts</h2>
        </div>
        <div class="ac-analyst-wrap" data-fs-extend="analyst-card-surface">
          ${analystCard}
        </div>
      </div>
    </section>

    <section id="global-footprint" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Open for Business Globally 24/7</h2>
          <p class="section-desc">Enterprise-grade global infrastructure backed by Asia’s #1 compliance portfolio and defense-in-depth cloud security.</p>
        </div>
        <div class="ac-kpi-row" data-fs-extend="global-kpis">
          <div class="ac-kpi-card"><div class="ac-kpi-num">32</div><p class="ac-kpi-label">Global Data Center Regions</p></div>
          <div class="ac-kpi-card"><div class="ac-kpi-num">109</div><p class="ac-kpi-label">Available Zones</p></div>
          <div class="ac-kpi-card"><div class="ac-kpi-num">3200+</div><p class="ac-kpi-label">CDN Nodes</p></div>
        </div>
        <div class="ac-section-action-bar ac-section-action-bar--compact" data-fs-extend="global-footprint-cta">
          ${H.compTag('library-button', 'outline-black', { label: 'Explore our Global Footprint', size: 'xl', actionCallback: 'openGlobalFootprint' })}
        </div>
        <div class="ac-compliance-split" data-fs-extend="compliance-certifications">
          <div class="ac-cert-grid-6">
            ${[1, 2, 3, 4, 5, 6]
              .map(
                (n) =>
                  `<div class="ac-cert-card"><img class="ac-cert-img" src="assets/${SLUG}/cert-${n}.png" alt="Security compliance certification ${n}"></div>`
              )
              .join('\n')}
          </div>
          <div class="ac-sec-cards">
            <a class="ac-sec-card" href="https://www.alibabacloud.com/en/trust-center" target="_blank" rel="noopener noreferrer">
              <p class="ac-sec-card__text">#1 most compliant cloud platform in Asia with 150+ certificates</p>
            </a>
            <a class="ac-sec-card" href="https://www.alibabacloud.com/en/product/security" target="_blank" rel="noopener noreferrer">
              <p class="ac-sec-card__text">100+ security features including data encryption, vulnerability scanning and MFA</p>
            </a>
          </div>
        </div>
        <div class="ac-cta-strip" data-fs-extend="bottom-action-strip">
          <a class="ac-cta-tile" href="https://marketplace.alibabacloud.com/" target="_blank" rel="noopener noreferrer"><span class="ac-cta-tile__label">Marketplace</span><span class="ac-cta-tile__arrow" aria-hidden="true">›</span></a>
          <a class="ac-cta-tile" href="https://www.alibabacloud.com/en/contact-sales" target="_blank" rel="noopener noreferrer"><span class="ac-cta-tile__label">Contact Sales</span><span class="ac-cta-tile__arrow" aria-hidden="true">›</span></a>
          <a class="ac-cta-tile" href="https://www.alibabacloud.com/en/free" target="_blank" rel="noopener noreferrer"><span class="ac-cta-tile__label">Free Trial</span><span class="ac-cta-tile__arrow" aria-hidden="true">›</span></a>
        </div>
      </div>
    </section>
  </main>`;

const pageJs = `
(function () {
  // Hero & Mid-page Free Trial CTA + Global Footprint CTA
  document.querySelectorAll('[data-library-event-actioncallback="openFreeTrial"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.open('https://www.alibabacloud.com/en/free', '_blank', 'noopener');
    });
  });
  document.querySelectorAll('[data-library-event-actioncallback="openGlobalFootprint"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.open('https://www.alibabacloud.com/en/global-locations', '_blank', 'noopener');
    });
  });

  // Full-stack architecture switcher
  var stackBtns = document.querySelectorAll('[data-stack-tab]');
  var archLayers = document.querySelectorAll('[data-arch-layer]');
  var layerMap = [0, 0, 1];
  stackBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = Number(btn.getAttribute('data-stack-tab')) || 0;
      stackBtns.forEach(function (b, i) { b.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
      var activeLayer = layerMap[idx] || 0;
      archLayers.forEach(function (l, i) { l.classList.toggle('ac-arch-layer--active', i === activeLayer); });
    });
  });

  // Product category left sidebar nav
  var prodNavRoot = document.getElementById('ac-prod-nav');
  var prodPanels = [...document.querySelectorAll('[data-prod-panel]')];
  if (prodNavRoot) {
    var prodBtns = [...prodNavRoot.querySelectorAll('[data-prod-cat]')];
    prodBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-prod-cat');
        prodBtns.forEach(function (b) { b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
        prodPanels.forEach(function (p) { p.hidden = p.getAttribute('data-prod-panel') !== id; });
      });
    });
  }

  // Industry use cases tabs
  var indTabsRoot = document.getElementById('ac-ind-tabs');
  var indPanels = [...document.querySelectorAll('[data-ind-panel]')];
  if (indTabsRoot) {
    indTabsRoot.addEventListener('click', function (e) {
      var item = e.target.closest('[data-tab-item]');
      if (!item) return;
      var items = [...indTabsRoot.querySelectorAll('[data-tab-item]')];
      var idx = items.indexOf(item);
      if (idx >= 0) indPanels.forEach(function (p, i) { p.hidden = i !== idx; });
    });
  }

  // Customer story carousel
  var innovators = ${JSON.stringify(INNOVATORS)};
  var caseImg = document.getElementById('ac-case-img');
  var caseCompanyLogo = document.getElementById('ac-case-company-logo');
  var caseQuote = document.getElementById('ac-case-quote');
  var caseTags = document.getElementById('ac-case-tags');
  var caseDots = document.querySelectorAll('[data-case-idx]');
  var caseLogos = document.querySelectorAll('[data-case-logo]');
  function setCase(idx) {
    var inv = innovators[idx];
    if (!inv) return;
    if (caseImg) { caseImg.setAttribute('src', inv.image); caseImg.setAttribute('alt', inv.company + ' case study'); }
    if (caseCompanyLogo) { caseCompanyLogo.setAttribute('src', inv.logo); caseCompanyLogo.setAttribute('alt', inv.company); }
    if (caseQuote) caseQuote.textContent = inv.quote;
    if (caseTags) caseTags.innerHTML = inv.products.map(function (p) { return '<span class="ac-case-tag">' + p + '</span>'; }).join('');
    caseDots.forEach(function (d, i) { d.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
    caseLogos.forEach(function (l, i) { l.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
  }
  caseDots.forEach(function (d) { d.addEventListener('click', function () { setCase(Number(d.getAttribute('data-case-idx')) || 0); }); });
  caseLogos.forEach(function (l) { l.addEventListener('click', function () { setCase(Number(l.getAttribute('data-case-logo')) || 0); }); });
})();
`;

const outRel = `pages/${SLUG}-pc.html`;
const pageSourceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alibaba Cloud: AI and Cloud Computing Services — FS Design Standard</title>
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

// Place source-native Hero top credit pill (above title) & bottom perks row (below dual CTA) inside Hero inner
const L = require(path.join(ROOT, 'scripts/local-component-library.cjs'));
const JSDOM = L.domAPI(ROOT);
const outAbs = path.join(ROOT, outRel);
const dom = new JSDOM(fs.readFileSync(outAbs, 'utf8'));
const doc = dom.window.document;
const heroInner = doc.querySelector('#hero .ds-banner__responsive-inner');
if (heroInner) {
  const titleEl = heroInner.querySelector('.ds-banner__title');
  const actionsEl = heroInner.querySelector('.ds-banner__actions');
  if (titleEl) {
    titleEl.insertAdjacentHTML(
      'beforebegin',
      `<div class="ac-hero-badge-slot" data-fs-extend="hero-top-credit-pill"><a class="ac-credit-pill" href="https://www.alibabacloud.com/en/free" target="_blank" rel="noopener noreferrer"><span>$200 instant credits no minimum spend. Unlock up to $150K</span><span class="ac-credit-pill__cta">Apply Now ›</span></a></div>`
    );
  }
  if (actionsEl) {
    actionsEl.insertAdjacentHTML(
      'afterend',
      `<div class="ac-hero-perks-inline" data-fs-extend="hero-bottom-perks"><span class="ac-hero-perks__item"><span class="ac-hero-perks__check" aria-hidden="true">✓</span>80+ Cloud Products</span><span class="ac-hero-perks__item"><span class="ac-hero-perks__check" aria-hidden="true">✓</span>Free Tokens · 400+ Models</span><span class="ac-hero-perks__item"><span class="ac-hero-perks__check" aria-hidden="true">✓</span>1:1 Technical Support</span></div>`
    );
  }
}
const qwenCards = doc.querySelectorAll('#qwen-models .ds-icon-card');
qwenCards.forEach((card, i) => {
  const m = QWEN_MODELS[i];
  const titleSlot = card.querySelector('.ds-icon-card__title-slot');
  if (m && m.tag && titleSlot) {
    titleSlot.insertAdjacentHTML(
      'afterend',
      `<div class="ac-qwen-tag-row" data-fs-extend="qwen-model-tag"><span class="ac-qwen-tag">${H.esc(m.tag)}</span></div>`
    );
  }
});
fs.writeFileSync(outAbs, dom.serialize(), 'utf8');
dom.window.close();
console.log('Generated:', outRel, 'release:', RELEASE.slice(0, 12));
