#!/usr/bin/env node
'use strict';

/**
 * Promote a validated page-local SVG icon (e.g. synthesized by scripts/fs-icon.cjs)
 * into the official FS Design System icon library + icon-style-families.json registry.
 *
 * Usage:
 *   npm run icon:promote -- pages/assets/<page>/icon-xxx.svg icon-official-name.svg --family=duotone-line [--dry-run]
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'design-system', 'components', 'icons');
const FAMILIES_FILE = path.join(ROOT, 'design-spec', 'icon-style-families.json');
const VALID_FAMILIES = new Set([
  'duotone-line',
  'duotone-surface',
  'line-mono-lg',
  'flat-illustration',
  'line-mono',
  'ui-atom',
  'brand-badge'
]);

function parseArgs(argv) {
  const args = argv.slice(2);
  let src = '';
  let targetName = '';
  let family = 'duotone-line';
  let dryRun = false;

  for (const a of args) {
    if (a === '--dry-run') dryRun = true;
    else if (a.startsWith('--family=')) family = a.slice(9).trim();
    else if (!a.startsWith('--')) {
      if (!src) src = a.trim();
      else if (!targetName) targetName = a.trim();
    }
  }

  if (!src || !targetName) {
    console.error(
      'Usage: npm run icon:promote -- <source-svg> <target-filename.svg> [--family=duotone-line] [--dry-run]'
    );
    process.exit(1);
  }
  if (!VALID_FAMILIES.has(family)) {
    console.error(`Invalid --family="${family}". Valid: ${[...VALID_FAMILIES].join(', ')}`);
    process.exit(1);
  }
  if (!/^[a-z0-9][a-z0-9._-]*\.svg$/i.test(targetName)) {
    console.error(`Invalid target filename "${targetName}". Must be lowercase alphanumeric + .svg`);
    process.exit(1);
  }
  return { src, targetName, family, dryRun };
}

function main() {
  const { src, targetName, family, dryRun } = parseArgs(process.argv);
  const srcAbs = path.resolve(ROOT, src);
  if (!fs.existsSync(srcAbs)) {
    console.error(`Source SVG not found: ${src}`);
    process.exit(1);
  }
  const svg = fs.readFileSync(srcAbs, 'utf8');
  if (!/<svg[\s>]/i.test(svg) || /<script[\s>]/i.test(svg)) {
    console.error('Source file is not a clean static SVG.');
    process.exit(1);
  }

  const destAbs = path.join(ICONS_DIR, targetName);
  const families = JSON.parse(fs.readFileSync(FAMILIES_FILE, 'utf8'));
  const mapKey = families.byFile ? 'byFile' : families.icons ? 'icons' : null;
  if (!mapKey) {
    console.error('Unexpected icon-style-families.json schema.');
    process.exit(1);
  }

  if (dryRun) {
    console.log(`[dry-run] Would copy ${src} -> design-system/components/icons/${targetName}`);
    console.log(`[dry-run] Would register "${targetName}" under styleFamily="${family}" in design-spec/icon-style-families.json`);
    return;
  }

  fs.copyFileSync(srcAbs, destAbs);
  families[mapKey][targetName] = {
    ...(families[mapKey][targetName] || {}),
    styleFamily: family,
    promotedFrom: src,
    promotedAt: new Date().toISOString().slice(0, 10)
  };
  if (typeof families.totalIcons === 'number') {
    families.totalIcons = Object.keys(families[mapKey]).length;
  }
  fs.writeFileSync(FAMILIES_FILE, JSON.stringify(families, null, 2) + '\n', 'utf8');

  console.log(`Promoted ${src} -> design-system/components/icons/${targetName} (${family})`);
  console.log('Next step: run `npm run component:sync && npm run core:export` to publish the updated icon library.');
}

main();
