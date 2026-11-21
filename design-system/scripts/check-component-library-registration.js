#!/usr/bin/env node
/* Ensure every formal component contract is reachable from component-library.html. */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONTRACTS_DIR = path.join(ROOT, 'components', 'contracts');
const PREVIEW_DIR = path.join(ROOT, 'components', 'variants');
const LIBRARY_FILE = path.join(ROOT, 'component-library.html');

const contractIds = fs.readdirSync(CONTRACTS_DIR)
  .filter((name) => name.endsWith('.json'))
  .map((name) => name.replace(/\.json$/, ''))
  .sort();

const libraryHtml = fs.readFileSync(LIBRARY_FILE, 'utf8');
const registeredIds = new Set(
  [...libraryHtml.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((match) => match[1])
);

const errors = [];
contractIds.forEach((id) => {
  if (!registeredIds.has(id)) {
    errors.push(`${id}: 已有正式契约，但未注册到 component-library.html`);
  }
  if (!fs.existsSync(path.join(PREVIEW_DIR, `${id}.html`))) {
    errors.push(`${id}: 已有正式契约，但缺少 components/variants/${id}.html`);
  }
});

if (errors.length) {
  console.error('\n组件库入口检查失败：');
  errors.forEach((error) => console.error(`  ✗ ${error}`));
  process.exit(1);
}

console.log(`✓ ${contractIds.length} 个正式组件均已注册到 component-library.html，且 Preview 文件存在`);
