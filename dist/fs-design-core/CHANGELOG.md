# FS Design Core — Changelog

> 人类可读的语义化版本与底层内容寻址 Release Hash 对照表。下游应用（页面合成、测试站走查、设计预审）统一按本版本号消费 `dist/fs-design-core/`。

## [v1.1.0] - 2026-11-24
- **Active Release Hash**: `4d8bac51c0edf7a93cbdd4559749fe5c03b02d9c92a1484ff300e2018bd8f257`
- **Scope**: 31/31 components integrated, 150 callable variants, 184 registered icons, 0 gaps.
- **Added**:
  - `library-banner/hero-responsive`: 原生支持双白色描边 CTA（`secondaryActionLabel` / `secondaryActionCallback` / `secondaryActionHref`）。
  - 图标画风分类体系 `design-spec/icon-style-families.json`（7 大 `styleFamily`）与同区块防混用门禁 `PAGE_ICON_STYLE_MIXED`。
  - 独立维护手册 `design-system/MAINTENANCE.md`、子改父视觉对比工具 `npm run component:visual-diff`、纯净规范底座导出 `npm run core:export`。
- **Fixed**:
  - `library-list/unordered`: 重置 `background: transparent; border-radius: 0`，修复嵌套于灰底容器时露出白底的问题。
- **Patterns**:
  - `design-spec/section-patterns.md` 新增 Pattern 14（证言引文卡、双 CTA Hero、卡片标题黑下划线悬停、`#C00000` 品牌红边界、240px 左竖排导航、纯展示无框通透图标网格“无链接不上盒、无点击不投影”）。

## [v1.0.0] - 2026-11-23
- **Release Hash**: `72f611c9159a` → `89cd38bf7136`
- **Added**:
  - 新增第 31 个组件族 `library-pagination/default`。
  - 新增 `library-tag/semantic-hot` 橙色热销徽章、`library-card/embedded-product-plp` PLP 商品卡。
  - `library-tab/product` 升级全彩双色图标并支持 `mouseenter` 悬停切换。
  - `library-navigation/header` 合入 FS 官网完整 6 项 Mega Menu 及 Country / Search / Account 浮层。
