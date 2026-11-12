# FS Design Standard

A local, execution-focused design standard for AI-driven page generation and designer review.
It contains the FS visual rules, the canonical component markup, and the scripts that gate
generated pages. Not the official FS.com design system.

**Version:** 1.1.0

> **Planning:** see [`PLAN.md`](PLAN.md) for the department-wide construction plan
> and the platform roadmap (A/B/C), and [`FRAGMENT-CATALOG.md`](FRAGMENT-CATALOG.md)
> for the detailed fragment catalog implementation plan (方案 B).

---

## Core Files

| File | Role |
|------|------|
| `PLAN.md` | Department-wide construction plan, platform roadmap (A/B/C), and fragment catalog (方案 B) |
| `AGENTS.md` | Mandatory agent workflow — read automatically by Codex and other AGENTS.md-aware agents |
| `design-spec/fs-design-system.md` | Primary design spec — colors, typography, components, layout rules, Do/Don't |
| `fs-components/component-specs/tokens.css` | CSS custom properties (design tokens) |
| `fs-components/component-specs/components.css` | All `ds-*` component styles |
| `fs-components/component-registry.json` | Maps component names to preview files and fragments |
| `build.js` | Assembles page specs from page sources + component fragments |
| `validate.js` | Compliance gate (static) — scans `page-specs/` + `pages/`, fails on spec violations |
| `verify.js` | Geometry gate (headless) — renders pages in system Chrome via `puppeteer-core`, asserts card bottom-alignment / carousel button position / broken images |
| `index.html` | Project index — all page demos and component previews |

---

## Requirements

- Node.js 20+
- Google Chrome (for `verify.js`). Set `CHROME_PATH` if Chrome is not at the macOS default path.

```bash
npm ci          # install puppeteer-core from package-lock.json
npm run build   # node build.js
npm run validate
npm run verify
npm run check   # validate + verify
```

---

## Scope Rules（重要）

**页面归属规则:**

- **`fs-components/page-specs/` 只放「页面级规范」**——即作为标杆参考的页面规范（如 `industrial-switches.html`），通过 `page-sources/ → build.js → page-specs/` 管线产出。这里不放普通合成页。
- **其余所有合成/重构/测试页一律放 `pages/`**（竞品重构、需求合成、随手实验等），独立手写，不走 build 管线。

**`pages/` 内部分两类:** 挂在 `index.html` 「Test Pages」区展示的是「范例页」，和 `page-specs/` 一样受 `validate.js` 校验（必须 0 error）；未挂 index 的随手草稿可随时移除。

**校验范围:** `validate.js` 默认同时扫描 `page-specs/` 和 `pages/`。需要新增页面级规范时，写 `page-sources/`，跑 `node build.js`，再跑 `node validate.js`；普通合成/测试页直接写在 `pages/`，跑 `node validate.js` 校验即可。

---

## Directory Structure

```
fs-design-standard/
├── AGENTS.md                          # Agent workflow (portable, no Kiro dependency)
├── README.md
├── CHANGELOG.md
├── package.json
├── package-lock.json
├── build.js
├── validate.js
├── verify.js
├── index.html                         # Project index
├── design-spec/
│   ├── fs-design-system.md            # Primary spec
│   ├── fs-design-system-preview.html  # Visual spec preview
│   └── fs-page-generation-manual.html # Designer-facing generation manual
├── fs-components/
│   ├── component-registry.json        # Component name → file path map
│   ├── component-specs/
│   │   ├── tokens.css                 # Design tokens
│   │   ├── components.css             # All ds-* styles
│   │   ├── icons/                     # SVG icons + icons-manifest.json
│   │   └── preview/                   # Component preview / canonical markup
│   │       ├── navigation.html        # Header + Footer (data-fragment="header/footer")
│   │       ├── banner.html            # Hero, Sub, Search, Title-only, Mini
│   │       ├── anchor-nav.html
│   │       ├── button.html
│   │       ├── text-button.html
│   │       ├── video-button.html
│   │       ├── icon-button.html
│   │       ├── card.html
│   │       ├── icon-card.html
│   │       ├── tab.html
│   │       ├── input.html
│   │       ├── dropdown.html
│   │       ├── form.html
│   │       ├── stepper.html
│   │       ├── carousel.html
│   │       ├── breadcrumb.html
│   │       ├── typography.html
│   │       ├── icon-map.html
│   │       └── tokens.html
│   ├── page-sources/
│   │   └── industrial-switches.html
│   └── page-specs/
│       └── industrial-switches.html
└── pages/                             # Synthesized / reconstruction / test pages
    ├── about-fs.html
    ├── cdw-configuration-services.html
    ├── custom-cable-assemblies.html
    ├── dell-poweredge-servers.html
    ├── deutsche-bahn.html
    ├── fs-academy.html
    ├── fs-service-requests.html
    ├── fs-support-center.html
    ├── product-support.html
    ├── ruijie-education.html
    ├── ruijie-managed-service-providers.html
    ├── xtool-home.html
    └── assets/
```

---

## Workflow

### Viewing the Design Standard

Open `index.html` in a browser — it links to all page demos and component previews.

### Creating a New Page

1. Read `AGENTS.md` first — it is the mandatory workflow.
2. Create a standalone page in `pages/your-page.html`; copy header/footer verbatim from
   `fs-components/component-specs/preview/navigation.html`.
3. Use `ds-*` classes from `components.css`; copy component markup from the matching
   `preview/*.html` and replace content only.
4. Run `node validate.js` — static gate, must pass (0 errors).
5. Run `node verify.js` — headless geometry gate, must pass (0 errors).
6. Render the page in a browser and compare block-by-block with the reference.

For a page-level spec (golden page), use the build pipeline instead:

1. Create `fs-components/page-sources/your-page.html`.
2. Reference components with `<div data-component="navigation" data-fragment="header"></div>`.
3. Run `node build.js`.
4. Run `node validate.js` and `node verify.js`.

### Updating a Component

1. Edit the component preview HTML in `fs-components/component-specs/preview/`.
2. Edit `fs-components/component-specs/components.css` if the visual changes.
3. Run `node build.js` — pages referencing that fragment update automatically.
4. Run `node validate.js` and `node verify.js`.

### Checking Which Pages Use a Component

```bash
node build.js --check navigation
```

### Adding a New Icon

Drop the SVG into `fs-components/component-specs/icons/` and add it to
`icons-manifest.json`.

---

## `validate.js` Rule Codes

Static gate codes (error = must fix; warn = advisory):

| Code | Level | Checks |
|------|-------|--------|
| `CSS_TOKENS` / `CSS_COMPONENTS` | error | tokens.css / components.css must be linked |
| `NAV_HEADER` / `NAV_FOOTER` / `NAV_LINK` / `NAV_LOGO` / `NAV_RED_CTA` | error | FS header/footer present, canonical nav links + logo, no red CTA in header (Rule 0) |
| `FONT_WEIGHT` | error | font-weight must be 400 / 600 / normal |
| `BG_CHROMATIC` | error | surface background must be `#FFFFFF` / `#FAFBFB` / `#19191A` / `#4B4B4D` |
| `BG_GRADIENT` | error | no gradients on UI surfaces |
| `HCARD_BORDER` | error | horizontal cards never carry border classes |
| `ROGUE_CLASS` / `DS_RESTYLE` / `DS_OVERRIDE` | error | no hand-built BEM components; no page CSS overriding `ds-*` visuals |
| `WRONG_TAG` | error | component sub-elements use the required tag (e.g. `ds-icon-card__blue-link` = `<p>`) |
| `IMG_OVERLAY` | error | white text over a background image needs a solid rgba dark scrim (no gradient) |
| `ASSET_PATH` | error | asset path depth matches the file's directory |
| `BULLET_CLASS` / `BULLET_SIZE` | error | `icon-bullet.svg` must use `ds-card__bullet-icon`, never inline width/height |
| `ANCHOR_TAB_UNDERLINE` | error | `<a class="ds-anchor-nav__tab">` must set `text-decoration: none` |
| `SECTION_DESC_WIDTH` | error | `.section-header__desc` max-width must be 960px |
| `BG_GRAY` | warn | non-system grayscale background |
| `INLINE_SVG` | warn | inline `<svg>` (nav chevrons / stepper arrows are acceptable) |
| `SECTION_ALT` | warn | consecutive same-color sections (should alternate white ↔ gray) |
| `CONTAINER` | warn | no `max-width: 1200px` container found |
| `DS_INLINE_TEXT` | warn | inline `color`/`font-size` on a `ds-*` element |

> Geometry/visual issues (banner variant choice, color rendering, spacing) are NOT covered by
> `validate.js` — use `node verify.js` plus an actual browser render to confirm those.

---

## Component Reference System

Page sources use placeholder syntax to reference components:

```html
<!-- Reference a component fragment -->
<div data-component="navigation" data-fragment="header"></div>
<div data-component="navigation" data-fragment="footer"></div>

<!-- With props override -->
<div data-component="anchor-nav" data-fragment="anchor-nav"
     data-props='{"cta":"Get a Quote"}'></div>
```

`component-registry.json` maps component names to their HTML files. `build.js` resolves
all placeholders and writes assembled pages to `page-specs/`.

### Known gap

`component-registry.json` lists fragments for 13 components, but only `navigation`,
`banner`, and `anchor-nav` currently contain matching `data-fragment` markers in their
preview files. For `card`, `button`, `text-button`, `icon-card`, `form`, `tab`, `input`,
`dropdown`, `stepper`, and `carousel`, copy the markup directly from the preview HTML
until the missing `data-fragment` markers are added.

---

## Spec Update Rule

**修改设计规则（颜色/尺寸/间距/组件规则）：**
1. `design-spec/fs-design-system.md` — primary spec
2. `AGENTS.md` — agent checklist
3. `fs-components/component-specs/components.css` — implementation
4. `design-spec/fs-design-system-preview.html` — visual preview for designer review

**修改 Token（颜色变量/字体/圆角/阴影）：**
1. `fs-components/component-specs/tokens.css` — token definitions
2. `design-spec/fs-design-system.md` — primary spec
3. `fs-components/component-specs/preview/tokens.html` — token visual preview

**新增测试页面（pages/ 目录）：**
1. 在 `pages/` 下创建新的 HTML 文件
2. `index.html` — 在 "Test Pages 测试页面" 区域新增对应卡片

**新增组件：**
1. `fs-components/component-specs/preview/新组件.html` — component preview with `data-fragment`
2. `fs-components/component-registry.json` — add component entry
3. `index.html` — add component card
4. `design-spec/fs-design-system.md` — add component spec (Section 4 + Section 9)
5. `AGENTS.md` — add to component table + self-check

---

## Versioning

This repository is consumed as a versioned snapshot. Tag releases (`v1.1.0`, `v1.2.0`, …)
and pin consumers to a tag or commit SHA. Never consume `main` directly in generation jobs.

See `CHANGELOG.md` for changes.
