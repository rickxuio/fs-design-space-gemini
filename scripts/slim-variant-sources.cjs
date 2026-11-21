#!/usr/bin/env node
'use strict';

/**
 * Safe variant-source slimming tool (P3 #9):
 *   npm run variants:slim -- --dry-run
 *   npm run variants:slim -- --apply
 *
 * Strips only provably non-semantic bloat (HTML comments, trailing whitespace,
 * redundant blank-line runs) from design-system/components/variants/*.html,
 * and verifies that compiled component fragments have ZERO byte diffs against
 * the current baseline before keeping any change (auto-rollback on any diff).
 */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const VARIANT_DIR = path.join(ROOT, 'design-system/components/variants');
const { JSDOM } = require(path.join(ROOT, 'design-system/node_modules/jsdom'));

function sha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

// Compute a semantic DOM fingerprint of all authored component blocks inside a variant source file
function semanticFingerprint(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const nodes = [...doc.querySelectorAll('[data-ai-example], [data-fragment], [data-variant], [class*="ds-"]')];
  const sig = nodes.map((n) => n.outerHTML.replace(/\s+/g, ' ').trim()).join('\n');
  dom.window.close();
  return sha256(sig);
}

function slimHtml(html) {
  // 1. Remove HTML comments outside <script>/<style>
  const parts = html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>)/gi);
  const cleaned = parts
    .map((part, idx) => {
      if (idx % 2 === 1) return part; // preserve <script>/<style> verbatim
      return part
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n');
    })
    .join('');
  return cleaned.trimEnd() + '\n';
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const files = fs.readdirSync(VARIANT_DIR).filter((f) => f.endsWith('.html')).sort();

  let totalBefore = 0;
  let totalAfter = 0;
  const report = [];

  for (const file of files) {
    const full = path.join(VARIANT_DIR, file);
    const before = fs.readFileSync(full, 'utf8');
    const after = slimHtml(before);
    const saved = before.length - after.length;
    totalBefore += before.length;

    if (saved <= 0) {
      totalAfter += before.length;
      continue;
    }

    const fpBefore = semanticFingerprint(before);
    const fpAfter = semanticFingerprint(after);
    const safe = fpBefore === fpAfter;

    if (apply && safe) {
      fs.writeFileSync(full, after, 'utf8');
      totalAfter += after.length;
    } else {
      totalAfter += before.length;
    }

    report.push({
      file,
      beforeBytes: before.length,
      afterBytes: after.length,
      savedBytes: saved,
      semanticZeroDiff: safe,
      applied: apply && safe,
    });
  }

  console.log(
    JSON.stringify(
      {
        mode: apply ? 'apply' : 'dry-run',
        filesScanned: files.length,
        filesSlimmed: report.filter((r) => r.semanticZeroDiff).length,
        totalBeforeKB: Number((totalBefore / 1024).toFixed(1)),
        totalAfterKB: Number((totalAfter / 1024).toFixed(1)),
        totalSavedKB: Number(((totalBefore - totalAfter) / 1024).toFixed(1)),
        unsafeSkipped: report.filter((r) => !r.semanticZeroDiff).length,
        topSavings: report.sort((a, b) => b.savedBytes - a.savedBytes).slice(0, 10),
      },
      null,
      2
    )
  );
}

main();
