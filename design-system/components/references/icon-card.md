# IconCard — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：five-finite-PC-icon-card-calls-with-owned-list-and-disclosure；视觉审阅：pending。

先区分单事件、多链接或明确折叠，再选居中/居左及背景。当前center/left单事件、白底left.jump-type、灰底center/left可展开均已登记；跳转依赖当前IconCard原件中的List12私有覆盖，不开放独立蓝色List族。不按次序分配图标或截断源文案。

必须加载：components/tokens.css、components/components.css、components/text-button-current.css、components/icon-card-current.css、components/list-unordered-current.css、components/list-links-current.css、components/icon-card-disclosure-current.css、components/icon-card-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。Open Sans stack; actual browser geometry/visual proof pending.

Exact native gray center/left root, icon, description and body/title anatomy retained. Current sourceAbsent permits bullets/link only; icon/description omission is not exposed. Keep36px registered artwork and exact inline-black/m link anatomy. No root IDs, inline sizing or expandable identity.

Edit only registered fields and child TextButton allowed label/href. Preserve registered right arrow and36px main icon; verify asset identity and actual source role in the existing local mapping. Registered resource legality alone does not establish business meaning.

不可修改：Gray surface without border and selected layout；36px native icon geometry; registered artwork is editable；Shared Card bullet fragment with local bullet icon；Exact TextButton/inline-black/m root and two children；Component CSS and no added interaction runtime；Jump primitive is own native blue-link list; no fictitious TextButton, added arrow or description/bullets；Current gray center title genuine TextButton/inline-black-bold/L, no arrow; title host only positions it；All three finite titles are genuine TextButton14-bold/no-arrow; existing blue list substitute stays pending actual12px List admission.。

## center.single-event

用：居中单事件，图标和描述槽齐备。

不用：图标语义不符、需省略图标/描述或其他事件结构。

可修改：icon、title、description、bullets、link、titleHref、sourceAbsent。

```html
<div class="ds-icon-card ds-icon-card--center ds-icon-card--bg-gray" data-icon-card-current="center-atom" data-ai-example="ai-icon-card-center">
          <img class="ds-icon-card__icon" src="../icons/icon-placeholder-switch.svg" alt="">
          <div class="ds-icon-card__body">
            <div class="ds-icon-card__title-slot"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">This is a card title</span></a></div>
            <p class="ds-icon-card__desc">This is a card description. This is a card description. This is a card description.</p>
            <div class="ds-icon-card__bullets">
              <div class="ds-card__bullet-item"><img class="ds-card__bullet-icon" src="../icons/icon-bullet.svg" alt=""><p class="ds-card__bullet-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div>
              <div class="ds-card__bullet-item"><img class="ds-card__bullet-icon" src="../icons/icon-bullet.svg" alt=""><p class="ds-card__bullet-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div>
              <div class="ds-card__bullet-item"><img class="ds-card__bullet-icon" src="../icons/icon-bullet.svg" alt=""><p class="ds-card__bullet-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div>
            </div>
            <div class="ds-icon-card__link">
              <a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#">
                <span class="ds-text-btn__text">Learn more</span>
                <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt="">
              </a>
            </div>
          </div>
        </div>
```

## left.single-event

用：居左单事件，图标和描述槽齐备。

不用：图标语义不符、需省略图标/描述或其他事件结构。

可修改：icon、title、description、bullets、link、titleHref、sourceAbsent。

```html
<div class="ds-icon-card ds-icon-card--left ds-icon-card--bg-gray" data-icon-card-current="left-atom" data-ai-example="ai-icon-card-left">
          <img class="ds-icon-card__icon" src="../icons/icon-placeholder-switch.svg" alt="">
          <div class="ds-icon-card__body">
            <div class="ds-icon-card__title-slot"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">This is a card title</span></a></div>
            <p class="ds-icon-card__desc">This is a card description. This is a card description. This is a card description.</p>
            <div class="ds-icon-card__bullets">
              <div class="ds-card__bullet-item"><img class="ds-card__bullet-icon" src="../icons/icon-bullet.svg" alt=""><p class="ds-card__bullet-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div>
              <div class="ds-card__bullet-item"><img class="ds-card__bullet-icon" src="../icons/icon-bullet.svg" alt=""><p class="ds-card__bullet-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div>
              <div class="ds-card__bullet-item"><img class="ds-card__bullet-icon" src="../icons/icon-bullet.svg" alt=""><p class="ds-card__bullet-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div>
            </div>
            <div class="ds-icon-card__link">
              <a class="ds-text-btn ds-text-btn--inline ds-text-btn--black ds-text-btn--m" href="#">
                <span class="ds-text-btn__text">Learn more</span>
                <img class="ds-text-btn__icon" src="../icons/icon-text-button-arrow-right-regular.svg" alt="">
              </a>
            </div>
          </div>
        </div>
```

## left.jump-type

用：白色图标卡片标题下有多个独立蓝色链接，使用真实List12子组件。

不用：单个Learn more入口、纯说明或需要折叠的长列表。

可修改：icon、title、links、titleHref。

```html
<div class="ds-icon-card ds-icon-card--left ds-icon-card--bg-white ds-icon-card--bordered" data-icon-card-current="jump" data-ai-example="ai-icon-card-completion-left-jump-type">
          <img class="ds-icon-card__icon" src="../icons/icon-placeholder-switch.svg" alt="">
          <div class="ds-icon-card__body">
            <div class="ds-icon-card__title-slot"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">This is a card title</span></a></div>
            
            <div class="ds-icon-card__blue-links"><div class="ds-list ds-list--unordered-links-12" data-list-current="unordered-links" data-list-part="icon-card-links-12"><div class="ds-list__unordered-item"><a class="ds-list__unordered-link" href="#details">This text is used to show a description</a></div><div class="ds-list__unordered-item"><a class="ds-list__unordered-link" href="#details">This text is used to show a description</a></div><div class="ds-list__unordered-item"><a class="ds-list__unordered-link" href="#details">This text is used to show a description</a></div></div></div>
            
          </div>
        </div>
```

## center.multi-event-expandable

用：居中灰色图标卡片明确需要长列表展开/收起，完整说明保持可见。

不用：普通短列表、单跳转链接，或仅因文字长就擅自折叠。

可修改：icon、title、description、items。

```html
<div class="ds-icon-card ds-icon-card--center ds-icon-card--bg-gray" data-icon-card-current="center-expandable" data-ai-example="ai-icon-card-completion-center-multi-event-expandable" data-icon-card-expandable="">
          <img class="ds-icon-card__icon" src="../icons/icon-placeholder-switch.svg" alt="">
          <div class="ds-icon-card__body">
            <div class="ds-icon-card__title-slot"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">This is a card title</span></a></div>
            <p class="ds-icon-card__desc">This is a card description. This is a card description. This is a card description.</p>
            <div class="ds-icon-card__bullets"><div class="ds-list ds-list--unordered-12" data-list-current="unordered" data-list-source="legacy-fixed"><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div></div></div>
            <div class="ds-icon-card__link"><button type="button" class="ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m" data-text-button-part="icon-card-disclosure" aria-expanded="false"><span class="ds-text-btn__text">See more</span><img class="ds-text-btn__icon" src="../icons/icon-chevron-down.svg" alt=""></button></div>
          </div>
        </div>
```

## left.multi-event-expandable

用：居左灰色图标卡片明确需要长列表展开/收起，完整说明保持可见。

不用：普通短列表、单跳转链接，或仅因文字长就擅自折叠。

可修改：icon、title、description、items。

```html
<div class="ds-icon-card ds-icon-card--left ds-icon-card--bg-gray" data-icon-card-current="left-expandable" data-ai-example="ai-icon-card-completion-left-multi-event-expandable" data-icon-card-expandable="">
          <img class="ds-icon-card__icon" src="../icons/icon-placeholder-switch.svg" alt="">
          <div class="ds-icon-card__body">
            <div class="ds-icon-card__title-slot"><a class="ds-text-btn ds-text-btn--inline ds-text-btn--black-bold ds-text-btn--l" aria-disabled="true"><span class="ds-text-btn__text">This is a card title</span></a></div>
            <p class="ds-icon-card__desc">This is a card description. This is a card description. This is a card description.</p>
            <div class="ds-icon-card__bullets"><div class="ds-list ds-list--unordered-12" data-list-current="unordered" data-list-source="legacy-fixed"><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div><div class="ds-list__unordered-item"><span class="ds-list__unordered-dot" aria-hidden="true"></span><p class="ds-list__unordered-text">2x 2nd Gen Intel Xeon Scalable CPUs</p></div></div></div>
            <div class="ds-icon-card__link"><button type="button" class="ds-text-btn ds-text-btn--inline ds-text-btn--blue-link ds-text-btn--m" data-text-button-part="icon-card-disclosure" aria-expanded="false"><span class="ds-text-btn__text">See more</span><img class="ds-text-btn__icon" src="../icons/icon-chevron-down.svg" alt=""></button></div>
          </div>
        </div>
```

## 行为

- display：单事件静态；折叠调用加载已有组件同步链中的icon-card-current.js。
- links：Child navigation follows the original TextButton contract and local page workflow. Preview href=# is fixture-only; resolve or disable real targets according to existing page rules.
- disclosure：真实List12配TextButton私有蓝色13px部件；176px折叠列表，按钮和键盘原生激活，See more/less和aria-expanded同步；不折叠完整描述。
- jump：Native link navigation uses safe source target only when explicitly requested by page rules; default no href plus aria-disabled/role=link displays source-less entry without false navigation, custom click handler or alert.
- optional：原稿可选内容与当前接口分开：当前sourceAbsent仅登记bullets/link。图标和描述虽在原稿可选，当前精确调用尚未开放其省略；缺少真实内容不得编造或直接删结构。
- visual：The component owns Gray9 fill, no border and8px radius. Its surrounding section may be white or gray. Equal-height, hover shadow, text fit and fonts still require actual browser proof.
- titleSource：所有当前标题引用真实TextButton/inline-black-bold/L，原件隐藏箭头；图标、标题和List依实际变体装配。
- jumpSourceBoundary：当前3:084742中的12px蓝色List覆盖作为List私有part，限定IconCard/left.jump-type。并非新建List母变体或原13px手写替身。
- content：Description text grows naturally without a fixed/max height or hidden clipping. User explicitly removed the64px limit on2026-11-10; this supersedes the saved specimen setting only for current description flow. Preserve typography, spacing, surface, radius and complete source text.

## 关系

子组件：text-button、text-button、text-button、text-button、text-button、list、list。

已登记父组件：carousel。

图标：components/icons/icon-placeholder-switch.svg、components/icons/icon-benefit-development.svg、components/icons/icon-bullet.svg、components/icons/icon-arrow-right.svg、components/icons/icon-chevron-down.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
