/* Preview-only edit disclosure. No save, validation or remote persistence. */
(() => {
  if (document.__fsCollapseHostPreview) return;
  document.__fsCollapseHostPreview = true;
  const selector = '.ds-collapse--inline-edit[data-collapse-host-preview],.ds-collapse--inline-edit[data-collapse-edit-current]';
  const drafts = new WeakMap();
  const composingInputs = new WeakSet();
  function parts(item) { return {control:item.querySelector('button[data-collapse-edit]'),panel:item.querySelector('.ds-collapse__edit-panel'),inputs:[...item.querySelectorAll('input.ds-input-field__input')]}; }
  function paired(p) { return p&&p.control&&p.panel&&p.panel.id&&p.control.getAttribute('aria-controls')===p.panel.id&&[...document.querySelectorAll('[id]')].filter(node=>node.id===p.panel.id).length===1; }
  function close(item,focus) {
    const p=parts(item),values=drafts.get(item);
    p.inputs.forEach(input=>composingInputs.delete(input));
    if(values) p.inputs.forEach((input,i)=>{input.value=values[i];input.dispatchEvent(new Event('input',{bubbles:true}));});
    drafts.delete(item);item.classList.remove('ds-collapse__item--open');p.panel.hidden=true;p.panel.setAttribute('aria-hidden','true');p.control.setAttribute('aria-expanded','false');
    if(focus) p.control.focus();
  }
  function available(control) { return !control.matches(':disabled')&&!control.closest('[hidden],[aria-disabled="true"]'); }
  document.addEventListener('click',event=>{
    const orderToggle=event.target.closest('button.ds-collapse__order-toggle');
    if(orderToggle&&orderToggle.closest('[data-collapse-order-preview]')) {
      if(!available(orderToggle))return;
      const item=orderToggle.closest('.ds-collapse__item'),body=item.querySelector('.ds-collapse__body');
      if(!body||body.id!==orderToggle.getAttribute('aria-controls'))return;
      const open=orderToggle.getAttribute('aria-expanded')!=='true';
      item.classList.toggle('ds-collapse__item--open',open);body.hidden=!open;body.setAttribute('aria-hidden',String(!open));orderToggle.setAttribute('aria-expanded',String(open));orderToggle.setAttribute('aria-label',(open?'收起':'展开')+'订单 FS191011177503 的预览');
      return;
    }
    const group=event.target.closest(selector);if(!group)return;
    const item=event.target.closest('.ds-collapse__item'),p=item&&parts(item);if(!paired(p))return;
    const edit=event.target.closest('button[data-collapse-edit]'),cancel=event.target.closest('[data-collapse-cancel]');
    if(cancel){if(available(cancel))close(item,true);return;}
    if(!edit||!available(edit))return;
    if(!p.panel.hidden){close(item,true);return;}
    group.querySelectorAll('.ds-collapse__item--open').forEach(peer=>{if(paired(parts(peer)))close(peer,false);});
    drafts.set(item,p.inputs.map(input=>input.value));item.classList.add('ds-collapse__item--open');p.panel.hidden=false;p.panel.setAttribute('aria-hidden','false');p.control.setAttribute('aria-expanded','true');p.inputs.find(input=>!input.matches(':disabled'))?.focus();
  });
  document.addEventListener('submit',event=>{const panel=event.target;if(!panel.matches('form.ds-collapse__edit-panel')||!panel.closest('[data-collapse-edit-current]'))return;event.preventDefault();const item=panel.closest('.ds-collapse__item'),p=parts(item);if(!paired(p)||panel.hidden||!available(p.control)||p.inputs.some(input=>input.matches(':disabled')||composingInputs.has(input)))return;if(!panel.checkValidity()){panel.reportValidity();return;}const detail={field:item.dataset.collapseField,values:Object.fromEntries(p.inputs.map(input=>[input.name,input.value]))};if(!item.dispatchEvent(new CustomEvent('ds:collapse-save',{bubbles:true,cancelable:true,detail})))return;item.querySelector('.ds-collapse__value').textContent=p.inputs.map(input=>input.value).join(', ');for(const input of p.inputs)input.setAttribute('value',input.value);drafts.delete(item);close(item,true);});
  document.addEventListener('compositionstart',event=>{
    if(event.target.matches('input.ds-input-field__input')&&event.target.closest(selector))composingInputs.add(event.target);
  });
  document.addEventListener('compositionend',event=>composingInputs.delete(event.target));
  document.addEventListener('keydown',event=>{
    // Escape may dismiss an IME candidate or be consumed by a child control.
    // The host must not turn that action into a draft rollback.
    if(event.key!=='Escape'||event.defaultPrevented||event.isComposing||composingInputs.has(event.target)||!event.target.closest(selector))return;
    const item=event.target.closest('.ds-collapse__item'),p=item&&parts(item);if(!paired(p)||p.panel.hidden||!available(p.control))return;
    event.preventDefault();close(item,true);
  });
})();
