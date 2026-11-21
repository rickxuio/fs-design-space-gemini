# Table — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：eight-finite-native-table-shapes；视觉审阅：pending。

Six finite static shapes plus two six-column PC/LTR matrices with 1–6 complete body rows. Compact GPT/row-line keep local authorized-fill provenance. No sorting, filtering, cell links or >6-row disclosure. Matrices retain exact native scroll controls and product media wrappers. 按relations.variantDecisions的具体场景选型；最终资格读同版catalog，未开放项不自动调用。当前MG核对状态见prototypeRollout，不将既有来源冒称本次在线核对。

必须加载：components/tokens.css、components/components.css、components/table-current.css、components/table-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Full root > scroll > native table with correct scopes and complete columns. Matrix roots also retain current marker and two safe locked registered-arrow controls outside editable table; first data cell is a row header. Canonical controls hidden/disabled until measured initialization.



不可修改：Native table/header scopes and consistent columns；Existing shared CSS, including ds-table [hidden] display rule；Static shapes without invented controls; matrix safe scroll controls outside data slot；Six-column matrix media wrappers and registered scroll arrow assets；Current product-matrix control size/shape from Table-owned group; no host overrides of an IconButton atom；Current product-heading atom140px with0/8/16/8 padding; current control vertical centering/right20px stays Table-owned.；当前matrix-products可用非Hover的next使用20px原件路径；不推及Prev、Hover、Disabled、无图或历史实例。

## vertical-double

用：同一行对照两组属性与值。

不用：每行一组或希望可变列、合并单元格。

可修改：data。

```html
<div class="ds-table ds-table--vertical ds-table--vertical-double" data-ai-example="ai-table-vertical-double"><div class="ds-table__scroll"><table class="ds-table__table"><tbody><tr><th class="ds-table__row-header" scope="row">Ports</th><td>64x 100G QSFP28</td><th class="ds-table__row-header" scope="row">Ports</th><td>64x 100G QSFP28</td></tr><tr><th class="ds-table__row-header" scope="row">Ports</th><td>64x 100G QSFP28</td><th class="ds-table__row-header" scope="row">Ports</th><td>64x 100G QSFP28</td></tr></tbody></table></div></div>
```

## vertical-single

用：每行只表达一组属性和值。

不用：需要双组对照或自由添加控件。

可修改：data。

```html
<div class="ds-table ds-table--vertical ds-table--vertical-single" data-ai-example="ai-table-vertical-single"><div class="ds-table__scroll"><table class="ds-table__table"><tbody><tr><th class="ds-table__row-header" scope="row">Ports</th><td>64x 100G QSFP28</td></tr><tr><th class="ds-table__row-header" scope="row">Ports</th><td>64x 100G QSFP28</td></tr></tbody></table></div></div>
```

## horizontal-zebra

用：常规列标题与横向静态数据。

不用：单元格必须明显网格或需排序筛选。

可修改：data。

```html
<div class="ds-table ds-table--horizontal" data-ai-example="ai-table-horizontal-zebra"><div class="ds-table__scroll"><table class="ds-table__table"><thead><tr><th scope="col">Model</th><th scope="col">Ports</th></tr></thead><tbody><tr><td>S3900-24T4S</td><td>24 × RJ45</td></tr><tr><td>S3900-48T6S</td><td>48 × RJ45</td></tr><tr><td>S5860-20SQ</td><td>20 × SFP+</td></tr></tbody></table></div></div>
```

## horizontal-grid-13

用：普通数据需要内部单元格边界。

不用：仅为挤入更多内容而改为12px。

可修改：data。

```html
<div class="ds-table ds-table--horizontal ds-table--grid" data-ai-example="ai-table-horizontal-grid-13"><div class="ds-table__scroll"><table class="ds-table__table"><thead><tr><th scope="col">Item</th><th scope="col">Value</th></tr></thead><tbody><tr><td>Latency</td><td>1.2 ms</td></tr><tr><td>Throughput</td><td>980 Mbps</td></tr><tr><td>Availability</td><td>99.99%</td></tr></tbody></table></div></div>
```

## horizontal-grid-12-gpt

用：现有GPT等高密度内部网格场景。

不用：普通数据表或为了视觉任意改字号。

可修改：data。

```html
<div class="ds-table ds-table--horizontal ds-table--grid ds-table--grid-compact" data-ai-example="ai-table-horizontal-grid-12-gpt"><div class="ds-table__scroll"><table class="ds-table__table"><thead><tr><th scope="col">Prompt</th><th scope="col">Result</th></tr></thead><tbody><tr><td>Network audit</td><td>Completed</td></tr><tr><td>Config review</td><td>Completed</td></tr><tr><td>Port analysis</td><td>Completed</td></tr></tbody></table></div></div>
```

## horizontal-row-line

用：按行阅读、不强调列边界的静态表。

不用：超过六行需展开或要求列内复杂控件。

可修改：data。

```html
<div class="ds-table ds-table--horizontal ds-table--row-line" data-ai-example="ai-table-horizontal-row-line"><div class="ds-table__scroll"><table class="ds-table__table"><thead><tr><th scope="col">Order</th><th scope="col">Status</th></tr></thead><tbody><tr><td>FS10001</td><td>Completed</td></tr><tr><td>FS10002</td><td>Completed</td></tr><tr><td>FS10003</td><td>Processing</td></tr><tr><td>FS10004</td><td>Completed</td></tr><tr><td>FS10005</td><td>Processing</td></tr><tr><td>FS10006</td><td>Completed</td></tr></tbody></table></div></div>
```

## matrix-products

用：需要产品图识别的六列对比矩阵。

不用：没有产品图或需要可变列、移动端适配。

可修改：data。

```html
<div class="ds-table ds-table--matrix ds-table--matrix-products" data-ai-example="ai-table-matrix-products" data-table-current=""><div class="ds-table__scroll"><table class="ds-table__table"><thead><tr><th scope="col">Feature</th><th scope="col" data-table-product=""><span class="ds-table__product"><span class="ds-table__product-media"><img src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""></span><span>S3900</span></span></th><th scope="col" data-table-product=""><span class="ds-table__product"><span class="ds-table__product-media"><img src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""></span><span>S5800</span></span></th><th scope="col" data-table-product=""><span class="ds-table__product"><span class="ds-table__product-media"><img src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""></span><span>S5860</span></span></th><th scope="col" data-table-product=""><span class="ds-table__product"><span class="ds-table__product-media"><img src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""></span><span>N5860</span></span></th><th scope="col" data-table-product=""><span class="ds-table__product"><span class="ds-table__product-media"><img src="../../docs/assets/20250901105611h7ydr7.jpg.webp" alt=""></span><span>S8550</span></span></th></tr></thead><tbody><tr><th class="ds-table__row-header" scope="row">Ports</th><td>24</td><td>32</td><td>48</td><td>24</td><td>48</td></tr><tr><th class="ds-table__row-header" scope="row">Rate</th><td>10G</td><td>25G</td><td>25G</td><td>100G</td><td>100G</td></tr><tr><th class="ds-table__row-header" scope="row">Stacking</th><td>✓</td><td>✓</td><td>—</td><td>✓</td><td>—</td></tr></tbody></table></div><div class="ds-table__scroll-controls" data-table-scroll-controls="" hidden=""><button class="ds-table__scroll-control" type="button" data-table-scroll="prev" aria-label="向左滚动" disabled=""><img src="../icons/icon-carousel-prev.svg" alt=""></button><button class="ds-table__scroll-control" type="button" data-table-scroll="next" aria-label="向右滚动" disabled=""><img src="../icons/icon-carousel-next.svg" alt=""></button></div></div>
```

## matrix-plain

用：不依赖产品图的六列文字对比矩阵。

不用：产品必须靠缩略图识别或列数不符。

可修改：data。

```html
<div class="ds-table ds-table--matrix ds-table--matrix-plain" data-ai-example="ai-table-matrix-plain" data-table-current=""><div class="ds-table__scroll"><table class="ds-table__table"><thead><tr><th scope="col">Feature</th><th scope="col">Basic</th><th scope="col">Standard</th><th scope="col">Advanced</th><th scope="col">Premium</th><th scope="col">Enterprise</th></tr></thead><tbody><tr><th class="ds-table__row-header" scope="row">Support</th><td>Email</td><td>Email + Chat</td><td>24/7</td><td>24/7</td><td>Dedicated</td></tr><tr><th class="ds-table__row-header" scope="row">Warranty</th><td>1 year</td><td>3 years</td><td>5 years</td><td>5 years</td><td>Lifetime</td></tr><tr><th class="ds-table__row-header" scope="row">Stacking</th><td>—</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><th class="ds-table__row-header" scope="row">Automation</th><td>—</td><td>—</td><td>Basic</td><td>Advanced</td><td>Full</td></tr></tbody></table></div><div class="ds-table__scroll-controls" data-table-scroll-controls="" hidden=""><button class="ds-table__scroll-control" type="button" data-table-scroll="prev" aria-label="向左滚动" disabled=""><img src="../icons/icon-carousel-prev.svg" alt=""></button><button class="ds-table__scroll-control" type="button" data-table-scroll="next" aria-label="向右滚动" disabled=""><img src="../icons/icon-carousel-next.svg" alt=""></button></div></div>
```

## 行为

- static：Static table data has no sort/filter/selection. table-current.js ignores non-matrix/unmarked roots; six static shapes require no binding.
- limits：More than six rows is excluded from finite call until disclosure structure/dependency is separately confirmed. No automatic sort/filter or new actions.
- dependency：TextButton host adaptation applies only to >6-row row-line tables, not the finite ≤6-row static call. Disclosure remains unsupported. Native specification example 68908:260501 is blue 13px Default with a down arrow; previous user-directed black Disclosure remains the local row-line decision. Record scope/color difference instead of claiming source equivalence.
- matrix：Opt-in current LTR controls appear only when measured overflow >1px; prev/next clamp to measured endpoints, resize/scroll synchronize state, disabled fieldset and hidden controls reject synthetic click. Document/root guards prevent duplicate listeners/observers. Legacy table.js unchanged.
- geometry：Node tests use explicit scroll/client width inputs only, not browser layout. PC width, grid/row alignment, real overflow, ResizeObserver scheduling, imagery and computed styles still pending. No three-device expansion. Native component yes/pc68908:036227 and its header atom200×36 confirm canonical200px columns. Spec3.3 product-detail application example184px is recorded separately, not a generic atom override. Canonical product-heading source68908:016303 is200×140 with0/8/16/8 padding and4px gap; current resource replaces generic body-cell padding and160px inner height with this header assembly. Preview3rows implies248px target, actual browser geometry pending.
- controlSource：Native canonical product matrix68908:036227 contains next arrow instance68908:03623020×20 inside40×40 Table-owned group at1140/122 of1200×284; vertical-center constraint/right20 inset source current CSS. Norm application sample68908:259667 is distinct. No IconButton identity invented. Shadow, contours/arrow color, prev/end states and plain-matrix control remain pending.

## 关系

子组件：text-button。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-chevron-down.svg、components/icons/icon-carousel-prev.svg、components/icons/icon-carousel-next.svg、components/icons/icon-table-matrix-next-current-20.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
