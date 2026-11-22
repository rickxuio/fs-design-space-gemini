'use strict';
const fs=require('node:fs'),path=require('node:path');
function readFields(root,value){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).sort().join(',')!=='objectId,reference'||typeof value.reference!=='string'||!/^reference-inputs\//.test(value.reference)||value.reference.split(/[\\/]/).includes('..'))throw Error('Form sourceFields requires a retained reference and objectId');
 const file=path.resolve(root,value.reference);if(!fs.realpathSync(file).startsWith(fs.realpathSync(root)+path.sep))throw Error('Form source reference escapes project');
 const source=JSON.parse(fs.readFileSync(file)),record=(source.modules||[]).flatMap(m=>m.items||[]).find(x=>x.objectId===value.objectId);
 if(source.kind!=='original-page-content-reference'||!record||!Array.isArray(record.fields)||record.fields.length<1||record.fields.length>32)throw Error('Form needs1..32 source fields');
 const names=new Set();for(const f of record.fields){if(!f||Object.keys(f).some(k=>!['name','label','kind','required','description','placeholder','options','fullWidth'].includes(k))||!['text','email','textarea','select'].includes(f.kind)||!/^\w[\w-]*$/.test(f.name||'')||names.has(f.name)||typeof f.label!=='string'||!f.label.trim()||typeof f.required!=='boolean')throw Error('Invalid or duplicate source Form field');if(f.fullWidth!==undefined&&typeof f.fullWidth!=='boolean')throw Error('Invalid fullWidth flag');names.add(f.name);for(const k of ['description','placeholder'])if(f[k]!==undefined&&typeof f[k]!=='string')throw Error('Invalid source field copy');if(f.kind==='select'&&(!Array.isArray(f.options)||f.options.length<2||f.options.length>300||f.options.some(o=>typeof o!=='string'||!o.trim())||new Set(f.options).size!==f.options.length))throw Error('Select needs unique source options');if(f.kind!=='select'&&f.options!==undefined)throw Error('Options require a real Select');}
 const out=record.fields.slice();out.consent=record.consent===true;return out;
}
function assemble(el,fields,{render,root,data,targetDir,variant}){
 const doc=el.ownerDocument,basic=el.querySelector('.ds-input-field[data-input-layout="fill"]'),textarea=el.querySelector('[data-input-kind="textarea"]'),consent=el.querySelector('.ds-form__consent')?.cloneNode(true),submit=el.querySelector('button[type="submit"]').parentElement.cloneNode(true);
 if(!basic||!textarea)throw Error('Canonical Form lost native Input/textarea');
 el.replaceChildren();el.setAttribute('data-form-fields-source','v1');let row,count=0;
 for(const f of fields){const wrapper=doc.createElement('div');wrapper.className='ds-form__field';wrapper.dataset.formFieldName=f.name;wrapper.dataset.formRequired=String(f.required);const id='source-field-'+(++count)+'-'+f.name;
  if(f.kind==='select'){
   const label=doc.createElement('label');label.className='ds-input-field__label';label.textContent=f.label+(f.required?'':' (optional)');
   const selectedVariant=f.options.length>20?'search':'single-basic',v=data.components['library-select'].variants[selectedVariant];const holder=doc.createElement('div');holder.innerHTML=v.exampleHtml;const list=holder.querySelector('.ds-select__list'),sample=list.firstElementChild.cloneNode(true);list.replaceChildren(...f.options.map((text,i)=>{const n=sample.cloneNode(true);n.id=id+'-option-'+i;n.dataset.value=text;n.setAttribute('aria-selected','false');n.querySelector('.ds-select__option-label').textContent=text;return n;}));
   const use=render('library-select',selectedVariant,{options:list.innerHTML,...(selectedVariant==='single-basic'?{layout:'fill'}:{}),...(v.allowedEdits.includes('placeholder')?{placeholder:f.placeholder?.trim()||'Select'}:{}),...(v.allowedEdits.includes('searchLabel')?{searchLabel:'Search '+f.label}:{})},{root,version:data.version,targetDir});const slot=doc.createElement('div');slot.className='ds-form__select-slot';slot.innerHTML=use.html;label.htmlFor=slot.querySelector('button').id;wrapper.append(label,slot);
  }else{
   const atom=(f.kind==='textarea'?textarea:basic).cloneNode(true);atom.removeAttribute('data-input-arrow');const input=atom.querySelector('input,textarea'),label=atom.querySelector('label');label.textContent=f.label+(f.required?'':' (optional)');label.htmlFor=id;input.id=id;input.name=f.name;input.required=f.required;input.value='';input.setAttribute('placeholder',f.placeholder||'');if(f.kind!=='textarea')input.type=f.kind;
   const err=atom.querySelector('.ds-input-field__error');if(err){err.id=id+'-error';err.hidden=true;}
   if(f.kind==='textarea'){const counter=atom.querySelector('.ds-input-field__count');counter.id=id+'-count';counter.textContent='0/5000';input.setAttribute('aria-describedby',counter.id);}
   wrapper.append(atom);
  }
  if(f.description){const copy=doc.createElement('p');copy.className='ds-form__field-description';copy.textContent=f.description;copy.id=id+'-help';wrapper.append(copy);wrapper.querySelector('input,textarea,button').setAttribute('aria-describedby',[wrapper.querySelector('input,textarea,button').getAttribute('aria-describedby'),copy.id].filter(Boolean).join(' '));}
  if(f.kind==='textarea'||f.fullWidth){el.append(wrapper);row=null;}else{if(!row||row.children.length===2){row=doc.createElement('div');row.className='ds-form__row';el.append(row);}row.append(wrapper);}
 }
 if(fields.consent&&consent)el.append(consent);
 el.append(submit);const status=doc.createElement('p');status.className='ds-form__status';status.setAttribute('role','status');status.hidden=true;el.append(status);
}
module.exports={readFields,assemble};
