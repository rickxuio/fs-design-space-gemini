#!/usr/bin/env node
'use strict';
// Saved design declarations and node positions. Never frontend/computed-style evidence.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),SOURCE='components/sources/icon-button/mastergo-original-components.json',OUTPUT='components/sources/icon-button/design-inventory.json',SET='56279:012691';
const roles={
 'icon-filter.svg':'筛选按钮','icon-grid-view.svg':'宫格按钮','icon-list-view.svg':'列表按钮',
 'icon-close.svg':'删除按钮-2','icon-button-close-s.svg':'删除按钮-2','icon-download.svg':'下载按钮','icon-delete.svg':'删除按钮-1',
 'icon-search.svg':'搜索','icon-button-search-m-default.svg':'搜索','icon-eye.svg':'显示','icon-eye-off.svg':'隐藏','icon-more.svg':'dot','icon-edit.svg':'编辑'
};
function edges(s){const a=s.trim().split(/\s+/).map(v=>Number.parseFloat(v));if(a.some(n=>!Number.isFinite(n)))throw Error('Invalid padding declaration');return a.length===1?[a[0],a[0],a[0],a[0]]:a.length===2?[a[0],a[1],a[0],a[1]]:a.length===4?a:[];}
function inventory(root=ROOT){
 const bytes=fs.readFileSync(path.join(root,SOURCE)),saved=JSON.parse(bytes),dsl=saved.dsl;
 if(saved.role!=='original-components'||!Array.isArray(dsl?.nodes)||!dsl.styles)throw Error('IconButton saved typed source mismatch');
 const sets=dsl.nodes.filter(n=>n.id===SET);
 if(sets.length!==1||sets[0].type!=='COMPONENT_SET')throw Error('IconButton COMPONENT_SET identity mismatch');
 const components=sets[0].children||[];
 if(components.length!==32||components.some(n=>n.type!=='COMPONENT')||new Set(components.map(n=>n.id)).size!==32)throw Error('IconButton COMPONENT identity/count mismatch');
 const paint=reference=>{if(!dsl.styles[reference]||!Array.isArray(dsl.styles[reference].value))throw Error('Unknown IconButton source paint '+reference);return {reference,values:dsl.styles[reference].value,token:dsl.styles[reference].token||null};};
 const instances=components.map(n=>{
  const icons=(n.children||[]).filter(child=>child.type==='INSTANCE'&&child.componentId!=='671:385');
  if(icons.length!==1)throw Error('IconButton source icon or gesture classification mismatch');
  const icon=icons[0],l=n.layoutStyle,i=icon.layoutStyle;
  if(!l||!i||![l.width,l.height,i.width,i.height,i.relativeX,i.relativeY].every(Number.isFinite))throw Error('IconButton missing saved geometry');
  return {nodeId:n.id,type:n.type,properties:n.componentInfo?.properties||{},dimensions:l,declaredPadding:n.flexContainerInfo?.padding,borderRadius:n.borderRadius,fill:paint(n.fill),stroke:n.strokeColor?paint(n.strokeColor):null,strokeWidth:n.strokeWidth||null,
   icon:{nodeId:icon.id,type:icon.type,componentId:icon.componentId,dimensions:i},
   realizedInsets:{top:i.relativeY,right:l.width-i.relativeX-i.width,bottom:l.height-i.relativeY-i.height,left:i.relativeX},
   excludedAnnotations:(n.children||[]).filter(child=>child.componentId==='671:385').map(child=>({nodeId:child.id,type:child.type,componentId:child.componentId,reason:'saved hand-cursor annotation, not button icon or implemented hover behavior'}))};
 });
 const contract=JSON.parse(fs.readFileSync(path.join(root,'components/contracts/icon-button.json'))),finiteMatches=[];
 for(const variant of contract.aiContract.supported){
  const v=contract.variants.find(n=>n.name===variant),p=v.styleProperties,checked=variant==='bordered-xl-checked'?'on':'off';
  for(const file of contract.aiContract.variants[variant].bindings.icon.values){
   const role=roles[path.basename(file)];if(!role)throw Error('IconButton unclassified local icon');
   const match=instances.filter(n=>n.properties['类型']===role&&n.properties.hover==='off'&&n.properties.checked===checked&&n.dimensions.width===Number.parseFloat(p.width)&&n.dimensions.height===Number.parseFloat(p.height)&&n.icon.dimensions.width===Number.parseFloat(p.iconWidth)&&n.icon.dimensions.height===Number.parseFloat(p.iconHeight));
   if(match.length!==1)throw Error(`IconButton ${variant}/${file}: expected one saved COMPONENT geometry/role match`);
   const n=match[0],localPadding=edges(p.padding),sourcePadding=edges(n.declaredPadding),realized=Object.values(n.realizedInsets),paddingMatch=JSON.stringify(localPadding)===JSON.stringify(sourcePadding);
   const adaptation=variant==='plain-s'&&JSON.stringify(localPadding)==='[3,3,3,3]'&&JSON.stringify(sourcePadding)==='[6,6,6,6]'&&JSON.stringify(realized)==='[3,3,3,3]';
   if(!paddingMatch&&!adaptation)throw Error(`IconButton ${variant}: unregistered source/local padding difference`);
   const expectedFill=p.background==='transparent'?[]:[p.background];
   const border=p.border==='none'?null:p.border.match(/^(\d+px) solid (#[A-Fa-f0-9]{6})$/);
   if(JSON.stringify(n.fill.values)!==JSON.stringify(expectedFill)||n.borderRadius!==p.borderRadius||(border?(n.strokeWidth!==border[1]||JSON.stringify(n.stroke?.values)!==JSON.stringify([border[2]])):n.stroke!==null))throw Error(`IconButton ${variant}: saved surface/border declaration mismatch`);
   finiteMatches.push({variant,icon:file,nodeId:n.nodeId,sourceIconNodeId:n.icon.nodeId,sourceIconComponentId:n.icon.componentId,status:'saved-design-role-geometry-surface-match',padding:{local:p.padding,sourceDeclared:n.declaredPadding,sourceRealizedInsets:n.realizedInsets,status:paddingMatch?'declaration-match':'existing-local-inset-adaptation; browser-validation-pending'},compared:['actual COMPONENT identity','source role/hover-off/checked property','container and icon geometry','radius/background/stroke declarations'],notCompared:['SVG artwork equivalence','computed CSS','layout overflow/flex geometry','actual hover/focus/disabled behavior','visual approval']});
  }
 }
 if(new Set(finiteMatches.map(n=>n.nodeId)).size!==finiteMatches.length)throw Error('IconButton finite roles reuse source identity');
 const declarations=require('./icon-button-declarations').reader(root),stateMatches=finiteMatches.map(m=>{
  const variant=contract.variants.find(v=>v.name===m.variant),p=variant.styleProperties,def=instances.find(n=>n.nodeId===m.nodeId),hovers=instances.filter(n=>n.properties['类型']===def.properties['类型']&&n.properties.hover==='on'&&n.properties.checked===def.properties.checked&&n.dimensions.width===def.dimensions.width&&n.dimensions.height===def.dimensions.height&&n.icon.dimensions.width===def.icon.dimensions.width&&n.icon.dimensions.height===def.icon.dimensions.height);
  if(m.variant.startsWith('plain-')&&hovers.length!==1||m.variant.startsWith('bordered-')&&hovers.length!==0)throw Error('IconButton saved Hover partition changed; review source before rebuilding');
  const hover=hovers[0];if(hover&&hover.icon.componentId!==def.icon.componentId)throw Error('IconButton Hover substituted source icon INSTANCE');
  return {variant:m.variant,icon:m.icon,defaultNodeId:m.nodeId,defaultDeclarations:declarations.compare(m.variant,'Default',def,variant.cssClass,p),hoverNodeId:hover?.nodeId||null,hoverDeclarations:hover?declarations.compare(m.variant,'Hover',hover,variant.cssClass,p):null,hoverStatus:hover?'typed-source-and-explicit-class-declaration-match':'no-typed-Hover-source; checked Default is not substituted for Hover'};
 });
 if(stateMatches.filter(m=>m.hoverNodeId).length!==13||new Set(stateMatches.filter(m=>m.hoverNodeId).map(m=>m.hoverNodeId)).size!==13)throw Error('IconButton finite Hover coverage changed');

 return {schemaVersion:'fs-icon-button-design-inventory/1.1.0',source:{file:SOURCE,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),fileId:saved.fileId,capturedAt:saved.checkedAt,remoteRevisionProvided:false},set:{nodeId:SET,type:'COMPONENT_SET',name:sets[0].name},instances,finiteMatches,stateMatches,declarationSources:declarations.files,summary:{designComponents:32,localVariantCalls:contract.aiContract.supported.length,registeredIconPairs:finiteMatches.length,matchedSavedNodes:finiteMatches.length,existingPaddingAdaptations:finiteMatches.filter(n=>n.padding.status!=='declaration-match').length,matchedDefaultDeclarations:15,matchedHoverPairs:13,missingBorderedHoverSources:2},limits:['Node types establish component identity; specification document is separately indexed.','Saved design DSL is not original frontend source or browser rendering.','S has declared padding 6px but saved icon insets 3px. Existing current CSS/contract use 3px; this is an adaptation, not a source-padding match.','Hand cursor INSTANCE 671:385 is a saved annotation, not another icon or implemented hover behavior.','Plain Hover checks only explicit simulation classes. Bordered Hover has no typed source counterpart and is not inferred from checked state.','Unregistered pinned/calendar icons, SVG contours, full specification and browser acceptance remain pending.']};
}
if(require.main===module){const i=inventory();fs.writeFileSync(path.join(ROOT,OUTPUT),JSON.stringify(i,null,2)+'\n');console.log(JSON.stringify(i.summary));}
function validatePreviewStateBoundary(html,checked){
 const missing=checked.stateMatches.filter(m=>m.variant.startsWith('bordered')&&m.hoverNodeId===null);
 const d=new (require('jsdom').JSDOM)(html);
 try {
  if(missing.length&&d.window.document.querySelector('.ds-icon-btn--bordered.ds-icon-btn--hover'))throw Error('IconButton: unverified independent bordered Hover cannot be a source-backed showcase');
  return {status:'finite-preview-state-boundary-checked',missingOwnHoverVariants:[...new Set(missing.map(m=>m.variant))],scope:'Static bordered Hover showcase only; actual hover behavior and complete source coverage remain unapproved'};
 }finally{d.window.close();}
}
module.exports={inventory,SOURCE,OUTPUT,validatePreviewStateBoundary};
