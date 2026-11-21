#!/usr/bin/env node
'use strict';
// Token identifiers are authoritative. Detect stale cached HEX labels in styleProperties.
const fs=require('node:fs'),path=require('node:path');const ROOT=path.resolve(__dirname,'..');
function inspect(root=ROOT,fix=false){
 const registry=new Map();for(const file of fs.readdirSync(path.join(root,'components/token-specs')).filter(f=>f.endsWith('.json'))){const c=JSON.parse(fs.readFileSync(path.join(root,'components/token-specs',file)));for(const t of [...(c.tokens||[]),...(c.compositeTokens||[])])registry.set(t.name,t);}
 const issues=[];
 for(const file of fs.readdirSync(path.join(root,'components/contracts')).filter(f=>f.endsWith('.json'))){const location=path.join(root,'components/contracts',file),c=JSON.parse(fs.readFileSync(location));let changed=false;
 function walk(value,where,inStyle=false){if(!value||typeof value!=='object')return;for(const [key,item]of Object.entries(value)){const place=where+'.'+key;if(typeof item==='object')walk(item,place,inStyle||key==='styleProperties');else if(inStyle&&typeof item==='string')value[key]=item.replace(/([\w-]+\.[\w.-]+)\s*\((#[0-9A-Fa-f]{3,8})\)/g,(all,name,hex)=>{const t=registry.get(name);if(!t || typeof t.value!=='string'||!t.value.startsWith('#')||t.value.toUpperCase()===hex.toUpperCase())return all;issues.push({file,path:place,token:name,annotation:hex,current:t.value});if(!fix)return all;changed=true;return name+' ('+t.value+')';});}}
 walk(c,'contract');if(changed){c.history=c.history||[];c.history.push({date:new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai'}).format(new Date()),author:'Codex',change:'修正 styleProperties 中已声明 Token 的过期色号标注；Token 名称、CSS 与原始来源快照保持不变。'});fs.writeFileSync(location,JSON.stringify(c,null,2)+'\n');}
 }
 return issues;
}
if(require.main===module){const issues=inspect(ROOT,process.argv.includes('--fix'));console.log(JSON.stringify({staleAnnotations:issues.length,issues}));if(issues.length&&!process.argv.includes('--fix'))process.exitCode=1;}
module.exports={inspect};
