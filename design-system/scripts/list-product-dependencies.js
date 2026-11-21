'use strict';
const {JSDOM}=require('jsdom');
function validateListProducts(host,preview,byName){
 const d=new JSDOM(preview),checked=[];
 try{const roots=[...d.window.document.querySelectorAll('.ds-list[data-list-current="products"]')];
  if(!roots.length)throw Error('List products current specimen missing');
  for(const [index,root]of roots.entries()){
   const dialogPart=root.dataset.listPart==='dialog-cart-products';
   const rows=[...root.querySelectorAll('.ds-list__product-source-row')];
   if(!rows.length)throw Error('List products rows missing');
   for(const name of (dialogPart?['InputNumber']:['InputNumber','IconButton'])){
    const variant=name==='InputNumber'?'outline-sm':'plain-m',atom=byName.get(name).data;
    const deps=(host.relations.componentDependencies||[]).filter(x=>x.component===name&&x.appliesTo?.includes('product-content'));
    if(!deps.some(x=>x.requiredVariants?.includes(variant)))throw Error('List products '+name+' dependency mismatch');
    for(const kind of ['styles','scripts'])for(const f of atom.integration[kind]||[])if(!host.integration[kind].includes(f))throw Error('List products '+name+' runtime '+kind+' missing: '+f);
   }
   const atomIndex=host.integration.scripts.indexOf('components/input-number-current.js'),hostIndex=host.integration.scripts.indexOf('components/list-products-current.js');
   if(hostIndex<0||atomIndex>hostIndex)throw Error('List products InputNumber runtime must initialize before host');
   for(const row of rows){
    const quantities=[...row.querySelectorAll('.ds-input-number')],deletes=[...row.querySelectorAll('[data-list-product-delete]')];
    if(quantities.length!==1||deletes.length!==(dialogPart?0:1))throw Error('List products atomic slot count mismatch');
    const q=quantities[0],[dec,input,inc]=q.children,b=deletes[0],icon=b?.firstElementChild;
    if(q.className!=='ds-input-number ds-input-number--outline ds-input-number--sm'||!q.hasAttribute('data-list-quantity-current')||!q.hasAttribute('data-input-number-current')||!q.hasAttribute('data-input-number')||q.children.length!==3||dec.tagName!=='BUTTON'||dec.type!=='button'||!dec.hasAttribute('data-input-number-decrement')||dec.className!=='ds-input-number__button ds-input-number__button--decrement'||input.tagName!=='INPUT'||input.type!=='text'||input.className!=='ds-input-number__input'||!input.getAttribute('aria-label')?.trim()||inc.tagName!=='BUTTON'||inc.type!=='button'||!inc.hasAttribute('data-input-number-increment')||inc.className!=='ds-input-number__button ds-input-number__button--increment')throw Error('List products InputNumber anatomy mismatch');
    const min=Number(q.dataset.min),max=Number(q.dataset.max),value=Number(input.getAttribute('value'));
    if(!Number.isInteger(min)||!Number.isInteger(max)||min>max||!Number.isInteger(value)||value<min||value>max)throw Error('List products InputNumber authored range mismatch');
    const allowed=new Set(['ds-icon-btn','ds-icon-btn--plain','ds-icon-btn--m','ds-icon-btn--hover']);
    if(!dialogPart&&(b.tagName!=='BUTTON'||b.type!=='button'||!b.getAttribute('aria-label')?.trim()||!['ds-icon-btn','ds-icon-btn--plain','ds-icon-btn--m'].every(c=>b.classList.contains(c))||[...b.classList].some(c=>!allowed.has(c))||b.children.length!==1||icon.tagName!=='IMG'||icon.className!=='ds-icon-btn__icon'||icon.getAttribute('src')!=='../icons/icon-delete.svg'||icon.getAttribute('alt')!==''))throw Error('List products IconButton anatomy mismatch');
    for(const n of [q,...q.querySelectorAll('*'),...(b?[b,...b.querySelectorAll('*')]:[])])if(n.hasAttribute('style')||[...n.attributes].some(a=>a.name.startsWith('on')))throw Error('List products atomic inline override');
   }
   checked.push({variant:'product-content',...(dialogPart?{part:'dialog-cart-products'}:{}),exampleIndex:index,InputNumber:rows.length,IconButton:dialogPart?0:rows.length});
  }
 }finally{d.window.close();}
 return {scope:host.aiContract?.supported?.includes('product-content')?'current-PC-List-product-finite-native-call':'current-PC-List-product-Preview-only',checked,browserVerified:false,mastergoVerified:false,hostStyleCascadeVerified:false};
}
module.exports={validateListProducts};
