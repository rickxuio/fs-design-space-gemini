# text-button 原始组件来源

2026-10-09 通过官方 MCP 读取文件143880409387753的 COMPONENT_SET `64858:84505`。`mastergo-original-components.json`只保存该原始组件集合；没有把规范说明页合并为组件源。子实例中的鼠标手势属于展示标注。

响应未给出远端修订时间，不宣称实时同步或在线最新。此快照是可追溯核对依据；运行组件由本地契约、Preview、声明样式和图标共同提供。图标按钮已有SVG形状仍待视觉复核。规范说明按需阅读，不作为组件集合数量或真实交互代码的证明。

现有10个尺寸调用逐一对应唯一Default节点，比较显式font family/size/weight/lineHeight、完整textColor范围、gap和12px Right实例；两个带背景调用另外核对height/padding/radius。运行 `node scripts/inventory-text-button-source.js` 重算；参考编译会拒绝过期或修改索引。这是设计声明与当前契约的对照，不是计算CSS、箭头SVG轮廓、Footer适配、完整规范或浏览器批准。源样本文字宽度不锁定运行时文案长度。

2026-10-10原生MasterGo核对：Collapse Edit 实例 `69424:119913` 的主组件为黑色14px/off `64858:84960`，左侧Edit图标开启、右箭头关闭；Hover `64858:84954`的已保存声明保持黑色并加下划线。当前宿主Preview使用完整TextButton结构并只管理位置和事件，按用户原子优先原则保留现行12px图标；原稿16px图标/18×16包装差异登记在 `components/sources/collapse/text-button-nesting-1010.json`。有限button语义适配不扩大七导航变体/十尺寸的精确AI范围，不等于实际浏览器或视觉批准。
