(function () {
  'use strict';

  function setActiveStep(root, activeIndex) {
    var items = Array.from(root.querySelectorAll('[data-stepper-item]'));

    items.forEach(function (item, index) {
      var marker = item.querySelector('.ds-stepper__marker');
      var state = index < activeIndex ? 'completed' : index === activeIndex ? 'current' : 'pending';

      item.classList.toggle('ds-stepper__item--completed', state === 'completed');
      item.classList.toggle('ds-stepper__item--current', state === 'current');
      item.tabIndex = index === activeIndex ? 0 : -1;
      item.setAttribute('aria-current', state === 'current' ? 'step' : 'false');
      item.setAttribute('aria-label', 'Step ' + (index + 1) + ', ' + state);

      if (marker) {
        marker.textContent = state === 'completed' ? '' : String(index + 1);
        marker.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function initStepper(root) {
    if (root.dataset.stepperInteractive === 'true') return;

    var items = Array.from(root.querySelectorAll('[data-stepper-item]'));
    if (!items.length) return;

    root.dataset.stepperInteractive = 'true';
    root.setAttribute('role', 'group');
    root.setAttribute('aria-label', root.getAttribute('aria-label') || 'Step progress');

    var initialIndex = items.findIndex(function (item) {
      return item.classList.contains('ds-stepper__item--current');
    });
    setActiveStep(root, initialIndex < 0 ? 0 : initialIndex);

    items.forEach(function (item, index) {
      item.setAttribute('role', 'button');
      item.addEventListener('click', function () {
        setActiveStep(root, index);
        item.focus();
      });
      item.addEventListener('keydown', function (event) {
        var nextIndex = index;

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          item.click();
          return;
        }
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % items.length;
        else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + items.length) % items.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = items.length - 1;
        else return;

        event.preventDefault();
        setActiveStep(root, nextIndex);
        items[nextIndex].focus();
      });
    });
  }

  function init() {
    document.querySelectorAll('.ds-stepper--circle-centered[data-stepper-interactive], .ds-stepper--circle-order[data-stepper-interactive]').forEach(initStepper);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
