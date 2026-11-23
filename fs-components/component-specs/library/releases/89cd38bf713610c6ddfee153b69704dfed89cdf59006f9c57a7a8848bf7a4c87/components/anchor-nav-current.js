/* Current finite div-tab selection; page-specific scroll belongs to the Plan. */
(function () {
  'use strict';
  if (document.__fsAnchorNavCurrentReady) return;
  document.__fsAnchorNavCurrentReady = true;
  const ROOT = '[data-anchor-group][data-anchor-current]';
  document.addEventListener('click', function (event) {
    const tab = event.target.closest('div.ds-anchor-nav__tab[data-anchor-tab]');
    if (!tab || tab.closest('[hidden],[aria-disabled="true"]')) return;
    const root = tab.closest('[data-anchor-group]');
    if (!root || !root.matches(ROOT)) return;
    root.querySelectorAll('div.ds-anchor-nav__tab[data-anchor-tab]').forEach(function (item) {
      if (item.closest('[data-anchor-group]') === root) item.classList.toggle('ds-anchor-nav__tab--active', item === tab);
    });
  });
}());
