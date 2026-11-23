(function () {
  'use strict';
  function initialize() {
    document.querySelectorAll('[data-anchor-group]').forEach(function (nav) {
      if (nav.dataset.anchorNavReady === 'true') return;
      nav.dataset.anchorNavReady = 'true';
      nav.querySelectorAll('[data-anchor-tab]').forEach(function (tab) {
        tab.addEventListener('click', function () {
          nav.querySelectorAll('[data-anchor-tab]').forEach(function (item) {
            item.classList.remove('ds-anchor-nav__tab--active');
          });
          tab.classList.add('ds-anchor-nav__tab--active');
        });
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
}());
