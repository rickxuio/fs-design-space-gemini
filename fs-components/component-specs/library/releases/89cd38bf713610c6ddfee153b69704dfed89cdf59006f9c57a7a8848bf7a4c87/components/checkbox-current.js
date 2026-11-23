(function () {
  'use strict';
  if (document.__fsCheckboxCurrentReady) return;
  document.__fsCheckboxCurrentReady = true;
  var CONTROL = '.ds-checkbox[data-checkbox-current][data-checkbox-control]';
  var initialMixed = new WeakMap();

  function ownedInput(root) {
    var input = root.querySelector('input.ds-checkbox__input[type="checkbox"]');
    return input && input.parentElement === root ? input : null;
  }
  function initialize(root) {
    var controls = [];
    if (root.matches && root.matches(CONTROL)) controls.push(root);
    if (root.querySelectorAll) controls = controls.concat(Array.prototype.slice.call(root.querySelectorAll(CONTROL)));
    controls.forEach(function (control) {
      var input = ownedInput(control);
      if (!input || initialMixed.has(input)) return;
      var mixed = input.hasAttribute('data-checkbox-initial-mixed');
      initialMixed.set(input, mixed);
      input.indeterminate = mixed;
    });
  }
  // A display-only legal link is excluded from native label activation.
  function consentLink(event) {
    var link = event.target.closest && event.target.closest('a');
    var control = link && link.closest(CONTROL + '[data-checkbox-caption="consent"]');
    var caption = control && control.querySelector('.ds-checkbox__label');
    if (!caption || !caption.contains(link)) return;
    if (event.type === 'click' || event.key === 'Enter' || event.key === ' ') event.preventDefault();
  }
  document.addEventListener('click', consentLink);
  document.addEventListener('keydown', consentLink);
  // Checked/disabled and native activation belong to the input. No parallel
  // class-based selected state, synthetic keyboard toggle or host event is added.
  document.addEventListener('reset', function (event) {
    var form = event.target;
    if (!form || form.tagName !== 'FORM') return;
    queueMicrotask(function () {
      if (event.defaultPrevented) return;
      document.querySelectorAll(CONTROL).forEach(function (control) {
        var input = ownedInput(control);
        if (input && input.form === form && initialMixed.has(input)) {
          input.indeterminate = initialMixed.get(input);
        }
      });
    });
  });
  new MutationObserver(function (records) {
    records.forEach(function (record) {
      Array.prototype.forEach.call(record.addedNodes, function (node) {
        if (node.nodeType === 1) initialize(node);
      });
    });
  }).observe(document.documentElement, {childList:true, subtree:true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initialize(document); });
  else initialize(document);
}());
