(function () {
  'use strict';
  if (document.__fsListCurrent) return;
  document.__fsListCurrent = true;

  function unavailable(control) {
    return !control.isConnected || control.matches(':disabled') || !!control.closest('[hidden], [aria-disabled="true"], fieldset:disabled');
  }

  function init(list) {
    if (list.__fsListCurrent) return;
    list.__fsListCurrent = true;
    var edits = new Map(), controls = [], announcementTimer;
    function announce(message) {
      var live = list.querySelector('.ds-list__live-region');
      if (!live) {
        live = document.createElement('span');
        live.className = 'ds-list__live-region';
        live.setAttribute('aria-live', 'polite');
        list.appendChild(live);
      }
      window.clearTimeout(announcementTimer);
      live.textContent = '';
      announcementTimer = window.setTimeout(function () {
        if (list.isConnected) live.textContent = message;
      }, 10);
    }
    function finish(control, save) {
      var state = edits.get(control);
      if (!state) return;
      if (!save) state.content.textContent = state.original;
      state.content.contentEditable = 'false';
      state.content.classList.remove('is-editing');
      if (state.tabindex === null) state.content.removeAttribute('tabindex');
      else state.content.setAttribute('tabindex', state.tabindex);
      state.content.removeEventListener('keydown', state.keydown);
      state.content.removeEventListener('compositionstart', state.compositionStart);
      state.content.removeEventListener('compositionend', state.compositionEnd);
      control.textContent = 'Edit';
      control.setAttribute('aria-label', 'Edit');
      edits.delete(control);
      announce(save ? '内容已保存' : '已取消编辑');
      if (!unavailable(control)) control.focus();
    }
    function begin(control, row) {
      if (edits.has(control)) { finish(control, true); return; }
      var content = row.firstElementChild;
      var state = { content: content, original: content.textContent, tabindex: content.getAttribute('tabindex'), composing: false };
      state.compositionStart = function () { state.composing = true; };
      state.compositionEnd = function () { state.composing = false; };
      state.keydown = function (event) {
        if (event.key !== 'Enter' && event.key !== 'Escape') return;
        if (event.isComposing || state.composing) return;
        event.preventDefault();
        finish(control, event.key === 'Enter' && !unavailable(control));
      };
      edits.set(control, state);
      control.textContent = 'Save';
      control.setAttribute('aria-label', 'Save');
      content.contentEditable = 'true';
      content.classList.add('is-editing');
      content.tabIndex = -1;
      content.addEventListener('keydown', state.keydown);
      content.addEventListener('compositionstart', state.compositionStart);
      content.addEventListener('compositionend', state.compositionEnd);
      content.focus();
      var selection = window.getSelection(), range = document.createRange();
      range.selectNodeContents(content);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    list.querySelectorAll('.ds-list__action').forEach(function (actions) {
      if (!actions.children.length && actions.textContent.trim() === 'Delete') {
        var span = document.createElement('span');
        span.textContent = 'Delete';
        actions.replaceChildren(span);
      }
      Array.from(actions.children).forEach(function (control) {
        var action = control.textContent.trim();
        if (action !== 'Edit' && action !== 'Delete') return;
        controls.push(control);
        control.classList.add('ds-list__action-control');
        control.setAttribute('role', 'button');
        control.setAttribute('aria-label', action);
        control.tabIndex = unavailable(control) ? -1 : 0;
        control.addEventListener('click', function () {
          if (unavailable(control) || !list.contains(control)) return;
          var row = control.closest('.ds-list__row');
          if (!row || row.parentElement !== list) return;
          if (action === 'Edit') begin(control, row);
          else {
            row.querySelectorAll('.ds-list__action-control').forEach(function (other) {
              if (edits.has(other)) finish(other, false);
            });
            row.remove();
            announce('列表项已删除');
          }
        });
        control.addEventListener('keydown', function (event) {
          if (event.isComposing || edits.get(control)?.composing || (event.key !== 'Enter' && event.key !== ' ')) return;
          event.preventDefault();
          if (!unavailable(control)) control.click();
        });
      });
    });
    // This observes existing controls only; it is not a dynamic insertion API.
    new MutationObserver(function () {
      controls.forEach(function (control) {
        control.tabIndex = unavailable(control) ? -1 : 0;
        if (unavailable(control) && edits.has(control)) finish(control, false);
      });
    }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['hidden', 'disabled', 'aria-disabled'] });
  }
  function scan() {
    document.querySelectorAll('.ds-list--structured[data-list-current="structured"]').forEach(init);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan, { once: true });
  else scan();
})();
