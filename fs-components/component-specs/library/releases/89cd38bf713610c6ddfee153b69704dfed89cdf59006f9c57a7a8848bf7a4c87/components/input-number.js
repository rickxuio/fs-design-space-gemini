(function () {
  'use strict';

  function numberFrom(root, name, fallback) {
    var value = Number(root.dataset[name]);
    return Number.isInteger(value) ? value : fallback;
  }

  function initInputNumber(root) {
    if (root.dataset.inputNumberReady === 'true') return;

    var input = root.querySelector('.ds-input-number__input');
    var decrement = root.querySelector('[data-input-number-decrement]');
    var increment = root.querySelector('[data-input-number-increment]');
    if (!input || !decrement || !increment) return;

    var min = numberFrom(root, 'min', 1);
    var max = numberFrom(root, 'max', 9999);
    var step = Math.max(1, numberFrom(root, 'step', 1));
    if (max < min) max = min;

    function clamp(value) {
      return Math.min(max, Math.max(min, value));
    }

    function currentValue() {
      var value = Number.parseInt(input.value, 10);
      return Number.isFinite(value) ? clamp(value) : min;
    }

    function sync() {
      var value = currentValue();
      var locked = input.disabled || input.readOnly;
      decrement.disabled = locked || value <= min;
      increment.disabled = locked || value >= max;
      input.setAttribute('aria-valuemin', String(min));
      input.setAttribute('aria-valuemax', String(max));
      input.setAttribute('aria-valuenow', String(value));
      root.setAttribute('aria-disabled', input.disabled ? 'true' : 'false');
    }

    function commit(value, emit) {
      var next = clamp(value);
      var changed = input.value !== String(next);
      input.value = String(next);
      sync();
      if (emit && changed) {
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    function adjust(direction) {
      if (input.disabled || input.readOnly) return;
      commit(currentValue() + direction * step, true);
    }

    root.dataset.inputNumberReady = 'true';
    input.setAttribute('role', 'spinbutton');
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('autocomplete', 'off');
    decrement.setAttribute('aria-label', decrement.getAttribute('aria-label') || 'Decrease value');
    increment.setAttribute('aria-label', increment.getAttribute('aria-label') || 'Increase value');

    decrement.addEventListener('click', function () { adjust(-1); });
    increment.addEventListener('click', function () { adjust(1); });
    input.addEventListener('focus', function () { input.select(); });
    input.addEventListener('input', function () {
      input.value = input.value.replace(/\D/g, '');
      sync();
    });
    input.addEventListener('blur', function () { commit(currentValue(), false); });
    input.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      event.preventDefault();
      adjust(event.key === 'ArrowUp' ? 1 : -1);
    });

    commit(currentValue(), false);
  }

  function init() {
    document.querySelectorAll('[data-input-number]').forEach(initInputNumber);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
