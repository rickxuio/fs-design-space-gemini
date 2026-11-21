'use strict';
// User-approved atom-first assembly; design-instance overrides remain evidence.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
function checkCloseAtom(root,original){
 const sources={};
 function read(file){const bytes=fs.readFileSync(path.join(root,file));sources[file]={file,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),frontendSource:!file.includes('/sources/'),browserComputedStyles:false};return bytes.toString();}
 const atom=JSON.parse(read('components/contracts/icon-button.json'));
 const host=JSON.parse(read('components/contracts/dialog.json'));
 const deps=host.relations.componentDependencies.filter(d=>d.component==='IconButton'&&d.slot==='header.close');
 if(deps.length!==1||JSON.stringify(deps[0].requiredVariants)!=='["plain-l"]'||!['information','confirmation'].every(v=>deps[0].appliesTo?.includes(v))||deps[0].appliesTo.some(v=>!host.aiContract.supported.includes(v)))throw Error('Dialog close IconButton dependency mismatch');
 const v=atom.variants.find(v=>v.name==='plain-l');
 if(!v||v.cssClass!=='ds-icon-btn ds-icon-btn--plain ds-icon-btn--l'||v.buttonSize!=='32x32px'||v.iconSize!=='20x20px'||v.styleProperties.borderRadius!=='4px'||!atom.aiContract.variants['plain-l'].bindings.icon.values.includes('components/icons/icon-close.svg'))throw Error('Dialog close IconButton atomic call changed; review required');
 for(const file of atom.integration.styles.filter(f=>f!=='components/tokens.css')){
  read(file);if(!host.integration.styles.includes(file))throw Error('Dialog missing IconButton runtime style '+file);
 }
 const saved=JSON.parse(read('components/sources/icon-button/mastergo-original-components.json'));
 const dsl=saved.dsl,all=[];
 function walk(nodes){for(const n of nodes||[]){all.push(n);walk(n.children);}}walk(dsl.nodes);
 const defs=all.filter(n=>n.id==='56279:012458');
 if(defs.length!==1||defs[0].type!=='COMPONENT'||defs[0].layoutStyle.width!==32||defs[0].layoutStyle.height!==32)throw Error('Dialog close IconButton typed source mismatch');
 const instances=original.all.filter(r=>r.node.type==='INSTANCE'&&r.node.componentId==='56279:012458'&&r.parents.some(p=>['68908:048976','68908:052338'].includes(p.id)));
 if(instances.length!==2)throw Error('Dialog close source instance reference missing');
 const css=read('components/dialog-current.css');
 const {parseTopLevelRules,parseDeclarations,splitSelectors}=require('./compile-component-style-manifest');
 const rules=parseTopLevelRules(css),allowed=new Set(['position','top','right']);
 if(rules.length!==1||JSON.stringify(splitSelectors(rules[0].selectorText))!=='[".ds-dialog__close-position"]'||parseDeclarations(rules[0].body).some(d=>!allowed.has(d.property)||d.important))throw Error('Dialog must not override IconButton atomic styles');
 return {scope:'user-approved-atom-first-close-assembly',sources,atom:{component:'IconButton',variant:'plain-l',componentId:'56279:012458',width:32,height:32,iconSize:20,radius:4},savedHostOverrides:instances.map(r=>({nodeId:r.node.id,dimensions:r.node.layoutStyle,radius:r.node.borderRadius||null})),decision:'2026-10-10 用户确认原子优先，嵌套关系重要；旧宿主28px/3px覆盖不再采用。',browserComputedStyles:false,visualApproved:false};
}
module.exports={checkCloseAtom};
