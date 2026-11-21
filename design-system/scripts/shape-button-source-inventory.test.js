'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {inventory,SOURCE,OUTPUT}=require('./inventory-shape-button-source');const ROOT=path.resolve(__dirname,'..');
function fixture(t){const root=fs.mkdtempSync(path.join(os.tmpdir(),'fs-shape-source-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));for(const f of [SOURCE,'components/contracts/button.json','components/components.css','components/button-current.css','components/tokens.css']){fs.mkdirSync(path.dirname(path.join(root,f)),{recursive:true});fs.copyFileSync(path.join(ROOT,f),path.join(root,f));}fs.cpSync(path.join(ROOT,'components/token-specs'),path.join(root,'components/token-specs'),{recursive:true});return root;}
test('15 local default calls have unique actual COMPONENT matches within 60 saved design nodes',()=>{
 const i=inventory();assert.deepEqual(i,JSON.parse(fs.readFileSync(path.join(ROOT,OUTPUT))));assert.equal(i.summary.designComponents,60);assert.equal(i.summary.matchedDefaults,15);assert.equal(new Set(i.finiteMatches.map(m=>m.nodeId)).size,15);assert.ok(i.finiteMatches.every(m=>m.notCompared.includes('computed CSS')));assert.equal(i.source.remoteRevisionProvided,false);
});
test('wrapper labels cannot replace native component types or unique source identity',t=>{
 const root=fixture(t),file=path.join(root,SOURCE),saved=JSON.parse(fs.readFileSync(file));for(const change of [set=>set.type='FRAME',set=>set.children[0].type='FRAME',set=>set.children[1].id=set.children[0].id]){const s=structuredClone(saved),d=JSON.parse(s.content[0].text);change(d.dsl.nodes[0]);s.content[0].text=JSON.stringify(d);fs.writeFileSync(file,JSON.stringify(s));assert.throws(()=>inventory(root),/identity mismatch/);}
});
test('local padding and font declarations cannot retain a saved-source match after they change',t=>{
 const root=fixture(t),file=path.join(root,'components/contracts/button.json'),original=JSON.parse(fs.readFileSync(file));for(const change of [c=>c.variants[0].sizes[0].styleProperties.padding='0 20px',c=>c.variants[0].sizes[0].styleProperties.fontWeight='400',c=>c.variants[0].sizes[0].styleProperties.height='48px']){const c=structuredClone(original);change(c);fs.writeFileSync(file,JSON.stringify(c));assert.throws(()=>inventory(root),/expected one typed design default|share a source default|saved default fontWeight differs/);}
});

test('default paint declarations detect the wrong M background and contract literals',t=>{
 const root=fixture(t),css=path.join(root,'components/components.css'),original=fs.readFileSync(css,'utf8');fs.writeFileSync(css,original.replace('.ds-btn--filled-gray.ds-btn--m { background-color: var(--color-gray-8); }','.ds-btn--filled-gray.ds-btn--m { background-color: var(--color-gray-9); }'));assert.throws(()=>inventory(root),/filled-gray\/m.*backgroundColor/);fs.writeFileSync(css,original);
 const file=path.join(root,'components/contracts/button.json'),c=JSON.parse(fs.readFileSync(file));c.variants.find(v=>v.name==='filled-gray').sizes.find(s=>s.name==='m').styleProperties.backgroundColor='color.gray-8 (#FAFBFB)';fs.writeFileSync(file,JSON.stringify(c));assert.throws(()=>inventory(root),/token\/literal mismatch/);
});
test('explicit saved stroke, radius and full text color ranges are required',t=>{
 const root=fixture(t),file=path.join(root,SOURCE),saved=JSON.parse(fs.readFileSync(file));for(const change of [n=>n.borderRadius='8px',n=>n.strokeWidth='2px',n=>n.children[0].textColor[0].end=5,n=>n.children[0].textColor[0].color='paint_1:46']){const s=structuredClone(saved),d=JSON.parse(s.content.find(c=>c.type==='text').text),set=d.dsl.nodes.find(n=>n.id==='64880:83689');change(set.children.find(n=>n.id==='64858:84642'));s.content.find(c=>c.type==='text').text=JSON.stringify(d);fs.writeFileSync(file,JSON.stringify(s));assert.throws(()=>inventory(root),/default.*differs|text range incomplete/);}
});

test('default text typography cannot silently inherit line height or change font weight',t=>{
 const root=fixture(t),file=path.join(root,'components/components.css'),original=fs.readFileSync(file,'utf8');for(const change of [s=>s.replaceAll(' line-height: var(--line-height-h9);',''),s=>s.replace('font-size: var(--font-size-md); font-weight: var(--font-weight-semibold);','font-size: var(--font-size-md); font-weight: var(--font-weight-regular);')]){fs.writeFileSync(file,change(original));assert.throws(()=>inventory(root),/default (lineHeight|fontWeight) differs/);}
});
test('saved font family and explicit line height changes invalidate default declaration matching',t=>{
 const root=fixture(t),file=path.join(root,SOURCE),saved=JSON.parse(fs.readFileSync(file));for(const change of [v=>v.lineHeight='24',v=>v.family='Arial']){const s=structuredClone(saved),d=JSON.parse(s.content.find(c=>c.type==='text').text);change(d.dsl.styles['font_709:509'].value);s.content.find(c=>c.type==='text').text=JSON.stringify(d);fs.writeFileSync(file,JSON.stringify(s));assert.throws(()=>inventory(root),/default (lineHeight|fontFamily) differs/);}
});
test('Button runtime height, padding and gap cannot silently diverge from finite saved defaults',t=>{
 const root=fixture(t),file=path.join(root,'components/components.css'),css=fs.readFileSync(file,'utf8');for(const change of [s=>s.replace('  gap: var(--spacing-2);',''),s=>s.replace('height: 42px; padding: 0 var(--spacing-xl);','height: 40px; padding: 0 var(--spacing-xl);'),s=>s.replace('height: 42px; padding: 0 var(--spacing-xl);','height: 42px; padding: 0 var(--spacing-lg);'),s=>s+'\n.ds-btn--filled-red.ds-btn--xl-regular { padding-left: 1px; }']){fs.writeFileSync(file,change(css));assert.throws(()=>inventory(root),/height\/padding\/gap differs|unsupported declaration/);}
});
test('Button layout declaration proof excludes Processing gap and source flow adapter approval',()=>{
 const i=inventory();assert.equal(i.summary.matchedHeightPaddingDeclarations,60);assert.equal(i.summary.matchedGapDeclarations,45);assert.equal(i.summary.uncomparedProcessingGapDeclarations,15);assert.ok(i.finiteMatches.every(m=>m.defaultPaint.layoutDeclarations.gapComparison==='explicit-declaration-match'));
 const processing=i.stateMatches.filter(m=>m.state==='Processing');assert.equal(processing.length,15);assert.ok(processing.every(m=>m.layoutDeclarations.gapComparison.startsWith('not-compared')&&m.layoutDeclarations.browserGeometry===false));assert.ok(processing.some(m=>m.layoutDeclarations.source.gap==='10px'));assert.ok(processing.some(m=>m.layoutDeclarations.source.gap===null));
});

test('45 registered non-default declarations map uniquely, retaining the gray M 16px loader exception',()=>{
 const i=inventory();assert.equal(i.stateMatches.length,45);assert.equal(new Set(i.stateMatches.map(m=>m.nodeId)).size,45);assert.ok(i.stateMatches.every(m=>!m.browserComputedStyles&&!m.layerOrderVerified));assert.equal(i.stateMatches.find(m=>m.variant==='filled-gray'&&m.size==='m'&&m.state==='Processing').loader.width,'16px');assert.equal(i.stateMatches.find(m=>m.variant==='filled-red'&&m.size==='m'&&m.state==='Processing').loader.width,'12px');assert.equal(i.stateMatches.find(m=>m.nodeId==='70047:113525').loader.width,'12px');
});
test('non-default comparisons reject generic hover overlay, unchanged gray hover text and oversized loaders',t=>{
 const root=fixture(t),file=path.join(root,'components/components.css'),original=fs.readFileSync(file,'utf8');for(const change of [s=>s.replace('.ds-btn--hover.ds-btn--filled-black {\n  background-image: linear-gradient(var(--color-black-button-hover-overlay), var(--color-black-button-hover-overlay));','.ds-btn--hover.ds-btn--filled-black {\n  background-image: linear-gradient(var(--color-hover-overlay), var(--color-hover-overlay));'),s=>s.replace('.ds-btn--hover.ds-btn--filled-gray {\n  background-image: linear-gradient(var(--color-hover-overlay-light), var(--color-hover-overlay-light));\n  color: var(--color-gray-1);','.ds-btn--hover.ds-btn--filled-gray {\n  background-image: linear-gradient(var(--color-hover-overlay-light), var(--color-hover-overlay-light));\n  color: var(--color-gray-3);'),s=>s.replace('loading { width: 12px; height: 12px; }','loading { width: 16px; height: 16px; }')]){const changed=change(original);assert.notEqual(changed,original);fs.writeFileSync(file,changed);assert.throws(()=>inventory(root),/fill layers differ|text color differs|loader dimensions differ/);}
});
test('shorthand paint overrides cannot be silently ignored by the limited declaration checker',t=>{
 const root=fixture(t),file=path.join(root,'components/components.css');fs.appendFileSync(file,'\n.ds-btn--filled-gray.ds-btn--m { background: red; }');assert.throws(()=>inventory(root),/unsupported declaration/);
});

test('negative: native disabled Processing cascade cannot retain a saved-source match without its guard',t=>{
 const root=fixture(t),file=path.join(root,'components/button-current.css');assert.equal(inventory(root).stateMatches.filter(x=>x.nativeDisabledOpacity).length,30);
 fs.writeFileSync(file,fs.readFileSync(file,'utf8').replace(/\.ds-btn\.ds-btn--processing:disabled\s*\{[^}]+\}/,''));
 assert.throws(()=>inventory(root),/native disabled opacity mismatch/);
});

test('negative: a stronger earlier type selector cannot be masked by the later current opacity rule',t=>{
 const root=fixture(t),file=path.join(root,'components/components.css');
 fs.appendFileSync(file,'\nbutton.ds-btn.ds-btn--processing:disabled{opacity:0.3}\n');
 assert.throws(()=>inventory(root),/native disabled opacity mismatch/);
});

test('negative: conditional opacity overrides are blocked rather than silently ignored by the finite model',t=>{
 const root=fixture(t),file=path.join(root,'components/components.css');
 fs.appendFileSync(file,'\n@media(min-width:1800px){.ds-btn:disabled{opacity:0.1!important}}\n');
 assert.throws(()=>inventory(root),/opacity conditional rule outside finite model/);
});

test('native opacity grouped pseudo selectors fail closed rather than vanish at comma splitting',t=>{
 const root=fixture(t),file=path.join(root,'components/button-current.css');fs.appendFileSync(file,'\n:is(.ds-btn,.other):disabled{opacity:0.1!important}\n');
 assert.throws(()=>inventory(root),/opacity cascade selector outside finite model/);
});
