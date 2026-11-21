/* Opt-in finite LTR matrix scrolling only. Legacy table.js/disclosure is unchanged. */
(() => {
  'use strict';
  if (document.__fsTableCurrentReady) return;
  document.__fsTableCurrentReady = true;
  const roots = () => [...document.querySelectorAll('.ds-table--matrix[data-table-current]')];
  function sync(root) {
    const scroll = root.querySelector(':scope > .ds-table__scroll');
    const controls = root.querySelector(':scope > [data-table-scroll-controls]');
    if (!scroll || !controls) return;
    const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
    scroll.scrollLeft = Math.min(max, Math.max(0, scroll.scrollLeft));
    controls.hidden = max <= 1;
    controls.querySelector('[data-table-scroll="prev"]').disabled = scroll.scrollLeft <= 1;
    controls.querySelector('[data-table-scroll="next"]').disabled = scroll.scrollLeft >= max - 1;
  }
  function initialize(root) {
    if (root.dataset.tableCurrentReady === 'true') return;
    const scroll = root.querySelector(':scope > .ds-table__scroll');
    const controls = root.querySelector(':scope > [data-table-scroll-controls]');
    if (!scroll || !controls || !controls.querySelector('[data-table-scroll="prev"]') || !controls.querySelector('[data-table-scroll="next"]')) return;
    root.dataset.tableCurrentReady = 'true';
    controls.addEventListener('click', event => {
      if (event.defaultPrevented) return;
      const button = event.target.closest('button[data-table-scroll]');
      if (!button || !controls.contains(button) || controls.hidden || button.matches(':disabled') || button.closest('[hidden],[aria-disabled="true"]')) return;
      const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
      const delta = Math.max(240, scroll.clientWidth * 0.7) * (button.dataset.tableScroll === 'next' ? 1 : -1);
      scroll.scrollLeft = Math.min(max, Math.max(0, scroll.scrollLeft + delta));
      sync(root);
    });
    scroll.addEventListener('scroll', () => sync(root), { passive: true });
    sync(root);
    if ('ResizeObserver' in window) new ResizeObserver(() => sync(root)).observe(scroll);
  }
  const start = () => roots().forEach(initialize);
  window.addEventListener('resize', () => roots().forEach(sync));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
