# FS Design Space — 持续进度账本（PROGRESS）

> **用途**：本文件是跨电脑、反复 `git push` / `git pull` 协作时的**唯一持续进度账本**（已在 `AGENTS.md` 顶部声明自动读取）。每次换机接手先读本文件，每次阶段交付前同步更新本文件并随代码提交。
> **最后更新时间**：2026-11-25 11:30
> **当前活跃组件库版本（Release）**：`98d6fd30548f297ae62ab98949c5555cf5966d8d4f4c6551aa01e9345678aa03`（`v1.1.0`，31/31 组件已集成，150 个可调用变体，0 gaps）
> **设计师唯一查阅门户**：[design-system/portal.html](design-system/portal.html)（`npm run design:preview` → `http://localhost:5189/design-system/portal.html`）

---

## 一、项目阶段总览：FS 5 大核心题型原生标杆页建设

目标：将 `fs-design-space_gemini` 的黄金参考样板从外部竞品换皮页（`xtool-*` / `renogy-*`）全面升级为 **FS 官网原生高保真标杆页**，并在过程中沉淀组件库能力与黄金组合模式（`design-spec/section-patterns.md`）。

| 序号 | 核心题型 | 目标页面 / 状态 | 交付产物 |
| :--- | :--- | :--- | :--- |
| **0** | **项目健康度清理 & 适配器升级** | **已完成** | 清理旧竞品试作页（`renogy-*`、`xtool-education-v2`、`xtool-store`、`local-library-integration`）、修剪废弃 release；动态读取 `ACTIVE_RELEASE`；永久修复 macOS 字体假加粗问题；升级 `Stepper / Form / IconCard` 适配能力。 |
| **1** | **解决方案 / 专题页 (Solutions)** | **已完成 & 验收通过** | `pages/fs-campus-fabric-network-pc.html`（源页：`https://www.fs.com/solutions/fs-campus-fabric-network-s10121.html`），已登记到 `index.html`，模式沉淀为 `section-patterns.md` 的 **Pattern 9**。 |
| **2** | **官网首页 (Homepage)** | **已完成 & 用户确认通过** | `pages/fs-homepage-pc.html`（源页：`https://www.fs.com/`），已登记到 `index.html`，模式沉淀为 `section-patterns.md` 的 **Pattern 10**。 |
| **3** | **产品列表页 (PLP)** | **已完成 & 验收通过** | `pages/fs-plp-switches-pc.html`（源页：`https://www.fs.com/c/picos-enterprise-switches-4223`），已登记到 `index.html`，构建脚本归档在 `scripts/benchmarks/build-fs-plp-switches.cjs`。 |
| **4** | **商品详情页 (PDP)** | **已完成 & 验收通过** | `pages/fs-pdp-s5810-pc.html`（源页：`https://www.fs.com/products/206801.html?now_cid=1368`），已登记到 `index.html`，构建脚本归档在 `scripts/benchmarks/build-fs-pdp-s5810.cjs`。 |
| **5** | **账户中心页 (Account Center)** | **已完成 & 验收通过** | `pages/fs-account-center-pc.html`（源稿：MasterGo《账户中心设计稿合集》`Business homepage`），已登记到 `index.html`，构建脚本归档在 `scripts/benchmarks/build-fs-account-center.cjs`。 |

> **可复用构建脚本已入库**：两张已交付 FS 原生标杆页的生成脚本均已保存在 `scripts/benchmarks/` 下（`build-fs-campus-fabric.cjs`、`build-fs-homepage.cjs`），随时可重新生成或微调。

---

## 二、本次已完成的核心基础设施与规范升级

1. **永久解决 macOS 字体渲染假加粗（反复出现的问题）**：
   - 在 `scripts/local-component-library.cjs` 生成的 `local-fonts.css` 中统一注入 `html,body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}`，并在 `scripts/page-helpers.cjs` 的 `basePageCss()` 中同步添加。
   - **重要避坑**：严禁直接编辑 `design-system/components/components.css`，因为该文件的 SHA-256 被 `navigation-header-quality.test.js` / `navigation-footer-quality.test.js` 的浏览器实测回执锁定，改动会导致全库组件集成降为 0。全局字体平滑等补丁应放 `local-fonts.css` 或对应 `*-current.css` 并按规范同步。
2. **组件适配器能力升级（`scripts/local-slot-validation.cjs`、`local-form-fields.cjs`、`local-component-library.cjs`）**：
   - `library-stepper` 放开至支持 **3–6 步**（原写死 4 步），且 `.ds-stepper__placeholder` 支持本地官方 SVG 图标。
   - `library-icon-card` 的 `registered-icon` 绑定支持本地化官网矢量图标 `assets/<slug>/*.svg`（自动校验磁盘存在性）。
   - `library-form/gray` + `sourceFields` 支持字段级 `fullWidth: true`（解决奇数字段孤儿半行）以及 `consent: true`（原生保留 Terms & Privacy 勾选框）。
3. **布局规则更新（`AGENTS.md` & `design-spec/fs-design-system.md`）**：
   - 取消强制机械白灰交替，改为「白（`#FFFFFF`）/ 灰（`#FAFBFB`）按视觉层次自然搭配」；保留描边铁律（灰底白卡无描边，白底同色白卡必加描边）。
4. **门禁与回归状态**：
   - `npm run check`（全库 6 页，含 2 张新 FS 原生标杆页 + 4 张历史回归页）：**0 error / 0 warning**。
   - `npm test`：**49/49 全部通过**。

---

## 三、待探讨的 5 项「组件库 vs 线上官网」差异（后续决定是否升级组件库）

在精修 `pages/fs-homepage-pc.html` 对齐线上 `https://www.fs.com/` 实测 DOM/CSS 时，发现以下 5 处属于**组件库尚未同步线上最新版本**的差异（当前在首页中通过页面层安全兼容，未破坏组件契约，待后续和用户一起决定是否统一升级进组件库）：

1. **`library-tab/product`（首页 8 大产品线 Tab）**：**【已合入组件库 · Release `72f611c9159a`】**
   - 已在 `tab-current.css` 与 `tab.js` 升级为 `data-tab-current="product-color-icons"` 全彩双色图标（移除去色滤镜，保留 64×64 外框 / 48×48 图标）并原生支持 `mouseenter` 悬停切换与 `ds:tab-change` 事件。
2. **白底区块上的浅灰商品卡（`New Products` / `Recommended`）**：**【已拍板：首页特例，不改全局规范】** 全站通用规范仍保持白底加描边白卡，首页保留 `#FAFAFA` 灰卡特例。
3. **白底卡片描边颜色深浅（`#DEE0E3` vs `#F2F2F2`）**：**【已拍板：首页特例，不改全局规范】**。
4. **Hero 轮播箭头尺寸 / `40×8px` 进度胶囊 / 404px 内缩**：**【已拍板：均仅作首页特例】** MasterGo 原件确认首页 `1920×420px` 为 `padding: 0 404px`（版心内缩 `44px`），其他所有页面 Banner 为 `padding: 0 360px`（`0` 缩进）。
5. **多卡片轮播翻页步长（单张 vs 整页）**：**【已拍板：保持现状，不改点数】** 继续沿用 `external-cards` 单卡滚动。
6. **PLP 产品列表页 3 项新增组件缺口**：**【已全部合入组件库 · Release `72f611c9159a`】**
   - **`library-pagination/default`（第 31 个组件族）**：已新增独立 Pagination 分页器组件族（含 `pagination-current.css`、`pagination.js`、`ds:pagination-change` 事件与 `maintenance/foundation-prototypes-20261114/pagination.html` 规范页）。
   - **`library-tag/semantic-hot`**：已正式开放橙色 `Hot` 语义徽章变体（`#FFEBDD` 底 / `#F56300` 字）。
   - **`library-card/embedded-product-plp`**：已新增无兼容标签行、带单行 `|` 参数条、双仓库存行与 hover 浮现原生红色 `Add` 按钮的精简 PLP 商品卡变体，并已在 `pages/fs-plp-switches-pc.html` 完成实战升级与零溢出验收。
7. **顶部导航栏下拉菜单升级（【已完成并合入 `library-navigation/header`】）**：
   - 已将 `fs.com` 完整的 **6 项主导航（All Products / Software / Solutions / Services / Resources / Contact Us）Mega Menu（模板 A/B）与 3 类辅助浮层（Country / Search / Account）** 正式合入 `design-system/` 的 `library-navigation/header`（Release `89cd38bf7136`），并通过全部组件工程验收与 5 张标杆页升级。

---

## 四、技术避坑速查（换机继续做必读）

- **抓取 `www.fs.com` 遇 CloudFront 403**：CLI `curl` / `npm run ingest` 会被 AWS WAF 拦截，请使用内置 `browser` subagent 打开页面完成抓图与 DOM 提取，再用 `scripts/page-helpers.cjs` 下载 `resource.fs.com` 静态图到本地 `pages/assets/<slug>/`。
- **产品线 SVG 图标被染黑**：官网部分 64×64 SVG 内自带 `<rect width="64" height="64" fill="#FFFFFF"/>` 白色底板，在带 `filter: brightness(0)` 的容器里会整块变黑，下载后需去掉该白底 `<rect>`。
- **Tab 内嵌多轮播的 `browser-page-check.cjs` 限制**：检查脚本会遍历所有 `[data-rail]`，不可在 DOM 里放多个 `hidden` 的 `[data-rail]` 轮播，应渲染 1 个可见的 `library-carousel/external-cards` 并在切换 Tab 时动态更新其卡片数据。
- **页面 `<style>` 禁用 `.ds-*` 选择器**：`scripts/check-local-library-page.cjs` 的 `LIBRARY_STYLE_OVERRIDE` 禁止在页面 `<style>` 中直接匹配 `.ds-*` 或裸标签选择器；业务扩展请使用独立类名配合 `data-fs-extend="<用途>"`。
- **换机后启动预览与验收命令**：
  ```bash
  git pull               # 拉取最新进展与资源
  npm run preview        # 启动本地预览（或 node scripts/local-preview.cjs --port 5189）
  npm run check          # 全库静态 + 浏览器几何与交互门禁
  npm test               # 全库 49 项契约与回归测试
  ```

---

## 五、待拍板与换机接续清单（下次会话优先处理）

> **🚀 换机接续第一优先级（2026-11-24 17:28 已落地闭环）**：
> 1. **Banner 规范重构（【已落地 · Release `98d6fd30548f`】）**：
>    - `library-banner/hero-responsive` 规范固定可选值：**4 档高度**（`height`: `"200"` / `"360"` / `"420"` 首页尺寸 / `"480"` 高幅）、**双对齐**（`align`: `"left"` / `"center"`）、**`description` / `actionLabel` 完全可选**（0~2 按钮自由组合，含 `actionHref` / `actionVariant`）及 **`titleHtml`** 安全富文本标题。
>    - **选型铁律（已同步写入 `AGENTS.md` 与 `design-spec/fs-design-system.md`）**：规范只定固定可选值，日常出图遵循「**FS 默认左对齐基线 + 按内容密度组合**」——① 首页/解决方案/专题页且含标题+描述+按钮时，默认一律走 `align: "left"`（专题/方案 `360px`、首页 `420px`）；② 仅标题或「单行标题+单按钮」无描述的极简内容用 `200px` 矮幅居中（`align: "center"`）；③ 仅当用户明确指定参考竞品构图时才切为居中或 `480px` 高幅。
>    - 已通过 `npm run component:accept -- banner` 全 31 组件级联验收与同步。
> 2. **`check-local-library-page.cjs` 补强 2 项硬拦截门禁（【已落地】）**：
>    - **`PAGE_RED_BORDER_MISUSE`**：拦截非报错容器/选中态误用 `#C00000` 四边红框或 outline（放行单边导航指示线 `border-left` / `border-bottom` 及报错/红按钮态）。
>    - **`PAGE_BUTTON_UNICODE_ICON`**：拦截按钮内用裸 Unicode 符号（`×` / `+` / `−` / `✓` / `→` / `▶` 等）冒充图标，强制使用官方注册 SVG 或 `scripts/fs-icon.cjs --mono`；并同步升级全库 3 个历史页里的裸 Unicode 图标为 SVG。
> 3. **实测页 `pages/ui-network-storage-pc.html`（Ubiquiti Network Storage）**：
>    - 已基于新 Banner 规范改用原生 `library-banner/hero-responsive`（`height: "480"`, `align: "center"`, 无编造描述, `Buy Now`），全库 9 页 `npm run check` **0 error / 0 warning**，`npm test` **49/49 全部通过**。

1. **图标体系分类与门禁重构（【已拍板 & 落地】）**：
   - **7 大 `styleFamily` 分类**：已在 `design-spec/icon-style-families.json` 收录全部 184 个已登记图标的 `styleFamily`（`duotone-line` 13 / `duotone-surface` 4 / `line-mono-lg` 3 / `flat-illustration` 3 / `line-mono` 96 / `ui-atom` 46 / `brand-badge` 19），并生成可视化预览页 `maintenance/icon-style-family-preview.html`。
   - **同区块禁混用门禁**：已在 `scripts/check-local-library-page.cjs` 落地 `PAGE_ICON_STYLE_MIXED`（同时校验官方图标与 `pages/assets/<page>/*.svg` 本地创意图标，严禁同区块跨 `styleFamily` 混用）。
   - **缺口策略（已拍板 & 规范化）**：**库里有直接用；库里没有时，严禁降级为无图标卡片，统一通过 `scripts/fs-icon.cjs` 基于 IBM Carbon 硬朗工业风底座合成存至 `pages/assets/<page>/`**——① **48px 大图标（`library-tab/product` / `library-icon-card` 等）默认调用 `@carbon/pictograms`（`--source=pictogram --size=48`，默认 `bolster=0.56` 使 `48×48px` 实际渲染线宽精准为 `1.50px`，`#19191A` 主体 + 局部 `#C00000` 极简红点缀或纯黑 `line-mono-lg`）**；② **`≤ 32px` 小 UI 图标默认调用 `@carbon/icons`（`--source=carbon`）**；仅当 Carbon 双库均无匹配时回退 `lucide-static`（已通过 `PAGE_ICON_STYLE_MIXED` 门禁与 `pages/hp-desktops-pc.html` 实战验收）。
2. **组件库已知小瑕疵（【已修复 · Release `37853d64b30c`】）**：
   - 已在 `design-system/components/list-unordered-current.css` 为 `.ds-list[data-list-current="unordered"]` 补齐 `background: transparent; border-radius: 0;`，并通过 `npm run component:accept -- list` 完成 `list / card / carousel / icon-card` 级联验收与 Release 同步。

---

## 六、迭代日志（每次阶段提交追加一条）

- **2026-11-25 11:30（Lenovo Yoga 15 区块全量实战页验收 + 4 项静态门禁与构建器加固 + 工作流盲测验证）**：
  - **Lenovo Yoga 外部实战页（`pages/lenovo-yoga-pc.html` + `scripts/benchmarks/build-lenovo-yoga.cjs`）**：基于 `https://www.lenovo.com/hk/en/yoga/` 完成全 15 区块重构与 94 张实图本地化，包括顶部测验条、360px 左对齐 Hero（内聚 Yoga 字标与 Windows 11 徽章）、Yoga for Business 促销条、无右侧按钮的 56px 浅灰底吸顶锚点条（1:1 复用 `.ds-anchor-nav` 原生 Token）、`Elevate Your Creativity` + 6 卡 `Discover Your Yoga`、3 卡 `Featured Products`、4 列 `Yoga Features` 轮播、3 列 `Creator Perspectives` 轮播、1200px 全宽媒体面板 + `library-tab/capsule` 双面板切换、`Smart Connect` 与 `Adobe Creative Cloud Pro` 横向图文卡、3 卡 `Sustainability & Services`、`View All Yoga Laptops`（完整 10 组可折叠 `Filters` + `Search Processor` + `Price` 区间 + `Collapse All / Clear All` + 7 项 `Sort By` + 18 款带 `Compare`、原生 5 星 `library-rate/display`、`Join Now for FREE!` 的商品卡）、以及直落 1200px 版心的 28 项 `library-collapse/faq`；通过 `npm run check` 与 `npm run audit:page`（**0 error / 0 warning**）及用户视觉验收。
  - **构建器与静态门禁加固（`build.js` + `scripts/check-local-library-page.cjs` + `scripts/ingest-source-page.cjs`）**：
    1. 修复 `build.js` 中 `result.replace(fullMatch, () => use.html)`，彻底根治组件属性含 `HK$` / `US$` 时触发 JS `$&` 正则替换导致 `data-props` JSON 截断的底层 Bug；
    2. 在 `scripts/check-local-library-page.cjs` 新增 4 项静态门禁：`PAGE_HOVER_BLUE_MISUSE`（禁深色/灰色链接与触发器 `:hover` 突变为 `#0060BF`）、`PAGE_PRODUCT_TAB_ICON_MONO`（强制 `library-tab/product` 图标为 `#19191A` + `#C00000` 红黑双色）、`PAGE_UNEDITED_DEFAULT_LABEL`（拦截表单控件未传 `label` 残留模板默认 `Lable`）、`PAGE_UNICODE_STAR_RATING`（拦截用 `★` 字符手写评分，强制调用 `library-rate/display`）；
    3. 升级 `scripts/fs-icon.cjs` 默认自动识别偶数嵌套深度的独立子路径并点缀 `#C00000`，确保不传 `--mono` 时 100% 输出红黑双色图标；升级 `scripts/ingest-source-page.cjs` 在每次分段截图前自动清理延迟营销弹窗。

- **2026-11-24 22:37（IBM Carbon 1.5px 工业风图标合成规范定版 + HP Desktops 实战页验收 + Ubiquiti NAS 视觉终审通过）**：
  - **IBM Carbon 图标合成规范正式定版（`scripts/fs-icon.cjs` + `AGENTS.md` 红线 #8）**：安装 `@carbon/pictograms`（1,576 枚 48px 工业细线图）与 `@carbon/icons`（32px UI 图标）替代易显圆润的 Lucide 底座；经实测对比校准，确立 **`@carbon/pictograms` + `bolster=0.56` → `48×48px` 渲染线宽 `1.50px`（`#19191A` 主体 + 局部 `#C00000` 极简点缀）** 为 FS 大号线性/双色图标合成标准，支持 `--subpath-accent` 精准局部点红。
  - **HP Desktops 外部实战页（`pages/hp-desktops-pc.html` + `scripts/benchmarks/build-hp-desktops.cjs`）**：基于 `https://www.hp.com/us-en/shop/cat/desktops` 完成全 10 板块重构与 38 张实图本地化（含 44px `Home / Desktops` 面包屑、`Black Friday Sale` 360px 左对齐 Hero、`Trending desktops`、`A desktop for every lifestyle` 原生 `library-tab/product` 6 分类 18 款切换与 IBM Carbon 1.5px 红黑图标、`Holiday Gift Guide` 横向卡、12 品牌轮播、7 篇 `Related articles` 轮播、Pre-Footer 快捷条与原生 `library-collapse/faq` 完整 Buying Guide & Disclaimers），`npm run check` 与 `npm run audit:page` 均 **0 error / 0 warning**。
  - **Ubiquiti NAS 精修验收（`pages/ui-network-storage-pc.html`）**：收敛为 `200px` 居中原生 Hero、5 卡单行轮播 + 4 列居中参数对比表、20 列 2×4 动态 Bento 原文能力卡、`#B4B7BD` 柔和悬停圆箭头与横向标尺图标，用户视觉确认通过；同步升级 `scripts/ingest-source-page.cjs`（自动隐藏弹窗、长区块分段截图、`hiddenCopy` 提取）与 `scripts/check-local-library-page.cjs`（`PAGE_COMPARE_TABLE_ALIGN`、`PAGE_SOURCE_TEXT_FABRICATED`）。

- **2026-11-24 17:28（Banner 4 档高度与灵活槽位重构 + 2 项硬门禁落地 + 全库 9 页 / 49 单测全绿 · Release `98d6fd30548f`）**：
  - **Banner 规范重构（`banner-responsive.css` / `contracts/banner.json` / `local-component-library.cjs` / `compile-component-reference.js`）**：`library-banner/hero-responsive` 正式支持 `height`（`"200"` / `"360"` / `"420"` / `"480"`）、`align`（`"left"` / `"center"` 跟竞品对齐）、`titleHtml`、`description` 与 `0~2` 按钮完全可选（含 `actionHref` / `actionVariant`），通过 `npm run component:accept -- banner` 全 31 组件级联验收。
  - **两项硬门禁落地（`scripts/check-local-library-page.cjs`）**：新增 `PAGE_RED_BORDER_MISUSE`（禁非报错容器/选中态用 `#C00000` 四边红框）与 `PAGE_BUTTON_UNICODE_ICON`（禁按钮内裸 Unicode 符号冒充图标）；并用 `scripts/fs-icon.cjs` 修复了 `fs-plp-switches-pc.html`、`fs-pdp-s5810-pc.html`、`alibabacloud-automotive-pc.html` 中的裸 Unicode 图标。
  - **对齐 `tab.json` 契约单测 & 清理快照**：修复 `tab.json` 中 `capsule.whenToUse` 与 `variantDecisions` 同步校验；更新 `pages/ui-network-storage-pc.html` 使用原生 480px 居中 `library-banner/hero-responsive`；全库 `npm run check`（9 页 0 error / 0 warning）与 `npm test`（49/49）全部通过。

- **2026-11-24 17:01（Ubiquiti NAS 实测暴露的 6 项质量问题复盘 + `tab.json` 胶囊导航放开 `95986d2439ad` + 换机存档）**：
  - **组件契约升级（Release `95986d2439ad`）**：放宽 `design-system/components/contracts/tab.json` 中 `capsule` 变体限制（允许专题/功能面板切换直接使用原生胶囊导航，不再局限于 PDP），跑完 `npm run component:accept -- tab` 自动刷新 `dist/fs-design-core/` 与 `design-system/portal.html`。
  - **红线补强（`AGENTS.md`）**：红线第 5、8 条明确严禁杜撰原页不存在的 Hero 描述/区块标题/卡片描述、严禁用 Unicode `×`/`+` 冒充图标、严禁漏掉对比表/规格框左侧线性小图标。
  - **实测页交付（`pages/ui-network-storage-pc.html` + `scripts/benchmarks/build-ui-network-storage.cjs`）**：基于 `https://ui.com/us/en/integrations/network-storage` 完成抓取与重构并通过 `npm run check`（0 error / 0 warning）；待换机后继续推进 **Banner 固定高度阶梯 + 自由槽位组合** 与 **`validate.js` 硬门禁补强**。

- **2026-11-24（统一设计规范门户 `portal.html` + Card 悬停交互升级 `7139a5d4a3e0` + 同步链路闭环与 26 MB 瘦身）**：
  - **统一设计规范门户（`design-system/portal.html` / `scripts/build-design-portal.cjs`）**：上线 `shadcn/ui` + FS 品牌红极简规范门户（`npm run design:preview` 直达），包含 5 大纯 UI 设计原则、31 族组件页内实时预览（0 iframe、0 破图）、原子交互组件（`Button` / `TextButton` / `IconButton` / `Checkbox` / `Radio`）全尺寸与全状态矩阵展示、154 项设计令牌与 184 枚图标族谱检索。
  - **Card 悬停交互升级（Release `7139a5d4a3e0`）**：移除卡片 hover 向 `Learn more` 转发下划线的联动（卡片 hover 仅浮起阴影，`Learn more` 自身 hover 才出现下划线），通过 `card` + `carousel` 级联验收并同步升级全量 8 个标杆页。
  - **维护链路闭环与仓库瘦身**：`scripts/local-component-maintenance.cjs` 自动联动 `export-design-core.cjs` 与 `build-design-portal.cjs`；通过 `npm run release:prune` 清理 `37853d64b30c` 与 `4d8bac51c0ed` 两个已退役快照（瘦身 ~26 MB）及过期验收日志；统一 4 份核心文档入口指向 `design-system/portal.html`。

- **2026-11-24（上游抓取升级 + 3 轮外部页实战 + 规范瘦身 + 纯净底座导出 `fs-design-core v1.1.0` + 组件维护闭环）**：
  - **上游抓取升级（`scripts/ingest-source-page.cjs`）**：支持 `--url`/`--slug`、Shadow DOM 与主导容器解包、浏览器会话图片缓存（零 403 下载）、4 级图片角色分类（含 `third-party-logo`）与区块解剖信号（`anatomy`）；`AGENTS.md` 同步落地 4 项防降级检查并清理 ~1,100 字重复段落保持精简。
  - **外部复杂页实战验收（0 error / 0 warning）**：完成 `se-smart-panels-pc.html`、`alibabacloud-home-pc.html`、`alibabacloud-automotive-pc.html` 3 轮重构与逐块看图复核；在 `design-spec/section-patterns.md` Pattern 14 新增卡片标题黑下划线悬停、`#C00000` 品牌红边界、240px 左竖排分类导航与纯展示无框通透图标网格（“无链接不上盒、无点击不投影”）。
  - **组件维护闭环 & 纯净规范底座导出（Phase 1）**：
    - 新增独立维护手册 `design-system/MAINTENANCE.md` 与语义化版本日志 `design-system/CHANGELOG.md`（与页面合成 `AGENTS.md` 解耦）；
    - 新增子改父视觉对比工具 `npm run component:visual-diff`（`scripts/component-visual-diff.cjs`）；
    - 新增纯净只读规范底座导出 `npm run core:export`（`scripts/export-design-core.cjs` → `dist/fs-design-core/`，8 文件 < 100 KB，框架无关、零依赖，含 `README.md`、`tokens.json`、`rules.json`、`catalog.json`、`icon-style-families.json`、`section-patterns.md`、`CHANGELOG.md`、`manifest.json`，可直接交付下游工具消费）；
    - 清理移除 `scripts/preview-inspector.js` 预览浮层与对照注入，保留极简预览体验；
    - 附带验证跨框架走查原型 `npm run audit:site`（`scripts/audit-site.cjs`），验证 `dist/fs-design-core/` 可直接用于线上 `fs.com` 页面走查（`FS Glossary` 100/100 零误报），当前阶段聚焦底座交付，走查功能按需后续再扩。

- **2026-11-23（图标画风门禁 + `fs-icon.cjs` 工具化 + Banner 双按钮原生支持 + `.ds-list` 透明背景修复 + 彻底瘦身 136 MB · Release `4d8bac51c0ed`）**：
  - **图标体系闭环**：完成 184 个已登记图标的 7 大 `styleFamily` 视觉分类（`design-spec/icon-style-families.json`）与可视化查图页 `maintenance/icon-style-family-preview.html`；在 `scripts/check-local-library-page.cjs` 落地同区块禁混用门禁 `PAGE_ICON_STYLE_MIXED`；引入 `lucide-static` 与一键双色化工具 `scripts/fs-icon.cjs`，彻底解决跨行业图标缺口与精密度问题。
  - **组件库双升级（Release `4d8bac51c0ed`）**：① 修复 `list-unordered-current.css` 透明背景与圆角重置（消除灰底透明卡露白框）；② 为 `library-banner/hero-responsive` 正式新增原生 `secondaryActionLabel` / `secondaryActionCallback` / `secondaryActionHref` 双白色描边按钮支持，并通过 `31/31` 组件全量验收。
  - **范式与规则沉淀**：新增 `design-spec/section-patterns.md` **Pattern 14** 并更新 `AGENTS.md` 红线第 8–9 条，确立「严禁削足适履强套不匹配封面卡（如客户证言引文卡）、严禁降级无图标卡片、双按钮 Banner 原生直出」铁律。
  - **项目彻底瘦身（释放 ~136 MB）**：5 张 FS 原生标杆页统一升级至 `4d8bac51c0ed`；移除 6 张外部测试/压测页及其资产/输入、清理 9 个废弃 Release 快照与 133 个孤儿图片，`fs-components/` `132M → 41M`、`pages/` `47M → 14M`、`reference-inputs/` `12M → 220K`；全库 `npm run component:check`（31/31）、`npm test`（49/49）、`npm run check`（5/5 标杆页，0 error / 0 warning，耗时 7.9s）全部通过。

- **2026-11-23（Schneider Electric EcoStruxure Building 第三方页面全原生合成 + 精修验收 + 图标分类方案沉淀）**：
  - **新增标杆实战页（`pages/se-ecostruxure-building-pc.html`）**：基于 `reference-inputs/se-ecostruxure-building/` 完整重构施耐德 EcoStruxure Building Software 页面，生成脚本归档至 `scripts/benchmarks/build-se-ecostruxure-building.cjs`，本地图片资产归档至 `pages/assets/se-ecostruxure-building/`。
  - **全量业务区块 100% 映射与精修**：
    - Hero Banner 与 Bottom CTA Banner 均补齐原站双按钮布局（`Watch the video` + `Recommend a solution` / `Talk to an expert` + `Recommend a solution`），等高 `42px`；
    - `Discover EcoStruxure Building` 横向图文卡内补齐 4 条无序列表要点，并排查修复 `.ds-list` 在灰底透明卡内露出白底的问题；
    - `Trusted by` 客户证言改为灰底无描边白底引文卡（标题 + 完整不截断引文 + 底部 `48×48` 圆形头像 `object-position: top center` + 署名/头衔），三卡严格等高；
    - 保留 `Building Size Solutions` Tab 切换、`Resource Library` 与 `Talk to an expert` 原生 `library-dialog/information` 弹窗。
  - **验收状态**：`npm run check -- pages/se-ecostruxure-building-pc.html` **0 error / 0 warning**，已完成浏览器 `1440×900` 逐块看图与交互复验。
  - **换机接续提示**：当前仓库包含未提交的本地进度（含 `Release 72f611c9159a` 升级、xTool / PLP / 施耐德页面与 `PROGRESS.md`），换电脑前请先 `git add` & `git commit` & `git push`；新电脑 `git pull` 后先看本文件「第五节」直接拍板图标方案即可继续。

- **2026-11-23（P0 结构化正文提取升级 + P1 组件库 4 项高频缺口全部闭环 · Release `72f611c9159a`）**：
  - **P0 结构化提取与覆盖度门禁**：升级 `scripts/ingest-source-page.cjs` 与 `scripts/scan-source-page.cjs` 输出 `fs-page-ir/1.2.0`（支持 `--render` 与本地静态 HTML 双路径），按区块提取子标题、卡片项（`cards`）、FAQ 问答对（`faqItems`）、规格/对比表（`tables`）与轮播信号（`hasCarousel` / `carouselMeta`）；在 `scripts/check-local-library-page.cjs` 新增对照 `page-ir.json` 的 `PAGE_SOURCE_COVERAGE_MISSING` 与 `PAGE_SOURCE_CAROUSEL_FLATTENED` 告警及单测。
  - **P1 组件库 4 项缺口全闭环（31/31 已集成，150 个可调用变体，0 gaps）**：
    - `library-tag/semantic-hot`：开放橙色 `Hot` 语义徽章（`#FFEBDD` / `#F56300`）；
    - `library-tab/product`：升级全彩双色图标并原生支持 `mouseenter` 悬停切换与 `ds:tab-change` 事件；
    - `library-card/embedded-product-plp`：新增无兼容标签、单行 `|` 参数条、双仓库存与 hover 红色 `Add` 按钮的精简 PLP 商品卡（流式 100% 宽度，1085px 零溢出）；
    - `library-pagination/default`：新增第 31 个组件族 Pagination（含 `pagination-current.css`、`pagination.js` 运行时、规范页与浏览器交互验收）。
  - **PLP 标杆页端到端实战回归（`pages/fs-plp-switches-pc.html`）**：升级 `scripts/benchmarks/build-fs-plp-switches.cjs` 全面改用原生 `library-card/embedded-product-plp`、`library-tag/semantic-hot` 与 `library-pagination/default`，通过 `npm test`（49/49）、`npm run component:check`、`npm run check`（0 error / 0 warning）与浏览器看图核对。
- **2026-11-23（合成边界固化 + 门禁升级 + 左右对照增强 + xTool UV 详情页全原生重构）**：
  - **合成与过滤边界固化（`AGENTS.md` Step 2.5 & `design-spec/fs-design-system.md` §2）**：明确“**正文业务区块 100% 保留（不漏板块、不丢轮播、不改写规格与 FAQ 原文） + 复杂非通用临时营销挂件收敛过滤**”原则——首屏 Buy Box 中的限时倒计时、阶梯满减块、套餐内嵌赠品弹窗、饥饿营销库存倒数、分享返现外链、复杂异步嵌套 FBT 挂件等在首版合成时统一过滤并收敛为 **FS 标准 PDP Buy Box（Pattern 12）**，在交付末尾向用户说明过滤项即可，大幅提升首版直出速度与规范度。
  - **门禁引擎加固（`scripts/check-local-library-page.cjs`）**：新增 4 条自动化静态门禁（为阶段一合成质量与阶段二测试站/正式站走查打底）——`PAGE_HANDCRAFTED_HORIZONTAL_CARD`（禁手写横向图文卡/横幅，强制原生 `library-card/spliced-horizontal-full-width(-responsive)`）、`PAGE_HANDCRAFTED_SORT_BUTTONS`（禁手写排序按钮组，强制原生 `library-select`）、`PAGE_CAROUSEL_ARROW_ICON`（强制画廊/引言轮播使用官方实心深色圆形方向图标）、`PAGE_ICON_SIZE_MISMATCH`（禁 16px 行内图标位硬缩 36/48px 大图标或混用绿底实心圆勾）。
  - **本地预览「左右对照」增强（`scripts/preview-inspector.js` & `scripts/local-preview.cjs`）**：新增右下角「左右对照」50/50 全屏分屏模式，支持左侧加载 1280px 桌面端等比缩放原网页快照（自动补齐 `<base href>` 并隐藏第三方弹窗）与分段高清截图一键切换，兼容 `-pc` 页面后缀回退匹配。
  - **xTool F2 Ultra UV 全原生重构（`pages/xtool-f2-ultra-uv-pc.html`）**：收敛 Buy Box 为纯净 FS 标准范式，正文 10 大业务区块 100% 保留（4 个 `library-carousel/external-cards`、`Service Hubs` 与 `F Series 1 Minute Guide` 改用原生 `library-card/spliced-horizontal-full-width-responsive`、完整 5 组规格表 + `Which xTool Machine is Right for You?`、原站 6 条真实 FAQ、Judge.me 5 条真实评论 + 原生 `library-select/single-basic` 7 项排序 + `Load More`），全库 10 页 `npm run check` **0 error / 0 warning**。
- **2026-11-23（实战压测：xTool F2 Ultra UV 全功能交互详情页 + 原页内容优先原则）**：
  - **规则进化（`AGENTS.md` Step 2.5）**：明确「内容与板块构图以原页面为主（防过度模板化）」，不再为迎合标杆模板强插原页没有的模块（如吸顶锚点条）或拉平强主次结构。
  - **工作流实战验证（`pages/xtool-f2-ultra-uv-pc.html` + `scripts/benchmarks/build-xtool-f2-ultra-uv.cjs`）**：完整摄入并重构 `xtool.com` F2 Ultra UV 详情页，补齐 6 项原站前端交互（画廊 `<`/`>` + `1 / 6` 计数、分期/免税/积分原生 `library-dialog/information` 弹窗、延保与配件 `library-checkbox/sm` 勾选联动计价、滚动吸底快捷加购栏、`library-tab/standard` 评论/问答切换 + `library-rate/summary` 星级筛选与排序、Materials 卡片快捷 `+ Add`），`npm run check` 与 `npm run audit:page` 均 **0 error / 0 warning** 并完成截图视觉验收。
  - **仓库瘦身**：清理 3 个孤儿 Release 快照（`aae0b4ca6c09`、`024d23145876`、`f9fa6649b18f`），仅保留 2 个活跃/历史回归 Release。
- **2026-11-23（Header Mega Menu 正式合入组件库 + P0–P2 漏洞修复与工程加固）**：
  - **组件库升级 `library-navigation/header`（Release `89cd38bf7136`）**：将 6 项主导航（新增 `Software`）、模板 A/B 完整 `1200px` Mega Menu 与 3 类辅助浮层（Country / Search / Account）正式合入 `design-system/`，修复 `mouseenter` + `click` 双重触发秒关菜单 Bug，完成 `navigation` 及 4 个子组件工程验收并同步发布（30/30 集成，147 变体，0 gaps）；全部 5 张 FS 原生标杆页已一键升级并 0 error / 0 warning 通过 `npm run check`。
  - **P0 静态门禁堵漏（`scripts/check-local-library-page.cjs`）**：补齐白底区块卡片描边反向校验（`PAGE_WHITE_SECTION_BORDER`，仅豁免首页与 PLP 特例）及非特例页手写 `<article>` 卡片网格提醒（`PAGE_CUSTOM_CARD_GRID`）。
  - **P1 浏览器巡检与一键级联验收**：在 `scripts/browser-page-check.cjs` 中新增新版 Header 6 项 Mega Menu 展开、图卡加载与 `elementFromPoint()` `z-index` 无遮挡巡检；新增 `npm run component:accept -- <id>`（`scripts/accept-component.cjs`）一键完成目标组件及所有级联 `stale` 关联组件验收与同步。
  - **P2 资产清理与规则边界固化**：删除 3.4MB 孤儿目录 `pages/assets/xtool-store-pc/` 与已冗余的 `maintenance/header-mega-menu-preview.html`；在 `AGENTS.md`、`design-spec/fs-design-system.md`、`design-spec/section-patterns.md` 中明确“仅允许首页与 PLP 保留白底 `#FAFAFB` 无描边灰卡特例”、厘清纯 UI 交互 vs 后端演示态边界，并补齐 **Pattern 11（PLP）/ Pattern 12（PDP）/ Pattern 13（Account Center）**。
- **2026-11-22（晚间精修）**：
  - **官网首页（`fs-homepage-pc.html`）**：对齐 MasterGo《英文站组件库 v2.32.2611B》`平台首页 1920×420px` 原件 `padding: 0 404px`（版心内缩 `44px`），补齐 Hero `40×8px` 3 秒进度条自动轮播与 5 个卡片区块悬停标题下划线+底部投影；已在 `section-patterns.md` Pattern 10 与 `AGENTS.md` 明确“首页特例边界”与“优先用 `mastergo-magic-mcp` 核对原件”的工作流规则。
  - **PLP 产品列表页（`fs-plp-switches-pc.html`）**：对齐线上 `fs.com` 筛选排序栏——`More Filters` 换为 MasterGo 官方 `Select-筛选` 三横滑块图标（`65994-008368.svg`）、5 颗筛选/排序胶囊统一 `36px` 内容自适应紧凑间距（`padding: 0 16px`、`gap: 6px`、`12px/400` 字重）、移除蓝色聚焦环改细黑激活边、`Port Count` / `Downlink Ports` 多选项下拉改为 2 列紧凑网格。
  - **PDP 商品详情页（`fs-pdp-s5810-pc.html`）**：通过 `mastergo-magic-mcp` 直接对齐 MasterGo《【详情页】设计规范 ✅》（`4️⃣ 盒式交换机属性`）——修正 `600fr / 540fr` + `60px` 间距、主标题 `24px/32px`、`#F7F7F7` `90px` 价格条与 Sold/Reviews/Questions 双色数据、`30px` 型号选择胶囊、补齐库存/物流/服务/担保 4 行官方图标与蓝链及 `Accessories (2)` 配件推荐卡、Resources 改为 4 列 `285×76px` 官方 PDF 图标卡片。
- **2026-11-22（续）**：
  - 完成 **标杆页 #3（产品列表页 PLP）** `pages/fs-plp-switches-pc.html`（`PicOS® Enterprise Switches`，实测对齐 6 项子分类 SPA 切换、胶囊多选计数 + `Clear All`、`320×428` `More Filters` 双列下拉浮层、商品卡悬浮加购与分页）。
  - 完成 **标杆页 #4（商品详情页 PDP）** `pages/fs-pdp-s5810-pc.html`（`S5810-48TS-P`，覆盖 6 图画廊、6 款型号选型联动、`library-input-number`、`library-anchor-nav`、`library-tab/capsule`、`library-video-button`、`library-comment/qa-thread`、`library-rate/summary`、规格与机型对比表及吸底快速加购栏）。
  - 完成 **标杆页 #5（账户中心页 Account Center）** `pages/fs-account-center-pc.html`（MasterGo `Business homepage`，覆盖左侧手风琴导航与客户经理卡片、信息横幅、Orders KPI 筛选与列表、Quotes 缩略图与操作、Cases 实时搜索，代表性交互 `9/9` 通过，并完成官方线性图标与搜索框自检精修）。
  - **补齐顶部导航栏下拉菜单与浮层规范**：实测线上 `fs.com` 6 项主导航 Mega Menu（模板 A/B）与 3 类辅助浮层（Country / Search / Account），补充至 `design-spec/fs-design-system.md` §1.5 并产出交互预览页 `maintenance/header-mega-menu-preview.html`。
  - **5 大 FS 核心题型原生标杆页已全部交付完成**，均已登记至 `index.html`，构建脚本均入库至 `scripts/benchmarks/`。
  - **换机接续待办**：① 另一台电脑如使用 MasterGo MCP，需在本地 `~/.gemini/config/mcp_config.json` 配置 `mastergo-magic-mcp`；② 后续继续优化重点：精修剩余样式问题、决定组件库升级项（第 1–7 项差异与 Bug 修复）、将 PLP/PDP/Account Center 规则沉淀至 `design-spec/section-patterns.md`（Pattern 11–13）。
- **2026-11-22**：
  - 完成项目健康度清理（移除 `renogy-*`、`xtool-education-v2`、`xtool-store` 等外部参考页与废弃快照），动态读取 `ACTIVE_RELEASE`，修复 macOS Open Sans 字体渲染假加粗问题。
  - 完成 **标杆页 #1（解决方案页）** `pages/fs-campus-fabric-network-pc.html` + `section-patterns.md` Pattern 9。
  - 完成 **标杆页 #2（官网首页）** `pages/fs-homepage-pc.html`（逐项对齐 `fs.com` 实测 DOM/CSS）+ `section-patterns.md` Pattern 10，并登记 `index.html`。
  - 梳理 5 项“组件库 vs 线上官网”差异待后续讨论升级；将两份构建脚本与原始数据归档至 `scripts/benchmarks/` 与 `reference-inputs/`；建立持续进度账本 `PROGRESS.md`。
