(function () {
  'use strict';
  if (document.__fsTagProductCurrent) return;
  document.__fsTagProductCurrent = true;
  var selector = 'button.ds-tag--product-small[data-tag-product="current"]';

  function renderColor(tag) {
    var color = tag.getAttribute('data-tag-color');
    var chip = tag.querySelector(':scope > .ds-tag__product-chip');
    if (chip && /^#[0-9a-f]{6}$/i.test(color || '')) chip.style.backgroundColor = color;
  }

  function initialize(root) {
    root.querySelectorAll(selector + '.ds-tag--product-color').forEach(renderColor);
  }

  document.addEventListener('click', function (event) {
    var tag = event.target.closest(selector);
    if (event.defaultPrevented || !tag || tag.matches(':disabled') || tag.closest('[hidden],[aria-disabled="true"],.ds-select') || tag.hasAttribute('data-tag-static')) return;
    renderColor(tag);
    if (tag.classList.contains('ds-tag--product-custom') || tag.getAttribute('data-tag-action') === 'host') {
      // The host supplies any customization action; no invented route/dialog.
      tag.dispatchEvent(new CustomEvent('ds:tag-activate', { bubbles: true, cancelable: true }));
      return;
    }
    var checked = tag.getAttribute('aria-pressed') !== 'true';
    tag.setAttribute('aria-pressed', String(checked));
    tag.dispatchEvent(new CustomEvent('ds:tag-change', { bubbles: true, detail: { checked: checked } }));
  });

  // Dynamic source calls and colour-content edits use the same finite marker.
  var observer = new MutationObserver(function (records) {
    records.forEach(function (record) {
      if (record.type === 'attributes') renderColor(record.target);
      else record.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        if (node.matches(selector + '.ds-tag--product-color')) renderColor(node);
        initialize(node);
      });
    });
  });
  function start() {
    initialize(document);
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-tag-color'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}());
