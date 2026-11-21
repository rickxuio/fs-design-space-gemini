'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {JSDOM}=require('jsdom');
const {buildReference}=require('./compile-component-reference');
const ROOT=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
function validateFooter(html){
  const doc=new JSDOM(html).window.document,footer=doc.querySelector('[data-footer-pc-current]');
  assert.ok(footer);assert.equal(footer.querySelectorAll('.ds-text-btn').length,0,'source direct text must not pretend TextButton');
  const source=new JSDOM(JSON.parse(read('components/sources/navigation/pc-us-footer-full-node-1013.json')).html).window.document;
  const sourceGroups=['047206','047177','047089','047115'];
  const columns=[...footer.querySelectorAll('.ds-nav-footer__col-links')];
  for(let i=0;i<columns.length;i++){
    const group=source.querySelector(`[data-node-id="68908:${sourceGroups[i]}"]`);assert.ok(group,'source column missing');
    const expected=[...group.querySelectorAll('span')].map(n=>n.textContent.trim()).filter(Boolean);
    assert.deepEqual([...columns[i].querySelectorAll('a')].map(n=>n.textContent.trim()),expected);
  }
  const actual=footer.querySelector('[data-footer-button-current]').cloneNode(true);
  const atom=new JSDOM(read('components/variants/button.html')).window.document.querySelector('#ai-button-filled-red-s').cloneNode(true);
  actual.removeAttribute('data-footer-button-current');atom.removeAttribute('id');atom.querySelector('.ds-btn__text').textContent='Subscribe';
  assert.ok(actual.isEqualNode(atom),'Subscribe must call actual Button anatomy');
  assert.ok(footer.querySelector('[data-footer-input-retained-source]'),'retained source input identity must stay explicit');
  assert.equal(footer.querySelector('[data-footer-input-retained-source]').className,'ds-input-footer-source');
  const inputPrototype=new JSDOM(read('components/sources/input/navigation-footer-retained-default.html')).window.document.querySelector('input');
  assert.ok(footer.querySelector('[data-footer-input-retained-source]').isEqualNode(inputPrototype),'retained Input must call its owned frozen source prototype');
  const manifest=JSON.parse(read('components/sources/navigation/footer-assets-1013/manifest.json'));
  for(const asset of manifest.assets){assert.ok([...footer.querySelectorAll('img')].some(i=>i.getAttribute('src').endsWith(asset.path.replace('components/',''))),'missing source graphic '+asset.nodeId);assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,asset.path))).digest('hex'),asset.sha256);}
  assert.equal(footer.querySelector('.ds-nav-footer__app-badges img').alt,'Google Play');
  assert.equal(footer.querySelector('.ds-nav-footer__badges-left img').alt,'DigiCert');
  assert.equal(footer.querySelectorAll('[href="#"]').length,0);
}
test('PC Footer matches full source text, real Button S and exported graphic identity',()=>validateFooter(read('components/variants/navigation.html')));
test('PC Footer rejects fictitious atom structure and wrong certification brand',()=>{
  const original=read('components/variants/navigation.html');
  assert.throws(()=>validateFooter(original.replace('class="ds-nav-footer__col-link"','class="ds-text-btn"')));
  assert.throws(()=>validateFooter(original.replace('alt="DigiCert"','alt="Trustpilot"')));
});
test('retained Footer Input part cannot escape its source host or alter current42px Input calls',()=>{
  const input=JSON.parse(read('components/contracts/input.json'));
  const part=input.parts['navigation-us-retained-default'];
  assert.deepEqual(part.allowedHosts,[{component:'Navigation',variant:'footer'}]);
  assert.equal(part.source,'components/sources/navigation/footer-retained-input-default-1013.json');
  const basic=buildReference(ROOT,'input');
  assert.deepEqual(basic.selection.supported,['gray','white']);
  assert.ok(basic.examples.every(e=>!e.exampleHtml.includes('ds-input-footer-source')));
  assert.ok(!read('components/input-footer-source.css').includes('.ds-input-field'));
  assert.ok(!read('components/variants/navigation.html').match(/data-footer-pc-current[\s\S]*?<\/footer>/)?.[0].includes('data-input-current'));
});
test('PC Footer browser receipt stays finite and fresh without admitting unrelated Input/state source scopes',()=>{
  const receipt=JSON.parse(read('components/sources/navigation/pc-footer-implementation-review-1013.json'));
  for(const [file,hash] of Object.entries(receipt.runtimeFingerprints))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT,file))).digest('hex'),hash,file+' changed after measurement');
  assert.deepEqual(receipt.browser.viewport,{width:1920,height:1000});assert.deepEqual(receipt.browser.footer,{width:1920,height:451});assert.equal(receipt.browser.imagesLoaded,7);
  const nav=buildReference(ROOT,'navigation');assert.ok(nav.selection.supported.includes('footer'));assert.ok(nav.selection.unsupported.includes('live-input-master'));assert.deepEqual(nav.examples.find(e=>e.name==='footer').allowedEdits,[]);
});
