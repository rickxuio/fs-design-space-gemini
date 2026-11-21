'use strict';
const fs=require('fs'),path=require('path'),{JSDOM}=require('jsdom');
function sync(root=path.resolve(__dirname,'..')){
 const file=path.join(root,'components/variants/form.html'),doc=new JSDOM(fs.readFileSync(file,'utf8')).window.document;
 const select=new JSDOM(fs.readFileSync(path.join(root,'components/variants/select.html'),'utf8')).window.document.querySelector('[data-ai-example="ai-select-single-basic"]');
 const original=doc.querySelector('[data-ai-example="ai-form-gray-current"]');if(!select||!original)throw Error('Source Form example lost its real child');
 const holder=doc.createElement('div');holder.setAttribute('data-form-source-reference','v1');holder.className='ds-form';
 for(const n of [original.querySelector('.ds-input-field'),select,original.querySelector('[data-input-kind="textarea"]'),original.querySelector('button[type="submit"]')])holder.append(doc.importNode(n,true));
 for(const n of holder.querySelectorAll('[data-ai-example]'))n.removeAttribute('data-ai-example');
 const ids=new Map();for(const n of holder.querySelectorAll('[id]')){ids.set(n.id,'source-reference-'+n.id);n.id=ids.get(n.id);}for(const n of holder.querySelectorAll('[for],[aria-controls],[aria-labelledby],[aria-describedby]'))for(const a of ['for','aria-controls','aria-labelledby','aria-describedby'])if(n.hasAttribute(a))n.setAttribute(a,n.getAttribute(a).split(' ').map(s=>ids.get(s)||s).join(' '));
 const start='<!-- AUTO-GENERATED-FORM-SOURCE:START -->',end='<!-- AUTO-GENERATED-FORM-SOURCE:END -->',block=start+'<section><h2>来源字段组合 · 共享 Input / Select / Textarea / Button</h2>'+holder.outerHTML+'</section>'+end;
 let html=fs.readFileSync(file,'utf8');const rx=/<!-- AUTO-GENERATED-FORM-SOURCE:START -->[\s\S]*?<!-- AUTO-GENERATED-FORM-SOURCE:END -->/;html=rx.test(html)?html.replace(rx,block):html.replace('</body>',block+'</body>');
 for(const css of ['select-current.css'])if(!html.includes('../'+css))html=html.replace('</head>','<link rel="stylesheet" href="../'+css+'"></head>');
 fs.writeFileSync(file,html);return holder.outerHTML;
}
if(require.main===module)sync();module.exports={sync};
