'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {validateHostedButtons}=require('./button-host-dependencies');
const button=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../components/contracts/button.json')));
const host={name:'TestHost',relations:{componentDependencies:[{component:'Button',requiredVariants:['filled-red'],requiredSizes:[{variant:'filled-red',size:'l'}],appliesTo:['test']}]}};
const html='<section><button type="button" class="ds-btn ds-btn--filled-red ds-btn--l"><span class="ds-btn__text">Confirm</span></button></section>';
const check=(exampleHtml=html,c=host,b=button)=>validateHostedButtons(c,[{name:'test',exampleHtml}],b);
test('finite Button nesting validates exact atom anatomy and size without claiming browser proof',()=>{
 const r=check();assert.equal(r.checked[0].buttons[0].size,'l');assert.equal(r.browserVerified,false);assert.deepEqual(r.pending,[]);
});
test('wrong size, fake label and lost native semantics are rejected',()=>{
 for(const [change,pattern] of [[s=>s.replace('ds-btn--l','ds-btn--m'),/exact child size/],[s=>s.replace('ds-btn__text','fake-label'),/anatomy/],[s=>s.replace('type="button"',''),/anatomy/]])assert.throws(()=>check(change(html)),pattern);
});
test('host may place an atom but may not restyle its padding, color or radius',()=>{
 assert.equal(check(html.replace('<button','<button style="position:absolute;right:20px"')).checked.length,1);
 for(const style of ['padding:0','color:red','border-radius:8px'])assert.throws(()=>check(html.replace('<button','<button style="'+style+'"')),/overrides atomic style/);
});
test('submit semantics require a real form and cannot be inferred from a div host',()=>{
 assert.throws(()=>check(html.replace('type="button"','type="submit"')),/native form/);
 assert.equal(check(html.replaceAll('section','form').replace('type="button"','type="submit"')).checked[0].buttons[0].type,'submit');
});
test('unregistered exact child-size evidence stays pending instead of guessing or certifying',()=>{
 const c=structuredClone(host);delete c.relations.componentDependencies[0].requiredSizes;
 const r=check(html,c);assert.equal(r.checked.length,0);assert.equal(r.pending.length,1);
});
test('host cannot bypass atomic text protection through child styles, extra label classes or undeclared siblings',()=>{
 for(const change of [s=>s.replace('class="ds-btn__text"','class="ds-btn__text" style="color:red"'),s=>s.replace('class="ds-btn__text"','class="ds-btn__text host-label"')])assert.throws(()=>check(change(html)),/atomic text/);
 assert.throws(()=>check(html.replace('</button>','<span class="host-added-icon">+</span></button>')),/anatomy/);
});
test('undeclared size and state classes cannot hide behind one valid atomic class',()=>{
 for(const extra of ['ds-btn--unknown-size','ds-btn--processing','ds-btn--hover','ds-btn--disabled'])assert.throws(()=>check(html.replace('ds-btn--l','ds-btn--l '+extra)),/unregistered atomic class/);
 const blackHost=structuredClone(host);blackHost.relations.componentDependencies[0].requiredVariants=['filled-black'];blackHost.relations.componentDependencies[0].requiredSizes=[{variant:'filled-black',size:'xl'}];
 assert.throws(()=>check(html.replace('filled-red','filled-black').replace('ds-btn--l','ds-btn--xl ds-btn--l'),blackHost),/unregistered atomic class/);
});
test('every registered variant-size pair needs a real child instance',()=>{
 const c=structuredClone(host);c.relations.componentDependencies[0].requiredSizes.push({variant:'filled-red',size:'m'});
 assert.throws(()=>check(html,c),/declared child size missing.*filled-red\/m/);
});
