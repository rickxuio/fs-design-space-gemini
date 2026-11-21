'use strict';

const VARIANT_DIR = 'components/variants';

const variantSource = (id) => `${VARIANT_DIR}/${id}.html`;

const SPEC_PAGE = (id) =>
  ({
    button: 'maintenance/button-prototype-20261113/preview.html',
    'icon-button': 'maintenance/icon-button-prototype-20261114/preview.html',
    'text-button': 'maintenance/text-button-prototype-20261114/preview.html',
  })[id] || `maintenance/foundation-prototypes-20261114/${id}.html`;

const COMPONENT_IDS = [
  'anchor-nav',
  'badge',
  'banner',
  'breadcrumb',
  'button',
  'card',
  'carousel',
  'checkbox',
  'collapse',
  'comment',
  'dialog',
  'dropdown',
  'form',
  'icon-button',
  'icon-card',
  'input',
  'input-number',
  'list',
  'menu-navigation',
  'navigation',
  'option-selector',
  'radio',
  'rate',
  'select',
  'stepper',
  'tab',
  'table',
  'tag',
  'text-button',
  'video-button',
];

module.exports = { VARIANT_DIR, variantSource, SPEC_PAGE, COMPONENT_IDS };
