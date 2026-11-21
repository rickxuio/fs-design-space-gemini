'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const SOURCE='components/sources/card/embedded-standard-hover-source-1014.json';
function validateEmbeddedStandardSource(root,contract){
 const source=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 const blocks=[...source.receipt.matchAll(/```html\s*([\s\S]*?)```/g)].map(m=>m[1]);
 if(source.fileId!=='143880409387753'||blocks.length!==2)throw Error('Card embedded standard source identity missing');
 const norm=v=>String(v).replace(/\s+/g,'').toLowerCase();
 for(const [i,code] of blocks.entries()){
  const dom=new JSDOM(code);try{
   const n=dom.window.document.body.firstElementChild;
   if(n.getAttribute('data-type')!=='component'||n.getAttribute('data-node-id')!==['68908:040885','68908:040948'][i]||n.getAttribute('data-variant-hover')!=='on')throw Error('Card embedded standard source component mismatch');
   for(const [key,value] of Object.entries({width:'285px',padding:'20px',gap:'16px','border-radius':'8px','box-shadow':'0px 15px 15px -10px rgba(0,0,0,0.15)',background:i===0?'rgb(250,251,251)':'rgb(255,255,255)'}))if(norm(n.style.getPropertyValue(key))!==norm(value))throw Error('Card embedded standard source '+key+' mismatch');
   const title=n.querySelector('p[data-name="标题"]'),desc=n.querySelector('p[data-name="描述文本"]'),button=n.querySelector('ui-component[data-name="文字按钮"]'),image=n.querySelector('ui-component[data-name="图文卡片/嵌入式/上下结构/原子图片"]');
   if(!title||title.style.fontSize!=='14px'||title.style.lineHeight!=='22px'||title.style.fontWeight!=='600'||!desc||desc.style.fontSize!=='12px'||desc.style.lineHeight!=='20px'||image?.style.width!=='180px'||image?.style.height!=='180px')throw Error('Card embedded standard source anatomy mismatch');
   const props=JSON.parse(button?.getAttribute('props')||'{}');if(props['尺寸']!=='13px'||props['颜色']!=='黑色'||props['向右箭头']!==true||props['图标']!==false)throw Error('Card embedded standard TextButton source mismatch');
  }finally{dom.window.close();}
 }
 const v=contract.variants.find(v=>v.name==='embedded.product-standard');
 const mediaDom=new JSDOM(source.privateImageAtom?.code||'');
 try{const img=mediaDom.window.document.body.firstElementChild;
  if(img?.getAttribute('data-type')!=='component'||img?.getAttribute('data-node-id')!=='68908:016493'||img?.style.width!=='180px'||img?.style.height!=='180px'||img?.style.backgroundSize!=='cover'||!['center','center center'].includes(img?.style.backgroundPosition)||img?.style.mixBlendMode!=='multiply')throw Error('Card private image original mismatch');
 }finally{mediaDom.window.close();}
 for(const [key,value] of Object.entries({width:'285px',padding:'20px',imageSize:'180x180px',contentGap:'16px',borderRadius:'8px'}))if(norm(v.styleProperties[key])!==norm(value))throw Error('Card embedded standard contract '+key+' differs from source');
 return {status:'two-original-hover-members-checked-default-native-record-reused',file:SOURCE,nodes:source.nodes,browserVerified:false};
}
const SMALL='components/sources/card/embedded-small-source-1014.json';
function validateEmbeddedSmallSource(root){
 const data=JSON.parse(fs.readFileSync(path.join(root,SMALL),'utf8'));
 const blocks=[...data.receipt.matchAll(/```html\s*([\s\S]*?)```/g)].map(m=>m[1]);
 if(data.fileId!=='143880409387753'||blocks.length!==2)throw Error('Small Card original scope mismatch');
 for(const [i,code] of blocks.entries()){
  const dom=new JSDOM(code);try{
   const n=dom.window.document.body.firstElementChild,img=n.querySelector('img'),body=n.children[1],texts=[...body.querySelectorAll('span,p')];
   if(n.getAttribute('data-type')!=='component'||n.getAttribute('data-node-id')!==['68908:035265','68908:035246'][i]||n.style.width!=='230px'||n.style.paddingTop!=='8px'||n.style.paddingBottom!=='20px'||n.style.paddingLeft!=='20px'||n.style.borderRadius!=='4px'||img?.style.width!=='140px'||img?.style.height!=='140px'||img?.style.mixBlendMode!=='multiply'||body.style.gap!=='12px'||texts.length!==2||texts.some(t=>t.style.fontSize!=='14px'||t.style.lineHeight!=='22px'||t.style.fontWeight!=='600'))throw Error('Small Card original anatomy mismatch');
   if(i===1){const cart=n.querySelector('ui-component[name="Cart 按钮"]');if(!cart||JSON.parse(cart.getAttribute('props'))['状态']!=='Default')throw Error('Small Card source Cart missing');}
  }finally{dom.window.close();}
 }
 return {status:'two-original-small-members-checked',file:SMALL,nodes:data.nodes};
}
module.exports={SOURCE,SMALL,validateEmbeddedStandardSource,validateEmbeddedSmallSource};
