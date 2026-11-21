# MenuNavigation — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-native-button-menu-four-exact-width-shapes；视觉审阅：pending。

PC single250、multi288和search250可调用；Search真实引用42px Input私有部件与IconButton。父项单一展开、叶子唯一选中、查询只发事件；不自动路由、过滤或开放移动。public-header240仍参考，不能替换固定Navigation/header。 Current five-variant closure 20261115: only supported exact source examples and publication decisions permit local calls. Earlier preview-only or placeholder descriptions are historical; PC geometry and host boundaries remain explicit.

必须加载：components/tokens.css、components/components.css、components/menu-navigation-current.css、components/icon-button-current.css、components/input-search-current.css、components/menu-navigation-current.js、components/input-search-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。Open Sans stack; actual browser native keyboard and visual proof pending.

Root nav/data-menu-navigation, safe native buttons with distinct data-values, globally unique panel IDs paired with aria-controls. At most one parent open and one visible selected leaf. Regenerate panel IDs for copies; never copy data-menu-navigation-ready or runtime tabindex.

menuContent edits actual labels/value identities, optional title, search placeholder/name and paired panel IDs while retaining required structure and valid state. Product icons stay registered and matched to product values.

不可修改：Exact root width/surface and native button structure；Two-level maximum and unique values/panel identities；Parent chevron and public product icons；Current opt-in runtime and actual custom events；No real navigation or implicit filtering。

## single-level

用：PC250px侧栏只有同级叶子入口。

不用：需要子层级、288px精确调用或页面滚动。

可修改：menuContent、changeCallback。

```html
<nav class="ds-menu-navigation ds-menu-navigation--single-level ds-menu-navigation--width-250" data-menu-navigation-current="menu-atom" data-menu-navigation="" data-ai-example="ai-menu-single-level" aria-label="Compact single-level product menu">
          <ul class="ds-menu-navigation__list">
            <li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="fiber-optic-cables" aria-pressed="true"><span class="ds-menu-navigation__item-label">Fiber Optic Cables</span></button></li>
            <li><button class="ds-menu-navigation__item" type="button" data-value="panels-enclosures-racks"><span class="ds-menu-navigation__item-label">Panels, Enclosures &amp; Racks</span></button></li>
            <li><button class="ds-menu-navigation__item" type="button" data-value="testers-tools"><span class="ds-menu-navigation__item-label">Testers &amp; Tools</span></button></li>
          </ul>
        </nav>
```

## multi-level

用：PC288px侧栏有一级父项和二级叶子。

不用：三级层级、250px调用或自动过滤。

可修改：menuContent、changeCallback、toggleCallback。

```html
<nav class="ds-menu-navigation ds-menu-navigation--multi-level ds-menu-navigation--width-288" data-menu-navigation-current="menu-atom" data-menu-navigation="" data-ai-example="ai-menu-multi-level" aria-label="Multi-level product menu">
        <div class="ds-menu-navigation__title">Products</div>
        <ul class="ds-menu-navigation__list">
          <li>
            <button class="ds-menu-navigation__item" type="button" data-value="networking" aria-expanded="true" aria-controls="menu-networking-panel">
              <span class="ds-menu-navigation__item-label">Networking</span>
              <img class="ds-menu-navigation__chevron" src="../icons/icon-chevron-down.svg" alt="">
            </button>
            <ul class="ds-menu-navigation__panel" id="menu-networking-panel">
              <li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="optical-networking" aria-pressed="true"><span class="ds-menu-navigation__item-label">Optical Networking</span></button></li>
              <li><button class="ds-menu-navigation__item" type="button" data-value="copper-systems"><span class="ds-menu-navigation__item-label">Copper Systems</span></button></li>
            </ul>
          </li>
          <li>
            <button class="ds-menu-navigation__item" type="button" data-value="tools" aria-expanded="false" aria-controls="menu-tools-panel">
              <span class="ds-menu-navigation__item-label">Testers &amp; Tools</span>
              <img class="ds-menu-navigation__chevron" src="../icons/icon-chevron-down.svg" alt="">
            </button>
            <ul class="ds-menu-navigation__panel" id="menu-tools-panel" hidden="">
              <li><button class="ds-menu-navigation__item" type="button" data-value="switches"><span class="ds-menu-navigation__item-label">Switches</span></button></li>
            </ul>
          </li>
        </ul>
      </nav>
```

## multi-level-search

用：250px PC二级菜单，配真实42px搜索部件，向宿主发出查询意图。

不用：自动生成搜索结果、未接业务的数据过滤、三级导航或移动端。

可修改：menuContent、changeCallback、toggleCallback、searchCallback。

```html
<nav class="ds-menu-navigation ds-menu-navigation--multi-level-search ds-menu-navigation--width-250" data-menu-navigation-current="menu-atom" data-menu-navigation="" data-ai-example="ai-menu-multi-level-search" aria-label="Searchable multi-level product menu">
        
        <div class="ds-menu-navigation__search"><form class="ds-input-search" data-input-part="menu-search42" data-input-search-surface="white" role="search"><input class="ds-input-search__field" type="search" placeholder="Search all Case Studies" aria-label="Search"><button class="ds-icon-btn ds-icon-btn--plain ds-icon-btn--m" type="button" aria-label="Search"><img class="ds-icon-btn__icon" src="../icons/icon-button-search-m-default.svg" alt=""></button></form></div>
        <ul class="ds-menu-navigation__list">
          <li>
            <button class="ds-menu-navigation__item" type="button" data-value="optical-transceivers" aria-expanded="true" aria-controls="menu-optical-panel">
              <span class="ds-menu-navigation__item-label">Optical Transceivers</span>
              <img class="ds-menu-navigation__chevron" src="../icons/icon-chevron-down.svg" alt="">
            </button>
            <ul class="ds-menu-navigation__panel" id="menu-optical-panel">
              <li><button class="ds-menu-navigation__item" type="button" data-value="fiber-optic-cables"><span class="ds-menu-navigation__item-label">Fiber Optic Cables</span></button></li>
              <li><button class="ds-menu-navigation__item" type="button" data-value="panels-enclosures-racks"><span class="ds-menu-navigation__item-label">Panels, Enclosures &amp; Racks</span></button></li>
            </ul>
          </li>
          <li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="copper-systems" aria-pressed="true"><span class="ds-menu-navigation__item-label">Copper Systems</span></button></li>
        </ul>
      </nav>
```

## public-header

用：固定英文Header中All Products的240px产品菜单子组件维护与调用。

不用：普通页面侧栏、整个多栏MegaMenu或替换固定Header。

可修改：menuContent、changeCallback。

```html
<nav class="ds-menu-navigation ds-menu-navigation--public-header" data-menu-navigation="" data-ai-example="ai-menu-public-header" aria-label="Public header product menu">
        <ul class="ds-menu-navigation__list">
          <li><button class="ds-menu-navigation__item ds-menu-navigation__item--selected" type="button" data-value="switches" aria-pressed="true"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-switches.svg" alt=""><span class="ds-menu-navigation__item-label">Switches</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="networking"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-networking.svg" alt=""><span class="ds-menu-navigation__item-label">Networking</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="optical-transceivers"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-optical-transceivers.svg" alt=""><span class="ds-menu-navigation__item-label">Optical Transceivers</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="fiber-optic-cables"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-fiber-optic-cables.svg" alt=""><span class="ds-menu-navigation__item-label">Fiber Optic Cables</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="panels-enclosures-racks"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-panels-enclosures-racks.svg" alt=""><span class="ds-menu-navigation__item-label">Panels, Enclosures &amp; Racks</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="optical-networking"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-optical-networking.svg" alt=""><span class="ds-menu-navigation__item-label">Optical Networking</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="copper-systems"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-copper-systems.svg" alt=""><span class="ds-menu-navigation__item-label">Copper Systems</span></button></li>
          <li><button class="ds-menu-navigation__item" type="button" data-value="testers-tools"><img class="ds-menu-navigation__product-icon" src="../icons/icon-menu-testers-tools.svg" alt=""><span class="ds-menu-navigation__item-label">Testers &amp; Tools</span></button></li>
        </ul>
      </nav>
```

## 行为

- initialization：FSMenuNavigation.initialize/initializeAll are actual APIs for authored dynamically inserted menus; data-menu-navigation-ready guards repeats. Do not copy initialized DOM.
- selection：Leaf selection is unique per root; change detail=value/label. Parent toggles single-open panels and emits toggle detail=expanded/value/label.
- focusCorrection：Current opt-in runtime moves the tab stop to an activated parent, including after closing selected descendants. Initial focus only chooses visible items. Legacy runtime is unchanged for historical pages.
- keyboard：ArrowUp/Down wrap through visible panel items; Home/End first/last; Escape closes current panel and focuses parent. Enter/Space rely on native button activation; actual browser validation pending.
- search：Search input emits query only; no internal filtering, highlight or auto-expand. Host hidden-li filtering is outside current keyboard visibility logic.
- business：Buttons are local controls. Host listens to events; component does not open links, submit forms or call APIs.
- publicHeader：Source240px product menu is now actually embedded in the fixed English Navigation/header; original leaf events and keyboard behavior retained. Not an arbitrary sidebar/MegaMenu.
- nativeStateGuard：Native disabled items and fieldsets block synthetic click/keyboard/search; roving focus skips disabled items and restores one enabled tab stop. Existing selected/open state preserved, no new business filtering.
- composition：Search composition intermediate input emits no query callback. A changed committed query emits once on compositionend; its identical following input is suppressed once. Ordinary input callbacks remain; unavailable completion emits nothing. No filtering, request or business submission; actual browser IME/event ordering pending.
- atomStates：Current ordinary menu atoms: Hover leaf red text-width indicator; parent Hover/Press has no selection indicator. Actual atom white states retained where norm gray conflicts. Public-header source pending.
- searchSourceBoundary：PC250px搜索菜单现引用Input/menu-search42私有部件与真实IconButton；input/composition继续原查询语义，Enter/搜索按钮补发submitted查询意图。原独立搜索框旧来源、业务过滤及M端范围分开，不混作本次准入。

## 关系

子组件：input、icon-button。

已登记父组件：card、navigation。

图标：components/icons/icon-search.svg、components/icons/icon-chevron-down.svg、components/icons/icon-menu-switches.svg、components/icons/icon-menu-networking.svg、components/icons/icon-menu-optical-transceivers.svg、components/icons/icon-menu-fiber-optic-cables.svg、components/icons/icon-menu-panels-enclosures-racks.svg、components/icons/icon-menu-optical-networking.svg、components/icons/icon-menu-copper-systems.svg、components/icons/icon-menu-testers-tools.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
