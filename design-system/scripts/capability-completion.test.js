'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const {buildReference,projectReference}=require('./compile-component-reference');
const ROOT=path.resolve(__dirname,'..'),id=process.env.FS_COMPONENT_UNDER_TEST;
const variants={banner:['search'],card:['embedded.product-detail','embedded.product-full','spliced.horizontal.full-width.bordered-background'],'icon-card':['left.jump-type','center.multi-event-expandable','left.multi-event-expandable'],list:['attribute-key-value'],'menu-navigation':['multi-level-search']};
const pack=buildReference(ROOT,id);
for(const name of variants[id]||[])test(id+'/'+name+' admits a sourced finite call with its actual child resources and guarded interaction',()=>{
 const example=pack.examples.find(e=>e.name===name);assert.ok(example);assert.equal(example.publication.newPages,true);
 const d=new JSDOM('<!doctype html><body>'+example.exampleHtml+'</body>',{runScripts:'outside-only',url:'https://component.local/'}),w=d.window;
 try{w.CSS??={};w.CSS.escape??=s=>String(s).replace(/[^a-z0-9_-]/gi,'');for(const file of pack.runtime.scripts)w.eval(fs.readFileSync(path.join(ROOT,file),'utf8'));w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 const root=w.document.body.firstElementChild,events=[];
 for(const event of ['ds:banner-search','ds:banner-gpt','ds:icon-card-toggle','ds:list-profile-action','ds:menu-navigation-search'])root.addEventListener(event,e=>events.push({event,detail:e.detail}));
 if(name==='search'||name==='multi-level-search'){
  const form=root.querySelector('form.ds-input-search'),input=form.querySelector('input'),button=form.querySelector('button');
  input.value='  support query  ';form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(events.at(-1).detail.query,'support query');
  const count=events.length;input.value='  ';button.click();assert.equal(events.length,count);
  input.value='中文';input.dispatchEvent(new w.CompositionEvent('compositionstart',{bubbles:true}));button.click();assert.equal(events.length,count);input.dispatchEvent(new w.CompositionEvent('compositionend',{bubbles:true}));
  input.disabled=true;button.click();assert.equal(events.length,count);input.disabled=false;
  form.hidden=true;button.click();assert.equal(events.length,count);form.hidden=false;
  if(name==='search'){root.querySelector('.ds-banner__gpt').click();assert.equal(events.at(-1).event,'ds:banner-gpt');assert.ok(projectReference(pack,name).relationships.children.some(x=>x.id==='input'&&x.part==='banner-search42'));}
  else assert.ok(events.some(e=>e.detail.submitted));
 }
 if(name.includes('expandable')){
  const button=root.querySelector('[data-text-button-part]'),content=root.querySelector('.ds-icon-card__bullets');assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(button.getAttribute('aria-controls'),content.id);
  button.click();assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(button.textContent,'See less');assert.equal(content.classList.contains('ds-icon-card__bullets--collapsed'),false);
  button.click();assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(events.length,2);button.disabled=true;button.click();assert.equal(events.length,2);
 }
 if(name==='attribute-key-value'){
  const button=root.querySelector('[data-list-profile-action="edit"]');button.click();assert.equal(events.at(-1).detail.action,'edit');assert.ok(events.at(-1).detail.field);assert.ok(events.at(-1).detail.value);button.disabled=true;const n=events.length;button.click();assert.equal(events.length,n);
 }
 if(name==='embedded.product-full'){assert.ok(root.querySelector('[data-tag-product]')||root.querySelector('.ds-tag--product'));assert.ok(root.querySelector('.ds-cart'));assert.equal(root.querySelectorAll('.ds-list__unordered-item').length,3);}
 if(name==='embedded.product-detail')assert.ok(root.querySelector('.ds-list--unordered-12'));
 if(name==='left.jump-type'){assert.ok(root.querySelector('[data-list-part="icon-card-links-12"]'));assert.ok(projectReference(pack,name).relationships.children.some(x=>x.id==='list'&&x.part==='icon-card-links-12'));}
 }finally{d.window.close();}
});
