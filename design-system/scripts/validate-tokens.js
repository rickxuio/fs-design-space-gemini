#!/usr/bin/env node
/**
 * FS Design System — Token ↔ CSS Variable Mapping Validator
 *
 * 统一的 token↔CSS 一致性硬闸门，覆盖 token-specs/ 下全部类别
 * （color / typography / spacing / border-radius / shadow / opacity）。
 *
 * token-specs/*.json 是 token 的声明源，tokens.css 是运行时真理源（上游镜像）。
 * 二者靠每个 token 上显式的 "cssVar" 字段做一一映射，本脚本负责核对映射永不漂移。
 * tokens.css 顶部声明自己是上游 100% 标准源；本脚本只“核对”，绝不反向改 CSS。
 *
 * 校验项（任一不过即 exit 1）：
 *   1. 每个 token 必须有非空、形如 --xxx 的 cssVar 字段
 *   2. cssVar 指向的变量必须真实存在于 tokens.css
 *   3. token 的值必须与 tokens.css 对应变量的值一致（归一化后比较）
 *      - 数字型带 unit（如 value:4, unit:"px"）→ 组合成 "4px" 再比
 *      - 数字型无 unit（如 opacity 0.3 / font-weight 400）→ 直接比
 *      - 字符串型（如 shadow）→ 去空白、小写后比
 *      - token 带 "cssVarMatch":"prefix" 时 → 只要求 CSS 值以 token 值开头
 *        （用于 font-family-base：token 记首选族名，CSS 是含 fallback 的完整字体栈）
 *   4. cssVar 全局一对一：不允许两个 token（跨类别）指向同一个变量
 *
 * Zero dependencies — 只用 Node.js 内置模块。
 *
 * Usage: node scripts/validate-tokens.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const TOKEN_SPECS_DIR = path.join(__dirname, '..', 'components', 'token-specs');
const TOKENS_CSS = path.join(__dirname, '..', 'components', 'tokens.css');

// 归一化：去空白、去引号、转小写。用于跨源比较
const norm = (v) => String(v).replace(/['"]/g, '').replace(/\s+/g, '').toLowerCase();

// 把 token 的 value(+unit) 组合成用于比较的字符串
function composeTokenValue(t) {
  if (typeof t.value === 'number' && t.unit) return `${t.value}${t.unit}`;
  return String(t.value);
}

// 读取 tokens.css 里所有 CSS 自定义属性（--xxx: value;）
function loadCssVars() {
  const map = new Map();
  const css = fs.readFileSync(TOKENS_CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css)) !== null) map.set(m[1].trim(), m[2].trim());
  return map;
}

function main() {
  if (!fs.existsSync(TOKEN_SPECS_DIR)) {
    console.error(`ERROR: token-specs 目录不存在: ${TOKEN_SPECS_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(TOKENS_CSS)) {
    console.error(`ERROR: tokens.css 不存在: ${TOKENS_CSS}`);
    process.exit(1);
  }

  const cssVars = loadCssVars();
  const specFiles = fs.readdirSync(TOKEN_SPECS_DIR).filter((f) => f.endsWith('.json'));

  const errors = [];
  const seenCssVar = new Map(); // cssVar → 第一个占用它的 primitive token 名
  const seenTokenName = new Map();
  const parsedSpecs = new Map();
  const primitiveTokensByName = new Map();
  let totalTokens = 0;

  specFiles.forEach((file) => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(TOKEN_SPECS_DIR, file), 'utf8'));
      parsedSpecs.set(file, data);
      (data.tokens || []).forEach((t) => {
        if (t.name) primitiveTokensByName.set(t.name, t);
      });
    } catch (e) {
      errors.push(`${file}: 不是合法 JSON（${e.message}）`);
    }
  });

  parsedSpecs.forEach((data, file) => {
    const tokens = data.tokens || [];
    tokens.forEach((t) => {
      totalTokens++;
      const name = t.name || `(${file} 中某未命名 token)`;

      if (seenTokenName.has(name)) errors.push(`${name}: token 名已在 ${seenTokenName.get(name)} 声明`);
      else seenTokenName.set(name, file);

      // Primitive token 必须一一映射到真实 CSS 变量。
      if (!t.cssVar || typeof t.cssVar !== 'string' || !/^--[\w-]+$/.test(t.cssVar)) {
        errors.push(`${name}: 缺少合法的 cssVar 字段（应形如 "--xxx"，当前为 ${JSON.stringify(t.cssVar)}）`);
        return;
      }

      if (seenCssVar.has(t.cssVar)) {
        errors.push(`${name}: cssVar "${t.cssVar}" 已被 "${seenCssVar.get(t.cssVar)}" 占用（映射必须一对一）`);
      } else {
        seenCssVar.set(t.cssVar, name);
      }

      if (!cssVars.has(t.cssVar)) {
        errors.push(`${name}: cssVar "${t.cssVar}" 在 tokens.css 里不存在（组件用 var(${t.cssVar}) 会失效）`);
        return;
      }

      const expected = composeTokenValue(t);
      const cssVal = cssVars.get(t.cssVar);
      const mode = t.cssVarMatch || 'exact';
      const ok = mode === 'prefix'
        ? norm(cssVal).startsWith(norm(expected))
        : norm(expected) === norm(cssVal);
      if (!ok) {
        const how = mode === 'prefix' ? '前缀匹配' : '精确匹配';
        errors.push(`${name}: 双源不一致（${how}）—— token=${expected} 但 tokens.css ${t.cssVar}=${cssVal}（tokens.css 是真理源，请修正 token-specs）`);
      }
    });

    // Composite typography token 不映射单一 cssVar；它由字号、行高、字重共同组成，
    // primitiveReferences 与 lineHeightCssVar 提供可机械核对的底层证据。
    (data.compositeTokens || []).forEach((t) => {
      totalTokens++;
      const name = t.name || `(${file} 中某未命名 composite token)`;
      if (seenTokenName.has(name)) errors.push(`${name}: token 名已在 ${seenTokenName.get(name)} 声明`);
      else seenTokenName.set(name, file);
      if (t.type !== 'typography') errors.push(`${name}: composite token type 必须是 typography`);
      if (!t.value || typeof t.value !== 'object' || Array.isArray(t.value)) {
        errors.push(`${name}: composite typography token 必须提供对象 value`);
        return;
      }
      if (!/^\d+(?:\.\d+)?px$/.test(String(t.value.fontSize || ''))) errors.push(`${name}: value.fontSize 必须是 px 字符串`);
      if (!/^(?:\d+(?:\.\d+)?px|\d+(?:\.\d+)?)$/.test(String(t.value.lineHeight || ''))) errors.push(`${name}: value.lineHeight 必须是 px 或 unitless 数值字符串`);
      if (![400, 600].includes(t.value.fontWeight)) errors.push(`${name}: value.fontWeight 只允许 400 或 600`);

      const refs = t.primitiveReferences || {};
      const checkPrimitive = (field, refName, expectedValue) => {
        if (!refName) return;
        const primitive = primitiveTokensByName.get(refName);
        if (!primitive) {
          errors.push(`${name}: primitiveReferences.${field} 引用了不存在的 token "${refName}"`);
          return;
        }
        if (norm(composeTokenValue(primitive)) !== norm(expectedValue)) {
          errors.push(`${name}: ${field}=${expectedValue} 与 primitive ${refName}=${composeTokenValue(primitive)} 不一致`);
        }
      };
      checkPrimitive('fontSize', refs.fontSize, t.value.fontSize);
      checkPrimitive('fontWeight', refs.fontWeight, t.value.fontWeight);
      if (!refs.fontWeight) errors.push(`${name}: 必须声明 primitiveReferences.fontWeight`);
      if (t.lineHeightCssVar) {
        if (!cssVars.has(t.lineHeightCssVar)) errors.push(`${name}: lineHeightCssVar ${t.lineHeightCssVar} 在 tokens.css 中不存在`);
        else if (norm(cssVars.get(t.lineHeightCssVar)) !== norm(t.value.lineHeight)) errors.push(`${name}: value.lineHeight=${t.value.lineHeight} 与 ${t.lineHeightCssVar}=${cssVars.get(t.lineHeightCssVar)} 不一致`);
      }
    });
  });

  console.log(`\n共校验 ${totalTokens} 个 token（primitive CSS 映射 + composite typography，token-specs/ ↔ tokens.css，${specFiles.length} 个类别文件）`);
  if (errors.length === 0) {
    console.log('✓ 全部一一映射且双源一致，0 个 error\n');
    process.exit(0);
  }
  console.log('');
  errors.forEach((e) => console.log(`  ✗ ${e}`));
  console.log(`\n✗ 共 ${errors.length} 个 token 映射违规\n`);
  process.exit(1);
}

main();
