(function () {
  'use strict';
  if (document.__fsListOperationsCurrent) return;
  document.__fsListOperationsCurrent = true;
  var ROOT = '.ds-list--operations[data-list-current="operations"]';
  function unavailable(node) {
    return !node.isConnected || node.matches(':disabled') || !!node.closest('[hidden], [aria-disabled="true"], fieldset:disabled');
  }
  function initialize(list) {
    if (list.__fsListOperationsCurrent) return;
    list.__fsListOperationsCurrent = true;
    var master = list.querySelector('[data-list-master] > input.ds-checkbox__input');
    if (!master) return;
    var committed = new WeakMap();
    function rows() {
      return Array.from(list.children).filter(function (row) { return row.classList.contains('ds-list__operation-row'); });
    }
    function field(row) { return row.querySelector('label.ds-checkbox[data-checkbox-control] > input.ds-checkbox__input'); }
    function fields() { return rows().map(field).filter(Boolean); }
    function refresh() {
      var eligible = fields().filter(function (input) { return !unavailable(input); });
      var selected = eligible.filter(function (input) { return input.checked; }).length;
      master.checked = eligible.length > 0 && selected === eligible.length;
      master.indeterminate = selected > 0 && selected < eligible.length;
      fields().concat(master).forEach(function (input) { committed.set(input, input.checked); });
    }
    function announce(message) {
      var live = list.querySelector('.ds-list__live-region');
      if (!live) {
        live = document.createElement('span');
        live.className = 'ds-list__live-region';
        live.setAttribute('aria-live', 'polite');
        list.append(live);
      }
      live.textContent = message;
    }
    list.addEventListener('change', function (event) {
      var input = event.target;
      if (input.closest(ROOT) !== list || (input !== master && !fields().includes(input))) return;
      if (unavailable(input)) {
        if (committed.has(input)) input.checked = committed.get(input);
        refresh(); return;
      }
      if (input === master) {
        fields().filter(function (field) { return !unavailable(field); }).forEach(function (field) { field.checked = input.checked; field.indeterminate = false; });
      }
      refresh();
    });
    list.addEventListener('click', function (event) {
      var control = event.target.closest('button[data-list-action]');
      if (!control || control.closest(ROOT) !== list || unavailable(control)) return;
      var action = control.getAttribute('data-list-action');
      if (!['delete','read','read-all','delete-all'].includes(action)) return;
      var all = rows();
      var selected = all.filter(function (row) { var input = field(row); return input && input.checked && !unavailable(input); });
      if (['delete','read'].includes(action) && !selected.length) { announce('请先选择列表项'); return; }
      if (action === 'delete') selected.forEach(function (row) { row.remove(); });
      if (action === 'delete-all') all.forEach(function (row) { row.remove(); });
      if (action === 'read' || action === 'read-all') {
        (action === 'read' ? selected : all).forEach(function (row) {
          row.classList.add('is-read'); row.classList.remove('is-unread');
          var input = field(row); if (input) { input.checked = false; input.indeterminate = false; }
        });
      }
      refresh();
      announce({'delete':'已删除选中的列表项','delete-all':'已删除全部列表项','read':'已将选中项标记为已读','read-all':'已将全部列表项标记为已读'}[action]);
    });
    document.addEventListener('reset', function (event) {
      var form = event.target;
      if (!form || form.tagName !== 'FORM' || !fields().concat(master).some(function (input) { return input.form === form; })) return;
      queueMicrotask(function () { if (!event.defaultPrevented) refresh(); });
    });
    new MutationObserver(refresh).observe(list, {subtree:true,childList:true,attributes:true,attributeFilter:['disabled','hidden','aria-disabled','checked']});
    refresh();
  }
  function scan() { document.querySelectorAll(ROOT).forEach(initialize); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan, {once:true});
  else scan();
}());
