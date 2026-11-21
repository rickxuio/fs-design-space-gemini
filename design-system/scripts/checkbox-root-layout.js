'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const {splitSelectors}=require('./split-css-selector-list');
const SOURCE='components/sources/checkbox/default-root-mode-review-1014.json';
function sourceFiles(root){const s=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));return [SOURCE,...s.items.map(x=>x.evidence)];}
function validateSource(root){
 const s=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 if(s.items.length!==2||!['lg','sm'].every(size=>s.items.some(x=>x.size===size&&x.state==='Default'&&x.widthMode==='适应')))throw Error('Checkbox root source mode unresolved');
 for(const item of s.items){const bytes=fs.readFileSync(path.join(root,item.evidence)),ax=bytes.toString('utf8');
  if(require('node:crypto').createHash('sha256').update(bytes).digest('hex')!==item.sha256||!ax.includes('layer_id='+encodeURIComponent(item.node))||(ax.match(/文本栏 适应/g)||[]).length<2)throw Error('Checkbox root source evidence stale or not own content-hugging mode');
 }
}
// Finite root declaration cascade only. Actual geometry/hit areas need a browser.
function rootLayouts(root,cssOverride, mode='checkbox'){
 if(!['checkbox','radio-small','radio-large'].includes(mode))throw Error('Unsupported finite root specimen');
 const radioSmall=mode==='radio-small',radioLarge=mode==='radio-large',radio=radioSmall||radioLarge;
 const css=cssOverride??(radio ? ['components/components.css','components/radio-current.css'] : ['components/components.css','components/checkbox-current.css']).map(f=>fs.readFileSync(path.join(root,f),'utf8')).join('\n');
 const d=new JSDOM('<style>'+css+'</style>'),rules=[];
 function collect(list,conditional=false){for(const rule of list){if(rule.selectorText)rules.push({rule,conditional});else if(rule.cssRules)collect(rule.cssRules,true);}}
 collect(d.window.document.styleSheets[0].cssRules);
 try{return (radio?[radioSmall?'sm':'lg']:['lg','sm']).map(size=>{
  const e=d.window.document.createElement('label');if(radio){e.className='ds-radio'+(radioSmall?' ds-radio--sm':'');e.setAttribute(radioSmall?'data-radio-source-default14':'data-radio-source-default18','official');}else{e.className='ds-checkbox'+(size==='sm'?' ds-checkbox--sm':'');e.setAttribute('data-checkbox-current','');e.setAttribute('data-checkbox-control','');}d.window.document.body.append(e);
  const found={width:[],'min-width':[],'max-width':[],'align-self':[]};let order=0;
  for(const {rule,conditional} of rules)for(const selector of splitSelectors(rule.selectorText)){
   let hit=false;try{hit=e.matches(selector);}catch{}if(!hit)continue;
   const relevant=Object.keys(found).filter(p=>rule.style.getPropertyValue(p));
   if(['inline-size','max-inline-size','min-inline-size','place-self','all','flex','flex-grow','flex-basis'].some(p=>rule.style.getPropertyValue(p)))throw Error('Checkbox root layout alias outside finite model');
   if(!relevant.length)continue;if(conditional)throw Error('Checkbox root layout conditional rule outside finite model');
   let plain=selector.replace(/:not\((\.[\w-]+)\)/g,'$1');if(/[()\\|]/.test(plain))throw Error('Checkbox root layout selector outside finite model');
   const attrs=plain.match(/\[[^\]]+\]/g)||[];plain=plain.replace(/\[[^\]]+\]/g,'');
   const ids=(plain.match(/#[\w-]+/g)||[]).length,classes=attrs.length+(plain.match(/\.[\w-]+|:(?!:)[\w-]+/g)||[]).length;
   const types=(plain.replace(/#[\w-]+|\.[\w-]+|:(?!:)[\w-]+/g,'').match(/(?:^|[ >+~])([A-Za-z][\w-]*)/g)||[]).length;
   for(const p of relevant)found[p].push({value:rule.style.getPropertyValue(p).trim(),important:rule.style.getPropertyPriority(p)==='important'?1:0,specificity:[ids,classes,types],order:order++,selector});
  }
  e.remove();const result={size};for(const [p,list] of Object.entries(found)){list.sort((a,b)=>a.important-b.important||a.specificity[0]-b.specificity[0]||a.specificity[1]-b.specificity[1]||a.specificity[2]-b.specificity[2]||a.order-b.order);result[p]=list.at(-1)?.value??'initial';}return result;
 });}finally{d.window.close();}
}
function validateCheckboxRootLayout(root,cssOverride){validateSource(root);const r=rootLayouts(root,cssOverride);if(r.some(x=>x.width!=='fit-content'||!['initial','auto','0','0px'].includes(x['min-width'])||x['max-width']!=='100%'||x['align-self']!=='flex-start'))throw Error('Checkbox native root layout differs from source content-hugging mode');return r;}
module.exports={rootLayouts,validateCheckboxRootLayout,sourceFiles};
