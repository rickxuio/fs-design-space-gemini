'use strict';
const {JSDOM}=require('jsdom');
// Local finite assemblies only; marker mode intentionally has no native input.
function validateCheckboxHosts(host,examples,atom,preview){
 const checked=[],pending=[];
 const work=examples.map(e=>({variant:e.name,html:e.exampleHtml,mode:host.name==='OptionSelector'&&e.name==='service'?'native-caption-omitted':host.name==='List'&&e.name==='operation-intensive'?'native-list':'marker'}));
 if(host.name==='Dropdown'){
  const d=new JSDOM(preview);try{
   for(const variant of ['multi-select-checkbox','grouped','filter']){
    const roots=[...d.window.document.querySelectorAll('.ds-dropdown[data-checkbox-host-variant="'+variant+'"]')];
    if(roots.length!==1)throw Error('Dropdown Checkbox legacy specimen identity missing or duplicated: '+variant);
    work.push({variant,html:roots[0].outerHTML,mode:'legacy-dropdown-marker'});
   }
  }finally{d.window.close();}
 }
 if(host.name==='OptionSelector'){
  const d=new JSDOM(preview);
  try{const services=[...d.window.document.querySelectorAll('label.ds-option-selector--service')];
   if(!services.length)throw Error('OptionSelector Checkbox current service examples missing');
   services.forEach((n,i)=>work.push({variant:'service',exampleIndex:i,html:n.outerHTML,mode:'native-caption-omitted'}));
  }finally{d.window.close();}
 }
 if(host.name==='List'){
  const d=new JSDOM(preview);try{
   const roots=[...d.window.document.querySelectorAll('.ds-list[data-list-current="operations"]')];
   if(!roots.length)throw Error('List Checkbox current operations example missing');
   roots.forEach((n,i)=>work.push({variant:'operation-intensive',exampleIndex:i,html:n.outerHTML,mode:'native-list'}));
  }finally{d.window.close();}
 }
 for(const e of work){const d=new JSDOM(e.html);try{
  const nodes=[...d.window.document.querySelectorAll('.ds-checkbox')];
  const deps=(host.relations.componentDependencies||[]).filter(x=>x.component==='Checkbox'&&(!x.appliesTo?.length||x.appliesTo.includes(e.variant)));
  if(!nodes.length){if(deps.length)throw Error(host.name+': declared Checkbox missing');continue;}
  if(!deps.length)throw Error(host.name+': actual Checkbox lacks dependency declaration');
  const size=e.mode==='native-list'?'lg':'sm';
  if(!deps.some(x=>x.requiredVariants?.includes(size)))throw Error(host.name+': Checkbox '+size+' not registered');
  for(const n of nodes){
   if((size==='sm'?!n.classList.contains('ds-checkbox--sm'):n.classList.contains('ds-checkbox--sm'))||!n.hasAttribute('data-checkbox-current')||n.hasAttribute('style'))throw Error(host.name+': Checkbox atomic root mismatch');
   const box=n.querySelector(':scope > span.ds-checkbox__box');
   if(!box||box.children.length||box.hasAttribute('style')||n.querySelectorAll('.ds-checkbox__box').length!==1)throw Error(host.name+': Checkbox box anatomy mismatch');
   if(e.mode==='native-caption-omitted'){
    const input=n.firstElementChild,outer=n.parentElement;
    if(n.tagName!=='SPAN'||!n.hasAttribute('data-checkbox-control')||n.children.length!==2||input.tagName!=='INPUT'||input.type!=='checkbox'||!input.classList.contains('ds-checkbox__input')||box.getAttribute('aria-hidden')!=='true'||outer.tagName!=='LABEL'||!outer.hasAttribute('data-option-service-current')||!outer.querySelector('.ds-option-selector__label')?.textContent.trim()||outer.querySelectorAll('input').length!==1||outer.querySelector('label'))throw Error(host.name+': Checkbox native assembly mismatch');
   }else if(e.mode==='native-list'){
    const input=n.firstElementChild,label=n.querySelector(':scope > span.ds-checkbox__label'),master=n.hasAttribute('data-list-master');
    if(n.tagName!=='LABEL'||!n.hasAttribute('data-checkbox-control')||input.tagName!=='INPUT'||input.type!=='checkbox'||!input.classList.contains('ds-checkbox__input')||box.getAttribute('aria-hidden')!=='true'||n.children.length!==(master?2:3)||(master?!input.getAttribute('aria-label')?.trim():!label?.textContent.trim()||label.children.length))throw Error(host.name+': Checkbox native list assembly mismatch');
   }else{
    const label=n.querySelector(':scope > span.ds-checkbox__label');
    if(n.tagName!=='LABEL'||n.children.length!==2||!label?.textContent.trim()||label.children.length||n.querySelector('input')||n.hasAttribute('data-checkbox-control')||!(e.mode==='legacy-dropdown-marker'?n.closest('.ds-dropdown__item'):n.closest('[role="option"]')))throw Error(host.name+': Checkbox marker assembly mismatch');
   }
   for(const el of [n,...n.querySelectorAll('*')])if(el.hasAttribute('style')||[...el.attributes].some(a=>a.name.startsWith('on')))throw Error(host.name+': Checkbox inline override');
  }
  const styles=atom.integration.styles||[];
  for(const f of styles)if(!host.integration.styles.includes(f))throw Error(host.name+': Checkbox runtime styles missing: '+f);
  if(e.mode.startsWith('native-'))for(const f of atom.integration.scripts||[])if(!host.integration.scripts.includes(f))throw Error(host.name+': Checkbox runtime scripts missing: '+f);
  checked.push({variant:e.variant,...(e.exampleIndex!==undefined?{exampleIndex:e.exampleIndex}:{}),mode:e.mode,count:nodes.length});
 }finally{d.window.close();}}
 for(const dep of (host.relations.componentDependencies||[]).filter(x=>x.component==='Checkbox'))for(const v of dep.appliesTo||[])if(!checked.some(x=>x.variant===v))pending.push({variant:v,reason:'outside checked finite assemblies'});
 return {scope:'local-finite-Checkbox-host-assemblies-including-legacy-Dropdown-markers',checked,pending,browserVerified:false,mastergoVerified:false,hostStyleCascadeVerified:false};
}
module.exports={validateCheckboxHosts};
