# Badge — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-badge-success-status-count-logged-in-icon；视觉审阅：pending。

三种有限PC实例：dot只支持success圆点加文字；count接受已格式化0–99或99+；icon是原18px红底白勾。MG其他状态色、无文字点、M端及宿主定位仍是参考；格式化与右上角对角定位归宿主，不增改类名。

必须加载：components/tokens.css、components/components.css、components/badge-current.css。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用Open Sans字体栈；实际字体与浏览器视觉待验。

纯展示span，无额外ID或伪造交互角色；count只替换根节点文本，不包装新节点。

status保留文字；图案徽标按含义设置img.alt或装饰空alt。

不可修改：span根节点与各形态CSS；success状态图及位置；count品牌红、封顶和纯文本；不新增交互/自动格式化JS；data-badge-current；尺寸类由displayCount按唯一规则决定，禁止手写尺寸/状态样式；PC图案原子SVG完整字节、18px容器与纯展示语义。

## dot

用：完成状态的8px绿色圆点与文字。

不用：要求其他状态色、无文字点或未读数量。

可修改：statusText。

```html
<span class="ds-badge-status" data-ai-example="ai-badge-dot"><span class="ds-badge-dot ds-badge-dot--success"></span><span class="ds-badge-status__text">Completed</span></span>
```

## count

用：宿主已提供0–99或99+的显示数量。

不用：要求自动计数、自动截断或移动端尺寸。

可修改：displayCount。

```html
<span class="ds-badge-count" data-badge-current data-ai-example="ai-badge-count">1</span>
```

## icon

用：现有PC/Pad18px红底白勾图案。

不用：其他图标、账户轮廓或M端12px图案。

可修改：iconAlt。

```html
<span class="ds-badge-icon" data-ai-example="ai-badge-icon"><img src="../icons/icon-badge-logged-in-pc.svg" alt=""></span>
```

## 行为

- display：没有独立运行JS或click状态。数量源大于99时，宿主先格式化为99+；不是组件自动换算。 当前PC尺寸由已格式化文本决定：99+选--max，其余0..99不带该类；宿主不复制尺寸或添加格式化JS。
- status：此有限实例固定success颜色；其他状态需要对应真实实例，不只改类名。
- host：3.1明确依据宿主容器右上角对角对齐、沿X/Y各重叠一半；CSS基础规则匹配，实际浏览器宿主位置待验。原稿允许必要光学偏移，需对应证据/装配记录，不改原子尺寸。

## 关系

子组件：无。

已登记父组件：collapse。

图标：components/icons/icon-badge-logged-in-pc.svg、components/icons/icon-badge-logged-in-m.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
