#!/usr/bin/env node
'use strict';

/**
 * Safely prune unreferenced library release snapshots and stale quality logs.
 * Usage:
 *   npm run release:prune [-- --dry-run]
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const RELEASES_DIR = path.join(ROOT, 'fs-components/component-specs/library/releases');
const LOGS_DIR = path.join(ROOT, 'design-system/components/quality/logs');
const ACCEPTANCE_FILE = path.join(ROOT, 'design-system/components/quality/acceptance.json');

function collectTextFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'releases', 'assets'].includes(entry.name)) continue;
      collectTextFiles(full, out);
    } else if (/\.(html|json|c?js|mjs|md)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const dryRun = process.argv.includes('--dry-run');
  const scanFiles = [
    ...collectTextFiles(path.join(ROOT, 'pages')),
    ...collectTextFiles(path.join(ROOT, 'maintenance')),
    ...collectTextFiles(path.join(ROOT, 'scripts')),
    ...collectTextFiles(path.join(ROOT, 'design-system/scripts')),
    path.join(ROOT, 'fs-components/component-specs/library/catalog.json'),
    path.join(ROOT, 'fs-components/component-specs/library/selection.json'),
  ].filter((f) => fs.existsSync(f));

  const corpus = scanFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  const releases = fs.existsSync(RELEASES_DIR)
    ? fs.readdirSync(RELEASES_DIR).filter((d) => /^[a-f0-9]{64}$/.test(d)).sort()
    : [];

  const keptReleases = [];
  const prunedReleases = [];
  for (const hash of releases) {
    const short = hash.slice(0, 12);
    if (corpus.includes(hash) || corpus.includes(short)) {
      keptReleases.push(short);
    } else {
      prunedReleases.push(hash);
      if (!dryRun) {
        fs.rmSync(path.join(RELEASES_DIR, hash), { recursive: true, force: true });
      }
    }
  }

  const accText = fs.existsSync(ACCEPTANCE_FILE) ? fs.readFileSync(ACCEPTANCE_FILE, 'utf8') : '';
  const referencedLogs = new Set([...accText.matchAll(/components\/quality\/logs\/([^"]+)/g)].map((m) => m[1]));
  const allLogs = fs.existsSync(LOGS_DIR) ? fs.readdirSync(LOGS_DIR) : [];
  const prunedLogs = [];
  for (const f of allLogs) {
    if (!referencedLogs.has(f)) {
      prunedLogs.push(f);
      if (!dryRun) {
        fs.unlinkSync(path.join(LOGS_DIR, f));
      }
    }
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        keptReleasesCount: keptReleases.length,
        keptReleases,
        prunedReleasesCount: prunedReleases.length,
        prunedReleases: prunedReleases.map((h) => h.slice(0, 12)),
        keptLogsCount: referencedLogs.size,
        prunedLogsCount: prunedLogs.length,
      },
      null,
      2
    )
  );
}

main();
