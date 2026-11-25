'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const ROOT=path.resolve(__dirname,'..'),{publication,assertPublication,validateBaseline}=require('./component-publication');
const {buildReference,resolveUsage}=require('./compile-component-reference');
function historicalCalls(b){const calls=structuredClone(b.calls);for(const key of ['expansionPlpP1_1123','expansionFive1115','expansionListOption1115','expansionCapability1115','expansionRateSummary1115','expansionCommands1115','expansionDialog1115','expansionComment1115']){for(const k of b[key]?.addedCalls||[])delete calls[k];Object.assign(calls,b[key]?.changedCalls||{});}Object.assign(calls,b.revisionFSL1115?.changedCalls||{});for(const k of b.expansionDonation1114?.addedCalls||[])delete calls[k];for(const k of b.expansionExternal1114?.addedCalls||[])delete calls[k];Object.assign(calls,b.revisionHorizontal1113.changedCalls);for(const k of b.revisionLocalReview1113.addedCalls)delete calls[k];Object.assign(calls,b.revisionLocalReview1113.changedCalls);for(const k of b.revision1113.addedCalls)delete calls[k];Object.assign(calls,b.revision1113.changedCalls);return calls;}
const baseline=()=>JSON.parse(fs.readFileSync(path.join(ROOT,'components/reference-policy.json'))).deliveryBaseline;
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'fs-publication-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;}
test('publication preserves historical decisions and current finite local calls without visual approval',()=>{
 assert.deepEqual(validateBaseline(ROOT),{retain:23,restricted:130,withheld:0,newPages:150});
 for(const [key,d] of Object.entries(baseline().calls)){
  const split=key.indexOf('/'),cid=key.slice(0,split),variant=key.slice(split+1);
  const eligible=d.newPages && !(d.releaseBlockers||[]).length;assert.equal(publication(ROOT,cid,variant).newPages,eligible);assert.equal(d.visualApproval,'separate-not-granted');
  if(eligible)assert.equal(assertPublication(ROOT,cid,variant).key,key);else assert.throws(()=>assertPublication(ROOT,cid,variant),/调用暂不向新页面开放/);
 }
 assert.equal(publication(ROOT,'Select','invented-combination').newPages,false);
});
test('publication fails closed for missing policy baseline and malformed or unregistered entries',t=>{
 const dir=fixture(t);fs.mkdirSync(path.join(dir,'components'));const f=path.join(dir,'components/reference-policy.json');fs.writeFileSync(f,'{}');assert.throws(()=>assertPublication(dir,'Button','filled-red'),/缺少调用交付基线/);
 fs.writeFileSync(f,JSON.stringify({deliveryBaseline:{schemaVersion:'fs-call-delivery-baseline/1.0.0',calls:{'button/filled-red':{disposition:'withheld',newPages:true,constraints:['x'],reason:'x'}}}}));assert.throws(()=>assertPublication(dir,'Button','filled-red'),/无效调用分流/);
});
test('outlined28 expansion preserves every original115 delivery decision',()=>{const b=baseline(),old=Object.fromEntries(Object.entries(historicalCalls(b)).filter(([k])=>![...b.expansion1019.addedCalls,...b.expansion1110.addedCalls].includes(k))),stable=x=>JSON.stringify(x,Object.keys(x).sort());old[b.revision1028.changedCall]=b.revision1028.previous;assert.equal(Object.keys(old).length,115);const sort=v=>Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])])):v;assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(sort(old))).digest('hex'),b.expansion1019.originalCallsCanonicalSha256);for(const v of ['light','dark'])assert.equal(publication(ROOT,'Carousel',v).newPages,false);});


test('solid48 extension preserves prior117 calls and withholds full hosts and other sizes',()=>{const b=baseline(),prior=Object.fromEntries(Object.entries(historicalCalls(b)).filter(([k])=>!b.expansion1110.addedCalls.includes(k))),sort=v=>Array.isArray(v)?v.map(sort):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,sort(v[k])])):v;assert.equal(Object.keys(prior).length,b.expansion1110.originalCallCount);assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(sort(prior))).digest('hex'),b.expansion1110.originalCallsCanonicalSha256);for(const side of ['left','right'])assert.equal(publication(ROOT,'Carousel','navigation.solid-xl.'+side).newPages,true);for(const name of ['light','dark','navigation.solid-l.left','navigation.solid-s.left','navigation.solid56.left'])assert.equal(publication(ROOT,'Carousel',name).newPages,false);});
