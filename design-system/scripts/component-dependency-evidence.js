'use strict';
const {JSDOM}=require('jsdom');

// This is an offline class inventory, not a child contract or browser check.
// Generated tables, scripts and comments must never supply implementation evidence.
function classifyDependencyEvidence(html, declarations) {
  const previewExists=typeof html==='string';
  const authored=previewExists?html.replace(/<!-- AUTO-GENERATED-[A-Z-]+:START -->[\s\S]*?<!-- AUTO-GENERATED-[A-Z-]+:END -->/g,''):'';
  const document=new JSDOM(authored).window.document;
  const classes=new Set([...document.querySelectorAll('[class]')]
    .filter(el=>!el.closest('script,style,template'))
    .flatMap(el=>[...el.classList]));
  const declaredClasses=[...new Set(declarations.flatMap(d=>Array.isArray(d.implementationClasses)?d.implementationClasses:[]))];
  const missingClasses=declaredClasses.filter(cls=>!classes.has(cls));
  const classEvidence=previewExists&&declarations.length>0&&declarations.every(d=>Array.isArray(d.implementationClasses)&&d.implementationClasses.length>0)&&missingClasses.length===0;
  document.defaultView.close();
  return {status:classEvidence?'preview-class-evidence-only':'declared-unverified',verified:false,
    previewExists,classEvidence,declaredClasses,missingClasses,
    exactStructure:'not-established',browserEvidence:'not-established',
    note:'宿主依赖声明及离线类名盘点；未证明具体变体、尺寸、必需子结构、宿主适配或浏览器行为。'};
}
module.exports={classifyDependencyEvidence};
