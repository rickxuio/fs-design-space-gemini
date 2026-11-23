(function () {
  if (document.__fsHeaderProductsCurrent) return;
  document.__fsHeaderProductsCurrent = true;

  var PRODUCTS_GROUPS = {
    switches: [
      { title: 'PicOS® Enterprise Switches', items: [['1/2.5G PicOS® Switches', 'Hot'], ['10/25G PicOS® Switches', 'Hot'], ['40/100G PicOS® Switches'], ['200/400G PicOS® Switches'], ['PicOS® License & Service', 'Hot'], ['Switch Accessories']] },
      { title: 'PicOS® Data Center Switches', items: [['10/25G PicOS® Switches', 'Hot'], ['100/200G PicOS® Switches', 'Hot'], ['400/800G PicOS® Switches'], ['HPC/AI PicOS® Switches'], ['PicOS® Network Packet Brokers', 'Hot'], ['Switch Accessories']] },
      { title: 'PicOS® PoE+ Switches', items: [['1G PicOS® PoE+ Switches', 'Hot'], ['2.5/5G PicOS® PoE+ Switches', 'Hot'], ['10G PicOS® PoE+ Switches'], ['PicOS® License & Service', 'Hot'], ['Switch Accessories']] },
      { title: 'Industrial Ethernet Switches', items: [['DIN Rail Mount Industrial', 'Hot'], ['Rack Mount Industrial'], ['Wall Mount Industrial'], ['TSN Industrial Switches'], ['Industrial PoE+ Switches', 'Hot'], ['Industrial Cellular Gateway'], ['Switch Accessories', 'New']] },
      { title: 'Enterprise Switches', items: [['1/2.5G Enterprise Switches', 'Hot'], ['10G Enterprise Switches', 'Hot'], ['25G Enterprise Switches', 'Hot'], ['40G Enterprise Switches'], ['100G Enterprise Switches'], ['Routers & Firewalls']] },
      { title: 'Data Center Switches', items: [['10/25G Data Center Switches', 'Hot'], ['100G Data Center Switches', 'Hot'], ['Modular Data Center Switches'], ['Network Packet Brokers', 'Hot'], ['NVIDIA® Switches'], ['NVIDIA® UFM® & Service']] },
      { title: 'PoE+ Switches', items: [['1G PoE+ Switches', 'Hot'], ['2.5/5G PoE+ Switches', 'Hot'], ['10G PoE++ Switches'], ['Switch Accessories']] },
      { title: 'SME Switches', items: [['Compact SME Switches', 'Hot'], ['Standard SME Switches', 'Hot'], ['Professional SME Switches', 'Hot'], ['Professional Max SME Switches'], ['Aggregation SME Switches']] }
    ],
    networking: [
      { title: 'Wireless & Wi-Fi 7', items: [['Wi-Fi 7 Access Points', 'New'], ['Wi-Fi 6E Access Points', 'Hot'], ['Outdoor Access Points'], ['Wireless LAN Controllers']] },
      { title: 'Enterprise Routers', items: [['Core & Aggregation Routers'], ['Branch & SMB Routers', 'Hot'], ['SD-WAN Gateways']] },
      { title: 'Network Security', items: [['Next-Gen Firewalls'], ['VPN Gateways'], ['Security Licenses']] },
      { title: 'Servers & NICs', items: [['10G/25G Network Cards', 'Hot'], ['100G/400G InfiniBand NICs', 'New'], ['SmartNICs & DPUs']] }
    ],
    'optical-transceivers': [
      { title: 'High-Speed Optics', items: [['800G OSFP / QSFP-DD', 'New'], ['400G QSFP-DD / OSFP', 'Hot'], ['200G QSFP56'], ['100G QSFP28', 'Hot']] },
      { title: 'Enterprise Optics', items: [['40G QSFP+'], ['25G SFP28', 'Hot'], ['10G SFP+', 'Hot'], ['1G SFP']] },
      { title: 'DAC & AOC Cables', items: [['800G/400G DAC & AOC', 'New'], ['100G QSFP28 DAC & AOC', 'Hot'], ['25G/10G SFP+ DAC & AOC']] },
      { title: 'Coding & Tools', items: [['FS Box v4', 'Hot'], ['Optics Compatibility Tool'], ['Fiber Cleaning Kits']] }
    ],
    'fiber-optic-cables': [
      { title: 'Fiber Patch Cables', items: [['OS2 Single Mode', 'Hot'], ['OM4 / OM5 Multimode', 'Hot'], ['OM3 Multimode'], ['Uniboot LC Patch Cables']] },
      { title: 'MTP® / MPO Cables', items: [['MTP-12 Trunk Cables', 'Hot'], ['MTP-16 / 24 AI Cables', 'New'], ['MTP Breakout Harness']] },
      { title: 'Outdoor & Armored', items: [['Armored Fiber Cables'], ['Direct Burial Cables'], ['FTTA Outdoor Assemblies']] },
      { title: 'Bulk & Pigtails', items: [['Fiber Optic Pigtails'], ['Bulk Indoor/Outdoor Fiber'], ['Loopback Modules']] }
    ],
    'panels-enclosures-racks': [
      { title: 'Fiber Enclosures', items: [['1U/2U/4U Rack Enclosures', 'Hot'], ['Ultra High-Density (FHD)', 'Hot'], ['Wall Mount Enclosures']] },
      { title: 'Server Racks & Cabinets', items: [['42U/48U Data Center Cabinets'], ['Open Frame 2-Post/4-Post'], ['Wall Mount Cabinets']] },
      { title: 'Power Distribution', items: [['Metered & Switched PDUs', 'Hot'], ['Basic Rack PDUs'], ['UPS Systems']] },
      { title: 'Cable Management', items: [['Horizontal Managers'], ['Vertical Managers'], ['Blanking Panels & Shelves']] }
    ],
    'optical-networking': [
      { title: 'WDM Systems', items: [['DWDM Mux/Demux', 'Hot'], ['CWDM Mux/Demux'], ['OADM Modules']] },
      { title: 'Transport Platforms', items: [['M6800 DCI Platform', 'Hot'], ['EDFA Optical Amplifiers'], ['Optical Line Protection']] },
      { title: 'Media Converters', items: [['10G Media Converters'], ['1G Industrial Converters'], ['Converter Chassis']] },
      { title: 'Passive Components', items: [['PLC Splitters'], ['Optical Attenuators'], ['Optical Circulators']] }
    ],
    'copper-systems': [
      { title: 'Ethernet Patch Cables', items: [['Cat8 40G Patch Cables'], ['Cat6a 10G Patch Cables', 'Hot'], ['Cat6 Slim Patch Cables', 'Hot']] },
      { title: 'Bulk Ethernet Cable', items: [['Cat6a Bulk Riser/Plenum'], ['Cat6 Bulk Cables'], ['Outdoor Direct Burial']] },
      { title: 'Keystones & Panels', items: [['24/48-Port Patch Panels'], ['Toolless Keystone Jacks', 'Hot'], ['Field Termination Plugs']] },
      { title: 'Copper Accessories', items: [['RJ45 Connectors'], ['Wall Plates & Surface Boxes'], ['Crimping Tools']] }
    ],
    'testers-tools': [
      { title: 'Fiber Testing', items: [['OTDR Fiber Testers', 'Hot'], ['Optical Power Meters'], ['Visual Fault Locators']] },
      { title: 'Splicing & Termination', items: [['Fusion Splicers', 'Hot'], ['Fiber Cleavers'], ['Termination Tool Kits']] },
      { title: 'Inspection & Cleaning', items: [['Fiber Inspection Probes'], ['One-Click Cleaners', 'Hot'], ['Lint-Free Wipes']] },
      { title: 'Cable & Network Testers', items: [['PoE & Cable Certifiers'], ['Tone & Probe Kits'], ['Label Printers']] }
    ]
  };

  var SOFTWARE_DATA = [
    {
      id: 'campus', label: 'Campus & Branch',
      items: [
        { title: 'PicOS® for Enterprise Switches', desc: 'Build scalable, high-performance enterprise networks with VXLAN-based fabric networking and SDN-ready capabilities.' },
        { title: 'AmpCon for Enterprise Networking', desc: 'Streamline complex enterprise networks with centralized management, automation, and unified visibility.' }
      ]
    },
    {
      id: 'dc', label: 'Data Center',
      items: [
        { title: 'PicOS® for Data Center & AI Switches', desc: 'Deliver ultra-low latency RoCEv2, EVPN-VXLAN, and lossless AI fabric performance across spine-leaf topologies.' },
        { title: 'AmpCon for Data Center & AI Networking', desc: 'Automate day-0 to day-2 lifecycle deployment, telemetry, and fabric orchestration at scale.' },
        { title: 'PicOS® for Network Packet Brokers', desc: 'Gain line-rate packet filtering, aggregation, and replication for enterprise security and monitoring tools.' },
        { title: 'FS-WireNet Automated Network Mapping System', desc: 'Visualize physical and logical topologies automatically with real-time link health telemetry.' }
      ]
    },
    {
      id: 'optical', label: 'Optical Networking',
      items: [
        { title: 'AmpCon for Optical Transport Networking', desc: 'Unified optical network management for DCI, DWDM amplification, and optical line protection.' },
        { title: 'AmpCon for PON Networking', desc: 'Centralized OLT/ONU provisioning, bandwidth profiling, and subscriber diagnostics.' }
      ]
    },
    {
      id: 'tools', label: 'Tools & Resource',
      items: [
        { title: 'Software Learning Center', desc: 'Access CLI guides, validated design blueprints, release notes, and lab tutorials.' },
        { title: 'Book a PicOS® & AmpCon Demo', desc: 'Schedule a live engineering walkthrough tailored to your campus or data center architecture.' }
      ]
    }
  ];

  var SOLUTIONS_DATA = [
    {
      id: 'campus', label: 'Campus & Branch', heading: 'Solutions by Application',
      sub: 'Simplify and scale campus, branch, SMB, and industrial networks with integrated connectivity solutions.',
      groups: [
        { title: 'Campus Networks', links: ['EVPN-VXLAN Fabric', 'Wireless Access'] },
        { title: 'Branch Networks', links: ['Branch Site', 'Multi-Branch'] },
        { title: 'Cloud SMB Networks', links: ['Simple Deployment', 'Midsize Deployment'] },
        { title: 'Industrial Networks', links: ['Industrial IoT', 'Industrial Automation', 'Rail Transit'] },
        { title: 'Surveillance Networks', links: ['Small Business Surveillance', 'Midsize Business Surveillance', 'Enterprise Business Surveillance'] }
      ]
    },
    {
      id: 'dc', label: 'Data Center', heading: 'Data Center & AI Fabrics',
      sub: 'High-throughput, lossless interconnects engineered for AI clusters, cloud fabrics, and metro edge.',
      groups: [
        { title: 'AI InfiniBand Networks', links: ['800G NDR InfiniBand', '400G AI Cluster', 'DGX SuperPOD Ready'] },
        { title: 'AI RoCE Networks', links: ['800G/400G RoCEv2', 'Lossless Ethernet AI', 'GPU Interconnect'] },
        { title: 'Cloud Data Center', links: ['Spine-Leaf Fabric', 'EVPN-VXLAN DCI', 'Multi-Tenant Cloud', 'Zero-Touch Provisioning'] },
        { title: 'Enterprise Data Center', links: ['Core Virtualization', 'Storage Networking', 'Server Aggregation', 'Disaster Recovery'] }
      ]
    },
    {
      id: 'optical', label: 'Optical Interconnect', heading: 'Optical Interconnect Solutions',
      sub: 'Long-haul, DCI, and high-density optical transport tailored to your fiber budget.',
      groups: [
        { title: 'AI & HPC Networks', links: ['800G OSFP Interconnect', '400G DR4/FR4', 'Active Optical Cables'] },
        { title: 'Data Center Networks', links: ['Data Center Interconnect (DCI)', '400G ZR/ZR+ Coherent', 'CWDM/DWDM Mux'] },
        { title: 'Enterprise Networks', links: ['Campus Backbone Fiber', '10G/25G BiDi Upgrade'] }
      ]
    },
    {
      id: 'cabling', label: 'Cabling & Infrastructure', heading: 'Cabling & Infrastructure',
      sub: 'Structured high-density fiber, copper, and rack power foundations for modern facilities.',
      groups: [
        { title: 'AI Data Center Cabling', links: ['Ultra High-Density MTP-16/24'] },
        { title: 'Data Center Cabling', links: ['400G/800G Trunk Cabling', 'Structured Patch Enclosures', 'Hot/Cold Aisle Containment'] },
        { title: 'Enterprise Network Cabling', links: ['Cat6a Horizontal Cabling', 'Backbone Fiber Cabling', 'IDF/MDF Closet Systems'] }
      ]
    }
  ];

  var COUNTRIES = [
    ['United States', 'English / $USD'],
    ['Canada', 'English / $CAD'],
    ['United Kingdom', 'English / £GBP'],
    ['Germany', 'Deutsch / €EUR'],
    ['France', 'Français / €EUR'],
    ['Australia', 'English / $AUD'],
    ['Japan', '日本語 / ¥JPY'],
    ['Singapore', 'English / $SGD'],
    ['Netherlands', 'Nederlands / €EUR'],
    ['Spain', 'Español / €EUR']
  ];

  var HOT_SEARCH_SETS = [
    ['DGX B300', 'PicOS', 'AmpCon-DC', 'AmpCon-Campus', '800G Infiniband', '100g PicOS switch', 'sfp-10gsr-85', '16 port switch'],
    ['S5810-48TS-P', 'OSFP 800G', '400G QSFP-DD', 'MTP-12 Trunk', 'Cat6a Patch Cable', 'DWDM Mux Demux', 'PoE++ Switch', 'Wi-Fi 7 AP']
  ];

  function renderProductGroupsHtml(catKey) {
    var groups = PRODUCTS_GROUPS[catKey] || PRODUCTS_GROUPS.switches;
    var cols = groups.map(function (g) {
      var links = g.items.map(function (it) {
        var tag = it[1] === 'Hot'
          ? '<span class="ds-nav-mega-tag-hot">Hot</span>'
          : (it[1] === 'New' ? '<span class="ds-nav-mega-tag-new">New</span>' : '');
        return '<li><a href="#" class="ds-nav-mega-group__link"><span>' + it[0] + '</span>' + tag + '</a></li>';
      }).join('');
      return '<div><a href="#" class="ds-nav-mega-group__title">' + g.title + '</a><ul class="ds-nav-mega-group__list">' + links + '</ul></div>';
    }).join('');
    return '<div class="ds-nav-mega-prod-grid">' + cols + '</div>';
  }

  var MEGA_RUNTIME_CSS = [
    '[data-header-products-current] .ds-nav-header__link[data-mega-active="true"]::after{content:"";position:absolute;bottom:0;left:0;right:0;height:2px;border-radius:3px;background:#C00000}',
    '[data-header-products-current] .ds-nav-header__link:focus-visible{outline:2px solid #0060BF;outline-offset:2px}',
    '.ds-nav-header__backdrop{position:fixed;top:100px;left:0;right:0;bottom:0;background:rgba(51,51,51,0.3);z-index:105}',
    '.ds-nav-header__backdrop[hidden]{display:none}',
    '[data-header-products-current] .ds-nav-header__product-menu:not([hidden]){display:flex;align-items:stretch;min-height:256px;border-top:1px solid #E5E5E5;border-radius:0 0 4px 4px}',
    '[data-header-products-current] .ds-nav-header__product-menu>.ds-menu-navigation{width:240px;flex-shrink:0}',
    '.ds-nav-header__product-detail{flex:1;min-width:0;background:#FFFFFF;padding:32px 40px 40px}',
    '[data-header-products-current] .ds-nav-header__mega-panel{position:absolute;top:100%;left:50%;transform:translateX(-50%);width:min(1200px,calc(100% - 32px));max-height:calc(100vh - 149px);overflow:auto;background:#FFFFFF;border-top:1px solid #E5E5E5;border-radius:0 0 4px 4px;box-shadow:0 8px 24px rgba(0,0,0,0.08);z-index:115}',
    '[data-header-products-current] .ds-nav-header__mega-panel[hidden]{display:none}',
    '.ds-nav-mega-a{display:flex;align-items:stretch;min-height:256px}',
    '.ds-nav-mega-a__rail{width:240px;flex-shrink:0;background:#F6F6F8;padding:32px 0}',
    '.ds-nav-mega-a__tab{position:relative;width:calc(100% - 12px);margin-left:12px;min-height:48px;padding:12px 20px;border:0;background:transparent;border-radius:3px 0 0 3px;display:flex;align-items:center;gap:10px;font-family:inherit;font-size:14px;line-height:22px;font-weight:400;color:#19191A;text-align:left;cursor:pointer}',
    '.ds-nav-mega-a__tab.is-active{background:#FFFFFF}',
    '.ds-nav-mega-a__tab-label{display:inline-block;padding-bottom:2px;border-bottom:2px solid transparent}',
    '.ds-nav-mega-a__tab.is-active .ds-nav-mega-a__tab-label{border-bottom-color:#C00000}',
    '.ds-nav-mega-a__body{flex:1;min-width:0;background:#FFFFFF;padding:32px 40px 40px}',
    '.ds-nav-mega-prod-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px 20px}',
    '.ds-nav-mega-sol-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px 20px;align-items:start}',
    '.ds-nav-mega-sw-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 28px;margin-top:20px}',
    '.ds-nav-mega-head{margin:0 0 8px;font-size:16px;line-height:24px;font-weight:600;color:#19191A}',
    '.ds-nav-mega-sub{margin:0 0 24px;font-size:12px;line-height:20px;color:#707070}',
    '.ds-nav-mega-group__title{display:inline-block;font-size:14px;line-height:22px;font-weight:600;color:#19191A;text-decoration:none;margin:0 0 8px;padding-bottom:2px;border-bottom:2px solid transparent}',
    'a.ds-nav-mega-group__title:hover{border-bottom-color:#C00000}',
    '.ds-nav-mega-group__list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}',
    '.ds-nav-mega-group__link{font-size:12px;line-height:20px;color:#707070;text-decoration:none;display:inline-flex;align-items:center;gap:6px}',
    '.ds-nav-mega-group__link:hover{color:#19191A;text-decoration:underline}',
    '.ds-nav-mega-tag-hot{color:#F56300;font-size:11px;font-weight:600;text-decoration:none}',
    '.ds-nav-mega-tag-new{color:#10A300;font-size:11px;font-weight:600;text-decoration:none}',
    '.ds-nav-mega-sw-item{text-decoration:none;color:inherit;display:block}',
    '.ds-nav-mega-sw-item__title{display:block;font-size:14px;line-height:22px;font-weight:600;color:#19191A;margin-bottom:4px}',
    '.ds-nav-mega-sw-item:hover .ds-nav-mega-sw-item__title{text-decoration:underline}',
    '.ds-nav-mega-sw-item__desc{margin:0;font-size:12px;line-height:20px;color:#707070}',
    '.ds-nav-mega-b{padding:32px 40px 40px;display:flex;align-items:stretch}',
    '.ds-nav-mega-b__left{flex:1;min-width:0}',
    '.ds-nav-mega-b__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 32px;margin-top:20px}',
    '.ds-nav-mega-b__divider{width:1px;background:#E5E5E5;margin:24px 32px 0;flex-shrink:0}',
    '.ds-nav-mega-b__card{position:relative;width:360px;height:225px;margin-top:24px;border-radius:8px;overflow:hidden;flex-shrink:0;background:#19191A}',
    '.ds-nav-mega-b__card img{width:100%;height:100%;object-fit:cover;display:block}',
    '.ds-nav-mega-b__card-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.48);padding:24px 28px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;color:#FFFFFF}',
    '.ds-nav-mega-b__card-title{margin:0 0 8px;font-size:20px;line-height:28px;font-weight:600}',
    '.ds-nav-mega-b__card-desc{margin:0 0 20px;font-size:14px;line-height:22px;color:rgba(255,255,255,0.92)}',
    '.ds-nav-mega-b__btn{display:inline-flex;align-items:center;justify-content:center;height:32px;padding:0 14px;border-radius:4px;background:#C00000;color:#FFFFFF;font-size:12px;font-weight:600;text-decoration:none}',
    '.ds-nav-mega-b__btn:hover{background:#A80000}',
    '.ds-nav-mega-socials{display:flex;align-items:center;gap:14px;margin-top:8px}',
    '.ds-nav-mega-socials a{display:inline-flex;opacity:0.72}',
    '.ds-nav-mega-socials a:hover{opacity:1}',
    '.ds-nav-mega-socials img{width:18px;height:18px;display:block}',
    '.ds-nav-header__pop-country{position:absolute;top:32px;right:max(20px,calc((100% - 1200px)/2));width:292px;height:424px;background:#FFFFFF;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.14);padding:14px 16px;z-index:140;display:flex;flex-direction:column;gap:10px}',
    '.ds-nav-header__pop-country[hidden]{display:none}',
    '.ds-nav-header__pop-country-head{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:600;color:#19191A}',
    '.ds-nav-header__pop-close{border:0;background:transparent;cursor:pointer;font-size:18px;line-height:1;color:#707070;padding:2px 4px}',
    '.ds-nav-header__pop-country-search{width:100%;height:34px;padding:0 12px;border:1px solid #DEE0E3;border-radius:4px;font-family:inherit;font-size:13px;outline:none}',
    '.ds-nav-header__pop-country-search:focus{border-color:#19191A}',
    '.ds-nav-header__pop-country-list{flex:1;overflow:auto;list-style:none;margin:0;padding:0}',
    '.ds-nav-header__pop-country-item{padding:8px 6px;border-radius:4px;font-size:12px;line-height:18px;display:flex;justify-content:space-between;cursor:pointer}',
    '.ds-nav-header__pop-country-item:hover{background:#F6F6F8}',
    '.ds-nav-header__pop-country-lang{color:#0060BF}',
    '.ds-nav-header__pop-search{position:absolute;top:100%;left:0;right:0;min-height:360px;background:#FFFFFF;border-top:1px solid #E5E5E5;padding:28px 0 36px;z-index:130}',
    '.ds-nav-header__pop-search[hidden]{display:none}',
    '.ds-nav-header__pop-search-in{max-width:1200px;margin:0 auto;padding-left:124px;position:relative}',
    '.ds-nav-header__pop-search-close{position:absolute;top:-12px;right:0;border:0;background:transparent;font-size:22px;color:#707070;cursor:pointer}',
    '.ds-nav-header__pop-search-bar{display:flex;width:900px;max-width:100%;margin-bottom:24px}',
    '.ds-nav-header__pop-search-input{flex:1;height:42px;background:#F6F6F8;border:1px solid #EAEAEF;border-right:0;border-radius:4px 0 0 4px;padding:0 14px;font-family:inherit;font-size:14px;outline:none}',
    '.ds-nav-header__pop-search-submit{width:96px;height:42px;border:0;border-radius:0 4px 4px 0;background:#C00000;color:#FFFFFF;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}',
    '.ds-nav-header__pop-search-sec{width:900px;max-width:100%;margin-bottom:20px}',
    '.ds-nav-header__pop-search-title-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}',
    '.ds-nav-header__pop-search-title{margin:0;font-size:15px;line-height:22px;font-weight:600;color:#19191A}',
    '.ds-nav-header__pop-search-change{font-family:inherit;font-size:13px;color:#0060BF;background:none;border:0;cursor:pointer}',
    '.ds-nav-header__pop-search-pills{display:flex;flex-wrap:wrap;gap:10px}',
    '.ds-nav-header__pop-search-pill{padding:4px 12px;border-radius:999px;border:1px solid #E8E8EC;background:#FFFFFF;font-family:inherit;font-size:12px;color:#4B4B4D;cursor:pointer}',
    '.ds-nav-header__pop-search-pill:hover{border-color:#19191A;color:#19191A}',
    '.ds-nav-header__pop-account{position:absolute;top:100%;right:max(20px,calc((100% - 1200px)/2));width:288px;background:#FFFFFF;border-radius:8px;box-shadow:0 2px 12px rgba(0,0,0,0.14);padding:14px 16px;z-index:140;display:flex;flex-direction:column;gap:10px}',
    '.ds-nav-header__pop-account[hidden]{display:none}',
    '.ds-nav-header__pop-account-btn{width:100%;height:38px;border-radius:4px;border:0;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer}',
    '.ds-nav-header__pop-account-btn--red{background:#C00000;color:#FFFFFF}',
    '.ds-nav-header__pop-account-btn--red:hover{background:#A80000}',
    '.ds-nav-header__pop-account-btn--gray{background:#F2F2F4;color:#19191A}',
    '.ds-nav-header__pop-account-btn--gray:hover{background:#E5E5E8}'
  ].join('\n');

  function ensureMegaStyles() {
    if (document.getElementById('ds-nav-mega-runtime-style')) return;
    var style = document.createElement('style');
    style.id = 'ds-nav-mega-runtime-style';
    style.textContent = MEGA_RUNTIME_CSS;
    if (document.head) document.head.appendChild(style);
  }

  function start() {
    ensureMegaStyles();
    document.querySelectorAll('[data-header-products-current]').forEach(function (root) {
      if (root.dataset.headerProductsReady) return;
      var trigger = root.querySelector('[data-header-products-trigger]');
      var panel = root.querySelector('.ds-nav-header__product-menu');
      if (!trigger || !panel || trigger.getAttribute('aria-controls') !== panel.id) return;
      root.dataset.headerProductsReady = 'true';

      var logoImg = root.querySelector('.ds-nav-header__logo img');
      var iconBase = logoImg ? logoImg.getAttribute('src').replace(/icon-logo-fs\.svg(?:\?.*)?$/, '') : '../icons/';

      // 1. Append 960px 4-column right detail panel inside All Products menu
      var prodDetail = panel.querySelector('.ds-nav-header__product-detail');
      if (!prodDetail) {
        prodDetail = document.createElement('div');
        prodDetail.className = 'ds-nav-header__product-detail';
        prodDetail.innerHTML = renderProductGroupsHtml('switches');
        panel.appendChild(prodDetail);
      }

      var menuButtons = Array.prototype.slice.call(panel.querySelectorAll('.ds-menu-navigation__item'));
      function selectProductCategory(btn) {
        var val = btn.getAttribute('data-value') || 'switches';
        menuButtons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('ds-menu-navigation__item--selected', active);
          if (active) b.setAttribute('aria-pressed', 'true');
          else b.removeAttribute('aria-pressed');
        });
        prodDetail.innerHTML = renderProductGroupsHtml(val);
      }
      menuButtons.forEach(function (btn) {
        btn.addEventListener('mouseenter', function () { selectProductCategory(btn); });
        btn.addEventListener('focus', function () { selectProductCategory(btn); });
      });

      // 2. Create Backdrop, Secondary Mega Panel, and 3 Auxiliary Popovers
      var backdrop = document.createElement('div');
      backdrop.className = 'ds-nav-header__backdrop';
      backdrop.hidden = true;
      root.appendChild(backdrop);

      var megaPanel = document.createElement('div');
      megaPanel.className = 'ds-nav-header__mega-panel';
      megaPanel.hidden = true;
      root.appendChild(megaPanel);

      var popCountry = document.createElement('div');
      popCountry.className = 'ds-nav-header__pop-country';
      popCountry.hidden = true;
      popCountry.innerHTML =
        '<div class="ds-nav-header__pop-country-head">' +
          '<span data-country-current>✓ United States - English / $USD</span>' +
          '<button type="button" class="ds-nav-header__pop-close" data-country-close aria-label="Close">×</button>' +
        '</div>' +
        '<input type="text" class="ds-nav-header__pop-country-search" data-country-search placeholder="Search country or currency...">' +
        '<ul class="ds-nav-header__pop-country-list" data-country-list></ul>';
      root.appendChild(popCountry);

      var hotSetIdx = 0;
      var popSearch = document.createElement('div');
      popSearch.className = 'ds-nav-header__pop-search';
      popSearch.hidden = true;
      popSearch.innerHTML =
        '<div class="ds-nav-header__pop-search-in">' +
          '<button type="button" class="ds-nav-header__pop-search-close" data-search-close aria-label="Close">×</button>' +
          '<div class="ds-nav-header__pop-search-bar">' +
            '<input type="text" class="ds-nav-header__pop-search-input" data-search-input placeholder="Search switches, transceivers, cables, or part numbers...">' +
            '<button type="button" class="ds-nav-header__pop-search-submit" data-search-submit>Search</button>' +
          '</div>' +
          '<div class="ds-nav-header__pop-search-sec">' +
            '<div class="ds-nav-header__pop-search-title-row"><h3 class="ds-nav-header__pop-search-title">Recent Searches</h3></div>' +
            '<div class="ds-nav-header__pop-search-pills">' +
              '<button type="button" class="ds-nav-header__pop-search-pill">S5810-48TS-P</button>' +
              '<button type="button" class="ds-nav-header__pop-search-pill">100G QSFP28</button>' +
            '</div>' +
          '</div>' +
          '<div class="ds-nav-header__pop-search-sec">' +
            '<div class="ds-nav-header__pop-search-title-row">' +
              '<h3 class="ds-nav-header__pop-search-title">Hot Searches</h3>' +
              '<button type="button" class="ds-nav-header__pop-search-change" data-search-change>↻ Change</button>' +
            '</div>' +
            '<div class="ds-nav-header__pop-search-pills" data-search-hot-pills></div>' +
          '</div>' +
        '</div>';
      root.appendChild(popSearch);

      var popAccount = document.createElement('div');
      popAccount.className = 'ds-nav-header__pop-account';
      popAccount.hidden = true;
      popAccount.innerHTML =
        '<button type="button" class="ds-nav-header__pop-account-btn ds-nav-header__pop-account-btn--red">Sign in</button>' +
        '<button type="button" class="ds-nav-header__pop-account-btn ds-nav-header__pop-account-btn--gray">Sign up</button>';
      root.appendChild(popAccount);

      var timer;
      var acctTimer;
      var activeSecondaryLink = null;
      var allLinks = Array.prototype.slice.call(root.querySelectorAll('.ds-nav-header__links .ds-nav-header__link'));
      var otherLinks = allLinks.filter(function (a) { return a !== trigger; });

      function unavailable() {
        return !!root.closest('[hidden],[aria-disabled="true"]') ||
          trigger.matches(':disabled') ||
          trigger.getAttribute('aria-disabled') === 'true';
      }

      function clearSecondaryAndPopovers() {
        megaPanel.hidden = true;
        popCountry.hidden = true;
        popSearch.hidden = true;
        popAccount.hidden = true;
        otherLinks.forEach(function (a) { a.removeAttribute('data-mega-active'); });
        activeSecondaryLink = null;
      }

      function updateBackdrop() {
        backdrop.hidden = panel.hidden && megaPanel.hidden && popSearch.hidden;
      }

      function show(open, focus) {
        clearTimeout(timer);
        if (open && unavailable()) return;
        if (open) clearSecondaryAndPopovers();
        panel.hidden = !open;
        trigger.setAttribute('aria-expanded', String(open));
        updateBackdrop();
        if (focus === 'first' && open) {
          var item = panel.querySelector('button:not(:disabled)');
          if (item) item.focus();
        }
        if (focus === 'trigger') trigger.focus();
      }

      // Renderers for Software, Solutions, Services, Resources, Contact Us
      function renderSoftwareMega(tabId) {
        var cur = SOFTWARE_DATA.find(function (x) { return x.id === tabId; }) || SOFTWARE_DATA[0];
        var rail = SOFTWARE_DATA.map(function (c) {
          return '<button type="button" class="ds-nav-mega-a__tab' + (c.id === cur.id ? ' is-active' : '') + '" data-sw-tab="' + c.id + '">' +
            '<span class="ds-nav-mega-a__tab-label">' + c.label + '</span></button>';
        }).join('');
        var items = cur.items.map(function (it) {
          return '<a href="#" class="ds-nav-mega-sw-item"><span class="ds-nav-mega-sw-item__title">' + it.title + '</span><p class="ds-nav-mega-sw-item__desc">' + it.desc + '</p></a>';
        }).join('');
        megaPanel.innerHTML = '<div class="ds-nav-mega-a"><div class="ds-nav-mega-a__rail">' + rail + '</div><div class="ds-nav-mega-a__body"><h3 class="ds-nav-mega-head">' + cur.label + '</h3><div class="ds-nav-mega-sw-grid">' + items + '</div></div></div>';
        megaPanel.querySelectorAll('[data-sw-tab]').forEach(function (b) {
          b.addEventListener('mouseenter', function () { renderSoftwareMega(b.getAttribute('data-sw-tab')); });
          b.addEventListener('click', function () { renderSoftwareMega(b.getAttribute('data-sw-tab')); });
        });
      }

      function renderSolutionsMega(tabId) {
        var cur = SOLUTIONS_DATA.find(function (x) { return x.id === tabId; }) || SOLUTIONS_DATA[0];
        var rail = SOLUTIONS_DATA.map(function (c) {
          return '<button type="button" class="ds-nav-mega-a__tab' + (c.id === cur.id ? ' is-active' : '') + '" data-sol-tab="' + c.id + '">' +
            '<span class="ds-nav-mega-a__tab-label">' + c.label + '</span></button>';
        }).join('');
        var groups = cur.groups.map(function (g) {
          var links = g.links.map(function (l) {
            return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>';
          }).join('');
          return '<div><a href="#" class="ds-nav-mega-group__title">' + g.title + '</a><ul class="ds-nav-mega-group__list">' + links + '</ul></div>';
        }).join('');
        megaPanel.innerHTML = '<div class="ds-nav-mega-a"><div class="ds-nav-mega-a__rail">' + rail + '</div><div class="ds-nav-mega-a__body"><h3 class="ds-nav-mega-head">' + cur.heading + '</h3><p class="ds-nav-mega-sub">' + cur.sub + '</p><div class="ds-nav-mega-sol-grid">' + groups + '</div></div></div>';
        megaPanel.querySelectorAll('[data-sol-tab]').forEach(function (b) {
          b.addEventListener('mouseenter', function () { renderSolutionsMega(b.getAttribute('data-sol-tab')); });
          b.addEventListener('click', function () { renderSolutionsMega(b.getAttribute('data-sol-tab')); });
        });
      }

      function renderServicesMega() {
        var s1 = ['Solution Consulting', 'Design Center', 'Installation & Deployment', 'Technical Support & Maintenance', 'OEM/ODM/JDM Services', 'Business Account', 'Certification Request', 'After Sales Service', 'Customer Policy', 'FS Developer Portal', 'Book PicOS® and AmpCon™ Demo'];
        var s2 = ['Support Center', 'Product Support', 'Software Support', 'Optics Compatibility Tool', 'WDM Transceiver Stock List', 'Query Tool', 'Track My Order', 'RMA Checklist'];
        megaPanel.innerHTML =
          '<div class="ds-nav-mega-b">' +
            '<div class="ds-nav-mega-b__left">' +
              '<h3 class="ds-nav-mega-head">Services and Supports</h3>' +
              '<p class="ds-nav-mega-sub">Try professional and convenient services of FS to push your projects into success.</p>' +
              '<div class="ds-nav-mega-b__grid">' +
                '<div><span class="ds-nav-mega-group__title">FS Services</span><ul class="ds-nav-mega-group__list">' +
                  s1.map(function (l) { return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>'; }).join('') +
                '</ul></div>' +
                '<div><span class="ds-nav-mega-group__title">Support</span><ul class="ds-nav-mega-group__list">' +
                  s2.map(function (l) { return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>'; }).join('') +
                '</ul><div style="margin-top:20px"><span class="ds-nav-mega-group__title">Events &amp; Help</span><ul class="ds-nav-mega-group__list"><li><a href="#" class="ds-nav-mega-group__link">FAQ &amp; Help Center</a></li></ul></div></div>' +
              '</div>' +
            '</div>' +
            '<div class="ds-nav-mega-b__divider"></div>' +
            '<div class="ds-nav-mega-b__card">' +
              '<img src="' + iconBase + 'img-nav-mega-services.jpg" alt="Expert Team Support">' +
              '<div class="ds-nav-mega-b__card-overlay">' +
                '<h4 class="ds-nav-mega-b__card-title">Expert Team Support</h4>' +
                '<p class="ds-nav-mega-b__card-desc">Free Support for Members 5*24 Online Service</p>' +
                '<a href="#" class="ds-nav-mega-b__btn">Project Inquiry</a>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      function renderResourcesMega() {
        var r1 = ['Documentation', 'Glossary', 'Audio & Video', 'Software Learning Center'];
        var r2 = ['FS Blog', 'Case Studies'];
        megaPanel.innerHTML =
          '<div class="ds-nav-mega-b">' +
            '<div class="ds-nav-mega-b__left">' +
              '<h3 class="ds-nav-mega-head">Resources</h3>' +
              '<p class="ds-nav-mega-sub">Resource Center that assists customers in problem-solving through providing a rich array of product resources.</p>' +
              '<div class="ds-nav-mega-b__grid">' +
                '<div><span class="ds-nav-mega-group__title">Learning</span><ul class="ds-nav-mega-group__list">' +
                  r1.map(function (l) { return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>'; }).join('') +
                '</ul></div>' +
                '<div><span class="ds-nav-mega-group__title">In the News</span><ul class="ds-nav-mega-group__list">' +
                  r2.map(function (l) { return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>'; }).join('') +
                '</ul></div>' +
              '</div>' +
            '</div>' +
            '<div class="ds-nav-mega-b__divider"></div>' +
            '<div class="ds-nav-mega-b__card">' +
              '<img src="' + iconBase + 'img-nav-mega-resources.webp" alt="Product Resources">' +
              '<div class="ds-nav-mega-b__card-overlay">' +
                '<h4 class="ds-nav-mega-b__card-title">Easy access to all product resource information</h4>' +
                '<a href="#" class="ds-nav-mega-b__btn">Explore Documentation</a>' +
              '</div>' +
            '</div>' +
          '</div>';
      }

      function renderContactMega() {
        var socials = ['linkedin', 'youtube', 'facebook', 'x', 'instagram', 'reddit'].map(function (s) {
          return '<a href="#" aria-label="' + s + '"><img src="' + iconBase + 'icon-social-' + s + '.svg" alt=""></a>';
        }).join('');
        megaPanel.innerHTML =
          '<div class="ds-nav-mega-b">' +
            '<div class="ds-nav-mega-b__left">' +
              '<h3 class="ds-nav-mega-head">Contact Us</h3>' +
              '<p class="ds-nav-mega-sub">FS is a trusted provider of ICT products and solutions to enterprise customers worldwide.</p>' +
              '<div class="ds-nav-mega-b__grid">' +
                '<div><span class="ds-nav-mega-group__title">Explore FS</span><ul class="ds-nav-mega-group__list">' +
                  ['About Us', 'Why FS', 'U.S. Warehouse'].map(function (l) { return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>'; }).join('') +
                '</ul><div style="margin-top:20px"><span class="ds-nav-mega-group__title">Follow Us</span><div class="ds-nav-mega-socials">' + socials + '</div></div></div>' +
                '<div><span class="ds-nav-mega-group__title">Contact Us</span><ul class="ds-nav-mega-group__list">' +
                  ['US@fs.com', '+1 (888) 468-9910', 'Contact Us'].map(function (l) { return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>'; }).join('') +
                '</ul><div style="margin-top:20px"><span class="ds-nav-mega-group__title">FS Branch</span><ul class="ds-nav-mega-group__list">' +
                  ['Global Warehouse', 'Advanced R&D Center', 'Quality Control', 'Compliance Center', 'Test Center'].map(function (l) { return '<li><a href="#" class="ds-nav-mega-group__link">' + l + '</a></li>'; }).join('') +
                '</ul></div></div>' +
              '</div>' +
            '</div>' +
            '<div class="ds-nav-mega-b__divider"></div>' +
            '<div class="ds-nav-mega-b__card">' +
              '<img src="' + iconBase + 'img-nav-mega-contact.jpg" alt="FS United States Warehouse">' +
            '</div>' +
          '</div>';
      }

      function openSecondaryMega(linkEl) {
        if (unavailable() || linkEl.getAttribute('aria-disabled') === 'true') return;
        clearTimeout(timer);
        show(false);
        clearSecondaryAndPopovers();
        var text = (linkEl.textContent || '').trim();
        if (text === 'Software') renderSoftwareMega('campus');
        else if (text === 'Solutions') renderSolutionsMega('campus');
        else if (text === 'Services') renderServicesMega();
        else if (text === 'Resources') renderResourcesMega();
        else if (text === 'Contact Us') renderContactMega();
        else return;
        activeSecondaryLink = linkEl;
        linkEl.setAttribute('data-mega-active', 'true');
        megaPanel.hidden = false;
        updateBackdrop();
      }

      function closeAllMenus() {
        clearTimeout(timer);
        show(false);
        clearSecondaryAndPopovers();
        updateBackdrop();
      }

      // All Products trigger bindings (exact compliance with five-variant-current.test.js)
      var lastProdHoverOpen = 0;
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (!panel.hidden && Date.now() - lastProdHoverOpen < 300) return;
        show(panel.hidden);
      });
      trigger.addEventListener('keydown', function (e) {
        if (e.defaultPrevented || e.isComposing) return;
        if (['ArrowDown', ' '].includes(e.key)) {
          e.preventDefault();
          show(true, 'first');
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          show(false, 'trigger');
        }
      });
      [trigger, panel].forEach(function (n) {
        n.addEventListener('mouseenter', function () {
          if (panel.hidden) lastProdHoverOpen = Date.now();
          show(true);
        });
        n.addEventListener('mouseleave', function () {
          timer = setTimeout(function () { show(false); }, 120);
        });
      });

      // Secondary 5 main nav links bindings
      var lastSecHoverOpen = 0;
      otherLinks.forEach(function (linkEl) {
        linkEl.addEventListener('mouseenter', function () {
          if (activeSecondaryLink !== linkEl || megaPanel.hidden) lastSecHoverOpen = Date.now();
          openSecondaryMega(linkEl);
        });
        linkEl.addEventListener('click', function (e) {
          e.preventDefault();
          if (activeSecondaryLink === linkEl && !megaPanel.hidden) {
            if (Date.now() - lastSecHoverOpen < 300) return;
            closeAllMenus();
          } else {
            openSecondaryMega(linkEl);
          }
        });
        linkEl.addEventListener('mouseleave', function () {
          timer = setTimeout(function () {
            clearSecondaryAndPopovers();
            updateBackdrop();
          }, 140);
        });
      });
      megaPanel.addEventListener('mouseenter', function () { clearTimeout(timer); });
      megaPanel.addEventListener('mouseleave', function () {
        timer = setTimeout(function () {
          clearSecondaryAndPopovers();
          updateBackdrop();
        }, 140);
      });

      // Auxiliary Popover 1: Country / Currency
      var topbarLinks = Array.prototype.slice.call(root.querySelectorAll('.ds-nav-header__topbar-link'));
      var countryTrigger = topbarLinks.find(function (a) { return (a.textContent || '').indexOf('USD') !== -1; });
      var countryListEl = popCountry.querySelector('[data-country-list]');
      var countrySearchEl = popCountry.querySelector('[data-country-search]');
      var countryCurrentEl = popCountry.querySelector('[data-country-current]');

      function renderCountryList(query) {
        var q = (query || '').trim().toLowerCase();
        countryListEl.innerHTML = COUNTRIES.filter(function (c) {
          return !q || (c[0] + ' ' + c[1]).toLowerCase().indexOf(q) !== -1;
        }).map(function (c) {
          return '<li class="ds-nav-header__pop-country-item" data-country-name="' + c[0] + '" data-country-lang="' + c[1] + '">' +
            '<span>' + c[0] + '</span><span class="ds-nav-header__pop-country-lang">' + c[1] + '</span></li>';
        }).join('');
        countryListEl.querySelectorAll('.ds-nav-header__pop-country-item').forEach(function (li) {
          li.addEventListener('click', function () {
            var cName = li.getAttribute('data-country-name');
            var cLang = li.getAttribute('data-country-lang');
            var curr = (cLang.split('/')[1] || '$USD').trim();
            countryCurrentEl.textContent = '✓ ' + cName + ' - ' + cLang;
            if (countryTrigger) {
              var svg = countryTrigger.querySelector('svg');
              countryTrigger.textContent = cName + ' / ' + curr + ' ';
              if (svg) countryTrigger.appendChild(svg);
            }
            closeAllMenus();
          });
        });
      }
      renderCountryList('');
      countrySearchEl.addEventListener('input', function (e) { renderCountryList(e.target.value); });
      popCountry.querySelector('[data-country-close]').addEventListener('click', closeAllMenus);
      if (countryTrigger) {
        countryTrigger.addEventListener('click', function (e) {
          if (unavailable() || countryTrigger.getAttribute('aria-disabled') === 'true') return;
          e.preventDefault();
          var willOpen = popCountry.hidden;
          closeAllMenus();
          if (willOpen) popCountry.hidden = false;
        });
      }

      // Auxiliary Popover 2: Full-Width Search
      var searchBtn = root.querySelector('.ds-nav-header__action-btn[aria-label="Search"]');
      var hotPillsContainer = popSearch.querySelector('[data-search-hot-pills]');
      var searchInputEl = popSearch.querySelector('[data-search-input]');
      function renderHotPills() {
        var list = HOT_SEARCH_SETS[hotSetIdx % HOT_SEARCH_SETS.length];
        hotPillsContainer.innerHTML = list.map(function (term) {
          return '<button type="button" class="ds-nav-header__pop-search-pill">' + term + '</button>';
        }).join('');
      }
      renderHotPills();
      popSearch.addEventListener('click', function (e) {
        var pill = e.target.closest('.ds-nav-header__pop-search-pill');
        if (pill && searchInputEl) searchInputEl.value = pill.textContent;
      });
      popSearch.querySelector('[data-search-change]').addEventListener('click', function () {
        hotSetIdx += 1;
        renderHotPills();
      });
      popSearch.querySelector('[data-search-close]').addEventListener('click', closeAllMenus);
      if (searchBtn) {
        searchBtn.addEventListener('click', function () {
          if (unavailable() || searchBtn.getAttribute('aria-disabled') === 'true') return;
          var willOpen = popSearch.hidden;
          closeAllMenus();
          if (willOpen) {
            popSearch.hidden = false;
            updateBackdrop();
          }
        });
      }

      // Auxiliary Popover 3: Account Hover/Click
      var accountBtn = root.querySelector('.ds-nav-header__action-btn[aria-label="Account"]');
      function openAccountPop() {
        if (unavailable() || !accountBtn || accountBtn.getAttribute('aria-disabled') === 'true') return;
        clearTimeout(acctTimer);
        closeAllMenus();
        popAccount.hidden = false;
      }
      if (accountBtn) {
        accountBtn.addEventListener('mouseenter', openAccountPop);
        accountBtn.addEventListener('click', function () {
          if (popAccount.hidden) openAccountPop();
          else closeAllMenus();
        });
        [accountBtn, popAccount].forEach(function (el) {
          el.addEventListener('mouseenter', function () { clearTimeout(acctTimer); });
          el.addEventListener('mouseleave', function () {
            acctTimer = setTimeout(function () { popAccount.hidden = true; }, 160);
          });
        });
      }

      backdrop.addEventListener('click', closeAllMenus);

      root.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !e.isComposing) {
          if (!panel.hidden) {
            e.preventDefault();
            show(false, 'trigger');
          } else if (!megaPanel.hidden || !popCountry.hidden || !popSearch.hidden || !popAccount.hidden) {
            e.preventDefault();
            closeAllMenus();
          }
        }
      });

      root.addEventListener('focusout', function (e) {
        if (!root.contains(e.relatedTarget)) {
          show(false);
          clearSecondaryAndPopovers();
          updateBackdrop();
        }
      });

      document.addEventListener('click', function (e) {
        if (!root.contains(e.target)) {
          closeAllMenus();
        }
      });

      panel.addEventListener('ds:menu-navigation-change', function () {
        show(false, 'trigger');
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
