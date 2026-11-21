'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {JSDOM}=require('jsdom'),{validateNode,validateSource,outputIssues,SOURCE}=require('./button-leading-icon');
const ROOT=path.resolve(__dirname,'..'),button=JSON.parse(fs.readFileSync(path.join(ROOT,'components/contracts/button.json')));
function call(variant,icon,hidden=false){return `<button type="button" class="ds-btn ds-btn--${variant} ds-btn--${variant==='filled-red'?'xl-regular':'xl'}"><span class="ds-btn__leading"${hidden?' hidden':''}><img class="ds-btn__leading-icon" src="../components/icons/${icon}" alt="" aria-hidden="true"></span><span class="ds-btn__text">Action</span></button>`;}
const check=html=>{const d=new JSDOM(html);try{return validateNode(d.window.document.querySelector('button'),button);}finally{d.window.close();}};
test('real optional slot admits finite FS glyph bindings without business-specific Button variants',()=>{
 for(const [v,i]of [['filled-red','icon-cart-add.svg'],['outline-black','icon-fs-quotes-black-16.svg'],['outline-black','icon-fs-download-black-16.svg'],['outline-black','icon-cart.svg']])assert.equal(check(call(v,i)),true);
 assert.equal(check('<button class="ds-btn ds-btn--outline-black ds-btn--xl"><span class="ds-btn__text">Legacy text call</span></button>'),false);
});
test('wrong paint, arbitrary icons, wrong size and rewritten atomic slots are rejected',()=>{
 const good=call('outline-black','icon-fs-quotes-black-16.svg');
 for(const bad of [good.replace('icon-fs-quotes-black-16.svg','icon-cart-add.svg'),good.replace('icon-fs-quotes-black-16.svg','icon-placeholder-switch.svg'),good.replace('ds-btn--xl','ds-btn--l'),good.replace('class="ds-btn__leading"','class="ds-btn__leading" style="position:absolute"'),good.replace('class="ds-btn__leading-icon"','class="ds-btn__leading-icon" width="20"'),good.replace('alt=""','alt="quote"'),good.replace('Action','<img src="x">'),good.replace('</button>','<span>Extra</span></button>')])assert.throws(()=>check(bad),/Button leading icon/);
 assert.throws(()=>check('<button class="ds-btn ds-btn--outline-black ds-btn--xl"><img src="../components/icons/icon-fs-quotes-black-16.svg"><span class="ds-btn__text">Quote</span></button>'),/missing source group/);
});
test('Processing does not silently inherit a visible source-unverified icon slot',()=>{
 const html=call('outline-black','icon-fs-quotes-black-16.svg').replace('ds-btn--xl','ds-btn--xl ds-btn--processing').replace('</button>','<img class="ds-btn__icon-loading" src="../components/icons/icon-loading.svg" alt="" aria-hidden="true"></button>');
 assert.throws(()=>check(html),/Processing/);assert.equal(check(html.replace('class="ds-btn__leading"','class="ds-btn__leading" hidden')),true);
});
test('genuine hidden default slot survives text-only sizes without admitting a visible icon or weaker source checks',()=>{
 for(const [variant,icon,size]of [['filled-red','icon-cart-add.svg','m'],['outline-black','icon-fs-quotes-black-16.svg','l']]){
  const html=call(variant,icon,true).replace(variant==='filled-red'?'ds-btn--xl-regular':'ds-btn--xl','ds-btn--'+size);
  assert.equal(check(html),true);
  assert.throws(()=>check(html.replace(' hidden','')),/unsupported variant\/size/);
  assert.throws(()=>check(html.replace(icon,'icon-placeholder-switch.svg')),/unregistered/);
  assert.throws(()=>check(html.replace('class="ds-btn__leading"','class="ds-btn__leading" style="display:inline-flex"')),/inline atomic override/);
 }
});
test('official source glyphs retain their hashes, source paint and original full artboards',t=>{
 const data=validateSource(ROOT);assert.equal(data.assets.length,4);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'fs-button-slot-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 for(const file of [SOURCE,...data.assets.flatMap(a=>[a.file,a.original,...(a.geometryTransform?[a.geometryTransform.sourceFrameEvidence]:[])])]){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.copyFileSync(path.join(ROOT,file),path.join(root,file));}
 fs.writeFileSync(path.join(root,data.assets[1].file),'<svg></svg>');assert.throws(()=>validateSource(root),/empty\/changed/);
});
test('real compiler exports size-scoped icon bindings and public output enforces them',()=>{
 const p=require('./compile-component-reference').buildReference(ROOT,'button');assert.ok(p.sourceValidation.leadingIcon);
 const red=p.examples.find(e=>e.name==='filled-red');
 assert.ok(red.sizeOptions.find(s=>s.name==='xl-regular').bindings.icon);assert.equal(red.sizeOptions.find(s=>s.name==='l').bindings.icon,undefined);
 const good=call('outline-black','icon-fs-quotes-black-16.svg');assert.deepEqual(outputIssues(good,button),[]);
 assert.equal(outputIssues(good.replace('icon-fs-quotes-black-16.svg','icon-cart-add.svg'),button)[0].type,'button-leading-icon');
});
test('dark Cart composition preserves the real source frame and rejects changed geometry even with a refreshed file hash',t=>{const data=validateSource(ROOT),root=fs.mkdtempSync(path.join(os.tmpdir(),'fs-cart-artboard-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));for(const file of [SOURCE,...data.assets.flatMap(a=>[a.file,a.original,...(a.geometryTransform?[a.geometryTransform.sourceFrameEvidence]:[])])]){fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.copyFileSync(path.join(ROOT,file),path.join(root,file));}const a=data.assets.find(a=>a.geometryTransform),file=path.join(root,a.file),sourceFile=path.join(root,SOURCE),hash=()=>require('node:crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex'),original=fs.readFileSync(file,'utf8');assert.equal(validateSource(root).assets.length,4);for(const bad of [original.replace('fill="#19191A"','fill="#707070"'),original.replace('M2.8841121828125003','M3.8841121828125003')]){fs.writeFileSync(file,bad);a.sha256=hash();fs.writeFileSync(sourceFile,JSON.stringify(data));assert.throws(()=>validateSource(root),/paint|geometry/);}});
