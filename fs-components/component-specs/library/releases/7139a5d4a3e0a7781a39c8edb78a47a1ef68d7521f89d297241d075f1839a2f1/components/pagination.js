/* Current reusable Pagination runtime. */
(function () {
  'use strict';
  if (document.__fsPaginationRuntime) return;
  document.__fsPaginationRuntime = true;

  function initPagination(nav) {
    if (nav.dataset.paginationReady === 'true') return;
    nav.dataset.paginationReady = 'true';

    function getNumButtons() {
      return Array.from(nav.querySelectorAll('button.ds-pagination__btn[data-page-num]'));
    }

    function getCurrentPage() {
      var active = nav.querySelector('button.ds-pagination__btn--active[data-page-num]');
      if (active) return Number(active.getAttribute('data-page-num')) || 1;
      var nums = getNumButtons();
      return nums.length ? Number(nums[0].getAttribute('data-page-num')) || 1 : 1;
    }

    function syncNavState(currentPage) {
      var nums = getNumButtons();
      var pages = nums.map(function (b) { return Number(b.getAttribute('data-page-num')) || 0; }).filter(Boolean);
      var minPage = pages.length ? Math.min.apply(null, pages) : 1;
      var maxPage = pages.length ? Math.max.apply(null, pages) : 1;

      nums.forEach(function (btn) {
        var num = Number(btn.getAttribute('data-page-num')) || 0;
        var isActive = num === currentPage;
        btn.classList.toggle('ds-pagination__btn--active', isActive);
        if (isActive) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
      });

      var prevBtn = nav.querySelector('button.ds-pagination__btn[data-page-nav="prev"]');
      var nextBtn = nav.querySelector('button.ds-pagination__btn[data-page-nav="next"]');
      if (prevBtn) prevBtn.disabled = currentPage <= minPage;
      if (nextBtn) nextBtn.disabled = currentPage >= maxPage;
      return maxPage;
    }

    function goToPage(nextPage, emitEvent) {
      var prevPage = getCurrentPage();
      var nums = getNumButtons();
      var validPages = nums.map(function (b) { return Number(b.getAttribute('data-page-num')) || 0; }).filter(Boolean);
      if (!validPages.length) return;
      var minPage = Math.min.apply(null, validPages);
      var maxPage = Math.max.apply(null, validPages);
      var clamped = Math.max(minPage, Math.min(maxPage, nextPage));
      var totalPages = syncNavState(clamped);
      if (emitEvent && clamped !== prevPage) {
        nav.dispatchEvent(new CustomEvent('ds:pagination-change', {
          bubbles: true,
          detail: {
            page: clamped,
            previousPage: prevPage,
            totalPages: totalPages
          }
        }));
      }
    }

    nav.addEventListener('click', function (event) {
      var btn = event.target.closest('button.ds-pagination__btn');
      if (!btn || !nav.contains(btn) || btn.disabled) return;
      var navDir = btn.getAttribute('data-page-nav');
      if (navDir === 'prev') {
        goToPage(getCurrentPage() - 1, true);
      } else if (navDir === 'next') {
        goToPage(getCurrentPage() + 1, true);
      } else if (btn.hasAttribute('data-page-num')) {
        var target = Number(btn.getAttribute('data-page-num')) || 1;
        goToPage(target, true);
      }
    });

    syncNavState(getCurrentPage());
  }

  function initialize() {
    document.querySelectorAll('nav.ds-pagination[data-pagination-current]').forEach(initPagination);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}());
