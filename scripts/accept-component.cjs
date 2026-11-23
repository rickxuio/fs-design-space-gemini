#!/usr/bin/env node
'use strict';

/**
 * One-click cascading component engineering acceptance + sync.
 *
 * Usage:
 *   npm run component:accept -- navigation
 *   npm run component:accept -- --component tag
 *   npm run component:accept -- --stale-only
 */

const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DS_ROOT = path.join(ROOT, 'design-system');
const quality = require(path.join(DS_ROOT, 'scripts/component-quality.js'));

function runNode(scriptRel, args, cwd) {
  const res = spawnSync(process.execPath, [scriptRel, ...args], {
    cwd,
    stdio: 'inherit',
  });
  if (res.status !== 0) {
    throw new Error(`Command failed (${res.status}): node ${scriptRel} ${args.join(' ')}`);
  }
}

function getStaleComponents() {
  const report = quality.buildQualityReport(DS_ROOT);
  return report.components
    .filter((c) => c.ai?.acceptance?.status !== 'current')
    .map((c) => ({ id: c.id, status: c.ai?.acceptance?.status || 'unknown' }));
}

function main() {
  const args = process.argv.slice(2);
  let target = null;
  let staleOnly = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--component') target = args[++i];
    else if (args[i] === '--stale-only') staleOnly = true;
    else if (!args[i].startsWith('-')) target = args[i];
  }

  if (target) {
    target = target.replace(/^library-/, '');
    console.log(`[1/3] Running engineering acceptance for primary component: ${target}`);
    runNode('scripts/record-component-acceptance.js', ['--component', target, '--acceptance-only'], DS_ROOT);
  } else if (!staleOnly) {
    console.log('[1/3] No primary component specified; scanning all stale components...');
  }

  const stale = getStaleComponents().filter((c) => c.id !== target);
  if (stale.length) {
    console.log(`[2/3] Detected ${stale.length} cascading stale component(s): ${stale.map((s) => s.id).join(', ')}`);
    for (const item of stale) {
      runNode('scripts/record-component-acceptance.js', ['--component', item.id, '--acceptance-only'], DS_ROOT);
    }
  } else {
    console.log('[2/3] No cascading stale components detected.');
  }

  console.log('[3/3] Synchronizing component library (npm run component:sync)...');
  runNode('scripts/local-component-maintenance.cjs', [], ROOT);

  const remaining = getStaleComponents();
  if (remaining.length) {
    throw new Error('Remaining non-current components after sync: ' + remaining.map((r) => `${r.id}(${r.status})`).join(', '));
  }
  console.log('✓ All 30 components accepted and synchronized cleanly.');
}

try {
  main();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
