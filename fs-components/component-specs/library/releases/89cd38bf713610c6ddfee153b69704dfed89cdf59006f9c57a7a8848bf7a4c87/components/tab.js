/* Current reusable Tab runtime. Historical page inline scripts stay unchanged. */
(function () {
  'use strict';
  if (document.__fsTabRuntime) return;
  document.__fsTabRuntime = true;
  function unavailable(item) {
    return !item.isConnected || item.matches(':disabled') || !!item.closest('[hidden], [aria-disabled="true"], fieldset:disabled');
  }
  function initializeGroup(group) {
    if (group.dataset.tabReady === 'true') return;
    var items = Array.from(group.querySelectorAll('[data-tab-item]'));
    if (!items.length) return;
    group.dataset.tabReady = 'true';
    group.setAttribute('role', 'tablist');
    function ensureInner(item) {
      var inner = item.querySelector('.ds-tab__item-inner');
      if (!inner) {
        inner = document.createElement('div');
        inner.className = 'ds-tab__item-inner';
        var text = item.querySelector('.ds-tab__item-text');
        if (text) { item.removeChild(text); inner.appendChild(text); }
        item.appendChild(inner);
      }
      return inner;
    }
    items.forEach(ensureInner);
    function syncTabstop() {
      var target = items.find(function (item) { return !unavailable(item) && item.classList.contains('ds-tab__item--active'); }) || items.find(function (item) { return !unavailable(item); });
      items.forEach(function (item) { item.tabIndex = item === target ? 0 : -1; });
    }
    function selectItem(selected, moveFocus) {
      items.forEach(function (item) {
        var active = item === selected;
        item.classList.toggle('ds-tab__item--active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        item.querySelectorAll('.ds-tab__indicator').forEach(function (node) { node.remove(); });
      });
      var indicator = document.createElement('div');
      indicator.className = 'ds-tab__indicator';
      ensureInner(selected).appendChild(indicator);
      syncTabstop();
      if (moveFocus) selected.focus({ preventScroll: true });
    }
    items.forEach(function (item, index) {
      item.setAttribute('role', 'tab');
      item.addEventListener('click', function (event) { if (!event.defaultPrevented && !unavailable(item)) selectItem(item, false); });
      item.addEventListener('keydown', function (event) {
        if (event.defaultPrevented || unavailable(item) || event.isComposing) return;
        var enabled = items.filter(function (candidate) { return !unavailable(candidate); });
        var enabledIndex = enabled.indexOf(item);
        var targetIndex;
        if (event.key === 'ArrowRight') targetIndex = (enabledIndex + 1) % enabled.length;
        else if (event.key === 'ArrowLeft') targetIndex = (enabledIndex - 1 + enabled.length) % enabled.length;
        else if (event.key === 'Home') targetIndex = 0;
        else if (event.key === 'End') targetIndex = enabled.length - 1;
        else if (event.key === 'Enter' || event.key === ' ') targetIndex = enabledIndex;
        else return;
        // Also consume Home/End when already at the boundary.
        event.preventDefault();
        selectItem(enabled[targetIndex], true);
      });
    });
    selectItem(items.find(function (item) { return item.classList.contains('ds-tab__item--active'); }) || items[0], false);
    new MutationObserver(syncTabstop).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['hidden', 'disabled', 'aria-disabled'] });
  }
  function initialize() {
    document.querySelectorAll('[data-tab-group]').forEach(initializeGroup);
    // Preserve existing Preview All display; not a complete menu/overflow API.
    document.querySelectorAll('[data-all-toggle]').forEach(function (button) {
      if (button.dataset.tabAllReady === 'true') return;
      button.dataset.tabAllReady = 'true';
      button.addEventListener('click', function (event) {
        if (unavailable(button)) return;
        event.stopPropagation();
        var dropdown = button.parentElement.querySelector('[data-all-dropdown]');
        if (dropdown) dropdown.classList.toggle('ds-tab__all-dropdown--open');
      });
    });
  }
  document.addEventListener('click', function () {
    document.querySelectorAll('.ds-tab__all-dropdown--open').forEach(function (node) { node.classList.remove('ds-tab__all-dropdown--open'); });
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
