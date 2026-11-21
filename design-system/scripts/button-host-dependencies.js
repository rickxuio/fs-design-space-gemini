'use strict';
const {JSDOM}=require('jsdom');
// Finite authored examples only: no CSS cascade or browser behavior proof.
function validateHostedButtons(host,examples,button){
 const dependencies=(host.relations?.componentDependencies||[]).filter(d=>d.component==='Button');
 const checked=[],pending=[];
 for(const example of examples){
  const deps=dependencies.filter(d=>!d.appliesTo?.length||d.appliesTo.includes(example.name));
  if(!deps.length){
   const dom=new JSDOM(example.exampleHtml);
   try{if(dom.window.document.querySelector('.ds-btn'))throw Error('Button host '+host.name+'/'+example.name+': actual atomic call lacks dependency declaration');}finally{dom.window.close();}
   continue;
  }
  if(deps.every(d=>JSON.stringify(d.requiredVariants)==='["cart-product-card"]')){
   const dom=new JSDOM(example.exampleHtml);try{
    const nodes=[...dom.window.document.querySelectorAll('button.ds-cart')];if(!nodes.length)throw Error('Button Cart host: missing source atom');
    for(const n of nodes){if(n.className!=='ds-cart ds-cart--product-card'||n.getAttribute('type')!=='button'||n.hasAttribute('style')||n.disabled||n.children.length!==2||n.children[0].tagName!=='IMG'||n.children[0].getAttribute('src')!=='../icons/icon-cart-add.svg'||n.children[1].className!=='ds-cart__text'||[...n.children].some(c=>c.hasAttribute('style')))throw Error('Button Cart host: invalid original anatomy');}
    checked.push({variant:example.name,component:'Button',childVariant:'cart-product-card',calls:nodes.length,sourceStates:'Default/Hover only',geometry:'Cart-owned'});
   }finally{dom.window.close();}continue;
  }
  if(deps.some(d=>!d.requiredSizes?.length)){pending.push({variant:example.name,reason:'exact child variant/size source is not registered; not certified'});continue;}
  const dom=new JSDOM(example.exampleHtml);
  try{
   const root=dom.window.document.body.firstElementChild,nodes=[...root.querySelectorAll('.ds-btn')];
   if(!nodes.length)throw Error('Button host '+host.name+'/'+example.name+': declared nested Button missing');
   const observed=[];
   for(const node of nodes){
    const variants=button.variants.filter(v=>v.cssClass.split(/\s+/).every(c=>node.classList.contains(c)));
    if(variants.length!==1)throw Error('Button host '+host.name+': missing child variant Button/'+[...node.classList].find(c=>/^ds-btn--(filled|outline)-/.test(c))?.replace('ds-btn--',''));
    const variant=variants[0],sizes=variant.sizes.filter(s=>node.classList.contains('ds-btn--'+s.name));
    if(sizes.length!==1)throw Error('Button host '+host.name+': missing child size / atomic size mismatch');
    const size=sizes[0];
    const atomClasses=new Set([...variant.cssClass.split(/\s+/),'ds-btn--'+size.name]);
    if([...node.classList].some(c=>c.startsWith('ds-btn')&&!atomClasses.has(c)))throw Error('Button host '+host.name+': unregistered atomic class or state');
    if(!deps.some(d=>d.requiredVariants.includes(variant.name)&&d.requiredSizes?.some(s=>s.variant===variant.name&&s.size===size.name)))throw Error('Button host '+host.name+': exact child size is not registered');
    const labels=[...node.children].filter(n=>n.matches('span.ds-btn__text'));
    const leading=require('./button-leading-icon').validateNode(node,button);
    if(node.tagName!=='BUTTON'||!['button','submit'].includes(node.getAttribute('type'))||labels.length!==1||!labels[0].textContent.trim()||labels[0].children.length||(!leading&&node.children.length!==1))throw Error('Button host '+host.name+': native Button anatomy mismatch');
    // Current canonical host calls are the registered text-only default atom.
    // A label override is still an atomic override, even if the root is clean.
    if(labels[0].hasAttribute('style')||labels[0].className!=='ds-btn__text')throw Error('Button host '+host.name+': host overrides atomic text style or structure');
    if(node.getAttribute('type')==='submit'&&!node.closest('form'))throw Error('Button host '+host.name+': submit Button lacks a native form');
    for(const property of Array.from(node.style)){
     if(!['position','top','right','bottom','left','margin','margin-top','margin-right','margin-bottom','margin-left','align-self','flex','grid-area'].includes(property))throw Error('Button host '+host.name+': host overrides atomic style '+property);
    }
    observed.push({variant:variant.name,size:size.name,type:node.getAttribute('type')});
   }
   for(const dep of deps)for(const variant of dep.requiredVariants)if(!observed.some(o=>o.variant===variant))throw Error('Button host '+host.name+': declared child variant missing '+variant);
   for(const dep of deps)for(const pair of dep.requiredSizes)if(!observed.some(o=>o.variant===pair.variant&&o.size===pair.size))throw Error('Button host '+host.name+': declared child size missing '+pair.variant+'/'+pair.size);
   checked.push({variant:example.name,buttons:observed});
  }finally{dom.window.close();}
 }
 return {scope:'finite-authored-button-nesting-only',checked,pending,browserVerified:false};
}
module.exports={validateHostedButtons};
