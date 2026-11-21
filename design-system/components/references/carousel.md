# Carousel — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：source-direction-controls-and-external-cards；视觉审阅：pending。

先按MG外部多图/内部单图或多图/首页/主多图区分，再核尺寸、方向及准入。外部48排除详情与解决方案页；内部36/20未开放。Banner用户56与MG48冲突保留。四个方向原子不等于完整轮播，宿主管理定位、热区、切换和禁用。 普通外部内容多卡片已补external-cards：仅同一种普通竖向Card或IconCard，按items真实子调用，2/3/4列；禁止详情/解决方案、Banner、自动播放或混合类型。

必须加载：components/tokens.css、components/components.css、components/card-responsive.css、components/text-button-current.css、components/button-current.css、components/button-runtime-current.css、components/card-current.css、components/cart-current.css、components/tag-current.css、components/list-unordered-current.css、components/tag-product-current.css、components/icon-card-current.css、components/carousel-current.css、components/carousel-external.css、components/card-current.js、components/tag-product-current.js、components/carousel-external.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Direction calls preserve native source button and official28/16 or48/28 SVG geometry. external-cards is a separate div host using those genuine48 controls and same-version typed Card/IconCard calls; preserve source child anatomy and scoped runtime.



不可修改：Direction atoms retain native button type, source direction, official SVG and geometry; no resized substitutes；external-cards retains its own div region, real child calls,48px controls, viewport/track/pagination/status anatomy；No arbitrary HTML, style overrides, mixed child types, Banner autoplay or detail/solution scenario substitution。

## navigation.outlined-m.left

用：明确描边28场景的上一项动作。

不用：卡片48或Banner56不降级替代。

可修改：accessibleLabel、disabled、actionCallback。

```html
<button class="ds-carousel__btn ds-carousel__btn--outlined-m" data-carousel-source-outline28="left-default" data-ai-example="ai-carousel-outlined28-left" type="button" aria-label="Previous slide"><img src="../icons/icon-carousel-outline28-left-current.svg" alt=""></button>
```

## navigation.outlined-m.right

用：明确描边28场景的下一项动作。

不用：卡片48或Banner56不降级替代。

可修改：accessibleLabel、disabled、actionCallback。

```html
<button class="ds-carousel__btn ds-carousel__btn--outlined-m" data-carousel-source-outline28="right-default" data-ai-example="ai-carousel-outlined28-right" type="button" aria-label="Next slide"><img src="../icons/icon-carousel-outline28-right-current.svg" alt=""></button>
```

## navigation.solid-xl.left

用：外部多卡片轮播上一项；排除详情与解决方案页。

不用：不是完整宿主；不替代内部36/20或Banner56。

可修改：accessibleLabel、disabled、actionCallback。

```html
<button class="ds-carousel__btn ds-carousel__btn--xl" data-carousel-source-solid48="left-default" data-ai-example="ai-carousel-solid48-left" type="button" aria-label="Previous slide"><img src="../icons/icon-carousel-solid48-left-current.svg" alt=""></button>
```

## navigation.solid-xl.right

用：外部多卡片轮播下一项；排除详情与解决方案页。

不用：不含分页和内容，不开放其他尺寸。

可修改：accessibleLabel、disabled、actionCallback。

```html
<button class="ds-carousel__btn ds-carousel__btn--xl" data-carousel-source-solid48="right-default" data-ai-example="ai-carousel-solid48-right" type="button" aria-label="Next slide"><img src="../icons/icon-carousel-solid48-right-current.svg" alt=""></button>
```

## external-cards

用：外部普通内容多卡片需左右切换；复用Card或IconCard及48px按钮。

不用：详情页、解决方案页、Banner、主多图、自动播放、横向图文卡及混合卡片类型。

可修改：items、columns、accessibleLabel。

```html
<div class="ds-carousel-external" data-carousel-external="v1" data-rail="external-cards" data-carousel-columns="3" role="region" aria-roledescription="carousel" aria-label="Content cards" data-ai-example="ai-carousel-external-cards"><div class="ds-carousel-external__viewport" data-rail-viewport=""><div class="ds-carousel-external__track rail-track"><div class="ds-carousel-external__item"><div class="ds-card ds-card--vertical ds-card--no-border" data-card-current="vertical-single-event" data-card-layout="parent-grid"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__meta"><span class="ds-card__category">Category</span></div><p class="ds-card__title">Card title</p><div class="ds-card__desc"><p>Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div></div><div class="ds-carousel-external__item"><div class="ds-card ds-card--vertical ds-card--no-border" data-card-current="vertical-single-event" data-card-layout="parent-grid"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__meta"><span class="ds-card__category">Category</span></div><p class="ds-card__title">Card title</p><div class="ds-card__desc"><p>Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div></div><div class="ds-carousel-external__item"><div class="ds-card ds-card--vertical ds-card--no-border" data-card-current="vertical-single-event" data-card-layout="parent-grid"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__meta"><span class="ds-card__category">Category</span></div><p class="ds-card__title">Card title</p><div class="ds-card__desc"><p>Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div></div><div class="ds-carousel-external__item"><div class="ds-card ds-card--vertical ds-card--no-border" data-card-current="vertical-single-event" data-card-layout="parent-grid"><div class="ds-card__image"><img src="../sources/card/preview-assets/img-placeholder.svg" alt="Img 图片占位"></div><div class="ds-card__body"><div class="ds-card__meta"><span class="ds-card__category">Category</span></div><p class="ds-card__title">Card title</p><div class="ds-card__desc"><p>Card description.</p></div><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#"><span class="ds-text-btn__text">Learn more</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt=""></a></div></div></div></div></div></div><div class="ds-carousel-external__control rail-prev"><button class="ds-carousel__btn ds-carousel__btn--xl" data-carousel-source-solid48="left-default" type="button" aria-label="Previous slide"><img src="../icons/icon-carousel-solid48-left-current.svg" alt=""></button></div><div class="ds-carousel-external__control rail-next"><button class="ds-carousel__btn ds-carousel__btn--xl" data-carousel-source-solid48="right-default" type="button" aria-label="Next slide"><img src="../icons/icon-carousel-solid48-right-current.svg" alt=""></button></div><div class="ds-carousel-external__pagination" aria-label="Carousel positions"></div><p class="ds-carousel-external__status" aria-live="polite" aria-atomic="true"></p></div>
```

## 行为

- click：actionCallback是声明式hook名称，渲染为data-library-event-actioncallback；页面宿主监听原生click并按名称绑定动作，不会自动执行同名window函数。宿主管理native disabled，组件不推断slides或业务内容。
- keyboard：Native button focus and activation.
- source：Saved source dates explicitly retained; no online-latest or user visual approval inferred.
- visibility：Regular content carousel host hides direction atoms at rest, reveals on region hover or native keyboard focus-visible and hides after leave/blur; preserve atom geometry and native states. Static Preview matrix and source-specific homepage visibility are separate.
- external：external-cards自带可变内容轨道、48px按钮、首尾禁用和有效位置分页；普通默认隐藏控件，hover/focus显示。PC点击/键盘，Pad/M隐藏方向按钮并原生横向滑动，分页只指示。页内多实例独立，不改子组件内部视觉。

## 关系

子组件：card、icon-card。

已登记父组件：banner。

图标：components/icons/icon-carousel-prev.svg、components/icons/icon-carousel-next.svg、components/icons/icon-carousel-outline28-left-current.svg、components/icons/icon-carousel-outline28-right-current.svg、components/icons/icon-carousel-solid48-left-current.svg、components/icons/icon-carousel-solid48-right-current.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
