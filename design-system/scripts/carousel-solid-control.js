'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const SOURCE='components/sources/carousel/solid48-call-source-1110.json';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function validateSource(root){
 const read=f=>fs.readFileSync(path.join(root,f));
 const s=JSON.parse(read(SOURCE));
 if(s.schemaVersion!=='fs-carousel-solid48-call/1'||s.evidence.length!==2||s.assets.length!==2)throw Error('Solid48 source scope mismatch');
 for(const e of s.evidence)if(hash(read(e.file))!==e.sha256)throw Error('Solid48 source evidence changed: '+e.file);
 const identity=JSON.parse(read(s.evidence[0].file)),circles=JSON.parse(read(s.evidence[1].file));
 if(identity.currentCollectionType!=='COMPONENT_SET'||identity.currentStates.length!==6)throw Error('Solid48 typed source missing');
 for(const direction of ['left','right']){
  const a=s.assets.find(a=>a.direction===direction),original=identity.officialExports[direction];
  if(!a||a.original!=='components/sources/carousel/'+original.file||hash(read(a.file))!==a.sha256||hash(read(a.original))!==a.originalSha256||!read(a.file).equals(read(a.original))||!/width="28" height="28" viewBox="0 0 28 28"/.test(read(a.file).toString())||!read(a.file).toString().includes('fill="#FFFFFF"'))throw Error('Solid48 official glyph mismatch');
  for(const state of ['default','hover','disabled']){
   const n=identity.currentStates.find(n=>n.label===direction+'-'+state),circle=n&&circles.records.find(c=>c.id===n.id),glyph=n?.sections.find(n=>n.type==='INSTANCE'),shape=circle?.circle.nodes[0];
   const own=identity.glyphComparison.find(g=>g.label===direction+'-'+state),peer=identity.glyphComparison.find(g=>g.label===direction+'-default');
   const color=state==='hover'?'rgba(25, 25, 26, 0.5)':state==='disabled'?'rgba(25, 25, 26, 0.04)':'rgba(25, 25, 26, 0.3)';
   if(n?.root.type!=='COMPONENT'||n.root.width!==48||n.root.height!==48||!glyph||JSON.stringify([glyph.x,glyph.y,glyph.width,glyph.height])!==JSON.stringify([direction==='left'?9:11,10,28,28])||shape?.type!=='SVG_ELLIPSE'||shape.layoutStyle.width!==48||shape.layoutStyle.height!==48||shape.layoutStyle.relativeX!==0||shape.layoutStyle.relativeY!==0||shape._color!==color||!own||own.id!==glyph.id||own.rawExtractor.svg!==peer?.rawExtractor.svg)throw Error('Solid48 six-state native geometry/paint mismatch: '+direction+'-'+state);
  }
 }
 return s;
}
function outputIssues(html){
 const {JSDOM}=require('jsdom'),d=new JSDOM(html),issues=[];
 try{for(const e of d.window.document.querySelectorAll('.ds-carousel__btn--xl')){
  const side=(e.getAttribute('data-carousel-source-solid48')||'').replace(/-default$/,''),img=e.firstElementChild;
  if(!['left','right'].includes(side)||e.tagName!=='BUTTON'||e.className!=='ds-carousel__btn ds-carousel__btn--xl'||e.type!=='button'||!e.getAttribute('aria-label')?.trim()||e.children.length!==1||e.textContent.trim()||img?.tagName!=='IMG'||img.getAttribute('alt')!==''||!img.getAttribute('src')?.endsWith('/icon-carousel-solid48-'+side+'-current.svg')||[e,img].filter(Boolean).some(n=>[...n.attributes].some(a=>['style','width','height','aria-disabled'].includes(a.name)||a.name.startsWith('on'))))issues.push({type:'carousel-solid-control',message:'实心48须保留真实方向、原生button/disabled、唯一官方28px白箭头和锁定结构，不得放大M或伪造状态。'});
 }}finally{d.window.close();}return issues;
}
module.exports={SOURCE,validateSource,outputIssues};
