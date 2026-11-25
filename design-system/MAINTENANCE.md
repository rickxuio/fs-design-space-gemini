# FS Design System — 组件维护与发版手册（Maintainer Guide）

> **角色边界与统一入口**：
> - **设计师唯一视觉规范与组件查阅门户**：[design-system/portal.html](portal.html)（运行 `npm run design:preview` 后访问 `http://localhost:5189/design-system/portal.html`）；`maintenance/` 目录仅作为底层组件契约与自动化测试快照由脚本自动维护，日常查阅无需手动打开。
> - 根目录 [AGENTS.md](../AGENTS.md) 仅负责 **页面合成（Consumer）**；
> - 本文件负责 **组件维护、子改父级联验收、视觉回归与底座发版（Maintainer）**。
> - 严禁为了修单个业务页面而直接覆盖共享组件样式；确认属于组件共性缺陷或新能力需求时，统一按本手册流程维护。

---

## 一、快速决策：本次改动要动哪些文件？

| 改动类型 | 需要编辑的文件 | 是否触发新 Release |
| :--- | :--- | :--- |
| **1. 纯视觉样式调整**（颜色、间距、圆角、字号、背景等） | `design-system/components/<组件>-current.css` | 是 |
| **2. 纯交互逻辑调整**（点击、悬停、展开/收起、事件派发） | `design-system/components/<组件>-current.js` | 是 |
| **3. 契约文案 / 适用边界更新**（`whenToUse` / `whenNotToUse`） | `design-system/components/contracts/<组件>.json` | 是 |
| **4. 新增可编辑属性 / DOM 结构扩展** | ① `design-system/components/variants/<组件>.html`（如需新结构）<br>② `design-system/components/contracts/<组件>.json`（`allowedEdits` 与绑定）<br>③ `design-system/scripts/compile-component-reference.js`（如需参考编译）<br>④ `scripts/local-component-library.cjs`（属性注入逻辑） | 是 |
| **5. 图标画风分类更新** | `design-spec/icon-style-families.json`（**严禁放到 `design-system/components/icons/` 下**） | 否 |

---

## 二、标准组件维护 6 步闭环（防漏、防改坏父组件）

### Step 1：先查父子影响面
修改任何原子/子组件前，先查看会级联影响哪些父组件：
```bash
npm run impact -- <组件名>          # 例如：npm run impact -- button
```

### Step 2：拍“修改前”视觉基线（强烈推荐用于样式/子组件改动）
自动对目标组件及所有受影响的父组件规范页（`maintenance/`）拍摄 1440px 基线图：
```bash
npm run component:visual-diff -- <组件名> --baseline
```

### Step 3：修改组件源码（牢记第 3 节避坑地雷）
按上方表格修改对应的 `*-current.css` / `*-current.js` / `contracts/<组件>.json`。

### Step 4：单组件级联发布与工程验收
运行增量级联验收（自动重编译目标组件与受影响父组件、更新 `maintenance/` 测试快照、生成新 Release，并**自动联动刷新 `dist/fs-design-core/` 知识底座与 `design-system/portal.html` 规范门户**）：
```bash
npm run component:accept -- <组件名>
```

### Step 5：拍“修改后”视觉对比并人工看图
```bash
npm run component:visual-diff -- <组件名> --compare
```
打开生成的 `maintenance/visual-diff/<组件名>/report.html`（或本地预览 `http://localhost:5189/maintenance/visual-diff/<组件名>/report.html`），逐一核对目标组件与所有父组件的前后对比图与高度变化，确认无错位/裁切。

### Step 6：更新版本日志 + 导出纯净底座 + 决定是否升级标杆页
1. 在 [CHANGELOG.md](CHANGELOG.md) 追加本次语义化版本记录与新 Release Hash。
2. 导出最新纯净底座知识包（供测试站走查、原型生成等下游工具消费）：
   ```bash
   npm run core:export
   ```
3. 存量页面默认锁死旧 Release 不会受损；确认需要同步升级标杆页时，执行：
   ```bash
   npm run page:upgrade -- pages/目标页.html
   npm run check -- pages/目标页.html
   ```
4. 定期清理不再被任何页面引用的废弃 Release 快照，控制仓库体积：
   ```bash
   npm run release:prune
   ```

---

## 三、维护避坑地雷（必读）

1. **严禁直接编辑 `design-system/components/components.css`**：
   - 该文件的 SHA-256 哈希被 `navigation-header-quality.test.js` / `navigation-footer-quality.test.js` 锁定，直接修改会导致全库组件集成降为 0。
   - 全局字体平滑等补丁应写在 `scripts/local-component-library.cjs` 生成的 `local-fonts.css`；单组件样式一律写在对应 `<组件>-current.css`。
2. **严禁在 `design-system/components/icons/` 内放置非图标文件（如 JSON/MD）**：
   - 任何额外文件都会改变组件源目录哈希，导致 `npm run component:check` 报 Release 过期。图标分类表统一放在 `design-spec/icon-style-families.json`。
3. **契约选择器禁用 `:not()`**：
   - `compile-component-reference.js` 底层调用 Python `component-reference-dom.py`，不支持 CSS `:not()` 伪类选择器；契约绑定请保持简单类/标签选择器（如 `button.ds-btn`、`span.ds-btn__text`）。
4. **不在组件库里硬写页面特例**：
   - 仅限单页面的特例（如首页 404px 内缩、PLP 无描边灰卡）留在页面构建脚本与 `design-spec/section-patterns.md`，不污染通用组件契约。

---

## 四、高频资产回流与晋升规则

- **本地图标晋升**：页面临时通过 `scripts/fs-icon.cjs` 生成在 `pages/assets/<page>/` 下的 `duotone-line` SVG，若在 ≥2 个页面复用，直接执行一键晋升命令：
  ```bash
  npm run icon:promote -- pages/assets/<page>/icon-xxx.svg icon-official-name.svg --family=duotone-line
  npm run component:sync && npm run core:export
  ```
- **区块模式晋升**：在 `design-spec/section-patterns.md` Pattern 14 中反复出现 ≥3 次的通用交互结构（如 240px 竖向侧栏导航），可评估正式升格为独立组件族。
