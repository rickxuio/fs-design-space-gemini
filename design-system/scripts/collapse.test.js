'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Minimal DOM double exercises the real event delegate without a browser or
// modifying pages. Native button keyboard activation dispatches the same click.
function fixture(mode, variant = 'split', initiallyOpen = []) {
  const listeners = {};
  const classes = initial => {
    const values = new Set(initial);
    return { contains: value => values.has(value), add: value => values.add(value), remove: value => values.delete(value),
      toggle(value, force) { const next = force === undefined ? !values.has(value) : force; next ? values.add(value) : values.delete(value); return next; } };
  };
  const attrs = initial => ({ getAttribute: key => initial[key] ?? null, setAttribute: (key, value) => { initial[key] = value; } });
  const group = { classList: classes(['ds-collapse', `ds-collapse--${variant}`]), ...attrs({ 'data-collapse-mode': mode }) };
  const items = [0, 1].map(index => {
    const open = initiallyOpen.includes(index);
    const icon = attrs({ src: `icons/icon-collapse-${open ? 'minus' : 'plus'}.svg` });
    const body = { ...attrs({}), hidden: false };
    const header = { ...attrs({ 'aria-expanded': String(open) }), closest(selector) {
      if (selector === '.ds-collapse') return group;
      if (selector === '.ds-collapse__item') return item;
      if (selector === '.ds-collapse__header, .ds-collapse__row') return header;
      return null;
    } };
    const item = { classList: classes(open ? ['ds-collapse__item--open'] : []), body, icon, header,
      querySelector(selector) { return selector === '.ds-collapse__title > img' ? icon : selector.startsWith('.ds-collapse__header') ? header : selector === '.ds-collapse__body' ? body : null; } };
    return item;
  });
  group.querySelectorAll = selector => selector === '.ds-collapse__item--open' ? items.filter(item => item.classList.contains('ds-collapse__item--open')) : items;
  group.querySelector = () => items.find(item => item.classList.contains('ds-collapse__item--open')) || null;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../components/collapse.js'), 'utf8'), {
    document: { addEventListener: (type, handler) => { listeners[type] = handler; }, querySelectorAll: () => [group] },
  });
  return { items, click: index => listeners.click({ target: items[index].header, detail: 0 }) };
}

test('legacy default single-open and explicit single keep one item open', () => {
  for (const mode of [undefined, 'single', 'invalid']) {
    const { items, click } = fixture(mode, 'split', [0, 1]);
    assert.equal(items[1].classList.contains('ds-collapse__item--open'), false);
    click(1);
    assert.equal(items[0].body.hidden, true);
    assert.equal(items[0].header.getAttribute('aria-expanded'), 'false');
    assert.match(items[0].icon.getAttribute('src'), /plus/);
    assert.equal(items[1].body.hidden, false);
  }
});

test('split multiple preserves initial states and toggles each item independently', () => {
  const { items, click } = fixture('multiple', 'split', [0, 1]);
  assert.ok(items.every(item => !item.body.hidden));
  click(0);
  assert.equal(items[0].body.hidden, true);
  assert.equal(items[1].body.hidden, false);
  click(0);
  assert.ok(items.every(item => !item.body.hidden && item.header.getAttribute('aria-expanded') === 'true' && item.body.getAttribute('aria-hidden') === 'false'));
  assert.ok(items.every(item => /minus/.test(item.icon.getAttribute('src'))));
});

test('multiple cannot change other variants default single-open initialization', () => {
  for (const variant of ['feature', 'inline-edit', 'data-preview']) {
    const { items } = fixture('multiple', variant, [0, 1]);
    assert.equal(items[1].body.hidden, true);
  }
});

