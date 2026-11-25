(function () {
  'use strict';
  if (document.__fsListProductsCurrent) return;
  document.__fsListProductsCurrent = true;
  function init() {
    document.querySelectorAll('.ds-list--products[data-list-current="products"]').forEach(function (root) {
      if (root.__fsProductsReady) return;
      root.__fsProductsReady = true;
      var prices = new WeakMap();
      function announce(message) {
        var live = root.querySelector('.ds-list__live-region');
        if (!live) {
          live = document.createElement('span');
          live.className = 'ds-list__live-region';
          live.setAttribute('aria-live', 'polite');
          root.appendChild(live);
        }
        live.textContent = message;
      }
      root.querySelectorAll('[data-list-quantity-current]').forEach(function (control) {
        var row = control.closest('.ds-list__product-source-row');
        var price = row && row.querySelector('.ds-list__product-source-price');
        var unit = price && Number(price.textContent.replace(/[^0-9.]/g, ''));
        if (Number.isFinite(unit)) prices.set(control, unit);
        // Atom initialization precedes this host: its target blur normalizes first.
        var input = control.querySelector('.ds-input-number__input');
        if (input) input.addEventListener('blur', function () { update(input); });
      });
      root.addEventListener('change', function (event) {
        update(event.target);
      });
      // The quantity atom queues its reset refresh first (required script order).
      document.addEventListener('reset', function (event) {
        if (event.target.tagName !== 'FORM') return;
        queueMicrotask(function () {
          if (event.defaultPrevented) return;
          root.querySelectorAll('[data-list-quantity-current] .ds-input-number__input').forEach(function (input) {
            if (input.form === event.target) update(input, true);
          });
        });
      });
      root.addEventListener('click', function (event) {
        var control = event.target.closest('button[data-list-product-delete]');
        if (!control || control.closest('.ds-list--products') !== root || control.matches(':disabled') ||
            control.closest('[hidden],[aria-disabled="true"]')) return;
        var row = control.closest('.ds-list__product-source-row');
        if (row) { row.remove(); announce('商品已删除'); }
      });
      function update(input, fromReset) {
        if (!input.matches('.ds-input-number__input') || (!fromReset && (input.matches(':disabled') || input.readOnly ||
            input.closest('[hidden],[aria-disabled="true"]')))) return;
        var control = input.closest('[data-list-quantity-current]');
        if (!control || control.closest('.ds-list--products') !== root || !prices.has(control)) return;
        var quantity = Number(input.value);
        if (!Number.isInteger(quantity) || quantity !== Number(input.getAttribute('aria-valuenow'))) return;
        var row = control.closest('.ds-list__product-source-row');
        var total = row && row.querySelector('.ds-list__product-source-total-price');
        if (total) {
          var next = 'US$ ' + (prices.get(control) * quantity).toLocaleString('en-US', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          });
          if (total.textContent !== next) {
            total.textContent = next;
            announce('数量已更新为 ' + quantity);
          }
        }
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
