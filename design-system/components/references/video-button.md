# VideoButton — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-dark-light-duration-tags-s-l；视觉审阅：pending。

先按封面对比选择dark/light。本地只提取两个默认S时长标签；只接受duration/accessibleLabel/actionCallback，不接受size。原L、XL纯播放及其他状态保留参考，不用页面CSS修尺寸；click归宿主，不内建播放器。

必须加载：components/tokens.css、components/components.css、components/video-button-current.css。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。Open Sans stack; actual browser visual verification pending.

Safe type=button, nonempty root aria-label, decorative play icon. No copied icon-map ID, inline style or invented playback state.

duration changes only the visible time slot; accessibleLabel names the action/video and should remain meaningful when duration changes.

不可修改：S/L rectangle classes and two direct children；Registered play icon, decorative alt and safe button type；Size, translucent background and hover from shared CSS；No media-player behavior。

## dark

用：亮色视频封面上的深色S时长标签。

不用：纯播放XL、播放暂停状态或内建播放器。

可修改：duration、accessibleLabel、actionCallback。

默认尺寸：s；可选尺寸：s、l。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button class="ds-video-btn ds-video-btn--dark ds-video-btn--s" data-ai-example="ai-video-dark-s" type="button" aria-label="Play video">
            <img class="ds-video-btn__icon" src="../icons/icon-play.svg" alt="">
            <span class="ds-video-btn__text">03:52</span>
          </button>
```

## light

用：深色视频封面上的反白S时长标签。

不用：亮底对比不足、任意尺寸或播放状态。

可修改：duration、accessibleLabel、actionCallback。

默认尺寸：s；可选尺寸：s、l。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。

```html
<button class="ds-video-btn ds-video-btn--light ds-video-btn--s" data-ai-example="ai-video-light-s" type="button" aria-label="Play video">
            <img class="ds-video-btn__icon" src="../icons/icon-play.svg" alt="">
            <span class="ds-video-btn__text">03:52</span>
          </button>
```

## 行为

- action：Native button click calls the host actionCallback; component has no independent media JS, toggle state or automatic pause icon.
- duration：Visible preformatted m:ss with seconds 00..59, not a countdown formatter.
- keyboard：Native button activation; browser keyboard/focus/contrast remain pending.
- source：Four default rectangular S/L saved COMPONENT nodes are deterministically re-indexed during reference compilation. Role/default/not-playing/light properties, height/icon geometry, padding/gap/radius, fill, font and explicit textColor ranges are compared to local declarations. Source sample width is not fixed runtime width; local remains auto. Design navigation is not frontend playback; XL remains excluded. Browser/SVG path/complete spec approval pending.
- hosts：Card/Banner entries are design references; their current Preview has no declared VideoButton child implementation.
- specificationScope：Saved Button update log and type section only: 4 explicit rule texts and 33 document usage rows paired by actual source ancestry. Original text-node IDs retained; document examples do not define new components or automatically approve hosts. There is no complete specification, browser or visual approval inferred.
- sourcePaddingBoundary：S source and current padding are 8px on both axes, confirmed in native MasterGo inspector for dark/light default originals on 2026-10-10. See components/sources/video-button/online-padding-1010.json. Height stays24px; local rendered content geometry and font loading remain pending.

## 关系

子组件：无。

已登记父组件：暂无；不根据视觉相似度猜测父关系。

图标：components/icons/icon-play.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
