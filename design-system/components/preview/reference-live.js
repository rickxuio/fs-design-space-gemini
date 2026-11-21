/* Component previews follow validated local publications. Historical pages never load this helper. */
(function () {
  const id=document.documentElement.dataset.componentReference;
  if(!id || !/^https?:$/.test(location.protocol))return;
  let signature=null,pending=false;
  function showStatus(state){
    let note=document.querySelector('[data-component-quality-status]');
    const title=document.querySelector('h1');if(!title)return;
    if(!note){note=document.createElement('p');note.setAttribute('data-component-quality-status','');note.style.cssText='font-size:13px;line-height:22px;color:#707070;margin:8px 0 24px;';title.insertAdjacentElement('afterend',note);}
    const engineering=state.engineering==='blocked'?'同步检查未通过，暂勿用于新页面':state.engineering==='current'?'工程验收通过':state.engineering==='stale'?'规范已更新，工程验收需重跑':'已纳入维护标准，待完成精确调用验收';
    note.textContent=engineering+' · '+(state.visual==='approved'?'视觉已确认':'视觉核对待确认');
  }
  async function check(){
    if(document.hidden || pending)return;pending=true;
    try{
      const response=await fetch('../quality/source-revisions.json',{cache:'no-store'});if(!response.ok)return;
      const state=(await response.json()).components?.[id];if(!state)return;
      const next=state.revision;
      if(signature!==null && signature!==next){location.reload();return;}
      signature=next;showStatus(state);
    }catch(_){/* Offline previews remain readable. Source and proof checks run before new-page use. */}
    finally{pending=false;}
  }
  check();setInterval(check,2000);
}());
