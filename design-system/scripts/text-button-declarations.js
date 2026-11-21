'use strict';
// Restricted plain class declarations. Not browser cascade, font loading or SVG paint.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {parseTopLevelRules,splitSelectors,parseDeclarations}=require('./compile-component-style-manifest');
const CSS=['components/components.css','components/text-button-current.css'],TOKENS='components/tokens.css';
function reader(root){
 const files={},defs=new Map(),tokenBytes=fs.readFileSync(path.join(root,TOKENS));
 const observe=(file,bytes)=>{files[file]=crypto.createHash('sha256').update(bytes).digest('hex');return bytes.toString();};
 for(const m of observe(TOKENS,tokenBytes).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi))defs.set(m[1],m[2].trim());
 const resolve=(value,seen=new Set())=>value.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(_,name)=>{if(seen.has(name)||!defs.has(name))throw Error('TextButton unknown/cyclic declaration token '+name);return resolve(defs.get(name),new Set([...seen,name]));});
 let order=0;const rules=[];
 for(const file of CSS)for(const r of parseTopLevelRules(observe(file,fs.readFileSync(path.join(root,file)))))for(const selector of splitSelectors(r.selectorText)){
  if(!/^\.[\w-]+(?:\.[\w-]+)*(?: \.ds-text-btn__(?:text|icon))?$/.test(selector))continue;
  const parts=selector.split(' '),last=parts.at(-1),leaf=last==='.ds-text-btn__text'?'text':last==='.ds-text-btn__icon'?'icon':'root';
  const classes=(parts.length===2?parts[0]:leaf==='root'?parts[0]:'').split('.').filter(Boolean);
  rules.push({selector,leaf,classes,specificity:selector.split('.').length-1,order:order++,declarations:parseDeclarations(r.body)});
 }
 const normalize=s=>String(s).replace(/\s+/g,'').toLowerCase();
 function values(classes,leaf){
  const found=rules.filter(r=>r.leaf===leaf&&r.classes.every(c=>classes.has(c))).sort((a,b)=>a.specificity-b.specificity||a.order-b.order),result={},selectors={};
  for(const r of found)for(const d of r.declarations){if(d.important||d.property==='font'||d.property==='text-decoration-line')throw Error('TextButton unsupported declaration '+r.selector+'/'+d.property);let value=resolve(d.cssValue);if(d.property==='background'){if(!['none','transparent'].includes(value))throw Error('TextButton unsupported background shorthand');result['background-color']='transparent';selectors['background-color']=r.selector;}result[d.property]=value;selectors[d.property]=r.selector;}
  return {values:result,selectors};
 }
 function compare(variant,size,state,node,rootClasses){
  const classes=new Set(rootClasses.split(/\s+/));if(state==='Hover')classes.add('ds-text-btn--hover');const r=values(classes,'root'),t=values(classes,'text'),i=values(classes,'icon'),text=node.textNodes[0],f=text.fonts[0].value,run=text.textColorRuns[0];
  const expected={fontFamily:f.family,fontSize:f.size+'px',fontWeight:String(f.weight),lineHeight:f.lineHeight+'px',textDecoration:f.decoration,color:run.paint.values[0],gap:node.flex.gap,backgroundColor:node.fill?.values?.[0]||'transparent'},actual={fontFamily:(t.values['font-family']||r.values['font-family']||'').split(',')[0].trim().replace(/^["']|["']$/g,''),fontSize:t.values['font-size'],fontWeight:t.values['font-weight'],lineHeight:t.values['line-height'],textDecoration:t.values['text-decoration']||r.values['text-decoration'],color:t.values.color,gap:r.values.gap,backgroundColor:r.values['background-color']};
  for(const key of Object.keys(expected))if(normalize(actual[key])!==normalize(expected[key]))throw Error(`TextButton ${variant}/${size}/${state}: saved ${key} differs from explicit CSS declaration`);
  if(i.values.width!=='12px'||i.values.height!=='12px')throw Error('TextButton explicit arrow dimensions differ from saved INSTANCE');
  if(node.properties['颜色']==='灰色带容器'){
   for(const [key,cssProperty,want] of [['height','height',node.dimensions.height+'px'],['borderRadius','border-radius',node.radius]])if(normalize(r.values[cssProperty])!==normalize(want))throw Error('TextButton container '+key+' differs from explicit CSS declaration');
   const padding=s=>String(s).trim().split(/\s+/).map(Number.parseFloat);if(JSON.stringify(padding(r.values.padding))!==JSON.stringify(padding(node.flex.padding)))throw Error('TextButton container padding differs from explicit CSS declaration');
  }
  return {scope:state==='Hover'?'explicit-hover-class-declarations-only':'plain-default-class-declarations-only',declarations:actual,source:expected,selectors:{root:r.selectors,text:t.selectors,icon:i.selectors},browserComputedStyles:false,notCompared:['native pseudo-state cascade','host overrides and inherited default styles','SVG contour/filter rendering and arrow stroke weight','intrinsic text width and loaded font rendering']};
 }
 return {compare,files};
}
module.exports={reader,CSS,TOKENS};
