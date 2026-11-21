'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),L=require('./local-component-library.cjs'),C=require('./check-context.cjs'),{JSDOM}=require('../design-system/node_modules/jsdom');
const ROOT=L.ROOT,ref={reference:'reference-inputs/xtool-donation-fresh-20261114/content.json',objectId:'application'};
test('source Form uses genuine atoms and retained15 fields; no demo consent, iframe or page-painted controls',()=>{
 const use=L.render('library-form','gray',{sourceFields:ref,submitLabel:'Submit'}),d=new JSDOM(use.html).window.document,f=d.querySelector('form');assert.equal(f.querySelectorAll('[data-form-field-name]').length,15);assert.equal(f.querySelectorAll('textarea').length,6);assert.equal(f.querySelectorAll('[data-library-component="library-select"]').length,2);assert.equal(f.querySelectorAll('iframe,.ds-form__consent,[style],input[type=hidden]').length,0);assert.ok(f.querySelector('input[type=email][required]'));assert.equal(f.querySelectorAll('[data-form-required="false"]').length,2);
 for(const node of f.querySelectorAll('[data-library-component="library-select"]')){const expected=C.canonical(node,ROOT,use.version,path.join(ROOT,'pages'),C.createContext());assert.equal(C.normalize(node.outerHTML),expected.html);}
 assert.throws(()=>L.render('library-form','gray',{sourceFields:ref,fieldContent:'<input>'}),/cannot mix/);assert.throws(()=>L.render('library-form','gray',{sourceFields:{...ref,reference:'../private.json'}}),/retained reference/);assert.throws(()=>L.render('library-form','gray',{sourceFields:{...ref,objectId:'missing'}}),/source fields/);
});
test('FAQ has a true callable exact variant, original row anatomy and complete source-copy binding',()=>{
 const u=L.render('library-collapse','faq'),d=new JSDOM(u.html).window.document;assert.equal(d.querySelectorAll('button').length,3);assert.equal(d.querySelectorAll('p[hidden]').length,3);assert.equal(d.querySelector('[data-faq-position="last"]').dataset.faqDivider,'off');assert.ok(u.styles.some(s=>s.endsWith('collapse-faq-source.css')));assert.ok(u.scripts.some(s=>s.endsWith('collapse-current.js')));
});

test('Select placeholder is reusable content binding and Form passes source field copy without inheriting brand examples',()=>{
 for(const name of ['single-basic','search']){
  const base=L.render('library-select',name),d=new JSDOM(base.html).window.document;
  const list=d.querySelector('.ds-select__list');for(const n of list.querySelectorAll('[role="option"]'))n.setAttribute('aria-selected','false');
  const props={options:list.innerHTML,placeholder:'Choose country/region',...(name==='search'?{searchLabel:'Search country/region'}:{})};
  const use=L.render('library-select',name,props),out=new JSDOM(use.html).window.document;
  assert.equal(out.querySelector('.ds-select__value').textContent,'Choose country/region');
  assert.equal(out.querySelector('.ds-select__value').dataset.placeholder,'Choose country/region');
  if(name==='search')assert.equal(out.querySelector('.ds-select__search-input').getAttribute('aria-label'),'Search country/region');
  for(const placeholder of ['', '   ', 3, null])assert.throws(()=>L.render('library-select',name,{placeholder}),/Nonempty string/);
  assert.equal(new JSDOM(L.render('library-select',name).html).window.document.querySelector('.ds-select__value').dataset.placeholder,d.querySelector('.ds-select__value').dataset.placeholder);
 }
 const doc=new JSDOM(L.render('library-form','gray',{sourceFields:ref}).html).window.document;
 assert.equal(doc.querySelector('[data-form-field-name="field10"] .ds-select__value').textContent,'Select');
 assert.equal(doc.querySelector('[data-form-field-name="field10"] .ds-select__search-input').getAttribute('aria-label'),'Search Country/Region');
 assert.equal(doc.querySelectorAll('[data-form-field-name="field10"] [role="option"]').length,248);
});
