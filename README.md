# FS Design Space

本项目使用本地页面工作流：读取规范 → 确认组件 → 来源品牌过滤 → 模块映射 → 编写页面 → 自动检查 → 实际渲染核对。完整要求以根目录 [AGENTS.md](AGENTS.md) 为准。

## 当前入口

| 用途 | 入口 |
|---|---|
| **设计师唯一规范与组件门户（首选）** | [design-system/portal.html](design-system/portal.html)（`npm run design:preview`） |
| 项目首页 | [index.html](index.html) |
| 组件维护与发版手册 | [design-system/MAINTENANCE.md](design-system/MAINTENANCE.md) |
| 独立便携规范知识底座（<100 KB） | [dist/fs-design-core/README.md](dist/fs-design-core/README.md)（`npm run core:export`） |
| 底层组件规范索引（机器验收用） | [design-system/component-library.html](design-system/component-library.html#library) |
| 当前调用及固定资源版本 | [catalog.json](fs-components/component-specs/library/catalog.json) |
| AI 选型、变体决策和复核分类 | [selection.json](fs-components/component-specs/library/selection.json) |

调用资格读取当前 catalog 的 `callable` 和发布限制，核对对应契约、真实 Preview、允许字段、依赖及运行资源。`ready`、历史复核快照或文件存在不能替代调用资格；有限工程验证不代表全族或视觉批准。数量与状态直接读取当前索引，不在说明中累计历史进度数字。

## 目录用途与维护位置

| 目录 | 当前用途 | 维护说明 |
|---|---|---|
| `design-system/` | 组件规范、契约、真实Preview、共享实现和MG来源 | 组件内容在此协调维护；页面执行要求仍读根目录AGENTS |
| `fs-components/` | 本地调用登记、派生片段、选型索引、固定资源和页面级标杆规范 | `component-specs/library/`由原同步命令生成，不手工修改生成状态；`page-sources/`和`page-specs/`沿原构建管线 |
| `maintenance/` | 当前组件规范展示、其构建工具和按需生成的回归输出 | 日期是原路径的一部分，不表示已废弃；不能整目录当作旧报告删除 |
| `reference-inputs/` | 页面原始内容及受控调用需要的来源记录 | `sourceFields`、`sourceAbsent`和保留页面会读取其中资料，不作为新页实现模板 |
| `pages/` | 5个实际回归输入及其素材；后续普通页面仍在此编写 | 页面与其固定资源共同保留；已交付页不自动升级 |
| `design-spec/` | 本地页面布局规则和阅读预览 | 组件内部按实际调用版本的契约与Preview核对，旧组件数值不再作为读取入口 |
| `scripts/` | 本地装配适配、预览、规范页生成、维护及回归工具 | 继续使用已有package.json命令，不建立另一套执行流程 |
| `node_modules/`、`design-system/node_modules/` | 两个现有包各自的运行依赖 | 按各自锁文件安装，供装配、维护和浏览器检查使用 |

组件规范展示沿原路径：Button、TextButton、IconButton使用各自`maintenance/*-prototype-*/preview.html`及`build-preview.cjs`；其余27族使用`maintenance/foundation-prototypes-20261114/`。统一入口仍是`design-system/component-library.html`。组件源位于`design-system/components/`，展示由原`docs:build`或`component:sync`更新，不直接修改生成页。

<h3 id="source-materials">组件原件与维护资料</h3>

- `design-system/docs/handoff/archives/.../mastergo/`：保留的3份MG原件，供Button、Select、Dialog来源核对。
- `design-system/page-inputs/bdcom-oem-m2/component-sources/`：Banner、Card、Form、Navigation的4份来源记录。
- `design-system/page-reviews/`：仍被引用的组件证据；`_shared/source-review.css`供工程报告展示。
- `design-system/pages/fonts/`及`pages/assets/`：实际字体与组件素材。
- `design-system/docs/fs-design-system.md`：保留契约派生标记和来源库参考，仍由原脚本更新；不作为当前页面布局或变体选型入口。

组件源仍在`design-system/components/`，资料日期不代表已废弃。以上内容不建立第二套页面流程；检查输出由原命令按需生成。

## 页面调用

新版组件规范与维护来源为 `design-system/`，统一调用登记为 `fs-components/component-registry.json`；新页面使用 `library-*`。原未加前缀的组件登记和旧预览依赖已退役，新调用只使用已登记的`library-*`变体；既有5个回归页面继续使用其原固定版本。

首次安装执行 `npm ci` 和 `npm run design:install`。`npm run preview` 启动本地预览，默认端口5188，以终端实际地址为准；`npm run preview:live` 启动带共享 CSS 实时热更新的预览；`npm run design:preview` 直接打开统一设计规范门户 `design-system/portal.html`；`npm run component:accept -- <组件名>` 一键完成组件级联验收、发布新 Release 并自动刷新 `dist/fs-design-core/` 与 `design-system/portal.html`。

普通页面保存在 `pages/`，使用现有调用语法：

```html
<div data-component="library-button" data-fragment="outline-black" data-props='{"label":"Download"}'></div>
```

可使用 `build.js` 导出的 `assemblePage(source, loadRegistry(), new Map(), sourceName, { targetDir })` 或辅助库 `scripts/page-helpers.cjs`（提供 `assembleLocalPage`、`cardProps`、`iconCardProps`、`faqItemsHtml` 等，自动读取当前 `catalog.json` 版本）完成片段装配。只有页面级标杆规范走 `fs-components/page-sources/ → build.js → fs-components/page-specs/`；普通页面不进入该批量构建管线。

### 纯新版查询与原页预扫描

```bash
node build.js --inspect                                              # 列出 30 族可调用组件及新版样板
node build.js --inspect library-card                                 # 查看某组件全部变体决策
node build.js --inspect library-card spliced-vertical-single-event   # 查看单变体允许字段、依赖与示例
node scripts/scan-source-page.cjs <原页HTML路径>                      # 预扫描原页区块与交互信号
npm run ingest -- <原页HTML或URL> <page-slug> [--render]              # 一键保存原页/导出 Page IR、下载真实配图到本地并生成预扫描报告
npm run audit:page -- pages/<目标页>.html [--mode=strict|audit]       # 3秒分块截图 + 等高/控件/Token审计（--mode=audit 可直查线上 fs.com）
npm run page:upgrade -- pages/<目标页>.html                          # 将已生成页面一键升级到最新组件库版本并自动跑 check
npm run release:prune                                                # 清理无引用的孤儿发布包快照与过期验收日志
npm run component:accept -- <组件名>                                  # 一键级联验收组件、发布新 Release 并自动刷新门户与知识底座包
npm run core:export                                                  # 导出独立零依赖规范知识底座 dist/fs-design-core/（<100 KB）
npm run portal:build                                                 # 重新构建设计师唯一规范门户 design-system/portal.html
```

### 高频业务场景 → 纯新版选型速查表

> **区块级黄金样板**：多组件组合区块（顶部 9 宫格分类、Tab+4列商品轮播、1200px 全宽媒体面板、无按钮整卡链接、FAQ、白底双列等宽表单）直接复用 [design-spec/section-patterns.md](design-spec/section-patterns.md)。

选型前先对照下表缩小候选，再用 `node build.js --inspect <组件> <变体>` 核对允许字段与 `maintenance/` 新版样板（唯一规范展示入口；旧 `design-system/components/preview/<组件>.html` 已移除，`design-system/components/variants/` 仅为内部编译源）：

| 来源模块特征 | 优先查询组件 / 变体 | 关键注意 |
|---|---|---|
| 页面顶部宣传/标题区 | `library-banner` (`hero` / `hero-responsive` / `sub` / `search` / `title-only`) | 按是否有描述/搜索/按钮选型；无描述但有图+按钮时可用页面骨架组合原生 `library-button` + 纯色深色遮罩 |
| 同页多章节跳转（随滚动高亮） | `library-anchor-nav` (`anchor-nav`) | 必须由页面宿主脚本补齐滚动监听与高亮同步 |
| 同组多张上下图文卡 | `library-card` (`spliced-vertical-single-event` / `-bordered`) | 20px 网格，最多 4 列；**白底区块用 `-bordered` 带描边，灰底区块用无描边白卡**；原页无显式按钮文字时用 `sourceAbsent` 省略 `link` 槽位（禁脑补 Explore/Learn More）并整卡跳转；促销角标/价格行通过 `data-fs-extend` 扩展 |
| 正文独立左右图文 | `library-card` (`spliced-horizontal-full-width-responsive`) | 核对左右方向与列宽 |
| 图标 + 标题 + 说明（+ 单入口） | `library-icon-card` (`left-single-event` / `center-single-event` / `left-jump-type`) | 使用登记图标，不强塞内容配图 |
| 多卡横向翻页轮播 | `library-carousel` (`external-cards`) | 48px 方向原子在版心外 32px；白底区块配 `-bordered` 子卡、灰底区块配无描边子卡；按原页首屏显示列数设置，确保可翻页 |
| 面板内容切换 | `library-tab` (`standard-center` / `capsule` / `product`) | 仅用于真实分面切换；原页是“标签+轮播卡片”时必须与 `external-cards` 联动，不可降成纯文字面板 |
| 顺序步骤指引 | `library-stepper` (`icon-regular` / `icon-divider` / `circle-centered-solution`) | 核对步数与连接结构 |
| 折叠问答 / 展开说明 | `library-collapse` (`faq` / `split` / `feature`) | 核对单开/多开及答案内链接 |
| 表单输入与选择 | `library-input` / `library-select` / `library-radio` / `library-checkbox` / `library-form` | 严禁裸写控件，严禁白灰混用：白底描边套系（`input/white` + `select/single-radio`、`multi-checkbox`、`search`、`phone-search`、`grouped-combination`）；灰底套系（`input/gray` + `select/single-basic`、`single-check`、`multi-basic`、`two-column`）。下拉框传 `layout: "fill"` 与输入框严格等宽 |
| 弹窗 / 详情弹层 | `library-dialog` (`information` / `confirmation` / `form`) | 核对重复打开、Escape 关闭与焦点返回 |
| 独立操作按钮 / 文字链接 | `library-button` (`filled-red` / `filled-black` / `outline-black` / `outline-white`) / `library-text-button` (`inline-blue-link` / `inline-black`) | 按原页主次与呈现形式选型，卡组下方的附属按钮留在同区块内，不要拆成独立 40px 区块 |

### 规范组件上的合规业务扩展

业务页中组件没有 100% 同款变体是正常现象。优先复用最接近的原生 `library-*` 变体，若需在规范组件内部新增业务元素（如卡片角标、元信息、双按钮），保留原生组件骨架与 Rule 0 固定头尾不变，用 `data-fs-extend="<用途>"` 包裹扩展内容，并使用非 `.ds-*` 业务类名搭配 FS 通用 Token（颜色、Open Sans 400/600、间距、圆角、禁止渐变）。`validate.js` 会自动验证原生骨架完整及扩展安全，不再因合理扩展阻断首版。

新页面固定使用同版本 `library-navigation/header` 和 `footer`，保留标准Logo、导航与操作。整页统一使用该版本资源，不混载新旧整套CSS。页面布局仍按本地1200px版心、40px区块间距、20px网格检查，组件内部按实际版本契约。

只修改契约允许的内容字段，不用任意加减类、覆盖组件样式或自绘图标扩展能力。结构化内容使用真实渲染片段并保留固定版本资源地址。来源没有可选内容时，按原契约提供 `reference-inputs/` 原始记录与 `objectId`，使用受约束的 `sourceAbsent`；不可省略必需结构。

事件表示页面可接收的交互意图；网络请求、保存、业务数据和服务器结果由实际页面接入。不能用原站iframe、整块HTML/CSS或未登记表单控件绕过组件缺口。选型缺项先核对契约与Preview，确有缺口时明确说明，不静态降级冒充完成。

## 页面验收

日常只检查目标页：

```bash
npm run check -- pages/目标页面.html
```

两个原有根入口 `npm run validate`、`npm run verify` 仍可分别使用，无参数保留全项目扫描。`check` 不发布组件，也不触发全库工程复验。新版页面检查实际HTTP资源、1085/1440/1920宽度及已声明的代表性交互；保留页面继续按其固定版本检查。

自动检查后仍逐模块实际看图，确认变体、图标语义、来源内容、图文归属、裁切、悬停及交互。脚本通过不代表视觉批准或未覆盖业务已完成。合格后按根目录AGENTS的要求更新项目首页入口。

页面实测从首次准备读取开始计时，记录阅读/选型、装配、验收、返工与收尾；失败和等待计入总时间，脚本运行单列。

## 组件维护与同步

**单一规范与维护路径**：30 个组件族唯一对外展示的规范页在 `maintenance/`（带日期的新版页），旧的不带日期 `design-system/components/preview/<组件>.html` 已移除；`design-system/components/variants/` 为内部变体源（仅编译/同步脚本读取，不当作规范页阅读）。
1. **查看规范**：只看 `maintenance/` 新版页（侧边栏统一入口 `design-system/component-library.html`）。
2. **调整样式**：修改对应共享 CSS（如 `design-system/components/card-current.css`）或告诉 AI 改动要求。
3. **调整结构与契约**：由 AI 协调 `design-system/components/variants/<组件>.html` 与 `contracts/<组件>.json`（脚本不会自动推断设计意图）。
4. **同步发布**：运行原维护命令，自动联动母子组件并刷新新版页、选型、装配与验收：

```bash
npm run impact -- button
npm run component:check
npm run component:check:impact   # 按 git status 变更自动推导受影响组件并增量运行回归测试
npm run component:sync
npm run variants:slim            # 清理 variants/*.html 内部编译源中的冗余历史说明区块
```

`component:check` 只检查当前导出；过期时先查来源差异。`component:sync` 更新父组件预览、本地片段、选型、依赖、统一规范页和固定资源版本；`component:watch` 使用同一同步链。新调用取当前资源，已交付页保持原版本。保留当前调用、规范展示和回归检查所需的固定版本。不自动清理版本，也不为清理或消除过期提示而重新发布。

组件迁移或协调多文件修改时，沿用现有隔离副本完成中间检查与导出，稳定后在正式项目发布一次。修改组件或验收工具时，才执行相关工程、同步或故障注入测试，不将其加入普通页面流程。

## 规范页与工程入口

30个组件族沿用统一模板 `design-system/docs/component-spec-template.html`、`component-spec.css` 和现有侧边导航。Button、TextButton、IconButton样板位于各原 `maintenance/*-prototype-*/preview.html`；其他规范页位于 `maintenance/foundation-prototypes-20261114/`。这些是当前展示和维护依赖，不能作为历史记录删除。

`npm run docs:build` 重建组件规范展示及统一阅读页，不发布资源。阅读资料从README、AGENTS及现有规范原文件生成；更改这些原文件后仍使用此命令，原`component:sync`也会沿同一链更新。修改公共展示模板不等于开放变体。

现有工程入口保持：`npm test`、`npm run test:sync`、`npm run test:page-checks`、`npm run design:check`。组件原始来源、MG核对范围、工程记录和视觉状态仍保存在原组件目录；未来需要相应复核时读取，不在每次页面合成中重跑。

5个实际回归输入由现有检查脚本读取，文件、必需资料及固定版本保留在原路径，不作为新页实现范本。测试生成的HTML、同步日志和结果按原命令重新生成，不是组件源或当前调用资格依据。

本地页面布局以`design-spec/`为准；颜色、字体和间距查组件库原有的Token及全局样式规范，具体组件按当前catalog、契约和真实Preview调用。

日常阅读统一使用组件库内的“阅读资料”侧边目录。原始文档、契约、Preview和固定资源保持各自路径，AI读取及页面执行规则仍以原文件为准，不维护第二套正文。
