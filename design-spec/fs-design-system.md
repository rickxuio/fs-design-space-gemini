# 本地页面布局规范

本文件负责fs-design-space的页面布局、来源处理和交付检查。组件样式、尺寸、状态及内部结构读取当前catalog、原契约和真实Preview；旧组件独立预览、CSS和图标目录已退役，不再作为新页面读取来源。完整工作流见[AGENTS.md](../AGENTS.md)，组件入口见[组件库](../design-system/component-library.html#library)。

## 1. 页面布局

| 项目 | 原有规则 |
|---|---|
| 内容版心 | 最大1200px，居中；容器无水平padding |
| 区块 | 上下各40px；白色与浅灰区块交替 |
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
