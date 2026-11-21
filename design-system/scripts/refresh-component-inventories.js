'use strict';
// Synchronize generated source inventories using the existing, validating builders.
// This refreshes derived declarations; it never records engineering/visual approval.
const fs=require('node:fs'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
function refreshInventories(root=ROOT){
 const contracts=fs.readdirSync(path.join(root,'components/contracts')).filter(f=>f.endsWith('.json')).map(file=>JSON.parse(fs.readFileSync(path.join(root,'components/contracts',file))));
 const declared=new Set(contracts.flatMap(c=>[c.aiContract?.evidence?.inventory,c.aiContract?.evidence?.specificationIndex]).filter(Boolean));
 const builders=[
  [require('./index-button-specification'),'indexSpecification'],
  [require('./inventory-shape-button-source'),'inventory'],
  [require('./inventory-text-button-source'),'inventory','components/sources/text-button/design-inventory.json'],
  [require('./inventory-icon-button-source'),'inventory'],
  [require('./inventory-video-button-source'),'inventory'],
  [require('./inventory-select-source'),'inventory'],
  [require('./inventory-dialog-source'),'inventory'],
 ];
 // Validate every requested inventory before writing any; bad source facts still fail.
 const outputs=builders.flatMap(([builder,method,fallback])=>{
  const file=builder.OUTPUT||fallback;
  if(!declared.has(file))return [];
  return [{file,content:JSON.stringify(builder[method](root),null,2)+'\n'}];
 });
 const changed=[];
 for(const {file,content} of outputs){const target=path.join(root,file);if(fs.existsSync(target)&&fs.readFileSync(target,'utf8')===content)continue;fs.mkdirSync(path.dirname(target),{recursive:true});const temp=target+'.tmp-'+process.pid;fs.writeFileSync(temp,content);fs.renameSync(temp,target);changed.push(file);}
 return changed;
}
if(require.main===module){try{console.log('Refreshed original generated inventories: '+JSON.stringify(refreshInventories()));}catch(error){console.error(error.message);process.exitCode=1;}}
module.exports={refreshInventories};
