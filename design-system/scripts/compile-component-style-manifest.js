#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const COMPONENT_DIR = path.join(ROOT, 'components');
const CONTRACT_DIR = path.join(COMPONENT_DIR, 'contracts');
const TOKEN_SPEC_DIR = path.join(COMPONENT_DIR, 'token-specs');
const TOKEN_CSS = path.join(COMPONENT_DIR, 'tokens.css');
const COMPONENT_CSS = path.join(COMPONENT_DIR, 'components.css');

const DEPENDENCY_KEYS = [
  'colorDependencies',
  'fontSizeDependencies',
  'fontWeightDependencies',
  'typographyDependencies',
  'spacingDependencies',
  'borderDependencies',
  'radiusDependencies',
  'shadowDependencies'
];

const VISUAL_PROPERTIES = new Set([
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'color', 'background', 'background-color', 'background-image', 'opacity',
  'border', 'border-width', 'border-style', 'border-color',
  'border-top', 'border-top-width', 'border-top-style', 'border-top-color',
  'border-right', 'border-right-width', 'border-right-style', 'border-right-color',
  'border-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
  'border-left', 'border-left-width', 'border-left-style', 'border-left-color',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius',
  'border-bottom-right-radius', 'border-bottom-left-radius',
  'box-shadow', 'text-shadow',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'gap', 'row-gap', 'column-gap',
  // Positional offsets are included when they are backed by spacing tokens
  // (e.g. Banner breadcrumbs and MenuNavigation search icon alignment).
  'inset', 'top', 'right', 'bottom', 'left'
]);

const COMPONENT_MARKERS = {
  button: 'ds-btn',
  'icon-button': 'ds-icon-btn',
  'text-button': 'ds-text-btn',
  'video-button': 'ds-video-btn',
  navigation: 'ds-nav'
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function listJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => path.join(dir, name));
}

function normalizeSpace(value) {
  return String(value == null ? '' : value).trim().replace(/\s+/g, ' ');
}

function normalizeComparable(value) {
  return normalizeSpace(value).replace(/\s*!important\s*$/i, '').replace(/\s+/g, '').toLowerCase();
}

function tokenValue(token) {
  if (token && typeof token.value === 'number') {
    return `${token.value}${token.unit || ''}`;
  }
  return token && token.value != null ? String(token.value) : '';
}

function loadPrimitiveTokens() {
  const byCssVar = new Map();
  const byName = new Map();

  listJsonFiles(TOKEN_SPEC_DIR).forEach((file) => {
    const spec = readJson(file);
    const category = spec.category || path.basename(file, '.json');
    [...(spec.tokens || []), ...(spec.compositeTokens || [])].forEach((token) => {
      const record = {
        name: token.name,
        cssVar: token.cssVar || null,
        value: tokenValue(token),
        category,
        source: path.relative(ROOT, file),
        primitiveReferences: token.primitiveReferences || null
      };
      byName.set(record.name, record);
      if (record.cssVar) byCssVar.set(record.cssVar, record);
      if (token.lineHeightCssVar && token.value && token.value.lineHeight) {
        const lineHeightRecord = {
          name: `${token.name}.lineHeight`,
          cssVar: token.lineHeightCssVar,
          value: String(token.value.lineHeight),
          category: 'typography-line-height',
          source: path.relative(ROOT, file)
        };
        byName.set(lineHeightRecord.name, lineHeightRecord);
        if (!byCssVar.has(lineHeightRecord.cssVar)) byCssVar.set(lineHeightRecord.cssVar, lineHeightRecord);
      }
    });
  });

  const tokenCss = fs.readFileSync(TOKEN_CSS, 'utf8');
  const definitions = new Map();
  const definitionRe = /(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi;
  let definitionMatch;
  while ((definitionMatch = definitionRe.exec(tokenCss))) {
    definitions.set(definitionMatch[1], normalizeSpace(definitionMatch[2]));
  }
  function resolveDefinition(cssVar, stack = new Set()) {
    if (stack.has(cssVar)) return definitions.get(cssVar) || '';
    const value = definitions.get(cssVar);
    if (!value) return '';
    const nextStack = new Set(stack).add(cssVar);
    return value.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]+))?\)/gi, (whole, nested, fallback) => (
      resolveDefinition(nested, nextStack) || fallback || whole
    ));
  }
  byCssVar.forEach((record, cssVar) => {
    const runtimeValue = resolveDefinition(cssVar);
    if (runtimeValue) record.value = runtimeValue;
  });

  return { byCssVar, byName };
}

function componentMarker(id) {
  return COMPONENT_MARKERS[id] || `ds-${id}`;
}

function extractComponentSection(css, id) {
  const marker = componentMarker(id);
  const banners = [];
  const bannerRe = /\/\*\s*=+\s*([\s\S]*?)\s*=+\s*\*\//g;
  let match;
  while ((match = bannerRe.exec(css))) {
    banners.push({ start: match.index, end: bannerRe.lastIndex, title: match[1] });
  }
  const lowerMarker = marker.toLowerCase();
  const startIndex = banners.findIndex((entry) => entry.title.toLowerCase().includes(lowerMarker));
  if (startIndex < 0) return null;
  const start = banners[startIndex].start;
  const end = startIndex + 1 < banners.length ? banners[startIndex + 1].start : css.length;
  return css.slice(start, end);
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = null;
  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i];
    const previous = source[i - 1];
    if (quote) {
      if (char === quote && previous !== '\\') quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function parseTopLevelRules(css) {
  const source = stripComments(css);
  const rules = [];
  let cursor = 0;
  while (cursor < source.length) {
    const open = source.indexOf('{', cursor);
    if (open < 0) break;
    const header = normalizeSpace(source.slice(cursor, open));
    const close = findMatchingBrace(source, open);
    if (close < 0) break;
    if (header && !header.startsWith('@')) {
      rules.push({ selectorText: header, body: source.slice(open + 1, close) });
    }
    cursor = close + 1;
  }
  return rules;
}

// Conditional rules stay outside unconditional runtime assertions. Preserve
// their declarations for static closure instead of applying mobile CSS on PC.
function parseConditionalRules(css, conditions = []) {
  const source = stripComments(css), rules = [];
  let cursor = 0;
  while (cursor < source.length) {
    const open = source.indexOf('{', cursor);
    if (open < 0) break;
    const header = normalizeSpace(source.slice(cursor, open));
    const close = findMatchingBrace(source, open);
    if (close < 0) break;
    const body = source.slice(open + 1, close);
    if (/^@(media|supports)\b/.test(header)) {
      rules.push(...parseConditionalRules(body, [...conditions, header]));
    } else if (conditions.length && header && !header.startsWith('@')) {
      rules.push({ selectorText: header, body, conditions });
    }
    cursor = close + 1;
  }
  return rules;
}

function splitSelectors(selectorText) {
  const selectors = [];
  let start = 0;
  let round = 0;
  let square = 0;
  let quote = null;
  for (let i = 0; i <= selectorText.length; i += 1) {
    const char = selectorText[i];
    const previous = selectorText[i - 1];
    if (quote) {
      if (char === quote && previous !== '\\') quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '(') round += 1;
    else if (char === ')') round = Math.max(0, round - 1);
    else if (char === '[') square += 1;
    else if (char === ']') square = Math.max(0, square - 1);
    else if ((char === ',' || i === selectorText.length) && round === 0 && square === 0) {
      const selector = normalizeSpace(selectorText.slice(start, i));
      if (selector) selectors.push(selector);
      start = i + 1;
    }
  }
  return selectors;
}

function parseDeclarations(body) {
  const declarations = [];
  const declarationRe = /(^|;)\s*([a-z-]+)\s*:\s*([^;{}]+)(?=;|$)/gim;
  let match;
  while ((match = declarationRe.exec(body))) {
    const property = match[2].toLowerCase();
    let cssValue = normalizeSpace(match[3]);
    const important = /\s*!important\s*$/i.test(cssValue);
    cssValue = normalizeSpace(cssValue.replace(/\s*!important\s*$/i, ''));
    declarations.push({ property, cssValue, important });
  }
  return declarations;
}

function extractCssVariables(value) {
  const variables = [];
  const re = /var\(\s*(--[a-z0-9-]+)/gi;
  let match;
  while ((match = re.exec(value))) {
    if (!variables.includes(match[1])) variables.push(match[1]);
  }
  return variables;
}

function isStatefulSelector(selector) {
  return /:(hover|active|focus|focus-visible|focus-within|disabled|checked|target|visited)\b/.test(selector)
    || /\[(aria-selected|aria-expanded|aria-pressed|disabled|data-state)=?/.test(selector)
    || /--(active|selected|expanded|open|disabled)\b/.test(selector);
}

function normalizeAppliesTo(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  return [String(value)];
}

function collectDependencies(contract) {
  const records = [];
  const relationships = contract.relations || contract.relationships || {};
  DEPENDENCY_KEYS.forEach((key) => {
    (relationships[key] || []).forEach((dependency, index) => {
      records.push({
        category: key,
        index,
        token: dependency.token || null,
        value: dependency.value == null ? null : String(dependency.value),
        appliesTo: normalizeAppliesTo(dependency.appliesTo),
        selectors: Array.isArray(dependency.selectors) ? dependency.selectors : [],
        properties: Array.isArray(dependency.properties) ? dependency.properties : [],
        usage: dependency.usage || ''
      });
    });
  });
  return records;
}

function dependencyTargets(records, tokenName, cssValue) {
  const targets = new Set();
  records.forEach((record) => {
    const tokenMatches = tokenName && record.token === tokenName;
    const rawMatches = record.token === '/' && record.value
      && normalizeComparable(cssValue).includes(normalizeComparable(record.value));
    if (!tokenMatches && !rawMatches) return;
    record.appliesTo.forEach((target) => targets.add(target));
  });
  return [...targets].sort();
}

function selectorClasses(selector) {
  const result = [];
  const re = /\.([a-zA-Z0-9_-]+)/g;
  let match;
  while ((match = re.exec(selector))) {
    if (!result.includes(match[1])) result.push(match[1]);
  }
  return result;
}

function compileComponent(componentKey, contract, contractFile, css, tokenRegistry) {
  const baseSection = extractComponentSection(css, componentKey);
  const corrections = (contract.integration?.styles || []).filter(f => !['components/components.css','components/tokens.css'].includes(f)).map(f => {
    const full = path.resolve(ROOT,f);
    if (!full.startsWith(COMPONENT_DIR + path.sep) || !fs.existsSync(full)) throw new Error('Missing or invalid runtime stylesheet: '+f);
    return fs.readFileSync(full,'utf8');
  }).join('\n');
  const section = [baseSection, corrections].filter(Boolean).join('\n');
  if (!section) throw new Error(`Missing CSS section for contract ${componentKey}`);
  const dependencies = collectDependencies(contract);
  const sectionOffset = baseSection ? css.indexOf(baseSection) : 0;
  const assertions = [];
  const unknownCssVariables = new Set();
  const locallyDeclaredVariables = new Set();
  const localVariableRe = /(^|[;{])\s*(--[a-z0-9-]+)\s*:/gim;
  let localVariableMatch;
  while ((localVariableMatch = localVariableRe.exec(section))) locallyDeclaredVariables.add(localVariableMatch[2]);
  let order = 0;

  parseTopLevelRules(section).forEach((rule) => {
    const selectors = splitSelectors(rule.selectorText);
    parseDeclarations(rule.body).forEach((declaration) => {
      if (!VISUAL_PROPERTIES.has(declaration.property)) return;
      const cssVars = extractCssVariables(declaration.cssValue);
      const tokens = cssVars.map((cssVar) => {
        const token = tokenRegistry.byCssVar.get(cssVar);
        if (!token) {
          if (!locallyDeclaredVariables.has(cssVar)) unknownCssVariables.add(cssVar);
          return null;
        }
        return token;
      }).filter(Boolean);
      const rawDependencies = dependencies.filter((dependency) => (
        dependency.token === '/'
        && dependency.value
        && normalizeComparable(declaration.cssValue).includes(normalizeComparable(dependency.value))
      ));
      const appliesTo = new Set();
      tokens.forEach((token) => {
        dependencyTargets(dependencies, token.name, declaration.cssValue).forEach((target) => appliesTo.add(target));
      });
      rawDependencies.forEach((dependency) => dependency.appliesTo.forEach((target) => appliesTo.add(target)));

      assertions.push({
        id: `${componentKey}:${String(order + 1).padStart(4, '0')}`,
        selectors,
        property: declaration.property,
        cssValue: declaration.cssValue,
        important: declaration.important,
        order: order += 1,
        globalOrder: sectionOffset + order / 10000,
        stateful: selectors.some(isStatefulSelector),
        appliesTo: [...appliesTo].sort(),
        tokens: tokens.map((token) => ({
          name: token.name,
          cssVar: token.cssVar,
          value: token.value,
          category: token.category
        })),
        rawWhitelist: rawDependencies.map((dependency) => ({
          value: dependency.value,
          category: dependency.category,
          usage: dependency.usage
        }))
      });
    });
  });

  const dependencyTokenNames = new Set(dependencies.filter((item) => item.token && item.token !== '/').map((item) => item.token));
  const compiledTokenNames = new Set(assertions.flatMap((item) => item.tokens.map((token) => token.name)).filter(Boolean));
  const conditionalDeclarations = parseConditionalRules(section).flatMap(rule =>
    parseDeclarations(rule.body).filter(d => VISUAL_PROPERTIES.has(d.property)).map(d => ({
      ...d, selectors: splitSelectors(rule.selectorText), conditions: rule.conditions,
      tokens: extractCssVariables(d.cssValue).map(cssVar => {
        const token = tokenRegistry.byCssVar.get(cssVar);
        if (!token && !locallyDeclaredVariables.has(cssVar)) unknownCssVariables.add(cssVar);
        return token?.name;
      }).filter(Boolean)
    })));
  const conditionalEvidence = dependency => conditionalDeclarations.filter(d =>
    d.tokens.includes(dependency.token)
    && (!dependency.selectors.length || dependency.selectors.some(s => d.selectors.includes(s)))
    && (!dependency.properties.length || dependency.properties.includes(d.property)));
  const marker = componentMarker(componentKey);
  const sectionClasses = [...new Set(assertions.flatMap((item) => item.selectors.flatMap(selectorClasses)))];
  const rootClassCandidates = sectionClasses.filter((className) => (
    (className === marker || className.startsWith(`${marker}--`) || className.startsWith(`${marker}-`))
    && !className.includes('__')
  ));
  const preferredRootClasses = rootClassCandidates.includes(marker) ? [marker] : rootClassCandidates.sort();
  const cssOwnedUncompiled = [...dependencyTokenNames].filter((name) => {
    const dependency = dependencies.find((item) => item.token === name);
    if (!dependency) return false;
    if (dependency.selectors.length || dependency.properties.length) return true;
    return section.includes(`var(${tokenRegistry.byName.get(name)?.cssVar || '--missing'})`);
  }).filter((name) => !compiledTokenNames.has(name)
    && !dependencies.some(d => d.token === name && conditionalEvidence(d).length));
  const compiledDependencies = dependencies.map((dependency) => {
    const token = tokenRegistry.byName.get(dependency.token);
    const primitiveNames = token && token.primitiveReferences
      ? Object.values(token.primitiveReferences).map(String)
      : [];
    const assertionCount = assertions.filter((assertion) => {
      if (dependency.token === '/') {
        return assertion.rawWhitelist.some((item) => item.value === dependency.value);
      }
      return assertion.tokens.some((item) => item.name === dependency.token
        || primitiveNames.includes(item.name)
        || (item.name && item.name.startsWith(`${dependency.token}.`))
        || (token && item.value && normalizeComparable(item.value) === normalizeComparable(token.value)));
    }).length;
    return {
      ...dependency,
      id: `${componentKey}:${dependency.category}:${dependency.index + 1}`,
      assertionCount,
      conditionalEvidence: conditionalEvidence(dependency),
      enforcement: assertionCount ? 'runtime-computed-style' : 'static-contract-closure'
    };
  });

  return {
    id: componentKey,
    contractId: contract.id,
    contract: path.relative(ROOT, contractFile),
    root: contract.component && contract.component.root || null,
    rootClassCandidates: preferredRootClasses,
    variants: (contract.variants || []).map((variant) => ({
      name: variant.name,
      type: variant.type || null,
      selector: variant.selector || null,
      classes: selectorClasses(variant.selector || ''),
      requiredPageStyleOverrides: variant.requiredPageStyleOverrides || null
    })),
    dependencyCount: dependencies.length,
    dependencies: compiledDependencies,
    assertionCount: assertions.length,
    assertions,
    coverage: {
      dependencyTokens: dependencyTokenNames.size,
      compiledTokens: compiledTokenNames.size,
      runtimeDependencies: compiledDependencies.filter((item) => item.enforcement === 'runtime-computed-style').length,
      staticClosureDependencies: compiledDependencies.filter((item) => item.enforcement === 'static-contract-closure').length,
      cssOwnedUncompiled,
      unknownCssVariables: [...unknownCssVariables].sort()
    }
  };
}

function buildStyleManifest() {
  const css = fs.readFileSync(COMPONENT_CSS, 'utf8');
  const tokenRegistry = loadPrimitiveTokens();
  const contracts = listJsonFiles(CONTRACT_DIR).map((file) => ({
    key: path.basename(file, '.json'),
    file,
    contract: readJson(file)
  })).sort((a, b) => a.key.localeCompare(b.key));
  const components = {};
  contracts.forEach(({ key, file, contract }) => {
    components[key] = compileComponent(key, contract, file, css, tokenRegistry);
  });

  const errors = Object.values(components).flatMap((component) => [
    ...component.coverage.cssOwnedUncompiled.map((token) => `${component.id}: dependency token ${token} was not compiled`),
    ...component.coverage.unknownCssVariables.map((cssVar) => `${component.id}: unknown CSS variable ${cssVar}`)
  ]);

  if (errors.length) {
    throw new Error(`Component style manifest compilation failed:\n- ${errors.join('\n- ')}`);
  }

  return {
    schemaVersion: 1,
    source: {
      contracts: path.relative(ROOT, CONTRACT_DIR),
      tokenSpecs: path.relative(ROOT, TOKEN_SPEC_DIR),
      componentCss: path.relative(ROOT, COMPONENT_CSS)
    },
    propertyScope: [...VISUAL_PROPERTIES].sort(),
    summary: {
      components: Object.keys(components).length,
      dependencies: Object.values(components).reduce((sum, item) => sum + item.dependencyCount, 0),
      runtimeDependencies: Object.values(components).reduce((sum, item) => sum + item.coverage.runtimeDependencies, 0),
      staticClosureDependencies: Object.values(components).reduce((sum, item) => sum + item.coverage.staticClosureDependencies, 0),
      assertions: Object.values(components).reduce((sum, item) => sum + item.assertionCount, 0)
    },
    components
  };
}

function main() {
  const manifest = buildStyleManifest();
  console.log(
    `Component styles compiled in memory: ${manifest.summary.components} components, `
    + `${manifest.summary.dependencies} dependencies (${manifest.summary.runtimeDependencies} runtime / `
    + `${manifest.summary.staticClosureDependencies} static closure), ${manifest.summary.assertions} assertions.`
  );
}

if (require.main === module) main();

module.exports = {
  buildStyleManifest,
  parseTopLevelRules,
  splitSelectors,
  parseDeclarations,
  parseConditionalRules,
  compileComponent,
  loadPrimitiveTokens
};
