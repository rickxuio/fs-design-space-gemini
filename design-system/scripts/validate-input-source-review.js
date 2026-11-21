#!/usr/bin/env node
'use strict';
// Inert saved tool HTML declarations only. No network, scripts or browser rendering.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{JSDOM}=require('jsdom');
const ROOT=path.resolve(__dirname,'..'),SOURCE='components/sources/input/mastergo-original-components.json',REVIEW='components/sources/input/basic-input-review.json',SET='68908:013958';
function validateInputSourceReview(root=ROOT){
 const bytes=fs.readFileSync(path.join(root,SOURCE)),saved=JSON.parse(bytes),review=JSON.parse(fs.readFileSync(path.join(root,REVIEW))),sha=crypto.createHash('sha256').update(bytes).digest('hex');
 if(review.originalFingerprint!==sha)throw Error('Input saved tool-HTML/review fingerprint mismatch');
 if(saved.sourceRole!=='original-component-area'||review.source.componentSetId!==SET||review.source.scope!=='basic-text-input-only')throw Error('Input saved tool-HTML scope mismatch');
 const d=new JSDOM(saved.html);
 try{
  const doc=d.window.document,sets=doc.querySelectorAll(`[data-node-id="${SET}"]`);
  if(sets.length!==1||sets[0].getAttribute('data-type')!=='component-set'||sets[0].children.length!==14||review.variants.length!==14)throw Error('Input tool marker/finite state coverage mismatch');
  const states=['Default','Hover','Activated','Inputting','Input complete','Disabled','Error'],nodes=[...sets[0].children],pairs=new Set(),ids=new Set();
  for(const n of nodes){
   const id=n.getAttribute('data-node-id'),background=n.getAttribute('data-variant-背景色'),state=n.getAttribute('data-variant-状态');
   if(!id||ids.has(id)||doc.querySelectorAll(`[data-node-id="${id}"]`).length!==1||n.getAttribute('data-type')!=='component'||!['off','on'].includes(background)||!states.includes(state)||pairs.has(background+'/'+state))throw Error('Input tool marker/state identity mismatch');
   ids.add(id);pairs.add(background+'/'+state);
   const records=review.variants.filter(v=>v.nodeId===id),label=n.querySelectorAll('[data-name="Lable"]'),field=n.querySelectorAll('[data-name="数据录入/输入框"]');
   if(records.length!==1||label.length!==1||field.length!==1)throw Error('Input tool-HTML/review field identity mismatch');
   const r=records[0],textRuns=[...n.querySelectorAll('p[data-node-id],span[data-node-id]')].filter(t=>!t.children.length).map(t=>({text:t.textContent.trim(),style:t.getAttribute('style')})),icons=[...n.querySelectorAll('ui-component,ui-icon')].map(t=>t.getAttribute('data-name'));
   if(r.background!==background||r.state!==state||r.rootStyle!==n.getAttribute('style')||r.label!==label[0].getAttribute('style')||r.field!==field[0].getAttribute('style')||JSON.stringify(r.textRuns)!==JSON.stringify(textRuns)||JSON.stringify(r.icons)!==JSON.stringify(icons))throw Error('Input tool-HTML/review declarations mismatch: '+id);
  }
  return {scope:'saved-basic-input-tool-html-facts-only',source:{file:SOURCE,sha256:sha},review:REVIEW,summary:{toolMarkedStates:14,surfaces:2,statesPerSurface:7},originalTypedNodeProof:false,frontendSource:false,browserComputedStyles:false,visualApproval:false,limits:['Tool data-type metadata is preserved provenance; it is not independent original COMPONENT/COMPONENT_SET DSL proof.','CSS text and UI-ICON/UI-COMPONENT names are tool declarations, not browser rendering or source SVG contour evidence.','An omitted font-weight declaration cannot establish source weight 400; current explicit local typography is a separate library rule.','Other six declared input families are not implemented or approved by this basic review.','Screen position cannot classify a component versus a specification document.']};
 }finally{d.window.close();}
}
if(require.main===module)console.log(JSON.stringify(validateInputSourceReview()));
module.exports={validateInputSourceReview,SOURCE,REVIEW};
