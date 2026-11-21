'use strict';
// Saved INSTANCE -> COMPONENT references, not inherited placement or browser proof.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const BUTTON_SOURCE='docs/handoff/archives/2026-10-09-overnight/mastergo/button-shape-component-set.json';
const links=[
 {slot:'cancel',nodeId:'68908:052339/68908:041272',componentId:'hj66450:99105',variant:'filled-gray',size:'xl-regular',color:'灰色'},
 {slot:'confirm',nodeId:'68908:052339/68908:041268',componentId:'hj66450:98573',variant:'filled-red',size:'xl-regular',color:'红色'}
];
function checkButtons(root,original){
 const sources={},read=file=>{const bytes=fs.readFileSync(path.join(root,file));sources[file]={file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),frontendSource:false,browserComputedStyles:false};return JSON.parse(bytes);};
 const saved=read(BUTTON_SOURCE),dsl=JSON.parse(saved.content.find(c=>c.type==='text').text).dsl;
 const sets=dsl.nodes.filter(n=>n.id==='64880:83689');if(sets.length!==1||sets[0].type!=='COMPONENT_SET')throw Error('Dialog footer Button source set identity mismatch');
 const button=read('components/contracts/button.json'),dialog=read('components/contracts/dialog.json');
 const deps=(dialog.relations?.componentDependencies||[]).filter(d=>d.component==='Button'&&d.slot==='footer'&&d.appliesTo?.includes('confirmation'));
 if(deps.length!==1||JSON.stringify(deps[0].requiredSizes)!==JSON.stringify(links.map(({variant,size})=>({variant,size}))))throw Error('Dialog footer Button registered finite sizes mismatch');
 const matches=links.map(link=>{
  const refs=original.all.filter(r=>r.node.id===link.nodeId),defs=(sets[0].children||[]).filter(n=>n.id===link.componentId);
  if(refs.length!==1||refs[0].node.type!=='INSTANCE'||refs[0].node.componentId!==link.componentId||!refs[0].parents.some(p=>p.id==='68908:052339'&&p.type==='INSTANCE')||defs.length!==1||defs[0].type!=='COMPONENT')throw Error('Dialog footer Button typed reference mismatch '+link.slot);
  const node=refs[0].node,definition=defs[0],expected={'颜色':link.color,'状态':'Default','尺寸':'42px/24px','描边':'off','文字是否加粗':'off'};
  for(const [key,value] of Object.entries(expected))if(node.componentInfo?.properties?.[key]!==value||definition.componentInfo?.properties?.[key]!==value)throw Error('Dialog footer Button design properties mismatch '+link.slot+'/'+key);
  const variants=button.variants.filter(v=>v.name===link.variant),sizes=variants.length===1?variants[0].sizes.filter(s=>s.name===link.size):[];
  if(sizes.length!==1||Number.parseFloat(sizes[0].styleProperties.height)!==42||node.layoutStyle?.height!==42||definition.layoutStyle?.height!==42||!deps[0].implementationClasses.includes('ds-btn--'+link.variant)||!deps[0].implementationClasses.includes('ds-btn--'+link.size))throw Error('Dialog footer Button finite call mismatch '+link.slot);
  return {slot:link.slot,nodeId:node.id,type:node.type,componentId:definition.id,definitionType:definition.type,variant:link.variant,size:link.size,designProperties:expected,instanceDimensions:node.layoutStyle,definitionDimensions:definition.layoutStyle,positionResolved:false,browserComputedStyles:false};
 });
 return {scope:'saved-instance-component-reference-and-contract-size-only',sources,matches,notCompared:['inherited child coordinates and resolved footer placement','intrinsic text width and label overrides','host CSS cascade and actual rendered child dimensions','native focus, interaction, SVG and visual approval']};
}
module.exports={checkButtons,BUTTON_SOURCE};
