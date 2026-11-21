#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONTRACTS_DIR = path.join(ROOT, 'components/contracts');
const PREVIEW_DIR = path.join(ROOT, 'components/variants');
const REGISTRY_FILE = path.join(ROOT, 'components/registry.json');
const OUTPUT_FILE = path.join(ROOT, 'components/generation-index.json');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function toComponentSlug(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function collectDsClasses(value) {
  const found = [];
  const visit = (item) => {
    if (typeof item === 'string') {
      found.push(...(item.match(/ds-[a-z0-9_-]+/gi) || []));
    } else if (Array.isArray(item)) {
      item.forEach(visit);
    } else if (item && typeof item === 'object') {
      Object.values(item).forEach(visit);
    }
  };
  visit(value);
  return unique(found).sort();
}
function variantSelectionDecision(contract, variant) {
  if (!variant.selectionDecisionType) return null;
  const decision = contract?.relations?.variantDecisions?.find(row => row.type === variant.selectionDecisionType);
  return decision ? selectionDecisionText(decision) : null;
}
function selectionDecisionText(decision) {
  if (!decision.selectionCases?.length) return decision;
  const describe = cases => cases.map(({condition, result}) => condition + ' → ' + result).join('；');
  return {
    ...decision,
    whenToUse: describe(decision.selectionCases.filter(item => item.kind === 'use')),
    whenNotToUse: describe(decision.selectionCases.filter(item => item.kind === 'avoid')),
    designReferences: decision.selectionCases.filter(item => item.kind === 'reference')
  };
}
function variantUsage(variant, contract) {
  return variant.whenToUse || variantSelectionDecision(contract, variant)?.whenToUse || variant.usage || variant.description || variant.structure || variant.notes || '';
}

function variantClasses(contract, variant) {
  const direct = collectDsClasses({
    cssClass: variant.cssClass,
    class: variant.class,
    cssClassReverse: variant.cssClassReverse,
    cssSelectors: variant.cssSelectors,
    styleProperties: variant.styleProperties
  });
  const compactVariant = String(variant.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  const allDecisions = contract.relations && contract.relations.variantDecisions || [];
  const exactDecisions = allDecisions.filter((decision) => {
    const modifierKey = collectDsClasses(decision.className)
      .map((name) => name.split('--').slice(1).join('--'))
      .join('')
      .replace(/[^a-z0-9]+/gi, '')
      .toLowerCase();
    return compactVariant && modifierKey === compactVariant;
  });
  const type = String(variant.type || '').toLowerCase();
  const decisions = exactDecisions.length || direct.length
    ? exactDecisions
    : allDecisions.filter((decision) => type && `${decision.type || ''} ${decision.className || ''}`.toLowerCase().includes(type)).slice(0, 1);
  return unique([...direct, ...collectDsClasses(decisions.map((item) => item.className))]).sort();
}

function variantSizes(variant) {
  return (variant.sizes || []).map((size) => ({
    name: size.name,
    classes: collectDsClasses(size),
    styleProperties: size.styleProperties || undefined
  }));
}

function variantReadiness(contract, variant) {
  const hasOwnStatus = Object.prototype.hasOwnProperty.call(variant, 'isComplete') || Object.prototype.hasOwnProperty.call(variant, 'pendingParts');
  const pendingParts = hasOwnStatus
    ? (Array.isArray(variant.pendingParts) ? variant.pendingParts : [])
    : (Array.isArray(contract.pendingParts) ? contract.pendingParts : []);
  const isComplete = hasOwnStatus ? variant.isComplete === true : contract.isComplete === true;
  return { isComplete, pendingParts, available: isComplete && pendingParts.length === 0 };
}

function selectorCandidates(classes) {
  const modifiers = classes.filter((name) => name.includes('--'));
  const bases = classes.filter((name) => !name.includes('--'));
  return unique([
    ...modifiers.map((name) => `.${name}`),
    modifiers.length ? modifiers.map((name) => `.${name}`).join('') : '',
    bases[0] && modifiers[0] ? `.${bases[0]}.${modifiers[0]}` : ''
  ]);
}

function summarizeRelations(relations = {}) {
  return {
    parentContexts: Object.keys(relations.parentContext || {}).sort(),
    componentDependencies: (relations.componentDependencies || []).map((item) => item.component).sort(),
    mutuallyExclusiveWith: (relations.mutuallyExclusiveWith || []).map((item) => item.component).sort(),
    hardRuleCount: (relations.hardRules || []).length,
    hasVariantSelectionRules: Boolean((relations.variantSelectionRules || []).length)
  };
}

function fragmentAssembly(slug, registry) {
  const entry = registry.components && registry.components[slug];
  return entry ? {
    registryPath: 'components/registry.json',
    previewPath: `components/${entry.path}`,
    fragmentsVerified: entry.fragmentsVerified === true,
    fragments: [...(entry.fragments || [])]
  } : {
    registryPath: 'components/registry.json',
    previewPath: null,
    fragmentsVerified: false,
    fragments: []
  };
}
function buildComponentIndex() {
  const registry = readJson(REGISTRY_FILE);
  const contractFiles = fs.readdirSync(CONTRACTS_DIR)
    .filter((name) => name.endsWith('.json'))
    .sort();
  const components = contractFiles.map((fileName) => {
    const contractFile = path.join(CONTRACTS_DIR, fileName);
    const contract = readJson(contractFile);
    const slug = path.basename(fileName, '.json');
    const previewFile = path.join(PREVIEW_DIR, `${slug}.html`);
    const pendingParts = Array.isArray(contract.pendingParts) ? contract.pendingParts : [];
    const previewExists = fs.existsSync(previewFile);
    const variants = (contract.variants || []).map((variant) => {
      const classes = variantClasses(contract, variant);
      const readiness = variantReadiness(contract, variant);
      const publication = require('./component-publication').publication(ROOT,slug,variant.name);
      return {
        name: variant.name,
        type: variant.type || null,
        label: variant.label || variant.chineseName || null,
        usage: variantUsage(variant, contract),
        classes,
        sizes: variantSizes(variant),
        selectorCandidates: selectorCandidates(classes),
        ...readiness,
        available: readiness.available && publication.newPages,
        publication: {disposition:publication.disposition,newPages:publication.newPages,policyRef:"components/reference-policy.json#/deliveryBaseline/calls/"+publication.key.replace(/~/g,"~0").replace(/\//g,"~1")}
      };
    });
    return {
      id: slug,
      contractId: contract.id,
      name: contract.name,
      chineseName: contract.chineseName || null,
      category: contract.category,
      description: contract.description,
      available: previewExists && variants.some((variant) => variant.available),
      fullyAvailable: previewExists && variants.length > 0 && variants.every((variant) => variant.available),
      isComplete: contract.isComplete === true,
      pendingParts,
      contractPath: path.relative(ROOT, contractFile),
      previewPath: previewExists ? path.relative(ROOT, previewFile) : null,
      searchIntents: unique(contract.searchIntents || []),
      ...(contract.aiContract?.automaticSelection ? { automaticSelection: contract.aiContract.automaticSelection } : {}),
      variants,
      fragmentAssembly: fragmentAssembly(slug, registry),
      relationSummary: summarizeRelations(contract.relations)
    };
  });
  return {
    schemaVersion: '1.0.0',
    generatedFrom: {
      contracts: 'components/contracts/*.json',
      previews: 'components/variants/*.html',
      fragmentAssembly: 'components/registry.json'
    },
    componentCount: components.length,
    components
  };
}

function serializeJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeOrCheck(file, content, check) {
  if (check) {
    if (!fs.existsSync(file)) throw new Error(`生成产物不存在：${path.relative(ROOT, file)}`);
    if (fs.readFileSync(file, 'utf8') !== content) throw new Error(`生成产物已过期：${path.relative(ROOT, file)}`);
    return 'checked';
  }
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === content) return 'current';
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  return 'written';
}
function main() {
  const check = process.argv.slice(2).includes('--check');
  try {
    const index = buildComponentIndex();
    const action = writeOrCheck(OUTPUT_FILE, serializeJson(index), check);
    const verb = action === 'checked' ? '同步检查通过' : action === 'current' ? '已是最新' : '已生成';
    console.log(`✓ 组件生成索引${verb}：${path.relative(ROOT, OUTPUT_FILE)}（${index.componentCount} 个组件）`);
  } catch (error) {
    console.error(`✗ 组件生成索引失败：${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();
module.exports = {
  buildComponentIndex,
  serializeJson,
  writeOrCheck,
  toComponentSlug,
  collectDsClasses,
  variantUsage,
  variantSelectionDecision,
  selectionDecisionText,
  variantClasses,
  variantSizes,
  variantReadiness,
  selectorCandidates
};
