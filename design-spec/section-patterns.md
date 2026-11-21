# FS PC 页面黄金区块样板库（Section Patterns）

本样板库提炼自已通过自动门禁与视觉验收的 [xtool-education-v2-pc.html](../pages/xtool-education-v2-pc.html) 与 [xtool-store-pc.html](../pages/xtool-store-pc.html)。合成新页面时，遇到同类业务模块**直接整块复用对应骨架与表面规则**，不在单页临时发明新构图。

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

