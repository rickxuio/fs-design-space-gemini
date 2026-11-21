#!/usr/bin/env node
/**
 * FS Design System — Contract → Preview HTML Table Sync
 *
 * 设计师只看 preview HTML，对着 HTML 提问题、调整、验证。
 * 本脚本保证 preview HTML 里的依赖汇总、决策/硬规则和各类依赖明细始终与契约 JSON 一致。
 *
 * 工作方式：
 *   1. 在 preview HTML 里找 <!-- AUTO-GENERATED-PREVIEW:START --> ... END --> 标记
 *   2. 从对应组件的 contract JSON 读取数据
 *   3. 生成 HTML 表格替换标记之间的内容
 *
 * Usage: node scripts/generate-preview-tables.js [--check] [component-id ...]
 *   --check  只检查是否一致，不写文件；不一致则报错（用于 CI / npm run health）
 *   component-id  可选，只同步/检查指定组件（例如 banner card）
 *
 * 新增组件时（完整规范见 docs/component-preview-structure.md）：
 *   1. preview 里手写①「变体决策 + 关联关系表」。
 *   2. 有硬规则 → 放 <!-- AUTO-GENERATED-PREVIEW:START/END --> 标记，并在下方 COMPONENT_GENERATORS
 *      里加 '<id>'() + generate<Id>Tables(c) 生成函数（参考 generateBadgeTables）。
 *   3. 有 iconDependencies → 放 <!-- AUTO-GENERATED-ICON-TABLE:START/END --> 标记（通用，无需注册生成器）。
 *   4. 跑 node scripts/generate-preview-tables.js 填表；npm run health 校完整性。
 *
 * 完整性闸门 checkCompleteness()（--check 时强制，违反即 exit 1）：
 *   Guard A：AUTO-GENERATED-PREVIEW 标记 ⇄ 必须注册生成器（双向一致）。
 *   Guard H：所有 preview 都必须含「依赖汇总表」标记；明细表已废弃，依赖信息统一由汇总表承载。
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {classifyDependencyEvidence}=require('./component-dependency-evidence');

const CONTRACTS_DIR = path.join(__dirname, '..', 'components', 'contracts');
const PREVIEW_DIR = path.join(__dirname, '..', 'components', 'variants');
const ICONS_DIR = path.join(__dirname, '..', 'components', 'icons');
const COLORS_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'colors.json');
const RADIUS_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'border-radius.json');
const TYPOGRAPHY_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'typography.json');
const SHADOWS_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'shadows.json');
const SPACING_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'spacing.json');
const BORDER_JSON = path.join(__dirname, '..', 'components', 'token-specs', 'border.json');

function loadColorTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(COLORS_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => map.set(t.name, t));
  } catch (e) { /* colors.json 读取失败时返回空表，存在状态一律判为缺失 */ }
  return map;
}

function loadRadiusTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(RADIUS_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => {
      const value = (typeof t.value === 'number' && t.unit) ? `${t.value}${t.unit}` : String(t.value);
      map.set(t.name, { ...t, value });
    });
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

function loadFontSizeTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(TYPOGRAPHY_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => {
      if (!/font-size/.test(t.name)) return;
      const value = (typeof t.value === 'number' && t.unit) ? `${t.value}${t.unit}` : String(t.value);
      map.set(t.name, { ...t, value });
    });
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

function loadFontWeightTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(TYPOGRAPHY_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => {
      if (!/font-weight/.test(t.name)) return;
      map.set(t.name, { ...t, value: String(t.value) });
    });
  } catch (e) { /* typography.json 读取失败时返回空表 */ }
  return map;
}

function loadShadowTokens() {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(SHADOWS_JSON, 'utf8'));
    (data.tokens || []).forEach((t) => map.set(t.name, { ...t, value: String(t.value) }));
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

function loadDependencyTokens(filePath) {
  const map = new Map();
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    (data.tokens || []).forEach((t) => {
      const value = (typeof t.value === 'number' && t.unit) ? `${t.value}${t.unit}` : String(t.value);
      map.set(t.name, { ...t, value });
    });
  } catch (e) { /* 读取失败时返回空表 */ }
  return map;
}

const loadSpacingTokens = () => loadDependencyTokens(SPACING_JSON);
const loadBorderTokens = () => loadDependencyTokens(BORDER_JSON);

function loadContract(name) {
  const file = path.join(CONTRACTS_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// ─────────────────────────────────────────────
// commonlyEmbeddedIn 单向自动推导（治理，2026-07-17）
// ------------------------------------------------
// 唯一权威源头是子组件的 relations.componentDependencies（"我依赖了谁"）。
// 父组件的 relations.commonlyEmbeddedIn（"我常被谁嵌套"）不再需要手写——
// 扫描全部契约的 componentDependencies，反过来给每个被依赖的组件算出它的
// "常被嵌套"列表，取代契约里手写的那份。依赖条目的 requiredVariants 会被
// 转成父组件视角的 appliesTo（"这条嵌套关系只出现在依赖方的这个变体里"）。
//
// 单向：只能子→父自动推导，不能反过来。"该不该依赖某组件"是设计选型，
// 必须手写在 componentDependencies 里；自动推导只负责让父组件那份清单
// 不再因为忘记手动同步而失真。
// ─────────────────────────────────────────────
let _reverseEmbedIndexCache = null;

// 汇总表行名集合（与 scripts/check-contracts.js 的 getSummaryRowNames 保持一致口径：
// 优先用 types，没有 types 才用 variants）。
function summaryRowNamesFor(data) {
  const rows = Array.isArray(data.types) && data.types.length > 0 ? data.types : (data.variants || []);
  return new Set(rows.map((r) => r.name).filter(Boolean));
}

function buildReverseEmbedIndex() {
  if (_reverseEmbedIndexCache) return _reverseEmbedIndexCache;
  const index = {}; // targetComponentName -> [{ component, usage, appliesTo, verified }]
  const contractFiles = fs.readdirSync(CONTRACTS_DIR).filter((f) => f.endsWith('.json') && f !== '.gitkeep');
  const allData = {}; // name -> data，用于变体名→行名映射查目标组件的 variants
  const rawList = [];
  for (const cf of contractFiles) {
    const contractPath = path.join(CONTRACTS_DIR, cf);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    } catch (error) {
      throw new Error(`${cf} 不是合法 JSON：${error.message}`);
    }
    rawList.push(data);
    if (data.name) allData[data.name] = data;
  }
  for (const data of rawList) {
    const deps = (data.relations || {}).componentDependencies || [];
    deps.forEach((dep) => {
      if (!dep.component || !data.name) return;
      if (!index[dep.component]) index[dep.component] = [];
      let appliesTo;
      if (Array.isArray(dep.requiredVariants) && dep.requiredVariants.length) {
        // requiredVariants 是目标组件（dep.component）的具体变体名。若该变体名本身不是
        // 目标组件汇总表的行名，则映射到 variants[*].type 对应的汇总行。
        const targetData = allData[dep.component];
        const rowNames = targetData ? summaryRowNamesFor(targetData) : new Set();
        const variantToRow = {};
        (targetData && targetData.variants || []).forEach((v) => {
          if (v && v.name) variantToRow[v.name] = rowNames.has(v.name) ? v.name : (v.type || v.name);
        });
        appliesTo = dep.requiredVariants.map((rv) => variantToRow[rv] || rv);
      }
      index[dep.component].push({
        component: data.name,
        usage: dep.usage || '',
        appliesTo,
        hostPreviewAnchor: dep.hostPreviewAnchor || '',
        evidence: classifyDependencyEvidence(fs.existsSync(path.join(PREVIEW_DIR,`${data.id || data.name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase()}.html`))
          ? fs.readFileSync(path.join(PREVIEW_DIR,`${data.id || data.name.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase()}.html`),'utf8') : null,[dep]),
        verified: false,
      });
    });
  }
  _reverseEmbedIndexCache = index;
  return index;
}

// 已声明关系：反向推导；离线类名证据不能证明完整子组件调用。
function getAutoCommonlyEmbeddedIn(componentName) {
  const index = buildReverseEmbedIndex();
  return index[componentName] || [];
}

// 参考关系：只读取当前子组件契约中 verified:false 的 commonlyEmbeddedIn；它们尚未
// 在宿主 preview 实现，不能当成真实依赖，也不能显示成可点击的已验证链接。
function getReferenceCommonlyEmbeddedIn(contract) {
  const handWritten = contract && contract.relations && Array.isArray(contract.relations.commonlyEmbeddedIn)
    ? contract.relations.commonlyEmbeddedIn : [];
  const verifiedNames = new Set(getAutoCommonlyEmbeddedIn(contract && contract.name).map((item) => item.component));
  return handWritten.filter((item) => item && typeof item === 'object'
    && item.verified === false && !verifiedNames.has(item.component));
}

// ─────────────────────────────────────────────
// HTML 生成辅助
// ─────────────────────────────────────────────
const TH = (text, extra = '') => `<th style="background: #F6F6F8; font-size: 12px; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #DEE0E3;${extra}">${text}</th>`;
const TD = (text, extra = '') => `<td style="font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3;${extra}">${text}</td>`;
const TD_GREEN = (text) => `<td style="font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3; color: #10A300; font-weight: 600;">${text}</td>`;
const TD_GRAY = (text) => `<td style="font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3; color: #707070;">${text}</td>`;
const TD_RED = (text) => `<td style="font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3; color: #C00000; font-weight: 600;">${text}</td>`;

function hardRuleTable({ title, description, ruleContent, aiParse, enforcement, howToModify }) {
  const lines = [];
  lines.push(`    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #F56300;">⚠️ 硬规则：${title}</p>`);
  if (description) {
    lines.push(`    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">${description}</p>`);
  }
  lines.push(`    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; table-layout: fixed;">`);
  lines.push(`      <tbody>`);
  // 规则内容行
  lines.push(`        <tr>`);
  lines.push(`          <td style="width: 110px; background: #F6F6F8; font-size: 12px; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #DEE0E3; vertical-align: top;">规则内容</td>`);
  lines.push(`          <td style="width: calc(50% - 55px); font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3; line-height: 20px; vertical-align: top; word-break: break-word;">`);
  lines.push(`            <p style="font-size: 11px; font-weight: 600; color: #707070; margin-bottom: 6px;">👤 描述原文</p>`);
  lines.push(`            ${ruleContent}`);
  lines.push(`          </td>`);
  lines.push(`          <td style="width: calc(50% - 55px); font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3; line-height: 20px; vertical-align: top; background: #FAFBFC; word-break: break-word;">`);
  lines.push(`            <p style="font-size: 11px; font-weight: 600; color: #707070; margin-bottom: 6px;">🤖 AI 解析（写入契约 JSON 的字段）</p>`);
  lines.push(`            <pre style="margin: 0; font-family: 'SF Mono', Consolas, monospace; font-size: 11px; line-height: 18px; white-space: pre-wrap; word-break: break-all; overflow-wrap: anywhere; color: #19191A;">${aiParse}</pre>`);
  lines.push(`          </td>`);
  lines.push(`        </tr>`);
  // 约束作用行
  lines.push(`        <tr>`);
  lines.push(`          <td style="width: 110px; background: #F6F6F8; font-size: 12px; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #DEE0E3; vertical-align: top;">约束作用</td>`);
  lines.push(`          <td colspan="2" style="font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3; line-height: 20px;">`);
  lines.push(`            ${enforcement}`);
  lines.push(`          </td>`);
  lines.push(`        </tr>`);
  // 如何修改行
  lines.push(`        <tr>`);
  lines.push(`          <td style="width: 110px; background: #F6F6F8; font-size: 12px; font-weight: 600; text-align: left; padding: 8px 10px; border: 1px solid #DEE0E3; vertical-align: top;">如何修改</td>`);
  lines.push(`          <td colspan="2" style="font-size: 12px; padding: 8px 10px; border: 1px solid #DEE0E3; line-height: 20px;">`);
  lines.push(`            ${howToModify || '改左边描述原文 → 跟 AI 说"这条硬规则改了，同步一下" → AI 转述确认 → 你确认 → AI 自动同步。'}`);
  lines.push(`          </td>`);
  lines.push(`        </tr>`);
  lines.push(`      </tbody>`);
  lines.push(`    </table>`);
  return lines.join('\n');
}

// ─────────────────────────────────────────────
// 组件生成器：每个函数读取对应契约 JSON，输出 HTML 片段
// ─────────────────────────────────────────────
// 通用硬规则生成器：从契约 relations.hardRules[] 读取每条规则并渲染，
// 契约里改一行，preview 两栏和「约束作用」/「如何修改」同时更新。
function generateHardRulesFromContract(c) {
  if (!c || !c.relations || !Array.isArray(c.relations.hardRules) || c.relations.hardRules.length === 0) return null;
  return c.relations.hardRules.map((r) => hardRuleTable({
    title: r.title,
    description: r.description,
    ruleContent: r.ruleContent,
    aiParse: r.aiParse,
    enforcement: r.enforcement,
    howToModify: r.howToModify,
  })).join('\n\n');
}

const HARD_RULE_COMPONENT_IDS = [
  'card', 'icon-card', 'banner', 'button', 'text-button', 'stepper', 'tab',
  'carousel', 'navigation', 'form', 'anchor-nav', 'badge', 'checkbox', 'tag',
  'collapse', 'breadcrumb', 'table', 'option-selector', 'radio', 'rate', 'select',
  'menu-navigation', 'dialog',
];

// 合并模式（推广自 collapse 试点）：所有硬规则内容都合入下方合并的「变体决策」表，
// AUTO-GENERATED-PREVIEW 块保留占位注释，让 Guard M（标记 ⇔ hardRules 数据）继续成立。
// 保留 generateHardRulesFromContract 作为回退实现，方便回退到旧样式或调试。
const COMPONENT_GENERATORS = Object.fromEntries(
  HARD_RULE_COMPONENT_IDS.map((id) => [id, () => '<!-- 合并模式：硬规则已并入下方合并表 -->'])
);

// ─────────────────────────────────────────────
// 各组件的具体生成逻辑已全部迁移至 relations.hardRules[]，由
// generateHardRulesFromContract 通用渲染。硬编码函数已删除。
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 通用图标依赖表生成器（对任何组件通用，无需注册）
// 从 contract.relations.iconDependencies 读取，并实时核对图标文件是否存在于 icons/ 目录。
// ─────────────────────────────────────────────
function generateIconTable(contract) {
  const deps = (contract.relations && contract.relations.iconDependencies) || [];
  if (deps.length === 0) return null;

  const rows = deps.map((d) => {
    const iconName = String(d.icon || '').replace(/\.svg$/, '');
    const exists = fs.existsSync(path.join(ICONS_DIR, `${iconName}.svg`));
    const iconCell = `<a href="icon-map.html#${iconName}" style="color:#0060BF;text-decoration:underline;"><code>${iconName}.svg</code></a>`;
    const applies = Array.isArray(d.appliesTo) && d.appliesTo.length
      ? `<br><span style="color:#707070;">（${d.appliesTo.join(' / ')}）</span>`
      : '';
    const req = d.required ? '必需' : '可选';
    const status = exists ? TD_GREEN('✓ 已存在') : TD_RED('✗ 缺失');
    return `        <tr>${TD(iconCell)}${TD((d.usage || '') + applies)}${TD(req)}${status}</tr>`;
  });

  const lines = [];
  lines.push(`    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">图标依赖表</p>`);
  lines.push(`    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">本组件用到的图标（自动从契约 <code>relations.iconDependencies</code> 生成，存在状态实时核对 <code>../icons/</code> 目录）。点图标名跳转到 <a href="icon-map.html" style="color: #0060BF;">图标总览页</a>。</p>`);
  lines.push(`    <table style="width: 100%; border-collapse: collapse;">`);
  lines.push(`      <thead>`);
  lines.push(`        <tr>${TH('图标')}${TH('用途')}${TH('必需')}${TH('存在状态')}</tr>`);
  lines.push(`      </thead>`);
  lines.push(`      <tbody>`);
  lines.push(rows.join('\n'));
  lines.push(`      </tbody>`);
  lines.push(`    </table>`);
  return lines.join('\n');
}

// 各拆分页面（color.html / font.html / spacing.html / stroke.html / radius.html /
// shadow.html）都通过 tokens-data.js 的 idAttr 生成 id="tok-<token 名，点换短横>"，与
// tokens.html 汇总页的 id 命名一致，可直接锚点跳转。
function resolveTokenPage(token) {
  const t = String(token);
  if (t.startsWith('color.')) return 'color.html';
  if (t.startsWith('typography.')) return 'font.html';
  if (t.startsWith('spacing.')) return 'spacing.html';
  if (t.startsWith('border-radius.')) return 'radius.html';
  if (t.startsWith('border.')) return 'stroke.html';
  if (t.startsWith('shadow.')) return 'shadow.html';
  return 'tokens.html';
}

function tokenAnchor(token) {
  const raw = String(token);
  const target = `tok-${raw.replace(/\./g, '-')}`;
  const page = resolveTokenPage(raw);
  return `<a href="${page}#${target}" style="color:#0060BF;text-decoration:underline;"><code>${escapeHtml(raw)}</code></a>`;
}

function colorSwatch(value) {
  return value
    ? `<span style="display:inline-block;width:16px;height:16px;border-radius:4px;border:1px solid rgba(0,0,0,0.1);background:${value};vertical-align:-3px;margin-right:8px;flex:0 0 auto;"></span>`
    : '';
}

// 依赖汇总表「小预览」（enhanced 模式）：折叠面板试点使用，其他组件保持仅颜色 swatch。
// 目标是在 16×16（或等宽）内直觉呈现依赖含义，超出范围的数值做视觉上限压缩。
// 注：字体/间距/圆角已改为文字数值标签（valueTag），不再使用小图形 swatch。

function borderSwatch(aspect, value) {
  if (!value) return '';
  if (aspect === 'width') {
    const numeric = parseFloat(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return '';
    const displayHeight = Math.min(Math.max(numeric, 1), 4);
    return `<span style="display:inline-block;width:16px;height:${displayHeight}px;background:#707070;margin-right:8px;vertical-align:middle;flex:0 0 auto;"></span>`;
  }
  if (aspect === 'style') {
    if (value === 'none') {
      return `<span style="display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;color:#A6A6A6;font-size:11px;margin-right:8px;vertical-align:-3px;flex:0 0 auto;">∅</span>`;
    }
    return `<span style="display:inline-block;width:16px;height:0;border-top:2px ${value} #707070;margin-right:8px;vertical-align:middle;flex:0 0 auto;"></span>`;
  }
  if (aspect === 'color') {
    const displayColor = value === 'transparent' ? '#DEE0E3' : value;
    return `<span style="display:inline-block;width:16px;height:16px;box-sizing:border-box;border:2px solid ${displayColor};background:transparent;margin-right:8px;vertical-align:-3px;flex:0 0 auto;"></span>`;
  }
  return '';
}

function shadowSwatch(value) {
  if (!value) return '';
  return `<span style="display:inline-block;width:16px;height:16px;background:#FFFFFF;border:1px solid #F0F0F0;box-shadow:${value};margin-right:8px;vertical-align:-3px;flex:0 0 auto;"></span>`;
}

// 文字型数值标签（灰底深字胶囊）：用于字体/间距/圆角等"直接写数值更直观"的依赖，
// 与蓝色 token 链接在颜色和形态上明确区分。
function valueTag(text) {
  if (!text) return '';
  return `<span style="display:inline-flex;align-items:center;height:18px;padding:0 6px;margin-right:8px;border-radius:3px;background:#EEF0F2;color:#19191A;font-size:11px;font-weight:600;line-height:1;flex:0 0 auto;white-space:nowrap;">${escapeHtml(text)}</span>`;
}

function iconSwatch(iconName) {
  if (!iconName) return '';
  const name = String(iconName).replace(/\.svg$/, '');
  const iconPath = path.join(ICONS_DIR, `${name}.svg`);
  const revision = fs.existsSync(iconPath)
    ? require('crypto').createHash('sha256').update(fs.readFileSync(iconPath)).digest('hex').slice(0, 12)
    : '';
  const query = revision ? `?v=${revision}` : '';
  return `<img src="../icons/${escapeHtml(name)}.svg${query}" alt="" style="display:inline-block;width:16px;height:16px;margin-right:8px;vertical-align:-3px;object-fit:contain;">`;
}

// ─────────────────────────────────────────────
// 通用颜色依赖表生成器（对任何组件通用，无需注册）
// 从 contract.relations.colorDependencies 读取，色值与存在性实时核对 token-specs/colors.json。
// 未 token 化的原始值也可登记（token 字段写原始值），会被标为「无对应 token」。
// ─────────────────────────────────────────────
function generateColorTable(contract) {
  const deps = (contract.relations && contract.relations.colorDependencies) || [];
  if (deps.length === 0) return null;
  const tokens = loadColorTokens();

  const rows = deps.map((d) => {
    const name = String(d.token || '');
    const isSlash = name === '/';
    const tok = !isSlash ? tokens.get(name) : null;
    const exists = !!tok;
    const value = exists ? tok.value : (d.value || '');
    const swatch = colorSwatch(value);
    const nameCell = isSlash
      ? `${swatch}<span style="color:#707070;">/</span>`
      : `${swatch}${tokenAnchor(name)}`;
    const applies = Array.isArray(d.appliesTo) && d.appliesTo.length
      ? `<br><span style="color:#707070;">（${d.appliesTo.join(' / ')}）</span>`
      : '';
    const valCell = value ? `<code>${value}</code>` : '—';
    const status = exists ? TD_GREEN('✓ 已存在') : TD_RED('✗ 无对应 token');
    return `        <tr>${TD(nameCell)}${TD(valCell)}${TD((d.usage || '') + applies)}${status}</tr>`;
  });

  const lines = [];
  lines.push(`    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">颜色依赖表</p>`);
  lines.push(`    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">本组件用到的颜色 token（自动从契约 <code>relations.colorDependencies</code> 生成，色值与存在状态实时核对 <code>token-specs/colors.json</code>）。点 token 名跳转到 <a href="tokens.html" style="color: #0060BF;">Token 总览页</a>。</p>`);
  lines.push(`    <table style="width: 100%; border-collapse: collapse;">`);
  lines.push(`      <thead>`);
  lines.push(`        <tr>${TH('颜色 Token')}${TH('色值')}${TH('用途')}${TH('存在状态')}</tr>`);
  lines.push(`      </thead>`);
  lines.push(`      <tbody>`);
  lines.push(rows.join('\n'));
  lines.push(`      </tbody>`);
  lines.push(`    </table>`);
  return lines.join('\n');
}

// ─────────────────────────────────────────────
// 通用圆角依赖表生成器（对任何组件通用，无需注册）
// 从 contract.relations.radiusDependencies 读取，值与存在性实时核对 token-specs/border-radius.json。
// 未 token 化的原始值（如 50% / 12px）也可登记，会被标为「无对应 token」。
// ─────────────────────────────────────────────
function generateRadiusTable(contract) {
  const deps = (contract.relations && contract.relations.radiusDependencies) || [];
  if (deps.length === 0) return null;
  const tokens = loadRadiusTokens();

  const rows = deps.map((d) => {
    const name = String(d.token || '');
    const isSlash = name === '/';
    const tok = !isSlash ? tokens.get(name) : null;
    const exists = !!tok;
    const value = exists ? tok.value : (d.value || '');
    const nameCell = isSlash
      ? `<span style="color:#707070;">/</span>`
      : tokenAnchor(name);
    const applies = Array.isArray(d.appliesTo) && d.appliesTo.length
      ? `<br><span style="color:#707070;">（${d.appliesTo.join(' / ')}）</span>`
      : '';
    const valCell = value ? `<code>${value}</code>` : '—';
    const status = exists ? TD_GREEN('✓ 已存在') : TD_RED('✗ 无对应 token');
    return `        <tr>${TD(nameCell)}${TD(valCell)}${TD((d.usage || '') + applies)}${status}</tr>`;
  });

  const lines = [];
  lines.push(`    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">圆角依赖表</p>`);
  lines.push(`    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">本组件用到的圆角 token（自动从契约 <code>relations.radiusDependencies</code> 生成，值与存在状态实时核对 <code>token-specs/border-radius.json</code>）。点 token 名跳转到 <a href="tokens.html" style="color: #0060BF;">Token 总览页</a>。</p>`);
  lines.push(`    <table style="width: 100%; border-collapse: collapse;">`);
  lines.push(`      <thead>`);
  lines.push(`        <tr>${TH('圆角 Token')}${TH('值')}${TH('用途')}${TH('存在状态')}</tr>`);
  lines.push(`      </thead>`);
  lines.push(`      <tbody>`);
  lines.push(rows.join('\n'));
  lines.push(`      </tbody>`);
  lines.push(`    </table>`);
  return lines.join('\n');
}

// 通用「依赖表」生成器工厂：token 为 "/" 的项显示为「/」并标「无对应 token」。
function makeTokenTable(deps, loadTokens, prefix, title, fieldLabel, srcFile, code) {
  if (!deps || deps.length === 0) return null;
  const tokens = loadTokens();
  const rows = deps.map((d) => {
    const name = String(d.token || '');
    const isSlash = name === '/';
    const tok = !isSlash ? tokens.get(name) : null;
    const exists = !!tok;
    const value = tok ? tok.value : (d.value || '');
    const nameCell = isSlash
      ? `<span style="color:#707070;">/</span>`
      : tokenAnchor(name);
    const applies = Array.isArray(d.appliesTo) && d.appliesTo.length
      ? `<br><span style="color:#707070;">（${d.appliesTo.join(' / ')}）</span>`
      : '';
    const valCell = value ? `<code>${value}</code>` : '—';
    const status = exists ? TD_GREEN('✓ 已存在') : TD_RED('✗ 无对应 token');
    return `        <tr>${TD(nameCell)}${TD(valCell)}${TD((d.usage || '') + applies)}${status}</tr>`;
  });
  const lines = [];
  lines.push(`    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${title}</p>`);
  lines.push(`    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">本组件用到的${fieldLabel}（自动从契约 <code>relations.${code}</code> 生成，值与存在状态实时核对 <code>${srcFile}</code>）。<code>/</code> 表示该值暂无对应正式 token。点 token 名跳转到 <a href="tokens.html" style="color: #0060BF;">Token 总览页</a>。</p>`);
  lines.push(`    <table style="width: 100%; border-collapse: collapse;">`);
  lines.push(`      <thead>`);
  lines.push(`        <tr>${TH(fieldLabel + ' Token')}${TH('值')}${TH('用途')}${TH('存在状态')}</tr>`);
  lines.push(`      </thead>`);
  lines.push(`      <tbody>`);
  lines.push(rows.join('\n'));
  lines.push(`      </tbody>`);
  lines.push(`    </table>`);
  return lines.join('\n');
}

function generateFontTable(contract) {
  const deps = (contract.relations && contract.relations.fontSizeDependencies) || [];
  return makeTokenTable(deps, loadFontSizeTokens, 'typography.', '字号依赖表', '字号', 'token-specs/typography.json', 'fontSizeDependencies');
}

function generateShadowTable(contract) {
  const deps = (contract.relations && contract.relations.shadowDependencies) || [];
  return makeTokenTable(deps, loadShadowTokens, 'shadow.', '投影依赖表', '投影', 'token-specs/shadows.json', 'shadowDependencies');
}

function emptyDependencyTable(title, fieldLabel, code) {
  return [
    `    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${title}</p>`,
    `    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">自动从契约 <code>relations.${code}</code> 生成；该组件当前未声明${fieldLabel}依赖。</p>`,
    `    <table style="width: 100%; border-collapse: collapse;"><tbody><tr>${TD_GRAY(`— 无${fieldLabel}依赖`)}</tr></tbody></table>`,
  ].join('\n');
}

function generateSpacingTable(contract) {
  const deps = (contract.relations && contract.relations.spacingDependencies) || [];
  return makeTokenTable(deps, loadSpacingTokens, 'spacing.', '间距依赖表', '间距', 'token-specs/spacing.json', 'spacingDependencies')
    || emptyDependencyTable('间距依赖表', '间距', 'spacingDependencies');
}

function generateBorderTable(contract) {
  const deps = (contract.relations && contract.relations.borderDependencies) || [];
  return makeTokenTable(deps, loadBorderTokens, 'border.', '描边依赖表', '描边', 'token-specs/border.json', 'borderDependencies')
    || emptyDependencyTable('描边依赖表', '描边', 'borderDependencies');
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function summaryRows(contract) {
  if (Array.isArray(contract.types) && contract.types.length > 0) return contract.types;
  return Array.isArray(contract.variants) ? contract.variants : [];
}

function appliesToRow(dep, rowName) {
  // 未填写 appliesTo 代表契约没有给出可靠的变体归属；不得把它伪造成新类型，
  // 也不得猜测为适用于全部变体。此类依赖只在下方组件级明细表展示。
  if (!Array.isArray(dep.appliesTo) || dep.appliesTo.length === 0) return false;
  return dep.appliesTo.some((target) => target === rowName || target.startsWith(`${rowName}/`));
}

// 根据 kind 返回具体依赖值的小预览片段；enhanced=false 时只保留原有的颜色 swatch。
function dependencyValueSwatch(kind, dep, resolvedValue, enhanced) {
  const value = resolvedValue !== undefined ? resolvedValue : (dep.value || '');
  if (kind === 'color') return colorSwatch(value);
  if (!enhanced) return '';
  // 字体/间距/圆角：直接展示数值文字标签，比小图形更直观（字体附带 sm/md 级别）。
  if (kind === 'font') {
    const level = fontLevelLabel(dep.token);
    return valueTag(level ? `${value} · ${level}` : value);
  }
  if (kind === 'weight') {
    const names = { 'typography.font-weight-regular': 'Regular', 'typography.font-weight-semibold': 'SemiBold' };
    return valueTag(`${names[dep.token] || ''} ${value}`.trim());
  }
  if (kind === 'spacing') return valueTag(value);
  if (kind === 'radius') return valueTag(value);
  // 描边/阴影：保留原有小图形预览。
  if (kind === 'border') return borderSwatch(dep.aspect, value);
  if (kind === 'shadow') return shadowSwatch(value);
  return '';
}

// 从 typography.font-size-xx token 名提取级别（sm/md/lg/h1…）作为字体标签后缀，
// 让「14px · md」这类展示同时给出数值与语义级别。
function fontLevelLabel(token) {
  const m = String(token || '').match(/font-size-([a-z0-9]+)/i);
  if (!m) return '';
  return /^h\d+$/i.test(m[1]) ? m[1].toUpperCase() : m[1];
}

function summaryDependencyLabel(dep, kind, colorTokens, enhanced = false) {
  if (kind === 'typography') {
    const level = fontLevelLabel(dep.fontSizeToken);
    const weightNames = { 'typography.font-weight-regular': 'Regular', 'typography.font-weight-semibold': 'SemiBold' };
    const weightName = weightNames[dep.fontWeightToken] || '';
    const label = [dep.fontSizeValue, level, weightName + ' ' + dep.fontWeightValue].filter(Boolean).join(' · ');
    return `${valueTag(label)}${tokenAnchor(dep.token)}`;
  }
  if (kind === 'icon') {
    const icon = String(dep.icon || '').replace(/\.svg$/, '');
    if (!icon) return '';
    const preview = enhanced ? iconSwatch(icon) : '';
    return `${preview}<a href="icon-map.html#${escapeHtml(icon)}" style="color:#0060BF;text-decoration:underline;"><code>${escapeHtml(icon)}.svg</code></a>`;
  }
  const token = String(dep.token || '');
  if (token === '/') {
    const value = dep.value ? escapeHtml(dep.value) : '';
    // 文字标签类（字体/间距/圆角）本身就是数值，不再额外加 swatch，避免与后面的值文字重复；
    // 颜色/描边/阴影仍显示图形 swatch。
    const isTextTagKind = kind === 'font' || kind === 'weight' || kind === 'spacing' || kind === 'radius';
    const swatch = isTextTagKind ? '' : dependencyValueSwatch(kind, dep, dep.value || '', enhanced);
    return value ? `${swatch}${value} <span style="color:#707070;">（未 token 化）</span>` : '未 token 化';
  }
  const link = tokenAnchor(token);
  const resolvedValue = kind === 'color'
    ? (colorTokens.get(token) || {}).value || dep.value || ''
    : (dep.value || '');
  const swatch = dependencyValueSwatch(kind, dep, resolvedValue, enhanced);
  return `${swatch}${link}`;
}

function summaryCell(deps, rowName, kind, colorTokens, enhanced = false) {
  const labels = deps
    .filter((dep) => appliesToRow(dep, rowName))
    .map((dep) => summaryDependencyLabel(dep, kind, colorTokens, enhanced))
    .filter(Boolean);
  const unique = [...new Set(labels)];
  if (unique.length === 0) return '<span style="color:#A6A6A6;">—</span>';
  // 单个依赖项（数值标签 + token 名/图标名）整体不换行，避免 token 名被拆成多行；
  // 表格由 grid 的 max-content 列宽自动加宽，超出时横向滚动。
  return unique.map((label) => `<span style="display:inline-flex;align-items:center;min-height:24px;white-space:nowrap;">${label}</span>`).join('<br>');
}

// 「嵌套组件」列（enhanced 模式）：按当前行的中文类型名匹配 variantDecisions[*].type，
// 从 nestedComponents[] 读取；contract 的 componentDependencies 无 appliesTo 时不参与此列，
// 因为汇总表只展示能可靠归属到具体变体的嵌套关系。
//
// 归属兜底：当汇总表按 types 分行、variantDecisions 按细分 variants 组织时（如 Button 的
// types = filled/outline，variants = filled-red/filled-black/...）无法直接匹配。
// 此时通过 variants[*].type === row.name 找到该 type 下所有变体，用它们的 chineseName
// 反向匹配 variantDecisions.type，合并所有 nestedComponents。
function summaryNestedCell(row, variantDecisions, contract) {
  // 归一化：去掉空白、常见分隔符（· / ・ / .）与中英文括号，统一小写，便于容忍契约里前缀省略、
  // 括号补充语、点号形态不同等差异。
  const normalize = (s) => String(s || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[·・．.()（）]/g, '');
  const MIN_SUFFIX_LEN = 4;
  const MIN_NAME_LEN = 3;
  // labels：候选行标签集合；useNameIncludes=true 时允许"英文 name 在 vdType 归一化后被包含"，
  // 用于覆盖 banner「首页级 Hero」↔「Hero（首页级）」这种词序颠倒但含相同英文关键字的场景。
  const labelMatch = (labels, useNameIncludes) => (d) => {
    const dKey = normalize(d.type);
    if (!dKey) return false;
    return labels.some((label) => {
      const k = normalize(label);
      if (!k) return false;
      if (k === dKey) return true;
      if (dKey.length >= MIN_SUFFIX_LEN && k.endsWith(dKey)) return true;
      if (k.length >= MIN_SUFFIX_LEN && dKey.endsWith(k)) return true;
      if (useNameIncludes && k.length >= MIN_NAME_LEN && dKey.includes(k)) return true;
      return false;
    });
  };

  const chineseLabels = [row.chineseName].filter(Boolean);
  const nameLabels = [row.name].filter(Boolean);
  let matches = variantDecisions.filter(labelMatch(chineseLabels, false));
  if (matches.length === 0 && nameLabels.length > 0) {
    matches = variantDecisions.filter(labelMatch(nameLabels, true));
  }

  if (matches.length === 0 && Array.isArray(contract.variants) && row.name) {
    const belongingVariants = contract.variants.filter((v) => v.type === row.name);
    const variantChineseNames = belongingVariants.map((v) => v.chineseName).filter(Boolean);
    const variantNames = belongingVariants.map((v) => v.name).filter(Boolean);
    matches = variantDecisions.filter(labelMatch(variantChineseNames, false));
    if (matches.length === 0) {
      matches = variantDecisions.filter(labelMatch(variantNames, true));
    }
  }

  // 标签：区分子组件声明、父组件类名证据及未核验的设计参考。
  const CHILD_TAG = '<span style="display:inline-block;flex-shrink:0;font-size:11px;line-height:16px;padding:0 5px;margin-right:6px;border-radius:3px;background:#EAF2FF;color:#0060BF;">子组件</span>';
  const parentTag = (evidence) => `<span style="display:inline-block;flex-shrink:0;font-size:11px;line-height:16px;padding:0 5px;margin-right:6px;border-radius:3px;background:#F3EEFA;color:#512971;">${evidence?.classEvidence?'父组件·类名证据':'父组件·仅声明'}</span>`;
  const REFERENCE_TAG = '<span style="display:inline-block;flex-shrink:0;font-size:11px;line-height:16px;padding:0 5px;margin-right:6px;border-radius:3px;background:#FFF3E0;color:#A65300;">参考·未验证</span>';
  const wrap = (inner) => `<span style="display:inline-flex;align-items:center;min-height:24px;white-space:normal;overflow-wrap:anywhere;">${inner}</span>`;

  const seen = new Set();
  const rendered = [];

  // 子组件：本组件内部嵌套的组件（来自 variantDecisions[*].nestedComponents）
  matches.flatMap((d) => Array.isArray(d.nestedComponents) ? d.nestedComponents : []).forEach((nc) => {
    const label = nc.label || nc.component || '';
    if (!label) return;
    const key = `child|${nc.href || ''}|${label}`;
    if (seen.has(key)) return;
    seen.add(key);
    // 「无嵌套子组件…」之类占位说明：保留为灰字说明，不加标签
    if (/^无/.test(label.trim())) {
      rendered.push(wrap(`<span style="color:#A6A6A6;">${escapeHtml(label)}</span>`));
      return;
    }
    const inner = nc.href
      ? `<a href="${escapeHtml(nc.href)}" style="color:#0060BF;text-decoration:underline;">${escapeHtml(label)}</a>`
      : `<span style="color:#19191A;">${escapeHtml(label)}</span>`;
    rendered.push(wrap(`${CHILD_TAG}${inner}`));
  });

  // 声明的父组件：链接只供打开 Preview 复核，不能表示完整结构或浏览器验收通过。
  const embeddedIn = contract && contract.name ? getAutoCommonlyEmbeddedIn(contract.name) : [];
  embeddedIn.forEach((item) => {
    const name = item.component || '';
    if (!name) return;
    const applies = Array.isArray(item.appliesTo) && item.appliesTo.length
      ? item.appliesTo.some((t) => t === row.name || String(t).startsWith(`${row.name}/`))
      : true;
    if (!applies) return;
    const key = `parent|${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const previewFile = path.join(__dirname, '..', 'components', 'variants', `${kebab}.html`);
    const previewExists = fs.existsSync(previewFile);
    const previewHtml = previewExists ? fs.readFileSync(previewFile, 'utf8') : '';
    const hostAnchor = item.hostPreviewAnchor
      && (previewHtml.includes(`id="${item.hostPreviewAnchor}"`) || previewHtml.includes(`id='${item.hostPreviewAnchor}'`))
      ? item.hostPreviewAnchor
      : '';
    const href = `${kebab}.html${hostAnchor ? `#${hostAnchor}` : ''}`;
    const inner = previewExists
      ? `<a href="${href}" style="color:#0060BF;text-decoration:underline;">${escapeHtml(name)}</a>`
      : `<span style="color:#19191A;">${escapeHtml(name)}</span>`;
    rendered.push(wrap(`${parentTag(item.evidence)}${inner}`));
  });

  // 参考父关系：保留设计意图，但不链接、不冒充已实现依赖；若同名关系已自动推导则前置逻辑去重。
  getReferenceCommonlyEmbeddedIn(contract).forEach((item) => {
    const name = item.component || '';
    if (!name) return;
    const applies = Array.isArray(item.appliesTo) && item.appliesTo.length
      ? item.appliesTo.some((t) => t === row.name || String(t).startsWith(`${row.name}/`))
      : true;
    if (!applies) return;
    const key = `parent|${name}`;
    if (seen.has(key)) return;
    seen.add(key);
    const note = escapeHtml(item.verifiedNote || '宿主 preview 尚无真实结构');
    rendered.push(wrap(`${REFERENCE_TAG}<span style="color:#19191A;" title="${note}">${escapeHtml(name)}</span>`));
  });

  if (rendered.length === 0) return '<span style="color:#A6A6A6;">—</span>';
  return rendered.join('<br>');
}

function generateDependencySummaryTable(contract, options = {}) {
  const enhanced = options.enhanced === true;
  const english = contract && contract.locale === 'en';
  const rows = summaryRows(contract);
  if (rows.length === 0) return null;
  const relations = contract.relations || {};
  const colorTokens = loadColorTokens();
  const variantDecisions = Array.isArray(relations.variantDecisions) ? relations.variantDecisions : [];
  const columns = [
    ['colorDependencies', 'color'],
    ['typographyDependencies', 'typography'],
    ['spacingDependencies', 'spacing'],
    ['borderDependencies', 'border'],
    ['radiusDependencies', 'radius'],
    ['shadowDependencies', 'shadow'],
    ['iconDependencies', 'icon'],
  ];
  // 使用 CSS Grid 布局：一个大 grid 承载所有 cells。首列 cell 通过 position:sticky 冻结，
  // 只有右侧列可横向滚动；grid 天然让每行的 sticky cell 与右侧 cell 行高一致，
  // 不再需要 tr height 同步 hack。样式定义见 components.css 底部的「依赖汇总表」段。
  const description = english
    ? (enhanced
      ? 'A variant-by-variant summary of component relationships, color, typography, spacing, border, radius, shadow, and icon dependencies. Dependencies without <code>appliesTo</code> are not assigned to a variant. Parent relationships show declarations or offline class evidence, not verified child structure or browser acceptance. Links open Preview for review.'
      : 'A variant-by-variant summary of color, typography, spacing, border, radius, shadow, and icon dependencies. Dependencies without <code>appliesTo</code> are not assigned to a variant.')
    : (enhanced
      ? '按组件类型汇总组件关系、颜色、字体、间距、描边、圆角、阴影和图标依赖；未填写 <code>appliesTo</code> 的组件级依赖不猜测变体归属，不参与本表归类。「组件关系」列用标签区分：<span style="display:inline-block;font-size:11px;line-height:16px;padding:0 5px;border-radius:3px;background:#EAF2FF;color:#0060BF;">子组件</span> = 嵌入本组件内部；<span style="display:inline-block;font-size:11px;line-height:16px;padding:0 5px;border-radius:3px;background:#F3EEFA;color:#512971;">父组件·类名证据／仅声明</span> = 从宿主 <code>componentDependencies</code> 自动推导；类名出现不等于具体变体、尺寸、必需结构或交互已验证，链接仅供打开 Preview 复核；<span style="display:inline-block;font-size:11px;line-height:16px;padding:0 5px;border-radius:3px;background:#FFF3E0;color:#A65300;">参考·未验证</span> = 仅保留设计意图，宿主 preview 尚无真实结构，不可作为已实现依赖。'
      : '按组件类型汇总颜色、字体、间距、描边、圆角、阴影和图标依赖；未填写 <code>appliesTo</code> 的组件级依赖不猜测变体归属，不参与本表归类。');
  const dataHeaders = english
    ? ['Color', 'Typography', 'Spacing', 'Border', 'Radius', 'Shadow', 'Icon']
    : ['颜色', '字体', '间距', '描边', '圆角', '阴影', '图标'];
  if (enhanced) dataHeaders.push(english ? 'Component relationships' : '组件关系');
  // 首列与各数据列都用 minmax(max-content, 1fr)：min 取该列最宽的不换行内容，
  // 保证 token 名不被拆行；剩余空间由 1fr 均分，内容过宽时容器横向滚动。
  const gridTemplate = `minmax(max-content, auto) repeat(${dataHeaders.length}, minmax(max-content, 1fr))`;
  const stickyCellClass = 'dep-cell dep-cell--sticky';
  const stickyHeadClass = 'dep-cell dep-cell--sticky dep-cell--head';
  const headClass = 'dep-cell dep-cell--head';
  const dataCellClass = 'dep-cell';

  const parts = [];
  parts.push(`    <div style="margin-bottom: 0; padding: 24px; background: #FAFBFC; border: 1px solid var(--color-gray-5); border-radius: 8px;">`);
  parts.push(`      <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${english ? 'Dependency summary' : '依赖汇总表'}</p>`);
  parts.push(`      <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">${description}</p>`);
  parts.push(`      <div class="dep-summary-scroll">`);
  parts.push(`        <div class="dep-summary-grid" style="grid-template-columns:${gridTemplate};">`);
  // header row
  parts.push(`          <div class="${stickyHeadClass}" role="columnheader">${english ? 'Variant' : '组件类型'}</div>`);
  dataHeaders.forEach((label, i) => {
    const isLastCol = i === dataHeaders.length - 1;
    parts.push(`          <div class="${headClass}${isLastCol ? ' dep-cell--right-edge' : ''}" role="columnheader">${label}</div>`);
  });
  // data rows
  rows.forEach((row, rowIdx) => {
    const isLastRow = rowIdx === rows.length - 1;
    const typeName = `<strong>${escapeHtml(row.chineseName || row.name)}</strong><br><code>${escapeHtml(row.name)}</code>`;
    parts.push(`          <div class="${stickyCellClass}${isLastRow ? ' dep-cell--bottom-edge' : ''}" role="rowheader">${typeName}</div>`);
    columns.forEach(([key, kind], colIdx) => {
      const cellHtml = summaryCell(relations[key] || [], row.name, kind, colorTokens, enhanced);
      const isLastCol = !enhanced && colIdx === columns.length - 1;
      const classes = `${dataCellClass}${isLastCol ? ' dep-cell--right-edge' : ''}${isLastRow ? ' dep-cell--bottom-edge' : ''}`;
      parts.push(`          <div class="${classes}" role="cell">${cellHtml}</div>`);
    });
    if (enhanced) {
      const nestedHtml = summaryNestedCell(row, variantDecisions, contract);
      const classes = `${dataCellClass} dep-cell--right-edge${isLastRow ? ' dep-cell--bottom-edge' : ''}`;
      parts.push(`          <div class="${classes}" role="cell">${nestedHtml}</div>`);
    }
  });
  parts.push(`        </div>`);
  parts.push(`      </div>`);
  parts.push(`    </div>`);
  return parts.join('\n');
}

function findMatchingDivEnd(source, openingStart) {
  const tag = /<\/?div\b[^>]*>/g;
  tag.lastIndex = openingStart;
  let depth = 0;
  let match;
  while ((match = tag.exec(source))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (depth === 0) return tag.lastIndex;
  }
  return -1;
}

function generatedBlockRanges(source) {
  const starts = /<!-- AUTO-GENERATED-(?:DEPENDENCY-SUMMARY-TABLE|ICON-TABLE|COLOR-TABLE|SPACING-TABLE|BORDER-TABLE|RADIUS-TABLE|FONT-TABLE|SHADOW-TABLE):START -->/g;
  const ranges = [];
  let match;
  while ((match = starts.exec(source))) {
    const endMarker = match[0].replace(':START', ':END');
    const end = source.indexOf(endMarker, match.index);
    if (end < 0) continue;
    ranges.push({ start: match.index, end: end + endMarker.length, block: source.slice(match.index, end + endMarker.length) });
  }
  return ranges;
}

function removeRanges(source, ranges) {
  return [...ranges].sort((a, b) => b.start - a.start).reduce(
    (result, range) => result.slice(0, range.start) + result.slice(range.end),
    source
  );
}

function findContainingDivStart(source, contentIndex) {
  const starts = [];
  const divs = /<div\b[^>]*>/g;
  let match;
  while ((match = divs.exec(source))) {
    if (match.index >= contentIndex) break;
    const end = findMatchingDivEnd(source, match.index);
    if (end > contentIndex) starts.push(match.index);
  }
  return starts.length ? starts[starts.length - 1] : -1;
}

// ─────────────────────────────────────────────
// 变体决策 + 关联关系表：从 contract.relations.variantDecisions 机械生成
// ─────────────────────────────────────────────
function renderDecisionRow(row) {
  const cellStyle = 'style="font-size:12px;padding:8px 10px;border:1px solid #DEE0E3;vertical-align:top;line-height:18px;word-break:break-word;"';
  const statusStyle = 'style="font-size:12px;padding:8px 10px;border:1px solid #DEE0E3;vertical-align:top;line-height:18px;word-break:break-word;color:#10A300;font-weight:600;"';
  const whenParts = [`<strong>用：</strong>${row.whenToUse || ''}`];
  if (row.whenNotToUse) {
    whenParts.push(`<br><strong style="color:#707070;">不用：</strong>${row.whenNotToUse}`);
  }
  const nested = row.nestedComponents && row.nestedComponents.length
    ? row.nestedComponents.map((nc) => {
        const label = nc.label || nc.component;
        return nc.href
          ? `<a href="${nc.href}" style="color:#0060BF;">${label}</a>`
          : label;
      }).join(' + ')
    : '<span style="color:#707070;">无嵌套子组件</span>';
  const status = `✓ ${row.status || '已核实'}`;
  return [
    '        <tr>',
    `          <td ${cellStyle}>${row.type}</td>`,
    `          <td ${cellStyle}>${whenParts.join('')}</td>`,
    `          <td ${cellStyle}><code>${row.className || ''}</code></td>`,
    `          <td ${cellStyle}>${nested}</td>`,
    `          <td ${statusStyle}>${status}</td>`,
    '        </tr>',
  ].join('\n');
}

// ─────────────────────────────────────────────
// 合并的「变体决策」表：一张 table 同时承载硬规则说明与变体决策数据。
//   - 声明 group 的组件显示「一级分类」+「二级分类」+「变体决策」三列；其他组件保留「类型」+「变体决策」两列。
//   - 硬规则区域仍从契约 relations.hardRules 读取；无硬规则时输出「⚠️ 硬规则：无」占位标题行。
//   - 决策数据仍从 relations.variantDecisions 读取。
// 该函数是所有含 AUTO-GENERATED-DECISION-TABLE 标记的组件预览页的唯一生成入口。
// ─────────────────────────────────────────────
function generateMergedDecisionTable(contract) {
  if (!contract || !contract.relations) return null;
  const english = contract.locale === 'en';
  const rules = Array.isArray(contract.relations.hardRules) ? contract.relations.hardRules : [];
  const decisions = Array.isArray(contract.relations.variantDecisions) ? contract.relations.variantDecisions : [];
  const separateRules = rules.filter(rule => !decisions.some(row => row.type === rule.displayInVariant));
  if (rules.length === 0 && decisions.length === 0) return null;
  const description = contract.relations.variantDecisionsDescription || '';
  const thStyle = 'style="background:#F6F6F8;font-size:12px;font-weight:600;text-align:left;padding:8px 10px;border:1px solid #DEE0E3;"';
  const cellStyle = 'style="font-size:12px;padding:8px 10px;border:1px solid #DEE0E3;vertical-align:top;line-height:18px;word-break:break-word;"';
  if (decisions.length && decisions.every(row => row.selectionCases?.length)) {
    const groups = decisions.map(row => {
      return `<tbody>${row.selectionCases.map((item, index) => {
        const label = item.kind==='use' ? (item.strength==='required'?'必须使用':'候选') : {avoid:'不用',reference:'设计参考'}[item.kind];
        const name = index === 0 ? `<th scope="rowgroup" rowspan="${row.selectionCases.length}" ${cellStyle}>${escapeHtml(row.type)}</th>` : '';
        const checkNote = item.automaticCheck ? '<div style="margin-top:6px;color:#707070;">使用场景有自动检查</div>' : '';
        return `<tr>${name}<td ${cellStyle}>${escapeHtml(item.condition)}</td><td ${cellStyle}><strong>${label} · </strong>${escapeHtml(item.result)}${checkNote}</td></tr>`;
      }).join('\n')}</tbody>`;
    });
    return [
      '    <p style="font-size:14px;font-weight:600;margin-bottom:4px;">变体决策</p>',
      `    <p style="font-size:12px;color:#707070;margin-bottom:12px;">${escapeHtml(description)}</p>`,
      '    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">',
      '      <colgroup><col style="width:18%"><col style="width:38%"><col style="width:44%"></colgroup>',
      `      <thead><tr>${['变体', '匹配条件', '选型结论'].map(label => `<th scope="col" ${thStyle}>${label}</th>`).join('')}</tr></thead>`,
      ...groups,
      // Case decisions and original hard rules coexist; neither replaces the other.
      ...separateRules.map(rule => `<tbody><tr><th colspan="3" ${thStyle}>⚠️ 硬规则：${escapeHtml(rule.title || '')}</th></tr><tr><td colspan="2" ${cellStyle}><strong>描述原文</strong><div>${rule.ruleContent || ''}</div></td><td ${cellStyle}><strong>AI 解析（写入契约 JSON 的字段）</strong><pre style="white-space:pre-wrap;word-break:break-all;">${escapeHtml(rule.aiParse || '')}</pre></td></tr></tbody>`),
      '    </table>'
    ].join('\n');
  }
  // 当每条决定同时声明一级 group 时，生成「一级分类 → 二级分类 → 变体决策」三列结构；
  // 其他组件未声明 group，继续使用现有两列结构，避免扩大既有 preview 的视觉变更。
  const usesSecondaryCategories = decisions.length > 0
    && decisions.every((row) => typeof row.group === 'string' && row.group.trim().length > 0);
  const decisionColumnCount = usesSecondaryCategories ? 3 : 2;
  const groupedDecisions = [];
  if (usesSecondaryCategories) {
    for (const row of decisions) {
      const group = row.group.trim();
      const previous = groupedDecisions[groupedDecisions.length - 1];
      if (previous && previous.name === group) previous.rows.push(row);
      else groupedDecisions.push({ name: group, rows: [row] });
    }
  }

  const lines = [];
  lines.push(`    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">${english ? 'Variant decisions' : '变体决策'}</p>`);
  lines.push(`    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">${description}</p>`);
  lines.push('    <table style="width:100%;border-collapse:collapse;table-layout:fixed;">');
  lines.push('      <colgroup>');
  if (usesSecondaryCategories) {
    lines.push('        <col style="width:22%;">');
    lines.push('        <col style="width:22%;">');
    lines.push('        <col style="width:56%;">');
  } else {
    lines.push('        <col style="width:50%;">');
    lines.push('        <col style="width:50%;">');
  }
  lines.push('      </colgroup>');
  lines.push('      <tbody>');
  // 顺序：先决策表头 + 数据行；硬规则说明放到表底部作为附加说明区。
  lines.push('        <tr>');
  if (usesSecondaryCategories) {
    lines.push(`          <th ${thStyle}>${english ? 'Primary category' : '一级分类'}</th>`);
    lines.push(`          <th ${thStyle}>${english ? 'Secondary category' : '二级分类'}</th>`);
  } else {
    lines.push(`          <th ${thStyle}>${english ? 'Type' : '类型'}</th>`);
  }
  lines.push(`          <th ${thStyle}>${english ? 'When to use' : '变体决策（什么场景用）'}</th>`);
  lines.push('        </tr>');
  // 每条变体拆成「用 / 不用」两行。三级结构中，一级分类跨同组全部行，二级分类跨其两行。
  const renderDecisionRows = (row, groupName, groupRowspan) => {
    const checks = rules.filter(rule => rule.displayInVariant === row.type && rule.enforcement)
      .map(rule => `<br><strong>自动检查：</strong>${rule.enforcement}`).join('');
    const useCell = `<strong>${english ? 'Use:' : '用：'}</strong>${row.whenToUse || ''}${checks}`;
    const notUseCell = row.whenNotToUse
      ? `<strong style="color:#707070;">${english ? 'Do not use:' : '不用：'}</strong>${row.whenNotToUse}`
      : '<span style="color:#A6A6A6;">—</span>';
    lines.push('        <tr>');
    if (groupName) lines.push(`          <td ${cellStyle} rowspan="${groupRowspan}">${groupName}</td>`);
    lines.push(`          <td ${cellStyle} rowspan="2">${row.type}</td>`);
    lines.push(`          <td ${cellStyle}>${useCell}</td>`);
    lines.push('        </tr>');
    lines.push('        <tr>');
    lines.push(`          <td ${cellStyle}>${notUseCell}</td>`);
    lines.push('        </tr>');
  };
  if (usesSecondaryCategories) {
    for (const group of groupedDecisions) {
      const groupRowspan = group.rows.length * 2;
      group.rows.forEach((row, rowIndex) => renderDecisionRows(row, rowIndex === 0 ? group.name : '', groupRowspan));
    }
  } else {
    for (const row of decisions) renderDecisionRows(row, '', 0);
  }
  // 硬规则区（每条硬规则占「标题行 + 内容行」两行；三级表中 AI 解析跨后二列，保证内容宽度。）
  if (rules.length === 0) {
    lines.push('        <tr>');
    lines.push(`          <td colspan="${decisionColumnCount}" style="background:#FFF3E0;color:#F56300;font-size:12px;font-weight:600;padding:10px 12px;border:1px solid #DEE0E3;">⚠️ 硬规则：无</td>`);
    lines.push('        </tr>');
  } else {
    for (const rule of separateRules) {
      lines.push('        <tr>');
      lines.push(`          <td colspan="${decisionColumnCount}" style="background:#FFF3E0;color:#F56300;font-size:12px;font-weight:600;padding:10px 12px;border:1px solid #DEE0E3;">⚠️ ${english ? 'Hard rule:' : '硬规则：'} ${rule.title || ''}</td>`);
      lines.push('        </tr>');
      lines.push('        <tr>');
      lines.push('          <td style="border:1px solid #DEE0E3;padding:12px;font-size:12px;line-height:20px;vertical-align:top;word-break:break-word;">');
      lines.push('            <p style="font-size:11px;font-weight:600;color:#707070;margin-bottom:6px;">👤 描述原文</p>');
      lines.push(`            <div>${rule.ruleContent || ''}</div>`);
      lines.push('          </td>');
      lines.push(`          <td${usesSecondaryCategories ? ' colspan="2"' : ''} style="border:1px solid #DEE0E3;padding:12px;font-size:12px;line-height:20px;vertical-align:top;word-break:break-word;">`);
      lines.push('            <p style="font-size:11px;font-weight:600;color:#707070;margin-bottom:6px;">🤖 AI 解析（写入契约 JSON 的字段）</p>');
      lines.push(`            <pre style="margin:0;font-family:'SF Mono',Consolas,monospace;font-size:11px;line-height:18px;white-space:pre-wrap;word-break:break-all;overflow-wrap:anywhere;color:#19191A;">${rule.aiParse || ''}</pre>`);
      lines.push('          </td>');
      lines.push('        </tr>');
    }
  }
  lines.push('      </tbody>');
  lines.push('    </table>');
  return lines.join('\n');
}

function generateDecisionTable(contract) {
  if (!contract || !contract.relations || !Array.isArray(contract.relations.variantDecisions)) return null;
  const rows = contract.relations.variantDecisions;
  if (rows.length === 0) return null;
  const description = contract.relations.variantDecisionsDescription || '';
  const thStyle = 'style="background:#F6F6F8;font-size:12px;font-weight:600;text-align:left;padding:8px 10px;border:1px solid #DEE0E3;"';
  const body = rows.map(renderDecisionRow).join('\n');
  return [
    '    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">变体决策 + 关联关系表</p>',
    `    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">${description}</p>`,
    '    <table style="width:100%;border-collapse:collapse;">',
    '      <thead>',
    '        <tr>',
    `          <th ${thStyle}>类型</th>`,
    `          <th ${thStyle}>变体决策（什么场景用）</th>`,
    `          <th ${thStyle}>Class</th>`,
    `          <th ${thStyle}>嵌套子组件</th>`,
    `          <th ${thStyle}>关联状态</th>`,
    '        </tr>',
    '      </thead>',
    '      <tbody>',
    body,
    '      </tbody>',
    '    </table>',
  ].join('\n');
}

function hardRuleRanges(source) {
  const startMarker = '<!-- AUTO-GENERATED-PREVIEW:START -->';
  const endMarker = '<!-- AUTO-GENERATED-PREVIEW:END -->';
  const ranges = [];
  let cursor = 0;
  while (true) {
    const start = source.indexOf(startMarker, cursor);
    if (start < 0) break;
    const end = source.indexOf(endMarker, start);
    if (end < 0) break;
    ranges.push({ start, end: end + endMarker.length, block: source.slice(start, end + endMarker.length) });
    cursor = end + endMarker.length;
  }
  return ranges;
}

function removeManagedSpacers(source) {
  return source
    .replace(/\s*<!-- DEPENDENCY-SUMMARY-SPACING -->\s*<div style="height:24px;"><\/div>/g, '')
    .replace(/\s*<div style="height:24px;"><\/div>/g, '');
}

function normalizeTemplateTopContent(content) {
  // 源码注释仅供人类阅读定位这段结构，保留旧文本以避免所有预览页因注释变化被再写一次；
  // 实际用于匹配的是下面的正则（兼容合并模式的「变体决策」与旧模版的「变体决策 + 关联关系表」）。
  const relationComment = '<!-- 变体决策 + 关联关系表 -->';
  const relationHeadingRegex = />变体决策(?:\s*\+\s*关联关系表)?<\/p>/g;
  const isNavigation = content.includes('class="ds-nav-header"') && content.includes('class="ds-nav-footer"');
  let cursor = 0;

  while (true) {
    relationHeadingRegex.lastIndex = cursor;
    const match = relationHeadingRegex.exec(content);
    if (!match) break;
    const headingIndex = match.index;
    const headingLength = match[0].length;
    const decisionStart = findContainingDivStart(content, headingIndex);
    const decisionEnd = decisionStart >= 0 ? findMatchingDivEnd(content, decisionStart) : -1;
    const precedingCommentStart = decisionStart >= 0 ? content.lastIndexOf('<!--', decisionStart) : -1;
    const precedingCommentEnd = precedingCommentStart >= 0 ? content.indexOf('-->', precedingCommentStart) : -1;
    const commentStart = precedingCommentStart >= 0
      && precedingCommentEnd >= 0
      && content.slice(precedingCommentStart, precedingCommentEnd).includes('变体决策')
      ? precedingCommentStart
      : -1;
    if (decisionEnd < 0 || commentStart < 0) {
      cursor = headingIndex + headingLength;
      continue;
    }

    let segmentEnd = decisionEnd;
    const firstDivAfterComment = content.indexOf('<div', commentStart);
    if (isNavigation) {
      const demoStart = content.indexOf('<div class="nav-note"', decisionEnd);
      if (demoStart < 0) {
        cursor = decisionEnd;
        continue;
      }
      segmentEnd = demoStart;
    } else if (firstDivAfterComment !== decisionStart) {
      cursor = decisionEnd;
      continue;
    }

    const segment = content.slice(commentStart, segmentEnd);
    const hardRanges = hardRuleRanges(segment);
    const dependencyRanges = generatedBlockRanges(segment);
    const openingEnd = content.indexOf('>', decisionStart) + 1;
    const closingStart = content.lastIndexOf('</div>', decisionEnd);
    let decisionBody = content.slice(openingEnd, closingStart);
    const bodyOffset = openingEnd - commentStart;
    const nestedRanges = [...hardRanges, ...dependencyRanges]
      .filter((range) => range.start >= bodyOffset && range.end <= closingStart - commentStart)
      .map((range) => ({ start: range.start - bodyOffset, end: range.end - bodyOffset }));
    decisionBody = removeManagedSpacers(removeRanges(decisionBody, nestedRanges)).trim();

    const hardRules = hardRanges.map((range) => range.block.trim());
    const dependencies = dependencyRanges.map((range) => range.block.trim());
    const dependencyContent = dependencies.length === 0 ? '' : [
      '  <!-- DEPENDENCY-SUMMARY-SPACING -->',
      '  <div style="height:24px;"></div>',
      dependencies.map((block) => `  ${block}`).join('\n\n  <div style="height:24px;"></div>\n\n'),
    ].join('\n');
    const normalized = [
      relationComment,
      '  <div style="margin-bottom: 0; padding: 24px; background: #FAFBFC; border: 1px solid var(--color-gray-5); border-radius: 8px;">',
      ...hardRules.map((block) => `    ${block}`),
      decisionBody ? `    ${decisionBody}` : '',
      '  </div>',
      dependencyContent,
    ].filter(Boolean).join('\n');

    content = content.slice(0, commentStart) + normalized + content.slice(segmentEnd);
    cursor = commentStart + normalized.length;
  }
  return content;
}

function migrateCardIconTable(content) {
  const marker = '<!-- 图标依赖表：以卡片类型为行主键';
  const start = content.indexOf(marker);
  if (start < 0 || content.includes('<!-- AUTO-GENERATED-ICON-TABLE:START -->')) return content;
  const tableEnd = content.indexOf('</table>', start);
  if (tableEnd < 0) return content;
  const end = tableEnd + '</table>'.length;
  return content.slice(0, start)
    + '<!-- AUTO-GENERATED-ICON-TABLE:START -->\n    <!-- AUTO-GENERATED-ICON-TABLE:END -->'
    + content.slice(end);
}

function decisionPanel(description, rows) {
  const body = rows.map((row) => `        <tr><td>${row.type}</td><td style="line-height:18px;">${row.when}</td><td><code>${row.className}</code></td><td>${row.children || '<span style="color:#707070;">无嵌套子组件</span>'}</td><td style="color:#10A300;font-weight:600;">${row.status || '✓ 已核实'}</td></tr>`).join('\n');
  return `<!-- 变体决策 + 关联关系表 -->\n  <div style="margin-bottom: 0; padding: 24px; background: #FAFBFC; border: 1px solid var(--color-gray-5); border-radius: 8px;">\n    <p style="font-size: 14px; font-weight: 600; margin-bottom: 4px;">变体决策 + 关联关系表</p>\n    <p style="font-size: 12px; color: #707070; margin-bottom: 12px;">${description}</p>\n    <table style="width:100%;border-collapse:collapse;">\n      <thead><tr><th>类型</th><th>变体决策（什么场景用）</th><th>Class</th><th>嵌套子组件</th><th>关联状态</th></tr></thead>\n      <tbody>\n${body}\n      </tbody>\n    </table>\n  </div>`;
}

const DECISION_TABLES = {
  'navigation': decisionPanel('Header 与 Footer 是页面级固定片段；Rule 0、依赖组件和互斥关系均已在契约中声明。', [
    { type: '公共头部', className: 'ds-nav-header', when: '<strong>用：</strong>每个页面最外层的统一站点头部，必须逐字复用。<br><strong style="color:#707070;">不用：</strong>任何自定义、竞品或子站头部。', status: '✓ Rule 0 强制' },
    { type: '公共底部', className: 'ds-nav-footer', when: '<strong>用：</strong>每个页面底部的统一站点页脚，必须逐字复用。', children: '<a href="button.html" style="color:#0060BF;">Button</a> + <a href="text-button.html" style="color:#0060BF;">TextButton</a>', status: '✓ Rule 0 强制' },
  ]),
  'video-button': decisionPanel('形态选择来自契约 types 与尺寸约束；图标信息仅在独立图标依赖表中维护。', [
    { type: '时间标签', className: 'ds-video-btn--dark/light ds-video-btn--s/l', when: '<strong>用：</strong>视频封面上需展示播放时长，选 S 或 L。<br><strong style="color:#707070;">不用：</strong>只需纯播放入口 → 用播放按钮。' },
    { type: '播放按钮', className: 'ds-video-btn--dark/light ds-video-btn--xl', when: '<strong>用：</strong>视频封面或 Hero 的纯播放入口；XL 仅显示播放图标。<br><strong style="color:#707070;">不用：</strong>需要时间文字 → 用时间标签。' },
  ]),
  'icon-button': decisionPanel('类型、尺寸范围和互斥规则均以组件契约为准；实际图标属于图标库选择，不在嵌套子组件列登记。', [
    { type: '带边框', className: 'ds-icon-btn--bordered ds-icon-btn--xl', when: '<strong>用：</strong>需要明确边界的独立图标操作，仅支持 XL。<br><strong style="color:#707070;">不用：</strong>工具栏或行内紧凑操作 → 用无边框。' },
    { type: '无边框', className: 'ds-icon-btn--plain ds-icon-btn--l/m/s/xs', when: '<strong>用：</strong>工具栏、列表行等紧凑操作，按空间选 L/M/S/XS。<br><strong style="color:#707070;">不用：</strong>需要显式按钮边界 → 用带边框。' },
  ]),
  'breadcrumb': decisionPanel('面包屑由文本和链接组成；Banner 各变体均可选，样式按实际背景明暗决定，不参与 Banner 变体选择。', [
    { type: '常规（浅色背景）', className: 'ds-breadcrumb', when: '<strong>用：</strong>正文或浅色背景（包括 Mini Banner）上的路径导航。<br><strong style="color:#707070;">不用：</strong>叠加在深色背景 → 用反白。' },
    { type: '反白（深色背景）', className: 'ds-breadcrumb ds-breadcrumb--dark', when: '<strong>用：</strong>深色背景（包括 Hero、Sub、Search、Title-only Banner），保证可读性。<br><strong style="color:#707070;">不用：</strong>浅色背景 → 用常规。', children: '<a href="banner.html" style="color:#0060BF;">Banner（所有变体可选）</a>' },
  ]),
  'dropdown': decisionPanel('六种变体共享 trigger/panel 骨架；可选插槽和嵌套组件仅按契约的 componentDependencies 填写。', [
    { type: '基础下拉', className: 'ds-dropdown', when: '<strong>用：</strong>只需触发器与选项列表。<br><strong style="color:#707070;">不用：</strong>选项较多需检索 → 用带搜索。' },
    { type: '带搜索', className: 'ds-dropdown__search', when: '<strong>用：</strong>列表需要搜索入口。<br><strong style="color:#707070;">不用：</strong>无需搜索 → 用基础下拉。' },
    { type: '多选 Checkbox', className: 'ds-dropdown__item--muted', when: '<strong>用：</strong>需要从选项中多选。', children: '<a href="checkbox.html" style="color:#0060BF;">Checkbox（sm）</a>' },
    { type: '分组', className: 'ds-dropdown__group-title / __footer', when: '<strong>用：</strong>按组组织选项，可提供确认/取消操作。', children: '<a href="checkbox.html" style="color:#0060BF;">Checkbox（sm）</a> + <a href="button.html" style="color:#0060BF;">Button</a>' },
    { type: 'Filter 筛选', className: 'ds-dropdown__filter-trigger', when: '<strong>用：</strong>使用胶囊触发器的多组筛选。', children: '<a href="checkbox.html" style="color:#0060BF;">Checkbox（sm）</a>' },
    { type: '品牌选择', className: 'ds-dropdown__trigger--sm / __search--bordered', when: '<strong>用：</strong>小尺寸品牌选择且需搜索。' },
  ]),
  'input': decisionPanel('背景变体、状态和与 Form 的样式别名均来自契约；清除图标仅在下方图标依赖表中说明。', [
    { type: '灰底', className: 'ds-input-field__input--gray', when: '<strong>用：</strong>白色背景区域。<br><strong style="color:#707070;">不用：</strong>灰色背景区域 → 用白底描边。' },
    { type: '白底描边', className: 'ds-input-field__input--white', when: '<strong>用：</strong>灰色背景区域。<br><strong style="color:#707070;">不用：</strong>白色背景区域 → 用灰底。' },
  ]),
};

function ensureDecisionTable(content, componentId) {
  if (content.includes('变体决策 + 关联关系表')) return content;
  const table = DECISION_TABLES[componentId];
  if (!table) return content;
  if (componentId === 'navigation') {
    const topPanel = '<div style="margin: 0; padding: 24px; background: #FAFBFC; border-bottom: 1px solid #DEE0E3;">';
    const hardEnd = '<!-- AUTO-GENERATED-PREVIEW:END -->';
    if (!content.includes(topPanel) || !content.includes(hardEnd)) return content;
    return content
      .replace(topPanel, `<!-- 变体决策 + 关联关系表 -->\n  ${topPanel}`)
      .replace(hardEnd, `${hardEnd}\n    ${table.replace('<!-- 变体决策 + 关联关系表 -->\n  ', '')}`);
  }
  const summary = '<!-- DEPENDENCY-SUMMARY-SPACING -->';
  return content.includes(summary) ? content.replace(summary, `${table}\n\n    ${summary}`) : content;
}

function generatedTableEndMatches(source) {
  return [...source.matchAll(/<!-- AUTO-GENERATED-(?:DEPENDENCY-SUMMARY-TABLE|ICON-TABLE|COLOR-TABLE|SPACING-TABLE|BORDER-TABLE|RADIUS-TABLE|FONT-TABLE|SHADOW-TABLE):END -->/g)];
}

function normalizeTemplateDemoContent(content) {
  const startMarker = '<!-- TEMPLATE-DEMO:START -->';
  const endMarker = '<!-- TEMPLATE-DEMO:END -->';
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker, start);
  const ends = generatedTableEndMatches(content);
  const last = ends[ends.length - 1];
  if (start < 0 || end < 0 || !last || start > last.index) return content;
  const demo = content.slice(start, end + endMarker.length);
  const withoutDemo = content.slice(0, start) + content.slice(end + endMarker.length);
  const remainingEnds = generatedTableEndMatches(withoutDemo);
  if (remainingEnds.length === 0) return content;
  const remainingLast = remainingEnds[remainingEnds.length - 1];
  const insertAt = remainingLast.index + remainingLast[0].length;
  return withoutDemo.slice(0, insertAt) + `\n\n  ${demo}` + withoutDemo.slice(insertAt);
}

function normalizeUnmarkedDemoContent(content) {
  const blocks = generatedBlockRanges(content);
  const summary = blocks.find((block) => block.block.includes('AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE'));
  const firstDetail = summary && blocks.find((block) => block.start > summary.end);
  if (!summary || !firstDetail) return content;

  const detailWrapperStart = findContainingDivStart(content, firstDetail.start);
  if (detailWrapperStart < summary.end) return content;
  const demo = content.slice(summary.end, detailWrapperStart);
  if (!demo.includes('class="section"')) return content;

  const withoutDemo = content.slice(0, summary.end) + content.slice(detailWrapperStart);
  const ends = generatedTableEndMatches(withoutDemo);
  if (ends.length === 0) return content;
  const last = ends[ends.length - 1];
  const insertAt = last.index + last[0].length;
  return withoutDemo.slice(0, insertAt) + `\n\n  ${demo.trim()}` + withoutDemo.slice(insertAt);
}

function findTemplateDemoStart(content, afterIndex) {
  const candidates = [
    content.indexOf('<!-- TEMPLATE-DEMO:START -->', afterIndex),
    content.indexOf('<div class="nav-note"', afterIndex),
    content.indexOf('<div class="section"', afterIndex),
  ].filter((index) => index >= 0);
  return candidates.length === 0 ? -1 : Math.min(...candidates);
}

function ensureTemplateDemoSpacing(content) {
  content = content.replace(/\s*<!-- TEMPLATE-DEMO-SPACING -->\s*<div style="height:24px;"><\/div>\s*/g, '\n\n');
  const ends = generatedTableEndMatches(content);
  const last = ends[ends.length - 1];
  if (!last) return content;

  const insertAt = last.index + last[0].length;
  if (findTemplateDemoStart(content, insertAt) < 0) return content;
  const spacer = '\n\n  <!-- TEMPLATE-DEMO-SPACING -->\n  <div style="height:24px;"></div>\n\n';
  return content.slice(0, insertAt) + spacer + content.slice(insertAt);
}

function ensureDependencySummaryBlock(content, contract) {
  if (!contract) return content;
  const summaryStart = '    <!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->';
  const summaryTopSpacer = '    <!-- DEPENDENCY-SUMMARY-SPACING -->\n    <div style="height:24px;"></div>\n';
  if (content.includes('<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->')) {
    const withTopSpacer = content.includes('<!-- DEPENDENCY-SUMMARY-SPACING -->')
      ? content
      : content.replace(summaryStart, `${summaryTopSpacer}${summaryStart}`);
    return withTopSpacer.replace(
      /<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:END -->\n\n    <div style="height:(?:12|24)px;"><\/div>/,
      '<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:END -->\n\n    <div style="height:24px;"></div>'
    );
  }
  const anchors = [
    '<!-- AUTO-GENERATED-PREVIEW:START -->',
    '<!-- AUTO-GENERATED-ICON-TABLE:START -->',
    '<!-- AUTO-GENERATED-COLOR-TABLE:START -->',
    '<!-- AUTO-GENERATED-SPACING-TABLE:START -->',
    '<!-- AUTO-GENERATED-BORDER-TABLE:START -->',
    '<!-- AUTO-GENERATED-RADIUS-TABLE:START -->',
    '<!-- AUTO-GENERATED-FONT-TABLE:START -->',
    '<!-- AUTO-GENERATED-SHADOW-TABLE:START -->',
  ];
  const positions = anchors.map((anchor) => content.indexOf(anchor)).filter((index) => index >= 0);
  if (positions.length === 0) return content;
  const index = Math.min(...positions);
  const block = `<!-- DEPENDENCY-SUMMARY-SPACING -->\n    <div style="height:24px;"></div>\n    <!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->\n<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:END -->\n\n    <div style="height:24px;"></div>\n    `;
  return content.slice(0, index) + block + content.slice(index);
}

function ensureSpacingBorderBlocks(content, contract) {
  if (!contract || contract.isComplete !== true) return content;
  const insertBlock = (source, marker, anchors) => {
    if (source.includes(`<!-- ${marker}:START -->`)) return source;
    const positions = anchors.map((anchor) => source.indexOf(anchor)).filter((index) => index >= 0);
    const index = positions.length > 0 ? Math.min(...positions) : source.lastIndexOf('</body>');
    if (index < 0) return source;
    const block = `    <div style="height:24px;"></div>\n    <!-- ${marker}:START -->\n    <!-- ${marker}:END -->\n\n`;
    return source.slice(0, index) + block + source.slice(index);
  };
  const anchors = [
    '<!-- AUTO-GENERATED-RADIUS-TABLE:START -->',
    '<!-- AUTO-GENERATED-FONT-TABLE:START -->',
    '<!-- AUTO-GENERATED-SHADOW-TABLE:START -->',
    '</body>',
  ];
  let next = insertBlock(content, 'AUTO-GENERATED-SPACING-TABLE', anchors);
  next = insertBlock(next, 'AUTO-GENERATED-BORDER-TABLE', anchors);
  // 旧明细表的前置 spacer 应归属于新插入的间距表；规范化为每张表之间恰好 24px。
  next = next.replace(
    /(?:[ \t]*<div style="height:24px;"><\/div>\s*){2}(<!-- AUTO-GENERATED-SPACING-TABLE:START -->)/,
    '    <div style="height:24px;"></div>\n    $1'
  );
  next = next.replace(
    /(<!-- AUTO-GENERATED-BORDER-TABLE:END -->)\s*(<!-- AUTO-GENERATED-(?:RADIUS|FONT|SHADOW)-TABLE:START -->)/,
    '$1\n\n    <div style="height:24px;"></div>\n    $2'
  );
  return next;
}

// ─────────────────────────────────────────────
// 标记区块处理
// ─────────────────────────────────────────────
const BLOCK_RE = /<!-- AUTO-GENERATED-PREVIEW:START -->([\s\S]*?)<!-- AUTO-GENERATED-PREVIEW:END -->/g;
const ICON_BLOCK_RE = /<!-- AUTO-GENERATED-ICON-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-ICON-TABLE:END -->/g;
const COLOR_BLOCK_RE = /<!-- AUTO-GENERATED-COLOR-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-COLOR-TABLE:END -->/g;
const SPACING_BLOCK_RE = /<!-- AUTO-GENERATED-SPACING-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-SPACING-TABLE:END -->/g;
const BORDER_BLOCK_RE = /<!-- AUTO-GENERATED-BORDER-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-BORDER-TABLE:END -->/g;
const RADIUS_BLOCK_RE = /<!-- AUTO-GENERATED-RADIUS-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-RADIUS-TABLE:END -->/g;
const FONT_BLOCK_RE = /<!-- AUTO-GENERATED-FONT-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-FONT-TABLE:END -->/g;
const SHADOW_BLOCK_RE = /<!-- AUTO-GENERATED-SHADOW-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-SHADOW-TABLE:END -->/g;
const DEPENDENCY_SUMMARY_BLOCK_RE = /<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:END -->/g;
const DECISION_TABLE_BLOCK_RE = /<!-- AUTO-GENERATED-DECISION-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-DECISION-TABLE:END -->/g;

// ─────────────────────────────────────────────
// 完整性闸门：防止新组件 preview "漏表"被静默跳过
//   Guard A: preview 有 AUTO-GENERATED-PREVIEW 标记 ⇄ 必须注册生成器（双向一致）
//   Guard H: 所有 preview 必须含「依赖汇总表」标记（明细表已废弃）
// 任一违反都返回 error，使 npm run health 失败（不再静默 skip）。
// ─────────────────────────────────────────────
function checkCompleteness() {
  const errors = [];
  const contractFiles = fs.readdirSync(CONTRACTS_DIR).filter(f => f.endsWith('.json') && f !== '.gitkeep');

  for (const cf of contractFiles) {
    const id = cf.replace('.json', '');
    const htmlPath = path.join(PREVIEW_DIR, `${id}.html`);
    if (!fs.existsSync(htmlPath)) continue;

    const html = fs.readFileSync(htmlPath, 'utf8');
    const hasMarkers = html.includes('<!-- AUTO-GENERATED-PREVIEW:START -->');
    const hasGenerator = !!COMPONENT_GENERATORS[id];

    // Guard A（双向一致）
    if (hasMarkers && !hasGenerator) {
      errors.push(`${id}.html: 含 AUTO-GENERATED-PREVIEW 标记，但脚本未注册 "${id}" 生成器 —— 标记永远不会被填充，会静默腐烂`);
    }
    if (hasGenerator && !hasMarkers) {
      errors.push(`${id}.html: 已注册生成器，但 preview 缺少 AUTO-GENERATED-PREVIEW 标记 —— 硬规则表不会出现`);
    }

    // Guard B–G（明细依赖表）已移除：依赖信息由「依赖汇总表」（Guard H）统一承载，
    // 契约里的 iconDependencies / colorDependencies / spacingDependencies /
    // borderDependencies / radiusDependencies / fontSizeDependencies /
    // shadowDependencies 数据仍然驱动汇总表的展示与颜色/圆角/字号/间距/描边/阴影/图标预览。
    let contract;
    try {
      contract = JSON.parse(fs.readFileSync(path.join(CONTRACTS_DIR, cf), 'utf8'));
    } catch (e) {
      continue; // JSON 合法性由 check-contracts 负责
    }

    // Guard H（所有有契约的 preview ⇒ 按类型生成依赖汇总表）
    if (!html.includes('<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->')) {
      errors.push(`${id}.html: 缺少「依赖汇总表」自动生成标记`);
    }

    // Guard I（模版信息层：每个 contract preview 都必须有顶部决策表，且先于依赖汇总。
    // 兼容两种标题写法：默认「变体决策 + 关联关系表」，以及折叠面板试点使用的合并标题「变体决策」。）
    const relationMatch = /<p[^>]*>变体决策(?:\s*\+\s*关联关系表)?<\/p>/.exec(html);
    const relationIndex = relationMatch ? relationMatch.index : -1;
    const summaryIndex = html.indexOf('<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->');
    if (relationIndex < 0) {
      errors.push(`${id}.html: 缺少顶部「变体决策」标题（默认「变体决策 + 关联关系表」，合并模式为「变体决策」）`);
    } else if (summaryIndex >= 0 && relationIndex > summaryIndex) {
      errors.push(`${id}.html: 变体决策表必须位于依赖汇总表之前`);
    }
    const hardIndex = html.indexOf('<!-- AUTO-GENERATED-PREVIEW:START -->');
    if (hardIndex >= 0 && relationIndex >= 0 && hardIndex > relationIndex) {
      errors.push(`${id}.html: 硬规则表必须位于变体决策表之前`);
    }

    // Guard J（嵌套子组件列不得混入图标；独立图标依赖表中的图标说明不受此限制。）
    const topContent = summaryIndex >= 0 ? html.slice(0, summaryIndex) : html;
    if (/嵌套子组件\s*\/\s*图标|用了哪个子组件\s*\/\s*图标/.test(topContent)) {
      errors.push(`${id}.html: 「嵌套子组件」内容混入图标信息；请移至独立图标依赖表`);
    }

    // Guard L（决策表标记 ⇔ 契约 variantDecisions 双向一致）
    const hasDecisionMarkers = html.includes('<!-- AUTO-GENERATED-DECISION-TABLE:START -->');
    const hasDecisionData = !!(contract.relations && Array.isArray(contract.relations.variantDecisions) && contract.relations.variantDecisions.length > 0);
    if (hasDecisionMarkers && !hasDecisionData) {
      errors.push(`${id}.html: 含 AUTO-GENERATED-DECISION-TABLE 标记，但契约 relations.variantDecisions 为空 —— 标记永远不会被填充`);
    }
    if (hasDecisionData && !hasDecisionMarkers) {
      errors.push(`${id}.html: 契约声明了 relations.variantDecisions，但 preview 缺少 AUTO-GENERATED-DECISION-TABLE 标记 —— 决策表不会自动同步`);
    }

    // Guard M（硬规则表：契约 relations.hardRules ⇔ preview AUTO-GENERATED-PREVIEW 标记 + 通用生成器）
    const hasHardMarkersInline = html.includes('<!-- AUTO-GENERATED-PREVIEW:START -->');
    const hasHardData = !!(contract.relations && Array.isArray(contract.relations.hardRules) && contract.relations.hardRules.length > 0);
    if (hasHardMarkersInline && !hasHardData) {
      errors.push(`${id}.html: 含 AUTO-GENERATED-PREVIEW 标记，但契约 relations.hardRules 为空 —— 标记永远不会被填充`);
    }
    if (hasHardData && !hasHardMarkersInline) {
      errors.push(`${id}.html: 契约声明了 relations.hardRules，但 preview 缺少 AUTO-GENERATED-PREVIEW 标记 —— 硬规则表不会自动同步`);
    }

    // Guard K（真实示例必须位于最后一个依赖表之后，并以受控 24px 间距隔开。）
    const demoStarts = [...html.matchAll(/<!-- TEMPLATE-DEMO:START -->/g)].length;
    const demoEnds = [...html.matchAll(/<!-- TEMPLATE-DEMO:END -->/g)].length;
    if (demoStarts !== demoEnds) {
      errors.push(`${id}.html: TEMPLATE-DEMO 标记必须成对出现`);
    }
    const tableEnds = generatedTableEndMatches(html);
    const lastTableEnd = tableEnds.length > 0
      ? tableEnds[tableEnds.length - 1].index + tableEnds[tableEnds.length - 1][0].length
      : -1;
    const demoStart = lastTableEnd >= 0 ? findTemplateDemoStart(html, lastTableEnd) : -1;
    if (demoStart >= 0) {
      const between = html.slice(lastTableEnd, demoStart);
      if (!/^\s*<!-- TEMPLATE-DEMO-SPACING -->\s*<div style="height:24px;"><\/div>/.test(between)) {
        errors.push(`${id}.html: 最后一个依赖表与真实示例之间必须保留受控 24px 间距`);
      }
    }
  }

  return errors;
}

// 明细依赖表清理：只保留依赖汇总表，去掉 7 种独立明细表标记块及紧邻的 24px spacer。
// 依赖信息完整度靠汇总表承载；后续如需恢复某类明细表，可回退本次改动或按需重新引入标记。
const DETAIL_TABLE_NAMES = ['ICON', 'COLOR', 'SPACING', 'BORDER', 'RADIUS', 'FONT', 'SHADOW'];
function stripDetailDependencyTables(content) {
  for (const name of DETAIL_TABLE_NAMES) {
    // 优先删除「前置 24px spacer + 空白 + 标记块」，避免遗留孤立 spacer。
    const withLeadingSpacer = new RegExp(
      `\\s*<div style="height:24px;"><\\/div>\\s*<!-- AUTO-GENERATED-${name}-TABLE:START -->[\\s\\S]*?<!-- AUTO-GENERATED-${name}-TABLE:END -->`,
      'g'
    );
    content = content.replace(withLeadingSpacer, '');
    // 兜底：没有前置 spacer 的标记块（比如首次插入位置）。
    const bareBlock = new RegExp(
      `<!-- AUTO-GENERATED-${name}-TABLE:START -->[\\s\\S]*?<!-- AUTO-GENERATED-${name}-TABLE:END -->\\s*`,
      'g'
    );
    content = content.replace(bareBlock, '');
  }
  return content;
}

function processFile(htmlPath, componentId) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  const original = content;
  const contract = loadContract(componentId);
  content = stripDetailDependencyTables(content);
  content = ensureDecisionTable(content, componentId);
  if (componentId === 'card') content = migrateCardIconTable(content);
  content = normalizeTemplateTopContent(content);
  content = ensureDependencySummaryBlock(content, contract);

  const hasHardMarkers = content.includes('<!-- AUTO-GENERATED-PREVIEW:START -->');
  const hasSummaryMarkers = content.includes('<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->');
  const hasDecisionMarkers = content.includes('<!-- AUTO-GENERATED-DECISION-TABLE:START -->');

  if (!hasHardMarkers && !hasSummaryMarkers && !hasDecisionMarkers) return { noMarkers: true };

  // 变体决策表（合并模式）：所有组件统一使用 generateMergedDecisionTable，
  // 从 contract.relations.hardRules 与 relations.variantDecisions 读取，输出单张 table。
  if (hasDecisionMarkers && contract) {
    const decisionTable = generateMergedDecisionTable(contract);
    if (decisionTable) {
      content = content.replace(DECISION_TABLE_BLOCK_RE, `<!-- AUTO-GENERATED-DECISION-TABLE:START -->\n${decisionTable}\n    <!-- AUTO-GENERATED-DECISION-TABLE:END -->`);
    }
  }

  // 依赖汇总表：通用生成，并按 appliesTo 将依赖精确归入每个组件类型。
  // 全量推广自折叠面板试点：所有组件都使用 enhanced 模式（增加「嵌套组件」列，
  // 并为字体/间距/描边/圆角/阴影/图标补上小预览）。
  if (hasSummaryMarkers && contract) {
    const summaryTable = generateDependencySummaryTable(contract, { enhanced: true });
    if (summaryTable) {
      content = content.replace(DEPENDENCY_SUMMARY_BLOCK_RE, `<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->\n${summaryTable}\n    <!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:END -->`);
    }
  }

  // 硬规则块：需要在 COMPONENT_GENERATORS 里注册对应生成器
  if (hasHardMarkers) {
    const generator = COMPONENT_GENERATORS[componentId];
    if (generator) {
      let generated;
      try {
        generated = generator();
      } catch (e) {
        return { error: e.message };
      }
      if (generated) {
        content = content.replace(BLOCK_RE, `<!-- AUTO-GENERATED-PREVIEW:START -->\n${generated}\n    <!-- AUTO-GENERATED-PREVIEW:END -->`);
      }
    }
    // 有标记但没注册生成器 → 由 checkCompleteness Guard A 报错
  }

  // 明细依赖表（图标/颜色/间距/描边/圆角/字号/阴影）已由 stripDetailDependencyTables 移除。
  // 相应内容已被汇总表统一承载，不再单独生成明细表。

  content = normalizeTemplateDemoContent(content);
  content = normalizeUnmarkedDemoContent(content);
  content = ensureTemplateDemoSpacing(content);
  return { content, changed: content !== original };
}

function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const requested = new Set(args.filter((arg) => !arg.startsWith('--')).map((arg) => path.basename(arg, path.extname(arg))));

  // 遍历所有有对应契约的 preview HTML
  const contractFiles = fs.readdirSync(CONTRACTS_DIR).filter((f) =>
    f.endsWith('.json') && f !== '.gitkeep' && (!requested.size || requested.has(f.replace('.json', '')))
  );
  let processed = 0;
  let mismatches = 0;
  let noMarkers = 0;

  for (const contractFile of contractFiles) {
    const componentId = contractFile.replace('.json', '');
    const htmlPath = path.join(PREVIEW_DIR, `${componentId}.html`);

    if (!fs.existsSync(htmlPath)) continue;

    const result = processFile(htmlPath, componentId);

    if (result.skipped) continue;
    if (result.error) {
      console.error(`✗ ERROR  ${componentId}: ${result.error}`);
      continue;
    }
    if (result.noMarkers) {
      noMarkers++;
      continue;
    }

    processed++;
    if (result.changed) {
      mismatches++;
      if (!checkOnly) {
        fs.writeFileSync(htmlPath, result.content, 'utf8');
        console.log(`  ✓ 已同步: ${componentId}.html`);
      } else {
        console.log(`  ✗ 不一致: ${componentId}.html`);
      }
    }
  }

  // 完整性闸门（无论 --check 与否都执行，违反即失败）
  const completenessErrors = checkCompleteness();
  if (completenessErrors.length > 0) {
    console.log(`\n完整性检查（preview 自动表）：`);
    completenessErrors.forEach((e) => console.log(`  ✗ ${e}`));
  }

  if (checkOnly) {
    if (mismatches > 0) {
      console.log(`\n✗ ${mismatches} 个 preview HTML 与契约不一致。跑 \`node scripts/generate-preview-tables.js\` 同步。`);
    }
    if (mismatches > 0 || completenessErrors.length > 0) {
      console.log(`\n结果：未通过 ✗（${mismatches} 个内容不一致，${completenessErrors.length} 个完整性缺失）`);
      process.exit(1);
    }
    console.log(`\n✓ 已检查 ${processed} 个 preview HTML，内容一致且自动表完整。`);
    if (noMarkers > 0) console.log(`  (${noMarkers} 个 preview 没有 AUTO-GENERATED-PREVIEW 标记，且契约无对应硬规则，跳过)`);
  } else {
    console.log(`\n✓ 处理完成。同步了 ${mismatches} 个文件，${processed - mismatches} 个已是最新。`);
    if (noMarkers > 0) console.log(`  提示：${noMarkers} 个 preview HTML 没有 AUTO-GENERATED-PREVIEW 标记。`);
    if (completenessErrors.length > 0) {
      console.log(`\n⚠ 上述 ${completenessErrors.length} 个完整性缺失需补齐（图标依赖表：加 AUTO-GENERATED-ICON-TABLE 标记即自动生成；硬规则表：标记 + 生成器需成对补上）。`);
      process.exit(1);
    }
  }
}

if(require.main===module)main();
module.exports={generateDependencySummaryTable,buildReverseEmbedIndex};
