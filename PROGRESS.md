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

1. **`library-tab/product`（首页 8 大产品线 Tab）**：
   - 现状：`components.css` 将未选中图标强制 `filter: brightness(0) opacity(0.4)` 压成单色灰，图标 `48×48px`，且仅支持点击切换。
   - MasterGo 原件（《英文站组件库 v2.32.2611B》`68908:014155`）& 线上实测：无论默认态还是选中态，图标外框 `64×64px`（内含 `48×48px`）均展示**原色红黑双色图标**（`#19191A` + `rgba(192,0,0,0.3)`），且线上支持**鼠标悬停（`mouseenter`）切换面板**。待决定合入组件库。
2. **白底区块上的浅灰商品卡（`New Products` / `Recommended`）**：**【已拍板：首页特例，不改全局规范】** 全站通用规范仍保持白底加描边白卡，首页保留 `#FAFAFA` 灰卡特例。
3. **白底卡片描边颜色深浅（`#DEE0E3` vs `#F2F2F2`）**：**【已拍板：首页特例，不改全局规范】**。
4. **Hero 轮播箭头尺寸 / `40×8px` 进度胶囊 / 404px 内缩**：**【已拍板：均仅作首页特例】** MasterGo 原件确认首页 `1920×420px` 为 `padding: 0 404px`（版心内缩 `44px`），其他所有页面 Banner 为 `padding: 0 360px`（`0` 缩进）。
5. **多卡片轮播翻页步长（单张 vs 整页）**：**【已拍板：保持现状，不改点数】** 继续沿用 `external-cards` 单卡滚动。
6. **PLP 产品列表页 3 项新增组件缺口（自 `fs-plp-switches-pc.html` 发现）**：
   - **Pagination 分页组件缺失**：当前 30 族组件库尚未收录独立 `library-pagination` 组件，PLP 页面底部分页栏暂由页面按 FS Token 实现。
   - **Tag 缺少橙底 `Hot` 语义角标**：`library-tag` 目前只有绿色 `semantic-new` 和 `featured`，缺少官网 PLP 高频使用的 `Hot`（`#FFEBDD` 底 / `#F56300` 字）变体。
   - **无兼容标签的精简版 PLP 商品卡变体**：现有 `library-card/embedded-product-full` 强绑定 `compatibility` 品牌标签组与 `items` 列表，而官网交换机 PLP 卡片无兼容标签、采用单行 `|` 分隔参数条 + 双仓库存行 + 悬浮才展开的红色 `Add` 购物车按钮。
7. **顶部导航栏下拉菜单规范缺口（自 `https://www.fs.com/` 线上实测补齐至 `design-spec/fs-design-system.md` §1.5）**：
   - **现状问题**：当前 `library-navigation/header` 仅有 5 项主入口（缺少 `Software`），且仅 `All Products` 挂了一个 `240px` 单列一级菜单（无右侧 4 列子分类面板）；`Solutions` / `Services` / `Resources` / `Contact Us` 均无 Mega Menu，顶部国家切换、全宽搜索面板与账户下拉浮层也尚未实现。
   - **线上实测完整规范已入档**：已将 `fs.com` 全部 6 项主导航 Mega Menu（模板 A：`240px` 灰栏 + `960px` 白区；模板 B：左 2 列链接 + `1px` 竖线 + 右 `360×225px` 图卡）及 3 类辅助 Popover（Country / Search / Account）的完整尺寸、配色与交互细节补充进 `design-spec/fs-design-system.md` §1.5，待后续升级 `library-navigation/header` 并同步发布新版 release 时统一落地。

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
