# Breadcrumb — AI 调用参考

此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。

范围：existing-desktop-breadcrumb-light-dark-multilevel；视觉审阅：pending。

先按实际背景选择default/dark，再按确有固定1920通栏需求选择full-width-light/dark。四个现有调用均保留；普通路径至少两层，文字和层级完整。分类下拉、自动缩写和移动适配未开放；通栏不表示任意宽度适配。面包屑可选，不参与Banner变体判断，定位由当前父级负责。

必须加载：components/tokens.css、components/components.css、components/breadcrumb-current.css。

字体样式表：https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap。沿用Open Sans；实际字体待浏览器确认。

保留nav及Breadcrumb可访问名称；只保留一个最后current，前面每层为真实anchor及分隔符。

原文顺序和大小写按来源；不要删级别。

不可修改：nav根元素与明暗变体；每层item结构、最后current与斜杠分隔符；共享文字样式与宿主定位；不添加点击脚本或折叠菜单；data-breadcrumb-current及分隔符aria-hidden=true；准确SVG mask和原子透明度。

## default

用：浅色背景的完整多级路径。

不用：深色背景、同页章节导航或分类下拉。

可修改：items。

```html
<nav class="ds-breadcrumb" aria-label="Breadcrumb" data-breadcrumb-current data-ai-example="ai-breadcrumb-default">
      <div class="ds-breadcrumb__item">
        <a href="#" class="ds-breadcrumb__link">Home</a>
        <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      </div>
      <div class="ds-breadcrumb__item">
        <a href="#" class="ds-breadcrumb__link">Page A</a>
        <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      </div>
      <div class="ds-breadcrumb__item">
        <span class="ds-breadcrumb__current">Current Page</span>
      </div>
    </nav>
```

## dark

用：深色背景上的完整多级路径。

不用：浅色背景、改字色模拟其他状态或分类下拉。

可修改：items。

```html
<nav class="ds-breadcrumb ds-breadcrumb--dark" aria-label="Breadcrumb" data-breadcrumb-current data-ai-example="ai-breadcrumb-dark">
        <div class="ds-breadcrumb__item">
          <a href="#" class="ds-breadcrumb__link">Home</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
        </div>
        <div class="ds-breadcrumb__item">
          <a href="#" class="ds-breadcrumb__link">Page A</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
        </div>
        <div class="ds-breadcrumb__item">
          <span class="ds-breadcrumb__current">Current Page</span>
        </div>
      </nav>
```

## full-width-light

用：1920px浅色通栏容器中的常规路径。

不用：内联路径、窄窗口自适配、分类下拉或任意容器宽度。

可修改：items。

```html
<div class="ds-breadcrumb-source-full-width" data-breadcrumb-source-container="light" data-ai-example="ai-breadcrumb-full-width-light"><nav class="ds-breadcrumb" aria-label="Breadcrumb" data-breadcrumb-current>
      <div class="ds-breadcrumb__item">
        <a href="#" class="ds-breadcrumb__link">Home</a>
        <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      </div>
      <div class="ds-breadcrumb__item">
        <a href="#" class="ds-breadcrumb__link">Page A</a>
        <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
      </div>
      <div class="ds-breadcrumb__item">
        <span class="ds-breadcrumb__current">Current Page</span>
      </div>
    </nav></div>
```

## full-width-dark

用：1920px深色通栏容器中的反白路径。

不用：浅色宿主、内联路径、窄窗口适配或分类下拉。

可修改：items。

```html
<div class="ds-breadcrumb-source-full-width" data-breadcrumb-source-container="dark" data-ai-example="ai-breadcrumb-full-width-dark"><nav class="ds-breadcrumb ds-breadcrumb--dark" aria-label="Breadcrumb" data-breadcrumb-current>
        <div class="ds-breadcrumb__item">
          <a href="#" class="ds-breadcrumb__link">Home</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
        </div>
        <div class="ds-breadcrumb__item">
          <a href="#" class="ds-breadcrumb__link">Page A</a>
          <span class="ds-breadcrumb__separator" aria-hidden="true">/</span>
        </div>
        <div class="ds-breadcrumb__item">
          <span class="ds-breadcrumb__current">Current Page</span>
        </div>
      </nav></div>
```

## 行为

- navigation：anchor采用原生导航；示例href=#仅为组件库展示。页面装配必须按Plan替换真实目标或声明仅展示，不保留导致跳页首的#占位。
- external：页面重构的外部导航边界仍按AGENTS执行：保留文字和样式，不补目标、不执行业务动作。
- scope：此处只验证本地结构和安全链接文本；没有实际导航或Banner定位验收。

## 关系

子组件：无。

已登记父组件：banner。

图标：components/icons/icon-breadcrumb-separator.svg。

详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。
