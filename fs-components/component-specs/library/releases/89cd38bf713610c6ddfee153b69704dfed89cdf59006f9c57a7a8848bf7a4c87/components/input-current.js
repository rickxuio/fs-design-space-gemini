/* Native basic text fields and finite current PC Form textarea. No business validation. */
(() => {
  'use strict';
  if (document.__fsInputCurrent) return;
  document.__fsInputCurrent = true;
  const fieldSelector = '.ds-input-field[data-input-current]';
  function update(field) {
    const input = field.querySelector('input.ds-input-field__input, textarea.ds-input-field__input');
    const error = field.querySelector('.ds-input-field__error');
    if (!input) return;
    if (field.dataset.inputKind === 'textarea') {
      const count = field.querySelector('.ds-input-field__count');
      if (count && input.maxLength === 5000) {
        const text = input.value.length + '/5000';
        if (count.textContent !== text) count.textContent = text;
      }
    }
    const disabled = input.matches(':disabled');
    const invalid = !disabled && input.getAttribute('aria-invalid') === 'true';
    const focused = document.activeElement === input;
    // Focus changes the visual state; validation remains declared by the host.
    field.dataset.inputState = disabled ? 'disabled' : focused ? (input.value ? 'inputting' : 'activated') : invalid ? 'error' : input.value ? 'filled' : 'default';
    if (error) {
      error.hidden = !invalid;
      const ids = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      if (invalid && error.id) ids.add(error.id); else ids.delete(error.id);
      if (ids.size) input.setAttribute('aria-describedby', [...ids].join(' ')); else input.removeAttribute('aria-describedby');
    }
  }
  function init() { document.querySelectorAll(fieldSelector).forEach(update); }
  for (const event of ['focusin', 'focusout', 'input', 'change']) document.addEventListener(event, e => {
    const field = e.target.closest?.(fieldSelector);
    if (field) update(field);
  }, event === 'input' || event === 'change');
  document.addEventListener('reset', () => queueMicrotask(init));
  new MutationObserver(init).observe(document.documentElement, {subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'aria-invalid', 'value']});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true}); else init();
})();
