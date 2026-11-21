'use strict';
const {JSDOM}=require('jsdom');
// Authored state specimens only. This does not simulate native keyboard input.
function validateButtonStates(html){
 const dom=new JSDOM(html),counts={default:0,hover:0,disabled:0,processing:0};
 try{
  for(const node of dom.window.document.querySelectorAll('button.ds-btn')){
   const busy=node.classList.contains('ds-btn--processing'),disabled=node.classList.contains('ds-btn--disabled');
   if(node.getAttribute('type')!=='button')throw Error('Button specimen: explicit type=button required');
   if(busy&&disabled)throw Error('Button specimen: conflicting visual states');
   if((busy||disabled)&&!node.disabled)throw Error('Button specimen: native disabled required for inactive state');
   if(busy){
    const label=node.querySelector(':scope > .ds-btn__text'),icons=node.querySelectorAll(':scope > img.ds-btn__icon-loading');
    if(node.getAttribute('aria-busy')!=='true'||!label?.textContent.trim()||node.getAttribute('aria-label')!==label.textContent.trim())throw Error('Button specimen: Processing needs busy status and preserved accessible action name');
    if(icons.length!==1||icons[0].getAttribute('alt')!==''||icons[0].getAttribute('aria-hidden')!=='true')throw Error('Button specimen: decorative loading icon required');
   }else if(node.hasAttribute('aria-busy'))throw Error('Button specimen: stale busy state');
   counts[busy?'processing':node.disabled?'disabled':node.classList.contains('ds-btn--hover')?'hover':'default']++;
  }
  if(!counts.default||!counts.disabled||!counts.processing)throw Error('Button specimen: missing state coverage');
  return {scope:'authored-preview-state-semantics-only',counts,nativeKeyboardVerified:false,browserVerified:false,processingLayoutApproved:false};
 }finally{dom.window.close();}
}
module.exports={validateButtonStates};
