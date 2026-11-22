# FS Design Space — 持续进度账本（PROGRESS）

> **用途**：本文件是跨电脑、反复 `git push` / `git pull` 协作时的**唯一持续进度账本**（已在 `AGENTS.md` 顶部声明自动读取）。每次换机接手先读本文件，每次阶段交付前同步更新本文件并随代码提交。
> **最后更新时间**：2026-11-22
> **当前活跃组件库版本（Release）**：`f9fa6649b18ff4de5f1138868fde0f4e5e4f2054657a9991824df6861c4314d5`（30/30 组件已集成，147 个可调用变体，0 gaps）

---

## 一、项目阶段总览：FS 5 大核心题型原生标杆页建设

目标：将 `fs-design-space_gemini` 的黄金参考样板从外部竞品换皮页（`xtool-*` / `renogy-*`）全面升级为 **FS 官网原生高保真标杆页**，并在过程中沉淀组件库能力与黄金组合模式（`design-spec/section-patterns.md`）。

| 序号 | 核心题型 | 目标页面 / 状态 | 交付产物 |
| :--- | :--- | :--- | :--- |
| **0** | **项目健康度清理 & 适配器升级** | **已完成** | 清理旧竞品试作页（`renogy-*`、`xtool-education-v2`、`xtool-store`、`local-library-integration`）、修剪废弃 release；动态读取 `ACTIVE_RELEASE`；永久修复 macOS 字体假加粗问题；升级 `Stepper / Form / IconCard` 适配能力。 |
| **1** | **解决方案 / 专题页 (Solutions)** | **已完成 & 验收通过** | `pages/fs-campus-fabric-network-pc.html`（源页：`https://www.fs.com/solutions/fs-campus-fabric-network-s10121.html`），已登记到 `index.html`，模式沉淀为 `section-patterns.md` 的 **Pattern 9**。 |
| **2** | **官网首页 (Homepage)** | **已完成 & 用户确认通过** | `pages/fs-homepage-pc.html`（源页：`https://www.fs.com/`），已登记到 `index.html`，模式沉淀为 `section-patterns.md` 的 **Pattern 10**。 |
| **3** | **产品列表页 (PLP)** | **待开始（下一步）** | 待用户提供目标 URL 后开展。 |
| **4** | **商品详情页 (PDP)** | **待开始** | 待后续推进。 |
| **5** | **账户中心页 (Account Center)** | **待开始** | 待后续推进。 |

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

1. **`library-tab/product`（首页 8 大产品线 Tab）**：
   - 现状：`components.css` 将未选中图标强制 `filter: brightness(0) opacity(0.4)` 压成单色灰，图标 `48×48px`，且仅支持点击切换。
   - 线上实测：默认即展示**原色红黑双色图标（`64×64px`）**，且**鼠标悬停（`mouseenter`）立即切换面板**。
2. **白底区块上的浅灰商品卡（`New Products` / `Recommended`）**：
   - 现状：`library-card/spliced-vertical-single-event` 仅提供纯白背景。
   - 线上实测：白底区块（`#FFFFFF`）上放**无描边 `#FAFAFA` 浅灰卡片**，配 `object-fit: contain` + `mix-blend-mode: multiply` 商品实拍图。建议给 `library-card` 增加 `surface: "gray"` 变体并补充进 `fs-design-system.md`。
3. **白底卡片描边颜色深浅**：
   - 现状：组件库 `--border-color-default` 使用 `--color-gray-5`（`#DEE0E3`），视觉偏深。
   - 线上实测：官网首页所有白卡（分类卡、PicOS、Solutions、Case Studies）描边统一使用更轻盈的 **`#F2F2F2`**（`--color-gray-7`）。需讨论是否全站统一调浅。
4. **Hero 轮播箭头尺寸（`48px` vs `56px`）**：
   - 现状：`library-carousel` 仅开放 `48px`（`navigation-solid-xl`），`carousel.json` 注明 Banner `56px` 待源件核对。
   - 线上实测：首页 Hero 左右方向按钮为 **`56×56px`**，激活态轮播胶囊宽度 **`40px`**。
5. **多卡片轮播翻页步长（单张 vs 整页）**：
   - 现状：`library-carousel/external-cards` 的 `carousel-external.js` 写死每次滚 1 张卡片（8 张卡出 5 点、10 张卡出 7 点）。
   - 线上实测：按整页 4 张翻页（`slidesPerGroup: 4`，8 张卡出 **2 点**、10 张卡出 **3 点**）。建议为 `external-cards` 增加可选属性 `stepMode: "item" | "page"`。

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

## 五、迭代日志（每次阶段提交追加一条）

- **2026-11-22**：
  - 完成项目健康度清理（移除 `renogy-*`、`xtool-education-v2`、`xtool-store` 等外部参考页与废弃快照），动态读取 `ACTIVE_RELEASE`，修复 macOS Open Sans 字体渲染假加粗问题。
  - 完成 **标杆页 #1（解决方案页）** `pages/fs-campus-fabric-network-pc.html` + `section-patterns.md` Pattern 9。
  - 完成 **标杆页 #2（官网首页）** `pages/fs-homepage-pc.html`（逐项对齐 `fs.com` 实测 DOM/CSS）+ `section-patterns.md` Pattern 10，并登记 `index.html`。
  - 梳理 5 项“组件库 vs 线上官网”差异待后续讨论升级；将两份构建脚本与原始数据归档至 `scripts/benchmarks/` 与 `reference-inputs/`；建立持续进度账本 `PROGRESS.md`。
