# 本地页面布局规范

本文件负责fs-design-space的页面布局、来源处理和交付检查。组件样式、尺寸、状态及内部结构读取当前catalog、原契约和真实Preview；旧组件独立预览、CSS和图标目录已退役，不再作为新页面读取来源。完整工作流见[AGENTS.md](../AGENTS.md)，组件入口见[组件库](../design-system/component-library.html#library)。

## 1. 页面布局

| 项目 | 原有规则 |
|---|---|
| 内容版心 | 最大1200px，居中；容器无水平padding |
| 区块 | 上下各40px；白（#FFFFFF）与浅灰（#FAFBFB）按视觉层次自然搭配，不强求机械交替 |
| 网格 | gap20px，最多4列，可用1—3列 |
| 区块标题 | 24px、600、32px行高，居中 |
| 标题到描述 | 12px |
| 描述到内容 | 24px |
| 描述 | 14px、400、22px行高，居中，最大宽960px，颜色#707070 |
| 页面字体 | Open Sans，400/600 |
| 页面表面 | #FFFFFF、#FAFBFB；原规则允许的深色区按具体组件用途使用 |
| 卡片/容器描边 | **灰色背景（#FAFBFB）上的白色卡片或容器禁止加描边**；描边（border）仅在白色背景（#FFFFFF）上用于区分边界 |
| 图文/视频面板宽度 | 独立展示大图、视频面板默认撑满 1200px 版心；仅纯文字描述限制最大宽 960px |
| 表单控件配套与对齐 | 含多行长文本的留资表单优先使用 `library-form/gray` + `sourceFields`（撑满 `1200px` 卡片内宽，原生全宽 `textarea` 与**左下角对齐**提交按钮），严禁裸写 `<textarea>`；组合单行表单严禁白灰混用，网格内控件传 `layout: "fill"` 严格等宽，label 统一为 `14px/400/#4B4B4D` |
| 轮播分页点 | 对齐 FS 官方规格（未选中 `8×8px` 圆点 `opacity: 0.4`、当前项 `20×8px` 胶囊 `opacity: 1`、`#707070`、`gap: 10px`）；严禁在非 `library-carousel` 宿主外零散调用方向原子 |

内容顺序与功能意图以实际来源为准，不拿某个旧示例的模块顺序替代需求。页面分隔线留在版心内，不加源站品牌装饰线。容器、page-section、section-header和grid是页面骨架；组件内部不使用页面CSS覆盖。

## 1.5 顶部导航栏下拉菜单与浮层规范（对齐 `fs.com` 线上实测）

当前组件库固定外壳 `library-navigation/header` 仅实现了 5 项主导航与 240px 单列 `All Products` 菜单；**线上 `https://www.fs.com/` 完整顶部导航规范如下**（供后续升级 `library-navigation/header` 组件与维护页时作为单一依据）：

### 主导航栏结构
- **顶栏 Utility Bar**：全宽 `#F6F6F8`，高 `32px`，版心 `1200px` 居中，字号 `12px/#707070`（hover `#19191A`），项间 `1px×10px` `#E5E5E5` 竖线。左：`FS United States`、`FREE SHIPPING on Orders Over US$79`；右：`Contact Us`、`United States / $ USD` 下拉触发器。
- **主导航条 Main Nav**：全宽 `#FFFFFF`，高 `70px`（`69px` 内容 + `1px solid #E5E5E5` 底边），Logo `76×36px`。主入口共 **6 项**（项间距 `48px`）：`All Products`、`Software`、`Solutions`、`Services`、`Resources`、`Contact Us`；文字 `14px/22px/400/#19191A`，悬停/激活态保持 `400` 字重并在底部呈现 `2px solid #C00000` 红线（`border-radius: 3px`）。
- **下拉面板统一容器**：宽 **`1200px`** 居中贴紧主导航底边（`top: 69px`，`border-top: 1px solid #E5E5E5`），下圆角 `4px`，最大高度 `calc(100vh - 149px)` 内部滚动，`z-index: 110`，背后覆盖全屏半透明遮罩 `rgba(51, 51, 51, 0.3)`。

### 下拉 Mega Menu 两套标准模板

| 模板 | 适用入口 | 布局结构与尺寸 | 排版与交互规范 |
|---|---|---|---|
| **模板 A：左灰导航栏 + 右白内容区** | `All Products`<br>`Software`<br>`Solutions` | **左栏**：宽 `240px`（20%），`#F6F6F8` 底，`padding: 32px 0`；每项高 `48px`，激活项浮现白色左圆角胶囊（`border-radius: 3px 0 0 3px`，`left: 12px`）+ 文字下方 `2px solid #C00000` 红线。<br>**右栏**：宽 `960px`，`#FFFFFF` 底，`padding: 32px 40px 40px`。 | - **`All Products`**：左栏 8 类目带线性图标；右栏 **4 列网格（`gap: 20px`）**，组标题 `14px/600/#19191A`（hover 出红底线），子链接 `12px/20px/#707070`（hover `#19191A` 下划线），支持行内 `Hot`（`#F56300`）/ `New`（`#10A300`）角标。<br>- **`Software`**：左栏 4 类目无图标；右栏 `16px/600` 分区标题 + **2 列网格（`gap: 20px`）**（每项 `14px/600` 标题 + `12px/20px/#707070` 描述）。<br>- **`Solutions`**：左栏 4 类目无图标；右栏 `16px/600` 标题 + `12px/#707070` 副标题 + **3 列分组链接网格（`gap: 20px`）**。 |
| **模板 B：左 2 列链接 + 竖线 + 右宣传图卡** | `Services`<br>`Resources`<br>`Contact Us` | 全宽 `#FFFFFF`，`padding: 32px 40px 40px`，水平 Flex：<br>**左区**：`flex: 1`，顶部标题 `16px/24px/600/#19191A` + 副标题 `12px/20px/#707070`，下方 **2 列链接网格（`gap: 20px 32px`）**。<br>**竖分割线**：`1px` 宽 `#E5E5E5`，左右间距 `32px`。<br>**右区图卡**：固定 **`360×225px`**，`border-radius: 8px`。 | - **`Services` / `Resources`**：右图卡叠白字标题（`20px/28px/600`）+ 副标题（`14px/22px`）+ 红底按钮（`32px` 高、`12px` 字、`4px` 圆角，如 `Project Inquiry` / `Explore Documentation`）。<br>- **`Contact Us`**：左区为 2×2 网格（`Explore FS`、`Contact Us`、`Follow Us` 6 社媒图标、`FS Branch`）；右图卡为纯实景仓库照片（无叠字按钮）。 |

### 顶栏与右侧辅助交互浮层（3 类）
1. **国家/语言/币种选择器**（点击 `United States / $ USD` 展开）：`292×424px` 白色浮层，`border-radius: 8px`，投影 `0 2px 8px rgba(0,0,0,0.1)`；内含当前选中项 + 关闭按钮、带放大镜的搜索框、可滚动国家/语言/币种列表（语言币种高亮 `#0060BF`）。
2. **全宽搜索展开面板**（点击搜索图标展开）：全宽 `100%`、最小高 `360px` 白底面板，右上角 `×` 关闭；内含 `900×42px` `#F6F6F8` 输入框无缝拼接红底 `Search` 按钮（左/右 `4px` 圆角），下方展示 `Recent Searches` 与 `Hot Searches`（`Change` 蓝链 + `999px` 圆角 `1px solid #EEE` 胶囊词条）。
3. **账户下拉浮层**（悬停账户图标展开）：`288×114px` 白色浮层，`border-radius: 8px`，投影 `0 2px 8px rgba(0,0,0,0.1)`，`padding: 12px 16px`；未登录态上下堆叠全宽红底 `Sign in` 与灰底 `Sign up` 按钮。

## 2. 内容、图片与图标

原站头尾和Logo替换为同版固定FS外壳；品牌字体、色块、渐变和装饰过滤。忠实保留正文、链接、模块和可见交互，不编造宣传文案，不删内容掩盖组件缺口。

配图位使用真实图片，优先来源原图；无法取得时使用与正文主题相关的真实替代图。不得用纯色或灰块占位。Hero / Banner 底图须先看图确认无硬编码文案或竞品按钮，否则改用同页无字实景图。具名头像无授权照片时使用中性占位，不套陌生人脸。仅原站本身为图标/矢量徽章类区块时使用 `IconCard` + 官方登记图标，原站为实景照片卡时保留实景图，不擅自改成 `IconCard`。

白字叠背景图沿原规则用纯色半透明深色遮罩，通常rgba(0,0,0,0.45—0.55)，不使用渐变；组件已有结构时不覆盖。实际核对图片主体、裁切和文字可读性。图标核对语义、尺寸和状态，禁止自绘SVG或随意换图。

## 3. 选型与组件来源

先读[selection.json](../fs-components/component-specs/library/selection.json)，再核对[catalog.json](../fs-components/component-specs/library/catalog.json)、该变体契约、原Preview、允许字段、父子依赖和运行资源。只调用当前callable允许的library-*片段；ready、文件存在或历史快照不能替代资格。

图文左右并排查Card，顺序流程优先查Stepper，图标说明查IconCard；章节跳转、面板切换和跨页导航分别查对应导航决策。Banner按真实内容选型，不默认Hero。所有布局、颜色、按钮、列表和交互细节遵从当前变体，不套旧数值。找不到调用先查契约与Preview，真实缺口须明确，不能嵌原站控件或手画组合代替。

保持同版固定Header/Footer及资源，使用原data-component/data-fragment/data-props接口。只改allowedEdits，不破坏锁定类名和结构，不混载样式，不覆盖`.ds-*`原生视觉。业务页确需在规范组件上新增元素（如卡片角标、元信息、第二操作）时，在保留原生骨架与Rule 0头尾的前提下，使用`data-fs-extend="<用途>"`搭配非`.ds-*`类名与FS通用Token自然扩展。sourceFields/sourceAbsent按原来源记录与受控接口使用；业务保存和远程数据由宿主负责，组件事件不代表服务器完成。

## 4. 编写与检查

普通页面保存在pages；页面级规范保留fs-components/page-sources → build.js → page-specs管线。普通页面可调用现有assemblePage帮助提取；不引入迁入项目的页面流程。

日常运行`npm run check -- pages/目标页.html`，两个原根入口validate、verify可分别执行，无参数仍扫描现有目录。自动检查0错误后逐模块实际看图，核对选型、字图、内容完整性、真实交互与几何。卡片尾部对齐、Tab居中、轮播按钮位置/可点击/不裁切按原检查和具体契约处理。脚本通过不代表设计师视觉批准或未覆盖业务完成。

计时从首次准备读取开始；失败、等待与返工计入，脚本时间单列。合格交付沿原首页登记方式，不另建流程或报告类型。现有5个回归输入是检查资料，不是新页实现模板。

## 5. 维护

30 个组件族唯一规范入口位于 `maintenance/`（带日期的新版页）；不带日期的旧 `design-system/components/preview/<组件>.html` 已移除，`design-system/components/variants/` 仅作为内部编译与母子同步源。调整样式改共享 CSS（`design-system/components/*-current.css`），结构或契约变化由 AI 理解差异并协调 `variants/` 与 `contracts/`，再走原 `component:sync/watch` 更新父子联动、片段、选型、依赖、新版规范页与新版本。组件/Token 在原 `design-system` 来源维护，不在本地生成目录手改或重新定义一套数值。既有页面固定原版本；有限工程、来源核对及视觉批准分别记录。
