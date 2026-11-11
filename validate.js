#!/usr/bin/env node
/**
 * FS Design System — Compliance Validator
 *
 * 把"自检清单"从软提醒升级为硬闸门：扫描产出 HTML，命中违规即报错退出。
 *
 * Usage:
 *   node validate.js                      # 校验 fs-components/page-specs/*.html (合规产物)
 *   node validate.js path/to/page.html    # 校验指定文件
 *   node validate.js --strict             # 把 warning 也当作失败
 *
 * 作用域规则：默认同时校验 page-specs/（build.js 的合规产出）和 pages/（index.html 展示的范例页）。
 * pages/ 里挂在 index.html 的示例页被视为范例页，须 0 error；详见 design-spec/fs-design-system.md Section 8。
 *
 * Zero dependencies — 只用 Node.js 内置模块。
 */

'use strict';

const fs = require('fs');
const path = require('path');

const PAGE_SPECS_DIR = path.join(__dirname, 'fs-components', 'page-specs');
const PAGES_DIR = path.join(__dirname, 'pages');

// ─────────────────────────────────────────────
// 规范常量（单一事实源：design-spec/fs-design-system.md）
// ─────────────────────────────────────────────
const ALLOWED_SURFACE_BG = ['#ffffff', '#fff', '#fafbfb', '#19191a', '#4b4b4d'];
const ALLOWED_FONT_WEIGHTS = ['400', '600', 'normal'];
const CANONICAL_NAV_LINKS = ['All Products', 'Solutions', 'Services', 'Resources', 'Contact Us'];
const FS_LOGO = 'icon-logo-fs.svg';

// 检查①：纯布局骨架白名单（非 ds-*，但合法）。其余非 ds-* 主结构 class 一律报错。
const SCAFFOLD_CLASSES = new Set([
  'container',
  'page-section', 'page-section--white', 'page-section--gray',
  'section-header', 'section-header__title', 'section-header__desc',
  'grid', 'grid-2', 'grid-3', 'grid-4',
  'center-link', 'hero-quick-links', 'carousel-row',
  'is-prev', 'is-next', 'is-active', 'active',
]);

// 检查②：被视为"组件级"的 CSS 属性。自定义 class 设置这些属性又与 ds-* 同元素并用 = 覆盖嫌疑。
const COMPONENT_PROPS = ['padding', 'height', 'margin', 'color', 'font-size', 'font-weight', 'border', 'border-radius', 'background'];

// 检查③：已知组件子元素的规定标签（规范固定）。用错标签即报错。
const COMPONENT_TAG_RULES = [
  { cls: 'ds-icon-card__blue-link', tag: 'p' },
];

// 检查②(a)：只有"改组件视觉属性"才算违规重定义；纯布局定位（position/margin 等）是允许的骨架行为。
const VISUAL_PROPS = ['color', 'background', 'background-color', 'border', 'border-radius', 'box-shadow', 'font-size', 'font-weight', 'font-family', 'text-decoration'];

// ─────────────────────────────────────────────
// 工具：hex → HSL，用于判断"是否为彩色"（高饱和度）
// ─────────────────────────────────────────────
function hexToHsl(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length !== 6) return null;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  }
  return { s, l };
}

// 是否为"彩色"（非灰阶）背景
function isChromaticBg(hex) {
  const hsl = hexToHsl(hex);
  if (!hsl) return false;
  return hsl.s > 0.15;
}

// 计算某个字符串索引所在行号
function lineOf(html, index) {
  return html.slice(0, index).split('\n').length;
}

// ─────────────────────────────────────────────
// 各项检查（返回 issue 列表：{level, code, msg, line}）
// ─────────────────────────────────────────────

// 1. 依赖样式表必须引入
function checkStylesheets(html) {
  const issues = [];
  if (!/tokens\.css/.test(html)) {
    issues.push({ level: 'error', code: 'CSS_TOKENS', msg: '缺少 tokens.css 引用' });
  }
  if (!/components\.css/.test(html)) {
    issues.push({ level: 'error', code: 'CSS_COMPONENTS', msg: '缺少 components.css 引用' });
  }
  return issues;
}

// 2. Header / Footer 完整性（Rule 0）
function checkHeaderFooter(html) {
  const issues = [];
  const hasHeader = /class="ds-nav-header"|data-fragment="header"/.test(html);
  const hasFooter = /class="ds-nav-footer"|data-fragment="footer"/.test(html);
  if (!hasHeader) issues.push({ level: 'error', code: 'NAV_HEADER', msg: '缺少 FS header（ds-nav-header）' });
  if (!hasFooter) issues.push({ level: 'error', code: 'NAV_FOOTER', msg: '缺少 FS footer（ds-nav-footer）' });

  // 如果是注入占位（data-fragment）则跳过逐字校验（build.js 会注入标准片段）
  const isInjected = /data-component="navigation"/.test(html);
  if (hasHeader && !isInjected) {
    // 标准导航项必须存在
    const headerMatch = html.match(/<header[^>]*class="ds-nav-header"[\s\S]*?<\/header>/);
    const headerHtml = headerMatch ? headerMatch[0] : '';
    for (const link of CANONICAL_NAV_LINKS) {
      if (headerHtml && !headerHtml.includes(link)) {
        issues.push({ level: 'error', code: 'NAV_LINK', msg: `header 缺少标准导航项 "${link}"（Rule 0：导航项不可改）` });
      }
    }
    if (headerHtml && !headerHtml.includes(FS_LOGO)) {
      issues.push({ level: 'error', code: 'NAV_LOGO', msg: `header logo 必须是标准 ${FS_LOGO}（Rule 0：不可替换 logo）` });
    }
    if (/ds-btn--filled-red/.test(headerHtml)) {
      issues.push({ level: 'error', code: 'NAV_RED_CTA', msg: 'header 内禁止出现红色 CTA（ds-btn--filled-red）' });
    }
  }
  return issues;
}

// 3. 字重只允许 400 / 600
function checkFontWeights(html) {
  const issues = [];
  const re = /font-weight:\s*([a-z0-9]+)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const w = m[1].toLowerCase();
    if (!ALLOWED_FONT_WEIGHTS.includes(w)) {
      issues.push({ level: 'error', code: 'FONT_WEIGHT', msg: `非法字重 font-weight: ${m[1]}（只允许 400 / 600）`, line: lineOf(html, m.index) });
    }
  }
  return issues;
}

// 4. 背景色：surface 背景只允许 白/灰/深色；彩色背景一律报错，灰阶占位提示
function checkBackgrounds(html) {
  const issues = [];
  const re = /background(?:-color)?:\s*([^;"'}]+)/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const val = m[1].trim().toLowerCase();
    const hexMatch = val.match(/#[0-9a-f]{3,6}\b/);
    if (!hexMatch) continue; // 跳过 url()/渐变/rgba/变量
    const hex = hexMatch[0];
    if (ALLOWED_SURFACE_BG.includes(hex)) continue;
    if (isChromaticBg(hex)) {
      issues.push({ level: 'error', code: 'BG_CHROMATIC', msg: `非法彩色背景 ${hex}（surface 背景只允许 #FFFFFF / #FAFBFB / #19191A / #4B4B4D）`, line: lineOf(html, m.index) });
    } else {
      issues.push({ level: 'warn', code: 'BG_GRAY', msg: `非系统灰阶背景 ${hex}（建议用占位图或系统色；如为图片占位可忽略）`, line: lineOf(html, m.index) });
    }
  }
  return issues;
}

// 5. 横向卡片不得带边框类
function checkGradients(html) {
  const issues = [];
  const re = /(?:linear|radial|conic)-gradient\s*\(/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    issues.push({ level: 'error', code: 'BG_GRADIENT', msg: 'UI surface 禁止使用渐变背景（gradient）', line: lineOf(html, m.index) });
  }
  return issues;
}

function checkHorizontalCardBorder(html) {
  const issues = [];
  const re = /class="([^"]*ds-card--horizontal[^"]*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const cls = m[1];
    if (/ds-card--bordered(-full)?\b/.test(cls)) {
      issues.push({ level: 'error', code: 'HCARD_BORDER', msg: '横向卡片不得带边框类（ds-card--bordered/-full）', line: lineOf(html, m.index) });
    }
  }
  return issues;
}

// 6. page-section 颜色必须白↔灰交替，不能连续同色
function checkSectionAlternation(html) {
  const issues = [];
  const re = /class="[^"]*page-section--(white|gray)[^"]*"/g;
  let m;
  let prev = null;
  while ((m = re.exec(html)) !== null) {
    const color = m[1];
    if (prev === color) {
      issues.push({ level: 'warn', code: 'SECTION_ALT', msg: `连续两个 ${color} section（应白↔灰交替）`, line: lineOf(html, m.index) });
    }
    prev = color;
  }
  return issues;
}

// 7. 手写内联 <svg>（应使用图标库文件）——告警
function checkInlineSvg(html) {
  const issues = [];
  const re = /<svg\b/gi;
  let count = 0;
  while (re.exec(html) !== null) count++;
  if (count > 0) {
    issues.push({ level: 'warn', code: 'INLINE_SVG', msg: `发现 ${count} 处内联 <svg>（规则：图标应来自 icons/ 文件；navigation 自带 chevron 可忽略）` });
  }
  return issues;
}

// 8. 容器宽度
function checkContainer(html) {
  const issues = [];
  if (!/max-width:\s*1200px/.test(html)) {
    issues.push({ level: 'warn', code: 'CONTAINER', msg: '未发现 max-width: 1200px 容器（规范要求内容宽度 1200px）' });
  }
  return issues;
}

// 工具：遍历所有 class="..." 属性
function eachClassAttr(html, cb) {
  const re = /class="([^"]*)"/g;
  let m;
  while ((m = re.exec(html)) !== null) cb(m[1], m.index);
}

// 9. 检查①：主结构出现非 ds-* 且非布局骨架的"野生"自定义组件 class
//    精准信号：自定义 class 带 BEM 元素命名（含 "__"）= 在自造组件子结构。
//    纯布局类（如 products-grid / solutions-list，无 "__"）属允许的骨架，不报。
function checkRogueClasses(html) {
  const issues = [];
  const seen = new Set();
  eachClassAttr(html, (clsStr, idx) => {
    for (const t of clsStr.split(/\s+/).filter(Boolean)) {
      if (t.startsWith('ds-')) continue;
      if (SCAFFOLD_CLASSES.has(t)) continue;
      if (!t.includes('__')) continue; // 只针对 BEM 元素命名（自造组件子结构）
      if (seen.has(t)) continue;
      seen.add(t);
      issues.push({ level: 'error', code: 'ROGUE_CLASS', msg: `自造组件 class "${t}"（含 __ 的 BEM 元素，说明在手搓组件）—— 主结构必须用 ds-* 组件`, line: lineOf(html, idx) });
    }
  });
  return issues;
}

// 10. 检查②：页面 CSS 覆盖 ds-* 组件样式 / 自定义 class 与 ds-* 同元素并用覆盖组件属性
function checkDsOverride(html) {
  const issues = [];
  const overrideClasses = new Set();
  const sre = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sm;
  while ((sm = sre.exec(html)) !== null) {
    const css = sm[1].replace(/\/\*[\s\S]*?\*\//g, ''); // 先剥离 CSS 注释，避免注释里的 ds- 被误判
    const base = sm.index;
    const rre = /([^{}]+)\{([^}]*)\}/g;
    let rm;
    while ((rm = rre.exec(css)) !== null) {
      const selector = rm[1].trim();
      const decls = rm[2];
      // (a) 选择器"末端（被设样式的元素）"命中 ds-*，且改了视觉属性 → 禁止在页面里改组件视觉
      if (/\.ds-[\w-]+/.test(selector)) {
        const compounds = selector.split(/[\s>+~]+/).filter(Boolean);
        const key = compounds[compounds.length - 1] || '';
        const keyTargetsDs = /\.ds-[\w-]+/.test(key);
        const hasVisual = VISUAL_PROPS.some(p => new RegExp('(^|[;{\\s])' + p.replace(/-/g, '\\-') + '\\s*:', 'i').test(decls));
        if (keyTargetsDs && hasVisual) {
          issues.push({ level: 'error', code: 'DS_RESTYLE', msg: `页面 CSS 覆盖组件视觉属性 "${selector.slice(0, 60)}"（禁止在页面里改 ds-* 组件外观；布局定位除外）`, line: lineOf(html, base + rm.index) });
        }
      }
      // 收集"设置了组件级属性"的自定义 class
      const hasCompProp = COMPONENT_PROPS.some(p => new RegExp('(^|[;{\\s])' + p + '\\s*:', 'i').test(decls));
      if (hasCompProp) {
        const clsTokens = selector.match(/\.([A-Za-z0-9_-]+)/g) || [];
        for (const c of clsTokens) {
          const name = c.slice(1);
          if (!name.startsWith('ds-') && !SCAFFOLD_CLASSES.has(name)) overrideClasses.add(name);
        }
      }
    }
  }
  // (b) 同元素并用：class 同时含 ds-* 与某个 overrideClass
  if (overrideClasses.size > 0) {
    const seen = new Set();
    eachClassAttr(html, (clsStr, idx) => {
      const tokens = clsStr.split(/\s+/).filter(Boolean);
      if (!tokens.some(t => t.startsWith('ds-'))) return;
      for (const t of tokens) {
        if (overrideClasses.has(t) && !seen.has(t)) {
          seen.add(t);
          issues.push({ level: 'error', code: 'DS_OVERRIDE', msg: `自定义 class "${t}" 与 ds-* 同元素并用并覆盖组件属性（padding/height/color…），值可能偏离规范 — 请核对`, line: lineOf(html, idx) });
        }
      }
    });
  }
  return issues;
}

// 11. 检查③：已知组件子元素用错标签
function checkComponentTag(html) {
  const issues = [];
  for (const rule of COMPONENT_TAG_RULES) {
    const re = new RegExp('<(\\w+)\\b[^>]*class="[^"]*\\b' + rule.cls.replace(/[-]/g, '\\-') + '\\b[^"]*"', 'gi');
    let m;
    while ((m = re.exec(html)) !== null) {
      const tag = m[1].toLowerCase();
      if (tag !== rule.tag) {
        issues.push({ level: 'error', code: 'WRONG_TAG', msg: `组件元素 .${rule.cls} 必须用 <${rule.tag}>，当前是 <${tag}>`, line: lineOf(html, m.index) });
      }
    }
  }
  return issues;
}

// 12. 白字压在背景图上必须有纯色深色遮罩（box-shadow:inset rgba 或 rgba 遮罩层；禁 gradient）
//     只在"有背景图 + 白字信号"时触发，避免误报无文字的背景图。
function checkImageOverlay(html) {
  const issues = [];
  const re = /style="([^"]*background-image\s*:\s*url\([^"]*)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const style = m[1];
    // 同元素 style 内已有深色 inset 遮罩 → 合规
    const hasInsetScrim = /box-shadow\s*:\s*inset[^;"]*rgba\(\s*0\s*,\s*0\s*,\s*0/i.test(style);
    if (hasInsetScrim) continue;
    // 判断该 banner 上是否有白字（限定触发条件，避免误报）
    const win = html.slice(m.index, m.index + 2000);
    const whiteText = /ds-banner__title|ds-btn--outline-white|#ffffff\b|#fff\b|color\s*:\s*white/i.test(win);
    // 或存在独立的 rgba(0,0,0) 遮罩层 → 也算合规
    const hasOverlayLayer = /background(?:-color)?\s*:\s*rgba\(\s*0\s*,\s*0\s*,\s*0/i.test(win);
    if (whiteText && !hasOverlayLayer) {
      issues.push({ level: 'error', code: 'IMG_OVERLAY', msg: '白字压在背景图上但缺少深色遮罩（需 box-shadow: inset 0 0 0 2000px rgba(0,0,0,0.45~0.55) 或 rgba 遮罩层；禁用 gradient）', line: lineOf(html, m.index) });
    }
  }
  return issues;
}

// 13. 资源相对路径深度必须与文件所在目录匹配（防止跨目录搬运后链接放错）
//     pages/（根目录下）        → 资源用 ../fs-components/component-specs/…
//     fs-components/page-specs/ → 资源用 ../component-specs/…
//     两者差一层；用错前缀 = 链接断 → 报 error。
function checkAssetPathDepth(html, filePath) {
  const issues = [];
  if (!filePath) return issues;
  const norm = filePath.replace(/\\/g, '/');
  const inPages = /(^|\/)pages\/[^/]+\.html$/.test(norm);
  const inSpecs = /(^|\/)fs-components\/page-specs\/[^/]+\.html$/.test(norm);

  if (inPages) {
    const bad = '../component-specs/'; // page-specs 深度的写法，pages/ 用错了
    const idx = html.indexOf(bad);
    if (idx !== -1) {
      issues.push({ level: 'error', code: 'ASSET_PATH', msg: `pages/ 页面资源路径写成了 "${bad}…"（这是 page-specs 深度），应为 "../fs-components/component-specs/…"`, line: lineOf(html, idx) });
    }
  } else if (inSpecs) {
    const bad = '../fs-components/component-specs/'; // pages 深度的写法，page-specs/ 用错了
    const idx = html.indexOf(bad);
    if (idx !== -1) {
      issues.push({ level: 'error', code: 'ASSET_PATH', msg: `page-specs/ 页面资源路径写成了 "${bad}…"（这是 pages 深度），应为 "../component-specs/…"`, line: lineOf(html, idx) });
    }
  }
  return issues;
}

// 15. icon-bullet 必须用组件类 ds-card__bullet-icon，且不得 inline 写死尺寸
//     （历史 bug：手写 <img style="width:16px"> 把 4px 圆点撑成大灰球）
function checkBulletIcon(html) {
  const issues = [];
  const re = /<img\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    if (!/icon-bullet\.svg/.test(tag)) continue;
    if (!/\bds-card__bullet-icon\b/.test(tag)) {
      issues.push({ level: 'error', code: 'BULLET_CLASS', msg: 'icon-bullet.svg 必须用组件类 ds-card__bullet-icon（禁止裸 <img>）', line: lineOf(html, m.index) });
    }
    if (/\b(?:width|height)\s*=/.test(tag) || /(?:^|[;"\s])(?:width|height)\s*:/.test(tag)) {
      issues.push({ level: 'error', code: 'BULLET_SIZE', msg: 'icon-bullet.svg 禁止 inline 写死 width/height（尺寸由 ds-card__bullet-icon 控制；手写会把 4px 圆点撑大）', line: lineOf(html, m.index) });
    }
  }
  return issues;
}

// 16. anchor-nav tab 用 <a> 时必须 text-decoration: none
//     （历史 bug：把 <div> 改成 <a> 引入浏览器默认下划线，组件类不重置）
function checkAnchorTabUnderline(html) {
  const issues = [];
  const re = /<a\b[^>]*\bds-anchor-nav__tab\b[^>]*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (!/text-decoration\s*:\s*none/i.test(m[0])) {
      issues.push({ level: 'error', code: 'ANCHOR_TAB_UNDERLINE', msg: 'ds-anchor-nav__tab 用 <a> 时必须加 text-decoration: none（否则出现默认下划线）；或改用 <div>', line: lineOf(html, m.index) });
    }
  }
  return issues;
}

// 17. ds-* 元素上 inline 覆盖文本视觉（color/font-size）= 偏离组件/token（warn）
//     （历史 bug：卡片描述手写 color:#4B4B4D，应走 ds-card__desc=#707070）
function checkDsInlineTextStyle(html) {
  const issues = [];
  const re = /<(\w+)\b([^>]*\bclass="[^"]*\bds-[\w-]+[^"]*"[^>]*)>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const styleMatch = m[2].match(/style="([^"]*)"/i);
    if (!styleMatch) continue;
    const style = styleMatch[1];
    if (/(^|[;{\s])color\s*:/i.test(style) || /(^|[;{\s])font-size\s*:/i.test(style)) {
      issues.push({ level: 'warn', code: 'DS_INLINE_TEXT', msg: 'ds-* 元素上 inline 写了 color/font-size（应走组件文本类或 token，如 ds-card__desc=#707070）', line: lineOf(html, m.index) });
    }
  }
  return issues;
}

// 18. section-header__desc 版心必须 960px（统一规范，防止 800/960 值漂移）
function checkSectionDescWidth(html) {
  const issues = [];
  const sre = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sm;
  while ((sm = sre.exec(html)) !== null) {
    const css = sm[1];
    const rre = /\.section-header__desc\s*\{([^}]*)\}/g;
    let rm;
    while ((rm = rre.exec(css)) !== null) {
      const mw = rm[1].match(/max-width\s*:\s*(\d+)px/i);
      if (mw && mw[1] !== '960') {
        issues.push({ level: 'error', code: 'SECTION_DESC_WIDTH', msg: `section 描述版心必须 960px，当前 ${mw[1]}px`, line: lineOf(html, sm.index + rm.index) });
      }
    }
  }
  return issues;
}

// ─────────────────────────────────────────────
// 运行所有检查
// ─────────────────────────────────────────────
const CHECKS = [
  checkBulletIcon,
  checkAnchorTabUnderline,
  checkDsInlineTextStyle,
  checkSectionDescWidth,
  checkStylesheets,
  checkHeaderFooter,
  checkFontWeights,
  checkBackgrounds,
  checkGradients,
  checkHorizontalCardBorder,
  checkSectionAlternation,
  checkInlineSvg,
  checkContainer,
  checkRogueClasses,
  checkDsOverride,
  checkComponentTag,
  checkImageOverlay,
  checkAssetPathDepth,
];

function validateFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  let issues = [];
  for (const check of CHECKS) {
    issues = issues.concat(check(html, filePath));
  }
  return issues;
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const fileArgs = args.filter(a => !a.startsWith('--'));

  let targets = [];
  if (fileArgs.length > 0) {
    targets = fileArgs.map(f => path.resolve(f));
  } else {
    // 默认扫描合规产物 page-specs/ + 测试页 pages/（用户要求把检查扩进 pages/）
    const dirs = [PAGE_SPECS_DIR, PAGES_DIR];
    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        targets = targets.concat(
          fs.readdirSync(dir)
            .filter(f => f.endsWith('.html'))
            .map(f => path.join(dir, f))
        );
      }
    }
    if (targets.length === 0) {
      console.log('No page-specs/ or pages/ HTML to validate.');
      process.exit(0);
    }
  }

  if (targets.length === 0) {
    console.log('No HTML files to validate.');
    process.exit(0);
  }

  let totalErrors = 0;
  let totalWarns = 0;

  for (const file of targets) {
    if (!fs.existsSync(file)) {
      console.error(`✗ File not found: ${file}`);
      totalErrors++;
      continue;
    }
    const issues = validateFile(file);
    const errors = issues.filter(i => i.level === 'error');
    const warns = issues.filter(i => i.level === 'warn');
    totalErrors += errors.length;
    totalWarns += warns.length;

    const rel = path.relative(__dirname, file);
    if (issues.length === 0) {
      console.log(`✓ ${rel} — 合规通过`);
    } else {
      console.log(`\n${rel}`);
      for (const e of errors) {
        console.log(`  ✗ ERROR [${e.code}]${e.line ? ` (line ${e.line})` : ''}: ${e.msg}`);
      }
      for (const w of warns) {
        console.log(`  ⚠ WARN  [${w.code}]${w.line ? ` (line ${w.line})` : ''}: ${w.msg}`);
      }
    }
  }

  console.log(`\n────────────────────────────────────`);
  console.log(`校验完成：${targets.length} 个文件，${totalErrors} 个 error，${totalWarns} 个 warning`);

  if (totalErrors > 0 || (strict && totalWarns > 0)) {
    console.log('结果：未通过 ✗');
    process.exit(1);
  }
  console.log('结果：通过 ✓');
  process.exit(0);
}

if (require.main === module) {
  main();
}

// 导出供测试
if (typeof module !== 'undefined') {
  module.exports = { hexToHsl, isChromaticBg, validateFile, CHECKS, checkAssetPathDepth };
}
