'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path');
const {JSDOM} = require('jsdom');
const runtime = fs.readFileSync(path.join(__dirname, '../components/card-current.js'), 'utf8');
test('product Card reuses the Preview single-choice coordinator without changing standalone Tag',()=>{
 const tag=(pressed)=>'<button data-tag-product="current" aria-pressed="'+pressed+'">Source compatibility</button>',d=new JSDOM('<div data-card-current="embedded-full"><div class="ds-card__compat-tags">'+tag(false)+tag(true)+'</div></div><div class="ds-card__compat-tags">'+tag(false)+tag(true)+'</div>',{runScripts:'outside-only'});
 try{d.window.eval(runtime);d.window.eval(runtime);const groups=d.window.document.querySelectorAll('.ds-card__compat-tags'),first=groups[0].firstElementChild;first.setAttribute('aria-pressed','true');first.dispatchEvent(new d.window.CustomEvent('ds:tag-change',{bubbles:true,detail:{checked:true}}));assert.deepEqual([...groups[0].children].map(n=>n.getAttribute('aria-pressed')),['true','false']);assert.deepEqual([...groups[1].children].map(n=>n.getAttribute('aria-pressed')),['false','true']);}finally{d.window.close();}
});
function card(marker, extra = '') {
  return `<div class="ds-card" ${marker ? 'data-card-current="vertical-single-event"' : ''}><p>Title</p><div class="ds-card__link"><a class="ds-text-btn ds-text-btn--inline ${extra}" href="#"><span>Learn more</span></a></div></div>`;
}
test('Card host hover does not force TextButton underline; TextButton owns its own :hover state', () => {
  const d = new JSDOM(card(true) + card(false), {runScripts:'outside-only'});
  try {
    d.window.eval(runtime); d.window.eval(runtime);
    const roots = d.window.document.querySelectorAll('.ds-card'), root = roots[0], a = root.querySelector('a');
    const fire = (node, type, relatedTarget = null) => node.dispatchEvent(new d.window.MouseEvent(type, {bubbles:true, relatedTarget}));
    fire(root.querySelector('p'), 'mouseover');
    assert.equal(a.classList.contains('ds-text-btn--hover'), false);
    fire(root.querySelector('p'), 'mouseout', a);
    assert.equal(a.classList.contains('ds-text-btn--hover'), false);
    fire(a, 'mouseout');
    assert.equal(a.classList.contains('ds-text-btn--hover'), false);
    assert.equal(root.hasAttribute('style'), false);
    assert.equal(a.getAttribute('href'), '#');
  } finally {d.window.close();}
});
test('Card preserves preexisting TextButton state without mutating it on host mouseover/mouseout', () => {
  const d = new JSDOM(card(true, 'ds-text-btn--hover') + card(true), {runScripts:'outside-only'});
  try {
    d.window.eval(runtime);
    const roots = d.window.document.querySelectorAll('.ds-card');
    for (const root of roots) {
      root.dispatchEvent(new d.window.MouseEvent('mouseover',{bubbles:true}));
      root.dispatchEvent(new d.window.MouseEvent('mouseout',{bubbles:true}));
    }
    assert.ok(roots[0].querySelector('a').classList.contains('ds-text-btn--hover'));
    assert.equal(roots[1].querySelector('a').classList.contains('ds-text-btn--hover'), false);
  } finally {d.window.close();}
});
