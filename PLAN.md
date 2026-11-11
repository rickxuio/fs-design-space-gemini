# FS Design Standard 建设方案

> 文档版本：1.0  
> 仓库版本：v1.1.0  
> 日期：2026-11-11  
> 范围：`fs-design-standard` 规范仓库 + 部门级 AI 页面生成平台  
> 状态：规划稿（可作为后续实施与验收的基线）

---

## 0. 阅读指南与命名说明

本文分两部分：

1. **整体建设方案**（第 1–5、7–10 章）：规范仓库、共享方式、平台路线、治理、里程碑。
2. **Fragment 方案 B**（第 6 章）：细粒度组件片段目录与实施步骤。

> **命名冲突提醒：** 本文中的“**方案 B**”特指 **Fragment 细粒度拆分方案**；
> 第 4 章里的“**路线 B**”指 **MCP 服务**。两者不是同一件事，后文会分别标注。

### 目录

- 0. 阅读指南与命名说明
- 1. 背景与目标
- 2. 现状盘点（v1.1.0）
- 3. 总体架构
- 4. 平台建设路线：A / B / C
- 5. C 平台的关键设计决策
- 6. Fragment 方案 B：细粒度组件目录
- 7. 治理与协作
- 8. 里程碑
- 9. 风险与对策
- 10. 验收指标
- 附录 A：常用命令
- 附录 B：术语
- 附录 C：文档维护

---

## 1. 背景与目标

### 1.1 现状

- 设计规范目前是一个本地静态前端项目（`fs-design-standard`）。
- 设计师用 Codex 读取这个文件夹，生成中保真 HTML 页面。
- 规范、组件、示例、校验脚本混在同一个目录里，任何人都可以直接改。
- 同步依赖 Kiro hook，但 Codex 不执行这些 hook，实际靠人工记得改多处。
- 没有版本锁定，没有服务端强制校验，产出质量依赖个人习惯。

### 1.2 目标

1. **单一事实源**：规范只有一份，按版本发布，消费方只读。
2. **设计人员自助**：不碰命令行也能生成符合规范的页面。
3. **硬闸门**：`validate.js`（静态合规）+ `verify.js`（几何）在服务端/CI 强制执行。
4. **版本可追溯**：每次生成锁定一个规范版本，可复现、可升级。
5. **产出可治理**：生成页面有评审、有历史、可晋升为范例。

### 1.3 非目标

- 不做 FS.com 官方设计系统。
- 不替代 Figma，不做设计稿双向同步。
- 不自动发布到线上官网。
- 不追求“AI 一次生成就完美”，人工终审仍然是流程的一部分。

---

## 2. 现状盘点（v1.1.0）

### 2.1 仓库内容

| 内容 | 数量 | 说明 |
|---|---:|---|
| `design-spec/` | 3 | 主规范、可视化预览、设计师手册 |
| `preview/` 组件预览 | 19 | 16 个组件 + 3 个参考页（tokens / typography / icon-map） |
| `icons/` | 37 SVG | 另有 `icons-manifest.json` |
| `pages/` 示例页 | 12 | 竞品重构 / 需求合成 / 测试页 |
| `page-sources` + `page-specs` | 各 1 | `industrial-switches` 标杆页 |
| 工具链 | 3 | `build.js` / `validate.js` / `verify.js` |
| Agent 指令 | 1 | `AGENTS.md`（Codex 自动读取） |

### 2.2 已具备的能力

- `build.js`：`page-sources/ → 组件 fragment → page-specs/` 的组装管线。
- `validate.js`：20+ 条静态规则，当前 13 个文件 **0 error / 63 warning**。
- `verify.js`：headless Chrome 几何断言，当前 **0 error**。
- `AGENTS.md`：Rule 0（页头页脚逐字复用）、读取顺序、自检清单。
- `.gitlab-ci.yml`：build → validate → verify。

### 2.3 已知问题（本次建设要解决）

| 问题 | 影响 | 处理阶段 |
|---|---|---|
| `component-registry.json` 13 个条目，只有 3 个真的有 `data-fragment` | 占位符构建和 MCP 取组件不可靠 | M1（方案 B） |
| 6 个 preview 不在 registry：breadcrumb / icon-button / video-button / icon-map / tokens / typography | 组件工具缺 3 个真实组件 | M1 |
| `stepper.html` 用 `.stepper` 内联样式，`components.css` 是 `.ds-stepper` | 抽出的 fragment 在页面里没有样式 | M1 |
| `card.html` 演示卡片带死 `width/height` | fragment 会把演示尺寸带进页面 | M1 |
| tab / carousel / icon-card 的交互写在 preview 内联 `<script>` | fragment 注入后交互失效 | M1 |
| `verify.js` 把页面加载超时降级为 warning | 页面没加载成功也可能“通过” | M3 前 |
| `npm audit` 3 个 high（puppeteer-core 传递依赖） | 供应链风险 | M2 前评估 |
| 规范仓库无 Git 远程、无 tag | 平台无法锁定版本 | M0/M2 |

---

## 3. 总体架构

### 3.1 三层分离

```
┌─────────────────────────────────────────────────────┐
│ 规范层（只读，只有维护者能改）                        │
│ fs-design-standard @ tag v1.x.x                     │
│ 规则 / 组件 / tokens / 校验脚本 / AGENTS.md          │
└───────────────────────┬─────────────────────────────┘
                        │ 按 tag/SHA 只读引用
┌───────────────────────▼─────────────────────────────┐
│ 生成层                                               │
│ ① MCP 服务（本地 Codex）                             │
│ ② Web 生成平台（部门共享）                            │
│ ③ 沙箱：Codex CLI + validate + verify                │
└───────────────────────┬─────────────────────────────┘
                        │ 产出
┌───────────────────────▼─────────────────────────────┐
│ 产出层（设计师可写）                                  │
│ fs-design-pages / 个人工作区                         │
│ 提交 → CI 校验 → 预览 → 评审 → 合并                   │
└─────────────────────────────────────────────────────┘
```

### 3.2 六条原则

1. **单一事实源**：规范只在 `fs-design-standard` 里定义。
2. **消费方只读**：设计师不直接改规范仓库，变更走 MR。
3. **版本锁定**：任务绑定 tag/SHA，不消费 `main`。
4. **服务端闸门**：validate / verify 在 CI 或平台执行，不依赖本地记忆。
5. **产出隔离**：生成页面进产出仓库，不进规范仓库。
6. **可复现**：每次生成记录规范版本、模型、时间、产物哈希。

---

## 4. 平台建设路线：A / B / C

### 4.1 路线对比

| 路线 | 形态 | 投入 | 解决什么 | 适合阶段 |
|---|---|---|---:|---|
| **A** | GitLab 仓库 + 保护分支 + 静态预览站 + CI | 0.5–2 天 | 规范只读、有版本、有校验、大家看同一份 | 立即 |
| **B** | 内网 MCP 服务，本地 Codex 连接 | 3–5 天 | 不复制规范、服务端强制校验、版本统一 | A 之后 |
| **C** | Web 生成平台（后端 + 沙箱 + 队列 + 前端） | 4 周（1 人全职） | 设计人员不碰命令行，部门级自助 | B 验证后 |

### 4.2 推荐顺序

```
A（本周）
  │  规范上 GitLab、打 tag、CI、预览站
  ▼
B（1 周内）
  │  把规范封装成 MCP 工具，先服务你自己的 Codex
  ▼
C0（3–5 天）
  │  生成内核：POST /jobs → 沙箱 → Codex → validate/verify
  ▼
C1（1 周）
  │  最小 Web：提交、进度、预览、改稿
  ▼
C2（1–2 周）
     平台化：用户、项目、配额、发布、升级检查
```

**判断点：** C0 跑完后，用 3 个真实需求验证。至少 2 个能达到 0 error，再继续做 C1；否则先优化 prompt / 组件 / few-shot。

### 4.3 路线 A：最小共享

- 推到内部 GitLab，`main` 设保护分支。
- `.gitlab-ci.yml` 跑 `build + validate + verify`。
- 静态预览站部署 `index.html` + 所有页面/组件预览。
- 设计师只读 clone 或直接看 URL。
- 产出放另一个仓库 `fs-design-pages`，走 MR。

**完成标准：** 任何人打开同一个 URL 看到同一版规范；规范仓库没有设计师的 push 权限。

### 4.4 路线 B：MCP 服务

一个内网只读服务，暴露工具：

| 工具 | 作用 |
|---|---|
| `search_spec(query)` | 检索设计规范 |
| `get_component(name, fragment)` | 返回 canonical markup |
| `get_tokens()` | 返回 tokens |
| `list_icons()` | 返回图标清单 |
| `validate_page(html)` | 调 `validate.js`，返回 JSON |
| `render_preview(html)` | 调 `verify.js`，返回几何报告 + 截图 |

Codex 通过 `~/.codex/config.toml` 指向服务。设计师本地不需要规范文件夹，版本由服务端锁定。

**完成标准：** 本地 Codex 不依赖本地 `fs-design-standard` 也能生成合规页面。

### 4.5 路线 C：Web 生成平台（摘要）

**核心链路：**

```
POST /jobs → DB → 队列 → Worker → 沙箱
                                   │
                                   ├─ /ds 只读（tag 快照）
                                   ├─ /workspace 可写
                                   ├─ codex exec
                                   ├─ validate.js
                                   └─ verify.js
                                   │
                                   ▼
                         产物 + 截图 + 报告 → 预览 URL
```

**任务状态机：**

```
queued → provisioning → generating ⇄ repairing
                              │
                              ▼
                         validating ──通过──► ready
                              │
                              └─超限──► needs_review

任意状态 ──取消/超时──► failed / cancelled
```

**最小 API：**

```
POST   /api/v1/pages
POST   /api/v1/pages/:id/jobs
GET    /api/v1/jobs/:id
GET    /api/v1/jobs/:id/events        # SSE
GET    /api/v1/pages/:id/versions
POST   /api/v1/pages/:id/export
POST   /api/v1/pages/:id/publish
```

**数据模型（最小集）：**

| 表 | 关键字段 |
|---|---|
| `pages` | id, title, ds_version_id, status, created_by |
| `page_versions` | id, page_id, version_no, html_key, screenshot_key, job_id |
| `jobs` | id, page_id, type, status, requirement, model, token_usage, error |
| `ds_versions` | id, git_tag, commit_sha, storage_path, status |
| `publish_requests` | id, page_version_id, gitlab_mr_iid, status |

**沙箱镜像：**

| 内容 | 说明 |
|---|---|
| Node 20 | 跑校验脚本 / MCP |
| Codex CLI（固定版本） | Agent 执行器 |
| Chromium + `CHROME_PATH` | `verify.js` |
| `puppeteer-core`（`/opt/ds-deps`） | 校验依赖 |
| Open Sans 字体 | 保证渲染一致 |
| 非 root 用户 + 可写 `CODEX_HOME` | 会话隔离 |

**明确不做（MVP）：** 登录、多人协作、自动发布、配额、K8s。

**工作量：** 内核 3–5 天；最小 Web 1 周；平台化 1–2 周。一个人业余做按 2–3 个月估。

---

## 5. C 平台的关键设计决策

### 5.1 规范怎么读

- Git 只负责编辑和发版。
- 后端读的是**按 commit SHA 固化的只读快照**，不是 `main`。
- 同步服务：tag webhook → 下载 archive → 校验 SHA256 → 解压到 `/srv/ds/{sha}` → 记 DB。
- 任务挂载 `/srv/ds/{sha}:/ds:ro`，并设置 `DS_ROOT`。
- `verify.js` 依赖的 `puppeteer-core` 不随快照走，预装在镜像的 `/opt/ds-deps`。

### 5.2 CLI 怎么跑

- MVP 在沙箱里跑 `codex exec`，不直接调模型 API。
- 每任务一个容器、一个独立 `CODEX_HOME`。
- 平台在 Agent 退出后**独立再跑一遍** validate / verify，不信 Agent 自检。
- 发布时 GitLab CI 再跑第三遍。

### 5.3 并发

- 队列 + 固定槽位；每用户同时 1 个、每页面同时 1 个。
- 16C32G 建议并发 6，按内存（4 GB/任务）和模型 TPM 取小值。
- 不要在每个任务里 `npm install` 或下载 CLI。

### 5.4 安全

- 预览走独立域名，不与 API 共享 Cookie。
- 沙箱默认无外网，只放行模型网关 / S3 / GitLab。
- 参考页面由独立 fetcher 预取，防 SSRF 和提示注入。
- 模型 key 在服务端网关，不进沙箱。

---

## 6. Fragment 方案 B：细粒度组件目录

> 本章是“方案 B”，与第 4 章的“路线 B（MCP）”无关。

### 6.1 `data-fragment` 是什么

它是给机器看的可提取标记，告诉 `build.js` / MCP：

> 这个 preview 文件里，哪一块才是可直接进页面的组件 HTML。

示例（`navigation.html`）：

```html
<header class="ds-nav-header" data-fragment="header">...</header>
<footer class="ds-nav-footer" data-fragment="footer">...</footer>
```

页面源码：

```html
<div data-component="navigation" data-fragment="header"></div>
```

`build.js` 的 `parseFragments()` 会截取带 `data-fragment` 的标签到配对闭合标签，`assemblePage()` 替换占位。找不到时 `build.js:258` 直接报错并列出可用 fragment。

### 6.2 现状

| 组件 | 现有 fragment |
|---|---|
| navigation | header, footer |
| banner | hero, sub, search, title-only, mini |
| anchor-nav | anchor-nav |
| 其余 10 个 | registry 里有名字，preview 里没有标记 |

后果：

- `<div data-component="card" data-fragment="vertical"></div>` 构建失败。
- MCP `get_component("card", "vertical")` 取不到。
- Agent 只能读整个 preview 猜，容易把演示样式带进页面。

### 6.3 拆分粒度规则

> **fragment = 组合页面时会选择的“结构 / 视觉变体”。**
> 尺寸、hover、disabled、bordered、背景色这类只改 class 的，不单独拆。

### 6.4 Fragment 目录（49 个）

| 组件 | Fragments | 数量 |
|---|---|---:|
| card | `vertical`、`vertical-category-nav`、`horizontal`、`horizontal-reverse`、`horizontal-sidebar`、`embedded-small`、`embedded-detail`、`embedded-full` | 8 |
| icon-card | `center`、`left`、`multi` | 3 |
| form | `gray`、`white` | 2 |
| button | `filled-red`、`filled-black`、`filled-gray`、`outline-black`、`outline-gray`、`outline-white`、`outline-blue` | 7 |
| text-button | `black`、`black-bold`、`blue`、`blue-link`、`white`、`with-bg` | 6 |
| tab | `capsule`、`product`、`standard`、`standard-center` | 4 |
| input | `gray`、`white` | 2 |
| dropdown | `base`、`search`、`multi`、`grouped`、`filter`、`small` | 6 |
| stepper | `arrow`、`line` | 2 |
| carousel | `light`、`dark`、`inline` | 3 |
| video-button（新增） | `dark`、`light` | 2 |
| icon-button（新增） | `bordered`、`plain` | 2 |
| breadcrumb（新增） | `default`、`dark` | 2 |
| **合计** | | **49** |

说明：

- `tokens`、`typography`、`icon-map` 是参考页，不是组件，不进 registry。
- 新增 3 个组件后，registry 从 13 → 16 个组件。
- 所有尺寸/状态/边框修饰符不拆，写在文档和 `AGENTS.md` 里。
- carousel 的 `light` / `dark` / `inline` 要做成**完整走马灯**（含结构、控件、分页），不是只放几个按钮；交互由 `components.js` 提供。
- 卡片/走马灯用到的占位图 `component-specs/assets/placeholder-card.svg` 为 M1 新增文件，生成时由 Agent 替换为真实图片。

### 6.5 实施步骤

#### Step 0：打基线、开分支

```bash
git tag v1.1.0
git checkout -b feat/fragment-catalog
```

#### Step 1：在每个 preview 加 Canonical fragments 区

不要包现有演示块——演示块带 section title、grid、演示尺寸。在 `</body>` 前单独加一块干净 markup：

```html
<!-- ============================================
     Canonical fragments — machine-extracted
     只放可直接进页面的干净 markup
     ============================================ -->

<!-- fragment: filled-red -->
<button class="ds-btn ds-btn--filled-red ds-btn--l" data-fragment="filled-red">
  <span class="ds-btn__text">Button</span>
</button>

<!-- fragment: outline-white -->
<button class="ds-btn ds-btn--outline-white ds-btn--l" data-fragment="outline-white">
  <span class="ds-btn__text">Button</span>
</button>
```

card 示例：

```html
<!-- fragment: vertical -->
<div class="ds-card ds-card--vertical" data-fragment="vertical">
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

硬性要求：

1. 只包含组件本身，不包含 section / 标题 / grid。
2. 根元素加 `data-fragment="名字"`，名字与 registry 完全一致。
3. 不写演示尺寸（`width: 285px`、`height: 328px` 等）。
4. 图片用统一本地占位图，生成时替换。
5. 交互组件只放 markup，不放 `<script>`。
6. 同一文件内名字唯一。

#### Step 2：更新 `component-registry.json`

```json
"button": {
  "path": "component-specs/preview/button.html",
  "fragments": [
    "filled-red", "filled-black", "filled-gray",
    "outline-black", "outline-gray", "outline-white", "outline-blue"
  ]
},
"video-button": {
  "path": "component-specs/preview/video-button.html",
  "fragments": ["dark", "light"]
}
```

同时补 `icon-button`、`breadcrumb`。

#### Step 3：`scripts/check-fragments.js`

复用 `build.js` 导出的 `loadRegistry` 和 `parseFragments`，不要重写解析。

检查：

1. registry 每个 fragment 在 preview 中存在。
2. 每个 fragment **恰好出现一次**（`parseFragments` 用 Map 会静默覆盖，必须用正则单独计数）。
3. preview 里有标记但 registry 没登记 → warning。
4. registry 的 `path` 文件存在。

```js
const { loadRegistry, parseFragments } = require('../build.js');

// 每个 entry：
//   const html = fs.readFileSync(path, 'utf8');
//   const frags = parseFragments(html);
//   const count = (html.match(new RegExp(`data-fragment="${name}"`, 'g')) || []).length;
//   count === 1 才通过
```

加 npm script：

```json
"check:fragments": "node scripts/check-fragments.js"
```

CI 里和 validate / verify 同级执行。

#### Step 4：`scripts/smoke-fragments.js`

对每个 fragment：

1. 生成最小 HTML：`tokens.css` + `components.css` + 抽出的 fragment。
2. Puppeteer 打开，断言根元素 `width/height > 0`。
3. 截图到 `tests/output/`。

注意：测试页放 `tests/`，**不要放 `pages/` 或 `page-specs/`**，否则会被 validate 当成正式页面（缺 header/footer 会报错）。

#### Step 5：统一交互 JS

新建 `fs-components/component-specs/components.js`：

- tab 切换
- carousel prev/next/dots
- icon-card see more / less
- dropdown 展开/收起（如需要）

页面引入一次：

```html
<script src="../fs-components/component-specs/components.js"></script>
```

fragment 保持纯 markup。不要在每个 fragment 里塞 `<script>`，多实例会重复绑定。

#### Step 6：同步文档

- `README.md`：Component Reference System 加 Fragment catalog。
- `AGENTS.md`：组件表加 fragment 名，Step 1 指向 canonical 区。
- `design-spec/fs-design-system.md`：Section 9 补 fragment 列表。
- `index.html`：新增组件卡片（video-button / icon-button / breadcrumb）。

#### Step 7：跑闸门、发版

```bash
node build.js
node scripts/check-fragments.js
node scripts/smoke-fragments.js
node validate.js
node verify.js
```

通过后：

- 版本升到 `1.2.0`
- 更新 `CHANGELOG.md`
- 打 tag `v1.2.0`
- 平台 pin 这个版本

### 6.6 三个必须一起修的坑

1. **stepper class 不匹配**：`stepper.html` 用 `.stepper` + 内联样式，`components.css` 是 `.ds-stepper`。必须先把 preview 改成 `ds-stepper`，否则 fragment 没样式。
2. **card 演示尺寸**：`width: 285px`、`1200px; height: 328px` 不能进 canonical 块。
3. **交互 JS**：tab / carousel / dropdown / icon-card 必须统一到 `components.js`，否则注入后是死的。

### 6.7 验收标准

- `check-fragments`：49 个 fragment 全部存在，且每个恰好一次。
- `smoke-fragments`：49 个 fragment 渲染出非零尺寸，截图无空白。
- 现有 `industrial-switches.html` 构建产物 md5 不变。
- `validate.js` / `verify.js` 保持 0 error。
- 所有 preview 页面视觉不变。

### 6.8 工作量

| 工作 | 时间 |
|---|---:|
| 49 个 canonical 块 + stepper class 修复 | 1.5–2 天 |
| `check-fragments.js` + smoke test | 0.5–1 天 |
| `components.js` 交互统一 | 0.5–1 天 |
| 文档 + 版本 | 0.5 天 |
| **合计** | **3–4.5 天** |

建议先做 **card / button / stepper** 试点：分别覆盖“多布局 / 多变体 / class 不匹配”三种典型情况。

### 6.9 待确认

1. 49 个 fragment 是否照此目录，是否砍掉冗余项（如 `text-button/black-bold`、`tab/standard-center`）。
2. 交互 JS 是否统一到 `components.js`（推荐）。
3. 占位图是否新增 `assets/placeholder-card.svg`。

---

## 7. 治理与协作

### 7.1 角色

| 角色 | 可以做什么 | 不可以做什么 |
|---|---|---|
| 维护者（1–2 人） | 改规范、组件、发版 | —— |
| 设计人员 | 生成页面、提 MR、提变更 issue | 直接改规范仓库、push main |
| 查看者 | 看规范、看已发布页面 | 生成 / 修改 |

### 7.2 仓库拆分

| 仓库 | 内容 | 权限 |
|---|---|---|
| `fs-design-standard` | 规范、组件、工具链 | 维护者写，其他人只读 |
| `fs-design-pages` | 生成页面、示例、产出 | 设计人员可写，走 MR |
| `fs-design-platform` | 平台后端 / 前端（后续） | 工程团队 |

### 7.3 变更矩阵

| 变更类型 | 要改的文件 |
|---|---|
| 颜色 / 字号 / 间距 / 圆角 / 阴影 | `tokens.css`、`design-spec/fs-design-system.md`、`preview/tokens.html` |
| 组件视觉 / 结构 | `preview/*.html`、`components.css`、`component-registry.json`、文档 |
| 使用规则 / Do-Don't | `design-spec/fs-design-system.md`、`AGENTS.md`、规范预览页 |
| 新增组件 | preview、registry、index、文档、AGENTS |
| 新增页面 | `pages/`、`index.html` |

所有变更走 MR；CI 必须 `check:fragments + validate + verify` 全绿。

### 7.4 版本

- 语义化版本：`v1.2.0`、`v1.3.0`。
- 每次发版写 `CHANGELOG.md`。
- 平台按 tag 锁定；不使用 `latest`。
- 规范升级后，存量页面跑“升级检查”，输出 diff + 新截图。

---

## 8. 里程碑

| 里程碑 | 内容 | 时间 | 验收 |
|---|---|---:|---|
| M0 | 规范仓库基线 v1.1.0 | 已完成 | 89 个规范文件（v1.1.0 基线）、validate 0 error、verify 0 error |
| M1 | Fragment 方案 B + v1.2.0 | 3–4.5 天 | 49 个 fragment 全部可提取、smoke test 通过 |
| M2 | GitLab + 路线 A | 1–2 天 | 保护分支、CI、预览站可用 |
| M3 | 路线 B：MCP 服务 | 3–5 天 | 本地 Codex 不依赖本地规范也能生成 |
| M4 | C0 生成内核 | 3–5 天 | 3 个真实需求，2 个达到 0 error |
| M5 | C1 最小 Web | 1 周 | 提交、进度、预览、改稿闭环 |
| M6 | C2 平台化 | 1–2 周 | 用户、项目、配额、发布、升级检查 |

---

## 9. 风险与对策

| 风险 | 影响 | 对策 |
|---|---|---|
| AI 产出不稳定 | 设计师不用 | 工具优先、few-shot、3 轮自动修复、人工终审 |
| fragment 不规范 | 生成的组件带演示样式 | canonical 块 + checker + smoke test |
| 版本漂移 | 历史页面被改坏 | 按 tag 锁定、升级检查 |
| 并发资源不足 | 排队久 | 队列 + 槽位 + 按内存估并发 |
| 模型成本高 | 预算失控 | 每任务 token 上限、用户配额、便宜模型修复 |
| 沙箱安全 | 数据/主机风险 | 独立容器、只读挂载、网络白名单、独立预览域名 |
| 平台无人维护 | 变成烂尾项目 | 明确 owner 和 SLA，先做小内核 |
| 设计师绕过规范 | 质量失控 | 规范仓库只读、产出 CI 闸门、评审 |

---

## 10. 验收指标

| 指标 | 目标 |
|---|---|
| 需求到首版预览 | < 15 分钟 |
| 首次提交 validate 通过率（含修复） | > 80% |
| `ds-*` 组件使用率 | > 90% |
| 周活跃设计人员 | 持续增长 |
| 单页平均 token 成本 | 可预算、可下降 |
| 评审发现的视觉问题 | 逐月下降 |
| 规范违规拦截率 | 合并前 100% 拦截 |

---

## 附录 A：常用命令

```bash
npm ci
node build.js
node validate.js
node verify.js
node build.js --check navigation
node scripts/check-fragments.js      # M1 后
node scripts/smoke-fragments.js      # M1 后
```

## 附录 B：术语

| 术语 | 含义 |
|---|---|
| `ds-*` | 组件 CSS class 前缀 |
| fragment | preview 文件中可被机器提取的组件片段 |
| canonical fragment | 干净、可直接进页面的标准片段 |
| DS version | 规范仓库的 tag / commit SHA |
| gate | validate / verify 等强制校验 |
| MCP | Model Context Protocol，给 Agent 提供工具的服务 |
| sandbox | 每任务一个的隔离容器 |
| 路线 A/B/C | 平台建设路线：GitLab / MCP / Web 平台 |
| 方案 B | 本文第 6 章的 Fragment 细粒度拆分方案 |

---

## 附录 C：文档维护

- 本文是建设方案的单一入口；决策变化时更新本文，并在 `CHANGELOG.md` 记录。
- 实施完成后，把“待确认”项改成结论，把“计划”改成“已完成”。
- 与 `README.md` 的分工：README 讲“怎么用”，本文讲“为什么这样做、下一步做什么”。
