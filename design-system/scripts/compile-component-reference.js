#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const os = require('node:os');
const {spawnSync} = require('node:child_process');
const {classifyDependencyEvidence}=require('./component-dependency-evidence');
const {requestedDependencyReady}=require('./component-dependency-readiness');
const {variantSelectionDecision}=require('./generate-component-index');
const ROOT = path.resolve(__dirname,'..');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const read = (root,file) => fs.readFileSync(path.join(root,file),'utf8');
const json = (root,file) => JSON.parse(read(root,file));
function buildReference(root,id) {
  if(!/^[a-z][a-z0-9-]*$/.test(id)) throw Error('Invalid component id');
  // Read each input once: examples, relationships and fingerprints share the same bytes.
  const observed=new Map();
  const read=(base,file)=>{
    if(!observed.has(file))observed.set(file,fs.readFileSync(path.join(base,file)));
    return observed.get(file).toString('utf8');
  };
  const json=(base,file)=>JSON.parse(read(base,file));
  const directoryNames=dir=>fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.json')).sort();
  const contractNames=directoryNames('components/contracts');
  const tokenNames=directoryNames('components/token-specs');
  const contractPath=`components/contracts/${id}.json`;
  const c=json(root,contractPath), a=c.aiContract;
  if(!a || a.schemaVersion!=='1.0.0') throw Error(`${id}: missing aiContract 1.0.0`);
  if(!a.rootTag || !a.scope || !a.selectionPolicy || !a.locked?.length || !a.identity?.rule || !a.behavior || !a.reviewStatus) throw Error(`${id}: incomplete AI contract`);
  if(!a.supported?.length || new Set(a.supported).size!==a.supported.length || a.supported.some(v=>(a.unsupported||[]).includes(v))) throw Error(`${id}: ambiguous variant coverage`);
  const purposes=a.supported.map(v=>a.variants?.[v]?.purpose);
  if(purposes.some(v=>!v) || new Set(purposes).size!==purposes.length) throw Error(`${id}: ambiguous selection purposes`);
  for(const name of a.supported) for(const field of a.variants[name].allowedEdits||[]) if(!(c.editable||[]).includes(field))throw Error(`${id}/${name}: undeclared editable ${field}`);

  const exampleFile=a.exampleFile||`components/variants/${id}.html`;
  if(a.exampleFile && (id!=='card'||exampleFile!=='components/variants/card-call-checks.html'))throw Error(`${id}: invalid dedicated example file`);
  if(id==='banner'||id==='menu-navigation')require('./sync-search-owned-parts').validate(root);
  if(id==='card')require('./sync-card-owned-lists').validate(root);
  if(id==='icon-card')require('./sync-icon-card-owned-parts').validate(root);
  if(id==='comment'||id==='rate')require('./sync-rate-summary').validate(root);
  const files=new Set([contractPath,`components/variants/${id}.html`,exampleFile,...(c.integration?.styles||[]),...(c.integration?.scripts||[]),...(a.previewAssets||[])]);
  for(const name of a.supported)for(const b of require('./component-publication').publication(root,id,name,false)?.releaseBlockers||[])files.add(b.evidence);
  if(!Array.isArray(c.integration?.scripts) || !Array.isArray(c.integration?.styles) || (a.rootTag==='dialog' && !c.integration.scripts.length)) throw Error(`${id}: missing runtime integration`);
  if(fs.existsSync(path.join(root,'components/reference-policy.json')))files.add('components/reference-policy.json');
  const all=contractNames.map(f=>({id:f.slice(0,-5),path:`components/contracts/${f}`,data:json(root,`components/contracts/${f}`)}));
  const byName=new Map(all.map(x=>[x.data.name,x]));
  const inspectedVariants=Object.fromEntries(a.supported.flatMap(name=>{
    const required=c.variants.find(v=>v.name===name)?.requiredChildren||[], rule=a.variants[name];
    const slotsFor=size=>({...rule.slots,...Object.fromEntries(Object.entries(rule.bindings||{}).filter(([,b])=>b.mode==='registered-icon' || (['native-attribute','event-handler'].includes(b.mode) && b.target!=='root')).map(([field,b])=>[field,{selector:b.target,required:!b.sizes||b.sizes.includes(size)}]))});
    const slots=slotsFor(rule.defaultSize);
    const sizeRequired=sizeName=>id==='text-button'?[...required,`img.ds-text-btn__icon[src="../icons/${c.variants.find(v=>v.name===name).sizes.find(s=>s.name===sizeName).styleProperties.defaultIcon}"]`]:required;
    return [[name,{...rule,slots,required:id==='text-button'?sizeRequired(rule.defaultSize):required}],...(rule.sizes||[]).map(size=>[name+'::'+size.name,{...rule,...size,slots:slotsFor(size.name),required:sizeRequired(size.name)}])];
  }));
  // A regular-file stdin has a deterministic EOF. On macOS, repeated synchronous
  // pipe input under the Node test runner can leave Python waiting for EOF.
  const inputDir=fs.mkdtempSync(path.join(os.tmpdir(),'fs-reference-dom-'));
  let inspection,inputFd;
  try {
    const inputFile=path.join(inputDir,'input.json');
    fs.writeFileSync(inputFile,JSON.stringify({html:read(root,exampleFile),variants:inspectedVariants}),{mode:0o600});
    inputFd=fs.openSync(inputFile,'r');
    inspection=spawnSync('python3',[path.join(__dirname,'component-reference-dom.py')],{stdio:[inputFd,'pipe','pipe'],encoding:'utf8',timeout:15000,maxBuffer:16*1024*1024});
  } finally {
    if(inputFd!==undefined)fs.closeSync(inputFd);
    fs.rmSync(inputDir,{recursive:true,force:true});
  }
  if(inspection.error)throw Error(`DOM inspection failed: ${inspection.error.message}`);
  if(inspection.status!==0) throw Error(inspection.stderr || 'DOM inspection failed');
  const dom=JSON.parse(inspection.stdout);
  const errors=[];
  const examples=(a.supported||[]).map(name=>{
    const v=c.variants.find(v=>v.name===name), rule=a.variants?.[name];
    const externalCarousel=id==='carousel' && name==='external-cards';
    const expectedRoot=id==='option-selector'&&name==='service'?'label':id==='option-selector'&&name==='color'?'div':id==='comment'&&name==='customer-gallery'?'dialog':id==='comment'&&name==='rating-summary'?'section':externalCarousel?'div':id==='breadcrumb'&&['full-width-light','full-width-dark'].includes(name)?'div':id==='navigation'&&name==='footer'&&a.scope==='fixed-desktop-header-footer-default'?'footer':id==='tag'&&['status-text','metadata','metadata-single','semantic','semantic-new','featured'].includes(name)?'span':a.rootTag;
    if(rule?.rootTag&&rule.rootTag!==expectedRoot)throw Error(`${id}/${name}: invalid variant root tag`);
    if(!v || v.isComplete!==true || v.pendingParts?.length) throw Error(`${id}/${name}: unavailable variant`);
    const fixedHeader=id==='navigation' && name==='header' && a.rootTag==='header' && ['fixed-desktop-header-only','fixed-desktop-header-footer-default'].includes(a.scope)
      && Array.isArray(rule?.allowedEdits) && rule.allowedEdits.length===0
      && Object.keys(rule.slots||{}).length===0 && Object.keys(rule.bindings||{}).length===0
      && /^[a-f0-9]{64}$/.test(a.identity.authoredSha256||'');
    const fixedFooter=id==='navigation'&&name==='footer'&&a.scope==='fixed-desktop-header-footer-default'&&rule?.rootTag==='footer'
      &&Array.isArray(rule.allowedEdits)&&rule.allowedEdits.length===0&&Object.keys(rule.slots||{}).length===0&&Object.keys(rule.bindings||{}).length===0
      &&/^[a-f0-9]{64}$/.test(a.identity.footerAuthoredSha256||'');
    const fixedDisplay=id==='tag'&&['semantic','semantic-new','featured'].includes(name)&&rule?.rootTag==='span'
      &&Array.isArray(rule.allowedEdits)&&rule.allowedEdits.length===0&&Object.keys(rule.slots||{}).length===0&&Object.keys(rule.bindings||{}).length===0;
    if(!rule || !rule.purpose || (!rule.allowedEdits?.length && !fixedHeader && !fixedFooter && !fixedDisplay)) throw Error(`${id}/${name}: missing selection/slots`);
    const localProfile=id==='button'&&name!=='cart-product-card'?rule.localRuntime:null;
    if(localProfile){
      const sizes=v.sizes.map(s=>s.name),keys=['size','disabled','loading','showLeftIcon','showRightArrow','icon','iconHidden'];
      if(localProfile.profile!=='button-mg-20261112-v1'||JSON.stringify(Object.keys(localProfile.parameters).sort())!==JSON.stringify(keys.sort())||JSON.stringify(localProfile.parameters.size.values)!==JSON.stringify(sizes)||localProfile.parameters.size.type!=='enum'||localProfile.parameters.icon.type!=='registered-icon'||JSON.stringify(localProfile.assets)!==JSON.stringify(c.relations.iconSlots.assetBindings))throw Error('Invalid finite Button runtime profile');
      for(const key of ['disabled','loading','showLeftIcon','showRightArrow','iconHidden'])if(localProfile.parameters[key].type!=='boolean')throw Error('Invalid Button boolean binding');
      const expected=new Set(sizes.flatMap(size=>['Default','Hover','Disabled','Processing'].map(state=>size+'/'+state)));
      for(const row of localProfile.states){if(row.variant!==name||!expected.delete(row.size+'/'+row.state)||!(row.state==='Processing'?row.loading&&!row.left&&!row.right:row.left&&row.right&&!row.loading))throw Error('Invalid Button source state coverage');}
      if(expected.size)throw Error('Incomplete Button source states');
      for(const file of Object.values(localProfile.assets)){if(!fs.existsSync(path.join(root,file)))throw Error('Missing original Button icon: '+file);files.add(file);}
    }
    for(const field of rule.allowedEdits)if(!rule.slots?.[field] && !rule.bindings?.[field] && !localProfile?.parameters?.[field])throw Error(`${id}/${name}: editable field lacks typed slot or event binding: ${field}`);
    for(const [field,binding] of Object.entries(rule.bindings||{})){
      if(id==='comment' && name==='customer-gallery' && field==='images' && binding.mode==='comment-media-list' && binding.target==='root' && binding.minItems===1 && binding.maxItems===24)continue;
      if(id==='form' && name==='gray' && field==='sourceFields' && binding.mode==='source-form-fields' && binding.target==='root' && binding.referenceKind==='original-page-content-reference' && JSON.stringify(binding.kinds)==='["text","email","textarea","select"]' && binding.maxFields===32)continue;
      const tabSize=id==='tab' && ['standard','standard-center'].includes(name) && field==='size' && binding.mode==='source-example-size' && binding.target==='root' && JSON.stringify(binding.values)==='[\"default\",\"large\"]' && binding.default===rule.defaultSize && JSON.stringify((rule.sizes||[]).map(s=>s.name))===JSON.stringify(binding.values) && rule.sizes.every(s=>typeof s.exampleSelector==='string' && s.exampleSelector.startsWith('[data-ai-example='));
      if(tabSize)continue; // Exact registered source examples, not arbitrary class/attribute editing.
      const event=binding.mode==='event-handler' && !!binding.event;
      const bannerTarget=field==='actionCallback'?'button.ds-btn':undefined;
      const bannerAction=id==='banner' && !!bannerTarget && binding.mode==='event-handler' && binding.target===bannerTarget && binding.event==='click';
      const bannerSurface=id==='banner' && name==='hero-responsive' && field==='surface' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-banner-surface' && JSON.stringify(binding.values)==='["image"]' && binding.sourceProperty==='Existing dark background image and mandatory host overlay';
      const bannerSearch=id==='banner'&&name==='search'&&((binding.mode==='event-handler'&&binding.target==='root'&&['ds:banner-search','ds:banner-gpt'].includes(binding.event))||(binding.mode==='native-attribute'&&binding.target==='input.ds-input-search__field'&&binding.valueType==='nonempty-string'&&['placeholder','aria-label'].includes(binding.attribute)));
      if(id==='banner' && !bannerSearch && !bannerAction && !bannerSurface)throw Error(`${id}/${name}: invalid native action binding ${field}`);
      const formPanel=id==='form' && ['gray','white'].includes(name) && field==='panelIdentity' && binding.mode==='linked-identity' && binding.target==='div.ds-dropdown__panel' && binding.attribute==='id' && binding.valueType==='safe-dom-id' && binding.unique===true && JSON.stringify(binding.references)==='[{"selector":"button.ds-dropdown__trigger","attribute":"aria-controls"}]';
      if(id==='form' && !formPanel && !(field==='submitCallback' && binding.mode==='event-handler' && binding.target==='root' && binding.event==='ds:form-submit'))throw Error(`${id}/${name}: invalid typed Form binding ${field}`);
      const dropdownIdentity=id==='dropdown' && ['basic','with-search','brand-select'].includes(name) && field==='panelIdentity' && binding.mode==='linked-identity' && binding.target==='div.ds-dropdown__panel' && binding.attribute==='id' && binding.valueType==='safe-dom-id' && binding.unique===true && JSON.stringify(binding.references)==='[{"selector":"button.ds-dropdown__trigger","attribute":"aria-controls"}]';
      const dropdownCommand=id==='dropdown' && ['command-text','command-dot','account-guest','account-signed-in'].includes(name) && ((field==='panelIdentity' && binding.mode==='linked-identity' && binding.target==='.ds-dropdown-command__panel' && binding.attribute==='id' && binding.valueType==='safe-dom-id' && binding.unique===true && binding.references?.length===1 && binding.references[0].selector==='button[aria-haspopup="menu"]' && binding.references[0].attribute==='aria-controls' ) || (binding.mode==='native-attribute' && binding.target==='root' && ((field==='placement' && binding.attribute==='data-dropdown-placement' && Array.isArray(binding.values) && binding.values.every(v=>['bottom','top','left','right','bl','br','tl','tr'].includes(v)) && binding.values.includes(binding.default)) || (field==='trigger' && binding.attribute==='data-dropdown-trigger' && JSON.stringify(binding.values)==='["click","hover"]'))) || (field==='actionCallback' && binding.mode==='event-handler' && binding.target==='root' && binding.event==='ds:dropdown-action'));
      if(id==='dropdown' && !dropdownIdentity && !dropdownCommand && !(field==='changeCallback' && binding.mode==='event-handler' && binding.target==='root' && binding.event==='ds:dropdown-change'))throw Error(`${id}/${name}: invalid typed Dropdown binding ${field}`);
      const commentIdentity=id==='comment' && ['qa-thread','review-thread'].includes(name) && field==='panelIdentity' && binding.mode==='linked-identity' && binding.target==='.ds-comment__comments' && binding.attribute==='id' && binding.valueType==='safe-dom-id' && binding.unique===true && binding.references?.length===1 && binding.references[0].selector==='[data-comment-action="comment"]' && binding.references[0].attribute==='aria-controls';
      const commentCall=id==='comment' && ((binding.mode==='event-handler' && binding.target==='root' && ({submitCallback:'ds:comment-submit',helpfulCallback:'ds:comment-helpful',filterCallback:'ds:comment-filter',answerCallback:'ds:comment-answer-request'})[field]===binding.event) || (name==='rating-summary' && binding.mode==='native-attribute' && binding.target==='root' && ((field==='counts' && binding.attribute==='data-comment-rating-counts' && binding.valueType==='json-integer-array' && binding.length===5 && binding.min===0 && binding.max===1000000) || (field==='galleryTarget' && binding.attribute==='data-comment-gallery-target' && binding.valueType==='safe-dom-id'))));
      if(id==='comment' && !commentIdentity && !commentCall)throw Error(`${id}/${name}: invalid linked panel identity ${field}`);
      if(id==='option-selector' && !(name==='color'&&field==='changeCallback'&&binding.mode==='event-handler'&&binding.target==='root'&&binding.event==='ds:select-change') && !(name==='service'&&((field==='changeCallback'&&binding.mode==='event-handler'&&binding.target==='root'&&binding.event==='change')||(['value','disabled'].includes(field)&&binding.mode==='native-attribute'&&binding.target==='input.ds-checkbox__input'&&binding.attribute===field))) && !((field==='value' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='value' && binding.valueType==='nonempty-string') || (field==='disabled' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='disabled' && JSON.stringify(binding.values)==='[false,true]' && binding.default===false) || (field==='changeCallback' && binding.mode==='event-handler' && binding.target==='root' && binding.event==='ds:option-selector-change')))throw Error(`${id}/${name}: invalid typed binding ${field}`);
      if(id==='menu-navigation' && !(binding.mode==='event-handler' && binding.target==='root' && ({changeCallback:'ds:menu-navigation-change',toggleCallback:'ds:menu-navigation-toggle',searchCallback:'ds:menu-navigation-search'})[field]===binding.event && (field!=='searchCallback'||name==='multi-level-search') && (field!=='toggleCallback'||['multi-level','multi-level-search'].includes(name))))throw Error(`${id}/${name}: invalid typed binding ${field}`);
      if(id==='video-button' && !((field==='actionCallback' && binding.mode==='event-handler' && binding.target==='root' && binding.event==='click') || (field==='accessibleLabel' && binding.mode==='accessible-label' && binding.target==='root' && binding.attribute==='aria-label' && binding.nonEmpty===true)))throw Error(`${id}/${name}: invalid typed binding ${field}`);
      const anchorAction=id==='anchor-nav' && field==='actionCallback' && binding.mode==='event-handler' && binding.target==='button.ds-btn' && binding.event==='click';
      if(id==='anchor-nav' && field==='actionCallback' && !anchorAction)throw Error(`${id}/${name}: invalid typed binding ${field}`);
      const carouselDisabled=id==='carousel' && ['source-outlined28-direction-controls-only','source-direction-controls-outlined28-solid48','source-direction-controls-and-external-cards'].includes(a.scope) && /^navigation\.(?:outlined-m|solid-xl)\.(?:left|right)$/.test(name) && field==='disabled' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='disabled' && JSON.stringify(binding.values)==='[false,true]' && binding.default===false;
      const carouselItems=externalCarousel && field==='items' && binding.mode==='component-list' && binding.target==='.ds-carousel-external__track' && binding.minItems===1 && binding.maxItems===24 && binding.homogeneous===true;
      const carouselColumns=externalCarousel && field==='columns' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-carousel-columns' && JSON.stringify(binding.values)==='[2,3,4]' && binding.default===3;
      const attribute=binding.mode==='native-attribute' && binding.attribute==='type' && a.rootTag==='button' && binding.values?.length && binding.values.every(value=>['button','submit'].includes(value)) && binding.values.includes(binding.default);
      const textArrow=id==='text-button' && field==='arrowHidden' && binding.mode==='native-attribute' && binding.target==='img.ds-text-btn__icon' && binding.attribute==='hidden' && JSON.stringify(binding.values)==='[false,true]' && binding.default===false && binding.sourceProperty==='向右箭头' && binding.sourceInverted===true;
      const buttonIconVisibility=id==='button' && ['filled-red','outline-black'].includes(name) && field==='iconHidden' && binding.mode==='native-attribute' && binding.target==='span.ds-btn__leading' && binding.attribute==='hidden' && JSON.stringify(binding.values)==='[false,true]' && binding.default===true && binding.sourceProperty==='显示左侧图标' && binding.sourceInverted===true;
      if(id==='text-button' && field==='arrowHidden' && !textArrow)throw Error(`${id}/${name}: invalid source arrow visibility binding`);
      const inputAttribute=id==='input' && a.rootTag==='div' && binding.mode==='native-attribute' && binding.target==='input.ds-input-field__input' && field===binding.attribute && (
        (['placeholder','value','name'].includes(binding.attribute) && binding.valueType==='string') ||
        (['disabled','required'].includes(binding.attribute) && JSON.stringify(binding.values)==='[false,true]' && binding.default===false) ||
        (binding.attribute==='type' && JSON.stringify(binding.values)==='["text","email","tel"]' && binding.default==='text') ||
        (binding.attribute==='aria-invalid' && JSON.stringify(binding.values)==='["false","true"]' && binding.default==='false')
      );
      const numberAttribute=id==='input-number' && a.rootTag==='div' && binding.mode==='native-attribute' && (
        (binding.target==='root' && ['min','max','step'].includes(field) && binding.attribute==='data-'+field && binding.valueType==='positive-integer') ||
        (binding.target==='input.ds-input-number__input' && ((field==='value' && binding.attribute==='value' && binding.valueType==='positive-integer') || (field==='name' && binding.attribute==='name' && binding.valueType==='string') || (field==='accessibleLabel' && binding.attribute==='aria-label' && binding.valueType==='nonempty-string')))
      );
      const radioAttribute=id==='radio' && a.rootTag==='label' && binding.mode==='native-attribute' && binding.target==='input.ds-radio__input' && field===binding.attribute && (
        (['name','value'].includes(field) && binding.valueType==='nonempty-string') ||
        (['checked','disabled'].includes(field) && JSON.stringify(binding.values)==='[false,true]' && binding.default===false)
      );
      const checkboxAttribute=id==='checkbox' && a.rootTag==='label' && binding.mode==='native-attribute' && binding.target==='input.ds-checkbox__input' && field===binding.attribute && (
        (['name','value'].includes(field) && binding.valueType==='nonempty-string') ||
        (['checked','disabled'].includes(field) && JSON.stringify(binding.values)==='[false,true]' && binding.default===false)
      );
      if(id==='checkbox' && !checkboxAttribute && !(field==='changeCallback' && binding.mode==='event-handler' && binding.target==='root' && binding.event==='change'))throw Error(`${id}/${name}: invalid typed Checkbox binding ${field}`);
      const selectCopy=id==='select' && binding.mode==='native-attribute' && binding.valueType==='nonempty-string' && ((['single-basic','single-radio','search'].includes(name) && field==='placeholder' && binding.target==='span.ds-select__value' && binding.attribute==='data-placeholder' && binding.sourceProperty==='占位文案（内容）') || (name==='search' && field==='searchLabel' && binding.target==='input.ds-select__search-input' && binding.attribute==='aria-label' && binding.sourceProperty==='搜索输入可访问名称（内容）'));
      const selectLayout=id==='select' && ['single-basic','single-radio','search','multi-checkbox'].includes(name) && field==='layout' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-select-layout' && JSON.stringify(binding.values)==='["fill"]' && binding.sourceProperty==='crossSizing:auto';
      const collapseAttribute=id==='collapse' && name==='split' && field==='mode' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-collapse-mode' && JSON.stringify(binding.values)==='["single","multiple"]' && binding.default==='single';
      const optionAttribute=id==='option-selector' && binding.mode==='native-attribute' && (binding.target==='root'||name==='service'&&binding.target==='input.ds-checkbox__input') && ['value','disabled'].includes(field);
      const rateSummaryAttribute=id==='rate' && name==='summary' && field==='counts' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-rate-summary-counts' && binding.valueType==='json-integer-array' && binding.length===5 && binding.min===0 && binding.max===1000000;
      const rateAttribute=rateSummaryAttribute || id==='rate' && name==='input' && a.rootTag==='div' && binding.mode==='native-attribute' && (
        (field==='value' && binding.target==='root' && binding.attribute==='data-value' && binding.valueType==='integer' && binding.min===0 && binding.max===5) ||
        (field==='labels' && binding.target==='root' && binding.attribute==='data-rate-labels' && binding.valueType==='json-string-array' && binding.length===5) ||
        (field==='groupLabel' && binding.target==='div.ds-rate__control' && binding.attribute==='aria-label' && binding.valueType==='nonempty-string')
      );
      if(id==='rate' && binding.mode==='event-handler' && !((name==='input' && field==='changeCallback' && binding.target==='root' && binding.event==='ds:rate-change') || (name==='summary' && field==='filterCallback' && binding.target==='root' && binding.event==='ds:rate-filter')))throw Error(`${id}/${name}: invalid typed binding ${field}`);
      const badgeAttribute=id==='badge' && a.rootTag==='span' && field==='iconAlt' && binding.mode==='native-attribute' && binding.target==='img' && binding.attribute==='alt' && binding.valueType==='string';
      const navigation=binding.mode==='navigation-target' && a.rootTag==='a' && binding.attribute==='href' && binding.relative===true && binding.protocols?.length && binding.protocols.every(value=>['https:','http:','mailto:','tel:'].includes(value));
      const dialogContent=id==='dialog' && name==='information' && field==='contentSource' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-dialog-content-source' && binding.valueType==='nonempty-string' && binding.sourceProperty==='Host-supplied content slot; child components retain their own canonical DOM';
      const cardNavigation=id==='card' && field==='href' && binding.mode==='navigation-target' && binding.target==='a.ds-text-btn' && binding.attribute==='href' && binding.relative===true && JSON.stringify(binding.protocols)==='["https:","http:","mailto:","tel:"]';
      const cardSurface=id==='card' && name==='embedded.product-standard' && field==='surface' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-card-surface' && JSON.stringify(binding.values)==='["white","gray"]' && binding.default==='white' && binding.sourceProperty==='背景';
      const cardAbsence=id==='card' && ['spliced.vertical.single-event','spliced.vertical.single-event.bordered'].includes(name) && field==='sourceAbsent' && binding.mode==='source-absence' && binding.target==='root' && binding.sourceProperty==='contentSlots.meta/description/link required=false' && c.contentSlots?.meta?.required===false && c.contentSlots?.description?.required===false && c.contentSlots?.link?.required===false && JSON.stringify(binding.regions)==='{"category":".ds-card__meta","description":".ds-card__desc","link":".ds-card__link"}';
      const cardHorizontal=id==='card' && ['spliced.horizontal.full-width','spliced.horizontal.full-width.responsive'].includes(name);
      const cardHorizontalDirection=cardHorizontal && field==='imagePosition' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-card-image-position' && JSON.stringify(binding.values)==='["left","right"]' && binding.default==='left' && binding.sourceProperty==='cssClassReverse: image/text direction';
      const cardHorizontalAbsence=cardHorizontal && field==='sourceAbsent' && binding.mode==='source-absence' && binding.target==='root' && binding.sourceProperty==='contentSlots.link required=false' && c.contentSlots?.link?.required===false && JSON.stringify(binding.regions)==='{"link":".ds-card__link"}';
      const tagColor=id==='tag' && name==='product-color-small' && field==='color' && binding.mode==='native-attribute' && binding.target==='root' && binding.attribute==='data-tag-color' && binding.valueType==='hex-color' && binding.pattern==='^#[0-9a-fA-F]{6}$' && binding.default==='#5A82F7' && binding.sourceRole==='product-option-content';
      if(id==='card' && !cardNavigation && !cardSurface && !cardAbsence && !cardHorizontalDirection && !cardHorizontalAbsence)throw Error(`${id}/${name}: invalid child navigation binding ${field}`);
      const label=binding.mode==='accessible-label' && a.rootTag==='button' && binding.attribute==='aria-label' && binding.target==='root' && binding.nonEmpty===true;
      const icon=binding.mode==='registered-icon' && binding.attribute==='src' && (binding.target==='.ds-icon-btn__icon'||(id==='button'&&field==='icon'&&binding.target==='img.ds-btn__leading-icon')) && a.rootTag==='button' && binding.values?.length && binding.values.every(file=>/^components\/icons\/[a-z0-9-]+\.svg$/.test(file) && fs.existsSync(path.join(root,file)));
      const iconCardIcon=id==='icon-card' && field==='icon' && binding.mode==='registered-icon' && binding.target==='img.ds-icon-card__icon' && binding.attribute==='src' && binding.sourceProperty==='图标切换占位符' && Array.isArray(binding.values) && binding.values.length>0 && binding.values.every(file=>typeof file==='string' && file.startsWith('components/icons/') && !file.split('/').includes('..') && file.endsWith('.svg') && fs.existsSync(path.join(root,file)));
      const iconCardNavigation=id==='icon-card' && ['center.single-event','left.single-event','left.jump-type'].includes(name) && field==='titleHref' && binding.mode==='navigation-target' && binding.target==='div.ds-icon-card__title-slot > a.ds-text-btn' && binding.attribute==='href' && binding.relative===true && JSON.stringify(binding.protocols)==='["https:","http:","mailto:","tel:"]';
      const iconCardAbsence=id==='icon-card' && ['center.single-event','left.single-event'].includes(name) && field==='sourceAbsent' && binding.mode==='source-absence' && binding.target==='root' && binding.sourceProperty==='规范5.2可选内容' && JSON.stringify(binding.regions)==='{"bullets":"div.ds-icon-card__bullets","link":"div.ds-icon-card__link"}';
      if(id==='icon-card' && !iconCardIcon && !iconCardNavigation && !iconCardAbsence)throw Error(`${id}/${name}: invalid registered main icon binding`);
      if(iconCardIcon)binding.values.forEach(file=>files.add(file));
      if(!rule.allowedEdits.includes(field) || ((!carouselItems&&!carouselColumns&&(!dialogContent&&!cardAbsence&&!iconCardAbsence&&!iconCardNavigation&&!iconCardIcon&&!buttonIconVisibility&&!textArrow&&!selectCopy&&!icon&&!inputAttribute&&!numberAttribute&&!radioAttribute&&!checkboxAttribute&&!badgeAttribute&&!rateAttribute&&!collapseAttribute&&!optionAttribute&&!anchorAction&&!formPanel&&!dropdownIdentity&&!dropdownCommand&&!commentIdentity&&!commentCall&&!cardNavigation&&!bannerAction&&!bannerSearch&&binding.target!=='root')) || (!carouselItems&&!carouselColumns&&!bannerSearch&&!bannerSurface&&!cardHorizontalDirection&&!cardHorizontalAbsence&&!dialogContent&&!cardAbsence&&!iconCardAbsence&&!iconCardNavigation&&!selectCopy&&!selectLayout&&!iconCardIcon&&!carouselDisabled&&!buttonIconVisibility&&!tagColor&&!cardSurface&&!textArrow&&!event&&!attribute&&!inputAttribute&&!numberAttribute&&!radioAttribute&&!checkboxAttribute&&!badgeAttribute&&!rateAttribute&&!collapseAttribute&&!optionAttribute&&!formPanel&&!dropdownIdentity&&!dropdownCommand&&!commentIdentity&&!commentCall&&!cardNavigation&&!navigation&&!label&&!icon)))throw Error(`${id}/${name}: invalid typed binding ${field}`);
      if(icon)binding.values.forEach(file=>files.add(file));
    }
    for(const [field,slot] of Object.entries(rule.slots||{}))if(!['text','structured-content'].includes(slot.mode) || !slot.selector)throw Error(`${id}/${name}: invalid slot mode ${field}`);
    for(const [field,slot] of Object.entries(rule.slots||{}))if(slot.registeredIcons){const ri=slot.registeredIcons;if(id!=='tab'||name!=='product'||field!=='items'||ri.selector!=='.ds-tab__item-icon > img'||!Array.isArray(ri.values)||!ri.values.length||ri.values.some(file=>!/^components\/icons\/mastergo-library\/定制Icon\/[0-9-]+\.svg$/.test(file)||!fs.existsSync(path.join(root,file))))throw Error(`${id}/${name}: invalid finite slot icon registry`);ri.values.forEach(file=>files.add(file));}
    const el=dom[name];
    if(id==='navigation' && (!(fixedHeader||fixedFooter) || hash(el?.html?.replace(/ data-ai-example="ai-navigation-fixed-(?:header|footer)"/,'')||'')!==(fixedFooter?a.identity.footerAuthoredSha256:a.identity.authoredSha256)))throw Error(`${id}/${name}: fixed ${fixedFooter?'Footer':'Header'} authored literal mismatch`);
    if(id==='form' && !el?.formIdentity)throw Error(`${id}/${name}: native gray Form identity, fields or exact children mismatch`);
    if(id==='dropdown' && !el?.dropdownIdentity)throw Error(`${id}/${name}: native basic Dropdown identity or closed state mismatch`);
    if(id==='banner' && !el?.bannerIdentity)throw Error(`${id}/${name}: full-copy Hero opt-in or exact outline-white/XL child mismatch`);
    if(id==='button' && name==='cart-product-card' && !el?.cartIdentity)throw Error(`${id}/${name}: source product Cart atom identity mismatch`);
    if(id==='card' && !el?.cardIdentity)throw Error(`${id}/${name}: real image/body Card or exact TextButton/M child mismatch`);
    if(id==='comment' && !el?.commentIdentity)throw Error(`${id}/${name}: unanswered QA, unique linked composer or exact Button child mismatch`);
    if(id==='carousel' && !el?.carouselIdentity)throw Error(`${id}/${name}: seven-slide homepage scaffold, safe identity or dot mapping mismatch`);
    if(id==='table' && !el?.tableIdentity)throw Error(`${id}/${name}: native table hierarchy, header scope or column count mismatch`);
    if(id==='option-selector' && !el?.optionIdentity)throw Error(`${id}/${name}: option button shape, default state or safe identity mismatch`);
    if(id==='list' && !el?.listIdentity)throw Error(`${id}/${name}: complete list structure or action routing mismatch`);
    if(id==='tab' && !el?.tabIdentity)throw Error(`${id}/${name}: complete tab inner structure or initial state mismatch`);
    if(id==='tab' && name==='standard' && !/data-tab-current="regular-atom"/.test(el?.html || ""))throw Error(`${id}/${name}: current regular atom marker required`);
    if(id==='tab' && name==='capsule' && !/data-tab-current="capsule-atom"/.test(el?.html || ""))throw Error(`${id}/${name}: current capsule atom marker required`);
    if(id==='menu-navigation' && !el?.menuIdentity)throw Error(`${id}/${name}: menu identity, panel, selection or native button mismatch`);
    if(id==='icon-card' && !el?.iconCardIdentity)throw Error(`${id}/${name}: gray single-event structure or exact TextButton child mismatch`);
    if(id==='collapse' && !el?.collapseIdentity)throw Error(`${id}/${name}: disclosure structure, identity or single-open state mismatch`);
    if(id==='stepper' && !el?.stepperIdentity)throw Error(`${id}/${name}: four-stage structure, default state or icon mismatch`);
    if(id==='stepper' && name==='circle-centered-solution' && el?.attrs?.['data-stepper-current']!=='solution-completed-only')throw Error(`${id}/${name}: current solution pending-stage guard required`);
    if(id==='video-button' && !el?.videoIdentity)throw Error(`${id}/${name}: duration button structure, size or safe identity mismatch`);
    if(id==='rate' && !el?.rateIdentity)throw Error(`${id}/${name}: full-star structure, committed value or label mismatch`);
    if(id==='anchor-nav' && !el?.anchorIdentity)throw Error(`${id}/${name}: tab div structure, active state or CTA mismatch`);
    if(id==='breadcrumb' && !el?.breadcrumbIdentity)throw Error(`${id}/${name}: navigation structure, current item or separator mismatch`);
    if(id==='badge' && !el?.badgeIdentity)throw Error(`${id}/${name}: display badge structure, capped count or asset mismatch`);
    if(id==='radio' && (!el?.radioIdentity || rule.bindings?.changeCallback?.event!=='change' || (name==='bordered-detail' && el?.attrs?.['data-radio-current']!=='detail-framework')))throw Error(`${id}/${name}: native radio structure, default state or group identity mismatch`);
    if(id==='input-number' && (!el?.numberIdentity || rule.bindings?.changeCallback?.event!=='change' || rule.bindings?.inputCallback?.event!=='input'))throw Error(`${id}/${name}: numeric structure, positive range or event mismatch`);
    if(id==='tag' && (!el?.tagIdentity || (['selectable','filter','product-regular-small','product-color-small'].includes(name)?rule.bindings?.changeCallback?.event!=='ds:tag-change':name==='product-custom-small'?rule.bindings?.actionCallback?.event!=='ds:tag-activate':Object.keys(rule.bindings||{}).length>0)))throw Error(`${id}/${name}: default toggle structure, finite display, icon or event mismatch`);
    if(id==='tag' && (name==='filter' ? rule.bindings?.closeCallback?.mode!=='event-handler' || rule.bindings?.closeCallback?.target!=='root' || rule.bindings?.closeCallback?.event!=='ds:tag-close' : !!rule.bindings?.closeCallback))throw Error(`${id}/${name}: invalid Tag close binding`);
    if(id==='checkbox' && (!el?.checkboxIdentity || rule.bindings?.changeCallback?.event!=='change'))throw Error(`${id}/${name}: native Checkbox structure, size or default state mismatch`);
    if(id==='select' && (!el?.selectIdentity || rule.bindings?.changeCallback?.event!=='ds:select-change'))throw Error(`${id}/${name}: select identity, closed state, runtime semantics or option marker mismatch`);
    if(id==='input' && (!el?.inputIdentity || el.attrs['data-input-current']===undefined))throw Error(`${id}/${name}: input identity or opt-in mismatch`);
    if(rule.bindings?.accessibleLabel?.mode==='accessible-label' && (!el?.attrs['aria-label']?.trim() || (!externalCarousel && el.attrs.type!=='button')))throw Error(`${id}/${name}: missing accessible label or safe button type`);
    if(el?.matchCount!==1) throw Error(`${id}/${name}: example selector must match exactly one element`);
    if(!el?.found || el.tag!==expectedRoot || (a.rootTag==='dialog' && (Object.hasOwn(el.attrs,'open') || Object.hasOwn(el.attrs,'inert')))) throw Error(`${id}/${name}: invalid example root or closed dialog state`);
    for(const cls of (v.cssClass||'').split(/\s+/)) if(!el.classes.includes(cls)) errors.push(`${id}/${name}: missing root class ${cls}`);
    if(id==='dialog' && !el.dialogIdentity)errors.push(`${id}/${name}: exact Dialog anatomy or default footer Button call mismatch`);
    for(const selector of el.missingRequired) errors.push(`${id}/${name}: missing required structure ${selector}`);
    for(const slot of el.missingSlots) errors.push(`${id}/${name}: missing slot ${slot}`);
    if(!el.titleIdentity || (a.rootTag==='dialog' && !el.attrs['aria-labelledby'])) errors.push(`${id}/${name}: title identity mismatch`);
    const sizeOptions=(rule.sizes||[]).map(size=>{
      const declared=v.sizes?.find(item=>item.name===size.name), instance=dom[name+'::'+size.name];
      if(!declared || !instance?.found || instance.matchCount!==1 || instance.tag!==a.rootTag || instance.missingRequired.length || instance.missingSlots.length || !instance.classes.includes(size.cssClass) || v.cssClass.split(/\s+/).some(cls=>!instance.classes.includes(cls)))throw Error(`${id}/${name}/${size.name}: invalid size example`);
      if(id==='tab' && !instance.tabIdentity)throw Error(`${id}/${name}/${size.name}: complete tab inner structure or initial state mismatch`);
      if(id==='tab' && name==='standard' && !/data-tab-current="regular-atom"/.test(instance.html || ""))throw Error(`${id}/${name}/${size.name}: current regular atom marker required`);
      if(id==='video-button' && !instance.videoIdentity)throw Error(`${id}/${name}/${size.name}: duration button structure, size or safe identity mismatch`);
      if(id==='rate' && !instance.rateIdentity)throw Error(`${id}/${name}/${size.name}: full-star structure, committed value or label mismatch`);
      const sizeBindings=Object.fromEntries(Object.entries(rule.bindings||{}).filter(([,b])=>!b.sizes||b.sizes.includes(size.name)));
      return {name:size.name,cssClass:size.cssClass,styleProperties:declared.styleProperties,exampleHtml:instance.html,...(id==='button'?{bindings:sizeBindings,allowedEdits:rule.allowedEdits.filter(field=>!rule.bindings?.[field]||Object.hasOwn(sizeBindings,field))}:{})};
    });
    if(rule.sizes){
      const covered=rule.sizes.map(s=>s.name), excluded=rule.unsupportedSizes||[], declared=v.sizes?.map(s=>s.name)||[], partition=[...covered,...excluded];
      if(new Set(partition).size!==partition.length || partition.length!==declared.length || partition.some(s=>!declared.includes(s)) || !covered.includes(rule.defaultSize))throw Error(`${id}/${name}: size coverage mismatch`);
    }
    const decision = variantSelectionDecision(c, v);
    return {name,...(rule.runtime?{runtime:rule.runtime}:{}),publication:require('./component-publication').publication(root,id,name,false),rootTag:expectedRoot,type:v.type,defaultSize:rule.defaultSize,sizeOptions,...(id==='table'?{dataShape:{bodyRowCount:el.tableBodyRowCount,maxBodyRows:6,static:true}}:{}),...(rule.unsupportedSizes?.length?{unsupportedSizes:rule.unsupportedSizes}:{}),bindings:rule.bindings,runtimeSemantics:rule.runtimeSemantics,purpose:rule.purpose,whenToUse:v.whenToUse??decision?.whenToUse,whenNotToUse:v.whenNotToUse??decision?.whenNotToUse,rootClasses:v.cssClass,requiredStructure:v.requiredChildren,slots:rule.slots,allowedEdits:rule.allowedEdits,exampleHtml:el.html};
  });
  for(const file of require('./sync-five-variant-parts').validate(root,id))files.add(file);
  if(['collapse','option-selector','tag','badge','select'].includes(id))for(const file of require('./sync-list-option-parts').validate(root,id))files.add(file);
  if(id==='dialog' && a.supported.includes('form'))for(const file of require('./sync-dialog-owned-parts').validate(root))files.add(file);
  if(id==='carousel' && a.supported.includes('external-cards'))for(const file of require('./sync-carousel-external').validate(root,c,examples,buildReference))files.add(file);
  const children=(c.relations?.componentDependencies||[]).map(dep=>{
    if(dep.requiredWhen!==undefined && !(id==='form' && dep.component==='Select' && dep.slot==='sourceFieldsSelect' && dep.requiredWhen==='sourceFields' && c.aiContract.variants.gray.bindings.sourceFields.mode==='source-form-fields') && !(id==='table' && dep.component==='TextButton' && dep.slot==='toggle' && dep.requiredWhen==='body-row-count-over-six' && JSON.stringify(dep.appliesTo)==='["horizontal-row-line"]'))throw Error(`${id}: invalid conditional child dependency`);
    const target=byName.get(dep.component);
    if(!target) throw Error(`${id}: missing dependency ${dep.component}`);
    files.add(target.path);
    if (dep.part) {
      const part = target.data.parts?.[dep.part];
      if(part?.allowedHosts && !part.allowedHosts.some(host=>host.component===c.name && dep.appliesTo?.length && dep.appliesTo.every(variant=>variant===host.variant)))throw Error(`${id}: child part ${dep.component}/${dep.part} is outside its source-locked host scope`);
      if (!part || !part.previewSelector || !part.requiredClasses?.every(cl => dep.implementationClasses?.includes(cl)) ||
        !(dep.requiredVariants || []).every(v => part.colorVariants?.includes(v))) throw Error(`${id}: undeclared or inconsistent child part ${dep.component}/${dep.part}`);
      if (!requestedDependencyReady(root, target.data, dep)) throw Error(`${id}: unavailable child part ${dep.component}/${dep.part}`);
      files.add(part.source);
      if(part.sourcePreview)files.add(part.sourcePreview);
    }
    for(const variant of dep.part ? [] : dep.requiredVariants||[]) {
      const v=target.data.variants.find(v=>v.name===variant);
      if(!v) errors.push(`${id}: missing child variant ${dep.component}/${variant}`);
      else if(!requestedDependencyReady(root, target.data, {requiredVariants:[variant]})) errors.push(`${id}: unavailable child variant ${dep.component}/${variant}`);
    }
    for(const item of dep.requiredSizes||[])if(!target.data.variants?.find(v=>v.name===item.variant)?.sizes?.some(size=>size.name===item.size))errors.push(`${id}: missing child size ${dep.component}/${item.variant}/${item.size}`);
    const preview=`components/variants/${target.id}.html`;files.add(preview);
    // These three finite Banner assemblies have fully validated child presence.
    // Family-level optional declarations must not become required absent slots.
    let finiteAppliesTo=id==='banner' && ['Button','Breadcrumb'].includes(dep.component)
      ? examples.filter(e=>dom[e.name]?.bannerIdentity && (dep.component==='Button'?['hero','hero-responsive']:['sub']).includes(e.name)).map(e=>e.name) : undefined;
    // Card's source gallery includes List slots absent from the finite AI calls.
    // Keep the real family relationship without requiring an absent child.
    if(id==='card' && dep.component==='List') {
      const {JSDOM}=require('jsdom');
      finiteAppliesTo=examples.filter(e=>{
        const document=new JSDOM(e.exampleHtml);
        try{return [...document.window.document.querySelectorAll('[data-list-current="unordered"][data-list-source="legacy-fixed"]')].some(node=>(dep.requiredVariants||[]).some(variant=>node.classList.contains(`ds-list--${variant}`)));}
        finally{document.window.close();}
      }).map(e=>e.name);
    }
    if(id==='card' && dep.component==='Tag' && dep.slot==='metadata') {
      const {JSDOM}=require('jsdom');
      finiteAppliesTo=examples.filter(e=>{
        const document=new JSDOM(e.exampleHtml);
        try{return (dep.requiredVariants||[]).every(variant=>{
          const selectors={'metadata-single':'.ds-tag-meta--single[data-tag-source-metadata="single"]',metadata:'.ds-tag-meta[data-tag-source-metadata="dual"]',featured:'.ds-tag--featured[data-tag-source-featured="official"]'};
          return !!selectors[variant] && !!document.window.document.querySelector(selectors[variant]);
        });}
        finally{document.window.close();}
      }).map(e=>e.name);
    }
    if(id==='card' && dep.component==='Tag' && dep.part==='cardGraySource') {
      const {JSDOM}=require('jsdom');
      finiteAppliesTo=examples.filter(e=>{
        const document=new JSDOM(e.exampleHtml);
        try{return !!document.window.document.querySelector('[data-tag-card-gray-source="official"]');}
        finally{document.window.close();}
      }).map(e=>e.name);
    }
    return {id:target.id,contract:target.path,...(dep.part?{part:dep.part,scope:target.data.parts[dep.part].scope}:{}),variants:dep.requiredVariants,sizes:dep.requiredSizes,appliesTo:dep.appliesTo,slot:dep.slot,...(finiteAppliesTo?{finiteAppliesTo}:{}),...(dep.requiredWhen?{requiredWhen:dep.requiredWhen}:{}),preview:`components/variants/${target.id}.html`};
  });
  let buttonNesting;
  if(!errors.length && c.name!=='Button' && ((c.relations?.componentDependencies||[]).some(dep=>dep.component==='Button')||examples.some(e=>/class=["'][^"']*\bds-btn\b/.test(e.exampleHtml)))){
    const target=byName.get('Button');
    if(!target)throw Error(`${id}: missing Button atom`);
    const requestedButtonVariants=(c.relations?.componentDependencies||[]).filter(d=>d.component==='Button').flatMap(d=>d.requiredVariants||[]);
    const usesCart=requestedButtonVariants.includes('cart-product-card'),usesShape=!requestedButtonVariants.length||requestedButtonVariants.some(v=>v!=='cart-product-card');
    const buttonStyles=(target.data.integration?.styles||[]).filter(style=>style==='components/cart-current.css'?usesCart:['components/components.css','components/button-current.css'].includes(style)?usesShape:true);
    for(const style of buttonStyles)if(!c.integration.styles.includes(style))throw Error(`${id}: missing nested Button runtime style ${style}`);
    buttonNesting=require('./button-host-dependencies').validateHostedButtons(c,examples,target.data);
  }
  const otherAtomNesting={};
  if(!errors.length)for(const name of ['TextButton','IconButton']){
    const target=byName.get(name);
    if(c.name===name)continue;
    const prefix=name==='TextButton'?'ds-text-btn':'ds-icon-btn';
    const atomicExamples=id==='carousel'?examples.filter(e=>e.name!=='external-cards'):examples;
    if(!(c.relations?.componentDependencies||[]).some(d=>d.component===name)&&!atomicExamples.some(e=>new RegExp('class=["\'][^"\']*\\b'+prefix+'\\b').test(e.exampleHtml)))continue;
    const nested=require('./link-icon-host-dependencies').validateHostedAtom(c,atomicExamples,target.data,root);
    if(nested.checked.length)for(const style of target.data.integration.styles)if(!c.integration.styles.includes(style))throw Error(`${id}: missing ${name} runtime style ${style}`);
    otherAtomNesting[name]=nested;
  }
  if(id==='card')otherAtomNesting.ButtonCart=require('./cart-source').validateCartHosts(root);
  if(id==='form')otherAtomNesting.formFieldDependencies=require('./form-host-dependencies').validateFormDependencies(c,examples,byName);
  if(['option-selector','select','list','dropdown'].includes(id))otherAtomNesting.Checkbox=require('./checkbox-host-dependencies').validateCheckboxHosts(c,examples,byName.get('Checkbox').data,read(root,`components/variants/${id}.html`));
  if(id==='list')otherAtomNesting.productDependencies=require('./list-product-dependencies').validateListProducts(c,read(root,'components/variants/list.html'),byName);
  if(id==='list')otherAtomNesting.toolbarDependencies=require('./list-toolbar-dependencies').validateListToolbar(c,read(root,'components/variants/list.html'),byName.get('Button').data);
  const parents=all.filter(x=>(x.data.relations?.componentDependencies||[]).some(d=>d.component===c.name)).map(x=>{
    const usage=x.data.relations.componentDependencies.filter(d=>d.component===c.name);
    const preview=`components/variants/${x.id}.html`, exists=fs.existsSync(path.join(root,preview));
    if(exists)files.add(preview);
    const evidence=classifyDependencyEvidence(exists?read(root,preview):null,usage);
    return {id:x.id,contract:x.path,preview:exists?preview:null,status:evidence.status,evidence,usage};
  });
  const iconDependencies=c.relations?.iconDependencies||[];
  const iconManifestFile='components/icons/icons-manifest.json';
  const iconManifest=iconDependencies.length?json(root,iconManifestFile):null;
  if(iconManifest) {
    if(!Array.isArray(iconManifest.icons))throw Error(`${id}: invalid icon registry`);
    files.add(iconManifestFile);
  }
  const icons=iconDependencies.map(d=>{
    if(d.requiredWhen!==undefined && !(id==='table' && d.icon==='icon-chevron-down' && d.requiredWhen==='body-row-count-over-six' && JSON.stringify(d.appliesTo)==='["horizontal"]'))throw Error(`${id}: invalid conditional icon dependency`);
    const name=d.icon.replace(/\.svg$/,'');
    const entries=iconManifest.icons.filter(icon=>icon.name===name);
    if(entries.length!==1)throw Error(`${id}: icon registry requires one entry for ${name}`);
    const entry=entries[0];
    if(entry.file!==name+'.svg')throw Error(`${id}: icon registry file mismatch for ${name}`);
    if(!entry.usedBy?.some(host=>typeof host==='string'&&(host===c.name||host.startsWith(c.name+'/'))))throw Error(`${id}: icon registry missing host ${c.name} for ${name}`);
    const file=`components/icons/${entry.file}`;files.add(file);return {file,registry:iconManifestFile,appliesTo:d.appliesTo,usage:d.usage,...(d.requiredWhen?{requiredWhen:d.requiredWhen}:{})};
  });
  const tokenRegistry=new Map();
  for(const f of tokenNames) {
    const file=`components/token-specs/${f}`, data=json(root,file);
    for(const t of [...(data.tokens||[]),...(data.compositeTokens||[])]) tokenRegistry.set(t.name,{...t,source:file});
  }
  const tokens=(c.tokenReferences||[]).map(name=>{
    const t=tokenRegistry.get(name);if(!t) throw Error(`${id}: missing token ${name}`);files.add(t.source);
    return {name,value:t.value,unit:t.unit||null,cssVar:t.cssVar||null,primitiveReferences:t.primitiveReferences||null,source:t.source};
  });
  Object.values(a.evidence||{}).filter(v=>typeof v==='string' && v.startsWith('components/')).forEach(f=>files.add(f));
  function bindHelperSource(file,sha256,label){
    if(typeof sha256!=='string'||!/^[a-f0-9]{64}$/.test(sha256)||hash(read(root,file))!==sha256)throw Error(`${id}: saved ${label} source changed during inventory`);
    files.add(file);
  }
  // Assertions are emitted only after the corresponding helper succeeds.
  // A hashed file path or exported data-type attribute alone cannot prove a DSL type.
  const sourceValidation={componentIdentity:{status:'not-established',files:[]},specificationBody:{status:'not-established',files:[]},originalOnlineFrontendCode:false,browserComputedStyles:false,completeSpecificationCoverage:false};
  if(buttonNesting)sourceValidation.buttonNesting=buttonNesting;
  if(id==='banner' && a.evidence?.nativeHeroReview){
    const h=require('./banner-native-hero-source');
    sourceValidation.nativeHero=h.validateNativeHeroSource(root);
    files.add(h.SOURCE);files.add(sourceValidation.nativeHero.background.file);
    sourceValidation.componentIdentity={status:'saved-typed-nodes-checked',scope:'desktop-home-Hero-only',variants:['hero'],files:[h.SOURCE],basis:'Saved COMPONENT root and genuine Button instance reference; other Banner calls remain source-limited.'};
    sourceValidation.specificationBody={status:'selected-saved-body-texts-checked',scope:'desktop-home-Hero selected specification sections only',files:[h.SOURCE]};
  }
  if(Object.keys(otherAtomNesting).length)sourceValidation.otherAtomNesting=otherAtomNesting;
  if(id==='menu-navigation')sourceValidation.currentGutter=require('./menu-gutter-cascade').validateMenuGutter(root);
  if(id==='input-number'){
    const {validateLockedColour,SOURCE}=require('./input-number-locked-colour');
    sourceValidation.currentLockedColour=validateLockedColour(root);files.add(SOURCE);
    const hover=require('./input-number-hover-surface');
    sourceValidation.currentHoverSurface=hover.validateHoverSurface(root);files.add(hover.SOURCE);
  }
  if(id==='radio'){
    const h=require('./radio-small-root-layout');sourceValidation.currentSmallRootLayout=h.validateRadioSmallRootLayout(root);sourceValidation.currentLargeRootLayout=h.validateRadioLargeRootLayout(root);h.sourceFiles(root).forEach(f=>files.add(f));
  }
  if(id==='checkbox'){
    const h=require('./checkbox-root-layout');sourceValidation.currentRootLayout=h.validateCheckboxRootLayout(root);h.sourceFiles(root).forEach(f=>files.add(f));
  }
  if(id==='tab'&&a.supported.includes('standard-center')){const h=require('./tab-center-source');sourceValidation.center=h.validateCenterSource(root);files.add(h.SOURCE);}
  if(id==='breadcrumb'){const h=require('./breadcrumb-full-width-source');sourceValidation.fullWidth=h.validateFullWidthSource(root);files.add(h.SOURCE);}
  if(id==='tag'||id==='card'){const h=require('./tag-new-source');sourceValidation.newTag=h.validateNewTagSource(root);files.add(h.SOURCE);if(id==='card')sourceValidation.newTagHosts=h.validateNewTagHosts(root);}
  if(id==='button'&&a.supported.includes('cart-product-card')){const h=require('./cart-source');sourceValidation.cart=h.validateCartSource(root);files.add(h.SOURCE);files.add(h.SVG);}
  if(id==='card'){const h=require('./cart-source');sourceValidation.cart=h.validateCartSource(root);files.add(h.SOURCE);files.add(h.SVG);}
  if(id==='card' && a.supported.includes('spliced.vertical.category-nav')){const h=require('./card-category-nav-source');sourceValidation.categoryNav=h.validateCategoryNavSource(root);files.add(h.SOURCE);}
  if(id==='card' && a.supported.includes('embedded.product-small')){const h=require('./card-embedded-standard-source');sourceValidation.embeddedSmall=h.validateEmbeddedSmallSource(root);files.add(h.SMALL);}
  if(id==='card' && a.supported.includes('embedded.product-standard')){
    const h=require('./card-embedded-standard-source');
    sourceValidation.embeddedStandard=h.validateEmbeddedStandardSource(root,c);files.add(h.SOURCE);
  }
  if(id==='icon-card'){
    const {validateIconCardCurrentSurface,SOURCE}=require('./icon-card-current-surface');
    sourceValidation.currentSurface=validateIconCardCurrentSurface(root);files.add(SOURCE);
  }
  if(id==='button')sourceValidation.stateSemantics=require('./button-state-semantics').validateButtonStates(read(root,'components/variants/button.html')); 
  if(id==='button'&&a.variants['outline-black']?.bindings?.icon){
    const h=require('./button-leading-icon');sourceValidation.leadingIcon=h.validateSource(root);files.add(h.SOURCE);
    for(const asset of sourceValidation.leadingIcon.assets)for(const f of [asset.file,asset.original,asset.screenshot])if(f)files.add(f);
    for(const e of sourceValidation.leadingIcon.evidence)files.add(e.file);
    for(const name of ['filled-red','outline-black']){
      const expected=sourceValidation.leadingIcon.assets.filter(asset=>asset.paint===(name==='filled-red'?'#FFFFFF':'#19191A')).map(asset=>asset.file);
      if(JSON.stringify(a.variants[name].bindings.icon.values)!==JSON.stringify(expected))throw Error('Button leading icon: palette differs from source registry');
    }
    const issues=h.outputIssues(read(root,'components/variants/button.html'),c);if(issues.length)throw Error(issues[0].message);
  }
  if(id==='carousel'&&a.evidence?.outlined28){
    const h=require('./carousel-outline-control'); sourceValidation.outlined28=h.validateSource(root);files.add(h.SOURCE);
    for(const asset of sourceValidation.outlined28.assets)for(const f of [asset.file,asset.original])files.add(f);
    for(const e of sourceValidation.outlined28.evidence)files.add(e.file);
  }
  if(id==='carousel'&&a.evidence?.solid48){
    const h=require('./carousel-solid-control');sourceValidation.solid48=h.validateSource(root);files.add(h.SOURCE);
    for(const asset of sourceValidation.solid48.assets)for(const f of [asset.file,asset.original])files.add(f);
    for(const e of sourceValidation.solid48.evidence)files.add(e.file);
  }
  const typedSource=(...files)=>{sourceValidation.componentIdentity={status:'saved-typed-nodes-checked',files,basis:'Original saved COMPONENT_SET/COMPONENT types and finite node identities; not screen position or container title.'};};
  if(a.evidence?.specificationIndex){
    if(!['button','text-button','icon-button','video-button'].includes(id))throw Error(`${id}: unexpected Button specification scope`);
    const {indexSpecification,OUTPUT}=require('./index-button-specification');
    if(a.evidence.specificationIndex!==OUTPUT)throw Error(`${id}: invalid specification index path`);
    const expected=indexSpecification(root);
    if(JSON.stringify(json(root,OUTPUT))!==JSON.stringify(expected))throw Error(`${id}: specification index is stale or altered`);
    bindHelperSource(expected.source.file,expected.source.sha256,'specification');
    sourceValidation.specificationBody={status:'selected-saved-body-texts-checked',scope:'shared-button-section-only',files:[OUTPUT,expected.source.file]};
  }
  if(id==='button'&&a.evidence?.originalComponents)files.add(a.evidence.originalComponents);
  if(id==='button'&&a.evidence?.inventory){
    const {inventory,OUTPUT}=require('./inventory-shape-button-source');
    if(a.evidence.inventory!==OUTPUT)throw Error(`${id}: invalid typed design inventory path`);
    const expected=inventory(root);
    if(JSON.stringify(json(root,OUTPUT))!==JSON.stringify(expected))throw Error(`${id}: typed design inventory is stale or altered`);
    bindHelperSource(expected.source.file,expected.source.sha256,'component');
    for(const [file,sha256] of Object.entries(expected.runtimeDeclarationFiles))bindHelperSource(file,sha256,'declaration');
    typedSource(OUTPUT,expected.source.file);
  }
  if(id==='text-button' && a.evidence.inventory){
    const file=a.evidence.inventory,index=json(root,file);
    const expected=require('./inventory-text-button-source').inventory(root);
    if(JSON.stringify(index)!==JSON.stringify(expected))throw Error(`${id}: typed design inventory is stale or altered`);
    bindHelperSource(expected.source.file,expected.source.sha256,'component');
    for(const [file,sha256] of Object.entries(expected.declarationSources)){if(hash(read(root,file))!==sha256)throw Error('TextButton declaration source changed during review');files.add(file);}
    typedSource(file,expected.source.file);
  }
  if(id==='icon-button' && a.evidence.inventory){
    const {inventory,OUTPUT,validatePreviewStateBoundary}=require('./inventory-icon-button-source');
    if(a.evidence.inventory!==OUTPUT)throw Error(`${id}: invalid typed design inventory path`);
    const expected=inventory(root);
    sourceValidation.previewStateBoundary=validatePreviewStateBoundary(read(root,'components/variants/icon-button.html'),expected);
    if(JSON.stringify(json(root,OUTPUT))!==JSON.stringify(expected))throw Error(`${id}: typed design inventory is stale or altered`);
    bindHelperSource(expected.source.file,expected.source.sha256,'component');
    for(const [file,sha256] of Object.entries(expected.declarationSources)){if(hash(read(root,file))!==sha256)throw Error('IconButton declaration source changed during review');files.add(file);}
    typedSource(OUTPUT,expected.source.file);
  }
  if(id==='video-button' && a.evidence.inventory){
    const {inventory,OUTPUT,SOURCE}=require('./inventory-video-button-source');
    if(a.evidence.inventory!==OUTPUT)throw Error(`${id}: invalid typed source inventory path`);
    const checked=inventory(root);if(JSON.stringify(json(root,OUTPUT))!==JSON.stringify(checked))throw Error(`${id}: typed source inventory is stale or altered`);
    for(const [file,sha256] of Object.entries(checked.declarationSources)){if(hash(read(root,file))!==sha256)throw Error('VideoButton declaration source changed during review');files.add(file);}
    bindHelperSource(SOURCE,checked.sha256,'component');
    typedSource(OUTPUT,SOURCE);
  }
  if(id==='input'){
    const {validateInputSourceReview,SOURCE,REVIEW}=require('./validate-input-source-review');
    const checked=validateInputSourceReview(root);
    if(hash(read(root,SOURCE))!==checked.source.sha256)throw Error('Input saved tool source changed during review');
    files.add(SOURCE);files.add(REVIEW);
    sourceValidation.componentIdentity={status:'saved-tool-markers-checked',files:[SOURCE,REVIEW],basis:'Finite saved tool HTML marker/state provenance; independent original DSL types are not established.'};
  }
  if(id==='select'){
    const {inventory,OUTPUT,SOURCE,REFRESH}=require('./inventory-select-source');
    if(a.evidence?.inventory!==OUTPUT)throw Error(`${id}: missing typed source inventory path`);
    const checked=inventory(root);
    if(JSON.stringify(json(root,OUTPUT))!==JSON.stringify(checked))throw Error(`${id}: typed source inventory is stale or altered`);
    bindHelperSource(SOURCE,checked.source.sha256,'component export');
    bindHelperSource(REFRESH,checked.source.refreshSha256,'typed component');
    typedSource(OUTPUT,SOURCE,REFRESH);
    if(a.variants?.['single-basic']?.bindings?.layout){
      const node=checked.sets.flatMap(s=>s.instances||[]).find(n=>n.nodeId==='68908:021318');
      if(node?.typedDeclarations?.flex?.crossSizing!=='auto')throw Error('Select native single-basic auto width evidence changed');
      sourceValidation.hostWidth={nodeId:node.nodeId,crossSizing:'auto',specimenWidth:node.typedDeclarations.dimensions.width,scope:'single-basic gray root only;42px trigger and all other variants unchanged'};
    }
  }
  if(id==='dialog'){
    const {inventory,OUTPUT}=require('./inventory-dialog-source');
    if(a.evidence?.inventory!==OUTPUT)throw Error(`${id}: missing typed source inventory path`);
    const checked=inventory(root);
    if(JSON.stringify(json(root,OUTPUT))!==JSON.stringify(checked))throw Error(`${id}: typed source inventory is stale or altered`);
    for(const source of Object.values(checked.sources)){
      if(hash(read(root,source.file))!==source.sha256)throw Error(`${id}: saved source changed during inventory`);
      files.add(source.file);
    }
    typedSource(OUTPUT,checked.sources.original.file);
    sourceValidation.specificationBody={status:'selected-saved-body-texts-checked',scope:'selected-dialog-body-texts-only',files:[OUTPUT,checked.sources.specification.file]};
  }
  for(const file of [...files].filter(f=>f.endsWith('/source-index.json'))){
    const index=json(root,file),source=index.source;
    if(index.schemaVersion!=='fs-existing-source-index/1.0.0' || index.component!==(file.match(/^components\/sources\/([^/]+)\/source-index\.json$/)?.[1]||id) || !source?.file || path.isAbsolute(source.file) || source.file.split(/[\\/]/).includes('..'))throw Error(`${id}: invalid archived source index ${file}`);
    if(!fs.existsSync(path.join(root,source.file)) || hash(read(root,source.file))!==source.sha256)throw Error(`${id}: archived source index is stale or missing: ${source.file}`);
    files.add(source.file);
  }
  for(const f of files) if(!fs.existsSync(path.join(root,f))) errors.push(`${id}: missing source ${f}`);
  if(errors.length) throw Error(errors.join('\n'));
  for(const f of files)read(root,f);
  for(const file of c.integration.scripts) {
    const syntax=spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8'});
    if(syntax.status!==0)throw Error(`${id}: runtime syntax invalid: ${file}`);
  }
  const fingerprints=Object.fromEntries([...files].sort().map(f=>[f,hash(observed.get(f))]));
  // All contracts affect reverse parent discovery. A new host must invalidate this pack too.
  const graphFingerprint=hash(JSON.stringify(all.filter(x=>(x.data.relations?.componentDependencies||[]).some(dep=>dep.component===c.name)).map(x=>({id:x.id,usage:x.data.relations.componentDependencies.filter(dep=>dep.component===c.name)}))));
  for(const [file,bytes] of observed)if(!fs.existsSync(path.join(root,file)) || !fs.readFileSync(path.join(root,file)).equals(bytes))throw Error(`${id}: source changed during read: ${file}; retry sync`);
  if(JSON.stringify(contractNames)!==JSON.stringify(directoryNames('components/contracts')) || JSON.stringify(tokenNames)!==JSON.stringify(directoryNames('components/token-specs')))throw Error(`${id}: source directory changed during read; retry sync`);
  return {schemaVersion:'fs-component-reference/1.0.0',component:{id,name:c.name,version:c.source?.specVersion,scope:a.scope,reviewStatus:a.reviewStatus},selection:{policy:a.selectionPolicy,supported:a.supported,unsupported:a.unsupported},runtime:c.integration,identity:a.identity,locked:a.locked,behavior:a.behavior,examples,relationships:{children,parents,parentStatus:parents.length?'declared-hosts':'no-declared-hosts',icons,tokens},source:c.source,evidence:a.evidence,sourceValidation,freshness:{fingerprints,graphFingerprint,note:'从本地源文件生成；不是 MasterGo 在线实时状态。'}};
}
function projectReference(pack,variant) {
  const example=pack.examples.find(item=>item.name===variant);
  if(!example)throw Error(`${pack.component.id}/${variant}: unsupported AI reference scope`);
  const applies=item=>{
    if(Array.isArray(item.finiteAppliesTo) && !item.finiteAppliesTo.includes(variant))return false;
    if(item.requiredWhen==='body-row-count-over-six') {
      if(pack.component.id!=='table' || !Number.isInteger(example.dataShape?.bodyRowCount) || example.dataShape.bodyRowCount<1 || example.dataShape.maxBodyRows!==6 || example.dataShape.static!==true)throw Error(`${pack.component.id}/${variant}: missing conditional table data shape`);
      if(example.dataShape.bodyRowCount<=6)return false;
    }
    return !item.appliesTo?.length || item.appliesTo.includes(variant) || (example.type && (item.appliesTo.includes(example.type) || item.appliesTo.includes(example.type+'/'+variant.slice(example.type.length+1))));
  };
  return {...pack,readScope:{variant,note:'只展开当前已选变体；其他变体没有被声明为不可用。尺寸继续按真实 sizeOptions 选择。'},examples:[example],relationships:{...pack.relationships,children:pack.relationships.children.filter(applies),icons:pack.relationships.icons.filter(applies)}};
}
function markdown(pack) {
 return `# ${pack.component.name} — AI 调用参考\n\n此文件自动生成，请修改组件契约、Preview、Token 或图标源文件，再运行 npm run component:sync。\n\n范围：${pack.component.scope}；视觉审阅：${pack.component.reviewStatus.visual}。\n\n${pack.selection.policy}\n\n必须加载：${[...pack.runtime.styles,...pack.runtime.scripts].join('、')}。\n\n字体样式表：${(pack.runtime.fontStylesheets || []).join('、')}。${pack.runtime.fontFallback || ''}\n\n${pack.identity.rule}\n\n${pack.identity.labelRule || ''}\n\n不可修改：${pack.locked.join('；')}。\n\n${pack.examples.map(v=>`## ${v.name}\n\n用：${v.whenToUse}\n\n不用：${v.whenNotToUse}\n\n可修改：${v.allowedEdits.join('、')}。${v.sizeOptions?.length ? '\n\n默认尺寸：'+v.defaultSize+'；可选尺寸：'+v.sizeOptions.map(s=>s.name).join('、')+'。换尺寸必须取同名 JSON 的完整 sizeOptions 示例，不只更改高度。':''}\n\n\`\`\`html\n${v.exampleHtml}\n\`\`\``).join('\n\n')}\n\n## 行为\n\n${Object.entries(pack.behavior).map(([k,v])=>`- ${k}：${v}`).join('\n')}\n\n## 关系\n\n子组件：${pack.relationships.children.map(x=>x.id).join('、')||'无'}。\n\n已登记父组件：${pack.relationships.parents.map(x=>x.id).join('、')||'暂无；不根据视觉相似度猜测父关系'}。\n\n图标：${pack.relationships.icons.map(x=>x.file).join('、')}。\n\n详细 Token 数值、适用变体和源文件指纹见同名 JSON；文件源自本地快照，不代表 MasterGo 已在线同步。\n`;
}
function compile(root=ROOT,check=false) {
 const contractIds=()=>fs.readdirSync(path.join(root,'components/contracts')).filter(f=>f.endsWith('.json')).map(f=>f.slice(0,-5)).sort();
 const tokenFiles=()=>fs.readdirSync(path.join(root,'components/token-specs')).filter(f=>f.endsWith('.json')).sort();
 const allIds=contractIds(),initialTokenFiles=tokenFiles(),policyFile='components/reference-policy.json',policyBytes=fs.readFileSync(path.join(root,policyFile));
 const policy=JSON.parse(policyBytes.toString('utf8'));
 if(policy.schemaVersion!=='1.0.0')throw Error('Invalid component reference policy');
 for(const id of policy.benchmarkComponents||[])if(!allIds.includes(id))throw Error(`Missing benchmark component: ${id}`);
 for(const id of allIds)if((!(policy.legacyComponents||[]).includes(id)||(policy.benchmarkComponents||[]).includes(id))&&!json(root,`components/contracts/${id}.json`).aiContract)throw Error(`${id}: new/benchmark components require aiContract`);
 const ids=allIds.filter(id=>json(root,`components/contracts/${id}.json`).aiContract);
 // Validate all selected components before changing any existing reference output.
 // Per-file rename remains atomic; this is not a multi-file filesystem transaction.
 const pending=[],sourceHashes=new Map([[policyFile,hash(policyBytes)]]);
 for(const id of ids) {
  const pack=buildReference(root,id), base=`components/references/${id}`;
  for(const [file,sha256] of Object.entries(pack.freshness.fingerprints)){
   if(sourceHashes.has(file)&&sourceHashes.get(file)!==sha256)throw Error(`source changed during whole reference compilation: ${file}`);
   sourceHashes.set(file,sha256);
  }
  const outputs=[[base+'.json',JSON.stringify(pack,null,2)+'\n'],[base+'.md',markdown(pack)],...pack.examples.map(example=>[base+'/'+encodeURIComponent(example.name)+'.json',JSON.stringify(projectReference(pack,example.name),null,2)+'\n'])];
  pending.push(...outputs);
 }
 if(JSON.stringify(contractIds())!==JSON.stringify(allIds)||JSON.stringify(tokenFiles())!==JSON.stringify(initialTokenFiles))throw Error('source changed during whole reference compilation: authored directories');
 for(const [file,sha256] of sourceHashes)if(!fs.existsSync(path.join(root,file))||hash(fs.readFileSync(path.join(root,file)))!==sha256)throw Error(`source changed during whole reference compilation: ${file}`);
 for(const [file,content] of pending) {
   if(check) {if(!fs.existsSync(path.join(root,file))||read(root,file)!==content)throw Error(`${file}: stale, run npm run component:sync`);}
   else {fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});const destination=path.join(root,file), temporary=destination+`.tmp-${process.pid}`;try{fs.writeFileSync(temporary,content);fs.renameSync(temporary,destination);}finally{fs.rmSync(temporary,{force:true});}}
 }
 return ids;
}
if(require.main===module) {try {console.log(`Component references ${process.argv.includes('--check')?'checked':'compiled'}: ${compile(ROOT,process.argv.includes('--check')).join(', ')}`);} catch(e){console.error(e.message);process.exitCode=1;}}
function resolveUsage(pack,{intent,platform}) {
  if(platform!=='desktop')return {status:'unsupported',reason:'本批仅支持 desktop'};
  const matches=pack.examples.filter(e=>e.purpose===intent && e.publication?.newPages !== false);
  return matches.length===1 ? {status:'ready',variant:matches[0].name,example:matches[0],runtime:pack.runtime} : {status:'unsupported',reason:'没有唯一已验证变体，禁止猜测'};
}
module.exports={buildReference,projectReference,markdown,compile,resolveUsage};
