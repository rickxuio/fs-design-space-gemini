'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const SOURCE='components/sources/tag/semantic-new-source-1014.json';
function validateNewTagSource(root){
 const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8')),dom=new JSDOM(source.code);
 try{const n=dom.window.document.body.firstElementChild,t=n?.firstElementChild;
  if(source.fileId!=='143880409387753'||n?.getAttribute('data-node-id')!=='68908:016413'||n?.getAttribute('data-type')!=='component'||n.style.height!=='20px'||n.style.paddingLeft!=='4px'||n.style.paddingRight!=='4px'||n.style.borderRadius!=='4px'||n.style.background!=='rgb(214, 245, 223)'||t?.style.color!=='rgb(9, 131, 42)'||t?.style.fontSize!=='12px'||t?.style.fontWeight!=='600'||t?.style.lineHeight!=='20px'||t?.textContent.trim()!=='New')throw Error('Original New Tag source mismatch');
 }finally{dom.window.close();}
 return {source:SOURCE,node:source.member};
}
function validateNewTagHosts(root){
 const dom=new JSDOM(fs.readFileSync(path.join(root,'components/variants/card.html'),'utf8'));
 try{const slots=[...dom.window.document.querySelectorAll('.ds-card--embedded-full > .ds-card__tag-slot')];
  if(slots.length!==6)throw Error('Card New Tag call count mismatch');
  for(const slot of slots){const n=slot.firstElementChild,t=n?.firstElementChild;
   if(slot.children.length!==1||n?.className!=='ds-tag ds-tag--semantic ds-tag--new ds-tag--emphasis'||n?.getAttribute('data-tag-source-new')!=='official'||n?.children.length!==1||t?.className!=='ds-tag__label'||t?.textContent.trim()!=='New'||[n,t].some(e=>e.hasAttribute('style')))throw Error('Card must call original New Tag atom without overrides');
  }return {count:slots.length,variant:'semantic-new'};
 }finally{dom.window.close();}
}
module.exports={SOURCE,validateNewTagSource,validateNewTagHosts};
