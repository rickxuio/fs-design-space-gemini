#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT=path.resolve(__dirname,'..');
function authoritativeFingerprint(root=ROOT) {
 const folders=['components/contracts','components/token-specs','components/icons','components/preview','components/variants'];
 const inputs=['components/components.css','components/tokens.css','components/selection-mvp-policy.json','components/reference-policy.json','components/local-integration-review.json'];
 for(const dir of folders) for(const f of fs.readdirSync(path.join(root,dir)).sort()) {
  if((dir.endsWith('preview')||dir.endsWith('variants')) && !/\.(html|js)$/.test(f))continue;
  if(!/\.(json|svg|html|js)$/.test(f))continue;
  inputs.push(dir+'/'+f);
 }
 function sourceFiles(dir) {
  if(!fs.existsSync(path.join(root,dir)))return;
  for(const item of fs.readdirSync(path.join(root,dir),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
   const f=dir+'/'+item.name;if(item.isDirectory())sourceFiles(f);else inputs.push(f);
  }
 }
 sourceFiles('components/sources');
 for(const f of fs.readdirSync(path.join(root,'components')).sort())if(f.endsWith('.js') || (f.endsWith('.css') && !['components.css','tokens.css'].includes(f)))inputs.push('components/'+f);
 // Follow only explicit local evidence/index/runtime references, without running
 // a full component compilation on every watch poll or scanning whole archives.
 const metadataFiles=new Set();
 function addLocal(file) {
   if(typeof file!=='string'||!/^(components|docs|pages|page-inputs)\//.test(file))return;
   if(path.isAbsolute(file)||file.split(/[\\/]/).includes('..'))throw Error('Invalid watched source path: '+file);
   inputs.push(file);
 }
 for(const f of fs.readdirSync(path.join(root,'components/contracts')).filter(f=>f.endsWith('.json'))){
   const contract=JSON.parse(fs.readFileSync(path.join(root,'components/contracts',f),'utf8'));
   for(const file of [...(contract.integration?.styles||[]),...(contract.integration?.scripts||[]),...(contract.aiContract?.previewAssets||[])])addLocal(file);
   for(const file of Object.values(contract.aiContract?.evidence||{}))addLocal(file);
   for(const key of ['inventory','specificationIndex','exportIndex']){
     const file=contract.aiContract?.evidence?.[key];if(typeof file==='string'&&file.startsWith('components/')&&file.endsWith('.json'))metadataFiles.add(file);
   }
 }
 for(const file of metadataFiles){
   const index=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
   for(const file of [index.source?.file,index.source?.path,index.source?.refresh,...Object.values(index.sources||{}).map(source=>source?.file)])addLocal(file);
 }
 return crypto.createHash('sha256').update([...new Set(inputs)].sort().map(f=>{
   let data=fs.readFileSync(path.join(root,f));
   if((f.startsWith('components/preview/')||f.startsWith('components/variants/'))&&f.endsWith('.html'))data=Buffer.from(data.toString('utf8').replace(/<!-- AUTO-GENERATED-[A-Z-]+:START -->[\s\S]*?<!-- AUTO-GENERATED-[A-Z-]+:END -->/g,''));
   return f+'\n'+crypto.createHash('sha256').update(data).digest('hex');
 }).join('\n')).digest('hex');
}
function invalidatePreviewStatus(root=ROOT,reason='source validation failed') {
 const file=path.join(root,'components/quality/source-revisions.json');
 if(!fs.existsSync(file))return;
 const previous=JSON.parse(fs.readFileSync(file,'utf8'));let revision;
 try{revision=authoritativeFingerprint(root);}catch(_){revision=crypto.createHash('sha256').update(reason).digest('hex');}
 for(const [id,state] of Object.entries(previous.components||{})){state.engineering='blocked';state.revision=crypto.createHash('sha256').update(revision+id+'blocked').digest('hex');}
 previous.publicationStatus='blocked';const temp=file+'.tmp-'+process.pid;fs.writeFileSync(temp,JSON.stringify(previous,null,2)+'\n');fs.renameSync(temp,file);
}
function sync() {
 const commands=['generate-button-local-runtime.js','sync-carousel-external.js','sync-form-source-example.js','sync-dialog-owned-parts.js','sync-rate-summary.js','sync-icon-card-owned-parts.js','sync-card-owned-lists.js','sync-search-owned-parts.js','sync-list-option-parts.js','sync-five-variant-parts.js','validate-schema.js','validate-tokens.js','check-component-token-annotations.js','check-contracts.js','refresh-component-inventories.js','compile-component-style-manifest.js','generate-preview-tables.js','generate-component-index.js','compile-component-selection-mvp.js','generate-docs.js','compile-component-reference.js','component-quality.js'];
 for(const command of commands) {
  const result=spawnSync(process.execPath,[path.join(ROOT,'scripts',command)],{cwd:ROOT,encoding:'utf8'});
  if(result.status!==0)throw Error(`${command} failed:\n${result.stdout}${result.stderr}`);
 }
 console.log('组件引用已同步：依赖表、反向父关系、选型索引、设计规范与 AI 调用清单。');
}
if(require.main===module) {
 try {sync();}catch(e){try{invalidatePreviewStatus(ROOT,e.message);}catch(_){}console.error(e.message);process.exit(1);}
 if(process.argv.includes('--watch')) {
  let last=authoritativeFingerprint(),busy=false;
  console.log('监听本地组件源文件；MasterGo 在线变化不在此监听范围内。按 Ctrl+C 停止。');
  setInterval(()=>{
   if(busy)return;
   try {const now=authoritativeFingerprint();if(now===last)return;busy=true;last=now;sync();last=authoritativeFingerprint();}
   catch(e){try{invalidatePreviewStatus(ROOT,e.message);}catch(_){}console.error('同步未通过：'+e.message);}
   finally{busy=false;}
  },1000);
 }
}
module.exports={authoritativeFingerprint,invalidatePreviewStatus};
