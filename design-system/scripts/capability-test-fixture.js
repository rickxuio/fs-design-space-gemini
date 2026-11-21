'use strict';
const fs=require('node:fs'),path=require('node:path');
// Extend existing isolated native fixtures with the finite new owned parts.
function completeFixture(root,source=path.resolve(__dirname,'..')) {
 const copy=f=>{const dst=path.join(root,f);fs.mkdirSync(path.dirname(dst),{recursive:true});fs.cpSync(path.join(source,f),dst,{recursive:true});};
 for(const id of ['banner','card','icon-card','list','input','menu-navigation','text-button','collapse','carousel','navigation','button']) {
  const c=JSON.parse(fs.readFileSync(path.join(source,'components/contracts/'+id+'.json')));
  for(const f of [...c.integration.styles,...c.integration.scripts])if(!fs.existsSync(path.join(root,f)))copy(f);
  for(const part of Object.values(c.parts||{}))for(const f of [part.sourcePreview])if(f&&!fs.existsSync(path.join(root,f)))copy(f);
 }
 copy('components/sources/capability-completion-20261115');
 copy('components/sources/five-variants-20261115');
 copy('docs/assets/20250901105611h7ydr7.jpg.webp');
 copy('components/sources/banner/gpt28-native-official-1015.svg');
 copy('components/sources/banner/search42-icon-identity-1015.json');
 copy('components/sources/banner/search42-gpt-nested-source-1015.json');
 return root;
}
module.exports={completeFixture};
