'use strict';
const {JSDOM}=require('jsdom');
// Only current finite Form examples whose anatomy was checked by validate_form.
// This adds declaration/resource consistency, not MG or CSS cascade evidence.
function validateFormDependencies(host,examples,byName){
 const checked=[];
 for(const example of examples){
  const dom=new JSDOM(example.exampleHtml);
  try{
   const root=dom.window.document.body.firstElementChild;
   for(const [name,selector] of [['Input','.ds-input-field[data-input-current]'],['Dropdown','.ds-dropdown[data-dropdown-current]'],['Checkbox','.ds-checkbox[data-checkbox-current][data-checkbox-control]']]){
    const nodes=[...root.querySelectorAll(selector)];
    const deps=(host.relations.componentDependencies||[]).filter(d=>d.component===name&&(!d.appliesTo?.length||d.appliesTo.includes(example.name)));
    if(nodes.length&&!deps.length)throw Error('form: nested '+name+' call lacks dependency declaration');
    if(deps.length&&!nodes.length)throw Error('form: nested '+name+' declared but missing');
    if(!nodes.length)continue;
    const atom=byName.get(name)?.data;if(!atom)throw Error('form: nested '+name+' atom unavailable');
    const variants=nodes.map(n=>name==='Input'?(n.querySelector('input, textarea').classList.contains('ds-input-field__input--gray')?'gray':'white'):name==='Checkbox'?(n.classList.contains('ds-checkbox--sm')?'sm':'lg'):'basic');
    if(name==='Checkbox'){
     if(nodes.length!==3||!deps.some(d=>d.slot==='contactMethods')||!deps.some(d=>d.slot==='consent'))throw Error('form: nested Checkbox contact slot missing');
    }
    if(name==='Input'){
     const slots={phoneInnerInput:['phone'],sixthArrowBasicField:['fieldFour'],sixthBasicField:['fieldFour'],fifthArrowBasicField:['choice'],firstTwoBasicFields:['fieldOne','fieldTwo'],thirdBasicField:['fieldThree'],commentsTextarea:['comments']};
     for(const n of nodes){const field=n.querySelector('input, textarea').name;
      if(!deps.some(d=>slots[d.slot]?.includes(field)))throw Error('form: nested Input field lacks slot declaration: '+field);
     }
     for(const d of deps)if(!slots[d.slot]||!slots[d.slot].every(field=>nodes.some(n=>n.querySelector('input, textarea').name===field)))throw Error('form: nested Input slot missing: '+d.slot);
    }
    for(const v of variants)if(!deps.some(d=>d.requiredVariants?.includes(v)))throw Error('form: nested '+name+' variant not registered: '+v);
    for(const dep of deps)for(const v of dep.requiredVariants||[])if(!variants.includes(v))throw Error('form: nested '+name+' required variant missing: '+v);
    // Exclude styles only for explicitly registered children outside basic.
    // New shared Dropdown resources remain required in the current Form host.
    const unusedChildStyles=new Set(name==='Dropdown'?(atom.relations.componentDependencies||[]).filter(d=>d.appliesTo?.length&&!d.appliesTo.includes('basic')).flatMap(d=>byName.get(d.component)?.data.integration?.styles||[]).filter(f=>!['components/tokens.css','components/components.css'].includes(f)):[]);
    const required={styles:atom.integration.styles.filter(f=>!unusedChildStyles.has(f)),scripts:atom.integration.scripts};
    for(const kind of ['styles','scripts'])for(const file of required[kind]||[]){
     if(!host.integration[kind].includes(file))throw Error('form: nested '+name+' runtime '+kind+' missing: '+file);
    }
    checked.push({hostVariant:example.name,component:name,instanceCount:nodes.length,variants,slots:deps.map(d=>d.slot)});
   }
  }finally{dom.window.close();}
 }
 return {scope:'current-PC-Form-Input-Checkbox-declarations-and-resources',checked,anatomy:'validated-by-existing-Form-and-Input-Dropdown-exact-checks',browserVerified:false,hostStyleCascadeVerified:false,mastergoVerified:false};
}
module.exports={validateFormDependencies};
