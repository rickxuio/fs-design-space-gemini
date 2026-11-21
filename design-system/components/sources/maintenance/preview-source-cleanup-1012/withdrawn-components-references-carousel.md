# Carousel — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：two-finite-static-desktop-carousel-scaffolds；视觉审阅：pending。

Dark homepage seven slides/XL dark overlay with seven dots, or light five static slides/L overlay with no optional pagination. Exact registered calls only; slide bodies are page content, not implicit Banner.

必须加载：components/tokens.css、components/components.css、components/carousel-current.css、components/carousel-current.js。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。

Complete ID-free track with safe native previous/next arrows. Exact dark seven-slide/dot mapping or light five-slide/no-dot shape. Current marker separates canonical types; no ready/default inline state.



不可修改：Homepage root and dark XL overlay controls；Seven complete slide wrappers and one-to-one dots；Registered arrows, safe buttons and initial state；Shared CSS and current runtime；No inference of Banner component from slide demo content；Light five wrappers and L overlay controls, 16px inset and 8px corner from existing specimen; no optional dots in this finite call。

## dark

用：undefined

不用：undefined

可修改：slides。

```html
<div class="ds-carousel ds-carousel--homepage-banner" aria-label="Homepage Banner carousel" data-ai-example="ai-carousel-dark-homepage" data-carousel-current="">
      <div class="ds-carousel__track">
        <div class="ds-carousel__slide">
          <div class="homepage-banner-demo__slide">
            <div class="homepage-banner-demo__content">
              <p class="homepage-banner-demo__title">Homepage Banner slide 1</p>
              <p class="homepage-banner-demo__desc">1920×420px design baseline with a fluid runtime width.</p>
            </div>
          </div>
        </div>
        <div class="ds-carousel__slide">
          <div class="homepage-banner-demo__slide">
            <div class="homepage-banner-demo__content">
              <p class="homepage-banner-demo__title">Homepage Banner slide 2</p>
              <p class="homepage-banner-demo__desc">48×48px overlay controls use the dark color variant.</p>
            </div>
          </div>
        </div>
        <div class="ds-carousel__slide">
          <div class="homepage-banner-demo__slide">
            <div class="homepage-banner-demo__content">
              <p class="homepage-banner-demo__title">Homepage Banner slide 3</p>
              <p class="homepage-banner-demo__desc">The active pagination item expands from 8×8px to 56×8px.</p>
            </div>
          </div>
        </div>
        <div class="ds-carousel__slide">
          <div class="homepage-banner-demo__slide">
            <div class="homepage-banner-demo__content">
              <p class="homepage-banner-demo__title">Homepage Banner slide 4</p>
              <p class="homepage-banner-demo__desc">Each pagination control switches to its matching slide.</p>
            </div>
          </div>
        </div>
        <div class="ds-carousel__slide">
          <div class="homepage-banner-demo__slide">
            <div class="homepage-banner-demo__content">
              <p class="homepage-banner-demo__title">Homepage Banner slide 5</p>
              <p class="homepage-banner-demo__desc">The track keeps the existing 0.4s ease transition.</p>
            </div>
          </div>
        </div>
        <div class="ds-carousel__slide">
          <div class="homepage-banner-demo__slide">
            <div class="homepage-banner-demo__content">
              <p class="homepage-banner-demo__title">Homepage Banner slide 6</p>
              <p class="homepage-banner-demo__desc">Current-slide and hidden-slide ARIA states update together.</p>
            </div>
          </div>
        </div>
        <div class="ds-carousel__slide">
          <div class="homepage-banner-demo__slide">
            <div class="homepage-banner-demo__content">
              <p class="homepage-banner-demo__title">Homepage Banner slide 7</p>
              <p class="homepage-banner-demo__desc">Regular content carousels retain their base controls and pagination.</p>
            </div>
          </div>
        </div>
      </div>

      <button class="ds-carousel__btn ds-carousel__btn--xl ds-carousel__btn--dark ds-carousel__btn--overlay ds-carousel__btn--prev" type="button" aria-label="Previous slide" disabled="">
        <img src="../icons/icon-carousel-prev.svg" alt="">
      </button>
      <button class="ds-carousel__btn ds-carousel__btn--xl ds-carousel__btn--dark ds-carousel__btn--overlay ds-carousel__btn--next" type="button" aria-label="Next slide">
        <img src="../icons/icon-carousel-next.svg" alt="">
      </button>

      <div class="ds-carousel__dots ds-carousel__dots--dark" aria-label="Choose slide">
        <button class="ds-carousel__dot ds-carousel__dot--active" data-index="0" type="button" aria-label="Slide 1" aria-current="true"></button>
        <button class="ds-carousel__dot" data-index="1" type="button" aria-label="Slide 2"></button>
        <button class="ds-carousel__dot" data-index="2" type="button" aria-label="Slide 3"></button>
        <button class="ds-carousel__dot" data-index="3" type="button" aria-label="Slide 4"></button>
        <button class="ds-carousel__dot" data-index="4" type="button" aria-label="Slide 5"></button>
        <button class="ds-carousel__dot" data-index="5" type="button" aria-label="Slide 6"></button>
        <button class="ds-carousel__dot" data-index="6" type="button" aria-label="Slide 7"></button>
      </div>
    </div>
```

## light

用：undefined

不用：undefined

可修改：slides。

```html
<div class="ds-carousel" data-carousel-current="light-five" data-ai-example="ai-carousel-light-five" aria-label="Light five-slide content carousel">
        <div class="ds-carousel__track">
          <div class="ds-carousel__slide">
            <div class="light-carousel-demo-body">Slide 1</div>
          </div>
          <div class="ds-carousel__slide">
            <div class="light-carousel-demo-body">Slide 2</div>
          </div>
          <div class="ds-carousel__slide">
            <div class="light-carousel-demo-body">Slide 3</div>
          </div>
          <div class="ds-carousel__slide">
            <div class="light-carousel-demo-body">Slide 4</div>
          </div>
          <div class="ds-carousel__slide">
            <div class="light-carousel-demo-body">Slide 5</div>
          </div>
        </div>

        <button class="ds-carousel__btn ds-carousel__btn--l ds-carousel__btn--overlay ds-carousel__btn--prev" type="button" aria-label="Previous slide" disabled="">
          <img src="../icons/icon-carousel-prev.svg" alt="">
        </button>
        <button class="ds-carousel__btn ds-carousel__btn--l ds-carousel__btn--overlay ds-carousel__btn--next" type="button" aria-label="Next slide">
          <img src="../icons/icon-carousel-next.svg" alt="">
        </button>
      </div>
```

## 行为

- navigation：Previous/next clamp at boundaries; dots switch to matching slide. Track transform, dot active/current, slide aria-hidden and disabled controls synchronize. No dedicated event, autoplay, gestures or business navigation.
- initialization：New current runtime scans opt-in data-carousel-current roots at load/DOMContentLoaded; per-root guard prevents duplicate binding. Original Preview inline runtime archived.
- content：Only noninteractive slide content is within finite scope. Hidden-slide focusability, source image content and page Banner composition require separate checks.
- geometry：13.125% homepage control inset belongs to Carousel; does not supply Banner text inset. Actual browser geometry and animation remain unverified.
- nativeStateGuard：Current next/previous/dot native buttons ignore synthetic clicks while disabled or inside a disabled fieldset; no external slide API or new variant.
- availability：Current controls ignore native-disabled fieldset, ARIA-disabled or hidden host synthetic clicks, preserving current index. No autoplay, swipe or arrow-key navigation API.

## 关系

子组件：无。

已登记父组件：banner。

图标：components/icons/icon-carousel-prev.svg、components/icons/icon-carousel-next.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
