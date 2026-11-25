# Banner — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：five-finite-PC-banner-calls-including-owned-search；视觉审阅：pending。

按来源内容选Hero、Sub、Search、Title-only或Mini，再查当前catalog。Search已接真实42px Input私有部件、IconButton和官方FS GPT资源；本地纯白表面及GPT导出图在28px槽内的位置单列待视觉确认。Mini现有120px PC原件使用真实三位分页和手动切换；不代表整套首页轮播或自动播放。Hero单CTA、Sub深色Breadcrumb、Title-only仅标题等原边界保持；不把本地响应式当MG移动原件。 Current five-variant closure 20261115: only supported exact source examples and publication decisions permit local calls. Earlier preview-only or placeholder descriptions are historical; PC geometry and host boundaries remain explicit.

必须加载：components/tokens.css、components/components.css、components/banner-responsive.css、components/banner-current.css、components/button-current.css、components/button-runtime-current.css、components/breadcrumb-current.css、components/text-button-current.css、components/carousel-current.css、components/icon-button-current.css、components/input-search-current.css、components/banner-search-current.css、components/banner-mini-current.css、components/input-search-current.js、components/banner-search-current.js、components/carousel-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

For hero take the complete native single-action root with data-banner-native-hero. Other finite roots retain their prior declared identities and withheld admission.



不可修改：Real Hero inner/title/description/actions structure；Component-owned layout correction and solid Token surface；Real Button outline-white/XL ds-btn__text；No Carousel control-inset formula in Banner content；Existing responsive CSS spacing.56 remains equal to old 56px; no new breakpoint or Pad/M acceptance；Existing PC Sub/Title-only layout; solid-dark Token surface；Native hero1920x420,404px inset and20px gaps; single genuine outline-white/XL Button atom400；Dark source-bound parent image/color surface; no inline component style or extra CTA/Breadcrumb in hero；Sub dark Breadcrumb structure and Title-only no extra content。

## hero-responsive

用：来源标题、描述与单CTA均需完整保留的信息页，使用既有本地响应式实现。

不用：按MG首页M233原件原样还原，或缺少必需描述/CTA。

可修改：title、titleHtml、description、actionLabel、actionCallback、actionHref、actionVariant、secondaryActionLabel、secondaryActionCallback、secondaryActionHref、surface、height、align。

```html
<div class="ds-banner ds-banner--hero ds-banner--hero-responsive" data-preview-skeleton="hero-responsive" data-banner-current="" data-ai-example="ai-banner-hero-current"><div class="ds-banner__responsive-inner"><p class="ds-banner__title">This is a banner title</p><p class="ds-banner__desc">This is a Banner description text</p><div class="ds-banner__actions"><button type="button" class="ds-btn ds-btn--outline-white ds-btn--xl"><span class="ds-btn__text">Primary action</span></button></div></div></div>
```

## sub

用：1920px解决方案页标题、描述与当前模板的深色面包屑。

不用：需要搜索、首页单CTA，或需要删除当前固定面包屑。

可修改：title、description、breadcrumb。

```html
<div class="ds-banner ds-banner--sub" data-banner-static="" data-ai-example="ai-banner-sub-static"><nav class="ds-breadcrumb ds-breadcrumb--dark" data-breadcrumb-current aria-label="Breadcrumb">
        <div class="ds-breadcrumb__item">
          <a href="#" class="ds-breadcrumb__link">Home</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
        </div>
        <div class="ds-breadcrumb__item">
          <a href="#" class="ds-breadcrumb__link">Page A</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
        </div>
        <div class="ds-breadcrumb__item">
          <span class="ds-breadcrumb__current">Current Page</span>
        </div>
      </nav><p class="ds-banner__title">This is a banner title</p><p class="ds-banner__desc">This is a Banner description text</p></div>
```

## title-only

用：1920×200专题/外围/分类页，核心内容只有标题。

不用：有描述、CTA或搜索输入，需要保留完整内容。

可修改：title。

```html
<div class="ds-banner ds-banner--title-only" data-banner-static="" data-ai-example="ai-banner-title-only-static"><p class="ds-banner__title">This is a banner title</p></div>
```

## hero

用：仅1920桌面首页，完整标题、描述和一个白色描边XL按钮。

不用：需要搜索、无描述/按钮、图文并列内容卡或窄窗口。

可修改：title、description、actionLabel、actionCallback。

```html
<div class="ds-banner ds-banner--hero" data-banner-native-hero="" data-ai-example="ai-banner-hero-static"><p class="ds-banner__title">This is a banner title</p><p class="ds-banner__desc">This is a Banner description text</p><div class="ds-banner__actions"><button type="button" class="ds-btn ds-btn--outline-white ds-btn--xl"><span class="ds-btn__text">Button Name</span></button></div></div>
```

## search

用：知识库或案例页的关键词搜索顶部，42px真实搜索输入与FS GPT宿主入口。

不用：普通产品选择、自动搜索结果、已接入AI回答或手机布局。

可修改：title、description、placeholder、searchLabel、searchCallback、gptCallback。

```html
<div class="ds-banner ds-banner--search" data-banner-search-current data-ai-example="ai-banner-search-current"><div class="ds-banner__search-copy"><p class="ds-banner__title">This is a banner title</p><p class="ds-banner__desc">This is a Banner description text</p></div><div class="ds-banner__search-row"><form class="ds-input-search" data-input-part="banner-search42" data-input-search-surface="gray" role="search"><input class="ds-input-search__field" type="search" placeholder="Search all Case Studies" aria-label="Search"><button class="ds-icon-btn ds-icon-btn--plain ds-icon-btn--m" type="button" aria-label="Search"><img class="ds-icon-btn__icon" src="../icons/icon-button-search-m-default.svg" alt=""></button></form><button class="ds-banner__gpt" type="button"><span class="ds-banner__gpt-slot"><img src="../sources/banner/gpt28-native-official-1015.svg" alt=""></span><span class="ds-banner__gpt-label">FS GPT</span><img class="ds-banner__gpt-arrow" src="../icons/mastergo-library/通用Icon/33189-59138.svg" alt=""></button></div></div>
```

## mini

用：PC商品详情内容中的120px窄幅信息，需真实三项分页切换。

不用：首页Hero、自动播放大图或未核对的M/Pad形态。

可修改：slides。

```html
<div class="ds-banner ds-banner--mini" data-banner-mini-runtime="source-three" data-ai-example="ai-banner-mini-current" role="region" aria-roledescription="carousel" aria-label="Product information"><div class="ds-banner__mini-slides"><div class="ds-banner__mini-slide" id="mini-slide-0" aria-hidden="false"><img class="ds-banner__mini-image" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""><div class="ds-banner__mini-content"><p class="ds-banner__title">Optical Transceivers Testing</p><p class="ds-banner__desc">Take a look at our test program to get the reliable and high-performaance optical transceivers</p><a class="ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-blue-s.svg" alt=""></a></div></div><div class="ds-banner__mini-slide" id="mini-slide-1" hidden aria-hidden="true" inert><img class="ds-banner__mini-image" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""><div class="ds-banner__mini-content"><p class="ds-banner__title">Find Technical Support</p><p class="ds-banner__desc">Find technical support and product resources.</p><a class="ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-blue-s.svg" alt=""></a></div></div><div class="ds-banner__mini-slide" id="mini-slide-2" hidden aria-hidden="true" inert><img class="ds-banner__mini-image" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""><div class="ds-banner__mini-content"><p class="ds-banner__title">Warranty and Returns</p><p class="ds-banner__desc">Warranty and returns information.</p><a class="ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-blue-s.svg" alt=""></a></div></div></div><div class="ds-banner__mini-pagination"><div class="ds-carousel__dots" data-carousel-mini-pagination aria-label="Banner positions"><button class="ds-carousel__dot ds-carousel__dot--active" type="button" aria-label="Slide 1" aria-controls="mini-slide-0" aria-current="true"></button><button class="ds-carousel__dot" type="button" aria-label="Slide 2" aria-controls="mini-slide-1"></button><button class="ds-carousel__dot" type="button" aria-label="Slide 3" aria-controls="mini-slide-2"></button></div></div></div>
```

## 行为

- action：Native Button click callback supplied by page; no built-in navigation or business result.
- location：Banner only first/second content module after Header. Full-copy Hero keeps title/description/actions; Sub title/description; Title-only just title. Never infer absent source slots.
- source：Desktop home Hero original COMPONENT and Button reference now established by native-hero-review-1028; other variants retain their prior source limitations.
- geometry：Existing 1200px inner and desktop type styles retained; actual browser centering/geometry/contrast remains pending. This does not approve new Pad/M behavior.
- sub：Existing 320px Sub layout and component content inset with complete dark Breadcrumb; no CTA in canonical call. Child default/dark family relation remains source-scoped, no arbitrary cross-surface styling.
- titleOnly：Existing 200px centered-title layout with no other content in finite call; Breadcrumb optional at family level, omitted here to keep one exact title-only assembly.
- visual：Only authored structures and local Token CSS proven. Actual 320/200px geometry, 1200 inset, centered 960 title and color contrast still require allowed PC browser proof.
- hero：Native1920 desktop single-image home Hero. Parent supplies evidence-backed image and applicable FS scrim or dark FS surface. Title/description/one real outline-white42px Button; callback binds native click. Source dots are excluded from this finite single-image use, not migrated as invented Banner pagination.
- search：Input负责原生搜索字段及Enter/搜索按钮；Banner发出搜索/GPT意图，不提供后端搜索或AI回答。
- mini：Source three-position PC120px Mini. Actual slide content, original TextButton and Carousel pagination; manual click/Arrow/Home/End, hidden/inert inactive content,600ms horizontal content motion with reduced-motion support. No inferred autoplay.

## 关系

子组件：button、button、breadcrumb、text-button、carousel、input、icon-button。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-search.svg、components/icons/icon-text-button-arrow-right-blue-s.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
