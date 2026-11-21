# Design System — FS.com

> **来源库参考与契约派生资料**：本文件保留来源库说明、历史案例及原生成脚本使用的标记区，不是当前页面合成或变体选型入口。页面任务以根目录 `AGENTS.md`、`design-spec/fs-design-system.md` 和当前 catalog／selection、契约、真实 Preview 为准；这里的历史数值或案例不能覆盖它们。

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
| `yellow` | `#FFD748` | Featured star icon + Badge pending status dot（仅状态/图标强调色，禁止作 UI 表面背景） |

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

**Text Button:** Select the current contract variant and size. Current standalone AI calls preserve the official right arrow and its original visibility switch; left/custom icons and disclosure controls are outside that scope. Do not remove a source icon or replace it with an arrow to force a match. Existing host-specific adaptations remain governed by their host contracts, not standalone variant claims. Inline Default has no underline; its own Hover displays underline.

**Page-level native text actions/navigation links:** Default has no underline; only the link’s own Hover adds underline, and mouse leave restores Default. Set these states explicitly rather than inheriting browser anchor defaults or a permanently underlined shared class. Confirmed default-underlined body/data links retain their evidenced treatment. This does not override fixed navigation or genuine component states.

### Card 变体选择（必须先判断再写）

<!-- AUTO-GENERATED:CARD_VARIANT_RULES:START (源头: components/contracts/card.json relations.variantSelectionRules + variantSelectionEdgeCases — 不要手动编辑这个表格，改契约后跑 `npm run generate-docs` 重新生成) -->
| 源页面特征 | 选择变体 | Class |
|-----------|---------|-------|
| 多个并列内容（3-4列网格） | spliced.vertical | `ds-card--vertical` |
| 单个内容占满 1200px 宽通栏展示 | spliced.horizontal.full-width | `ds-card--horizontal / ds-card--horizontal-reverse` |
| 1200px 通栏横向卡片需要白色文字背景半区与 1px 描边 | spliced.horizontal.full-width.bordered-background | `ds-card--horizontal / ds-card--horizontal-reverse + ds-card--horizontal-bordered` |
| 多个通栏卡片上下排列需交替方向 | spliced.horizontal.full-width（图左文右/文左图右交替） | `ds-card--horizontal / ds-card--horizontal-reverse` |
| 带侧边导航的图文展示 | spliced.horizontal.with-sidebar | `ds-card--horizontal-sidebar` |
| 带侧边导航的横向内容卡需要白色文字背景半区与 1px 描边 | spliced.horizontal.with-sidebar.bordered-background | `ds-card--horizontal-sidebar + ds-card--horizontal / ds-card--horizontal-reverse + ds-card--horizontal-bordered` |
| 搜索结果页的285px结果卡片需要产品图、标题、简短描述、Learn more及白/灰背景与悬停态 | embedded.product-standard | `ds-card--embedded-standard` |

**边界情况（决策表专项核对，见 `docs/component-contribution-guide.md` 步骤2）：**
- 两个并列的通栏内容（既不是1个也不是3-4个） → 按 spliced.vertical 处理——2列也算并列网格；单个内容通栏（full-width）只适用于恰好1个内容占满1200px的情况
- 内容既不是多卡片网格，也不需要占满1200px（比如占60%宽度的单个内容） → 灰色地带，现有4条规则均不覆盖。人工确认前不要让 AI 自行选择，必须先问用户
<!-- AUTO-GENERATED:CARD_VARIANT_RULES:END -->

### Cards

**Vertical card:** 当前上下单事件图文网格按实际列数分配宽度：3–4列等分铺满1200px、间距20px；1–2列可不铺满，尾行沿相同列宽。图片框16:9（285×160为旧四列取整示例），由组件显式parent-grid配置维护。其他家族及有限描边准入不扩大。Title14px/600, desc12px/400. Border: `1px solid #DEE0E3`. Hover: `0px 15px 15px -10px rgba(0,0,0,0.1)`.

**Horizontal card hover:** No hover shadow. `ds-card--horizontal`, `ds-card--horizontal-reverse`, and `ds-card--horizontal-sidebar` all have `box-shadow: none` on hover. These are display-oriented layouts, not clickable card links.

**Horizontal card (full):** 1200px，左右各占 50%（各 600px），图片比例 16:9（600×338px），gap 0。Title 20px/600, desc 14px/400。文字区 `padding: 32px`，flex column，`justify-content: center`。No border-radius on the card or image — both are `border-radius: 0`。**无 hover 投影** — 横向卡片不触发 `box-shadow`。

**Horizontal card (sidebar):** image 438×246px, gap 40px.

**Card tags (`ds-card__tags`):** tag row uses `margin-top: auto`, pinning tags to the bottom of the card body. In a multi-card grid this keeps tag rows aligned across cards of differing content height. Tags: 20px tall, gray-7 bg, gray-2 text, 12px/20px.

**Vertical card link row (`ds-card--vertical .ds-card__link`):** link row uses `margin-top: auto`, pinning the link to the bottom of the card body. In a multi-card grid this keeps link rows aligned across vertical cards of differing content height (mirrors the `ds-card__tags` and `ds-icon-card__link` rule). Don't override with a fixed top margin.

**Card surface rules:**
- White only. No tinted fills (no pale blue, green, peach).
<!-- AUTO-GENERATED:CARD_BORDER_RULES:START (源头: components/contracts/card.json relations.parentContext — 不要手动编辑这两行，改契约后跑 `npm run generate-docs` 重新生成) -->
- On gray sections: white card, NO border (`ds-card--no-border`).
- On white sections: use `ds-card--bordered` for a full 4-side border.
<!-- AUTO-GENERATED:CARD_BORDER_RULES:END -->
- 上述表面规则同样适用于页面级自定义的卡片类内容（例如 Logo 单元格、Trail 卡片）；元素未使用 `ds-card` 类名不能绕过父级背景对应的描边规则。
- **Horizontal cards exception:** `ds-card--horizontal`、`ds-card--horizontal-reverse`、`ds-card--horizontal-sidebar` never use border classes — no `bordered-full`, no `bordered`, regardless of section background color.
- Use `ds-card--bordered` only when the intended visual is body-only / topless border treatment (vertical cards only).
- Never both persistent border AND persistent shadow on same element.

### Banner 变体选择（必须先判断再写）

| 源页面特征 | 选择变体 | Class |
|-----------|---------|-------|
| 大图 + 标题 + 描述 + 可选按钮，首页/落地页级别 | Hero | `ds-banner--hero` |
| 标题 + 描述，解决方案/产品线/分类页；面包屑可选 | Sub | `ds-banner--sub` |
| 标题 + 描述 + 搜索框，知识库/文档中心/Case Studies | Search | `ds-banner--search` |
| 仅标题居中，专题/活动/话题页 | Title-only | `ds-banner--title-only` |
| 窄条（120px），商品详情页内嵌提示 | Mini | `ds-banner--mini` |

**判断规则：**
- 不要默认用 Hero — 只有首页级别的大型落地页才用 Hero
- Breadcrumb 是所有 Banner 变体的可选内容；面包屑存在与否不参与变体选择。
- 如果源页面有搜索框 → Search
- 如果源页面 banner 区域只有一行标题、无描述无按钮 → Title-only
- 如果不确定 → 看源页面 banner 高度：≥400px 用 Hero，200-320px 用 Sub/Search/Title-only

### Hero Banner

- 当前向新页面开放的精确调用为桌面首页原件1920×420，标题36/48/600、描述16/24/400，原件内容内缩404px，间距20px；只用于固定PC1920。来源：`components/sources/banner/native-hero-review-1028.json`。
- 完整复用`[data-ai-example="ai-banner-hero-static"]`：标题、描述、单个outline-white/XL真实Button。真实白描边原子64858:84998为14/22/400、42px高、4px圆角、只有文字节点；没有箭头槽，不自行加箭头。
- 标题max-width620、描述max-width560和组件布局由当前契约/Preview管理，页面不得覆盖display、padding、文字尺寸或宽度。真实原子400优先于旧宿主600的覆盖，冲突记录保留。
- 图片由页面级父容器承载，保持真实Hero根透明和原件布局；深色背景用FS Token，白字压图须在图片父级提供纯色半透明深色遮罩。不得添加渐变、额外CTA、Breadcrumb或轮播。
- 额外眉题等来源内容在本地映射记录为页面级内容，不塞入原件插槽。
- 历史冻结页保留其已登记display:block/padding:0装配，不自动升级；旧覆盖模板不再作为新原件Hero的硬要求。其他Banner调用仍按当前发布边界，不据此开放Pad/M或其他变体。

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
- 具体字段结构和 class 名称参考：`components/preview/form.html`
- 标题、描述按原件显示开关及来源内容保留；示例字段数量、联系选项和协议不作为每页必需业务内容。沿现有fieldContent/adaptation装配真实字段；使用原生Input、文本域与独立确认的Select，宿主分配列宽，不重写控件状态。

### Navigation

**绝对规则（第一次生成，永不违反）：** header / footer 必须逐字使用 `navigation.html` 的标准片段。禁止改 Logo（始终标准 FS logo，不换 Support/子站/竞品名）、禁止改导航项（始终 All Products / Solutions / Services / Resources / Contact Us）、禁止改右侧 actions（搜索/账户/购物车）、禁止增删按钮、禁止在 header 加红色 CTA。原型或源站显示的任何 header（FS Support 子站、竞品、第三方）一律忽略，不带入。唯一允许的定制是文档化的 `data-props`。用户拿到结果后可自行二次修改，AI 不主动改、不替用户预判。

- Topbar: 32px，bg `#F6F6F8`。内容区 `max-width: 1200px; margin: 0 auto; padding: 0`，无水平 padding。
- Main nav: 68px，bg white，`border-bottom: 1px solid #DEE0E3`。内容区 `max-width: 1200px; margin: 0 auto; padding: 0`，无水平 padding。Logo 左对齐，Links 紧跟 Logo gap 48px，Actions `margin-left: auto` 推到最右。
- 导航链接：Default14px/400 `#19191A`；用户2026-10-13纠正公共导航：Hover保持400字重、文字颜色和位置不变、独立定位底部2px `#C00000`标记，不加文字下划线。旧正文“静态Hover”与原件冲突，按原件纠正；PC现有调用，Pad/M不由此批准。
- Footer: bg white，`border-top: 1px solid #DEE0E3`，4 columns + 280px sidebar。内容区 `max-width: 1200px; margin: 0 auto; padding: 32px 0`，无水平 padding。
- Footer column links: text color `#707070` (gray-3), overrides `ds-text-btn--black` default within `.ds-nav-footer__col-links`.
- 具体 HTML 结构参考：`components/preview/navigation.html`

### Icon Card 变体选择（必须先判断再写）

| 源页面特征 | 布局 | 背景 | 边框 | Class 组合 |
|-----------|------|------|------|-----------|
| 来源居中布局；图标+标题及可选短描述/bullets/操作链接 | Center | 当前原件Gray9 | 当前原件无描边 | `ds-icon-card--center ds-icon-card--bg-gray` |
| 来源图标居左、内容居右；再判断单事件/链接列表/折叠形态 | Left | 按具体原件；有限单事件Gray9 | 有限单事件无描边 | `ds-icon-card--left ds-icon-card--bg-gray` |

**组件自身表面与外部板块分开：** 当前已核居中/居左单事件原件保持Gray9、无描边、8px圆角，可放在白色或灰色板块。外部背景不自动改变组件变体；真实白底、折叠、跳转及其他未开放范围不随本次纠错开放。

### Icon Cards

- 先根据可见布局判断 center/left，再根据内容和可见交互选择内容形态。bullets 本身不决定居左，条目数量不证明存在折叠交互。
- 单事件保留 body、真实 title；icon/description/bullets/link 没有来源内容时，按同一Plan的受控适配连同包裹节点整块省略，不留空图标或空位、不补 CTA、不新增固定高度。图标存在时保留当前原生36px槽。此处图标可选来自已保存规范section5.2，不开放新尺寸或新变体。跳转型和折叠型仍按各自必需结构；有操作链接时保留完整 TextButton 结构。

- IconCard description text grows naturally with complete content; no64px maximum or hidden clipping (user clarification2026-11-10). Typography, line-height and padding remain native.
- Icon exposed directly on surface — no circular containers, no tinted badge.
- 图标按真实场景选择。保存的IconCard规范列出36/48/64/68px；当前有限调用保持36px槽位，可替换当前契约登记的FS业务图标，示例占位图不是业务内容锁定。其他尺寸仍未开放。来源：`components/sources/icon-card/native-specification-review-1011.json#/section5_2`。
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
- **Product Nav（产品导航）**：`ds-tab ds-tab--product`，用于首页产品分类，带图标，图标默认 opacity 0.4，激活态 opacity 1。整组必须铺满父级版心（`width: 100%`），各项等宽（`flex: 1 1 0; min-width: 0`），每项内部图标与文字居中；1200px 版心内 8 项各占 150px。禁止整组按内容宽度收缩居中或用固定 gap 聚集在中间。“铺满”指父级版心，不是浏览器视口。底部保留贯穿整行的 1px `#DEE0E3` 实线，选中项红色短线独立保留，不拉满整个选项宽度。
- 激活态结构：`ds-tab__item--active` + 内部 `ds-tab__indicator`（2px 红色底线）。
- 居中对齐加 `ds-tab--center`。Standard 变体居中时自动收缩为内容宽度（`width: fit-content; margin: 0 auto`），底线只覆盖内容区域。

### Input 输入框

当前桌面基础集合 `68908:013958`，参考 `components/preview/input.html` 与 Input 契约。新调用必须加载 `input-current.css`、`input-current.js`，根节点声明 `data-input-current`；旧 Form/Collapse 与历史页仍使用原资源，不能自动升级。
- **灰底**：`ds-input-field__input--gray`，用于白色宿主；背景 `#F6F6F8`、无边框。Hover 叠加 `rgba(25,25,26,0.04)`；Activated/Inputting 使用同叠加层及 `1px solid #707070`。
- **白底描边**：`ds-input-field__input--white`，用于灰色宿主；背景白色、`1px solid #DEE0E3`。Hover 保持默认描边；Activated/Inputting 加深为 `#707070`。
- 标签 14px/22px/400；输入、占位符及错误文字 13px/20px/400。字段高42px、圆角4px、横向内边距12px、标签/字段/错误行间距4px；来源示例宽290px。
- Default、Hover、Activated（空值聚焦）、Inputting（有值聚焦）、Input complete、Disabled、Error 共七种来源状态。真实焦点使用原生光标，空焦点隐藏占位符；基础集合没有清除按钮。
- 使用真实 `label[for]` 与唯一 `input[type=text]` id。错误由宿主设置 `aria-invalid="true"`，显示14px红色信息图标及消息，关联本实例错误行并保留其他描述；不内置业务校验。
- Disabled 使用原生 `disabled` 或禁用 fieldset，背景 `#F6F6F8`、文字 `rgba(25,25,26,0.3)`；灰底无描边，白底描边 `#EEEEEE`（来源准确值，尚无精确Token）。标签保持原色，不降低整个组件的透明度。
- 密码、搜索、带属性输入框、文本域及M端不在当前开放范围。设计状态图不等于真实交互，来源快照不等于在线最新或人工视觉批准。

### Checkbox 复选框

两种尺寸、六种来源状态，参考 `preview/checkbox.html`：
- 独立控件：`label.ds-checkbox`保留原生`input.ds-checkbox__input`、`span.ds-checkbox__box`和`span.ds-checkbox__label`，带当前control标记。原生input负责勾选、禁用、键盘与表单语义，box负责FS外观。Select/Dropdown等宿主只按已登记的受控标记适配调用。
- 大号18px方块配14px/22px文字，小号14px方块配13px/20px文字，图文间距8px。同组尺寸统一；一般选项默认lg、密集选项可用sm，已核实的Form/协议14px宿主按真实来源保留，不能用通用约定排除原件。
- 六态：Default、Hover、Press（选中）、半选、Disable、Disable选中。静态示例使用修饰类；独立控件由原生input状态和Checkbox运行时同步，不由页面重复绘制或复制状态样式。
- 方块使用12个来源SVG：两尺寸×`default|hover|checked|indeterminate|disabled|disabled-checked`。不使用浏览器默认勾选外观或自绘内联图形；这不禁止保留原生input语义。
- 普通禁用文字为`rgba(25,25,26,0.3)`；禁用且选中文字保留Gray1，图标素材已有30%透明度，不再给整根叠加透明度。
- 六态标签声明属性来源已核；字重、具体宿主主引用、实际浏览器几何/键盘和整族视觉仍待，不以源码状态或用户对其他组件的反馈替代。

### Badge 徽标数

一个组件三种类型，参考 `preview/badge.html`（规范 v1.1.2603A）：
- **圆点徽标** `ds-badge-dot`：8×8px 实心圆，5 种状态色——`--success` #10A300（完成/有货）、`--error` #C00000（紧急/错误）、`--active` #F56300（活跃）、`--pending` `var(--color-yellow)` #FFD748（待定）、`--default` #707070（未发货/过期/中性）。可纯圆点，或用 `ds-badge-status` 包裹圆点+文字（14px/600）。
- **数量徽标** `ds-badge-count`：红底白字未读数，单数字为正圆（PC&Pad 18px），多位数横向撑成胶囊，封顶显示 `99+`。M 端加 `--m`（高 12px / 字 10px SemiBold）。背景恒为品牌红，不换色。
- **图案徽标** `ds-badge-icon`：容器内放图标（PC&Pad 18px，M 端 `--m` 12px），内部图标不得超出底盘。目前官方仅账户用途，复用 `icon-account`。
- **位置规则**：叠加在宿主图标/按钮上时用 `ds-badge-anchor`，徽标固定右上角（**禁止左上角**）。
- 纯展示组件，无 hover/disabled 等交互状态。

### Collapse 折叠面板

一个组件四种类型，参考 `preview/collapse.html`（规范 v2.0）。**默认手风琴单开**；仅 split 可通过 `data-collapse-mode="multiple"` 显式多开，须有来源交互证据且在 Plan 登记 `configuration.expansionMode`。其他变体保持单开。所有类型 hover 整行背景变 `#F6F6F8`。
- **基础分割型** `ds-collapse--split`：普通信息、FAQ、设置页的分割堆叠行。保留 root/item、button header、title 内加减号和 body；编号可作为标题内容，不替代展开指示器。右侧 `ds-collapse__always` 或 Toggle 是可选业务槽，没有来源内容时不渲染、不留空占位。标题/正文可替换，字体、留白、边框与交互沿用组件；不得页面 CSS 覆盖。
- **行内编辑型** `ds-collapse--inline-edit`：账户信息，预览态（label 270px + 值 + Edit，`icon-edit`）点击展开为编辑态（复用 `ds-input-field` 灰底输入框 + `ds-btn` Cancel/Save）。hover 时 Edit 变蓝 + 下划线。
- **数据预览型** `ds-collapse--data-preview`：订单行，两种形态（含/不含 Pickup Order 浅绿标签）。展开箭头 `icon-chevron-down`（展开旋转 180°），状态旁 `icon-info`，行尾 `icon-more` ⋯ 更多；展开后灰底显示白色 Order Preview 卡（商品缩略图 + `ds-badge-dot` 状态点 + `ds-btn`）。
- **特征导引型** `ds-collapse--feature`：产品特征列表，默认展开第 1 条（灰底圆角 8px），前导图标 20px（当前用库中现有图标占位），联动右侧视觉媒体。

### Dropdown 下拉菜单

五种变体，参考 `preview/dropdown.html`：
- **基础下拉**：`ds-dropdown` > `ds-dropdown__trigger` + `ds-dropdown__panel`。
- **带搜索**：panel 内加 `ds-dropdown__search`。
- **多选 Checkbox**：list item 内用 `ds-checkbox ds-checkbox--sm`（不再用浏览器原生 `input[type="checkbox"]`）。
- **分组**：用 `ds-dropdown__group-title` + `ds-dropdown__divider` 分隔。
- **Filter 筛选**：触发器用 `ds-dropdown__filter-trigger`（胶囊形）。
- 触发器高度：默认 42px，小尺寸加 `ds-dropdown__trigger--sm`（30px）。
- 箭头旋转：触发器加 `ds-dropdown__trigger--open` 时，箭头自动旋转 180°（无需手动加 `--up`）。
- 下拉面板：`position: absolute; top: 100%; left: 0; right: 0; z-index: 10; margin-top: 4px`。`box-shadow: 0 2px 8px rgba(0,0,0,0.1)`，`border-radius: 4px`。父容器 `.ds-dropdown` 需要 `position: relative` 以建立定位上下文。

### Stepper 步骤条

唯一事实源：`components/contracts/stepper.json`、`components/components.css` 与 `components/preview/stepper.html`。

步骤条提供四种正式变体：圆标居中型（方案）、圆标居中型（订单）、图标常规型、图标分隔线型。所有变体使用单一组件布局；不维护设备专用样式。

**Canonical DOM：**
- 根节点：`ds-stepper`
- 步骤项：`ds-stepper__item`
- 状态标记：`ds-stepper__marker`
- 标题与说明：`ds-stepper__title`、`ds-stepper__description`
- 图标槽：`ds-stepper__placeholder`，使用本地 SVG 图标
- 图标常规型连接器：相邻步骤间的 `ds-stepper__connector ds-stepper__connector--arrow`，内含 36×16 inline SVG
- 图标分隔线型连接器：`ds-stepper__divider`
- 图标分隔线型标题尾部箭头：`ds-stepper__title-icon`，以 `<img>` 嵌入图标库的 `components/icons/icon-arrow-right.svg`，保持 12×12px 与深灰 `#19191A`；颜色仅由 Stepper 作用域样式处理，不修改共享图标资源。

**规则：**
- 仅用于具有明确先后顺序的流程、订单状态或阶段说明；并列内容使用 Card 或 IconCard。
- 图标常规型的箭头必须是步骤项之间的同级 inline SVG；禁止文字箭头或 `<img>`。
- 图标步骤条必须引用 `components/icons/icon-demo-report.svg`；不得热链或使用临时占位图。
- 不得使用旧版 `ds-stepper__step`、`ds-stepper__separator` 等结构；以组件预览中的四种正式变体为准。

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
- Breadcrumb is an optional slot in every Banner variant. Its presence does not determine which Banner variant to use. Place it as a direct child of `.ds-banner`; the component positions it at the upper-left of the content container.
- Choose `ds-breadcrumb--dark` on dark Banner backgrounds and the default variant on light backgrounds, including Mini Banner.
- Outside a Banner, Breadcrumb sits in its own container row above the main content, typically `padding: 12px 0` inside a `max-width: 1200px` container.
- Text must match source page exactly — no abbreviation or omission.

### Carousel (走马灯)

**Navigation Buttons (Prev / Next):**
- **当前场景默认（用户2026-11-10确认）**：卡片内容轮播一般优先48px实心款（包括按实际角色判定的产品卡、内容卡、评价卡）；Banner轮播要求56px。56原件/箭头与调用待核，本地旧首页48px及56×8分页不得冒充56px控制。
- 设计候选与发布准入分开：四款真实Preview均需按场景比较，简明目录的可调用列表不代表全部设计选择。48/56未开放时记录精确缺口，不能自动改选M；M须同时有明确白底浅描边需求和真实左右切换行为。来源见`components/sources/carousel/scene-selection-user-1110.json`。
- 先按实际使用场景核对原始宿主和具体变体，再确定尺寸；不存在通用40px规格。保存来源见 `components/sources/carousel/desktop-host-source-review-1014.json`、`solid48-current-identity-review-1014.json` 与 `outlined28-call-source-1019.json`。
- 已读取的 Web 外部多图原件68908:043079：48×48px圆形实心按钮，官方28×28px箭头；Default底rgba(25,25,26,.3)、Hover .5、Disabled .04。该来源用于场景判断，不自动开放全局完整Carousel调用。
- 已开放独立描边M：28×28px按钮、16×16px官方箭头，Default白底、Hover #F2F2F2、Disabled整体30%。只有场景证据适用时才能选，不能因为已开放就替代其他尺寸。
- 36/20等原件及其他布局仍按各自契约的来源和开放边界处理；不从旧正文40px或其他宿主推断。
- Overlaid layout: `position: absolute; top: 50%; transform: translateY(-50%)`. Prev at `left: 12px`, Next at `right: 12px`.
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

### Surface 与组件边界

- 普通页面模块使用白色 `#FFFFFF` 或浅灰 `#FAFBFB` surface；模块上下留白属于当前模块的背景范围。
- 只有实际调用已确认变体的 Banner 时，才使用 Banner 允许的深色 surface；普通内容模块不得借用此例外。
- 页面级卡片类内容也遵守父级背景规则：灰色模块内白底无描边，白色模块内按已映射 FS 变体确定描边。具体组件结构、描边变体和交互以当前契约与 Preview 为准。
- 来源卡片的装饰背板不能作为普通内容图照搬。实际读图后在同一素材记录 `surfaceContent.kind` 为 `decorative-only` 或 `mixed-image` 并保留依据；映射时可记录 `surfaceMapping.kind=fs-token`，保留原素材身份，以 `--color-white` 表达普通卡片表面。混合素材须同时登记原图片作为独立、完整的 `bounded-image` 保留，文案不能压在该图上；不得把照片、图标或未判明的素材当纯装饰丢弃。输出保留同一 `data-plan-asset` 与 `data-fs-surface-token`，实际渲染核对实际背景与图片可见/裁切/叠字；这项映射不开放任何新组件变体。

### 明确授权的响应式案例

默认与历史 desktop 规则保持不变。明确授权的 `responsive-1920-1024-414-v1` 案例使用同一页面：PC版心1200，Pad1024宽版心976（左右24）；手机单列。手机正文安全边距16来自已确认的M通栏Card宽382（414画布）及US Footer；这不代表全部M组件统一边距。Banner独立使用其对应端组件边距（Pad48、M24）。普通section上下40及内部文字间距继续使用原Token。1248/640为当前案例根据内容能否容纳而选择的CSS断点，1920/1024/414只作验收基准。

当前US响应式固定壳层和完整文案Hero调用 `header-responsive`、`footer-responsive`、`hero-responsive` 的真实Preview及组件运行资源。手机首页型Banner233只含标题，不容纳本例正文与CTA；本例采用最接近的M解决方案型440布局，完整保留来源正文与CTA，并登记为适配尝试。展开导航和Footer的运行态为已记录的实现适配，MG证明默认/收起形态，不能据此宣称全部交互状态都有设计稿。

### 版心、文字与内容布局

- Max content width: 1200px, centered. `--spacing-container-x` 固定为 0px；版心内部不再增加水平安全边距，内容只受居中产生的外边距约束。
- Section vertical spacing: **40px** top and bottom（`padding: var(--spacing-section-y) 0`）。这 40px 属于 section 自身的背景范围，必须由当前 section 的 surface 覆盖；禁止用透明的外部 `margin` 制造模块间距，让 `body` 背景露出来。
- Section title: 24px/600, center-aligned. Title → description gap: 12px. Description → content gap: 24px (section-header 整体 margin-bottom: 24px).
- Section description: 14px/400, `#707070`, center-aligned, max-width 800px.
- Section header spacing: title → description gap: 12px. Description → content gap: 24px.
- 没有描述时，标题 → 内容仍使用 24px；标题自身 `margin-top` 与 `margin-bottom` 必须为 0，不能依赖浏览器默认样式。
- Card grid gap: 20px（`var(--spacing-grid-gap)`）。Max columns per row: 4. Fewer columns (1–3) are allowed.
- 普通卡片网格同一行必须等高、底边对齐，由页面装配层保证拉伸链路完整。存在链接等外层包裹时，必须同时检查包裹节点与内部 Card 的高度，不能只让外层等高。可用单格 Grid 包裹让直接子 Card 自然拉伸，不覆盖组件内部样式；各行按内容自然确定高度，不默认强制全页统一固定高度，不删文案、不补空内容。视觉检查覆盖长短文案、有无型号和标签，静态检查通过不能替代浏览器实际底边对齐验收。
- 双栏布局/相邻内容块间距: 40px（`var(--spacing-layout-gap)`）。

**页面级布局间距令牌（唯一权威值，页面生成时用这些，不要手写裸 px）：**

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--spacing-section-y` | 40px | section 区块上下留白 |
| `--spacing-container-x` | 0px | 版心容器不增加水平内边距 |
| `--spacing-grid-gap` | 20px | 卡片/内容网格列间距 |
| `--spacing-layout-gap` | 40px | 双栏布局/相邻内容块间距 |
- Card grid spacing: 20px on all sides (top, bottom, left, right) between cards.
- Category label (e.g. "DIN Rail Mount") to card grid below: 20px margin-bottom.
- Border radius: 2px (sm), 4px (md, default), 8px (lg), 9999px (pill).
- Shadows: hover card `0px 15px 15px -10px rgba(0,0,0,0.1)`, dropdown `0 10px 15px rgba(0,0,0,0.1)`.
- Section separation follows content grouping and reading rhythm. Consecutive white or gray sections are allowed; do not alternate mechanically. Component parent-surface and border rules still apply.
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
- Choose white/gray surfaces by content grouping and component constraints; consecutive same-color sections are allowed.

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

**Section 背景分组：**
- 白色：`class="page-section page-section--white"`，背景 `#FFFFFF`
- 灰色：`class="page-section page-section--gray"`，背景 `#FAFBFB`
- 背景按内容关联、信息分组及阅读节奏选择，允许连续同色；不得为逐块交替拆散同组内容。组件自身的父级背景与描边要求仍须分别满足。

**Section Header 间距规则：**
- title: `font-size: 24px; font-weight: 600; line-height: 32px; text-align: center; margin-bottom: 12px`
- desc: `font-size: 14px; font-weight: 400; line-height: 22px; color: #707070; text-align: center; max-width: 800px; margin-bottom: 24px`
- section-header 整体 `margin-bottom: 24px`（到内容区）

**容器规则：**
- `class="container"`：`max-width: 1200px; margin: 0 auto`，水平 padding 为 `var(--spacing-container-x)`（当前固定 0px，不额外缩进）
- Section 自身：`padding: var(--spacing-section-y) 0`（上下 40px），并保持 `margin-block: 0`；上下留白的背景归属于当前 section。

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
3. 2–4 个内容 Section（按内容分组选择白/灰）
4. 可选 CTA Banner（深色，outline-white 按钮，绝不用 filled-red）
5. 可选 Form Section
6. Footer

---

### 重构测试页（pages/ 目录）

> **本目录只提供组件资料。页面入口、工作流与登记统一使用项目根目录 AGENTS.md、README.md 和 index.html。** 下面是结构参考。

- 使用 FS header/footer，不保留源站导航
- Hero 用 FS banner 结构，不复制源站 carousel shell
- 内容模块转换为 FS card/section 模式
- 保留源站内容和功能意图，不保留源站视觉风格

---

## 9. Implementation Sources

所有组件的 HTML 结构和 `ds-*` 类名，必须从以下文件读取，不得从记忆中写：

| Component | Local File to Read |
|---|---|
| Header / Footer | `components/preview/navigation.html` |
| Banner / Hero | `components/preview/banner.html` |
| Anchor Nav | `components/preview/anchor-nav.html` |
| Buttons | `components/preview/button.html` |
| Text Buttons | `components/preview/text-button.html` |
| Cards | `components/preview/card.html` |
| Icon Cards | `components/preview/icon-card.html` |
| Form | `components/preview/form.html` |
| Tab | `components/preview/tab.html` |
| Input | `components/preview/input.html` |
| Dropdown | `components/preview/dropdown.html` |
| Stepper | `components/preview/stepper.html` |
| Carousel | `components/preview/carousel.html` |
| Breadcrumb | `components/preview/breadcrumb.html` |
| Tokens | `components/tokens.css` |
| Component CSS | `components/components.css` |

Icons 目录：`components/icons/`，资产身份与有限使用范围登记在 `components/icons/icons-manifest.json`。图标须匹配实际语义，不能把 `icon-placeholder-switch.svg` 当作不同业务角色的默认替代。

带 `usageContract: fs-icon-usage/1` 的已核静态图标，素材记录须注明 `iconUsage.role/width/height/state`，保留原尺寸和官方SVG字节；不得改色、缩放、借作其他含义或推导交互状态。实现与检查须核对实际SVG、原始导出与来源PNG；公共检查同时核对角色、指纹及实际渲染尺寸/颜色处理。静态图标原件只证明该图标，不建立Button/IconButton的插槽或组合变体；宿主仍须有各自真实来源与契约。

---

## 10. 页面执行入口

页面任务统一使用项目根目录 AGENTS.md；本目录不定义页面工作流。组件几何、变体、依赖和原维护规则保持当前契约为准。
