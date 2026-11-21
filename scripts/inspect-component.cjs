'use strict';

const fs = require('node:fs');
const path = require('node:path');
const L = require('./local-component-library.cjs');

const { SPEC_PAGE } = require('../design-system/scripts/variant-source.js');

function currentPreviewPath(id) {
  return SPEC_PAGE(id);
}

function normalizeComponentKey(name) {
  if (!name) return '';
  return name.startsWith('library-') ? name : `library-${name}`;
}

function inspectAll(root = L.ROOT) {
  const catalog = L.catalog(root);
  const items = Object.values(catalog.components)
    .sort((a, b) => a.key.localeCompare(b.key))
    .map((c) => {
      const variants = Object.values(c.variants || {});
      const callable = variants.filter((v) => v.callable).map((v) => v.fragment);
      return {
        component: c.key,
        name: c.name,
        preview: currentPreviewPath(c.id),
        callableCount: callable.length,
        totalVariants: variants.length,
        callableFragments: callable,
      };
    });
  return {
    version: catalog.version,
    componentsCount: items.length,
    callableTotal: items.reduce((sum, x) => sum + x.callableCount, 0),
    components: items,
  };
}

function inspectComponent(name, fragment, { root = L.ROOT, targetDir } = {}) {
  const catalog = L.catalog(root);
  const key = normalizeComponentKey(name);
  const comp = catalog.components[key];
  if (!comp) {
    const available = Object.keys(catalog.components).sort().join(', ');
    throw Error(`Unknown component "${name}". Available: ${available}`);
  }

  const preview = currentPreviewPath(comp.id);
  const decisionsByFragment = new Map(
    (comp.decisions || []).map((d) => [d.fragment || L.fragmentName(d.variant || ''), d])
  );

  if (!fragment) {
    return {
      version: catalog.version,
      component: comp.key,
      name: comp.name,
      preview,
      contract: comp.contract,
      variants: Object.values(comp.variants || {}).map((v) => {
        const dec = decisionsByFragment.get(v.fragment);
        return {
          fragment: v.fragment,
          callable: Boolean(v.callable),
          whenToUse: dec?.whenToUse || v.whenToUse || '',
          whenNotToUse: dec?.whenNotToUse || v.whenNotToUse || '',
          allowedEdits: v.allowedEdits || [],
          reason: v.callable ? undefined : v.reason,
        };
      }),
    };
  }

  const variant = comp.variants?.[fragment];
  if (!variant) {
    const available = Object.keys(comp.variants || {}).join(', ');
    throw Error(`Unknown fragment "${fragment}" for "${key}". Available: ${available}`);
  }

  const dec = decisionsByFragment.get(fragment);
  const result = {
    version: catalog.version,
    component: comp.key,
    fragment,
    callable: Boolean(variant.callable),
    reason: variant.reason,
    references: {
      preview,
      contract: comp.contract,
    },
    decision: dec
      ? {
          type: dec.type,
          whenToUse: dec.whenToUse,
          whenNotToUse: dec.whenNotToUse,
          nestedComponents: dec.nestedComponents || [],
        }
      : {
          whenToUse: variant.whenToUse || '',
          whenNotToUse: variant.whenNotToUse || '',
        },
    allowedEdits: variant.allowedEdits || [],
    sizeOptions: (variant.sizeOptions || []).map((s) => s.name),
    defaultSize: variant.defaultSize || null,
    dependencies: (comp.dependencies || []).filter(
      (d) => !d.appliesTo || d.appliesTo.includes(variant.sourceVariant)
    ),
    extensionNote:
      'Need extra business elements inside this component? Keep the native root & slots intact, wrap extra elements with data-fs-extend="<purpose>" using FS tokens (var(--color-*), var(--font-*), 400/600 weights, no gradients).',
  };

  if (variant.callable) {
    const rendered = L.render(key, fragment, {}, {
      root,
      version: catalog.version,
      targetDir: targetDir || path.join(root, 'pages'),
    });
    result.exampleHtml = rendered.html;
    result.callSnippet = `<div data-component="${key}" data-fragment="${fragment}" data-props='{}'></div>`;
  }

  return result;
}

if (require.main === module) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  try {
    const out =
      args.length === 0
        ? inspectAll()
        : inspectComponent(args[0], args[1]);
    console.log(JSON.stringify(out, null, 2));
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exitCode = 1;
  }
}

module.exports = { currentPreviewPath, inspectAll, inspectComponent };
