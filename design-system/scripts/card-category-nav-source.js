'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const SOURCE='components/sources/card/category-nav-source-1014.json';
function validateCategoryNavSource(root){
 const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 if(source.fileId!=='143880409387753'||source.members.length!==4)throw Error('Card category source identity mismatch');
 for(const [i,member] of source.members.entries()){
  const dom=new JSDOM(member.code);try{const n=dom.window.document.body.firstElementChild,body=n.children[1],title=body.firstElementChild,links=body.children[1];
   if(n.getAttribute('data-node-id')!==['68908:047953','68908:048090','68908:048065','68908:048035'][i]||n.getAttribute('data-type')!=='component'||n.style.width!=='285px'||n.style.height!=='366px'||n.firstElementChild.style.height!=='160px'||body.style.padding!=='20px'||title.style.fontSize!=='14px'||title.style.fontWeight!=='600'||title.style.lineHeight!=='22px'||links.style.paddingTop!=='12px'||links.style.gap!=='8px'||links.children.length!==5||[...links.children].some(x=>x.style.fontSize!=='12px'||x.style.lineHeight!=='20px'||x.style.textDecoration))throw Error('Card category source geometry mismatch');
  }finally{dom.window.close();}
 }
 const css=fs.readFileSync(path.join(root,'components/card-current.css'),'utf8');if(!/\.ds-card\[data-card-current="category-nav"\][\s\S]*?height: 366px/.test(css)||!/\.ds-card\[data-card-current="category-nav"\] \.ds-card__sub-link\s*\{[^}]*text-decoration: none/.test(css))throw Error('Card category current geometry drift');
 if(!css.includes('inset 1px 0 var(--border-color-default)'))throw Error('Card category source border paint drift');
 return {source:SOURCE,nodes:source.members.map(m=>m.id),scope:'unfolded PC285 only'};
}
module.exports={SOURCE,validateCategoryNavSource};
