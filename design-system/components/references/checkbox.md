# Checkbox — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：desktop-native-checkbox-two-sizes；视觉审阅：pending。

普通同组复选应≥2且不互斥；协议/记住密码/保持登录等明确布尔开关可单项。按宿主来源选lg18/14文字或sm14/13文字。保留原生input，不复制宿主受控标记为独立Checkbox。

必须加载：components/tokens.css、components/components.css、components/checkbox-current.css、components/checkbox-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用现有Open Sans字体栈；远端字体不可用时回退，不宣称离线视觉一致。

默认规范实例为未选且启用的原生input，必须保留两个当前标记、input类型和name/value；编辑状态限声明bindings。

根节点保留input、aria-hidden方块与唯一纯文字槽。

不可修改：label根节点与尺寸类；直接子节点input、box、label及其顺序；原生checkbox类型与背景图资源；共享CSS与图标文件；data-checkbox-current及data-checkbox-control；历史资源不自动升级；Current native root hugs content width with max-width100%; no parent stretch or fixed104/95px specimen width.。

## lg

用：普通大号18px选项；普通多选同组≥2，协议等布尔开关可单项。

不用：下拉/表格行/筛选侧栏等密集容器 → 用小号。

可修改：label、name、value、checked、disabled、changeCallback。

```html
<label class="ds-checkbox" data-ai-example="ai-checkbox-lg" data-checkbox-current data-checkbox-control><input class="ds-checkbox__input" type="checkbox" name="checkbox-lg" value="option-a"><span class="ds-checkbox__box" aria-hidden="true"></span><span class="ds-checkbox__label">Options-A</span></label>
```

## sm

用：密集14px选项或已核实的表单/协议宿主；普通多选同组≥2，协议等布尔开关可单项。

不用：来源明确18px的商品/其他选项行；不得为压缩空间擅自改小。

可修改：label、name、value、checked、disabled、changeCallback。

```html
<label class="ds-checkbox ds-checkbox--sm" data-ai-example="ai-checkbox-sm" data-checkbox-current data-checkbox-control><input class="ds-checkbox__input" type="checkbox" name="checkbox-sm" value="option-a"><span class="ds-checkbox__box" aria-hidden="true"></span><span class="ds-checkbox__label">Options-A</span></label>
```

## 行为

- default：规范实例默认未选且启用。
- interaction：原生input负责点击、checked、disabled和表单取值，change事件原生冒泡；不模拟Space。当前JS仅初始化半选并在非取消reset后恢复初始半选。
- hosts：Select/Dropdown省略input的受控标记由宿主管理选择。OptionSelector服务span根input+box、List toolbar label根input+box省略caption，沿实际来源保留原子22/lg或20/sm首行wrapper高度与top2/3偏移；外层业务label或input可访问名称供名。List PC行保留完整原子标题；M历史适配未验收。
- states：checked/disabled可通过声明binding配置。半选可由input.indeterminate设置，当前初始化标记只在专用演示中使用，未开放AI binding。disabled+indeterminate未取得源规范。保留原子F6F6F8与规范F6F6F6冲突；浏览器视觉和真实键盘待验证。

## 关系

子组件：无。

已登记父组件：dialog、dropdown、form、list、option-selector、select、tag。

图标：components/icons/icon-checkbox-default-18.svg、components/icons/icon-checkbox-default-14.svg、components/icons/icon-checkbox-hover-18.svg、components/icons/icon-checkbox-hover-14.svg、components/icons/icon-checkbox-checked-18.svg、components/icons/icon-checkbox-checked-14.svg、components/icons/icon-checkbox-indeterminate-18.svg、components/icons/icon-checkbox-indeterminate-14.svg、components/icons/icon-checkbox-disabled-18.svg、components/icons/icon-checkbox-disabled-14.svg、components/icons/icon-checkbox-disabled-checked-14.svg、components/icons/icon-checkbox-disabled-checked-18.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
