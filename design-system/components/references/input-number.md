# InputNumber — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-positive-integer-three-default-controls；视觉审阅：pending。

outline-sm用于紧凑数量，outline-lg用于白底常规数量，filled-lg用于灰底表单。取实际默认实例；仅在初始化前替换正整数配置，不通过新增CSS造尺寸。 按relations.variantDecisions的具体场景选型；最终资格读同版catalog，未开放项不自动调用。当前MG核对状态见prototypeRollout，不将既有来源冒称本次在线核对。

必须加载：components/tokens.css、components/components.css、components/input-number-current.css、components/input-number-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用现有Open Sans字体栈；未验证离线字体一致。

保留唯一text输入及左右button，输入必须有非空aria-label；增减按钮名称由现有运行代码提供。初始化前设置范围及初值，禁止复制data-input-number-ready。

accessibleLabel替换输入aria-label；若保留根节点同名aria-label，需同时同步。

不可修改：根类、默认形态和子节点顺序；button类型与增减数据标记；text输入及数值模式由运行代码初始化；图标与共享CSS/JS；正整数范围和初始化时机；data-input-number-current opt-in marker。

## outline-sm

用：紧凑商品数量，现有32px线框原件。

不用：常规42px表单、负数或小数。

可修改：value、min、max、step、name、accessibleLabel、inputCallback、changeCallback。

```html
<div class="ds-input-number ds-input-number--outline ds-input-number--sm" data-input-number data-min="1" data-max="9999" aria-label="Cart quantity" data-ai-example="ai-input-number-outline-sm" data-input-number-current>
          <button class="ds-input-number__button ds-input-number__button--decrement" type="button" data-input-number-decrement></button>
          <input class="ds-input-number__input" type="text" value="1" aria-label="Cart quantity">
          <button class="ds-input-number__button ds-input-number__button--increment" type="button" data-input-number-increment></button>
        </div>
```

## outline-lg

用：商品详情或白底表单的42px数量。

不用：紧凑购物车或灰底一体式控件。

可修改：value、min、max、step、name、accessibleLabel、inputCallback、changeCallback。

```html
<div class="ds-input-number ds-input-number--outline" data-input-number data-min="1" data-max="20" aria-label="Product quantity" data-ai-example="ai-input-number-outline-lg" data-input-number-current>
          <button class="ds-input-number__button ds-input-number__button--decrement" type="button" data-input-number-decrement></button>
          <input class="ds-input-number__input" type="text" value="7" aria-label="Product quantity">
          <button class="ds-input-number__button ds-input-number__button--increment" type="button" data-input-number-increment></button>
        </div>
```

## filled-lg

用：灰底表单里的42px一体式数量。

不用：白底线框、小数或无限范围。

可修改：value、min、max、step、name、accessibleLabel、inputCallback、changeCallback。

```html
<div class="ds-input-number ds-input-number--filled" data-input-number data-min="1" data-max="20" aria-label="Form quantity" data-ai-example="ai-input-number-filled-lg" data-input-number-current>
          <button class="ds-input-number__button ds-input-number__button--decrement" type="button" data-input-number-decrement></button>
          <input class="ds-input-number__input" type="text" value="7" aria-label="Form quantity">
          <button class="ds-input-number__button ds-input-number__button--increment" type="button" data-input-number-increment></button>
        </div>
```

## 行为

- initialization：首次DOMContentLoaded或脚本载入时扫描；初始化后绑定每个实例，未提供动态插入扫描API。
- range：初始化前min/max/step均为JS安全正整数，min<=value<=max；范围缺省运行值1-9999，step缺省1。初始化后更改data范围不会重新绑定。
- adjust：点击增减或ArrowUp/ArrowDown按step调整并限制到边界；变化时派发原生input与change，边界按钮禁用。
- typing：输入时删除非数字，可能暂时为空或超过范围；blur时回写范围内整数，不派发额外的change。不能视作完整业务验证。
- readonly：既有input.disabled/readOnly禁止调整；本批默认调用未开放状态编辑，其他状态仍按原Preview确认。
- business：不计算价格，不提交表单；宿主监听input/change并自行处理业务。
- disabledContainer：Native :disabled includes disabled fieldsets; synthetic adjustments/typing cannot change disabled or readonly values. Range remains captured once at initialization.
- nativeStateGuard：Current marker-only runtime observes native readonly/disabled and containing fieldsets to restore control state; no repeated document initialization, no dynamic range/insertion extension.

## 关系

子组件：无。

已登记父组件：dialog、list。

图标：components/icons/icon-collapse-minus.svg、components/icons/icon-collapse-plus.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
