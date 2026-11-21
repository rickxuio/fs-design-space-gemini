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
test('Card host hover reaches atom from title, survives internal movement and leaves cleanly', () => {
  const d = new JSDOM(card(true) + card(false), {runScripts:'outside-only'});
  try {
    d.window.eval(runtime); d.window.eval(runtime);
    const roots = d.window.document.querySelectorAll('.ds-card'), root = roots[0], a = root.querySelector('a');
    const fire = (node, type, relatedTarget = null) => node.dispatchEvent(new d.window.MouseEvent(type, {bubbles:true, relatedTarget}));
    fire(root.querySelector('p'), 'mouseover'); assert.ok(a.classList.contains('ds-text-btn--hover'));
    fire(root.querySelector('p'), 'mouseout', a); assert.ok(a.classList.contains('ds-text-btn--hover'));
    fire(a, 'mouseout'); assert.equal(a.classList.contains('ds-text-btn--hover'), false);
    fire(roots[1], 'mouseover'); assert.equal(roots[1].querySelector('a').classList.contains('ds-text-btn--hover'), false);
    assert.equal(root.hasAttribute('style'), false); assert.equal(a.getAttribute('href'), '#');
  } finally {d.window.close();}
});
test('Card preserves atom preexisting state, respects disabled child and supports dynamic cards', () => {
  const d = new JSDOM(card(true, 'ds-text-btn--hover') + card(true), {runScripts:'outside-only'});
  try {
    d.window.eval(runtime);
    const roots = d.window.document.querySelectorAll('.ds-card'); roots[1].querySelector('a').setAttribute('aria-disabled','true');
    for (const root of roots) {
      root.dispatchEvent(new d.window.MouseEvent('mouseover',{bubbles:true}));
      root.dispatchEvent(new d.window.MouseEvent('mouseout',{bubbles:true}));
    }
    assert.ok(roots[0].querySelector('a').classList.contains('ds-text-btn--hover'));
    assert.equal(roots[1].querySelector('a').classList.contains('ds-text-btn--hover'),false);
    d.window.document.body.insertAdjacentHTML('beforeend',card(true));
    const dynamic = d.window.document.body.lastElementChild;
    dynamic.dispatchEvent(new d.window.MouseEvent('mouseover',{bubbles:true}));
    assert.ok(dynamic.querySelector('a').classList.contains('ds-text-btn--hover'));
  } finally {d.window.close();}
});
test('Card hover does not activate a TextButton under an unavailable ancestor',()=>{
 const d=new JSDOM('<section aria-disabled="true">'+card(true)+'</section>'+card(true),{runScripts:'outside-only'});try{
  d.window.eval(runtime);const [blocked,other]=d.window.document.querySelectorAll('.ds-card'),child=blocked.querySelector('a');
  blocked.dispatchEvent(new d.window.MouseEvent('mouseover',{bubbles:true}));assert.equal(child.classList.contains('ds-text-btn--hover'),false);
  other.dispatchEvent(new d.window.MouseEvent('mouseover',{bubbles:true}));assert.equal(other.querySelector('a').classList.contains('ds-text-btn--hover'),true);
  blocked.parentElement.removeAttribute('aria-disabled');blocked.dispatchEvent(new d.window.MouseEvent('mouseover',{bubbles:true}));assert.equal(child.classList.contains('ds-text-btn--hover'),true);
 }finally{d.window.close();}
});
