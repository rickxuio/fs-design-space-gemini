'use strict';
// Restricted plain class declarations. Not browser cascade, font loading or SVG paint.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {parseTopLevelRules,splitSelectors,parseDeclarations}=require('./compile-component-style-manifest');
const CSS=['components/components.css','components/video-button-current.css'],TOKENS='components/tokens.css';
function reader(root){
 const files={},defs=new Map(),tokenBytes=fs.readFileSync(path.join(root,TOKENS));
 const observe=(file,bytes)=>{files[file]=crypto.createHash('sha256').update(bytes).digest('hex');return bytes.toString();};
 for(const m of observe(TOKENS,tokenBytes).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi))defs.set(m[1],m[2].trim());
 const resolve=(value,seen=new Set())=>value.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(_,name)=>{if(seen.has(name)||!defs.has(name))throw Error('VideoButton unknown/cyclic declaration token '+name);return resolve(defs.get(name),new Set([...seen,name]));});
 let order=0;const rules=[];
 for(const file of CSS)for(const r of parseTopLevelRules(observe(file,fs.readFileSync(path.join(root,file)))))for(const selector of splitSelectors(r.selectorText)){
  if(!/^\.[\w-]+(?:\.[\w-]+)*(?: \.ds-video-btn__(?:text|icon))?$/.test(selector))continue;
  const parts=selector.split(' '),last=parts.at(-1),leaf=last==='.ds-video-btn__text'?'text':last==='.ds-video-btn__icon'?'icon':'root';
  const classes=(parts.length===2?parts[0]:leaf==='root'?parts[0]:'').split('.').filter(Boolean);
  rules.push({selector,leaf,classes,specificity:selector.split('.').length-1,order:order++,declarations:parseDeclarations(r.body)});
 }
 const normalize=s=>String(s).replace(/\s+/g,'').toLowerCase();
 function values(classes,leaf){
  const found=rules.filter(r=>r.leaf===leaf&&r.classes.every(c=>classes.has(c))).sort((a,b)=>a.specificity-b.specificity||a.order-b.order),result={},selectors={};
  for(const r of found)for(const d of r.declarations){if(d.important||d.property==='font'||d.property==='text-decoration-line')throw Error('VideoButton unsupported declaration '+r.selector+'/'+d.property);let value=resolve(d.cssValue);if(d.property==='background'){if(!['none','transparent'].includes(value))throw Error('VideoButton unsupported background shorthand');result['background-color']='transparent';selectors['background-color']=r.selector;}result[d.property]=value;selectors[d.property]=r.selector;}
  return {values:result,selectors};
 }
 function compare(variant,size,state,node,p){
  const classes=new Set(['ds-video-btn','ds-video-btn--'+variant,'ds-video-btn--'+size]);if(state==='Hover')classes.add('ds-video-btn--hover');const r=values(classes,'root'),t=values(classes,'text'),i=values(classes,'icon');
  const expected={height:node.height,gap:node.gap,radius:node.radius,backgroundColor:node.fill,fontSize:node.font.size+'px',lineHeight:node.font.lineHeight+'px',fontWeight:String(node.font.weight),fontFamily:node.font.family,color:node.color};
  const actual={height:r.values.height,gap:r.values.gap,radius:r.values['border-radius'],backgroundColor:r.values['background-color'],fontSize:t.values['font-size'],lineHeight:t.values['line-height'],fontWeight:t.values['font-weight'],fontFamily:(t.values['font-family']||r.values['font-family']||'').split(',')[0].trim().replace(/^["']|["']$/g,''),color:t.values.color};
  for(const key of Object.keys(expected))if(normalize(actual[key])!==normalize(expected[key]))throw Error(`VideoButton ${variant}/${size}/${state}: saved ${key} differs from explicit CSS declaration`);
  if(normalize(r.values.padding)!==normalize(p.padding))throw Error('VideoButton runtime padding differs from explicit CSS declaration');
  if(['width','height'].some(key=>!Number.isFinite(Number.parseFloat(i.values[key]))||Math.abs(Number.parseFloat(i.values[key])-node.icon[key])>0.00001))throw Error('VideoButton saved icon geometry differs from explicit CSS declaration');
  return {scope:state==='Hover'?'explicit-hover-class-declarations-only':'plain-default-class-declarations-only',sourceNodeId:node.id,declarations:actual,source:expected,runtimePadding:r.values.padding,paddingSourceCorrespondence:size==='s'?'online-source-axis-declarations-confirmed':'same-two-axis-declaration',selectors:{root:r.selectors,text:t.selectors,icon:i.selectors},browserComputedStyles:false,notCompared:['native pseudo-state cascade','host overrides and intrinsic width','SVG contours/filter rendering','actual playback and design navigation']};
 }
 return {compare,files};
}
module.exports={reader,CSS,TOKENS};
