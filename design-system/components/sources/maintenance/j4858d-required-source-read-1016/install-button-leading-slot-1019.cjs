// Finite source-to-local reconciliation; never edits the target reconstructed page.
const fs=require('node:fs'),crypto=require('node:crypto');
const b='components/sources/maintenance/j4858d-required-source-read-1016';
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write=(p,d)=>fs.writeFileSync(p,JSON.stringify(d,null,2)+'\n');
const assets=[
 {file:'components/icons/icon-cart-add.svg',original:'components/sources/card/cart-icon-original-1014.svg',node:'66737:80343',nativeSize:14,paint:'#FFFFFF',role:'cart',screenshot:b+'/screenshots/card-purchase-visual-1019.png'},
 {file:'components/icons/icon-fs-download-black-16.svg',original:b+'/exports/button-slot-black/asset/icons/svg_df1a2ad5.svg',node:'1673:49930',nativeSize:16,paint:'#19191A',role:'download',screenshot:b+'/screenshots/download-black-16-1019.png'},
 {file:'components/icons/icon-fs-quotes-black-16.svg',original:b+'/exports/button-slot-black/asset/icons/svg_62428f83.svg',node:'1673:14001',nativeSize:16,paint:'#19191A',role:'quote',screenshot:b+'/screenshots/quotes-black-16-1019.png'},
];
const native='/Users/rick.xu/.mgmcp/resources/screenshots/143880409387753/67934-110777';
for(const [id,out] of [['1673-49930','download-black-16-1019.png'],['1673-14001','quotes-black-16-1019.png']]){
 const f=fs.readdirSync(native).find(f=>f.endsWith('_'+id+'.png'));fs.copyFileSync(native+'/'+f,b+'/screenshots/'+out);
}
for(const a of assets){if(a.nativeSize===16)fs.copyFileSync(a.original,a.file);a.sha256=hash(a.file);a.originalSha256=hash(a.original);a.screenshotSha256=hash(a.screenshot);}
write('components/sources/button/leading-icon-source-1019.json',{
 schemaVersion:'fs-button-leading-icon-source/1',scope:'Button filled-red/xl-regular and outline-black/xl optional left slot; Default/Hover/Disabled. Visible Processing left slot withheld.',
 fileId:'143880409387753',pageId:'3752:3993',readAt:new Date().toISOString(),remoteRevision:null,
 evidence:[{file:b+'/mgShape.json',kind:'real button set and left-visible property'}, {file:b+'/mgHiddenButton.json',kind:'16px glyph and right2 group'}, {file:b+'/button-rules-read-1019.json',node:'68268:63477',kind:'visible left icon original instance and dimensions'}, {file:b+'/mgIconSpec.json',kind:'functional icon equal-ratio SVG use; common14/16/18/20/24 sizes'}],
 geometry:{height:42,sidePadding:24,iconBox:16,groupPaddingRight:2,rootGap:2,effectiveLabelGap:4},
 iconScalePolicy:'Functional SVG geometry remains unchanged; Cart native14 is rendered proportionally16 in the genuine16px slot under Icon functional scaling guidance. This is not a resize permission for the separately locked static content icons.',
 excluded:'67636:070148 hidden Download exported an empty16×16 SVG and no PNG; not installed or used as valid white glyph.',
 previewBoundary:'Only the actual black Download visible example is displayed in the component gallery. Cart/quote call combinations are verified as host calls, not new business component variants.',
 assets,
 completionConditions:['Source property and finite geometry registered','Existing no-icon calls remain valid','Finite same-paint FS resources bind without label HTML or external overlays','Compiler, public output and actual browser geometry/states checked','Affected host references synchronized; no historical page upgrade'],
 remaining:['Heart independently source-pending','Visible left icon in Processing not admitted','Whole-page A2/A3 and regeneration/review remain separate'],
});
const file='components/contracts/button.json',c=JSON.parse(fs.readFileSync(file));
for(const key of ['icon','iconHidden'])if(!c.editable.includes(key))c.editable.push(key);
for(const name of ['filled-red','outline-black']){
 const r=c.aiContract.variants[name];
 for(const key of ['icon','iconHidden'])if(!r.allowedEdits.includes(key))r.allowedEdits.push(key);
 r.bindings.icon={mode:'registered-icon',target:'img.ds-btn__leading-icon',attribute:'src',values:assets.filter(a=>a.paint===(name==='filled-red'?'#FFFFFF':'#19191A')).map(a=>a.file),sizes:[name==='filled-red'?'xl-regular':'xl']};
 r.bindings.iconHidden={mode:'native-attribute',target:'span.ds-btn__leading',attribute:'hidden',values:[false,true],default:true,sourceProperty:'显示左侧图标',sourceInverted:true,sizes:[name==='filled-red'?'xl-regular':'xl']};
 r.leadingIconScope={size:name==='filled-red'?'xl-regular':'xl',states:['Default','Hover','Disabled'],source:'components/sources/button/leading-icon-source-1019.json',processing:'hidden only; visible source not confirmed'};
}
c.aiContract.evidence.leadingIcon='components/sources/button/leading-icon-source-1019.json';
c.aiContract.behavior.leadingIcon='可选左图标走真实槽：16px图标、组内右距2px、根gap2px；只绑定各颜色有限FS资源。文字槽仍禁止HTML。默认隐藏；显示仅42px regular Default/Hover/Disabled。Processing保留隐藏。';
for(const a of assets)if(!c.relations.iconDependencies.some(x=>x.icon===a.file.split('/').pop()&&x.usage?.includes('left-slot16')))c.relations.iconDependencies.push({icon:a.file.split('/').pop(),appliesTo:[a.paint==='#FFFFFF'?'filled':'outline'],required:false,usage:'left-slot16; '+a.role+'; finite source palette, native paint retained'});
c.updatedAt='2026-10-19';write(file,c);
const regFile='components/icons/icons-manifest.json',reg=JSON.parse(fs.readFileSync(regFile));
for(const a of assets){let e=reg.icons.find(e=>e.file===a.file.split('/').pop());if(!e){e={name:a.file.split('/').pop().replace('.svg',''),file:a.file.split('/').pop(),category:'action',description:'FS原件功能图标：'+a.role,size:a.nativeSize+'x'+a.nativeSize,fill:a.paint,usedBy:[]};reg.icons.push(e);}if(!e.usedBy.includes('Button/leading-slot16'))e.usedBy.push('Button/leading-slot16');e.buttonLeadingSource='components/sources/button/leading-icon-source-1019.json';}
reg.lastUpdated='2026-10-19';write(regFile,reg);
const preview='components/preview/button.html';let html=fs.readFileSync(preview,'utf8');
const lead=(icon,hidden)=>`<span class="ds-btn__leading"${hidden?' hidden':''}><img class="ds-btn__leading-icon" src="../icons/${icon}" alt="" aria-hidden="true"></span>`;
for(const [id,icon] of [['ai-button-filled-red-xl-regular','icon-cart-add.svg'],['ai-button-outline-black-xl','icon-fs-download-black-16.svg']]){
 const pattern=new RegExp('(<button\\b[^>]*id="'+id+'"[^>]*>)(?!<span class="ds-btn__leading")');html=html.replace(pattern,'$1'+lead(icon,true));
}
if(!html.includes('id="source-button-left-icon"'))html=html.replace('</body>','<section class="section" id="source-button-left-icon"><h2>42px 左图标槽 · 原件示例</h2><p>MasterGo 68268:63477；实际Download原件。槽位支持不等于新增业务专用按钮。</p><button type="button" class="ds-btn ds-btn--outline-black ds-btn--xl">'+lead('icon-fs-download-black-16.svg',false)+'<span class="ds-btn__text">Button Name</span></button></section></body>');
fs.writeFileSync(preview,html);
console.log('Installed genuine optional slot in two finite42px calls; target page untouched.');
