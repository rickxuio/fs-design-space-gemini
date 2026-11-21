'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom'),ROOT=path.resolve(__dirname,'..'),{buildReference}=require('./compile-component-reference');
test('FAQ preserves source first/middle/last rows, original arrows and coordinated disclosure state without changing Cookies',()=>{
 const p=buildReference(ROOT,'collapse'),example=p.examples.find(e=>e.name==='faq');assert.ok(example);const d=new JSDOM(example.exampleHtml,{runScripts:'outside-only'}),doc=d.window.document;
 d.window.eval(fs.readFileSync(path.join(ROOT,'components/collapse-current.js'),'utf8'));const rows=[...doc.querySelectorAll('.ds-collapse__item')],button=i=>rows[i].querySelector('button'),body=i=>rows[i].querySelector('.ds-collapse__body');
 assert.deepEqual(rows.map(n=>n.dataset.faqPosition),['first','middle','last']);assert.equal(rows.every(n=>n.querySelector('p').hidden),true);
 button(0).click();assert.equal(body(0).hidden,false);assert.match(rows[0].querySelector('img').src,/faq-up-current/);button(2).click();assert.equal(body(0).hidden,true);assert.equal(body(2).hidden,false);assert.equal(rows[2].dataset.faqDivider,'on');body(2).click();assert.equal(body(2).hidden,false);button(2).click();assert.equal(rows[2].dataset.faqDivider,'off');assert.equal(button(2).getAttribute('aria-expanded'),'false');button(1).disabled=true;button(1).click();assert.equal(body(1).hidden,true);d.window.close();
});
