#!/usr/bin/env node
'use strict';

/**
 * Export a clean, framework-agnostic, read-only FS Design Core knowledge bundle
 * to dist/fs-design-core/ for downstream consumers (Vue staging-site QA auditor,
 * PRD/wireframe prototype generator, design review bots, etc.).
 *
 * Usage:
 *   npm run core:export
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist', 'fs-design-core');

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function parseCssTokens(cssFilePath) {
  const css = fs.readFileSync(cssFilePath, 'utf8');
  const vars = {};
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(css)) !== null) {
    vars[m[1].trim()] = m[2].trim();
  }
  return vars;
}

function main() {
  const pkg = readJson('package.json');
  const catalog = readJson('fs-components/component-specs/library/catalog.json');
  const iconFamilies = readJson('design-spec/icon-style-families.json');
  const patternsPath = path.join(ROOT, 'design-spec', 'section-patterns.md');
  const designSystemSpecPath = path.join(ROOT, 'design-spec', 'fs-design-system.md');
  const tokensCssPath = path.join(ROOT, 'design-system', 'components', 'tokens.css');
  const changelogPath = path.join(ROOT, 'design-system', 'CHANGELOG.md');
  const cssVariables = fs.existsSync(tokensCssPath) ? parseCssTokens(tokensCssPath) : {};

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // 1. Machine-readable Design Tokens (framework-agnostic, usable on Vue staging sites)
  const tokens = {
    schemaVersion: '1.0.0',
    coreVersion: pkg.version,
    releaseHash: catalog.version,
    layout: {
      viewportsPx: [1085, 1440, 1920],
      containerMaxWidthPx: 1200,
      containerHorizontalPaddingPx: 0,
      sectionPaddingVerticalPx: 40,
      gridGapPx: 20,
      maxGridColumns: 4,
      sectionDescriptionMaxWidthPx: 960
    },
    typography: {
      fontFamily: 'Open Sans',
      allowedWeights: [400, 600],
      sectionTitle: { fontSizePx: 24, fontWeight: 600, lineHeightPx: 32, color: '#19191A' },
      sectionDesc: { fontSizePx: 14, fontWeight: 400, lineHeightPx: 22, color: '#4B4B4D' },
      cardTitle: { fontSizePx: 16, fontWeight: 600, lineHeightPx: 24, color: '#19191A' },
      bodyText: { fontSizePx: 14, fontWeight: 400, lineHeightPx: 22, color: '#4B4B4D' },
      label: { fontSizePx: 14, fontWeight: 400, lineHeightPx: 20, color: '#4B4B4D' }
    },
    colors: {
      surfaces: {
        white: '#FFFFFF',
        gray: '#FAFBFB',
        tagNeutral: '#F3F4F6'
      },
      text: {
        primary: '#19191A',
        secondary: '#4B4B4D',
        muted: '#707070',
        inverse: '#FFFFFF'
      },
      borders: {
        default: '#DEE0E3',
        subtle: '#E5E5E5'
      },
      brand: {
        red: '#C00000',
        redAllowedContexts: [
          'primary-conversion-button (filled-red)',
          'navigation-active-indicator (tab underline, 3px vertical sidebar bar)',
          'price-emphasis',
          'form-error-validation',
          'duotone-line-icon-accent (~20% area)'
        ],
        redForbiddenContexts: [
          'third-party-company-or-brand-names',
          'ordinary-category-or-feature-tags',
          'regular-headings-or-body-text',
          'full-4-sided-card-borders',
          'non-conversion-content-read-more-links'
        ],
        linkBlue: '#0060BF'
      },
      scrim: {
        heroDarkOverlay: 'rgba(0, 0, 0, 0.45~0.58)',
        gradientsAllowed: false
      }
    },
    radii: {
      buttonPx: 4,
      tagPx: 4,
      cardPx: 8
    },
    controls: {
      inputHeightPx: 42,
      primaryButtonHeightPx: 42,
      carouselDot: { inactive: '8x8', active: '20x8', color: '#707070', gapPx: 10 }
    },
    cssVariableCount: Object.keys(cssVariables).length,
    cssVariables
  };

  // 2. Machine-readable Design QA & Synthesis Rules
  const rules = {
    schemaVersion: '1.0.0',
    coreVersion: pkg.version,
    rules: [
      {
        id: 'FS_NO_HORIZONTAL_OVERFLOW',
        severity: 'error',
        category: 'layout',
        description: 'Zero horizontal overflow across PC viewports (1085 / 1440 / 1920px).',
        appliesTo: ['page-synthesis', 'staging-audit']
      },
      {
        id: 'FS_SURFACE_BORDER_LAW',
        severity: 'error',
        category: 'surface',
        description:
          'White cards on gray (#FAFBFB) sections must NOT have borders; white cards on white (#FFFFFF) sections MUST have a border (#DEE0E3 / #E5E5E5). Gray borderless product cards on white sections are restricted solely to Homepage and PLP.',
        appliesTo: ['page-synthesis', 'staging-audit', 'design-review']
      },
      {
        id: 'FS_NO_GRADIENTS',
        severity: 'error',
        category: 'color',
        description: 'No CSS linear/radial gradients on backgrounds or scrims; use solid rgba(0,0,0,0.45~0.58) overlays for white text on imagery.',
        appliesTo: ['page-synthesis', 'staging-audit', 'design-review']
      },
      {
        id: 'FS_BRAND_RED_BOUNDARY',
        severity: 'warning',
        category: 'color',
        description: '#C00000 is restricted to primary conversion buttons, active nav indicators, prices, form errors, and duotone-line icon accents. Never use on content-reading Read More buttons, brand names, ordinary tags, or 4-sided card borders.',
        appliesTo: ['page-synthesis', 'staging-audit', 'design-review']
      },
      {
        id: 'FS_CARD_TITLE_HOVER_BLACK_UNDERLINE',
        severity: 'warning',
        category: 'interaction',
        description: 'Clickable card titles stay #19191A on hover with underline (text-underline-offset: 3px); never turn #0060BF blue on hover.',
        appliesTo: ['page-synthesis', 'staging-audit']
      },
      {
        id: 'FS_STATIC_ICON_GRID_NO_BOX_NO_SHADOW',
        severity: 'warning',
        category: 'composition',
        description: 'Non-clickable feature/benefit icon grids should sit directly on the section surface (transparent, no card box, no hover shadow). Never wrap static items in clickable *-single-event cards with hover elevation.',
        appliesTo: ['page-synthesis', 'staging-audit', 'design-review']
      },
      {
        id: 'FS_ICON_STYLE_FAMILY_CONSISTENCY',
        severity: 'error',
        category: 'iconography',
        description: 'Never mix icons from different styleFamily groups (e.g. duotone-line vs duotone-surface vs flat-illustration) within the same section.',
        appliesTo: ['page-synthesis', 'staging-audit', 'design-review']
      },
      {
        id: 'FS_IMAGE_INTEGRITY',
        severity: 'error',
        category: 'media',
        description: 'All content images must load (naturalWidth > 0) with valid aspect ratio and zero solid-color placeholder blocks.',
        appliesTo: ['page-synthesis', 'staging-audit']
      },
      {
        id: 'FS_CTA_HIERARCHY_PARITY',
        severity: 'warning',
        category: 'hierarchy',
        description: 'Same-weight featured horizontal cards on a page must share the same CTA component (TextButton inline-blue-link per FS horizontal card spec), reserving filled-red strictly for lead-gen/purchase conversion CTAs.',
        appliesTo: ['page-synthesis', 'staging-audit', 'design-review']
      }
    ]
  };

  // 2.5 Pure UI Design Principles (Design Values & Review Philosophy)
  const principles = {
    schemaVersion: '1.0.0',
    coreVersion: pkg.version,
    principles: [
      {
        code: '01',
        id: 'precision-and-restraint',
        title: '精准克制',
        enTitle: 'Precision & Restraint',
        summary: 'FS 面向数据中心、企业网络与专业工程师群体，界面应传递理性、严谨、可信赖的工业级专业气质。减少视觉噪音，让产品价值与专业信息成为唯一主角。',
        doList: [
          '以清晰的留白、严谨的栅格秩序与克制的排版层级组织高密度专业信息',
          '用最少、最准确的视觉手段表达信息关系，保持版面冷静与呼吸感',
          '确保图文对比度充足，让阅读与扫视在任何光照环境下都轻松无压力'
        ],
        dontList: [
          '避免为了“看起来丰富”而堆砌装饰性渐变、冗余线条或无意义色块',
          '避免过度炫技、干扰阅读注意力的浮夸动效',
          '避免让形式感压过内容本身，稀释品牌专业可信度'
        ],
        reviewQuestion: '去掉这一处视觉装饰后，核心信息的传达是否反而更清晰、更聚焦？'
      },
      {
        code: '02',
        id: 'clear-visual-hierarchy',
        title: '层级分明',
        enTitle: 'Clear Visual Hierarchy',
        summary: '用户在扫视页面的瞬间，必须能够直观分辨主标题、核心行动、次要说明与辅助信息的轻重主次，绝不让所有元素同时争抢注意力。',
        doList: [
          '通过字号、字重、留白距离与明暗表面关系建立自然的空间纵深',
          '将高饱和品牌主色严格保留给最核心的转化行动与关键指示，确保视觉焦点唯一',
          '在复杂信息模块中通过清晰的分组与对齐，引导自上而下、自左向右的阅读动线'
        ],
        dontList: [
          '避免在同一视口内放置多个同等强度的强视觉按钮互相抢夺焦点',
          '避免主次不同的信息采用完全相同的字号与视觉重量平铺展示',
          '避免背景、容器与边界缺乏清晰反差，导致信息单元糊成一片'
        ],
        reviewQuestion: '进入页面第一眼，用户的视线是否自然落在最关键的信息与核心行动点上？'
      },
      {
        code: '03',
        id: 'consistency-and-predictability',
        title: '一致可预期',
        enTitle: 'Consistency & Predictability',
        summary: '一致性是大型企业站点降低用户认知负荷的根本。相同的交互语义在全站任何场景中都应呈现一致的视觉语言，帮助用户形成稳定的操作直觉。',
        doList: [
          '同等重要性的操作入口、卡片结构与表单交互模式在全站保持一致的视觉权重',
          '同一视觉区域内的图标保持统一的风格体系、线宽与视觉体量',
          '优先沿用用户已经熟悉的成熟交互模式，谨慎引入非必要的新样式变体'
        ],
        dontList: [
          '避免在相近业务场景中各自为战、随意发明新的按钮、标签或卡片样式',
          '避免在同一页面或同一区块内混用风格割裂的图标与控件表面',
          '避免让同等重要性的入口呈现出截然不同的视觉等级'
        ],
        reviewQuestion: '熟悉其他页面的用户，能否无需重新学习就准确预判这里的视觉语义与交互方式？'
      },
      {
        code: '04',
        id: 'honest-affordance',
        title: '诚实反馈',
        enTitle: 'Honest Affordance & Feedback',
        summary: '界面上的每一种视觉暗示都必须诚实——可交互的元素给予清晰、克制、即时的状态反馈，纯阅读的信息保持安静稳定，不制造误导性的交互错觉。',
        doList: [
          '清晰区分可操作元素与静态展示内容，交互反馈精准落在真实可点击区域',
          '为悬停、聚焦、激活、加载与禁用等状态提供自然平滑且符合直觉的视觉响应',
          '错误信息与状态提示明确、具体、就近展示，帮助用户第一时间理解并修正'
        ],
        dontList: [
          '避免给不可点击的纯展示模块叠加悬停浮起、投影或误导性手型光标',
          '避免鼠标经过非操作区域时，提前触发无关链接的下划线或高亮状态',
          '避免用模糊、生硬或缺乏状态过渡的反馈让用户不确定操作是否生效'
        ],
        reviewQuestion: '元素呈现出的样式与交互反馈，是否如实匹配它背后真实的交互能力？'
      },
      {
        code: '05',
        id: 'content-first-clarity',
        title: '内容优先，高效直达',
        enTitle: 'Content First & Clarity',
        summary: '企业级采购与技术选型追求确定性与高效率。设计应帮助用户以最短路径获取真实、完整的产品与方案信息，而不是用包装掩盖核心内容。',
        doList: [
          '优先呈现真实、清晰、比例自然的产品实拍、技术架构图与完整关键说明',
          '围绕用户的真实阅读与选型决策路径组织信息密度，兼顾扫读效率与深度查阅',
          '让视觉结构服务于内容本身的形态，面对特殊信息类型时做出自然得体的版式表达'
        ],
        dontList: [
          '避免为了追求机械对称而强行截断关键文案、拉伸裁切产品或人物主体',
          '避免用空洞的抽象装饰图替代能直接传递业务价值的真实视觉资产',
          '避免把不适配的信息强行塞入固定模板，导致阅读受阻或语义失真'
        ],
        reviewQuestion: '当前设计是在帮助客户更快看懂方案、做出决策，还是在制造额外的阅读阻力？'
      }
    ]
  };

  // 3. Clean Component Catalog Summary (31 components + parent-child dependency graph)
  const componentSummaries = {};
  let callableVariantCount = 0;
  let documentedVariantCount = 0;
  for (const [compKey, comp] of Object.entries(catalog.components || {})) {
    const variants = {};
    for (const [varKey, v] of Object.entries(comp.variants || {})) {
      if (v.callable) callableVariantCount++;
      const whenToUse = v.whenToUse || v.purpose || '';
      const whenNotToUse = v.whenNotToUse || '';
      if (whenToUse) documentedVariantCount++;
      variants[varKey] = {
        callable: Boolean(v.callable),
        type: v.type || '',
        defaultSize: v.defaultSize || null,
        sizeOptions: v.sizeOptions || [],
        whenToUse,
        whenNotToUse,
        allowedEdits: v.allowedEdits || []
      };
    }
    componentSummaries[compKey] = {
      name: comp.name,
      variantCount: Object.keys(variants).length,
      parents: (comp.relationships?.parents || []).map((p) => 'library-' + p.id),
      dependencies: (comp.dependencies || []).map((d) => ({
        component: d.component,
        slot: d.slot,
        requiredVariants: d.requiredVariants || [],
        appliesTo: d.appliesTo || []
      })),
      variants
    };
  }

  // Self-check: ensure we didn't export an empty catalog or blank decision docs
  if (Object.keys(componentSummaries).length < 30 || documentedVariantCount < 100) {
    throw new Error(
      `Export integrity check failed: components=${Object.keys(componentSummaries).length}, documentedVariants=${documentedVariantCount}`
    );
  }

  const exportedCatalog = {
    schemaVersion: '1.0.0',
    coreVersion: pkg.version,
    releaseHash: catalog.version,
    componentCount: Object.keys(componentSummaries).length,
    callableVariantCount,
    documentedVariantCount,
    components: componentSummaries
  };

  // 4. Write all bundle artifacts
  writeJson(path.join(OUT_DIR, 'tokens.json'), tokens);
  writeJson(path.join(OUT_DIR, 'rules.json'), rules);
  writeJson(path.join(OUT_DIR, 'principles.json'), principles);
  writeJson(path.join(OUT_DIR, 'catalog.json'), exportedCatalog);
  writeJson(path.join(OUT_DIR, 'icon-style-families.json'), iconFamilies);
  if (fs.existsSync(designSystemSpecPath)) {
    fs.copyFileSync(designSystemSpecPath, path.join(OUT_DIR, 'fs-design-system.md'));
  }
  if (fs.existsSync(patternsPath)) {
    fs.copyFileSync(patternsPath, path.join(OUT_DIR, 'section-patterns.md'));
  }
  if (fs.existsSync(changelogPath)) {
    fs.copyFileSync(changelogPath, path.join(OUT_DIR, 'CHANGELOG.md'));
  }

  const manifest = {
    name: 'fs-design-core',
    version: pkg.version,
    releaseHash: catalog.version,
    exportedAt: new Date().toISOString(),
    stats: {
      components: exportedCatalog.componentCount,
      callableVariants: exportedCatalog.callableVariantCount,
      documentedVariants: exportedCatalog.documentedVariantCount,
      registeredIcons: Object.keys(iconFamilies.byFile || iconFamilies.icons || iconFamilies.entries || {}).length || iconFamilies.totalIcons || 0,
      cssVariables: tokens.cssVariableCount,
      principles: principles.principles.length,
      rules: rules.rules.length
    },
    files: [
      'README.md',
      'manifest.json',
      'principles.json',
      'tokens.json',
      'rules.json',
      'catalog.json',
      'icon-style-families.json',
      'fs-design-system.md',
      'section-patterns.md',
      'CHANGELOG.md'
    ]
  };
  writeJson(path.join(OUT_DIR, 'manifest.json'), manifest);

  const consumerReadme = `# FS Design Core (v${manifest.version})

> **FS 部门设计规范只读底座包（框架无关 · 零外部依赖）**
> 本目录由 \`npm run core:export\` 自动生成（对应 Release \`${manifest.releaseHash.slice(0, 12)}\`），仅包含机器与人均可直接读取的权威设计规范，不含页面合成脚本或业务测试页。

## 文件速查（按需读取）

| 文件 | 用途 | 适用场景 |
| :--- | :--- | :--- |
| \`tokens.json\` | 布局版心（1200px）、视口（1085/1440/1920）、Open Sans 字号阶梯、颜色、圆角、\`#C00000\` 品牌红允许/禁用边界 | 测试站样式走查、设计稿预审、研发对表 |
| \`rules.json\` | ${manifest.stats.rules} 条框架无关的核心走查规则（零溢出、灰底无描边/白底加描边、禁渐变、按钮权重、图标画风一致、无链接不上盒等） | Vue / 任意前端测试站自动走查、AI 审核 |
| \`catalog.json\` | 全部 ${manifest.stats.components} 族组件、${manifest.stats.callableVariants} 个可调用变体的 \`whenToUse\` / \`whenNotToUse\` / \`allowedEdits\` 与父子依赖图 | 组件选型、设计评审、规范问答 |
| \`icon-style-families.json\` | ${manifest.stats.registeredIcons} 枚官方注册图标的 7 大 \`styleFamily\` 画风分类 | 检查同区块是否混用线性/面性/插画图标 |
| \`section-patterns.md\` | 14 套高频页面区块组合范式（含 Pattern 14 反教条组合规则） | 原型设计、专题页结构评审 |
| \`CHANGELOG.md\` | 语义化版本变更记录 | 下游项目评估升级 |
| \`manifest.json\` | 本包版本号、导出时间与资产统计元数据 | 自动化脚本校验版本 |

## 快速接入方式

- **脚本 / 自动化走查工具**：直接 \`require\` 或 \`JSON.parse\` 读取 \`tokens.json\` + \`rules.json\` + \`icon-style-families.json\`，对照页面渲染后的 Computed Style 与几何坐标执行校验（不依赖任何前端框架或特定 CSS 类名）。
- **AI 助手 / 规范预审 Skill**：将本目录放入项目知识目录，指示 AI：查视觉参数读 \`tokens.json\`、查红线读 \`rules.json\`、查组件禁用边界读 \`catalog.json\`、查区块排布读 \`section-patterns.md\`。
- **维护边界**：本目录为**只读消费包**，请勿在下游项目直接修改；如需调整规范或新增变体，请反馈至上游设计系统维护仓库统一发版。
`;
  fs.writeFileSync(path.join(OUT_DIR, 'README.md'), consumerReadme, 'utf8');

  console.log(
    `Exported fs-design-core v${manifest.version} (release ${manifest.releaseHash.slice(0, 12)}) -> dist/fs-design-core/`
  );
  console.log(
    `  Components: ${manifest.stats.components} | Callable variants: ${manifest.stats.callableVariants} | Icons: ${manifest.stats.registeredIcons} | Rules: ${manifest.stats.rules}`
  );
}

main();
