# MasterGo 图标原件（2026-10-21）

用户授权下载 `authorized-scope.png` 红框内图标，并参考原分类。来源为有效 FS 文件 `143880409387753`、Icon 页 `3752:3996`、原件清单 `59586:69810`（【图标组件】设计规范v2.1.2605A）。本批只做原件下载、来源登记与检索，不修改 J4858D 页面选型，不扩展其他组件投喂。

入口：[`../../preview/mastergo-icon-library.html`](../../preview/mastergo-icon-library.html)；机器清单：[`../../icons/mastergo-library/manifest.json`](../../icons/mastergo-library/manifest.json)。原始分类和完整中文/英文名称保留，可按名称、状态、节点和节点尺寸检索。

| 原分类 | 独立图标/状态原件 | 说明 |
| --- | ---: | --- |
| 系统Icon | 35 | 包含原占位符 |
| 通用Icon | 71 | 不把组件内部路径当作新图标 |
| 品牌Icon | 17 | 保留原颜色 |
| 交互Icon | 105 | 104份非空；另1份是原集合渲染快照未展示的半星空导出 |
| 鼠标手势Icon | 13 | 原节点尺寸和SVG导出边界分别登记 |
| 定制Icon | 249 | 保留线面结合、资源、价值等原名称层级 |
| 风格化Icon | 30 | 保留原绘制、阴影及导出边界 |

合计520份独立文件，其中519份非空；另保存13组交互集合SVG，不能把整张集合当作单个图标。辅助标题、分隔线、网格和页面示例未纳入候选库。半星 `67746:166570` 的原生SVG宽高为0，清单明确不可选，不冒称可用图标、不补绘。

## 来源与配对

- `mastergo-frame.json`：2026-10-21 MCP实际读取的上层来源快照，`source-tree.json`为其中原件清单的解析结果。
- `mastergo-interaction-states.json`：实际选中105个交互状态后的MCP快照，保留有序属性和值。原工具可能把带空格属性名换行；导入器使用其完整属性标题。
- `originals/mastergo-icon-board.svg`：直接从MasterGo桌面端导出的完整原件清单。
- `originals/batch-437/`：原生选择并导出437个图层后，仅归档428个图标/集合SVG，排除9个标题/辅助容器。415个独立图标与13个集合分别登记。
- `originals/batch-105/`：从交互分类展开到105个真实状态，直接通过MasterGo原生“导出切图”保存到本目录。
- `duplicate-bindings.json`：5组同名原件的配对依据。Report与Chat有嵌入节点/原尺寸依据；另外3组依据原生选中节点URL、画布实图、同名二元组及唯一剩余原件配对。截图为原生JPEG（5120×2622），未经编辑；不把应用截图像素当作图标节点尺寸。

SVG复制到 `components/icons/mastergo-library/<原分类>/<节点ID>.svg`，逐文件保留原字节、SHA-256和原始下载路径，避免同名覆盖。没有擅自改色、缩放、拼合、重新描绘或从整张SVG裁切生成单件。读取时未取得远端修订号，不称为后续时刻的在线最新版。

## 使用边界

1. 原件已下载不代表场景已批准。选用时仍核对含义、同组线性/面性和量感、场景尺寸及宿主契约。
2. `measuredSourceStyleSize`记录MCP实际返回的节点宽高；`size`记录原生SVG画布。14个非空图标的导出边界大于源节点部分尺寸，清单另列 `exportBoundsDifference`；不把边界扩张当作规范新尺寸，不强行压到统一画布或静默裁切。
3. 保留完整状态属性，不能用Default推导Hover，不把纯图标登记成新的Button/IconButton宿主变体。
4. 本批是候选原件库，与已有 `components/icons/icons-manifest.json` 的正式调用记录分开。现有页面与锁定资源未升级，旧图标没有被覆盖。需要在页面调用新原件时，再按该使用场景补精确调用依据。
5. 本地目录只验证资源加载、搜索/分类/尺寸筛选及原字节，不替代逐图标场景视觉审阅或整页A5。

## 复现

原生下载已经保存在项目内，换机不依赖Downloads目录或临时剪贴板图。

```sh
python3 components/sources/icon-library-1021/import-library.py
python3 components/sources/icon-library-1021/build-catalog.py
npm run preview -- --page components/preview/mastergo-icon-library.html
```

预览服务只读、绑定127.0.0.1；按实际启动输出确认地址。`verification.json`记录资源校验，浏览器证据独立保存。MCP大批量节点读取及截图曾120s超时；原生SVG导出与原生界面定向读取正常，这不是工具权限拒绝，也没有改用其他来源冒充MG原件。


2026-10-21 用户要求去掉“网络虚拟化”（67934:128195）的投影：目录展示及默认下载改用 `67934-128195-no-shadow.svg` 本地派生版。仅移除投影滤镜，路径、颜色及88×95导出画布不变；原始SVG及其指纹保留，导入脚本会重建该派生版。浏览器已实际核对无投影显示，截图 `network-no-shadow.jpg`。


2026-10-21 用户确认：同一展示组禁止混用线性图标和线面结合图标。选型须同时满足含义、同组风格和原生尺寸，不能以含义更准确为由保留混用组合。J4858D顶部Warranty与Professional Engineer组合已被明确否决，待重新选型。
