'use strict';
// Restricted declaration comparison for plain default Button class selectors.
// This is intentionally not a browser cascade or rendering calculation.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {parseTopLevelRules,splitSelectors,parseDeclarations}=require('./compile-component-style-manifest');
const CSS='components/components.css',TOKENS='components/tokens.css',CURRENT='components/button-current.css';
function defaultPaintReader(root){
 const cssBytes=fs.readFileSync(path.join(root,CSS)),tokenBytes=fs.readFileSync(path.join(root,TOKENS)),defs=new Map(),byName=new Map();
 for(const m of tokenBytes.toString().matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi))defs.set(m[1],m[2].trim());
 const resolve=(value,seen=new Set())=>String(value).replace(/var\(\s*(--[a-z0-9-]+)\s*\)/gi,(all,name)=>{if(seen.has(name)||!defs.has(name))throw Error('Button default paint unknown/cyclic CSS token '+name);return resolve(defs.get(name),new Set([...seen,name]));});
 for(const file of fs.readdirSync(path.join(root,'components/token-specs')).filter(f=>f.endsWith('.json'))){const spec=JSON.parse(fs.readFileSync(path.join(root,'components/token-specs',file)));for(const t of spec.tokens||[])if(t.cssVar)byName.set(t.name,resolve('var('+t.cssVar+')'));}
 const normalize=v=>String(v).replace(/\s+/g,'').toLowerCase();
  function paddingEdges(value){const parts=String(value).trim().split(/\s+/);if(![1,2,3,4].includes(parts.length)||parts.some(p=>!/^\d+(?:\.\d+)?px$/.test(p)&&p!=='0'))throw Error('Button layout unsupported padding unit/declaration');const n=parts.map(Number.parseFloat);return n.length===1?[n[0],n[0],n[0],n[0]]:n.length===2?[n[0],n[1],n[0],n[1]]:n.length===3?[n[0],n[1],n[2],n[1]]:n;}
 const contractValue=value=>String(value).replace(/([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+)\s*\((.*)\)/gi,(all,name,literal)=>{if(!byName.has(name)||normalize(byName.get(name))!==normalize(literal))throw Error('Button default paint contract token/literal mismatch '+name);return byName.get(name);});
 const currentBytes=fs.readFileSync(path.join(root,CURRENT));
 const rawRules=parseTopLevelRules(cssBytes.toString()+'\n'+currentBytes.toString());
 const rules=rawRules.flatMap((r,index)=>splitSelectors(r.selectorText).filter(s=>/^\.[\w-]+(?:\.[\w-]+)*$/.test(s)).map(selector=>({selector,index,classes:selector.split('.').slice(1),declarations:parseDeclarations(r.body)})));
 const loaders=rawRules.flatMap((r,index)=>splitSelectors(r.selectorText).filter(s=>/^\.[\w-]+(?:\.[\w-]+)* \.ds-btn__icon-loading$/.test(s)).map(selector=>({selector,index,classes:selector.split(' ')[0].split('.').slice(1),declarations:parseDeclarations(r.body)})));
 function valuesFor(classes,entries=rules){
  const applicable=entries.filter(r=>r.classes.every(c=>classes.has(c))).sort((a,b)=>a.classes.length-b.classes.length||a.index-b.index),values={},locations={};
  for(const r of applicable)for(const d of r.declarations){if(d.important||d.property==='background'||d.property==='font'||/^padding-/.test(d.property)||/^border-(top|right|bottom|left|color|width|style)$/.test(d.property))throw Error('Button paint unsupported declaration '+r.selector+'/'+d.property);values[d.property]=resolve(d.cssValue);locations[d.property]=r.selector;}
  return {values,locations};
 }
 function layout(values,source,compareGap=true){
  const runtime={height:values.height,padding:values.padding,gap:values.gap},saved={height:source.dimensions.height+'px',padding:source.flex.padding,gap:source.flex.gap??null};
  if(normalize(runtime.height)!==normalize(saved.height)||(compareGap&&normalize(runtime.gap)!==normalize(saved.gap))||JSON.stringify(paddingEdges(runtime.padding))!==JSON.stringify(paddingEdges(saved.padding)))throw Error('Button saved height/padding/gap differs from explicit layout declaration');
  return {scope:'explicit-class-height-padding-and-applicable-gap-only',declarations:runtime,source:saved,gapComparison:compareGap?'explicit-declaration-match':'not-compared; source single-loader layout versus current hidden-text plus absolute-loader adapter',browserGeometry:false,notCompared:['intrinsic width','main-axis alignment and source content offsets','actual border-box/text layout and native pseudo-state cascade',...(compareGap?[]:['Processing gap/flow semantics and width-preservation adapter approval'])]};
 }
 function read(variant,size,source){
  const {values,locations}=valuesFor(new Set(['ds-btn','ds-btn--'+variant,'ds-btn--'+size]));
  const layoutDeclarations=layout(values,source);
  const declarations={backgroundColor:values['background-color']||'transparent',color:values.color,border:values.border,borderRadius:values['border-radius'],fontFamily:values['font-family']?.split(',')[0].trim().replace(/^[\"']|[\"']$/g,''),fontSize:values['font-size'],fontWeight:values['font-weight'],lineHeight:values['line-height']};
  const expected={backgroundColor:source.fill?.value?.[0]||'transparent',color:source.textColor,border:source.stroke?source.stroke.width+' '+source.stroke.type+' '+source.stroke.value[0]:'none',borderRadius:source.radius,fontFamily:source.font.family,fontSize:source.font.size+'px',fontWeight:String(source.font.weight),lineHeight:source.font.lineHeight+'px'};
  for(const field of Object.keys(expected))if(normalize(declarations[field])!==normalize(expected[field]))throw Error(`Button ${variant}/${size}: saved default ${field} differs from runtime CSS declaration`);
  return {scope:'unconditional-plain-default-class-declarations-only',declarations,source:expected,layoutDeclarations,selectors:locations,browserComputedStyles:false,normalize,contractValue,paddingEdges};
 }
 function readState(variant,size,state,source){
  const classes=new Set(['ds-btn','ds-btn--'+variant,'ds-btn--'+size,'ds-btn--'+state.toLowerCase()]),{values,locations}=valuesFor(classes),fills=[];
  const layoutDeclarations=layout(values,source,state!=='Processing');
  const background=values['background-color']||'transparent';if(background!=='transparent')fills.push(normalize(background));
  const image=values['background-image']||'none';if(image!=='none'){
   const m=image.match(/^linear-gradient\((rgba\([^)]+\)),\s*(rgba\([^)]+\))\)$/);
   if(!m||normalize(m[1])!==normalize(m[2]))throw Error('Button state unsupported paint layer declaration');fills.push(normalize(m[1]));
  }
  if(JSON.stringify(fills.sort())!==JSON.stringify((source.fill?.value||[]).map(normalize).sort()))throw Error(`Button ${variant}/${size}/${state}: saved fill layers differ from CSS class declarations`);
  if(Math.abs(Number(values.opacity||1)-Number(source.opacity??1))>0.000001)throw Error(`Button ${variant}/${size}/${state}: saved opacity differs from CSS class declaration`);
  if(normalize(values.border)!==normalize(source.stroke?source.stroke.width+' '+source.stroke.type+' '+source.stroke.value[0]:'none')||values['border-radius']!==source.radius)throw Error('Button state saved stroke/radius mismatch');
  const result={scope:'explicit-state-class-declarations-only',nodeId:source.nodeId,fillLayers:source.fill?.value||[],cssFillLayers:fills,layerOrderVerified:false,opacity:{saved:source.opacity??1,css:Number(values.opacity||1)},layoutDeclarations,selectors:locations,browserComputedStyles:false};
  if(state==='Processing'){
   const loader=source.loaders;if(loader.length!==1)throw Error('Button Processing needs one typed Loading INSTANCE');
   const props=valuesFor(classes,loaders).values;
   if(props.width!==loader[0].dimensions.width+'px'||props.height!==loader[0].dimensions.height+'px')throw Error(`Button ${variant}/${size}: saved Processing loader dimensions differ from CSS`);
   result.loader={sourceNodeId:loader[0].nodeId,sourceComponentId:loader[0].componentId,width:props.width,height:props.height,svgContourVerified:false};
  }else{
   if(source.textNodes.length!==1||source.textNodes[0].textColorRuns.length!==1)throw Error('Button state full text color declaration missing');const text=source.textNodes[0],run=text.textColorRuns[0];
   if(run.start!==0||run.end!==text.text.map(t=>t.text).join('').length||run.value.length!==1||normalize(values.color)!==normalize(run.value[0]))throw Error(`Button ${variant}/${size}/${state}: saved text color differs from CSS class declaration`);
   result.textColor={source:run.value[0],css:values.color};
  }
  return result;
 }
 return {read,readState,contractValue,normalize,files:{[CURRENT]:crypto.createHash('sha256').update(currentBytes).digest('hex'),[CSS]:crypto.createHash('sha256').update(cssBytes).digest('hex'),[TOKENS]:crypto.createHash('sha256').update(tokenBytes).digest('hex')}};
}
module.exports={defaultPaintReader,CSS,TOKENS};
