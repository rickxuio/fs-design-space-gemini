'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');const {JSDOM}=require('jsdom'),{buildReference}=require('./compile-component-reference');const ROOT=path.resolve(__dirname,'..'),pack=()=>buildReference(engineeringRoot(),'carousel');
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'fs-carousel-reference-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));for(const dir of ['components/contracts','components/token-specs','components/preview','components/variants','components/icons'])fs.cpSync(path.join(ROOT,dir),path.join(root,dir),{recursive:true});for(const f of ['components/tokens.css','components/components.css','components/carousel-current.js','components/carousel-current.css','components/reference-policy.json','components/sources/carousel/local-structure-review.json','components/sources/carousel/native-pagination-review-1011.json','components/sources/carousel/native-arrow-review-1011.json','components/sources/carousel/native-host-review-1011.json','components/sources/carousel/native-specification-review-1011.json','components/sources/carousel/preview-inline-runtime-before.txt']){fs.mkdirSync(path.dirname(path.join(root,f)),{recursive:true});fs.copyFileSync(path.join(ROOT,f),path.join(root,f));}for(const [target,source] of [['components/contracts/carousel.json','contract-carousel.json'],['components/variants/carousel.html','preview-carousel.html']])fs.copyFileSync(path.join(ROOT,'components/sources/maintenance/preview-source-cleanup-1012',source),path.join(root,target));const cfile=path.join(root,'components/contracts/carousel.json'),archived=JSON.parse(fs.readFileSync(cfile)),current=JSON.parse(fs.readFileSync(path.join(ROOT,'components/contracts/carousel.json')));archived.parts['banner-mini-pagination']=current.parts['banner-mini-pagination'];fs.writeFileSync(cfile,JSON.stringify(archived).replace(/components\/preview\/carousel\.html/g,'components/variants/carousel.html'));const original=new JSDOM(fs.readFileSync(path.join(ROOT,'components/variants/carousel.html'),'utf8')),part=original.window.document.querySelector('[data-carousel-mini-pagination]').outerHTML;fs.appendFileSync(path.join(root,'components/variants/carousel.html'),part);original.window.close();return require('./capability-test-fixture').completeFixture(root);}

let archivedRoot;function engineeringRoot(){if(!archivedRoot)archivedRoot=fixture({after:fn=>process.once('exit',fn)});return archivedRoot;}
// These old scaffolds exercise runtime and rejection guards only, not current MG admission.
function initialize(d){d.window.eval(fs.readFileSync(path.join(ROOT,'components/carousel-current.js'),'utf8'));d.window.document.dispatchEvent(new d.window.Event('DOMContentLoaded'));}
function state(root,index){const dots=root.querySelectorAll('.ds-carousel__dot'),slides=root.querySelectorAll('.ds-carousel__slide');assert.equal(root.querySelector('.ds-carousel__track').style.transform,`translateX(-${index*100}%)`);for(let i=0;i<7;i++){assert.equal(dots[i].classList.contains('ds-carousel__dot--active'),i===index);assert.equal(dots[i].getAttribute('aria-current'),i===index?'true':null);assert.equal(slides[i].getAttribute('aria-hidden'),String(i!==index));}assert.equal(root.querySelector('.ds-carousel__btn--prev').disabled,index===0);assert.equal(root.querySelector('.ds-carousel__btn--next').disabled,index===6);}
test('Archived engineering fixture: Carousel exposes two ID-free finite scaffolds and page-owned slide boundary',()=>{const p=pack();assert.deepEqual(p.examples.map(e=>e.name),['dark','light']);assert.deepEqual(p.runtime.scripts,['components/carousel-current.js']);assert.ok(p.runtime.styles.includes('components/carousel-current.css'));assert.ok(p.selection.unsupported.includes('interactive-slide-content'));assert.match(p.identity.slideContentBoundary,/not.*Banner|Preview-only/);for(const e of p.examples){const d=new JSDOM(e.exampleHtml);try{assert.equal(d.window.document.querySelectorAll('[id]').length,0);assert.equal(d.window.document.querySelectorAll('.ds-banner').length,0);}finally{d.window.close();}}});
test('Archived engineering fixture: Carousel rejects missing slides, duplicate dot index, initialized state and focusable slide content',t=>{const root=fixture(t),file=path.join(root,'components/variants/carousel.html'),original=fs.readFileSync(file,'utf8');for(const change of [e=>e.querySelector('.ds-carousel__slide').remove(),e=>e.querySelectorAll('.ds-carousel__dot')[1].dataset.index='0',e=>e.dataset.carouselReady='true',e=>e.querySelector('.ds-carousel__slide').innerHTML='<a href="https://fixture.invalid">Link</a>',e=>e.querySelector('.ds-carousel__btn--next').type='submit',e=>e.querySelector('.ds-carousel__track').id='copy-id',e=>e.querySelector('.ds-carousel__btn--prev').disabled=false]){const d=new JSDOM(original);try{change(d.window.document.querySelector('[data-ai-example="ai-carousel-dark-homepage"]'));fs.writeFileSync(file,d.serialize());assert.throws(()=>buildReference(root,'carousel'),/seven-slide homepage scaffold/);}finally{d.window.close();}}});
test('Archived engineering fixture: Carousel full traversal keeps track/dots/ARIA/disabled controls synchronized',()=>{const d=new JSDOM(pack().examples[0].exampleHtml,{runScripts:'outside-only'});try{initialize(d);const root=d.window.document.querySelector('.ds-carousel'),next=root.querySelector('.ds-carousel__btn--next'),prev=root.querySelector('.ds-carousel__btn--prev');state(root,0);for(let i=1;i<7;i++){next.click();state(root,i);}next.click();state(root,6);for(let i=5;i>=0;i--){prev.click();state(root,i);}prev.click();state(root,0);root.querySelectorAll('.ds-carousel__dot')[4].click();state(root,4);}finally{d.window.close();}});
test('Archived engineering fixture: Carousel copied instances and repeated runtime loading do not share state or double-bind',()=>{const html=pack().examples[0].exampleHtml,d=new JSDOM(html+html,{runScripts:'outside-only'});try{initialize(d);initialize(d);const roots=d.window.document.querySelectorAll('.ds-carousel');roots[0].querySelector('.ds-carousel__btn--next').click();state(roots[0],1);state(roots[1],0);roots[1].querySelectorAll('.ds-carousel__dot')[6].click();state(roots[0],1);state(roots[1],6);}finally{d.window.close();}});
test('Archived engineering fixture: Carousel malformed dot mapping is left uninitialized rather than binding mismatched controls',()=>{const d=new JSDOM(pack().examples[0].exampleHtml,{runScripts:'outside-only'});try{const root=d.window.document.querySelector('.ds-carousel');root.querySelector('.ds-carousel__dot').dataset.index='7';initialize(d);assert.equal(root.dataset.carouselReady,undefined);root.querySelector('.ds-carousel__btn--next').click();assert.equal(root.querySelector('.ds-carousel__track').style.transform,'');}finally{d.window.close();}});
test('Archived engineering fixture: Light five-slide Carousel traverses independently with no optional dots and rejects unavailable host actions',()=>{const p=pack(),d=new JSDOM(p.examples.map(e=>e.exampleHtml).join(''),{runScripts:'outside-only'});try{initialize(d);initialize(d);const [dark,light]=d.window.document.querySelectorAll('.ds-carousel'),next=light.querySelector('.ds-carousel__btn--next'),prev=light.querySelector('.ds-carousel__btn--prev'),track=light.querySelector('.ds-carousel__track'),slides=light.querySelectorAll('.ds-carousel__slide');assert.equal(light.querySelectorAll('.ds-carousel__dots').length,0);assert.equal(slides.length,5);for(let i=1;i<5;i++){next.click();assert.equal(track.style.transform,`translateX(-${i*100}%)`);assert.equal([...slides].filter(n=>n.getAttribute('aria-hidden')==='false').length,1);assert.equal(slides[i].getAttribute('aria-hidden'),'false');}assert.equal(next.disabled,true);next.dispatchEvent(new d.window.MouseEvent('click',{bubbles:true}));assert.equal(track.style.transform,'translateX(-400%)');light.setAttribute('aria-disabled','true');prev.dispatchEvent(new d.window.MouseEvent('click',{bubbles:true}));assert.equal(track.style.transform,'translateX(-400%)');light.removeAttribute('aria-disabled');light.hidden=true;prev.dispatchEvent(new d.window.MouseEvent('click',{bubbles:true}));assert.equal(track.style.transform,'translateX(-400%)');light.hidden=false;for(let i=3;i>=0;i--){prev.click();assert.equal(track.style.transform,`translateX(-${i*100}%)`);}assert.equal(prev.disabled,true);state(dark,0);}finally{d.window.close();}});
test('Archived engineering fixture: Light Carousel locks existing L controls, five wrappers and Token insets without accepting fake dark or pagination state',t=>{const root=fixture(t),f=path.join(root,'components/variants/carousel.html'),original=fs.readFileSync(f,'utf8');for(const change of [e=>e.querySelector('.ds-carousel__slide').remove(),e=>e.querySelector('button').classList.replace('ds-carousel__btn--l','ds-carousel__btn--xl'),e=>e.querySelector('button').classList.add('ds-carousel__btn--dark'),e=>e.append(e.ownerDocument.createElement('div')),e=>e.setAttribute('data-carousel-current',''),e=>e.querySelector('.ds-carousel__btn--next').setAttribute('style','right:0')]){const d=new JSDOM(original);try{change(d.window.document.querySelector('[data-ai-example="ai-carousel-light-five"]'));fs.writeFileSync(f,d.serialize());assert.throws(()=>buildReference(root,'carousel'),/seven-slide homepage scaffold/);}finally{d.window.close();}}const css=fs.readFileSync(path.join(ROOT,'components/carousel-current.css'),'utf8');assert.match(css,/left: var\(--spacing-lg\)/);assert.match(css,/right: var\(--spacing-lg\)/);assert.match(css,/border-radius: var\(--border-radius-lg\)/);assert.doesNotMatch(css,/13\.125|@media/);});

test('Current Carousel keeps four direction controls and admits only ordinary external card host',()=>{const c=JSON.parse(fs.readFileSync(path.join(ROOT,'components/contracts/carousel.json'))),preview=fs.readFileSync(path.join(ROOT,'components/variants/carousel.html'),'utf8');assert.deepEqual(c.aiContract.supported,['navigation.outlined-m.left','navigation.outlined-m.right','navigation.solid-xl.left','navigation.solid-xl.right','external-cards']);assert.equal(c.isComplete,false);assert.ok(c.variants.filter(v=>['light','dark'].includes(v.name)).every(v=>v.isComplete===false));assert.equal(c.parts.pagination.isComplete,true);assert.equal(buildReference(ROOT,'carousel').examples.length,5);assert.doesNotMatch(preview,/id="demo-carousel"|data-ai-example="ai-carousel-(?:light|dark)|>Slide [1-5]</);});

test('Current Carousel reviewed outline28 and solid36 glyphs cover exact source cells without expanding full calls',()=>{
 const d=new JSDOM(fs.readFileSync(path.join(ROOT,'components/variants/carousel.html'),'utf8'));
 try {
  const nodes=d.window.document.querySelectorAll('[data-carousel-source-outline28]'); assert.equal(nodes.length,6);
  for(const [direction,state] of [['left','disabled'],['right','default'],['left','default'],['left','hover'],['right','hover'],['right','disabled']]){
   const e=d.window.document.querySelector(`[data-carousel-source-outline28="${direction}-${state}"]`);
   assert.ok(e.classList.contains('ds-carousel__btn--outlined-m')); assert.equal(e.disabled,state==='disabled');
   const file=`icon-carousel-outline28-${direction}-current.svg`;
   assert.equal(e.querySelector('img').getAttribute('src'),`../icons/${file}`);
   const normalize=s=>s.replace(/master_svg\w+/g,'source-id'); const date=(direction==='left'&&state==='disabled')||(direction==='right'&&state==='default')?'1013':'1014';
   assert.equal(normalize(fs.readFileSync(path.join(ROOT,'components/icons',file),'utf8')),normalize(fs.readFileSync(path.join(ROOT,`components/sources/carousel/outline28-${direction}-${state}-official-${date}.svg`),'utf8')));
   assert.equal(e.classList.contains('ds-carousel__btn--hover'),state==='hover');
   const svg=fs.readFileSync(path.join(ROOT,'components/icons',file),'utf8'); assert.match(svg,/width="16" height="16"/); assert.match(svg,/fill="#4B4B4D"/);
  }
  assert.equal(d.window.document.querySelectorAll('.ds-carousel__btn--outlined-m img[src="../icons/icon-carousel-prev.svg"]').length,0);
  assert.equal(d.window.document.querySelectorAll('.ds-carousel__btn--outlined-m img[src="../icons/icon-carousel-next.svg"]').length,0);
  const source=JSON.parse(fs.readFileSync(path.join(ROOT,'components/sources/carousel/solid36-source-review-1014.json'),'utf8'));
  assert.equal(d.window.document.querySelectorAll('[data-carousel-source-solid36]').length,6);
  for(const [key,record] of Object.entries(source.observed)){
   const direction=key.split('-')[0],state=key.split('-')[1];
   const cell=d.window.document.querySelector(`[data-carousel-source-solid36="${key}"]`);
   assert.ok(cell.classList.contains('ds-carousel__btn--l'));
   assert.equal(cell.disabled,state==='disabled');
   assert.equal(cell.classList.contains('ds-carousel__btn--hover'),state==='hover');
   const asset=`icon-carousel-solid36-${direction}-current.svg`;
   assert.equal(cell.querySelector('img').getAttribute('src'),`../icons/${asset}`);
   const normalize=s=>s.replace(/master_svg\w+/g,'source-id');
   const actual=fs.readFileSync(path.join(ROOT,'components/icons',asset),'utf8');
   assert.equal(normalize(actual),normalize(fs.readFileSync(path.join(ROOT,'components/sources/carousel',record.icon.officialSvg),'utf8')));
   assert.match(actual,/width="20" height="20"/); assert.match(actual,/fill="#FFFFFF"/);
  }
  assert.equal(d.window.document.querySelectorAll('.ds-carousel__btn--l img[src="../icons/icon-carousel-prev.svg"],.ds-carousel__btn--l img[src="../icons/icon-carousel-next.svg"]').length,0);
  const source48=JSON.parse(fs.readFileSync(path.join(ROOT,'components/sources/carousel/solid48-current-identity-review-1014.json'),'utf8'));
  assert.equal(source48.currentCollectionType,'COMPONENT_SET');
  assert.equal([...d.window.document.querySelectorAll('[data-carousel-source-solid48]')].filter(n=>!n.closest('[data-carousel-external]')).length,6);
  for(const record of source48.currentStates){
   const [direction,state]=record.label.split('-');
   const cell=d.window.document.querySelector(`[data-carousel-source-solid48="${record.label}"]`);
   assert.equal(record.root.type,'COMPONENT'); assert.deepEqual([record.root.width,record.root.height],[48,48]);
   const glyph=record.sections.find(n=>n.type==='INSTANCE');
   assert.deepEqual([glyph.x,glyph.y,glyph.width,glyph.height],[direction==='left'?9:11,10,28,28]);
   assert.ok(cell.classList.contains('ds-carousel__btn--xl'));
   assert.equal(cell.disabled,state==='disabled'); assert.equal(cell.classList.contains('ds-carousel__btn--hover'),state==='hover');
   const asset=`icon-carousel-solid48-${direction}-current.svg`;
   assert.equal(cell.querySelector('img').getAttribute('src'),`../icons/${asset}`);
   const actual=fs.readFileSync(path.join(ROOT,'components/icons',asset),'utf8');
   assert.equal(actual,fs.readFileSync(path.join(ROOT,'components/sources/carousel',source48.officialExports[direction].file),'utf8'));
   assert.match(actual,/width="28" height="28" viewBox="0 0 28 28"/);assert.match(actual,/fill="#FFFFFF"/);
   const own=source48.glyphComparison.find(g=>g.label===record.label),peer=source48.glyphComparison.find(g=>g.label===`${direction}-default`);
   assert.equal(own.id,glyph.id);assert.equal(own.rawExtractor.svg,peer.rawExtractor.svg);
  }
  const css48=fs.readFileSync(path.join(ROOT,'components/carousel-current.css'),'utf8');
  assert.match(css48,/ds-carousel__btn--xl\[data-carousel-source-solid48\^="left-"\] img \{ left: calc\(var\(--spacing-xs\) \/ -4\); \}/);
  assert.match(css48,/ds-carousel__btn--xl\[data-carousel-source-solid48\^="right-"\] img \{ left: calc\(var\(--spacing-xs\) \/ 4\); \}/);
  const source20=JSON.parse(fs.readFileSync(path.join(ROOT,'components/sources/carousel/solid20-current-source-review-1014.json'),'utf8'));
  const comparison20=JSON.parse(fs.readFileSync(path.join(ROOT,source20.glyphComparison),'utf8')).glyphComparison;
  assert.equal(d.window.document.querySelectorAll('[data-carousel-source-solid20]').length,6);
  for(const record of source20.observed){
   const [direction,state]=record.label.split('-');
   const cell=d.window.document.querySelector(`[data-carousel-source-solid20="${record.label}"]`);
   const glyph=record.sections.find(n=>n.type==='INSTANCE');
   assert.equal(record.root.type,'COMPONENT');assert.deepEqual([record.root.width,record.root.height],[20,20]);
   assert.deepEqual([glyph.x,glyph.y,glyph.width,glyph.height],[direction==='left'?3:5,4,12,12]);
   assert.ok(cell.classList.contains('ds-carousel__btn--s'));assert.equal(cell.disabled,state==='disabled');
   assert.equal(cell.classList.contains('ds-carousel__btn--hover'),state==='hover');
   const asset=`icon-carousel-solid20-${direction}-current.svg`;
   assert.equal(cell.querySelector('img').getAttribute('src'),`../icons/${asset}`);
   const actual=fs.readFileSync(path.join(ROOT,'components/icons',asset),'utf8');
   assert.equal(actual,fs.readFileSync(path.join(ROOT,'components/sources/carousel',source20.officialExports[direction].file),'utf8'));
   assert.match(actual,/width="12" height="12" viewBox="0 0 12 12"/);assert.match(actual,/fill="#FFFFFF"/);
   const own=comparison20.find(g=>g.label===record.label),peer=comparison20.find(g=>g.label===`${direction}-default`);
   assert.equal(own.id,glyph.id);assert.equal(own.rawExtractor.svg,peer.rawExtractor.svg);
  }
  assert.match(css48,/ds-carousel__btn--s\[data-carousel-source-solid20\^="left-"\] img \{ left: calc\(var\(--spacing-xs\) \/ -4\); \}/);
  assert.match(css48,/ds-carousel__btn--s\[data-carousel-source-solid20\^="right-"\] img \{ left: calc\(var\(--spacing-xs\) \/ 4\); \}/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(ROOT,'components/contracts/carousel.json'))).aiContract.supported.length,5);
 }finally{d.window.close();}
});
