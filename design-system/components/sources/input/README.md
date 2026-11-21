# Input 原始组件来源

2026-10-09 读取 MasterGo 文件 `143880409387753`，页面 `68908:290576`，保存区域 `68908:307411` 的工具生成 HTML 到 `mastergo-original-components.json`。其中有七个 `data-type="component-set"` 标记；这是工具导出元数据，不等于独立保存的原始 COMPONENT_SET/COMPONENT DSL 类型证明，更不是原前端源码。

组件以紫色标记和实际节点类型识别，规范以正文内容识别；不按左右位置分类。当前 HTML 标记仅作为保存资料的定位线索，独立原始类型和完整规范仍待证据。容器标题与规范标题的版本名称不同，不单独判定为冲突。

保存状态和内联样式是工具声明，不是浏览器视觉证据或可运行的输入、清除、校验逻辑。鼠标手势与紫色边框属于设计标注，不进入运行组件。七个集合标记不代表本地已经实现七个家族。

响应没有远端修订时间；不宣称实时同步或在线最新版。HTML 中的 `./asset/` 引用来自短期资源会话，快照不等于可离线运行素材包。尚未完成所有状态与本地契约的逐项核对或人工视觉批准。

## 基础输入框本次复核

本次仅核对标记 `68908:013958` 下的14个工具导出状态：两种背景，每种 Default / Hover / Activated / Inputting / Input complete / Disabled / Error 七状态。逐节点文字、尺寸和样式保存在 `basic-input-review.json`，快照保持不变。标签声明14/22；输入及错误13/20；导出 HTML 未声明的 font-weight 不能直接证明源字重400，当前本地400是独立组件规则。基础集合没有清除入口标记，鼠标手势不进入运行组件。

`node scripts/validate-input-source-review.js` 逐一校验保存字节、十四个唯一标记、背景/状态、标签/字段/根样式、文字和图标声明。参考编译同样执行此校验；仅刷新指纹不能掩盖复核内容漂移。通过不代表原始节点类型、SVG轮廓、完整规范或真实浏览器通过。

本地 Preview 使用显式 `input-current.css/js` 和原生字段，精确调用示例在同步生成的 `components/references/input/`。默认示例不含预览状态辅助属性；装配时重新生成字段/错误id并同步label关联。白底禁用描边保持#EEEEEE，现按工具节点68908:022328登记专属 `color.input-disabled-border` 和 `border.color.input-disabled`，不替换成Gray6，不推广为其他输入家族规则。Form/Collapse保留旧版本。

工程结果仅以 `components/quality/acceptance.json` 中本次范围与当前源/检查工具指纹匹配的证明为准。人工视觉批准仍待确认；当前工程范围不覆盖其余六个输入家族。错误信息图标复用登记资源，原始资源会话没有提供可持久核验的轮廓文件，不宣称图标轮廓获人工批准。

## 2026-10-11 基础状态定向续接

原生Chrome可见规范正文/日志为v2.4.2608C（2026-08-20），外层图层名为v2.5.2608C；差异保存在specification-basic-review-1011.json，不以图层名推断规范全覆盖。基础正文明确Error点击进入Activated；当前脚本已使聚焦态优先于错误视觉状态，保留宿主aria-invalid、错误消息与描述关联，失焦恢复Error。两个背景的有限离线状态检查通过，不能替代原生键盘/光标/视觉验证。Collapse当前Preview的两处Input已经迁移到current原子，历史页面和旧Form仍锁定。
