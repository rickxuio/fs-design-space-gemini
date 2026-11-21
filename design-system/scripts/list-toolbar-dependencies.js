'use strict';
const {JSDOM}=require('jsdom'),{validateHostedButtons}=require('./button-host-dependencies');
function validateListToolbar(host,preview,button){
 const d=new JSDOM(preview);
 try{
  const roots=[...d.window.document.querySelectorAll('.ds-list[data-list-current="operations"]')];
  if(!roots.length)throw Error('List toolbar current example missing');
  const deps=(host.relations.componentDependencies||[]).filter(x=>x.component==='Button'&&x.slot==='operation-toolbar'&&x.appliesTo?.includes('operation-intensive'));
  if(deps.length!==1||!deps[0].requiredSizes?.some(x=>x.variant==='outline-black'&&x.size==='xl'))throw Error('List toolbar Button exact variant/size declaration missing');
  const calls=roots.map(root=>{
   const toolbar=root.querySelector('.ds-list__operations-toolbar'),nodes=toolbar&&[...toolbar.querySelectorAll('.ds-btn')];
   if(!nodes||nodes.length!==4||new Set(nodes.map(n=>n.dataset.listAction)).size!==4||nodes.some(n=>!['delete','read','read-all','delete-all'].includes(n.dataset.listAction)))throw Error('List toolbar Button authored action slots missing');
   for(const n of nodes)if(n.type!=='button'||[...n.attributes].some(a=>a.name.startsWith('on')))throw Error('List toolbar Button event/type override');
   return {name:'operation-intensive',exampleHtml:toolbar.outerHTML};
  });
  const result=validateHostedButtons(host,calls,button);
  if(result.pending.length)throw Error('List toolbar Button exact size verification pending');
  // This registered toolbar calls shape Button variants only, not Cart.
  for(const f of (button.integration.styles||[]).filter(f=>f!=='components/cart-current.css'))if(!host.integration.styles.includes(f))throw Error('List toolbar Button runtime style missing: '+f);
  return {...result,scope:'current-PC-List-operation-toolbar-Preview-only',hostStyleCascadeVerified:false,mastergoVerified:false};
 }finally{d.window.close();}
}
module.exports={validateListToolbar};
