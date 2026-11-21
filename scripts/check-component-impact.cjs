#!/usr/bin/env node
'use strict';

/**
 * Impact-scoped incremental component verification (P3 #8):
 *   npm run component:check:impact -- --component=button
 *   npm run component:check:impact -- --changed
 *
 * Uses scripts/local-component-maintenance.cjs impact() to compute affected
 * components (target + transitive parents) and runs only matching test suites
 * plus fast component:check, cutting single-component check time from ~3m to ~5-15s.
 */

const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { impact } = require('./local-component-maintenance.cjs');

const ROOT = path.resolve(__dirname, '..');

const COMPONENT_TEST_MAP = {
  button: ['scripts/button-prototype-sync.test.cjs'],
  'text-button': ['scripts/text-button-prototype-sync.test.cjs'],
  'icon-button': ['scripts/icon-button-prototype-sync.test.cjs'],
  tab: ['scripts/tab-collapse-prototype.test.cjs'],
  collapse: ['scripts/tab-collapse-prototype.test.cjs'],
  card: ['scripts/card-carousel-prototype.test.cjs'],
  carousel: ['scripts/card-carousel-prototype.test.cjs', 'scripts/external-carousel.test.cjs'],
  banner: ['scripts/banner-navigation-prototype.test.cjs'],
  navigation: ['scripts/banner-navigation-prototype.test.cjs'],
  'anchor-nav': ['scripts/banner-navigation-prototype.test.cjs'],
  'menu-navigation': ['scripts/banner-navigation-prototype.test.cjs'],
  breadcrumb: ['scripts/banner-navigation-prototype.test.cjs'],
  form: ['scripts/form-stepper-list-prototype.test.cjs'],
  stepper: ['scripts/form-stepper-list-prototype.test.cjs'],
  list: ['scripts/form-stepper-list-prototype.test.cjs'],
  input: ['scripts/five-variant-current.test.cjs'],
  select: ['scripts/five-variant-current.test.cjs'],
  checkbox: ['scripts/five-variant-current.test.cjs'],
  radio: ['scripts/five-variant-current.test.cjs'],
  dropdown: ['scripts/five-variant-current.test.cjs'],
  tag: ['scripts/remaining-prototypes.test.cjs'],
  badge: ['scripts/remaining-prototypes.test.cjs'],
  dialog: ['scripts/remaining-prototypes.test.cjs'],
  rate: ['scripts/remaining-prototypes.test.cjs'],
  table: ['scripts/remaining-prototypes.test.cjs'],
  comment: ['scripts/remaining-prototypes.test.cjs'],
  'icon-card': ['scripts/remaining-prototypes.test.cjs'],
  'input-number': ['scripts/remaining-prototypes.test.cjs'],
  'option-selector': ['scripts/remaining-prototypes.test.cjs'],
  'video-button': ['scripts/remaining-prototypes.test.cjs'],
};

function detectChangedComponents() {
  const res = spawnSync('git', ['status', '--porcelain'], { cwd: ROOT, encoding: 'utf8' });
  if (res.status !== 0) return [];
  const found = new Set();
  for (const line of res.stdout.split('\n')) {
    const file = line.slice(3).trim();
    const m = /^design-system\/components\/(?:contracts|variants)\/([a-z0-9-]+)\.(?:json|html)$/.exec(file)
      || /^design-system\/components\/([a-z0-9-]+?)(?:-current|-external)?\.(?:css|js)$/.exec(file);
    if (m && COMPONENT_TEST_MAP[m[1]]) found.add(m[1]);
  }
  return [...found];
}

function expandImpact(seeds) {
  const visited = new Set();
  const queue = [...seeds];
  const graph = {};
  while (queue.length) {
    const cur = queue.shift().replace(/^library-/, '');
    if (visited.has(cur)) continue;
    visited.add(cur);
    try {
      const info = impact(cur);
      const parents = (info.parents || []).map((p) => p.replace(/^library-/, ''));
      graph[cur] = parents;
      for (const p of parents) {
        if (!visited.has(p)) queue.push(p);
      }
    } catch (_) {
      graph[cur] = [];
    }
  }
  return { affected: [...visited], graph };
}

function main() {
  const args = process.argv.slice(2);
  const compArg = args.find((a) => a.startsWith('--component='));
  const useChanged = args.includes('--changed');

  let seeds = [];
  if (compArg) {
    seeds = compArg.split('=')[1].split(',').map((s) => s.trim()).filter(Boolean);
  } else if (useChanged) {
    seeds = detectChangedComponents();
  }

  if (!seeds.length) {
    console.log(JSON.stringify({ status: 'no-targets', hint: 'Pass --component=<id> or --changed' }, null, 2));
    return;
  }

  const startedAt = Date.now();
  const { affected, graph } = expandImpact(seeds);
  const testFiles = new Set(['scripts/local-variant-integration.test.cjs']);
  for (const comp of affected) {
    for (const tf of COMPONENT_TEST_MAP[comp] || []) {
      if (fs.existsSync(path.join(ROOT, tf))) testFiles.add(tf);
    }
  }

  const tests = [...testFiles];
  console.log(`Impact scope for [${seeds.join(', ')}]: ${affected.length} component(s) -> [${affected.join(', ')}]`);
  console.log(`Running ${tests.length} targeted test file(s)...`);

  const testRes = spawnSync(process.execPath, ['--test', ...tests], { cwd: ROOT, stdio: 'inherit' });
  if (testRes.status !== 0) process.exit(testRes.status || 1);

  const checkRes = spawnSync(process.execPath, ['scripts/local-component-library.cjs', '--check'], { cwd: ROOT, stdio: 'inherit' });
  if (checkRes.status !== 0) process.exit(checkRes.status || 1);

  console.log(
    JSON.stringify(
      {
        seeds,
        affected,
        graph,
        testsRun: tests,
        durationMs: Date.now() - startedAt,
        passed: true,
      },
      null,
      2
    )
  );
}

main();
