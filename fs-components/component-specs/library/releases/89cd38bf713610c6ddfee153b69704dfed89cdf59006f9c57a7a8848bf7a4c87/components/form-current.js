/* Finite local form assembly. Submit is intercepted; consumers own business validation/API. */
(function () {
  if (document.__fsFormCurrent) return;
  document.__fsFormCurrent = true;
  function init() {
    document.querySelectorAll('form.ds-form[data-form-current]').forEach(form => {
      if (form.dataset.formReady) return;
      form.dataset.formReady = 'true';
      // Source Checkbox rule excludes legal links from the label toggle hotspot.
      form.querySelectorAll('.ds-form__consent-copy a').forEach(link => {
        link.addEventListener('click', event => event.preventDefault());
      });
      if(form.hasAttribute('data-form-fields-source'))form.addEventListener('formdata', event => {
        form.querySelectorAll('.ds-form__field[data-form-field-name]').forEach(field=>{
          const selected=field.querySelector('.ds-select [role="option"][aria-selected="true"]');
          if(field.querySelector('.ds-select'))event.formData.append(field.dataset.formFieldName,selected?.dataset.value||'');
        });
      });
      form.addEventListener('submit', event => {
        // Respect cancellation already declared by host capture/validation listeners.
        if (event.defaultPrevented) return;
        event.preventDefault();
        const submitter = event.submitter || form.querySelector('button[type="submit"]');
        if (submitter && (!submitter.isConnected || submitter.matches(':disabled') || submitter.closest('[hidden], [aria-disabled="true"], fieldset:disabled'))) return;
        if(form.hasAttribute('data-form-fields-source')){
          const missing=[...form.querySelectorAll('.ds-form__field[data-form-required="true"]')].find(field=>field.querySelector('.ds-select')&&!field.querySelector('.ds-select [role="option"][aria-selected="true"]'));
          const status=form.querySelector('.ds-form__status');
          if(missing){if(status){status.hidden=false;status.setAttribute('data-form-invalid','');status.textContent='Please complete the required fields.';}missing.querySelector('button').focus();return;}
          if(status){status.hidden=true;status.removeAttribute('data-form-invalid');}
        }
        if (!form.checkValidity()) return;
        form.dispatchEvent(new CustomEvent('ds:form-submit', {bubbles:true, detail:{entries:[...new FormData(form).entries()]}}));
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
