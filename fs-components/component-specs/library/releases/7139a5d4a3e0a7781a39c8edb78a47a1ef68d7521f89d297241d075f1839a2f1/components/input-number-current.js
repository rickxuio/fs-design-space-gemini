(function () {
  'use strict';
  if (document.__fsInputNumberCurrent) return;
  document.__fsInputNumberCurrent = true;

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

    var composing = false;
    function isDisabled() { return input.matches(':disabled') || !!input.closest('[hidden]') || input.getAttribute('aria-disabled') === 'true' || !!root.parentElement?.closest('[aria-disabled="true"]'); }
    function isLocked() { return isDisabled() || input.readOnly; }

    function clamp(value) {
      return Math.min(max, Math.max(min, value));
    }

    function currentValue() {
      var value = Number.parseInt(input.value, 10);
      // An overflowing positive digit sequence still exceeds the upper bound.
      return Number.isNaN(value) ? min : clamp(value);
    }

    function sync() {
      var value = currentValue();
      var locked = isLocked();
      decrement.disabled = locked || value <= min;
      increment.disabled = locked || value >= max;
      input.setAttribute('aria-valuemin', String(min));
      input.setAttribute('aria-valuemax', String(max));
      input.setAttribute('aria-valuenow', String(value));
      var disabled = String(isDisabled());
      if (root.getAttribute('aria-disabled') !== disabled) root.setAttribute('aria-disabled', disabled);
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
      if (composing) return;
      if (isLocked()) { sync(); return; }
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
    input.addEventListener('compositionstart', function () { composing = true; });
    input.addEventListener('compositionend', function () {
      composing = false;
      if (!isLocked()) { input.value = input.value.replace(/\D/g, ''); sync(); }
    });
    input.addEventListener('input', function (event) {
      if (composing || event.isComposing) return;
      if (isLocked()) { sync(); return; }
      input.value = input.value.replace(/\D/g, '');
      sync();
    });
    // Normalize at the input before a host reads the bubbling change event.
    input.addEventListener('change', function () { if (!isLocked() && !composing) commit(currentValue(), false); });
    input.addEventListener('blur', function () { if (!isLocked() && !composing) commit(currentValue(), false); });
    input.addEventListener('keydown', function (event) {
      if (composing || event.isComposing || event.keyCode === 229) return;
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
      if (isLocked()) { sync(); return; }
      event.preventDefault();
      adjust(event.key === 'ArrowUp' ? 1 : -1);
    });

    commit(currentValue(), false);
    // Native reset restores values after reset listeners have run. Refresh our
    // derived state afterward, respecting cancellation and actual form ownership.
    document.addEventListener('reset', function (event) {
      if (event.target.tagName !== 'FORM' || input.form !== event.target) return;
      queueMicrotask(function () {
        if (!event.defaultPrevented && input.form === event.target) commit(currentValue(), false);
      });
    });
    new MutationObserver(function (records) {
      if (records.some(function (record) {
        return record.target === input || record.target === root || record.target.contains(root);
      })) sync();
    }).observe(document.documentElement, {subtree:true, attributes:true, attributeFilter:['disabled','readonly','hidden','aria-disabled']});
  }

  function init() {
    document.querySelectorAll('[data-input-number][data-input-number-current]').forEach(initInputNumber);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
