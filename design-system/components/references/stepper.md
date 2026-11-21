# Stepper — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-four-stage-circle-and-icon-specimens；视觉审阅：pending。

先确认先后关系，非引导的纯流程状态按MG规则另核时间轴；当前订单示例是原稿的只读专用展示。circle-centered-solution仅原PC四步初始结构；可用阶段本地切换，待开始禁点，无阶段值绑定或业务推进API。order和两种图标步骤只读；保留4节点、状态和真实图标。箭头/点状/竖向、Error、任意数量、替换图标及移动适配未开放。

必须加载：components/tokens.css、components/components.css、components/stepper-current.css、components/text-button-current.css、components/stepper-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。Open Sans stack; actual browser geometry/font proof pending.

Reuse authored four-stage DOM. Solution has empty data-stepper-interactive and solution-completed-only marker; order requires order-static and no interactive marker. No copied initialized DOM.

Edit text only: divider title uses genuine inline-black-bold/l TextButton text; no navigation destination evidenced. Other titles retain existing structure.

不可修改：Four-stage item ordering and required inner regions；Circle ordinal marker, solution connector and order bar；Existing static icons and divider geometry；Shared CSS, status mapping and current stepper-current.js；No fake event callback or business completion guard；Solution current marker solution-completed-only; pending stages blocked for click and keyboard, aria-disabled announced.；Order order-static, no data-stepper-interactive, button roles or keyboard handlers.；Divider current marker divider-text-atom and genuine TextButton title, no host paint override.。

## circle-centered-solution

用：四阶段方案引导；仅当前和已完成阶段允许本地查看。

不用：任意点击待开始阶段、自动业务推进或更改阶段数量。

可修改：steps。

```html
<div class="ds-stepper ds-stepper--circle-centered" data-stepper-current="solution-completed-only" data-ai-example="ai-stepper-circle-centered-solution" data-fragment="stepper" data-stepper-interactive aria-label="Interactive four-step solution progress">
        <div class="ds-stepper__item ds-stepper__item--current" data-stepper-item><span class="ds-stepper__marker" aria-hidden="true">1</span><span class="ds-stepper__connector" aria-hidden="true"></span><div class="ds-stepper__body"><p class="ds-stepper__title">Step 1</p></div></div>
        <div class="ds-stepper__item" data-stepper-item><span class="ds-stepper__marker" aria-hidden="true">2</span><span class="ds-stepper__connector" aria-hidden="true"></span><div class="ds-stepper__body"><p class="ds-stepper__title">Step 2</p></div></div>
        <div class="ds-stepper__item" data-stepper-item><span class="ds-stepper__marker" aria-hidden="true">3</span><span class="ds-stepper__connector" aria-hidden="true"></span><div class="ds-stepper__body"><p class="ds-stepper__title">Step 3</p></div></div>
        <div class="ds-stepper__item" data-stepper-item><span class="ds-stepper__marker" aria-hidden="true">4</span><div class="ds-stepper__body"><p class="ds-stepper__title">Step 4</p></div></div>
      </div>
```

## circle-centered-order

用：四阶段订单/RMA状态与日期的只读展示。

不用：点击切换状态、编辑订单或提交流程。

可修改：steps。

```html
<div class="ds-stepper ds-stepper--circle-order" data-ai-example="ai-stepper-circle-centered-order" data-stepper-current="order-static" aria-label="Four-step order progress">
      <div class="ds-stepper__item ds-stepper__item--current" data-stepper-item><span class="ds-stepper__order-bar" aria-hidden="true"></span><span class="ds-stepper__marker" aria-hidden="true">1</span><div class="ds-stepper__body"><p class="ds-stepper__title">State</p><p class="ds-stepper__description">Mar 18, 2026</p></div></div>
      <div class="ds-stepper__item" data-stepper-item><span class="ds-stepper__order-bar" aria-hidden="true"></span><span class="ds-stepper__marker" aria-hidden="true">2</span><div class="ds-stepper__body"><p class="ds-stepper__title">State</p><p class="ds-stepper__description">Mar 18, 2026</p></div></div>
      <div class="ds-stepper__item" data-stepper-item><span class="ds-stepper__order-bar" aria-hidden="true"></span><span class="ds-stepper__marker" aria-hidden="true">3</span><div class="ds-stepper__body"><p class="ds-stepper__title">State</p><p class="ds-stepper__description">Mar 18, 2026</p></div></div>
      <div class="ds-stepper__item" data-stepper-item><span class="ds-stepper__order-bar" aria-hidden="true"></span><span class="ds-stepper__marker" aria-hidden="true">4</span><div class="ds-stepper__body"><p class="ds-stepper__title">State</p><p class="ds-stepper__description">Mar 18, 2026</p></div></div>
    </div>
```

## icon-regular

用：四步横向68px图标与顺序说明。

不用：无顺序的并列优势，或任意图标/节点数量。

可修改：steps。

```html
<div class="ds-stepper ds-stepper--icon-regular" data-ai-example="ai-stepper-icon-regular" data-fragment="stepper">
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report.svg" alt=""><div class="ds-stepper__body"><p class="ds-stepper__title">TitleTitle TitleTitle</p><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description, This text is used to show a description, This text is used to show a description.</p></div></div>
      <span class="ds-stepper__connector ds-stepper__connector--arrow" aria-hidden="true"><svg class="ds-stepper__connector-arrow-icon" viewBox="0 0 36 16" fill="none" width="36" height="16"><path d="M0 8H32M32 8L26 2M32 8L26 14" stroke="currentColor" stroke-width="1.2"/></svg></span>
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report.svg" alt=""><div class="ds-stepper__body"><p class="ds-stepper__title">TitleTitle TitleTitle</p><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description, This text is used to show a description, This text is used to show a description.</p></div></div>
      <span class="ds-stepper__connector ds-stepper__connector--arrow" aria-hidden="true"><svg class="ds-stepper__connector-arrow-icon" viewBox="0 0 36 16" fill="none" width="36" height="16"><path d="M0 8H32M32 8L26 2M32 8L26 14" stroke="currentColor" stroke-width="1.2"/></svg></span>
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report.svg" alt=""><div class="ds-stepper__body"><p class="ds-stepper__title">TitleTitle TitleTitle</p><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description, This text is used to show a description, This text is used to show a description.</p></div></div>
      <span class="ds-stepper__connector ds-stepper__connector--arrow" aria-hidden="true"><svg class="ds-stepper__connector-arrow-icon" viewBox="0 0 36 16" fill="none" width="36" height="16"><path d="M0 8H32M32 8L26 2M32 8L26 14" stroke="currentColor" stroke-width="1.2"/></svg></span>
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report.svg" alt=""><div class="ds-stepper__body"><p class="ds-stepper__title">TitleTitle TitleTitle</p><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description, This text is used to show a description, This text is used to show a description.</p></div></div>
    </div>
```

## icon-divider

用：品牌信息中的四项图标分隔式阶段展示。

不用：完整导航、动态流程或任意替换图标。

可修改：steps。

```html
<div class="ds-stepper ds-stepper--icon-divider" data-ai-example="ai-stepper-icon-divider" data-stepper-current="divider-text-atom" data-stepper-source-icon68="official">
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report-current-68.svg" alt=""><div class="ds-stepper__body"><div class="ds-stepper__title"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">TitleTitle TitleTitle</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-bold.svg" alt=""></a></div><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description,This text is used to show a description,This text is used to show a description.</p></div></div>
      <span class="ds-stepper__divider" aria-hidden="true"><i></i><img class="ds-stepper__divider-icon" src="../icons/icon-stepper-divider-next.svg?v=2e67be0d1a01" alt=""></span>
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report-current-68.svg" alt=""><div class="ds-stepper__body"><div class="ds-stepper__title"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">TitleTitle TitleTitle</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-bold.svg" alt=""></a></div><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description,This text is used to show a description,This text is used to show a description.</p></div></div>
      <span class="ds-stepper__divider" aria-hidden="true"><i></i><img class="ds-stepper__divider-icon" src="../icons/icon-stepper-divider-next.svg?v=2e67be0d1a01" alt=""></span>
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report-current-68.svg" alt=""><div class="ds-stepper__body"><div class="ds-stepper__title"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">TitleTitle TitleTitle</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-bold.svg" alt=""></a></div><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description,This text is used to show a description,This text is used to show a description.</p></div></div>
      <span class="ds-stepper__divider" aria-hidden="true"><i></i><img class="ds-stepper__divider-icon" src="../icons/icon-stepper-divider-next.svg?v=2e67be0d1a01" alt=""></span>
      <div class="ds-stepper__item"><img class="ds-stepper__placeholder" src="../icons/icon-demo-report-current-68.svg" alt=""><div class="ds-stepper__body"><div class="ds-stepper__title"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">TitleTitle TitleTitle</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-bold.svg" alt=""></a></div><p class="ds-stepper__description">This text is used to show a description, This text is used to show a description,This text is used to show a description,This text is used to show a description.</p></div></div>
    </div>
```

## 行为

- initialization：Current document/root guards initialize marked circle roots once. No public dynamic insertion API; do not co-load old and current scripts.
- selection：Solution rejects pending; completed/current local selection only. Order displays state without handlers; no business advance API.
- keyboard：Solution enabled visible stages only; order/icon have no interaction tabstop. Actual native focus remains pending.
- events：Existing runtime emits no dedicated stage-change event. Host requires separate page integration; no actionCallback advertised.
- static：Icon forms do not change progress. Divider title is genuine TextButton display-only aria-disabled without href; source target unverified.
- visual：Connector colors, order bars, pseudo-element checks and long-title line wrapping require actual browser proof; JSDOM state checks are not visual approval.
- availability：Hidden/native disabled fieldset/ARIA-disabled stage or ancestor blocks synthetic activation. Disable changes tabstops without changing current/completed state; re-enable restores access.

## 关系

子组件：text-button。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-stepper-completed.svg、components/icons/icon-demo-report.svg、components/icons/icon-stepper-divider-next.svg、components/icons/icon-text-button-arrow-right-bold.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
