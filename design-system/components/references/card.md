# Card — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：ten-finite-source-backed-PC-card-shapes；视觉审阅：pending。

按普通内容、分类多链接、搜索结果、最近浏览或产品选购选型，再核对布局、背景与设备。当前十个精确调用含描边通栏、嵌入详情和完整产品卡；侧栏仍参考。Card真实引用List、Tag和Cart；仅按allowedEdits修改内容，不自动扩展移动端或业务请求。 Current five-variant closure 20261115: only supported exact source examples and publication decisions permit local calls. Earlier preview-only or placeholder descriptions are historical; PC geometry and host boundaries remain explicit.

必须加载：components/tokens.css、components/components.css、components/card-responsive.css、components/text-button-current.css、components/button-current.css、components/button-runtime-current.css、components/card-current.css、components/cart-current.css、components/menu-navigation-current.css、components/tag-current.css、components/list-unordered-current.css、components/tag-product-current.css、components/card-completion-current.css、components/card-sidebar-current.css、components/card-current.js、components/tag-product-current.js、components/menu-navigation-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Complete actual image + body, selected stack/meta/description wrappers, and real inline-black/M TextButton. No Preview inline sizing, placeholder media or fictitious action child. Bordered horizontal auto-call withdrawn pending scrollbar/tall-content and visual verification; vertical metadata is category plaintext. Current vertical requires data-card-current=vertical-single-event.



不可修改：True Card image/body/content-stack/link hierarchy；Current opt-in Card stylesheet and shared base styles；Genuine TextButton inline-black/M label + registered arrow；Native spacing, typography, radius and states; vertical single-event current parent-grid sizing is defined below, no page CSS overrides；Exact horizontal border or vertical no-border variant; parent surface per contract；Vertical meta/description wrappers and bordered horizontal full bullet fragments；Source on variant: three inside body edges only; root and image unbordered; Default/Hover geometry identical；spliced.vertical.single-event.bordered页面调用须configuration.parentGrid=1200/4/20、quantity4及outputGroup；只声明cardCount4不能冒称真实4栏285几何。。

## spliced.horizontal.full-width.responsive

用：明确需适配的左右图文通栏。

不用：旧页、侧栏和描边形态不自动升级。

可修改：title、description、image、linkLabel、href、imagePosition、sourceAbsent。

```html
<div class="ds-card ds-card--horizontal ds-card--source-responsive" data-preview-skeleton="horizontal-responsive" data-card-current="horizontal-unbordered" data-ai-example="ai-card-horizontal-current"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__content-stack"><p class="ds-card__title">Card title</p><p class="ds-card__desc">Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div>
```

## spliced.horizontal.full-width

用：一行独占版心的左右图文。

不用：侧栏、网格单格或描边半区。

可修改：title、description、image、linkLabel、href、imagePosition、sourceAbsent。

```html
<div class="ds-card ds-card--horizontal" data-card-current="horizontal-unbordered" data-ai-example="ai-card-spliced-horizontal-full-width"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__content-stack"><p class="ds-card__title">Card title</p><p class="ds-card__desc">Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div>
```

## spliced.vertical.single-event

用：普通内容图上文下，灰色父级。

不用：分类链接入口或专用产品选购。

可修改：title、description、image、linkLabel、href、category、sourceAbsent。

```html
<div class="ds-card ds-card--vertical ds-card--no-border" data-card-current="vertical-single-event" data-card-layout="parent-grid" data-ai-example="ai-card-spliced-vertical-single-event"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__meta"><span class="ds-card__category">Category</span></div><p class="ds-card__title">Card title</p><div class="ds-card__desc"><p>Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div>
```

## spliced.vertical.single-event.bordered

用：白色父级PC四栏的285px图文卡。

不用：灰父级或其他宽度网格不外推。

可修改：title、description、image、linkLabel、href、category、sourceAbsent。

```html
<div class="ds-card ds-card--vertical ds-card--bordered" data-card-current="vertical-single-event" data-ai-example="ai-card-spliced-vertical-single-event-bordered"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__meta"><span class="ds-card__category">Category</span></div><p class="ds-card__title">Card title</p><div class="ds-card__desc"><p>Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div>
```

## embedded.product-standard

用：搜索结果页产品展示卡。

不用：普通内容页不默认套搜索产品卡。

可修改：title、description、image、linkLabel、href、surface。

```html
<div class="ds-card ds-card--embedded ds-card--embedded-standard ds-card--embedded-standard-bg-white" data-card-current="embedded-standard" data-card-surface="white" data-ai-example="ai-card-embedded-standard-current">
          <div class="ds-card__product-image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div>
          <div class="ds-card__product-body">
            <p class="ds-card__product-title">This is a card title</p>
            <p class="ds-card__product-description">This is a card description. This is a card description. This is a card description.</p>
            <div class="ds-card__product-link">
              <a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#">
                <span class="ds-text-btn__text">Learn more</span>
                <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt="">
              </a>
            </div>
          </div>
        </div>
```

## embedded.product-small

用：最近浏览式产品图、标题和价格。

不用：参数、库存、销量或新品不能据此补画。

可修改：title、price、image。

```html
<div class="ds-card--embedded ds-card--embedded-small ds-card--embedded-bg-gray ds-card" data-card-current="embedded-small" data-ai-example="ai-card-embedded-small-current">
          <img class="ds-card__product-image" src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位">
          <div class="ds-card__product-body">
            <p class="ds-card__product-title">FMU 2-Slot 1U 19" Rack Chassis Unloaded, Holds up to 2 Units FMU Plug-in Module</p>
            <p class="ds-card__product-price">US$ 160.00</p>
          <div class="ds-card__add-btn ds-card__cart-slot"><button class="ds-cart ds-cart--product-card" type="button"><img class="ds-cart__icon" src="../icons/icon-cart-add.svg" alt=""><span class="ds-cart__text">Add</span></button></div></div>
          
        </div>
```

## spliced.vertical.category-nav

用：图片、标题及多个独立分类链接。

不用：仅一个普通操作或长描述。

可修改：title、image、subLinks。

```html
<div class="ds-card ds-card--vertical ds-card--no-border" data-card-current="category-nav" data-ai-example="ai-card-category-nav-current">
          <div class="ds-card__image">
            <img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位">
          </div>
          <div class="ds-card__body">
            <span class="ds-card__title ds-card__title--single-line">This is a card title</span>
            <div class="ds-card__sub-links">
              <span class="ds-card__sub-link">10G Switches</span>
              <span class="ds-card__sub-link">25G Switches</span>
              <span class="ds-card__sub-link">40G Switches</span>
              <span class="ds-card__sub-link">100G Switches</span>
              <span class="ds-card__sub-link">400G Switches</span>
            </div>
          </div>
        </div>
```

## embedded.product-detail

用：产品小图、标题、说明及参数列表，横向嵌入式详情卡片。

不用：没有参数列表、完整选购或价格/库存操作。

可修改：image、title、description、items。

```html
<div class="ds-card--embedded ds-card--embedded-detail ds-card" data-card-current="embedded-detail" data-ai-example="ai-card-completion-embedded-product-detail">
          <div class="ds-card__product-image-wrap"><img class="ds-card__product-image" src="../sources/card/preview-assets/img-placeholder.svg" alt="Reference product image"></div>
          <div class="ds-card__product-body">
            <div>
              <p class="ds-card__product-title">IPC301-5M-D</p>
              <p class="ds-card__product-subtitle">Key Applications: shopping area, entrance and exit</p>
            </div>
            <div class="ds-list ds-list--unordered-12" data-list-current="unordered" data-list-source="legacy-fixed"><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div></div>
          </div>
        </div>
```

## embedded.product-full

用：完整产品选购卡：兼容标签、参数、价格、库存、销量评价及真实Cart加购按钮同时存在。

不用：普通图文展示，或来源没有兼容标签、库存与选购数据。

可修改：image、title、price、stock、soldCount、reviewCount、items、compatibility。

```html
<div class="ds-card--embedded ds-card--embedded-full ds-card--embedded-bg-gray ds-card" data-card-source-server-list="official" data-card-source-node="68908:037032" data-card-current="embedded-full" data-ai-example="ai-card-completion-embedded-product-full">
          <div class="ds-card__product-image"><img class="ds-card__product-image" src="../sources/card/preview-assets/img-placeholder.svg" alt="Reference product image"></div>
          <div class="ds-card__product-body">
            <div class="ds-card__compat-tags">
              <button class="ds-tag ds-tag--product-small" type="button" aria-pressed="false" data-tag-product="current" data-tag-image="false"><span class="ds-tag__product-label">Cisco</span></button>
              <button class="ds-tag ds-tag--product-small" type="button" aria-pressed="true" data-tag-product="current" data-tag-image="false"><span class="ds-tag__product-label">Juniper</span></button>
              <button class="ds-tag ds-tag--product-small" type="button" aria-pressed="false" data-tag-product="current" data-tag-image="false"><span class="ds-tag__product-label">Arista</span></button>
              <button class="ds-tag ds-tag--product-small ds-tag--product-custom" type="button" aria-pressed="false" data-tag-product="current" data-tag-image="false"><span class="ds-tag__product-label">Customized</span></button>
            </div>
            <p class="ds-card__title">S5860-24XB-U, 24-Port Multi-Gigabit Ethernet L3 Fully Managed Pro Co…</p>
            <p class="ds-card__price">US$ 9,502.00</p>
            <div class="ds-list ds-list--unordered-12" data-list-current="unordered" data-list-source="legacy-fixed"><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div></div>
            <div class="ds-card__stock">
              <span class="ds-card__stock-text">Pre-order, Ship by 30 Jul, 2025</span>
            </div>
            <div class="ds-card__stats">
              <span><span class="ds-card__sold-count">15</span><span class="ds-card__sold-label"> Sold</span></span>
              <div class="ds-card__stats-divider"></div>
              <span><span class="ds-card__review-count">10</span><span class="ds-card__review-label"> Reviews</span></span>
              <div class="ds-card__add-btn ds-card__cart-slot"><button class="ds-cart ds-cart--product-card" type="button"><img class="ds-cart__icon" src="../icons/icon-cart-add.svg" alt=""><span class="ds-cart__text">Add</span></button></div>
            </div>
          </div>
          <div class="ds-card__tag-slot"><span class="ds-tag ds-tag--semantic ds-tag--new ds-tag--emphasis" data-tag-source-new="official"><span class="ds-tag__label">New</span></span></div>
        </div>
```

## spliced.horizontal.full-width.bordered-background

用：左右图文通栏，文本区明确为描边/白底，包含可滚动参数列表。

不用：没有描边表面、无侧边结构或移动端自由尺寸。

可修改：title、description、image、linkLabel、href、items。

```html
<div class="ds-card ds-card--horizontal ds-card--horizontal-bordered" data-card-source-layout-one-list="official" data-source-example="card-layout-one-pc-bordered" data-card-source-layout-one-title="official" data-ai-example="ai-card-completion-spliced-horizontal-full-width-bordered-background">
        <div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div>
        <div class="ds-card__body">
          <div class="ds-card__content-stack">
            <p class="ds-card__title ds-card__title--single-line">This is card title, This is card title, This is card title</p>
            <p class="ds-card__desc">This is the description, This is the description, This is the description, This is the description.</p>
            <div class="ds-list ds-list--unordered-12" data-list-current="unordered" data-list-source="legacy-fixed"><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div></div>
          </div>
          <div class="ds-card__link">
            <a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#">
              <span class="ds-text-btn__text">Learn more</span>
              <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt="">
            </a>
          </div>
        </div>
      </div>
```

## spliced.horizontal.with-sidebar

用：PC左侧真实菜单＋无描边左右图文内容，图文源件为样式二。

不用：没有实际侧栏、普通通栏卡片或M/Pad适配。

可修改：title、description、image、linkLabel、href、sidebar。

```html
<div class="ds-card--horizontal-sidebar" data-card-sidebar-current="plain" data-ai-example="ai-card-sidebar-plain"><div class="ds-card__sidebar-layout"><aside class="ds-card__sidebar-shell"><nav class="ds-menu-navigation ds-menu-navigation--single-level ds-menu-navigation--width-288" data-menu-navigation-current="menu-atom" data-menu-navigation="" aria-label="Product information sections" data-menu-card-sidebar="current">
          <ul class="ds-menu-navigation__list">
            <li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="fiber-optic-cables" aria-pressed="true"><span class="ds-menu-navigation__item-label">Fiber Optic Cables</span></button></li>
            <li><button class="ds-menu-navigation__item" type="button" data-value="panels-enclosures-racks"><span class="ds-menu-navigation__item-label">Panels, Enclosures &amp; Racks</span></button></li>
            <li><button class="ds-menu-navigation__item" type="button" data-value="testers-tools"><span class="ds-menu-navigation__item-label">Testers &amp; Tools</span></button></li>
          </ul>
        </nav></aside><div class="ds-card__content-area"><div class="ds-card ds-card--horizontal" data-card-sidebar-content="plain"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__content-stack"><p class="ds-card__title">Card title</p><p class="ds-card__desc">Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div></div></div></div>
```

## spliced.horizontal.with-sidebar.bordered-background

用：PC左侧真实菜单＋左右图文内容，文字半区需原件描边与List12。

不用：没有实际侧栏、普通通栏卡片或M/Pad适配。

可修改：title、description、image、linkLabel、href、sidebar、items。

```html
<div class="ds-card--horizontal-sidebar" data-card-sidebar-current="bordered" data-ai-example="ai-card-sidebar-bordered"><div class="ds-card__sidebar-layout"><aside class="ds-card__sidebar-shell"><nav class="ds-menu-navigation ds-menu-navigation--single-level ds-menu-navigation--width-288" data-menu-navigation-current="menu-atom" data-menu-navigation="" aria-label="Product information sections" data-menu-card-sidebar="current">
          <ul class="ds-menu-navigation__list">
            <li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="fiber-optic-cables" aria-pressed="true"><span class="ds-menu-navigation__item-label">Fiber Optic Cables</span></button></li>
            <li><button class="ds-menu-navigation__item" type="button" data-value="panels-enclosures-racks"><span class="ds-menu-navigation__item-label">Panels, Enclosures &amp; Racks</span></button></li>
            <li><button class="ds-menu-navigation__item" type="button" data-value="testers-tools"><span class="ds-menu-navigation__item-label">Testers &amp; Tools</span></button></li>
          </ul>
        </nav></aside><div class="ds-card__content-area"><div class="ds-card ds-card--horizontal ds-card--horizontal-bordered" data-card-source-layout-one-list="official" data-source-example="card-layout-one-pc-bordered" data-card-source-layout-one-title="official" data-card-sidebar-content="bordered">
        <div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div>
        <div class="ds-card__body">
          <div class="ds-card__content-stack">
            <p class="ds-card__title ds-card__title--single-line">This is card title, This is card title, This is card title</p>
            <p class="ds-card__desc">This is the description, This is the description, This is the description, This is the description.</p>
            <div class="ds-list ds-list--unordered-12" data-list-current="unordered" data-list-source="legacy-fixed"><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div></div>
          </div>
          <div class="ds-card__link">
            <a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#">
              <span class="ds-text-btn__text">Learn more</span>
              <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt="">
            </a>
          </div>
        </div>
      </div></div></div></div>
```

## 行为

- static：普通内容按真实TextButton导航；产品选购使用真实Tag、List12和Cart，选择/加购业务由宿主处理。原稿和当前调用的资格分别记录。
- content：Image, title, description and link text are page content; existing Pexels photo is replaceable and not MG visual evidence.
- source：Partial native independent norm and actual PC/vertical nodes linked separately from historical generated export; remaining shape/slot/state sources pending.
- geometry：本批实测当前精确调用的受控图文方向、文档宽度和资源。桌面文档渲染不构成全设备视觉批准。

## 关系

子组件：text-button、tag、button、list、list、tag、tag、tag、tag、menu-navigation、menu-navigation。

已登记父组件：carousel。

图标：components/icons/icon-bullet.svg、components/icons/icon-featured-star.svg、components/icons/icon-cart-add.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
