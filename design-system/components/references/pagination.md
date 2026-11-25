# Pagination — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：desktop-pc-pagination-default；视觉审阅：pending。

用于 PLP 商品列表、搜索结果或评价列表页码切换；轮播圆点与章节锚点禁止套用。

必须加载：components/tokens.css、components/pagination-current.css、components/pagination.js。

字体样式表：。

保留 nav.ds-pagination[data-pagination-current=default] 根元素与 button.ds-pagination__btn 子节点，当前页带 ds-pagination__btn--active 与 aria-current=page。

可访问名称默认 Pagination，支持通过 accessibleLabel 覆盖。

不可修改：nav.ds-pagination 根结构与 data-pagination-current=default；32x32px 页码按钮与 4px 圆角、#F2F2F2 激活背景、#F6F6F8 悬停背景；由 pagination.js 统一管理上一页/下一页禁用态、aria-current 与 ds:pagination-change 事件。

## default

用：PLP 商品列表页、搜索结果页或长评价列表需要页码翻页导航。

不用：轮播指示点（请使用 Carousel）或章节锚点导航（请使用 AnchorNav）。

可修改：items、changeCallback、accessibleLabel。

```html
<nav class="ds-pagination" data-pagination-current="default" aria-label="Pagination" data-ai-example="ai-pagination-default">
        <button type="button" class="ds-pagination__btn" data-page-nav="prev" disabled aria-label="Previous page">&lsaquo;</button>
        <button type="button" class="ds-pagination__btn ds-pagination__btn--active" data-page-num="1" aria-current="page">1</button>
        <button type="button" class="ds-pagination__btn" data-page-num="2">2</button>
        <button type="button" class="ds-pagination__btn" data-page-num="3">3</button>
        <button type="button" class="ds-pagination__btn" data-page-num="4">4</button>
        <button type="button" class="ds-pagination__btn" data-page-num="5">5</button>
        <button type="button" class="ds-pagination__btn" data-page-num="6">6</button>
        <button type="button" class="ds-pagination__btn" data-page-nav="next" aria-label="Next page">&rsaquo;</button>
      </nav>
```

## 行为

- selection：点击页码或上一页/下一页更新激活态并派发 ds:pagination-change 事件，由宿主页面响应数据翻页。
- scope：当前仅提供标准页码条，不包含每页条数选择器和跳页输入框。

## 关系

子组件：无。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
