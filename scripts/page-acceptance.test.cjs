'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const ROOT=path.resolve(__dirname,'..'),L=require('./local-component-library.cjs'),V=require('../validate.js'),G=require('../verify.js'),C=require('./check-context.cjs');
const read=f=>fs.readFileSync(f,'utf8');
test('static and HTTP browser acceptance catch real faults without touching delivered files',{timeout:180000},async t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'fs-page-acceptance-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));const copy=f=>{const dest=path.join(root,f);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.cpSync(path.join(ROOT,f),dest,{recursive:true});};
 const pages=['pages/xtool-education-fresh-20261113.html','pages/arista-support-local-20261113.html'];
 const hashes=Object.fromEntries(pages.map(f=>[f,C.hash(fs.readFileSync(path.join(ROOT,f)))]));
 fs.mkdirSync(path.join(root,'design-system/node_modules'),{recursive:true});fs.symlinkSync(path.join(ROOT,'design-system/node_modules/jsdom'),path.join(root,'design-system/node_modules/jsdom'),'dir');
 for(const f of ['scripts/local-component-library.cjs','scripts/local-slot-validation.cjs','scripts/local-form-fields.cjs'])copy(f);
 for(const f of pages){copy(f);const html=read(path.join(ROOT,f)),version=/data-fs-library="([a-f0-9]+)"/.exec(html)[1];if(!fs.existsSync(path.join(root,'fs-components/component-specs/library/releases',version)))copy('fs-components/component-specs/library/releases/'+version);const d=new (L.domAPI(ROOT))(html);for(const node of d.window.document.querySelectorAll('[data-library-props]')){const p=JSON.parse(node.dataset.libraryProps);if(p.sourceAbsent?.reference&&!fs.existsSync(path.join(root,p.sourceAbsent.reference)))copy(p.sourceAbsent.reference);}d.window.close();}
 copy('pages/assets/xtool-education-fresh-20261113');
 const source=read(path.join(root,pages[0])),arista=read(path.join(root,pages[1])),J=L.domAPI(ROOT);const mutate=fn=>{const d=new J(source);fn(d.window.document);const html=d.serialize();d.window.close();return html;};
 const mutations=[
 ['source-iframe',mutate(d=>d.querySelector('main').insertAdjacentHTML('beforeend','<iframe src="https://app.formcrafts.com/source-form"></iframe>')),true,'LIBRARY_UNDECLARED_EMBED'],
 ['bare-form-fields',mutate(d=>d.querySelector('main').insertAdjacentHTML('beforeend','<form><input name="sourceName"><select name="sourceCountry"><option>A</option></select><textarea name="sourceCopy"></textarea></form>')),true,'LIBRARY_UNREGISTERED_CONTROL'],
 ['bare-submit',mutate(d=>d.querySelector('main').insertAdjacentHTML('beforeend','<form><button>Submit</button></form>')),true,'LIBRARY_UNREGISTERED_CONTROL'],
 ['fake-source-primitive',mutate(d=>d.querySelector('textarea').parentElement.setAttribute('style','color:red')),true,'LIBRARY_UNREGISTERED_CONTROL'],
 ['unknown-variant',mutate(d=>d.querySelector('[data-library-component="library-button"]').dataset.libraryFragment='nonexistent'),true],
 ['forbidden-prop',mutate(d=>{const n=d.querySelector('[data-library-component="library-button"]');n.dataset.libraryProps=JSON.stringify({...JSON.parse(n.dataset.libraryProps),addClass:'unsafe'});}),true],
 ['missing-child',mutate(d=>d.querySelector('.ds-btn__text').remove()),true],
 ['illegal-class',mutate(d=>d.querySelector('[data-library-component="library-card"]').classList.add('invented')),true],
 ['missing-resource',mutate(d=>d.querySelector('link[rel=stylesheet]').remove()),true],
 ['mixed-version',mutate(d=>d.querySelector('[data-library-release]').dataset.libraryRelease='0'.repeat(64)),true],
 ['unsafe-link',mutate(d=>{const n=d.querySelector('[data-library-component="library-text-button"]');const p=JSON.parse(n.dataset.libraryProps);p.href='javascript:alert(1)';n.dataset.libraryProps=JSON.stringify(p);}),true],
 ['section-spacing',source.replace('.page-section{padding:40px 0}', '.page-section{padding:41px 0}'),false],
 ['narrow-overflow',source.replace('.module-layout{scroll-margin-top:76px}', '.module-layout{scroll-margin-top:76px;width:1700px}'),false],
 ['page-background',source.replace('background:#FFFFFF}', 'background:#FF00FF}'),true],
 ['description-width',source.replace('max-width:960px','max-width:800px'),true],
 ['runtime-error',source.replace('</body>','<script>throw Error("ACCEPTANCE_RUNTIME")</script></body>'),false],
 ['dead-action',arista.replace("open.addEventListener('click',()=>toggle(region.hidden));",''),false],
 ['tab-center',source.replace('.center-tabs-layout{display:flex;justify-content:center}', '.center-tabs-layout{display:flex;justify-content:flex-start}'),false],
 ['hover-gap',source.replace('display:flex;width:80px;height:48px','display:flex;width:48px;height:48px'),false],
 ['carousel-position',source.replace('.rail-next{right:-80px;', '.rail-next{right:-90px;'),false],
 ['media-http-failure',source.replace('</body>','<script>document.querySelector("video").src="/pages/missing-media.mp4";</script></body>'),false],
 ['wrong-multiselect',source.replace('</body>','<script>document.querySelector("[data-select-mode=multiple]").dataset.selectMode="single";</script></body>'),false],
 ['gray-section-bordered-card',mutate(d=>{const sec=d.querySelector('.page-section--gray');const c=d.createElement('div');c.setAttribute('data-library-component','library-card');c.setAttribute('data-library-fragment','spliced-vertical-single-event-bordered');sec.appendChild(c);}),true,'PAGE_SURFACE_BORDER'],
 ['mixed-form-surface',mutate(d=>{const f=d.createElement('form');f.setAttribute('data-fs-check-form','');const i1=d.createElement('div');i1.setAttribute('data-library-component','library-input');i1.setAttribute('data-library-fragment','white');const i2=d.createElement('div');i2.setAttribute('data-library-component','library-select');i2.setAttribute('data-library-fragment','single-basic');f.append(i1,i2);d.querySelector('main').appendChild(f);}),true,'PAGE_FORM_SURFACE_MIX'],
 ['narrow-media-panel',mutate(d=>{const s=d.createElement('style');s.textContent='.narrow-media-test{max-width:960px}';d.head.appendChild(s);d.querySelector('video').parentElement.classList.add('narrow-media-test');}),true,'PAGE_MEDIA_CONTAINER_WIDTH']
 ];
 const context=C.createContext();const good=V.validateFile(path.join(root,pages[0]),{root,context});assert.deepEqual(good.filter(i=>i.level==='error'),[]);
 const results=[];const browserFiles=[];
 for(const [name,html,staticFail,expectedCode]of mutations){assert.notEqual(html,name==='dead-action'?arista:source,'Fault did not apply: '+name);const file=path.join(root,'pages',name+'.html');fs.writeFileSync(file,html);const issues=V.validateFile(file,{root,context});const errors=issues.filter(i=>i.level==='error');if(staticFail){assert.ok(errors.length,'Static missed '+name);if(expectedCode)assert.ok(errors.some(e=>e.code===expectedCode),'Wrong failure for '+name);if(name==='unknown-variant')assert.ok(errors.some(e=>e.code==='LIBRARY_CALL'&&e.msg.includes('契约和 Preview')&&e.msg.includes('不自动降级')));}else{assert.deepEqual(errors,[],name+' unexpectedly failed statically');browserFiles.push(file);}results.push({name,staticErrors:errors.map(i=>i.code)});}
 const browser=await G.run([path.join(root,pages[0]),path.join(root,pages[1]),...browserFiles],{root,context,viewports:[1085]});for(const r of browser){const name=path.basename(r.file,'.html');if(name.startsWith('xtool-')||name.startsWith('arista-'))assert.deepEqual(r.errors,[],JSON.stringify(r));else assert.ok(r.errors.length,'Browser missed '+name);results.push({name,errors:r.errors,actions:r.actions.map(a=>({kind:a.kind,status:a.status}))});}
 // Mutation of real bytes invalidates per-run release verification; a version string alone is insufficient.
 const version=/data-fs-library="([a-f0-9]+)"/.exec(source)[1],base='fs-components/component-specs/library/releases/'+version;
 const manifest=JSON.parse(read(path.join(root,base,'manifest.json'))),resource=Object.keys(manifest.files).find(f=>f.endsWith('.css'));
 fs.appendFileSync(path.join(root,base,resource),'\n/* corruption */');assert.ok(V.validateFile(path.join(root,pages[0]),{root,context}).some(i=>i.level==='error'));
 const corrupt=await G.run([path.join(root,pages[0])],{root,context,viewports:[1085]});assert.ok(corrupt[0].errors.some(e=>e.includes('LIBRARY_CALL')),'Resource corruption must be a quality error, not an environment exception');
 for(const f of pages)assert.equal(C.hash(fs.readFileSync(path.join(ROOT,f))),hashes[f]);
 if(process.env.FS_ACCEPTANCE_REPORT)fs.writeFileSync(process.env.FS_ACCEPTANCE_REPORT,JSON.stringify({results,stats:context.stats,protectedPagesUnchanged:true},null,2));
 console.log('22 isolated faults detected; positive pages retained; resource change invalidated context');
});
