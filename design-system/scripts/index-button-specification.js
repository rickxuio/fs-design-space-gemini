#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'..');
const SOURCE='docs/handoff/archives/2026-10-09-overnight/mastergo/button-spec-document.json';
const OUTPUT='components/sources/button/specification-index.json';
function indexSpecification(root=ROOT){
  const bytes=fs.readFileSync(path.join(root,SOURCE)),saved=JSON.parse(bytes);
  const block=saved.content?.find(c=>c.type==='text');
  const dsl=block&&JSON.parse(block.text).dsl;
  const section=dsl?.nodes?.find(n=>n.id==='68268:61757');
  if(!section||section.type!=='FRAME')throw Error('Missing saved Button specification section');
  const texts=[];function walk(n,ancestors=[]){
    const current=[...ancestors,{nodeId:n.id,type:n.type,name:n.name||null}];
    if(n.type==='TEXT'){
      const text=(n.text||[]).map(r=>r.text||'').join('');
      texts.push({nodeId:n.id,type:n.type,text,ancestors,
        role:['Button Name','Learn more','Add','03:52','00:28'].includes(text)?'embedded-component-example':'document-text'});
    }
    for(const child of n.children||[])walk(child,current);
  }walk(section);
  const get=id=>{const matches=texts.filter(t=>t.nodeId===id);if(matches.length!==1||!matches[0].text)throw Error('Missing/duplicate specification text '+id);return {nodeId:id,text:matches[0].text};};
  const ruleIds=['68268:61893','68796:91763','68268:61846','68796:91676'];
  const rules=ruleIds.map(get);
  if(!rules[0].text.includes('填充按钮、描边按钮、图标按钮、和文字按钮')||!rules[1].text.includes('箭头图标随文本加粗')||!rules[2].text.includes('文字大小 12px')||!rules[3].text.includes('Hover由灰色变黑色'))throw Error('Saved Button rule body changed; review the source before rebuilding');
  // The saved document table pairs a size/function heading with a usage cell
  // through its actual common row ancestor, never by screen position or export name.
  const categories=['68268:61924','68268:62189','68268:62349','68268:62419','68268:62627'].map(id=>texts.find(t=>t.nodeId===id));
  if(categories.some(t=>!t||t.type!=='TEXT'))throw Error('Missing saved specification type heading');
  // 62357 is the Cart type's shared subdivision label, not a usage-row heading.
  const dimensions=texts.filter(t=>t.nodeId!=='68268:62357'&&t.role==='document-text'&&/^(?:高度\d+|字号\d+px|(?:16|20|24)px\s*[弱强]功能|圆型|方形)/.test(t.text));
  const usageRows=dimensions.map(heading=>{
    const inAncestor=id=>texts.filter(t=>t.role==='document-text'&&t.ancestors.some(a=>a.nodeId===id));
    const usage=t=>/^(?:常规组件：|组合组件：|组合类型：|左右内间距\d+px：)/.test(t.text);
    const row=[...heading.ancestors].reverse().find(a=>inAncestor(a.nodeId).some(usage));
    if(!row||row.type!=='FRAME')throw Error('Missing actual specification usage row');
    const members=inAncestor(row.nodeId);
    if(dimensions.filter(d=>d.ancestors.some(a=>a.nodeId===row.nodeId)).length!==1)throw Error('Ambiguous specification dimension/usage pairing: '+heading.nodeId);
    const category=categories.filter(t=>heading.ancestors.some(a=>a.nodeId===t.ancestors[t.ancestors.length-2]?.nodeId));
    if(category.length!==1)throw Error('Ambiguous specification type ancestry');
    return {rowNodeId:row.nodeId,rowNodeType:row.type,typeHeading:get(category[0].nodeId),dimensionOrFunctionHeading:get(heading.nodeId),usageTexts:members.filter(usage).map(t=>get(t.nodeId)),
      interpretation:'Saved document usage fact only; not automatic component selection, source component count or an approved runtime/host.'};
  });
  if(usageRows.length!==33||new Set(usageRows.map(r=>r.rowNodeId)).size!==33)throw Error('Saved specification usage-row coverage changed; review before rebuilding');
  return {schemaVersion:'fs-button-specification-index/1.0.0',classification:'specification-document-section',
    source:{file:SOURCE,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),fileId:'143880409387753',sectionNodeId:section.id,sectionType:section.type,remoteRevisionProvided:false},
    scope:'saved-update-log-and-button-type-section-only',version:get('68268:61783/67636:067122'),updateDate:get('68268:61783/67636:067130'),rules,texts,usageRows,
    summary:{documentTexts:texts.filter(t=>t.role==='document-text').length,embeddedExampleTexts:texts.filter(t=>t.role==='embedded-component-example').length,explicitRuleTexts:rules.length,usageRows:usageRows.length},
    limits:['正文及文本节点是规范片段依据；容器名称、页面左右位置或FRAME类型本身不能证明规范身份。','只覆盖已保存的更新日志和按钮类型章节；未取得其余章节，不代表完整规范。','嵌入的组件示例文字不是新的组件定义，不加入组件数量。','设计规范片段不是原前端源码、浏览器计算样式、运行行为或视觉批准。','文档版本不等于组件集合版本或当前远端修订时间。']};
}
if(require.main===module){const out=indexSpecification();fs.mkdirSync(path.join(ROOT,path.dirname(OUTPUT)),{recursive:true});fs.writeFileSync(path.join(ROOT,OUTPUT),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out.summary));}
module.exports={indexSpecification,SOURCE,OUTPUT};
