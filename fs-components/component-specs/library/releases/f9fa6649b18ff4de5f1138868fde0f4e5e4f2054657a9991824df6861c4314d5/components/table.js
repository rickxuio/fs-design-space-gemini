(() => {
  'use strict';
  const ROW_LIMIT = 6;
  const rowsFor = (root) => [...root.querySelectorAll('[data-table-row]')];

  function setExpanded(root, expanded) {
    const rows = rowsFor(root);
    rows.forEach((row, index) => { row.hidden = !expanded && index >= ROW_LIMIT; });
    const toggle = root.querySelector('[data-table-toggle]');
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.classList.toggle('ds-text-btn--hover', expanded);
    toggle.classList.toggle('ds-text-btn--expanded', expanded);
    const label = toggle.querySelector('[data-table-toggle-label]');
    if (label) label.textContent = expanded ? 'See less' : 'See more';
    toggle.hidden = rows.length <= ROW_LIMIT;
  }

  function syncScroll(root) {
    const scroll = root.querySelector('.ds-table__scroll');
    const controls = root.querySelector('[data-table-scroll-controls]');
    if (!scroll || !controls) return;
    const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
    controls.hidden = max <= 1;
    const prev = controls.querySelector('[data-table-scroll="prev"]');
    const next = controls.querySelector('[data-table-scroll="next"]');
    if (prev) prev.disabled = scroll.scrollLeft <= 1;
    if (next) next.disabled = scroll.scrollLeft >= max - 1;
  }

  function init(root) {
    setExpanded(root, false);
    const scroll = root.querySelector('.ds-table__scroll');
    if (scroll) scroll.addEventListener('scroll', () => syncScroll(root), { passive: true });
    requestAnimationFrame(() => syncScroll(root));
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-table-toggle]');
    if (toggle) {
      const root = toggle.closest('.ds-table');
      setExpanded(root, toggle.getAttribute('aria-expanded') !== 'true');
      return;
    }
    const control = event.target.closest('[data-table-scroll]');
    if (!control) return;
    const root = control.closest('.ds-table');
    const scroll = root && root.querySelector('.ds-table__scroll');
    if (!scroll) return;
    const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
    const direction = control.dataset.tableScroll === 'next' ? 1 : -1;
    const delta = Math.max(240, scroll.clientWidth * 0.7) * direction;
    scroll.scrollLeft = Math.min(max, Math.max(0, scroll.scrollLeft + delta));
    syncScroll(root);
  });

  const roots = () => [...document.querySelectorAll('.ds-table')];
  const start = () => {
    roots().forEach(init);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => syncScroll(entry.target));
      });
      roots().forEach((root) => observer.observe(root));
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
  window.addEventListener('resize', () => roots().forEach(syncScroll));
})();