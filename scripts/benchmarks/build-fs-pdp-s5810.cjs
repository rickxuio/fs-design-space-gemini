'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '../..');
const H = require(path.join(ROOT, 'scripts/page-helpers.cjs'));

const SLUG = 'fs-pdp-s5810';
const REF_REL = `reference-inputs/${SLUG}/content.json`;
const RELEASE = H.getActiveRelease();

const assetMap = JSON.parse(
  fs.readFileSync(path.join(ROOT, `reference-inputs/${SLUG}/assets-map.json`), 'utf8')
);
function localAsset(url) {
  if (!assetMap[url]) throw new Error('Missing local asset for: ' + url);
  return assetMap[url];
}

const DATA = {
  url: 'https://www.fs.com/products/206801.html?now_cid=1368',
  sku: '206801',
  partNumber: 'S5810-48TS-P',
  title:
    'S5810-48TS-P, 48-Port Gigabit Ethernet L3 PoE+ Switch, 48 x PoE+ Ports @740W, with 4 x 10Gb SFP+ Uplinks, PicOS®, Support MLAG & Perpetual PoE, Broadcom Chip',
  price: 'US$2,369.00',
  breadcrumbs: [
    { text: 'Home', href: 'https://www.fs.com/' },
    { text: 'Switches', href: 'https://www.fs.com/c/switches-4222' },
    { text: 'PicOS® Enterprise Switches', href: 'https://www.fs.com/c/picos-enterprise-switches-4223' },
    { text: '1/2.5G PicOS® Switches', href: 'https://www.fs.com/c/1-2.5g-picos-switches-1368' },
    { text: 'SKU:206801', href: null },
  ],
  gallery: [
    {
      type: 'video',
      title: 'S5810-48TS-P PicOS® Switch Overall Introduction | FS',
      thumb: 'https://resource.fs.com/images/20260618164807rj2yg5.jpg',
      full: 'https://resource.fs.com/images/20260618164807rj2yg5.jpg',
    },
    {
      type: 'image',
      active: true,
      title: 'S5810-48TS-P Front View',
      thumb: 'https://resource.fs.com/mall/products/180x180/115388.main.jpg.webp',
      full: 'https://resource.fs.com/mall/mainImg/20250904105427f6u8s5.jpg.webp',
    },
    {
      type: 'image',
      title: 'S5810-48TS-P Ports & Rear View',
      thumb: 'https://resource.fs.com/mall/mainImg/180x180/20260924173240obxcxm.jpg.webp',
      full: 'https://resource.fs.com/mall/mainImg/180x180/20260924173240obxcxm.jpg.webp',
    },
    {
      type: 'image',
      title: 'S5810-48TS-P AmpCon Management',
      thumb: 'https://resource.fs.com/mall/mainImg/180x180/20260803145500ib1qkr.jpg.webp',
      full: 'https://resource.fs.com/mall/mainImg/180x180/20260803145500ib1qkr.jpg.webp',
    },
    {
      type: 'image',
      title: 'S5810-48TS-P Accessories',
      thumb: 'https://resource.fs.com/mall/mainImg/180x180/20230727120001lb67pl.jpg.webp',
      full: 'https://resource.fs.com/mall/mainImg/180x180/20230727120001lb67pl.jpg.webp',
    },
    {
      type: 'image',
      title: 'S5810-48TS-P Dimensions',
      thumb: 'https://resource.fs.com/mall/mainImg/180x180/20250827114133j7ze6c.jpg.webp',
      full: 'https://resource.fs.com/mall/mainImg/180x180/20250827114133j7ze6c.jpg.webp',
    },
  ],
  variants: [
    {
      sku: '206801',
      pn: 'S5810-48TS-P',
      label: 'S5810-48TS-P | 48x PoE+, 4x 10G SFP+',
      price: 'US$2,369.00',
      stock: '310 in Global Warehouse, Get it Nov 26, 2026',
      img: 'https://resource.fs.com/mall/products/180x180/115388.main.jpg.webp',
      active: true,
    },
    {
      sku: '207061',
      pn: 'S5810-28TS',
      label: 'S5810-28TS | 24x RJ45, 4x 10G SFP+',
      price: 'US$1,149.00',
      stock: '185 in Global Warehouse, Get it Nov 26, 2026',
      img: 'https://resource.fs.com/mall/1G-10G-Switches/180x180/20220525181802_185_149847.jpg.webp',
    },
    {
      sku: '207063',
      pn: 'S5810-28FS',
      label: 'S5810-28FS | 28x SFP, 4x 10G SFP+',
      price: 'US$1,399.00',
      stock: '92 in Global Warehouse, Get it Nov 26, 2026',
      img: 'https://resource.fs.com/mall/products/180x180/115383.main.jpg.webp',
    },
    {
      sku: '207065',
      pn: 'S5810-48TS',
      label: 'S5810-48TS | 48x RJ45, 4x 10G SFP+',
      price: 'US$1,579.00',
      stock: '4 in U.S. Warehouse, Get it Nov 24, 2026',
      img: 'https://resource.fs.com/mall/mainImg/180x180/20220919163009imgnki.jpg.webp',
    },
    {
      sku: '207067',
      pn: 'S5810-48FS',
      label: 'S5810-48FS | 48x SFP, 4x 10G SFP+',
      price: 'US$1,899.00',
      stock: '64 in Global Warehouse, Get it Nov 26, 2026',
      img: 'https://resource.fs.com/mall/products/180x180/115384.main.jpg.webp',
    },
    {
      sku: '319545',
      pn: 'Customized',
      label: 'Customized Switch',
      price: 'US$2,369.00',
      stock: 'Custom lead time — Contact Sales',
      img: 'https://resource.fs.com/mall/products/180x180/115388.main.jpg.webp',
      custom: true,
    },
  ],
  highlights: [
    'Broadcom BCM56340 Chip for Low Latency and Power-Efficient Performance',
    '48x PoE+ Ports, Up to 30W Per Port & Total Budget 740W, Support Perpetual PoE',
    '88 Gbps (unidirectional)/176 Gbps (bidirectional) Switching Capacity',
    'AmpCon Management Software with Centralized Visibility & Control',
    'Modular PicOS® System Supports MLAG, OSPF, BGP, PBR, PTP, STP, QoS, etc.',
    'Secure Your Network with 802.1X, ACL, RADIUS, TACACS+ & DHCP Snooping',
    '1+1 Hot-Swappable Power Supplies and 2+1 Smart Fans Enhance Service Continuity',
  ],
  services: [
    {
      title: 'Global Services Localized for You',
      icon: 'https://resource.fs.com/mall/generalImg/202506241453357f37ax.svg',
      linkText: 'FS Install™ & FS Care™',
      linkHref: 'https://www.fs.com/service/fs_install.html',
      bullets: [
        '7 Local Warehouses Enabling 90% Same-Day Shipping',
        '8 Local Presences Supporting 450K+ Enterprise Clients in Over 200 Countries',
        'Expert Customer Service On Call, 5x24 Phone Support',
        'Local Engineers Provide Professional FS Install™ & FS Care™ Services',
      ],
    },
    {
      title: 'End-to-End Product Customization',
      icon: 'https://resource.fs.com/mall/generalImg/202506241453356h6arj.svg',
      linkText: 'FS Product Custom',
      linkHref: 'https://www.fs.com/specials/product-custom-194.html',
      bullets: [
        '600+ R&D Experts in Software and Hardware Domains',
        'Hardware Adaptation to Tailor Products and Ensure Seamless Compatibility',
        'Custom Protocol Development Aligned with Unique Business Needs',
        'Management Platform Integration for Device Onboarding and Feature Development',
      ],
    },
    {
      title: 'Always-On Tech Support',
      icon: 'https://resource.fs.com/mall/generalImg/20250624145335x1ulgd.svg',
      linkText: 'Tech Support',
      linkHref: 'https://www.fs.com/service/technical_support.html',
      bullets: [
        '900+ Technical Support and Service Professionals',
        '0.5-Day Average Solution Response Time',
        'On-Site, Remote, Demo, and Online Support Options',
        'Simplify Network Design with FS Design Center Tool',
      ],
    },
  ],
  specPairs: [
    ['Ports', '48x 10/100/1000BASE-T RJ45 | 4x 1G/10G SFP+', 'Operating System', 'PicOS®'],
    ['Switch Chip', 'BCM56340', 'CPU', 'ARM A9 Dual-Core CPU, 1GHz'],
    ['Power Supply', '2 (1+1 Redundancy) Hot-swappable', 'DRAM', '1GB'],
    ['Fan Number', '3 (2+1 Redundancy) Built-in', 'Flash Memory', '512MB'],
    ['Dimensions (HxWxD)', "1.73''x17.32''x16.54'' (44x440x420mm)", 'Switching Capacity', '88 Gbps / 176 Gbps'],
    ['Form Factor', '1 RU', 'Forwarding Rate', '132 Mpps'],
    ['Weight', '13.45 lbs (6.1kg)', 'Packet Buffer', '4MB'],
    ['PoE Standard', 'IEEE 802.3af/at', 'Jumbo Frame', '9216'],
    ['Input Voltage', '100-240VAC, 50-60Hz', 'Power Budget (Dual-power)', '740W'],
    ['Input Current', '3.5A Max', 'MAC Address', '65536'],
    ['Max. Power Consumption', '70W (880W with PoE)', 'IPv4/IPv6 Routes', '6K / 3K'],
    ['Temperature', 'Operating: 0 to 50ºC | Storage: -40 to 70ºC', 'Number of VLANs', '4K'],
  ],
  softwareSpotlights: [
    {
      title: 'Resiliency and High Availability',
      items: [
        'Multi-Chassis Link Aggregation (MLAG)',
        'IEEE 802.3ad Link Aggregation (LACP)',
        'Support BFD for Fast Link Failure Detection',
        'Unidirectional Link Detection (UDLD)',
        'Virtual Router Redundancy Protocol (VRRP)',
        'Graceful Restart (OSPFv2/OSPFv3)',
        'Uninterrupted Power over Ethernet (Perpetual PoE)',
      ],
    },
    {
      title: 'Security',
      items: [
        'NAC: 802.1X, MAC Authentication, CWA Authentication',
        'RADIUS, TACACS+, Local Authentication, LDAP',
        'Port Security & Self-signed Certificate',
        'Dynamic ARP Inspection (DAI)',
        'IP Source Guard (IPSG)',
        'IPv4/IPv6 DHCP Relay/Snooping',
        'Control Plane Policing (CoPP) & ERPS',
      ],
    },
    {
      title: 'Management',
      items: [
        'AmpCon Management Software (Day 0 to Day 2+)',
        'Telemetry for Real-time Network Monitoring',
        'Programmability: NETCONF, RESTCONF, Ansible, OpenFlow',
        'SNMP v1/v2/v3, RMON & Web-based GUI',
        'Syslog Management & sFlow / MLAG Telemetry',
        'Precision Time Protocol (PTP) & NTP',
      ],
    },
  ],
  featureBlocks: [
    {
      title: 'Scalable Campus Architecture for Wi-Fi 6 High-Capacity Connectivity',
      desc: 'FS Software-Driven Enterprise Wi-Fi 6 Solution leverages AmpCon management software to deliver secure, high-capacity campus connectivity with centralized control and simplified network operations.',
      img: 'https://resource.fs.com/mall/fs_scene_images/20260602122129o3m3q7.png',
    },
    {
      title: 'PicOS® Ensures Stable and Secure Network Operations',
      desc: 'PicOS® features a modular design for independent component operation, a dual-partition rollback for quick restoration, comprehensive L2/L3 features, and various security authentication methods to enhance network reliability and availability.',
      img: 'https://resource.fs.com/mall/generalImg/20260824182540uztuev.jpg.webp',
    },
    {
      title: 'MLAG Eliminates Bottlenecks and Realizes Uninterrupted Services',
      desc: 'MLAG delivers device-level link redundancy and balancing by aggregating links across two switches, boosting network bandwidth, reliability, and availability, ensuring uninterrupted operation of critical services.',
      img: 'https://resource.fs.com/mall/generalImg/20260924165445v1hlvq.jpg.webp',
    },
    {
      title: '1/10G Ports with Non-blocking Line-Rate for Versatile Networking',
      desc: "48x 10/100/1000Mbps auto-sensing RJ45 ports adapt to multiple devices' seamless connections. The 10G SFP+ uplink ports enhance flexibility for connecting to core networks or aggregation switches, optimizing network scalability and performance.",
      img: 'https://resource.fs.com/mall/generalImg/20231101094636xveua7.jpg.webp',
      metrics: [
        { val: 'BCM56340', lbl: 'Broadcom Chip' },
        { val: '176 Gbps', lbl: 'Switching Capacity' },
        { val: '132 Mpps', lbl: 'Forwarding Rate' },
      ],
    },
    {
      title: 'Uninterrupted PoE+ With Perpetual PoE, Keeping Devices Always-On',
      desc: 'Deliver PoE connectivity for devices such as IP phones, surveillance cameras and Wi-Fi 6 access points, providing a PoE power budget of up to 740W and up to 30W per port in compliance with the IEEE 802.3at standard.',
      img: 'https://resource.fs.com/mall/generalImg/20260924165449zx1vxs.jpg.webp',
    },
  ],
  comparison: {
    models: [
      { name: 'S5810-48TS-P', img: 'https://resource.fs.com/mall/products/180x180/115388.main.jpg' },
      { name: 'S3410-48TS-P', img: 'https://resource.fs.com/mall/products/180x180/115386.main.jpg' },
      { name: 'S5870-48T6BC-U', img: 'https://resource.fs.com/mall/mainImg/180x180/20231208165755wkn6uq.jpg' },
    ],
    rows: [
      ['Switch Layer', 'Layer 3', 'Layer 2+', 'Layer 3'],
      ['Chip', 'BCM56340', 'BCM56150', 'BCM56371'],
      ['Ports', '48x 1G RJ45, 4x 10G SFP+', '48x 1G RJ45, 2x 10G SFP+', '48x 1G RJ45, 4x 25G SFP28, 2x 100G QSFP28'],
      ['PoE Ports', 'PoE+ / PoE', 'PoE+ / PoE', 'PoE++ / PoE+ / PoE'],
      ['Switching Capacity', '88 / 176 Gbps', '70 / 140 Gbps', '348 / 696 Gbps'],
      ['Forwarding Rate', '132 Mpps', '132 Mpps', '744 Mpps'],
      ['Power Budget', '740W', '740W', '1560W'],
      ['BGP / L3 Routing / EVPN-VXLAN', 'Yes / Yes / -', '- / - / -', 'Yes / Yes / Yes'],
    ],
  },
  videos: [
    { duration: '0:51', title: 'S5810-48TS-P Switch IXIA RFC 2544 Test', img: 'https://resource.fs.com/images/20240920141541yhqywr.jpg' },
    { duration: '2:53', title: 'PicOS® Enterprise Switches with Automated Deployment and Management | FS', img: 'https://resource.fs.com/images/20250317164217j94i6k.jpg' },
    { duration: '3:00', title: 'Explore AmpCon-Campus Management Platform', img: 'https://resource.fs.com/images/20260713150327r2t0b9.jpg' },
    { duration: '2:25', title: 'Set Up PicOS® Enterprise Switches in Minutes | FS', img: 'https://resource.fs.com/images/20260713150502w7hbtf.jpg' },
  ],
  qaItems: [
    {
      tag: 'Compatibility',
      q: 'Can FS switches use third-party optical transceivers and interoperate with switches from other vendors?',
      qMeta: 'by R***n on 09/29/2026',
      a: 'Yes. For optimal compatibility and support, we recommend using FS-compatible optical transceivers and cables. Third-party transceivers can also be used when key specifications and link settings—including speed, wavelength, transmission distance, fiber type, FEC, and port mode—are compatible.',
      aMeta: 'by FS.com on 09/30/2026',
    },
    {
      tag: 'MLAG',
      q: 'Does S5810-48TS-P support MLAG or stacking?',
      qMeta: 'by M***n on 08/27/2026',
      a: 'The S5810-48TS-P supports different high-availability technologies depending on the operating system. The PicOS® version supports MLAG, allowing two switches to form an MLAG pair for link and device redundancy. The FSOS version supports stacking, allowing up to 8 switches to operate as a single logical switch.',
      aMeta: 'by FS.com on 08/28/2026',
    },
    {
      tag: 'License',
      q: 'Does the S5810-48TS-P switch require an additional license purchase?',
      qMeta: 'by C***r on 07/15/2026',
      a: 'No. The S5810-48TS-P switch comes with a pre-installed perpetual PicOS® license, with no additional software license required for basic switch functionality, including OpenFlow, MLAG, OSPF, BGP, IPv4/IPv6, PBR, PTP, and STP.',
      aMeta: 'by FS.com on 07/16/2026',
    },
    {
      tag: 'AmpCon',
      q: 'Does AmpCon-Campus support ZTP and device import functions for device onboarding?',
      qMeta: 'by M***s on 04/19/2026',
      a: 'Yes. AmpCon-Campus supports centralized management, configuration delivery, and status monitoring for PicOS switches via ZTP auto-onboarding or Import manual configuration.',
      aMeta: 'by FS.com on 04/19/2026',
    },
  ],
  reviews: [
    {
      author: 'J***t',
      date: 'December 5, 2024',
      location: 'United States',
      rating: 5,
      text: 'I have been very satisfied with the PicOS® switch. For any network expansion and proposals I will make the case for PicOS® switches to be the first choice before any other proprietary, convoluted licensed switch vendors.',
      helpful: 4,
    },
    {
      author: 'D***e',
      date: 'November 15, 2024',
      location: 'United States',
      rating: 4,
      text: 'Software is well documented and easy to use. I have mostly interacted with the CLI interface and I am very satisfied.',
      helpful: 2,
    },
    {
      author: 'J***d',
      date: 'October 15, 2024',
      location: 'United States',
      rating: 4,
      text: 'I have not encountered any performance bottlenecks or hardware failures. The switch meets all my requirements.',
      helpful: 1,
    },
    {
      author: 'L***t',
      date: 'September 20, 2024',
      location: 'United States',
      rating: 4,
      text: "I'm a long time Linux user so really do enjoy the ability to just drop into a Linux shell on the switch at any time and do find the configuration format and handling very easy to work with.",
      helpful: 1,
    },
    {
      author: 'D***y',
      date: 'March 12, 2024',
      location: 'United States',
      rating: 5,
      text: "Many thanks for the information. This is the first time I've used FS.com and the experience, including online chat is great, every question I have asked has been answered to satisfaction.",
      helpful: 4,
    },
  ],
  resourceTabs: [
    {
      name: 'Device Essentials',
      items: [
        { title: 'S5810-48TS-P PicOS® Switch Hardware Guide', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
        { title: 'S5810 Series PicOS® Switches Data Sheet', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
        { title: 'PicOS® Software Release Notes V4.7.1M-EC', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
      ],
    },
    {
      name: 'Set Up',
      items: [
        { title: 'AmpCon-Campus Quick Deployment Guide V2.3.0', isNew: false, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
        { title: 'S5810-48TS-P Switches Quick Start Guide V2.1', isNew: true, href: 'https://resource.fs.com/mall/resource/s5810-48ts-p-and-s5810-28ts-and-s5810-48ts-switches-quick-start-guide-v21.pdf' },
        { title: 'PicOS® Quick Deployment Guide', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
        { title: 'PicOS® Configuration Guide V4.7-EC', isNew: true, href: 'https://resource.fs.com/mall/resource/picos-configuration-guide-v47-ec.pdf' },
      ],
    },
    {
      name: 'Manage',
      items: [
        { title: 'AmpCon-Campus Management Platform User Manual V2.1.1', isNew: false, href: 'https://resource.fs.com/mall/resource/ampcon-campus-management-platform-user-manual-v211.pdf' },
        { title: 'PicOS® Enterprise Switches Web-based Configuration Guide', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
        { title: 'PicOS® Enterprise Switches CLI Reference Guide V4.7-EC', isNew: true, href: 'https://resource.fs.com/mall/resource/picos-configuration-guide-v47-ec.pdf' },
        { title: 'PicOS® Access Assurance Guide', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
        { title: 'PicOS® Troubleshooting Guide', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
        { title: 'S5810 Series PicOS® Switches FAQ', isNew: true, href: 'https://www.fs.com/products_support/search.html?keyword=206801' },
      ],
    },
  ],
  caseStudies: [
    {
      id: 'pdp-case-0',
      location: 'Singapore',
      title: 'Educational Institution Achieves Seamless Network Cutover with FS PicOS® Switch Solution',
      tag: 'Large and Midsize Campus Network',
      img: 'https://resource.fs.com/mall/generalImg/202409260945169x7jy7.jpg',
      href: 'https://www.fs.com/case-study/fs-enables-seamless-network-cutover-for-educational-institution-103.html',
    },
    {
      id: 'pdp-case-1',
      location: 'United States',
      title: 'FS PicOS® Solution Upgrades a Reliable Campus Network for an Automotive Parts Manufacturer',
      tag: 'Large and Midsize Campus Network',
      img: 'https://resource.fs.com/mall/generalImg/202609141706131zzqih.jpg',
      href: 'https://www.fs.com/case-study/fs-picos-solution-upgrades-a-reliable-campus-network-for-an-automotive-parts-manufacturer-cs358.html',
    },
    {
      id: 'pdp-case-2',
      location: 'Belgium',
      title: 'Building a High-Speed Wireless Government Campus Network with FS Wi-Fi 6E',
      tag: 'Midsize Campus Wireless Network',
      img: 'https://resource.fs.com/mall/generalImg/20250228142527nq7plr.jpg',
      href: 'https://www.fs.com/case-study/building-a-high-speed-wireless-government-campus-network-with-fs-wi-fi-6e-147.html',
    },
    {
      id: 'pdp-case-3',
      location: 'United States',
      title: 'Empowering Fresh Network Connectivity for Fermented Dairy Production',
      tag: 'Small Campus Wireless Network',
      img: 'https://resource.fs.com/mall/generalImg/20241029170607r8unjy.jpg',
      href: 'https://www.fs.com/case-study/empowering-wi-fi-network-connectivity-for-fermented-dairy-production-110.html',
    },
  ],
};

// Write reference-inputs/fs-pdp-s5810/content.json
const refObjects = [
  ...DATA.caseStudies.map((c) => ({ objectId: c.id, title: c.title, category: c.location })),
];
fs.writeFileSync(
  path.join(ROOT, REF_REL),
  JSON.stringify(
    {
      kind: 'original-page-content-reference',
      source: DATA.url,
      capturedAt: '2026-11-22',
      modules: [{ id: 'main', items: refObjects }],
    },
    null,
    2
  ) + '\n',
  'utf8'
);

// 1. Breadcrumb
const breadcrumbItemsHtml = DATA.breadcrumbs
  .map((b, i) =>
    i === DATA.breadcrumbs.length - 1
      ? `<div class="ds-breadcrumb__item"><span class="ds-breadcrumb__current">${H.esc(b.text)}</span></div>`
      : `<div class="ds-breadcrumb__item"><a href="${H.esc(b.href)}" class="ds-breadcrumb__link">${H.esc(b.text)}</a><span class="ds-breadcrumb__separator" aria-hidden="true">/</span></div>`
  )
  .join('');

// 2. Gallery thumbnails
const galleryThumbsHtml = DATA.gallery
  .map(
    (g, i) => `<button type="button" class="pdp-thumb${g.active ? ' is-active' : ''}" data-gallery-idx="${i}" data-gallery-src="${H.esc(localAsset(g.full))}" data-gallery-title="${H.esc(g.title)}" aria-label="${H.esc(g.title)}">
      <img class="pdp-thumb__img" src="${H.esc(localAsset(g.thumb))}" alt="${H.esc(g.title)}">
      ${g.type === 'video' ? '<span class="pdp-thumb__play" aria-hidden="true">&#9654;</span>' : ''}
    </button>`
  )
  .join('');

// 3. Variant selector pills
const variantPillsHtml = DATA.variants
  .map(
    (v, i) => `<button type="button" class="pdp-variant-pill${v.active ? ' is-active' : ''}${v.custom ? ' is-custom' : ''}" data-variant-idx="${i}" data-variant-pn="${H.esc(v.pn)}" data-variant-sku="${H.esc(v.sku)}" data-variant-label="${H.esc(v.label)}" data-variant-price="${H.esc(v.price)}" data-variant-stock="${H.esc(v.stock)}" data-variant-img="${H.esc(localAsset(v.img))}" aria-pressed="${v.active ? 'true' : 'false'}">
      <img class="pdp-variant-pill__img" src="${H.esc(localAsset(v.img))}" alt="">
      <span class="pdp-variant-pill__text">${H.esc(v.label)}</span>
    </button>`
  )
  .join('');

// 4. Sticky Anchor Nav (8 sections)
const anchorTabs = [
  { id: 'specifications', label: 'Specifications' },
  { id: 'connectivity', label: 'Connectivity Solutions' },
  { id: 'features', label: 'Features' },
  { id: 'videos', label: 'Videos' },
  { id: 'qa', label: 'Q&A' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'resources', label: 'Resources' },
  { id: 'case-study', label: 'Case Study' },
];
const anchorTabsHtml = anchorTabs
  .map(
    (t, i) =>
      `<div class="ds-anchor-nav__tab${i === 0 ? ' ds-anchor-nav__tab--active' : ''}" data-anchor-tab="">${H.esc(t.label)}</div>`
  )
  .join('');

// 5. Services 3-col cards
const servicesHtml = DATA.services
  .map(
    (s) => `<div class="pdp-service-card">
      <img class="pdp-service-card__icon" src="${H.esc(localAsset(s.icon))}" alt="${H.esc(s.title)}">
      <h3 class="pdp-service-card__title">${H.esc(s.title)}</h3>
      <ul class="pdp-service-card__list">
        ${s.bullets.map((b) => `<li>${H.esc(b)}</li>`).join('')}
      </ul>
      <a class="pdp-service-card__link" href="${H.esc(s.linkHref)}" target="_blank" rel="noopener">${H.esc(s.linkText)} &rsaquo;</a>
    </div>`
  )
  .join('');

// 6. Specifications 2x2 table rows
const specTableRowsHtml = DATA.specPairs
  .map(
    ([k1, v1, k2, v2]) =>
      `<tr><th>${H.esc(k1)}</th><td>${H.esc(v1)}</td><th>${H.esc(k2)}</th><td>${H.esc(v2)}</td></tr>`
  )
  .join('');

// 7. Software Spotlights (3 cols)
const spotlightsHtml = DATA.softwareSpotlights
  .map(
    (sp) => `<div class="pdp-spotlight-col">
      <h4 class="pdp-spotlight-col__title">${H.esc(sp.title)}</h4>
      <ul class="pdp-spotlight-col__list">
        ${sp.items.map((item) => `<li>${H.esc(item)}</li>`).join('')}
      </ul>
    </div>`
  )
  .join('');

// 8. Connectivity Tabs (library-tab/standard)
const connTabsHtml = [
  'Three-Tier Campus Network Architecture',
  'Two-Tier Campus Network Architecture',
  'Hierarchical Switch Connectivity',
]
  .map(
    (label, i) =>
      `<div class="ds-tab__item${i === 0 ? ' ds-tab__item--active' : ''}" data-tab-item=""><div class="ds-tab__item-inner"><span class="ds-tab__item-text">${H.esc(label)}</span>${i === 0 ? '<div class="ds-tab__indicator"></div>' : ''}</div></div>`
  )
  .join('');

// 9. Feature Overview Blocks (metrics below image in gray cards, matching live fs.com)
const featuresHtml = DATA.featureBlocks
  .map((f) => {
    const metricsHtml = f.metrics
      ? `<div class="pdp-metrics-row">${f.metrics
          .map(
            (m) =>
              `<div class="pdp-metric"><span class="pdp-metric__val">${H.esc(m.val)}</span><span class="pdp-metric__lbl">${H.esc(m.lbl)}</span></div>`
          )
          .join('')}</div>`
      : '';
    return `<div class="pdp-feature-block">
      <h3 class="pdp-feature-block__title">${H.esc(f.title)}</h3>
      <p class="pdp-feature-block__desc">${H.esc(f.desc)}</p>
      <div class="pdp-feature-block__media">
        <img class="pdp-feature-block__img" src="${H.esc(localAsset(f.img))}" alt="${H.esc(f.title)}">
      </div>
      ${metricsHtml}
    </div>`;
  })
  .join('');

// 10. Comparison Table
const compHeadHtml = DATA.comparison.models
  .map(
    (m) => `<th class="pdp-comp-th">
      <img class="pdp-comp-img" src="${H.esc(localAsset(m.img))}" alt="${H.esc(m.name)}">
      <div class="pdp-comp-name">${H.esc(m.name)}</div>
    </th>`
  )
  .join('');
const compRowsHtml = DATA.comparison.rows
  .map(
    (r) =>
      `<tr><th class="pdp-comp-spec">${H.esc(r[0])}</th><td>${H.esc(r[1])}</td><td>${H.esc(r[2])}</td><td>${H.esc(r[3])}</td></tr>`
  )
  .join('');

// 11. Videos 4-col grid using native library-video-button/light
const videosHtml = DATA.videos
  .map(
    (v) => `<div class="pdp-video-card">
      <div class="pdp-video-card__media">
        <img class="pdp-video-card__img" src="${H.esc(localAsset(v.img))}" alt="${H.esc(v.title)}">
        <div class="pdp-video-card__btn">
          ${H.compTag('library-video-button', 'light', {
            duration: v.duration,
            accessibleLabel: 'Play ' + v.title,
            actionCallback: 'onPdpVideoPlay',
          })}
        </div>
      </div>
      <div class="pdp-video-card__body">
        <p class="pdp-video-card__title">${H.esc(v.title)}</p>
      </div>
    </div>`
  )
  .join('');

// 12. Q&A threads using native library-comment/qa-thread
const qaTags = ['All(31)', 'PicOS®(7)', 'MLAG(2)', 'License(2)', 'Compatibility(1)', 'AmpCon(1)'];
const qaTagsHtml = qaTags
  .map(
    (t, i) =>
      `<button type="button" class="pdp-qa-tag${i === 0 ? ' is-active' : ''}" data-qa-tag="${H.esc(t.split('(')[0])}">${H.esc(t)}</button>`
  )
  .join('');

const qaThreadsHtml = DATA.qaItems
  .map(
    (item, i) => `<div class="pdp-qa-item" data-qa-category="${H.esc(item.tag)}">
      ${H.compTag('library-comment', 'qa-thread', {
        question: item.q,
        questionMeta: item.qMeta,
        answer: item.a,
        answerMeta: item.aMeta,
        panelIdentity: `pdp-qa-panel-${i}`,
        submitCallback: 'onQaSubmit',
        helpfulCallback: 'onQaHelpful',
      })}
    </div>`
  )
  .join('');

// 13. Reviews summary (native library-rate/summary) + 5 review items
const starOnSrc = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons/icon-rate-on-16.svg`;
const starOffSrc = `../fs-components/component-specs/library/releases/${RELEASE}/components/icons/icon-rate-off-16.svg`;

const reviewsListHtml = DATA.reviews
  .map((r) => {
    const stars = Array.from({ length: 5 }, (_, si) =>
      `<img class="pdp-review-star" src="${si < r.rating ? starOnSrc : starOffSrc}" alt="">`
    ).join('');
    return `<article class="pdp-review-row" data-review-stars="${r.rating}">
      <div class="pdp-review-left">
        <div class="pdp-review-avatar">${H.esc(r.author.charAt(0))}</div>
        <div class="pdp-review-author-info">
          <div class="pdp-review-author">${H.esc(r.author)}</div>
          <div class="pdp-review-meta">${H.esc(r.date)} &middot; ${H.esc(r.location)}</div>
          <div class="pdp-review-verified">&#10003; Verified Purchase</div>
        </div>
      </div>
      <div class="pdp-review-right">
        <div class="pdp-review-stars">${stars}<span class="pdp-review-score">${r.rating}.0</span></div>
        <div class="pdp-review-variant">Products: S5810-48TS-P | 48x PoE+, 4x 10G SFP+</div>
        <p class="pdp-review-text">${H.esc(r.text)}</p>
        <div class="pdp-review-actions">Helpful (${r.helpful}) &middot; Comment (0)</div>
      </div>
    </article>`;
  })
  .join('');

// 14. Resources Tabs (library-tab/standard) + Document cards
const resTabsHtml = DATA.resourceTabs
  .map(
    (t, i) =>
      `<div class="ds-tab__item${i === 0 ? ' ds-tab__item--active' : ''}" data-tab-item=""><div class="ds-tab__item-inner"><span class="ds-tab__item-text">${H.esc(t.name)}</span>${i === 0 ? '<div class="ds-tab__indicator"></div>' : ''}</div></div>`
  )
  .join('');

const resPanelsHtml = DATA.resourceTabs
  .map(
    (t, ti) => `<div class="pdp-res-grid" data-res-panel="${ti}"${ti !== 0 ? ' hidden' : ''}>
      ${t.items
        .map(
          (doc) => `<a class="pdp-doc-card" href="${H.esc(doc.href)}" target="_blank" rel="noopener">
            <span class="pdp-doc-card__icon" aria-hidden="true">&#128196;</span>
            <span class="pdp-doc-card__title">${H.esc(doc.title)}${doc.isNew ? ' <span class="pdp-doc-new">New</span>' : ''}</span>
          </a>`
        )
        .join('')}
    </div>`
  )
  .join('');

// 15. Case Studies 4-col grid using native library-card/spliced-vertical-single-event-bordered
const caseStudiesHtml = DATA.caseStudies
  .map(
    (c) => `<a class="card-full-link" href="${H.esc(c.href)}" target="_blank" rel="noopener">
      ${H.compTag('library-card', 'spliced-vertical-single-event-bordered', {
        image: `<img src="${H.esc(localAsset(c.img))}" alt="${H.esc(c.title)}">`,
        category: c.location,
        title: c.title,
        sourceAbsent: {
          reference: REF_REL,
          objectId: c.id,
          slots: ['description', 'link'],
        },
      })}
    </a>`
  )
  .join('');

const pageCss = `${H.basePageCss()}
.pdp-top-section { padding: 40px 0; background: #FFFFFF; }
.pdp-breadcrumb-wrap { margin-bottom: 20px; }
.pdp-hero-grid { display: grid; grid-template-columns: minmax(0, 480px) minmax(0, 1fr); gap: 40px; align-items: start; }
.pdp-gallery { position: sticky; top: 88px; }
.pdp-main-stage { width: 100%; height: 420px; background: #FFFFFF; display: flex; align-items: center; justify-content: center; border-radius: 8px; overflow: hidden; }
.pdp-main-img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
.pdp-stage-hint { text-align: center; font-size: 12px; line-height: 18px; color: #707070; margin: 8px 0 16px; }
.pdp-thumbs-row { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
.pdp-thumb { appearance: none; position: relative; width: 64px; height: 64px; padding: 4px; border-radius: 6px; border: 1px solid #E5E5E5; background: #FFFFFF; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; }
.pdp-thumb:hover { border-color: #707070; }
.pdp-thumb.is-active { border-color: #19191A; border-width: 1.5px; }
.pdp-thumb__img { max-width: 100%; max-height: 100%; object-fit: contain; display: block; }
.pdp-thumb__play { position: absolute; width: 22px; height: 22px; border-radius: 50%; background: rgba(25, 25, 26, 0.72); color: #FFFFFF; font-size: 9px; line-height: 22px; text-align: center; padding-left: 2px; box-sizing: border-box; }
.pdp-buybox__title { margin: 0 0 8px; font-size: 22px; line-height: 30px; font-weight: 600; color: #19191A; }
.pdp-hot-pill { display: inline-flex; align-items: center; height: 20px; padding: 0 7px; border-radius: 4px; background: #FFEBDD; color: #F56300; font-size: 12px; line-height: 20px; font-weight: 600; vertical-align: middle; margin-left: 6px; }
.pdp-buybox__meta { font-size: 12px; line-height: 20px; color: #707070; margin-bottom: 14px; display: flex; gap: 16px; }
.pdp-price-bar { background: #FAFBFB; border-radius: 8px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.pdp-price-val { font-size: 22px; line-height: 28px; font-weight: 600; color: #19191A; }
.pdp-price-stats { display: flex; align-items: center; gap: 10px; font-size: 12px; line-height: 18px; color: #707070; }
.pdp-stat-sold { color: #A65300; }
.pdp-stat-rev { color: #0060BF; text-decoration: none; }
.pdp-stat-rev:hover { text-decoration: underline; }
.pdp-stat-sep { display: inline-block; width: 1px; height: 10px; background: #DEE0E3; }
.pdp-variants-row { display: grid; grid-template-columns: 72px minmax(0, 1fr); gap: 12px; align-items: start; margin-bottom: 20px; }
.pdp-variants-label { font-size: 13px; line-height: 36px; color: #707070; }
.pdp-variants-list { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
.pdp-variant-pill { appearance: none; display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 12px 0 8px; border-radius: 4px; border: 1px solid #E5E5E5; background: #FFFFFF; color: #19191A; font-family: inherit; font-size: 12px; line-height: 20px; cursor: pointer; transition: border-color 0.15s ease; }
.pdp-variant-pill:hover { border-color: #19191A; }
.pdp-variant-pill.is-active { border-color: #19191A; background: #F6F6F8; font-weight: 600; }
.pdp-variant-pill.is-custom { color: #0060BF; }
.pdp-variant-pill__img { width: 24px; height: 24px; object-fit: contain; display: block; }
.pdp-stock-box { border-top: 1px solid #F2F2F2; padding-top: 16px; margin-bottom: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; line-height: 20px; color: #4B4B4D; }
.pdp-stock-line--muted { color: #707070; font-size: 12px; }
.pdp-trust-row { display: flex; align-items: center; gap: 12px; font-size: 12px; line-height: 20px; color: #19191A; margin-top: 6px; }
.pdp-cta-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.pdp-highlights { border-top: 1px solid #F2F2F2; padding-top: 16px; }
.pdp-highlights__title { margin: 0 0 10px; font-size: 14px; line-height: 22px; font-weight: 600; color: #19191A; }
.pdp-highlights__list { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 13px; line-height: 20px; color: #4B4B4D; }
.pdp-anchor-sticky { position: sticky; top: 0; z-index: 25; background: #FAFBFB; border-top: 1px solid #ECEEF0; border-bottom: 1px solid #ECEEF0; }
.pdp-service-card { border: 1px solid #ECEEF0; border-radius: 8px; padding: 24px; background: #FFFFFF; display: flex; flex-direction: column; }
.pdp-service-card__icon { width: 32px; height: 32px; display: block; margin-bottom: 12px; }
.pdp-service-card__title { margin: 0 0 12px; font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; }
.pdp-service-card__list { margin: 0 0 16px; padding-left: 16px; display: flex; flex-direction: column; gap: 6px; font-size: 12px; line-height: 20px; color: #707070; flex: 1; }
.pdp-service-card__link { font-size: 13px; line-height: 20px; font-weight: 400; color: #19191A; text-decoration: none; align-self: flex-start; }
.pdp-service-card__link:hover { text-decoration: underline; }
.pdp-section-bar { display: flex; align-items: center; justify-content: space-between; padding-bottom: 12px; border-bottom: 1px solid #ECEEF0; margin-bottom: 24px; }
.pdp-section-bar__title { margin: 0; font-size: 18px; line-height: 26px; font-weight: 600; color: #19191A; text-align: left; }
.pdp-section-bar__cta { font-size: 13px; line-height: 20px; color: #0060BF; text-decoration: none; }
.pdp-section-bar__cta:hover { text-decoration: underline; }
.pdp-promo-bar { position: relative; border-radius: 8px; overflow: hidden; margin-bottom: 32px; min-height: 128px; display: flex; align-items: center; background: #F4F5F7; }
.pdp-promo-bar__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: left center; }
.pdp-promo-bar__content { position: relative; z-index: 2; padding: 24px 36px 24px 320px; max-width: 820px; color: #19191A; }
.pdp-promo-bar__title { margin: 0 0 6px; font-size: 18px; line-height: 26px; font-weight: 600; color: #19191A; }
.pdp-promo-bar__desc { margin: 0 0 10px; font-size: 13px; line-height: 20px; color: #4B4B4D; }
.pdp-promo-bar__link { color: #0060BF; font-size: 13px; line-height: 20px; font-weight: 400; text-decoration: none; display: inline-block; }
.pdp-promo-bar__link:hover { text-decoration: underline; }
.pdp-intro-title { margin: 0 0 12px; font-size: 18px; line-height: 26px; font-weight: 600; color: #19191A; }
.pdp-intro-p { margin: 0 0 10px; font-size: 13px; line-height: 22px; color: #707070; }
.pdp-spec-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin: 16px 0 32px; font-size: 13px; line-height: 20px; }
.pdp-spec-table th, .pdp-spec-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #F2F2F2; overflow-wrap: anywhere; }
.pdp-spec-table tr:nth-child(odd) { background: #F5F7FA; }
.pdp-spec-table th { width: 18%; font-weight: 600; color: #19191A; }
.pdp-spec-table td { width: 32%; color: #4B4B4D; }
.pdp-subhead { margin: 0 0 16px; font-size: 16px; line-height: 24px; font-weight: 600; color: #19191A; }
.pdp-spotlight-col { background: #FFFFFF; padding: 8px 16px 8px 0; }
.pdp-spotlight-col__title { margin: 0 0 10px; font-size: 14px; line-height: 22px; font-weight: 600; color: #19191A; }
.pdp-spotlight-col__list { margin: 0; padding-left: 16px; display: flex; flex-direction: column; gap: 6px; font-size: 12px; line-height: 20px; color: #707070; }
.pdp-conn-diagram { margin-top: 20px; background: #FFFFFF; border-radius: 8px; padding: 16px 0; text-align: center; }
.pdp-conn-diagram__img { width: 100%; height: auto; display: block; border-radius: 4px; }
.pdp-conn-combo { margin-top: 10px; text-align: right; font-size: 12px; color: #707070; }
.pdp-feature-block { margin-bottom: 44px; padding-bottom: 36px; border-bottom: 1px solid #F2F2F2; text-align: center; }
.pdp-feature-block:last-of-type { margin-bottom: 32px; border-bottom: 0; }
.pdp-feature-block__title { margin: 0 0 10px; font-size: 20px; line-height: 28px; font-weight: 600; color: #19191A; }
.pdp-feature-block__desc { margin: 0 auto 24px; max-width: 960px; font-size: 13px; line-height: 22px; color: #707070; }
.pdp-metrics-row { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; margin-top: 20px; max-width: 960px; margin-left: auto; margin-right: auto; }
.pdp-metric { display: flex; flex-direction: column; align-items: center; background: #FAFBFB; border-radius: 6px; padding: 18px 16px; }
.pdp-metric__val { font-size: 18px; line-height: 26px; font-weight: 600; color: #19191A; }
.pdp-metric__lbl { font-size: 12px; line-height: 18px; color: #707070; margin-top: 4px; }
.pdp-feature-block__media { width: 100%; max-width: 960px; margin: 0 auto; box-sizing: border-box; border-radius: 8px; overflow: hidden; }
.pdp-feature-block__img { width: 100%; height: auto; display: block; }
.pdp-comp-table { width: 100%; table-layout: fixed; border-collapse: collapse; margin-top: 16px; font-size: 13px; line-height: 20px; }
.pdp-comp-table th, .pdp-comp-table td { padding: 12px 16px; text-align: center; border-bottom: 1px solid #F2F2F2; overflow-wrap: anywhere; }
.pdp-comp-table tbody tr:nth-child(odd) { background: #FAFBFB; }
.pdp-comp-spec { text-align: left; font-weight: 600; color: #19191A; width: 22%; }
.pdp-comp-th { vertical-align: bottom; background: #FFFFFF; }
.pdp-comp-img { width: 110px; height: 70px; object-fit: contain; display: block; margin: 0 auto 8px; }
.pdp-comp-name { font-size: 14px; font-weight: 600; color: #19191A; background: #F5F7FA; padding: 6px 12px; border-radius: 4px; }
.pdp-video-card { border: 1px solid #F2F2F2; border-radius: 8px; overflow: hidden; background: #FFFFFF; display: flex; flex-direction: column; }
.pdp-video-card__media { position: relative; width: 100%; aspect-ratio: 16 / 9; background: #19191A; overflow: hidden; }
.pdp-video-card__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pdp-video-card__btn { position: absolute; right: 10px; bottom: 10px; background: rgba(25, 25, 26, 0.72); border-radius: 999px; }
.pdp-video-card__body { padding: 14px 16px; }
.pdp-video-card__title { margin: 0; font-size: 13px; line-height: 20px; font-weight: 600; color: #19191A; }
.pdp-qa-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.pdp-qa-tag { appearance: none; border: 1px solid #E5E5E5; background: #FAFBFB; color: #4B4B4D; border-radius: 999px; height: 28px; padding: 0 12px; font-family: inherit; font-size: 12px; line-height: 20px; cursor: pointer; }
.pdp-qa-tag.is-active { background: #E5E5E5; border-color: #19191A; color: #19191A; font-weight: 600; }
.pdp-qa-stack { display: flex; flex-direction: column; gap: 16px; }
.pdp-reviews-summary { margin-bottom: 24px; }
.pdp-reviews-list { border-top: 1px solid #F2F2F2; }
.pdp-review-row { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 24px; padding: 20px 0; border-bottom: 1px solid #F2F2F2; }
.pdp-review-left { display: flex; align-items: flex-start; gap: 12px; }
.pdp-review-avatar { width: 36px; height: 36px; border-radius: 50%; background: #F2F2F2; color: #4B4B4D; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.pdp-review-author { font-size: 13px; line-height: 20px; font-weight: 600; color: #19191A; }
.pdp-review-meta { font-size: 12px; line-height: 18px; color: #707070; }
.pdp-review-verified { font-size: 12px; line-height: 18px; color: #10A300; margin-top: 4px; }
.pdp-review-stars { display: flex; align-items: center; gap: 3px; margin-bottom: 6px; }
.pdp-review-star { width: 14px; height: 14px; display: block; }
.pdp-review-score { font-size: 12px; color: #707070; margin-left: 6px; }
.pdp-review-variant { font-size: 12px; line-height: 18px; color: #707070; margin-bottom: 8px; }
.pdp-review-text { margin: 0 0 10px; font-size: 13px; line-height: 20px; color: #19191A; }
.pdp-review-actions { font-size: 12px; line-height: 18px; color: #707070; }
.pdp-res-tabs { margin-bottom: 20px; }
.pdp-capsule-tabs-center { display: flex; justify-content: center; margin-bottom: 20px; }
.pdp-res-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.pdp-res-grid[hidden] { display: none; }
.pdp-doc-card { display: flex; align-items: flex-start; gap: 10px; padding: 16px; border-radius: 8px; background: #FAFBFB; border: 1px solid #F2F2F2; text-decoration: none; color: #19191A; transition: border-color 0.15s ease; }
.pdp-doc-card:hover { border-color: #19191A; }
.pdp-doc-card__icon { font-size: 16px; line-height: 20px; flex-shrink: 0; }
.pdp-doc-card__title { font-size: 13px; line-height: 20px; color: #19191A; }
.pdp-doc-new { color: #10A300; font-size: 11px; font-weight: 600; margin-left: 4px; }
.pdp-sticky-bottom { position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; background: #FFFFFF; border-top: 1px solid #ECEEF0; box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06); transform: translateY(100%); pointer-events: none; transition: transform 0.2s ease; }
.pdp-sticky-bottom.is-visible { transform: translateY(0); pointer-events: auto; }
.pdp-qa-item { scroll-margin-bottom: 100px; scroll-margin-top: 80px; }
.pdp-sticky-bottom__inner { max-width: 1200px; margin: 0 auto; height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.pdp-sticky-bottom__prod { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; overflow: hidden; }
.pdp-sticky-bottom__info { min-width: 0; flex: 1; }
.pdp-sticky-bottom__img { width: 44px; height: 44px; object-fit: contain; flex-shrink: 0; }
.pdp-sticky-bottom__title { font-size: 13px; line-height: 18px; font-weight: 600; color: #19191A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 680px; }
.pdp-sticky-bottom__variant { font-size: 12px; line-height: 18px; color: #707070; }
.pdp-sticky-bottom__buy { display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
.pdp-sticky-bottom__price { text-align: right; }
.pdp-sticky-bottom__price-num { font-size: 16px; line-height: 22px; font-weight: 600; color: #19191A; }
.pdp-sticky-bottom__stock { font-size: 12px; line-height: 16px; color: #707070; }
.pdp-toast { position: fixed; right: 24px; bottom: 88px; z-index: 60; background: #19191A; color: #FFFFFF; padding: 10px 16px; border-radius: 6px; font-size: 13px; opacity: 0; pointer-events: none; transition: opacity 0.2s ease; }
.pdp-toast.is-show { opacity: 1; }
`;

const pageSource = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S5810-48TS-P, 48-Port Gigabit Ethernet L3 PoE+ Switch - FS</title>
  <style>${pageCss}</style>
</head>
<body>
  ${H.compTag('library-navigation', 'header', {})}

  <main>
    <section id="pdp-buybox" class="page-section pdp-top-section">
      <div class="container">
        <div class="pdp-breadcrumb-wrap">
          ${H.compTag('library-breadcrumb', 'default', { items: breadcrumbItemsHtml })}
        </div>

        <div class="pdp-hero-grid">
          <div class="pdp-gallery">
            <div class="pdp-main-stage">
              <img id="pdp-main-img" class="pdp-main-img" src="${H.esc(localAsset(DATA.gallery[1].full))}" alt="${H.esc(DATA.title)}">
            </div>
            <p class="pdp-stage-hint">Click thumbnail to switch view</p>
            <div class="pdp-thumbs-row" role="group" aria-label="Product thumbnails">
              ${galleryThumbsHtml}
            </div>
          </div>

          <div class="pdp-buybox">
            <h1 class="pdp-buybox__title">${H.esc(DATA.title)}<span class="pdp-hot-pill">Hot</span></h1>
            <div class="pdp-buybox__meta">
              <span>P/N: <strong id="pdp-pn">${H.esc(DATA.partNumber)}</strong></span>
              <span>SKU: <strong id="pdp-sku">${H.esc(DATA.sku)}</strong></span>
            </div>

            <div class="pdp-price-bar">
              <div id="pdp-price" class="pdp-price-val">${H.esc(DATA.price)}</div>
              <div class="pdp-price-stats">
                <span><strong class="pdp-stat-sold">283</strong> Sold</span>
                <span class="pdp-stat-sep" aria-hidden="true"></span>
                <a class="pdp-stat-rev" href="#reviews">5 Reviews</a>
                <span class="pdp-stat-sep" aria-hidden="true"></span>
                <a class="pdp-stat-rev" href="#qa">31 Questions</a>
              </div>
            </div>

            <div class="pdp-variants-row">
              <div class="pdp-variants-label">Products:</div>
              <div class="pdp-variants-list" role="group" aria-label="Switch model variants">
                ${variantPillsHtml}
              </div>
            </div>

            <div class="pdp-stock-box">
              <div id="pdp-stock-main">310 in Global Warehouse, Get it Nov 26, 2026</div>
              <div class="pdp-stock-line--muted">250 Back in Stock, Expected to ship Jan 18, 2027</div>
              <div class="pdp-stock-line--muted">Delivery to <strong>New York, 10010</strong> &middot; Free Shipping via FedEx International Priority</div>
              <div class="pdp-trust-row">
                <span>&#10003; 5-Year Warranty</span>
                <span class="pdp-stat-sep" aria-hidden="true"></span>
                <span>30-Day Returns</span>
                <span class="pdp-stat-sep" aria-hidden="true"></span>
                <span>30-Day Exchange</span>
              </div>
            </div>

            <div class="pdp-cta-row">
              ${H.compTag('library-input-number', 'outline-lg', {
                value: 1,
                min: 1,
                max: 999,
                name: 'pdp-qty',
                accessibleLabel: 'Quantity',
              })}
              ${H.compTag('library-button', 'filled-red', {
                label: 'Add to Cart',
                size: 'xl-regular',
                actionCallback: 'onPdpAddToCart',
              })}
            </div>

            <div class="pdp-highlights">
              <h2 class="pdp-highlights__title">Product Highlights</h2>
              <ul class="pdp-highlights__list">
                ${DATA.highlights.map((h) => `<li>${H.esc(h)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="pdp-anchor-sticky">
      ${H.compTag('library-anchor-nav', 'anchor-nav', {
        tabs: anchorTabsHtml,
        actionLabel: 'Add to Cart',
        actionCallback: 'onPdpAddToCart',
      })}
    </div>

    <section id="pdp-services" class="page-section">
      <div class="container">
        <div class="grid grid--3">
          ${servicesHtml}
        </div>
      </div>
    </section>

    <section id="specifications" class="page-section">
      <div class="container">
        <div class="pdp-promo-bar">
          <img class="pdp-promo-bar__bg" src="${H.esc(localAsset('https://resource.fs.com/mall/generalImg/20260328113520yohv08.jpg'))}" alt="AmpCon-Campus Management Platform">
          <div class="pdp-promo-bar__content">
            <h2 class="pdp-promo-bar__title">AmpCon-Campus Management Platform</h2>
            <p class="pdp-promo-bar__desc">Unify wired and wireless management with AmpCon-Campus to simplify operations and streamline scaling.</p>
            <a class="pdp-promo-bar__link" href="https://www.fs.com/specials/ampcon-campus-platform-193.html" target="_blank" rel="noopener">Learn more &rsaquo;</a>
          </div>
        </div>

        <h3 class="pdp-intro-title">48-Port Gigabit Ethernet L3 PoE+ Switch, 48 x PoE+ Ports @740W, with 4 x 10Gb SFP+ Uplinks, PicOS®, Support MLAG &amp; Perpetual PoE, Broadcom Chip</h3>
        <p class="pdp-intro-p">The S5810-48TS-P simplifies access layer deployment for enterprise, education, and healthcare networks with 48 x 10/100/1000BASE-T PoE+ ports, up to 30W per port, 740W PoE budget, and 4 x 1G/10G SFP+ uplinks. Perpetual PoE keeps connected devices powered during switch reboots for uninterrupted network services.</p>
        <p class="pdp-intro-p">Running on PicOS® with a perpetual license, it supports OpenFlow, MLAG, OSPF, BGP, IPv4/IPv6, PBR, PTP and STP without requiring additional licenses, and includes five years of hardware and software support.</p>

        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Specifications</h2>
        </div>

        <table class="pdp-spec-table" aria-label="Technical Specifications">
          <tbody>
            ${specTableRowsHtml}
          </tbody>
        </table>

        <h3 class="pdp-subhead">Software Spotlights</h3>
        <div class="grid grid--3">
          ${spotlightsHtml}
        </div>
      </div>
    </section>

    <section id="connectivity" class="page-section">
      <div class="container">
        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Connectivity Solutions</h2>
        </div>
        <div class="pdp-capsule-tabs-center">
          ${H.compTag('library-tab', 'capsule', { items: connTabsHtml })}
        </div>
        <div class="pdp-conn-diagram">
          <img class="pdp-conn-diagram__img" src="${H.esc(localAsset('https://resource.fs.com/mall/fs_scene_images/20260123120243nk7rd2.jpg.webp'))}" alt="Three-Tier Campus Network Architecture">
          <div class="pdp-conn-combo">Combo ID: C16936</div>
        </div>
      </div>
    </section>

    <section id="features" class="page-section">
      <div class="container">
        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Features</h2>
        </div>
        ${featuresHtml}

        <h3 class="pdp-subhead">Switch Comparison</h3>
        <table class="pdp-comp-table" aria-label="Switch Model Comparison">
          <thead>
            <tr>
              <th></th>
              ${compHeadHtml}
            </tr>
          </thead>
          <tbody>
            ${compRowsHtml}
          </tbody>
        </table>
      </div>
    </section>

    <section id="videos" class="page-section">
      <div class="container">
        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Videos</h2>
        </div>
        <div class="grid grid--4">
          ${videosHtml}
        </div>
      </div>
    </section>

    <section id="qa" class="page-section">
      <div class="container">
        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Questions &amp; Answers</h2>
          <a class="pdp-section-bar__cta" href="#qa">&#9998; Ask a Question</a>
        </div>
        <div class="pdp-qa-tags" role="group" aria-label="Q&A topic filters">
          ${qaTagsHtml}
        </div>
        <div class="pdp-qa-stack">
          ${qaThreadsHtml}
        </div>
      </div>
    </section>

    <section id="reviews" class="page-section">
      <div class="container">
        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Customer Reviews</h2>
          <a class="pdp-section-bar__cta" href="#reviews">&#9998; Write a Review</a>
        </div>
        <div class="pdp-reviews-summary">
          ${H.compTag('library-rate', 'summary', {
            counts: [2, 3, 0, 0, 0],
            filterCallback: 'onReviewStarFilter',
          })}
        </div>
        <div class="pdp-reviews-list">
          ${reviewsListHtml}
        </div>
      </div>
    </section>

    <section id="resources" class="page-section">
      <div class="container">
        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Resources</h2>
          <a class="pdp-section-bar__cta" href="https://www.fs.com/products_support/search.html?keyword=206801" target="_blank" rel="noopener">View more &rsaquo;</a>
        </div>
        <div id="pdp-res-tab-host" class="pdp-res-tabs pdp-capsule-tabs-center">
          ${H.compTag('library-tab', 'capsule', { items: resTabsHtml })}
        </div>
        ${resPanelsHtml}
      </div>
    </section>

    <section id="case-study" class="page-section">
      <div class="container">
        <div class="pdp-section-bar">
          <h2 class="pdp-section-bar__title">Case Study</h2>
        </div>
        <div class="grid grid--4">
          ${caseStudiesHtml}
        </div>
      </div>
    </section>

    <div id="pdp-sticky-bottom" class="pdp-sticky-bottom" aria-label="Quick purchase bar">
      <div class="pdp-sticky-bottom__inner">
        <div class="pdp-sticky-bottom__prod">
          <img id="pdp-sticky-img" class="pdp-sticky-bottom__img" src="${H.esc(localAsset(DATA.gallery[1].thumb))}" alt="S5810-48TS-P">
          <div class="pdp-sticky-bottom__info">
            <div class="pdp-sticky-bottom__title">${H.esc(DATA.title)}</div>
            <div id="pdp-sticky-variant" class="pdp-sticky-bottom__variant">S5810-48TS-P | 48x PoE+, 4x 10G SFP+</div>
          </div>
        </div>
        <div class="pdp-sticky-bottom__buy">
          <div class="pdp-sticky-bottom__price">
            <div id="pdp-sticky-price" class="pdp-sticky-bottom__price-num">${H.esc(DATA.price)}</div>
            <div class="pdp-sticky-bottom__stock">310 in Global Warehouse</div>
          </div>
          ${H.compTag('library-button', 'filled-red', {
            label: 'Add to Cart',
            size: 'l',
            actionCallback: 'onPdpAddToCart',
          })}
        </div>
      </div>
    </div>

    <div id="pdp-toast" class="pdp-toast" role="status" aria-live="polite"></div>
  </main>

  ${H.compTag('library-navigation', 'footer', {})}

  <script>
    (function () {
      // 0. Clean up qa-thread: hide placeholder answer-list, zero UA margins on h3/p, reset template counts (6/3 -> 0/0)
      document.querySelectorAll('.pdp-qa-item .ds-comment__answer-list').forEach(function (el) {
        el.style.display = 'none';
      });
      document.querySelectorAll('.pdp-qa-item [data-comment-count]').forEach(function (el) {
        el.textContent = '0';
      });
      document.querySelectorAll('.pdp-qa-item .ds-comment__title, .pdp-qa-item .ds-comment__meta, .pdp-qa-item .ds-comment__text').forEach(function (el) {
        el.style.margin = '0';
      });
      document.querySelectorAll('.pdp-qa-item .ds-comment__body').forEach(function (el) {
        el.style.gap = '6px';
      });
      document.querySelectorAll('.pdp-qa-item .ds-comment__answer .ds-comment__body').forEach(function (el) {
        el.style.width = 'auto';
      });
      document.querySelectorAll('.pdp-qa-item .ds-comment--qa-thread').forEach(function (el) {
        el.style.borderBottom = '1px solid #F2F2F2';
        el.style.paddingBottom = '20px';
      });
      var anchorAction = document.querySelector('.pdp-anchor-sticky .ds-anchor-nav__action');
      if (anchorAction) anchorAction.style.display = 'none';

      // 1. Gallery thumbnail switcher
      var mainImg = document.getElementById('pdp-main-img');
      var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-gallery-idx]'));
      thumbs.forEach(function (t) {
        t.addEventListener('click', function () {
          thumbs.forEach(function (x) { x.classList.remove('is-active'); });
          t.classList.add('is-active');
          if (mainImg) {
            mainImg.src = t.dataset.gallerySrc;
            mainImg.alt = t.dataset.galleryTitle;
          }
        });
      });

      // 2. Model variant pills switcher (updates PN, SKU, Price, Stock, Sticky Bar)
      var pnEl = document.getElementById('pdp-pn');
      var skuEl = document.getElementById('pdp-sku');
      var priceEl = document.getElementById('pdp-price');
      var stockEl = document.getElementById('pdp-stock-main');
      var stickyVarEl = document.getElementById('pdp-sticky-variant');
      var stickyPriceEl = document.getElementById('pdp-sticky-price');
      var stickyImgEl = document.getElementById('pdp-sticky-img');
      var variantBtns = Array.prototype.slice.call(document.querySelectorAll('[data-variant-idx]'));
      variantBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          variantBtns.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('is-active');
          btn.setAttribute('aria-pressed', 'true');
          if (pnEl) pnEl.textContent = btn.dataset.variantPn;
          if (skuEl) skuEl.textContent = btn.dataset.variantSku;
          if (priceEl) priceEl.textContent = btn.dataset.variantPrice;
          if (stockEl) stockEl.textContent = btn.dataset.variantStock;
          if (stickyVarEl) stickyVarEl.textContent = btn.dataset.variantLabel;
          if (stickyPriceEl) stickyPriceEl.textContent = btn.dataset.variantPrice;
          if (mainImg && btn.dataset.variantImg) mainImg.src = btn.dataset.variantImg;
          if (stickyImgEl && btn.dataset.variantImg) stickyImgEl.src = btn.dataset.variantImg;
        });
      });

      // 3. Sticky Anchor Nav smooth scroll + scrollspy + sticky bottom buy bar
      var anchorTargetIds = ${JSON.stringify(anchorTabs.map((t) => t.id))};
      var anchorTabs = Array.prototype.slice.call(document.querySelectorAll('.pdp-anchor-sticky [data-anchor-tab]'));
      anchorTabs.forEach(function (tab, idx) {
        tab.addEventListener('click', function () {
          var target = document.getElementById(anchorTargetIds[idx]);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });

      var stickyBottom = document.getElementById('pdp-sticky-bottom');
      var qaSection = document.getElementById('qa');
      window.addEventListener('scroll', function () {
        if (stickyBottom) {
          var inQa = false;
          if (qaSection) {
            var qr = qaSection.getBoundingClientRect();
            inQa = qr.top < window.innerHeight && qr.bottom > 0;
          }
          stickyBottom.classList.toggle('is-visible', window.scrollY > 680 && !inQa);
        }
        var activeIdx = 0;
        for (var i = 0; i < anchorTargetIds.length; i++) {
          var sec = document.getElementById(anchorTargetIds[i]);
          if (sec && sec.getBoundingClientRect().top <= 120) activeIdx = i;
        }
        anchorTabs.forEach(function (t, ti) {
          t.classList.toggle('ds-anchor-nav__tab--active', ti === activeIdx);
        });
      }, { passive: true });

      // 4. Q&A topic tag filter
      var qaTags = Array.prototype.slice.call(document.querySelectorAll('[data-qa-tag]'));
      var qaItems = Array.prototype.slice.call(document.querySelectorAll('[data-qa-category]'));
      qaTags.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var key = btn.dataset.qaTag;
          qaTags.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
          qaItems.forEach(function (item) {
            item.style.display = (key === 'All' || item.dataset.qaCategory === key) ? '' : 'none';
          });
        });
      });

      // 5. Reviews star-rating bar filter (wire library-rate/summary distribution rows to .pdp-review-row)
      var reviewRows = Array.prototype.slice.call(document.querySelectorAll('.pdp-review-row'));
      var rateRows = Array.prototype.slice.call(document.querySelectorAll('#reviews .ds-rate__distribution-row'));
      var activeStarFilter = null;
      rateRows.forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (btn.disabled) return;
          var starVal = btn.value;
          activeStarFilter = activeStarFilter === starVal ? null : starVal;
          reviewRows.forEach(function (row) {
            row.style.display = (!activeStarFilter || row.dataset.reviewStars === activeStarFilter) ? '' : 'none';
          });
        });
      });

      // 6. Resources tab switcher
      var resTabs = Array.prototype.slice.call(document.querySelectorAll('#pdp-res-tab-host .ds-tab__item'));
      var resPanels = Array.prototype.slice.call(document.querySelectorAll('[data-res-panel]'));
      resTabs.forEach(function (tab, idx) {
        tab.addEventListener('click', function () {
          resPanels.forEach(function (p, pi) { p.hidden = pi !== idx; });
        });
      });

      // 6. Add to Cart toast feedback
      var toast = document.getElementById('pdp-toast');
      var toastTimer = null;
      document.querySelectorAll('[data-library-event-actioncallback="onPdpAddToCart"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var qtyInput = document.querySelector('input[name="pdp-qty"]');
          var qty = qtyInput ? qtyInput.value : '1';
          var pn = pnEl ? pnEl.textContent : 'S5810-48TS-P';
          if (toast) {
            toast.textContent = 'Added ' + qty + ' × ' + pn + ' to cart';
            toast.classList.add('is-show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () { toast.classList.remove('is-show'); }, 2000);
          }
        });
      });
    })();
  </script>
</body>
</html>
`;

const outRel = 'pages/fs-pdp-s5810-pc.html';
H.assembleLocalPage(pageSource, outRel, { write: true });
console.log('Generated:', outRel, 'release:', RELEASE.slice(0, 12));
