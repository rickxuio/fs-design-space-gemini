#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const H = require('../page-helpers.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT_FILE = path.join(ROOT, 'pages', 'ui-network-storage-pc.html');

const TABS = [
  {
    id: 'dashboard',
    label: 'Intuitive Dashboard',
    title: 'Unified Storage Pool & Throughput Visibility',
    desc: 'Monitor RAID health, SSD cache read/write status, port telemetry, and live network throughput from a single clean management console.',
    metrics: [
      { label: 'Storage Pools', value: 'RAID 5 / 6 / 10' },
      { label: 'SSD Cache Mode', value: 'Read-Write (NVMe)' },
      { label: 'Live Telemetry', value: '1H / 1D / 1W' }
    ]
  },
  {
    id: 'backups',
    label: 'Protected Cloud Backups',
    title: 'Automated Off-Site & Hybrid Cloud Replication',
    desc: 'Schedule encrypted incremental backups to secondary NAS nodes or major S3-compatible cloud targets without recurring per-seat licensing fees.',
    metrics: [
      { label: 'Encryption', value: 'AES-256 End-to-End' },
      { label: 'Backup Targets', value: 'NAS / S3 / Off-Site' },
      { label: 'Licensing', value: 'Zero Subscription' }
    ]
  },
  {
    id: 'health',
    label: 'All-New Health Monitoring',
    title: 'Proactive S.M.A.R.T. Diagnostics & Thermal Control',
    desc: 'Track per-drive S.M.A.R.T. endurance, CPU temperature, and acoustic fan profiles (Quiet / Balanced / Cooling) with instant failover alerts.',
    metrics: [
      { label: 'Drive Diagnostics', value: 'S.M.A.R.T. Real-Time' },
      { label: 'Fan Profiles', value: 'Quiet / Balanced / Cool' },
      { label: 'Failover', value: 'Hot-Spare Rebuild' }
    ]
  },
  {
    id: 'logs',
    label: 'Enhanced System Logs',
    title: 'Auditable Access & Activity Event Trails',
    desc: 'Filter user logins, SMB/NFS share access, permission updates, and hardware state changes with exportable audit logs for enterprise compliance.',
    metrics: [
      { label: 'Protocols', value: 'SMB / NFS / Time Machine' },
      { label: 'Audit Trails', value: 'Per-User & Per-Share' },
      { label: 'Export', value: 'CSV / Syslog' }
    ]
  },
  {
    id: 'snapshots',
    label: 'Snapshot Capabilities',
    title: 'Instant Point-in-Time Recovery Against Ransomware',
    desc: 'Capture immutable, space-efficient filesystem snapshots on custom schedules and restore accidentally deleted or encrypted files in seconds.',
    metrics: [
      { label: 'Recovery Point', value: 'Minute-Level RPO' },
      { label: 'Protection', value: 'Immutable Snapshots' },
      { label: 'Restore Speed', value: 'Instant Rollback' }
    ]
  }
];

const MODELS = [
  {
    id: 'enterprise-nas',
    name: 'Enterprise NAS',
    badge: 'New',
    desc: '25G networking, 16 drive bays, and enterprise reliability',
    img: 'assets/ui-network-storage/img-20-14e886fb.jpg',
    defaultSelected: true,
    specs: {
      dimensions: '481.4 × 480 × 132 mm (19 × 18.9 × 5.2")',
      capacity: '(16) 2.5"/3.5" drive bays, (2) M.2 NVMe bays',
      protection: 'MC-LAG Support, Drive Hot-Swap, Touchscreen display',
      network: '(2) 25G SFP28, (1) 10GbE RJ45, (2) SFF-8644 (24G)',
      powerMethod: '(2) AC input, Hot-swappable power modules',
      powerRedundancy: '(2) Hot-swappable AC/DC 550W power modules',
      formFactor: '3U rack-mountable'
    }
  },
  {
    id: 'unas-pro-8',
    name: 'UNAS Pro 8',
    badge: '',
    desc: '10G networking for high availability deployments',
    img: 'assets/ui-network-storage/img-21-74a7608e.jpg',
    defaultSelected: true,
    specs: {
      dimensions: '442.4 × 480 × 87.4 mm (17.4 × 18.9 × 3.4")',
      capacity: '(8) 2.5"/3.5" HDD support, (2) M.2 NVMe SSD support',
      protection: 'Drive Hot-Swap, RAID 5/6/10, Touchscreen display',
      network: '(2) 10G SFP+ (10G Only), (1) 10GbE RJ45',
      powerMethod: '(2) AC input, Hot-swappable power modules',
      powerRedundancy: '(2) Hot-swap PSUs for power redundancy',
      formFactor: '2U rack-mountable'
    }
  },
  {
    id: 'unas-pro',
    name: 'UNAS Pro',
    badge: '',
    desc: '10G networking for large-scale file storage and sharing',
    img: 'assets/ui-network-storage/img-22-11b5ec31.jpg',
    defaultSelected: true,
    specs: {
      dimensions: '442 × 325 × 87 mm (17.4 × 12.8 × 3.4")',
      capacity: '(7) 2.5"/3.5" HDD support',
      protection: 'Drive Hot-Swap, RAID 5/6/10, Touchscreen display',
      network: '(1) 10G SFP+, (1) 1GbE RJ45',
      powerMethod: '(1) Universal AC input, (1) RPS DC input',
      powerRedundancy: 'Redundant Power Backup ready',
      formFactor: '2U rack-mountable'
    }
  },
  {
    id: 'unas-pro-4',
    name: 'UNAS Pro 4',
    badge: '',
    desc: '10G networking for compact rack file storage and sharing',
    img: 'assets/ui-network-storage/img-23-b98cb2c5.jpg',
    defaultSelected: false,
    specs: {
      dimensions: '442 × 285 × 43.7 mm (17.4 × 11.2 × 1.7")',
      capacity: '(4) 2.5"/3.5" HDD support',
      protection: 'Drive Hot-Swap, RAID 5/10, Touchscreen display',
      network: '(1) 10G SFP+, (1) 2.5GbE RJ45',
      powerMethod: '(1) Universal AC input',
      powerRedundancy: 'External UPS / RPS compatible',
      formFactor: '1U rack-mountable'
    }
  },
  {
    id: 'unas-4',
    name: 'UNAS 4',
    badge: '',
    desc: 'Reimagined desktop NAS for multi-client performance',
    img: 'assets/ui-network-storage/img-24-59c36d18.jpg',
    defaultSelected: false,
    specs: {
      dimensions: '185 × 238 × 192 mm (7.3 × 9.4 × 7.6")',
      capacity: '(4) 2.5"/3.5" HDD bays, (2) M.2 NVMe cache slots',
      protection: 'Tool-less Hot-Swap, RAID 1/5/6/10',
      network: '(1) 2.5GbE RJ45, (1) USB-C 10Gbps',
      powerMethod: 'External AC/DC adapter',
      powerRedundancy: 'External UPS compatible',
      formFactor: 'Desktop compact enclosure'
    }
  },
  {
    id: 'unas-2',
    name: 'UNAS 2',
    badge: '',
    desc: 'Reimagined desktop NAS in a compact footprint',
    img: 'assets/ui-network-storage/img-25-7c9142bc.jpg',
    defaultSelected: false,
    specs: {
      dimensions: '124 × 215 × 178 mm (4.9 × 8.5 × 7.0")',
      capacity: '(2) 2.5"/3.5" HDD bays',
      protection: 'RAID 1 Mirroring, Automated Snapshots',
      network: '(1) 2.5GbE RJ45 (PoE++ Powered)',
      powerMethod: 'PoE++ Single-Cable or USB-C PD',
      powerRedundancy: 'PoE Switch UPS backed',
      formFactor: 'Ultra-compact desktop'
    }
  }
];

const CAPABILITIES = [
  {
    title: 'Up to 25G SFP+ Connectivity',
    desc: 'Elevate your data experience with unparalleled speed and efficiency, designed for demanding workflows and next-gen connectivity.',
    icon: 'assets/ui-network-storage/icon-25g-sfp.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: '*Selected models'
  },
  {
    title: 'Power Redundancy',
    desc: 'Keep your data safe and accessible. UNAS Pro pairs with UniFi Power Backup for uninterrupted performance.',
    icon: 'assets/ui-network-storage/icon-power-redundancy.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: ''
  },
  {
    title: 'Data Protection',
    desc: 'RAID redundancy, snapshots, and remote backups to another NAS or cloud storage make it easy to implement an enterprise 3-2-1 backup strategy while encryption secures data-at-rest.',
    icon: 'assets/ui-network-storage/icon-data-protection.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: ''
  },
  {
    title: 'Easy Setup & Management',
    desc: 'Seamlessly integrated within UniFi, with private local storage.',
    icon: 'assets/ui-network-storage/icon-easy-setup.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: ''
  },
  {
    title: 'PoE-Powered Single-Cable Setup',
    desc: 'A reimagined desktop NAS that combines elegant industrial design with functional innovation, delivering a streamlined PoE-powered single-cable setup.',
    icon: 'assets/ui-network-storage/icon-poe-setup.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: '*Selected models'
  },
  {
    title: 'Customized Multi-Bay Storage',
    desc: 'Space-saving design with effortless drive access.',
    icon: 'assets/ui-network-storage/icon-multibay.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: '*Selected models'
  },
  {
    title: 'USB-C External Drive Support',
    desc: 'Front-facing USB-C port delivers quick, streamlined external drive support.',
    icon: 'assets/ui-network-storage/icon-usbc.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: '*Selected models'
  },
  {
    title: 'Ultra-Fast File Handling',
    desc: 'Accelerate workflows with M.2 NVMe SSD caching.',
    icon: 'assets/ui-network-storage/icon-fast-file.svg',
    bgImg: 'assets/ui-network-storage/hero-rack-bg.jpg',
    note: '*Selected models'
  }
];

const ESSENTIALS = [
  {
    id: 'hdd',
    tag: 'Installation Add-on',
    name: 'Enterprise 3.5" HDD, 8, 16 & 24 TB',
    desc: 'Enterprise-grade 3.5" SATA hard drive ideal for storage-intensive camera security and high-availability NAS arrays.',
    dimensions: '147 × 101.9 × 26.1 mm (5.75 × 4 × 1")',
    thumb: 'assets/ui-network-storage/img-26-e9551608.jpg',
    heroImg: 'assets/ui-network-storage/hdd-lifestyle.jpg'
  },
  {
    id: 'mini-rack',
    tag: 'Rack Enclosure',
    name: 'Toolless Mini Rack',
    desc: '6U compact rolling rack with tool-less assembly designed for branch offices, studio suites, and compact NAS deployments.',
    dimensions: '518 × 468 × 378 mm (20.4 × 18.4 × 14.9")',
    thumb: 'assets/ui-network-storage/img-27-cf9efc55.jpg',
    heroImg: 'assets/ui-network-storage/img-27-cf9efc55.jpg'
  },
  {
    id: 'lte-backup',
    tag: 'Failover Connectivity',
    name: 'LTE Backup Pro',
    desc: 'Automatic cellular WAN failover unit that maintains remote cloud backup synchronization and alerting during ISP outages.',
    dimensions: '204.5 × 90 × 31.5 mm (8.1 × 3.5 × 1.2")',
    thumb: 'assets/ui-network-storage/img-28-d34dd4d5.jpg',
    heroImg: 'assets/ui-network-storage/img-28-d34dd4d5.jpg'
  },
  {
    id: '42u-rack',
    tag: 'Data Center Rack',
    name: '42U Rack Cabinet',
    desc: 'Full-height enterprise server cabinet engineered for high-density 3U Enterprise NAS clusters and structured fiber cabling.',
    dimensions: '600 × 1070 × 2050 mm (23.6 × 42.1 × 80.7")',
    thumb: 'assets/ui-network-storage/img-29-177e4a2c.jpg',
    heroImg: 'assets/ui-network-storage/img-29-177e4a2c.jpg'
  },
  {
    id: 'power-backup',
    tag: 'Power Redundancy',
    name: 'Power Backup (RPS)',
    desc: 'Redundant DC power supply system providing instant failover power protection for rackmount NAS and core switches.',
    dimensions: '442.4 × 325.6 × 43.7 mm (17.4 × 12.8 × 1.7")',
    thumb: 'assets/ui-network-storage/img-30-5a633226.jpg',
    heroImg: 'assets/ui-network-storage/img-30-5a633226.jpg'
  },
  {
    id: 'pdu-pro',
    tag: 'Power Management',
    name: 'Power Distribution Pro',
    desc: '2U rackmount smart PDU with 16 individually monitored AC outlets and automated power-cycle recovery.',
    dimensions: '442.4 × 268.6 × 87.4 mm (17.4 × 10.6 × 3.4")',
    thumb: 'assets/ui-network-storage/img-31-612fed1b.jpg',
    heroImg: 'assets/ui-network-storage/img-31-612fed1b.jpg'
  },
  {
    id: 'ocd-panels',
    tag: 'Airflow Accessory',
    name: 'Rack Mount OCD Panels',
    desc: 'Precision-matched vented and brush blanking panels for clean front-to-back airflow and dust-free rack organization.',
    dimensions: '442.4 × 43.7 × 12 mm (17.4 × 1.7 × 0.5")',
    thumb: 'assets/ui-network-storage/img-32-369670e1.jpg',
    heroImg: 'assets/ui-network-storage/img-32-369670e1.jpg'
  },
  {
    id: 'patch-panel',
    tag: 'Structured Cabling',
    name: '24-Port Blank Keystone Patch Panel',
    desc: '1U modular keystone patch panel for neat 10GbE copper and fiber LC terminations above rackmount storage arrays.',
    dimensions: '442.4 × 43.7 × 64 mm (17.4 × 1.7 × 2.5")',
    thumb: 'assets/ui-network-storage/img-33-20b450e0.jpg',
    heroImg: 'assets/ui-network-storage/img-33-20b450e0.jpg'
  },
  {
    id: 'pdu-hd',
    tag: 'High-Density Power',
    name: 'Power Distribution Hi-Density',
    desc: 'Vertical 0U high-density metered power distribution bar built for 42U cabinets running multiple Enterprise NAS chassis.',
    dimensions: '1720 × 56 × 52 mm (67.7 × 2.2 × 2.0")',
    thumb: 'assets/ui-network-storage/img-34-5ac31a32.jpg',
    heroImg: 'assets/ui-network-storage/img-34-5ac31a32.jpg'
  }
];

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPage() {
  const customCss = `
    ${H.basePageCss()}
    .hero-surface__scrim { background: rgba(0, 0, 0, 0.50); }

    /* Section 2: Next-Gen Storage Simplified */
    .ns-tab-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }
    .ns-showcase-card {
      box-sizing: border-box;
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #E4E4E7;
      border-radius: 8px;
      overflow: hidden;
    }
    .ns-showcase-bar {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: 24px;
      align-items: center;
      padding: 24px 28px;
      background: #FAFBFB;
      border-bottom: 1px solid #F0F0F2;
    }
    .ns-showcase-title {
      margin: 0 0 6px;
      font-size: 18px;
      font-weight: 600;
      line-height: 26px;
      color: #19191A;
    }
    .ns-showcase-desc {
      margin: 0;
      font-size: 14px;
      line-height: 22px;
      color: #4B4B4D;
    }
    .ns-showcase-metrics {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .ns-metric-box {
      background: #FFFFFF;
      border: 1px solid #E4E4E7;
      border-radius: 6px;
      padding: 10px 12px;
    }
    .ns-metric-lbl {
      display: block;
      font-size: 11px;
      color: #71717A;
      margin-bottom: 2px;
    }
    .ns-metric-val {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #19191A;
    }
    .ns-showcase-media {
      background: #111114;
      padding: 16px 20px 0;
      display: flex;
      justify-content: center;
    }
    .ns-showcase-img {
      display: block;
      width: 100%;
      max-width: 1160px;
      height: auto;
      border-radius: 6px 6px 0 0;
    }

    /* Section 3: NAS Model Selector Carousel + Live Comparison Table (Gray #FAFBFB section -> borderless white cards) */
    .ns-model-carousel {
      position: relative;
      margin-bottom: 32px;
    }
    .ns-model-viewport {
      overflow: hidden;
      width: 100%;
    }
    .ns-model-track {
      display: flex;
      gap: 16px;
      transition: transform 0.28s ease;
    }
    .ns-model-card {
      flex: 0 0 227px;
      box-sizing: border-box;
      background: #FFFFFF;
      border-radius: 8px;
      padding: 18px 14px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      gap: 14px;
      transition: box-shadow 0.2s ease;
    }
    .ns-model-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    }
    .ns-model-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #E4E4E7;
      background: #FFFFFF;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.10);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 4;
      transition: opacity 0.15s, background 0.15s;
    }
    .ns-model-nav:hover {
      background: #F4F4F5;
    }
    .ns-model-nav--prev { left: 8px; }
    .ns-model-nav--next { right: 8px; }
    .ns-model-nav.is-hidden {
      opacity: 0;
      pointer-events: none;
    }
    .ns-model-nav-icon {
      width: 18px;
      height: 18px;
      display: block;
    }
    .ns-model-img {
      width: 100%;
      height: 104px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
    }
    .ns-model-photo {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }
    .ns-model-head {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
      margin-bottom: 6px;
    }
    .ns-model-name {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      line-height: 22px;
      color: #19191A;
    }
    .ns-model-desc {
      margin: 0;
      font-size: 12px;
      line-height: 18px;
      color: #646466;
    }
    .ns-model-action-spacer {
      height: 36px;
    }
    .ns-compare-toggle {
      min-width: 118px;
      height: 36px;
      padding: 0 14px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: 1px solid #D4D4D8;
      background: #FFFFFF;
      color: #19191A;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }
    .ns-compare-toggle:hover {
      border-color: #19191A;
      background: #FAFBFB;
    }
    .ns-compare-toggle.is-active {
      background: #19191A;
      color: #FFFFFF;
      border-color: #19191A;
    }
    .ns-compare-toggle.is-active:hover {
      background: #333336;
    }
    .ns-btn-icon {
      width: 14px;
      height: 14px;
      display: block;
      flex-shrink: 0;
    }
    .ns-btn-icon--invert {
      filter: brightness(0) invert(1);
    }
    .ns-spec-row-head {
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .ns-spec-icon {
      width: 18px;
      height: 18px;
      display: block;
      flex-shrink: 0;
      opacity: 0.78;
    }

    .ns-matrix-wrap {
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
    }
    .ns-matrix-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    .ns-matrix-table th,
    .ns-matrix-table td {
      padding: 16px 14px;
      text-align: center;
      vertical-align: middle;
      border-bottom: 1px solid #F0F0F2;
      font-size: 13px;
      line-height: 20px;
      color: #4B4B4D;
    }
    .ns-matrix-table tr:last-child td {
      border-bottom: 0;
    }
    .ns-matrix-table .ns-matrix-label {
      width: 196px;
      text-align: left;
      font-weight: 600;
      color: #19191A;
      background: #FAFBFB;
    }
    .ns-matrix-prod {
      position: relative;
      text-align: center;
      padding: 22px 14px 18px;
      vertical-align: top;
    }
    .ns-matrix-remove {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 0;
      background: #E4E4E7;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      transition: background 0.15s;
    }
    .ns-matrix-remove:hover {
      background: #D4D4D8;
    }
    .ns-matrix-remove-icon {
      width: 11px;
      height: 11px;
      display: block;
    }
    .ns-matrix-prod-img {
      height: 82px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
    }
    .ns-matrix-photo {
      max-width: 144px;
      max-height: 80px;
      object-fit: contain;
    }
    .ns-matrix-prod-name {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 600;
      color: #19191A;
    }
    .ns-matrix-prod-sub {
      margin: 0 0 8px;
      font-size: 12px;
      line-height: 18px;
      color: #71717A;
    }
    .ns-matrix-badge-slot {
      display: flex;
      justify-content: center;
      min-height: 20px;
    }
    .ns-matrix-empty {
      color: #71717A;
      font-size: 13px;
      font-weight: 400;
      vertical-align: middle;
    }
    .ns-matrix-cta-cell {
      text-align: center;
      padding-top: 18px;
      padding-bottom: 20px;
    }
    .ns-hidden-templates {
      display: none;
    }

    /* Section 4: 8 Capabilities Dynamic Bento Grid (White #FFFFFF section -> bordered cards) */
    .ns-cap-grid {
      display: grid;
      grid-template-columns: repeat(20, minmax(0, 1fr));
      gap: 20px;
    }
    .ns-cap-card {
      position: relative;
      box-sizing: border-box;
      min-height: 224px;
      background: #FFFFFF;
      border: 1px solid #E4E4E7;
      border-radius: 8px;
      padding: 24px 20px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .ns-cap-card:hover {
      border-color: #C4C4CA;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    }
    .ns-cap-card--span-8 { grid-column: span 8; }
    .ns-cap-card--span-4 { grid-column: span 4; }
    .ns-cap-card--span-5 { grid-column: span 5; }
    .ns-cap-card.is-expanded {
      background: #19191A;
      border-color: #19191A;
      color: #FFFFFF;
    }
    .ns-cap-bg {
      display: none;
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.34;
      pointer-events: none;
    }
    .ns-cap-card.is-expanded .ns-cap-bg {
      display: block;
    }
    .ns-cap-content {
      position: relative;
      z-index: 2;
    }
    .ns-cap-icon {
      width: 44px;
      height: 44px;
      display: block;
      margin-bottom: 14px;
    }
    .ns-cap-card.is-expanded .ns-cap-icon {
      display: none;
    }
    .ns-cap-title {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: #19191A;
    }
    .ns-cap-card.is-expanded .ns-cap-title {
      font-size: 18px;
      line-height: 26px;
      color: #FFFFFF;
      max-width: 280px;
    }
    .ns-cap-desc {
      display: none;
      margin: 0;
      font-size: 13px;
      line-height: 20px;
      color: rgba(255, 255, 255, 0.84);
      max-width: 300px;
    }
    .ns-cap-card.is-expanded .ns-cap-desc {
      display: block;
    }
    .ns-cap-foot {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .ns-cap-note {
      margin: 0;
      font-size: 11px;
      color: #71717A;
    }
    .ns-cap-card.is-expanded .ns-cap-note {
      color: rgba(255, 255, 255, 0.65);
    }
    .ns-cap-arrow {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid #DEE0E3;
      background: #FFFFFF;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      flex-shrink: 0;
      margin-left: auto;
      transition: background 0.15s, border-color 0.15s;
    }
    .ns-cap-arrow:hover {
      background: #F4F5F7;
      border-color: #B4B7BD;
    }
    .ns-cap-card.is-expanded .ns-cap-arrow {
      background: rgba(255, 255, 255, 0.16);
      border-color: rgba(255, 255, 255, 0.45);
    }
    .ns-cap-card.is-expanded .ns-cap-arrow:hover {
      background: rgba(255, 255, 255, 0.28);
      border-color: #FFFFFF;
    }
    .ns-cap-arrow-icon {
      width: 14px;
      height: 14px;
      display: block;
      opacity: 0.78;
    }
    .ns-cap-card.is-expanded .ns-cap-arrow-icon {
      filter: brightness(0) invert(1);
      opacity: 1;
    }

    /* Section 5: Installation Essentials (Gray #FAFBFB section -> borderless white cards) */
    .ns-ess-thumbs {
      display: grid;
      grid-template-columns: repeat(9, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 24px;
    }
    .ns-ess-thumb {
      height: 84px;
      background: #FFFFFF;
      border: 1.5px solid transparent;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .ns-ess-thumb:hover {
      border-color: #C4C4CA;
    }
    .ns-ess-thumb.is-active {
      border-color: #19191A;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }
    .ns-ess-thumb-img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }
    .ns-ess-detail {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
      background: #FFFFFF;
      border-radius: 8px;
      overflow: hidden;
      min-height: 380px;
    }
    .ns-ess-body {
      padding: 36px 36px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 16px;
    }
    .ns-ess-tag {
      display: inline-flex;
      align-self: flex-start;
      padding: 3px 10px;
      border-radius: 4px;
      background: #F4F4F5;
      color: #4B4B4D;
      font-size: 12px;
      font-weight: 600;
    }
    .ns-ess-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      line-height: 32px;
      color: #19191A;
    }
    .ns-ess-desc {
      margin: 0;
      font-size: 14px;
      line-height: 22px;
      color: #4B4B4D;
    }
    .ns-ess-spec {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: #FAFBFB;
      border: 1px solid #ECECEE;
      border-radius: 6px;
      font-size: 13px;
    }
    .ns-ess-spec-head {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding-right: 16px;
      border-right: 1px solid #E4E4E7;
      flex-shrink: 0;
    }
    .ns-ess-spec-k {
      font-weight: 600;
      color: #19191A;
      flex-shrink: 0;
    }
    .ns-ess-spec-v {
      color: #4B4B4D;
      text-align: left;
      line-height: 20px;
    }
    .ns-ess-media {
      background: #F4F4F5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .ns-ess-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .ns-ess-media.is-contain {
      background: #FFFFFF;
      padding: 32px;
      border-left: 1px solid #F0F0F2;
    }
    .ns-ess-hero-img--contain {
      max-width: 100%;
      max-height: 320px;
      width: auto;
      height: auto;
      object-fit: contain;
    }
  `;

  const modelCardsHtml = MODELS.map((m, idx) => `
    <article class="ns-model-card${m.defaultSelected ? ' is-selected' : ''}" data-model-card="${m.id}">
      <div>
        <div class="ns-model-img"><img class="ns-model-photo" src="${m.img}" alt="${esc(m.name)}"></div>
        <div class="ns-model-head">
          <h3 class="ns-model-name">${esc(m.name)}</h3>
        </div>
        <p class="ns-model-desc">${esc(m.desc)}</p>
      </div>
      ${idx === 0
        ? '<div class="ns-model-action-spacer" aria-hidden="true"></div>'
        : `<button type="button" class="ns-compare-toggle${m.defaultSelected ? ' is-active' : ''}" data-toggle-model="${m.id}">
        <img class="ns-btn-icon${m.defaultSelected ? ' ns-btn-icon--invert' : ''}" src="${m.defaultSelected ? 'assets/ui-network-storage/btn-close.svg' : 'assets/ui-network-storage/btn-plus.svg'}" alt="">
        <span>${m.defaultSelected ? 'Remove' : 'Compare'}</span>
      </button>`}
    </article>
  `).join('');

  const capCardsHtml = CAPABILITIES.map((c, idx) => {
    const isExp = idx === 0;
    const spanCls = idx < 4 ? (isExp ? 'ns-cap-card--span-8' : 'ns-cap-card--span-4') : 'ns-cap-card--span-5';
    return `
    <article class="ns-cap-card ${spanCls}${isExp ? ' is-expanded' : ''}" data-cap-idx="${idx}">
      <img class="ns-cap-bg" src="${c.bgImg}" alt="">
      <div class="ns-cap-content">
        <img class="ns-cap-icon" src="${c.icon}" alt="${esc(c.title)}">
        <h3 class="ns-cap-title">${esc(c.title)}</h3>
        <p class="ns-cap-desc">${esc(c.desc)}</p>
      </div>
      <div class="ns-cap-foot">
        ${c.note ? `<p class="ns-cap-note">${esc(c.note)}</p>` : '<span></span>'}
        <button type="button" class="ns-cap-arrow" data-cap-toggle="${idx}" aria-expanded="${isExp ? 'true' : 'false'}" aria-label="${esc(c.title)}">
          <img class="ns-cap-arrow-icon" src="${isExp ? 'assets/ui-network-storage/icon-chevron-left.svg' : 'assets/ui-network-storage/icon-chevron-right.svg'}" alt="">
        </button>
      </div>
    </article>
  `;
  }).join('');

  const essThumbsHtml = ESSENTIALS.map((item, idx) => `
    <button type="button" class="ns-ess-thumb${idx === 0 ? ' is-active' : ''}" data-ess-idx="${idx}" title="${esc(item.name)}" aria-label="${esc(item.name)}">
      <img class="ns-ess-thumb-img" src="${item.thumb}" alt="${esc(item.name)}">
    </button>
  `).join('');

  const firstTab = TABS[0];
  const firstEss = ESSENTIALS[0];

  const mainHtml = `
    <!-- Section 1: Hero Banner (Native library-banner/hero-responsive: 480px, center-aligned, title + CTA only) -->
    <section class="hero-surface" aria-label="Professional Off-Cloud Storage">
      <img class="hero-surface__bg" src="assets/ui-network-storage/hero-rack-bg.jpg" alt="Professional Off-Cloud Storage">
      <div class="hero-surface__scrim"></div>
      <div class="hero-surface__inner">
        ${H.compTag('library-banner', 'hero-responsive', {
          title: 'Professional Off-Cloud Storage',
          actionLabel: 'Buy Now',
          actionCallback: 'onHeroBuyNow',
          surface: 'image',
          height: '200',
          align: 'center'
        })}
      </div>
    </section>

    <!-- Section 2: Next-Gen Storage Simplified (White Section) -->
    <section id="storage-simplified" class="page-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Next-Gen Storage Simplified</h2>
        </div>
        <div class="ns-tab-wrap" id="ns-tabs-host">
          ${H.compTag('library-tab', 'capsule', {
            items: H.tabItemsHtml(TABS.map((t) => t.label))
          })}
        </div>
        <div class="ns-showcase-card" data-fs-extend="storage-dashboard-showcase">
          <div class="ns-showcase-media">
            <img class="ns-showcase-img" src="assets/ui-network-storage/dashboard-preview.jpg" alt="Storage Management Dashboard">
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Model Lineup Carousel & Side-by-Side Comparison (Gray Section) -->
    <section id="compare-models" class="page-section page-section--gray">
      <div class="container">
        <div class="ns-model-carousel" data-fs-extend="nas-model-selector">
          <button type="button" class="ns-model-nav ns-model-nav--prev is-hidden" id="ns-model-prev" aria-label="Previous models">
            <img class="ns-model-nav-icon" src="assets/ui-network-storage/icon-chevron-left.svg" alt="">
          </button>
          <div class="ns-model-viewport">
            <div class="ns-model-track" id="ns-model-grid">
              ${modelCardsHtml}
            </div>
          </div>
          <button type="button" class="ns-model-nav ns-model-nav--next" id="ns-model-next" aria-label="Next models">
            <img class="ns-model-nav-icon" src="assets/ui-network-storage/icon-chevron-right.svg" alt="">
          </button>
        </div>
        <div class="ns-hidden-templates" aria-hidden="true">
          <div id="ns-tpl-buy-btn">
            ${H.compTag('library-button', 'filled-red', {
              label: 'Buy Now',
              size: 'm',
              actionCallback: 'onModelBuyNow'
            })}
          </div>
          <div id="ns-tpl-new-tag">
            ${H.compTag('library-tag', 'semantic-new', {})}
          </div>
        </div>
        <div class="ns-matrix-wrap" data-fs-extend="nas-comparison-matrix">
          <table class="ns-matrix-table" id="ns-compare-table"></table>
        </div>
      </div>
    </section>

    <!-- Section 4: Enterprise Hardware Capabilities Bento (White Section -> Bordered Cards) -->
    <section id="capabilities" class="page-section">
      <div class="container">
        <div class="ns-cap-grid" id="ns-cap-grid" data-fs-extend="nas-capabilities-grid">
          ${capCardsHtml}
        </div>
      </div>
    </section>

    <!-- Section 5: Installation Essentials (Gray Section -> Borderless White Cards) -->
    <section id="installation-essentials" class="page-section page-section--gray">
      <div class="container">
        <div class="section-header">
          <h2 class="section-header__title">Installation Essentials</h2>
        </div>
        <div class="ns-ess-thumbs" id="ns-ess-thumbs" data-fs-extend="essentials-selector">
          ${essThumbsHtml}
        </div>
        <div class="ns-ess-detail" data-fs-extend="essentials-detail-card">
          <div class="ns-ess-body">
            <span class="ns-ess-tag" id="ns-ess-tag">${esc(firstEss.tag)}</span>
            <h3 class="ns-ess-title" id="ns-ess-title">${esc(firstEss.name)}</h3>
            <p class="ns-ess-desc" id="ns-ess-desc">${esc(firstEss.desc)}</p>
            <div class="ns-ess-spec">
              <span class="ns-ess-spec-head"><img class="ns-spec-icon" src="assets/ui-network-storage/spec-dimensions.svg" alt=""><span class="ns-ess-spec-k">Dimensions</span></span>
              <span class="ns-ess-spec-v" id="ns-ess-dim">${esc(firstEss.dimensions)}</span>
            </div>
            <div>
              ${H.compTag('library-text-button', 'inline-blue-link', {
                label: 'View in Tech Specs',
                href: '#compare-models'
              })}
            </div>
          </div>
          <div class="ns-ess-media" id="ns-ess-media">
            <img class="ns-ess-hero-img" id="ns-ess-img" src="${firstEss.heroImg}" alt="${esc(firstEss.name)}">
          </div>
        </div>
      </div>
    </section>
  `;

  const inlineScript = `
  (function () {
    const TABS = ${JSON.stringify(TABS)};
    const MODELS = ${JSON.stringify(MODELS)};
    const ESSENTIALS = ${JSON.stringify(ESSENTIALS)};

    // 1. Hero CTA smooth scroll to compare section
    window.onHeroBuyNow = function () {
      const el = document.getElementById('compare-models');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // 2. Next-Gen Storage Simplified Tabs
    const tabHost = document.getElementById('ns-tabs-host');
    if (tabHost) {
      const renderTab = (idx) => {
        const item = TABS[idx] || TABS[0];
        const titleEl = document.getElementById('ns-tab-title');
        const descEl = document.getElementById('ns-tab-desc');
        const metEl = document.getElementById('ns-tab-metrics');
        if (titleEl) titleEl.textContent = item.title;
        if (descEl) descEl.textContent = item.desc;
        if (metEl) {
          metEl.innerHTML = item.metrics
            .map((m) => '<div class="ns-metric-box"><span class="ns-metric-lbl">' + m.label + '</span><span class="ns-metric-val">' + m.value + '</span></div>')
            .join('');
        }
      };
      tabHost.addEventListener('click', (e) => {
        const tabItem = e.target.closest('[data-tab-item]');
        if (!tabItem) return;
        const all = Array.from(tabHost.querySelectorAll('[data-tab-item]'));
        const idx = all.indexOf(tabItem);
        if (idx >= 0) renderTab(idx);
      });
    }

    window.onModelBuyNow = function () {
      const el = document.getElementById('installation-essentials');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // 3. Model Lineup Single-Row Carousel + 4-Slot Interactive Comparison Matrix
    const modelTrack = document.getElementById('ns-model-grid');
    const prevBtn = document.getElementById('ns-model-prev');
    const nextBtn = document.getElementById('ns-model-next');
    let slideOffset = 0;
    const maxOffset = Math.max(0, MODELS.length - 5);
    function updateCarousel() {
      if (!modelTrack) return;
      modelTrack.style.transform = 'translateX(-' + (slideOffset * 243) + 'px)';
      if (prevBtn) prevBtn.classList.toggle('is-hidden', slideOffset <= 0);
      if (nextBtn) nextBtn.classList.toggle('is-hidden', slideOffset >= maxOffset);
    }
    if (prevBtn) prevBtn.addEventListener('click', () => { slideOffset = Math.max(0, slideOffset - 1); updateCarousel(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { slideOffset = Math.min(maxOffset, slideOffset + 1); updateCarousel(); });
    updateCarousel();

    const selectedIds = MODELS.filter((m) => m.defaultSelected).map((m) => m.id);
    const SPEC_ROWS = [
      ['Dimensions', 'dimensions', 'assets/ui-network-storage/spec-dimensions.svg'],
      ['Storage Capacity', 'capacity', 'assets/ui-network-storage/spec-capacity.svg'],
      ['Data Protection', 'protection', 'assets/ui-network-storage/spec-protection.svg'],
      ['Network Interface', 'network', 'assets/ui-network-storage/spec-network.svg'],
      ['Power Method', 'powerMethod', 'assets/ui-network-storage/spec-power.svg'],
      ['Power Redundancy', 'powerRedundancy', 'assets/ui-network-storage/spec-redundancy.svg'],
      ['Form Factor', 'formFactor', 'assets/ui-network-storage/spec-formfactor.svg']
    ];
    const buyBtnTpl = document.getElementById('ns-tpl-buy-btn')?.innerHTML || '';
    const newTagTpl = document.getElementById('ns-tpl-new-tag')?.innerHTML || '';

    function renderComparison() {
      const table = document.getElementById('ns-compare-table');
      if (!table) return;
      const activeModels = selectedIds.map((id) => MODELS.find((m) => m.id === id)).filter(Boolean);
      const emptyCount = Math.max(0, 4 - activeModels.length);
      const headCols = activeModels.map((m, idx) =>
        '<th class="ns-matrix-prod">' +
          (idx > 0 ? '<button type="button" class="ns-matrix-remove" data-remove-model="' + m.id + '" aria-label="Remove ' + m.name + '"><img class="ns-matrix-remove-icon" src="assets/ui-network-storage/btn-close.svg" alt=""></button>' : '') +
          '<div class="ns-matrix-prod-img"><img class="ns-matrix-photo" src="' + m.img + '" alt="' + m.name + '"></div>' +
          '<p class="ns-matrix-prod-name">' + m.name + '</p>' +
          '<p class="ns-matrix-prod-sub">' + m.desc + '</p>' +
          '<div class="ns-matrix-badge-slot">' + (m.badge ? newTagTpl : '') + '</div>' +
        '</th>'
      ).join('') + Array.from({ length: emptyCount }, () => '<th class="ns-matrix-empty">Select from Above</th>').join('');

      const specRows = SPEC_ROWS.map(([label, key, icon]) =>
        '<tr>' +
          '<td class="ns-matrix-label"><span class="ns-spec-row-head"><img class="ns-spec-icon" src="' + icon + '" alt=""><span>' + label + '</span></span></td>' +
          activeModels.map((m) => '<td>' + m.specs[key] + '</td>').join('') +
          Array.from({ length: emptyCount }, () => '<td></td>').join('') +
        '</tr>'
      ).join('');

      const ctaRow =
        '<tr>' +
          '<td class="ns-matrix-label"></td>' +
          activeModels.map(() => '<td class="ns-matrix-cta-cell">' + buyBtnTpl + '</td>').join('') +
          Array.from({ length: emptyCount }, () => '<td></td>').join('') +
        '</tr>';

      table.innerHTML = '<thead><tr><th class="ns-matrix-label"></th>' + headCols + '</tr></thead><tbody>' + specRows + ctaRow + '</tbody>';
      table.querySelectorAll('[data-library-event-actioncallback="onModelBuyNow"]').forEach((b) => {
        b.addEventListener('click', window.onModelBuyNow);
      });

      document.querySelectorAll('[data-toggle-model]').forEach((btn) => {
        const id = btn.getAttribute('data-toggle-model');
        const on = selectedIds.includes(id);
        btn.classList.toggle('is-active', on);
        btn.innerHTML = '<img class="ns-btn-icon' + (on ? ' ns-btn-icon--invert' : '') + '" src="' + (on ? 'assets/ui-network-storage/btn-close.svg' : 'assets/ui-network-storage/btn-plus.svg') + '" alt=""><span>' + (on ? 'Remove' : 'Compare') + '</span>';
        const card = btn.closest('[data-model-card]');
        if (card) card.classList.toggle('is-selected', on);
      });
    }

    const compareTable = document.getElementById('ns-compare-table');
    if (compareTable) {
      compareTable.addEventListener('click', (e) => {
        const rm = e.target.closest('[data-remove-model]');
        if (!rm) return;
        const id = rm.getAttribute('data-remove-model');
        const idx = selectedIds.indexOf(id);
        if (idx > 0) {
          selectedIds.splice(idx, 1);
          renderComparison();
        }
      });
    }

    if (modelTrack) {
      modelTrack.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-toggle-model]');
        if (!btn) return;
        const id = btn.getAttribute('data-toggle-model');
        const idx = selectedIds.indexOf(id);
        if (idx > 0) {
          selectedIds.splice(idx, 1);
        } else if (idx < 0) {
          if (selectedIds.length >= 4) selectedIds.splice(1, 1);
          selectedIds.push(id);
        }
        renderComparison();
      });
    }
    renderComparison();

    // 4. Capabilities Dynamic Bento Expand/Collapse (2 rows x 4 cards, 20-col grid)
    const capGrid = document.getElementById('ns-cap-grid');
    if (capGrid) {
      let expandedIdx = 0;
      const updateBento = () => {
        const expRow = expandedIdx >= 0 ? Math.floor(expandedIdx / 4) : -1;
        capGrid.querySelectorAll('[data-cap-idx]').forEach((card) => {
          const i = Number(card.getAttribute('data-cap-idx'));
          const row = Math.floor(i / 4);
          const isExp = i === expandedIdx;
          card.classList.toggle('is-expanded', isExp);
          card.classList.remove('ns-cap-card--span-8', 'ns-cap-card--span-4', 'ns-cap-card--span-5');
          if (row === expRow) {
            card.classList.add(isExp ? 'ns-cap-card--span-8' : 'ns-cap-card--span-4');
          } else {
            card.classList.add('ns-cap-card--span-5');
          }
          const btn = card.querySelector('[data-cap-toggle]');
          if (btn) btn.setAttribute('aria-expanded', isExp ? 'true' : 'false');
          const icon = card.querySelector('.ns-cap-arrow-icon');
          if (icon) icon.setAttribute('src', isExp ? 'assets/ui-network-storage/icon-chevron-left.svg' : 'assets/ui-network-storage/icon-chevron-right.svg');
        });
      };
      capGrid.addEventListener('click', (e) => {
        const card = e.target.closest('[data-cap-idx]');
        if (!card) return;
        const idx = Number(card.getAttribute('data-cap-idx'));
        expandedIdx = expandedIdx === idx ? -1 : idx;
        updateBento();
      });
    }

    // 4. Installation Essentials Interactive Selector
    const essThumbs = document.getElementById('ns-ess-thumbs');
    if (essThumbs) {
      essThumbs.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-ess-idx]');
        if (!btn) return;
        const idx = Number(btn.getAttribute('data-ess-idx')) || 0;
        const item = ESSENTIALS[idx] || ESSENTIALS[0];
        essThumbs.querySelectorAll('.ns-ess-thumb').forEach((b, i) => b.classList.toggle('is-active', i === idx));
        document.getElementById('ns-ess-tag').textContent = item.tag;
        document.getElementById('ns-ess-title').textContent = item.name;
        document.getElementById('ns-ess-desc').textContent = item.desc;
        document.getElementById('ns-ess-dim').textContent = item.dimensions;
        const media = document.getElementById('ns-ess-media');
        const img = document.getElementById('ns-ess-img');
        img.src = item.heroImg;
        img.alt = item.name;
        media.classList.toggle('is-contain', idx !== 0);
        img.classList.toggle('ns-ess-hero-img--contain', idx !== 0);
      });
    }
  })();
  `;

  const pageSourceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1440">
  <title>Network Storage Solutions — Professional Off-Cloud NAS | FS</title>
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
