'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {JSDOM}=require('jsdom'),{buildReference}=require('./compile-component-reference'),h=require('./carousel-outline-control');
const ROOT=path.resolve(__dirname,'..');
const pack=()=>buildReference(ROOT,'carousel');
test('two finite control calls are backed by all six saved original states, no preassembled host',()=>{
 const s=h.validateSource(ROOT),p=pack();assert.equal(s.assets.length,6);assert.deepEqual(p.examples.filter(e=>e.name.startsWith('navigation.outlined-m.')).map(e=>e.name),['navigation.outlined-m.left','navigation.outlined-m.right']);assert.ok(p.runtime.scripts.includes('components/carousel-external.js'));for(const e of p.examples.filter(e=>e.name!=='external-cards'))assert.deepEqual(e.runtime.scripts,[]);
 for(const e of p.examples.filter(e=>e.name!=='external-cards')){assert.equal(h.outputIssues(e.exampleHtml).length,0);const d=new JSDOM(e.exampleHtml);const b=d.window.document.querySelector('button');let count=0;b.addEventListener('click',()=>count++);b.click();b.disabled=true;b.click();assert.equal(count,1);assert.equal(h.outputIssues(b.outerHTML).length,0);d.window.close();}
});
test('finite output rejects wrong direction/glyph, outside images, geometry override and fake hover/disabled',()=>{
 const good=pack().examples[0].exampleHtml;
 for(const mutate of [b=>b.removeAttribute('data-carousel-source-outline28'),b=>b.querySelector('img').src='../icons/icon-carousel-outline28-right-current.svg',b=>b.querySelector('img').style.width='20px',b=>b.classList.add('ds-carousel__btn--hover'),b=>b.setAttribute('aria-disabled','true'),b=>b.append(b.querySelector('img').cloneNode()),b=>b.append('Previous')]){const d=new JSDOM(good);mutate(d.window.document.querySelector('button'));assert.ok(h.outputIssues(d.window.document.body.innerHTML).length);d.window.close();}
});


test('solid48 finite calls bind six typed states and reject forged output or source geometry',t=>{
 const h=require('./carousel-solid-control'),s=h.validateSource(ROOT),p=pack(),examples=p.examples.filter(e=>e.name.startsWith('navigation.solid-xl.'));
 assert.equal(examples.length,2);assert.equal(s.assets.length,2);
 for(const e of examples){assert.deepEqual(h.outputIssues(e.exampleHtml),[]);const d=new JSDOM(e.exampleHtml);let clicks=0;const b=d.window.document.querySelector('button');b.addEventListener('click',()=>clicks++);b.click();b.disabled=true;b.click();assert.equal(clicks,1);d.window.close();}
 for(const change of [b=>b.classList.replace('ds-carousel__btn--xl','ds-carousel__btn--outlined-m'),b=>b.setAttribute('data-carousel-source-solid48','right-default'),b=>b.firstElementChild.setAttribute('src','../icons/icon-carousel-prev.svg'),b=>b.style.width='56px',b=>b.classList.add('ds-carousel__btn--hover'),b=>b.setAttribute('aria-disabled','true'),b=>b.append('Next')]){const d=new JSDOM(examples[0].exampleHtml);change(d.window.document.querySelector('button'));assert.ok(require('./carousel-outline-control').outputIssues(d.serialize()).length);d.window.close();}
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fs-solid48-source-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));for(const file of [h.SOURCE,...s.evidence.map(e=>e.file),...s.assets.flatMap(a=>[a.file,a.original])]){fs.mkdirSync(path.dirname(path.join(dir,file)),{recursive:true});fs.copyFileSync(path.join(ROOT,file),path.join(dir,file));}
 assert.equal(h.validateSource(dir).assets.length,2);
 const proof=s.evidence[1],file=path.join(dir,proof.file),data=JSON.parse(fs.readFileSync(file));data.records.find(n=>n.size===48).circle.nodes[0].layoutStyle.width=56;fs.writeFileSync(file,JSON.stringify(data));
 const manifest=JSON.parse(fs.readFileSync(path.join(dir,h.SOURCE)));manifest.evidence[1].sha256=require('node:crypto').createHash('sha256').update(fs.readFileSync(file)).digest('hex');fs.writeFileSync(path.join(dir,h.SOURCE),JSON.stringify(manifest));assert.throws(()=>h.validateSource(dir),/six-state native geometry/);
});
