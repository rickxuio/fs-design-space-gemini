'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const SOURCE='components/sources/carousel/outlined28-call-source-1019.json';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const normalize=s=>s.replace(/master_svg\w+/g,'source-id');
function validateSource(root){
 const s=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 if(s.schemaVersion!=='fs-carousel-outline-call/1.0.0'||s.assets.length!==6)throw Error('Carousel outlined28 source scope mismatch');
 for(const e of s.evidence)if(hash(fs.readFileSync(path.join(root,e.file)))!==e.sha256)throw Error('Carousel source evidence changed: '+e.file);
 const nodes=Object.assign({},...s.evidence.slice(1).map(e=>JSON.parse(fs.readFileSync(path.join(root,e.file),'utf8')).nodes));
 for(const side of ['left','right'])for(const state of ['default','hover','disabled']){
  const a=s.assets.find(a=>a.direction===side&&a.state===state),n=nodes[side+'-'+state];
  if(!a||!n||n.node!==a.sourceNode||JSON.stringify(n.size)!=='[28,28]'||n.radius!==28||n.opacity!==(state==='disabled'?.3:1)||n.fill!==(state==='hover'?'#F2F2F2':'#FFFFFF')||n.border.width!==1||n.border.color!=='#DEE0E3'||JSON.stringify(n.icon.size)!=='[16,16]'||JSON.stringify(n.icon.xy)!=='[6,6]'||n.icon.color!=='#4B4B4D')throw Error('Carousel outlined28 source properties mismatch');
  const actual=fs.readFileSync(path.join(root,a.file)),original=fs.readFileSync(path.join(root,a.original));
  if(hash(actual)!==a.sha256||hash(original)!==a.originalSha256||!/<path\b/.test(original)||normalize(actual.toString())!==normalize(original.toString()))throw Error('Carousel outlined28 official glyph mismatch');
 }
 return s;
}
function outputIssues(html){
 const {JSDOM}=require('jsdom'),d=new JSDOM(html),issues=[];
 try{for(const e of d.window.document.querySelectorAll('.ds-carousel__btn--outlined-m')){
  const side=(e.getAttribute('data-carousel-source-outline28')||'').replace(/-default$/,'');const img=e.firstElementChild;
  if(!['left','right'].includes(side)||e.tagName!=='BUTTON'||e.className!=='ds-carousel__btn ds-carousel__btn--outlined-m'||e.type!=='button'||!e.getAttribute('aria-label')?.trim()||e.children.length!==1||e.textContent.trim()||!img||img.tagName!=='IMG'||img.getAttribute('alt')!==''||!img.getAttribute('src')?.endsWith('/icon-carousel-outline28-'+side+'-current.svg')||[e,img].some(n=>[...n.attributes].some(a=>['style','width','height','aria-disabled'].includes(a.name)||a.name.startsWith('on'))))issues.push({type:'carousel-outline-control',message:'描边28必须保留真实方向、原生button/disabled、唯一官方16px图标和锁定结构；不得模拟状态或覆盖几何。'});
 }}finally{d.window.close();}return issues.concat(require('./carousel-solid-control').outputIssues(html));
}
module.exports={SOURCE,validateSource,outputIssues};
