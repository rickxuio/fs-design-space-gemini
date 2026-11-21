'use strict';
// Presentation-only output from existing authoritative documents. No component publication.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const INPUTS=[
 {id:'project',source:'README.md',title:'项目说明',scope:'项目入口、目录和现有命令'},
 {id:'workflow',source:'AGENTS.md',title:'页面工作流',scope:'原有页面执行要求，以此源文件为准'},
 {id:'help',source:'design-system/docs/component-contribution-guide.md',title:'组件维护',scope:'当前维护命令、变体决策、父子依赖和问题归属'},
 {id:'quality-standard',source:'design-system/docs/component-quality-standard.md',title:'组件质量标准',scope:'工程验证、来源、视觉批准与家族覆盖的区别'},
];
const TARGETS={
 'index.html':'project','README.md':'project','AGENTS.md':'workflow',
 'design-spec/fs-design-system.md':'local-layout','design-spec/fs-design-system-preview.html':'local-layout',
 'design-system/index.html':'project','design-system/README.md':'project','design-system/AGENTS.md':'help',
 'design-system/docs/component-maintenance.html':'help','design-system/docs/component-contribution-guide.md':'help',
 'design-system/docs/component-contribution-guide.html':'help','design-system/docs/component-quality-standard.md':'quality-standard',
 'design-system/components/quality/report.html':'quality-report',
 'design-system/components/quality/report.md':'quality-report','design-system/components/quality/report.json':'quality-report',
};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function build({root=path.resolve(__dirname,'..')}={}){
 const {marked}=require(path.join(root,'design-system/node_modules/marked'));
 const {JSDOM}=require(path.join(root,'design-system/node_modules/jsdom'));
 const raw=INPUTS.map(item=>({...item,text:fs.readFileSync(path.join(root,item.source),'utf8')}));
 const fingerprint=crypto.createHash('sha256').update(JSON.stringify(raw)).digest('hex');
 const previewIds=new Set([...fs.readFileSync(path.join(root,'design-system/component-library.html'),'utf8').matchAll(/\{\s*id:\s*'([^']+)'/g)].map(m=>m[1]));
 const articles=raw.map(item=>{
  const dom=new JSDOM('<!doctype html><body>'+marked.parse(item.text,{gfm:true})+'</body>');const body=dom.window.document.body;
  for(const n of body.querySelectorAll('script,style,iframe,object,embed,link,base'))n.remove();
  for(const n of body.querySelectorAll('*'))for(const a of [...n.attributes])if(a.name.startsWith('on'))n.removeAttribute(a.name);
  const ids=new Set();for(const h of body.querySelectorAll('h1,h2,h3,h4,h5,h6'))if(!h.id){let id=h.textContent.trim().toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu,'-').replace(/^-|-$/g,'')||'section';const base=id;let i=2;while(ids.has(id))id=base+'-'+i++;h.id=id;ids.add(id);}
  const anchors=new Map();for(const n of body.querySelectorAll('[id]')){const old=n.id;const next=item.id+'--'+old;n.id=next;anchors.set(old,next);}
  for(const a of body.querySelectorAll('a[href]')){
   const href=a.getAttribute('href');if(!href)continue;if(href.startsWith('#')){const target=anchors.get(decodeURIComponent(href.slice(1)));if(target)a.href='#'+target;continue;}
   if(/^(?:https?:|mailto:|tel:)/i.test(href)){a.target='_blank';a.rel='noopener';continue;}
   if(/^[a-z][\w+.-]*:|^\/\//i.test(href)){a.removeAttribute('href');continue;}
   const u=new URL(href,'https://local.invalid/'+item.source),rel=decodeURIComponent(u.pathname.slice(1));
   if(TARGETS[rel]){a.href='../component-library.html#view/'+TARGETS[rel];a.target='_top';}
   else if(rel==='design-system/component-library.html'){a.href='../component-library.html'+u.search+(u.hash||'#library');a.target='_top';}
   else if((rel.startsWith('design-system/components/preview/')||rel.startsWith('design-system/components/variants/')||rel.startsWith('maintenance/foundation-prototypes-20261114/'))&&previewIds.has(path.basename(rel,'.html'))){a.href='../component-library.html#'+path.basename(rel,'.html');a.target='_top';}
   else if(fs.existsSync(path.join(root,rel))&&fs.statSync(path.join(root,rel)).isDirectory()){
    const code=body.ownerDocument.createElement('code');code.textContent=a.textContent;code.title=rel;a.replaceWith(code);
   }else{a.href=path.relative(path.join(root,'design-system/docs'),path.join(root,rel)).split(path.sep).join('/')+u.search+u.hash;a.target='_blank';a.rel='noopener';}
  }
  for(const image of body.querySelectorAll('img[src]')){const src=image.getAttribute('src');if(!src||/^(?:[a-z][\w+.-]*:|\/\/)/i.test(src))continue;const u=new URL(src,'https://local.invalid/'+item.source);image.src=path.relative(path.join(root,'design-system/docs'),path.join(root,decodeURIComponent(u.pathname.slice(1)))).split(path.sep).join('/')+u.search+u.hash;}
  const result=`<article class="reading-document" data-document="${item.id}" data-title="${escape(item.title)}"${item.id==='project'?'':' hidden'}><header class="reading-source"><p>${escape(item.scope)}</p><p>源文件：<code>${escape(item.source)}</code></p></header>${body.innerHTML}</article>`;dom.window.close();return result;
 }).join('\n');
 const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>项目阅读资料</title><meta name="fs-reading-source-sha256" content="${fingerprint}"><link rel="stylesheet" href="../components/tokens.css"><style>body{margin:0;color:#19191a;background:#fff;font:14px/1.8 var(--font-family-base);overflow-wrap:anywhere}main{max-width:1100px;margin:32px auto;padding:0 24px}.reading-document[hidden]{display:none}.reading-source{border-bottom:1px solid #dee0e3;padding-bottom:16px;margin-bottom:24px;color:#707070;font-size:12px}.reading-source p{margin:0 0 4px}h1{font-size:28px;line-height:38px;margin:0 0 24px}h2{font-size:22px;line-height:30px;margin:32px 0 16px}h3{font-size:18px;margin:24px 0 12px}a{color:#0060bf;text-underline-offset:3px}p,ul,ol{margin:0 0 16px}code{font-size:12px;background:#fafbfb;padding:2px 4px}pre{max-width:100%;overflow:auto;padding:16px;background:#fafbfb}pre code{padding:0}table{width:100%;table-layout:fixed;border-collapse:collapse;margin:20px 0}th,td{border:1px solid #dee0e3;padding:10px;text-align:left;vertical-align:top}th{background:#fafbfb}blockquote{margin:16px 0;border-left:3px solid #dee0e3;padding:0 16px;color:#707070}img{max-width:100%;height:auto}:focus-visible{outline:2px solid #0060bf;outline-offset:3px}</style></head><body><main>${articles}</main><script>(()=>{const wanted=new URLSearchParams(location.search).get('document')||'project';const documents=[...document.querySelectorAll('[data-document]')];const chosen=documents.find(n=>n.dataset.document===wanted)||documents[0];for(const n of documents)n.hidden=n!==chosen;document.title=chosen.dataset.title;if(location.hash){requestAnimationFrame(()=>{const id=decodeURIComponent(location.hash.slice(1));const n=chosen.querySelector('[id="'+CSS.escape(id)+'"]');if(n)n.scrollIntoView();});}})();</script></body></html>\n`;
 const file=path.join(root,'design-system/docs/reading.html');if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==html)fs.writeFileSync(file,html);return path.relative(root,file).split(path.sep).join('/');
}
module.exports={build,INPUTS};
if(require.main===module)console.log(build());
