(function () {
  'use strict';

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
    return Array.prototype.slice.call(root.querySelectorAll('.ds-rate__star-button[role="radio"]'));
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

    options.forEach(function (option, index) {
      var optionValue = index + 1;
      var icon = option.querySelector('.ds-rate__star');
      var active = optionValue <= value;
      if (icon) icon.src = active ? icons.on : icons.off;
      option.classList.toggle('ds-rate__star-button--preview', active && value !== committed);
      if (commitAria) {
        option.setAttribute('aria-checked', String(optionValue === committed));
        option.tabIndex = optionValue === committed || (committed === 0 && index === 0) ? 0 : -1;
      }
    });

    var output = root.querySelector('[data-rate-output]');
    if (output) {
      output.textContent = getLabel(root, value);
      output.hidden = value === 0;
    }
  }

  function setValue(root, nextValue, source, shouldFocus) {
    if (!root || root.getAttribute('aria-disabled') === 'true') return;
    var previousValue = clamp(root.getAttribute('data-value'));
    var value = clamp(nextValue);
    root.setAttribute('data-value', String(value));
    render(root, value, true);

    var options = getOptions(root);
    if (shouldFocus && options.length) {
      options[Math.max(0, value - 1)].focus();
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
    root.setAttribute('aria-disabled', String(disabled));
    if (group) group.setAttribute('aria-disabled', String(disabled));

    getOptions(root).forEach(function (option) {
      option.disabled = disabled;
    });
    var clear = root.querySelector('.ds-rate__clear');
    if (clear) clear.disabled = disabled;
    render(root, value, true);
  }

  function initialize(root) {
    root.querySelectorAll('.ds-rate--input[data-rate]').forEach(initializeRoot);
  }

  document.addEventListener('pointerover', function (event) {
    var option = event.target.closest('.ds-rate__star-button[role="radio"]');
    if (!option) return;
    var root = option.closest('.ds-rate--input[data-rate]');
    if (!root || root.getAttribute('aria-disabled') === 'true') return;
    render(root, option.dataset.value, false);
  });

  document.addEventListener('pointerout', function (event) {
    var control = event.target.closest('.ds-rate__control[role="radiogroup"]');
    if (!control || control.contains(event.relatedTarget)) return;
    var root = control.closest('.ds-rate--input[data-rate]');
    if (root) render(root, root.getAttribute('data-value'), true);
  });

  document.addEventListener('click', function (event) {
    var option = event.target.closest('.ds-rate__star-button[role="radio"]');
    if (option) {
      var optionRoot = option.closest('.ds-rate--input[data-rate]');
      if (optionRoot) setValue(optionRoot, option.dataset.value, 'pointer', false);
      return;
    }

    var clear = event.target.closest('.ds-rate__clear');
    if (!clear) return;
    var clearRoot = clear.closest('.ds-rate--input[data-rate]');
    if (clearRoot) setValue(clearRoot, 0, 'clear', true);
  });

  document.addEventListener('keydown', function (event) {
    var option = event.target.closest('.ds-rate__star-button[role="radio"]');
    if (!option) return;
    var root = option.closest('.ds-rate--input[data-rate]');
    if (!root || root.getAttribute('aria-disabled') === 'true') return;

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initialize(document); });
  } else {
    initialize(document);
  }
}());
