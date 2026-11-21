#!/usr/bin/env node
/**
 * FS Design System — Component Contract Consistency Checker
 *
 * 二期投喂流程的标准步骤之一：每次新增/修改 spec/component-specs/*.json 后必须跑一次。
 * 只做机械事实核对，不做语义判断（语义对不对靠人审，这里只管"引用的东西是否真实存在"）。
 *
 * Usage:
 *   node scripts/check-contracts.js
 *
 * 检查项：
 *   1. componentDependencies 引用的组件名，必须能在其他契约文件的 "name" 字段中找到
 *   2. iconDependencies 引用的图标文件，必须真实存在于 component-specs/icons/ 目录
 *   3. isComplete=true 时 pendingParts 必须为空（逻辑一致性，不能又说完整又留着未完成项）
 *   4. searchIntents 在全部契约文件之间不能重复（多人投喂时最容易撞车的字段）
 *   7. relations 存在时必须有 enforcementStatus 字段，且每条规则性字段（parentContext /
 *      componentDependencies / mutuallyExclusiveWith / siblingRule / variantSelectionRules）
 *      都要在 enforcementStatus 里能找到至少一条对应的登记项——不要求全部 enforced:true，
 *      但必须"写了没写机械化"这件事本身被记录下来，不能完全没提
 *
 * Zero dependencies — 只用 Node.js 内置模块。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { requestedDependencyReady } = require('./component-dependency-readiness');

const SPEC_DIR = path.join(__dirname, '..', 'components', 'contracts');
const ICONS_DIR = path.join(__dirname, '..', 'components', 'icons');
const COLORS_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'colors.json');
const RADIUS_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'border-radius.json');
const TYPOGRAPHY_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'typography.json');
const SHADOWS_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'shadows.json');
const SPACING_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'spacing.json');
const BORDER_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'border.json');
const TOKENS_CSS = path.join(__dirname, '..', 'components', 'tokens.css');

function loadAll() {
  if (!fs.existsSync(SPEC_DIR)) {
    console.error(`ERROR: 契约目录不存在: ${SPEC_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(SPEC_DIR).filter((f) => f.endsWith('.json'));
  const contracts = [];
  for (const f of files) {
    const full = path.join(SPEC_DIR, f);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      console.error(`ERROR: ${f} 不是合法 JSON: ${e.message}`);
      process.exit(1);
    }
    contracts.push({ file: f, data });
  }
  return contracts;
}

function loadIconNames() {
  if (!fs.existsSync(ICONS_DIR)) return new Set();
  return new Set(
    fs.readdirSync(ICONS_DIR)
      .filter((f) => f.endsWith('.svg'))
      .map((f) => f.replace(/\.svg$/, ''))
  );
}

// 颜色 token 名→{value, cssVar}（token-specs/colors.json，权威声明源）
// cssVar 为每个 token 显式声明的 tokens.css 变量名（方案 1：一一映射，不再靠命名推导）
function loadColorTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(COLORS_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => map.set(t.name, { value: t.value, cssVar: t.cssVar }));
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

// tokens.css 里的 CSS 自定义属性名→值（运行时源）
// 不限 --color-*：颜色映射目标可能是 --brand-red 等非 color- 前缀变量
function loadCssColorVars() {
  const map = new Map();
  try {
    const css = fs.readFileSync(TOKENS_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(css)) !== null) map.set(m[1].trim(), m[2].trim());
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

const normColor = (v) => String(v).replace(/\s+/g, '').toLowerCase();

// 圆角 token 名→值（token-specs/border-radius.json，权威声明源）；value 组合 unit
function loadRadiusTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(RADIUS_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => {
      const value = (typeof t.value === 'number' && t.unit) ? `${t.value}${t.unit}` : String(t.value);
      map.set(t.name, value);
    });
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

// 字号 token（token-specs/typography.json 里 font-size-* 那部分）名→值
function loadFontSizeTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(TYPOGRAPHY_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => {
      if (!/font-size/.test(t.name)) return;
      const value = (typeof t.value === 'number' && t.unit) ? `${t.value}${t.unit}` : String(t.value);
      map.set(t.name, value);
    });
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

// Composite typography token 名→完整字体值与底层 primitive 证据。
function loadTypographyCompositeTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(TYPOGRAPHY_JSON, 'utf8'));
    (data.compositeTokens || []).forEach((t) => {
      map.set(t.name, {
        value: t.value || {},
        primitiveReferences: t.primitiveReferences || {},
      });
    });
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

// 投影 token 名→值
function loadShadowTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(SHADOWS_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => map.set(t.name, String(t.value)));
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

const COMPONENTS_CSS = path.join(__dirname, '..', 'components', 'components.css');

// 契约名 → components.css 横幅里的类前缀标记（当二者不同名时显式映射）。
// 缺省用 ds-<id>；下列组件的 CSS 类名与契约名不一致，必须显式登记，否则切不出样式段、check 2c 会静默跳过。
const CSS_SECTION_MARKER = {
  'button': 'ds-btn',
  'icon-button': 'ds-icon-btn',
  'text-button': 'ds-text-btn',
  'video-button': 'ds-video-btn',
  'navigation': 'ds-nav',
};

// 按 banner 注释分节，取出某组件在 components.css 里的样式段（含其从属类，如 collapse 的 ds-toggle）
function extractComponentCssSection(id) {
  let css;
  try { css = fs.readFileSync(COMPONENTS_CSS, 'utf8'); } catch (e) { return null; }
  const bannerRe = /\/\*\s*={5,}[\s\S]*?={5,}\s*\*\//g;
  const banners = [];
  let m;
  while ((m = bannerRe.exec(css)) !== null) banners.push({ text: m[0], start: m.index, end: m.index + m[0].length });
  const marker = CSS_SECTION_MARKER[id] || `ds-${id}`;
  for (let i = 0; i < banners.length; i++) {
    if (banners[i].text.includes(marker)) {
      const s = banners[i].end;
      const e = (i + 1 < banners.length) ? banners[i + 1].start : css.length;
      return css.slice(s, e);
    }
  }
  return null;
}

// 提取组件 CSS 段里用到的颜色 var(--color-*) 和裸色值字面量（先剥掉注释与 shadow，避免误报）
function scanCssColors(sectionCss) {
  let s = sectionCss.replace(/\/\*[\s\S]*?\*\//g, '');
  s = s.replace(/(box-shadow|text-shadow)\s*:[^;]*;/g, '');
  const varsUsed = new Set();
  const literals = new Set();
  let m;
  const varRe = /var\(\s*(--color-[\w-]+)\s*\)/g;
  while ((m = varRe.exec(s)) !== null) varsUsed.add(m[1]);
  const litRe = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;
  while ((m = litRe.exec(s)) !== null) literals.add(m[0]);
  return { varsUsed, literals };
}

// 提取组件 CSS 段里 border-radius 声明用到的 var(--border-radius-*) 与裸圆角值（px/%/em，0 除外；先剥注释）
function scanCssRadius(sectionCss) {
  const s = sectionCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const varsUsed = new Set();
  const literals = new Set();
  const declRe = /border-radius\s*:\s*([^;}]+)/gi;
  let m;
  while ((m = declRe.exec(s)) !== null) {
    const val = m[1].trim();
    let vm;
    const vr = /var\(\s*(--border-radius-[\w-]+)\s*\)/g;
    while ((vm = vr.exec(val)) !== null) varsUsed.add(vm[1]);
    // 去掉 var(...) 后找剩余的长度/百分比字面量，跳过 0
    const stripped = val.replace(/var\([^)]*\)/g, ' ');
    const litRe = /\d*\.?\d+(?:px|%|em|rem)/g;
    let lm;
    while ((lm = litRe.exec(stripped)) !== null) {
      if (/^0(?:px|%|em|rem)?$/.test(lm[0])) continue;
      literals.add(lm[0]);
    }
  }
  return { varsUsed, literals };
}

// 提取组件 CSS 段里 font-size 声明用到的 var(--font-size-*) 与裸字号值（先剥注释）
function scanCssFontSize(sectionCss) {
  const s = sectionCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const varsUsed = new Set();
  const literals = new Set();
  const declRe = /font-size\s*:\s*([^;}]+)/gi;
  let m;
  while ((m = declRe.exec(s)) !== null) {
    const val = m[1].trim();
    const vm = val.match(/var\(\s*(--font-size-[\w-]+)\s*\)/);
    if (vm) { varsUsed.add(vm[1]); continue; }
    const lit = val.match(/\d*\.?\d+(?:px|rem|em)/);
    if (lit) literals.add(lit[0]);
  }
  return { varsUsed, literals };
}

// 提取组件 CSS 段里 box-shadow 声明用到的 var(--shadow-*) 与裸投影值（none 除外；先剥注释）
function scanCssShadow(sectionCss) {
  const s = sectionCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const varsUsed = new Set();
  const literals = new Set();
  const declRe = /box-shadow\s*:\s*([^;}]+)/gi;
  let m;
  while ((m = declRe.exec(s)) !== null) {
    const val = m[1].trim();
    if (/^none$/i.test(val)) continue;
    const vm = val.match(/var\(\s*(--shadow-[\w-]+)\s*\)/);
    if (vm) { varsUsed.add(vm[1]); continue; }
    literals.add(val);
  }
  return { varsUsed, literals };
}

function loadDependencyTokens(filePath) {
  const byName = new Map();
  const byVar = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    (data.tokens || []).forEach((t) => {
      const value = (typeof t.value === 'number' && t.unit) ? `${t.value}${t.unit}` : String(t.value);
      const entry = { ...t, value };
      byName.set(t.name, entry);
      byVar.set(t.cssVar, entry);
    });
  } catch (e) { /* 由 validate-tokens 负责源文件错误 */ }
  return { byName, byVar };
}

const isSpacingProperty = (property) => /^(?:gap|row-gap|column-gap|padding(?:-(?:top|right|bottom|left))?|margin(?:-(?:top|right|bottom|left))?)$/.test(property);
// Positional offsets can be token-backed spacing evidence, but legacy raw
// pixel offsets remain intentionally outside the raw-value lint so existing
// component geometry is not reclassified as a token error.
const isPositionalSpacingProperty = (property) => /^(?:inset|top|right|bottom|left)$/.test(property);
const isBorderProperty = (property) => /^border(?:-(?:top|right|bottom|left))?(?:-(?:width|style|color))?$/.test(property);
// MasterGo inside strokes can be rendered without consuming padding by a
// zero-offset, zero-blur inset spread. Ordinary shadows remain shadow evidence.
const isInsetBorderStroke = (property, value) => property === 'box-shadow' && /^inset\s+0\s+0\s+0\s+var\(\s*--border-width-[\w-]+\s*\)\s+var\(\s*--border-color-[\w-]+\s*\)$/.test(value);

function scanCssDependencyEvidence(sectionCss, kind) {
  const occurrences = [];
  const rawValues = [];
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let rule;
  while ((rule = ruleRe.exec(sectionCss)) !== null) {
    const selectors = rule[1].replace(/\/\*[\s\S]*?\*\//g, '').split(',').map((s) => s.trim()).filter(Boolean);
    const declRe = /([\w-]+)\s*:\s*([^;{}]+);?/g;
    let decl;
    while ((decl = declRe.exec(rule[2])) !== null) {
      const property = decl[1];
      const value = decl[2].trim();
      const relevant = kind === 'spacing'
        ? isSpacingProperty(property) || isPositionalSpacingProperty(property)
        : kind === 'border' ? isBorderProperty(property) || isInsetBorderStroke(property, value) : property === 'font-weight';
      if (!relevant) continue;
      const varRe = kind === 'spacing'
        ? /var\(\s*(--spacing-[\w-]+)\s*\)/g
        : kind === 'border' ? /var\(\s*(--border-[\w-]+)\s*\)/g : /var\(\s*(--font-weight-[\w-]+)\s*\)/g;
      let variable;
      while ((variable = varRe.exec(value)) !== null) occurrences.push({ variable: variable[1], property, selectors });
      const stripped = value.replace(/var\(\s*--(?:spacing|border|font-weight)-[\w-]+\s*\)/g, ' ');
      const rawRe = kind === 'spacing'
        ? (isSpacingProperty(property) ? /\b\d*\.?\d+px\b/g : null)
        : kind === 'border' ? /\b\d*\.?\d+px\b|\b(?:solid|none|transparent)\b|var\(\s*(?:--color-[\w-]+|--brand-red)\s*\)/g : /\b(?:[1-9]00|normal|bold|bolder|lighter)\b/g;
      if (!rawRe) continue;
      let raw;
      while ((raw = rawRe.exec(stripped)) !== null) {
        if (/^0(?:\.0+)?px$/.test(raw[0])) continue;
        rawValues.push({ property, value: raw[0], selectors });
      }
    }
  }
  return { occurrences, rawValues };
}

const SUMMARY_DEPENDENCY_KEYS = [
  'colorDependencies',
  'fontSizeDependencies',
  'fontWeightDependencies',
  'typographyDependencies',
  'spacingDependencies',
  'borderDependencies',
  'radiusDependencies',
  'shadowDependencies',
  'iconDependencies',
];
const FORBIDDEN_SUMMARY_TARGETS = new Set(['__component__', '组件级（未细分变体）']);

function getSummaryRowNames(contract) {
  const rows = Array.isArray(contract.types) && contract.types.length > 0
    ? contract.types
    : (contract.variants || []);
  return new Set(rows.map((row) => row.name).filter(Boolean));
}

function scanTokenVarSyntax(sectionCss) {
  const css = sectionCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const malformed = new Set();
  const vars = new Set();
  let match;
  const malformedRe = /var\(\s*(--[\w-]*-var)\s*\(/g;
  while ((match = malformedRe.exec(css)) !== null) malformed.add(match[0]);
  const tokenVarRe = /var\(\s*(--(?:spacing-[\w-]+|border-(?!radius-)[\w-]+))\b/g;
  while ((match = tokenVarRe.exec(css)) !== null) vars.add(match[1]);
  return { malformed, vars };
}

function main() {
  const contracts = loadAll();
  const iconNames = loadIconNames();
  const colorTokens = loadColorTokens();
  const radiusTokens = loadRadiusTokens();
  const fontSizeTokens = loadFontSizeTokens();
  const typographyCompositeTokens = loadTypographyCompositeTokens();
  const fontWeightTokens = loadDependencyTokens(TYPOGRAPHY_JSON);
  const shadowTokens = loadShadowTokens();
  const spacingTokens = loadDependencyTokens(SPACING_JSON);
  const borderTokens = loadDependencyTokens(BORDER_JSON);
  const cssColorVars = loadCssColorVars();
  const nameToFile = {};
  contracts.forEach(({ file, data }) => {
    if (data.name) nameToFile[data.name] = file;
  });

  // commonlyEmbeddedIn 单向自动推导（治理，2026-07-17）：唯一权威源头是各组件自己的
  // componentDependencies（"我依赖了谁"）。这里反过来给每个被依赖的组件算出它的
  // "常被嵌套"列表，取代契约里手写的 relations.commonlyEmbeddedIn 字段。
  // 与 scripts/generate-preview-tables.js 的 buildReverseEmbedIndex 逻辑保持一致。
  //
  // 变体名→汇总表行名映射：componentDependencies.requiredVariants 填的是"目标组件的具体
  // 变体名"（如 button.json 的 "filled-red"），但依赖汇总表的行未必按变体分组——像
  // button/text-button 是按 types（filled/outline、inline/inline-solid）分组，变体只是
  // types 下的细分。若变体名本身不是行名，则查该组件的 variants[*].name===变体名 找到
  // 它的 variants[*].type，用 type 名作为 appliesTo，这样才能命中汇总表的真实行。
  contracts.forEach(({ data }) => {
    const rowNames = getSummaryRowNames(data);
    if (!data.__variantToRow) {
      const map = {};
      (data.variants || []).forEach((v) => {
        if (v && v.name) map[v.name] = rowNames.has(v.name) ? v.name : (v.type || v.name);
      });
      data.__variantToRow = map;
    }
  });
  const autoEmbedIndex = {}; // targetComponentName -> [{ component, usage, appliesTo }]
  contracts.forEach(({ data }) => {
    const deps = (data.relations || {}).componentDependencies || [];
    deps.forEach((dep) => {
      if (!dep.component || !data.name) return;
      if (!autoEmbedIndex[dep.component]) autoEmbedIndex[dep.component] = [];
      let appliesTo;
      if (Array.isArray(dep.requiredVariants) && dep.requiredVariants.length) {
        const targetEntry = contracts.find(({ data: d }) => d.name === dep.component);
        const variantToRow = (targetEntry && targetEntry.data.__variantToRow) || {};
        appliesTo = dep.requiredVariants.map((rv) => variantToRow[rv] || rv);
      }
      autoEmbedIndex[dep.component].push({ component: data.name, usage: dep.usage || '', appliesTo });
    });
  });

  const errors = [];
  const warnings = [];
  errors.push(...require('./token-reference-registry').checkReferences(path.join(__dirname,'..'),contracts));

  contracts.forEach(({ file, data }) => {
    // 检查 3：组件级与变体级 isComplete / pendingParts 逻辑一致性。
    if (data.isComplete === true && Array.isArray(data.pendingParts) && data.pendingParts.length > 0) {
      errors.push(`${file}: isComplete=true 但 pendingParts 非空（自相矛盾，pendingParts 非空时 isComplete 必须是 false）`);
    }
    const variantsWithOwnStatus = (data.variants || []).filter((variant) => Object.prototype.hasOwnProperty.call(variant, 'isComplete') || Object.prototype.hasOwnProperty.call(variant, 'pendingParts'));
    variantsWithOwnStatus.forEach((variant) => {
      const parts = Array.isArray(variant.pendingParts) ? variant.pendingParts : [];
      if (variant.isComplete === true && parts.length > 0) errors.push(`${file}: variant ${variant.name} isComplete=true 但 pendingParts 非空`);
    });
    if (data.isComplete !== true) {
      const availableCount = variantsWithOwnStatus.filter((variant) => variant.isComplete === true && (!Array.isArray(variant.pendingParts) || variant.pendingParts.length === 0)).length;
      warnings.push(availableCount > 0
        ? `${file}: 组件未完全完成；页面生成仅开放 ${availableCount}/${(data.variants || []).length} 个已完成变体`
        : `${file}: isComplete 不是 true，页面生成时必须排除该组件`);
    }

    const relations = data.relations || {};
    const summaryRowNames = getSummaryRowNames(data);

    // 检查 0：所有汇总表依赖必须明确映射到真实 type/variant。
    // 支持 Checkbox 的 "lg/default" 这类子状态路径，但首段必须是实际汇总行。
    SUMMARY_DEPENDENCY_KEYS.forEach((key) => {
      (relations[key] || []).forEach((dep) => {
        const label = dep.icon || dep.token || '(未命名依赖)';
        if (!Array.isArray(dep.appliesTo) || dep.appliesTo.length === 0) {
          errors.push(`${file}: ${key} 的 "${label}" 缺少非空 appliesTo，依赖汇总表无法归属到真实组件类型`);
          return;
        }
        dep.appliesTo.forEach((target) => {
          if (FORBIDDEN_SUMMARY_TARGETS.has(target)) {
            errors.push(`${file}: ${key} 的 "${label}" 使用了禁止的伪类型 "${target}"`);
            return;
          }
          const root = String(target).split('/')[0];
          if (!summaryRowNames.has(root)) {
            errors.push(`${file}: ${key} 的 "${label}" appliesTo="${target}" 首段未解析到真实汇总行`);
          }
        });
      });
    });

    // 检查 1：componentDependencies 引用的组件是否真实存在
    const compDeps = relations.componentDependencies || [];
    // 宿主组件自己的 preview HTML（用于 implementationClasses 证据链校验，检查 8）
    const hostPreviewPath = path.join(SPEC_DIR, '..', 'variants', file.replace(/\.json$/, '.html'));
    let hostPreviewHtml = null;
    try { hostPreviewHtml = fs.readFileSync(hostPreviewPath, 'utf8'); } catch (e) { hostPreviewHtml = null; }
    compDeps.forEach((dep) => {
      if (dep.part) {
        const target = contracts.find(({ data }) => data.name === dep.component);
        const part = target && target.data.parts && target.data.parts[dep.part];
        if (!part || !part.previewSelector || !Array.isArray(part.requiredClasses)) {
          errors.push(`${file}: ${dep.component} 未登记可复用子部件 ${dep.part}`);
        } else if (!(dep.requiredVariants || []).every(v => (part.colorVariants || []).includes(v)) ||
          !part.requiredClasses.every(c => (dep.implementationClasses || []).includes(c))) {
          errors.push(`${file}: ${dep.component}/${dep.part} 配色或必需结构与子部件契约不符`);
        }
      }
      if (!Array.isArray(dep.requiredVariants) || dep.requiredVariants.length === 0) {
        errors.push(`${file}: componentDependencies["${dep.component || ''}"] 必须声明非空 requiredVariants，不能把具体嵌套关系模糊成整个组件`);
      }
      if (!Array.isArray(dep.implementationClasses) || dep.implementationClasses.length === 0) {
        errors.push(`${file}: componentDependencies["${dep.component || ''}"] 必须声明非空 implementationClasses，作为宿主 preview 的实现证据`);
      }
      if (dep.hostPreviewAnchor && hostPreviewHtml !== null) {
        const anchor = String(dep.hostPreviewAnchor).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(`id=["']${anchor}["']`).test(hostPreviewHtml)) {
          errors.push(`${file}: componentDependencies["${dep.component || ''}"].hostPreviewAnchor="${dep.hostPreviewAnchor}" 在宿主 preview 中不存在`);
        }
      }
      if (dep.component && !nameToFile[dep.component]) {
        errors.push(`${file}: componentDependencies 引用了不存在的组件 "${dep.component}"`);
      }
      if (dep.component && nameToFile[dep.component]) {
        const targetEntry = contracts.find(({ data: d }) => d.name === dep.component);
        // A partial family can still expose a complete, source-backed subpart
        // or completed requested variants. Never infer readiness from the family name.
        const requestedScopeComplete = requestedDependencyReady(path.resolve(SPEC_DIR, '..', '..'), targetEntry?.data, dep);
        if (targetEntry && targetEntry.data.isComplete !== true && !requestedScopeComplete) {
          errors.push(`${file}: componentDependencies 引用了未完成组件 "${dep.component}"（${targetEntry.file} 的 isComplete 不是 true）`);
        }
      }
      // 检查 6：requiredVariants 引用的 variant 名是否在目标组件的 variants 数组里真实存在
      if (dep.component && dep.requiredVariants && Array.isArray(dep.requiredVariants)) {
        const targetEntry = contracts.find(({ data: d }) => d.name === dep.component);
        if (targetEntry) {
          const targetVariants = (targetEntry.data.variants || []).map((v) => v.name);
          dep.requiredVariants.forEach((rv) => {
            if (!targetVariants.includes(rv)) {
              errors.push(`${file}: componentDependencies 引用了 ${dep.component} 的 variant "${rv}"，但该 variant 在 ${nameToFile[dep.component]} 的 variants 数组中不存在（可能已被删除或改名）`);
            }
          });
        }
      }
      // 检查 8（双向证据链）：implementationClasses 声明的每个 class 必须同时出现在
      // 宿主 preview 和目标组件自己的 preview。只检查宿主会把任意内部 class 误当成目标
      // 组件证据（例如 Banner 自有 dots 被误报为 Carousel）；双向命中才能证明真实复用。
      if (Array.isArray(dep.implementationClasses) && dep.implementationClasses.length > 0) {
        const targetContractFile = dep.component && nameToFile[dep.component];
        let targetPreviewPath = targetContractFile
          ? path.join(SPEC_DIR, '..', 'variants', targetContractFile.replace(/\.json$/, '.html'))
          : null;
        const targetEntry = contracts.find(({ data: d }) => d.name === dep.component);
        const sourcePart = dep.part && targetEntry?.data.parts?.[dep.part];
        if (sourcePart?.sourcePreview) {
          const ownerPrefix = `components/sources/${targetContractFile.replace(/\.json$/, '')}/`;
          const hostAllowed = sourcePart.allowedHosts?.some(host => host.component === data.name && dep.appliesTo?.length && dep.appliesTo.every(v => v === host.variant));
          if (!hostAllowed || !sourcePart.sourcePreview.startsWith(ownerPrefix) || sourcePart.sourcePreview.split(/[\\/]/).includes('..') || !sourcePart.sourcePreview.endsWith('.html')) {
            errors.push(`${file}: ${dep.component}/${dep.part} 的来源锁定子部件渲染证据不属于已声明宿主/原子来源目录`);
          } else {
            targetPreviewPath = path.join(SPEC_DIR, '..', '..', sourcePart.sourcePreview);
          }
        }
        let targetPreviewHtml = null;
        if (targetPreviewPath) {
          try { targetPreviewHtml = fs.readFileSync(targetPreviewPath, 'utf8'); } catch (e) { targetPreviewHtml = null; }
        }
        if (hostPreviewHtml === null) {
          errors.push(`${file}: componentDependencies["${dep.component}"] 声明了 implementationClasses，但找不到宿主 preview ${path.basename(hostPreviewPath)} 作为证据`);
        }
        if (targetContractFile && targetPreviewHtml === null) {
          errors.push(`${file}: componentDependencies["${dep.component}"] 声明了 implementationClasses，但找不到目标组件 preview ${path.basename(targetPreviewPath)} 作为证据`);
        }
        dep.implementationClasses.forEach((cls) => {
          const re = new RegExp('class="[^"]*\\b' + String(cls).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
          if (hostPreviewHtml !== null && !re.test(hostPreviewHtml)) {
            errors.push(`${file}: componentDependencies["${dep.component}"].implementationClasses 里 "${cls}" 在宿主 preview ${path.basename(hostPreviewPath)} 的 class 属性中找不到证据（核对 class 名，或补齐 preview 中该依赖的真实结构）`);
          }
          if (targetPreviewHtml !== null && !re.test(targetPreviewHtml)) {
            errors.push(`${file}: componentDependencies["${dep.component}"].implementationClasses 里 "${cls}" 不属于目标组件 preview ${path.basename(targetPreviewPath)}（不能用宿主自有 class 伪装组件依赖）`);
          }
        });
      }
    });

    // 检查 1b：mutuallyExclusiveWith 如果指向的是一个真实组件名但拼错了，也提示（允许指向抽象概念如 content-banner-dark）
    const mutex = relations.mutuallyExclusiveWith || [];
    mutex.forEach((m) => {
      if (m.component && nameToFile[m.component] === undefined) {
        // 只有当它明显像是想指某个已知组件但拼错时才警告，这里用宽松策略：不报错，只在名字与已知组件高度相似时提示
        const known = Object.keys(nameToFile);
        const closeMatch = known.find((n) => n.toLowerCase() === String(m.component).toLowerCase());
        if (closeMatch) {
          warnings.push(`${file}: mutuallyExclusiveWith 的 "${m.component}" 大小写与已知组件 "${closeMatch}" 不一致，确认是否拼写有误`);
        }
      }
    });

    // 检查 2：iconDependencies 引用的图标文件是否真实存在
    const iconDeps = relations.iconDependencies || [];
    iconDeps.forEach((dep) => {
      if (!dep.icon) return;
      const iconName = dep.icon.replace(/\.svg$/, '');
      if (iconNames.size > 0 && !iconNames.has(iconName)) {
        errors.push(`${file}: iconDependencies 引用了不存在的图标 "${dep.icon}"（icons/ 目录下找不到）`);
      }
    });

    // 检查 2b：colorDependencies 引用的颜色 token 是否存在，且 colors.json 与 tokens.css 双源一致
    const colorDeps = relations.colorDependencies || [];
    colorDeps.forEach((dep) => {
      const token = dep.token;
      if (!token) return;
      if (token === '/') return; // 白名单裸值（无对应 token），闭环校验按 value 匹配
      if (String(token).startsWith('color.')) {
        // 存在性：必须在 colors.json 里能找到（硬性 error，比照 iconDependencies）
        if (colorTokens.size > 0 && !colorTokens.has(token)) {
          errors.push(`${file}: colorDependencies 引用了不存在的颜色 token "${token}"（token-specs/colors.json 里找不到）`);
          return;
        }
        // 双源一致性：以 token 显式声明的 cssVar 为准（方案 1），不再靠 "--color-"+名字 推导
        const entry = colorTokens.get(token);
        const jsonVal = entry && entry.value;
        const varName = entry && entry.cssVar;
        if (!varName) {
          warnings.push(`${file}: 颜色 token "${token}" 在 colors.json 里缺少 cssVar 字段（无法核对与 tokens.css 的一致性，请补 cssVar）`);
        } else {
          const cssVal = cssColorVars.get(varName);
          if (cssVal === undefined) {
            warnings.push(`${file}: 颜色 token "${token}" 声明的 cssVar ${varName} 在 tokens.css 里不存在（组件用 var(${varName}) 会失效）`);
          } else if (jsonVal !== undefined && normColor(jsonVal) !== normColor(cssVal)) {
            warnings.push(`${file}: 颜色 token "${token}" 双源不一致 —— colors.json=${jsonVal} 但 tokens.css ${varName}=${cssVal}，请统一`);
          }
        }
      } else {
        warnings.push(`${file}: colorDependencies 里 "${token}" 既不是 color.* token 也不是 /（白名单），请确认`);
      }
    });

    // 检查 2c：组件 CSS 里出现的颜色必须都在 colorDependencies 里声明过
    //   ① 用到的 var(--color-*) 必须对应已声明的 color.* token；② 不允许未声明的裸色值（box-shadow/注释已排除）
    if (colorDeps.length > 0) {
      const id = file.replace(/\.json$/, '');
      const section = extractComponentCssSection(id);
      if (section) {
        const declaredTokens = new Set(colorDeps.map((d) => d.token).filter((t) => String(t).startsWith('color.')));
        const declaredCssVars = new Set(
          [...declaredTokens]
            .map((token) => colorTokens.get(token))
            .filter(Boolean)
            .map((entry) => entry.cssVar)
            .filter(Boolean)
        );
        const declaredRaw = new Set(colorDeps.filter((d) => d.token === '/').map((d) => normColor(d.value)));
        const { varsUsed, literals } = scanCssColors(section);
        varsUsed.forEach((v) => {
          if (declaredCssVars.has(v)) return;
          const matchingToken = [...colorTokens.entries()].find(([, entry]) => entry.cssVar === v);
          const expectedToken = matchingToken ? matchingToken[0] : 'color.' + v.slice('--color-'.length);
          errors.push(`${file}: 组件 CSS 用了 var(${v})，但 colorDependencies 未声明 "${expectedToken}"（颜色映射不闭环）`);
        });
        literals.forEach((lit) => {
          if (!declaredRaw.has(normColor(lit))) {
            errors.push(`${file}: 组件 CSS 出现未声明的裸色值 "${lit}"（必须改用 var(--color-*)，或在 colorDependencies 里作为白名单声明）`);
          }
        });
      }
    }

    // 检查 3a：radiusDependencies 引用的 border-radius.* token 是否存在（比照 colorDependencies）
    const radiusDeps = relations.radiusDependencies || [];
    radiusDeps.forEach((dep) => {
      const token = dep.token;
      if (!token) return;
      if (token === '/') return; // 白名单裸值（无对应 token），闭环校验按 value 匹配
      if (String(token).startsWith('border-radius.')) {
        if (radiusTokens.size > 0 && !radiusTokens.has(token)) {
          errors.push(`${file}: radiusDependencies 引用了不存在的圆角 token "${token}"（token-specs/border-radius.json 里找不到）`);
        }
      } else {
        warnings.push(`${file}: radiusDependencies 里 "${token}" 既不是 border-radius.* token 也不是 /（白名单），请确认`);
      }
    });

    // 检查 3b：组件 CSS 的 border-radius 用到的 var(--border-radius-*) 必须都在 radiusDependencies 声明过，
    //   且不允许未声明的裸圆角值（0 除外）—— 保证圆角映射闭环
    if (radiusDeps.length > 0) {
      const id = file.replace(/\.json$/, '');
      const section = extractComponentCssSection(id);
      if (section) {
        const declaredRadiusTokens = new Set(radiusDeps.map((d) => d.token).filter((t) => String(t).startsWith('border-radius.')));
        const declaredRadiusRaw = new Set(radiusDeps.filter((d) => d.token === '/').map((d) => normColor(d.value)));
        const { varsUsed, literals } = scanCssRadius(section);
        varsUsed.forEach((v) => {
          const token = 'border-radius.' + v.slice('--border-radius-'.length);
          if (!declaredRadiusTokens.has(token)) {
            errors.push(`${file}: 组件 CSS 用了 var(${v})，但 radiusDependencies 未声明 "${token}"（圆角映射不闭环）`);
          }
        });
        literals.forEach((lit) => {
          if (!declaredRadiusRaw.has(normColor(lit))) {
            errors.push(`${file}: 组件 CSS 出现未声明的裸圆角值 "${lit}"（必须改用 var(--border-radius-*)，或在 radiusDependencies 里作为白名单声明）`);
          }
        });
      }
    }

    // 检查 4a：fontSizeDependencies 引用的 typography.font-size-* token 是否存在（token 为 / = 无对应 token 的白名单值）
    const fontDeps = relations.fontSizeDependencies || [];
    fontDeps.forEach((dep) => {
      const token = dep.token;
      if (!token || token === '/') return;
      if (String(token).startsWith('typography.')) {
        if (fontSizeTokens.size > 0 && !fontSizeTokens.has(token)) {
          errors.push(`${file}: fontSizeDependencies 引用了不存在的字号 token "${token}"（token-specs/typography.json 里找不到）`);
        }
      } else {
        warnings.push(`${file}: fontSizeDependencies 里 "${token}" 既不是 typography.* token 也不是 /（白名单），请确认`);
      }
    });

    // 检查 4b：组件 CSS 的 font-size 用到的 var(--font-size-*) 必须都在 fontSizeDependencies 声明，无未声明裸字号值
    if (fontDeps.length > 0) {
      const id = file.replace(/\.json$/, '');
      const section = extractComponentCssSection(id);
      if (section) {
        const declaredFontTokens = new Set(fontDeps.map((d) => d.token).filter((t) => String(t).startsWith('typography.')));
        const declaredFontRaw = new Set(fontDeps.filter((d) => d.token === '/').map((d) => normColor(d.value)));
        const { varsUsed, literals } = scanCssFontSize(section);
        varsUsed.forEach((v) => {
          const token = 'typography.' + v.slice('--'.length);
          if (!declaredFontTokens.has(token)) {
            errors.push(`${file}: 组件 CSS 用了 var(${v})，但 fontSizeDependencies 未声明 "${token}"（字号映射不闭环）`);
          }
        });
        literals.forEach((lit) => {
          if (!declaredFontRaw.has(normColor(lit))) {
            errors.push(`${file}: 组件 CSS 出现未声明的裸字号值 "${lit}"（须改用 var(--font-size-*)，或在 fontSizeDependencies 里以 token:"/" 白名单登记）`);
          }
        });
      }
    }

    // 检查 5a：shadowDependencies 引用的 shadow.* token 是否存在（token 为 / = 无对应 token 的白名单值）
    const shadowDeps = relations.shadowDependencies || [];
    shadowDeps.forEach((dep) => {
      const token = dep.token;
      if (!token || token === '/') return;
      if (String(token).startsWith('shadow.')) {
        if (shadowTokens.size > 0 && !shadowTokens.has(token)) {
          errors.push(`${file}: shadowDependencies 引用了不存在的投影 token "${token}"（token-specs/shadows.json 里找不到）`);
        }
      } else {
        warnings.push(`${file}: shadowDependencies 里 "${token}" 既不是 shadow.* token 也不是 /（白名单），请确认`);
      }
    });

    // 检查 5b：组件 CSS 的 box-shadow 用到的 var(--shadow-*) 必须都在 shadowDependencies 声明，无未声明裸投影值
    if (shadowDeps.length > 0) {
      const id = file.replace(/\.json$/, '');
      const section = extractComponentCssSection(id);
      if (section) {
        const declaredShadowTokens = new Set(shadowDeps.map((d) => d.token).filter((t) => String(t).startsWith('shadow.')));
        const declaredShadowRaw = new Set(shadowDeps.filter((d) => d.token === '/').map((d) => normColor(d.value)));
        const { varsUsed, literals } = scanCssShadow(section);
        varsUsed.forEach((v) => {
          const token = 'shadow.' + v.slice('--shadow-'.length);
          if (!declaredShadowTokens.has(token)) {
            errors.push(`${file}: 组件 CSS 用了 var(${v})，但 shadowDependencies 未声明 "${token}"（投影映射不闭环）`);
          }
        });
        literals.forEach((lit) => {
          if (!declaredShadowRaw.has(normColor(lit))) {
            errors.push(`${file}: 组件 CSS 出现未声明的裸投影值 "${lit}"（须改用 var(--shadow-*)，或在 shadowDependencies 里以 token:"/" 白名单登记）`);
          }
        });
      }
    }

    // 检查 6a/6b：间距与描边依赖必须对 token、CSS 使用及选择器/属性证据形成双向闭环。
    const componentId = file.replace(/\.json$/, '');
    const baseComponentCss = extractComponentCssSection(componentId);
    // Current runtime corrections are declared resources, not implicit shared-CSS edits.
    const extraStyles = (data.integration?.styles || []).filter(f => f !== 'components/components.css' && f !== 'components/tokens.css');
    const correctionCss = extraStyles.map(f => {
      const full = path.resolve(__dirname, '..', f);
      if (!full.startsWith(path.resolve(__dirname, '..', 'components') + path.sep) || !fs.existsSync(full)) {
        errors.push(`${file}: 声明的组件样式资源不存在或越界: ${f}`); return '';
      }
      return fs.readFileSync(full, 'utf8');
    }).join('\n');
    const componentCss = [baseComponentCss, correctionCss].filter(Boolean).join('\n');
    if (componentCss) {
      const { malformed, vars } = scanTokenVarSyntax(componentCss);
      malformed.forEach((value) => {
        errors.push(`${file}: 组件 CSS 出现非法嵌套 token 变量语法 "${value}"`);
      });
      vars.forEach((variable) => {
        const tokens = variable.startsWith('--spacing-') ? spacingTokens : borderTokens;
        if (!tokens.byVar.has(variable)) {
          errors.push(`${file}: 组件 CSS 使用了未知 token 变量 var(${variable})`);
        }
      });
    }
    const dependencyConfigs = [
      { key: 'spacingDependencies', kind: 'spacing', prefix: 'spacing.', tokens: spacingTokens },
      { key: 'borderDependencies', kind: 'border', prefix: 'border.', tokens: borderTokens },
      { key: 'fontWeightDependencies', kind: 'fontWeight', prefix: 'typography.font-weight-', tokens: fontWeightTokens },
    ];
    dependencyConfigs.forEach(({ key, kind, prefix, tokens }) => {
      if (data.isComplete === true && !Object.prototype.hasOwnProperty.call(relations, key)) {
        errors.push(`${file}: 已完成组件必须显式声明 relations.${key}（无依赖时也必须为 []）`);
      }
      const deps = relations[key] || [];
      if (!componentCss) {
        if (data.isComplete === true) errors.push(`${file}: components.css 中找不到 ${componentId} 的组件区段，无法校验 ${key}`);
        return;
      }
      const { occurrences, rawValues } = scanCssDependencyEvidence(componentCss, kind);
      const declared = new Set();
      deps.forEach((dep) => {
        const token = String(dep.token || '');
        if (!token.startsWith(prefix)) {
          errors.push(`${file}: ${key} 的 token "${token}" 必须以 ${prefix} 开头`);
          return;
        }
        const tokenEntry = tokens.byName.get(token);
        if (!tokenEntry) {
          errors.push(`${file}: ${key} 引用了不存在的 token "${token}"`);
          return;
        }
        declared.add(token);
        if (dep.value !== undefined && normColor(dep.value) !== normColor(tokenEntry.value)) {
          errors.push(`${file}: ${key} 的 "${token}" value=${dep.value}，与 token-spec 值 ${tokenEntry.value} 不一致`);
        }
        if (kind === 'border' && dep.aspect !== token.split('.')[1]) {
          errors.push(`${file}: borderDependencies 的 "${token}" aspect 应为 "${token.split('.')[1]}"，当前为 "${dep.aspect}"`);
        }
        const tokenOccurrences = occurrences.filter((item) => item.variable === tokenEntry.cssVar);
        (dep.selectors || []).forEach((selector) => {
          if (!tokenOccurrences.some((item) => item.selectors.includes(selector))) {
            errors.push(`${file}: ${key} 的 "${token}" selector 证据不存在或未使用该 token：${selector}`);
          }
        });
        (dep.properties || []).forEach((property) => {
          if (!tokenOccurrences.some((item) => item.property === property)) {
            errors.push(`${file}: ${key} 的 "${token}" property 证据不存在或未使用该 token：${property}`);
          }
        });
        if (!(data.tokenReferences || []).includes(token)) {
          errors.push(`${file}: ${key} 使用了 "${token}"，但 tokenReferences 未登记`);
        }
      });
      occurrences.forEach(({ variable }) => {
        const tokenEntry = tokens.byVar.get(variable);
        if (!tokenEntry) {
          errors.push(`${file}: 组件 CSS 使用了未登记的 var(${variable})`);
        } else if (!declared.has(tokenEntry.name)) {
          errors.push(`${file}: 组件 CSS 使用了 var(${variable})，但 ${key} 未声明 "${tokenEntry.name}"`);
        }
      });
      rawValues.forEach(({ property, value, selectors }) => {
        errors.push(`${file}: ${selectors.join(', ')} 的 ${property} 仍含未 token 化值 "${value}"`);
      });
    });

    // 检查 6c：字体必须引用一个真实 composite typography token；字号与字重字段仅作底层 CSS 证据。
    if (data.isComplete === true && !Object.prototype.hasOwnProperty.call(relations, 'typographyDependencies')) {
      errors.push(`${file}: 已完成组件必须显式声明 relations.typographyDependencies（无字体依赖时也必须为 []）`);
    }
    const typographyDeps = relations.typographyDependencies || [];
    typographyDeps.forEach((pair) => {
      const compositeToken = String(pair.token || '');
      const compositeEntry = typographyCompositeTokens.get(compositeToken);
      const sizeToken = String(pair.fontSizeToken || '');
      const weightToken = String(pair.fontWeightToken || '');
      const pairTargets = Array.isArray(pair.appliesTo) ? pair.appliesTo : [];
      const overlaps = (dep) => (dep.appliesTo || []).some((target) => pairTargets.some((pairTarget) => String(target).split('/')[0] === String(pairTarget).split('/')[0]));

      if (!compositeEntry) {
        errors.push(`${file}: typographyDependencies 引用了不存在的 composite token "${compositeToken}"`);
      } else {
        if (normColor(pair.fontSizeValue) !== normColor(compositeEntry.value.fontSize)) {
          errors.push(`${file}: ${compositeToken} 的 fontSize 应为 ${compositeEntry.value.fontSize}，当前为 ${pair.fontSizeValue}`);
        }
        if (String(pair.fontWeightValue) !== String(compositeEntry.value.fontWeight)) {
          errors.push(`${file}: ${compositeToken} 的 fontWeight 应为 ${compositeEntry.value.fontWeight}，当前为 ${pair.fontWeightValue}`);
        }
        const refs = compositeEntry.primitiveReferences;
        if (sizeToken !== '/' && refs.fontSize && refs.fontSize !== sizeToken) {
          errors.push(`${file}: ${compositeToken} 的字号 primitive 应为 ${refs.fontSize}，当前为 ${sizeToken}`);
        }
        if (!refs.fontSize && sizeToken !== '/') {
          errors.push(`${file}: ${compositeToken} 未声明字号 primitive，fontSizeToken 应为 /`);
        }
        if (refs.fontWeight !== weightToken) {
          errors.push(`${file}: ${compositeToken} 的字重 primitive 应为 ${refs.fontWeight}，当前为 ${weightToken}`);
        }
      }

      const sizeEntry = sizeToken === '/' ? null : fontSizeTokens.get(sizeToken);
      if (sizeToken !== '/' && !sizeEntry) errors.push(`${file}: typographyDependencies 引用了不存在的字号 token "${sizeToken}"`);
      if (sizeEntry && normColor(pair.fontSizeValue) !== normColor(sizeEntry)) errors.push(`${file}: typographyDependencies 的 ${sizeToken} 值应为 ${sizeEntry}，当前为 ${pair.fontSizeValue}`);
      const sizeDeclared = fontDeps.some((dep) => dep.token === sizeToken && normColor(dep.value) === normColor(pair.fontSizeValue) && overlaps(dep));
      if (!sizeDeclared) errors.push(`${file}: typographyDependencies 的字号 ${sizeToken} / ${pair.fontSizeValue} 未在同一组件类型的 fontSizeDependencies 声明`);
      const weightEntry = fontWeightTokens.byName.get(weightToken);
      if (!weightEntry) errors.push(`${file}: typographyDependencies 引用了不存在的字重 token "${weightToken}"`);
      if (weightEntry && String(pair.fontWeightValue) !== String(weightEntry.value)) errors.push(`${file}: typographyDependencies 的 ${weightToken} 值应为 ${weightEntry.value}，当前为 ${pair.fontWeightValue}`);
      if (pair.weightEvidence === 'explicit-css') {
        const weightDeclared = (relations.fontWeightDependencies || []).some((dep) => dep.token === weightToken && overlaps(dep));
        if (!weightDeclared) errors.push(`${file}: typographyDependencies 声明 explicit-css，但同类型 fontWeightDependencies 没有 ${weightToken} 证据`);
      }
      if (pair.weightEvidence === 'inherited-regular' && weightToken !== 'typography.font-weight-regular') errors.push(`${file}: inherited-regular 只能使用 typography.font-weight-regular`);
      [compositeToken, sizeToken, weightToken].filter((token) => token !== '/').forEach((token) => {
        if (!(data.tokenReferences || []).includes(token)) errors.push(`${file}: typographyDependencies 使用了 "${token}"，但 tokenReferences 未登记`);
      });
    });

    // 检查 7：relations 里只要有规则性字段，就必须有 enforcementStatus 字段且非空。
    // 不强制"每条规则都要一一对应登记"（那要求太死，字段命名本来就是自由格式），
    // 但至少要求"这个组件有没有把规则的机械化程度记录下来"这件事本身不能被漏掉——
    // 这是治理原则本身要求的字段（见 component.schema.json 里 enforcementStatus 的
    // description："核心字段，不可省略"），必须有机械检查兜底，不能只靠自觉遵守。
    const ruleFieldNames = [
      'parentContext',
      'componentDependencies',
      'mutuallyExclusiveWith',
      'siblingRule',
      'variantSelectionRules',
      'coOccursWith',
    ];
    const hasAnyRuleField = ruleFieldNames.some((k) => {
      const v = relations[k];
      if (v === undefined || v === null) return false;
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'object') return Object.keys(v).length > 0;
      return true;
    });
    if (hasAnyRuleField) {
      const es = relations.enforcementStatus;
      if (!es || typeof es !== 'object' || Object.keys(es).length === 0) {
        errors.push(`${file}: relations 里存在规则性字段（如 parentContext/componentDependencies 等），但缺少 enforcementStatus（或为空）——每条规则必须标注是否已机械化检查，不能只靠文档描述`);
      }
    }

    // 检查 8：父/子关系矛盾。同一个组件不能既在 nestedComponents（子组件，嵌在本组件内部）
    // 又在自动推导出的"常被嵌套"列表（父组件，本组件被其嵌套，见 autoEmbedIndex）里出现——
    // 逻辑上不可能既被包住又包住对方。
    // 根因治理：breadcrumb/text-button 曾把父容器（Banner/Card/IconCard）误填进 nestedComponents，
    // 同时被自动推导判定为父级，形成"既子又父"矛盾，此前只能靠肉眼在渲染表格里发现。
    // 此处把该模式变成机械 error，防止再犯。带括号补充语的条目（如"ds-toggle（组件自带）"）与
    // "无嵌套…"占位跳过，只比对干净的组件名。
    // 2026-07-17：判断依据从手写的 commonlyEmbeddedIn 改为 autoEmbedIndex（自动推导结果），
    // 因为矛盾的真正来源是"这个组件是否真的依赖了本组件"，用推导结果判断更准确、且消灭手写遗漏。
    {
      const childNames = new Set();
      (relations.variantDecisions || []).forEach((vd) => {
        (vd.nestedComponents || []).forEach((nc) => {
          const name = (nc && nc.component) ? String(nc.component).trim() : '';
          if (!name || /^无/.test(name) || /[（(]/.test(name)) return;
          childNames.add(name);
        });
      });
      const parentNames = new Set((autoEmbedIndex[data.name] || []).map((it) => it.component));
      childNames.forEach((n) => {
        if (parentNames.has(n)) {
          errors.push(`${file}: "${n}" 同时出现在 nestedComponents（子组件）与自动推导的"常被嵌套"列表（父组件）中，父子关系矛盾——说明 ${n} 的 componentDependencies 里错误地依赖了本组件，同时本组件又把 ${n} 填进了 nestedComponents；应从 ${n} 的 componentDependencies 或本组件的 nestedComponents 中移除其一`);
        }
      });
    }

    // 检查 9：自动推导出的 appliesTo（来自依赖方 componentDependencies 的 requiredVariants）
    // 必须解析到本组件真实的 type/variant 行，否则父组件会在依赖汇总表里静默消失。
    // 2026-07-17：数据源从手写 commonlyEmbeddedIn 改为 autoEmbedIndex；requiredVariants 本身
    // 的存在性已由检查 6（componentDependencies 引用的 variant 是否真实存在）覆盖，这里只需
    // 确认它能被 appliesTo 解析规则匹配到汇总表的行（两者理论上应始终一致，双重校验防止
    // summaryRowNames 计算逻辑与检查 6 的 variants 数组产生分歧）。
    (autoEmbedIndex[data.name] || []).forEach((it) => {
      if (!Array.isArray(it.appliesTo) || it.appliesTo.length === 0) return;
      it.appliesTo.forEach((target) => {
        const root = String(target).split('/')[0];
        if (!summaryRowNames.has(root)) {
          errors.push(`${file}: 自动推导的"常被嵌套"条目 "${it.component}" 的 appliesTo="${target}"（来自 ${it.component} 的 componentDependencies.requiredVariants）首段未解析到本组件真实的 type/variant 行`);
        }
      });
    });
  });

  // 检查 4：searchIntents 跨文件重复
  const intentOwners = {};
  contracts.forEach(({ file, data }) => {
    (data.searchIntents || []).forEach((intent) => {
      if (!intentOwners[intent]) intentOwners[intent] = [];
      intentOwners[intent].push(file);
    });
  });
  Object.entries(intentOwners).forEach(([intent, files]) => {
    if (files.length > 1) {
      errors.push(`searchIntents 重复: "${intent}" 同时出现在 ${files.join(' 和 ')} —— 多人投喂时意图词撞车，必须改为更具体的措辞以消除歧义`);
    }
  });

  // ── 检查 5（已治理，2026-07-17）：commonlyEmbeddedIn 双向核对 ──
  // 原逐一比对手写字段的检查已退役：commonlyEmbeddedIn 现在是从 componentDependencies
  // 自动推导出来的（见上方 autoEmbedIndex），结构上不可能再出现"缺反向声明"，此项 warning
  // 因而失去意义并移除。若契约文件里仍手写着 relations.commonlyEmbeddedIn，下方检查 5b 会
  // 提醒清理（该字段已不再被读取，留着只会误导人工阅读契约时的判断）。

  // ── 检查 5b：手写 commonlyEmbeddedIn 只允许 verified:false 的参考关系 ──
  // 已实现关系必须写在宿主 componentDependencies，并由 autoEmbedIndex 反向推导；
  // 手写项必须明确未验证原因，且不得与自动关系重名，避免同一关系出现两份事实源。
  contracts.forEach(({ file, data }) => {
    const hand = (data.relations || {}).commonlyEmbeddedIn;
    if (!Array.isArray(hand) || hand.length === 0) return;
    const automaticParents = new Set((autoEmbedIndex[data.name] || []).map((item) => item.component));
    const rowNames = getSummaryRowNames(data);
    hand.forEach((item, index) => {
      const field = `relations.commonlyEmbeddedIn[${index}]`;
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        errors.push(`${file}: ${field} 必须是对象，并明确写 verified:false；已实现关系不要手写`);
        return;
      }
      if (item.verified !== false) {
        errors.push(`${file}: ${field} 的 verified 必须为 false；verified:true/未标注的已实现关系必须迁移到宿主 componentDependencies 自动推导`);
      }
      if (!item.component || !nameToFile[item.component]) {
        errors.push(`${file}: ${field}.component 引用了不存在的组件 "${item.component || ''}"`);
      }
      if (typeof item.usage !== 'string' || item.usage.trim() === '') {
        errors.push(`${file}: ${field}.usage 必须说明参考使用场景`);
      }
      if (typeof item.verifiedNote !== 'string' || item.verifiedNote.trim() === '') {
        errors.push(`${file}: ${field}.verifiedNote 必须说明为何尚未验证`);
      }
      if (automaticParents.has(item.component)) {
        errors.push(`${file}: ${field} 的 "${item.component}" 已可从宿主 componentDependencies 自动推导，必须删除这条手写参考关系`);
      }
      (item.appliesTo || []).forEach((target) => {
        const root = String(target).split('/')[0];
        if (!rowNames.has(root)) {
          errors.push(`${file}: ${field}.appliesTo="${target}" 首段未解析到本组件真实的 type/variant 行`);
        }
      });
    });
  });

  // 输出结果
  console.log(`\n共检查 ${contracts.length} 份契约文件（${SPEC_DIR}）\n`);
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✓ 全部通过，0 个 error，0 个 warning\n');
    process.exit(0);
  }
  errors.forEach((e) => console.log(`  ✗ ERROR ${e}`));
  warnings.forEach((w) => console.log(`  ⚠ WARN  ${w}`));
  console.log(`\n────────────────────────────────────`);
  console.log(`${errors.length} 个 error，${warnings.length} 个 warning`);
  if (errors.length > 0) {
    console.log('结果：未通过 ✗');
    process.exit(1);
  }
  console.log('结果：通过 ✓（仅有 warning）');
  process.exit(0);
}

// ── --impact 反向依赖查询 ──
// Usage: node scripts/check-contracts.js --impact TextButton
// 输出真实宿主依赖、未验证参考宿主及姐妹/互斥规则；真实与参考关系明确分开。
function impact(targetName) {
  const contracts = loadAll();
  const results = new Map();
  const byName = new Map(contracts.map((entry) => [entry.data.name, entry]));
  const addReason = (entry, reason) => {
    if (!entry || !entry.data || !entry.data.name) return;
    if (!results.has(entry.data.name)) {
      results.set(entry.data.name, { file: entry.file, name: entry.data.name, reasons: [] });
    }
    results.get(entry.data.name).reasons.push(reason);
  };

  contracts.forEach((entry) => {
    const relations = entry.data.relations || {};

    // 已实现宿主：宿主 componentDependencies 正向引用目标组件。
    (relations.componentDependencies || []).forEach((dep) => {
      if (dep.component === targetName) {
        addReason(entry, `已验证 componentDependencies: "${dep.usage || ''}"`);
      }
    });

    const sibling = relations.siblingRule;
    if (sibling && JSON.stringify(sibling).includes(targetName)) {
      addReason(entry, `siblingRule: "${sibling.reason || sibling.sharedPattern || ''}"`);
    }

    (relations.mutuallyExclusiveWith || []).forEach((item) => {
      if (item.component && item.component.includes(targetName)) {
        addReason(entry, `mutuallyExclusiveWith: "${item.reason || ''}"`);
      }
    });
  });

  // 参考宿主：声明存放在目标子组件自身，方向是 targetName → item.component。
  const targetEntry = byName.get(targetName);
  const references = targetEntry && targetEntry.data.relations
    ? targetEntry.data.relations.commonlyEmbeddedIn || [] : [];
  references.forEach((item) => {
    if (!item || typeof item !== 'object' || item.verified !== false) return;
    addReason(byName.get(item.component), `参考·未验证 commonlyEmbeddedIn: "${item.usage || ''}"`);
  });

  const output = [...results.values()];
  console.log(`\n反向依赖查询：谁引用了 "${targetName}"？\n`);
  if (output.length === 0) {
    console.log('  没有其他组件引用此组件。\n');
  } else {
    output.forEach(({ file, name, reasons }) => {
      console.log(`  ${name} (${file})`);
      reasons.forEach((reason) => console.log(`    → ${reason}`));
    });
    console.log(`\n共 ${output.length} 个组件受影响（含明确标注的参考·未验证关系）。修改 "${targetName}" 时请逐一确认以上组件是否需要同步更新。\n`);
  }
}

// ── --icon-usage 图标反向索引 ──
// Usage: node scripts/check-contracts.js --icon-usage icon-arrow-right
// 输出所有声明依赖了指定图标的组件，方便判断"改/删某个图标会影响谁"。
function iconUsage(iconName) {
  const contracts = loadAll();
  const results = [];

  contracts.forEach(({ file, data }) => {
    const relations = data.relations || {};
    const icons = relations.iconDependencies || [];
    // 也检查顶层旧字段（兼容一期遗留）
    const topIcons = data.iconDependencies || [];
    const allIcons = [...icons, ...topIcons];

    const matched = allIcons.filter((ic) => {
      const name = ic.icon || '';
      // 支持带或不带 .svg 后缀的查询
      return name === iconName || name === iconName.replace(/\.svg$/, '') || `${name}.svg` === iconName;
    });

    if (matched.length > 0) {
      results.push({
        file,
        name: data.name,
        usages: matched.map((m) => m.usage || '(未说明用途)'),
        required: matched.some((m) => m.required === true),
      });
    }
  });

  console.log(`\n图标反向索引：谁在使用 "${iconName}"？\n`);
  if (results.length === 0) {
    console.log('  没有任何组件声明依赖此图标。\n');
    console.log('  注意：这只查契约文件里的 iconDependencies 声明。');
    console.log('  如果图标被直接写在 preview HTML 或页面里但没有登记到契约，这里查不到。\n');
  } else {
    results.forEach(({ file, name, usages, required }) => {
      console.log(`  ${name} (${file})${required ? ' [required]' : ''}`);
      usages.forEach((u) => console.log(`    → ${u}`));
    });
    console.log(`\n共 ${results.length} 个组件使用了 "${iconName}"。`);
    console.log(`修改或删除此图标时，请确认以上组件的 preview HTML 和页面输出不受影响。\n`);
  }
}

// ── Entry Point ──
const args = process.argv.slice(2);
const impactIdx = args.indexOf('--impact');
const iconIdx = args.indexOf('--icon-usage');

if (impactIdx !== -1) {
  const target = args[impactIdx + 1];
  if (!target) {
    console.error('Usage: node scripts/check-contracts.js --impact <组件名>');
    process.exit(1);
  }
  impact(target);
} else if (iconIdx !== -1) {
  const target = args[iconIdx + 1];
  if (!target) {
    console.error('Usage: node scripts/check-contracts.js --icon-usage <图标名>');
    process.exit(1);
  }
  iconUsage(target);
} else {
  main();
}
