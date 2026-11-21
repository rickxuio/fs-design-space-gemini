'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const SOURCE='components/sources/button/leading-icon-source-1019.json';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function validateSource(root){
 const data=JSON.parse(fs.readFileSync(path.join(root,SOURCE)));
 for(const a of data.assets)for(const f of [a.file,a.original]){
  const bytes=fs.readFileSync(path.join(root,f));
  if(sha(bytes)!==(f===a.file?a.sha256:a.originalSha256)||!/<path\b/.test(bytes.toString()))throw Error('Button leading icon: missing/empty/changed official SVG '+f);
 }
 const canonical=s=>s.replace(/id="[^"]+"/g,'id="source"').replace(/url\(#[^)]+\)/g,'url(#source)');
 for(const a of data.assets){const runtime=fs.readFileSync(path.join(root,a.file),'utf8'),original=fs.readFileSync(path.join(root,a.original),'utf8');if(a.geometryTransform){
  const frameFile=path.join(root,a.geometryTransform.sourceFrameEvidence);if(sha(fs.readFileSync(frameFile))!==a.geometryTransform.sourceFrameSha256)throw Error('Button leading icon: changed original artboard evidence');
  const frame=JSON.parse(fs.readFileSync(frameFile)),style=frame.attr.style.join(';'),child=frame.children[0].attr.style.join(';'),number=(text,prop)=>Number(text.match(new RegExp('(?:^|;)\\s*'+prop+':\\s*([0-9.]+)'))?.[1]);
  if(frame.attr['data-type']!=='component'||Math.abs(number(style,'width')-a.geometryTransform.runtimeViewBox[2])>.01||number(style,'height')!==a.geometryTransform.runtimeViewBox[3]||Math.abs(number(style,'width')*number(child,'left')/100-a.geometryTransform.translation[0])>.01||Math.abs(number(style,'height')*number(child,'top')/100-a.geometryTransform.translation[1])>.01)throw Error('Button leading icon: mismatched original frame');
  const {JSDOM}=require('jsdom'),r=new JSDOM(runtime,{contentType:'image/svg+xml'}).window.document,o=new JSDOM(original,{contentType:'image/svg+xml'}).window.document,t=a.geometryTransform,paths=[...r.querySelectorAll('path')],sources=[...o.querySelectorAll('path')];
  if(t.kind!=='source-fragment-in-original-artboard'||paths.length!==1||sources.length!==1||r.documentElement.getAttribute('viewBox')!==t.runtimeViewBox.join(' ')||paths[0].getAttribute('fill')!==a.paint||sources[0].getAttribute('fill')!==a.paint)throw Error('Button leading icon: invalid original artboard/paint');
  const tokens=d=>d.match(/[MLCZ]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g),one=tokens(paths[0].getAttribute('d')),two=tokens(sources[0].getAttribute('d'));if(one.length!==two.length)throw Error('Button leading icon: changed original path');let axis=0;for(let i=0;i<one.length;i++){if(/[MLCZ]/.test(one[i])){if(one[i]!==two[i])throw Error('Button leading icon: changed original command');}else{if(!Number.isFinite(Number(two[i]))||Math.abs(Number(one[i])-Number(two[i])-t.translation[axis++%2])>0.00001)throw Error('Button leading icon: changed original geometry');}}
 }else if(canonical(runtime)!==canonical(original))throw Error('Button leading icon: geometry/paint differs from original '+a.file);}
 return data;
}
function validateNode(node,button){
 const leads=[...node.children].filter(e=>e.classList.contains('ds-btn__leading'));
 if(!leads.length){if(node.querySelector('img:not(.ds-btn__icon-loading),svg'))throw Error('Button leading icon: missing source group');return false;}
 const variant=button.variants.find(v=>v.cssClass.split(/\s+/).every(c=>node.classList.contains(c)));
 const rule=button.aiContract.variants[variant?.name],binding=rule?.bindings?.icon;
 const lead=leads[0],icon=lead.firstElementChild,label=node.querySelector(':scope > span.ds-btn__text');
 // The genuine default skeleton retains its hidden optional slot at text-only
 // sizes. Only displaying that slot requires the source-verified XL size.
 if(!binding||!['filled-red','outline-black'].includes(variant.name)||!lead.hidden&&!node.matches(variant.name==='filled-red'?'.ds-btn--xl-regular':'.ds-btn--xl'))throw Error('Button leading icon: unsupported variant/size');
 const busy=node.classList.contains('ds-btn--processing');
 if(leads.length!==1||lead.tagName!=='SPAN'||lead.className!=='ds-btn__leading'||lead.children.length!==1||icon?.tagName!=='IMG'||icon.className!=='ds-btn__leading-icon'||icon.getAttribute('alt')!==''||icon.getAttribute('aria-hidden')!=='true'||icon.hasAttribute('hidden')||node.children[0]!==lead||node.children[1]!==label||node.children.length!==(busy?3:2)||!label||label.children.length)throw Error('Button leading icon: invalid source slot anatomy');
 if(label.className!=='ds-btn__text'||[lead,icon,label].some(e=>e.hasAttribute('style')||e.hasAttribute('width')||e.hasAttribute('height')))throw Error('Button leading icon: inline atomic override');
 const src=icon.getAttribute('src')||'';
 const file=src.replace(/^(?:\.\.\/|\.\/)+/,'');
 const normalized=file.startsWith('icons/')?'components/'+file:file;
 if(!binding.values.includes(normalized))throw Error('Button leading icon: unregistered or wrong-paint FS icon');
 if(busy&&!lead.hidden)throw Error('Button leading icon: visible Processing slot not source-verified');
 return true;
}
function outputIssues(html,button){
 const {JSDOM}=require('jsdom'),dom=new JSDOM(html),issues=[];
 try{for(const node of dom.window.document.querySelectorAll('.ds-btn'))try{validateNode(node,button);}catch(e){issues.push({type:'button-leading-icon',message:e.message});}}
 finally{dom.window.close();}
 return issues;
}
module.exports={SOURCE,validateSource,validateNode,outputIssues};
