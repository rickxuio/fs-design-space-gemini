# Collapse — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-split-feature-and-source-faq-and-PC-order-preview；视觉审阅：pending。

按原件区分 Cookies、FAQ、账户编辑、订单预览、特征导引和地图联动。当前 split/feature/faq/data-preview 按各自来源可调用；参考形态不得套现有类名冒充。默认单项展开；媒体/地图/业务保存需真实宿主实现。 已有FAQ原件可用faq组合：首中尾随行数确定，原箭头与底线状态联动，默认全部收起，单项展开。 List折叠详情先转引本组件data-preview，仅账户订单快照适用，不能冒充FAQ或任意树表。 Current five-variant closure 20261115: only supported exact source examples and publication decisions permit local calls. Earlier preview-only or placeholder descriptions are historical; PC geometry and host boundaries remain explicit.

必须加载：components/tokens.css、components/components.css、components/button-current.css、components/button-runtime-current.css、components/input-current.css、components/text-button-current.css、components/collapse-host-preview.css、components/collapse-current.css、components/collapse-faq-source.css、components/badge-current.css、components/tag-configuration-current.css、components/collapse-data-current.css、components/collapse-edit-current.css、components/collapse-current.js、components/input-current.js、components/collapse-host-preview.js、components/collapse-data-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。Open Sans stack; actual browser focus/visual pending.

Every header is a type=button with aria-controls pointing to a globally unique body ID; body hidden/aria-hidden and expanded state agree. Copies must regenerate body IDs and paired controls. Default first item open only. Marker-only data-collapse-current calls; current script guards repeated registration and disabled headers. Exception: data-preview starts all closed and uses its explicitly paired order-toggle only.

items preserves header/title icon and body; replace title/body text and regenerate identity as a pair. Optional read-only aside can be omitted for source absence as a declared adaptation; no fake switch.

不可修改：Actual disclosure header/body structure；Single-open default and icon/ARIA/hidden state；Split plus/minus and Feature registered leading icons；Shared CSS and delegated collapse.js；No invented save action, media synchronization or callback。

## split

用：Cookies加减号只读说明，正文需复制。

不用：FAQ右箭头，区分首/中/尾行。

可修改：items、mode。

```html
<div class="ds-collapse ds-collapse--split" data-ai-example="ai-collapse-split" data-collapse-current="" data-collapse-source-cookies="official">
      <div class="ds-collapse__item ds-collapse__item--open"><button class="ds-collapse__header" type="button" aria-expanded="true" aria-controls="collapse-split-answer-1"><span class="ds-collapse__title"><img src="../icons/icon-collapse-minus.svg" alt="">Strictly Necessary Cookies</span><span class="ds-collapse__always">Always Active</span></button><div class="ds-collapse__body" id="collapse-split-answer-1" aria-hidden="false"><p class="ds-collapse__copy-region">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.</p></div></div>
      <div class="ds-collapse__item"><button class="ds-collapse__header" type="button" aria-expanded="false" aria-controls="collapse-split-answer-2"><span class="ds-collapse__title"><img src="../icons/icon-collapse-plus.svg" alt="">Functional Cookies</span><span class="ds-collapse__always">Always Active</span></button><div class="ds-collapse__body" id="collapse-split-answer-2" hidden="" aria-hidden="true"><p class="ds-collapse__copy-region">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.</p></div></div>
    </div>
```

## feature

用：产品技术导引，图标语义匹配。

不用：教育、机构内容无匹配登记图标。

可修改：items。

```html
<div class="ds-collapse ds-collapse--feature" data-ai-example="ai-collapse-feature" data-collapse-current="">
        <div class="ds-collapse__item ds-collapse__item--open"><button class="ds-collapse__header" type="button" aria-expanded="true" aria-controls="collapse-feature-body-1"><span class="ds-collapse__title"><img src="../icons/icon-grid-view.svg" alt="">Centralized Resource Management</span></button><div class="ds-collapse__body" id="collapse-feature-body-1" aria-hidden="false">Manage all your network resources from a single cloud console — devices, configurations, firmware and monitoring in one place.</div></div>
        <div class="ds-collapse__item"><button class="ds-collapse__header" type="button" aria-expanded="false" aria-controls="collapse-feature-body-2"><span class="ds-collapse__title"><img src="../icons/icon-demo-report.svg" alt="">Real-time Monitoring &amp; Reports</span></button><div class="ds-collapse__body" id="collapse-feature-body-2" aria-hidden="true" hidden="">Manage all your network resources from a single cloud console — devices, configurations, firmware and monitoring in one place.</div></div>
        <div class="ds-collapse__item"><button class="ds-collapse__header" type="button" aria-expanded="false" aria-controls="collapse-feature-body-3"><span class="ds-collapse__title"><img src="../icons/icon-list-view.svg" alt="">Batch Configuration</span></button><div class="ds-collapse__body" id="collapse-feature-body-3" aria-hidden="true" hidden="">Manage all your network resources from a single cloud console — devices, configurations, firmware and monitoring in one place.</div></div>
        <div class="ds-collapse__item"><button class="ds-collapse__header" type="button" aria-expanded="false" aria-controls="collapse-feature-body-4"><span class="ds-collapse__title"><img src="../icons/icon-eye.svg" alt="">Network-wide Visibility</span></button><div class="ds-collapse__body" id="collapse-feature-body-4" aria-hidden="true" hidden="">Manage all your network resources from a single cloud console — devices, configurations, firmware and monitoring in one place.</div></div>
      </div>
```

## faq

用：来源是明确的问题/答案，需要单项展开和FAQ右箭头。

不用：Cookies设置、产品技术图标导引、地图、账户编辑或订单预览。

可修改：items。

```html
<div class="ds-collapse ds-collapse--faq" data-collapse-current data-ai-example="ai-collapse-faq"><div class="ds-collapse ds-collapse--faq-source-row ds-collapse__item" data-faq-position="first" data-faq-state="collapsed" data-faq-divider="on"><button class="ds-collapse__header ds-collapse__faq-source-header" type="button" aria-expanded="false" aria-controls="faq-current-answer-0"><span class="ds-collapse__faq-source-title">Can I get free advice on network solutions?</span><img class="ds-collapse__faq-source-arrow" src="../icons/icon-collapse-faq-down-current.svg" alt=""></button><p class="ds-collapse__body ds-collapse__faq-source-body" id="faq-current-answer-0" hidden aria-hidden="true">FS delivers high-value products, solutions and services to achieve your objectives.</p></div><div class="ds-collapse ds-collapse--faq-source-row ds-collapse__item" data-faq-position="middle" data-faq-state="collapsed" data-faq-divider="on"><button class="ds-collapse__header ds-collapse__faq-source-header" type="button" aria-expanded="false" aria-controls="faq-current-answer-1"><span class="ds-collapse__faq-source-title">Can I get free advice on network solutions?</span><img class="ds-collapse__faq-source-arrow" src="../icons/icon-collapse-faq-down-current.svg" alt=""></button><p class="ds-collapse__body ds-collapse__faq-source-body" id="faq-current-answer-1" hidden aria-hidden="true">FS delivers high-value products, solutions and services to achieve your objectives.</p></div><div class="ds-collapse ds-collapse--faq-source-row ds-collapse__item" data-faq-position="last" data-faq-state="collapsed" data-faq-divider="off"><button class="ds-collapse__header ds-collapse__faq-source-header" type="button" aria-expanded="false" aria-controls="faq-current-answer-2"><span class="ds-collapse__faq-source-title">Can I get free advice on network solutions?</span><img class="ds-collapse__faq-source-arrow" src="../icons/icon-collapse-faq-down-current.svg" alt=""></button><p class="ds-collapse__body ds-collapse__faq-source-body" id="faq-current-answer-2" hidden aria-hidden="true">FS delivers high-value products, solutions and services to achieve your objectives.</p></div></div>
```

## data-preview

用：PC账户订单快照，或List折叠详情规范明确转引的订单物料预览。

不用：FAQ、资料编辑、任意树表、整行点击或未接业务后端。

可修改：items、actionCallback。

```html
<div class="ds-collapse ds-collapse--data-preview" data-collapse-data-current="mg-v3.1" data-ai-example="ai-collapse-data-source"><div class="ds-collapse__item" data-order-id="FS191011177503"><div class="ds-collapse__row"><span class="ds-collapse__order"><button class="ds-collapse__order-toggle" type="button" aria-label="Preview order FS191011177503" aria-expanded="false" aria-controls="source-order-3"><img class="ds-collapse__row-arrow" src="../icons/icon-chevron-down.svg" alt=""></button><span class="ds-collapse__order-number">FS191011177503</span></span><span class="ds-collapse__cell">Online</span><span class="ds-collapse__cell">MollieHu</span><span class="ds-collapse__cell">07/03/2021</span><span class="ds-collapse__cell ds-collapse__cell--amount">US$337.21</span><span class="ds-collapse__status"><span class="ds-badge-status" data-badge-part="collapse-pending"><span class="ds-badge-dot ds-badge-dot--pending"></span><span class="ds-badge-status__text">Canceled</span></span><button class="ds-collapse__row-info-action" type="button" data-order-action="info" aria-label="Order status information"><img class="ds-collapse__row-info" src="../icons/icon-info.svg" alt=""></button></span><span class="ds-collapse__actions"><button class="ds-btn ds-btn--outline-black ds-btn--xl" type="button" data-order-action="view"><span class="ds-btn__text">View Order</span></button><button class="ds-collapse__row-more-action" type="button" data-order-action="more" aria-label="More order actions"><img class="ds-collapse__row-more" src="../icons/icon-more.svg" alt=""></button></span></div><div class="ds-collapse__body" id="source-order-3" hidden aria-hidden="true"><div class="ds-collapse__preview-card"><p class="ds-collapse__preview-title">Order Preview</p><div class="ds-collapse__preview-grid"><div class="ds-collapse__preview-item"><div class="ds-collapse__preview-thumb"><img class="ds-collapse__product-image" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="Network product reference"><span class="ds-collapse__preview-name">AP-N716, Wi-Fi 7 802.11be 9300 Mbps Indoor Access Point, Seamless Roaming &amp; 2 x 2 MU-MIMO Three Radios, PicOS®, Manageable via AmpCon-Campus (Without PoE Injector)</span></div><div><p class="ds-collapse__preview-price">US$ 3279.00</p><p class="ds-collapse__preview-qty">Qty:1</p></div><span class="ds-collapse__preview-status">Canceled</span></div></div></div></div></div><div class="ds-collapse__item" data-order-id="FS191011177504"><div class="ds-collapse__row"><span class="ds-collapse__order"><button class="ds-collapse__order-toggle" type="button" aria-label="Preview order FS191011177504" aria-expanded="false" aria-controls="source-order-4"><img class="ds-collapse__row-arrow" src="../icons/icon-chevron-down.svg" alt=""></button><span class="ds-collapse__order-number">FS191011177504</span></span><span class="ds-collapse__cell">Online</span><span class="ds-collapse__cell">MollieHu</span><span class="ds-collapse__cell">07/03/2021</span><span class="ds-collapse__cell ds-collapse__cell--amount">US$337.21</span><span class="ds-collapse__status"><span class="ds-badge-status" data-badge-part="collapse-pending"><span class="ds-badge-dot ds-badge-dot--pending"></span><span class="ds-badge-status__text">Canceled</span></span><button class="ds-collapse__row-info-action" type="button" data-order-action="info" aria-label="Order status information"><img class="ds-collapse__row-info" src="../icons/icon-info.svg" alt=""></button></span><span class="ds-collapse__actions"><button class="ds-btn ds-btn--outline-black ds-btn--xl" type="button" data-order-action="view"><span class="ds-btn__text">View Order</span></button><button class="ds-collapse__row-more-action" type="button" data-order-action="more" aria-label="More order actions"><img class="ds-collapse__row-more" src="../icons/icon-more.svg" alt=""></button></span><span class="ds-tag ds-tag--pickup" data-tag-part="collapse-pickup"><span class="ds-tag__label">Pickup Order</span></span></div><div class="ds-collapse__body" id="source-order-4" hidden aria-hidden="true"><div class="ds-collapse__preview-card"><p class="ds-collapse__preview-title">Order Preview</p><div class="ds-collapse__preview-grid"><div class="ds-collapse__preview-item"><div class="ds-collapse__preview-thumb"><img class="ds-collapse__product-image" src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt="Network product reference"><span class="ds-collapse__preview-name">AP-N716, Wi-Fi 7 802.11be 9300 Mbps Indoor Access Point, Seamless Roaming &amp; 2 x 2 MU-MIMO Three Radios, PicOS®, Manageable via AmpCon-Campus (Without PoE Injector)</span></div><div><p class="ds-collapse__preview-price">US$ 3279.00</p><p class="ds-collapse__preview-qty">Qty:1</p></div><span class="ds-collapse__preview-status">Canceled</span></div></div></div></div></div></div>
```

## inline-edit

用：PC账户资料原位查看、编辑与取消，需真实灰底Input及Save/Cancel。

不用：订单物料预览、FAQ或宣称服务器资料已保存。

可修改：items、saveCallback。

```html
<div class="ds-collapse ds-collapse--inline-edit" data-collapse-edit-current="account" data-ai-example="ai-collapse-inline-current">
      <div class="ds-collapse__item" data-collapse-field="email"><div class="ds-collapse__header"><span class="ds-collapse__label">Email Address</span><span class="ds-collapse__value">mollie.hu@feisu.com</span><form class="ds-collapse__edit-panel" id="collapse-account-email-panel" hidden="" aria-hidden="true"><div class="ds-collapse__edit-field"><div class="ds-input-field" data-input-current="">
<label class="ds-input-field__label" for="collapse-account-email">Email Address</label>
<input id="collapse-account-email" class="ds-input-field__input ds-input-field__input--gray" type="email" name="email" value="mollie.hu@feisu.com" aria-describedby="collapse-account-email-help">
<div class="ds-input-field__error" id="collapse-account-email-error" hidden="">
<span class="ds-input-field__error-icon" aria-hidden="true">
</span>
<span class="ds-input-field__error-text">Please enter Prompt word.</span>
</div>
</div><p class="ds-collapse__edit-help" id="collapse-account-email-help">This is the email you use to log into your account. Your order information will also be sent to this address.</p></div><div class="ds-collapse__edit-actions"><button type="button" class="ds-btn ds-btn--outline-gray ds-btn--xl" data-collapse-cancel=""><span class="ds-btn__text">Cancel</span></button><button type="submit" class="ds-btn ds-btn--filled-black ds-btn--xl" data-collapse-save=""><span class="ds-btn__text">Save</span></button></div></form><button class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--l ds-text-btn--icon-start" data-collapse-edit="" type="button" data-collapse-edit-atom="current" aria-controls="collapse-account-email-panel" aria-expanded="false"><img class="ds-text-btn__icon" src="../icons/icon-edit.svg" alt=""><span class="ds-text-btn__text">Edit</span></button></div></div>
      <div class="ds-collapse__item" data-collapse-field="phone"><div class="ds-collapse__header"><span class="ds-collapse__label">Phone Number</span><span class="ds-collapse__value">+86 138 0000 0000</span><form class="ds-collapse__edit-panel" id="collapse-account-phone-panel" hidden="" aria-hidden="true"><div class="ds-collapse__edit-field"><div class="ds-input-field" data-input-current="">
<label class="ds-input-field__label" for="collapse-account-phone">Phone Number</label>
<input id="collapse-account-phone" class="ds-input-field__input ds-input-field__input--gray" type="tel" name="phone" value="+86 138 0000 0000" aria-describedby="collapse-account-phone-help">
<div class="ds-input-field__error" id="collapse-account-phone-error" hidden="">
<span class="ds-input-field__error-icon" aria-hidden="true">
</span>
<span class="ds-input-field__error-text">Please enter Prompt word.</span>
</div>
</div><p class="ds-collapse__edit-help" id="collapse-account-phone-help">We'll only use this number to contact you about your orders.</p></div><div class="ds-collapse__edit-actions"><button type="button" class="ds-btn ds-btn--outline-gray ds-btn--xl" data-collapse-cancel=""><span class="ds-btn__text">Cancel</span></button><button type="submit" class="ds-btn ds-btn--filled-black ds-btn--xl" data-collapse-save=""><span class="ds-btn__text">Save</span></button></div></form><button class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--l ds-text-btn--icon-start" data-collapse-edit="" type="button" data-collapse-edit-atom="current" aria-controls="collapse-account-phone-panel" aria-expanded="false"><img class="ds-text-btn__icon" src="../icons/icon-edit.svg" alt=""><span class="ds-text-btn__text">Edit</span></button></div></div>
    </div>
```

## 行为

- initialization：Current runtime requires marker, registers one document delegate set and keeps declared initial hidden/ARIA/icon state. Legacy collapse.js unchanged; do not co-load both.
- split：Header click toggles. Single mode closes peers; only split data-collapse-mode=multiple allows multiple. Icons, aria-expanded and body hidden/aria-hidden update together.
- feature：Mouseover opens a row; pointer-generated click detail!=0 does not toggle. Native keyboard-generated click detail=0 can toggle. No dedicated keydown polyfill; actual keyboard activation remains browser pending.
- events：No dedicated disclosure-change event. Native click bubbles and is not a business-save or media-change signal.
- repeatLoad：Current marker-only runtime has one document guard and delegated listener set. Legacy collapse.js must not be co-loaded; old repeat-binding behavior is not the current contract.
- hosts：Current PC inline-edit and data-preview calls use explicit typed controls and current child atoms. Inline edits support cancel/IME-safe Escape, native validity, cancelable Save intent and local preview commit only.
- nativeStateGuard：Native fieldset/button disabled, hidden item/ancestor and ARIA-disabled header/ancestor block synthetic activation and feature hover without discarding open state. Availability restoration permits subsequent operation; no hidden disclosure mutation.
- editAtom：Preview-only Edit delegates structure, font, paint, icon dimensions and hover to TextButton inline-black/L. The host owns only placement and paired disclosure events. Original 16px icon differs from current 12px atom; use user-confirmed atom-first policy, preserve source difference. No new exact action variant or Save behavior.
- sourceV3Boundary：Retained FAQ six source rows are composed by the existing faq call; source variants remain evidence, not independent business calls. Source arrows, first/middle/last borders and hidden state stay source-owned. Visual approval and M/Pad are separate.
- cookiesHotZone1014：Readonly finite split uses paragraph copy-region; click inside stays open and text is selectable, body padding/item blank closes. Header keyboard/click and authored single/multiple semantics retained. Missing source marker or paragraph region rejected; no Switch upgrade.
- sourceV31：《新文件》折叠面板v3.1沿用默认单项手风琴，新增基础分割型地图联动。该规范场景不等于现有split已具备地图能力；FAQ、编辑、订单和地图继续按各自调用资格判断。 Current source order snapshot is now admitted as data-preview; previous historical unsupported statement is superseded for this finite PC call only.
- faq：Native button activation; all closed initially, single-open, first/middle/last source padding/divider and up/down SVGs; answers remain inside true row, copy does not toggle. No image/map/business linkage.
- dataPreview：Current MG v3.1 finite PC order snapshot; explicit arrow/native Enter/Space toggles, single-open. View/info/more emit action/orderId only; no whole-row toggle, popup or backend promise. Both Pickup/no-Pickup source forms retained. Fixed PC row is internally scrollable on narrow host; no M call.
- inlineEdit：All closed initially; one open field at a time, opening another cancels prior draft. Cancel/Escape rollback/refocus; composing Escape/submit do not commit. Save uses form validity and bubbles cancelable ds:collapse-save {field,values}; preventDefault keeps editor open. Without cancellation, local display is updated; no server persistence promised.

## 关系

子组件：button、button、input、badge、text-button、tag。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-collapse-plus.svg、components/icons/icon-collapse-minus.svg、components/icons/icon-edit.svg、components/icons/icon-chevron-down.svg、components/icons/icon-more.svg、components/icons/icon-info.svg、components/icons/icon-placeholder-switch.svg、components/icons/icon-demo-report.svg、components/icons/icon-grid-view.svg、components/icons/icon-list-view.svg、components/icons/icon-eye.svg、components/icons/icon-collapse-faq-up-current.svg、components/icons/icon-collapse-faq-down-current.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
