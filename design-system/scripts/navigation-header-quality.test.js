'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { buildReference } = require('./compile-component-reference');
const ROOT = path.resolve(__dirname, '..');

test('固定Header的工程调用必须包含独立盒模型资源及新鲜的实际HTTP几何证据', () => {
  const pack = buildReference(ROOT, 'navigation');
  assert.ok(pack.runtime.styles.includes('components/navigation-current.css'));
  const receipt = JSON.parse(fs.readFileSync(path.join(ROOT, 'components/sources/navigation/header-http-review-1013.json'), 'utf8'));
  for (const [file, expected] of Object.entries(receipt.runtimeFingerprints)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, file))).digest('hex'), expected, file + ' changed after browser measurement');
  const actual = receipt.after;
  assert.match(actual.url, /^http:\/\/127\.0\.0\.1:\d+\/components\/(?:preview\/header-current|sources\/navigation\/header-http-fixture-1013)\.html(?:#)?$/);
  assert.deepEqual(actual.viewport, { width: 1920, height: 1000 });
  assert.equal(actual.header.height, 100);
  assert.equal(actual.topbar.height, 32);
  assert.equal(actual.main.height, 68);
  assert.equal(actual.main.boxSizing, 'border-box');
  assert.equal(actual.inner.width, 1200);
  assert.equal(actual.inner.height, 68);
  assert.equal(actual.inner.x, 360);
  assert.equal(actual.imagesLoaded, 4);
  assert.equal(receipt.sourceHostDefault.node, '68908:036747');
  assert.equal(receipt.sourceHostDefault.topbarBackground, 'rgb(246, 246, 248)');
  assert.deepEqual(receipt.sourceHostDefault.dividers, [{ width: 1, height: 10 }, { width: 1, height: 12 }]);
  assert.deepEqual(receipt.sourceHostDefault.actions, ['Search', 'Cart', 'Account']);
  assert.deepEqual(actual.link, { fontSize: '14px', lineHeight: '22px', fontWeight: '400', color: 'rgb(25, 25, 26)', textDecoration: 'none' });
  assert.equal(receipt.visualApproval, 'pending');
  assert.ok(receipt.unverified.includes('Footer与完整页面'));
});

 test('PC Web原子有真实主引用及实际Hover标记，不沿用旧静态正文', () => {
  const pack=buildReference(ROOT,'navigation');
  assert.ok(pack.runtime.styles.includes('components/navigation-header-web-atom.css'));
  const source=JSON.parse(fs.readFileSync(path.join(ROOT,'components/sources/navigation/header-web-atom-review-1013.json')));
  assert.equal(source.instanceReference.nativeEditComponentJump,'68908:021288');
  assert.equal(source.source.hover,'68908:021283');
  assert.ok(source.raw.content[0].text.includes('data-type="component-set"'));
  assert.equal(source.hoverMarker.bottomRowsRGBA['(192, 0, 0, 255)'],636);
  const actual=JSON.parse(fs.readFileSync(path.join(ROOT,'components/sources/navigation/header-http-review-1013.json'))).webAtomActual;
  assert.equal(actual.default.markerContent,'none');assert.equal(actual.default.fontWeight,'400');
  assert.equal(actual.hover.hovered,true);assert.equal(actual.hover.fontWeight,'400');
  assert.equal(actual.hover.marker.height,'2px');assert.equal(actual.hover.marker.color,'rgb(192, 0, 0)');
 });

test('user-corrected public atom cannot restore layout or glyph jumps',()=>{const css=fs.readFileSync(path.join(ROOT,'components/navigation-header-web-atom.css'),'utf8').replace(/\/\*[\s\S]*?\*\//g,'');assert.ok(!css.includes('font-weight: var(--font-weight-semibold)'));assert.ok(!css.includes('padding-top:'));assert.ok(css.includes('position: absolute'));assert.ok(css.includes('font-weight: var(--font-weight-regular)'));});
