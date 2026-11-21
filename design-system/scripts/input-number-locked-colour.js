'use strict';
const fs=require('node:fs'),path=require('node:path');
const {JSDOM}=require('jsdom');
const {splitSelectors}=require('./split-css-selector-list');
const SOURCE='components/sources/input-number/outline32-disabled-children-review-1013.json';

// Finite input32 native disabled + readonly colour cascade. Not arbitrary CSS,
// browser paint, full42-source coverage, or an authored double-state variant.
function specificity(selector){
 let plain=selector.replace(/:(has|not)\(([^()]*)\)/g,(_,name,arg)=>{
  if(arg.includes(','))throw Error('InputNumber locked colour selector outside finite model');
  return arg;
 });
 if(/[()\\|]/.test(plain))throw Error('InputNumber locked colour selector outside finite model');
 const attrs=plain.match(/\[[^\]]+\]/g)||[];
 plain=plain.replace(/\[[^\]]+\]/g,'');
 const ids=(plain.match(/#[\w-]+/g)||[]).length;
 const classes=attrs.length+(plain.match(/\.[\w-]+|:(?!:)[\w-]+/g)||[]).length;
 const types=(plain.replace(/#[\w-]+|\.[\w-]+|:(?!:)[\w-]+/g,'').match(/(?:^|[ >+~])([A-Za-z][\w-]*)/g)||[]).length;
 return [ids,classes,types];
}
function validateLockedColour(root){
 const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 if(source.file!=='143880409387753'||source.rootReused!=='68908:024941'||source.text.paint!=='#19191A at30%'||source.text.layerOpacity!==1)throw Error('InputNumber own Disabled32 paint source mismatch');
 const tokens=Object.fromEntries([...fs.readFileSync(path.join(root,'components/tokens.css'),'utf8').matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)].map(m=>[m[1],m[2].trim()]));
 const normalize=s=>s.replace(/\s+/g,'').toLowerCase();
 const expected='rgba(25,25,26,0.3)';
 if(normalize(tokens['--color-text-disabled']||'')!==expected)throw Error('InputNumber own Disabled32 token paint mismatch');
 const css=['components/components.css','components/input-number-current.css'].map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
 const d=new JSDOM(`<style>${css}</style>`),rules=[];
 function collect(list,conditional=false){for(const r of list){if(r.selectorText)rules.push({r,conditional});else if(r.cssRules)collect(r.cssRules,true);}}
 collect(d.window.document.styleSheets[0].cssRules);
 const cases=[];
 try {for(const fieldset of [false,true]){
  const host=d.window.document.createElement('fieldset');host.disabled=fieldset;
  host.innerHTML=`<div class="ds-input-number ds-input-number--outline ds-input-number--sm" data-input-number-current aria-disabled="true"><input class="ds-input-number__input" readonly ${fieldset?'':'disabled'}></div>`;
  d.window.document.body.append(host);const e=host.querySelector('input'),matches=[];let order=0;
  for(const {r,conditional} of rules){if(!r.style.getPropertyValue('color'))continue;
   for(const selector of splitSelectors(r.selectorText)){
    let hit=false;try{hit=e.matches(selector);}catch{}
    if(!hit)continue;
    if(conditional)throw Error('InputNumber locked colour conditional rule outside finite model');
    matches.push({selector,value:r.style.getPropertyValue('color').replace(/var\((--[\w-]+)\)/g,(_,k)=>tokens[k]||''),important:r.style.getPropertyPriority('color')==='important'?1:0,specificity:specificity(selector),order:order++});
   }
  }
  matches.sort((a,b)=>a.important-b.important||a.specificity[0]-b.specificity[0]||a.specificity[1]-b.specificity[1]||a.specificity[2]-b.specificity[2]||a.order-b.order);
  const winner=matches.at(-1);
  if(!winner||normalize(winner.value)!==expected)throw Error('InputNumber native Disabled + Readonly colour differs from own30% source');
  cases.push({nativeDisabledVia:fieldset?'fieldset':'input',selector:winner.selector,specificity:winner.specificity,colour:winner.value});host.remove();
 }}finally{d.window.close();}
 return {status:'finite-native-disabled-readonly-colour-checked',source:SOURCE,cases,browserVerified:false,scope:'Current small32 disabled paint precedence only; other authored states,42 own paint and full family not approved'};
}
module.exports={validateLockedColour,specificity,SOURCE};
