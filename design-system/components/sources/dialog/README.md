# Dialog 首批迁移记录

2026-10-08，通过官方 MasterGo Magic MCP 读取《英文站组件库》文件 `143880409387753`。未改写 MasterGo 文件。

## 证据边界

- 规范解读容器：`70971:200121`，文本版本 `v2.3.2607A`。
- 原始组件区域：`68908:469905`，区域标题仍为 `v2.1.2508A`。
- 内容提示：原始 COMPONENT_SET `68908:014251` → 桌面 COMPONENT `68908:048976`。
- 删除确认：原始 COMPONENT_SET `68908:014254` → 桌面 COMPONENT `68908:052338`。
- `mastergo-spec.json` 保存规范解读的 DSL；`mastergo-components.json` 保存原始组件的 DSL。两类资料独立保存。规范表格中的示例 INSTANCE 不按独立组件统计。

## 已落地范围

两种桌面模板；内容提示原示例 650×490，删除确认原示例 480×202，容器圆角 8px。信息提示按原始组件保留 20px 内容分组、8px 小标题到正文、12px 正文到列表；小标题 16/24 Regular，正文 14/22 Regular。删除确认复用 Button 的灰色/红色填充及 42px 尺寸。关闭控件 28px，图标 20px；既有 IconButton 无完全匹配的尺寸组合，因此不伪装成 IconButton。

通过原生 dialog 提供模态层、背景隔离及键盘焦点保护；支持关闭、取消、Esc、遮罩关闭和可阻止默认关闭的 `fs-dialog-confirm` 事件。确认事件由业务接入；预览不删除数据。仅正文滚动，上下保留至少 64px。

## 检查与限制

- `node --test scripts/dialog.test.js`：验证原始示例尺寸、42px 按钮、居中、关闭方式、焦点返回、背景隔离、确认事件及长正文滚动。
- `npm run health`：通过；Dialog 整体未完成警告是保留的范围声明。
- 嵌入组件库 `#dialog` 路由和实际打开弹窗已验证。
- 表单、加购、消息提示、特殊业务和移动端尚未迁移；尚待用户视觉审阅，不声明整个组件家族或两个源版本完全一致。

入口：`components/preview/dialog.html`；契约：`components/contracts/dialog.json`；行为：`components/dialog.js`。

2026-10-10当前状态：上述真实浏览器记录属于历史有限验收，不能用于改动后的运行资源。当前契约加载 `components/dialog-current.js`，原 `dialog.js` 保留；已补一次委托注册、原生禁用与hidden/ARIA禁用祖先的事件守卫。JSDOM的showModal/close状态模拟只证明事件路由，不证明当前top-layer、Esc、焦点、遮罩或尺寸。当前完整工程验收与用户视觉批准仍未建立，以 `components/quality/report.json` 为准。

2026-10-10来源索引：`source-inventory.json`独立保存2个真实桌面COMPONENT、11段已定位规范TEXT与9个当前明确CSS selector的必要声明对照。所有继承INSTANCE子层坐标标为未解析，样例高度不作为固定内容高度。规范蒙层30%已登记同值Token；声明比较不验证完整级联、实际居中/滚动、top-layer或字体加载。索引不是完整Dialog规范覆盖或原前端源码。

2026-10-10底部依赖：两个实际INSTANCE通过componentId对应已保存Button灰色/红色Default COMPONENT，契约均为xl-regular/42px。来源记录93px实例宽度与136px母组件宽度分别保留，不比较固有文字宽度；602px继承容器坐标不用于验证480px弹窗的实际布局。来源索引绑定两份契约与Button原始集合指纹，不把名称或文档示例当作组件身份。当前完整工程/视觉状态仍为未建立。

2026-10-10有限结构：精确引用检查锁定头部/正文/确认页脚的顺序，关闭图标为直接子节点，底部每个Button必须有直接ds-btn__text，不允许额外包裹、submit或Processing伪默认。正文仍是已声明structured-content槽位；静态结构检查不代替浏览器、宿主级联或整体验收。
