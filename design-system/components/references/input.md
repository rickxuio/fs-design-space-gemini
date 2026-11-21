# Input — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：desktop-basic-input-two-surfaces-seven-states；视觉审阅：pending。

按MG当前基础录入规则，白背景用gray、灰背景用white；当前接口仅42px基础单行输入。30px仅详情属性、34px密集场景及密码/图标/属性/文本域为来源扩展，不因出现原稿而开放。

必须加载：components/tokens.css、components/components.css、components/input-current.css、components/input-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。Open Sans 来自已有项目字体规则；远端字体不可用时按项目字体栈回退，不宣称完全离线。

每个实例生成唯一输入id和错误行id，label.for同步；aria-describedby仅关联该实例可见错误行并保留宿主其他描述id。默认示例无错误，宿主可设置aria-invalid为true/false。

独立调用保留内部label/for；仅已核灰/白电话拼接能力同时声明external/start/fill，使用唯一外部原生label.ds-input-field__label及for。不得无标签或用placeholder替代；白色033233同样已核并准入。

不可修改：根类及data-input-current；input[type=text]及背景类；42px高度/4px圆角/12px内边距；label/for/id关联；错误行信息图标与文字槽；运行CSS/JS。

## gray

用：白色背景上的42px基础单行录入。

不用：灰色背景区域 → 用白底描边。

可修改：label、placeholder、value、name、disabled、errorMessage、inputCallback、changeCallback、aria-invalid、type、required。

```html
<div class="ds-input-field" data-input-current data-ai-example="ai-input-gray">
<label class="ds-input-field__label" for="input-gray-default">Lable</label>
<input id="input-gray-default" class="ds-input-field__input ds-input-field__input--gray" type="text" placeholder="Please enter text">
<div class="ds-input-field__error" id="input-gray-default-error" hidden>
<span class="ds-input-field__error-icon" aria-hidden="true">
</span>
<span class="ds-input-field__error-text">Please enter Prompt word.</span>
</div>
</div>
```

## white

用：灰色背景上的42px基础单行录入。

不用：白色背景区域 → 用灰底。

可修改：label、placeholder、value、name、disabled、errorMessage、inputCallback、changeCallback、aria-invalid、type、required。

```html
<div class="ds-input-field" data-input-current data-ai-example="ai-input-white">
<label class="ds-input-field__label" for="input-white-default">Lable</label>
<input id="input-white-default" class="ds-input-field__input ds-input-field__input--white" type="text" placeholder="Please enter text">
<div class="ds-input-field__error" id="input-white-default-error" hidden>
<span class="ds-input-field__error-icon" aria-hidden="true">
</span>
<span class="ds-input-field__error-text">Please enter Prompt word.</span>
</div>
</div>
```

## 行为

- input：原生输入与input/change事件；不添加清除按钮，不处理业务提交。
- focus：禁用优先；空焦点activated、有值焦点inputting，即使宿主仍声明aria-invalid；失焦时优先恢复宿主error，否则按值default/filled。聚焦不自动清除业务错误。
- disabled：使用原生disabled或fieldset，不允许禁用状态产生输入。
- error：宿主设置aria-invalid=true；错误内容由errorMessage槽提供；移除/改为false隐藏错误并移除其描述id。禁用时隐藏错误，解除禁用后恢复宿主声明。
- programmatic：程序设置.value后派发input/change通知；form.reset会同步状态；动态插入实例自动同步。
- preview：data-input-preview-state仅为状态展示辅助，新调用不得复制；静态描边不代表真实焦点或光标。
- legacyHosts：白底Form第一基础槽已真实调用；其他Form/Collapse旧字段仍待来源核对，不宣称已迁移。
- nativeStateGuard：Current script has one document guard and observer; repeated loading preserves one listener set. Dynamic field-state updates remain supported.
- sourceReview：Saved source is tool-generated HTML with component metadata, not independently typed original DSL or frontend source. Fourteen basic state markers and raw style/text/icon declarations are rechecked against basic-input-review and original bytes during compilation. Missing font-weight does not establish source 400; local typography is explicit library implementation. Full spec, SVG contour and browser proof remain pending. 2026-10-11原生画布定向核对基础状态，Error点击进入Activated，修正状态标记优先级；v2.5图层名与v2.4正文冲突独立记录，全文/浏览器/视觉仍待验证。
- disabledBorderToken：The existing white basic Disabled #EEEEEE border is now a component-scoped Token with the same value, sourced from saved tool HTML node 68908:022328. No substitution with gray-6 or approval for other Input families.
- exactCallStructure：当前精确调用为根div直接依次装配label、原生text input和隐藏错误行；错误行仅含装饰信息图标及纯文字消息。拒绝额外包装/控件、inline样式、额外文字类和未开放原生属性。ID唯一、label.for与错误行结构同时核对；这只是当前本地调用结构检查，不证明原始typed来源或浏览器效果。
- selectTriggerFace：Select九个有限调用可复用基础Input面部与default/activated/disabled状态；Select仅装配原生combobox及多值动作，不实例化独立可编辑Input。
- searchParts：banner-search42/menu-search42仅在登记宿主内使用；独立基础调用不加载搜索资源。原生Enter/搜索按钮受空值、IME、disabled及hidden约束，派发查询意图。

## 关系

子组件：无。

已登记父组件：banner、collapse、dialog、form、menu-navigation、navigation、select。

图标：components/icons/icon-info.svg、components/icons/icon-input-down.svg、components/icons/icon-warning.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
