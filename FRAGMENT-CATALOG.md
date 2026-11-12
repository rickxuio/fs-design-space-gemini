# Fragment Catalog Plan（方案 B）

> 状态：可实施草案  
> 适用：`fs-design-space` v1.1.0  
> 目标版本：v1.2.0  
> 日期：2026-11-12

---

## 0. 摘要

当前 `component-registry.json` 登记了 13 个组件，但只有 3 个组件的 preview 里真的有
`data-fragment`：

- `navigation`（header / footer）
- `banner`（hero / sub / search / title-only / mini）
- `anchor-nav`（anchor-nav）

其余 10 个组件只在 registry 里有 fragment 名字，preview 里没有标记。结果是：

- `build.js` 的占位符无法解析这些组件；
- 平台 MCP 的 `ds_component(name, fragment)` 返回错误；
- Agent 只能整份读取 preview 文件，自己猜哪一段是组件，慢且不稳定。

本方案把 fragment 目录拆细，覆盖 **16 个组件**：本方案新增 **49 个 fragment**，
加上 registry 里已有的 8 个（navigation 2 + banner 5 + anchor-nav 1），
registry 总数变为 **57 个**。每个新增 fragment 都建立可直接进页面的 canonical
markup、校验脚本和 smoke test。

**目标：** 让下面这条命令对 registry 的 57 个 fragment 全部成立（其中新增 49 个）：

```js
parseFragments(fs.readFileSync(previewFile, 'utf8')).get(fragmentName)
// → 返回非空、干净的组件 HTML，且恰好出现一次
```

---

## 1. 背景

### 1.1 `data-fragment` 是什么

它是给机器看的可提取标记，不是浏览器行为。示例：

```html
<!-- preview/navigation.html -->
<header class="ds-nav-header" data-fragment="header">...</header>
<footer class="ds-nav-footer" data-fragment="footer">...</footer>
```

页面源码：

```html
<div data-component="navigation" data-fragment="header"></div>
```

`build.js` 的 `parseFragments()` 会截取带 `data-fragment` 的标签到配对闭合标签，
`assemblePage()` 用截取结果替换占位符。找不到时 `build.js:258` 直接报错：

```
ERROR: Fragment "vertical" not found in component "card" ...
Available fragments: (none found)
```

平台 MCP 的 `ds_component` 使用同一套解析逻辑，所以标记缺失会同时影响构建和 Agent。

### 1.2 现状审计

| 组件 | 当前 registry fragments | preview 里有标记？ |
|---|---|---|
| navigation | header, footer | ✅ 2/2 |
| banner | hero, sub, search, title-only, mini | ✅ 5/5 |
| anchor-nav | anchor-nav | ✅ 1/1 |
| card | vertical, horizontal | ❌ 0/2 |
| icon-card | icon-card | ❌ 0/1 |
| form | form | ❌ 0/1 |
| button | button | ❌ 0/1 |
| text-button | text-button | ❌ 0/1 |
| tab | tab | ❌ 0/1 |
| input | input | ❌ 0/1 |
| dropdown | dropdown | ❌ 0/1 |
| stepper | stepper | ❌ 0/1 |
| carousel | carousel | ❌ 0/1 |

另有 3 个真实组件不在 registry：

- `video-button`
- `icon-button`
- `breadcrumb`

`tokens`、`typography`、`icon-map` 是参考页，不是组件，不进入 registry。

### 1.3 线上证据

2026-11-12 的端到端任务中，Codex 在沙箱里调用了：

```
ds_component("card", "vertical")
ds_component("card", "horizontal")
ds_component("icon-card")
```

三次都返回：

```
ERROR: fragment 'vertical' has no data-fragment marker in card.html.
Use the canonical fragment work (方案 B) before relying on this tool.
```

Agent 随后退化为 `cat` / `awk` / `rg` 手动读 preview，耗时明显增加。这不是 prompt
问题，是组件目录本身没有完成。

---

## 2. 目标与非目标

### 2.1 目标

1. 每个 registry fragment 在对应 preview 中**恰好出现一次**。
2. 每个 fragment 是**页面可用的 canonical markup**，不包含演示尺寸、演示容器、脚本。
3. registry 的 57 个 fragment 全部能通过 `build.js` 的 `parseFragments` 提取
   （本方案新增 49 个）。
4. 57 个 fragment 全部能渲染出非零尺寸（smoke test）。
5. 交互组件（tab / carousel / icon-card multi / dropdown / embedded card）有统一
   的 `components.js`，fragment 只放 markup。
6. 文档、registry、AGENTS.md 和 MCP 工具使用同一套名字。

### 2.2 非目标

- 不改视觉设计，不重新定义颜色/间距/字体。
- 不引入 React/Vue。
- 不重构 `build.js` 的提取算法。
- 不把 `pages/` 里的示例页迁进 build 管线。
- 不处理 `tokens` / `typography` / `icon-map` 参考页。

---

## 3. 设计规则

### 3.1 什么算一个 fragment

> **fragment = 组合页面时会选择的“结构 / 视觉变体”。**

不拆的：

- 尺寸：`ds-btn--l`、`ds-btn--s`
- 状态：`--hover`、`--disabled`、`--processing`
- 边框：`--bordered`、`--no-border`
- 背景：`--bg-white`、`--bg-gray`

这些作为 class 修饰符写在文档和 AGENTS.md 里，由 Agent 自己组合。

要拆的：

- DOM 结构不同：vertical / horizontal / category-nav / multi-event
- 视觉选型不同：7 种按钮颜色、tab 的 capsule / product / standard
- 交互结构不同：carousel 的 light / dark / inline

### 3.2 Canonical block 规则

每个 preview 文件底部新增一个 **Canonical fragments** 区：

```html
<!-- ============================================================
     CANONICAL FRAGMENTS
     机器提取源。只放可直接进页面的干净 markup。
     不要放演示 section、标题、grid、inline 宽度、<script>。
     ============================================================ -->
<section class="canonical-fragments" aria-label="Canonical fragments">
  <h2>Canonical fragments</h2>

  <!-- fragment: vertical -->
  <div class="ds-card ds-card--vertical" data-fragment="vertical">
    ...
  </div>
</section>
```

硬性要求：

1. `data-fragment` 加在 fragment 的根元素上；多根元素时用
   `<div data-fragment="...">` 包一层。
2. 不包含演示 section、`.section-title`、`.demo-label`、grid 容器。
3. 不写演示尺寸（`width: 285px`、`height: 328px`、`width: 1200px`）。
4. 图片使用统一占位图，Agent 生成时替换：
   - `../assets/placeholder-card.svg`（16:9）
   - `../assets/placeholder-product.svg`（1:1）
5. fragment 内不出现 `<script>`、`onclick=`、`javascript:`。
6. 交互行为用 `data-ds-*` 钩子，由 `components.js` 统一初始化。
7. 文案用中性占位（`Card title` / `Card description` / `Learn more`），
   不写营销文案。
8. 同一文件内 fragment 名唯一；registry 名字与标记完全一致。

### 3.3 命名

- 全部小写 kebab-case。
- 不带 `ds-` 前缀；组件名已经由 registry 的 key 表达。
- 语义优先：`vertical-category-nav` 而不是 `v2`；`embedded-detail` 而不是 `type3`。
- registry 数组按设计顺序排列（按钮颜色按红/黑/灰/描边顺序）。

### 3.4 资源路径约定

Canonical fragment 写在 `fs-components/component-specs/preview/*.html` 里，所以内部的
资源路径是**相对 preview 目录**的：

```html
<img src="../assets/placeholder-card.svg" alt="">
<img src="../icons/icon-arrow-right.svg" alt="">
```

消费方需要处理一次路径转换：

| 消费方 | 处理方式 |
|---|---|
| `build.js` + `page-sources` | 自动调用 `rewritePaths()`，按目标页面目录重写 `src` / `href` / `url()` |
| 独立 `pages/*.html` | Agent 把 `../assets/`、`../icons/` 重写为 `../fs-components/component-specs/assets/`、`../fs-components/component-specs/icons/` |
| 临时做法 | 页面加 `<base href="../fs-components/component-specs/preview/">`；E2E 已验证可用，但 `<base>` 会影响页面所有相对链接，只建议在受控页面使用 |
| MCP `ds_component` | v0.1 返回原始 markup，由 Agent 重写；建议 v1.2 增加 `target_dir` 参数，在服务端调用同样的重写逻辑 |

这条约定必须写进 AGENTS.md，否则 Agent 把 fragment 注入页面后会裂图。

---

## 4. 当前实现问题（review 发现）

以下问题必须在加 fragment 时一起处理，否则“有标记但不能用”。

### 4.1 Stepper：class 和结构都不匹配

- `preview/stepper.html` 用的是 `.stepper` + 文件内联样式。
- `components.css` 定义的是 `.ds-stepper` / `.ds-stepper__*`。
- 直接把 `.stepper` 标记抽出来放进页面，**没有样式**。
- 设计规范 Section 4 明确：
  - 图标容器 68×68，内部 `img` 48×48；preview 用了 68×68 的 `img`。
  - 分隔箭头是文本/SVG 字符，不是 `<img>`。
  - 标题结构是 `ds-stepper__step-title` > `ds-stepper__step-title-text`；
    preview 直接把文字放在 `.stepper__step-title` 里。
  - 竖线分隔的圆形箭头节点在 CSS 里没有对应 class。

### 4.2 Card：演示尺寸会污染 fragment

- `card.html` 有 37 处 inline `width`。
- 通栏卡片写死 `width: 1200px; height: 328px`；图片写死 `width: 580px; height: 328px`。
- 但这些尺寸 `components.css` 已经定义：
  - `.ds-card--horizontal .ds-card__image` = 580×328
  - `.ds-card--embedded-small` = 230px，图片 140×140
- 因此 canonical 块不应再写这些尺寸，否则页面会被锁死。
- 演示里的 `.placeholder-img` div 也不应进 fragment；用 `<img>` 占位图。

### 4.3 Breadcrumb：preview 和规范不一致

- `preview/breadcrumb.html` 用 `<span class="ds-breadcrumb__separator">/</span>`。
- 设计规范 Section 4 要求 12×12 SVG chevron。
- canonical 与 preview 都应改成 SVG，保留 `ds-breadcrumb__separator` class，
  加 `aria-hidden="true"`。

### 4.4 交互脚本散落在 preview 里

- `tab.html`：1 个 `<script>`，已有 `data-tab-group` / `data-tab-item`。
- `carousel.html`：1 个 `<script>`，使用 `id="demo-*"`，不能直接复制到页面（ID 会重复）。
- `icon-card.html`：1 个 `<script>`，已有 `data-expandable` / `data-toggle-btn`。
- `anchor-nav.html`：1 个演示脚本（现有 fragment 已可用，不在本次 49 个范围内，
  但迁移到 `components.js` 时要兼容）。
- `card.html`：1 个脚本，处理颜色 swatch / 兼容标签弹层；embedded 变体需要统一钩子。

### 4.5 Dropdown：inline onclick 和宽度

- `dropdown.html` 用 `onclick=` 切换 panel，且写死 `width: 226px`。
- canonical 必须改为 `data-ds-dropdown` 钩子，宽度交给页面容器或组件变体，
  不复制 inline 宽度。

---

## 5. Fragment 目录（本方案新增 49 个）

| 组件 | Fragments | 数量 |
|---|---|---:|
| card | `vertical`, `vertical-category-nav`, `horizontal`, `horizontal-reverse`, `horizontal-sidebar`, `embedded-small`, `embedded-detail`, `embedded-full` | 8 |
| icon-card | `center`, `left`, `multi` | 3 |
| form | `gray`, `white` | 2 |
| button | `filled-red`, `filled-black`, `filled-gray`, `outline-black`, `outline-gray`, `outline-white`, `outline-blue` | 7 |
| text-button | `black`, `black-bold`, `blue`, `blue-link`, `white`, `with-bg` | 6 |
| tab | `capsule`, `product`, `standard`, `standard-center` | 4 |
| input | `gray`, `white` | 2 |
| dropdown | `base`, `search`, `multi`, `grouped`, `filter`, `small` | 6 |
| stepper | `arrow`, `line` | 2 |
| carousel | `light`, `dark`, `inline` | 3 |
| video-button | `dark`, `light` | 2 |
| icon-button | `bordered`, `plain` | 2 |
| breadcrumb | `default`, `dark` | 2 |
| **本方案新增合计** | | **49** |

> 本表只列本方案新增/补齐的 13 个组件。已有 8 个不变：
> `navigation/header`、`navigation/footer`、`banner/hero`、`banner/sub`、
> `banner/search`、`banner/title-only`、`banner/mini`、`anchor-nav/anchor-nav`。
> registry 总计 **57 个**。

说明：

- `tokens`、`typography`、`icon-map` 是参考页，不进 registry。
- 新增 3 个组件后，registry 从 13 → 16 个组件。
- 现有 3 个组件（navigation / banner / anchor-nav）的 fragment 不动，只做兼容性回归。

### 5.1 详细目录

| 组件 | Fragment | Preview 源区域 | Canonical 根 | 交互 |
|---|---|---|---|---|
| card | vertical | ① 拼接式 — 上下结构 — 单事件卡片 | `div.ds-card.ds-card--vertical` | 否 |
| card | vertical-category-nav | ① 拼接式 — 上下结构 — 分类导航卡片 | `div.ds-card.ds-card--vertical` + `ds-card__sub-links` | 否 |
| card | horizontal | ① 拼接式 — 左右结构 — PC 通栏 | `div.ds-card.ds-card--horizontal` | 否 |
| card | horizontal-reverse | 同上（图右文左） | `div.ds-card.ds-card--horizontal-reverse` | 否 |
| card | horizontal-sidebar | ① 拼接式 — 左右结构 — 含侧边栏 | `div.ds-card--horizontal-sidebar` | 否 |
| card | embedded-small | ② 嵌入式 — 产品小卡片 | `div.ds-card--embedded.ds-card--embedded-small` | hover / Add 按钮 |
| card | embedded-detail | ② 嵌入式 — 产品详情卡片 | `div.ds-card--embedded.ds-card--embedded-detail` | 否 |
| card | embedded-full | ② 嵌入式 — 产品完整卡片 | `div.ds-card--embedded.ds-card--embedded-full` | 标签弹层 |
| icon-card | center | 居中布局 — 单事件 | `div.ds-icon-card.ds-icon-card--center` | 否 |
| icon-card | left | 居左布局 — 单事件 + 跳转型 | `div.ds-icon-card.ds-icon-card--left` | 否 |
| icon-card | multi | 多事件 — 折叠 / 展开 | `div.ds-icon-card.ds-icon-card--center` + `data-expandable` | 是 |
| form | gray | 表单 — 灰底 | `form.ds-form` + `--gray` 字段 | 否 |
| form | white | 表单 — 白底描边 | `form.ds-form` + `--white` 字段 | 否 |
| button | filled-red | 填充按钮 — 红色 | `button.ds-btn.ds-btn--filled-red` | 否 |
| button | filled-black | 填充按钮 — 黑色 | `button.ds-btn.ds-btn--filled-black` | 否 |
| button | filled-gray | 填充按钮 — 灰色 | `button.ds-btn.ds-btn--filled-gray` | 否 |
| button | outline-black | 描边按钮 — 黑色 | `button.ds-btn.ds-btn--outline-black` | 否 |
| button | outline-gray | 描边按钮 — 灰色 | `button.ds-btn.ds-btn--outline-gray` | 否 |
| button | outline-white | 描边按钮 — 白色 | `button.ds-btn.ds-btn--outline-white` | 否 |
| button | outline-blue | 描边按钮 — 蓝色 | `button.ds-btn.ds-btn--outline-blue` | 否 |
| text-button | black | Inline — 黑色 | `a.ds-text-btn.ds-text-btn--black` | 否 |
| text-button | black-bold | Inline — 黑色加粗 | `a.ds-text-btn.ds-text-btn--black-bold` | 否 |
| text-button | blue | Inline — 蓝色 | `a.ds-text-btn.ds-text-btn--blue` | 否 |
| text-button | blue-link | Inline — 蓝色链接 | `a.ds-text-btn.ds-text-btn--blue-link` | 否 |
| text-button | white | Inline — 反白 | `a.ds-text-btn.ds-text-btn--white` | 否 |
| text-button | with-bg | With Background | `a.ds-text-btn.ds-text-btn--with-bg` | hover |
| tab | capsule | ① 胶囊 Tab | `div.ds-tab.ds-tab--capsule` | 是 |
| tab | product | ② 首页产品导航 | `div.ds-tab.ds-tab--product` | 是 |
| tab | standard | ③ 常规 Tab | `div.ds-tab.ds-tab--standard` | 是 |
| tab | standard-center | ③ 常规 Tab — 居中 | `div.ds-tab.ds-tab--standard.ds-tab--center` | 是 |
| input | gray | 输入框状态 — 灰底 | `div.ds-input-field` + `--gray` | 否 |
| input | white | 输入框状态 — 白底 | `div.ds-input-field` + `--white` | 否 |
| dropdown | base | 基础下拉 | `div.ds-dropdown` | 是 |
| dropdown | search | 带搜索 | `div.ds-dropdown` + `ds-dropdown__search` | 是 |
| dropdown | multi | 多选 Checkbox | `div.ds-dropdown` + checkbox list | 是 |
| dropdown | grouped | 分组 + Checkbox + 搜索 | `div.ds-dropdown` + groups | 是 |
| dropdown | filter | Filter 筛选 | `div.ds-dropdown` + capsule trigger | 是 |
| dropdown | small | 品牌选择（小尺寸 + 搜索） | `div.ds-dropdown` + trigger `ds-dropdown__trigger--sm` | 是 |
| stepper | arrow | 图标步骤条 — 箭头分隔符 | `div.ds-stepper` | 否 |
| stepper | line | 图标步骤条 — 竖线分隔符 | `div.ds-stepper` + `--separator--line` | 否 |
| carousel | light | 完整走马灯 — 浅色控件 | `div.ds-carousel` | 是 |
| carousel | dark | 完整走马灯 — 深色控件 | `div.ds-carousel` + `--dark` | 是 |
| carousel | inline | 完整走马灯 — 内联控件 | `div.ds-carousel` + inline controls | 是 |
| video-button | dark | 黑色 | `button.ds-video-btn.ds-video-btn--dark` | 否 |
| video-button | light | 反白 | `button.ds-video-btn.ds-video-btn--light` | 否 |
| icon-button | bordered | Bordered 带边框 | `button.ds-icon-btn.ds-icon-btn--bordered` | 否 |
| icon-button | plain | Plain 无边框 | `button.ds-icon-btn.ds-icon-btn--plain` | 否 |
| breadcrumb | default | 常规 — 浅色背景 | `nav.ds-breadcrumb` | 否 |
| breadcrumb | dark | 反白 — 深色背景 | `nav.ds-breadcrumb.ds-breadcrumb--dark` | 否 |

---

## 6. Canonical block 示例

### 6.1 Button

```html
<!-- fragment: filled-red -->
<button class="ds-btn ds-btn--filled-red ds-btn--l" type="button" data-fragment="filled-red">
  <span class="ds-btn__text">Button</span>
</button>
```

### 6.2 Card — vertical

```html
<!-- fragment: vertical -->
<div class="ds-card ds-card--vertical" data-fragment="vertical">
  <div class="ds-card__image">
    <img src="../assets/placeholder-card.svg" alt="">
  </div>
  <div class="ds-card__body">
    <div class="ds-card__meta">
      <span class="ds-card__category">Category</span>
    </div>
    <p class="ds-card__title">Card title</p>
    <p class="ds-card__desc">Card description.</p>
    <div class="ds-card__link">
      <a class="ds-text-btn ds-text-btn--black ds-text-btn--inline" href="#">
        <span class="ds-text-btn__text">Learn more</span>
        <img class="ds-text-btn__icon" src="../icons/icon-arrow-right.svg" alt="">
      </a>
    </div>
  </div>
</div>
```

### 6.3 Card — horizontal

```html
<!-- fragment: horizontal -->
<div class="ds-card ds-card--horizontal" data-fragment="horizontal">
  <div class="ds-card__image">
    <img src="../assets/placeholder-card.svg" alt="">
  </div>
  <div class="ds-card__body">
    <p class="ds-card__title">Card title</p>
    <p class="ds-card__desc">Card description.</p>
    <div class="ds-card__link">
      <a class="ds-text-btn ds-text-btn--black ds-text-btn--inline" href="#">
        <span class="ds-text-btn__text">Learn more</span>
        <img class="ds-text-btn__icon" src="../icons/icon-arrow-right.svg" alt="">
      </a>
    </div>
  </div>
</div>
```

> 不写 `width: 1200px`、`height: 328px`；`components.css` 已定义图片 580×328。

### 6.4 Icon card — center

```html
<!-- fragment: center -->
<div class="ds-icon-card ds-icon-card--center" data-fragment="center">
  <img class="ds-icon-card__icon" src="../icons/icon-placeholder-switch.svg" alt="">
  <div class="ds-icon-card__body">
    <p class="ds-icon-card__title">Card title</p>
    <p class="ds-icon-card__desc">Card description.</p>
  </div>
</div>
```

### 6.5 Tab — capsule

```html
<!-- fragment: capsule -->
<div class="ds-tab ds-tab--capsule" data-ds-tab-group data-fragment="capsule">
  <div class="ds-tab__item ds-tab__item--active" data-ds-tab-item>
    <div class="ds-tab__item-inner">
      <span class="ds-tab__item-text">Tab A</span>
      <div class="ds-tab__indicator"></div>
    </div>
  </div>
  <div class="ds-tab__item" data-ds-tab-item>
    <span class="ds-tab__item-text">Tab B</span>
  </div>
  <div class="ds-tab__item" data-ds-tab-item>
    <span class="ds-tab__item-text">Tab C</span>
  </div>
</div>
```

### 6.6 Carousel — light

```html
<!-- fragment: light -->
<div class="ds-carousel" data-ds-carousel data-fragment="light">
  <div class="ds-carousel__track" data-ds-carousel-track>
    <div class="ds-carousel__slide">...</div>
    <div class="ds-carousel__slide">...</div>
    <div class="ds-carousel__slide">...</div>
  </div>
  <button class="ds-carousel__btn ds-carousel__btn--prev"
          type="button" aria-label="Previous slide" data-ds-carousel-prev></button>
  <button class="ds-carousel__btn ds-carousel__btn--next"
          type="button" aria-label="Next slide" data-ds-carousel-next></button>
</div>
```

> 不使用 `id="demo-*"`。一个页面可以有多个 carousel，所有定位都从
> `data-ds-carousel` 根节点向下查。

> 现有 preview 使用 `data-tab-group` / `data-tab-item`、`data-expandable` /
> `data-toggle-btn`；`components.js` 在迁移期同时识别新旧两套钩子，不强制一次改名。

---

## 7. 分组件实施

### 7.1 Card（8 个）

文件：`fs-components/component-specs/preview/card.html`

新增 canonical 块：

| Fragment | 结构要点 | 清理 |
|---|---|---|
| vertical | image + meta + title + desc + bullets + info + tags + link | 去掉 `width:285px`；占位图用 `<img>` |
| vertical-category-nav | vertical + `ds-card__sub-links`，无 bullets/tags | 同上 |
| horizontal | image + body，图片在左 | 去掉 `width:1200px; height:328px` 和图片 inline 尺寸 |
| horizontal-reverse | image + body，`--horizontal-reverse` | 同上 |
| horizontal-sidebar | sidebar placeholder + content area | 去掉 1196×254 / 438×246 inline 尺寸 |
| embedded-small | product image + body + Add 按钮 | 去掉 230/140 inline；CSS 已定义 |
| embedded-detail | 430px 左右布局 | 去掉 inline 尺寸 |
| embedded-full | 三种标签类型 + 兼容标签弹层 | 用 `data-ds-card-tag` 钩子，不用 inline onclick |

注意：

- 预览里的 embedded 根是 `.ds-card--embedded`，**没有 `.ds-card` base**。
  canonical 跟 preview 保持一致，不要擅自加 `.ds-card`，除非先验证 base 样式不会冲突。
- 演示里的 `.placeholder-img` 是 demo-only；canonical 用
  `<img src="../assets/placeholder-card.svg" alt="">`。
- embedded-full 的兼容标签弹层需要 `components.js`；fragment 只放 `data-*` 钩子。

### 7.2 Icon card（3 个）

文件：`icon-card.html`

- `center`：`.ds-icon-card--center`，图标用 `icon-placeholder-switch.svg`。
- `left`：`.ds-icon-card--left`，链接使用 `ds-text-btn--black`（单事件）。
- `multi`：canonical 用 `.ds-icon-card--center` + `data-ds-icon-card-expandable`；
  需要居左时换 `--left` 修饰符。bullets 初始 `ds-icon-card__bullets--collapsed`，
  toggle 按钮加 `data-ds-icon-card-toggle`。
  现有 preview 用 `data-expandable` / `data-toggle-btn`，`components.js` 同时兼容两套。

清理：演示里的 `style="width: 36px; height: 36px;"` 等 inline 尺寸不要带进 fragment；
组件 CSS 已定义图标尺寸。

### 7.3 Form（2 个）

文件：`form.html`

- `gray`：`form.ds-form`，字段用 `ds-form__input--gray` / `ds-form__textarea--gray`，
  phone prefix 用 `ds-form__phone-prefix--gray`。
- `white`：同上，`--white` 变体。

不写 inline 宽度；表单宽度由页面容器控制。

### 7.4 Button（7 个）

文件：`button.html`

每个颜色一个 fragment，根是 `<button type="button" class="ds-btn ds-btn--<variant> ds-btn--l">`。
尺寸和状态是修饰符，不进 fragment。

### 7.5 Text button（6 个）

文件：`text-button.html`

- `black` / `black-bold` / `blue` / `blue-link` / `white` / `with-bg`。
- 根是 `<a class="ds-text-btn ...">`，包含 `ds-text-btn__text` 和箭头图标。
- `inline` / `m` 等布局/尺寸修饰符保留在 fragment 里（它们是预览的默认形态），
  文档中说明可替换。

### 7.6 Tab（4 个）

文件：`tab.html`

- `capsule`：`ds-tab--capsule`
- `product`：`ds-tab--product`
- `standard`：`ds-tab--standard`
- `standard-center`：`ds-tab--standard ds-tab--center`

统一使用 `data-ds-tab-group` / `data-ds-tab-item`，去掉 `id="demo-*"` 和 inline onclick。
`components.js` 负责切换 active、移动 indicator。

### 7.7 Input（2 个）

文件：`input.html`

- `gray`：`ds-input-field__input--gray`
- `white`：`ds-input-field__input--white`

状态（hover / focus / disabled）是修饰符，不拆。不复制 inline 宽度。

### 7.8 Dropdown（6 个）

文件：`dropdown.html`

- `base`、`search`、`multi`、`grouped`、`filter`、`small`。
- 根是 `div.ds-dropdown`，trigger 加 `data-ds-dropdown-trigger`，panel 加
  `data-ds-dropdown-panel`。
- 去掉 inline `onclick`、`width:226px`。
- `small` 在 trigger 上使用 `ds-dropdown__trigger--sm`（CSS 实际类名）。

### 7.9 Stepper（2 个）— 需要先修 preview

文件：`stepper.html` + `components.css`

必须先完成 class 对齐：

| preview 旧 class | canonical class |
|---|---|
| `.stepper` | `.ds-stepper` |
| `.stepper__step` | `.ds-stepper__step` |
| `.stepper__step-icon` | `.ds-stepper__step-icon` |
| `.stepper__step-body` | `.ds-stepper__step-body` |
| `.stepper__step-title` | `.ds-stepper__step-title` |
| （直接文字） | `.ds-stepper__step-title-text` |
| `.stepper__step-desc` | `.ds-stepper__step-desc` |
| `.stepper__arrow` | `.ds-stepper__separator` |
| `.stepper__line` | `.ds-stepper__separator--line` |
| `.stepper__line-circle` | 新增 `.ds-stepper__separator-circle` |

还要：

1. 图标按规范改为 68×68 容器内的 48×48 `img`。
2. 箭头分隔符保留内联 SVG（`viewBox="0 0 36 16"`，stroke `#DEE0E3`），
   放在 `.ds-stepper__separator` 里；新增 CSS 控制 SVG 尺寸。
3. 竖线分隔的圆形节点新增 CSS：

```css
.ds-stepper__separator--line {
  width: 25px;
  background: transparent;
  position: relative;
}
.ds-stepper__separator--line::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: var(--color-gray-5);
}
.ds-stepper__separator-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-gray-5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.ds-stepper__separator-circle img {
  width: 12px;
  height: 12px;
  filter: brightness(0) invert(1);
}
.ds-stepper__separator svg {
  width: 36px;
  height: 16px;
}
.ds-stepper__step-title img {
  width: 12px;
  height: 12px;
}
```

4. 删除 preview 里重复的 `.stepper*` 内联样式块，只保留 demo 布局样式。
5. 加 canonical `arrow` / `line` 两块。

### 7.10 Carousel（3 个）

文件：`carousel.html`

- `light` / `dark` / `inline` 都要是**完整走马灯**，不是只放按钮。
- 以 Section 5 的完整示例为基础；把 `id="demo-*"` 改成 `data-ds-carousel*`。
- 控件样式：light / dark 使用 `ds-carousel__btn--dark`；inline 使用内联控件布局。
- 分页 dots 使用 `data-ds-carousel-dot`。
- 去掉 inline 背景色/高度（用占位图或组件样式）。
- 交互由 `components.js` 提供；fragment 内无 `<script>`。

### 7.11 Video button（2 个，新增）

文件：`video-button.html`

- `dark`、`light`；根是 `button.ds-video-btn--dark/light`，包含播放图标。
- 加入 registry。

### 7.12 Icon button（2 个，新增）

文件：`icon-button.html`

- `bordered`、`plain`；尺寸是修饰符，不拆。
- 加入 registry。

### 7.13 Breadcrumb（2 个，新增）

文件：`breadcrumb.html`

- `default`、`dark`；根是 `nav.ds-breadcrumb` / `--dark`。
- 修正分隔符：用 12×12 SVG chevron，不用 `/` 文本。
- 加入 registry。

### 7.14 现有组件（navigation / banner / anchor-nav）

不改 fragment 名；只做回归：

- `node build.js` 产物不变。
- preview 正常渲染。
- anchor-nav 的演示脚本后续迁到 `components.js`，但本次不强制。

---

## 8. Registry 目标

`fs-components/component-registry.json` 的 fragments 改为：

```json
{
  "components": {
    "navigation": { "path": "component-specs/preview/navigation.html", "fragments": ["header", "footer"] },
    "banner": { "path": "component-specs/preview/banner.html", "fragments": ["hero", "sub", "search", "title-only", "mini"] },
    "anchor-nav": { "path": "component-specs/preview/anchor-nav.html", "fragments": ["anchor-nav"] },
    "card": {
      "path": "component-specs/preview/card.html",
      "fragments": ["vertical", "vertical-category-nav", "horizontal", "horizontal-reverse", "horizontal-sidebar", "embedded-small", "embedded-detail", "embedded-full"]
    },
    "icon-card": {
      "path": "component-specs/preview/icon-card.html",
      "fragments": ["center", "left", "multi"]
    },
    "form": {
      "path": "component-specs/preview/form.html",
      "fragments": ["gray", "white"]
    },
    "button": {
      "path": "component-specs/preview/button.html",
      "fragments": ["filled-red", "filled-black", "filled-gray", "outline-black", "outline-gray", "outline-white", "outline-blue"]
    },
    "text-button": {
      "path": "component-specs/preview/text-button.html",
      "fragments": ["black", "black-bold", "blue", "blue-link", "white", "with-bg"]
    },
    "tab": {
      "path": "component-specs/preview/tab.html",
      "fragments": ["capsule", "product", "standard", "standard-center"]
    },
    "input": {
      "path": "component-specs/preview/input.html",
      "fragments": ["gray", "white"]
    },
    "dropdown": {
      "path": "component-specs/preview/dropdown.html",
      "fragments": ["base", "search", "multi", "grouped", "filter", "small"]
    },
    "stepper": {
      "path": "component-specs/preview/stepper.html",
      "fragments": ["arrow", "line"]
    },
    "carousel": {
      "path": "component-specs/preview/carousel.html",
      "fragments": ["light", "dark", "inline"]
    },
    "video-button": {
      "path": "component-specs/preview/video-button.html",
      "fragments": ["dark", "light"]
    },
    "icon-button": {
      "path": "component-specs/preview/icon-button.html",
      "fragments": ["bordered", "plain"]
    },
    "breadcrumb": {
      "path": "component-specs/preview/breadcrumb.html",
      "fragments": ["default", "dark"]
    }
  }
}
```

---

## 9. 校验脚本 `scripts/check-fragments.js`

职责：

1. 加载 `component-registry.json`。
2. 对每个组件、每个 fragment：
   - preview 文件存在；
   - `parseFragments()` 能提取；
   - `data-fragment="name"` 精确出现 **1 次**。
3. preview 里有标记但 registry 没登记 → warning。
4. 任何 error → exit 1。

伪代码：

```js
const { loadRegistry, parseFragments } = require('../build.js');
const registry = loadRegistry();
let errors = 0;

for (const [component, entry] of Object.entries(registry.components)) {
  const file = path.resolve(REGISTRY_DIR, entry.path);
  const html = fs.readFileSync(file, 'utf8');
  const parsed = parseFragments(html);

  for (const name of entry.fragments) {
    const count = (html.match(new RegExp(`data-fragment="${name}"`, 'g')) || []).length;
    if (count === 0) { console.error(`MISSING ${component}/${name}`); errors++; }
    else if (count > 1) { console.error(`DUPLICATE ${component}/${name} x${count}`); errors++; }
    else if (!parsed.has(name)) { console.error(`PARSE FAILED ${component}/${name}`); errors++; }
  }
}
```

输出示例：

```
component            fragment              status
navigation           header                OK
navigation           footer                OK
card                 vertical              OK
...
57 fragments (49 new + 8 existing), 0 errors, 0 warnings
```

加 npm script：

```json
"check:fragments": "node scripts/check-fragments.js"
```

CI（`.github/workflows/check.yml` 和 `.gitlab-ci.yml`）在 `validate` 之前执行它。

---

## 10. Smoke test `scripts/smoke-fragments.js`

职责：对 registry 的 57 个 fragment 逐个渲染（本方案新增 49 个），确认不只是
“能提取”，而是“能显示”。

步骤：

1. 对每个 fragment：
   - 用 `parseFragments` 提取；
   - 断言不包含 `<script`、`onclick=`；
   - 生成最小 HTML：
     ```html
     <link rel="stylesheet" href="../tokens.css">
     <link rel="stylesheet" href="../components.css">
     <div id="fragment">{fragmentHtml}</div>
     <script src="../components.js"></script>
     ```
   - 写入 `tests/fragments/{component}-{fragment}.html`。
2. 用 `puppeteer-core` 打开每个页面（复用 `verify.js` 的 `CHROME_PATH`）。
3. 断言：
   - `#fragment` 的第一个元素 `width > 0 && height > 0`；
   - 没有横向溢出 `scrollWidth <= clientWidth + 2`；
   - 截图保存到 `tests/fragments/screenshots/`。
4. 任一失败 → exit 1。

> `tests/fragments/` 加入 `.gitignore`；截图只在 CI artifact 中保留。

加 npm script：

```json
"smoke:fragments": "node scripts/smoke-fragments.js"
```

CI 可选；如果没有 Chrome，先只跑 `check:fragments`。

---

## 11. 交互 JS `components.js`

新增 `fs-components/component-specs/components.js`，页面只引一次：

```html
<script src="../fs-components/component-specs/components.js"></script>
```

设计：

```js
(() => {
  function init(root = document) {
    initTabs(root);
    initCarousels(root);
    initIconCards(root);
    initDropdowns(root);
    initCardTags(root);
  }
  document.addEventListener('DOMContentLoaded', () => init());
  window.FsComponents = { init };
})();
```

行为：

| 组件 | 钩子 | 行为 |
|---|---|---|
| Tab | `data-ds-tab-group` / `data-ds-tab-item` | 点击切换 `--active`，移动 indicator |
| Carousel | `data-ds-carousel` / `--track` / `--prev` / `--next` / `--dot` | 计算 slide 数，切换 transform，首尾禁用 |
| Icon card | `data-ds-icon-card-expandable` / `data-ds-icon-card-toggle` | 切换 `ds-icon-card__bullets--collapsed`，更新 See more/less 文案 |
| Dropdown | `data-ds-dropdown-trigger` / `data-ds-dropdown-panel` | toggle `--open`，点击外部关闭，Esc 关闭 |
| Embedded card tags | `data-ds-card-tag` / `data-ds-card-more` | 切换 active / 弹层 |

约束：

- 所有查询从 root 向下，不使用固定 ID。
- 事件委托到 document，支持动态插入的 fragment。
- 不依赖框架。
- 页面包含多个实例时互不影响。
- 迁移期同时识别新钩子（`data-ds-*`）和现有 preview 钩子
  （`data-tab-group` / `data-tab-item`、`data-expandable` / `data-toggle-btn`）。

---

## 12. 图片占位

新增：

- `fs-components/component-specs/assets/placeholder-card.svg` — 16:9，浅灰底，居中 “Image”
- `fs-components/component-specs/assets/placeholder-product.svg` — 1:1，浅灰底，居中 “Product”

规则：

- canonical fragment 只使用这两个占位图。
- Agent 生成页面时必须替换为真实图片；AGENTS.md 增加这条规则。
- 不把 `icon-placeholder-switch.svg` 当图片占位（它是图标）。

---

## 13. 文档同步

实施时同步：

- `README.md`：Component Reference System 增加 Fragment catalog 链接。
- `AGENTS.md`：
  - 组件表加 fragment 名；
  - Step 1 读取表指向 canonical 区；
  - 生成交互组件时要求引入 `components.js`；
  - 生成图片时要求替换占位图。
- `design-spec/fs-design-system.md` Section 9：组件来源表加 fragment 说明。
- `index.html`：无需改动；canonical 区是 preview 内部的一部分。

---

## 14. 实施步骤

### Step 0 — 基线

- `v1.1.0` tag 已存在。
- 新分支：`feat/fragment-catalog`。
- 运行现有回归：`node build.js`、`node validate.js`、`node verify.js`。

### Step 1 — 基础设施

1. 新增 `components.js` 骨架（空 init，后续填行为）。
2. 新增 `assets/placeholder-card.svg`、`placeholder-product.svg`。
3. 新增 `scripts/check-fragments.js`、`scripts/smoke-fragments.js`。
4. 更新 `.gitignore`（`tests/fragments/`）。
5. 更新 CI 脚本。

### Step 2 — 试点（card / button / stepper）

先做最难的三类：

- card：多布局 + 演示尺寸
- button：多变体
- stepper：class 不匹配

试点通过 `check:fragments` + `smoke:fragments` + 人工预览后，再批量。

### Step 3 — 批量其余组件

按目录表逐个 preview 加 canonical 块，更新 registry。

### Step 4 — 交互行为

- 完成 `components.js` 的 tab / carousel / icon-card / dropdown / card tags。
- 用 smoke 页面手动点击验证。
- 迁移 `tab.html` / `carousel.html` / `icon-card.html` 的演示脚本到 `components.js`（或保留演示脚本但 canonical 不依赖它）。

### Step 5 — 文档与 AGENTS

同步 README / AGENTS / design-spec。

### Step 6 — 验收

```bash
node build.js
node scripts/check-fragments.js
node scripts/smoke-fragments.js
node validate.js
node verify.js
```

### Step 7 — 发布

- `package.json` / `README.md` 版本升到 `1.2.0`
- 更新 `CHANGELOG.md`
- 打 tag `v1.2.0`
- 推送远程

---

## 15. 验收标准

### 15.1 硬指标

- [ ] `check-fragments`：57 个 registry fragment，0 error（本方案新增 49 个）。
- [ ] 每个 fragment 恰好出现一次。
- [ ] `smoke-fragments`：57 个 fragment 渲染非零尺寸。
- [ ] `build.js` 对现有 `industrial-switches` 的产物 md5 不变。
- [ ] `validate.js`：0 error。
- [ ] `verify.js`：0 error。
- [ ] 所有 preview 页面人工打开正常。

### 15.2 Agent / MCP

- [ ] `ds_component(name, fragment)` 对 57 个 fragment 返回非空 markup。
- [ ] 返回的 markup 不含 `<script>`、`onclick=`、`data-component` 占位符。
- [ ] 返回的 markup 不含演示尺寸（`width: 285px` 等）。
- [ ] Agent 生成一个使用 card / icon-card / tab 的页面时，不再需要手动 `cat` preview。

### 15.3 交互

- [ ] 页面引入 `components.js` 后，tab 可切换。
- [ ] carousel prev/next/dots 可用，首尾禁用正确。
- [ ] icon-card See more/less 可用。
- [ ] dropdown 打开/关闭/点击外部关闭可用。
- [ ] 同一页面多个实例互不影响。

---

## 16. 回滚

- 所有改动在 `feat/fragment-catalog` 分支。
- 未合并前不影响 `main`。
- 如果 v1.2.0 出现问题：
  - 回退到 `v1.1.0` tag；
  - registry 和 preview 一起回退；
  - 平台继续 pin `v1.1.0`。

---

## 17. 风险与对策

| 风险 | 对策 |
|---|---|
| canonical 块和演示块视觉不一致 | 先跑 smoke + 截图对比；canonical 放在单独区域，不改演示块 |
| stepper 改动影响现有页面 | stepper 目前没有被页面使用；改完跑 validate/verify |
| 交互脚本重复绑定 | 事件委托 + `init(root)`；smoke 页面多实例测试 |
| fragment 膨胀 | 遵守 3.1 粒度规则；尺寸/状态不拆 |
| 提取嵌套错误 | checker 用 `parseFragments` + 精确计数双重校验 |
| Agent 仍然不用 canonical | AGENTS.md 明确“先查 fragment，再读 preview” |
| 版本升级影响平台 | 平台按 tag 锁定；v1.2.0 先在本地平台验证 |

---

## 18. 工作量

| 工作 | 时间 |
|---|---:|
| `components.js` + assets + checker/smoke 骨架 | 0.5–1 天 |
| card / button / stepper 试点 | 1 天 |
| 其余 10 个组件 canonical 块 | 1–1.5 天 |
| registry + 文档 + CI | 0.5 天 |
| 联调 + 冒烟 + 修复 | 0.5–1 天 |
| **合计** | **3.5–5 天** |

---

## 19. 待确认

1. **Carousel 三个完整变体**：light / dark / inline 需要新写完整结构，是否按此拆分？
2. **Stepper 竖线圆形节点**：新增 `ds-stepper__separator-circle` 类，还是简化为纯竖线？
3. **Breadcrumb 分隔符**：确认统一改为 12×12 SVG chevron（按设计规范），preview 一起改。
4. **Placeholder 资源**：两个 SVG（16:9 / 1:1）是否够用？
5. **Embedded card 是否加 `.ds-card` base**：目前 preview 不加，canonical 保持一致；是否要统一？

---

## 20. 附录：文件清单

新增：

```
FRAGMENT-CATALOG.md
fs-components/component-specs/components.js
fs-components/component-specs/assets/placeholder-card.svg
fs-components/component-specs/assets/placeholder-product.svg
scripts/check-fragments.js
scripts/smoke-fragments.js
```

修改：

```
fs-components/component-registry.json
fs-components/component-specs/components.css        # stepper 补类
fs-components/component-specs/preview/card.html
fs-components/component-specs/preview/icon-card.html
fs-components/component-specs/preview/form.html
fs-components/component-specs/preview/button.html
fs-components/component-specs/preview/text-button.html
fs-components/component-specs/preview/tab.html
fs-components/component-specs/preview/input.html
fs-components/component-specs/preview/dropdown.html
fs-components/component-specs/preview/stepper.html
fs-components/component-specs/preview/carousel.html
fs-components/component-specs/preview/video-button.html
fs-components/component-specs/preview/icon-button.html
fs-components/component-specs/preview/breadcrumb.html
README.md
AGENTS.md
design-spec/fs-design-system.md
package.json
CHANGELOG.md
.github/workflows/check.yml
.gitlab-ci.yml
```

---

## 21. 附录：快速验收命令

```bash
npm ci
node build.js
node scripts/check-fragments.js
node scripts/smoke-fragments.js
node validate.js
node verify.js
```
