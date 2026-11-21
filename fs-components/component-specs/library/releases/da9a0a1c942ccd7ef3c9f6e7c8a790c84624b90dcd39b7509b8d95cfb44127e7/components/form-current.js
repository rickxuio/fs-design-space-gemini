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
      form.addEventListener('submit', event => {
        // Respect cancellation already declared by host capture/validation listeners.
        if (event.defaultPrevented) return;
        event.preventDefault();
        const submitter = event.submitter || form.querySelector('button[type="submit"]');
        if (submitter && (!submitter.isConnected || submitter.matches(':disabled') || submitter.closest('[hidden], [aria-disabled="true"], fieldset:disabled'))) return;
        if (!form.checkValidity()) return;
        form.dispatchEvent(new CustomEvent('ds:form-submit', {bubbles:true, detail:{entries:[...new FormData(form).entries()]}}));
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
