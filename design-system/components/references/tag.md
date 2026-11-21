# Tag — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-tag-finite-display-toggles-and-card-product-small；视觉审阅：pending。

Use one finite authored example per supported family: two default marker-only button toggles, success 12px status, source-matched single metadata value or exactly two dual metadata values, fixed Individual neutral/info and fixed FEATURED/star. Not all colors, sizes, states or source/browser acceptance. 当前filter支持显式closeCallback，宿主移除；不自动移除业务对象。 2026-10-14按用户提供母组件补Card必要小号三种属性；原件产品图=false；颜色仅改data-tag-color的六位HEX选项内容，不开放任意CSS。 按relations.variantDecisions的具体场景选型；最终资格读同版catalog，未开放项不自动调用。当前MG核对状态见prototypeRollout，不将既有来源冒称本次在线核对。

必须加载：components/tokens.css、components/components.css、components/tag-current.css、components/tag-product-current.css、components/tag-configuration-current.css、components/tag-current.js、components/tag-product-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用Open Sans字体栈；远端字体不可用时回退。

Default native button with data-tag-current, type=button and aria-pressed=false; current delegated runtime scopes standalone Tag toggles and excludes Select removal adapters. Static Tag examples are native spans; semantic/featured text and icon are frozen. No role/tabindex/button or toggle marker may be added.

selectable保留唯一label；filter保留唯一prefix/value及原关闭图标。filter必须保留data-tag-close=event与键盘说明；X保持img，不嵌套button。

不可修改：根button、类型、28px形态与共享CSS；默认状态与aria-pressed；filter关闭图标及前缀/值分组；tag-current.js选择事件语义；X只发关闭事件，宿主负责移除；不添加提交/通用业务删除；Static span structure, default semantic class and decorative assets; semantic Individual and FEATURED labels are literal；Product small22 frame, inside1px stroke and original variant state colours; image=false source Boolean；Customized literal label; colour content edits only on data-tag-color, never frame CSS。

## selectable

用：纯文字条件需要本地选中/取消。

不用：真实表单复选值、单选组或带关闭条件。

可修改：label、changeCallback。

```html
<button class="ds-tag ds-tag--selectable" type="button" aria-pressed="false" data-ai-example="ai-tag-selectable" data-tag-current=""><span class="ds-tag__label">Router</span></button>
```

## filter

用：前缀+值的条件标签，关闭由宿主处理。

不用：要求点击关闭自动删除业务对象。

可修改：prefix、value、changeCallback、closeCallback。

```html
<button class="ds-tag ds-tag--selectable ds-tag--filter" type="button" aria-pressed="false" data-tag-current="" data-tag-close="event" aria-keyshortcuts="Delete Backspace" aria-description="按 Delete 或 Backspace 删除此标签" data-ai-example="ai-tag-filter">
          <span class="ds-tag__label"><span class="ds-tag__prefix">Industry:</span> <span class="ds-tag__value">K-12 Education</span></span>
          <img class="ds-tag__close" src="../icons/icon-close.svg" alt="">
        </button>
```

## status-text

用：无底短状态文字，沿用当前success文字实例。

不用：需要其他颜色、14px大号或选择交互。

可修改：label。

```html
<span class="ds-tag ds-tag--status-text ds-tag--success" data-ai-example="ai-tag-status-text">New</span>
```

## metadata

用：两个同级元数据值，如行业与地区。

不用：只有一个值、状态提示或可操作筛选。

可修改：metadata.firstLabel、metadata.secondLabel。

```html
<span class="ds-tag-meta" data-tag-source-metadata="dual" data-ai-example="ai-tag-metadata">
      <span data-tag-value="first">Education</span>
      <span class="ds-tag-meta__divider" aria-hidden="true"></span>
      <span data-tag-value="second">United States</span>
    </span>
```

## metadata-single

用：一个只读元数据值。

不用：两个值被拼成一个标签或需要交互。

可修改：metadata.firstLabel。

```html
<span class="ds-tag-meta ds-tag-meta--single" data-tag-source-metadata="single" data-ai-example="ai-tag-metadata-single"><span data-tag-value="first">Education</span></span>
```

## semantic

用：固定Individual语义与原info图标。

不用：想更改语义、文案、颜色或隐藏图标。

可修改：。

```html
<span class="ds-tag ds-tag--semantic ds-tag--neutral" data-tag-source-individual-info="official" data-ai-example="ai-tag-semantic"><span class="ds-tag__label">Individual</span><span class="ds-tag__icon ds-tag__icon--info" aria-hidden="true"></span></span>
```

## featured

用：固定FEATURED精选标记。

不用：任意自定义图标或状态文字。

可修改：。

```html
<span class="ds-tag ds-tag--featured" data-tag-source-featured="official" data-ai-example="ai-tag-featured">
      <img class="ds-tag__icon" src="../icons/icon-featured-star.svg" alt="">
      <span class="ds-tag__label">FEATURED</span>
    </span>
```

## semantic-new

用：固定绿色New展示标记。

不用：把展示标记作为可选产品属性。

可修改：。

```html
<span class="ds-tag ds-tag--semantic ds-tag--new ds-tag--emphasis" data-tag-source-new="official" data-ai-example="ai-tag-semantic-new"><span class="ds-tag__label">New</span></span>
```

## product-regular-small

用：现有22px产品属性，原件产品图=false。

不用：要求大号、价格、图片或完整SKU选择器。

可修改：label、changeCallback。

```html
<button class="ds-tag ds-tag--product-small" type="button" aria-pressed="false" data-tag-product="current" data-ai-example="ai-tag-product-regular-small" data-tag-image="false"><span class="ds-tag__product-label">Cisco</span></button>
```

## product-custom-small

用：现有22px Customized属性动作入口。

不用：把它当普通选中项或自定义SKU表单。

可修改：actionCallback。

```html
<button class="ds-tag ds-tag--product-small ds-tag--product-custom" type="button" aria-pressed="false" data-tag-product="current" data-ai-example="ai-tag-product-custom-small" data-tag-image="false"><span class="ds-tag__product-label">Customized</span></button>
```

## product-color-small

用：现有22px颜色选项，产品图=false。

不用：图片/价格/完整SKU或自定义组件CSS。

可修改：color、accessibleLabel、changeCallback。

```html
<button class="ds-tag ds-tag--product-small ds-tag--product-color" type="button" aria-pressed="false" data-tag-product="current" data-ai-example="ai-tag-product-color-small" data-tag-color="#5A82F7" aria-label="蓝色"><span class="ds-tag__product-chip" aria-hidden="true"></span></button>
```

## 行为

- toggle：点击button时切换ds-tag--checked，同步aria-pressed，派发冒泡ds:tag-change；detail.checked为布尔值。
- disabled：原生disabled禁止响应；本批默认实例不开放disabled编辑。
- close：用户2026-10-13最新决定：点击X删除已选择标签。当前filter X只派发可取消冒泡ds:tag-close/detail.checked，不切换checked、不派发tag-change；宿主closeCallback决定并移除。组件不会自行删除调用实例。聚焦filter后Delete/Backspace提供等效关闭；禁用/隐藏/Select移除适配不响应。
- programmatic：首次初始化同步既有checked类；动态button点击由事件委托处理，但动态插入的初始aria需宿主提供一致状态。
- selectHost：Current Tag excludes .ds-select / data-select-remove, avoiding accidental toggle events when mixed with select-current.js. This only resolves runtime interference; source/style adapter remains unapproved.
- initialization：One document guard; marker-only delegated current calls, including dynamically inserted exact calls. Do not load legacy tag.js alongside current Tag runtime.
- display：Static examples dispatch no Tag event and add no keyboard, link or form control semantics; only status label and two metadata texts are editable.
- product：tag-product-current.js隔离原有Tag切换；常规/颜色切换aria-pressed并发ds:tag-change；Customized或Card已登记+N适配仅发ds:tag-activate，宿主决定动作。状态矩阵data-tag-state为来源展示，不响应切换。颜色初始化/动态插入/属性更新仅写内部色块background-color。

## 关系

子组件：checkbox。

已登记父组件：card、collapse、comment、option-selector。

图标：components/icons/icon-close.svg、components/icons/icon-info.svg、components/icons/icon-featured-star.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
