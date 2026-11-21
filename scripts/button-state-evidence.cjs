'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const REPORT='components/sources/button/open-state-audit-20261114.json';
function stateEvidence(lib,contract,options={}){
 const reportPath=options.reportPath||REPORT;
 const read=f=>JSON.parse(fs.readFileSync(f)),hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
 const safe=name=>{if(typeof name!=='string'||path.isAbsolute(name)||name.split(/[\\/]/).includes('..'))throw Error('Invalid Button state evidence path');const file=path.resolve(lib,name);if(!file.startsWith(path.resolve(lib)+path.sep)||!fs.statSync(file).isFile())throw Error('Missing Button state evidence: '+name);return file;};
 if(!fs.existsSync(path.join(lib,reportPath)))return {info:{status:'not-reviewed'},files:[]};
 const report=read(safe(reportPath)),files=[reportPath,report.sourceFile,...Object.keys(report.runtimeFingerprints||{}),...Object.keys(report.evidenceFingerprints||{})],expected=options.expectedKeys||contract.variants.filter(v=>v.sizes).flatMap(v=>v.sizes.flatMap(s=>['Default','Hover','Disabled','Processing'].map(state=>[v.name,s.name,state].join('/')))).concat(['cart-product-card//Default','cart-product-card//Hover']),actual=(report.rows||[]).map(r=>[r.variant,r.size,r.state].join('/'));
 if(report.schemaVersion!==(options.schema||'fs-button-open-state-audit/1.0.0')||new Set(actual).size!==actual.length)throw Error('Malformed Button state audit');
 const stale=[];if(hash(safe(report.sourceFile))!==report.sourceSha256)stale.push(report.sourceFile);for(const [file,digest]of Object.entries({...report.runtimeFingerprints,...report.evidenceFingerprints}))if(hash(safe(file))!==digest)stale.push(file);
 const coverage=JSON.stringify([...actual].sort())===JSON.stringify([...expected].sort());
 const status=!coverage?'scope-changed':stale.length?'stale':report.status==='passed'&&report.summary?.differences===0?'passed':'differences';
 return {files:[...new Set(files)],info:{status,source:report.source,scope:report.scope,summary:report.summary,report:reportPath,sourceFile:report.sourceFile,checkedAt:report.finishedAt,staleFiles:stale,claim:options.claim||'Finite declared-state properties verified against MG; not whole-family or pixel-identical visual approval',...(options.reportPath?{}:{loadingEvidence:'components/sources/button/mg-open-states-assets-20261114/comparison.json'})}};
}
module.exports={stateEvidence};
