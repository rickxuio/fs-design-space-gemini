'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const SOURCE='components/sources/tab/pc-center-full-source-1014.json';
function validateCenterSource(root){
 const d=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 if(d.fileId!=='143880409387753'||d.members.length!==2)throw Error('Tab center source identity mismatch');
 for(const [i,m] of d.members.entries()){
  const dom=new JSDOM(m.receipt.split('代码内容：')[1]);try{
   const n=dom.window.document.body.firstElementChild,children=[...n.querySelectorAll(':scope > ui-component')],expected=['Selected','Default','Hover'];
   if(n.getAttribute('data-type')!=='component'||n.getAttribute('data-node-id')!==['68908:049539','68908:049509'][i]||n.getAttribute('data-variant-布局')!=='居中'||n.style.width||n.style.gap!=='16px'||n.style.justifyContent!=='center'||children.length!==3)throw Error('Tab center source intrinsic mode mismatch');
   for(const [j,c] of children.entries()){const p=JSON.parse(c.getAttribute('props'));if(c.getAttribute('name')!=='导航选项原子/常规'||p['状态']!==expected[j]||p['尺寸']!==(i?'Large（16px）':'Default（14px）')||p['标题']!==false||p['下拉箭头']!==false)throw Error('Tab center original child mismatch');}
  }finally{dom.window.close();}
 }
 const css=fs.readFileSync(path.join(root,'components/components.css'),'utf8');if(!/\.ds-tab--standard\.ds-tab--center\s*\{[^}]*width:\s*fit-content;[^}]*margin:\s*0 auto/.test(css))throw Error('Tab center current intrinsic width drift');
 return {source:SOURCE,nodes:d.members.map(m=>m.id),scope:'PC default/large centered regular only'};
}
module.exports={SOURCE,validateCenterSource};
