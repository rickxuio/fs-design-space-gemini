'use strict';
const fs=require('node:fs'),path=require('node:path');
const SOURCE='components/sources/icon-card/center-parent-source-review-1013.json';
function validateIconCardCurrentSurface(root){
 const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
 const source=read(SOURCE),contract=read('components/contracts/icon-card.json');
 const original=(source.raw?.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n');
 const paint=original.match(/background:\s*(#[0-9a-f]{6})/i)?.[1];
 const token=read('components/token-specs/colors.json').tokens.find(x=>x.name==='color.gray-9');
 if(!paint||paint.toLowerCase()!==source.confirmed?.background?.toLowerCase()||paint.toLowerCase()!==token?.value?.toLowerCase())throw Error('IconCard current gray surface source/token mismatch');
 const expected='ds-icon-card--bg-gray';
 const variants=['center.single-event','left.single-event'];
 if(contract.relations?.parentContext||contract.backgroundBorderRules?.some(x=>x.sectionColor)||variants.some(v=>contract.backgroundBorderRules?.find(x=>x.variants?.includes(v))?.class!==expected))throw Error('IconCard current gray surface rule cannot rewrite original gray component to white or derive it from section color');
 if(!contract.aiContract?.locked?.includes('Gray surface without border and selected layout'))throw Error('IconCard current gray surface admission boundary missing');
 if(source.confirmed?.radius!==8)throw Error('IconCard current source radius is not the admitted8px');
 return {source:SOURCE,sourceNode:source.source.node,color:paint,token:token.name,class:expected,radius:source.confirmed.radius,borderWidth:0,scope:'existing gray center/left single-event cards on white or gray sections; white-card variants remain excluded'};
}
module.exports={validateIconCardCurrentSurface,SOURCE};
