'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {rootLayouts}=require('./checkbox-root-layout');
const SOURCE='components/sources/radio/small-default-root-mode-review-1014.json';
const LARGE_SOURCE='components/sources/radio/large-default-root-mode-review-1014.json';
function sourceFiles(root){return [SOURCE,LARGE_SOURCE].flatMap(file=>{const s=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));return [file,s.evidence];});}
function validateRadioLargeRootLayout(root,css){
 const s=JSON.parse(fs.readFileSync(path.join(root,LARGE_SOURCE),'utf8')),bytes=fs.readFileSync(path.join(root,s.evidence));
 if(s.node!=='92:06617'||s.source.fileId!=='165174720386955'||s.source.pageId!=='92:04936'||s.size!=='大号'||s.widthMode!=='适应'||crypto.createHash('sha256').update(bytes).digest('hex')!==s.sha256||!bytes.toString().includes('layer_id='+encodeURIComponent(s.node))||(bytes.toString().match(/文本栏 适应/g)||[]).length<2)throw Error('Radio large root source unresolved or stale');
 const result=rootLayouts(root,css,'radio-large');
 if(result.some(x=>x.width!=='fit-content'||x['max-width']!=='100%'||x['align-self']!=='flex-start'||!['initial','auto','0','0px'].includes(x['min-width'])))throw Error('Radio large root differs from source content-hugging mode');
 return result;
}
function validateRadioSmallRootLayout(root,css){
 const s=JSON.parse(fs.readFileSync(path.join(root,SOURCE),'utf8')),bytes=fs.readFileSync(path.join(root,s.evidence));
 if(s.node!=='68358:94514'||s.size!=='小号'||s.widthMode!=='适应'||crypto.createHash('sha256').update(bytes).digest('hex')!==s.sha256||!bytes.toString().includes('layer_id='+encodeURIComponent(s.node))||(bytes.toString().match(/文本栏 适应/g)||[]).length<2)throw Error('Radio small root source unresolved or stale');
 const result=rootLayouts(root,css,'radio-small');
 if(result.some(x=>x.width!=='fit-content'||x['max-width']!=='100%'||x['align-self']!=='flex-start'||!['initial','auto','0','0px'].includes(x['min-width'])))throw Error('Radio small root differs from source content-hugging mode');
 return result;
}
module.exports={SOURCE,LARGE_SOURCE,sourceFiles,validateRadioSmallRootLayout,validateRadioLargeRootLayout};
