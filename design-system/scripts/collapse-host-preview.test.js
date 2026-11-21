'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{JSDOM}=require('jsdom');
function setup(t){const d=new JSDOM(fs.readFileSync('components/variants/collapse.html','utf8'),{runScripts:'outside-only'});t.after(()=>d.window.close());const js=fs.readFileSync('components/collapse-host-preview.js','utf8');d.window.eval(js);return {d,js,items:[...d.window.document.querySelectorAll('[data-collapse-host-preview] .ds-collapse__item')]};}
function controls(item){return {edit:item.querySelector('button[data-collapse-edit]'),cancel:item.querySelector('[data-collapse-cancel]'),input:item.querySelector('input'),panel:item.querySelector('.ds-collapse__edit-panel')};}
test('Edit calls full TextButton anatomy and leaves atom styles out of the host',t=>{
 const {d,items}=setup(t),doc=d.window.document;
 assert.ok(doc.querySelector('link[href="../text-button-current.css"]'));
 for(const item of items){const {edit}=controls(item);assert.equal(edit.type,'button');assert.ok(!edit.hasAttribute('href'));assert.ok(!edit.hasAttribute('style'));assert.ok(!edit.classList.contains('ds-collapse__edit'));
 for(const name of ['ds-text-btn','ds-text-btn--inline','ds-text-btn--black','ds-text-btn--l','ds-text-btn--icon-start'])assert.ok(edit.classList.contains(name));
 assert.deepEqual([...edit.children].map(n=>n.className),['ds-text-btn__icon','ds-text-btn__text']);assert.ok(edit.firstElementChild.src.endsWith('/icon-edit.svg'));assert.equal(edit.lastElementChild.textContent,'Edit');
 edit.lastElementChild.click();assert.equal(controls(item).panel.hidden,false);controls(item).cancel.click();edit.firstElementChild.click();assert.equal(controls(item).panel.hidden,false);controls(item).cancel.click();
 }
 const css=fs.readFileSync('components/collapse-host-preview.css','utf8');assert.ok(!/ds-text-btn|ds-collapse__edit\s*[:{]/.test(css));
 const c=JSON.parse(fs.readFileSync('components/contracts/collapse.json'));const dep=c.relations.componentDependencies.find(x=>x.component==='TextButton');assert.deepEqual(dep.appliesTo,['inline-edit']);assert.deepEqual(dep.requiredSizes,[{variant:'inline-black',size:'l'}]);assert.ok(c.integration.styles.includes('components/text-button-current.css'));assert.ok(c.aiContract.supported.includes('inline-edit'));
});
test('Edit opens its paired panel and Cancel restores input draft and focus',t=>{const {d,items}=setup(t),p=controls(items[0]),value=p.input.value;assert.equal(p.edit.getAttribute('aria-controls'),p.panel.id);assert.ok(p.panel.hidden);p.edit.click();assert.equal(p.edit.getAttribute('aria-expanded'),'true');assert.equal(d.window.document.activeElement,p.input);p.input.value='changed';p.cancel.click();assert.equal(p.input.value,value);assert.ok(p.panel.hidden);assert.equal(p.edit.getAttribute('aria-expanded'),'false');assert.equal(d.window.document.activeElement,p.edit);});
test('real Input state owner follows host focus and draft rollback',t=>{
 const {d,items}=setup(t),p=controls(items[0]),field=p.input.closest('[data-input-current]'),initial=p.input.value;
 d.window.eval(fs.readFileSync('components/input-current.js','utf8'));d.window.document.dispatchEvent(new d.window.Event('DOMContentLoaded'));
 assert.equal(field.dataset.inputState,'filled');p.edit.click();assert.equal(field.dataset.inputState,'inputting');
 p.input.value='';p.input.dispatchEvent(new d.window.Event('input',{bubbles:true}));assert.equal(field.dataset.inputState,'activated');
 p.cancel.click();assert.equal(p.input.value,initial);assert.equal(field.dataset.inputState,'filled');assert.equal(d.window.document.activeElement,p.edit);
 const c=JSON.parse(fs.readFileSync('components/contracts/collapse.json'));assert.equal(c.relations.componentDependencies.find(x=>x.component==='Input').sourceEvidence.originalHostMapping,'finite-instance-and-saved-atom-ancestry-confirmed');
});
test('malformed identities, duplicate panels and disabled fieldsets cannot activate Edit',t=>{
 const {d,items}=setup(t),p=controls(items[0]),id=p.panel.id;
 p.edit.setAttribute('aria-controls','wrong');p.edit.click();assert.ok(p.panel.hidden);
 p.edit.setAttribute('aria-controls',id);const duplicate=d.window.document.createElement('div');duplicate.id=id;d.window.document.body.append(duplicate);p.edit.click();assert.ok(p.panel.hidden);duplicate.remove();
 const fieldset=d.window.document.createElement('fieldset');fieldset.disabled=true;items[0].before(fieldset);fieldset.append(items[0]);p.edit.dispatchEvent(new d.window.MouseEvent('click',{bubbles:true}));assert.ok(p.panel.hidden);fieldset.disabled=false;p.edit.click();assert.equal(p.panel.hidden,false);
});
test('inline Cancel calls gray-outline XL atom; Save source Default does not enable unconfirmed save',t=>{
 const {items}=setup(t),c=JSON.parse(fs.readFileSync('components/contracts/collapse.json'));
 const dependency=c.relations.componentDependencies.find(x=>x.component==='Button'&&x.appliesTo.includes('inline-edit'));
 assert.deepEqual(dependency.requiredSizes,[{variant:'outline-gray',size:'xl'},{variant:'filled-black',size:'xl'}]);
 for(const item of items){const cancel=controls(item).cancel;assert.ok(cancel.classList.contains('ds-btn--outline-gray'));assert.ok(cancel.classList.contains('ds-btn--xl'));assert.ok(!cancel.classList.contains('ds-btn--outline-black'));assert.equal(cancel.children.length,1);assert.equal(cancel.firstElementChild.className,'ds-btn__text');assert.equal(cancel.hasAttribute('style'),false);assert.equal(item.querySelector('.ds-btn--filled-black').disabled,true);}
});
test('Escape and switching peers roll back draft without mutating another row',t=>{const {d,items}=setup(t),a=controls(items[0]),b=controls(items[1]),initial=a.input.value;a.edit.click();a.input.value='draft';b.edit.click();assert.ok(a.panel.hidden);assert.equal(a.input.value,initial);assert.equal(b.panel.hidden,false);b.input.value='other';b.input.dispatchEvent(new d.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.ok(b.panel.hidden);assert.equal(b.input.value,b.input.defaultValue);});
test('unconfirmed Save stays native disabled and repeat loading does not double toggle',t=>{const {d,js,items}=setup(t),p=controls(items[0]);d.window.eval(js);p.edit.click();assert.equal(p.panel.hidden,false);const save=items[0].querySelector('.ds-btn--filled-black');assert.equal(save.disabled,true);save.click();assert.equal(p.panel.hidden,false);p.edit.disabled=true;p.edit.click();assert.equal(p.panel.hidden,false);});
test('order arrow owns a unique body and keeps unrelated row actions independent',t=>{const {d}=setup(t),rows=[...d.window.document.querySelectorAll('[data-collapse-order-preview]')];assert.equal(rows.length,2);const ids=new Set();for(const root of rows){const control=root.querySelector('button.ds-collapse__order-toggle'),body=root.querySelector('.ds-collapse__body');assert.equal(control.getAttribute('aria-controls'),body.id);assert.ok(!ids.has(body.id));ids.add(body.id);assert.ok(body.hidden);control.click();assert.equal(control.getAttribute('aria-expanded'),'true');assert.equal(body.hidden,false);assert.equal(body.getAttribute('aria-hidden'),'false');root.querySelector('.ds-collapse__actions button').click();root.querySelector('.ds-collapse__row-info').click();root.querySelector('.ds-collapse__cell').click();assert.equal(body.hidden,false);control.click();assert.ok(body.hidden);control.disabled=true;control.dispatchEvent(new d.window.MouseEvent('click',{bubbles:true}));assert.ok(body.hidden);}});
test('IME Escape and consumed Escape preserve the Input draft; ordinary Escape still cancels',t=>{
 const {d,items}=setup(t),p=controls(items[0]),w=d.window,initial=p.input.value;
 w.eval(fs.readFileSync('components/input-current.js','utf8'));w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 p.edit.click();p.input.value='draft';p.input.dispatchEvent(new w.Event('input',{bubbles:true}));
 const composing=new w.KeyboardEvent('keydown',{key:'Escape',isComposing:true,bubbles:true,cancelable:true});p.input.dispatchEvent(composing);
 assert.equal(p.panel.hidden,false);assert.equal(p.input.value,'draft');assert.equal(composing.defaultPrevented,false);
 p.input.dispatchEvent(new w.Event('compositionstart',{bubbles:true}));p.input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert.equal(p.panel.hidden,false);assert.equal(p.input.value,'draft');
 p.input.dispatchEvent(new w.Event('compositionend',{bubbles:true}));
 p.input.addEventListener('keydown',e=>e.preventDefault(),{once:true});p.input.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert.equal(p.panel.hidden,false);
 const escape=new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});p.input.dispatchEvent(escape);assert.equal(p.panel.hidden,true);assert.equal(p.input.value,initial);assert.equal(escape.defaultPrevented,true);assert.equal(w.document.activeElement,p.edit);
});
