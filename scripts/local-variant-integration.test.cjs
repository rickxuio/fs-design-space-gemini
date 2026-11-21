'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const L=require('./local-component-library.cjs'),{assemblePage,loadRegistry}=require('../build.js'),V=require('./check-local-library-page.cjs');
const target=path.join(L.ROOT,'maintenance/variant-integration-20261113'),baseline=JSON.parse(fs.readFileSync(path.join(target,'baseline-59.json'))),JSDOM=L.domAPI();
function source(c,f,p){return `<div data-component="${c}" data-fragment="${f}"${p?` data-props='${JSON.stringify(p).replace(/'/g,'&#39;')}'`:''}></div>`;}
test('all 59 exact variants render through unchanged local registry syntax and constrained content fields',()=>{
 assert.equal(baseline.variants.length,59);
 for(const v of baseline.variants){const use=L.render(v.key,v.fragment);assert.equal(use.entry.callable,true,v.id+'/'+v.fragment);const d=new JSDOM(use.html),e=d.window.document.body.firstElementChild,props={};
  for(const [field,slot]of Object.entries(use.entry.slots||{})){const n=slot.selector===':scope'?e:e.querySelector(slot.selector);props[field]=slot.mode==='structured-content'?n.innerHTML:n.textContent;}
  const roundtrip=L.render(v.key,v.fragment,props);assert.equal(roundtrip.entry.sourceVariant,v.name);assert.ok(roundtrip.styles.length);assert.throws(()=>L.render(v.key,v.fragment,{addClass:'invented'}));d.window.close();
 }
});
test('new field adapters reject malformed content, ranges and unsafe anatomy',()=>{
 const bad=[['badge','count',{displayCount:'100'}],['video-button','dark',{duration:'1:99'}],['input-number','outline-sm',{value:0}],['input-number','outline-sm',{min:8,max:3}],['rate','input',{value:6}],['rate','input',{labels:['only one']}],['select','single-basic',{options:'<div>invented control</div>'}],['tab','standard',{items:'<button>wrong</button>'}]];
 for(const [c,f,p]of bad)assert.throws(()=>L.render('library-'+c,f,p),c+'/'+f);
 const count=L.render('library-badge','count',{displayCount:'99+'}).html;assert.match(count,/ds-badge-count--max/);
 const optional={reference:'reference-inputs/arista-support-overview/content.json',objectId:'SERVICE-1',slots:['bullets','link']};
 const card=new JSDOM(L.render('library-icon-card','center-single-event',{titleHref:'https://www.arista.com/en/support',sourceAbsent:optional}).html);
 assert.equal(card.window.document.querySelectorAll('.ds-icon-card__bullets,.ds-icon-card__link').length,0);assert.ok(card.window.document.querySelector('.ds-icon-card__desc'));assert.equal(card.window.document.querySelector('.ds-icon-card__title-slot a').hasAttribute('aria-disabled'),false);card.window.close();
 for(const sourceAbsent of [{...optional,objectId:'missing'},{...optional,slots:['title']},{...optional,reference:'../outside.json'}])assert.throws(()=>L.render('library-icon-card','center-single-event',{sourceAbsent}));
 assert.throws(()=>L.render('library-icon-card','center-single-event',{titleHref:'javascript:alert(1)'}));

 const d=new JSDOM(L.render('library-menu-navigation','single-level').html),root=d.window.document.body.firstElementChild;let items=root.querySelector('ul');const original=[...items.children].map(x=>x.cloneNode(true));items.replaceChildren();for(let i=0;i<14;i++){const n=original[Math.min(i,original.length-1)].cloneNode(true);n.querySelector('.ds-menu-navigation__item-label').textContent='Source entry '+(i+1);n.querySelector('button').dataset.value='entry-'+i;items.append(n);}assert.equal(new JSDOM(L.render('library-menu-navigation','single-level',{menuContent:root.innerHTML}).html).window.document.querySelectorAll('button.ds-menu-navigation__item').length,14);d.window.close();
});
test('local assembly loads one complete version for all 59 variants, with both fixed shell fragments',()=>{
 const body=baseline.variants.map(v=>`<section class="page-section"><div class="container"><h2>${v.id} / ${v.fragment}</h2>${source(v.key,v.fragment,v.id==='badge'&&v.fragment==='count'?{displayCount:'99+'}:undefined)}</div></section>`).join('\n');
 const html=assemblePage('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>59 exact local variants · engineering check</title><style>body{margin:0;font-family:"Open Sans",Arial,sans-serif}.container{max-width:1200px;margin:0 auto;padding:0}.page-section{padding:40px 0}.page-section h2{font-size:24px;line-height:32px;font-weight:600;text-align:center;margin:0 0 24px}</style></head><body>'+source('library-navigation','header')+'<main>'+body+'</main>'+source('library-navigation','footer')+'</body></html>',loadRegistry(),new Map(),'variants-59.html',{targetDir:target}).html;
 const file=path.join(target,'variants-59.html');fs.writeFileSync(file,html);const issues=V.validateFile(file);assert.deepEqual(issues.filter(i=>i.level==='error'),[]);assert.equal(new JSDOM(html).window.document.querySelectorAll('main [data-library-component]').length,59);
});
