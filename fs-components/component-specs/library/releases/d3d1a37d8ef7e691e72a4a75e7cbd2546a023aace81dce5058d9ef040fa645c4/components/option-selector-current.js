(function () {
  'use strict';
  if (document.__fsOptionSelectorCurrentReady) return;
  document.__fsOptionSelectorCurrentReady = true;

  var GROUP = '[role="radiogroup"].ds-option-selector-group';
  var initialized = new WeakSet();
  function ownedOptions(group) {
    return Array.prototype.slice.call(group.querySelectorAll('[role="radio"].ds-option-selector')).filter(function (option) {
      return option.closest(GROUP) === group;
    });
  }
  function unavailable(option) {
    return option.matches(':disabled') || !!option.closest('[hidden], [aria-disabled="true"]');
  }
  function getOptions(group) {
    return ownedOptions(group).filter(function (option) { return !unavailable(option); });
  }

  function syncOption(option, selected) {
    option.setAttribute('aria-checked', String(selected));
    option.classList.toggle('ds-option-selector--selected', selected);
    option.tabIndex = selected ? 0 : -1;
  }

  function selectOption(group, option, shouldFocus) {
    if (!group || !option || unavailable(option) || option.closest(GROUP) !== group) return;
    ownedOptions(group).forEach(function (candidate) {
      syncOption(candidate, candidate === option);
    });
    if (shouldFocus) option.focus();
    option.dispatchEvent(new CustomEvent('ds:option-selector-change', {
      bubbles: true,
      detail: {
        value: option.value || option.dataset.value || '',
        label: option.querySelector('.ds-option-selector__label')
          ? option.querySelector('.ds-option-selector__label').textContent.trim()
          : (option.getAttribute('aria-label') || '')
      }
    }));
  }

  function initializeGroup(group) {
    if (initialized.has(group)) { syncTabStops(group); return; }
    initialized.add(group);
    ownedOptions(group).filter(function (option) { return option.matches(':disabled'); }).forEach(function (option) { syncOption(option, false); });
    var options = getOptions(group);
    if (!options.length) return;
    var selected = options.find(function (option) {
      return option.getAttribute('aria-checked') === 'true' || option.classList.contains('ds-option-selector--selected');
    });
    options.forEach(function (option, index) {
      syncOption(option, option === selected);
      if (!selected && index === 0) option.tabIndex = 0;
    });
  }

  function initialize(root) {
    root.querySelectorAll(GROUP).forEach(initializeGroup);
  }

  function syncTabStops(group) {
    var options = getOptions(group);
    var selected = options.find(function (option) { return option.getAttribute('aria-checked') === 'true'; });
    var target = selected || options[0];
    ownedOptions(group).forEach(function (option) {
      option.tabIndex = option === target ? 0 : -1;
    });
  }
  new MutationObserver(function (records) {
    if (records.length) initialize(document);
  }).observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['disabled', 'hidden', 'aria-disabled']});

  document.addEventListener('click', function (event) {
    var option = event.target.closest && event.target.closest('[role="radio"].ds-option-selector');
    if (!option || unavailable(option)) return;
    var group = option.closest(GROUP);
    if (group) selectOption(group, option, false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.isComposing || event.keyCode === 229) return;
    var option = event.target.closest && event.target.closest('[role="radio"].ds-option-selector');
    if (!option || unavailable(option)) return;
    var group = option.closest(GROUP);
    if (!group) return;
    var options = getOptions(group);
    var currentIndex = options.indexOf(option);
    var nextIndex = currentIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % options.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + options.length) % options.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = options.length - 1;
    else return;

    event.preventDefault();
    selectOption(group, options[nextIndex], true);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initialize(document); });
  } else {
    initialize(document);
  }
}());
