'use strict';
// Extend the existing maintenance synchronization; no page workflow is introduced.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{JSDOM}=require('jsdom');
function run(root,write,id){const docs=new Map(),files=new Set(),changed=new Set();
 const contract=owner=>{const f='components/contracts/'+owner+'.json';files.add(f);return JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));};
 const document=owner=>{const f=contract(owner).aiContract.exampleFile||'components/variants/'+owner+'.html';files.add(f);if(!docs.has(f))docs.set(f,{raw:fs.readFileSync(path.join(root,f),'utf8'),dom:new JSDOM(fs.readFileSync(path.join(root,f),'utf8'),{includeNodeLocations:true}),edits:[]});return {f,d:docs.get(f).dom.window.document};};
 const one=(d,s)=>{const ns=d.querySelectorAll(s);if(ns.length!==1)throw Error('Unique source required: '+s);return ns[0];};
 const source=(owner,variant)=>{const c=contract(owner),{d}=document(owner),n=one(d,c.aiContract.variants[variant].exampleSelector).cloneNode(true);n.removeAttribute('data-ai-example');return n;};
 const put=(f,host,n)=>{if(host.outerHTML===n.outerHTML)return;if(!write)throw Error('Five-variant child is stale: '+f+' / '+host.className);const entry=docs.get(f),loc=entry.dom.nodeLocation(host);if(!loc||entry.edits.some(e=>e.start<loc.endOffset&&e.end>loc.startOffset))throw Error('Ambiguous source replacement: '+f);entry.edits.push({start:loc.startOffset,end:loc.endOffset,html:n.outerHTML});host.replaceWith(n);changed.add(f);};
 const part=(owner,key,host,selector,adapt)=>{const c=contract(owner),p=c.parts[key],{d}=document(owner),canonical=one(d,p.previewSelector).cloneNode(true);canonical.removeAttribute('data-ai-example');const proof=path.join(root,p.sourcePreview),html=canonical.outerHTML+'\n';files.add(p.sourcePreview);files.add(p.source);if(write){fs.mkdirSync(path.dirname(proof),{recursive:true});fs.writeFileSync(proof,html);}else if(fs.readFileSync(proof,'utf8')!==html)throw Error('Five-variant source part stale: '+key);const target=document(host),nodes=[...target.d.querySelectorAll(selector)];if(!nodes.length)throw Error('Actual parent missing: '+key);for(const n of nodes){const copy=canonical.cloneNode(true);if(adapt)adapt(copy,n);put(target.f,n,copy);}};
 try{
 if(!id||['banner','carousel'].includes(id))part('carousel','banner-mini-pagination','banner','[data-banner-mini-runtime] [data-carousel-mini-pagination]');
 if(!id||['collapse','text-button','input','button'].includes(id)){
  part('text-button','collapse-edit-action','collapse','[data-collapse-edit-current] [data-collapse-edit-atom]',(n,old)=>{for(const a of ['aria-controls','aria-expanded'])n.setAttribute(a,old.getAttribute(a));});
  const target=document('collapse'),group=one(target.d,'[data-collapse-edit-current]');
  for(const old of [...group.querySelectorAll('.ds-input-field')]){const copy=source('input','gray'),a=copy.querySelector('input'),b=old.querySelector('input');copy.querySelector('label').textContent=old.querySelector('label').textContent;copy.querySelector('label').htmlFor=b.id;for(const key of ['id','name','type','value','aria-describedby'])a.setAttribute(key,b.getAttribute(key));a.removeAttribute('placeholder');copy.querySelector('.ds-input-field__error').id=old.querySelector('.ds-input-field__error').id;put(target.f,old,copy);}
  for(const old of [...group.querySelectorAll('button.ds-btn')]){const save=old.hasAttribute('data-collapse-save'),copy=source('button',save?'filled-black':'outline-gray');copy.removeAttribute('id');copy.className=old.className;copy.setAttribute('type',save?'submit':'button');copy.setAttribute(save?'data-collapse-save':'data-collapse-cancel','');copy.querySelector('.ds-btn__text').textContent=save?'Save':'Cancel';// source default size is source-owned; host Save/Cancel remains XL
   put(target.f,old,copy);}
 }
 if(!id||['card','menu-navigation','list'].includes(id)){
  const menu=document('menu-navigation'),old=one(menu.d,'[data-menu-card-sidebar]'),copy=source('menu-navigation','single-level');copy.classList.remove('ds-menu-navigation--width-250');copy.classList.add('ds-menu-navigation--width-288');copy.setAttribute('data-menu-card-sidebar','current');copy.setAttribute('aria-label','Product information sections');put(menu.f,old,copy);
  part('menu-navigation','card-sidebar-288','card','[data-card-sidebar-current] [data-menu-card-sidebar]');
  const card=document('card'),list=one(card.d,'[data-card-sidebar-current="bordered"] .ds-list'),copyList=source('list','unordered-12');while(copyList.children.length>4)copyList.lastElementChild.remove();while(copyList.children.length<4)copyList.append(copyList.firstElementChild.cloneNode(true));put(card.f,list,copyList);
 }
 if(!id||['navigation','menu-navigation'].includes(id)){
  const target=document('navigation'),header=one(target.d,'[data-ai-example="ai-navigation-fixed-header"]'),shell=header.cloneNode(true),c=contract('navigation');shell.removeAttribute('data-ai-example');one(shell,'.ds-nav-header__product-menu').replaceChildren();const hash=n=>crypto.createHash('sha256').update(n.outerHTML).digest('hex');if(hash(shell)!==c.aiContract.identity.headerProductsShellSha256)throw Error('fixed Header authored literal shell changed outside approved child synchronization');
  put(target.f,one(header,'.ds-nav-header__product-menu > nav'),source('menu-navigation','public-header'));
  const full=header.cloneNode(true);full.removeAttribute('data-ai-example');if(hash(full)!==c.aiContract.identity.authoredSha256){if(!write)throw Error('Header child fingerprint is stale');c.aiContract.identity.authoredSha256=hash(full);fs.writeFileSync(path.join(root,'components/contracts/navigation.json'),JSON.stringify(c,null,2)+'\n');}
 }
 if(!id||['card','menu-navigation','list'].includes(id)){const f='components/variants/card.html';files.add(f);if(!docs.has(f))docs.set(f,{raw:fs.readFileSync(path.join(root,f),'utf8'),dom:new JSDOM(fs.readFileSync(path.join(root,f),'utf8'),{includeNodeLocations:true}),edits:[]});const d=docs.get(f).dom.window.document;for(const kind of ['plain','bordered']){const holder=one(d,'[data-five-sidebar-view="'+kind+'"]'),current=one(document('card').d,'[data-ai-example="ai-card-sidebar-'+kind+'"]'),copy=current.cloneNode(true);copy.removeAttribute('data-ai-example');const next=holder.cloneNode(false);next.append(copy);put(f,holder,next);}}
 if(write)for(const f of changed){const entry=docs.get(f);let raw=entry.raw;for(const e of entry.edits.sort((a,b)=>b.start-a.start))raw=raw.slice(0,e.start)+e.html+raw.slice(e.end);fs.writeFileSync(path.join(root,f),raw);}return [...files];
 }finally{for(const {dom}of docs.values())dom.window.close();}
}
module.exports={sync:root=>run(root,true),validate:(root,id)=>run(root,false,id)};
if(require.main===module)module.exports.sync(path.resolve(__dirname,'..'));
