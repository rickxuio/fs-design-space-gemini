# Radio — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-radio-four-default-native-options；视觉审阅：pending。

普通文字互斥组至少2项；宽松用regular-lg、密集用regular-sm、紧凑描边用bordered-compact，bordered-detail只用于结算地址/账单/交货/支付共性框架。同组name相同、value唯一且至多一个checked；单项确认用Checkbox。结算品牌/价格/操作可为源稿插槽，当前精确调用只开放已登记主副文本，不冒充独立OptionSelector。

必须加载：components/tokens.css、components/components.css、components/radio-current.css。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用Open Sans字体栈；实际字体和浏览器视觉仍待验证。

原生label包含唯一radio input，无需虚构ID或额外JS。同一互斥组至少两项共享非空name且value唯一，不同业务组更换name；每组最多一个checked。

保留图标在前、文字在后；detail必须保留主副文字结构。

不可修改：label > radio input + indicator + content；准确根变体、图标和CSS；原生radio语义与组互斥；内容层级与detail说明；不添加自写状态JS或内联绘图；14px Default当前资源标记与透明环资产；18px Default当前资源标记与透明环资产；14/18px当前Hover透明环资产及checked/disabled隔离；14/18px当前Press原件及Disabled选中隔离；14/18px当前两种Disabled原件及历史边界。

## regular-lg

用：同组≥2；商品详情页解决方案产品筛选等 PC 宽松区域；18×18px 状态图与 14px/22px 标签。

不用：下拉、表单等密集区域使用 regular-sm；需要容器时使用对应带边框变体。

可修改：label、name、value、checked、disabled、changeCallback。

```html
<label class="ds-radio" data-radio-source-default18="official" data-ai-example="ai-radio-regular-lg"><input class="ds-radio__input" type="radio" name="lg-default" value="a"><span class="ds-radio__indicator" aria-hidden="true"></span><span class="ds-radio__content"><span class="ds-radio__label">Options-A</span></span></label>
```

## regular-sm

用：同组≥2；下拉菜单、常规表单、筛选抽屉等密集互斥列表；14×14px 状态图与 13px/20px 标签。

不用：PC 宽松区域优先 regular-lg；需要整体描边时使用 bordered-compact。

可修改：label、name、value、checked、disabled、changeCallback。

```html
<label class="ds-radio ds-radio--sm" data-radio-source-default14="official" data-ai-example="ai-radio-regular-sm"><input class="ds-radio__input" type="radio" name="sm-default" value="a"><span class="ds-radio__indicator" aria-hidden="true"></span><span class="ds-radio__content"><span class="ds-radio__label">Options-A</span></span></label>
```

## bordered-compact

用：同组≥2；表单中需要 30px 高、4px 圆角和 8px 水平内边距的紧凑描边单选项。

不用：无容器的普通选项使用 regular；结算主副文本选项使用 bordered-detail。

可修改：label、name、value、checked、disabled、changeCallback。

```html
<label class="ds-radio ds-radio--bordered-compact" data-radio-source-default14="official" data-ai-example="ai-radio-bordered-compact"><input class="ds-radio__input" type="radio" name="compact-default" value="a"><span class="ds-radio__indicator" aria-hidden="true"></span><span class="ds-radio__content"><span class="ds-radio__label">100 QSFP28</span></span></label>
```

## bordered-detail

用：同组≥2；仅结算页收货地址、账单地址、配送方式和支付方式等需要主副文本或业务插槽的互斥选择。

不用：媒体、色块、SKU、价格或品牌内容本身构成选择项时使用 OptionSelector；普通表单使用 regular 或 bordered-compact。

可修改：label、description、name、value、checked、disabled、changeCallback。

```html
<label class="ds-radio ds-radio--bordered-detail" data-radio-current="detail-framework" data-radio-source-default14="official" data-ai-example="ai-radio-bordered-detail"><input class="ds-radio__input" type="radio" name="detail-default" value="a"><span class="ds-radio__indicator" aria-hidden="true"></span><span class="ds-radio__content"><span class="ds-radio__label">Address &amp; Phipping &amp; Payment</span><span class="ds-radio__description">Text</span></span></label>
```

## 行为

- native：使用原生radio及change事件；checked/disabled为原生布尔属性，CSS由原生状态决定。
- groups：同一表单或文档作用域内，相同name由浏览器互斥；独立业务组必须不同name，同组value不能重复。
- keyboard：键盘与焦点使用浏览器原生行为；本轮模拟DOM没有验证实际键盘、焦点环或几何。
- content：detail仅替换主副文字，本批不开放业务extra区域。
- assembly：精确清单提供单项结构，不能把单项示例当成完整组验收；最终组数量/命名/初始checked仍需装配检查。

## 关系

子组件：无。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-radio-default-current-18.svg、components/icons/icon-radio-hover-current-18.svg、components/icons/icon-radio-checked-current-18.svg、components/icons/icon-radio-disabled-current-18.svg、components/icons/icon-radio-disabled-checked-current-18.svg、components/icons/icon-radio-default-current-14.svg、components/icons/icon-radio-hover-current-14.svg、components/icons/icon-radio-checked-current-14.svg、components/icons/icon-radio-disabled-current-14.svg、components/icons/icon-radio-disabled-checked-current-14.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
