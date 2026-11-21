'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const SOURCE='components/sources/banner/native-hero-review-1028.json';
function validateNativeHeroSource(root){
 const fail=message=>{throw Error('Banner native Hero: '+message);};
 const r=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8'));
 const index=JSON.parse(fs.readFileSync(path.join(root,'components/sources/banner/source-index.json'),'utf8'));
 const linked=index.currentNativeReviews?.find(x=>x.variant==='hero'&&x.file===SOURCE);
 if(!linked||linked.sha256!==crypto.createHash('sha256').update(fs.readFileSync(path.join(root,SOURCE))).digest('hex'))fail('native source index link is missing or stale');
 const unwrap=x=>JSON.parse(x.content.find(c=>c.type==='text').text);
 if(r.fileId!=='143880409387753')fail('wrong original file');
 const list=unwrap(r.homeHero.list),sections=r.homeHero.sections.map(x=>unwrap(x.value));
 if(list.rootMetadata.type!=='COMPONENT'||list.rootMetadata.width!==1920||list.rootMetadata.height!==420||sections.length!==4)fail('original component identity/size changed');
 if(sections[0].section.id!=='68908:043042'||sections[1].section.id!=='68908:043038')fail('copy provenance changed');
 for(const [i,size,line,weight]of [[0,36,'48','600'],[1,16,'24','400']]){
  const values=Object.values(sections[i].dsl.styles).map(s=>s.value);
  if(!values.some(v=>v?.size===size&&v.lineHeight===line&&v.weight===weight))fail('native typography changed');
 }
 const button=sections[3].dsl.nodes[0],atom=unwrap(r.buttonAtom.section);
 if(button.type!=='INSTANCE'||button.componentId!=='64858:84998'||button.layoutStyle.height!==42)fail('genuine white42 Button reference changed');
 if(!Object.values(atom.dsl.styles).some(s=>s.value?.size===14&&s.value.lineHeight==='22'&&s.value.weight==='400'))fail('Button atom typography changed');
 if(list.sections.find(s=>s.id==='68908:043045')?.x!==404)fail('native content inset changed');
 const spec=r.specificationRead;
 if(spec.specificationNode!=='68908:293212'||!spec.sections.some(s=>s.index===20&&s.result[0].dsl.rowTexts.some(t=>t.text==='间距：20px')))fail('independent PC spacing evidence missing');
 const background=r.nativeBackground;
 if(background?.file!=='components/sources/banner/assets/home-hero-original-1028.png'||crypto.createHash('sha256').update(fs.readFileSync(path.join(root,background.file))).digest('hex')!==background.sha256)fail('original background asset changed');
 return {scope:'1920px desktop single-image home Hero; not other variants or responsive approval',componentNode:'68908:043035',width:1920,height:420,inset:404,title:[36,48,600],description:[16,24,400],gap:20,button:{component:'64858:84998',height:42,font:[14,22,400],resolution:'Atom400 takes precedence over native host/spec600 override'},background,source:SOURCE};
}
module.exports={SOURCE,validateNativeHeroSource};
