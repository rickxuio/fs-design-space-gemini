(function () {
  'use strict';

  function stateOnly(root) {
    if (root.dataset.navigationMode === 'state-only') return true;
    try {
      return JSON.parse(root.dataset.props || '{}').interactionMode === 'state-only';
    } catch (error) {
      return false;
    }
  }

  function setSelected(options, selected) {
    options.forEach(function (option) {
      var active = option === selected;
      option.setAttribute('aria-pressed', active ? 'true' : 'false');
      option.classList.toggle('is-selected', active);
    });
  }

  function setupGroup(root, selector, prefix) {
    var options = Array.from(root.querySelectorAll(selector));
    options.forEach(function (option, index) {
      option.type = 'button';
      option.dataset.planStateOption = prefix + '-' + (index + 1);
      option.addEventListener('click', function () { setSelected(options, option); });
    });
    var selected = options.find(function (option) {
      return option.getAttribute('aria-pressed') === 'true' || option.classList.contains('is-selected');
    });
    setSelected(options, selected || null);
  }

  function normalizeButtons(root) {
    root.querySelectorAll('a').forEach(function (anchor) {
      var button = document.createElement('button');
      Array.from(anchor.attributes).forEach(function (attribute) {
        if (attribute.name !== 'href') button.setAttribute(attribute.name, attribute.value);
      });
      button.type = 'button';
      button.innerHTML = anchor.innerHTML;
      anchor.replaceWith(button);
    });
    root.querySelectorAll('button').forEach(function (button) { button.type = 'button'; });
  }

  document.querySelectorAll('[data-fs-component="navigation"]').forEach(function (root) {
    if (!stateOnly(root)) return;
    normalizeButtons(root);
    if (root.classList.contains('ds-nav-header')) setupGroup(root, '.ds-nav-header__link', 'header');
    if (root.classList.contains('ds-nav-footer')) setupGroup(root, '.ds-nav-footer__col-links .ds-text-btn', 'footer');
  });
}());
