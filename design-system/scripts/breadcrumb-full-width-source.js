'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const SOURCE='components/sources/breadcrumb/full-width-source-1014.json';
function validateFullWidthSource(root){
 const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 if(source.fileId!=='143880409387753'||source.node!=='10621:10156')throw Error('Breadcrumb full-width source identity mismatch');
 const dom=new JSDOM(source.receipt.slice(source.receipt.indexOf('<div')));
 try{for(const [i,id] of ['10621:10128','62724:74229'].entries()){
  const n=dom.window.document.querySelector(`[data-node-id="${id}"]`),p=JSON.parse(n?.firstElementChild?.getAttribute('props')||'{}');
  if(n?.getAttribute('data-type')!=='component'||n.style.width!=='1920px'||!['padding-top: 20px','padding-bottom: 20px','padding-left: 360px','padding-right: 360px'].every(v=>n.getAttribute('style').includes(v))||n.style.gap!=='4px'||p['样式']!=='常规'||p['反白']!==(i?'是':'否'))throw Error('Breadcrumb full-width original geometry mismatch');
 }}finally{dom.window.close();}
 const css=fs.readFileSync(path.join(root,'components/breadcrumb-current.css'),'utf8'),block=css.match(/\.ds-breadcrumb-source-full-width\s*\{([^}]+)\}/)?.[1]||'';
 for(const pattern of [/width:\s*1920px;/,/padding:\s*var\(--spacing-20\) var\(--spacing-banner-content-inset\);/,/gap:\s*var\(--spacing-xs\);/,/box-sizing:\s*border-box;/])if(!pattern.test(block))throw Error('Breadcrumb full-width source geometry drift');
 return {source:SOURCE,nodes:['10621:10128','62724:74229'],scope:'1920-only'};
}
module.exports={SOURCE,validateFullWidthSource};
