#!/usr/bin/env node
'use strict';
// Read saved typed design nodes. These declarations are not frontend/browser evidence.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),SOURCE='components/sources/text-button/mastergo-original-components.json',SET='64858:84505';
function inventory(root=ROOT){
 const bytes=fs.readFileSync(path.join(root,SOURCE)),saved=JSON.parse(bytes),dsl=saved.dsl;
 if(!dsl?.nodes||!dsl.styles)throw Error('Missing typed design DSL');
 const all=[];function walk(nodes){for(const n of nodes||[]){all.push(n);walk(n.children);}}walk(dsl.nodes);
 const sets=all.filter(n=>n.id===SET);if(sets.length!==1||sets[0].type!=='COMPONENT_SET')throw Error('TextButton original component-set type/identity mismatch');
 const set=sets[0],components=(set.children||[]).filter(n=>n.type==='COMPONENT');
 if(components.length!==20||new Set(components.map(n=>n.id)).size!==20)throw Error('TextButton saved component coverage/identity mismatch');
 const style=id=>{const item=dsl.styles[id];if(!item)throw Error('Unknown referenced source style: '+id);return item;};
 const paint=id=>({reference:id,values:style(id).value,token:style(id).token||null});
 const instances=components.map(n=>{
  const desc=[];function visit(node){for(const child of node.children||[]){desc.push(child);visit(child);}}visit(n);
  return {nodeId:n.id,type:n.type,name:n.name,properties:n.componentInfo?.properties||{},dimensions:n.layoutStyle,flex:n.flexContainerInfo,
   fill:n.fill?paint(n.fill):null,radius:n.borderRadius||null,
   visibilityProperties:(n.propertiesDefinition||[]).filter(p=>p.type==='VISIBLE').map(p=>({id:p.id,name:p.name,defaultValue:p.defaultValue,relatedLayerId:p.relatedLayerId,targetFound:desc.some(d=>d.id===p.relatedLayerId)})),
   textNodes:desc.filter(d=>d.type==='TEXT').map(text=>({nodeId:text.id,text:text.text,fonts:(text.text||[]).map(run=>({reference:run.font,value:style(run.font).value,token:style(run.font).token||null})),baseFill:text.fill?paint(text.fill):null,textColorRuns:(text.textColor||[]).map(run=>({start:run.start,end:run.end,paint:paint(run.color)})),convenienceColor:text._color||null,colorRule:'textColor ranges override base fill for their explicit range; convenience _color is not the final text color.'})),
   instances:desc.filter(d=>d.type==='INSTANCE').map(d=>({nodeId:d.id,type:d.type,componentId:d.componentId||null,name:d.name,dimensions:d.layoutStyle}))};
 });
 const contract=JSON.parse(fs.readFileSync(path.join(root,'components/contracts/text-button.json'))),colors={'inline-blue':'蓝色','inline-gray':'灰色','inline-black':'黑色','inline-black-bold':'黑色','inline-blue-link':'蓝色','inline-white':'白色','with-bg-default':'灰色带容器'},norm=v=>String(v).replace(/\s+/g,'').toLowerCase(),padding=v=>String(v).trim().split(/\s+/).map(Number.parseFloat);
 const finiteMatches=contract.variants.flatMap(v=>v.sizes.map(s=>{
  const p=s.styleProperties,matches=instances.filter(n=>n.properties['状态']==='Default'&&n.properties['颜色']===colors[v.name]&&n.properties['尺寸']===p.fontSize&&n.properties['文字是否加粗']===(p.fontWeight==='600'?'on':'off'));
  if(matches.length!==1)throw Error(`TextButton ${v.name}/${s.name}: expected one typed design default, found ${matches.length}`);
  const n=matches[0];if(n.textNodes.length!==1||n.textNodes[0].fonts.length!==1||n.textNodes[0].textColorRuns.length!==1)throw Error('TextButton default explicit text declarations are ambiguous');
  const text=n.textNodes[0],f=text.fonts[0].value,run=text.textColorRuns[0];if(run.start!==0||run.end!==text.text.map(t=>t.text).join('').length||run.paint.values.length!==1)throw Error('TextButton default text range incomplete');
  const compared={fontSize:f.size+'px',lineHeight:f.lineHeight+'px',fontWeight:String(f.weight),fontFamily:f.family,color:run.paint.values[0],gap:n.flex.gap};
  for(const [field,value]of Object.entries(compared))if(norm(p[field])!==norm(value))throw Error(`TextButton ${v.name}/${s.name}: saved default ${field} differs from contract`);
  const expectedArrow=v.name==='inline-white'?'icon-text-button-arrow-right-white-l.svg':v.name==='with-bg-default'?'icon-text-button-arrow-right-gray-s-default.svg':v.name==='inline-gray'&&s.name==='s'?'icon-text-button-arrow-right-gray-s-default.svg':(v.name==='inline-blue'&&s.name==='s'||v.name==='inline-blue-link')?'icon-text-button-arrow-right-blue-s.svg':['m','l'].includes(s.name)&&v.name==='inline-black'?'icon-text-button-arrow-right-regular.svg':s.name==='l'&&v.name==='inline-black-bold'?'icon-text-button-arrow-right-bold.svg':'icon-arrow-right.svg';
  const arrows=n.instances.filter(i=>i.componentId==='33189:59138');if(arrows.length!==1||p.defaultIcon!==expectedArrow||p.iconSize!==arrows[0].dimensions.width+'x'+arrows[0].dimensions.height+'px')throw Error('TextButton default arrow identity/dimensions mismatch');
  if(v.name==='with-bg-default'){
   if(p.height!==n.dimensions.height+'px'||JSON.stringify(padding(p.padding))!==JSON.stringify(padding(n.flex.padding))||p.borderRadius!==n.radius||p.backgroundColor!=='transparent'||n.fill!==null)throw Error('TextButton default container declaration mismatch');
   Object.assign(compared,{height:p.height,padding:p.padding,borderRadius:p.borderRadius,explicitFillAbsent:true});
  }
  return {variant:v.name,size:s.name,nodeId:n.nodeId,status:'saved-default-node-to-contract-declaration-match',compared,arrow:{nodeId:arrows[0].nodeId,componentId:arrows[0].componentId,size:p.iconSize,svgContourVerified:false},notCompared:['browser computed CSS','SVG contours/filter rendering','intrinsic text width','hover/disabled behavior','Footer host approval','visual approval']};
 }));
 if(finiteMatches.length!==10||new Set(finiteMatches.map(m=>m.nodeId)).size!==10)throw Error('TextButton local default partition/coverage mismatch');
 const visibilityMatches=instances.map(n=>{
  const p=n.visibilityProperties.filter(p=>p.name==='向右箭头');
  if(p.length!==1 || p[0].defaultValue!==true || !p[0].targetFound || !n.instances.some(i=>i.nodeId===p[0].relatedLayerId&&i.componentId==='33189:59138'))throw Error('TextButton source arrow visibility does not target its actual arrow');
  return {nodeId:n.nodeId,propertyId:p[0].id,arrowNodeId:p[0].relatedLayerId,defaultVisible:true};
 });
 for(const rule of Object.values(contract.aiContract.variants))if(rule.allowedEdits.includes('arrowHidden')){
  const b=rule.bindings.arrowHidden;
  if(!b || b.mode!=='native-attribute'||b.target!=='img.ds-text-btn__icon'||b.attribute!=='hidden'||JSON.stringify(b.values)!=='[false,true]'||b.default!==false||b.sourceProperty!=='向右箭头'||b.sourceInverted!==true)throw Error('TextButton invalid source arrow visibility binding');
 }
 const declarations=require('./text-button-declarations').reader(root);
 const stateMatches=finiteMatches.map(m=>{
  const variant=contract.variants.find(v=>v.name===m.variant),size=variant.sizes.find(s=>s.name===m.size),p=size.styleProperties,def=instances.find(n=>n.nodeId===m.nodeId);
  const hover=instances.filter(n=>n.properties['状态']==='Hover'&&n.properties['颜色']===colors[m.variant]&&n.properties['尺寸']===p.fontSize&&n.properties['文字是否加粗']===(p.fontWeight==='600'?'on':'off'));
  if(hover.length!==1||hover[0].textNodes.length!==1||hover[0].textNodes[0].fonts.length!==1||hover[0].textNodes[0].textColorRuns.length!==1)throw Error('TextButton unique typed Hover pair missing');
  const n=hover[0],t=n.textNodes[0],run=t.textColorRuns[0];if(run.start!==0||run.end!==t.text.map(t=>t.text).join('').length||run.paint.values.length!==1)throw Error('TextButton Hover full text range missing');
  const arrows=n.instances.filter(i=>i.componentId==='33189:59138');if(arrows.length!==1||arrows[0].dimensions.width!==12||arrows[0].dimensions.height!==12)throw Error('TextButton Hover typed arrow dimensions mismatch');
  const calls=contract.aiContract.variants[m.variant].sizes.filter(s=>s.name===m.size);if(calls.length!==1||!calls[0].cssClass)throw Error('TextButton finite CSS size identity missing');
  const classes=variant.cssClass+' '+calls[0].cssClass;
  return {variant:m.variant,size:m.size,defaultNodeId:def.nodeId,hoverNodeId:n.nodeId,defaultDeclarations:declarations.compare(m.variant,m.size,'Default',def,classes),hoverDeclarations:declarations.compare(m.variant,m.size,'Hover',n,classes)};
 });
 if(new Set(stateMatches.map(m=>m.hoverNodeId)).size!==10)throw Error('TextButton Hover partition is not unique');

 return {schemaVersion:'fs-typed-text-button-inventory/1.2.0',source:{file:SOURCE,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),fileId:saved.fileId,capturedAt:saved.checkedAt,remoteRevisionProvided:false},set:{nodeId:set.id,type:set.type,name:set.name},instances,finiteMatches,stateMatches,visibilityMatches,declarationSources:declarations.files,summary:{componentSets:1,designComponents:20,localSizeCalls:10,matchedDefaults:10,matchedHoverPairs:10,frontendVariantCountNotInferred:true},limits:['Actual saved COMPONENT_SET/COMPONENT types establish component identity; left/right position and wrapper names do not.','Visibility property declarations and design fonts/colors are not browser computed styles.','TextButton design properties do not independently approve Footer adapter or its black/S class.','Independent complete specification and current browser proof remain pending.']};
}
if(require.main===module){const result=inventory();fs.writeFileSync(path.join(ROOT,'components/sources/text-button/design-inventory.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result.summary));}
module.exports={inventory,SOURCE};
