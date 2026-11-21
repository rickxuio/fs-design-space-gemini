'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const {splitSelectors}=require('./split-css-selector-list');
const {specificity}=require('./input-number-locked-colour');
const SOURCE='components/sources/input-number/hover-button42-source-review-1014.json';
// Finite static Hover representation; native :hover is verified in the browser.
function validateHoverSurface(root){
 const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 if(source.source.file!=='143880409387753'||source.outline.button!=='68908:024886'||source.filled.button!=='68908:024933'||source.outline.buttonPaint!=='rgba(25,25,26,0.04)'||source.filled.buttonPaint!=='transparent')throw Error('InputNumber Hover own surface source mismatch');
 const tokens=Object.fromEntries([...fs.readFileSync(path.join(root,'components/tokens.css'),'utf8').matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)].map(m=>[m[1],m[2].trim()]));
 const css=['components/components.css','components/input-number-current.css'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
 const d=new JSDOM(`<style>${css}</style>`),rules=[];
 function collect(list,conditional=false){for(const r of list){if(r.selectorText)rules.push({r,conditional});else if(r.cssRules)collect(r.cssRules,true);}}
 collect(d.window.document.styleSheets[0].cssRules);const cases=[];
 try {for(const shape of ['outline','filled']){
  d.window.document.body.innerHTML=`<div class="ds-input-number ds-input-number--${shape}" data-input-number-current><button class="ds-input-number__button ds-input-number__button--hover"></button></div>`;
  const button=d.window.document.querySelector('button'),matches=[];
  for(const {r,conditional} of rules){
   const property=r.style.getPropertyValue('background-color')?'background-color':'background';
   if(!r.style.getPropertyValue(property))continue;
   for(const selector of splitSelectors(r.selectorText)){
    let hit=false;try{hit=button.matches(selector);}catch{}
    if(!hit)continue;if(conditional)throw Error('InputNumber Hover surface conditional outside finite model');
    matches.push({selector,value:r.style.getPropertyValue(property).replace(/var\((--[\w-]+)\)/g,(_,k)=>tokens[k]||''),important:r.style.getPropertyPriority(property)==='important'?1:0,specificity:specificity(selector),order:matches.length});
   }
  }
  matches.sort((a,b)=>a.important-b.important||a.specificity[0]-b.specificity[0]||a.specificity[1]-b.specificity[1]||a.specificity[2]-b.specificity[2]||a.order-b.order);
  const winner=matches.at(-1),normalize=s=>s.replace(/\s+/g,'').toLowerCase();
  if(!winner||normalize(winner.value)!==source[shape].buttonPaint)throw Error('InputNumber Hover surface differs from own '+shape+' source');
  cases.push({shape,...winner});
 }}finally{d.window.close();}
 return {source:SOURCE,status:'finite-static-hover-surfaces-checked',cases,browserVerified:false};
}
module.exports={SOURCE,validateHoverSurface};
