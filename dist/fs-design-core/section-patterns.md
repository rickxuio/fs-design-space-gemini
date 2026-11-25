# FS PC 页面黄金区块样板库（Section Patterns）

本样板库提炼自已通过自动门禁与逐帧视觉验收的 **FS 5 大核心题型原生标杆页**（`fs-homepage-pc.html`、`fs-campus-fabric-network-pc.html`、`fs-plp-switches-pc.html`、`fs-pdp-s5810-pc.html`、`fs-account-center-pc.html`）。合成新页面时，遇到同类业务模块**直接整块复用对应骨架与表面规则**，不在单页临时发明新构图。

> **跨题型防误导铁律（必读）**：
> 1. **严禁跨题型抄写手写 DOM**：PLP 商品卡（`.plp-card` / `.plp-badge-hot` / `.plp-pagination`）、PDP Buy-Box 规格参数表与账户中心侧栏/业务表格（`.acct-nav-card` / `.acct-order-row`）仅限对应电商列表、商品详情或后台账户题型使用；**常规解决方案页、营销专题页、落地页一律必须优先使用 `library-card` / `library-tag` / `library-collapse` 等原生组件，严禁模仿 PLP/Account 手写卡片或自造标签**。
> 2. **严守白底无描边灰卡特例边界**：**仅允许「官网首页（Homepage）」与「PLP 产品列表页」两个特定页面在白底区块（`#FFFFFF`）上放 `#FAFAFB` 无描边硬件商品灰卡**；其他任何新页面一律严格执行原铁律——白底区块放卡片必加描边，灰底区块（`#FAFBFB`）放白卡严禁加描边。

---

## Pattern 1：顶部多宫格透明分类导航（灰底区块 `#FAFBFB`）

- **适用场景**：电商或聚合页首屏下方的 6～10 个圆形/方图分类快速入口。
- **表面铁律**：置于 `.page-section--gray`（`#FAFBFB`），单元格保持**透明背景、无描边、无阴影**，悬停仅做文字变色或图片微缩放。
- **标准布局 CSS**：
```css
.cat-nav-grid {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 16px;
  align-items: start;
}
.cat-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: #19191A;
  gap: 10px;
}
.cat-nav-thumb {
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cat-nav-thumb img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.cat-nav-title {
  font-size: 13px;
  line-height: 18px;
  font-weight: 600;
  color: #19191A;
}
```

---

## Pattern 2：Tab 切换 + 4 列/3 列外置多卡片轮播（含促销角标与双价格扩展）

- **适用场景**：按分类切换的商品推荐区、热门机型/配件轮播区；或首卡为促销导流卡、其余为商品卡的 4 列轮播。
- **表面铁律**：
  - **白底区块（`#FFFFFF`）**：内部卡片必须使用带描边变体 `library-card/spliced-vertical-single-event-bordered`。
  - **灰底区块（`#FAFBFB`）**：内部卡片必须使用无描边白底变体 `library-card/spliced-vertical-single-event`。
- **组件组合**：
  - 居中切换栏：`library-tab/standard-center`（或产品图标切换 `library-tab/product`），外包 `.center-tabs-layout { display: flex; justify-content: center; margin-bottom: 24px; }`。
  - 外置轮播：`library-carousel/external-cards`（传 `columns: 3` 或 `4`，按钮使用 48px 原生左右方向原子，版心外 32px 定位由原生 CSS 负责）。
- **商品卡内官方标签与双价格标准写法**：
  - **标签必须使用 FS 原生组件**（严禁手绘红底 `New` / `Hot` 标签）：新品用 `library-tag/semantic-new`（官方绿色 `New`），精选/热销用 `library-tag/featured`（官方 `FEATURED`），置于 `.ds-card__body` 顶部（放入 `data-fs-extend="official-fs-tag"` 容器中，且页面至少有一处通过 `assemblePage` 引入 `library-tag` 资源闭包）。
  - 现价+划线原价通过 `data-fs-extend="product-price"` 置于 `.ds-card__body` 内（不加顶部分割线）：
```html
<!-- 标签：使用原生 library-tag/semantic-new 或 featured，不手绘红底标签 -->
<div class="store-card-tag-row" data-fs-extend="official-fs-tag">
  <!-- 由 build.js 装配后的 library-tag/semantic-new 或 library-tag/featured -->
</div>

<!-- 价格扩展：置于 .ds-card__body 内（不加顶部分割线） -->
<div class="store-card-price-row" data-fs-extend="product-price">
  <span class="store-price-current">$3,699.99</span>
  <span class="store-price-compare">$4,299.99</span>
</div>
```
```css
.store-card-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}
.store-card-price-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: 8px;
}
.store-price-current {
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: #19191A;
}
.store-price-compare {
  font-size: 13px;
  line-height: 20px;
  color: #707070;
  text-decoration: line-through;
}
```

---

## Pattern 3：全宽 1200px 胶囊/产品 Tab + 媒体展示面板

- **适用场景**：学科/场景/软件解决方案切换，包含大幅实景图或演示 `<video>` 面板。
- **表面与尺寸铁律**：
  - 切换器优先用 `library-tab/product`（带图标）或 `library-tab/capsule`（胶囊切换）。
  - **下方媒体展示面板必须撑满 `1200px` 版心**（严禁套用纯文本描述的 `960px` 宽度上限）。
  - 若置于灰底区块（`.page-section--gray`），内部白色媒体面板**禁止加 `1px` 描边**。

---

## Pattern 4：无显式按钮的整卡可点击场景/专题网格（`sourceAbsent` 标准写法）

- **适用场景**：原站卡片只有配图 + 标题（或简短副标题），**没有显式按钮文案**。
- **铁律**：严禁杜撰 `Explore >` 或 `Learn More >`。使用 `library-card/spliced-vertical-single-event`（灰底区块）或 `spliced-vertical-single-event-bordered`（白底区块），通过 `sourceAbsent` 显式省略 `category`、`description`、`link`，并在整张卡片外包 `<a class="card-full-link" href="...">`：
```json
{
  "image": { "src": "assets/page/scene-1.webp", "alt": "Small Business" },
  "title": "Small Business",
  "sourceAbsent": {
    "reference": "reference-inputs/page/content.json",
    "objectId": "scene-1",
    "slots": ["category", "description", "link"]
  }
}
```
```css
.card-full-link {
  display: grid;
  text-decoration: none;
  color: inherit;
  height: 100%;
}
```
> **同行等高关键**：外包 `<a>` 必须用 `display: grid; height: 100%`（而非 `display: block`），才能在不覆盖 `.ds-card` 样式的前提下让内部卡片自动拉伸至同行最高卡片的精确高度。

---

## Pattern 5：FAQ / 手风琴折叠面板（`library-collapse/faq` 或 `split`）

- **适用场景**：常见问题解答（FAQ）、左文右图或分栏手风琴特性说明。
- **铁律**：直接使用原生 `library-collapse/faq`（纯问答列表）或 `library-collapse/split`（分栏手风琴），不手写带红条或自定义箭头的假折叠卡片。

---

## Pattern 6：1200px 全宽留资询盘表单（原生 `library-form/gray` + `sourceFields` 优先）

- **适用场景**：页面底部的商务合作、教育询盘、大客户留资表单（尤其是含多行长文本 `Message` / `Comments` 的表单）。
- **首选方案（含多行长文本，推荐）**：
  - 灰底区块（`#FAFBFB`）内放置 `1200px` 全宽白底无描边表单卡 `.inquiry-form-card`（白底区块加 `1px solid #DEE0E3`），内部直接调用原生 **`library-form/gray`** + `sourceFields`（在 `reference-inputs/<page>/content.json` 中声明 `fields`，长文本字段设 `kind: "textarea"`）。
  - 原生 `library-form/gray` 自动输出等宽双列输入行、全宽多行 `textarea`（含实时 `0/5000` 字数统计）以及**底部左对齐的原生 `filled-red / xl-regular` 提交按钮**——**严禁裸写 `<textarea>` 或手写居中提交按钮**。
  - **撑满 1200px 版心关键**：`form-current.css` 默认限制 `width: 800px`，须在页面 CSS 中用高优先级容器选择器 `#section-id .inquiry-form-card > form { width: 100%; }`（不使用 `.ds-*` 类名覆盖）让表单完整撑满 `1200px` 卡片内宽。
```css
.inquiry-form-card {
  width: 100%;
  background: #FFFFFF;
  padding: 36px 40px;
  border-radius: 8px;
  box-sizing: border-box;
  /* 灰底区块上不加 border；白底区块上加 border: 1px solid #DEE0E3 */
}
#lets-connect .inquiry-form-card > form {
  width: 100%;
}
```
- **备选方案（纯单行输入 + 自定义多选/搜索下拉框组合）**：
  - 统一使用**白底描边套系**：`library-input/white` + `library-select/single-radio` + `library-select/multi-checkbox`（或统一使用灰底套系，**严禁白灰混用**）；所有位于多列网格内的控件必传 `"layout": "fill"` 严格等宽，顶部 label 统一 `14px / 22px / 400 / #4B4B4D`。

---

## Pattern 7：1200 × 338 px 左右对半订阅表单卡 & 服务保障图标卡

- **左右对半订阅表单（对齐 `spliced-horizontal-full-width-bordered-background` 精确尺寸）**：
  - 尺寸严格对齐 **`1200 × 338 px`**（左图 `600×338` + 右白底表单 `600×338`，圆角 `8px`，内边距 `40px 48px`；灰底区块不加描边，白底区块加 `1px solid #DEE0E3`）。
  - 输入框使用 `library-input/white`（`42px` 高），右侧提交按钮**必须使用 `library-button/filled-red` 的 `xl-regular`（`42px` 高）**与输入框像素级等高，外层用 `display: flex; align-items: flex-end; gap: 12px;` 紧贴对齐，下方配 `library-checkbox/sm`。
- **服务保障 / 卖点图标条（如 Why Shop）**：
  - 仅原站本身为图标/矢量徽章类区块时，映射到原生 **`library-icon-card/center-single-event`**（置于白底区块，使其自带的 `#FAFBFB` 灰底卡片与白底形成清晰对比），图标从该变体契约已登记的 FS 官方 SVG 图标中按语义选取，无列表/按钮时用 `sourceAbsent` 省略 `["bullets", "link"]`；**严禁直接贴原站竞品的彩色/品牌色图标 PNG**。
  - 若原站本身为**实景照片方卡**（非图标卖点），必须保留实景照片卡，不得擅自改造成 `library-icon-card`。

---

## Pattern 8：客户评价 / 轮播分页点标准样板（官方 `8×8px` / `20×8px` 分页点）

- **适用场景**：合作伙伴/客户评价轮播（如 What Our Partners Say）或任何需要底部轮播分页点的展示区块。
- **元素顺序与组件组合**：
  - 严格忠实保留原站图文排布顺序（如：引号 → 评价正文 → `library-rate/display` 星级 → 头像与署名 → 底部分页点），不得任意调换星级与正文顺序。
  - **严禁**在非 `library-carousel` 宿主容器内零散调用 `library-carousel/navigation-outlined-*` 方向原子（会触发绝对定位漂移和 `verify.js` 未覆盖警告）。
  - **轮播分页点必须对齐 FS 官方规格**（与 `carousel-external.css` 一致）：未选中 `8×8px` 圆点（`opacity: 0.4`），当前选中项 `20×8px` 胶囊（`opacity: 1`），色值 `#707070`，间距 `10px`；**严禁自造细横条（如 `32×3px`）或胶囊文字按钮**。
```css
.testimonial-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
}
.testimonial-dot {
  appearance: none;
  border: 0;
  padding: 0;
  flex: 0 0 auto;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #707070;
  opacity: 0.4;
  cursor: pointer;
}
.testimonial-dot.is-active {
  width: 20px;
  opacity: 1;
}
```

---

## Pattern 9：FS 原生解决方案 / 专题页专属黄金区块（提炼自 `fs-campus-fabric-network-pc.html`）

1. **5 步官方服务流程（`library-stepper/icon-divider`）**：
   - 支持 **3~6 步**并排展示，每步 `.ds-stepper__placeholder` 传入独立的官方流程 SVG 图标与 `alt`，严禁把第 5 步拆到组件外。
2. **Product List 无圆点 SKU 产品分类卡（灰底 `#FAFBFB`）**：
   - 使用无描边白卡 `library-card/spliced-vertical-single-event`，通过 `sourceAbsent` 合法省略 `["category", "description", "link"]`（严禁塞 `"3 verified models:"` 等凑数描述），在 `.ds-card__body` 内用 `data-fs-extend="product-sku-links"` 注入**无圆点、灰色 `#707070`（`13px/20px/400`，悬停 `#0060BF` 下划线）** 的 SKU 链接列表。
3. **左右交替多要点图文（Explore the Benefits）**：
   - 使用 `library-card/spliced-horizontal-full-width-responsive`（`sourceAbsent: ["link"]`），第 1 条要点与 `data-fs-extend="benefit-extra-bullets"` 注入的后续要点**统一使用 `#707070` / `14px` / `400` 常规体 + `• ` 前缀**，严禁把小标题局部加粗成黑色导致字色割裂。
4. **1200px 全宽架构 / 软件大图 + 底部居中蓝链**：
   - 架构拓扑图、PicOS® / AmpCon 全宽软件架构图**严禁塞入 50/50 左右图文卡**（会导致 `object-fit: cover` 裁断两侧文字）；必须用 `1200px` 全宽 `.software-panel`（`width: 100%; height: auto; box-sizing: border-box`）完整展示，且 `Try PicOS-V free >` / `Try FS Design Center >`（`library-text-button/inline-blue-link`）置于**图片正下方居中**（`margin-top: 24px`）。
5. **3×2 居中无框认证网格（`FS Certified`，灰底 `#FAFBFB`）**：
   - 单元格保持透明无边框、居中对齐：顶部 `48×48px` 官方 SVG 图标 + 中部 `library-text-button/inline-black-bold`（标题自带 `>`，无底部多余 `Learn more >`）+ 底部 `max-width: 320px` 的 `#707070` 描述。
6. **左联系渠道 + 右白卡留资表单（`Ready to get started?`，灰底 `#FAFBFB`）**：
   - 左侧直接落于灰底（**不加白色卡片框**）：深色 `#19191A` `CONTACT US` 眉题 + 标题 + 描述 + `1px solid #DEE0E3` 分割线 + 3 条官方 SVG 图标配 `library-text-button/inline-black-bold` 标题（`+1 (888) 468-9910 >`、`Email >`、`Live Chat >`）；
   - 右侧无描边白卡内调用 `library-form/gray` + `sourceFields`：奇数字段（如 `email`）设 `fullWidth: true` 跨列对齐消除孤儿半行，在 `content.json` 设 `consent: true` 原生渲染官方 Terms & Privacy 勾选框。

---

## Pattern 10：FS 官网首页专属黄金区块（提炼自 `fs-homepage-pc.html`）

> **首页特例边界（仅限平台首页，不外溢至其他页面）**：
> - **首页 Hero 左内缩 `44px`**：MasterGo 原件《英文站组件库》`平台首页 1920×420px` 明确规定 `padding: 0 404px`（相对 `360px` 版心左边缘内缩 `44px`，`≤1280px` 内缩 `76px` 避让 `56×56px` 箭头）；**除首页外，所有其他页面（解决方案/专题/PLP/PDP）的 Banner 一律 `0` 缩进（`360px` 起笔，齐平 `1200px` 版心）**。
> - **首页特例视觉**：Hero `40×8px` 3 秒进度胶囊、白底区块放 `#FAFAFA` 无描边灰卡及 `#F2F2F2` 浅描边，均仅作为首页特殊样式区保留；其他页面继续执行通用规范（`20×8px` 胶囊、白底加 `#DEE0E3` 描边白卡）。

1. **7 屏 Hero 轮播 + 左右方向按钮 + 首屏双操作按钮（`library-banner/hero-responsive` + `library-carousel/navigation-solid-xl-left/right`）**：
   - 使用 `library-banner/hero-responsive` 承载标题、副标题与主按钮 `Learn more`（`outline-white / xl`），在 `.ds-banner__actions` 内通过 `data-fs-extend="hero-watch-video-action"` 注入同尺寸 `Watch video ▶` 描边白按钮（仅 Slide 0 显示，切换至其他屏自动隐藏）；
   - 左右两侧挂载 `library-carousel/navigation-solid-xl-left` 与 `navigation-solid-xl-right`（置于 `.ds-carousel__controls` 宿主容器内，点击可循环切换 7 屏），底部配 7 颗白色胶囊轮播点。
2. **8 大产品线双色图标 Tab + 单一可见 4 列分类轮播（`library-tab/product` + `library-carousel/external-cards`）**：
   - 顶部调用 `library-tab/product` 展示 8 大产品线 SVG 图标与分类名：清理下载 SVG 中自带的 `<rect width="64" height="64" fill="#FFFFFF"/>` 白色底板，并通过运行时 `img.style.filter = 'none'` 保留官网原生**红黑双色图标**（默认态非灰色滤镜）；
   - **下方只渲染 1 个可见的 `library-carousel/external-cards`**（严禁在 DOM 中同时放 7 个 `hidden` 的 `[data-rail]` 轮播，否则 `browser-page-check.cjs` 会对隐藏轮播执行 `elementFromPoint` 报悬停断区错误），点击任一 Tab 时通过 JS 动态切换该轮播内卡片的分类图、标题与 `data-fs-extend="category-sublinks"` 子分类链接列表（子链接默认 `#707070`，**悬停变为 `#19191A` 无下划线**；卡片下半部分采用 `1px solid #EDEDF0` 浅灰细描边）。
3. **白底区块上的浅灰商品卡与实拍图防裁切铁律（`New Products` & `Recommended`）**：
   - `New Products` 与 `Recommended` 区块本身保持**白底（`#FFFFFF`）**，内部商品卡片使用**无描边浅灰底（`#FAFBFB`）**，图片区设置 `padding: 20px 28px 8px; box-sizing: border-box` 且 `img { object-fit: contain; mix-blend-mode: multiply }`，严禁把整块区域做成灰底白卡或用 `object-fit: cover` 裁切立式工业交换机上下两端。
4. **白底区块上的灰底 IconCard 标题尾部箭头（`FS Certified` & `Get more Information`）**：
   - 在白底区块（`#FFFFFF`）上调用原生自带浅灰底的 `library-icon-card/center-single-event`（3×2）与 `library-icon-card/left-single-event`（3 列），传入 `titleHref` 并在 `.ds-icon-card__title-slot > a` 内通过 `data-fs-extend="icon-card-title-arrow"` 追加官方 `icon-text-button-arrow-right-regular.svg`（`12×12px`），还原官网标题右侧紧跟 `>` 箭头的视觉规范。
5. **客户案例 3 列卡片（`Case Studies`）**：
   - 使用整卡 `<a>` 外包 `library-card/spliced-vertical-single-event-bordered`，`category` 槽传入国家/地区（`United States` / `Germany` / `Japan`），在 `.ds-card__body` 底部通过 `data-fs-extend="case-industry-tags"` 注入以 `|` 分隔的单行不换行（`flex-wrap: nowrap; white-space: nowrap; gap: 6px`）行业标签行。

---

## Pattern 11：FS 产品列表页专属区块（PLP，提炼自 `fs-plp-switches-pc.html`）

> **题型边界**：仅限电商分类/产品列表页（PLP）使用；常规营销/解决方案页严禁照搬 `.plp-card` 或手写 `.plp-badge-hot`。

1. **面包屑 + 6 项子分类图文导航条**：`library-breadcrumb/default` + 紧凑图文分类条（`120×96px`，激活态 `#F6F6F8` 底 + `#19191A` 细边 + 右上角勾选圆徽）。
2. **多选筛选排序栏**：`library-select/multi-checkbox`（3 组常用筛选，高度 `36px`、`padding: 0 16px`、细黑激活边）+ `More Filters` 官方滑块图标（`65994-008368.svg`）驱动的 `320×428px` 双列浮层 + `Clear All` + 右侧结果数与 `library-dropdown/command-text` 排序。
3. **4 列硬件商品灰卡托盘（白底区块特例）**：白底区块上允许放无描边 `#FAFAFB` 硬件商品卡（`object-fit: contain; mix-blend-mode: multiply`），含单行 `|` 分隔参数条、双仓库存行、销量/评价数及悬浮展开红色 `Add` 加购按钮 + 底部分页条。

---

## Pattern 12：FS 商品详情页专属区块（PDP，提炼自 `fs-pdp-s5810-pc.html`）

> **题型边界**：仅限单品硬件详情页（PDP）使用。

1. **Buy-Box 双栏（`600fr / 540fr`，`gap: 60px`）**：左栏 6 图媒体画廊（含主图放大与视频缩略图）；右栏 `24px/32px` 主标题、`#F7F7F7` `90px` 价格条（含 Sold / Reviews / Questions 双色统计）、`30px` 型号选择胶囊、`library-input-number` 步进器 + `library-button/filled-red` 主加购、库存/物流/服务/担保 4 行官方图标与蓝链、以及 `Accessories (2)` 配件推荐卡。
2. **吸顶锚点 + 多维详情内容**：`library-anchor-nav` 吸顶联动 8 大章节，依次组合双列参数表、1200px 全宽 Connectivity 拓扑图、交替特性块与机型对比表、`library-video-button` 视频网格、`library-comment/qa-thread`、`library-rate/summary` 评分分布、以及 4 列 `285×76px` 官方 PDF 图标 Resources 文档卡片。

---

## Pattern 13：FS 账户中心专属区块（Account Center，提炼自 `fs-account-center-pc.html`）

> **题型边界**：仅限 B2B 客户后台/账户工作台（Dashboard / Account Center）使用。

1. **左 `220px` 手风琴侧栏 + 客户经理卡 + 右自适应工作区**：左侧手风琴分组菜单与 `Your Account Manager` 联系卡使用 MasterGo 官方线性图标；右侧顶部公告横幅 + `Orders`（4 项 KPI 筛选 + 订单列表 + `library-dropdown/command-dot` 更多菜单）+ `Quotes`（商品缩略图条 + 主次操作按钮）+ `Cases`（实时搜索过滤表格）。

---

## Pattern 14：客户证言引文卡、双 CTA Banner 与横向图文卡要点（反教条组合范式）

> **核心原则（禁止削足适履强套不匹配组件）**：组件库负责高频原子与标准模板；当原站区块的结构语义与现有组件不匹配（如客户证言引文、品牌 Logo 墙、数据 KPI 指标卡等）时，**严禁强行塞进 `library-card/spliced-vertical-*` 封面图卡片**，应直接基于 FS Token（配色、Open Sans 400/600、`24px` 内边距、`8px` 圆角、白底描边 / 灰底无描边铁律）配合 `data-fs-extend` 自然构建。

1. **客户证言引文卡（Testimonial Quote Card）**：
   - **禁止**：严禁套用 16:9 封面图卡片（会导致人物头像被拉成巨幅海报、引文被 `line-clamp` 截断、多出无意义跳转链接）。
   - **标准结构**：3 列等高网格（`grid--3`，`align-items: stretch`），灰底区块放无描边白卡 / 白底区块放 `#DEE0E3` 描边白卡，`padding: 24px`、`border-radius: 8px`、`display: flex; flex-direction: column`；顶部标题（`16px/600/#19191A`）+ **完整不截断引文**（`14px/22px/#4B4B4D`，`flex: 1`）+ 底部顶线分隔与 `48×48px` 圆形头像（`object-fit: cover; object-position: top center` 防切头）+ 署名与头衔。
2. **双白色描边按钮 Hero / CTA Banner（`library-banner/hero-responsive`）**：
   - 原站 Banner 存在双 CTA 时，**严禁因单插槽惯性丢弃第二个按钮**，直接使用 `library-banner/hero-responsive` 原生参数 `secondaryActionLabel` + `secondaryActionHref` / `secondaryActionCallback` 渲染两颗完全一致的 `42px` 白色描边按钮（`ds-btn--outline-white ds-btn--xl`，原生 `12px` 间距）；
   - 原站 Hero 内部自带的顶部徽章/胶囊（主标题上方）或底部卖点勾选行（按钮下方），必须通过 `data-fs-extend` 保留在 `.ds-banner__responsive-inner` 内部原位，**严禁挤出 Hero 外部拆成独立横条**。
3. **横向图文卡内嵌无序要点列表**：
   - 原站横向图文块（`library-card/spliced-horizontal-full-width-responsive`）包含 bullet list 要点时，严禁因卡片默认无列表插槽而省略要点；在 `.ds-card__content-stack` 内通过 `data-fs-extend` 完整保留要点，并优先使用已重置透明背景的原生 `library-list/unordered-14`。
4. **卡片内可交互标题的悬停态铁律**：
   - 卡片内的可点击标题（包括博客/资源链接卡）默认与悬停态均保持 `#19191A` 黑色不变，悬停时仅增加**文字下划线**（`text-decoration: underline; text-underline-offset: 3px`）与轻微卡片投影，**严禁悬停变蓝（`#0060BF`）**。
5. **`#C00000` 品牌红使用边界（指示器可用红，内容文字与整框绝不红）**：
   - **✅ 允许使用 `#C00000`**：原生主操作按钮（`filled-red`）、**导航/切换类激活指示器**（横向 Tab 底部红线、竖向分类导航左侧 `3px` 激活竖条）、价格数字、错误校验提示、以及 `duotone-line` 双色图标内约 20% 面积的核心语义点缀；
   - **❌ 严禁使用 `#C00000`**：客户/第三方品牌名、普通技术/产品标签、普通标题正文，以及大面积卡片四周外框（统一保持 `#19191A` 深黑与 `#707070` / `#DEE0E3` 中性灰，客户品牌优先保留原站高清 Logo）。
6. **多分类竖向侧栏导航 + 右侧 3 列产品矩阵（适用 6+ 分类切换）**：
   - 原站存在 6 项以上分类且左侧竖向导航时，优先复用此范式（不强塞顶部横向 Tab）：左侧 `240px` 白底描边圆角侧栏（`border: 1px solid #DEE0E3; border-radius: 8px; padding: 12px 0`），激活项带左侧 `3px` `#C00000` 指示竖条 + `#FAFBFB` 浅灰底 + `600` 加粗 `#19191A`，底部加细分隔线放原生 `All Products >`（`library-text-button/inline-black`）；右侧 `3 列` 描边产品卡片网格，1085 / 1440 / 1920 零溢出。
7. **纯展示型图标特性网格 vs 可点击图标卡（“无链接不上盒、无点击不投影”）**：
   - **纯展示型卖点/优势网格**（如 `Why Alibaba Cloud`、核心价值、能力亮点，**无跳转链接/无按钮**）：**严禁套用带悬停投影的 `library-icon-card/*-single-event`**（不可点击元素悬停浮起投影会误导用户，且 `#FAFBFB` 灰卡落在 `#FAFBFB` 灰底区块上会出现“默认隐形、悬停突兀弹框”）；应直接使用**无框通透图标网格**（`background: transparent; padding: 8px 4px; gap: 32px 36px` 直接落在 `#FAFBFB` 灰底或 `#FFFFFF` 白底上，左 `36px` 同风格 `duotone-line` 图标 + 右标题与正文，无卡片框、无描边、无悬停投影）。
   - **可点击入口型图标卡**（含跳转链接或 `Learn More`）：在白底区块（`#FFFFFF`）上调用 `library-icon-card/*-single-event`（浅灰卡有清晰边界与合理的可点击悬停反馈）；在灰底区块（`#FAFBFB`）上使用 `#FFFFFF` 纯白无描边卡片。
8. **参数对比表 & 轻量圆形展开/收起按钮（`data-fs-extend` 统一视觉标准）**：
   - **参数对比表**：表头产品信息（缩略图、型号、简介、徽章）、所有参数数据列及底部原生 `library-button/filled-red` 必须**严格居中对齐**；最左侧参数名称列左对齐，原页含左侧图标时必须配 `18×18px` 单色线性 SVG（`scripts/fs-icon.cjs --mono`）；表头左上角与底部左下角原页留空时严禁凭空编造 `Specification` / `Order` 等多余表头文字。
   - **轻量圆形展开/收起按钮（Bento 卡片右下角等辅助操作）**：统一采用 **`28×28px` 轻盈圆形细描边**——白底卡片上用 `background: #FFFFFF; border: 1px solid #DEE0E3` + `14px` 单色线性箭头 SVG（hover 变浅灰 `#F4F4F5` + `#19191A` 描边）；深色展开卡上用 `background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.45)` + 白色箭头。**严禁画成生硬的实心纯黑圆坨**。






