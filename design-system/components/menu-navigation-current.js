/* Current opt-in MenuNavigation correction. Legacy menu-navigation.js remains unchanged. */
(function () {
  'use strict';
  if (document.__fsMenuNavigationCurrentReady) return;
  document.__fsMenuNavigationCurrentReady = true;

  const ROOT_SELECTOR = '[data-menu-navigation]';
  const ITEM_SELECTOR = '.ds-menu-navigation__item';
  const SELECTED_CLASS = 'ds-menu-navigation__item--selected';

  function items(root) {
    return Array.from(root.querySelectorAll(ITEM_SELECTOR)).filter(item => item.closest(ROOT_SELECTOR) === root);
  }

  function visibleItems(root) {
    return items(root).filter((item) => !item.matches(':disabled') && !item.closest('[hidden],[aria-disabled="true"]'));
  }

  function setRovingFocus(root, current) {
    const available = visibleItems(root);
    if (!available.includes(current)) current = available[0];
    items(root).forEach((item) => {
      item.tabIndex = item === current ? 0 : -1;
    });
  }

  function panelFor(button) {
    const panelId = button.getAttribute('aria-controls');
    const root = button.closest(ROOT_SELECTOR);
    const panel = panelId && root ? Array.from(root.querySelectorAll('[id="' + CSS.escape(panelId) + '"]')).find(p => p.closest(ROOT_SELECTOR) === root) : null;
    return panel && panel.closest(ROOT_SELECTOR) === root ? panel : null;
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
    // Parent activation keeps the only tab stop visible after collapsing a selected child.
    setRovingFocus(root, button);
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
      const parent = items(root).find(item => item.getAttribute('aria-controls') === parentPanel.id);
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
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
    const button = event.target.closest(ITEM_SELECTOR);
    if (!button || button.closest(ROOT_SELECTOR) !== root || !visibleItems(root).includes(button)) return;

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
        ? items(root).find(item => item.getAttribute('aria-controls') === panel.id)
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

    const available = visibleItems(root);
    const initialFocus = (available.includes(selected) && selected) || openParent || available.find(item => !item.hasAttribute('aria-expanded')) || available[0];
    setRovingFocus(root, initialFocus);
  }

  function initialize(root) {
    if (root.dataset.menuNavigationReady === 'true') return;
    root.dataset.menuNavigationReady = 'true';
    normalizeInitialState(root);

    root.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      const button = event.target.closest(ITEM_SELECTOR);
      if (!button || button.closest(ROOT_SELECTOR) !== root || !visibleItems(root).includes(button)) return;
      if (button.hasAttribute('aria-expanded')) toggleParent(root, button);
      else selectLeaf(root, button);
    });

    root.addEventListener('keydown', (event) => handleKeydown(root, event));

    const search = Array.from(root.querySelectorAll('.ds-menu-navigation__search-input,.ds-input-search__field')).find(input => input.closest(ROOT_SELECTOR) === root);
    if (search) {
      root.addEventListener('ds:input-search', event => {
        event.stopPropagation();
        root.dispatchEvent(new CustomEvent('ds:menu-navigation-search', { bubbles: true, detail: { query: event.detail.query, submitted: true } }));
      });
      let composing = false, initialQuery = '', pendingCommittedQuery = null;
      const searchAvailable = () => !search.matches(':disabled') && !search.closest('[hidden],[aria-disabled="true"]');
      function emitQuery() {
        root.dispatchEvent(new CustomEvent('ds:menu-navigation-search', {
          bubbles: true,
          detail: { query: search.value }
        }));
      }
      search.addEventListener('compositionstart', () => {
        if (!searchAvailable()) return;
        composing = true;
        initialQuery = search.value;
        pendingCommittedQuery = null;
      });
      search.addEventListener('compositionend', () => {
        const wasComposing = composing;
        composing = false;
        pendingCommittedQuery = null;
        if (!wasComposing || !searchAvailable()) return;
        pendingCommittedQuery = search.value;
        if (search.value !== initialQuery) emitQuery();
      });
      search.addEventListener('input', event => {
        if (!searchAvailable() || composing || event.isComposing) return;
        const alreadyEmitted = pendingCommittedQuery !== null && pendingCommittedQuery === search.value;
        pendingCommittedQuery = null;
        if (!alreadyEmitted) emitQuery();
      });
    }
  }

  function initializeAll(scope) {
    (scope || document).querySelectorAll(ROOT_SELECTOR).forEach(initialize);
  }

  window.FSMenuNavigation = { initialize, initializeAll };

  new MutationObserver(mutations => {
    const roots = new Set();
    mutations.forEach(({target}) => {
      target.querySelectorAll(ROOT_SELECTOR).forEach(root => roots.add(root));
      if (target.matches(ROOT_SELECTOR)) roots.add(target);
      const root = target.closest(ROOT_SELECTOR); if (root) roots.add(root);
    });
    roots.forEach(root => {
      const available = visibleItems(root);
      const current = available.find(item => item.tabIndex === 0) || available.find(item => item.classList.contains(SELECTED_CLASS)) || available[0];
      setRovingFocus(root,current);
    });
  }).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['disabled','hidden','aria-disabled']});

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initializeAll(document), { once: true });
  } else {
    initializeAll(document);
  }
}());
