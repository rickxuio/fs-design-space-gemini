#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..'),SOURCE='components/sources/video-button/mastergo-original-components.json',OUTPUT='components/sources/video-button/source-inventory.json',SET='64858:84510';
const normalized=s=>String(s).replace(/\s/g,'').toLowerCase(),near=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=0.00001;
function inventory(root=ROOT){
 const bytes=fs.readFileSync(path.join(root,SOURCE)),saved=JSON.parse(bytes),body=saved.content?.find(n=>n.type==='text');
 if(!body)throw Error('VideoButton missing saved DSL response');
 const dsl=JSON.parse(body.text).dsl,sets=dsl?.nodes?.filter(n=>n.id===SET);
 if(sets?.length!==1||sets[0].type!=='COMPONENT_SET')throw Error('VideoButton COMPONENT_SET identity mismatch');
 const components=sets[0].children||[];
 if(components.length!==24||components.some(n=>n.type!=='COMPONENT')||new Set(components.map(n=>n.id)).size!==24)throw Error('VideoButton COMPONENT identity/count mismatch');
 const style=ref=>{if(!dsl.styles[ref])throw Error('Unknown VideoButton source style '+ref);return dsl.styles[ref];};
 const contract=JSON.parse(fs.readFileSync(path.join(root,'components/contracts/video-button.json'))),matches=[],stateMatches=[],declarations=require('./video-button-declarations').reader(root);
 if(JSON.stringify(contract.aiContract.supported)!=='["dark","light"]')throw Error('VideoButton unsupported source correspondence scope');
 for(const variant of contract.aiContract.supported){
  const rules=contract.aiContract.variants[variant];
  if(JSON.stringify(rules.sizes.map(n=>n.name))!=='["s","l"]')throw Error('VideoButton unsupported source size correspondence scope');
  for(const size of ['s','l']){
   const registeredSize=contract.variants.find(n=>n.name===variant).sizes.find(n=>n.name===size),p=registeredSize.styleProperties,paddingSource=registeredSize.sourceCorrespondence?.padding;
   if(size==='s'&&(paddingSource?.sourceDeclaration!=='8px'||paddingSource.runtimeDeclaration!==p.padding||paddingSource.status!=='online-source-axis-declarations-confirmed'))throw Error('VideoButton saved geometry/font/surface declaration mismatch: S padding correspondence must remain explicit');
   const candidates=components.filter(n=>{const v=n.componentInfo?.properties||{};return v['形状']==='方形'&&v['尺寸']===(size==='s'?'小':'中')&&v['状态']==='Default'&&v['播放']==='off'&&v['反白']===(variant==='light'?'on':'off');});
   if(candidates.length!==1)throw Error(`VideoButton ${variant}/${size}: source role/default identity mismatch`);
   const n=candidates[0],icons=n.children.filter(ch=>ch.type==='INSTANCE'),texts=n.children.filter(ch=>ch.type==='TEXT');
   if(icons.length!==1||texts.length!==1||n.children.length!==2||icons[0].componentId!=='919:783')throw Error('VideoButton icon/text source structure mismatch');
   const text=texts[0],fontRuns=(text.text||[]).map(run=>({reference:run.font,...style(run.font)})),paint=style(n.fill),colors=(text.textColor||[]).map(run=>({start:run.start,end:run.end,reference:run.color,...style(run.color)}));
   const expectedIcon=p.iconSize.split('x').map(Number.parseFloat),i=icons[0].layoutStyle;
   if(!near(n.layoutStyle.height,Number.parseFloat(p.height))||!near(i.width,expectedIcon[0])||!near(i.height,expectedIcon[1])||normalized(n.flexContainerInfo.padding)!==normalized(size==='s'?paddingSource.sourceDeclaration:p.padding)||normalized(n.flexContainerInfo.gap)!==normalized(p.gap)||n.borderRadius!==p.borderRadius||normalized(paint.value?.[0])!==normalized(p.backgroundColor)||fontRuns.length!==1||!fontRuns.every(f=>f.value.family===p.fontFamily&&near(f.value.size,Number.parseFloat(p.fontSize))&&String(f.value.weight)===p.fontWeight&&near(Number(f.value.lineHeight),Number.parseFloat(p.lineHeight)))||!colors.length||colors.some(color=>color.value?.length!==1||normalized(color.value[0])!==normalized(p.color)))throw Error(`VideoButton ${variant}/${size}: saved geometry/font/surface declaration mismatch`);
   const hoverCandidates=components.filter(h=>{const v=h.componentInfo?.properties||{};return v['形状']==='方形'&&v['尺寸']===(size==='s'?'小':'中')&&v['状态']==='Hover'&&v['播放']==='off'&&v['反白']===(variant==='light'?'on':'off');});
   if(hoverCandidates.length!==1)throw Error('VideoButton unique Hover source pair missing');
   function stateData(node){
    const play=node.children.filter(c=>c.type==='INSTANCE'&&c.componentId==='919:783'),texts=node.children.filter(c=>c.type==='TEXT'),annotations=node.children.filter(c=>c.type==='INSTANCE'&&c.componentId==='671:385');
    if(play.length!==1||texts.length!==1||node.children.length!==play.length+texts.length+annotations.length||annotations.length>1)throw Error('VideoButton typed play/text/cursor source structure mismatch');
    const text=texts[0],runs=text.text||[],color=text.textColor||[];if(runs.length!==1||color.length!==1||color[0].start!==0||color[0].end!==runs.map(r=>r.text).join('').length||style(color[0].color).value.length!==1||style(node.fill).value.length!==1)throw Error('VideoButton full source textColor range missing');
    if(!near(node.layoutStyle.height,Number.parseFloat(p.height))||normalized(node.flexContainerInfo.padding)!==normalized(size==='s'?paddingSource.sourceDeclaration:p.padding))throw Error('VideoButton Hover source height/padding declaration mismatch');
    return {id:node.id,height:p.height,gap:node.flexContainerInfo.gap,radius:node.borderRadius,fill:style(node.fill).value[0],font:style(runs[0].font).value,color:style(color[0].color).value[0],icon:play[0].layoutStyle,ignoredAnnotations:annotations.map(a=>({id:a.id,type:a.type,componentId:a.componentId,role:'saved-cursor-annotation-not-UI-icon'}))};
   }
   const def=stateData(n),hover=stateData(hoverCandidates[0]);stateMatches.push({variant,size,defaultNodeId:n.id,hoverNodeId:hover.id,defaultDeclarations:declarations.compare(variant,size,'Default',def,p),hoverDeclarations:declarations.compare(variant,size,'Hover',hover,p),ignoredHoverAnnotations:hover.ignoredAnnotations});
   matches.push({variant,size,nodeId:n.id,nodeType:n.type,sourceName:n.name,designDimensions:{width:n.layoutStyle.width,height:n.layoutStyle.height},iconDimensions:{width:i.width,height:i.height},text:text.text.map(run=>run.text).join(''),font:style(text.text[0].font),fill:n.fill,borderRadius:n.borderRadius,
    declarations:{padding:n.flexContainerInfo.padding,paddingSourceCorrespondence:size==='s'?paddingSource:null,gap:n.flexContainerInfo.gap,fillValues:paint.value,textColorRuns:colors},
    designInteractionReferences:n.interactive||[],localWidth:p.width,
    compared:['actual source types/identity','rectangle/default/not-playing/light property','height, icon geometry, raw source padding/gap and radius; S horizontal/vertical 8px confirmed online','font family/size/weight/line-height','fill and explicit textColor run declarations'],
    notCompared:['sample intrinsic text width; local width remains auto','SVG path artwork','computed CSS','design navigation interpreted as frontend playback','hover/disabled/focus behavior','visual approval']});
  }
 }
 if(new Set(matches.map(n=>n.nodeId)).size!==4)throw Error('VideoButton duplicate finite source identity');
 return {schemaVersion:'fs-design-source-inventory/1.1.0',classification:'actual COMPONENT_SET and COMPONENT nodes, not screen position',source:SOURCE,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),setNodeId:SET,setNodeType:'COMPONENT_SET',directComponents:24,callableSourceMatches:matches,stateMatches,declarationSources:declarations.files,summary:{designComponents:24,matchedDefaults:4,matchedHoverPairs:4,unresolvedSPaddingCalls:0},comparisonPrecision:'Saved icon geometry differs from integer CSS dimensions by less than 0.00001px; no broad layout tolerance.',excluded:'Circle controls, playback/pause states, saved cursor annotations, and large player controls are not mapped into these four finite duration calls; XL remains excluded.',notFrontendSource:true,notComputedStyles:true,limits:['S source and current padding are both 8px; online default axes confirmed separately. Actual frontend rendering/overflow remains pending.','Default/Hover source-to-class declaration checks do not establish native pseudo-state, SVG contours, host layout, font loading or playback.']};
}
if(require.main===module){const i=inventory();fs.writeFileSync(path.join(ROOT,OUTPUT),JSON.stringify(i,null,2)+'\n');console.log(JSON.stringify({designComponents:i.directComponents,finiteSourceCalls:i.callableSourceMatches.length}));}
module.exports={inventory,SOURCE,OUTPUT};
