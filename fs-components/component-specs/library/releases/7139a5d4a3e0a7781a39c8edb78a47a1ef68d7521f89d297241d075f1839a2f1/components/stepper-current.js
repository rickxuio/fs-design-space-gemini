(function () {
  'use strict';
  if (document.__fsStepperCurrent) return;
  document.__fsStepperCurrent = true;
  var ownedPendingDisabled = new WeakSet();
  var availableThrough = new WeakMap();
  function pendingLocked(item) {
    return !!item.closest('[data-stepper-current="solution-completed-only"]') && item.classList.contains('ds-stepper__item--pending');
  }
  function unavailable(item) {
    return pendingLocked(item) || !item.isConnected || item.matches(':disabled') || !!item.closest('[hidden], [aria-disabled="true"], fieldset:disabled');
  }
  function syncTabstop(items) {
    var target = items.find(function (item) { return !unavailable(item) && item.classList.contains('ds-stepper__item--current'); }) || items.find(function (item) { return !unavailable(item); });
    items.forEach(function (item) { item.tabIndex = item === target ? 0 : -1; });
  }

  function setActiveStep(root, activeIndex) {
    var items = Array.from(root.querySelectorAll('[data-stepper-item]'));

    items.forEach(function (item, index) {
      var marker = item.querySelector('.ds-stepper__marker');
      var state = index === activeIndex ? 'current' : index < activeIndex || index <= (availableThrough.get(root) || 0) ? 'completed' : 'pending';

      item.classList.toggle('ds-stepper__item--completed', state === 'completed');
      item.classList.toggle('ds-stepper__item--current', state === 'current');
      item.classList.toggle('ds-stepper__item--pending', state === 'pending');
      if (root.dataset.stepperCurrent === 'solution-completed-only') {
        if (state === 'pending' && item.getAttribute('aria-disabled') !== 'true') {
          item.setAttribute('aria-disabled', 'true');
          ownedPendingDisabled.add(item);
        } else if (state !== 'pending' && ownedPendingDisabled.has(item)) {
          if (item.getAttribute('aria-disabled') === 'true') item.removeAttribute('aria-disabled');
          ownedPendingDisabled.delete(item);
        }
      }
      item.tabIndex = index === activeIndex ? 0 : -1;
      item.setAttribute('aria-current', state === 'current' ? 'step' : 'false');
      item.setAttribute('aria-label', 'Step ' + (index + 1) + ', ' + state);

      if (marker) {
        marker.textContent = state === 'completed' ? '' : String(index + 1);
        marker.setAttribute('aria-hidden', 'true');
      }
    });
    syncTabstop(items);
  }

  function initStepper(root) {
    if (root.dataset.stepperInteractive === 'true' || root.classList.contains('ds-stepper--circle-order')) return;

    var items = Array.from(root.querySelectorAll('[data-stepper-item]'));
    if (!items.length) return;

    root.dataset.stepperInteractive = 'true';
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', root.getAttribute('aria-label') || 'Step progress');

    var initialIndex = items.findIndex(function (item) {
      return item.classList.contains('ds-stepper__item--current');
    });
    availableThrough.set(root, Math.max(0, initialIndex));
    setActiveStep(root, initialIndex < 0 ? 0 : initialIndex);

    items.forEach(function (item, index) {
      item.setAttribute('role', 'button');
      item.addEventListener('click', function () {
        if (unavailable(item)) return;
        setActiveStep(root, index);
        item.focus();
      });
      item.addEventListener('keydown', function (event) {
        if (unavailable(item) || event.isComposing) return;
        var enabled = items.filter(function (candidate) { return !unavailable(candidate); });
        var enabledIndex = enabled.indexOf(item), nextIndex;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          item.click();
          return;
        }
        if (event.key === 'ArrowRight') nextIndex = (enabledIndex + 1) % enabled.length;
        else if (event.key === 'ArrowLeft') nextIndex = (enabledIndex - 1 + enabled.length) % enabled.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = enabled.length - 1;
        else return;

        event.preventDefault();
        setActiveStep(root, items.indexOf(enabled[nextIndex]));
        enabled[nextIndex].focus();
      });
    });
    new MutationObserver(function () { syncTabstop(items); }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['hidden', 'disabled', 'aria-disabled'] });
  }

  function init() {
    document.querySelectorAll('.ds-stepper--circle-centered[data-stepper-interactive], .ds-stepper--circle-order[data-stepper-interactive]').forEach(initStepper);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
