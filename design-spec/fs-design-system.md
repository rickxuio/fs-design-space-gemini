# Design System — FS.com

## 1. Core Identity

B2B networking platform. Professional, information-dense, conversion-focused. White canvas, near-black text, dual-accent (red=action, blue=navigation). Open Sans only, two weights only.

**Key rules:**
- Font: Open Sans 400 + 600 only. No 300, no 700.
- Dual accent: Red `#C00000` = CTAs. Blue `#0060BF` = links/info.
- Hover: rgba overlays only — never hardcoded hover colors.
- Text buttons respond only to their own hover state; card hover must not trigger text-button underline.
- Category-nav card sub-links respond to their own hover state: darken text + underline.
- Main navigation text links stay visually static; no hover color shift or underline.
- Cards: `1px solid #DEE0E3` border + hover shadow. White surfaces only.
- Max content width: 1200px centered on 1920px canvas.
- Base spacing grid: 4px (xs), 8px (sm), 12px (md), 16px (lg), 24px (xl), 32px (2xl).

---

## 2. Color Palette

| Token | Hex | Role |
|---|---|---|
| `brand-red` | `#C00000` | Primary CTA, error |
| `gray-1` | `#19191A` | Primary text, headings |
| `gray-2` | `#4B4B4D` | Body text, black button bg |
| `gray-3` | `#707070` | Secondary text, descriptions |
| `gray-5` | `#DEE0E3` | Borders, dividers |
| `gray-7` | `#F2F2F2` | Gray button bg |
| `gray-9` | `#FAFBFB` | Topbar bg, light section bg |
| `white` | `#FFFFFF` | Page bg, card surfaces |
| `blue` | `#0060BF` | Links, text buttons, info actions |
| `success` | `#10A300` | Success tags |
| `warning` | `#F56300` | Warning tags |
| `purple-tag` | `#512971` | Purple category tags |

**Overlays:**
- Hover filled: `rgba(25,25,26,0.2)`
- Hover outline: `rgba(25,25,26,0.04)`
- Hover blue outline: `rgba(0,96,191,0.04)`
- Hover white outline: `rgba(255,255,255,0.2)`
- White translucent bg: `rgba(255,255,255,0.1)`
- Disabled text: `rgba(25,25,26,0.3)`

No gradients on UI surfaces.

**Forbidden colors on UI surfaces:**
- No yellow, orange, teal, green, purple, or any non-system color as background.
- UI surface backgrounds are ONLY: `#FFFFFF`, `#FAFBFB`, `#19191A`, `#4B4B4D`.
- Dark banner text is ONLY `#FFFFFF` — no colored spans, no accent text colors inside dark banners.

---

## 3. Typography

Font: `'Open Sans', 'Helvetica Neue', Arial, sans-serif`
Weights: 400 (Regular), 600 (Semibold) only.

| Role | Size | Weight | Line Height |
|---|---|---|---|
| Section Title | 24px | 600 | 32px |
| Card Title (horizontal) | 20px | 600 | 28px |
| Card Title (vertical) | 14px | 600 | 22px |
| Section Description | 14px | 400 | 22px |
| Card Description | 12px | 400 | 20px |
| Body | 14px | 400 | 22px |
| Caption / Description | 12px | 400 | 20px |
| Nav Links | 14px | 400 | 22px |
| Footer Column Title | 14px | 600 | 22px |
| Footer Links | 12px | 400 | 20px |
| Topbar | 12px | 400 | 20px |
| Button XL/L | 14px | 400 or 600 | — |
| Button M/S | 12px | 400 | — |
| Form Title | 16px | 600 | 24px |
| Form Description | 14px | 400 | 22px |
| Form Label | 13px | 400 | 20px |

---

## 4. Component Specs

### Buttons

| Variant | Bg | Text | Border | Hover |
|---|---|---|---|---|
| Filled Red | `#C00000` | white | none | `rgba(25,25,26,0.2)` overlay |
| Filled Black | `#4B4B4D` | white | none | `rgba(25,25,26,0.2)` overlay |
| Filled Gray | `#F2F2F2` | `#707070` | none | `rgba(25,25,26,0.04)` overlay |
| Outline Black | transparent | `#19191A` | `1px solid #19191A` | `rgba(25,25,26,0.04)` bg |
| Outline Gray | transparent | `#19191A` | `1px solid #DEE0E3` | `rgba(25,25,26,0.04)` bg |
| Outline Blue | transparent | `#0060BF` | `1px solid #0060BF` | `rgba(0,96,191,0.04)` bg |
| Outline White | `rgba(255,255,255,0.1)` | white | `1px solid white` | `rgba(255,255,255,0.2)` bg |
| Text Blue | none | `#0060BF` | none | underline |

**Sizes:**
- XL: 42px height, padding 0 24px, 14px font
- L: 36px height, padding 0 16px, 14px font
- M: 32px height, padding 0 12px, 12px font
- S: 32px height, padding 0 8px, 12px font

Border-radius: 4px (default). Disabled: opacity 0.3. Processing: opacity 0.6 + spinner.

**Text Button:** Blue `#0060BF` + right arrow icon 12×12. Sizes S/M/L.

### Card 变体选择（必须先判断再写）

| 源页面特征 | 选择变体 | Class |
|-----------|---------|-------|
| 图上文下，产品/文章列表，多卡片网格 | Vertical | `ds-card--vertical` |
| 图左文右，通栏展示，强调单个内容 | Horizontal | `ds-card--horizontal` |
| 文左图右，通栏展示，与上一个交替 | Horizontal Reverse | `ds-card--horizontal-reverse` |
| 带侧边导航的图文展示 | Sidebar | `ds-card--horizontal-sidebar` |

**判断规则：**
- 多个并列内容（3-4列网格）→ Vertical
- 单个内容需要大面积展示（占满 1200px 宽）→ Horizontal / Horizontal Reverse
- 如果有多个通栏卡片上下排列，交替使用图左文右 / 文左图右
- 带侧边栏的页面布局 → Sidebar

### Cards

**Vertical card:** 285px wide, 160px image, title 14px/600, desc 12px/400. Border: `1px solid #DEE0E3`. Hover: `0px 15px 15px -10px rgba(0,0,0,0.1)`.

**Horizontal card hover:** No hover shadow. `ds-card--horizontal`, `ds-card--horizontal-reverse`, and `ds-card--horizontal-sidebar` all have `box-shadow: none` on hover. These are display-oriented layouts, not clickable card links.

**Horizontal card (full):** 1200px，左右各占 50%（各 600px），图片比例 16:9（600×338px），gap 0。Title 20px/600, desc 14px/400。文字区 `padding: 32px`，flex column，`justify-content: center`。No border-radius on the card or image — both are `border-radius: 0`。**无 hover 投影** — 横向卡片不触发 `box-shadow`。

**Horizontal card (sidebar):** image 438×246px, gap 40px.

**Card tags (`ds-card__tags`):** tag row uses `margin-top: auto`, pinning tags to the bottom of the card body. In a multi-card grid this keeps tag rows aligned across cards of differing content height. Tags: 20px tall, gray-7 bg, gray-2 text, 12px/20px.

**Vertical card link row (`ds-card--vertical .ds-card__link`):** link row uses `margin-top: auto`, pinning the link to the bottom of the card body. In a multi-card grid this keeps link rows aligned across vertical cards of differing content height (mirrors the `ds-card__tags` and `ds-icon-card__link` rule). Don't override with a fixed top margin.

**Card surface rules:**
- White only. No tinted fills (no pale blue, green, peach).
- On gray sections: white card, NO border (`ds-card--no-border`).
- On white sections: use `ds-card--bordered-full` for a full 4-side border.
- **Horizontal cards exception:** `ds-card--horizontal`、`ds-card--horizontal-reverse`、`ds-card--horizontal-sidebar` never use border classes — no `bordered-full`, no `bordered`, regardless of section background color.
- Use `ds-card--bordered` only when the intended visual is body-only / topless border treatment (vertical cards only).
- Never both persistent border AND persistent shadow on same element.

### Banner 变体选择（必须先判断再写）

| 源页面特征 | 选择变体 | Class |
|-----------|---------|-------|
| 大图 + 标题 + 描述 + 可选按钮，首页/落地页级别 | Hero | `ds-banner--hero` |
| 面包屑 + 标题 + 描述，解决方案/产品线/分类页 | Sub | `ds-banner--sub` |
| 标题 + 描述 + 搜索框，知识库/文档中心/Case Studies | Search | `ds-banner--search` |
| 仅标题居中，专题/活动/话题页 | Title-only | `ds-banner--title-only` |
| 窄条（90px），商品详情页内嵌提示 | Mini | `ds-banner--mini` |

**判断规则：**
- 不要默认用 Hero — 只有首页级别的大型落地页才用 Hero
- 如果源页面有面包屑导航 → Sub
- 如果源页面有搜索框 → Search
- 如果源页面 banner 区域只有一行标题、无描述无按钮 → Title-only
- 如果不确定 → 看源页面 banner 高度：≥400px 用 Hero，200-320px 用 Sub/Search/Title-only

### Hero Banner

- Height: 420px, full-width.
- Dark background (blue-leaning). Content centered horizontally and vertically by default.
- Title: 36px/600, `max-width: ~620px` (override with `max-width: none` if content needs full width).
- Description: 16px/400, max-width ~560px.
- Buttons: `ds-btn--outline-white` for main CTA. Hero search input uses red submit button only.
- Buttons are OPTIONAL — only add if the source page explicitly shows a button in the hero.
- Not an inset card — no border-radius on the banner itself.

**必须使用的 HTML 模板（硬约束）：**
```html
<!-- ds-banner--hero 是 flex 布局，必须用 display:block 覆盖才能让内部 container 的 margin:0 auto 生效 -->
<div class="ds-banner ds-banner--hero" style="background-image: url('...'); background-size: cover; background-position: center; padding: 0; display: block;">
  <div style="max-width: 1200px; margin: 0 auto; height: 100%; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 20px;">
    <p class="ds-banner__title" style="text-align: left; max-width: 500px; margin: 0;">标题</p>
    <p class="ds-banner__desc" style="text-align: left; max-width: 560px; margin: 0;">描述</p>
    <!-- 按钮可选 -->
  </div>
</div>
```
**关键点：**
- `display: block` 覆盖 `ds-banner--hero` 的 `display: flex`，否则内部 container 的 `margin: 0 auto` 不生效
- `padding: 0` 覆盖 `ds-banner--hero` 的 `padding: 0 404px`
- 内部 container 用 `height: 100%` 撑满 banner 高度，自身用 flex column 实现垂直居中+左对齐

### Sub Banner (专题页)

- Class: `ds-banner--title-only`
- Height: 200px, full-width.
- Dark background with background image (cover). Content centered horizontally and vertically.
- Title: 32px/600, centered, max-width 960px.
- No buttons, no description — title only.
- Used on solution/topic pages below the main navigation.

### Content Banner (dark bg, e.g. xTool Care, Squad)

- Dark background, border-radius 8px, inside container.
- Buttons: `ds-btn--outline-white` only — NEVER `ds-btn--filled-red`.
- Title: 24px/600, white. Description: 14px/400, white 75% opacity.

### Anchor Nav

- Height: 56px. Background: `#EEEEEE`. 内容区 `max-width: 1200px; margin: 0 auto; padding: 0`，无水平 padding。
- Tabs: 14px/600, color `#707070` inactive, `#19191A` active.
- Active state: `border-bottom: 2px solid #C00000` (Brand Red).
- CTA button: filled red, right side.

### Form

- Submit 按钮：只用 `ds-btn--filled-red`，任何情况不例外。
- 灰色 section 内的表单：使用白色表单卡片背景。
- **必填/选填标注规则**：必填字段不加星号（*），保持 label 原样；选填字段在 label 文字后加 `(optional)`。例如：`Job Title (optional)`。
- **表单 section 布局判断规则**：
  - 如果表单板块除了表单字段、标题和描述外，还有其他额外文案（如联系方式、电话号码、说明段落等）→ 使用**左右结构**：左侧放标题+描述+额外文案（width ~360px），右侧放表单卡片（flex: 1）
  - 如果表单板块只有标题、描述和表单字段 → 使用**上下结构**：标题+描述居中在上，表单居中在下（max-width: 800px）
- **表单字段必须两栏布局** — 使用 `ds-form__row`（`display: flex; gap: 12px`）包裹每行两个 `ds-form__field`（`flex: 1`）。禁止生成单栏长表单。仅 textarea（多行文本域）和 checkbox/radio 组允许独占整行。
- Radio (`ds-form__radio`): input `accent-color: #707070`。
- Checkbox (`ds-form__checkbox`): input `accent-color: #707070`; 内部链接默认无下划线 (`text-decoration: none`)，hover 时才显示下划线。
- 具体字段结构和 class 名称参考：`fs-components/component-specs/preview/form.html`

### Navigation

**绝对规则（第一次生成，永不违反）：** header / footer 必须逐字使用 `navigation.html` 的标准片段。禁止改 Logo（始终标准 FS logo，不换 Support/子站/竞品名）、禁止改导航项（始终 All Products / Solutions / Services / Resources / Contact Us）、禁止改右侧 actions（搜索/账户/购物车）、禁止增删按钮、禁止在 header 加红色 CTA。原型或源站显示的任何 header（FS Support 子站、竞品、第三方）一律忽略，不带入。唯一允许的定制是文档化的 `data-props`。用户拿到结果后可自行二次修改，AI 不主动改、不替用户预判。

- Topbar: 32px，bg `#F6F6F8`。内容区 `max-width: 1200px; margin: 0 auto; padding: 0`，无水平 padding。
- Main nav: 68px，bg white，`border-bottom: 1px solid #DEE0E3`。内容区 `max-width: 1200px; margin: 0 auto; padding: 0`，无水平 padding。Logo 左对齐，Links 紧跟 Logo gap 48px，Actions `margin-left: auto` 推到最右。
- 导航链接：14px/400 `#19191A`，hover 无颜色变化、无下划线（静态）。
- Footer: bg white，`border-top: 1px solid #DEE0E3`，4 columns + 280px sidebar。内容区 `max-width: 1200px; margin: 0 auto; padding: 32px 0`，无水平 padding。
- Footer column links: text color `#707070` (gray-3), overrides `ds-text-btn--black` default within `.ds-nav-footer__col-links`.
- 具体 HTML 结构参考：`fs-components/component-specs/preview/navigation.html`

### Icon Card 变体选择（必须先判断再写）

| 源页面特征 | 布局 | 背景 | 边框 | Class 组合 |
|-----------|------|------|------|-----------|
| 内容少（标题+短描述），需要视觉居中感 | Center | 由 section 决定 | 由 section 决定 | `ds-icon-card--center` |
| 内容多（标题+描述+bullets/链接） | Left | 由 section 决定 | 由 section 决定 | `ds-icon-card--left` |

**背景和边框由所在 section 颜色决定：**
- 白色 section 内 → `ds-icon-card--bg-white ds-icon-card--bordered`
- 灰色 section 内 → `ds-icon-card--bg-white`（无 bordered）

### Icon Cards

- Icon exposed directly on surface — no circular containers, no tinted badge.
- Default icon: `icon-placeholder-switch.svg`, ~28–32px.
- Width: fluid — no fixed width on `.ds-icon-card`. Width is controlled by the parent container (CSS grid `1fr` or flex). Place icon cards inside a grid with explicit column sizing.
- Blue-link list (`ds-icon-card__blue-link`): blue `#0060BF`, 12px/20px. No default underline — underline appears on hover only.
- **Link row (`ds-icon-card__link`):** uses `margin-top: auto`, pinning the link to the bottom of the card body. In a multi-card grid this keeps link rows aligned across cards of differing content height (mirrors the `ds-card__tags` rule).

### Tab 变体选择（必须先判断再写）

| 源页面特征 | 选择变体 | Class |
|-----------|---------|-------|
| 内容筛选/过滤（如产品规格切换） | Capsule 胶囊 | `ds-tab--capsule` |
| 页面内容分区（如 Resources / Customer Stories） | Standard 常规 | `ds-tab--standard` |
| 首页产品大类导航（带图标） | Product Nav | `ds-tab--product` |

**判断规则：**
- 切换后内容区域完全替换（筛选型）→ Capsule
- 切换后显示不同板块内容（分区型）→ Standard
- 首页级别的产品分类入口，每项有图标 → Product Nav
- 需要居中对齐加 `ds-tab--center`

### Tab 标签导航

三种变体，参考 `preview/tab.html`：
- **Capsule（胶囊）**：`ds-tab ds-tab--capsule`，用于内容筛选/切换，背景 `#F6F6F8`，激活项白底。
- **Standard（常规）**：`ds-tab ds-tab--standard`，用于页面内容分区，底部 `border-bottom: 1px solid #DEE0E3`，激活项红色指示线 `ds-tab__indicator`。
- **Product Nav（产品导航）**：`ds-tab ds-tab--product`，用于首页产品分类，带图标，图标默认 opacity 0.4，激活态 opacity 1。
- 激活态结构：`ds-tab__item--active` + 内部 `ds-tab__indicator`（2px 红色底线）。
- 居中对齐加 `ds-tab--center`。Standard 变体居中时自动收缩为内容宽度（`width: fit-content; margin: 0 auto`），底线只覆盖内容区域。

### Input 输入框

两种样式，参考 `preview/input.html`：
- **灰底**：`ds-input-field__input--gray`，背景 `#F6F6F8`，无边框。用于白色背景区域。Hover: `rgba(25,25,26,0.04)` 叠加层。Focus: 同叠加层 + `1px solid #707070` 边框。
- **白底描边**：`ds-input-field__input--white`，背景白色，`1px solid #DEE0E3`。用于灰色背景区域。Hover/Focus: 边框色加深为 `#707070`。
- 结构：`ds-input-field` > `ds-input-field__label` + `ds-input-field__input`。
- 交互状态通过真实 CSS 伪类（`:hover` / `:focus`）实现，无需手动切换 class。
- Error 状态：输入框下方加 `ds-input-field__error`，红色图标 + 提示文字。
- Disabled：加 `ds-input-field__input--disabled`，opacity 0.3。

### Dropdown 下拉菜单

五种变体，参考 `preview/dropdown.html`：
- **基础下拉**：`ds-dropdown` > `ds-dropdown__trigger` + `ds-dropdown__panel`。
- **带搜索**：panel 内加 `ds-dropdown__search`。
- **多选 Checkbox**：list item 加 `input[type="checkbox"]`。
- **分组**：用 `ds-dropdown__group-title` + `ds-dropdown__divider` 分隔。
- **Filter 筛选**：触发器用 `ds-dropdown__filter-trigger`（胶囊形）。
- 触发器高度：默认 42px，小尺寸加 `ds-dropdown__trigger--sm`（30px）。
- 箭头旋转：触发器加 `ds-dropdown__trigger--open` 时，箭头自动旋转 180°（无需手动加 `--up`）。
- 下拉面板：`position: absolute; top: 100%; left: 0; right: 0; z-index: 10; margin-top: 4px`。`box-shadow: 0 2px 8px rgba(0,0,0,0.1)`，`border-radius: 4px`。父容器 `.ds-dropdown` 需要 `position: relative` 以建立定位上下文。

### Stepper 步骤条

两种分隔符变体，参考 `preview/stepper.html`：箭头分隔（简洁流程，SVG 箭头 `#DEE0E3`）/ 竖线分隔（带链接流程，竖线 + 圆形箭头节点）。

Base class: `ds-stepper`. Structure: `ds-stepper__step` items separated by `ds-stepper__separator`.

**Class names (canonical):**
- `ds-stepper` — flex row, `align-items: flex-start`, full width
- `ds-stepper__step` — flex column, centered, `flex: 1`, gap 12px
- `ds-stepper__step-icon` — 68×68px container, centered; inner `img` 48×48px
- `ds-stepper__step-body` — flex column, centered, gap 8px
- `ds-stepper__step-title` — flex row, centered, gap 2px
- `ds-stepper__step-title-text` — 14px/600, `#19191A`, center-aligned
- `ds-stepper__step-desc` — 12px/400, `#707070`, center-aligned, max 3 lines (60px)
- `ds-stepper__step--linked` — adds `padding-bottom: 12px` for link-arrow variant
- `ds-stepper__separator` — 68px tall, flex centered, `padding: 0 8px`; contains `ds-stepper__separator-arrow` (16px, `#DEE0E3`)
- `ds-stepper__separator--line` — 1px wide vertical line, `background: #DEE0E3`, `margin: 0 12px`

**Rules:**
- Never use the old `__item`, `__icon`, `__content`, `__title`, `__desc` class names — those are removed.
- Icon images are 48×48px inside a 68×68px container.
- Separator arrow is a text/SVG character, not an `<img>`.

### Breadcrumb (面包屑)

Base class: `ds-breadcrumb`. Flex row, `gap: 4px`, items center-aligned.

**Structure:**
```html
<nav class="ds-breadcrumb">
  <div class="ds-breadcrumb__item">
    <a class="ds-breadcrumb__link" href="#">Parent</a>
    <svg class="ds-breadcrumb__separator" width="12" height="12" viewBox="0 0 12 12"><path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#707070" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
  </div>
  <div class="ds-breadcrumb__item">
    <a class="ds-breadcrumb__link" href="#">Child</a>
    <svg class="ds-breadcrumb__separator" width="12" height="12" viewBox="0 0 12 12"><path d="M4.5 2.5L7.5 6L4.5 9.5" stroke="#707070" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
  </div>
  <span class="ds-breadcrumb__current">Current Page</span>
</nav>
```

**Class names:**
- `ds-breadcrumb` — flex container, `gap: 4px`, `align-items: center`
- `ds-breadcrumb__item` — flex row, `gap: 4px`, holds link + separator
- `ds-breadcrumb__link` — 12px/20px, `color: var(--color-gray-3)`, no underline; hover: underline
- `ds-breadcrumb__separator` — 12×12px SVG chevron, `flex-shrink: 0`
- `ds-breadcrumb__current` — 12px/20px, `color: var(--color-gray-1)` (non-clickable)

**Dark variant** (`ds-breadcrumb--dark`): for use on dark banner backgrounds.
- Links: `rgba(255,255,255,0.7)`
- Separator: `color: rgba(255,255,255,0.7)`
- Current: `#FFFFFF`

**Rules:**
- Breadcrumb sits in its own container row above the main content, typically `padding: 12px 0` inside a `max-width: 1200px` container.
- Text must match source page exactly — no abbreviation or omission.
- Use the dark variant only when breadcrumb overlays a dark background.

### Carousel (走马灯)

**Navigation Buttons (Prev / Next):**
- Size: 40×40px. Border-radius: 50% (圆形实心). No border.
- Light variant (default): `rgba(25,25,26,0.3)` bg + white icon (`filter: brightness(0) invert(1)`). Hover: bg → `rgba(25,25,26,0.5)`. Disabled: bg → `rgba(25,25,26,0.04)` (极浅，低对比).
- Dark variant (`ds-carousel__btn--dark`): `rgba(255,255,255,0.25)` bg + white icon. Hover: bg → `rgba(255,255,255,0.45)`. Disabled: bg → `rgba(255,255,255,0.1)`.
- Icons: `icon-carousel-prev.svg` / `icon-carousel-next.svg`, 20×20px.
- Overlaid layout: `position: absolute; top: 50%; transform: translateY(-50%)`. Prev at `left: 12px`, Next at `right: 12px`.
- Inline layout (`ds-carousel__controls`): buttons flanking dots, `position: static`.
- **Container-flanking layout (版心两侧)**: when the carousel content fills the 1200px 版心 (content container), the Prev/Next buttons sit OUTSIDE the container on each side, **32px from the container edge**. The button's inner edge is 32px away from the 版心 left/right edge (i.e. Prev right-edge → 版心 left-edge = 32px; Next left-edge → 版心 right-edge = 32px). Implement with a relative outer wrapper wider than the 版心 and buttons vertically centered (`top: 50%; transform: translateY(-50%)`). Buttons must stay outside `.ds-carousel`'s `overflow: hidden` so they are not clipped.

**Pagination Dots:**
- Default dot: 8×8px circle, `rgba(112, 112, 112, 0.4)` fill. Gap: 10px.
- Active dot: 24×8px capsule (`border-radius: 4px`), `#707070` fill.
- Hover (inactive): fill → `rgba(112, 112, 112, 0.7)`.
- Dark variant (`ds-carousel__dots--dark`): default `rgba(255,255,255,0.4)`, active `#FFFFFF`, hover `rgba(255,255,255,0.7)`.
- Dots sit below the carousel track, centered, `padding-top: 20px`.

**Rules:**
- Never use red for carousel nav buttons or dots.
- Dark variant buttons/dots only on dark banner backgrounds.
- First slide: Prev button disabled. Last slide: Next button disabled.

---

## 5. Layout

- Max content width: 1200px, centered. No horizontal padding on the container — content fills exactly 1200px.
- Section vertical padding: 40px top and bottom (`padding: 40px 0`).
- Section title: 24px/600, center-aligned. Title → description gap: 12px. Description → content gap: 24px (section-header 整体 margin-bottom: 24px).
- Section description: 14px/400, `#707070`, center-aligned, max-width 960px.
- Section header spacing: title → description gap: 12px. Description → content gap: 24px.
- Card grid gap: 20px. Max columns per row: 4. Fewer columns (1–3) are allowed.
- Card grid spacing: 20px on all sides (top, bottom, left, right) between cards.
- Category label (e.g. "DIN Rail Mount") to card grid below: 20px margin-bottom.
- Border radius: 2px (sm), 4px (md, default), 8px (lg), 9999px (pill).
- Shadows: hover card `0px 15px 15px -10px rgba(0,0,0,0.1)`, dropdown `0 10px 15px rgba(0,0,0,0.1)`.
- Section separation: alternate white ↔ gray. Never two consecutive same-color sections.
- Borders for separation live inside 1200px container, not full-viewport.

---

## 6. Interaction

- All transitions: `all 0.2s ease`.
- Hover: rgba overlays only (see Section 2).
- Disabled: opacity 0.3, cursor not-allowed.
- Processing: opacity 0.6 + spinner.

---

## 7. Do / Don't

**Do:**
- Red CTA only in: hero search button, form submit — nowhere else.
- Blue for links and informational text buttons.
- Outline-white for buttons inside dark banners.
- Black outline as default button inside content cards.
- White card surfaces only.
- Expose icons directly without decorative containers.
- One separation method per element: border OR shadow, not both.
- Alternate white/gray sections.

**Don't:**
- Don't use red inside banners, cards, or ordinary content sections.
- Don't use blue outline as default card CTA.
- Don't use font weights other than 400/600.
- Don't use tinted card fills.
- Don't wrap icons in circles/pills/badges.
- Don't apply both border and shadow at rest.
- Don't build hero as inset rounded card.
- Don't use dark form containers on light sections.

---

## 8. Page Templates

### 通用页面结构规则

**HTML 骨架：**
```html
<div data-component="navigation" data-fragment="header"></div>
<!-- Banner / Sub Banner -->
<!-- Anchor Nav（可选） -->
<section class="page-section page-section--white" id="section-id">
  <div class="container">
    <div class="section-header">
      <h2 class="section-header__title">标题</h2>
      <p class="section-header__desc">描述</p>
    </div>
    <!-- 内容区 -->
  </div>
</section>
<div data-component="navigation" data-fragment="footer"></div>
```

**Section 颜色交替：**
- 白色：`class="page-section page-section--white"`，背景 `#FFFFFF`
- 灰色：`class="page-section page-section--gray"`，背景 `#FAFBFB`
- 严格白↔灰交替，不能连续两个同色

**Section Header 间距规则：**
- title: `font-size: 24px; font-weight: 600; line-height: 32px; text-align: center; margin-bottom: 12px`
- desc: `font-size: 14px; font-weight: 400; line-height: 22px; color: #707070; text-align: center; max-width: 960px; margin-bottom: 24px`
- section-header 整体 `margin-bottom: 24px`（到内容区）

**容器规则：**
- `class="container"`：`max-width: 1200px; margin: 0 auto`，无水平 padding
- Section 自身：`padding: 40px 0`

**卡片网格：**
- `display: grid; gap: 20px`，最多 4 列
- 灰色 section 内：`ds-card--no-border`
- 白色 section 内：`ds-card--bordered-full`

---

### Solution Page（解决方案页）

**结构顺序：**
1. Header
2. Sub Banner（`ds-banner--title-only`，200px，深色背景图，仅标题居中）
3. Anchor Nav（`ds-anchor-nav`，56px，灰底 `#EEEEEE`）
4. Section 白 — 概览/优势
5. Section 灰 — 产品卡片
6. Section 白 — 解决方案（horizontal card）
7. Section 灰 — 案例研究
8. Section 白 — 资源（icon card）
9. Footer

**按钮规则：** 内容区用 black outline 或 blue text，不用红色。表单 submit 用 filled red。

---

### Landing Page（落地页）

**结构顺序：**
1. Header
2. Hero Banner（`ds-banner--hero`，420px，深色背景，左对齐）
3. 2–4 个内容 Section（白/灰交替）
4. 可选 CTA Banner（深色，outline-white 按钮，绝不用 filled-red）
5. 可选 Form Section
6. Footer

---

### 重构测试页（pages/ 目录）

> **作用域规则（已更新）：`pages/` 里对外展示的示例页现在也受 `validate.js` 校验。** 这些页面挂在 `index.html` 作为设计系统的范例页，因此和 `page-specs/` 一样必须通过 `validate.js`（0 error）。`validate.js` 默认扫描 `page-specs/` + `pages/` 两个目录。受规范约束的正式页面仍走 `page-sources/ → build.js → page-specs/` 流程；手写在 `pages/` 的范例页直接用 `node validate.js` 校验。下面几条是手写页面时的结构参考。

- 使用 FS header/footer，不保留源站导航
- Hero 用 FS banner 结构，不复制源站 carousel shell
- 内容模块转换为 FS card/section 模式
- 保留源站内容和功能意图，不保留源站视觉风格

---

## 9. Implementation Sources

所有组件的 HTML 结构和 `ds-*` 类名，必须从以下文件读取，不得从记忆中写：

| Component | Local File to Read |
|---|---|
| Header / Footer | `fs-components/component-specs/preview/navigation.html` |
| Banner / Hero | `fs-components/component-specs/preview/banner.html` |
| Anchor Nav | `fs-components/component-specs/preview/anchor-nav.html` |
| Buttons | `fs-components/component-specs/preview/button.html` |
| Text Buttons | `fs-components/component-specs/preview/text-button.html` |
| Cards | `fs-components/component-specs/preview/card.html` |
| Icon Cards | `fs-components/component-specs/preview/icon-card.html` |
| Form | `fs-components/component-specs/preview/form.html` |
| Tab | `fs-components/component-specs/preview/tab.html` |
| Input | `fs-components/component-specs/preview/input.html` |
| Dropdown | `fs-components/component-specs/preview/dropdown.html` |
| Stepper | `fs-components/component-specs/preview/stepper.html` |
| Carousel | `fs-components/component-specs/preview/carousel.html` |
| Breadcrumb | `fs-components/component-specs/preview/breadcrumb.html` |
| Tokens | `fs-components/component-specs/tokens.css` |
| Component CSS | `fs-components/component-specs/components.css` |

Icons 目录：`fs-components/component-specs/icons/`。默认卡片图标：`icon-placeholder-switch.svg`。

---

## 10. Agent Workflow

### Required Order
1. List all components the page needs.
2. Read every mapped file from Section 9 for those components.
3. Read `fs-components/component-specs/tokens.css` and `fs-components/component-specs/components.css`.
4. Write code using `ds-*` classes. Do not invent new patterns.
5. Run Self-Check below before delivering.
6. 受规范约束的页面：跑 `node build.js` 组装到 `page-specs/`，再跑 `node validate.js`，**必须 0 error 才算完成**。validate 是硬闸门，红了不算通过。

### Self-Check Checklist
- [ ] Header/footer from `fs-components/component-specs/preview/navigation.html` (not from memory) — nav links 左对齐，actions margin-left: auto
- [ ] Banner from `fs-components/component-specs/preview/banner.html` — 正确变体，正确高度
- [ ] Banner buttons: only present if source page explicitly shows them — never add by assumption
- [ ] Dark banner text: ONLY white `#FFFFFF` — no colored spans (no yellow, teal, green, etc.)
- [ ] Background colors: ONLY `#FFFFFF` / `#F6F6F8` / `#19191A` / `#4B4B4D` — no yellow, orange, teal, or any non-system color
- [ ] Horizontal cards: `border-radius: 0` on card and image — no rounded corners
- [ ] Horizontal cards: no hover shadow (`box-shadow: none` on hover) — display-only, not clickable card links
- [ ] Form from `fs-components/component-specs/preview/form.html` — submit 只用 filled red
- [ ] Anchor nav active: `border-bottom: 2px solid #C00000`, text `#19191A`
- [ ] Tab: 激活项有 `ds-tab__item--active` + `ds-tab__indicator`，不用红色以外的颜色做指示线
- [ ] Input: 白色区域用 `--gray`，灰色区域用 `--white`
- [ ] Dropdown: 触发器高度 42px（默认）或 30px（sm），面板有正确 shadow
- [ ] Stepper: 图标直接暴露，不加圆形容器
- [ ] Buttons: correct sizes (42/36/32/32px) and colors per context
- [ ] Red CTA only in hero search button / form submit
- [ ] Buttons inside dark banners use `ds-btn--outline-white`
- [ ] Card surfaces: white only, no tinted fills
- [ ] Gray section cards: `ds-card--no-border` · White section cards: `ds-card--bordered-full`
- [ ] Font weights: 400 or 600 only
- [ ] No element has both persistent border AND persistent shadow
- [ ] Container: max-width 1200px, no horizontal padding
- [ ] Section padding: 40px top and bottom
- [ ] Card grid gap: 20px, max 4 columns per row
- [ ] Section titles: center-aligned, 24px/600/32px line-height
- [ ] Title → desc gap: 12px · Desc → content gap: 24px
- [ ] Sections alternate white ↔ gray
- [ ] All interactive elements have rgba hover states
- [ ] Links: blue `#0060BF`
- [ ] Icons: no circular/pill containers
- [ ] Carousel buttons: rgba(25,25,26,0.3) default · 0.5 hover · 0.04 disabled · no red
- [ ] **几何自检（必须用 evaluate_script 量 bounding box，不能只查类名）：同一网格行各卡片的尾部 `ds-card__link`/`ds-card__tags` 的 bottom Y 必须相等（差值=0）；不等说明 `margin-top:auto` 没生效，去查 `components.css` 实现而非页面 markup。**
- [ ] **几何自检：走马灯 Prev/Next 按钮的 bounding box 不被裁剪（width>0）、垂直居中于轮播、且按所选变体定位（版心两侧布局时距版心边缘 32px、在 `.ds-carousel` 的 overflow 之外）。**
- [ ] **白字压在背景图上 → 图片必须有纯色 rgba 深色遮罩（`box-shadow: inset` 或 rgba 遮罩层），禁用 gradient。**
- [ ] Breadcrumb: `ds-breadcrumb` with `ds-breadcrumb__link` (12px, gray-3, hover underline), `ds-breadcrumb__separator` (12×12 chevron), `ds-breadcrumb__current` (gray-1). Dark variant `ds-breadcrumb--dark` only on dark backgrounds.
- [ ] Compared final output against `fs-components/component-specs/preview/` demo files

### Hard Constraints
- Never write header/footer from memory.
- Never invent `ds-*` classes that don't exist in `components.css`.
- Never use gradients on UI surfaces.
- Never use font weights other than 400/600.
- If unsure about any value → re-read the relevant section above before deciding.
- **Hero Banner 内容必须用 `max-width: 1200px; margin: 0 auto` 容器包裹**，不依赖 `ds-banner` 自身 padding 定位内容。
- **轮播按钮必须放在 `.ds-carousel` 外面**，相对于外层 wrapper 定位，否则会被 `overflow: hidden` 裁掉。
- `a.ds-btn` 和 `a.ds-text-btn` 已在 `components.css` 中设置 `text-decoration: none`，无需在页面中重复设置。

### 重构页面常见错误清单（必须逐条检查）

以下是历史重构中反复出现的错误，每次生成页面后必须逐条对照，确保不复现：

1. **Hero/Banner 内容不得拆分** — 源页面的 hero 区域（背景图 + 标题 + 描述 + 按钮）是一个完整整体，必须在同一个 banner 组件内实现，不能把描述或按钮拆到下一个 section。
2. **深色区域必须带背景图** — 源页面有背景图的深色版块，必须使用原始背景图 URL，不能偷懒用纯黑 `#19191A` 代替。`#19191A` 只作为 fallback 色。
3. **面包屑文案完整复刻** — 不缩写、不省略，必须和源页面一字不差。
4. **展示型图文模块不加 hover 投影** — 如果模块不是可点击的卡片链接，不应有 hover box-shadow 交互反馈。用 `box-shadow: none` 显式禁用。
5. **图片圆角看源页面** — 源页面图片有圆角就加 `border-radius: 8px; overflow: hidden`，不要强行覆盖为 0。
6. **数值参考源页面视觉比例** — 字号、间距等不凭感觉选，要对照源页面实际效果判断合理值。
7. **preview 文件是组件规范权威来源** — 当 `components.css` 实现和 `preview/*.html` 视觉效果有冲突时，以 preview 为准，修正 CSS。
8. **输入框底色 `#F6F6F8`，section 灰色背景 `#FAFBFB`** — 两者必须有层次区分，不能搞反。灰底输入框比 section 背景深一级。
9. **统计数字字号不要过大** — 参考源页面视觉，通常 24px 即可，不要默认用 48px 等超大字号。
10. **grep 不等于自检** — 字符串/类名匹配只能证明"写了这个类"，证明不了颜色、组件该不该出现、图标对不对。自检必须实际渲染页面并肉眼逐块对比。无法渲染时必须明说"渲染自检未完成"，不得用 grep 冒充通过。
11. **逐元素对账，不要只查改过的地方** — 从 header→banner→每个 section→footer 整页逐块过一遍，每个元素都问：组件对不对？变体对不对？颜色/图标/边框/链接样式对不对？只查自己预期的问题=确认偏误=漏错。
12. **先判组件选型，再看实现细节** — 先问"这里该不该用这个组件"，而不是"这个类写对没有"。例：走马灯只有在"轮播行为本身就是要测的东西"时才出现，否则页面根本不该有走马灯，不能拿它来填满网格。
13. **顺序/流程/生命周期阶段必须用 Stepper** — 多阶段顺序流程（如 规划→设计→验证→部署→运维）一律用 `ds-stepper`，禁止降级成卡片网格或图标卡片网格。看到规则适用就执行，不得以"改动大/卡片也差不多"为由替换。
14. **icon-card 链接颜色** — 单事件卡片链接用 `ds-text-btn--black`（黑），不是蓝色。蓝色只用于独立文字链接/blue-link 列表。
15. **图标必须来自图标库** — 所有图标用 `fs-components/component-specs/icons/` 里的真实文件，禁止手写内联 `<svg>` 自造图标。
16. **模糊处不自作主张** — banner 变体、背景色、颜色、图标取自规范/组件，不靠自己推断；规范对该页面模糊时，先与用户确认，不要先发猜测版本。
17. **配图位必须放真实图片，禁止用深色块/纯色块占位** — 任何本该有配图的位置（hero/banner 背景、卡片图片区、图文模块），都要放真实图片。优先用源站/竞品原图；**若原图抓不下来/拿不到，必须改用与文字内容相关的替代真实图片（主题相关 URL），不得用 `#E8E8E8` 等灰块/纯色块占位。** 占位块不再作为兜底（唯一例外：具名真实人物头像无授权照片时用中性头像占位）。详见 Section 11。
18. **图左文右/文左图右的图文块 = 横向卡片，不是自造 banner** — 任何"图片 + 标题 + 描述"并排的单内容通栏块，一律用 `ds-card--horizontal`(图左) / `ds-card--horizontal-reverse`(图右)，从 `card.html` 复制结构（白底图文卡片）。**禁止为这种块手搓 `content-banner` 之类自定义 class 或深色 `<div>`。** 即使源站该块是深色/品牌色面板，也转成白底横向图片卡片。判定信号：**有并排配图 = 横向卡片**。
19. **Content Banner(深色)只用于无配图的 CTA 长条** — 「Content Banner (dark)」仅限全宽深色长条 = 标题 + 描述 + `ds-btn--outline-white` 按钮，且**无侧边配图**。它没有"图文并排"布局。一旦块里有并排图片，立刻改判为横向卡片(见第 18 条)。
20. **映射即读 preview，不得跳读** — Step 2.5 里每个模块映射到哪个 ds-* 组件，就必须先读它的 `preview/*.html` 再写代码。不得以"我不会用这个组件"为由跳过读 `card.html` 等文件——是决策表决定映射、映射决定读哪些文件，不是反过来。漏读 preview + 凭印象写 = 自造组件的根因。
21. **组件疑似不对时，先逐元素比对 `preview/*.html`，禁止凭猜测改** — 用户说某组件"不对"时，第一步是打开该组件的 `preview/*.html`，逐个元素核对(图标文件名 / 分隔符类型与尺寸 / 子元素 class / 颜色)，而不是猜一个方向就改。典型教训(Stepper)：① 步骤图标用 preview 依赖栏标注的图标(`icon-demo-report.svg`)，不要自行换成 `icon-placeholder-switch`；② 箭头分隔符用 preview 里的 **SVG 箭头**(`<svg viewBox="0 0 36 16">` 的 path)，**不是**文字 `&rarr;` / `→` 字符——文字箭头又小又淡，是错的。凭猜测改 = 越改越偏。

---

## 11. 图片来源规则（Image Sourcing）

**总则：有配图位的地方必须放真实图片，不要用深色块或纯色块代替。** 优先用源站/竞品原图。**如果原图抓不下来或拿不到，必须改用与该模块文字内容相关的替代真实图片（主题相关的图片 URL），不得用 `#E8E8E8` 灰块或任何纯色/深色块占位。** `#E8E8E8` 占位块不再作为兜底。唯一例外：具名真实人物的头像若无授权照片，用中性头像占位，不套用陌生人脸（避免张冠李戴）。

| 输入来源 | 图片处理规则 |
|---|---|
| **竞品链接重构** | 尽可能把竞品原页的图片资源带出来使用——直接用竞品图片 URL（`background-image: url('竞品图URL')` 或 `<img src="竞品图URL">`），放到对应的配图位。**若竞品原图抓不下来/拿不到，改用与文字内容相关的替代真实图片（主题相关 URL），不得用 `#E8E8E8` 等占位块。** |
| **需求文档 / 原型图合成** | 尽可能使用与文字内容相关的图片（主题相关的真实图片 URL），让配图贴合该模块的文案语义，不要留空块或纯色块。 |

**适用范围与边界：**
- 此规则只针对**内容配图区**：hero/banner 背景图、`ds-card--vertical` 等卡片的 `ds-card__image`、图文展示模块。
- 不影响 **Rule 0**：header / footer / logo / 导航仍逐字使用 FS 标准片段，不带入竞品的 header/logo。
- 不影响 **icon-card**：图标卡片按规范只暴露图标（`icon-placeholder-switch.svg` 或图标库真实图标），不强行塞配图。
- 深色 banner 仍遵守色彩约束：文字只用白色 `#FFFFFF`，背景图之上不加非系统色块。

### 图片遮罩规则（白字压图必读）

当**白色文字叠在背景图之上**（hero / 深色 content banner / 任何图上有文字的场景），图片必须加一层**纯色半透明深色遮罩**，保证文字可读性：

- 实现方式：在带 `background-image` 的元素上加 `box-shadow: inset 0 0 0 2000px rgba(0,0,0,0.5);`（纯色叠加层，覆盖背景图、位于文字之下）。也可用绝对定位的 `rgba` 遮罩层。
- **禁止用 gradient 实现遮罩**——`validate.js` 把渐变判为 error，规则也禁渐变。必须用纯色 `rgba`。
- 遮罩强度建议 `rgba(0,0,0,0.45~0.55)`，亮图取高值。
- `#19191A` 纯色兜底背景仍保留作 fallback。
