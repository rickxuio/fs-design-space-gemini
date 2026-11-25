#!/usr/bin/env node
/**
 * FS Design System — Component Reference Build Script
 *
 * Usage:
 *   node build.js                    # Assemble all pages
 *   node build.js --check navigation # List pages using a component
 *
 * Zero dependencies — uses only Node.js built-in modules.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, 'fs-components', 'component-registry.json');
const PAGE_SOURCES_DIR = path.join(__dirname, 'fs-components', 'page-sources');
const PAGE_SPECS_DIR = path.join(__dirname, 'fs-components', 'page-specs');

// ─────────────────────────────────────────────
// 1. loadRegistry()
// ─────────────────────────────────────────────
function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('ERROR: Component registry not found at fs-components/component-registry.json');
    process.exit(1);
  }

  let raw;
  try {
    raw = fs.readFileSync(REGISTRY_PATH, 'utf8');
  } catch (e) {
    console.error(`ERROR: Could not read component registry: ${e.message}`);
    process.exit(1);
  }

  let registry;
  try {
    registry = JSON.parse(raw);
  } catch (e) {
    console.error(`ERROR: Invalid JSON in component registry: ${e.message}`);
    process.exit(1);
  }

  if (!registry || typeof registry.components !== 'object') {
    console.error('ERROR: Component registry must have a "components" object.');
    process.exit(1);
  }

  // Validate each entry and check files exist
  const registryDir = path.dirname(REGISTRY_PATH);
  for (const [name, entry] of Object.entries(registry.components)) {
    if (!entry.path || !Array.isArray(entry.fragments)) {
      console.error(`ERROR: Component "${name}" in registry must have "path" and "fragments" fields.`);
      process.exit(1);
    }
    const absPath = path.resolve(registryDir, entry.path);
    if (!fs.existsSync(absPath)) {
      console.error(`ERROR: Component spec file not found: ${absPath} (referenced by component "${name}" in registry)`);
      process.exit(1);
    }
  }

  return registry;
}

// ─────────────────────────────────────────────
// 2. parseFragments(htmlString)
// ─────────────────────────────────────────────
function parseFragments(htmlString) {
  const fragments = new Map();
  // Match opening tags that have data-fragment attribute (any element type)
  const tagPattern = /<(\w[\w-]*)[^>]*\sdata-fragment="([^"]+)"[^>]*>/g;
  let match;

  while ((match = tagPattern.exec(htmlString)) !== null) {
    const tagName = match[1];
    const fragmentName = match[2];
    const startIndex = match.index;

    // Find the matching closing tag, accounting for nesting
    const closeTag = `</${tagName}>`;
    let depth = 1;
    let searchFrom = startIndex + match[0].length;

    // Handle self-closing tags
    if (match[0].endsWith('/>')) {
      fragments.set(fragmentName, match[0]);
      continue;
    }

    const openTagPattern = new RegExp(`<${tagName}[\\s>]`, 'g');
    openTagPattern.lastIndex = searchFrom;

    let closeIndex = -1;
    let pos = searchFrom;

    while (depth > 0 && pos < htmlString.length) {
      const nextOpen = htmlString.indexOf(`<${tagName}`, pos);
      const nextClose = htmlString.indexOf(closeTag, pos);

      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        // Check it's actually an opening tag (not self-closing)
        const tagEnd = htmlString.indexOf('>', nextOpen);
        if (tagEnd !== -1 && !htmlString.slice(nextOpen, tagEnd + 1).endsWith('/>')) {
          depth++;
        }
        pos = nextOpen + 1;
      } else {
        depth--;
        if (depth === 0) {
          closeIndex = nextClose + closeTag.length;
        }
        pos = nextClose + 1;
      }
    }

    if (closeIndex !== -1) {
      const fragmentHtml = htmlString.slice(startIndex, closeIndex);
      fragments.set(fragmentName, fragmentHtml);
    }
  }

  return fragments;
}

// ─────────────────────────────────────────────
// 3. findPlaceholders(htmlString)
// ─────────────────────────────────────────────
function findPlaceholders(htmlString) {
  const placeholders = [];
  // Match <div data-component="..." data-fragment="..." ...>...</div> or self-closing
  const pattern = /<div\s[^>]*data-component="([^"]+)"[^>]*data-fragment="([^"]+)"[^>]*(?:\/>|>[\s\S]*?<\/div>)/g;
  let match;

  while ((match = pattern.exec(htmlString)) !== null) {
    const fullMatch = match[0];
    const component = match[1];
    const fragment = match[2];

    // Extract data-props if present
    let props = null;
    const propsMatch = fullMatch.match(/data-props='([^']+)'|data-props="([^"]+)"/);
    if (propsMatch) {
      let propsStr = propsMatch[1] || propsMatch[2];
      if (component.startsWith('library-')) {
        const JSDOM = require('./scripts/local-component-library.cjs').domAPI();
        const dom = new JSDOM(); const textarea = dom.window.document.createElement('textarea');
        textarea.innerHTML = propsStr; propsStr = textarea.value; dom.window.close();
      }
      try {
        props = JSON.parse(propsStr);
      } catch (e) {
        // Will be caught later with line info
        props = { __parseError: propsStr };
      }
    }

    // Calculate line number
    const upToMatch = htmlString.slice(0, match.index);
    const line = upToMatch.split('\n').length;

    placeholders.push({ component, fragment, props, fullMatch, line });
  }

  return placeholders;
}

// ─────────────────────────────────────────────
// 4. rewritePaths(html, fromDir, toDir)
// ─────────────────────────────────────────────
function rewritePaths(html, fromDir, toDir) {
  function rewriteUrl(url) {
    // Leave absolute URLs unchanged
    if (/^(https?:|data:|\/\/|#|mailto:)/.test(url)) return url;
    // Leave root-relative paths unchanged
    if (url.startsWith('/')) return url;
    // Resolve from source dir, then make relative to target dir
    const abs = path.resolve(fromDir, url);
    return path.relative(toDir, abs).replace(/\\/g, '/');
  }

  // Rewrite src="..." attributes
  html = html.replace(/\bsrc="([^"]+)"/g, (_, url) => `src="${rewriteUrl(url)}"`);
  // Rewrite href="..." attributes (skip anchor-only hrefs)
  html = html.replace(/\bhref="([^"]+)"/g, (_, url) => `href="${rewriteUrl(url)}"`);
  // Rewrite url(...) in style attributes and inline styles
  html = html.replace(/url\(['"]?([^'")]+)['"]?\)/g, (_, url) => `url('${rewriteUrl(url)}')`);

  return html;
}

// ─────────────────────────────────────────────
// 5. applyProps(html, props)
// ─────────────────────────────────────────────
function applyProps(html, props) {
  if (!props) return html;

  if (props.addClass) {
    html = html.replace(/^(<\w[\w-]*\s[^>]*class=")/, `$1${props.addClass} `);
  }
  if (props.removeClass) {
    html = html.replace(new RegExp(`\\b${props.removeClass}\\b\\s?`, 'g'), '');
  }
  if (props.cta) {
    // Replace CTA button text (ds-btn text content)
    html = html.replace(/(<span class="ds-btn__text">)[^<]*(<\/span>)/, `$1${props.cta}$2`);
  }
  if (props.tabs && Array.isArray(props.tabs)) {
    // Replace all tab text content in ds-anchor-nav__tab elements
    let tabIndex = 0;
    html = html.replace(/(<div[^>]*class="[^"]*ds-anchor-nav__tab[^"]*"[^>]*data-anchor-tab[^>]*>)[^<]*/g, (match, openTag) => {
      const label = props.tabs[tabIndex] !== undefined ? props.tabs[tabIndex] : match.replace(openTag, '');
      tabIndex++;
      return openTag + label;
    });
  }

  return html;
}

// ─────────────────────────────────────────────
// 6. assemblePage(pageSourceHtml, registry, fragmentCache, sourceFile)
// ─────────────────────────────────────────────
function assemblePage(pageSourceHtml, registry, fragmentCache, sourceFile, options = {}) {
  const placeholders = findPlaceholders(pageSourceHtml);
  const registryDir = path.dirname(REGISTRY_PATH);
  const toDir = options.targetDir || PAGE_SPECS_DIR;
  const library = require('./scripts/local-component-library.cjs');
  const uses = [];
  if (placeholders.some(p => p.component.startsWith('library-')) && placeholders.some(p => !p.component.startsWith('library-'))) throw Error('Cannot mix legacy and new-library components in one page');
  const dependencies = [];

  let result = pageSourceHtml;

  for (const ph of placeholders) {
    const { component, fragment, props, fullMatch, line } = ph;

    // Validate component exists in registry
    if (!registry.components[component]) {
      const available = Object.keys(registry.components).join(', ');
      console.error(`ERROR: Unknown component "${component}" in ${sourceFile} (line ${line}). Available components: ${available}`);
      process.exit(1);
    }

    // Validate props JSON
    if (props && props.__parseError) {
      console.error(`ERROR: Invalid JSON in data-props attribute in ${sourceFile} (line ${line}): ${props.__parseError}`);
      process.exit(1);
    }

    if (component.startsWith('library-')) {
      const use = library.render(component, fragment, props || {}, { targetDir: toDir });
      result = result.replace(fullMatch, () => use.html);
      uses.push(use);
      dependencies.push(`${component}/${fragment}`);
      continue;
    }

    // Load and cache component fragments
    if (!fragmentCache.has(component)) {
      const compEntry = registry.components[component];
      const compPath = path.resolve(registryDir, compEntry.path);
      const compHtml = fs.readFileSync(compPath, 'utf8');
      fragmentCache.set(component, parseFragments(compHtml));
    }

    const compFragments = fragmentCache.get(component);

    // Validate fragment exists
    if (!compFragments.has(fragment)) {
      const available = Array.from(compFragments.keys()).join(', ') || '(none found)';
      console.error(`ERROR: Fragment "${fragment}" not found in component "${component}" (file: ${registry.components[component].path}). Referenced from ${sourceFile} (line ${line}). Available fragments: ${available}`);
      process.exit(1);
    }

    // Get fragment HTML, rewrite paths, apply props
    const compEntry = registry.components[component];
    const fromDir = path.resolve(registryDir, path.dirname(compEntry.path));
    let fragmentHtml = compFragments.get(fragment);
    fragmentHtml = rewritePaths(fragmentHtml, fromDir, toDir);
    fragmentHtml = applyProps(fragmentHtml, props);

    // Replace placeholder
    result = result.replace(fullMatch, () => fragmentHtml);
    dependencies.push(`${component}/${fragment}`);
  }

  return { html: library.finalizePage(result, uses, toDir), dependencies };
}

// ─────────────────────────────────────────────
// 7. buildAll() — main entry
// ─────────────────────────────────────────────
function buildAll() {
  const registry = loadRegistry();

  // Ensure page-sources dir exists
  if (!fs.existsSync(PAGE_SOURCES_DIR)) {
    console.log('No page sources found in fs-components/page-sources/. Nothing to build.');
    process.exit(0);
  }

  const sourceFiles = fs.readdirSync(PAGE_SOURCES_DIR).filter(f => f.endsWith('.html'));

  if (sourceFiles.length === 0) {
    console.log('No page sources found in fs-components/page-sources/. Nothing to build.');
    process.exit(0);
  }

  // Ensure output dir exists
  if (!fs.existsSync(PAGE_SPECS_DIR)) {
    fs.mkdirSync(PAGE_SPECS_DIR, { recursive: true });
  }

  const fragmentCache = new Map();
  const allDependencies = {};
  const allReferenced = new Set();

  for (const file of sourceFiles) {
    const sourcePath = path.join(PAGE_SOURCES_DIR, file);
    const sourceHtml = fs.readFileSync(sourcePath, 'utf8');
    const { html, dependencies } = assemblePage(sourceHtml, registry, fragmentCache, sourcePath);

    const outputPath = path.join(PAGE_SPECS_DIR, file);
    fs.writeFileSync(outputPath, html, 'utf8');

    allDependencies[file] = dependencies;
    dependencies.forEach(d => allReferenced.add(d));
  }

  // Orphan detection
  const orphans = [];
  for (const [compName, entry] of Object.entries(registry.components)) {
    for (const frag of entry.fragments) {
      const key = `${compName}/${frag}`;
      if (!allReferenced.has(key)) {
        orphans.push(key);
      }
    }
  }

  // Print summary
  console.log(`\n✓ Built ${sourceFiles.length} page${sourceFiles.length !== 1 ? 's' : ''} → ${PAGE_SPECS_DIR}\n`);
  for (const [file, deps] of Object.entries(allDependencies)) {
    console.log(`  ${file}`);
    deps.forEach(d => console.log(`    └─ ${d}`));
  }
  if (orphans.length > 0) {
    console.log(`\n⚠ Orphan fragments (not used by any page):`);
    orphans.forEach(o => console.log(`  - ${o}`));
  }
}

// ─────────────────────────────────────────────
// 8. --check <component> CLI flag
// ─────────────────────────────────────────────
function checkComponent(componentName) {
  const registry = loadRegistry();

  if (!registry.components[componentName]) {
    const available = Object.keys(registry.components).join(', ');
    console.error(`ERROR: Unknown component "${componentName}". Available components: ${available}`);
    process.exit(1);
  }

  if (!fs.existsSync(PAGE_SOURCES_DIR)) {
    console.log('No page sources directory found.');
    process.exit(0);
  }

  const sourceFiles = fs.readdirSync(PAGE_SOURCES_DIR).filter(f => f.endsWith('.html'));
  const matches = [];

  for (const file of sourceFiles) {
    const sourcePath = path.join(PAGE_SOURCES_DIR, file);
    const sourceHtml = fs.readFileSync(sourcePath, 'utf8');
    const placeholders = findPlaceholders(sourceHtml);
    if (placeholders.some(p => p.component === componentName)) {
      matches.push(file);
    }
  }

  if (matches.length === 0) {
    console.log(`No pages reference component "${componentName}".`);
  } else {
    console.log(`\nPages using component "${componentName}":`);
    matches.forEach(f => console.log(`  - ${f}`));
  }
}

// ─────────────────────────────────────────────
// Entry point
// ─────────────────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === '--check' && args[1]) {
    checkComponent(args[1]);
  } else if (args[0] === '--inspect') {
    const inspector = require('./scripts/inspect-component.cjs');
    try {
      const out = args.length === 1
        ? inspector.inspectAll()
        : inspector.inspectComponent(args[1], args[2]);
      console.log(JSON.stringify(out, null, 2));
    } catch (e) {
      console.error('ERROR:', e.message);
      process.exit(1);
    }
  } else {
    buildAll();
  }
}

// Export functions for testing
if (typeof module !== 'undefined') {
  module.exports = { loadRegistry, parseFragments, findPlaceholders, rewritePaths, applyProps, assemblePage };
}
