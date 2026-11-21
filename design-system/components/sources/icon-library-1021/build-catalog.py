"""Build a static, searchable view of the downloaded originals, not scene approval."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'components/icons/mastergo-library'
TARGET = ROOT / 'components/preview/mastergo-icon-library.html'
data = json.loads((OUT / 'manifest.json').read_text())
payload = json.dumps(data, ensure_ascii=False).replace('<', '\\u003c')
page = r'''<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FS MasterGo 图标原件目录</title><link rel="stylesheet" href="../tokens.css">
<style>
*{box-sizing:border-box}body{margin:0;padding:32px 40px;background:#fff;color:#19191a;font:14px/1.6 var(--font-family-base,"Open Sans",sans-serif)}
h1{font-size:24px;margin:0 0 8px;font-weight:600}p{margin:8px 0;color:#646466}a{color:#0060bf}button,input,select{font:inherit;color:inherit}input,select,button{border:1px solid #c8c8cc;border-radius:4px;padding:8px 12px;background:#fff}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #0060bf;outline-offset:2px}
.toolbar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;position:sticky;top:0;padding:16px 0;background:#fff;z-index:2;border-bottom:1px solid #e5e5e5;margin-bottom:24px}.toolbar label{display:flex;gap:8px;align-items:center}#search{width:330px}.status{color:#646466}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}.card{min-width:0;border:1px solid #dee0e3;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:8px;background:#fff;scroll-margin-top:100px}.card:target{outline:2px solid #0060bf}.preview{height:132px;display:flex;justify-content:center;align-items:center;background:#f7f8fa;border-radius:4px;overflow:auto}.preview img{flex:none;max-width:none;max-height:none}.dark .preview{background:#19191a}.name{font-weight:600;overflow-wrap:anywhere;line-height:1.5}.meta{font-size:12px;color:#646466;overflow-wrap:anywhere}.warning{font-size:12px;color:#8b3a00;background:#fff4dd;padding:6px 8px;border-radius:4px}.actions{display:flex;gap:14px;margin-top:auto;padding-top:4px;font-size:12px}.empty{grid-column:1/-1;color:#707070;padding:40px;text-align:center}summary{cursor:pointer;font-weight:600}details{margin:32px 0}.family .preview{height:160px}.family .preview img{max-width:100%;max-height:150px;object-fit:contain}.family-label{font-size:12px;color:#646466}footer{margin-top:32px;border-top:1px solid #dee0e3;padding-top:16px;color:#646466;font-size:12px}
</style></head><body>
<h1>FS 图标原件目录</h1>
<p id="summary"></p>
<p>来源：MasterGo「英文站组件库 v2.27.2609B」→ 图标 Icon → 用户截图红框内清单，读取于 2026-10-21。按原分类保存，未改色、未重绘。</p>
<p><strong>选型时仍需核对含义、同组风格和场景尺寸。</strong> 下方原件按 SVG 导出尺寸展示；节点尺寸另列。导出边界有差异的项目须先核对画布定位，不能直接拉伸或当成新增尺寸变体。</p>
<div class="toolbar"><label>搜索 <input id="search" type="search" placeholder="名称、含义原文、状态、来源节点" autocomplete="off"></label><label>分类 <select id="category"><option value="">全部分类</option></select></label><label>节点尺寸 <select id="size"><option value="">全部尺寸</option></select></label><button id="backdrop" type="button" aria-pressed="false">深色预览背景</button><span id="status" class="status" aria-live="polite"></span></div>
<main id="icons" class="grid" aria-label="独立图标原件"></main>
<details><summary>13 组交互图标的原始变体集合</summary><p class="family-label">这里展示原始集合布局，包含集合边框；页面调用应从上方选择具体状态，不使用整组图作单个图标。</p><div id="families" class="grid"></div></details>
<footer><a href="../icons/mastergo-library/manifest.json">机器读取清单 JSON</a> · <a href="../sources/icon-library-1021/README.md">来源与使用说明</a> · <a href="icon-map.html">返回现有图标引用目录</a><p>原件下载与工程检查不代表场景选型、组件家族或整页视觉验收通过。来源定位链接按已读取文件/页面/节点生成；未逐项执行网页跳转验收。</p></footer>
<script id="library-data" type="application/json">__PAYLOAD__</script>
<script>
'use strict';
const library=JSON.parse(document.querySelector('#library-data').textContent);
const search=document.querySelector('#search'),category=document.querySelector('#category'),size=document.querySelector('#size');
const rel=file=>'../../'+file;
const number=n=>Number.isInteger(n)?String(n):String(Math.round(n*1000)/1000);
const dimensions=s=>s.width!==undefined&&s.height!==undefined?number(s.width)+' × '+number(s.height)+' px':'源快照未给完整宽高';
const nodeSize=e=>dimensions(e.measuredSourceStyleSize);
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const usable=e=>e.size.width>0&&e.size.height>0;
document.querySelector('#summary').textContent=library.counts.icons+' 份独立原件，其中 '+library.icons.filter(usable).length+' 份非空导出；另保留 '+library.families.length+' 组变体集合。';
for(const [name,count] of Object.entries(library.counts.byCategory)){const o=el('option','',name+'（'+count+'）');o.value=name;category.append(o);}
for(const value of [...new Set(library.icons.map(nodeSize))].sort((a,b)=>parseFloat(a)-parseFloat(b))){const o=el('option','',value);o.value=value;size.append(o);}
function card(e,family=false){
 const c=el('article','card'+(family?' family':''));c.id='node-'+e.id.replace(':','-');
 const preview=el('div','preview');
 if(usable(e)){const img=el('img');img.src=rel(e.localAdjustment?.file||e.file);img.alt=e.name;img.style.width=e.size.width+'px';img.style.height=e.size.height+'px';img.decoding='async';preview.append(img);}else preview.append(el('span','meta','MasterGo 原导出为空，暂不选用'));
 c.append(preview,el('div','name',e.name),el('div','meta',e.category+' · 节点 '+e.id),el('div','meta','节点：'+nodeSize(e)),el('div','meta','SVG：'+dimensions(e.size)));
 if(Object.keys(e.variants).length)c.append(el('div','meta',Object.entries(e.variants).map(([k,v])=>k+'：'+v).join(' · ')));
 if(Object.keys(e.exportBoundsDifference).length)c.append(el('div','warning',usable(e)?'SVG 导出边界与节点尺寸不同；使用前核对原件画布。':'原集合渲染快照未出现该状态；仅保留空导出和来源记录。'));
 if(e.localAdjustment)c.append(el('div','meta',e.localAdjustment.note));
 const actions=el('div','actions');const download=el('a','',family?'查看集合 SVG':e.localAdjustment?'下载去投影 SVG':'下载原始 SVG');download.href=rel(e.localAdjustment?.file||e.file);download.download=e.id.replace(':','-')+'.svg';const source=el('a','','MasterGo 来源');source.href=e.source.url;source.target='_blank';source.rel='noopener';actions.append(download,source);if(e.localAdjustment){const original=el('a','','原始 SVG');original.href=rel(e.file);actions.append(original);}c.append(actions);return c;
}
function render(){const q=search.value.trim().toLocaleLowerCase();const list=library.icons.filter(e=>(!category.value||e.category===category.value)&&(!size.value||nodeSize(e)===size.value)&&(!q||[e.name,e.id,e.category,JSON.stringify(e.variants)].join(' ').toLocaleLowerCase().includes(q)));const grid=document.querySelector('#icons');grid.replaceChildren(...list.map(e=>card(e)));if(!list.length)grid.append(el('p','empty','没有匹配的原件'));document.querySelector('#status').textContent='显示 '+list.length+' / '+library.icons.length;}
search.addEventListener('input',render);category.addEventListener('change',render);size.addEventListener('change',render);
document.querySelector('#backdrop').addEventListener('click',e=>{const active=document.body.classList.toggle('dark');e.currentTarget.setAttribute('aria-pressed',String(active));e.currentTarget.textContent=active?'浅色预览背景':'深色预览背景';});
document.querySelector('#families').append(...library.families.map(e=>card(e,true)));render();
</script></body></html>
'''.replace('__PAYLOAD__', payload)
TARGET.write_text(page)
print(TARGET)
