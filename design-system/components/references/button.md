# Button — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：desktop-existing-library-with-source-cart-product-card；视觉审阅：pending。

颜色按 relations.variantDecisions 的宿主场景选择；尺寸必须从真实 sizeOptions 选取，默认示例不代表所有宿主共用同一尺寸。 Cart为Button内的按钮类型，产品卡片形态只开放Default/Hover；不套用形状按钮的尺寸/Disabled/Processing。

必须加载：components/tokens.css、components/components.css、components/button-current.css、components/button-runtime-current.css、components/cart-current.css。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用 tokens.css 系统字体回退；精确视觉验收确认字体加载。

原生 button 使用唯一实例 ID（需要外部关联时）；文案变化同步已有 aria-label，保持 type 与业务语义一致。



不可修改：ds-btn 根类与颜色变体；所选尺寸类和对应结构；ds-btn__text 节点；组件状态样式与图标；宿主颜色限制。

## filled-red

用：商品详情页顶部购买区的主加购 → 必须用红色填充。；表单提交、搜索提交、指定确认弹窗底部确认；已登记锚点导航的42px主CTA → 可用，按具体宿主核对。锚点导航主CTA采用红色XL Regular（42px、左右24px）；不要沿用旧L标签。

不用：Header普通操作、Banner普通CTA及未取得对应宿主依据的普通内容操作 → 不可将主操作笼统映射成红色；已明确登记的锚点导航42px主CTA按前一条处理，其余加购和宿主按各自契约核对。

可修改：label、actionCallback、buttonType、icon、iconHidden、size、disabled、loading、showLeftIcon、showRightArrow。

默认尺寸：xl-regular；可选尺寸：xl-bold、xl-regular、l、m、s。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button id="ai-button-filled-red-xl-regular" type="button" class="ds-btn ds-btn--filled-red ds-btn--xl-regular"><span class="ds-btn__leading" hidden><img class="ds-btn__leading-icon" src="../icons/icon-cart-add.svg" alt="" aria-hidden="true"></span><span class="ds-btn__text">按钮</span></button>
```

## filled-black

用：需要较高视觉权重的操作 → 列入黑色填充候选，核对操作角色及所在组件。；只知道这是主操作 → 继续比较候选，不能据此改用红色。

不用：

可修改：label、actionCallback、buttonType、size、disabled、loading、showLeftIcon、showRightArrow、icon、iconHidden。

默认尺寸：xl；可选尺寸：xl。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button id="ai-button-filled-black-xl" type="button" class="ds-btn ds-btn--filled-black ds-btn--xl"><span class="ds-btn__text">按钮</span></button>
```

## filled-gray

用：辅助或次要操作 → 列入灰色填充候选，结合同组层级比较。

不用：需要高视觉权重的操作 → 优先比较黑色填充，红色仅在允许的场景考虑。

可修改：label、actionCallback、buttonType、size、disabled、loading、showLeftIcon、showRightArrow、icon、iconHidden。

默认尺寸：xl-regular；可选尺寸：xl-bold、xl-regular、l、m。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button id="ai-button-filled-gray-xl-regular" type="button" class="ds-btn ds-btn--filled-gray ds-btn--xl-regular"><span class="ds-btn__text">按钮</span></button>
```

## outline-black

用：浅色背景上的辅助操作，需要醒目的边框 → 列入黑色描边候选。

不用：深色背景上边框难以辨认 → 排除黑色描边。

可修改：label、actionCallback、buttonType、icon、iconHidden、size、disabled、loading、showLeftIcon、showRightArrow。

默认尺寸：xl；可选尺寸：xl。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button id="ai-button-outline-black-xl" type="button" class="ds-btn ds-btn--outline-black ds-btn--xl"><span class="ds-btn__leading" hidden><img class="ds-btn__leading-icon" src="../icons/icon-fs-download-black-16.svg" alt="" aria-hidden="true"></span><span class="ds-btn__text">按钮</span></button>
```

## outline-gray

用：政策页或技术文档里的小型辅助入口 → 可比较灰色描边 M（高 32px，文字 12px 常规字重）。；只知道是低强调的辅助操作 → 继续比较黑色与灰色描边。

不用：

可修改：label、actionCallback、buttonType、size、disabled、loading、showLeftIcon、showRightArrow、icon、iconHidden。

默认尺寸：xl；可选尺寸：xl、m。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button id="ai-button-outline-gray-xl" type="button" class="ds-btn ds-btn--outline-gray ds-btn--xl"><span class="ds-btn__text">按钮</span></button>
```

## outline-white

用：已开放的深色单图桌面 Hero，只有一个操作入口 → 按 Hero 调用白色描边 XL。

不用：浅色背景 → 排除白色描边；深色宿主仍须核对对应组件契约。

可修改：label、actionCallback、buttonType、size、disabled、loading、showLeftIcon、showRightArrow、icon、iconHidden。

默认尺寸：xl；可选尺寸：xl。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button id="ai-button-outline-white-xl" type="button" class="ds-btn ds-btn--outline-white ds-btn--xl"><span class="ds-btn__text">按钮</span></button>
```

## outline-blue

用：明确需要蓝色强调的链接式按钮 → 列入蓝色描边候选。

不用：普通辅助操作 → 优先比较灰色或黑色描边。

可修改：label、actionCallback、buttonType、size、disabled、loading、showLeftIcon、showRightArrow、icon、iconHidden。

默认尺寸：xl；可选尺寸：xl。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button id="ai-button-outline-blue-xl" type="button" class="ds-btn ds-btn--outline-blue ds-btn--xl"><span class="ds-btn__text">按钮</span></button>
```

## cart-product-card

用：已核对的产品小卡片或完整产品卡片内的 Add 入口 → 按对应卡片核对 Cart 加购。

不用：普通按钮、气泡 Cart 或未定义状态 → 排除产品卡片 Cart 变体。

可修改：label。

```html
<button class="ds-cart ds-cart--product-card" type="button" data-ai-example="ai-button-cart-product-card"><img class="ds-cart__icon" src="../icons/icon-cart-add.svg" alt=""><span class="ds-cart__text">Add</span></button>
```

## 行为

- action：宿主监听原生 click；组件不执行固定业务。
- state：disabled与processing是互斥视觉状态。禁用使用原生disabled；processing使用ds-btn--processing、原生disabled及aria-busy=true，并用aria-label保留当前动作名称；loading图标alt为空且aria-hidden=true。退出processing时宿主清理busy标记并按原业务禁用状态恢复disabled，不无条件启用。
- type：默认 type=button，避免放入表单时意外提交；只有真实表单提交动作才配置 type=submit。颜色和尺寸仍按宿主限制。
- specificationScope：Saved Button update log and type section only: 4 explicit rule texts and 33 document usage rows paired by actual source ancestry. Original text-node IDs retained; document examples do not define new components or automatically approve hosts. There is no complete specification, browser or visual approval inferred.
- engineeringStatus：Current acceptance is determined by components/quality/acceptance.json source/tool fingerprints. Old finite proofs are preserved but stale, and are not renewed by scoped Node tests.
- sourceStateScope：原Preview的15种规格、45项Hover/Disabled/Processing声明匹配属于历史快照。当前本地调用使用relations.iconSlots中60条已核对MG状态；工程与浏览器验证分别见质量记录和Button样板报告，不推定全族视觉批准。
- processingSourceLayout：当前本地调用使用button-mg-20261112-v1：保留文案、前置Loading、普通左右图标暂隐，间距8px，图标尺寸按relations.iconSlots。原Preview中的隐藏文字、绝对定位和固定宽Processing示例保留为历史资料，不用于当前新增调用。
- leadingIcon：当前本地调用按relations.iconSlots的已核对MG状态：左右图标独立显隐；Processing保留文案和前置Loading，普通左右图标暂隐。旧原例保留为历史证据。

## 关系

子组件：无。

已登记父组件：anchor-nav、banner、card、collapse、comment、dialog、dropdown、form、list、navigation、select。

图标：components/icons/icon-loading.svg、components/icons/icon-cart-add.svg、components/icons/icon-cart-add.svg、components/icons/icon-fs-download-black-16.svg、components/icons/icon-fs-quotes-black-16.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
