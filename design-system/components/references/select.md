# Select — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-select-nine-default-examples；视觉审阅：pending。

仅表单预设值选择；≤5项改用Radio/Checkbox，导航或临时动作走Dropdown。先单/多选，再搜索/区号/标记/分组；这些是同一Select配置。当前9个有限调用保留，不任意叠加未登记配置。列表默认下展，空间不足时避让，距视口20px；常规最大232px，双列428px。

必须加载：components/tokens.css、components/components.css、components/button-current.css、components/button-runtime-current.css、components/input-current.css、components/checkbox-current.css、components/select-current.css、components/select-current.js。

字体样式表：。

为每次装配生成唯一根id、trigger id、panel id和option id，aria-controls同步；复制示例时不能复用原id。运行脚本初始化缺失id，但不修复宿主已有重复id。

触发器aria-label由已选项与占位文案同步；搜索input保留可访问名称。

不可修改：根节点及变体类；data-select-mode与data-select-confirm；触发器/面板/搜索/页脚结构；组件CSS与select-current.js；当前42px触发器、图标及嵌套Checkbox/Tag/Button；single-basic可按已核auto原件填充宿主列宽；除options、已声明layout、placeholder/searchLabel与回调外的内容。

## single-basic

用：表单预设值单选，选项>5，无需选框或勾标记。

不用：需要持续显示单选框或勾选标记。

可修改：options、changeCallback、layout、placeholder。

```html
<div class="ds-select ds-select--single-basic" data-select-mode="single" data-ai-example="ai-select-single-basic" id="ai-select-single-basic" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-input-field__input ds-input-field__input--gray" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-single-basic-panel" id="ai-select-single-basic-trigger"><span class="ds-select__value" data-placeholder="Select">Select</span><img class="ds-select__arrow" src="../icons/icon-select-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" hidden="" id="ai-select-single-basic-panel" aria-labelledby="ai-select-single-basic-trigger">
              <div class="ds-select__list">
                <div class="ds-select__option" role="option" aria-selected="false" data-value="1" id="ai-select-single-basic-option-0"><span class="ds-select__option-label">1st item</span></div>
                <div class="ds-select__option" role="option" aria-selected="true" data-value="2" id="ai-select-single-basic-option-1"><span class="ds-select__option-label">2nd item</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" data-value="3" id="ai-select-single-basic-option-2"><span class="ds-select__option-label">3rd item</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" data-value="4" id="ai-select-single-basic-option-3"><span class="ds-select__option-label">4th item</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" data-value="5" id="ai-select-single-basic-option-4"><span class="ds-select__option-label">5th item</span></div>
              </div>
            </div>
          </div>
```

## single-radio

用：表单预设值单选，选项>5，以14px单选图标标识唯一选择。

不用：多选场景。

可修改：options、changeCallback、layout、placeholder。

```html
<div class="ds-select ds-select--single-radio" data-select-mode="single" data-ai-example="ai-select-single-radio" id="ai-select-single-radio" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-select__trigger--white ds-input-field__input ds-input-field__input--white" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-single-radio-panel" id="ai-select-single-radio-trigger"><span class="ds-select__value" data-placeholder="Select">Select</span><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" hidden="" id="ai-select-single-radio-panel" aria-labelledby="ai-select-single-radio-trigger">
              <div class="ds-select__list">
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-single-radio-option-0"><span class="ds-select__radio"></span><span class="ds-select__option-label">1st item</span></div>
                <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-single-radio-option-1"><span class="ds-select__radio"></span><span class="ds-select__option-label">2nd item</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-single-radio-option-2"><span class="ds-select__radio"></span><span class="ds-select__option-label">3rd item</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" aria-disabled="true" id="ai-select-single-radio-option-3"><span class="ds-select__radio"></span><span class="ds-select__option-label">Disabled item</span></div>
              </div>
            </div>
          </div>
```

## single-check

用：表单预设值单选，选项>5，以8px行尾勾标识唯一选择。

不用：需要展示未选控件边界。

可修改：options、changeCallback。

```html
<div class="ds-select ds-select--single-check" data-select-mode="single" data-ai-example="ai-select-single-check" id="ai-select-single-check" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-input-field__input ds-input-field__input--gray" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-single-check-panel" id="ai-select-single-check-trigger"><span class="ds-select__value" data-placeholder="Select">Select</span><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" hidden="" id="ai-select-single-check-panel" aria-labelledby="ai-select-single-check-trigger">
              <div class="ds-select__list">
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-single-check-option-0"><span class="ds-select__option-label">1st item</span><span class="ds-select__check"></span></div>
                <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-single-check-option-1"><span class="ds-select__option-label">2nd item</span><span class="ds-select__check"></span></div>
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-single-check-option-2"><span class="ds-select__option-label">3rd item</span><span class="ds-select__check"></span></div>
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-single-check-option-3"><span class="ds-select__option-label">4th item</span><span class="ds-select__check"></span></div>
              </div>
            </div>
          </div>
```

## multi-basic

用：表单预设值多选，选项>5，以行底色及标签回写状态。

不用：必须逐项显示复选框。

可修改：options、changeCallback。

```html
<div class="ds-select ds-select--multi-basic" data-select-mode="multiple" data-ai-example="ai-select-multi-basic" data-select-source-multi-down="gray" id="ai-select-multi-basic" data-input-current="" data-input-adapter="select-trigger">
            <div class="ds-select__control ds-input-field__input ds-input-field__input--gray">
              <div class="ds-select__tags" aria-label="Selected options"><button class="ds-select__tag" type="button"><span class="ds-select__tag-label">Item 1</span><span class="ds-select__tag-close" aria-hidden="true"></span></button></div>
              <span class="ds-select__value" data-placeholder="Select">Select</span>
              <button class="ds-select__clear" type="button" data-select-clear="" aria-label="Clear all selected options" hidden=""><img src="../icons/icon-close.svg" alt=""></button>
              <span class="ds-select__control-divider"></span>
              <button class="ds-select__trigger" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-multi-basic-panel" id="ai-select-multi-basic-trigger"><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            </div>
            <div class="ds-select__panel" role="listbox" aria-multiselectable="true" hidden="" id="ai-select-multi-basic-panel" aria-labelledby="ai-select-multi-basic-trigger"><div class="ds-select__list">
              <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-multi-basic-option-0"><span class="ds-select__option-label">Item 1</span></div>
              <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-multi-basic-option-1"><span class="ds-select__option-label">Item 2</span></div>
              <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-multi-basic-option-2"><span class="ds-select__option-label">Item 3</span></div>
              <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-multi-basic-option-3"><span class="ds-select__option-label">Item 4</span></div>
            </div></div>
          </div>
```

## multi-checkbox

用：表单预设值多选，选项>5，逐项显示复选框。

不用：唯一选择。

可修改：options、changeCallback、layout。

```html
<div class="ds-select ds-select--multi-checkbox" data-select-mode="multiple" data-ai-example="ai-select-multi-checkbox" id="ai-select-multi-checkbox" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-select__trigger--white ds-input-field__input ds-input-field__input--white" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-multi-checkbox-panel" id="ai-select-multi-checkbox-trigger"><span class="ds-select__value" data-placeholder="Select">Select</span><span class="ds-select__count" hidden=""></span><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" aria-multiselectable="true" hidden="" id="ai-select-multi-checkbox-panel" aria-labelledby="ai-select-multi-checkbox-trigger"><div class="ds-select__list">
              <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-multi-checkbox-option-0"><label class="ds-checkbox ds-checkbox--sm ds-checkbox--checked" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">1st item</span></label></div>
              <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-multi-checkbox-option-1"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">2nd item</span></label></div>
              <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-multi-checkbox-option-2"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">3rd item</span></label></div>
              <div class="ds-select__option" role="option" aria-selected="false" aria-disabled="true" id="ai-select-multi-checkbox-option-3"><label class="ds-checkbox ds-checkbox--sm ds-checkbox--disabled" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">Disabled item</span></label></div>
            </div></div>
          </div>
```

## phone-search

用：国家或地区区号搜索单选，候选>5。

不用：普通文本值。

可修改：options、changeCallback。

```html
<div class="ds-select ds-select--phone-search" data-select-mode="single" data-ai-example="ai-select-phone-search" id="ai-select-phone-search" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-select__trigger--white ds-input-field__input ds-input-field__input--white" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-phone-search-panel" id="ai-select-phone-search-trigger"><span class="ds-select__prefix">+</span><span class="ds-select__value" data-placeholder="1">1</span><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" hidden="" id="ai-select-phone-search-panel" aria-labelledby="ai-select-phone-search-trigger">
              <label class="ds-select__search"><input class="ds-select__search-input" type="search" aria-label="Search country or code" placeholder="Search country or code"><img class="ds-select__search-icon" src="../icons/icon-search.svg" alt=""></label>
              <div class="ds-select__list">
                <div class="ds-select__option" role="option" aria-selected="true" data-value="1" data-trigger-label="1" id="ai-select-phone-search-option-0"><span class="ds-select__option-label">+1 United States</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" data-value="44" data-trigger-label="44" id="ai-select-phone-search-option-1"><span class="ds-select__option-label">+44 United Kingdom</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" data-value="61" data-trigger-label="61" id="ai-select-phone-search-option-2"><span class="ds-select__option-label">+61 Australia</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" data-value="86" data-trigger-label="86" id="ai-select-phone-search-option-3"><span class="ds-select__option-label">+86 China</span></div>
              </div>
            </div>
          </div>
```

## search

用：预设值列表>5项，需要关键词过滤。

不用：短列表无需搜索。

可修改：options、changeCallback、placeholder、searchLabel。

```html
<div class="ds-select ds-select--search" data-select-mode="single" data-ai-example="ai-select-search" id="ai-select-search" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-select__trigger--compact ds-select__trigger--white ds-input-field__input ds-input-field__input--white" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-search-panel" id="ai-select-search-trigger"><img class="ds-select__search-icon" src="../icons/icon-search.svg" alt=""><span class="ds-select__value" data-placeholder="Select brand">Generic</span><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" hidden="" id="ai-select-search-panel" aria-labelledby="ai-select-search-trigger">
              <label class="ds-select__search ds-select__search--compact"><input class="ds-select__search-input" type="search" aria-label="Search brands" placeholder="Search"><img class="ds-select__search-icon" src="../icons/icon-search.svg" alt=""></label>
              <div class="ds-select__list">
                <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-search-option-0"><span class="ds-select__option-label">Generic</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-search-option-1"><span class="ds-select__option-label">Arista</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-search-option-2"><span class="ds-select__option-label">Brocade</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-search-option-3"><span class="ds-select__option-label">Juniper</span></div>
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-search-option-4"><span class="ds-select__option-label">Ubiquiti</span></div>
              </div>
            </div>
          </div>
```

## two-column

用：预设值多选>5项，需要分组双列展示；宽度按宿主。

不用：单列即可完整阅读。

可修改：options、changeCallback。

```html
<div class="ds-select ds-select--two-column" data-select-mode="multiple" data-ai-example="ai-select-two-column" id="ai-select-two-column" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-select__trigger--filter ds-input-field__input ds-input-field__input--gray" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-two-column-panel" id="ai-select-two-column-trigger"><img class="ds-select__filter-icon" src="../icons/icon-filter.svg" alt=""><span class="ds-select__value" data-placeholder="More Filters">More Filters</span><span class="ds-select__count" hidden=""></span><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" aria-multiselectable="true" hidden="" id="ai-select-two-column-panel" aria-labelledby="ai-select-two-column-trigger">
              <div class="ds-select__list">
                <div class="ds-select__group"><div class="ds-select__group-title">Management</div><div class="ds-select__columns">
                  <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-two-column-option-0"><label class="ds-checkbox ds-checkbox--sm ds-checkbox--checked" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">1st item</span></label></div>
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-two-column-option-1"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">2nd item</span></label></div>
                </div></div><div class="ds-select__divider"></div>
                <div class="ds-select__group"><div class="ds-select__group-title">Concurrent Clients</div><div class="ds-select__columns">
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-two-column-option-2"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">1st item</span></label></div>
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-two-column-option-3"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">2nd item</span></label></div>
                </div></div><div class="ds-select__divider"></div>
                <div class="ds-select__group"><div class="ds-select__group-title">Wi-Fi Bands</div><div class="ds-select__columns">
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-two-column-option-4"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">2.4 GHz</span></label></div>
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-two-column-option-5"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">5 GHz</span></label></div>
                </div></div><div class="ds-select__divider"></div>
                <div class="ds-select__group"><div class="ds-select__group-title">Ethernet Ports</div><div class="ds-select__columns">
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-two-column-option-6"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">8 ports</span></label></div>
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-two-column-option-7"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">24 ports</span></label></div>
                </div></div>
              </div>
            </div>
          </div>
```

## grouped-combination

用：预设值多选>5项，需要分组及Cancel/OK确认；宽度按宿主。

不用：选择后立即提交。

可修改：options、changeCallback。

```html
<div class="ds-select ds-select--grouped-combination" data-select-mode="multiple" data-select-confirm="" data-ai-example="ai-select-grouped-combination" id="ai-select-grouped-combination" data-input-current="" data-input-adapter="select-trigger">
            <button class="ds-select__trigger ds-select__trigger--white ds-input-field__input ds-input-field__input--white" type="button" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="ai-select-grouped-combination-panel" id="ai-select-grouped-combination-trigger"><span class="ds-select__value" data-placeholder="Select">Select</span><span class="ds-select__count" hidden=""></span><img class="ds-select__arrow" src="../icons/icon-chevron-down.svg" alt=""></button>
            <div class="ds-select__panel" role="listbox" aria-multiselectable="true" hidden="" id="ai-select-grouped-combination-panel" aria-labelledby="ai-select-grouped-combination-trigger">
              <div class="ds-select__list">
                <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-grouped-combination-option-0"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">All Teams</span></label></div>
                <div class="ds-select__divider"></div>
                <div class="ds-select__group"><div class="ds-select__group-title">Management <img src="../icons/icon-chevron-down.svg" alt=""></div>
                  <div class="ds-select__option" role="option" aria-selected="true" id="ai-select-grouped-combination-option-1"><label class="ds-checkbox ds-checkbox--sm ds-checkbox--checked" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">1st item</span></label></div>
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-grouped-combination-option-2"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">2nd item</span></label></div>
                </div><div class="ds-select__divider"></div>
                <div class="ds-select__group"><div class="ds-select__group-title">Concurrent Clients <img src="../icons/icon-chevron-down.svg" alt=""></div>
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-grouped-combination-option-3"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">1st item</span></label></div>
                </div><div class="ds-select__divider"></div>
                <div class="ds-select__group"><div class="ds-select__group-title">Wi-Fi Bands <img src="../icons/icon-chevron-down.svg" alt=""></div>
                  <div class="ds-select__option" role="option" aria-selected="false" id="ai-select-grouped-combination-option-4"><label class="ds-checkbox ds-checkbox--sm" data-checkbox-current><span class="ds-checkbox__box"></span><span class="ds-checkbox__label ds-select__option-label">1st item</span></label></div>
                </div>
              </div>
              <div class="ds-select__footer">
                <button class="ds-btn ds-btn--outline-gray ds-btn--xl" type="button" data-select-cancel=""><span class="ds-btn__text">Cancel</span></button>
                <button class="ds-btn ds-btn--outline-black ds-btn--xl" type="button" data-select-close=""><span class="ds-btn__text">OK</span></button>
              </div>
            </div>
          </div>
```

## 行为

- selection：单选立即回写并收起；多选逐项回写。ds:select-change包含multiple、values、labels，空字符串是合法值。
- confirmation：data-select-confirm多选面板先编辑草稿，OK提交，Cancel/Escape/离开焦点回滚；关闭态全部清除立即提交。
- keyboard：方向键导航、Escape收起、Tab离开、搜索过滤遵循现有脚本；禁用fieldset与触发器均阻止操作。
- initialization：Complete newly inserted roots initialize once through the existing observer. Assemble option lists before first initialization; replacing/inserting individual options in an initialized list is not an API guarantee. No native form-value binding or persistence.
- values：原始默认示例部分选项没有data-value，现有脚本回退到标签文字；宿主需在提交前按业务约束核对值、重复值和字段映射，组件不生成业务编码。
- nativeStateGuard：One document/root initialization guard. Native disabled/fieldset, hidden or ARIA-disabled ancestors block synthetic choose/search/commit. Hidden or disabled owner closes the panel and silently rolls back pending confirmation. Closed panel options and composing keys cannot select. Dynamic inserted groups initialize once; no native form-value binding or persistence added.
- composition：Track active search composition per owning root. Intermediate input does not filter, and unflagged navigation/Escape keys do not move focus, close or select during composition. End filters the committed query when open/available; closing clears transient composition state while preserving the query. Native browser IME remains pending.
- footerButtonAtom：当前组合分组面板使用outline-gray/xl与outline-black/xl；宿主只负责确认/取消事件和双列装配，不覆盖原子字号、圆角、padding或状态样式。已保存typed实例42px/24px是尺寸依据。
- checkboxAtom：Checkbox(sm)受控标记适配：省略独立input与data-checkbox-control，保留label.ds-checkbox、box和文字；宿主文本钩子只负责查找与截断。宿主管理role=option、选择与checked/disabled类同步，原子拥有尺寸和状态样式。独立Checkbox原生升级不自动给选项添加input；实际浏览器证据待验证。
- hostWidth：Existing single-basic gray source021318 has auto cross sizing; data-select-layout=fill allocates the real root to its host column. Trigger height42, radius, arrow, panel and states remain component-owned. Other variants keep their current sizes.
- viewport：Default down; prefer above when below space is insufficient. Recalculate while open on resize/scroll; preserve20px viewport clearance,232px regular and428px grouped cap.
- inputFace：Nine admitted trigger faces reuse Input paint/state through data-input-adapter. Native button triggers and multi-value control keep their own selection/actions and layout; no editable text field is inserted.
- placeholder：single-basic/search 可传非空纯文本 placeholder；只修改空值提示，不设置默认选项或业务值。search 可传非空 searchLabel，修改搜索输入的可访问名称。未传参保留原规范示例，旧版本不自动开放。

## 关系

子组件：checkbox、button、input。

已登记父组件：form、option-selector。

图标：components/icons/icon-chevron-down.svg、components/icons/icon-search.svg、components/icons/icon-close.svg、components/icons/icon-radio-default-14.svg、components/icons/icon-radio-hover-14.svg、components/icons/icon-radio-checked-14.svg、components/icons/icon-radio-disabled-14.svg、components/icons/icon-check-8.svg、components/icons/icon-filter.svg、components/icons/icon-select-down.svg、components/icons/icon-select-down-disabled.svg、components/icons/icon-select-up.svg、components/icons/icon-select-remove.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
