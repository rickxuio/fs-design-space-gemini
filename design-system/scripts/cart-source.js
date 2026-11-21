'use strict';
const fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom');
const SOURCE='components/sources/card/cart-dependency-source-1014.json',SVG='components/sources/card/cart-icon-original-1014.svg';
function validateCartSource(root){
 const data=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 for(const [key,id,state] of [['defaultReceipt','56279:017716','Default'],['hoverReceipt','66737:80342','Hover']]){
  const code=data[key].split('代码内容：')[1],dom=new JSDOM(code);
  try{const n=dom.window.document.body.firstElementChild,icon=n.querySelector('ui-icon'),text=n.querySelector('span');
   if(n.getAttribute('data-type')!=='component'||n.getAttribute('data-node-id')!==id||n.getAttribute('data-variant-使用场景')!=='产品卡片'||n.getAttribute('data-variant-状态')!==state)throw Error('Cart original identity mismatch');
   if(n.style.gap!=='4px'||n.style.paddingTop!=='6px'||n.style.paddingLeft!=='8px'||n.style.borderRadius!=='4px'||icon?.style.width!=='14px'||icon?.style.height!=='14px'||icon?.getAttribute('name')!=='Icon/通用Icon/Cart 1-加购'||text?.style.fontSize!=='12px'||text?.style.lineHeight!=='20px')throw Error('Cart original anatomy mismatch');
  }finally{dom.window.close();}
 }
 const paths=file=>Array.from(fs.readFileSync(path.join(root,file),'utf8').matchAll(/<path\b[^>]*\bd="([^"]+)"/g),m=>m[1]);
 if(JSON.stringify(paths(SVG))!==JSON.stringify(paths('components/icons/icon-cart-add.svg'))||!paths(SVG).length)throw Error('Cart official SVG geometry mismatch');
 return {status:'product-default-hover-and-official-svg-checked',source:SOURCE,svg:SVG};
}
function validateCartHosts(root){
 const dom=new JSDOM(fs.readFileSync(path.join(root,'components/variants/card.html'),'utf8'));
 try{
  const checked=[];
  for(const [selector,count] of [['.ds-card--embedded-small',2],['.ds-card--embedded-full',6]]){
   const cards=[...dom.window.document.querySelectorAll(selector)];
   if(cards.length!==count)throw Error('Cart host scope missing');
   for(const card of cards){
    const atom=card.querySelector('.ds-cart'),slot=card.querySelector('.ds-card__cart-slot');
    if(!atom||atom.tagName!=='BUTTON'||atom.getAttribute('type')!=='button'||atom.className!=='ds-cart ds-cart--product-card'||atom.hasAttribute('style')||!slot||atom.parentElement!==slot||atom.children.length!==2)throw Error('Cart host must call exact independent atom');
    if(atom.children[0].tagName!=='IMG'||atom.children[0].className!=='ds-cart__icon'||atom.children[0].getAttribute('src')!=='../icons/icon-cart-add.svg'||atom.children[0].hasAttribute('style')||atom.children[1].className!=='ds-cart__text'||atom.children[1].hasAttribute('style')||atom.children[1].textContent.trim()!=='Add')throw Error('Cart host glyph/label override');
    for(const property of slot.style)if(!['position','right','bottom','top'].includes(property))throw Error('Cart host overrides atom appearance');
    checked.push({host:selector,atom:'product-card',slotOnlyPosition:true});
   }
  }
  return {checked};
 }finally{dom.window.close();}
}
module.exports={SOURCE,SVG,validateCartSource,validateCartHosts};
