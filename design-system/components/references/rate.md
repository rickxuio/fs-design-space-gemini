# Rate — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：finite-display-source-clear-input-and-count-derived-summary；视觉审阅：pending。

单值只读用display；邀评输入用input；综合分值、评价总数和5至1星统计用summary。summary仅接受五项统计数量和筛选事件，固定16px官方图标、浅灰评分块及88px统计条。带图库和标签用Comment/rating-summary，它真实引用Rate/summary。原input尺寸与Clear限制保持；小数汇总只做显示适配，不开放半星输入或自由配色。

必须加载：components/tokens.css、components/components.css、components/rate-summary-current.css、components/rate-current.js、components/rate-summary-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。Open Sans stack; current source summary measured with local Open Sans400/600; whole-family visual approval remains pending.

Display/input preserve five full stars; aggregate summary uses five official SVG layers with documented decimal display cropping. Display on/off sequence, aria-label and optional label agree. Canonical input retains group, five radio buttons, hidden machine output and Clear, with locked data-rate-clear-only. Clear-only does not display explanation alongside Clear.

Business grade words must be supplied, not invented. Input groupLabel is nonempty; labels is five strings, empty entries fall back to numeric value.

不可修改：Five official stars and finite sizes; display/input integer-only, summary count-derived display；Noninteractive display role=img；Input radiogroup/radio and safe button types；Output and Clear structure；Shared CSS and actual rate.js behavior；data-rate-current marker on input specimens；Count-derived summary,official SVGs,source geometry,semantic progress and cancelable filter; decimal visual clipping is a documented display adaptation；Canonical clear-only marker and hidden machine output; no visible explanation/Clear combination。

## display

用：既有单值评分的只读展示。

不用：用户要修改分值、半星或聚合评论。

可修改：ratingContent。

默认尺寸：sm；可选尺寸：sm、md、lg。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<div class="ds-rate ds-rate--display ds-rate--sm" data-ai-example="ai-rate-display-sm" role="img" aria-label="5 out of 5 stars">
          <span class="ds-rate__stars" aria-hidden="true">
            <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
            <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
            <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
            <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
            <img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt="">
          </span>
          <span class="ds-rate__label ds-rate__label--muted">5.0</span>
        </div>
```

## input

用：邀评场景需要完整五星输入及现有Clear。

不用：其他反馈表单不应自动加Clear；半星或原生表单值。

可修改：value、labels、groupLabel、changeCallback。

默认尺寸：md；可选尺寸：md、lg。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<div class="ds-rate ds-rate--input ds-rate--md" data-ai-example="ai-rate-input-md" data-rate-clear-only="" data-rate-current="" data-rate="" data-value="5" data-rate-labels="[&quot;&quot;,&quot;&quot;,&quot;&quot;,&quot;&quot;,&quot;Excellent&quot;]" aria-disabled="false">
          <div class="ds-rate__control" role="radiogroup" aria-label="Product rating">
            <button class="ds-rate__star-button" type="button" role="radio" aria-checked="false" data-value="1" aria-label="1 star"><img class="ds-rate__star" src="../icons/icon-rate-on-20.svg" alt=""></button>
            <button class="ds-rate__star-button" type="button" role="radio" aria-checked="false" data-value="2" aria-label="2 stars"><img class="ds-rate__star" src="../icons/icon-rate-on-20.svg" alt=""></button>
            <button class="ds-rate__star-button" type="button" role="radio" aria-checked="false" data-value="3" aria-label="3 stars"><img class="ds-rate__star" src="../icons/icon-rate-on-20.svg" alt=""></button>
            <button class="ds-rate__star-button" type="button" role="radio" aria-checked="false" data-value="4" aria-label="4 stars"><img class="ds-rate__star" src="../icons/icon-rate-on-20.svg" alt=""></button>
            <button class="ds-rate__star-button" type="button" role="radio" aria-checked="true" data-value="5" aria-label="5 stars"><img class="ds-rate__star" src="../icons/icon-rate-on-20.svg" alt=""></button>
          </div>
          <span class="ds-rate__label" data-rate-output="" hidden="">Excellent</span>
          <button class="ds-rate__clear" type="button">Clear</button>
        </div>
```

## summary

用：产品综合评分、评价数量、5至1星占比及统计筛选。

不用：把输入评分或整套评论列表当汇总。

可修改：counts、filterCallback。

```html
<div class="ds-rate ds-rate--summary" data-rate-summary-current="" data-rate-summary-counts="[28,14,0,0,0]" data-ai-example="ai-rate-summary-current" aria-label="Rating summary: 4.7 out of 5 from 42 reviews"><div class="ds-rate__score-card"><span class="ds-rate__summary-score">4.7</span><span class="ds-rate__stars" role="img" aria-label="4.7 out of 5 stars"><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span><span class="ds-rate__summary-star"><img class="ds-rate__star" src="../icons/icon-rate-off-16.svg" alt=""><span class="ds-rate__summary-star-fill"><img class="ds-rate__star" src="../icons/icon-rate-on-16.svg" alt=""></span></span></span><span class="ds-rate__review-count">(42 reviews)</span></div><div class="ds-rate__distribution" role="group" aria-label="Rating distribution"><button class="ds-rate__distribution-row" type="button" value="5" aria-pressed="false" aria-describedby="rate-summary-tooltip-5"><span class="ds-rate__distribution-label">5 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="5 stars: 28 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="28"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">28</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-5" hidden="">28 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="4" aria-pressed="false" aria-describedby="rate-summary-tooltip-4"><span class="ds-rate__distribution-label">4 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="4 stars: 14 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="14"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">14</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-4" hidden="">14 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="3" aria-pressed="false" aria-describedby="rate-summary-tooltip-3" disabled=""><span class="ds-rate__distribution-label">3 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="3 stars: 0 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="0"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">0</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-3" hidden="">0 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="2" aria-pressed="false" aria-describedby="rate-summary-tooltip-2" disabled=""><span class="ds-rate__distribution-label">2 stars</span><span class="ds-rate__progress" role="progressbar" aria-label="2 stars: 0 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="0"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">0</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-2" hidden="">0 reviews</span></button><button class="ds-rate__distribution-row" type="button" value="1" aria-pressed="false" aria-describedby="rate-summary-tooltip-1" disabled=""><span class="ds-rate__distribution-label">1 star</span><span class="ds-rate__progress" role="progressbar" aria-label="1 star: 0 reviews" aria-valuemin="0" aria-valuemax="42" aria-valuenow="0"><span class="ds-rate__progress-fill"></span></span><span class="ds-rate__distribution-count">0</span><span class="ds-rate__summary-tooltip" role="tooltip" id="rate-summary-tooltip-1" hidden="">0 reviews</span></button></div></div>
```

## 行为

- display：No runtime display updater. Structured ratingContent must synchronize icons, aria-label and optional existing label.
- initialization：Current runtime has one document guard and MutationObserver reconciliation for current inputs; no public setValue API. Do not load legacy rate.js alongside it.
- preview：pointerover previews only icons while explanation/hidden state, data-value and aria-checked preserve the committed selection; pointerout restores committed stars.
- commit：Star click, Clear and keyboard emit ds:rate-change even for repeated same value; detail contains value/previousValue/label/source.
- keyboard：Arrows move from the focused button, Home/End select 1/5, Enter/Space commit current star; Clear selects 0 and focuses first star.
- disabled：Runtime initializes disabled class or aria-disabled. Enabled canonical calls do not expose state editing; changing class after initialization does not synchronize runtime state.
- business：No native form field or request. Host listens to the component event.
- currentGuard：Current document guard prevents duplicate event handlers; native disabled fieldsets/explicit custom disabled state update controls and tabstops. Legacy Comment host input without marker is not automatically upgraded.
- summary：Source-bound summary: gray score card,official16px on/off SVGs,88px progress; counts derive score,total and percentage. Hover/focus underline,Gray7 surface and white empty track;13px feedback; cancelable ds:rate-filter. Decimal star clipping is a documented display adaptation, not a new input variant or visual approval.
- hover：Preview stars only; preserve committed explanation text and hidden state until selection. Source v1.2.2604A2.1/4.2.
- clearOnly：Locked data-rate-clear-only keeps output hidden for initialization, hover, commits and Clear; callback data remains available. Unmarked generic input behavior unchanged.

## 关系

子组件：无。

已登记父组件：comment。

图标：components/icons/icon-rate-on-16.svg、components/icons/icon-rate-off-16.svg、components/icons/icon-rate-on-20.svg、components/icons/icon-rate-off-20.svg、components/icons/icon-rate-on-24.svg、components/icons/icon-rate-off-24.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
