# FS Page Generation — Mandatory Workflow

> This is the portable, agent-agnostic edition of the workflow. Codex and other
> AGENTS.md-aware agents read this file automatically; no Kiro-specific hooks are required.

Every time you generate or modify an FS page, follow this exact sequence. No skipping.

---

## Rule 0 — Header / Footer Absolute Rule (highest priority, never violate)

On the **first generation** of any page, the header and footer MUST be used **verbatim** from `fs-components/component-specs/preview/navigation.html`. No modifications of any kind:

- Do NOT change the Logo — it is always the standard FS logo (`icon-logo-fs.svg`). Never replace it with "Support", a sub-brand, a competitor name, or a text composite.
- Do NOT change the nav links — they are always: All Products / Solutions / Services / Resources / Contact Us.
- Do NOT change the right-side actions — search / account / cart. Never add or remove buttons. Never add a red CTA (e.g. "FS Store") to the header.
- Any header/footer shown in the prototype or source site (FS Support sub-site, competitor, third-party) is IGNORED — never carried into the page.
- The ONLY allowed customization is a documented `data-props` override.

This is absolute. It does not matter whether the prototype is an FS sub-site, a competitor, or a third-party page — the first output always uses the standard FS header/footer. The user is free to edit the header afterward; the AI must not pre-emptively change it or "adapt" it to the source.

Preferred mechanism: reference the component instead of hand-writing it.
```html
<div data-component="navigation" data-fragment="header"></div>
<div data-component="navigation" data-fragment="footer"></div>
```
If the page is a standalone file in `pages/` (not built via `build.js`), copy the header/footer markup from `navigation.html` exactly — do not edit logo, links, actions, or add buttons.

---

## Step 1 — Read Spec Files

Read ALL of the following before writing a single line of code:

**Always read:**
- `README.md`
- `design-spec/fs-design-system.md`
- `fs-components/component-specs/tokens.css`
- `fs-components/component-specs/components.css`

**Read for each component the page uses:**

| Component | File to Read |
|---|---|
| Header / Footer | `fs-components/component-specs/preview/navigation.html` |
| Banner / Hero / Sub Banner | `fs-components/component-specs/preview/banner.html` |
| Anchor Nav | `fs-components/component-specs/preview/anchor-nav.html` |
| Button | `fs-components/component-specs/preview/button.html` |
| Text Button | `fs-components/component-specs/preview/text-button.html` |
| Card | `fs-components/component-specs/preview/card.html` |
| Icon Card | `fs-components/component-specs/preview/icon-card.html` |
| Form | `fs-components/component-specs/preview/form.html` |
| Tab | `fs-components/component-specs/preview/tab.html` |
| Input | `fs-components/component-specs/preview/input.html` |
| Dropdown | `fs-components/component-specs/preview/dropdown.html` |
| Stepper | `fs-components/component-specs/preview/stepper.html` |
| Carousel | `fs-components/component-specs/preview/carousel.html` |
| Breadcrumb | `fs-components/component-specs/preview/breadcrumb.html` |

---

## Step 2 — Declare Read Confirmation

Before writing any code, output this block:

```
Components this page needs: [list them]

✅ Read: README.md
✅ Read: design-spec/fs-design-system.md
✅ Read: tokens.css + components.css
✅ Read: [each component preview file used]

Key values from spec:
- Brand red: #C00000
- Section padding: 40px top/bottom
- Container: max-width 1200px, no horizontal padding
- Card gap: 20px, max 4 columns
- Section title: center-aligned, 24px/600
- Title → desc gap: 12px | Desc → content gap: 24px
```

If you cannot fill this in from what you just read, go back to Step 1.

---

## Step 2.5 — Source Page Filter + Component Mapping (重构页面必须执行)

**重构外部网页时，在写任何代码之前，必须完成以下两步。跳过此步骤是致命错误。**

### A. 源页面品牌过滤

逐一检查源页面的每个视觉元素，判断是否违反 FS 规范。以下元素**一律丢弃，不得带入**：

| 源页面元素 | 处理方式 |
|---|---|
| 源站 header/footer/logo/导航 | 全部替换为标准 FS header/footer（见 Rule 0，逐字不改） |
| 品牌装饰线（如 DB 红线、分隔线） | 删除，FS section title 只有文字 |
| 非系统背景色（渐变、品牌色块） | 替换为 `#FFFFFF` / `#FAFBFB` / `#19191A` |
| 深色内容卡片背景 | 替换为白色 `#FFFFFF`，`#19191A` 只用于 banner |
| 源站 hero carousel shell | 替换为 `ds-banner--hero` / 合适的 banner 变体 |
| 品牌字体、字重 | 替换为 Open Sans 400/600 |

### B. 强制组件映射表

写代码前，必须输出以下映射表，每个源页面模块都必须对应一个 FS 规范组件：

```
源页面模块 → FS 组件映射：
- 顶部导航 → 标准 FS header（data-component="navigation"，逐字不改）
- [源模块名] → ds-banner--hero / ds-banner--search / ds-card--vertical / ds-icon-card / ds-stepper / ds-tab / ...
- [源模块名] → page-section--white / page-section--gray
- 底部 → 标准 FS footer（data-component="navigation"，逐字不改）
- ...（每个模块都要列出）
```

**规则：**
- 映射表里不允许出现自定义 class 作为主结构（容器/网格布局除外）。
- 顺序流程（步骤 1→2→3…）优先映射到 **Stepper 步骤条** `ds-stepper`，不是普通卡片。
- 图标卡片必须保留暴露图标（默认 `icon-placeholder-switch.svg`），不得删除图标做成纯文字方块。
- 如果某个模块找不到对应的 FS 组件，必须用最接近的 FS 组件 + 最小化 inline style 覆盖。
- 映射完成后，写代码时**直接从对应的 `preview/*.html` 复制 HTML 结构**，只替换内容文字，不改 class 和结构。

### C. Banner 硬约束（每次必读）

先按变体决策表选对 banner 变体（Hero / Sub / Search / Title-only / Mini），不要默认 Hero，也不要自造 banner 结构：
- 有搜索框 → `ds-banner--search`
- 有面包屑 → `ds-banner--sub`
- 仅标题 → `ds-banner--title-only`

`ds-banner--hero` 的 CSS 基于 1920px 全宽设计，在 1200px 容器页面里必须用 `display: block; padding: 0` 覆盖，内部加 `max-width: 1200px; margin: 0 auto; height: 420px` 容器。

```html
<!-- 正确写法 -->
<div class="ds-banner ds-banner--hero" style="background-image: url('...'); background-size: cover; background-position: center; display: block; padding: 0;">
  <div style="max-width: 1200px; margin: 0 auto; height: 420px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 20px;">
    <p class="ds-banner__title">标题</p>
    <p class="ds-banner__desc">描述</p>
  </div>
</div>
```

### D. 图片来源硬约束（每次必读）

**总则：有配图位的地方必须放真实图片，绝不用深色块/纯色块代替。** 优先用源站/竞品原图。**如果原图抓不下来或拿不到，必须改用与该模块文字内容相关的替代真实图片（主题相关的图片 URL），不得用 `#E8E8E8` 灰块或任何纯色/深色块占位。** `#E8E8E8` 占位块不再作为兜底。`#19191A` 只能作为背景图加载失败时的 fallback，不能当成"配图"。唯一例外：具名真实人物的头像若无授权照片，用中性头像占位，不套用陌生人脸（避免张冠李戴）。

| 输入来源 | 图片处理规则 |
|---|---|
| **竞品链接重构** | 尽可能把竞品原页的图片资源带出来使用——直接用竞品图片 URL（`background-image: url('竞品图URL')` 或 `<img src="竞品图URL">`），放到对应配图位。**若竞品原图抓不下来/拿不到，改用与文字内容相关的替代真实图片（主题相关 URL），不得用 `#E8E8E8` 等占位块。** |
| **需求文档 / 原型图合成** | 尽可能使用与文字内容相关的图片（主题相关的真实图片 URL），让配图贴合该模块的文案语义，不要留空块或纯色块。 |

**边界：**
- 只针对内容配图区：hero/banner 背景图、`ds-card--vertical` 等卡片的 `ds-card__image`、图文展示模块。
- 不影响 Rule 0：header/footer/logo/导航仍逐字用 FS 标准片段，不带入竞品 header/logo。
- 不影响 icon-card：图标卡片按规范只暴露图标，不强行塞配图。
- 深色 banner 上文字仍只用白色 `#FFFFFF`，背景图之上不加非系统色块。

### E. 白字压图遮罩硬约束（每次必读）

白色文字叠在背景图上（hero / 深色 content banner / 图上有文字）时，图片**必须**加一层纯色半透明深色遮罩，否则亮图上白字看不清：

- 用 `box-shadow: inset 0 0 0 2000px rgba(0,0,0,0.5);`（纯色叠加，覆盖图、压在文字下）或绝对定位 rgba 遮罩层。
- **禁止用 gradient**（validate 报 `BG_GRADIENT` error）。必须纯色 rgba，强度 `rgba(0,0,0,0.45~0.55)`，亮图取高值。

---

## Step 3 — Write Code

- Use only `ds-*` classes from `components.css` — never invent new component patterns. Custom CSS is allowed ONLY for layout scaffolding (container, page-section, grid wrappers), never for component visuals.
- Use `<div data-component="navigation" data-fragment="header/footer">` for header/footer; for standalone `pages/` files copy them verbatim.
- 100% replicate the prototype's text and links. Do not invent marketing copy. If a description is illegible/placeholder in the prototype, keep it minimal and faithful — do not fabricate.
- Use icons from `fs-components/component-specs/icons/`. Never strip an icon out of a component that requires one.
- Run `node build.js` if using the page-source workflow.

---

## Step 4 — Render and Self-Check (do not skip rendering)

> **作用域：`fs-components/page-specs/` 只放页面级规范(标杆参考页,如 industrial-switches),走 `page-sources/ → build.js → page-specs/` 管线。普通合成/重构/测试页一律写在 `pages/`(独立手写)。挂在 `index.html` 「Test Pages」的 `pages/` 页面受 `validate.js` 校验(0 error);未挂 index 的随手草稿可随时移除。**

### Step 4.0a — 先过自动闸门（硬性）

对受规范约束的页面（`page-specs/`），先跑：

```
node validate.js
```

**必须 0 error 才算通过。** 这是把背景色、字重、渐变、横向卡边框、header/footer 完整性、白字压图遮罩等机械规则自动化的硬闸门。validate 红了就先修。

**新增的几条机械检查（都是历史反复犯的错，已写死成闸门）：**
- `BULLET_CLASS` / `BULLET_SIZE`：`icon-bullet.svg` 必须用组件类 `ds-card__bullet-icon`，禁止裸 `<img>` 或 inline 写死 width/height（防止 4px 圆点被撑成大灰球）。
- `ANCHOR_TAB_UNDERLINE`：`<a class="ds-anchor-nav__tab">` 必须带 `text-decoration: none`，否则报错（防止默认下划线）；或直接用 `<div>`。
- `SECTION_DESC_WIDTH`：`.section-header__desc` 的 max-width 必须是 960px（锁死规范，防止 800/960 漂移）。
- `DS_INLINE_TEXT`（warn）：`ds-*` 元素上 inline 写 `color`/`font-size` 会告警，提示改用组件文本类/token（如 `ds-card__desc` = #707070）。

紧接着跑几何闸门（headless）：

```
node verify.js
```

**也必须 0 error。** 它用 puppeteer-core 驱动系统 Chrome 渲染页面，量真实 bounding box，自动判定 validate 抓不到的几何问题——卡片尾部 link/tags 同行居底对齐、走马灯按钮可见/居中/不被裁、图片是否加载失败。需先 `npm ci` 一次；Chrome 不在 macOS 默认路径时设 `CHROME_PATH` 环境变量。

两个自动闸门都过后，再做下面的人工渲染对账（颜色/组件选型/图标这些机器判不准的）。

After writing, you MUST actually render the page (browser/screenshot) and compare against the prototype block-by-block. Never claim "self-check passed" without rendering.

### Step 4.0 — How to self-check correctly (failure-mode rules, never violate)

These rules exist because past self-checks "passed" but the page was still wrong. Root causes and their hard fixes:

1. **grep / string matching is NOT a self-check.** Confirming a class name exists only proves the string is present. It cannot verify color, whether a component belongs there, or icon identity. A self-check is INVALID unless you actually rendered the page and looked at it. If you cannot render (e.g. browser locked), you MUST say "render self-check NOT done" — never substitute grep and call it passed.

2. **Audit EVERY element against the spec, not just the ones you changed.** Do a block-by-block pass over the whole page (header → banner → each section → footer). Selective review = confirmation bias = missed errors. For each element answer: (a) is this the right COMPONENT? (b) is the VARIANT right? (c) are COLOR, ICON, BORDER, LINK STYLE right?

3. **Component selection comes BEFORE implementation detail.** First ask "should this component even be here?" — not "is the class written correctly?". Example: fixing a carousel's wrapper class is worthless if a carousel does not belong on the page at all. Validate the choice, then the details.

4. **Never downgrade or skip a rule for convenience/scope.** If a rule applies (e.g. sequential flow → Stepper), execute it fully. Do NOT rationalize a cheaper substitute (e.g. "cards are close enough"). If you are unsure whether a rule applies, ASK — do not guess and do not silently deviate.

5. **Do not invent values in ambiguous spots.** Backgrounds, banner variant, colors, icons must come from the spec/components, not from your own reasoning. If the spec is ambiguous for this page, confirm with the user before shipping a guess.

### Step 4.1 — Element-by-element audit table (run for every element)

| Check | Correct per spec |
|---|---|
| Icon-card link color | Single-event link = `ds-text-btn--black`, NOT blue. Blue is only for standalone text links / blue-link lists per spec. |
| Icon-card blue-link list | `ds-icon-card__blue-link` — no default underline; underline on hover only. Do not force blue + permanent underline. |
| Icon-card link row alignment | `ds-icon-card__link` uses `margin-top: auto` so link rows pin to the card bottom and stay aligned across cards of differing height. Don't override with fixed top margins. |
| Vertical-card link row alignment | `ds-card--vertical .ds-card__link` uses `margin-top: auto` so link rows pin to the card bottom and stay aligned across vertical cards of differing height. Don't override with fixed top margins. |
| Icons | MUST come from `fs-components/component-specs/icons/`. NO hand-written inline `<svg>`. Verify each icon is a real file in the icons library. |
| Carousel | Only exists if the source's carousel BEHAVIOR is the thing being tested. Otherwise no carousel at all — do not add one to "fill" a grid. |
| Sequential / lifecycle / numbered stages | `ds-stepper` — never a card grid, never icon-card grid. |
| Banner variant + background | Variant per decision table; background from spec, not invented. |

Then verify against the component spec HTML files:

- [ ] **Header/footer: verbatim from `navigation.html` (Rule 0). Logo unchanged, nav links unchanged, actions unchanged, no added buttons, no red CTA. Source/competitor header ignored.**
- [ ] Topbar, main nav, footer content areas use `max-width: 1200px; margin: 0 auto; padding: 0`（footer uses `padding: 32px 0`），无水平 padding
- [ ] Footer column links: text color is `#707070` (gray-3)
- [ ] Banner variant chosen per decision table — Search if search box, Sub if breadcrumbs, Title-only if single title, Hero only for landing pages. Never a custom hero structure.
- [ ] Buttons: only `ds-btn` classes, sizes 42/36/32/32px, no red in banners/cards/header
- [ ] Dark banners: buttons use `ds-btn--outline-white` only
- [ ] Dark banner text: ONLY white `#FFFFFF`
- [ ] UI surface backgrounds: ONLY `#FFFFFF`, `#FAFBFB`, `#19191A`, `#4B4B4D`
- [ ] Card variant chosen per decision table
- [ ] Gray section cards use `ds-card--no-border`; White section cards use `ds-card--bordered-full`
- [ ] Horizontal cards: no border, no hover shadow, image keeps 8px radius, text area padding 32px
- [ ] **Sequential process (step 1→2→3…) uses `ds-stepper`, not plain cards.**
- [ ] **Icon cards keep their exposed icon (`icon-placeholder-switch.svg` or a real icon from the icons library). Never strip the icon to make a bare text box.**
- [ ] Icon card border: white section → `ds-icon-card--bordered`; gray section → no border
- [ ] Icon-card link rows aligned: `ds-icon-card__link` relies on `margin-top: auto` to pin links to the card bottom across cards of differing height — don't override it
- [ ] Vertical-card link rows aligned: `ds-card--vertical .ds-card__link` relies on `margin-top: auto` to pin links to the card bottom across vertical cards of differing height — don't override it
- [ ] **Carousel controls use `ds-carousel__controls` wrapper (resets buttons to `position: static`). Never put `ds-carousel__btn` in a custom wrapper — it defaults to `position: absolute` and will float away.**
- [ ] Carousel buttons: 40×40 circle, default `rgba(25,25,26,0.3)` + white icon, no red. First slide Prev disabled, last slide Next disabled.
- [ ] 走马灯版心两侧布局时，Prev/Next 按钮在版心外侧、距版心边缘 32px，垂直居中，且不被 `.ds-carousel` 的 `overflow: hidden` 裁掉。
- [ ] Tab: active item has `ds-tab__item--active` + `ds-tab__indicator` (2px red). Standard center uses `ds-tab--standard ds-tab--center`.
- [ ] Font weights: 400 or 600 only
- [ ] No element has both border AND shadow at rest
- [ ] Container: max-width 1200px, no horizontal padding
- [ ] Section padding: 40px top and bottom
- [ ] Card grid gap: 20px, max 4 columns
- [ ] Section titles: center-aligned, 24px/600, line-height 32px, margin-bottom 12px
- [ ] Section desc: 14px/400, color #707070, max-width 960px, center-aligned, margin-bottom 24px
- [ ] Title → desc: 12px gap | Desc → content: 24px gap
- [ ] Sections alternate white ↔ gray
- [ ] Links: blue `#0060BF`
- [ ] **100% replicated the prototype's text and link labels — no invented marketing copy, no drifted labels.**
- [ ] **配图位放了真实图片，没有用深色块/纯色块/`#E8E8E8` 灰块代替（竞品重构带出竞品图片；原图抓不到或需求/原型合成 → 用内容相关的替代真实图片）。`#E8E8E8` 不再作为兜底。详见 Step 2.5 D。**
- [ ] **白字压在背景图上 → 图片有纯色 rgba 深色遮罩（`box-shadow: inset` 或 rgba 层），禁用 gradient。详见 Step 2.5 E。**
- [ ] **几何自检（用 evaluate_script 量 bounding box，不能只查类名）：同一网格行各卡片尾部 `ds-card__link`/`ds-card__tags` 的 bottom Y 必须相等。不等→去查 `components.css` 实现（如 `margin-top:auto` 是否真的写了），不是改 markup。**
- [ ] **几何自检：走马灯 Prev/Next 按钮 bounding box 未被裁（width>0）、垂直居中、按变体定位（版心两侧布局距版心边缘 32px、在 `.ds-carousel` overflow 之外）。**
- [ ] **Actually rendered the page and compared to the prototype block-by-block. No stray/floating elements.**

---

## Step 5 — Mandatory Constraints (Never Violate)

These rules override any visual from the source page. If the source page violates these, use the FS-compliant alternative.

### Header / Footer
- See Rule 0. Always verbatim FS header/footer on first generation. No exceptions.

### Color Constraints
- Background colors allowed: ONLY `#FFFFFF`, `#FAFBFB`, `#19191A` (dark banner). No other colors.
- Dark banner text: ONLY white `#FFFFFF`.
- Red `#C00000` only for form submit buttons and hero search button. Blue `#0060BF` only for links/text-buttons. Never red in header.

### Component Selection
- Sequential / numbered process → `ds-stepper`.
- Icon + title + short desc grid → `ds-icon-card` WITH icon exposed.
- Image + title + sub-link list → `ds-card--vertical` (category-nav card) with `ds-card__sub-links`.
- **Image + title + text side-by-side (图左文右 / 文左图右, single-content full-width block) → ALWAYS `ds-card--horizontal` / `ds-card--horizontal-reverse` (white image card). Even if the source block is a dark / brand-colored panel, convert it to a white horizontal image card. NEVER hand-build a custom `content-banner`/dark `<div>` for an image+text block.**
- **Content Banner (dark) is ONLY a full-width dark CTA strip = title + desc + `ds-btn--outline-white`, with NO side image. It has no "side photo" layout. The moment a block has an image beside the text, it is a Horizontal Card, not a content banner.**
- Title + desc + search box hero → `ds-banner--search`.
- Never invent a custom component class for any of the above.
- **映射即读 preview（不得跳读）**: in Step 2.5, whatever FS component a module maps to, you MUST read that component's `preview/*.html` before writing. Do NOT skip reading a component file (e.g. `card.html`) by reasoning "I won't use that component" — the decision tables decide the mapping, and the mapping decides which files to read, not the reverse.
- **组件疑似不对时，先逐元素比对 `preview/*.html`，禁止凭猜测改**: when a component is reported wrong, FIRST open its `preview/*.html` and diff element-by-element (icon filename / separator type & size / child classes / colors) — do NOT guess a direction and edit. Stepper specifics: step icon = the icon named in the preview dependency bar (`icon-demo-report.svg`), NOT `icon-placeholder-switch`; arrow separator = the preview's **SVG arrow** (`<svg viewBox="0 0 36 16">` path), NOT a text `&rarr;`/`→` character.

### Carousel
- Always wrap nav buttons in `ds-carousel__controls` (inline) or place inside `.ds-carousel` (overlaid). Never a custom wrapper — buttons are `position: absolute` by default and will escape.
- **版心两侧布局 (container-flanking)**: 当走马灯内容铺满 1200px 版心时，Prev/Next 按钮放在版心**外侧两边，距离版心边缘 32px**（按钮内边缘 → 版心左/右边缘 = 32px），垂直居中（`top: 50%; transform: translateY(-50%)`）。按钮必须在 `.ds-carousel` 的 `overflow: hidden` 之外，否则会被裁掉。

### Card Border Rules
- White section → `ds-card--bordered-full`. Gray section → `ds-card--no-border`.
- Horizontal cards never use border classes, regardless of section.
- NEVER use `sed` for global class replacement — use targeted strReplace with unique context.

### Modification Safety Rules
1. Never use `sed` global replace.
2. After every modification, render + grep to verify only intended elements changed.
3. Source page visuals must pass the spec filter — replace non-compliant colors/structures.
4. One fix per strReplace.
5. **规则反复失效先查实现** — 文档写了却反复犯的错（如卡片链接居底），优先查 `components.css` 是否真的实现了那行 CSS（规范↔实现脱节）。共享 CSS 坏了，改 markup/再训练都无效，必须修 CSS 源头。
6. **对齐/定位类问题用几何断言自检** — 用 `evaluate_script` 量 bounding box 做数值断言（同行卡片尾部 bottom Y 相等、走马灯按钮未被裁/居中/距版心 32px），不能只靠"类名写了""元素存在"。

---

## Spec Update Rule

When any design rule changes, update ALL relevant files:

**Design rule changes (colors / sizes / spacing / component rules):**
1. `design-spec/fs-design-system.md` — primary spec
2. `AGENTS.md` — this file (AI checklist)
3. `fs-components/component-specs/components.css` — implementation
4. `design-spec/fs-design-system-preview.html` — visual preview for designer review

**Token changes (color variables / typography / radius / shadow):**
1. `fs-components/component-specs/tokens.css` — token definitions
2. `design-spec/fs-design-system.md` — primary spec
3. `fs-components/component-specs/preview/tokens.html` — token visual preview
