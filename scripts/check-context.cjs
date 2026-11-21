'use strict';
// One invocation only: never caches assembled instances or changes publication state.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const L=require('./local-component-library.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const normalize=s=>s.replace(/library-instance-\d+-/g,'library-instance-ID-');
function createContext(){return{releases:new Map(),canonical:new Map(),static:new Map(),stats:{releaseChecks:0,canonicalRenders:0,canonicalHits:0,staticRuns:0,staticHits:0}};}
function verifiedRelease(root,version,context){
 const manifestPath=path.join(root,'fs-components/component-specs/library/releases',version||'','manifest.json');
 if(!/^[a-f0-9]{64}$/.test(version||''))throw Error('Invalid library release');
 const bytes=fs.readFileSync(manifestPath),manifest=JSON.parse(bytes),base=path.dirname(manifestPath);
 const stamp=hash(bytes)+'|'+Object.keys(manifest.files).map(f=>{const s=fs.statSync(L.safeFile(base,f),{bigint:true});return [f,s.size,s.mtimeNs,s.ctimeNs,s.ino].join(':');}).join('|');
 const key=root+'|'+version;
 const previous=context.releases.get(key);
 if(previous!==stamp){L.verifyRelease(root,version);context.releases.set(key,stamp);context.stats.releaseChecks++;if(previous!==undefined){context.canonical.clear();context.static.clear();}}
 return stamp;
}
function canonical(node,root,version,targetDir,context){
 const props=JSON.parse(node.dataset.libraryProps||'{}');let reference='';
 for(const descriptor of [props.sourceAbsent,props.sourceFields])if(descriptor?.reference)reference+=hash(fs.readFileSync(L.safeFile(root,descriptor.reference)));
 const adapter=hash(fs.readFileSync(path.join(root,'scripts/local-component-library.cjs'))+fs.readFileSync(path.join(root,'scripts/local-slot-validation.cjs'))+fs.readFileSync(path.join(root,'scripts/local-form-fields.cjs')));
 const key=JSON.stringify([root,version,node.dataset.libraryComponent,node.dataset.libraryFragment,props,targetDir,reference,adapter]);
 if(context.canonical.has(key)){context.stats.canonicalHits++;return context.canonical.get(key);}
 const use=L.render(node.dataset.libraryComponent,node.dataset.libraryFragment,props,{root,version,targetDir});
 const value={use,html:normalize(use.html)};context.canonical.set(key,value);context.stats.canonicalRenders++;return value;
}
function staticKey(file,root,context,html=fs.readFileSync(file,'utf8')){
 const version=/data-fs-library=["']([a-f0-9]{64})["']/.exec(html)?.[1];
 const stamp=version?verifiedRelease(root,version,context):'';
 const references=[...html.matchAll(/(?:&quot;|\\")reference(?:&quot;|\\")\s*:\s*(?:&quot;|\\")([^&"<]+)(?:&quot;|\\")/g)].map(m=>m[1]);
 // Source-absence references are typically JSON in single-quoted attributes.
 const refValues=[...html.matchAll(/"reference"\s*:\s*"(reference-inputs\/[^"<>]+)"/g)].map(m=>m[1]);
 const refs=[...new Set([...references,...refValues])].map(f=>hash(fs.readFileSync(L.safeFile(root,f))));
 return JSON.stringify([path.resolve(file),hash(html),stamp,refs]);
}
module.exports={createContext,verifiedRelease,canonical,normalize,hash,staticKey};
