# OptionSelector — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：desktop-plain-h7-media-and-compact-SKU-price-product-radio-options-MG-Tag-PC-color-and-accessory；视觉审阅：pending。

Use full plain H7 media or two-line detail product radio button. Every operational call needs the existing radiogroup wrapper with an accessible name and >=2 unique nonempty values; alone the specimen is presentation-only. 当前《新文件》仅核实Radio结算插槽边界；OptionSelector独立规范未定位，保留本地兼容范围，不标为全族MG通过。 颜色与服务已定位Tag常规属性/配件属性；颜色复用Select下拉，服务复用原生Checkbox。仅PC，不沿本地草案的Radio/24px图/M横向行。

必须加载：components/tokens.css、components/components.css、components/checkbox-current.css、components/option-selector-current.css、components/tag-configuration-current.css、components/select-current.css、components/option-configuration-current.css、components/checkbox-current.js、components/option-selector-current.js、components/select-current.js、components/option-configuration-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

media/product retain named radiogroup and unique values. color uses Tag PC trigger + existing Select single listbox. service uses Tag PC accessory + native Checkbox. These four current call shapes have separate semantics and allowed content; no page style overrides.



不可修改：Safe button/radio native semantics；Plain H7 media or compact SKU/price product structure; source example retained；Single-selection group assembly；Current reusable runtime and shared CSS。

## media

用：图文内容本身构成互斥配置；当前仅已登记无框H7。支付品牌不据此选型。

不用：只有圆形状态图加单行文字时使用 Radio regular；仅靠颜色辨识时使用 color；需要商品、价格等复合双行信息时使用 product；不得把 104/95/111px specimen 宽度写入生产 CSS。

可修改：label、value、disabled、changeCallback。

```html
<button class="ds-option-selector ds-option-selector--plain" data-ai-example="ai-option-selector-media" value="media-option" type="button" role="radio" aria-checked="false" tabindex="-1"><img class="ds-option-selector__media" src="../icons/goods-包裹.svg" alt=""><span class="ds-option-selector__label">100 QSFP28</span></button>
```

## product

用：商品/SKU与价格共同构成互斥配置；按现有本地规范候选，当前MG独立来源未定位。

不用：只有圆形状态图加主副文本的结算地址、配送或支付项使用 Radio bordered-detail；可独立加购服务使用 service；支付品牌 Logo-only 使用 media + payment；不得把 378px specimen 宽度固化为生产宽度。

可修改：label、price、image、value、disabled、changeCallback。

```html
<button class="ds-option-selector ds-option-selector--sm ds-option-selector--product" data-ai-example="ai-option-selector-product" value="product-option" type="button" role="radio" aria-checked="false" tabindex="-1"><img class="ds-option-selector__media" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""><span class="ds-option-selector__label">IES5220-4T4FP-E | 4x 1Gb RJ45</span><span class="ds-option-selector__price">US$1,669.00</span><span class="ds-option-selector__disclosure" aria-hidden="true"></span></button>
```

## color

用：PC产品属性文本＋颜色下拉：306×30，14px色块，复用Select单选。

不用：仅色块Tag、Radio按钮组、M端42px形态或用颜色替代语义图标。

可修改：options、changeCallback。

```html
<div data-ai-example="ai-option-color-source" class="ds-select ds-option-selector--color" data-option-color-current="mg-pc" data-select-mode="single" id="configuration-color"><button class="ds-select__trigger" type="button" role="combobox" aria-haspopup="listbox" aria-label="Color: Blue" aria-expanded="false" aria-controls="configuration-color-panel" id="configuration-color-trigger"><span class="ds-tag ds-tag--configuration-color" data-tag-part="configuration-color"><span class="ds-tag__configuration-swatch" aria-hidden="true"></span><span class="ds-tag__configuration-label ds-select__value" data-placeholder="Blue">Blue</span><img class="ds-tag__configuration-arrow ds-select__arrow" src="../icons/icon-select-down.svg" alt=""></span></button><div class="ds-select__panel" role="listbox" hidden="" id="configuration-color-panel" aria-labelledby="configuration-color-trigger" data-select-part="configuration-color-options"><div class="ds-select__list"><div class="ds-select__option" role="option" aria-selected="true" data-value="blue" data-color="#5A82F7" id="configuration-blue"><span class="ds-select__option-label">Blue</span></div><div class="ds-select__option" role="option" aria-selected="false" data-value="black" data-color="#19191A" id="configuration-black"><span class="ds-select__option-label">Black</span></div></div></div></div>
```

## service

用：PC配件或可独立加购服务：264×80、64px图，Checkbox多选。

不用：互斥套餐、M端右侧Checkbox服务行、库存与加购后端。

可修改：label、price、image、value、disabled、changeCallback。

```html
<label data-ai-example="ai-option-service-source" class="ds-option-selector--service ds-tag ds-tag--accessory-pc" data-option-service-current="mg-pc" data-tag-part="configuration-service"><span class="ds-option-selector__checkbox ds-checkbox ds-checkbox--sm" data-checkbox-current="" data-checkbox-control=""><input class="ds-option-selector__input ds-checkbox__input" type="checkbox" name="services" value="one-year"><span class="ds-checkbox__box" aria-hidden="true"></span></span><img class="ds-option-selector__media" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="Service accessory reference"><span class="ds-option-selector__content"><span class="ds-option-selector__label">1 Year Service</span><span class="ds-option-selector__price">US$109.00</span></span></label>
```

## 行为

- group：Existing .ds-option-selector-group[role=radiogroup] required; initialization makes first enabled option tabbable if none selected. Click and arrows select once and emit ds:option-selector-change with value/label. Groups independent; no submission or navigation.
- disabled：Native disabled option is cleared and skipped; current runtime also ignores synthetic disabled keyboard events.
- keyboard：Arrow directions wrap; Home/End select boundaries. Enter/Space rely on native button activation and require browser evidence.
- initialization：New current runtime uses a document guard to prevent duplicate delegates. Load timing supports DOMContentLoaded; no public insertion API. Do not co-load legacy and current scripts.
- scope：Current PC media/product compatibility, Tag color dropdown and Tag accessory calls are available. Payment-brand, other source sizes, M/Pad and backend requests remain outside current call scope.
- nativeStateGuard：Current native :disabled guards inherited fieldset; disabled changes resync tabstops without changing selection, and new choice clears previously disabled selection. Browser proof pending.
- availability：Native disabled/fieldset, hidden or ARIA-disabled ancestors block synthetic selection and remove all unavailable tabstops while preserving previously committed state. Re-enable restores one available tabstop. Composing arrows do not select.
- groupOwnership：Nearest radiogroup owns its options. Nested groups and dynamically inserted groups have independent state/tabstops; initialization runs once per group and subsequent availability sync does not clear prior selection.
- serviceCheckbox：PC service is source Tag accessory + actual Checkbox(sm),264×80/64px image, native label activation. Existing M row specimen is not admitted.
- finiteProduct：当前精确调用采用规范页已有SKU+价格紧凑项；原Address/Shipping/Payment演示不作为商品选型依据，结算基础互斥项使用Radio/bordered-detail。
- sourceConfiguration：color uses existing Select keyboard/outside/Escape/focus and ds:select-change(values,labels); Tag swatch follows selected data-color. service uses genuine Checkbox input and native change/disabled/Space. Host owns product/data requests; not a checkout/cart backend.

## 关系

子组件：checkbox、tag、tag、select。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-chevron-down.svg、components/icons/icon-checkbox-default-14.svg、components/icons/icon-checkbox-hover-14.svg、components/icons/icon-checkbox-checked-14.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
