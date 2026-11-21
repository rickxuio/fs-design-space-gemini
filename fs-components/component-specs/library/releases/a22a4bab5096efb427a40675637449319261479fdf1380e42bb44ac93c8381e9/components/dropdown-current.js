/* Finite basic/search/brand single-choice Dropdown. Opt-in; no remote requests or submission. */
(function () {
  if (document.__fsDropdownCurrent) return;
  document.__fsDropdownCurrent = true;
  const disabledSynchronizers = [];
  function init() {
    document.querySelectorAll('.ds-dropdown[data-dropdown-current]').forEach(root => {
      if (root.dataset.dropdownReady) return;
      const trigger = root.querySelector(':scope > button.ds-dropdown__trigger');
      const panel = root.querySelector(':scope > .ds-dropdown__panel');
      const items = [...(panel?.querySelectorAll('button.ds-dropdown__item') || [])];
      const label = trigger?.querySelector('.ds-dropdown__trigger-text');
      const search = panel?.querySelector('.ds-dropdown__search input');
      if (!trigger || !panel || !label || items.length < 2 || !panel.id
        || trigger.getAttribute('aria-controls') !== panel.id
        || [...document.querySelectorAll('[id]')].filter(n => n.id === panel.id).length !== 1
        || items.some(n => !n.value || !n.textContent.trim())
        || new Set(items.map(n => n.value)).size !== items.length) return;
      root.dataset.dropdownReady = 'true';
      const placeholder = label.textContent;
      let opened = false;
      let composing = false;
      const blocked = () => trigger.matches(':disabled') || !!trigger.closest('[hidden], [aria-disabled="true"]');
      const enabled = () => items.filter(n => !n.hidden && !n.matches(':disabled') && !n.closest('[aria-disabled="true"]'));
      function filterChoices() {
        const query = search?.value.trim().toLocaleLowerCase() || '';
        items.forEach(n => { n.hidden = !!query && !n.textContent.toLocaleLowerCase().includes(query); n.tabIndex = -1; });
      }
      function close(returnFocus = false) {
        opened = false;
        composing = false;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.classList.remove('ds-dropdown__trigger--open');
        panel.classList.remove('ds-dropdown__panel--open');
        if (!panel.hidden) panel.hidden = true;
        items.forEach(n => n.tabIndex = -1);
        if (returnFocus) trigger.focus();
      }
      function focusItem(item) {
        items.forEach(n => n.tabIndex = n === item ? 0 : -1);
        item?.focus();
      }
      function open(last = false) {
        if (blocked() || (!search && !enabled().length)) return;
        opened = true;
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        trigger.classList.add('ds-dropdown__trigger--open');
        panel.classList.add('ds-dropdown__panel--open');
        if (search && !search.matches(':disabled')) { items.forEach(n => n.tabIndex = -1); search.focus(); }
        else focusItem(last ? enabled().at(-1) : enabled().find(n => n.getAttribute('aria-selected') === 'true') || enabled()[0]);
      }
      trigger.addEventListener('click', e => { if (!e.defaultPrevented && !blocked()) opened ? close() : open(); });
      trigger.addEventListener('keydown', e => {
        if (e.defaultPrevented || blocked() || e.isComposing || composing) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(e.key === 'ArrowUp'); }
        if (e.key === 'Escape' && opened) { e.preventDefault(); close(true); }
      });
      items.forEach(item => {
        item.addEventListener('click', e => {
          if (e.defaultPrevented || !opened || panel.hidden || blocked() || !enabled().includes(item)) return;
          const changed = root.dataset.value !== item.value;
          root.dataset.value = item.value;
          label.textContent = item.textContent;
          items.forEach(n => {
            n.setAttribute('aria-selected', String(n === item));
            n.classList.toggle('ds-dropdown__item--active', n === item);
          });
          close(true);
          if (changed) root.dispatchEvent(new CustomEvent('ds:dropdown-change', {bubbles:true, detail:{value:item.value,label:item.textContent}}));
        });
        item.addEventListener('keydown', e => {
          if (e.defaultPrevented || !opened || blocked() || e.isComposing || composing || !enabled().includes(item)) return;
          const choices = enabled(), index = choices.indexOf(item);
          let next;
          if (e.key === 'ArrowDown') next = choices[(index + 1) % choices.length];
          if (e.key === 'ArrowUp') next = choices[(index - 1 + choices.length) % choices.length];
          if (e.key === 'Home') next = choices[0];
          if (e.key === 'End') next = choices.at(-1);
          if (next) { e.preventDefault(); focusItem(next); }
          if (e.key === 'Escape') { e.preventDefault(); close(true); }
          if (e.key === 'Tab') close();
        });
      });
      if (search) {
        const searchAvailable = () => opened && !blocked() && !search.matches(':disabled') && search.getAttribute('aria-disabled')!=='true';
        search.addEventListener('compositionstart', () => { if (searchAvailable()) composing = true; });
        search.addEventListener('compositionend', () => {
          composing = false;
          if (searchAvailable()) filterChoices();
        });
        search.addEventListener('input', e => {
          if (!searchAvailable() || composing || e.isComposing) return;
          filterChoices();
        });
        search.addEventListener('keydown', e => {
          if (e.defaultPrevented || !searchAvailable() || composing || e.isComposing) return;
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault(); focusItem(e.key === 'ArrowUp' ? enabled().at(-1) : enabled()[0]);
          }
          if (e.key === 'Enter') { e.preventDefault(); enabled()[0]?.click(); }
          if (e.key === 'Escape') { e.preventDefault(); close(true); }
          if (e.key === 'Tab') close();
        });
      }
      document.addEventListener('click', e => { if (opened && !root.contains(e.target)) close(); });
      root.addEventListener('focusout', e => { if (opened && !root.contains(e.relatedTarget)) close(); });
      root.closest('form')?.addEventListener('reset', e => queueMicrotask(() => {
        if (e.defaultPrevented) return;
        root.dataset.value = '';
        label.textContent = placeholder;
        if (search) { search.value = ''; filterChoices(); }
        items.forEach(n => { n.setAttribute('aria-selected', 'false'); n.classList.remove('ds-dropdown__item--active'); });
        close();
      }));
      disabledSynchronizers.push(() => { if (blocked()) close(); });
      close();
    });
  }
  new MutationObserver(() => disabledSynchronizers.forEach(sync => sync()))
    .observe(document.documentElement, {subtree:true,attributes:true,attributeFilter:['disabled','hidden','aria-disabled']});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
