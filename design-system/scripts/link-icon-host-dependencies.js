'use strict';
const {JSDOM}=require('jsdom'),fs=require('node:fs'),path=require('node:path');
const placement=new Set(['position','top','right','bottom','left','margin','margin-top','margin-right','margin-bottom','margin-left','align-self','flex','grid-area']);
function validateHostedAtom(host,examples,atom,root){
 const isText=atom.name==='TextButton',prefix=isText?'ds-text-btn':'ds-icon-btn';
 const checked=[],inactive=[];
 for(const example of examples){
  const deps=(host.relations?.componentDependencies||[]).filter(d=>d.component===atom.name&&(!d.appliesTo?.length||d.appliesTo.includes(example.name)));
  const dom=new JSDOM(example.exampleHtml);
  try{
   const nodes=[...dom.window.document.querySelectorAll('.'+prefix)];
   if(!deps.length){
    if(nodes.length)throw Error(atom.name+' host '+host.name+'/'+example.name+': actual atomic call lacks dependency declaration');
    continue;
   }
   if(deps.every(d=>d.requiredWhen==='body-row-count-over-six')&&example.dataShape?.bodyRowCount<=6){
    if(nodes.length)throw Error(atom.name+' host '+host.name+': conditional atom present below threshold');
    inactive.push({variant:example.name,reason:'declared row-count condition not met',bodyRowCount:example.dataShape.bodyRowCount});continue;
   }
   if(!nodes.length)throw Error(atom.name+' host '+host.name+': registered child missing');
   const observed=[];
   for(const node of nodes){
    const sourced=deps.find(d=>d.part&&atom.parts?.[d.part]?.previewSelector&&node.matches(atom.parts[d.part].previewSelector));
    if(sourced){
     const part=atom.parts[sourced.part];if(!root||!part.isComplete||!part.allowedHosts?.some(h=>h.component===host.name&&h.variant===example.name))throw Error('Owned atomic part outside finite host');
     const original=new JSDOM(fs.readFileSync(path.join(root,part.sourcePreview),'utf8'));
     try{const matches=original.window.document.querySelectorAll(part.previewSelector);if(matches.length!==1||(()=>{const copy=node.cloneNode(true);if(atom.name==='TextButton'&&sourced.part==='collapse-edit-action'){if(!copy.getAttribute('aria-controls')||copy.getAttribute('aria-expanded')!=='false')return true;copy.removeAttribute('aria-controls');copy.removeAttribute('aria-expanded');}return matches[0].outerHTML!==copy.outerHTML;})())throw Error('Owned atomic part is stale or modified');}finally{original.window.close();}
     for(const v of sourced.requiredVariants)observed.push({variant:v,...(isText?{size:sourced.part==='collapse-edit-action'?'l':'m'}:{})});continue;
    }
    const variants=atom.variants.filter(v=>v.cssClass.split(/\s+/).every(c=>node.classList.contains(c)));
    if(variants.length!==1)throw Error(atom.name+' host '+host.name+': atomic variant mismatch');
    const v=variants[0],rule=atom.aiContract.variants[v.name];
    if(!rule||!deps.some(d=>d.requiredVariants.includes(v.name)))throw Error(atom.name+' host '+host.name+': unregistered child variant');
    let size;
    if(isText){
     const sizes=v.sizes.filter(s=>node.classList.contains(prefix+'--'+s.name));
     if(sizes.length!==1)throw Error(atom.name+' host '+host.name+': atomic size mismatch');
     size=sizes[0].name;
     if(!deps.some(d=>d.requiredSizes?.some(s=>s.variant===v.name&&s.size===size)))throw Error(atom.name+' host '+host.name+': exact size not registered');
    }
    const allowed=new Set([...v.cssClass.split(/\s+/),...(size?[prefix+'--'+size]:[])]);
    if([...node.classList].some(c=>c.startsWith(prefix)&&!allowed.has(c)))throw Error(atom.name+' host '+host.name+': unregistered atomic class');
    for(const p of Array.from(node.style))if(!placement.has(p))throw Error(atom.name+' host '+host.name+': host overrides atomic style');
    if([...node.attributes].some(a=>a.name.toLowerCase().startsWith('on')))throw Error(atom.name+' host '+host.name+': inline event override');
    if(isText){
     const [label,icon]=node.children;
     const noIcon=deps.some(d=>d.iconMode==='absent'&&d.requiredSizes?.some(s=>s.variant===v.name&&s.size===size));
     if(!noIcon && icon?.hasAttribute('hidden'))throw Error(atom.name+' host '+host.name+': required source arrow must remain visible');
     if(noIcon&&!v.sizes.find(s=>s.name===size)?.styleProperties.iconOptional)throw Error(atom.name+' host '+host.name+': absent icon not allowed by atom');
     if(node.tagName!=='A'||!label||label.tagName!=='SPAN'||label.className!==prefix+'__text'||label.children.length||!label.textContent.trim()||(noIcon?node.children.length!==1:node.children.length!==2||!icon||icon.tagName!=='IMG'||icon.className!==prefix+'__icon'||icon.getAttribute('src')!=='../icons/'+v.sizes.find(s=>s.name===size).styleProperties.defaultIcon||icon.getAttribute('alt')!==''))throw Error(atom.name+' host '+host.name+': exact navigation anatomy mismatch');
    }else{
     const icon=node.firstElementChild,values=rule.bindings?.icon?.values||[];
     if(node.tagName!=='BUTTON'||node.getAttribute('type')!=='button'||!node.getAttribute('aria-label')?.trim()||node.children.length!==1||icon.tagName!=='IMG'||icon.className!==prefix+'__icon'||icon.getAttribute('alt')!==''||!values.includes('components/'+icon.getAttribute('src')?.replace(/^\.\.\//,'')))throw Error(atom.name+' host '+host.name+': exact icon anatomy mismatch');
    }
    for(const child of node.querySelectorAll('*'))if(child.hasAttribute('style')||[...child.attributes].some(a=>a.name.toLowerCase().startsWith('on')))throw Error(atom.name+' host '+host.name+': host overrides atomic child');
    observed.push({variant:v.name,...(size?{size}:{})});
   }
   for(const d of deps){
    for(const variant of d.requiredVariants)if(!observed.some(o=>o.variant===variant))throw Error(atom.name+' host '+host.name+': declared variant missing');
    for(const pair of d.requiredSizes||[])if(!observed.some(o=>o.variant===pair.variant&&o.size===pair.size))throw Error(atom.name+' host '+host.name+': declared size missing');
   }
   checked.push({variant:example.name,children:observed});
  }finally{dom.window.close();}
 }
 return {scope:'finite-canonical-'+atom.name+'-default-calls',checked,inactive,browserVerified:false,hostStyleCascadeVerified:false};
}
module.exports={validateHostedAtom};
