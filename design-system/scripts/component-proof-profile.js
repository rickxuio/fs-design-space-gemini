'use strict';

// Finite component-only engineering suites. Page workflows are outside this library.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const POLICY = 'component-engineering-v2';
const ROOT = path.resolve(__dirname, '..');
const SUITES = Object.freeze({
  'anchor-nav': ['local-canonical-component'],
  'option-selector': ['local-canonical-component','list-option-source'],
  'badge': ['local-canonical-component'],
  'breadcrumb': ['local-canonical-component'],
  'checkbox': ['local-canonical-component'],
  'dialog': ['local-canonical-component','remaining-component-capabilities'],
  'dropdown': ['local-canonical-component','remaining-component-capabilities'],
  'comment': ['local-canonical-component','remaining-component-capabilities'],
  'form': ['local-canonical-component','form-source-fields'],
  'icon-button': ['local-canonical-component'],
  'input-number': ['local-canonical-component'],
  'input': ['local-canonical-component'],
  'list': ['local-canonical-component','capability-completion'],
  'menu-navigation': ['local-canonical-component','capability-completion', 'five-variant-current'],
  'radio': ['local-canonical-component'],
  'rate': ['local-canonical-component','rate-summary'],
  'select': ['local-canonical-component'],
  'stepper': ['local-canonical-component','stepper-solution-source'],
  'tab': ['local-canonical-component'],
  'table': ['local-canonical-component'],
  'tag': ['local-canonical-component'],
  'video-button': ['local-canonical-component'],

  button: ['button-leading-icon', 'cart-reference', 'button-processing-opacity', 'shape-button-source-inventory', 'button-state-semantics', 'button-host-dependencies','component-quality-decision'],
  navigation: ['navigation-reference', 'navigation-header-quality', 'navigation-footer-quality', 'five-variant-current'],
  banner: ['banner-reference','capability-completion', 'five-variant-current'],
  card: ['card-reference', 'card-current','capability-completion', 'five-variant-current'],
  'text-button': ['text-button-source-inventory', 'text-button-arrow-paint', 'five-variant-current'],
  carousel: ['carousel-outline-control', 'carousel-reference', 'carousel-external', 'five-variant-current'],
  'icon-card': ['icon-card-reference','capability-completion'],
  collapse: ['collapse','collapse-reference','collapse-host-preview','collapse-faq-source-preview','collapse-faq-runtime','list-option-source', 'five-variant-current'],
});
// The legacy disclosure runtime is still directly exercised by collapse.test.
// It is not in the current call pack, so retain that real suite input explicitly.
const SUITE_INPUTS = Object.freeze({collapse:['components/collapse.js']});
function testsFor(id) {
  if (!Object.hasOwn(SUITES, id)) throw Error('Unregistered engineering profile: ' + id);
  return [...SUITES[id].map(n => 'scripts/' + n + '.test.js'), 'scripts/component-publication.test.js'];
}

// Conservatively follow every literal local import, including inactive branches.
// The shared compiler and Python inspector stay whole-file dependencies. No
// function-body hashing or claims of fine-grained semantic change detection.
function localToolClosure(root, entries) {
  const seen = new Set(), pending = [...entries];
  while (pending.length) {
    const name = pending.pop();
    if (seen.has(name)) continue;
    const file = path.resolve(root, name);
    if (!file.startsWith(path.resolve(root) + path.sep) || !fs.statSync(file).isFile()) throw Error('Proof dependency missing/outside workspace: ' + name);
    seen.add(name);
    if (!/\.(?:js|cjs|py)$/.test(name)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (/\.py$/.test(name)) {
      for (const m of source.matchAll(/^\s*(?:from\s+([A-Za-z_][\w]*)\s+import|import\s+([A-Za-z_][\w]*))/gm)) {
        const child = path.join(path.dirname(file), (m[1] || m[2]) + '.py');
        if (fs.existsSync(child)) pending.push(path.relative(root, child).split(path.sep).join('/'));
      }
      continue;
    }
    for (const m of source.matchAll(/\brequire\s*\(([^)]*)\)/g)) {
      const literal = m[1].trim().match(/^(['"])([^'"]+)\1$/);
      if (!literal) throw Error('Dynamic proof import requires explicit dependency support: ' + name);
      if (!literal[2].startsWith('.')) continue;
      const base = path.resolve(path.dirname(file), literal[2]);
      const child = [base, base + '.js', base + '.cjs', base + '.json', path.join(base, 'index.js')].find(f => fs.existsSync(f) && fs.statSync(f).isFile());
      if (!child) throw Error('Unresolved proof import: ' + name + ' -> ' + literal[2]);
      pending.push(path.relative(root, child).split(path.sep).join('/'));
    }
  }
  return [...seen].sort();
}
function profileFor(id, root = ROOT) {
  const tests = testsFor(id);
  const tools = localToolClosure(root, [
    ...tests, ...(SUITE_INPUTS[id]||[]), 'scripts/component-proof-profile.js', 'scripts/component-acceptance-tools.js',
    'scripts/record-component-acceptance.js', 'scripts/component-quality.js',
    'scripts/compile-component-reference.js', 'scripts/component-reference-dom.py',
    'package-lock.json',
  ]);
  return { policy: POLICY, componentId: id, tests, tools };
}
function profileIssues(id, proof, root = ROOT) {
  if (!proof.dependencyPolicy) return proof.componentId || proof.execution ? ['新组件验收记录缺少依赖策略；不能删除策略标识退回旧校验'] : [];
  if (proof.dependencyPolicy !== POLICY || !Object.hasOwn(SUITES, id)) return ['未识别的组件验收依赖策略'];
  const profile = profileFor(id, root);
  const issues = [];
  if (proof.componentId !== id) issues.push('验收记录组件身份不符');
  if (JSON.stringify(proof.tests) !== JSON.stringify(profile.tests)) issues.push('验收测试集合与当前组件策略不符；不能仅改策略标识迁移旧记录');
  for (const file of profile.tools) if (!Object.hasOwn(proof.toolFingerprints || {}, file)) issues.push('缺少实际工程依赖：' + file);
  try {
    const log = path.resolve(root, proof.log || '');
    if (!log.startsWith(path.resolve(root) + path.sep)) throw Error('log outside project');
    const bytes = fs.readFileSync(log);
    if (proof.execution?.exitCode !== 0 || proof.execution?.logSha256 !== crypto.createHash('sha256').update(bytes).digest('hex') ||
        !/^# (?:fail|失败)\s+0\s*$/m.test(bytes.toString()) || !/^# (?:tests|测试)\s+[1-9]\d*\s*$/m.test(bytes.toString()) ||
        !/^# (?:pass|通过)\s+[1-9]\d*\s*$/m.test(bytes.toString()) || !/^# cancelled\s+0\s*$/m.test(bytes.toString())) throw Error('missing stable passing run');
  } catch { issues.push('缺少本策略实际工程执行记录、日志已改变或测试未通过'); }
  return issues;
}
module.exports = { POLICY, SUITES, testsFor, localToolClosure, profileFor, profileIssues };
