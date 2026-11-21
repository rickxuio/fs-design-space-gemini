#!/usr/bin/env node
/**
 * FS Design System — Component Contract Schema Validator
 *
 * 补 check-contracts.js 的空白：component.schema.json 定义了"契约文件应该长什么样"，
 * 但此前没有任何脚本真正拿它去校验现有契约文件是否合规——schema 只是摆设。
 * 本脚本做最小闭环：检查每份契约文件是否满足 schema 里的 required 字段和基础类型约束。
 *
 * 有意不引入 ajv 等第三方库（项目零依赖约定），只手写覆盖 schema 里实际用到的规则子集：
 *   - 顶层 required 字段是否存在
 *   - 顶层字段的基础类型（string/array/object/boolean）是否匹配
 *   - relations.componentDependencies / iconDependencies / mutuallyExclusiveWith 数组项的 required 子字段
 *   - relations.enforcementStatus 每一项是否含 enforced(boolean) + mechanism(string)
 *
 * 不是通用 JSON Schema 引擎，只服务于本项目这一份 schema。schema 改了结构，这个脚本要跟着改。
 *
 * Usage: node scripts/validate-schema.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const SPEC_DIR = path.join(__dirname, '..', 'components', 'contracts');
const SCHEMA_PATH = path.join(__dirname, '..', 'components', 'schemas', 'component.schema.json');

function typeOf(v) {
  if (Array.isArray(v)) return 'array';
  if (v === null) return 'null';
  return typeof v;
}

function main() {
  if (!fs.existsSync(SCHEMA_PATH)) {
    console.error(`ERROR: schema 文件不存在: ${SCHEMA_PATH}`);
    process.exit(1);
  }
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
  const requiredTop = schema.required || [];
  const topProps = schema.properties || {};

  if (!fs.existsSync(SPEC_DIR)) {
    console.error(`ERROR: 契约目录不存在: ${SPEC_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(SPEC_DIR).filter((f) => f.endsWith('.json'));

  let totalErrors = 0;

  files.forEach((f) => {
    const full = path.join(SPEC_DIR, f);
    const data = JSON.parse(fs.readFileSync(full, 'utf8'));
    const errors = [];

    // 1. 顶层 required 字段
    requiredTop.forEach((key) => {
      if (!(key in data)) {
        errors.push(`缺少必填字段 "${key}"`);
      }
    });

    // 2. 顶层字段基础类型校验（只查 schema 里声明了 type 的字段）
    Object.entries(topProps).forEach(([key, def]) => {
      if (!(key in data) || !def.type) return;
      const actual = typeOf(data[key]);
      const expected = def.type;
      if (expected === 'array' && actual !== 'array') errors.push(`字段 "${key}" 应为 array，实际是 ${actual}`);
      else if (expected === 'object' && actual !== 'object') errors.push(`字段 "${key}" 应为 object，实际是 ${actual}`);
      else if (expected === 'string' && actual !== 'string') errors.push(`字段 "${key}" 应为 string，实际是 ${actual}`);
      else if (expected === 'boolean' && actual !== 'boolean') errors.push(`字段 "${key}" 应为 boolean，实际是 ${actual}`);
    });

    // 2b. category 只允许左侧导航栏的七分类（分类是软召回元数据，但元数据本身不能漂移）
    const categoryEnum = topProps.category && topProps.category.enum;
    if (Array.isArray(categoryEnum) && !categoryEnum.includes(data.category)) {
      errors.push(`字段 "category" 必须是左侧导航栏七分类之一，实际是 "${data.category}"`);
    }

    // 2c. variants 基础结构与场景字段类型
    (data.variants || []).forEach((variant, i) => {
      if (!variant || typeof variant !== 'object') {
        errors.push(`variants[${i}] 应为 object`);
        return;
      }
      if (typeof variant.name !== 'string' || !variant.name.trim()) errors.push(`variants[${i}] 缺少非空字符串 "name"`);
      ['whenToUse', 'usage', 'cssClass', 'class'].forEach((key) => {
        if (key in variant && typeof variant[key] !== 'string') errors.push(`variants[${i}].${key} 应为 string`);
      });
    });

    // 3. relations 内部关键子字段的 required 校验
    const relations = data.relations;
    if (relations && typeof relations === 'object') {
      const requireNonEmptyString = (value, field) => {
        if (typeof value !== 'string' || !value.trim()) errors.push(`${field} 必须是非空字符串`);
      };
      const requireNonEmptyStringArray = (value, field) => {
        if (!Array.isArray(value) || value.length === 0) {
          errors.push(`${field} 必须是非空数组`);
          return;
        }
        value.forEach((item, index) => requireNonEmptyString(item, `${field}[${index}]`));
      };
      (relations.componentDependencies || []).forEach((dep, i) => {
        const field = `relations.componentDependencies[${i}]`;
        if (!dep || typeof dep !== 'object' || Array.isArray(dep)) {
          errors.push(`${field} 应为 object`);
          return;
        }
        requireNonEmptyString(dep.component, `${field}.component`);
        requireNonEmptyString(dep.usage, `${field}.usage`);
        requireNonEmptyStringArray(dep.requiredVariants, `${field}.requiredVariants`);
        requireNonEmptyStringArray(dep.implementationClasses, `${field}.implementationClasses`);
        if ('slot' in dep && typeof dep.slot !== 'string') errors.push(`${field}.slot 应为 string`);
      });
      (relations.commonlyEmbeddedIn || []).forEach((item, i) => {
        const field = `relations.commonlyEmbeddedIn[${i}]`;
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`${field} 应为 object`);
          return;
        }
        requireNonEmptyString(item.component, `${field}.component`);
        requireNonEmptyString(item.usage, `${field}.usage`);
        requireNonEmptyString(item.verifiedNote, `${field}.verifiedNote`);
        if (item.verified !== false) errors.push(`${field}.verified 必须为 false`);
        if ('appliesTo' in item) requireNonEmptyStringArray(item.appliesTo, `${field}.appliesTo`);
      });
      (relations.fontWeightDependencies || []).forEach((dep, i) => {
        const field = `relations.fontWeightDependencies[${i}]`;
        if (!dep || typeof dep !== 'object' || Array.isArray(dep)) {
          errors.push(`${field} 应为 object`);
          return;
        }
        requireNonEmptyString(dep.token, `${field}.token`);
        if (!/^typography\.font-weight-(regular|semibold)$/.test(dep.token || '')) errors.push(`${field}.token 只允许正式 Regular/SemiBold 字重 token`);
        if (!['400', '600'].includes(dep.value)) errors.push(`${field}.value 只允许字符串 400 或 600`);
        requireNonEmptyString(dep.usage, `${field}.usage`);
        requireNonEmptyStringArray(dep.appliesTo, `${field}.appliesTo`);
        requireNonEmptyStringArray(dep.properties, `${field}.properties`);
        if (Array.isArray(dep.properties) && dep.properties.some((item) => item !== 'font-weight')) errors.push(`${field}.properties 只允许 font-weight`);
        requireNonEmptyStringArray(dep.selectors, `${field}.selectors`);
      });
      (relations.typographyDependencies || []).forEach((dep, i) => {
        const field = `relations.typographyDependencies[${i}]`;
        if (!dep || typeof dep !== 'object' || Array.isArray(dep)) {
          errors.push(`${field} 应为 object`);
          return;
        }
        requireNonEmptyString(dep.token, `${field}.token`);
        if (!/^typography\.[a-z0-9-]+-(regular|semibold)$/.test(dep.token || '')) errors.push(`${field}.token 必须是 composite typography token`);
        requireNonEmptyString(dep.fontSizeToken, `${field}.fontSizeToken`);
        if (dep.fontSizeToken !== '/' && !/^typography\.font-size-/.test(dep.fontSizeToken || '')) errors.push(`${field}.fontSizeToken 必须是 font-size token 或 /`);
        if (!/^\d+(?:\.\d+)?px$/.test(dep.fontSizeValue || '')) errors.push(`${field}.fontSizeValue 必须是 px 字符串`);
        if (!/^typography\.font-weight-(regular|semibold)$/.test(dep.fontWeightToken || '')) errors.push(`${field}.fontWeightToken 只允许 Regular/SemiBold`);
        if (!['400', '600'].includes(dep.fontWeightValue)) errors.push(`${field}.fontWeightValue 只允许字符串 400 或 600`);
        if (!['explicit-css', 'inherited-regular'].includes(dep.weightEvidence)) errors.push(`${field}.weightEvidence 值不合法`);
        if (dep.weightEvidence === 'inherited-regular' && dep.fontWeightToken !== 'typography.font-weight-regular') errors.push(`${field} inherited-regular 只能配 Regular 400`);
        requireNonEmptyString(dep.usage, `${field}.usage`);
        requireNonEmptyStringArray(dep.appliesTo, `${field}.appliesTo`);
      });
      (relations.iconDependencies || []).forEach((dep, i) => {
        if (!dep.icon) errors.push(`relations.iconDependencies[${i}] 缺少必填字段 "icon"`);
        if (!dep.usage) errors.push(`relations.iconDependencies[${i}] 缺少必填字段 "usage"`);
      });
      (relations.mutuallyExclusiveWith || []).forEach((m, i) => {
        if (!m.component) errors.push(`relations.mutuallyExclusiveWith[${i}] 缺少必填字段 "component"`);
        if (!m.reason) errors.push(`relations.mutuallyExclusiveWith[${i}] 缺少必填字段 "reason"`);
      });
      (relations.variantSelectionRules || []).forEach((rule, i) => {
        if (typeof rule === 'string') {
          if (!rule.trim()) errors.push(`relations.variantSelectionRules[${i}] 不能为空字符串`);
          return;
        }
        if (!rule || typeof rule !== 'object') {
          errors.push(`relations.variantSelectionRules[${i}] 应为 string 或 object`);
          return;
        }
        if (typeof rule.condition !== 'string' || !rule.condition.trim()) errors.push(`relations.variantSelectionRules[${i}] 缺少非空字符串 "condition"`);
        if (typeof rule.variant !== 'string' || !rule.variant.trim()) errors.push(`relations.variantSelectionRules[${i}] 缺少非空字符串 "variant"`);
        if ('cssClass' in rule && typeof rule.cssClass !== 'string') errors.push(`relations.variantSelectionRules[${i}].cssClass 应为 string`);
      });
      const enforcement = relations.enforcementStatus;
      if (enforcement && typeof enforcement === 'object') {
        Object.entries(enforcement).forEach(([ruleKey, val]) => {
          if (typeof val.enforced !== 'boolean') errors.push(`relations.enforcementStatus["${ruleKey}"] 缺少或类型错误的 "enforced"（应为 boolean）`);
          if (typeof val.mechanism !== 'string') errors.push(`relations.enforcementStatus["${ruleKey}"] 缺少或类型错误的 "mechanism"（应为 string）`);
        });
      }
    }

    // 4. history 数组项 required 校验
    (data.history || []).forEach((h, i) => {
      if (!h.date) errors.push(`history[${i}] 缺少必填字段 "date"`);
      if (!h.change) errors.push(`history[${i}] 缺少必填字段 "change"`);
    });

    if (errors.length > 0) {
      console.log(`\n${f}`);
      errors.forEach((e) => console.log(`  ✗ ${e}`));
      totalErrors += errors.length;
    }
  });

  console.log(`\n共校验 ${files.length} 份契约文件对照 component.schema.json`);
  if (totalErrors === 0) {
    console.log('✓ 全部符合 schema，0 个 error\n');
    process.exit(0);
  }
  console.log(`✗ 共 ${totalErrors} 个 schema 违规\n`);
  process.exit(1);
}

main();
