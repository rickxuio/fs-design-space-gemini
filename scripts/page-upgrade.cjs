#!/usr/bin/env node
'use strict';

/**
 * Safely upgrade one or more delivered pages in pages/ to the current catalog release hash,
 * and automatically run `npm run check` on each upgraded page (rolling back on any check failure).
 *
 * Usage:
 *   npm run page:upgrade -- pages/xtool-store-pc.html [--dry-run]
 */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const catalogPath = path.join(ROOT, 'fs-components/component-specs/library/catalog.json');

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const files = args.filter((a) => !a.startsWith('--'));

  if (!files.length) {
    console.error('Usage: npm run page:upgrade -- pages/<target-page>.html [--dry-run]');
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const targetVersion = catalog.version;
  if (!/^[a-f0-9]{64}$/.test(targetVersion)) {
    throw new Error('Invalid current catalog version: ' + targetVersion);
  }

  const summary = [];
  for (const rel of files) {
    const file = path.resolve(ROOT, rel);
    if (!fs.existsSync(file)) {
      throw new Error('Page not found: ' + rel);
    }
    const original = fs.readFileSync(file, 'utf8');
    const match = /data-fs-library="([a-f0-9]{64})"/.exec(original);
    if (!match) {
      throw new Error('Page has no data-fs-library version attribute: ' + rel);
    }
    const oldVersion = match[1];
    if (oldVersion === targetVersion) {
      summary.push({ page: rel, status: 'already-current', version: targetVersion.slice(0, 12) });
      continue;
    }

    const updated = original.split(oldVersion).join(targetVersion);
    if (dryRun) {
      summary.push({
        page: rel,
        status: 'dry-run-ready',
        from: oldVersion.slice(0, 12),
        to: targetVersion.slice(0, 12),
      });
      continue;
    }

    fs.writeFileSync(file, updated, 'utf8');
    const check = spawnSync(process.execPath, [path.join(ROOT, 'scripts/run-design-check.cjs'), rel], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    if (check.status !== 0) {
      fs.writeFileSync(file, original, 'utf8');
      console.error(`✗ Upgrade check failed for ${rel}; rolled back to ${oldVersion.slice(0, 12)}.`);
      console.error(check.stdout || check.stderr);
      process.exit(1);
    }
    summary.push({
      page: rel,
      status: 'upgraded-and-verified',
      from: oldVersion.slice(0, 12),
      to: targetVersion.slice(0, 12),
    });
  }

  console.log(JSON.stringify({ currentRelease: targetVersion.slice(0, 12), pages: summary }, null, 2));
}

main();
