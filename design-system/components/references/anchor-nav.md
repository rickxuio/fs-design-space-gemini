# AnchorNav — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-multitab-anchor-nav-selection-and-red-cta；视觉审阅：pending。

横向同页章节导航；保留实际div tabs、一个激活项及现有Button子组件（红色XL Regular，42px/左右24px）。组件只维护激活态，章节目标、滚动定位和sticky偏移由原页面宿主实现。MG的纵向、溢出菜单、自动居中和M端原件仍为参考，不冒充接口已实现；不代替Tab面板或跨页Navigation。

必须加载：components/tokens.css、components/components.css、components/button-current.css、components/button-runtime-current.css、components/anchor-nav-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用Open Sans；实际字体与浏览器定位待验。

保留data-anchor-group和各tab数据标记；默认只有一个激活项。不要复制运行后data-anchor-nav-ready。组件自身不要求额外ID；页面锚点由本地页面映射管理。

tabs仅替换文字与已登记目标数据，保留div；CTA只替换其文字并通过真实button绑定click。

不可修改：根/inner/tabs/action结构；div tab及激活底边线；红色Button/xl-regular真实结构与安全type；sticky及共享CSS；运行选择逻辑与页面滚动边界。

## anchor-nav

用：同一长页多个真实章节，需要横向章节入口及现有单CTA。

不用：切换内容面板、跳去其他页面、纵向导航或溢出菜单。当前接口也不支持移除CTA。

可修改：tabs、actionLabel、actionCallback。

```html
<div class="ds-anchor-nav" data-anchor-group data-anchor-current data-fragment="anchor-nav" data-ai-example="ai-anchor-nav">
      <div class="ds-anchor-nav__inner">
        <div class="ds-anchor-nav__tabs">
          <div class="ds-anchor-nav__tab ds-anchor-nav__tab--active" data-anchor-tab>Option</div>
          <div class="ds-anchor-nav__tab" data-anchor-tab>Option</div>
          <div class="ds-anchor-nav__tab" data-anchor-tab>Option</div>
        </div>
        <div class="ds-anchor-nav__action">
          <button class="ds-btn ds-btn--filled-red ds-btn--xl-regular" type="button"><span class="ds-btn__text">Button Name</span></button>
        </div>
      </div>
    </div>
```

## 行为

- selection：marker-only运行脚本在本group切换唯一激活类；隐藏或ARIA禁用不切换。页面按根目录本地流程协调章节滚动，CTA事件单独处理。
- initialization：首次加载或DOMContentLoaded初始化，防止重复绑定；不提供动态插入扫描API。
- scroll：页面有明确章节目标时，由本地页面JS建立目标与选中/滚动对应；组件不自行生成目标或页面流程。
- action：CTA为Button/filled-red/xl-regular，type=button避免宿主form意外提交；actionCallback只绑定CTA自身click，不绑定所有tab点击。
- keyboard：原Preview tab为div，没有键盘tab控件实现；本批不声称已验证完整键盘语义。

## 关系

子组件：button。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
