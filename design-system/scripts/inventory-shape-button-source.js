#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),SOURCE='docs/handoff/archives/2026-10-09-overnight/mastergo/button-shape-component-set.json',OUTPUT='components/sources/button/design-inventory.json';
function inventory(root=ROOT){
 const bytes=fs.readFileSync(path.join(root,SOURCE)),saved=JSON.parse(bytes),dsl=JSON.parse(saved.content.find(c=>c.type==='text').text).dsl;
 const set=dsl.nodes.find(n=>n.id==='64880:83689');
 if(set?.type!=='COMPONENT_SET')throw Error('Button source COMPONENT_SET identity mismatch');
 const components=set.children.filter(n=>n.type==='COMPONENT');
 if(components.length!==60||new Set(components.map(n=>n.id)).size!==60)throw Error('Button source component count/identity mismatch');
 const style=id=>{if(!dsl.styles[id])throw Error('Unknown Button source style '+id);return dsl.styles[id];};
 const instances=components.map(n=>{
  const desc=[];function walk(node){for(const c of node.children||[]){desc.push(c);walk(c);}}walk(n);
  return {nodeId:n.id,type:n.type,properties:n.componentInfo?.properties||{},dimensions:n.layoutStyle,flex:n.flexContainerInfo,
   fill:n.fill?{reference:n.fill,value:style(n.fill).value}:null,
   stroke:n.strokeColor?{reference:n.strokeColor,value:style(n.strokeColor).value,width:n.strokeWidth,type:n.strokeType,align:n.strokeAlign}:null,radius:n.borderRadius,
   opacity:n.opacity??null,loaders:(n.children||[]).filter(c=>c.type==='INSTANCE'&&c.componentId==='1634:37848').map(c=>({nodeId:c.id,componentId:c.componentId,dimensions:c.layoutStyle})),
   textNodes:desc.filter(d=>d.type==='TEXT').map(t=>({nodeId:t.id,text:t.text,fonts:(t.text||[]).map(run=>({reference:run.font,value:style(run.font).value})),textColorRuns:(t.textColor||[]).map(run=>({start:run.start,end:run.end,reference:run.color,value:style(run.color).value}))}))};
 });
 const paint=require('./button-default-paint').defaultPaintReader(root);
 const contract=JSON.parse(fs.readFileSync(path.join(root,'components/contracts/button.json'))),colors={red:'红色',black:'黑色',gray:'灰色',white:'白色',blue:'蓝色'};
 const normPadding=s=>s.trim().split(/\s+/).map(v=>Number.parseFloat(v));
 const finiteMatches=contract.variants.filter(v=>v.name!=='cart-product-card').flatMap(v=>v.sizes.map(s=>{
  const [kind,color]=v.name.split('-'),props=s.styleProperties,weight=String(props.fontWeight);
  const matches=instances.filter(n=>n.properties['状态']==='Default'&&n.properties['颜色']===colors[color]&&n.properties['描边']===(kind==='outline'?'on':'off')&&n.properties['文字是否加粗']===(weight==='600'?'on':'off')
    &&n.dimensions.height===Number.parseFloat(props.height)&&JSON.stringify(normPadding(n.flex.padding))===JSON.stringify(normPadding(props.padding))
    &&n.textNodes.some(t=>t.fonts.some(f=>f.value.size===Number.parseFloat(props.fontSize)&&String(f.value.weight)===weight)));
  if(matches.length!==1)throw Error(`Button ${v.name}/${s.name}: expected one typed design default geometry/font match, found ${matches.length}`);
  const source=matches[0];
  if(source.textNodes.length!==1||source.textNodes[0].textColorRuns.length!==1||source.textNodes[0].fonts.length!==1)throw Error('Button default paint needs one explicit complete text color run');
  const text=source.textNodes[0],run=text.textColorRuns[0];
  if(run.start!==0||run.end!==text.text.map(t=>t.text).join('').length||run.value.length!==1)throw Error('Button default paint text range incomplete');
  const localPaint=paint.read(v.name,s.name,{...source,textColor:run.value[0],font:text.fonts[0].value});
  for(const field of ['backgroundColor','color','borderRadius','border','fontFamily','fontSize','fontWeight','lineHeight'])if(props[field]!==undefined&&paint.normalize(paint.contractValue(props[field]))!==paint.normalize(localPaint.declarations[field]))throw Error('Button default paint contract declaration mismatch '+field);
  for(const field of ['height','gap'])if(paint.normalize(props[field])!==paint.normalize(localPaint.layoutDeclarations.declarations[field]))throw Error('Button contract/runtime layout declaration mismatch '+field);
  if(JSON.stringify(localPaint.paddingEdges(props.padding))!==JSON.stringify(localPaint.paddingEdges(localPaint.layoutDeclarations.declarations.padding)))throw Error('Button contract/runtime layout declaration mismatch padding');
  delete localPaint.normalize;delete localPaint.contractValue;delete localPaint.paddingEdges;
  return {variant:v.name,size:s.name,nodeId:source.nodeId,status:'saved-design-default-geometry-font-and-paint-declaration-match',defaultPaint:localPaint,compared:['color/outline/default/bold properties','height','horizontal padding','text font size/weight','explicit root fill/stroke/radius, full textColor and complete font declarations against Token/CSS','explicit runtime height/padding/gap declarations'],notCompared:['computed CSS','intrinsic width','paint rendering','hover/disabled/processing behavior','browser focus','visual approval']};
 }));
 if(new Set(finiteMatches.map(m=>m.nodeId)).size!==finiteMatches.length)throw Error('Button finite calls share a source default; review color/size/bold partition');
 const nativeOpacity=require('./button-processing-opacity').nativeOpacityReader(root);
 let stateMatches;try{stateMatches=finiteMatches.flatMap(m=>{
  const defaultNode=instances.find(n=>n.nodeId===m.nodeId);
  return ['Hover','Disabled','Processing'].map(state=>{
   const candidates=instances.filter(n=>['颜色','描边','文字是否加粗','尺寸'].every(k=>n.properties[k]===defaultNode.properties[k])&&n.properties['状态']===state);
   if(candidates.length!==1)throw Error('Button saved state partition mismatch '+m.variant+'/'+m.size+'/'+state);
   const saved=paint.readState(m.variant,m.size,state,candidates[0]);
   if(['Disabled','Processing'].includes(state)){saved.nativeDisabledOpacity=nativeOpacity.read(m.variant,m.size,state);if(Math.abs(saved.nativeDisabledOpacity.css-candidates[0].opacity)>0.000001)throw Error('Button native disabled opacity mismatch '+m.variant+'/'+m.size+'/'+state);}
   return {variant:m.variant,size:m.size,state,...saved};
  });
 });}finally{nativeOpacity.close();}
 if(stateMatches.length!==finiteMatches.length*3||new Set(stateMatches.map(m=>m.nodeId)).size!==finiteMatches.length*3)throw Error('Button registered source state coverage mismatch');
 return {schemaVersion:'fs-shape-button-design-inventory/1.4.0',runtimeDeclarationFiles:paint.files,source:{file:SOURCE,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),fileId:'143880409387753',remoteRevisionProvided:false},set:{nodeId:set.id,type:set.type,name:set.name},instances,finiteMatches,stateMatches,
  summary:{designComponents:instances.length,localSizeCalls:finiteMatches.length,matchedDefaults:finiteMatches.length,matchedStateDeclarations:stateMatches.length,matchedDefaultLayoutDeclarations:finiteMatches.length,matchedStateLayoutDeclarations:stateMatches.length,matchedHeightPaddingDeclarations:finiteMatches.length+stateMatches.length,matchedGapDeclarations:finiteMatches.length*3,uncomparedProcessingGapDeclarations:finiteMatches.length},limits:['实际节点类型确认组件身份；文档正文单独索引，不靠左右位置。','设计属性对照不等于原前端源码、浏览器计算样式或完整状态验收。','15 size calls cover all 60 saved node declarations, including outline-gray/M. Full browser state acceptance remains pending.','非Default主要通过显式模拟class对照；新增仅Disabled/Processing原生disabled选择器opacity静态模型；不等于实际浏览器pseudo-state、paint绘制顺序、SVG或动画验收。','Processing原始节点只有loader，gap有缺省/10px/4px差异；当前隐藏文字保宽及absolute loader的gap/flow不据此宣称等同或已验收。']};
}
if(require.main===module){const result=inventory();fs.mkdirSync(path.join(ROOT,path.dirname(OUTPUT)),{recursive:true});fs.writeFileSync(path.join(ROOT,OUTPUT),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result.summary));}
module.exports={inventory,SOURCE,OUTPUT};
