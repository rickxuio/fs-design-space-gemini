#!/usr/bin/env node
'use strict';
// Inventory saved design facts, not frontend DOM or browser-computed styles.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const ROOT=path.resolve(__dirname,'..');
const source='components/sources/select/mastergo-original-components.json';
const refresh='docs/handoff/archives/2026-10-09-overnight/mastergo/select-component-region.json';
const output='components/sources/select/source-inventory.json';
function inventory(root=ROOT){
  const bytes=fs.readFileSync(path.join(root,source)),saved=JSON.parse(bytes);
  const refreshBytes=fs.readFileSync(path.join(root,refresh));
  const response=JSON.parse(refreshBytes),dsl=JSON.parse(response.content.find(c=>c.type==='text').text).dsl;
  if(!Array.isArray(dsl?.nodes)||dsl.nodes.length!==1||dsl.nodes[0].id!==saved.rootId||dsl.nodes[0].type!=='FRAME')throw Error('Source root identity mismatch or missing DSL');
  const sets=new Map();
  function walk(nodes){for(const node of nodes||[]){if(node.type==='COMPONENT_SET'){if(sets.has(node.id))throw Error('Duplicate typed component set: '+node.id);sets.set(node.id,node);}walk(node.children);}}
  walk(dsl.nodes);
  if(!Array.isArray(saved.componentSets))throw Error('Source component set coverage mismatch');
  const setIds=new Set(saved.componentSets.map(s=>s.id));if(setIds.size!==saved.componentSets.length)throw Error('Duplicate exported component set');
  if(saved.componentSets.length!==sets.size)throw Error('Source component set coverage mismatch');
  const dom=new JSDOM(saved.html),doc=dom.window.document;
  try {
  function declarations(node){
    const paint=key=>node[key]?{reference:node[key],value:dsl.styles[node[key]]?.value??null}:null;
    return {origin:'saved-typed-design-DSL',dimensions:node.layoutStyle||null,flex:node.flexContainerInfo||null,radius:node.borderRadius??null,fill:paint('fill'),stroke:paint('strokeColor'),strokeWidth:node.strokeWidth??null,strokeType:node.strokeType??null,browserComputedStyles:false};
  }
  function compareRootGeometry(node,designStyle){
    const typed={width:typeof node.layoutStyle?.width==='number'?node.layoutStyle.width+'px':null,height:typeof node.layoutStyle?.height==='number'?node.layoutStyle.height+'px':null,'border-radius':node.borderRadius??null,gap:node.flexContainerInfo?.gap??null};
    return Object.entries(typed).map(([property,value])=>{
      const tool=designStyle[property]??null;
      const normalize=v=>String(v).replace(/\s+/g,'').toLowerCase();
      return {property,typed:value,tool,status:value===null?'no-explicit-typed-declaration':tool===null?'no-explicit-tool-declaration':normalize(value)===normalize(tool)?'same-explicit-declaration':'different-explicit-declaration'};
    });
  }
  const desktop=new Set(['68908:013378','68908:013372','68908:013376','68908:013420']);
  const facts=saved.componentSets.map(set=>{
    const observed=sets.get(set.id);
    const matches=doc.querySelectorAll('[data-node-id="'+set.id+'"]');
    if(!observed || observed.name!==set.name || matches.length!==1 || matches[0].getAttribute('data-type')!=='component-set')throw Error('Source identity mismatch: '+set.id);
    const direct=(observed.children||[]).filter(n=>n.type==='COMPONENT');
    const nodes=[...matches[0].children].filter(n=>n.getAttribute('data-type')==='component');
    if(direct.length!==nodes.length)throw Error('Source coverage mismatch: '+set.id);
    const ids=new Set(direct.map(n=>n.id));
    if(ids.size!==direct.length)throw Error('Duplicate typed component: '+set.id);
    const instances=nodes.map(n=>{
      const id=n.getAttribute('data-node-id');if(!ids.delete(id))throw Error('Duplicate or unexpected design component: '+id);
      const properties=Object.fromEntries([...n.attributes].filter(a=>a.name.startsWith('data-variant-')).map(a=>[a.name.slice(13),a.value]));
      const typedNode=direct.find(node=>node.id===id),typedProperties=typedNode.componentInfo?.properties||{};
      const same=JSON.stringify(Object.entries(properties).sort())===JSON.stringify(Object.entries(typedProperties).sort());
      const designStyle=Object.fromEntries(['width','height','border-radius','background','border-color','border-width','padding-top','padding-right','padding-bottom','padding-left','gap','box-shadow'].filter(k=>n.style.getPropertyValue(k)).map(k=>[k,n.style.getPropertyValue(k)]));
      return {nodeId:id,properties,propertiesOrigin:'saved-tool-HTML-attributes',typedProperties,propertyCorrespondence:same?'same-declared-properties':'different-tool-metadata',
        designStyle,designStyleOrigin:'saved-tool-generated-inline-styles',typedDeclarations:declarations(typedNode),directChildDeclarations:(typedNode.children||[]).map(child=>({nodeId:child.id,type:child.type,componentId:child.componentId??null,declarations:declarations(child),positionResolved:false})),toolRootGeometryChecks:compareRootGeometry(typedNode,designStyle),localCallCorrespondence:'not-established'};
    });
    return {id:set.id,name:set.name,type:observed.type,scope:desktop.has(set.id)?'existing-desktop-source':'excluded-mobile-or-slider',instanceCount:instances.length,instances};
  });
  const footerButtons=[];
  function footer(nodes,parents=[]){for(const node of nodes||[]){
    const slot={'68908:053469/68908:037485':{action:'cancel',color:'灰色',variant:'outline-gray'},'68908:053469/68908:037489':{action:'confirm',color:'黑色',variant:'outline-black'}}[node.id];
    if(slot){
      const props=node.componentInfo?.properties;
      if(node.type!=='INSTANCE'||!parents.some(p=>p.id==='68908:053450'&&p.type==='COMPONENT')||node.layoutStyle?.height!==42||props?.['大小']!=='42px/24px'||props?.['颜色']!==slot.color||props?.['描边']!=='on'||props?.['状态']!=='Default')throw Error('Select footer typed Button size/identity mismatch');
      footerButtons.push({...slot,nodeId:node.id,type:node.type,componentId:node.componentId,dimensions:node.layoutStyle,designProperties:props,atomicSize:'xl',decision:'用户确认原子优先；typed宿主42px/24px与已登记Button XL对应，不采纳旧L36px本地装配',inheritedPositionResolved:false,browserComputedStyles:false});
    }
    footer(node.children,[...parents,{id:node.id,type:node.type}]);
  }}
  footer(dsl.nodes);if(footerButtons.length!==2)throw Error('Select footer Button source coverage mismatch');
  return {schemaVersion:'fs-design-source-inventory/1.4.0',footerButtons,source:{path:source,refresh,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),refreshSha256:crypto.createHash('sha256').update(refreshBytes).digest('hex'),fileId:saved.fileId,pageId:saved.pageId,rootId:saved.rootId,capturedDate:saved.capturedDate,remoteRevision:saved.remoteRevision},
    scope:'saved Select original design region; no new component feeding',sets:facts,
    identity:{basis:'saved COMPONENT_SET/COMPONENT DSL types cross-checked with tool markers and IDs; not container names or positions',originalTypedNodeProof:true,frontendSource:false,browserComputedStyles:false,completeSpecificationIndexed:false},
    summary:{componentSets:facts.length,desktopSets:facts.filter(s=>s.scope==='existing-desktop-source').length,desktopDesignInstances:facts.filter(s=>s.scope==='existing-desktop-source').reduce((n,s)=>n+s.instanceCount,0),toolPropertyDifferences:facts.flatMap(s=>s.instances).filter(n=>n.propertyCorrespondence==='different-tool-metadata').length,desktopToolPropertyDifferences:facts.filter(s=>s.scope==='existing-desktop-source').flatMap(s=>s.instances).filter(n=>n.propertyCorrespondence==='different-tool-metadata').length},
    limits:['Design style declarations are not browser computed values or frontend code','Root and direct child declarations retain their own node IDs/layers; root gap must not be applied as child row gap','Only explicit root width/height/radius/gap are compared to tool inline strings; missing declarations are not filled and local call correspondence remains unestablished','Design instance counts do not equal callable variant counts','Spec document mapping and current visual approval remain pending','Mobile sets and slider excluded from desktop Select implementation','Container names and positions not used as component identity','Tool attribute metadata is separate from saved typed properties; six excluded slider/mobile nodes lose property keys with spaces in the export']};
  } finally {dom.window.close();}
}
if(require.main===module){const result=inventory();fs.writeFileSync(path.join(ROOT,output),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result.summary));}
module.exports={inventory,SOURCE:source,REFRESH:refresh,OUTPUT:output};
