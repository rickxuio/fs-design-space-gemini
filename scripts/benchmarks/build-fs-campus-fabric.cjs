'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const H = require(path.join(ROOT, 'scripts/page-helpers.cjs'));

const SLUG = 'fs-campus-fabric-network';
const REF_REL = `reference-inputs/${SLUG}/content.json`;
const RELEASE = H.getActiveRelease();

const IMG = {
  hero: 'assets/fs-campus-fabric-network/img-01-7fab4dd5.jpg',
  overview: 'assets/fs-campus-fabric-network/img-02-47e30de5.jpg',
  adv1: 'assets/fs-campus-fabric-network/img-03-80382421.jpg',
  adv2: 'assets/fs-campus-fabric-network/img-04-accda194.jpg',
  adv3: 'assets/fs-campus-fabric-network/img-05-ecd523eb.jpg',
  arch: 'assets/fs-campus-fabric-network/img-06-57119b2a.jpg',
  prod1: 'assets/fs-campus-fabric-network/img-07-70092b35.jpg',
  prod2: 'assets/fs-campus-fabric-network/img-08-012c717b.jpg',
  prod3: 'assets/fs-campus-fabric-network/img-09-55e76461.jpg',
  prod4: 'assets/fs-campus-fabric-network/img-10-b6a1b9ee.jpg',
  prod5: 'assets/fs-campus-fabric-network/img-11-41ae1f7d.jpg',
  prod6: 'assets/fs-campus-fabric-network/img-12-c2aec0f3.jpg',
  ben1: 'assets/fs-campus-fabric-network/img-13-ebd25e36.jpg',
  ben2: 'assets/fs-campus-fabric-network/img-14-c848dac7.jpg',
  ben3: 'assets/fs-campus-fabric-network/img-15-68cabdb1.jpg',
  picos: 'assets/fs-campus-fabric-network/img-16-767de18b.jpg',
  ampcon: 'assets/fs-campus-fabric-network/img-17-feeea7fb.jpg',
  case1: 'assets/fs-campus-fabric-network/img-18-d8de9ad0.jpg',
  case2: 'assets/fs-campus-fabric-network/img-19-49ae8932.jpg',
  case3: 'assets/fs-campus-fabric-network/img-20-cbf8a9d2.jpg',
  sup1: 'assets/fs-campus-fabric-network/img-21-3e349e6c.jpg',
  sup2: 'assets/fs-campus-fabric-network/img-22-722a5727.jpg',
  sup3: 'assets/fs-campus-fabric-network/img-23-bdd81eb9.jpg',
  sup4: 'assets/fs-campus-fabric-network/img-24-55fa5374.jpg',
  wf1: 'assets/fs-campus-fabric-network/img-01-85251d81.svg',
  wf2: 'assets/fs-campus-fabric-network/img-02-1a81f39b.svg',
  wf3: 'assets/fs-campus-fabric-network/img-03-551e1684.svg',
  wf4: 'assets/fs-campus-fabric-network/img-04-6c535bcf.svg',
  wf5: 'assets/fs-campus-fabric-network/img-05-c69decf0.svg',
  chPhone: 'assets/fs-campus-fabric-network/img-06-704d0fbe.svg',
  chEmail: 'assets/fs-campus-fabric-network/img-07-ac95d69d.svg',
  chChat: 'assets/fs-campus-fabric-network/img-08-ea2f0bd0.svg',
  cert1: 'assets/fs-campus-fabric-network/img-01-e37ad706.svg',
  cert2: 'assets/fs-campus-fabric-network/img-02-0ecbc4bd.svg',
  cert3: 'assets/fs-campus-fabric-network/img-03-259e1cf7.svg',
  cert4: 'assets/fs-campus-fabric-network/img-04-23b5d442.svg',
  cert5: 'assets/fs-campus-fabric-network/img-05-7d7bfe33.svg',
  cert6: 'assets/fs-campus-fabric-network/img-06-748912b4.svg',
};

const DATA = {
  sourceUrl: 'https://www.fs.com/solutions/fs-campus-fabric-network-s10121.html',
  hero: {
    title: 'Scalable EVPN-VXLAN Campus Fabric Solution',
    description:
      'Built on EVPN-VXLAN fabric to deliver a secure, scalable, and unified campus network with secure segmentation and simplified operations.',
    ctaLabel: 'Talk to an Expert',
  },
  anchors: [
    { id: 'overview', label: 'Overview' },
    { id: 'design', label: 'Design' },
    { id: 'configure', label: 'Configure' },
    { id: 'operate', label: 'Operate' },
    { id: 'customer-success', label: 'Customer Success' },
    { id: 'support', label: 'Support' },
  ],
  overview: {
    id: 'overview-card',
    title: 'Build a Secure, Scalable Campus Fabric with EVPN-VXLAN',
    desc: 'FS Campus Fabric Solution helps enterprises, education institutions, and multi-site organizations build a scalable, easy-to-manage campus network. It enables secure business segmentation, simplifies operations, and supports flexible expansion for Wi-Fi 6/7 and growing access demands. With AmpCon, IT teams can centralize wired and wireless management, automate deployment and configuration, and simplify Day 0 to Day 2+ lifecycle operations.',
    bullets: [
      'Simplify campus network design with a standards-based EVPN-VXLAN architecture',
      'Segment users, services, and applications for stronger business isolation',
      'Support Wi-Fi 6/7 evolution and high-density access growth',
      'Centralize wired and wireless network visibility and management',
      'Accelerate deployment, configuration, monitoring, and lifecycle operation',
    ],
  },
  workflow: {
    title: 'Solution Design and Service Workflow',
    desc: 'FS delivers an end-to-end solution service process—from planning and design to validation, deployment, and operations—helping customers efficiently build stable and scalable network infrastructures.',
    steps: [
      { title: 'Plan and Design', desc: 'The expert team conducts thorough research to deeply understand your business needs.', icon: IMG.wf1 },
      { title: 'Testing and Compliance', desc: 'FS products adhere to stringent global compliance standards and undergo 100% testing.', icon: IMG.wf2 },
      { title: 'Delivery and Integration', desc: 'The professional team ensures rapid and efficient delivery and integration.', icon: IMG.wf3 },
      { title: 'Management and Operations', desc: 'With PicOS® and AmpCon, build a flexible and secure network environment.', icon: IMG.wf4 },
      { title: 'After-Sales Support', desc: '24/5 technical support and maintenance keep your business running steadily.', icon: IMG.wf5 },
    ],
  },
  advantages: [
    {
      id: 'adv-1',
      title: 'Intelligent Solution Design',
      desc: 'FS Design Center integrates hundreds of successful solutions into standardized templates. Quickly build robust network topologies with the confidence of battle-tested architectures.',
      img: IMG.adv1,
    },
    {
      id: 'adv-2',
      title: 'Rapid Deployment & Proven Reliability',
      desc: 'FS validates switch performance, reliability, and compatibility in advanced testing environments such as Ixia RFC 2544 to ensure networks integrate smoothly and roll out rapidly.',
      img: IMG.adv2,
    },
    {
      id: 'adv-3',
      title: 'Automated Network Operations',
      desc: 'Powered by PicOS® and AmpCon management software, FS enables intelligent network management and automated operations, ensuring long-term stability for campus network management.',
      img: IMG.adv3,
    },
  ],
  products: [
    {
      id: 'prod-1',
      title: 'AmpCon Management Software',
      img: IMG.prod1,
      skus: [
        { label: 'LIS-AMPCON-CAM-FPSW-Foundation-1Y', href: 'https://www.fs.com/products/258677.html' },
        { label: 'LIS-AMPCON-CAM-FPSW-Foundation-3Y', href: 'https://www.fs.com/products/258679.html' },
        { label: 'LIS-AMPCON-CAM-FPSW-Foundation-5Y', href: 'https://www.fs.com/products/258681.html' },
      ],
    },
    {
      id: 'prod-2',
      title: 'PicOS® Enterprise Switches',
      img: IMG.prod2,
      skus: [
        { label: 'S5890-32C', href: 'https://www.fs.com/products/248183.html' },
        { label: 'S5580-48Y', href: 'https://www.fs.com/products/300186.html' },
        { label: 'S5870-48MX6BC-U', href: 'https://www.fs.com/products/206655.html' },
        { label: 'S5870-48T6BC-U', href: 'https://www.fs.com/products/206653.html' },
        { label: 'S5870-48T6BC', href: 'https://www.fs.com/products/206237.html' },
      ],
    },
    {
      id: 'prod-3',
      title: 'Wireless Access Points',
      img: IMG.prod3,
      skus: [
        { label: 'AP-N716', href: 'https://www.fs.com/products/320689.html?now_cid=4133' },
        { label: 'AP-N516', href: 'https://www.fs.com/products/320691.html?now_cid=3086' },
      ],
    },
    {
      id: 'prod-4',
      title: 'Cameras & Surveillance',
      img: IMG.prod4,
      skus: [
        { label: 'IPC304-8M-D', href: 'https://www.fs.com/products/195428.html?now_cid=4052' },
        { label: 'IPC304-8M-B', href: 'https://www.fs.com/products/195436.html?now_cid=4051' },
        { label: 'IPC101-5M-D', href: 'https://www.fs.com/products/170042.html?now_cid=4052' },
        { label: 'IPC101-5M-T', href: 'https://www.fs.com/products/170041.html?now_cid=4052' },
      ],
    },
    {
      id: 'prod-5',
      title: 'Optical Transceiver Modules',
      img: IMG.prod5,
      skus: [
        { label: 'QSFP-SR4-100G', href: 'https://www.fs.com/products/35182.html' },
        { label: 'SFP-25GSR-85', href: 'https://www.fs.com/products/67973.html' },
        { label: 'SFP-10GSR-85', href: 'https://www.fs.com/products/11589.html' },
      ],
    },
    {
      id: 'prod-6',
      title: 'Patch Cords',
      img: IMG.prod6,
      skus: [
        { label: '12FMTPOM4', href: 'https://www.fs.com/products/69009.html' },
        { label: 'OM4LCDX', href: 'https://www.fs.com/products/40180.html' },
        { label: 'C6ASFTPSGPVC', href: 'https://www.fs.com/products/70665.html' },
      ],
    },
  ],
  benefits: [
    {
      id: 'ben-1',
      title: 'Enterprise Wi-Fi 6/7 Access for Multi-Service Networks',
      img: IMG.ben1,
      side: 'left',
      bullets: [
        'Future-ready Wi-Fi 6/Wi-Fi 7 Infrastructure: Support high-density Wi-Fi 6/7 with higher bandwidth, lower latency, and greater capacity. Wi-Fi 7 delivers up to 9.3 Gbps with MU-MIMO, OFDMA, 320 MHz channels, and MLO for improved user experience.',
        'Enterprise-Grade Switching Performance: Built on Broadcom chips, the switching infrastructure delivers low-latency, reliable performance for dense campuses. Multigig ports (1G/2.5G/5G/10G) provide sufficient uplinks and eliminate Wi-Fi bottlenecks.',
        'One Network for Multiple Services: A unified infrastructure supports office, guest, IoT, video surveillance, and wireless services. Logical segmentation and centralized management ensure strong isolation while reducing operational complexity and cost.',
      ],
    },
    {
      id: 'ben-2',
      title: 'Secure and Scalable EVPN-VXLAN Fabric Architecture',
      img: IMG.ben2,
      side: 'right',
      bullets: [
        'EVPN-VXLAN Network Virtualization: Standards-based EVPN-VXLAN architecture enables secure segmentation and flexible expansion. It supports multi-service isolation and efficient traffic forwarding, simplifying service deployment and network scaling.',
        'High Availability and Scalable Fabric Expansion: Ensure service continuity during link or node failures with dual-homing, MLAG, and resilient fabric design. A scalable BGP EVPN control plane enables seamless expansion across access, aggregation, and core layers.',
        'Multi-Layer Security Protection and Access Control: Establish secure boundaries for employees, guests, and IoT through traffic isolation, consistent policies, and flexible authentication, ensuring users and devices only access the resources they need.',
      ],
    },
    {
      id: 'ben-3',
      title: 'Automated and Intelligent Campus Networking',
      img: IMG.ben3,
      side: 'left',
      bullets: [
        'Automated Deployment and Rapid Provisioning: Quickly deploy campus fabrics via AmpCon. Zero-Touch Provisioning (ZTP), template-based configuration, and batch deployment automate initial setups, simplify workflows, and boost IT efficiency.',
        'Unified Wired and Wireless Management: AmpCon centrally manages switches and wireless APs across entire lifecycle. It streamlines Day 0 to Day 2 operations, making configuration, monitoring, and troubleshooting effortless while reducing complexity.',
        'Visualized Network Insights and Automated Operations: Gain real-time network visibility via telemetry to accelerate troubleshooting and reduce MTTR. Ansible Playbooks simplifies operations through automated configuration and large-scale management.',
      ],
    },
  ],
  software: [
    {
      id: 'operate',
      title: 'Secure and Scalable Network Software Foundation for Campus Fabric',
      desc: 'Powered by the unified PicOS® operating system, this solution delivers a standards-based EVPN-VXLAN architecture for campus networks. It ensures consistent network segmentation and multi-layer security defense for a highly resilient and scalable campus fabric.',
      cta: 'Try PicOS-V free',
      href: 'https://www.fs.com/specials/picos-virtual-operating-system-166.html',
      img: IMG.picos,
    },
    {
      id: 'operate-ampcon',
      title: 'Unified and Automated Network Operations Platform for Full Lifecycle Management',
      desc: 'AmpCon management software for campus simplifies network design and deployment by unifying wired and wireless management with automated Day 0/1/2 lifecycle operations, intent-based fabric provisioning, and telemetry insights to improve efficiency and reduce complexity.',
      cta: 'Try AmpCon free',
      href: 'https://www.fs.com/specials/ampcon-campus-platform-193.html',
      img: IMG.ampcon,
    },
  ],
  cases: [
    {
      id: 'case-1',
      title: 'Accelerating Medical Imaging Transmission with FS PicOS® Switching Solutions',
      desc: 'FS built a scalable PicOS® network to ensure stable, low-latency video transmission and support future expansion.',
      cta: 'Learn more',
      href: 'https://www.fs.com/case-study/leading-medtech-company-enhances-network-transmission-with-fs-picos-solution-69.html',
      img: IMG.case1,
    },
    {
      id: 'case-2',
      title: 'Improving Government Network Reliability with FS PicOS® Redundancy Architecture',
      desc: 'FS improved network redundancy and transmission efficiency with a resilient PicOS® architecture.',
      cta: 'Learn more',
      href: 'https://www.fs.com/case-study/fs-picos-switches-elevate-a-local-governments-network-performance-and-redundancy-64.html',
      img: IMG.case2,
    },
    {
      id: 'case-3',
      title: 'Building a 100G Wi-Fi 7 Campus Network for High-Density Biotech Operations',
      desc: 'FS delivered an EVPN-VXLAN campus network with Wi-Fi 7 connectivity for high-speed access and simplified operations.',
      cta: 'Learn more',
      href: 'https://www.fs.com/case-study/biotech-company-builds-100g-backbone-campus-with-ultra-high-speed-wi-fi-7-network-141.html',
      img: IMG.case3,
    },
  ],
  certified: [
    {
      id: 'cert-1',
      title: 'Advanced Manufacturing',
      desc: 'Matured manufacturing and strict quality control ensure consistent product quality and reliable supply.',
      icon: IMG.cert1,
      href: 'https://www.fs.com/compliance-center-h0007.html',
    },
    {
      id: 'cert-2',
      title: 'Customizable R&D',
      desc: 'FS advanced R&D Center customizes software and hardware according to your requirements.',
      icon: IMG.cert2,
      href: 'https://www.fs.com/advanced-research-development-center-h0005.html',
    },
    {
      id: 'cert-3',
      title: 'Service Professionals',
      desc: '900+ sales and technical professionals provide customized IT solutions to help meet complex business challenges.',
      icon: IMG.cert3,
      href: 'https://www.fs.com/solution-consulting-h0013.html',
    },
    {
      id: 'cert-4',
      title: 'Comprehensive Test',
      desc: '8 top testing labs conduct comprehensive testing for your products and solutions.',
      icon: IMG.cert4,
      href: 'https://www.fs.com/test-center-h0008.html',
    },
    {
      id: 'cert-5',
      title: 'Global Delivery Excellence',
      desc: '7 Local Warehouses guarantee that 90% of orders will be shipped on the same day.',
      icon: IMG.cert5,
      href: 'https://www.fs.com/global-warehouse-h0002.html',
    },
    {
      id: 'cert-6',
      title: 'Real-Time Support',
      desc: 'FS provides whole process from pre-sales, in-sales to after-sales support.',
      icon: IMG.cert6,
      href: 'https://www.fs.com/contact-us-h0004.html',
    },
  ],
  supportCards: [
    {
      id: 'sup-1',
      title: 'Solution Design Support',
      img: IMG.sup1,
      links: [
        { label: 'Request a Free Solution Consultation', href: 'https://www.fs.com/solution-consulting-h0013.html' },
        { label: 'Try FS Design Center', href: 'https://design-center.fs.com/design-center' },
      ],
    },
    {
      id: 'sup-2',
      title: 'Testing & Validation',
      img: IMG.sup2,
      links: [
        { label: 'Get Testing & Validation Support from Test Center', href: 'https://www.fs.com/test-center-h0008.html' },
      ],
    },
    {
      id: 'sup-3',
      title: 'Delivery & Integration Guides',
      img: IMG.sup3,
      links: [
        { label: 'Learn About Shipping & Delivery Policy', href: 'https://www.fs.com/shipping_delivery-p0001.html' },
      ],
    },
    {
      id: 'sup-4',
      title: 'Technical Support',
      img: IMG.sup4,
      links: [
        { label: 'Get Answers to FAQs About Products and Solutions', href: 'https://www.fs.com/question_list-h0019.html' },
      ],
    },
  ],
  contactFields: [
    { name: 'first_name', label: 'First Name', kind: 'text', required: true, placeholder: '' },
    { name: 'last_name', label: 'Last Name', kind: 'text', required: true, placeholder: '' },
    { name: 'email', label: 'Email address', kind: 'email', required: true, fullWidth: true, placeholder: '' },
    {
      name: 'country',
      label: 'Country/Region',
      kind: 'select',
      required: false,
      placeholder: 'United States',
      options: ['United States', 'Canada', 'United Kingdom', 'Germany', 'Australia', 'Singapore', 'Japan', 'Other'],
    },
    { name: 'phone', label: 'Phone', kind: 'text', required: false, placeholder: '+1' },
    {
      name: 'business_category',
      label: 'Business Category',
      kind: 'select',
      required: false,
      placeholder: 'Enterprises Networks',
      options: ['Enterprises Networks', 'Education Institutions', 'Government & Public Sector', 'Healthcare', 'Service Provider / ISP', 'System Integrator'],
    },
    {
      name: 'application_scenario',
      label: 'Application Scenario',
      kind: 'select',
      required: false,
      placeholder: 'Enterprise LAN',
      options: ['Enterprise LAN', 'Multi-Site Campus Fabric', 'Wi-Fi 6/7 High-Density Access', 'Data Center Interconnect', 'Video Surveillance & IoT'],
    },
    {
      name: 'comments',
      label: 'Comments',
      kind: 'textarea',
      required: true,
      placeholder: 'Please specify your project requirements, scale, and budget, and other relevant information.',
    },
  ],
  faqs: [
    {
      q: 'Why virtualize the campus network with EVPN-VXLAN instead of traditional VLANs?',
      a: 'Traditional networks mix various traffic types (office, guest, IoT) and rely on complex, error-prone VLAN and ACL maintenance when scaling or migrating. The FS Campus Fabric solution, built on a standards-based EVPN-VXLAN architecture, allows a single physical network to host one or more logical networks, enabling clear traffic isolation and service segmentation. Furthermore, it improves network efficiency by reducing unknown unicast flooding through EVPN control plane learning and optimizing broadcast traffic via ARP/ND suppression.',
    },
    {
      q: 'Does the solution support network isolation and security control for different departments, guests, and IoT devices?',
      a: 'Yes. Built on a unified EVPN-VXLAN segmentation architecture, it helps establish clear access boundaries across different service zones and network segments. Through admission authentication (such as 802.1X, Portal, and MAB) and role-based policies, it ensures that users and devices have the access they need—and only the access they need. This enables strict network policy enforcement based on user and device identity, greatly enhancing overall campus network security.',
    },
    {
      q: 'Can this virtualization solution interoperate with existing multi-vendor network equipment?',
      a: 'Yes. Built on open, standards-based protocols such as EVPN/VXLAN, the FS virtualization solution supports heterogeneous networking environments. It allows for multivendor core, aggregation, and access layer compatibility, enabling smooth network evolution without the need for a rip-and-replace approach.',
    },
    {
      q: 'How does the solution simplify deployment for multi-site or large-scale campus networks?',
      a: 'The solution automates switch onboarding and network service provisioning through the AmpCon-Campus platform. With zero-touch provisioning (ZTP), switches can automatically load deployment profiles at power-on without onsite manual intervention, enabling faster rollout and minimizing configuration errors. It also uses a template-based configuration model, allowing standardized settings to be applied consistently across one or multiple sites, which improves deployment efficiency while retaining flexibility.',
    },
    {
      q: 'What capabilities are available for monitoring and troubleshooting the wired and wireless network after deployment?',
      a: 'The AmpCon-Campus platform provides centralized management for both PicOS campus switches and APs. For the wired network, it offers real-time switch insights with telemetry-based visibility into health indicators and anomaly detection, helping simplify troubleshooting and reduce mean time to repair (MTTR). For wireless operations, the platform leverages lifecycle data, radio-quality metrics, and remote packet capture to quickly identify issues such as disconnections, roaming failures, and performance bottlenecks.',
    },
    {
      q: 'Can this solution support the high bandwidth and power demands of Wi-Fi 6 or Wi-Fi 7 upgrades?',
      a: 'Absolutely. The high-density access switches in the solution are purpose-built to support Wi-Fi 6/7 upgrades, featuring PoE++ capabilities and 1G/2.5G/5G/10G multi-rate ports. This provides sufficient uplink bandwidth for high-performance APs, avoiding wireless bottlenecks. Additionally, the architecture supports a smooth upgrade path of 25G uplinks and 100G core/aggregation, seamlessly accommodating the network growth driven by wireless upgrades.',
    },
  ],
};

// 1. Write reference-inputs/fs-campus-fabric-network/content.json
const refObjects = [
  { objectId: DATA.overview.id, title: DATA.overview.title, description: DATA.overview.desc },
  ...DATA.advantages.map((a) => ({ objectId: a.id, title: a.title, description: a.desc })),
  ...DATA.products.map((p) => ({ objectId: p.id, title: p.title })),
  ...DATA.benefits.map((b) => ({ objectId: b.id, title: b.title, description: b.bullets[0] })),
  ...DATA.cases.map((c) => ({ objectId: c.id, title: c.title, description: c.desc, link: c.cta })),
  {
    objectId: 'contact-form',
    title: 'Ready to get started?',
    consent: true,
    fields: DATA.contactFields,
  },
];

const refPath = path.join(ROOT, REF_REL);
fs.mkdirSync(path.dirname(refPath), { recursive: true });
fs.writeFileSync(
  refPath,
  JSON.stringify(
    {
      kind: 'original-page-content-reference',
      source: DATA.sourceUrl,
      capturedAt: '2026-11-21',
      modules: [{ id: 'main', items: refObjects }],
    },
    null,
    2
  ) + '\n',
  'utf8'
);

// 2. Build HTML fragments
const anchorTabsHtml = DATA.anchors
  .map(
    (a, i) =>
      `<div class="ds-anchor-nav__tab${i === 0 ? ' ds-anchor-nav__tab--active' : ''}" data-anchor-tab="">${H.esc(a.label)}</div>`
  )
  .join('');

const stepperArrow = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons/icon-stepper-divider-next.svg?v=2e67be0d1a01`;
const textBtnArrow = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons/icon-text-button-arrow-right-bold.svg`;

const stepperStepsHtml = DATA.workflow.steps
  .map((step, i) => {
    const item = `<div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="${H.esc(step.icon)}" alt="${H.esc(step.title)}"><div class="ds-stepper__body"><div class="ds-stepper__title"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">${H.esc(step.title)}</span><img class="ds-text-btn__icon" src="${textBtnArrow}" alt=""></a></div><p class="ds-stepper__description">${H.esc(step.desc)}</p></div></div>`;
    const divider =
      i < DATA.workflow.steps.length - 1
        ? `<span class="ds-stepper__divider" aria-hidden="true"><i></i><img class="ds-stepper__divider-icon" src="${stepperArrow}" alt=""></span>`
        : '';
    return item + divider;
  })
  .join('');

// Product List: borderless white cards on #FAFBFB gray section, NO bullets, gray #707070 SKU links
const productCardsHtml = DATA.products
  .map((prod) => {
    const cardTag = H.compTag('library-card', 'spliced-vertical-single-event', {
      image: `<img src="${H.esc(prod.img)}" alt="${H.esc(prod.title)}">`,
      title: prod.title,
      sourceAbsent: {
        reference: REF_REL,
        objectId: prod.id,
        slots: ['category', 'description', 'link'],
      },
    });
    return `<div class="product-card-cell" data-extend-target="${prod.id}">${cardTag}</div>`;
  })
  .join('\n');

// Benefits: alternating horizontal cards, ALL 3 bullets uniform #707070 regular 400
const benefitsHtml = DATA.benefits
  .map(
    (b) =>
      `<div data-extend-target="${b.id}">${H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
        title: b.title,
        description: '• ' + b.bullets[0],
        image: `<img src="${H.esc(b.img)}" alt="${H.esc(b.title)}">`,
        imagePosition: b.side,
        sourceAbsent: {
          reference: REF_REL,
          objectId: b.id,
          slots: ['link'],
        },
      })}</div>`
  )
  .join('\n');

const advantagesHtml = DATA.advantages
  .map((adv) =>
    H.compTag('library-card', 'spliced-vertical-single-event-bordered', {
      image: `<img src="${H.esc(adv.img)}" alt="${H.esc(adv.title)}">`,
      title: adv.title,
      description: `<p>${H.esc(adv.desc)}</p>`,
      sourceAbsent: {
        reference: REF_REL,
        objectId: adv.id,
        slots: ['category', 'link'],
      },
    })
  )
  .join('\n');

// Customer Success: white section, 3 bordered white cards + blue Learn more >
const casesHtml = DATA.cases
  .map((c) =>
    `<div class="case-card-cell" data-extend-target="${c.id}">${H.compTag('library-card', 'spliced-vertical-single-event-bordered', {
      image: `<img src="${H.esc(c.img)}" alt="${H.esc(c.title)}">`,
      title: c.title,
      description: `<p>${H.esc(c.desc)}</p>`,
      linkLabel: c.cta,
      href: c.href,
      sourceAbsent: {
        reference: REF_REL,
        objectId: c.id,
        slots: ['category'],
      },
    })}</div>`
  )
  .join('\n');

// FS Certified: 3x2 centered transparent items on #FAFBFB gray section, official SVGs + Title > + centered gray desc
const certifiedHtml = DATA.certified
  .map(
    (item) => `<div class="cert-item">
      <img class="cert-item__icon" src="${H.esc(item.icon)}" alt="${H.esc(item.title)}">
      <div class="cert-item__title">
        ${H.compTag('library-text-button', 'inline-black-bold', {
          label: item.title,
          href: item.href,
        })}
      </div>
      <p class="cert-item__desc">${H.esc(item.desc)}</p>
    </div>`
  )
  .join('\n');

// Solution Support: 4-column borderless photo + title + bullet links directly on white section (matching real fs.com)
const supportHtml = DATA.supportCards
  .map(
    (s) => `<div class="support-item">
      <div class="support-item__media">
        <img class="support-item__img" src="${H.esc(s.img)}" alt="${H.esc(s.title)}">
      </div>
      <h3 class="support-item__title">${H.esc(s.title)}</h3>
      <ul class="support-item__links">
        ${s.links
          .map(
            (l) =>
              `<li><a class="support-item__link" href="${H.esc(l.href)}" target="_blank" rel="noopener">${H.esc(l.label)}</a></li>`
          )
          .join('')}
      </ul>
    </div>`
  )
  .join('\n');

const pageCss = `${H.basePageCss()}
.hero-surface__scrim { background: rgba(0, 0, 0, 0); }
.page-section { scroll-margin-top: 64px; }
.fs-bullet-list { margin: 12px 0 0; padding-left: 16px; color: #707070; font-size: 14px; line-height: 22px; font-weight: 400; }
.fs-bullet-list li { margin-bottom: 10px; }
.fs-bullet-list li:last-child { margin-bottom: 0; }
.fs-benefit-extra { margin-top: 10px; display: flex; flex-direction: column; gap: 10px; }
.fs-benefit-bullet { margin: 0; color: #707070; font-size: 14px; line-height: 22px; font-weight: 400; }
.fs-sku-list { margin: 12px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px; }
.fs-sku-link { color: #707070; font-size: 13px; line-height: 20px; font-weight: 400; text-decoration: none; word-break: break-word; }
.fs-sku-link:hover { color: #19191A; text-decoration: underline; }
.product-card-cell, .case-card-cell { display: grid; height: 100%; }
.stack-40 { display: flex; flex-direction: column; gap: 40px; }
.arch-panel { background: #FFFFFF; border: 1px solid #ECEEF0; border-radius: 8px; padding: 24px; width: 100%; box-sizing: border-box; }
.arch-panel__img { width: 100%; height: auto; display: block; border-radius: 4px; }
.software-panel { width: 100%; border-radius: 8px; overflow: hidden; box-sizing: border-box; }
.software-panel--bordered { border: 1px solid #ECEEF0; }
.software-panel__img { width: 100%; height: auto; display: block; }
.section-bottom-cta { margin-top: 24px; display: flex; justify-content: center; }
.arch-highlights { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ECEEF0; }
.arch-highlight-item__name { margin: 0 0 4px; font-size: 14px; line-height: 20px; font-weight: 600; color: #19191A; }
.arch-highlight-item__spec { margin: 0; font-size: 12px; line-height: 18px; color: #707070; }
.arch-highlight-item__price { margin: 6px 0 0; font-size: 14px; line-height: 20px; font-weight: 600; color: #C00000; }
.cert-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 36px 40px; }
.cert-item { display: flex; flex-direction: column; align-items: center; text-align: center; }
.cert-item__icon { width: 48px; height: 48px; margin-bottom: 14px; display: block; object-fit: contain; }
.cert-item__title { margin-bottom: 8px; }
.cert-item__desc { margin: 0; max-width: 320px; font-size: 13px; line-height: 20px; font-weight: 400; color: #707070; }
.support-item { display: flex; flex-direction: column; }
.support-item__media { width: 100%; aspect-ratio: 16 / 9; border-radius: 8px; overflow: hidden; margin-bottom: 14px; background: #FAFBFB; }
.support-item__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.support-item__title { margin: 0 0 8px; font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; }
.support-item__links { margin: 0; padding-left: 16px; color: #4B4B4D; font-size: 13px; line-height: 20px; }
.support-item__links li { margin-bottom: 6px; }
.support-item__links li:last-child { margin-bottom: 0; }
.support-item__link { color: #4B4B4D; text-decoration: none; }
.support-item__link:hover { color: #19191A; text-decoration: underline; }
.contact-layout { display: grid; grid-template-columns: 420px minmax(0, 1fr); gap: 48px; align-items: start; }
.contact-info__eyebrow { margin: 0 0 8px; font-size: 13px; line-height: 20px; font-weight: 600; letter-spacing: 0.4px; color: #19191A; text-transform: uppercase; }
.contact-info__title { margin: 0 0 12px; font-size: 24px; line-height: 32px; font-weight: 600; color: #19191A; }
.contact-info__desc { margin: 0 0 24px; font-size: 14px; line-height: 22px; color: #4B4B4D; }
.contact-divider { height: 1px; background: #DEE0E3; margin-bottom: 24px; }
.contact-channels { display: flex; flex-direction: column; gap: 24px; }
.contact-channel { display: flex; align-items: flex-start; gap: 14px; }
.contact-channel__icon { width: 28px; height: 28px; flex: 0 0 28px; margin-top: 2px; display: block; }
.contact-channel__head { margin-bottom: 4px; }
.contact-channel__detail { margin: 0; font-size: 13px; line-height: 20px; color: #707070; }
.contact-inline-email { color: #0060BF; text-decoration: none; }
.contact-inline-email:hover { text-decoration: underline; }
#support .inquiry-form-card { background: #FFFFFF; border-radius: 8px; padding: 32px; box-sizing: border-box; }
#support .inquiry-form-card > form { width: 100%; max-width: 100%; }
`;

const pageSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FS Campus Fabric Solution — EVPN-VXLAN Campus Network | FS.com</title>
  <style>${pageCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}

  <main>
    ${H.heroBanner({
      imgSrc: IMG.hero,
      title: DATA.hero.title,
      description: DATA.hero.description,
      actionLabel: DATA.hero.ctaLabel,
      actionCallback: 'onTalkToExpert',
    })}

    ${H.compTag('library-anchor-nav', 'anchor-nav', {
      tabs: anchorTabsHtml,
      actionLabel: DATA.hero.ctaLabel,
      actionCallback: 'onTalkToExpert',
    })}

    <section id="overview" class="page-section">
      <div class="container">
        ${H.compTag('library-card', 'spliced-horizontal-full-width-responsive', {
          title: DATA.overview.title,
          description: DATA.overview.desc,
          image: `<img src="${H.esc(IMG.overview)}" alt="${H.esc(DATA.overview.title)}">`,
          imagePosition: 'right',
          sourceAbsent: {
            reference: REF_REL,
            objectId: DATA.overview.id,
            slots: ['link'],
          },
        })}
      </div>
    </section>

    <section id="workflow" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">${H.esc(DATA.workflow.title)}</h2>
          <p class="section-header__desc">${H.esc(DATA.workflow.desc)}</p>
        </div>
        ${H.compTag('library-stepper', 'icon-divider', {
          steps: stepperStepsHtml,
        })}
      </div>
    </section>

    <section id="advantages" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">FS Solution Service Advantages</h2>
        </div>
        <div class="grid grid--3">
          ${advantagesHtml}
        </div>
      </div>
    </section>

    <section id="design" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">EVPN-VXLAN Fabric for Scalable Campus Segmentation and Resilient Service Delivery</h2>
          <p class="section-header__desc">Built on a standards-based EVPN-VXLAN fabric, the FS Campus Fabric solution delivers a secure, scalable, and unified campus network with consistent segmentation, simplified operations, and seamless growth.</p>
        </div>
        <div class="arch-panel">
          <img class="arch-panel__img" src="${H.esc(IMG.arch)}" alt="FS EVPN-VXLAN Campus Fabric Architecture Topology">
        </div>
        <div class="section-bottom-cta">
          ${H.compTag('library-text-button', 'inline-blue-link', {
            label: 'Try FS Design Center',
            href: 'https://design-center.fs.com/design-center',
          })}
        </div>
      </div>
    </section>

    <section id="configure" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Product List</h2>
        </div>
        <div class="grid grid--3">
          ${productCardsHtml}
        </div>
      </div>
    </section>

    <section id="benefits" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Explore the Benefits of FS EVPN-VXLAN Campus Fabric Solution</h2>
        </div>
        <div class="stack-40">
          ${benefitsHtml}
        </div>
      </div>
    </section>

    <section id="operate" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">${H.esc(DATA.software[0].title)}</h2>
          <p class="section-header__desc">Powered by the unified <a class="contact-inline-email" href="https://www.fs.com/specials/picos-switch-software-167.html" target="_blank" rel="noopener">PicOS®</a> operating system, this solution delivers a standards-based EVPN-VXLAN architecture for campus networks. It ensures consistent network segmentation and multi-layer security defense for a highly resilient and scalable campus fabric.</p>
        </div>
        <div class="software-panel">
          <img class="software-panel__img" src="${H.esc(DATA.software[0].img)}" alt="${H.esc(DATA.software[0].title)}">
        </div>
        <div class="section-bottom-cta">
          ${H.compTag('library-text-button', 'inline-blue-link', {
            label: DATA.software[0].cta,
            href: DATA.software[0].href,
          })}
        </div>
      </div>
    </section>

    <section id="operate-ampcon" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">${H.esc(DATA.software[1].title)}</h2>
          <p class="section-header__desc"><a class="contact-inline-email" href="https://www.fs.com/specials/amplified-control-platform-165.html" target="_blank" rel="noopener">AmpCon management software for campus</a> simplifies network design and deployment by unifying wired and wireless management with automated Day 0/1/2 lifecycle operations, intent-based fabric provisioning, and telemetry insights to improve efficiency and reduce complexity.</p>
        </div>
        <div class="software-panel software-panel--bordered">
          <img class="software-panel__img" src="${H.esc(DATA.software[1].img)}" alt="${H.esc(DATA.software[1].title)}">
        </div>
        <div class="section-bottom-cta">
          ${H.compTag('library-text-button', 'inline-blue-link', {
            label: DATA.software[1].cta,
            href: DATA.software[1].href,
          })}
        </div>
      </div>
    </section>

    <section id="customer-success" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Customer Success and Insights</h2>
        </div>
        <div class="grid grid--3">
          ${casesHtml}
        </div>
      </div>
    </section>

    <section id="certified" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">FS Certified</h2>
        </div>
        <div class="cert-grid">
          ${certifiedHtml}
        </div>
      </div>
    </section>

    <section id="solution-support" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Solution Support</h2>
        </div>
        <div class="grid grid--4">
          ${supportHtml}
        </div>
      </div>
    </section>

    <section id="support" class="page-section page-section--gray">
      <div class="container">
        <div class="contact-layout">
          <div class="contact-info">
            <p class="contact-info__eyebrow">CONTACT US</p>
            <h2 class="contact-info__title">Ready to get started?</h2>
            <p class="contact-info__desc">Delivers a secure, scalable, and unified campus network with consistent segmentation, simplified operations, and seamless growth. Connect with our experts for a proven solution design.</p>
            <div class="contact-divider"></div>
            <div class="contact-channels">
              <div class="contact-channel">
                <img class="contact-channel__icon" src="${H.esc(IMG.chPhone)}" alt="Phone">
                <div>
                  <div class="contact-channel__head">
                    ${H.compTag('library-text-button', 'inline-black-bold', {
                      label: '+1 (888) 468-9910',
                      href: 'tel:+18884689910',
                    })}
                  </div>
                  <p class="contact-channel__detail">Expert customer service on call, 5x24 Phone Support</p>
                </div>
              </div>
              <div class="contact-channel">
                <img class="contact-channel__icon" src="${H.esc(IMG.chEmail)}" alt="Email">
                <div>
                  <div class="contact-channel__head">
                    ${H.compTag('library-text-button', 'inline-black-bold', {
                      label: 'Email',
                      href: 'mailto:US@fs.com',
                    })}
                  </div>
                  <p class="contact-channel__detail">Get advice, answers, and solutions when you need them. For general questions, email us at <a class="contact-inline-email" href="mailto:US@fs.com">US@fs.com</a></p>
                </div>
              </div>
              <div class="contact-channel">
                <img class="contact-channel__icon" src="${H.esc(IMG.chChat)}" alt="Live Chat">
                <div>
                  <div class="contact-channel__head">
                    ${H.compTag('library-text-button', 'inline-black-bold', {
                      label: 'Live Chat',
                      href: '#support',
                    })}
                  </div>
                  <p class="contact-channel__detail">Our live agent is ready to chat. Message us now for a quick response.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="inquiry-form-card">
            ${H.compTag('library-form', 'gray', {
              sourceFields: {
                reference: REF_REL,
                objectId: 'contact-form',
              },
              submitLabel: 'Submit',
            })}
          </div>
        </div>
      </div>
    </section>

    <section id="faqs" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">FAQs</h2>
        </div>
        ${H.compTag('library-collapse', 'faq', {
          items: H.faqItemsHtml('campus-faq', DATA.faqs),
        })}
      </div>
    </section>
  </main>

  ${H.compTag('library-navigation', 'footer', {})}

  <script>
    (function () {
      window.onTalkToExpert = function () {
        var el = document.getElementById('support');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      var anchorIds = ['overview', 'design', 'configure', 'operate', 'customer-success', 'support'];
      var anchorTabs = Array.prototype.slice.call(document.querySelectorAll('.ds-anchor-nav__tab'));
      function setActiveAnchor(targetId) {
        anchorTabs.forEach(function (tab, idx) {
          tab.classList.toggle('ds-anchor-nav__tab--active', anchorIds[idx] === targetId);
        });
      }
      anchorTabs.forEach(function (tab, idx) {
        tab.addEventListener('click', function () {
          var id = anchorIds[idx];
          setActiveAnchor(id);
          var section = document.getElementById(id);
          if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      if ('IntersectionObserver' in window && anchorTabs.length) {
        var observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) setActiveAnchor(entry.target.id);
            });
          },
          { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
        );
        anchorIds.forEach(function (id) {
          var sec = document.getElementById(id);
          if (sec) observer.observe(sec);
        });
      }
    })();
  </script>
</body>
</html>
`;

const outRel = 'pages/fs-campus-fabric-network-pc.html';
const rawHtml = H.assembleLocalPage(pageSource, outRel, { write: false });
const { JSDOM } = require(path.join(ROOT, 'design-system/node_modules/jsdom'));
const dom = new JSDOM(rawHtml);
const doc = dom.window.document;

// Inject data-fs-extend bullet list into Overview card (uniform #707070)
const overviewBody = doc.querySelector('#overview .ds-card__body, #overview .ds-card__content');
if (overviewBody) {
  const ul = doc.createElement('ul');
  ul.className = 'fs-bullet-list';
  ul.setAttribute('data-fs-extend', 'overview-key-bullets');
  ul.innerHTML = DATA.overview.bullets.map((b) => `<li>${H.esc(b)}</li>`).join('');
  overviewBody.appendChild(ul);
}

// Inject data-fs-extend clean no-bullet gray SKU links into Product List cards
for (const prod of DATA.products) {
  const host = doc.querySelector(`[data-extend-target="${prod.id}"]`);
  const body = host && host.querySelector('.ds-card__body, .ds-card__content');
  if (body) {
    const ul = doc.createElement('ul');
    ul.className = 'fs-sku-list';
    ul.setAttribute('data-fs-extend', 'product-sku-links');
    ul.innerHTML = prod.skus
      .map(
        (sku) =>
          `<li><a class="fs-sku-link" href="${H.esc(sku.href)}" target="_blank" rel="noopener">${H.esc(sku.label)}</a></li>`
      )
      .join('');
    body.appendChild(ul);
  }
}

// Inject remaining 2 uniform #707070 regular bullets into Benefits horizontal cards
for (const b of DATA.benefits) {
  const host = doc.querySelector(`[data-extend-target="${b.id}"]`);
  const body = host && host.querySelector('.ds-card__body, .ds-card__content');
  if (body) {
    const wrap = doc.createElement('div');
    wrap.className = 'fs-benefit-extra';
    wrap.setAttribute('data-fs-extend', 'benefit-extra-bullets');
    wrap.innerHTML = b.bullets
      .slice(1)
      .map((line) => `<p class="fs-benefit-bullet">• ${H.esc(line)}</p>`)
      .join('');
    body.appendChild(wrap);
  }
}

fs.writeFileSync(path.join(ROOT, outRel), dom.serialize(), 'utf8');
dom.window.close();
console.log('Generated v3:', outRel, 'release:', RELEASE.slice(0, 12));
