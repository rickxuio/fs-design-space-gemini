(function () {
  'use strict';
  if (document.__fsRateCurrent) return;
  document.__fsRateCurrent = true;

  var ROOT_SELECTOR = '.ds-rate--input[data-rate][data-rate-current]';
  function unavailable(node) { return node.matches(':disabled') || !!node.closest('[hidden],[aria-disabled="true"]'); }

  var SCRIPT_SRC = document.currentScript && document.currentScript.src;

  function resolveIcon(file) {
    return SCRIPT_SRC ? new URL('icons/' + file, SCRIPT_SRC).href : 'components/icons/' + file;
  }

  var SIZE_TO_ICON = {
    sm: { on: resolveIcon('icon-rate-on-16.svg'), off: resolveIcon('icon-rate-off-16.svg') },
    md: { on: resolveIcon('icon-rate-on-20.svg'), off: resolveIcon('icon-rate-off-20.svg') },
    lg: { on: resolveIcon('icon-rate-on-24.svg'), off: resolveIcon('icon-rate-off-24.svg') }
  };

  function clamp(value) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(5, Math.round(parsed)));
  }

  function getSize(root) {
    if (root.classList.contains('ds-rate--lg')) return 'lg';
    if (root.classList.contains('ds-rate--sm')) return 'sm';
    return 'md';
  }

  function getOptions(root) {
    return Array.prototype.slice.call(root.querySelectorAll('.ds-rate__star-button[role="radio"]')).filter(function (node) { return node.closest(ROOT_SELECTOR) === root; });
  }

  function getLabel(root, value) {
    var labels;
    try {
      labels = JSON.parse(root.getAttribute('data-rate-labels') || '[]');
    } catch (error) {
      labels = [];
    }
    return labels[value - 1] || (value ? value.toFixed(1) : '');
  }

  function render(root, visualValue, commitAria) {
    var value = clamp(visualValue);
    var committed = clamp(root.getAttribute('data-value'));
    var icons = SIZE_TO_ICON[getSize(root)];
    var options = getOptions(root);
    var available = options.filter(function (option) { return !unavailable(option); });
    var focused = available.find(function (option) { return Number(option.dataset.value) === committed; }) || available[0];

    options.forEach(function (option, index) {
      var optionValue = index + 1;
      var icon = option.querySelector('.ds-rate__star');
      var active = optionValue <= value;
      if (icon) icon.src = active ? icons.on : icons.off;
      option.classList.toggle('ds-rate__star-button--preview', active && value !== committed);
      if (commitAria) {
        option.setAttribute('aria-checked', String(optionValue === committed));
        option.tabIndex = option === focused ? 0 : -1;
      }
    });

    var output = root.querySelector('[data-rate-output]');
    if (output) {
      // Explanation follows committed selection; hover only previews the stars.
      output.textContent = getLabel(root, committed);
      if (output.hidden !== (committed === 0)) output.hidden = committed === 0;
    }
  }

  function setValue(root, nextValue, source, shouldFocus) {
    if (!root || root.closest('[hidden],[aria-disabled="true"]') || getOptions(root).every(function (n) { return n.matches(':disabled'); })) return;
    var previousValue = clamp(root.getAttribute('data-value'));
    var value = clamp(nextValue);
    var target = getOptions(root).find(function (option) { return Number(option.dataset.value) === value; });
    if (value && (!target || unavailable(target))) return;
    root.setAttribute('data-value', String(value));
    render(root, value, true);

    var options = getOptions(root);
    if (shouldFocus && options.length) {
      var focusOption = value ? target : options.find(function (option) { return !unavailable(option); });
      if (focusOption) focusOption.focus();
    }

    root.dispatchEvent(new CustomEvent('ds:rate-change', {
      bubbles: true,
      detail: {
        value: value,
        previousValue: previousValue,
        label: getLabel(root, value),
        source: source || 'programmatic'
      }
    }));
  }

  function initializeRoot(root) {
    var disabled = root.classList.contains('ds-rate--disabled') || root.getAttribute('aria-disabled') === 'true';
    var value = clamp(root.getAttribute('data-value'));
    var group = root.querySelector('.ds-rate__control[role="radiogroup"]');
    root.setAttribute('data-value', String(value));
    if (root.getAttribute('aria-disabled') !== String(disabled)) root.setAttribute('aria-disabled', String(disabled));
    if (group && group.getAttribute('aria-disabled') !== String(disabled)) group.setAttribute('aria-disabled', String(disabled));

    getOptions(root).forEach(function (option) {
      if (option.disabled !== disabled) option.disabled = disabled;
    });
    var clear = root.querySelector('.ds-rate__clear');
    if (clear && clear.disabled !== disabled) clear.disabled = disabled;
    render(root, value, true);
  }

  function initialize(root) {
    root.querySelectorAll('.ds-rate--input[data-rate][data-rate-current]').forEach(initializeRoot);
    root.querySelectorAll('.ds-rate--summary[data-rate-summary]').forEach(function (summary) {
      if (summary.hasAttribute('data-rate-summary-ready')) return;
      var rows = Array.from(summary.querySelectorAll('.ds-rate__distribution-row'));
      if (rows.length !== 5) return;
      var progress = rows.map(function (row) { return row.querySelector('.ds-rate__progress[role="progressbar"]'); });
      if (progress.some(function (node) { return !node || !node.querySelector('.ds-rate__progress-fill'); })) return;
      if (progress.some(function (node) { return !/^(0|[1-9][0-9]*)$/.test(node.getAttribute('aria-valuenow') || '') || !/^[1-9][0-9]*$/.test(node.getAttribute('aria-valuemax') || ''); })) return;
      var counts = progress.map(function (node) { return Number(node.getAttribute('aria-valuenow')); });
      var total = Number(progress[0].getAttribute('aria-valuemax'));
      if (!Number.isSafeInteger(total) || total < 1 || total > 1000000 || counts.some(function (count) { return !Number.isSafeInteger(count) || count < 0 || count > total; }) || counts.reduce(function (sum, count) { return sum + count; }, 0) !== total || progress.some(function (node) { return Number(node.getAttribute('aria-valuemax')) !== total; })) return;
      var value = counts.reduce(function (sum, count, index) { return sum + (5 - index) * count; }, 0) / total;
      if (!Number.isInteger(value) || summary.querySelector('.ds-rate__summary-score')?.textContent.trim() !== value.toFixed(1)) return;
      summary.setAttribute('data-rate-summary-ready', 'true');
      progress.forEach(function (node, index) { node.querySelector('.ds-rate__progress-fill').style.width = String(counts[index] / total * 100) + '%'; });
    });
  }

  document.addEventListener('pointerover', function (event) {
    var option = event.target.closest('.ds-rate__star-button[role="radio"]');
    if (!option || unavailable(option)) return;
    var root = option.closest('.ds-rate--input[data-rate][data-rate-current]');
    if (!root || root.closest('[hidden],[aria-disabled="true"]')) return;
    render(root, option.dataset.value, false);
  });

  document.addEventListener('pointerout', function (event) {
    var control = event.target.closest('.ds-rate__control[role="radiogroup"]');
    if (!control || control.contains(event.relatedTarget)) return;
    var root = control.closest('.ds-rate--input[data-rate][data-rate-current]');
    if (root) render(root, root.getAttribute('data-value'), true);
  });

  document.addEventListener('click', function (event) {
    var option = event.target.closest('.ds-rate__star-button[role="radio"]');
    if (option && !unavailable(option)) {
      var optionRoot = option.closest('.ds-rate--input[data-rate][data-rate-current]');
      if (optionRoot) setValue(optionRoot, option.dataset.value, 'pointer', false);
      return;
    }

    var clear = event.target.closest('.ds-rate__clear');
    if (!clear || unavailable(clear)) return;
    var clearRoot = clear.closest('.ds-rate--input[data-rate][data-rate-current]');
    if (clearRoot) setValue(clearRoot, 0, 'clear', true);
  });

  document.addEventListener('keydown', function (event) {
    if (event.isComposing || event.keyCode === 229) return;
    var option = event.target.closest('.ds-rate__star-button[role="radio"]');
    if (!option || unavailable(option)) return;
    var root = option.closest('.ds-rate--input[data-rate][data-rate-current]');
    if (!root || root.closest('[hidden],[aria-disabled="true"]')) return;

    var current = clamp(option.dataset.value);
    var next = current;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(5, current + 1);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(1, current - 1);
    else if (event.key === 'Home') next = 1;
    else if (event.key === 'End') next = 5;
    else if (event.key === 'Enter' || event.key === ' ') next = current;
    else return;

    event.preventDefault();
    setValue(root, next, 'keyboard', true);
  });

  new MutationObserver(function (records) {
    var roots = new Set(), rerender = new Set();
    records.forEach(function (record) {
      if (record.target.matches(ROOT_SELECTOR)) roots.add(record.target);
      else if (record.attributeName !== 'class') {
        record.target.querySelectorAll(ROOT_SELECTOR).forEach(function (r) { rerender.add(r); });
        var own = record.target.closest(ROOT_SELECTOR); if (own) rerender.add(own);
      }
    });
    roots.forEach(initializeRoot);
    rerender.forEach(function (root) { if (!roots.has(root)) render(root, root.getAttribute('data-value'), true); });
  }).observe(document.documentElement, {subtree:true, attributes:true, attributeFilter:['disabled','aria-disabled','hidden','class']});

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initialize(document); }, { once: true });
  } else {
    initialize(document);
  }
}());
