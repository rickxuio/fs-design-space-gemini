'use strict';
const fs=require('fs'),path=require('path');
function build({root=path.resolve(__dirname,'../..')}={}) {
const targetDir=path.join(root,'maintenance/button-prototype-20261113');
const B=require(path.join(root,'build.js')),L=require(path.join(root,'scripts/local-component-library.cjs'));
const c=JSON.parse(fs.readFileSync(path.join(root,'design-system/components/contracts/button.json'))),data=L.catalog(root),local=data.components['library-button'],review=local.ruleReview;
if(!review)throw Error('Button rule review is missing from the current local export.');

const e=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const available=(name,fragment)=>data.components[name]?.variants[fragment]?.callable===true;
const call=(f,p={})=>available('library-button',f)?`<div data-component="library-button" data-fragment="${f}" data-props='${e(JSON.stringify(p))}'></div>`:`<span class="availability-note">暂不可调用：${e(local.variants[f]?.reason||'缺少已登记片段')}</span>`;
const shell=f=>available('library-navigation',f)?`<div data-component="library-navigation" data-fragment="${f}"></div>`:'<p class="intro">同版导航待工程复核；此处不替换为其他版本。</p>';
const status=f=>available('library-button',f)?'可调用 · 按登记范围':'暂不可调用 · 待复核';
const names=Object.fromEntries(c.variants.map(v=>[v.name,v.chineseName||v.name]));
const sizeName=x=>({'xl-bold':'XL 加粗','xl-regular':'XL 常规',xl:'XL',l:'L',m:'M',s:'S'}[x]||x);
const sizes=f=>local.variants[f]?.runtimeParameters?.size?.values||local.variants[f]?.sizeOptions?.map(s=>s.name)||[];
const scopeSummary=f=>`${f==='cart-product-card'?'仅产品卡片 Default/Hover；不开放加载或气泡场景':sizes(f).map(sizeName).join('、')+'；默认、悬停、禁用、加载；左右图标独立显隐'}`;
const callSummary=f=>`${status(f)}；${scopeSummary(f)}`;

const groups=c.variants.map(v=>{let controls=v.sizes?v.sizes.map(size=>`<div class="spec-row" data-spec="${v.name}/${size.name}"><div class="spec-name">${e(size.name)}<small>${e(size.styleProperties.height)} · ${e(size.styleProperties.fontSize)}</small></div>${[{}, {}, {disabled:true},{loading:true}].map((state,i)=>`<div class="state-cell${v.name==='outline-white'?' state-cell--dark':''}" data-preview-state="${i===1?'hover':i===2?'disabled':i===3?'loading':'default'}">${call(v.name,{size:size.name,label:'Button Name',showLeftIcon:false,showRightArrow:false,...state})}</div>`).join('')}</div>`).join(''):`<div class="cart-row">${call(v.name)}<span>仅 Default / Hover；尺寸、禁用与加载不套用普通按钮参数。</span></div>`;return `<section class="page-section"><div class="container"><h2 class="section-heading">${e(v.chineseName||v.name)}</h2><p class="intro">${e(callSummary(v.name))}</p><div class="state-header"><span>规格</span><span>Default</span><span>Hover · 悬停查看</span><span>Disabled</span><span>Loading</span></div>${controls}</div></section>`;}).join('');
const decisions=c.relations.variantDecisions.map(d=>d.selectionCases.map((s,i)=>`<tr><th>${i===0?e(d.type):''}</th><td>${e(s.condition)}</td><td><strong>${s.kind==='reference'?'设计参考':s.kind==='avoid'?'不用':s.strength==='required'?'必须使用':'候选'}</strong> · ${e(s.result)}${s.kind==='reference'?'<small>不据此开放组合调用</small>':''}</td><td>${e(callSummary(d.variant))}</td></tr>`).join('')).join('');
// Reuse the original generated dependency summary via shared template helper; this preview owns no dependency data.
const {html:originalDependencies,css:dependencyCss}=require(path.join(root,'scripts/component-doc-template.cjs')).projectDependencyTable({
  root,id:'button',targetDir,classPrefix:'button-dependency-doc-',L,
  customize(dependencyDoc){
    const grid=dependencyDoc.querySelector('.dep-summary-grid');
    const sourceHeaders=[...grid.querySelectorAll('[role="columnheader"]')];
    if(sourceHeaders.length!==9 || sourceHeaders[7].textContent!=='图标')throw Error('Original dependency table columns changed; review before projecting the view.');
    const description=dependencyDoc.querySelector('.dep-summary-scroll').previousElementSibling;
    description.textContent='按按钮类型集中查看颜色、字体、间距、描边、圆角、阴影、图标和使用方。点规范名查看来源；向右滚动查看组件关系。关系仅登记或存在类名线索，不代表整个使用方已完成联动验收。';
    const iconItems=Object.entries(c.relations.iconSlots.assetBindings).map(([role,file])=>{const part=role==='download'?'left':role==='right'?'right':'loading',rows=c.relations.iconSlots.states.filter(s=>s[part]),name={download:'左侧下载图标',right:'右侧箭头',loading:'加载图标'}[role],url=path.relative(targetDir,path.join(root,'design-system',file)).split(path.sep).join('/');return `<a href="${e(url)}">${e(name)}</a> · ${[...new Set(rows.map(s=>s[part].width+'×'+s[part].height+'px'))].join(' / ')}<br><small>${role==='loading'?'加载状态：保留文案、间距8px':'默认、悬停、禁用；加载时隐藏'}</small>`;}).join('<br>');
    const cells=[...dependencyDoc.querySelectorAll('.dep-summary-grid > .dep-cell')];
    for(const i of [sourceHeaders.length+7,sourceHeaders.length*2+7]){if(!cells[i])throw Error('Unexpected original Button dependency table columns');cells[i].insertAdjacentHTML('beforeend','<hr><strong>当前调用 · MG 图标</strong><br>'+iconItems);}
  }
});
const dependencySection=`<section id="dependencies" class="page-section"><div class="container"><h2 class="section-heading">依赖汇总与维护</h2><p class="intro">沿用原规范的完整依赖汇总表，集中查看基础规范、图标及父组件关系。宽表可左右滚动，首列保持固定。父组件的证据状态按原记录展示；当前 MG 图标一并补在图标列。</p>${originalDependencies}<h3>修改后如何联动</h3><ol class="intro"><li>设计师在原规范 HTML 中调整样式或说明，由 AI 对照修改内容，协调原契约与共享实现。</li><li>继续通过原组件同步入口更新规范表、变体决策、本地调用资料和依赖记录；样板从这些来源重新生成。</li><li>共享规范更新后，维护中的父组件预览和新调用使用更新来源，并按实际影响复核；已交付页面保留原固定版本。</li></ol><p class="intro">工程维护入口：<code>npm run component:sync</code>；影响范围：<code>npm run impact -- button</code>。同步脚本不自动判断设计意图或替代父组件验收。</p></div></section>`;
const stateAudit=local.sourceVerification?.currentStates;
const stateEvidenceText=stateAudit?.status==='passed'?`当前开放的15种普通规格、60个状态及Cart默认/悬停2态，已与指定新MG文件逐项核对声明属性。<a href="../../design-system/${e(stateAudit.report)}">查看62项节点与实际渲染对照</a>。这不是整族或逐像素视觉批准。`:`当前状态来源核对：${e(stateAudit?.status||'not-reviewed')}，不可沿用旧报告作为本轮已核实依据。`;
const availabilityRows=c.variants.map(v=>`<tr><th>${e(names[v.name])}</th><td>${e(status(v.name))}</td><td>${e(scopeSummary(v.name))}</td><td>${e(local.engineering?.status==='current'?'当前有限范围已通过':'待工程复核')}；${local.engineering?.visual==='approved'?'视觉已确认':'视觉待确认'}</td></tr>`).join('');
const availabilitySection=`<section id="availability" class="page-section"><div class="container"><h2 class="section-heading">当前调用状态</h2><p class="intro">状态直接读取本地固定版本目录，不由样板自行批准。调用版本：<code>${e(data.version.slice(0,12))}</code>。可调用不等于整个组件族或全部宿主已经验收。</p><table class="decision-table"><thead><tr><th>变体</th><th>调用资格</th><th>规格与限制</th><th>工程状态</th></tr></thead><tbody>${availabilityRows}</tbody></table><p class="intro">${stateEvidenceText}</p><p class="intro">左右图标插槽的原始资料仍单独保留：${e(local.sourceVerification?.stateAndIcons?.fileId||'')}；本轮规则和开放状态核对来自指定文件${e(review.requestedSource.fileId)}，范围与来源分别记录。</p></div></section>`;
const conflictsSection=`<section id="rule-review" class="page-section page-section--gray"><div class="container"><h2 class="section-heading">规则核对与调用边界</h2>${review.conflicts.map(x=>`<div class="review-item"><h3>${e(x.title)} · ${x.status==='resolved-from-mg'?'已按 MG 修正':'待 MG 核对'}</h3><p class="intro">原冲突：${e(x.buttonRule.fact)} / ${e(x.hostRule.fact)}</p><p class="intro">${e(x.resolution?.basis||x.guidance)}</p><p class="intro">来源节点：${e((x.resolution?.sourceNodes||[]).join('、'))}</p></div>`).join('')}<h3>加载宽度的适用范围</h3><p class="intro">${e(review.loadingWidth?.conclusion||'待核对')}</p><h3>Cart 的来源与调用差异</h3><p class="intro">${e(review.cartBoundary?.source||'')} ${e(review.cartBoundary?.local||'')}</p><p class="intro"><a href="../../design-system/components/sources/button/local-rule-review-20261113.json">查看本次核对记录</a></p></div></section>`;
const summary=`<section class="page-section page-section--gray"><div class="container"><h1 class="prototype-title">Button 按钮样板</h1><p class="intro">按具体场景选择变体，再选择已登记规格、状态和图标。展示和 AI 读取使用同一份契约。</p><p class="intro"><a href="#availability">当前调用状态</a> · <a href="#variant-decisions">变体决策</a> · <a href="#dependencies">依赖汇总与维护</a> · <a href="#rule-review">规则核对与边界</a></p><div class="controls"><label><input id="show-left" type="checkbox"> 显示左侧 Download 图标</label><label><input id="show-right" type="checkbox"> 显示右侧箭头</label><span>加载时保留文案，暂时隐藏左右普通图标。</span></div></div></section>`;
const html=require(path.join(root,'scripts/component-doc-template.cjs')).render({root,title:"Button 样板 · FS Design Space",header:`${shell("header")}`,content:`<main>${summary}${availabilitySection}${groups}<section id="variant-decisions" class="page-section page-section--gray"><div class="container"><h2 class="section-heading">变体决策</h2><p class="intro">候选用于进一步比较；必须使用与禁用按具体宿主场景判断。设计参考仅供对照，不代表对应组合已开放。</p><table class="decision-table"><thead><tr><th>变体</th><th>匹配条件</th><th>结论与范围</th><th>当前调用</th></tr></thead><tbody>${decisions}</tbody></table></div></section>${dependencySection}${conflictsSection}<section class="page-section"><div class="container"><details><summary>开发调用与维护</summary><div class="api-note">使用原 data-component / data-fragment / data-props 语法。
普通按钮：size、disabled、loading、showLeftIcon、showRightArrow；icon="download"。
尺寸只能取上表已登记规格；disabled 与 loading 互斥。
兼容 iconHidden；与 showLeftIcon 同时指定且冲突时会报错。
保留原有有限 Cart / Quote 图标配色与尺寸边界，不开放隐藏左箭头。
契约来源：design-system/components/contracts/button.json
修改规范后仍走原 component:sync；已交付页面保持固定版本。</div></details></div></section></main>`,footer:`${shell("footer")}`,scripts:`<script>for(const input of document.querySelectorAll('.controls input'))input.addEventListener('change',()=>{for(const button of document.querySelectorAll('main [data-button-current]')){const busy=button.getAttribute('aria-busy')==='true',left=document.getElementById('show-left').checked,right=document.getElementById('show-right').checked;button.querySelector('.ds-btn__leading').hidden=busy||!left;button.querySelector('.ds-btn__trailing-icon').hidden=busy||!right;const props=JSON.parse(button.dataset.libraryProps);props.showLeftIcon=left;props.showRightArrow=right;button.dataset.libraryProps=JSON.stringify(props);}});</script>`,extraCss:`.controls{display:flex;flex-wrap:wrap;gap:20px;align-items:center;font-size:14px}.state-header,.spec-row{display:grid;grid-template-columns:130px repeat(4,minmax(150px,1fr));gap:20px;align-items:center}.state-header{font-size:12px;color:#707070;margin-bottom:16px}.spec-row{min-height:78px;border-bottom:1px solid #DEE0E3}.spec-name{font-size:14px}.state-cell{display:flex;justify-content:flex-start}.cart-row{display:flex;gap:24px;align-items:center}.api-note{font-size:14px;line-height:24px;white-space:pre-wrap}.review-item{padding:16px 0;border-bottom:1px solid #DEE0E3}${dependencyCss}`});
const file=path.join(targetDir,'preview.html'),output=B.assemblePage(html,B.loadRegistry(),new Map(),'button-preview.html',{targetDir}).html;
fs.mkdirSync(targetDir,{recursive:true});
if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==output){const temp=file+'.tmp';fs.writeFileSync(temp,output);fs.renameSync(temp,file);}
return {file,version:data.version,availableVariants:c.variants.filter(v=>available('library-button',v.name)).length};
}
if(require.main===module)console.log('Button prototype synchronized:',build());
module.exports={build};
