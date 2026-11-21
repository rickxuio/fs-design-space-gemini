'use strict';
// Restricted plain class declarations. Not browser cascade, font loading or SVG paint.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {parseTopLevelRules,splitSelectors,parseDeclarations}=require('./compile-component-style-manifest');
const CSS=['components/components.css','components/icon-button-current.css'],TOKENS='components/tokens.css';
function reader(root){
 const files={},defs=new Map(),tokenBytes=fs.readFileSync(path.join(root,TOKENS));
 const observe=(file,bytes)=>{files[file]=crypto.createHash('sha256').update(bytes).digest('hex');return bytes.toString();};
 for(const m of observe(TOKENS,tokenBytes).matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi))defs.set(m[1],m[2].trim());
 const resolve=(value,seen=new Set())=>value.replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(_,name)=>{if(seen.has(name)||!defs.has(name))throw Error('IconButton unknown/cyclic declaration token '+name);return resolve(defs.get(name),new Set([...seen,name]));});
 let order=0;const rules=[];
 for(const file of CSS)for(const r of parseTopLevelRules(observe(file,fs.readFileSync(path.join(root,file)))))for(const selector of splitSelectors(r.selectorText)){
  const pressedAttribute='[aria-pressed="true"]',checked=selector.endsWith(pressedAttribute),plain=checked?selector.slice(0,-pressedAttribute.length):selector;
  if(!/^\.[\w-]+(?:\.[\w-]+)*(?: \.ds-icon-btn__icon)?$/.test(plain))continue;
  const parts=plain.split(' '),last=parts.at(-1),leaf=last==='.ds-icon-btn__icon'?'icon':'root';
  const classes=(parts.length===2?parts[0]:leaf==='root'?parts[0]:'').split('.').filter(Boolean);
  rules.push({selector,leaf,classes,checked,specificity:plain.split('.').length-1+(checked?1:0),order:order++,declarations:parseDeclarations(r.body)});
 }
 const normalize=s=>String(s).replace(/\s+/g,'').toLowerCase();
 function values(classes,leaf,pressed){
  const found=rules.filter(r=>r.leaf===leaf&&(!r.checked||pressed)&&r.classes.every(c=>classes.has(c))).sort((a,b)=>a.specificity-b.specificity||a.order-b.order),result={},selectors={};
  for(const r of found)for(const d of r.declarations){if(d.important||d.property==='font'||d.property==='text-decoration-line'||/^padding-/.test(d.property)||(/^border-/.test(d.property)&&!['border-color','border-radius'].includes(d.property)))throw Error('IconButton unsupported declaration '+r.selector+'/'+d.property);let value=resolve(d.cssValue);if(d.property==='background'){if(!/^(?:none|transparent|#[a-f0-9]{6}|rgba\([^)]+\))$/i.test(value))throw Error('IconButton unsupported background shorthand');result['background-color']=value==='none'?'transparent':value;selectors['background-color']=r.selector;}result[d.property]=value;selectors[d.property]=r.selector;}
  return {values:result,selectors};
 }
 function compare(variant,state,node,classes,p){
  const cls=new Set(classes.split(/\s+/));if(state==='Hover')cls.add('ds-icon-btn--hover');const pressed=variant==='bordered-xl-checked',r=values(cls,'root',pressed),i=values(cls,'icon',pressed),expected={width:node.dimensions.width+'px',height:node.dimensions.height+'px',radius:node.borderRadius,background:node.fill.values[0]||'transparent',padding:p.padding,iconWidth:node.icon.dimensions.width+'px',iconHeight:node.icon.dimensions.height+'px'},actual={width:r.values.width,height:r.values.height,radius:r.values['border-radius'],background:r.values['background-color'],padding:r.values.padding,iconWidth:i.values.width,iconHeight:i.values.height};
  for(const key of Object.keys(expected))if(normalize(actual[key])!==normalize(expected[key]))throw Error(`IconButton ${variant}/${state}: saved/runtime ${key} differs from explicit CSS declaration`);
  const border=r.values.border||'',stroke=border==='none'?'none':border.match(/^(\d+px) (solid) (#[a-f0-9]{6})$/i);
  if(stroke===null||stroke===''||(node.stroke?(stroke==='none'||stroke[1]!==node.strokeWidth||normalize(r.values['border-color']||stroke[3])!==normalize(node.stroke.values[0])):stroke!=='none'))throw Error('IconButton saved stroke differs from explicit CSS declaration');
  return {scope:state==='Hover'?'explicit-hover-class-declarations-only':'plain-default-and-finite-pressed-attribute-declarations-only',sourceNodeId:node.nodeId,declarations:actual,source:expected,border:{declaration:border,effectiveDeclaredColor:r.values['border-color']||null,sourceWidth:node.strokeWidth,sourceColor:node.stroke?.values||[]},selectors:{root:r.selectors,icon:i.selectors},browserComputedStyles:false,notCompared:['native pseudo-state cascade','actual insets and flex overflow','S declared 6px versus stored 3px insets adaptation approval','SVG contours and loaded asset rendering','host and focus/disabled behavior']};
 }
 return {compare,files};
}
module.exports={reader,CSS,TOKENS};
