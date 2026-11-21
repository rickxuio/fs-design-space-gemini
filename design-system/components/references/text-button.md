# TextButton — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：mg-original-navigation-ten-sizes-arrow-visibility；视觉审阅：pending。

按本地工作流选择具体变体并核对真实宿主。当前7个独立调用只开放各自默认尺寸、label/href/arrowHidden；规范中另3个尺寸原例不等于本地已支持size参数。保留原官方箭头和显示开关；不开放Disabled、左图标、任意图标或折叠/业务动作。

必须加载：components/tokens.css、components/components.css、components/text-button-current.css。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用 Token 的系统字体回退，精确视觉需确认字体加载。

取同变体/尺寸完整真实示例；href按本地页面来源与模块映射绑定；arrowHidden仅控制已有img的hidden布尔属性，禁止删节点、换src或自写样式。

label 对应唯一文字节点；普通正文/数据链接不可强套组件。

不可修改：根类、颜色/尺寸类、文字节点；右箭头img结构及官方src、12px图标与2px间距；仅arrowHidden可控制原有箭头显隐；组件样式与宿主限制。

## inline-blue

用：来源需要12px蓝色紧凑导航，如表单隐私政策链接；当前仅处理导航目标

不用：不作为13/14px正文链接，也不代替复选框、折叠或业务动作触发器

可修改：label、href、arrowHidden。

默认尺寸：s；可选尺寸：s。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<a id="icon-usage-icon-arrow-right" class="ds-text-btn ds-text-btn--inline ds-text-btn--blue ds-text-btn--s" href="#" style="scroll-margin-top: 40px;" data-ai-example="ai-text-button-inline-blue-s">
          <span class="ds-text-btn__text">了解更多</span>
          <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-blue-s.svg" alt="">
        </a>
```

## inline-gray

用：来源为12px灰色次要导航，如公共导航或详情页评论入口

不用：明确需要蓝色、深色反白或带容器时不用本变体

可修改：label、href、arrowHidden。

默认尺寸：s；可选尺寸：s。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<a class="ds-text-btn ds-text-btn--inline ds-text-btn--gray ds-text-btn--s" href="#" data-ai-example="ai-text-button-inline-gray-s"><span class="ds-text-btn__text">了解更多</span><img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-gray-s-default.svg" alt=""></a>
```

## inline-black

用：来源与宿主需要13px常规黑色文字导航，如已登记卡片、表格或详情入口

不用：宿主明确需要蓝色、白色或14px加粗时，改按对应变体；不要仅凭“链接”默认黑色

可修改：label、href、arrowHidden。

默认尺寸：m；可选尺寸：m、l。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#" data-ai-example="ai-text-button-inline-black-m">
          <span class="ds-text-btn__text">了解更多</span>
          <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt="">
        </a>
```

## inline-black-bold

用：来源明确为14px加粗文字入口，如首页特定卡片中的Get more Information、FS Certified

不用：无加粗依据的普通链接，不凭“更重要”擅自加粗

可修改：label、href、arrowHidden。

默认尺寸：l；可选尺寸：l。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" href="#" data-ai-example="ai-text-button-inline-black-bold-l">
          <span class="ds-text-btn__text">了解更多</span>
          <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-bold.svg" alt="">
        </a>
```

## inline-blue-link

用：来源明确为13px蓝色导航，如详情、加购对话框、表格或外围页

不用：宿主明确使用黑色子组件、或来源指定12/14px时，不套用当前13px默认调用

可修改：label、href、arrowHidden。

默认尺寸：m；可选尺寸：m、l。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<a class="ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m" href="#" data-ai-example="ai-text-button-inline-blue-link-m">
          <span class="ds-text-btn__text">了解更多</span>
          <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-blue-s.svg" alt="">
        </a>
```

## inline-white

用：深色背景上的14px白色导航，如有明确来源的专题页Banner入口

不用：浅色背景不使用白色；不据此增加第二个Banner入口

可修改：label、href、arrowHidden。

默认尺寸：l；可选尺寸：l。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<a class="ds-text-btn ds-text-btn--inline ds-text-btn--white ds-text-btn--l" href="#" data-ai-example="ai-text-button-inline-white-l">
              <span class="ds-text-btn__text">了解更多</span>
              <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-white-l.svg" alt="">
            </a>
```

## with-bg-default

用：来源需要12px、32px高的带容器文字入口，如社区场景中的导航动作

不用：正文行内链接不套用容器；不据此开放14px/36px或业务操作

可修改：label、href、arrowHidden。

默认尺寸：s-bg；可选尺寸：s-bg、l-bg。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<a class="ds-text-btn ds-text-btn--with-bg ds-text-btn--s-bg" href="#" data-ai-example="ai-text-button-with-bg-default-s-bg">
          <span class="ds-text-btn__text">了解更多</span>
          <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-gray-s-default.svg" alt="">
        </a>
```

## 行为

- navigation：href 来自页面事实，预览 # 不得成为新页面目标。
- displayOnly：仅展示的外部入口在页面装配层取消导航并声明禁用，不伪造跳转。
- hover：Inline 显示下划线，带背景变体文字变深并出现灰色背景。
- parent：当前宿主遵循原子优先，不覆盖颜色、字号或状态。Footer历史gray-3覆盖只作为旧实现记录，未开放为当前TextButton精确调用；白字仍限符合规范的深色背景。
- shape：仅开放原有右箭头显隐：arrowHidden=true对应向右箭头false，保留img及官方src。左图标、非箭头、折叠按钮仍依各宿主来源，不开放为原始新增变体。
- sourceInventory：Saved typed set 64858:84505 has 20 COMPONENT nodes; 10 registered size calls match unique Default/Hover pairs for explicit fonts/textColor, gap and 12px right arrow declarations. Container height/padding/radius match the two with-bg calls. _color does not override explicit textColor. arrow-export-index-1012.json separately records all20 official SVG geometry/paint matches. browser-states-1014.json and browser-bg-terminal-states-1014.json record finite actual pointer/terminal paint evidence; they do not approve user visual, Footer adapters, all hosts or complete specification coverage.
- specificationScope：Saved Button update log and type section only: 4 explicit rule texts and 33 document usage rows paired by actual source ancestry. Original text-node IDs retained; document examples do not define new components or automatically approve hosts. There is no complete specification, browser or visual approval inferred.
- hostAdapterBoundary：Collapse Edit 原稿69424:119913实际调用黑色14px/off原子64858:84960，并打开左侧Edit图标、关闭右箭头。仅现有宿主Preview按已确认原子优先规则进行button语义/左图标适配，保留ds-text-btn文字和图标结构及current资源，不开放页面自动选型中的action/custom-icon变体。原稿16px图标与现行12px原子不同，来源记录不伪称逐像素一致。

## 关系

子组件：无。

已登记父组件：banner、card、collapse、comment、icon-card、navigation、stepper、table。

图标：components/icons/icon-chevron-down.svg、components/icons/icon-text-button-arrow-right-regular.svg、components/icons/icon-text-button-arrow-right-bold.svg、components/icons/icon-text-button-arrow-right-blue-s.svg、components/icons/icon-text-button-arrow-right-gray-s-default.svg、components/icons/icon-text-button-arrow-right-gray-s-hover.svg、components/icons/icon-text-button-arrow-right-white-l.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
