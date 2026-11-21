'use strict';
// Exact authored selectors only. No DOM cascade, browser geometry or modal simulation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {parseTopLevelRules,splitSelectors,parseDeclarations}=require('./compile-component-style-manifest');
const CSS='components/components.css',TOKENS='components/tokens.css';
function checkLayout(root,ruleTexts){
 const text=Object.fromEntries(ruleTexts.map(t=>[t.nodeId,t.text]));
 for(const [id,parts] of [['70971:200523',['8px','#000000','30%']],['70971:200234',['480px','650px']],['70971:200128',['换行','第一行','不是固定一行']],['70971:200175',['64px','固定头部+底部','滚动条']],['70971:200154',['始终居中']],['70971:202294/68908:205290',['18px/Semibold/#19191A','20*20px']]]){
  if(parts.some(p=>!text[id]?.includes(p)))throw Error('Dialog selected desktop normative declaration changed '+id);
 }
 const css=fs.readFileSync(path.join(root,CSS)),tokens=fs.readFileSync(path.join(root,TOKENS)),defs=new Map();
 for(const m of tokens.toString().matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi))defs.set(m[1],m[2].trim());
 function resolve(value,seen=new Set()){return value.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(_,name)=>{if(seen.has(name)||!defs.has(name))throw Error('Dialog unknown/cyclic layout token '+name);return resolve(defs.get(name),new Set([...seen,name]));});}
 const norm=s=>s.replace(/\s+/g,'').toLowerCase(),rules=parseTopLevelRules(css.toString());
 const expected={
  '.ds-dialog':{position:'fixed',inset:'0',margin:'auto',width:'650px','max-width':'calc(100vw - 32px * 4)','max-height':'calc(100vh - 32px * 4)',padding:'0',border:'none','border-radius':'8px',background:'#FFFFFF',color:'#19191A',overflow:'hidden'},
  '.ds-dialog[open]':{display:'flex','flex-direction':'column'},
  '.ds-dialog::backdrop':{background:'rgba(0,0,0,0.3)'},
  '.ds-dialog--confirmation':{width:'480px'},
  '.ds-dialog__title':{margin:'0','font-size':'18px','font-weight':'600',color:'#19191A','overflow-wrap':'anywhere'},
  '.ds-dialog__header':{flex:'none'},
  '.ds-dialog__body':{'min-height':'0',overflow:'auto'},
  '.ds-dialog__footer':{flex:'none'},
  '.ds-dialog__close img':{width:'20px',height:'20px'}
 };
 const selectors=Object.entries(expected).map(([selector,required])=>{
  const found=rules.filter(r=>splitSelectors(r.selectorText).includes(selector));if(!found.length)throw Error('Dialog missing explicit layout selector '+selector);
  const values={};for(const r of found)for(const d of parseDeclarations(r.body)){if(d.important)throw Error('Dialog unsupported important layout declaration '+selector);values[d.property]=resolve(d.cssValue);}
  for(const [prop,value] of Object.entries(required))if(norm(values[prop]||'')!==norm(value))throw Error(`Dialog ${selector}: selected desktop ${prop} declaration mismatch`);
  if(selector==='.ds-dialog__title'&&values['white-space']&&values['white-space']!=='normal')throw Error('Dialog title wrapping blocked by white-space declaration');
  return {selector,declarations:Object.fromEntries(Object.keys(required).map(p=>[p,values[p]])),basis:'selected-saved-desktop-normative-rule-and-existing-finite-width',browserComputedStyles:false};
 });
 return {scope:'exact-unconditional-authored-selector-declarations-only',selectors,sources:Object.fromEntries([[CSS,css],[TOKENS,tokens]].map(([file,bytes])=>[file,{file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),frontendSource:true,browserComputedStyles:false}])),notCompared:['full cascade and conditional overrides','actual centering, viewport insets and scrolling','title and close alignment with loaded fonts','native modal top-layer, focus, Escape and backdrop hit-testing','inherited design-instance positions','close hover background/hit-area role matching']};
}
module.exports={checkLayout,CSS,TOKENS};
