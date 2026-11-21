"use strict";
const fs=require('node:fs'),path=require('node:path');
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// Called before component assembly: only documentation scaffolding is normalized.
// Decisions, examples and dependency records remain supplied by each original source.
function render({root,title,header,content,footer,scripts='',extraCss=''}) {
 const L=require(path.join(root,'scripts/local-component-library.cjs'));
 const fragment=L.domAPI(root).fragment(content),main=fragment.querySelector('main');
 if(!main)throw Error('Component documentation requires one main element');
 if(fragment.querySelectorAll('main').length!==1)throw Error('Ambiguous component document main');
 main.classList.add('fs-spec-doc');
 const classes={h1:'spec-doc-title',h2:'spec-doc-heading',h3:'spec-doc-subheading',p:'spec-doc-copy',li:'spec-doc-copy',table:'spec-doc-table',th:'spec-doc-cell',td:'spec-doc-cell',small:'spec-doc-small'};
 for(const [tag,name]of Object.entries(classes))for(const node of main.querySelectorAll(tag)) {
   if(node.closest('[data-component],[data-library-component]'))continue;
   node.classList.add(name);
 }
 for(const table of main.querySelectorAll('table')) {
   if(table.closest('[data-component],[data-library-component]'))continue;
   const wrapper=fragment.ownerDocument.createElement('div');wrapper.className='spec-doc-table-scroll';
   table.before(wrapper);wrapper.appendChild(table);
 }
 const overview=main.querySelector(':scope > section');
 if(overview)for(const paragraph of overview.querySelectorAll('p'))if(paragraph.querySelectorAll('a[href^="#"]').length>1)paragraph.classList.add('spec-doc-navigation');
 const values={TITLE:escape(title),THEME:fs.readFileSync(path.join(root,'design-system/docs/component-spec.css'),'utf8'),SPECIFIC_STYLES:extraCss,HEADER:header,CONTENT:[...fragment.childNodes].map(n=>n.outerHTML||n.textContent).join(''),FOOTER:footer,SCRIPTS:scripts};
 // Fresh reads allow cached builders to use template changes in the same maintenance run.
 return fs.readFileSync(path.join(root,'design-system/docs/component-spec-template.html'),'utf8').replace(/{{([A-Z_]+)}}/g,(_,key)=>{if(!(key in values))throw Error('Unknown component document placeholder '+key);return values[key];});
}
function projectDependencyTable({root,id,targetDir,classPrefix,L,customize}) {
 const {COMPONENT_IDS,SPEC_PAGE}=require(path.join(root,'design-system/scripts/variant-source.js')),COMP_SET=new Set(COMPONENT_IDS);
 const file=path.join(root,'design-system/components/variants',id+'.html'),source=fs.readFileSync(file,'utf8');
 const match=source.match(/<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:START -->([\s\S]*?)<!-- AUTO-GENERATED-DEPENDENCY-SUMMARY-TABLE:END -->/);
 if(!match)throw Error('Original complete dependency table missing: '+id);
 const linked=match[1].replace(/\b(href|src)="([^"]+)"/g,(all,attr,url)=>{
  if(/^(?:[a-z]+:|\/|#)/i.test(url))return all;
  const clean=url.split(/[?#]/)[0],suffix=url.slice(clean.length),base=path.basename(clean,'.html');
  if(attr==='href'&&clean.endsWith('.html')&&!clean.includes('/')){
   const target=COMP_SET.has(base)?path.join(root,SPEC_PAGE(base)):path.join(root,'design-system/components/preview',clean);
   return attr+'="'+escape(path.relative(targetDir,target).split(path.sep).join('/')+suffix)+'"';
  }
  return attr+'="'+escape(path.relative(targetDir,path.resolve(path.dirname(file),clean)).split(path.sep).join('/')+suffix)+'"';
 });
 const fragment=L.domAPI(root).fragment(linked),styles=new Map(),tokens=new Map();
 for(const node of fragment.querySelectorAll('[style]')){
  const value=node.getAttribute('style');
  if(!styles.has(value))styles.set(value,classPrefix+styles.size);
  node.classList.add(styles.get(value));node.removeAttribute('style');
 }
 for(const f of fs.readdirSync(path.join(root,'design-system/components/token-specs')).filter(f=>f.endsWith('.json'))){
  for(const token of JSON.parse(fs.readFileSync(path.join(root,'design-system/components/token-specs',f))).tokens||[])tokens.set(token.name,token);
 }
 const tokenValue=(t,seen=new Set())=>{
  if(seen.has(t.name))throw Error('Circular source token '+t.name);
  seen.add(t.name);
  if(typeof t.value==='object')return Object.values(t.value).join(' · ');
  const ref=String(t.value).match(/^var\((--[^)]+)\)$/),next=ref&&[...tokens.values()].find(x=>x.cssVar===ref[1]);
  return next?tokenValue(next,seen):String(t.value)+(t.unit||'');
 };
 for(const a of fragment.querySelectorAll('a')){
  const t=tokens.get(a.textContent.trim());
  if(t)a.innerHTML=escape((t.description||t.name).split(/[；;（(]/)[0]+' · '+tokenValue(t))+'<small>'+escape(t.name)+'</small>';
 }
 if(customize)customize(fragment);
 return {html:[...fragment.childNodes].map(n=>n.outerHTML||n.textContent).join(''),css:[...styles].map(([value,name])=>'.'+name+'{'+value+'}').join('\n')};
}
module.exports={render,projectDependencyTable};
