#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POLICY_FILE = path.join(ROOT, 'components', 'selection-mvp-policy.json');
const OUTPUT_FILE = path.join(ROOT, 'components', 'component-selection-mvp.json');
const MAX_BYTES = 100 * 1024;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// Bounded legacy summary omits repeated owner-variant fields, scene anchors and empty optional arrays.
// Full contracts/local selection retain original anchors and all semantic rules.
function serialize(value) {
  return `${JSON.stringify(value, function(key, field) { if (key === 'variant' && this.type && this.selectionCases) return undefined; if (key === 'policyRef' || key === 'fragment') return undefined; if (key === 'id' && this.kind && this.condition && this.result) return undefined; return ['supportingDecisions','variantSelectionRules'].includes(key) && Array.isArray(field) && field.length === 0 ? undefined : field; })}\n`;
}

function variantIsAvailable(contract, variant) {
  const hasVariantStatus = Object.prototype.hasOwnProperty.call(variant, 'isComplete')
    || Object.prototype.hasOwnProperty.call(variant, 'pendingParts');
  const isComplete = hasVariantStatus ? variant.isComplete === true : contract.isComplete === true;
  const pendingParts = hasVariantStatus ? variant.pendingParts : contract.pendingParts;
  return isComplete && (!Array.isArray(pendingParts) || pendingParts.length === 0);
}

function availableComponentIds() {
  return fs.readdirSync(path.join(ROOT, 'components', 'contracts'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, ''))
    .filter((id) => {
      const contract = readJson(path.join(ROOT, 'components', 'contracts', `${id}.json`));
      return (contract.variants || []).some((variant) => variantIsAvailable(contract, variant));
    })
    .sort();
}

function buildSelectionMvp() {
  const policy = readJson(POLICY_FILE);
  const errors = [];
  if (policy.schemaVersion !== '2.0.0') errors.push('统一选型 policy.schemaVersion 必须是 2.0.0');
  const scope = Array.isArray(policy.scope) ? policy.scope : [];
  const availableScope = availableComponentIds();
  if (new Set(scope).size !== scope.length) errors.push('统一选型 scope 不得包含重复组件');
  for (const id of availableScope) if (!scope.includes(id)) errors.push(`统一选型 scope 缺少可生成组件：${id}`);
  for (const id of scope) if (!availableScope.includes(id)) errors.push(`统一选型 scope 包含不可生成组件：${id}`);
  const components = scope.map((id) => {
    const config = policy.components && policy.components[id];
    const contractPath = path.join(ROOT, 'components', 'contracts', `${id}.json`);
    if (!config) {
      errors.push(`${id} 缺少 MVP policy`);
      return null;
    }
    if (!fs.existsSync(contractPath)) {
      errors.push(`${id} 缺少组件契约`);
      return null;
    }
    const contract = readJson(contractPath);
    const decisions = (contract.relations && contract.relations.variantDecisions) || [];
    const { selectionDecisionText } = require('./generate-component-index');
    const decisionByType = new Map(decisions.map(item => {
      const full=selectionDecisionText(item);
      // Avoid duplicated display/provenance fields in this bounded legacy summary; full contracts and the local selection retain them.
      const summary=full.selectionCases ? Object.fromEntries(Object.entries(full).filter(([key])=>!['whenToUse','whenNotToUse','designReferences','className','nestedComponents','status','evidence'].includes(key))) : full;
      // targetVariant equal to the row variant is redundant here; full local selection retains every field.
      // Candidate/avoid/reference strength repeats kind in this bounded summary; full contracts and local selection retain it.
      if(summary.selectionCases)summary.selectionCases=summary.selectionCases.map(({targetVariant,strength,...entry})=>({...entry,...(strength==='required'||strength&&!['candidate','avoid','reference'].includes(strength)?{strength}:{}),...(targetVariant!==summary.variant?{targetVariant}:{})}));
      return [item.type, summary];
    }));
    if (!Array.isArray(config.contrasts) || config.contrasts.length === 0) errors.push(`${id} 缺少高频混淆候选`);
    const contractVariants = (contract.variants || []).filter((item) => variantIsAvailable(contract, item)).map((item) => item.name);
    const configuredVariants = Object.keys(config.variantDecisionTypes || {});
    for (const variant of contractVariants) {
      if (!configuredVariants.includes(variant)) errors.push(`${id}/${variant} 缺少 variantDecisionTypes 映射`);
    }
    for (const variant of configuredVariants) {
      if (!contractVariants.includes(variant)) errors.push(`${id} policy 引用了不存在的变体：${variant}`);
    }
    const primaryOwner = new Map();
    const variants = configuredVariants.map((variant) => {
      const primaryTypes = config.variantDecisionTypes[variant] || [];
      if (!primaryTypes.length) errors.push(`${id}/${variant} 必须至少绑定一条主决策`);
      const missing = primaryTypes.filter((type) => !decisionByType.has(type));
      if (missing.length) errors.push(`${id}/${variant} 引用了不存在的决策行：${missing.join('、')}`);
      for (const type of primaryTypes) {
        if (primaryOwner.has(type)) errors.push(`${id} 主决策“${type}”同时绑定 ${primaryOwner.get(type)} 与 ${variant}，无法精确判定变体`);
        primaryOwner.set(type, variant);
      }
      return {
        name: variant,
        primaryDecisions: primaryTypes.map((type) => decisionByType.get(type)).filter(Boolean),
        supportingDecisions: (config.supportingDecisionTypes || []).map((type) => decisionByType.get(type)).filter(Boolean)
      };
    });
    for (const type of config.supportingDecisionTypes || []) {
      if (!decisionByType.has(type)) errors.push(`${id} 引用了不存在的 supporting decision：${type}`);
    }
    for (const contrast of config.contrasts || []) {
      if (!scope.includes(contrast)) errors.push(`${id} 的混淆候选不在统一选型 scope：${contrast}`);
      if (contrast === id) errors.push(`${id} 不能与自身构成混淆候选`);
    }
    return {
      id,
      name: contract.name,
      chineseName: contract.chineseName || null,
      category: contract.category,
      contractPath: path.relative(ROOT, contractPath),
      searchIntents: contract.searchIntents || [],
      ...(contract.aiContract?.automaticSelection ? { automaticSelection: contract.aiContract.automaticSelection } : {}),
      contrasts: config.contrasts || [],
      hardRules: ((contract.relations && contract.relations.hardRules) || []).map((rule) => ({ title: rule.title })),
      variantSelectionRules: (contract.relations && contract.relations.variantSelectionRules) || [],
      variants
    };
  }).filter(Boolean);
  if (errors.length) throw new Error(errors.join('\n'));
  const { publication, validateBaseline } = require('./component-publication');
  validateBaseline(ROOT);
  const published = components.map(component => ({ ...component,
    variants: component.variants.flatMap(variant => {
      const decision = publication(ROOT, component.id, variant.name);
      return decision.newPages ? [{...variant, publication: {disposition:decision.disposition,newPages:true}}] : [];
    })
  })).filter(component => component.variants.length);
  const publishedScope = published.map(component => component.id);
  for (const component of published) component.contrasts = component.contrasts.filter(id => publishedScope.includes(id));
  return {
    schemaVersion: '2.0.0',
    generatedFrom: ['components/selection-mvp-policy.json', 'components/contracts/*.json'],
    scope: publishedScope,
    componentCount: published.length,
    publicationPolicy: "components/reference-policy.json#/deliveryBaseline/calls",
    components: published
  };
}

function main() {
  const check = process.argv.includes('--check');
  try {
    const manifest = buildSelectionMvp();
    const content = serialize(manifest);
    const bytes = Buffer.byteLength(content);
    if (bytes > MAX_BYTES) throw new Error(`统一组件选型清单 ${bytes} bytes，超过 ${MAX_BYTES} bytes 上限`);
    if (check) {
      if (!fs.existsSync(OUTPUT_FILE)) throw new Error('统一组件选型清单不存在');
      if (fs.readFileSync(OUTPUT_FILE, 'utf8') !== content) throw new Error('统一组件选型清单已过期');
      console.log(`Unified component selection catalog is current: ${manifest.componentCount} components / ${bytes} bytes.`);
      return;
    }
    if (fs.existsSync(OUTPUT_FILE) && fs.readFileSync(OUTPUT_FILE, 'utf8') === content) {
      console.log(`Components/component-selection-mvp.json is current: ${manifest.componentCount} components / ${bytes} bytes (unified scope).`);
      return;
    }
    fs.writeFileSync(OUTPUT_FILE, content);
    console.log(`Generated components/component-selection-mvp.json: ${manifest.componentCount} components / ${bytes} bytes (unified scope).`);
  } catch (error) {
    console.error(`Unified component selection compilation failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { buildSelectionMvp };
