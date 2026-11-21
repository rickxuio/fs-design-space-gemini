'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom'),{validateButtonStates}=require('./button-state-semantics');
const html=fs.readFileSync(path.join(__dirname,'../components/variants/button.html'),'utf8');
test('all 15 disabled and Processing specimens preserve native semantics and named action',()=>{
 const r=validateButtonStates(html);assert.equal(r.counts.disabled,15);assert.equal(r.counts.processing,15);assert.equal(r.browserVerified,false);assert.equal(r.processingLayoutApproved,false);
});
test('visual state classes alone, lost action name, busy state and noisy spinner are rejected',()=>{
 for(const edit of [n=>n.removeAttribute('disabled'),n=>n.removeAttribute('aria-busy'),n=>n.removeAttribute('aria-label'),n=>n.querySelector('img').alt='loading',n=>n.removeAttribute('type'),n=>n.classList.add('ds-btn--disabled')]){
  const dom=new JSDOM(html);edit(dom.window.document.querySelector('.ds-btn--processing'));const changed=dom.serialize();dom.window.close();assert.throws(()=>validateButtonStates(changed),/Button specimen/);
 }
 const dom=new JSDOM(html);dom.window.document.querySelector('.ds-btn--disabled').removeAttribute('disabled');assert.throws(()=>validateButtonStates(dom.serialize()),/native disabled/);dom.window.close();
});
test('inactive specimens suppress programmatic native click in DOM; ordinary button remains usable',()=>{
 const dom=new JSDOM(html),doc=dom.window.document;let active=0,inactive=0;
 doc.querySelectorAll('.ds-btn').forEach(n=>{n.addEventListener('click',()=>n.disabled?inactive++:active++);n.click();});
 assert.equal(inactive,0);assert.ok(active>0);dom.window.close();
});

test('Source red XL bold Processing fixed width remains one Preview fixture and never changes default or generic states',()=>{const css=fs.readFileSync(path.join(__dirname,'../components/button-current.css'),'utf8'),d=new JSDOM(`<style>.ds-btn{width:auto}${css}</style><button class="ds-btn ds-btn--filled-red ds-btn--xl-bold ds-btn--processing" data-button-source-red-xl-bold-processing="official"></button><button class="ds-btn ds-btn--filled-red ds-btn--xl-bold ds-btn--processing"></button><button class="ds-btn ds-btn--filled-red ds-btn--xl-bold"></button>`);try{const nodes=d.window.document.querySelectorAll('button'),style=e=>d.window.getComputedStyle(e);assert.equal(style(nodes[0]).width,'136px');assert.equal(style(nodes[1]).width,'auto');assert.equal(style(nodes[2]).width,'auto');}finally{d.window.close();}const preview=new JSDOM(html);try{const nodes=preview.window.document.querySelectorAll('[data-button-source-red-xl-bold-processing="official"]');assert.equal(nodes.length,1);assert.ok(nodes[0].disabled);assert.equal(nodes[0].getAttribute('aria-busy'),'true');assert.equal(nodes[0].querySelectorAll('.ds-btn__icon-loading').length,1);}finally{preview.window.close();}const source=JSON.parse(fs.readFileSync(path.join(__dirname,'../components/sources/button/red-xl-bold-processing-review-1013.json'),'utf8'));assert.equal(source.root.widthMode,'fixed');assert.notEqual(source.root.size[0],source.defaultReuse.size[0]);});

test('L36 Loading retains actual mother contour and rejects promotion of old host outline',()=>{
 const root=path.resolve(__dirname,'..'),mother=new JSDOM(fs.readFileSync(path.join(root,'components/sources/button/loading-mother-official-1015.svg'),'utf8'),{contentType:'image/svg+xml'}),host=new JSDOM(fs.readFileSync(path.join(root,'components/sources/button/loading12-official-1015.svg'),'utf8'),{contentType:'image/svg+xml'}),asset=new JSDOM(fs.readFileSync(path.join(root,'components/icons/icon-loading.svg'),'utf8'),{contentType:'image/svg+xml'});
 try{assert.equal(mother.window.document.querySelectorAll('path').length,1);assert.equal(host.window.document.querySelectorAll('path').length,2);assert.equal(asset.window.document.querySelector('path').getAttribute('d'),mother.window.document.querySelector('path').getAttribute('d'));assert.equal(mother.window.document.documentElement.getAttribute('viewBox'),'0 0 16 16');}finally{mother.window.close();host.window.close();asset.window.close();}
 const css=['components/components.css','components/button-current.css'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n'),d=new JSDOM(`<style>${css}</style>`+html);try{const doc=d.window.document,n=doc.querySelector('.ds-btn--filled-red.ds-btn--l.ds-btn--processing'),img=n.querySelector('img'),st=d.window.getComputedStyle(img);assert.equal(img.getAttribute('src'),'../icons/icon-loading.svg');assert.equal(st.width,'12px');assert.equal(st.height,'12px');assert.equal(st.filter,'brightness(0) invert(1)');assert.equal(doc.querySelectorAll('[data-button-source-loading12="official"]').length,0);assert.ok(n.disabled);assert.equal(n.getAttribute('aria-busy'),'true');}finally{d.window.close();}
});
