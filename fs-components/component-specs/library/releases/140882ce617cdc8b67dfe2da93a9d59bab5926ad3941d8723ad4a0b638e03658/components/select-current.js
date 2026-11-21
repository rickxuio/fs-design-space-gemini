// Current local engineering corrections; MG original visual review remains pending.
(function () {
  'use strict';
  if (document.__fsSelectCurrentInitialized) return;
  document.__fsSelectCurrentInitialized = true;

  var ROOT_SELECTOR = '.ds-select';
  var OPTION_SELECTOR = '[role="option"].ds-select__option';
  var composingSearches = new WeakMap();

  function getTrigger(root) { return root.querySelector('.ds-select__trigger'); }
  function getPanel(root) { return root.querySelector('.ds-select__panel'); }
  function isDisabled(root) { var trigger = root && getTrigger(root); return !trigger || trigger.matches(':disabled') || !!trigger.closest('[hidden], [aria-disabled="true"]'); }
  function unavailable(node) { return !node || node.matches(':disabled') || !!node.closest('[hidden], [aria-disabled="true"]'); }

  function isMultiple(root) { return root.dataset.selectMode === 'multiple'; }
  function needsConfirmation(root) { return isMultiple(root) && root.hasAttribute('data-select-confirm'); }

  function getOptions(root, includeDisabled) {
    return Array.prototype.slice.call(root.querySelectorAll(OPTION_SELECTOR)).filter(function (option) {
      return option.closest(ROOT_SELECTOR) === root && (includeDisabled || option.getAttribute('aria-disabled') !== 'true');
    });
  }

  function visibleOptions(root) {
    return getOptions(root, false).filter(function (option) { return !unavailable(option); });
  }

  function optionLabel(option) {
    var label = option.querySelector('.ds-select__option-label');
    return (label || option).textContent.trim();
  }

  function triggerLabel(option) { return option.dataset.triggerLabel || optionLabel(option); }
  function optionValue(option) { return option.hasAttribute('data-value') ? option.dataset.value : optionLabel(option); }

  function syncOption(option, selected) {
    option.setAttribute('aria-selected', String(selected));
    option.classList.toggle('ds-select__option--selected', selected);
    var checkbox = option.querySelector('.ds-checkbox');
    if (checkbox) {
      checkbox.classList.toggle('ds-checkbox--checked', selected);
      checkbox.classList.toggle('ds-checkbox--disabled', option.getAttribute('aria-disabled') === 'true' || option.matches(':disabled'));
    }
  }

  function selectedOptions(root) {
    return getOptions(root, true).filter(function (option) {
      return option.getAttribute('aria-selected') === 'true';
    });
  }

  function saveSnapshot(root) {
    root.dataset.selectSnapshot = JSON.stringify(selectedOptions(root).map(function (option) { return option.id; }));
  }

  function restoreSnapshot(root) {
    var snapshot;
    try { snapshot = JSON.parse(root.dataset.selectSnapshot || '[]'); } catch (_) { snapshot = []; }
    getOptions(root, true).forEach(function (option) { syncOption(option, snapshot.indexOf(option.id) !== -1); });
    syncTrigger(root);
  }

  function createTag(root, ids, label, count) {
    var tag = document.createElement('button');
    tag.type = 'button';
    tag.className = 'ds-select__tag' + (count ? ' ds-select__tag--count' : '');
    tag.dataset.selectRemove = ids.join(' ');
    tag.setAttribute('aria-label', count ? 'Remove hidden selections' : 'Remove ' + label);

    var text = document.createElement('span');
    text.className = 'ds-select__tag-label';
    text.textContent = count ? '+' + count + '...' : label;
    tag.appendChild(text);

    var close = document.createElement('span');
    close.className = 'ds-select__tag-close';
    close.setAttribute('aria-hidden', 'true');
    tag.appendChild(close);

    if (count) {
      var tooltip = document.createElement('span');
      tooltip.id = root.id + '-overflow-tooltip';
      tooltip.className = 'ds-select__tooltip';
      tooltip.setAttribute('role', 'tooltip');
      tooltip.textContent = label;
      tag.setAttribute('aria-describedby', tooltip.id);
      tag.appendChild(tooltip);
    }
    return tag;
  }

  function syncTrigger(root) {
    var selected = selectedOptions(root);
    var value = root.querySelector('.ds-select__value');
    var count = root.querySelector('.ds-select__count');
    var tags = root.querySelector('.ds-select__tags');
    var clear = root.querySelector('.ds-select__control > [data-select-clear]');
    var trigger = getTrigger(root);
    var placeholder = value && (value.dataset.placeholder || 'Select');
    root.classList.toggle('ds-select--empty', !selected.length);

    if (value) {
      if (!selected.length) value.textContent = placeholder;
      else if (!isMultiple(root)) value.textContent = triggerLabel(selected[0]);
      else if (root.dataset.selectCountFormat === 'inline') value.textContent = placeholder + ' (' + selected.length + ')';
      else value.textContent = placeholder;
    }
    if (count) {
      count.textContent = selected.length ? String(selected.length) : '';
      count.hidden = !selected.length || root.dataset.selectCountFormat === 'inline' || Boolean(tags);
    }
    if (clear) clear.hidden = !selected.length;
    if (tags) {
      tags.innerHTML = '';
      if (selected[0]) tags.appendChild(createTag(root, [selected[0].id], optionLabel(selected[0]), 0));
      if (selected.length > 1) {
        var hidden = selected.slice(1);
        tags.appendChild(createTag(root, hidden.map(function (option) { return option.id; }), hidden.map(optionLabel).join(', '), hidden.length));
      }
    }
    if (trigger) {
      var summary = selected.length ? selected.map(optionLabel).join(', ') : placeholder;
      trigger.setAttribute('aria-label', summary || 'Select');
    }
  }

  function emitChange(root) {
    var selected = selectedOptions(root);
    root.dispatchEvent(new CustomEvent('ds:select-change', {
      bubbles: true,
      detail: {
        multiple: isMultiple(root),
        values: selected.map(optionValue),
        labels: selected.map(optionLabel)
      }
    }));
  }

  function setOpen(root, open, focusTarget) {
    var trigger = getTrigger(root);
    var panel = getPanel(root);
    if (!trigger || !panel || (open && isDisabled(root))) return;
    if (!open) composingSearches.delete(root);
    if (open && !root.classList.contains('ds-select--open') && needsConfirmation(root)) saveSnapshot(root);
    root.classList.toggle('ds-select--open', open);
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (!open && focusTarget === 'trigger') trigger.focus();
    if (open && focusTarget === 'option') {
      var options = visibleOptions(root);
      var selected = options.find(function (option) { return option.getAttribute('aria-selected') === 'true'; });
      (selected || options[0] || panel).focus();
    }
  }

  function cancelSelection(root, focusTarget) {
    if (needsConfirmation(root)) restoreSnapshot(root);
    delete root.dataset.selectSnapshot;
    setOpen(root, false, focusTarget);
  }

  function commitSelection(root) {
    if (isDisabled(root)) return;
    delete root.dataset.selectSnapshot;
    emitChange(root);
    setOpen(root, false, 'trigger');
  }

  function closeOthers(activeRoot) {
    document.querySelectorAll(ROOT_SELECTOR + '.ds-select--open').forEach(function (root) {
      if (root === activeRoot) return;
      if (needsConfirmation(root)) cancelSelection(root);
      else setOpen(root, false);
    });
  }

  function choose(root, option) {
    if (isDisabled(root) || unavailable(option) || option.closest(ROOT_SELECTOR) !== root || !root.classList.contains('ds-select--open') || getPanel(root).hidden) return;
    if (isMultiple(root)) {
      syncOption(option, option.getAttribute('aria-selected') !== 'true');
    } else {
      getOptions(root, true).forEach(function (candidate) { syncOption(candidate, candidate === option); });
      setOpen(root, false, 'trigger');
    }
    syncTrigger(root);
    if (!needsConfirmation(root) || !root.classList.contains('ds-select--open')) emitChange(root);
  }

  function removeSelection(root, ids) {
    if (isDisabled(root)) return;
    getOptions(root, true).forEach(function (option) {
      if (ids.indexOf(option.id) !== -1) syncOption(option, false);
    });
    syncTrigger(root);
    if (!needsConfirmation(root) || !root.classList.contains('ds-select--open')) emitChange(root);
  }

  function clearSelection(root) {
    if (isDisabled(root)) return;
    getOptions(root, true).forEach(function (option) { syncOption(option, false); });
    syncTrigger(root);
    if (!needsConfirmation(root) || !root.classList.contains('ds-select--open')) emitChange(root);
  }

  function filterOptions(root, query) {
    var normalized = query.trim().toLowerCase();
    getOptions(root, true).forEach(function (option) {
      option.hidden = normalized !== '' && optionLabel(option).toLowerCase().indexOf(normalized) === -1;
    });
    root.querySelectorAll('.ds-select__group').forEach(function (group) {
      var visible = Array.prototype.some.call(group.querySelectorAll(OPTION_SELECTOR), function (option) { return !option.hidden; });
      group.hidden = !visible;
    });
  }

  function focusRelative(root, current, delta) {
    var options = visibleOptions(root);
    if (!options.length) return;
    var index = Math.max(0, options.indexOf(current));
    options[(index + delta + options.length) % options.length].focus();
  }

  function initializeRoot(root, index) {
    if (root.__fsSelectCurrentInitialized) return;
    var trigger = getTrigger(root);
    var panel = getPanel(root);
    if (!trigger || !panel) return;
    root.__fsSelectCurrentInitialized = true;
    if (!root.id) { var candidate = 'ds-select-' + index; while (document.getElementById(candidate)) candidate += '-next'; root.id = candidate; }
    if (!trigger.id) trigger.id = root.id + '-trigger';
    if (!panel.id) panel.id = root.id + '-panel';
    trigger.setAttribute('aria-controls', panel.id);
    panel.setAttribute('aria-labelledby', trigger.id);
    panel.tabIndex = -1;
    var open = root.classList.contains('ds-select--open');
    trigger.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    getOptions(root, true).forEach(function (option, optionIndex) {
      if (!option.id) option.id = root.id + '-option-' + optionIndex;
      option.tabIndex = -1;
      syncOption(option, option.getAttribute('aria-selected') === 'true');
    });
    root.querySelectorAll('.ds-select__search-input').forEach(function (input) {
      if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', input.placeholder || 'Search options');
    });
    syncTrigger(root);
    if (open && needsConfirmation(root)) saveSnapshot(root);
    if (isDisabled(root)) closeDisabledRoot(root);
  }

  function closeDisabledRoot(root) {
    if (!root || !isDisabled(root) || !root.classList.contains('ds-select--open')) return;
    // Pending confirmation is cancelled silently when the owning control is disabled.
    if (needsConfirmation(root)) restoreSnapshot(root);
    delete root.dataset.selectSnapshot;
    setOpen(root, false);
  }

  document.addEventListener('click', function (event) {
    var control = event.target.closest && event.target.closest('button');
    if (control && unavailable(control)) return;
    var remove = event.target.closest('[data-select-remove]');
    if (remove) {
      removeSelection(remove.closest(ROOT_SELECTOR), remove.dataset.selectRemove.split(/\s+/).filter(Boolean));
      event.stopPropagation();
      return;
    }

    var clear = event.target.closest('[data-select-clear]');
    if (clear) {
      clearSelection(clear.closest(ROOT_SELECTOR));
      event.stopPropagation();
      return;
    }

    var cancel = event.target.closest('[data-select-cancel]');
    if (cancel) {
      var cancelRoot = cancel.closest(ROOT_SELECTOR);
      if (!isDisabled(cancelRoot)) cancelSelection(cancelRoot, 'trigger');
      return;
    }

    var close = event.target.closest('[data-select-close]');
    if (close) {
      var closeRoot = close.closest(ROOT_SELECTOR);
      if (isDisabled(closeRoot)) return;
      if (needsConfirmation(closeRoot)) commitSelection(closeRoot);
      else setOpen(closeRoot, false, 'trigger');
      return;
    }

    var option = event.target.closest(OPTION_SELECTOR);
    if (option) {
      choose(option.closest(ROOT_SELECTOR), option);
      return;
    }

    var trigger = event.target.closest('.ds-select__trigger');
    if (trigger) {
      var triggerRoot = trigger.closest(ROOT_SELECTOR);
      var shouldOpen = !triggerRoot.classList.contains('ds-select--open');
      closeOthers(triggerRoot);
      if (!shouldOpen && needsConfirmation(triggerRoot)) cancelSelection(triggerRoot);
      else setOpen(triggerRoot, shouldOpen);
      return;
    }

    if (!event.target.closest(ROOT_SELECTOR)) closeOthers(null);
  });

  function searchAvailable(root, input) {
    return root && !isDisabled(root) && !unavailable(input) && root.classList.contains('ds-select--open');
  }
  document.addEventListener('compositionstart', function (event) {
    if (!event.target.matches('.ds-select__search-input')) return;
    var root = event.target.closest(ROOT_SELECTOR);
    if (searchAvailable(root, event.target)) composingSearches.set(root, event.target);
  });
  document.addEventListener('compositionend', function (event) {
    if (!event.target.matches('.ds-select__search-input')) return;
    var root = event.target.closest(ROOT_SELECTOR);
    if (root) composingSearches.delete(root);
    if (searchAvailable(root, event.target)) filterOptions(root, event.target.value);
  });
  document.addEventListener('input', function (event) {
    if (!event.target.matches('.ds-select__search-input')) return;
    var root = event.target.closest(ROOT_SELECTOR);
    if (!event.isComposing && !composingSearches.has(root) && searchAvailable(root, event.target)) filterOptions(root, event.target.value);
  });

  document.addEventListener('keydown', function (event) {
    if (event.isComposing || event.keyCode === 229) return;
    var root = event.target.closest(ROOT_SELECTOR);
    if (!root || isDisabled(root) || composingSearches.has(root)) return;
    var trigger = event.target.closest('.ds-select__trigger');
    var option = event.target.closest(OPTION_SELECTOR);
    var search = event.target.closest('.ds-select__search-input');
    if ((option && unavailable(option)) || (search && unavailable(search))) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      if (needsConfirmation(root)) cancelSelection(root, 'trigger');
      else setOpen(root, false, 'trigger');
      return;
    }

    if (trigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      closeOthers(root);
      setOpen(root, true, 'option');
      return;
    }

    if (option) {
      var visible = visibleOptions(root);
      if (event.key === 'ArrowDown') { event.preventDefault(); focusRelative(root, option, 1); }
      else if (event.key === 'ArrowUp') { event.preventDefault(); focusRelative(root, option, -1); }
      else if (event.key === 'Home' && visible.length) { event.preventDefault(); visible[0].focus(); }
      else if (event.key === 'End' && visible.length) { event.preventDefault(); visible[visible.length - 1].focus(); }
      else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        choose(root, option);
      }
    } else if (search && event.key === 'ArrowDown') {
      var first = visibleOptions(root)[0];
      if (first) { event.preventDefault(); first.focus(); }
    }
  });

  document.addEventListener('focusout', function (event) {
    var root = event.target.closest(ROOT_SELECTOR);
    if (!root || !root.classList.contains('ds-select--open') || (event.relatedTarget && root.contains(event.relatedTarget))) return;
    if (needsConfirmation(root)) cancelSelection(root);
    else setOpen(root, false);
  });

  function initialize() {
    document.querySelectorAll(ROOT_SELECTOR).forEach(initializeRoot);
  }

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      var target = mutation.target;
      if (mutation.type === 'childList') initialize();
      if (mutation.type === 'attributes' && target.matches && target.matches(OPTION_SELECTOR) &&
          (mutation.attributeName === 'aria-disabled' || mutation.attributeName === 'disabled')) {
        // Controlled markers inherit availability from their owning option;
        // update atom state without altering selection or emitting a change.
        var optionRoot = target.closest(ROOT_SELECTOR);
        if (optionRoot && optionRoot.__fsSelectCurrentInitialized) syncOption(target, target.getAttribute('aria-selected') === 'true');
      }
      if (target.querySelectorAll) target.querySelectorAll(ROOT_SELECTOR).forEach(closeDisabledRoot);
      if (target.closest) { var root = target.closest(ROOT_SELECTOR); if (root) closeDisabledRoot(root); }
    });
  }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled', 'hidden', 'aria-disabled'] });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
}());
