(function () {
  'use strict';

  function syncPressedState(tag) {
    var checked = tag.classList.contains('ds-tag--checked');
    tag.setAttribute('aria-pressed', String(checked));
  }

  function initialize(root) {
    root.querySelectorAll('button.ds-tag--selectable').forEach(syncPressedState);
  }

  document.addEventListener('click', function (event) {
    var tag = event.target.closest('button.ds-tag--selectable');
    if (!tag || tag.disabled) return;

    tag.classList.toggle('ds-tag--checked');
    syncPressedState(tag);
    tag.dispatchEvent(new CustomEvent('ds:tag-change', {
      bubbles: true,
      detail: { checked: tag.classList.contains('ds-tag--checked') }
    }));
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initialize(document); });
  } else {
    initialize(document);
  }
}());
