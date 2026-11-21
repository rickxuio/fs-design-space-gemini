'use strict';
const fs=require('node:fs'),path=require('node:path');
function loadRegistry(root){
 const dir=path.join(root,'components/token-specs'),registry=new Set();
 for(const file of fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort()){
  const data=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
  for(const token of [...(data.tokens||[]),...(data.compositeTokens||[])]){
   if(!token.name || registry.has(token.name))throw Error('Ambiguous token registry: '+file+' / '+token.name);
   registry.add(token.name);
  }
 }
 return registry;
}
function checkReferences(root,contracts){
 const registry=loadRegistry(root),errors=[];
 for(const {file,data} of contracts){
  if(data.tokenReferences===undefined)continue;
  if(!Array.isArray(data.tokenReferences)){errors.push(file+': tokenReferences must be an array');continue;}
  const seen=new Set();
  for(const name of data.tokenReferences){
   if(typeof name!=='string' || !registry.has(name))errors.push(file+': tokenReferences references unknown token '+JSON.stringify(name));
   if(seen.has(name))errors.push(file+': tokenReferences repeats token '+JSON.stringify(name));
   seen.add(name);
  }
 }
 return errors;
}
module.exports={loadRegistry,checkReferences};
