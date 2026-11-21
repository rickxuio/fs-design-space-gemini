'use strict';
const {navigation}=require('./local-slot-validation.cjs');
function apply(root,images,binding){
 if(!Array.isArray(images)||images.length<binding.minItems||images.length>binding.maxItems)throw Error('Comment media requires1..24 actual images');
 for(const x of images)if(!x||typeof x!=='object'||Array.isArray(x)||Object.keys(x).some(k=>!['src','alt'].includes(k))||typeof x.alt!=='string'||!x.alt.trim())throw Error('Comment media requires only safe src and descriptive alt');else navigation(x.src);
 const definitions=[['.ds-comment__gallery-grid','data-gallery-item'],['.ds-comment__gallery-track',null],['.ds-comment__gallery-thumbs','data-gallery-thumb']];
 for(const [selector,attribute]of definitions){const group=root.querySelector(selector),template=group.firstElementChild.cloneNode(true);group.replaceChildren(...images.map((x,i)=>{const node=template.cloneNode(true),image=node.querySelector('img');if(!image)throw Error('Comment media canonical image missing');image.src=x.src;image.alt=x.alt;if(attribute){node.setAttribute(attribute,String(i));node.setAttribute('aria-label',(attribute==='data-gallery-thumb'?'Show':'Open')+' image '+(i+1));}if(attribute==='data-gallery-thumb'){node.setAttribute('aria-pressed',String(i===0));node.classList.toggle('ds-comment__gallery-thumb--active',i===0);}return node;}));}
}
module.exports={apply};
