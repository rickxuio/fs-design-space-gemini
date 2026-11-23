# Navigation — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：fixed-desktop-header-footer-default；视觉审阅：pending。

仅使用同版US英文PC固定header/footer Default，零内容编辑。新文件87058/84947已核对；不新增其他国家/语言或Pad/M。主导航Hover沿用用户确认的400字重、独立2px红色标记及无位移规则；新MG原子Hover600列为视觉差异，不直接覆盖。Footer复用原Button红色S32px/12px，Input仍锁定已闭合的专属保留Default32px实例，不升级基础42px Input；订阅/搜索/账户/购物车生产业务不在本调用范围。

必须加载：components/tokens.css、components/components.css、components/navigation-current.css、components/navigation-header-web-atom.css、components/button-current.css、components/button-runtime-current.css、components/input-footer-source.css、components/navigation-footer-current.css、components/navigation-header-action-atom.css、components/menu-navigation-current.css、components/navigation-products-current.css、components/menu-navigation-current.js、components/navigation-products-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Frozen authored native Header literal, including actual logo/link/action hierarchy. No rewrite, wrapper div or custom labels. data-ai-example is only reference metadata. New fixed header includes the source public product menu; source shell is separately hashed so synchronizing the child cannot approve unrelated shell changes.



不可修改：Entire fixed Header authored DOM/text/attributes；Existing 32px topbar / 68px nav / 1200px layout；Existing inline icon export and navigation placeholders；No content edits or new search/account/cart behavior。

## header

用：新页面的同版US英文PC固定公共头部。

不用：其他站点/语言、竞品/子站头部、自定义导航或生产业务。

可修改：。

```html
<header class="ds-nav-header" data-fragment="header" data-ai-example="ai-navigation-fixed-header" data-header-products-current="pc">
    <div class="ds-nav-header__topbar">
      <div class="ds-nav-header__topbar-inner">
        <div class="ds-nav-header__topbar-left">
          <span class="ds-nav-header__topbar-text">FS United States</span>
          <span class="ds-nav-header__topbar-divider"></span>
          <span class="ds-nav-header__topbar-text">FREE SHIPPING on Orders Over US$79</span>
        </div>
        <div class="ds-nav-header__topbar-right">
          <a href="#" class="ds-nav-header__topbar-link">Contact Us</a>
          <span class="ds-nav-header__topbar-divider"></span>
          <a href="#" class="ds-nav-header__topbar-link">
            United States / $ USD
            <svg class="ds-nav-header__dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#707070" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <nav class="ds-nav-header__main">
      <div class="ds-nav-header__main-inner">
        <a id="icon-usage-icon-logo-fs" href="#" class="ds-nav-header__logo" aria-label="FS.com Home" style="scroll-margin-top: 40px;">
          <img src="../icons/icon-logo-fs.svg" alt="FS Logo" width="76" height="36">
        </a>
        <ul class="ds-nav-header__links">
          <li class="ds-nav-header__link-item"><a href="#" class="ds-nav-header__link" data-header-products-trigger="" role="button" aria-haspopup="true" aria-expanded="false" aria-controls="header-product-menu-panel">All Products</a></li>
          <li class="ds-nav-header__link-item"><a href="#" class="ds-nav-header__link">Software</a></li>
          <li class="ds-nav-header__link-item"><a href="#" class="ds-nav-header__link">Solutions</a></li>
          <li class="ds-nav-header__link-item"><a href="#" class="ds-nav-header__link">Services</a></li>
          <li class="ds-nav-header__link-item"><a href="#" class="ds-nav-header__link">Resources</a></li>
          <li class="ds-nav-header__link-item"><a href="#" class="ds-nav-header__link">Contact Us</a></li>
        </ul>
        <div class="ds-nav-header__actions">
          <button id="icon-usage-icon-search" class="ds-nav-header__action-btn" type="button" aria-label="Search" style="scroll-margin-top: 40px;">
            <img src="../icons/navigation-header-search-1013.png" alt="" width="24" height="24">
          </button>
          <button id="icon-usage-icon-cart" class="ds-nav-header__action-btn" type="button" aria-label="Cart" style="scroll-margin-top: 40px;">
            <img src="../icons/icon-cart.svg" alt="" width="24" height="24">
          </button>
          <button id="icon-usage-icon-account" class="ds-nav-header__action-btn" type="button" aria-label="Account" style="scroll-margin-top: 40px;">
            <img src="../icons/icon-account.svg" alt="" width="24" height="24">
          </button>
        </div>
      </div>
    </nav>
  <div class="ds-nav-header__product-menu" id="header-product-menu-panel" hidden=""><nav class="ds-menu-navigation ds-menu-navigation--public-header" data-menu-navigation="" aria-label="Public header product menu">
        <ul class="ds-menu-navigation__list">
          <li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="switches" aria-pressed="true"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-switches.svg" alt=""><span class="ds-menu-navigation__item-label">Switches</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="networking"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-networking.svg" alt=""><span class="ds-menu-navigation__item-label">Networking</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="optical-transceivers"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-optical-transceivers.svg" alt=""><span class="ds-menu-navigation__item-label">Optical Transceivers</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="fiber-optic-cables"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-fiber-optic-cables.svg" alt=""><span class="ds-menu-navigation__item-label">Fiber Optic Cables</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="panels-enclosures-racks"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-panels-enclosures-racks.svg" alt=""><span class="ds-menu-navigation__item-label">Panels, Enclosures &amp; Racks</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="optical-networking"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-optical-networking.svg" alt=""><span class="ds-menu-navigation__item-label">Optical Networking</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="copper-systems"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-copper-systems.svg" alt=""><span class="ds-menu-navigation__item-label">Copper Systems</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="testers-tools"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-testers-tools.svg" alt=""><span class="ds-menu-navigation__item-label">Testers &amp; Tools</span></button></li>
        </ul>
      </nav></div></header>
```

## footer

用：同版US英文PC固定Footer Default。

不用：内容区链接组、其他站点/语言或订阅业务。

可修改：。

```html
<footer class="ds-nav-footer" data-fragment="footer" data-footer-pc-current="" data-ai-example="ai-navigation-fixed-footer">
    <div class="ds-nav-footer__inner">
      <div class="ds-nav-footer__columns">
        <div class="ds-nav-footer__col">
          <h4 class="ds-nav-footer__col-title">About Us</h4>
          <ul class="ds-nav-footer__col-links">
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Overview</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Global Warehouse</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Advanced R&amp;D Center</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Quality Control</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Compliance Center</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Test Center</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Contact Us</a></li>
          </ul>
        </div>
        <div class="ds-nav-footer__col ds-nav-footer__col--service">
          <h4 class="ds-nav-footer__col-title">Service</h4>
          <ul class="ds-nav-footer__col-links">
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Payment Methods</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Shipping Guide</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Business Account</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Net Terms</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Return Policy</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Product Warranty</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Give us your Feedback</a></li>
          </ul>
        </div>
        <div class="ds-nav-footer__col">
          <h4 class="ds-nav-footer__col-title">Resource</h4>
          <ul class="ds-nav-footer__col-links">
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Documentation</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Glossary</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Audio &amp; Video</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">FS Blog</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Case Studies</a></li>
          </ul>
        </div>
        <div class="ds-nav-footer__col">
          <h4 class="ds-nav-footer__col-title">Support</h4>
          <ul class="ds-nav-footer__col-links">
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">FAQ &amp; Help Center</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Solution Support</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Query Tool</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">WDM Tranceiver Stock List</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Products Verification</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">Track My Order</a></li>
            <li><a class="ds-nav-footer__col-link" aria-disabled="true">RMA Checklist</a></li>
          </ul>
        </div>
        <div class="ds-nav-footer__sidebar">
          <div class="ds-nav-footer__subscribe">
            <h4 class="ds-nav-footer__col-title">Stay in Touch</h4>
            <div class="ds-nav-footer__subscribe-form">
              <input type="email" class="ds-input-footer-source" placeholder="Email" aria-label="Email" data-footer-input-retained-source="">
              <button class="ds-btn ds-btn--filled-red ds-btn--s" type="button" data-footer-button-current=""><span class="ds-btn__text">Subscribe</span></button>
            </div>
          </div>
          <div class="ds-nav-footer__app">
            <h4 class="ds-nav-footer__col-title">Download FS APP</h4>
            <div class="ds-nav-footer__app-badges"><a id="icon-usage-img-google-play" aria-label="Get it on Google Play" style="scroll-margin-top: 40px;" aria-disabled="true"><img src="../sources/navigation/footer-assets-1013/68908-047170.png" alt="Google Play" height="28" style="width: 88px;"></a>
              <a id="icon-usage-img-app-store" aria-label="Download on the App Store" style="scroll-margin-top: 40px;" aria-disabled="true"><img src="../sources/navigation/footer-assets-1013/68908-047171.png" alt="App Store" height="28" style="width: 87.73px;"></a>
              
            </div>
          </div>
          <div class="ds-nav-footer__social"><img src="../sources/navigation/footer-assets-1013/68908-047164.png" alt="LinkedIn, YouTube, Facebook, X, Instagram, Reddit" data-footer-source-social=""></div>
        </div>
      </div>

      <div class="ds-nav-footer__badges">
        <div class="ds-nav-footer__badges-left">
          <img src="../sources/navigation/footer-assets-1013/68908-047076.png" alt="DigiCert" height="28" style="scroll-margin-top: 40px; width: 59px;">
          <img src="../sources/navigation/footer-assets-1013/68908-047074.png" alt="TrustedSite" height="28" style="scroll-margin-top: 40px; width: 58px;">
          <img src="../sources/navigation/footer-assets-1013/68908-047075.png" alt="BBB" height="28" style="scroll-margin-top: 40px; width: 58px;">
          <img src="../sources/navigation/footer-assets-1013/68908-047073.png" alt="Google Reviews" height="28" style="scroll-margin-top: 40px; width: 74px;">
        </div>
        <div class="ds-nav-footer__badges-right">
          <a class="ds-nav-footer__region-link" aria-disabled="true">
            United States / $ USD
            <svg class="ds-nav-footer__dropdown-icon" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#707070" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </a>
        </div>
      </div>

      <hr class="ds-nav-footer__divider">

      <div class="ds-nav-footer__legal">
        <div class="ds-nav-footer__legal-links">
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Site Map</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Accessibility</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Privacy Policy and Notice at Collection</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Cookies Notice</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Terms and Conditions</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Report a Vulnerability</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Do Not Sell or Share My Personal Information</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Company Policies</a>
          <span class="ds-nav-footer__legal-divider"></span>
          <a class="ds-nav-footer__legal-link" aria-disabled="true">Cookie Settings</a>
        </div>
        <div class="ds-nav-footer__copyright">
          Copyright © 2009-2026 FS.COM INC. All Rights Reserved.
        </div>
      </div>
    
  </div>
  </footer>
```

## 行为

- fixedShell：Zero editable fields; preserve Rule 0. DOM changes require separately reviewed source, never a page CSS override.
- links：Existing href=# values are legacy Preview placeholders, not live-site target proof; this literal has no new destination or business implementation.
- footer：US Footer来源锁定Default精确片段：Input047152/022380、022382内部已读取并作为独立源锁定子部件。旧母组件仍删除，非Default输入状态未批准；不得当成当前42px基础Input或通用32px变体。
- source：2026-10-13 PC/Web US Header036747及Footer047031宿主完整节点已读取；Header嵌套原子内部与状态未闭合。Footer保留输入Default子部件已闭合，旧母组件及其他状态仍待。
- productMenu：All Products click/hover/ArrowDown opens source240px child; hoverable trigger+panel region, outside click/focus exit closes, Escape closes and restores trigger. Leaf emits existing ds:menu-navigation-change. No hidden source routing or backend assumed.

## 关系

子组件：text-button、button、input、menu-navigation。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-logo-fs.svg、components/icons/icon-search.svg、components/icons/icon-account.svg、components/icons/icon-cart.svg、components/icons/icon-social-facebook.svg、components/icons/icon-social-x.svg、components/icons/icon-social-instagram.svg、components/icons/icon-social-linkedin.svg、components/icons/icon-social-reddit.svg、components/icons/icon-social-youtube.svg、components/icons/img-app-store.svg、components/icons/img-google-play.svg、components/icons/img-badge-trustpilot.svg、components/icons/img-badge-trustedsite.svg、components/icons/img-badge-bbb.svg、components/icons/img-badge-google.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
