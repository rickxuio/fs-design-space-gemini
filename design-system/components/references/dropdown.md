# Dropdown — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：historical-choice-and-source-pc-command-menus；视觉审阅：pending。

新页面只选command-text、command-dot、account-guest、account-signed-in命令菜单；按实际入口与账户状态选择，placement只用各自来源枚举。basic等旧选择型保留兼容但不推荐；值选择用Select。命令通过可取消ds:dropdown-action交给宿主，不执行认证、删除或远程业务。

必须加载：components/tokens.css、components/components.css、components/button-current.css、components/button-runtime-current.css、components/checkbox-current.css、components/icon-button-current.css、components/dropdown-current.css、components/dropdown-command-current.css、components/dropdown-current.js、components/dropdown-command-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Opt-in closed native trigger + unique paired hidden panel/listbox/native options. Search shapes preserve native labeled field, registered search icon and exact variant marker; brand adds 30px trigger/bordered-search. Keyboard behavior is local implementation upgrade, not original MG source proof.



不可修改：Real native trigger, listbox and option hierarchy；Closed authored state and unique panel identity；Current own reset/runtime resources；Existing shared FS colors/spacing/42px trigger。

## basic

用：历史选择型基础示例的归档对照。

不用：新页面选择需求或动作菜单。

可修改：placeholder、options、panelIdentity、changeCallback。

```html
<div class="ds-dropdown" data-dropdown-current="" data-ai-example="ai-dropdown-basic-current" data-value=""><button class="ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="dropdown-basic-current-panel"><span class="ds-dropdown__trigger-text">Select</span><img class="ds-dropdown__trigger-arrow" src="../icons/icon-chevron-down.svg" alt=""></button><div class="ds-dropdown__panel" id="dropdown-basic-current-panel" hidden=""><div class="ds-dropdown__list" role="listbox" aria-label="Available choices"><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-1">1st item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-2">2nd item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-3">3rd item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-4">4th item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-5">5th item</button></div></div></div>
```

## with-search

用：历史搜索选择示例的归档对照。

不用：新页搜索选择或命令菜单。

可修改：placeholder、options、panelIdentity、changeCallback。

```html
<div class="ds-dropdown" data-dropdown-current="" data-ai-example="ai-dropdown-with-search-current" data-value="" data-dropdown-kind="search"><button class="ds-dropdown__trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="dropdown-with-search-current-panel"><span class="ds-dropdown__trigger-text">Select</span><img class="ds-dropdown__trigger-arrow" src="../icons/icon-chevron-down.svg" alt=""></button><div class="ds-dropdown__panel" id="dropdown-with-search-current-panel" hidden=""><div class="ds-dropdown__search"><input type="text" placeholder="Search" aria-label="Search choices" autocomplete="off"><img class="ds-dropdown__search-icon" src="../icons/icon-search.svg" alt=""></div><div class="ds-dropdown__list" role="listbox" aria-label="Available choices"><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-1">1st item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-2">2nd item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-3">3rd item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-4">4th item</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="item-5">5th item</button></div></div></div>
```

## brand-select

用：历史品牌选择示例的归档对照。

不用：国家、地区等字段沿用品牌文案。

可修改：placeholder、options、panelIdentity、changeCallback。

```html
<div class="ds-dropdown" data-dropdown-current="" data-ai-example="ai-dropdown-brand-select-current" data-value="" data-dropdown-kind="brand"><button class="ds-dropdown__trigger ds-dropdown__trigger--sm" type="button" aria-haspopup="listbox" aria-expanded="false" aria-controls="dropdown-brand-select-current-panel"><span class="ds-dropdown__trigger-text">Select brand</span><img class="ds-dropdown__trigger-arrow" src="../icons/icon-chevron-down.svg" alt=""></button><div class="ds-dropdown__panel" id="dropdown-brand-select-current-panel" hidden=""><div class="ds-dropdown__search ds-dropdown__search--bordered"><input type="text" placeholder="Search" aria-label="Search choices" autocomplete="off"><img class="ds-dropdown__search-icon" src="../icons/icon-search.svg" alt=""></div><div class="ds-dropdown__list" role="listbox" aria-label="Available choices"><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="brand-1">Generic</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="brand-2">Arista</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="brand-3">Brocade</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="brand-4">Cisco</button><button class="ds-dropdown__item" type="button" role="option" aria-selected="false" tabindex="-1" value="brand-5">Juniper</button></div></div></div>
```

## command-text

用：用文本入口收纳排序、导出等操作命令。

不用：国家/产品等值选择、任意表单或图文浮层；不推断嵌套级联或其他业务。

可修改：items、panelIdentity、placement、trigger、actionCallback、triggerLabel。

```html
<div class="ds-dropdown-command" data-dropdown-command="command-text" data-dropdown-trigger="click" data-dropdown-placement="bottom" data-ai-example="ai-dropdown-command-text"><button type="button" class="ds-dropdown-command__text-trigger" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-command-text-panel"><span class="ds-dropdown-command__trigger-label">Order</span><img class="ds-dropdown-command__arrow" src="../icons/icon-chevron-down.svg" alt=""></button><div class="ds-dropdown-command__panel" id="dropdown-command-text-panel" hidden><div class="ds-dropdown-command__menu" role="menu" aria-label="文本操作命令"><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="title"><span class="ds-dropdown-command__label">Title</span></button><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="ascending"><span class="ds-dropdown-command__label">Sort Ascending</span></button><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="descending"><span class="ds-dropdown-command__label">Sort Descending</span></button></div></div></div>
```

## command-dot

用：更多操作收纳，以图标触发命令列表。

不用：国家/产品等值选择、任意表单或图文浮层；不推断嵌套级联或其他业务。

可修改：items、panelIdentity、placement、trigger、actionCallback。

```html
<div class="ds-dropdown-command" data-dropdown-command="command-dot" data-dropdown-trigger="click" data-dropdown-placement="br" data-ai-example="ai-dropdown-command-dot"><button type="button" class="ds-icon-btn ds-icon-btn--plain ds-icon-btn--m" aria-label="More actions" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-command-dot-panel"><img class="ds-icon-btn__icon" src="../icons/icon-more.svg" alt=""></button><div class="ds-dropdown-command__panel" id="dropdown-command-dot-panel" hidden><div class="ds-dropdown-command__menu" role="menu" aria-label="Dot图标操作命令"><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="email"><img class="ds-dropdown-command__item-icon" src="../icons/mastergo-library/通用Icon/69258-122904.svg" alt=""><span class="ds-dropdown-command__label">Email this transcript</span></button><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="history"><img class="ds-dropdown-command__item-icon" src="../icons/mastergo-library/通用Icon/69258-122790.svg" alt=""><span class="ds-dropdown-command__label">View past conversations</span></button></div></div></div>
```

## account-guest

用：未登录账户入口的登录/注册命令。

不用：国家/产品等值选择、任意表单或图文浮层；不推断嵌套级联或其他业务。

可修改：items、panelIdentity、placement、trigger、actionCallback。

```html
<div class="ds-dropdown-command" data-dropdown-command="account-guest" data-dropdown-trigger="click" data-dropdown-placement="br" data-ai-example="ai-dropdown-account-guest"><button type="button" class="ds-dropdown-command__account-trigger" aria-label="Account menu" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-account-guest-panel"><img src="../icons/icon-account.svg" alt=""></button><div class="ds-dropdown-command__panel" id="dropdown-account-guest-panel" hidden><div class="ds-dropdown-command__menu ds-dropdown-command__menu--account" role="menu" aria-label="账户未登录命令"><div class="ds-dropdown-command__guest-actions"><button type="button" class="ds-btn ds-btn--filled-red ds-btn--l" role="menuitem" tabindex="-1" value="sign-in"><span class="ds-btn__text">Sign in</span></button><button type="button" class="ds-btn ds-btn--filled-gray ds-btn--l" role="menuitem" tabindex="-1" value="sign-up"><span class="ds-btn__text">Sign up</span></button></div></div></div></div>
```

## account-signed-in

用：已登录账户入口的账户、订单与退出命令。

不用：国家/产品等值选择、任意表单或图文浮层；不推断嵌套级联或其他业务。

可修改：items、panelIdentity、placement、trigger、actionCallback、greeting。

```html
<div class="ds-dropdown-command" data-dropdown-command="account-signed-in" data-dropdown-trigger="click" data-dropdown-placement="br" data-ai-example="ai-dropdown-account-signed-in"><button type="button" class="ds-dropdown-command__account-trigger" aria-label="Account menu" aria-haspopup="menu" aria-expanded="false" aria-controls="dropdown-account-signed-in-panel"><img src="../icons/icon-account.svg" alt=""></button><div class="ds-dropdown-command__panel" id="dropdown-account-signed-in-panel" hidden><div class="ds-dropdown-command__menu ds-dropdown-command__menu--account" role="menu" aria-label="账户已登录命令"><p class="ds-dropdown-command__greeting">Hi, Alen</p><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="my-account"><span class="ds-dropdown-command__label">My Account</span></button><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="orders"><span class="ds-dropdown-command__label">Orders</span></button><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="quotes"><span class="ds-dropdown-command__label">Quotes</span></button><button type="button" class="ds-dropdown-command__item" role="menuitem" tabindex="-1" value="sign-out"><span class="ds-dropdown-command__label">Sign out</span></button></div></div></div>
```

## 行为

- events：ds:dropdown-change only for changed selected value, detail={value,label}. Filtering emits no value-change event and preserves selected value. No request/submission.
- keyboard：Native trigger Enter/Space click; arrows open/move and skip disabled, Home/End, Escape closes and returns focus, Tab/outside/focusout close.
- initialization：One document guard and one root guard. Options cannot be replaced after initialization; a page-owned bridge is needed for FormData.
- search：Search/brand opens to search input; ArrowDown/Up move to first/last visible enabled option, Enter selects first match (prevents implicit form submit), Escape/Tab/outside close. No matches leaves choices empty and search focused. Filter persists on close; reset restores empty query/unselected placeholder.
- disabled：Native disabled/fieldset guard ignores selection/search synthetic events and closes an open panel when disabled. No dynamic option insertion or remote filtering.
- composition：Track search compositionstart/end as well as event.isComposing; while active, intermediate input and trigger/option/search keys do not filter or select. compositionend filters the committed query only when search is available. Closing clears transient composition state while preserving query/selection; reset restores initial empty values. Actual browser IME behavior remains pending.
- availability：Native fieldset, ARIA-disabled or hidden host closes panel and rejects synthetic trigger/selection; selected value and query are retained. Disabled options do not enter the keyboard queue.
- commands：Hover/click, outside/Escape/Tab dismissal, keyboard navigation and viewport-safe placement; pointer can reach menu without losing hover. Intent event does not change trigger copy.

## 关系

子组件：button、checkbox、icon-button、button。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-chevron-down.svg、components/icons/icon-search.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
