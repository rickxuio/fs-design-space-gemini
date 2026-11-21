'use strict';
// Component-owned disclosure adaptation. One DOM preserves content and values.
(function () {
  function init(root = document) {
    for (const header of root.querySelectorAll('.ds-nav-header--responsive')) {
      if (header.dataset.responsiveBound) continue;
      header.dataset.responsiveBound = 'true';
      const toggle = header.querySelector('.ds-nav-header__menu-toggle');
      const compact = matchMedia('(max-width: 1248px)');
      function open(value, focus = false) {
        header.dataset.menuOpen = String(value);
        toggle.setAttribute('aria-expanded', String(value));
        toggle.setAttribute('aria-label', value ? 'Close navigation' : 'Open navigation');
        if (focus) toggle.focus();
      }
      toggle.addEventListener('click', () => open(header.dataset.menuOpen !== 'true'));
      header.addEventListener('keydown', event => { if (event.key === 'Escape') open(false, compact.matches); });
      document.addEventListener('click', event => { if (!header.contains(event.target)) open(false); });
      compact.addEventListener('change', () => open(false));
      open(false);
    }
    for (const footer of root.querySelectorAll('.ds-nav-footer--responsive')) {
      if (footer.dataset.responsiveBound) continue;
      footer.dataset.responsiveBound = 'true';
      const mobile = matchMedia('(max-width: 640px)');
      const items = [...footer.querySelectorAll('.ds-nav-footer__col')];
      function sync() {
        for (const item of items) {
          const button = item.querySelector('.ds-nav-footer__disclosure');
          button.tabIndex = mobile.matches ? 0 : -1;
          button.disabled = !mobile.matches;
          button.setAttribute('aria-expanded', String(!mobile.matches || item.dataset.expanded === 'true'));
        }
      }
      for (const item of items) item.querySelector('.ds-nav-footer__disclosure').addEventListener('click', () => {
        if (!mobile.matches) return;
        item.dataset.expanded = String(item.dataset.expanded !== 'true');
        sync();
      });
      mobile.addEventListener('change', sync);
      sync();
    }
  }
  if (typeof window !== 'undefined') window.FSNavigationResponsive = { init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
