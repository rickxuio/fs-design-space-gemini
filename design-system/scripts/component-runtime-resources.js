'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const digest=b=>crypto.createHash('sha256').update(b).digest('hex'),slash=p=>p.split(path.sep).join('/'),isFinderMetadata=n=>n.split('/').at(-1)==='.DS_Store';
function localFile(root,base,url){
 if(!url || /^(?:[a-z][\w+.-]*:|\/\/|#)/i.test(url))return null;
 const plain=url.split(/[?#]/)[0];
 const file=plain.startsWith('/')?path.resolve(root,'.'+plain):path.resolve(path.dirname(base),plain);
 const relative=path.relative(root,file);
 if(relative.startsWith('..') || path.isAbsolute(relative))throw Error('资源路径越出项目：'+url);
 return {file,relative:slash(relative),suffix:url.slice(plain.length)};
}
function runtimeInputs(root){
 const files=new Set();
 for(const f of fs.readdirSync(path.join(root,'components')))if(/\.(css|js)$/.test(f))files.add('components/'+f);
 function walk(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true})){const name=dir+'/'+entry.name;if(isFinderMetadata(name))continue;if(entry.isDirectory())walk(name);else files.add(name);}}
 walk('components/icons');
 // Source-locked US Footer rasters are real runtime assets. Admit only the
 // explicit export manifest and verify its bytes; never copy arbitrary sources.
 const footerManifest='components/sources/navigation/footer-assets-1013/manifest.json';
 if(fs.existsSync(path.join(root,footerManifest))){
  const manifest=JSON.parse(fs.readFileSync(path.join(root,footerManifest),'utf8'));
  for(const asset of manifest.assets){
   if(!/^components\/sources\/navigation\/footer-assets-1013\/68908-\d+\.png$/.test(asset.path))throw Error('Footer运行素材路径不受支持');
   if(digest(fs.readFileSync(path.join(root,asset.path)))!==asset.sha256)throw Error('Footer运行素材指纹不一致：'+asset.path);
   files.add(asset.path);
  }
 }
 // CSS relative dependencies keep their directory layout. Never fetch remote assets.
 for(const name of files){
  if(!name.endsWith('.css'))continue;
  const css=fs.readFileSync(path.join(root,name),'utf8');
  for(const match of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+["']([^"']+)["']/g)){
   const target=localFile(root,path.join(root,name),(match[1]||match[2]).trim());
   if(target){if(isFinderMetadata(target.relative))throw Error('系统元数据不能作为运行资源：'+target.relative);if((match[1]||match[2]).trim().startsWith('/'))throw Error('CSS 绝对路径不能保持版本隔离，请先改成相对组件路径');if(!fs.existsSync(target.file))throw Error('缺少 CSS 资源：'+target.relative);files.add(target.relative);}
  }
 }
 return [...files].sort();
}
module.exports={runtimeInputs};
