'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{JSDOM}=require('jsdom'),root=path.resolve(__dirname,'..');
test('MG-reconciled solution Stepper blocks pending pointer/keyboard and permits revisiting available stages',()=>{
 const html=fs.readFileSync(path.join(root,'components/variants/stepper.html'),'utf8');assert.ok(!html.includes('点击任一节点即可定位当前阶段'));
 const source=new JSDOM(html).window.document.querySelector('[data-ai-example="ai-stepper-circle-centered-solution"]').cloneNode(true),items=source.querySelectorAll('[data-stepper-item]');items[0].className='ds-stepper__item ds-stepper__item--completed';items[1].className='ds-stepper__item ds-stepper__item--current';
 const d=new JSDOM('<body>'+source.outerHTML+'</body>',{runScripts:'outside-only'});try{const w=d.window;w.eval(fs.readFileSync(path.join(root,'components/stepper-current.js'),'utf8'));w.document.dispatchEvent(new w.Event('DOMContentLoaded'));const ns=w.document.querySelectorAll('[data-stepper-item]'),active=()=>[...ns].findIndex(n=>n.classList.contains('ds-stepper__item--current'));
 assert.equal(active(),1);assert.equal(ns[2].getAttribute('aria-disabled'),'true');ns[2].click();ns[2].dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(active(),1);ns[0].click();assert.equal(active(),0);ns[1].dispatchEvent(new w.KeyboardEvent('keydown',{key:' ',bubbles:true}));assert.equal(active(),1);assert.equal(ns[2].getAttribute('aria-disabled'),'true');
 }finally{d.window.close();}
});
