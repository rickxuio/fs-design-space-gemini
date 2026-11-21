(function () {
  'use strict';

  const ROOT_SELECTOR = '[data-menu-navigation]';
  const ITEM_SELECTOR = '.ds-menu-navigation__item';
  const SELECTED_CLASS = 'ds-menu-navigation__item--selected';

  function items(root) {
    return Array.from(root.querySelectorAll(ITEM_SELECTOR));
  }

  function visibleItems(root) {
    return items(root).filter((item) => !item.closest('.ds-menu-navigation__panel[hidden]'));
  }

  function setRovingFocus(root, current) {
    items(root).forEach((item) => {
      item.tabIndex = item === current ? 0 : -1;
    });
  }

  function panelFor(button) {
    const panelId = button.getAttribute('aria-controls');
    return panelId ? document.getElementById(panelId) : null;
  }

  function setExpanded(button, expanded) {
    const panel = panelFor(button);
    button.setAttribute('aria-expanded', String(expanded));
    if (panel) panel.hidden = !expanded;
  }

  function closeOtherParents(root, current) {
    items(root).forEach((item) => {
      if (item !== current && item.hasAttribute('aria-expanded')) setExpanded(item, false);
    });
  }

  function toggleParent(root, button) {
    const nextExpanded = button.getAttribute('aria-expanded') !== 'true';
    if (nextExpanded) closeOtherParents(root, button);
    setExpanded(button, nextExpanded);
    root.dispatchEvent(new CustomEvent('ds:menu-navigation-toggle', {
      bubbles: true,
      detail: {
        expanded: nextExpanded,
        value: button.dataset.value || '',
        label: button.textContent.trim()
      }
    }));
  }

  function selectLeaf(root, button) {
    items(root).forEach((item) => {
      if (item.hasAttribute('aria-expanded')) return;
      const selected = item === button;
      item.classList.toggle(SELECTED_CLASS, selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    const parentPanel = button.closest('.ds-menu-navigation__panel');
    if (parentPanel && parentPanel.id) {
      const parent = root.querySelector('[aria-controls="' + CSS.escape(parentPanel.id) + '"]');
      if (parent) setExpanded(parent, true);
    }

    setRovingFocus(root, button);
    root.dispatchEvent(new CustomEvent('ds:menu-navigation-change', {
      bubbles: true,
      detail: {
        value: button.dataset.value || '',
        label: button.textContent.trim()
      }
    }));
  }

  function moveFocus(root, current, direction) {
    const available = visibleItems(root);
    if (!available.length) return;
    const index = Math.max(0, available.indexOf(current));
    let nextIndex = index;
    if (direction === 'first') nextIndex = 0;
    else if (direction === 'last') nextIndex = available.length - 1;
    else nextIndex = (index + direction + available.length) % available.length;
    const next = available[nextIndex];
    setRovingFocus(root, next);
    next.focus();
  }

  function handleKeydown(root, event) {
    const button = event.target.closest(ITEM_SELECTOR);
    if (!button || !root.contains(button)) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(root, button, 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(root, button, -1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      moveFocus(root, button, 'first');
    } else if (event.key === 'End') {
      event.preventDefault();
      moveFocus(root, button, 'last');
    } else if (event.key === 'Escape') {
      const panel = button.closest('.ds-menu-navigation__panel');
      const parent = panel && panel.id
        ? root.querySelector('[aria-controls="' + CSS.escape(panel.id) + '"]')
        : button.hasAttribute('aria-expanded') ? button : null;
      if (parent && parent.getAttribute('aria-expanded') === 'true') {
        event.preventDefault();
        setExpanded(parent, false);
        setRovingFocus(root, parent);
        parent.focus();
      }
    }
  }

  function normalizeInitialState(root) {
    const allItems = items(root);
    const parents = allItems.filter((item) => item.hasAttribute('aria-expanded'));
    const openParent = parents.find((item) => item.getAttribute('aria-expanded') === 'true');
    parents.forEach((parent) => setExpanded(parent, parent === openParent));

    const leaves = allItems.filter((item) => !item.hasAttribute('aria-expanded'));
    const selected = leaves.find((item) => item.classList.contains(SELECTED_CLASS) || item.getAttribute('aria-pressed') === 'true');
    leaves.forEach((leaf) => {
      const isSelected = leaf === selected;
      leaf.classList.toggle(SELECTED_CLASS, isSelected);
      leaf.setAttribute('aria-pressed', String(isSelected));
    });

    const initialFocus = selected || openParent || leaves[0] || allItems[0];
    if (initialFocus) setRovingFocus(root, initialFocus);
  }

  function initialize(root) {
    if (root.dataset.menuNavigationReady === 'true') return;
    root.dataset.menuNavigationReady = 'true';
    normalizeInitialState(root);

    root.addEventListener('click', (event) => {
      const button = event.target.closest(ITEM_SELECTOR);
      if (!button || !root.contains(button)) return;
      if (button.hasAttribute('aria-expanded')) toggleParent(root, button);
      else selectLeaf(root, button);
    });

    root.addEventListener('keydown', (event) => handleKeydown(root, event));

    const search = root.querySelector('.ds-menu-navigation__search-input');
    if (search) {
      search.addEventListener('input', () => {
        root.dispatchEvent(new CustomEvent('ds:menu-navigation-search', {
          bubbles: true,
          detail: { query: search.value }
        }));
      });
    }
  }

  function initializeAll(scope) {
    (scope || document).querySelectorAll(ROOT_SELECTOR).forEach(initialize);
  }

  window.FSMenuNavigation = { initialize, initializeAll };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAll(document), { once: true });
  } else {
    initializeAll(document);
  }
}());
