#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {buildReference}=require('./compile-component-reference');const {renderQualityHtml}=require('./render-component-quality-report');const ROOT=path.resolve(__dirname,'..');
const read=(root,file)=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
function proofDifferences(root,id,pack,proof) {
 const hash=file=>fs.existsSync(path.join(root,file))?crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'):null;
 const fingerprints=proof.toolFingerprints||{}, before=proof.freshness?.fingerprints||{},current=pack.freshness?.fingerprints||{};
 const required=proof.dependencyPolicy?require('./component-proof-profile').profileFor(id,root).tools:require('./component-acceptance-tools').requiredDependencyTools(id,Object.keys(fingerprints));
 return {
  missingTools:required.filter(file=>!Object.hasOwn(fingerprints,file)),
  changedTools:Object.keys(fingerprints).filter(file=>hash(file)!==fingerprints[file]),
  changedSources:[...new Set([...Object.keys(before),...Object.keys(current)])].filter(file=>before[file]!==current[file]),
  changedSourceMetadata:[...new Set([...Object.keys(proof.freshness||{}),...Object.keys(pack.freshness||{})])].filter(k=>k!=='fingerprints'&&JSON.stringify(proof.freshness?.[k])!==JSON.stringify(pack.freshness?.[k]))
 };
}
function acceptanceStatus(root,id,pack){
 const file=path.join(root,'components/quality/acceptance.json');
 if(!fs.existsSync(file))return {status:'not-reviewed',reason:'没有可追溯的工程验收记录'};
 const proof=JSON.parse(fs.readFileSync(file,'utf8')).components?.[id];
 if(!proof)return {status:'not-reviewed',reason:'该组件尚未登记工程验收'};
 if(!proof.tests?.length || !proof.toolFingerprints || !Object.keys(proof.toolFingerprints).length || proof.result!=='passed')return {status:'blocked',reason:'工程验收未通过'};
 let differences;
 try {
  const policyIssues=require('./component-proof-profile').profileIssues(id,proof,root);
  if(policyIssues.length)return {status:'blocked',reason:policyIssues.join('；'),rerunCommand:`node scripts/record-component-acceptance.js --component ${id} --acceptance-only`};
  differences=proofDifferences(root,id,pack,proof);
 }catch(error){return {status:'blocked',reason:'验收依赖不可核对：'+error.message,rerunCommand:`node scripts/record-component-acceptance.js --component ${id} --acceptance-only`};}
 if(differences.missingTools.length||differences.changedTools.length||differences.changedSources.length||differences.changedSourceMetadata.length)
  return {status:'stale',reason: differences.changedSources.length||differences.changedSourceMetadata.length ? '组件源或真实依赖已改变，旧测试结果不可沿用' : '验收工具或其依赖已更新，需要按实际影响重新验证',differences,rerunCommand:`node scripts/record-component-acceptance.js --component ${id} --acceptance-only`};
 return {status:'current',tests:proof.tests,visual:proof.visual||'pending'};
}

function acceptanceDiagnostic(id, state) {
 const d=state.differences||{};
 const items=[...['changedSources','changedSourceMetadata','missingTools','changedTools'].flatMap(k=>(d[k]||[]).map(file=>k+':'+file))];
 return `组件工程验收不可用：${state.status}；${state.reason||''}`+(items.length?'；变化='+items.join(', '):'')+'；复验命令='+(state.rerunCommand||`node scripts/record-component-acceptance.js --component ${id} --acceptance-only`);
}

function validSelectionDecision(d){if(!d)return false;if(d.selectionCases?.length)return d.selectionCases.every(x=>['use','avoid','reference'].includes(x.kind)&&x.condition?.trim()&&x.result?.trim())&&d.selectionCases.some(x=>x.kind==='use');return !!(d.whenToUse&&d.whenNotToUse);}
function buildQualityReport(root=ROOT){
 const policy=read(root,'components/selection-mvp-policy.json');
 const files=fs.readdirSync(path.join(root,'components/contracts')).filter(f=>f.endsWith('.json')).sort();
 const all=files.map(f=>({id:f.slice(0,-5),contract:read(root,'components/contracts/'+f)})),byName=new Map(all.map(x=>[x.contract.name,x]));
 const components=all.map(({id,contract:c})=>{
  const decisions=c.relations?.variantDecisions||[],map=policy.components[id]?.variantDecisionTypes||{},issues=[];
  const variants=c.variants.map(v=>{
   const names=map[v.name]||[],selected=names.map(type=>decisions.find(d=>d.type===type)).map(d=>d&&require('./generate-component-index').selectionDecisionText(d));
   if((v.isComplete??c.isComplete)===true && !(v.pendingParts||[]).length && (!selected.length || selected.some(d=>!validSelectionDecision(d))))issues.push({type:'selection-gap',variant:v.name});
   return {name:v.name,available:(v.isComplete??c.isComplete)===true && !(v.pendingParts||[]).length,decisions:selected.filter(Boolean).map(d=>({type:d.type,whenToUse:d.whenToUse,whenNotToUse:d.whenNotToUse,className:d.className}))};
  });
  for(const d of c.relations?.componentDependencies||[]){
   const child=byName.get(d.component)?.contract;
   if(!child || (d.requiredVariants||[]).some(name=>!child.variants.some(v=>v.name===name)))issues.push({type:'dependency-gap',component:d.component});
  }
  if(!c.qualityProfile)issues.push({type:'maintenance-profile-missing'});
  let ai={status:'legacy-needs-slot-migration',supported:[],acceptance:null},pack=null;
  if(c.aiContract){try{pack=buildReference(root,id);ai={status:'structure-checked',supported:pack.selection.supported,acceptance:acceptanceStatus(root,id,pack)};}catch(e){ai={status:'blocked',error:e.message,supported:[]};issues.push({type:'ai-structure-gap',message:e.message});}}
  const evidence=c.aiContract?.evidence||{},fingerprints=pack?.freshness.fingerprints||{};
  // Only paths already validated by the compiler are exposed as current evidence.
  const current=file=>typeof file==='string'&&Object.hasOwn(fingerprints,file)?file:null;
  const sourceInventory=current(evidence.inventory),inventory=sourceInventory?read(root,sourceInventory):null;
  const specificationIndex=current(evidence.specificationIndex)||(inventory?.schemaVersion?.startsWith('fs-dialog-source-inventory/')?sourceInventory:null);
  const specificationFile=current(evidence.spec)||(current(evidence.specificationIndex)?current(read(root,evidence.specificationIndex).source?.file):null);
  const originalComponents=current(evidence.originalComponents||evidence.original);
  const source=Boolean(originalComponents&&specificationFile);
  const exactVariants=variants.filter(v=>ai.supported.includes(v.name)).map(v=>v.name);
  const coverage={exactVariants,uncoveredVariants:variants.filter(v=>!exactVariants.includes(v.name)).map(v=>v.name),familyStatus:c.aiContract?.reviewStatus?.familyCoverage||'not-reviewed',note:'Exact variants are finite authored calls; counts do not establish all sizes/states/hosts, source approval or browser acceptance.'};
  const sourceEvidence={specificationIndex,
   specificationScope:specificationIndex?(inventory?.schemaVersion?.startsWith('fs-dialog-source-inventory/')?'selected-saved-body-texts-only':'saved-section-only'):'not-indexed',
   specificationFile,originalComponents,sourceInventory,
   inventoryStatus:sourceInventory?'current-finite-index':'not-established',
   inventorySummary:inventory?.summary||null,
   validation:pack?.sourceValidation||{componentIdentity:{status:'not-established',files:[]},specificationBody:{status:'not-established',files:[]},originalOnlineFrontendCode:false,browserComputedStyles:false,completeSpecificationCoverage:false},
   acceptanceBoundary:'Source paths and finite indices do not establish complete specification/family coverage, original frontend code, browser geometry or visual approval.'};
  const publication={entries:(pack?.examples||[]).map(e=>({variant:e.name,...e.publication})),newPageCandidates:(pack?.examples||[]).filter(e=>e.publication?.newPages).map(e=>e.name)};
  return {id,name:c.name,variantCount:variants.length,variants,coverage,publication,sourceEvidence,maintenanceRegistered:!!c.qualityProfile,source:source?'original-and-spec-snapshots':'local-library-not-online-revalidated',ai,visual:c.aiContract?.reviewStatus?.visual||'not-recorded',grade:ai.acceptance?.status==='current'?(c.aiContract?.reviewStatus?.visual==='approved'?'benchmark-approved':'engineering-reference-visual-pending'):'migration-required',issues};
 });
 return {schemaVersion:'fs-component-quality/1.0.0',standard:'docs/component-quality-standard.md',summary:{componentCount:components.length,variantCount:components.reduce((n,c)=>n+c.variantCount,0),newPageCandidateCount:components.reduce((n,c)=>n+c.publication.newPageCandidates.length,0),exactVariantCount:components.reduce((n,c)=>n+c.coverage.exactVariants.length,0),uncoveredVariantCount:components.reduce((n,c)=>n+c.coverage.uncoveredVariants.length,0),maintenanceRegistered:components.filter(c=>c.maintenanceRegistered).length,aiStructured:components.filter(c=>c.ai.status==='structure-checked').length,currentEngineering:components.filter(c=>c.ai.acceptance?.status==='current').length,visualApproved:components.filter(c=>c.visual==='approved').length},components};
}
function markdown(report){
 const aiNames={'legacy-needs-slot-migration':'精确槽位待补齐','structure-checked':'精确实例已核对','blocked':'结构检查未通过'};
 const statusNames={'current':'当前版本通过','stale':'已过期，需重跑','not-reviewed':'尚未验收','blocked':'未通过'};
 return '# 已投喂组件质量盘点\n\n自动生成；按源文件与验收指纹判定。维护登记、工程验收、视觉批准分开记录。\n\n'+ '组件 '+report.summary.componentCount+' 个，登记变体 '+report.summary.variantCount+' 个；统一维护标准已登记 '+report.summary.maintenanceRegistered+' 个，当前工程验收通过 '+report.summary.currentEngineering+' 个。\n\n'+'| 组件 | 登记/精确变体 | AI 调用结构 | 工程验收 | 设计来源 | 视觉核对 |\n| --- | --- | --- | --- | --- | --- |\n'+report.components.map(c=>'| '+c.name+' | '+c.variantCount+'/'+c.coverage.exactVariants.length+' | '+aiNames[c.ai.status]+' | '+statusNames[c.ai.acceptance?.status||'not-reviewed']+' | '+(c.source==='original-and-spec-snapshots'?'原始组件及规范快照已保存':'已有本地实现，来源待复核')+' | '+(c.visual==='approved'?'已批准':'待确认')+' |').join('\n')+'\n\n精确槽位待补齐的组件仍按已有契约和 Preview 确认；不属于已通过新标杆。详细选型规则与缺口见同名 JSON。\n';
}
function sourceRevisions(root,report){
 const common=['components/components.css','components/tokens.css',...fs.readdirSync(path.join(root,'components/token-specs')).filter(f=>f.endsWith('.json')).sort().map(f=>'components/token-specs/'+f),...fs.readdirSync(path.join(root,'components')).filter(f=>f.endsWith('.js')).sort().map(f=>'components/'+f),...fs.readdirSync(path.join(root,'components/icons')).filter(f=>f.endsWith('.svg')).sort().map(f=>'components/icons/'+f),'components/preview/reference-live.js'];
 const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file),'utf8').replace(/<!-- AUTO-GENERATED-[A-Z-]+:START -->[\s\S]*?<!-- AUTO-GENERATED-[A-Z-]+:END -->/g,'')).digest('hex');
 const commonHash=common.map(file=>file+':'+hash(file)).join('\n');
 return {schemaVersion:'fs-component-source-revisions/1.0.0',components:Object.fromEntries(report.components.map(c=>{
  const engineering=c.ai.acceptance?.status||'not-reviewed';
  const contract=read(root,'components/contracts/'+c.id+'.json');
  const runtimeFiles=[...new Set([...(contract.integration?.styles||[]),...(contract.integration?.scripts||[])])].sort();
  const runtimeHash=runtimeFiles.map(file=>{
   if(path.isAbsolute(file)||file.split(/[\\/]/).includes('..'))throw Error('Invalid component runtime revision path: '+file);
   return file+':'+hash(file);
  }).join('\n');
  const revision=crypto.createHash('sha256').update(commonHash+runtimeHash+hash('components/contracts/'+c.id+'.json')+hash('components/variants/'+c.id+'.html')+engineering+c.visual).digest('hex');
  return [c.id,{revision,engineering,visual:c.visual}];
 }))};
}
function compile(root=ROOT,check=false){const report=buildQualityReport(root);for(const [name,data] of [['report.json',JSON.stringify(report,null,2)+'\n'],['report.md',markdown(report)],['source-revisions.json',JSON.stringify(sourceRevisions(root,report),null,2)+'\n'],['report.html',renderQualityHtml(report)]]){const file=path.join(root,'components/quality',name);if(check){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==data)throw Error('Quality report stale: '+name);}else{fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp-'+process.pid;fs.writeFileSync(tmp,data);fs.renameSync(tmp,file);}}return report;}
if(require.main===module){try{console.log(JSON.stringify(compile(ROOT,process.argv.includes('--check')).summary));}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={validSelectionDecision,proofDifferences,acceptanceStatus,acceptanceDiagnostic,buildQualityReport,compile,sourceRevisions};
