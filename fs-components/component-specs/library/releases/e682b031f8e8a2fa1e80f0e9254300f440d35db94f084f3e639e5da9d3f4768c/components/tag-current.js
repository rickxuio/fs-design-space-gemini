(function () {
  'use strict';
  if (document.__fsTagCurrent) return;
  document.__fsTagCurrent = true;

  function syncPressedState(tag) {
    var checked = tag.classList.contains('ds-tag--checked');
    tag.setAttribute('aria-pressed', String(checked));
  }

  function initialize(root) {
    root.querySelectorAll('button.ds-tag--selectable[data-tag-current]').forEach(syncPressedState);
  }

  document.addEventListener('click', function (event) {
    var tag = event.target.closest('button.ds-tag--selectable[data-tag-current]');
    if (event.defaultPrevented || !tag || tag.matches(':disabled') || tag.closest('[hidden],[aria-disabled="true"]') || tag.closest('.ds-select') || tag.hasAttribute('data-select-remove')) return;

    if (tag.matches('.ds-tag--filter[data-tag-close="event"]') && event.target.closest('.ds-tag__close')) {
      event.preventDefault();
      requestClose(tag);
      return;
    }

    tag.classList.toggle('ds-tag--checked');
    syncPressedState(tag);
    tag.dispatchEvent(new CustomEvent('ds:tag-change', {
      bubbles: true,
      detail: { checked: tag.classList.contains('ds-tag--checked') }
    }));
  });

  function requestClose(tag) {
    tag.dispatchEvent(new CustomEvent('ds:tag-close', {
      bubbles: true,
      cancelable: true,
      detail: { checked: tag.classList.contains('ds-tag--checked') }
    }));
  }

  document.addEventListener('keydown', function (event) {
    if (event.defaultPrevented || event.isComposing || event.repeat || event.ctrlKey || event.metaKey || event.altKey || !['Delete', 'Backspace'].includes(event.key)) return;
    var tag = event.target.closest('button.ds-tag--filter[data-tag-current][data-tag-close="event"]');
    if (!tag || tag.matches(':disabled') || tag.closest('[hidden],[aria-disabled="true"]') || tag.closest('.ds-select') || tag.hasAttribute('data-select-remove')) return;
    event.preventDefault();
    requestClose(tag);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initialize(document); });
  } else {
    initialize(document);
  }
}());
