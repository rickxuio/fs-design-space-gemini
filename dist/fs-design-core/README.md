# FS Design Core (v1.1.0)

> **FS 部门设计规范只读底座包（框架无关 · 零外部依赖）**
> 本目录由 `npm run core:export` 自动生成（对应 Release `98d6fd30548f`），仅包含机器与人均可直接读取的权威设计规范，不含页面合成脚本或业务测试页。

## 文件速查（按需读取）

| 文件 | 用途 | 适用场景 |
| :--- | :--- | :--- |
| `tokens.json` | 布局版心（1200px）、视口（1085/1440/1920）、Open Sans 字号阶梯、颜色、圆角、`#C00000` 品牌红允许/禁用边界 | 测试站样式走查、设计稿预审、研发对表 |
| `rules.json` | 9 条框架无关的核心走查规则（零溢出、灰底无描边/白底加描边、禁渐变、按钮权重、图标画风一致、无链接不上盒等） | Vue / 任意前端测试站自动走查、AI 审核 |
| `catalog.json` | 全部 31 族组件、150 个可调用变体的 `whenToUse` / `whenNotToUse` / `allowedEdits` 与父子依赖图 | 组件选型、设计评审、规范问答 |
| `icon-style-families.json` | 184 枚官方注册图标的 7 大 `styleFamily` 画风分类 | 检查同区块是否混用线性/面性/插画图标 |
| `section-patterns.md` | 14 套高频页面区块组合范式（含 Pattern 14 反教条组合规则） | 原型设计、专题页结构评审 |
| `CHANGELOG.md` | 语义化版本变更记录 | 下游项目评估升级 |
| `manifest.json` | 本包版本号、导出时间与资产统计元数据 | 自动化脚本校验版本 |

## 快速接入方式

- **脚本 / 自动化走查工具**：直接 `require` 或 `JSON.parse` 读取 `tokens.json` + `rules.json` + `icon-style-families.json`，对照页面渲染后的 Computed Style 与几何坐标执行校验（不依赖任何前端框架或特定 CSS 类名）。
- **AI 助手 / 规范预审 Skill**：将本目录放入项目知识目录，指示 AI：查视觉参数读 `tokens.json`、查红线读 `rules.json`、查组件禁用边界读 `catalog.json`、查区块排布读 `section-patterns.md`。
- **维护边界**：本目录为**只读消费包**，请勿在下游项目直接修改；如需调整规范或新增变体，请反馈至上游设计系统维护仓库统一发版。
