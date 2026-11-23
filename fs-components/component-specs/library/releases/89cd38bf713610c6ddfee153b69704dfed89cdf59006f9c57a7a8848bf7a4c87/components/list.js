(function () {
  'use strict';

  function activate(control, label, handler) {
    if (!control || control.dataset.listInteractive === 'true') return;
    control.dataset.listInteractive = 'true';
    if (!control.hasAttribute('role')) control.setAttribute('role', 'button');
    if (!control.hasAttribute('tabindex')) control.tabIndex = 0;
    if (label) control.setAttribute('aria-label', label);
    control.addEventListener('click', handler);
    control.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        control.click();
      }
    });
  }

  function announce(from, message) {
    var section = from.closest('.section') || document.body;
    var live = section.querySelector('.ds-list__live-region');
    if (!live) {
      live = document.createElement('span');
      live.className = 'ds-list__live-region';
      live.setAttribute('aria-live', 'polite');
      section.appendChild(live);
    }
    live.textContent = '';
    window.setTimeout(function () { live.textContent = message; }, 10);
  }

  function setControlText(control, text) {
    var textNode = Array.prototype.find.call(control.childNodes, function (node) {
      return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim();
    });
    if (textNode) textNode.nodeValue = text;
    else control.appendChild(document.createTextNode(text));
  }

  function beginInlineEdit(control, content, onSave) {
    if (!content) return;
    if (control.dataset.editing === 'true') {
      content.contentEditable = 'false';
      content.classList.remove('is-editing');
      control.dataset.editing = 'false';
      control.setAttribute('aria-label', 'Edit');
      setControlText(control, 'Edit');
      if (onSave) onSave(content.textContent.trim());
      announce(control, '内容已保存');
      return;
    }

    control.dataset.editing = 'true';
    control.dataset.originalValue = content.textContent;
    control.setAttribute('aria-label', 'Save');
    setControlText(control, 'Save');
    content.contentEditable = 'true';
    content.classList.add('is-editing');
    content.focus();
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(content);
    selection.removeAllRanges();
    selection.addRange(range);

    content.onkeydown = function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        control.click();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        content.textContent = control.dataset.originalValue;
        control.click();
      }
    };
  }

  function initStructuredLists() {
    document.querySelectorAll('.ds-list--structured').forEach(function (list) {
      list.querySelectorAll('.ds-list__action').forEach(function (actions) {
        var controls = Array.from(actions.children);
        if (!controls.length && actions.textContent.trim()) {
          var only = document.createElement('span');
          only.textContent = actions.textContent.trim();
          actions.textContent = '';
          actions.appendChild(only);
          controls = [only];
        }
        controls.forEach(function (control) {
          var actionName = control.textContent.trim();
          control.classList.add('ds-list__action-control');
          activate(control, actionName, function () {
            var row = control.closest('.ds-list__row');
            if (!row) return;
            if (actionName === 'Delete') {
              row.remove();
              announce(list, '列表项已删除');
            } else if (actionName === 'Edit') {
              beginInlineEdit(control, row.firstElementChild);
            }
          });
        });
      });
    });
  }

  function checkboxState(checkbox, checked) {
    checkbox.classList.toggle('ds-checkbox--checked', checked);
    checkbox.setAttribute('aria-checked', checked ? 'true' : 'false');
  }

  function operationRows(list) {
    return Array.from(list.querySelectorAll('.ds-list__operation-row'));
  }

  function rowCheckboxes(list) {
    return operationRows(list).map(function (row) {
      return row.querySelector('.ds-checkbox');
    }).filter(Boolean);
  }

  function masterCheckbox(list) {
    return list.querySelector('.ds-list__operations-toolbar > .ds-checkbox, .ds-list__operations-mobile-head > .ds-checkbox');
  }

  function refreshMaster(list) {
    var master = masterCheckbox(list);
    if (!master) return;
    var boxes = rowCheckboxes(list);
    var selected = boxes.filter(function (box) { return box.classList.contains('ds-checkbox--checked'); }).length;
    checkboxState(master, boxes.length > 0 && selected === boxes.length);
    master.setAttribute('aria-checked', selected > 0 && selected < boxes.length ? 'mixed' : master.getAttribute('aria-checked'));
  }

  function applyBatch(list, action) {
    var rows = operationRows(list);
    var selected = rows.filter(function (row) {
      var checkbox = row.querySelector('.ds-checkbox');
      return checkbox && checkbox.classList.contains('ds-checkbox--checked');
    });
    if ((action === 'delete' || action === 'read') && !selected.length) {
      announce(list, '请先选择列表项');
      return;
    }
    if (action === 'delete') selected.forEach(function (row) { row.remove(); });
    if (action === 'delete-all') rows.forEach(function (row) { row.remove(); });
    if (action === 'read' || action === 'read-all') {
      (action === 'read' ? selected : rows).forEach(function (row) {
        row.classList.add('is-read');
        row.classList.remove('is-unread');
        var checkbox = row.querySelector('.ds-checkbox');
        if (checkbox) checkboxState(checkbox, false);
      });
    }
    refreshMaster(list);
    var messages = {
      'delete': '已删除选中的列表项',
      'delete-all': '已删除全部列表项',
      'read': '已将选中项标记为已读',
      'read-all': '已将全部列表项标记为已读'
    };
    announce(list, messages[action]);
  }

  function initOperationList(list) {
    var master = masterCheckbox(list);
    var boxes = rowCheckboxes(list);
    boxes.concat(master ? [master] : []).forEach(function (checkbox) {
      checkbox.setAttribute('role', 'checkbox');
      checkbox.tabIndex = 0;
      checkboxState(checkbox, checkbox.classList.contains('ds-checkbox--checked'));
      checkbox.addEventListener('click', function () {
        var isMaster = checkbox === master;
        var next = !checkbox.classList.contains('ds-checkbox--checked');
        checkboxState(checkbox, next);
        if (isMaster) boxes.forEach(function (box) { checkboxState(box, next); });
        else refreshMaster(list);
      });
      checkbox.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          checkbox.click();
        }
      });
    });

    list.querySelectorAll('.ds-list__batch-button').forEach(function (button) {
      var map = {
        'Delete': 'delete',
        'Mark as Read': 'read',
        'Read All Messages': 'read-all',
        'Delete All Messages': 'delete-all'
      };
      activate(button, button.textContent.trim(), function () { applyBatch(list, map[button.textContent.trim()]); });
    });

    var more = list.querySelector('.ds-list__source-menu-slot');
    if (more) {
      var menu = document.createElement('div');
      menu.className = 'ds-list__mobile-actions';
      menu.hidden = true;
      menu.id = 'list-mobile-actions-' + Math.random().toString(36).slice(2);
      [
        ['Delete', 'delete'],
        ['Mark as Read', 'read'],
        ['Read All Messages', 'read-all'],
        ['Delete All Messages', 'delete-all']
      ].forEach(function (entry) {
        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = entry[0];
        button.addEventListener('click', function () {
          applyBatch(list, entry[1]);
          menu.hidden = true;
          more.setAttribute('aria-expanded', 'false');
        });
        menu.appendChild(button);
      });
      list.appendChild(menu);
      more.setAttribute('aria-controls', menu.id);
      more.setAttribute('aria-expanded', 'false');
      activate(more, 'More actions', function () {
        menu.hidden = !menu.hidden;
        more.setAttribute('aria-expanded', menu.hidden ? 'false' : 'true');
      });
    }
  }

  function initOperationLists() {
    document.querySelectorAll('.ds-list--operations').forEach(initOperationList);
    document.querySelectorAll('.ds-list__operation-state-samples .ds-checkbox').forEach(function (checkbox) {
      checkbox.setAttribute('role', 'checkbox');
      checkbox.tabIndex = 0;
      checkboxState(checkbox, checkbox.classList.contains('ds-checkbox--checked'));
      checkbox.addEventListener('click', function () {
        checkboxState(checkbox, !checkbox.classList.contains('ds-checkbox--checked'));
      });
      checkbox.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          checkbox.click();
        }
      });
    });
  }

  function updateProductTotal(quantityControl, quantity) {
    var row = quantityControl.closest('.ds-list__product-source-row, .ds-list__product-mobile-row');
    if (!row) return;
    var total = row.querySelector('.ds-list__product-source-total-price, .ds-list__product-mobile-total');
    if (!total) return;
    var unit = Number(quantityControl.dataset.unitPrice) || 0;
    total.textContent = 'US$ ' + (unit * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function initProductLists() {
    document.querySelectorAll('.ds-list__quantity-source').forEach(function (quantityControl) {
      var input = quantityControl.querySelector('.ds-input-number__input');
      if (!input) return;
      var row = quantityControl.closest('.ds-list__product-source-row, .ds-list__product-mobile-row');
      var unitSource = row && row.querySelector('.ds-list__product-source-price');
      var totalSource = row && row.querySelector('.ds-list__product-source-total-price, .ds-list__product-mobile-total');
      quantityControl.dataset.unitPrice = String(Number((unitSource ? unitSource.textContent : totalSource ? totalSource.textContent : '').replace(/[^0-9.]/g, '')) || 0);
      input.addEventListener('change', function () {
        updateProductTotal(quantityControl, Number(input.value));
        announce(quantityControl, '数量已更新为 ' + input.value);
      });
    });
    document.querySelectorAll('.ds-list__product-source-delete, .ds-list__product-mobile-delete').forEach(function (control) {
      activate(control, 'Delete item', function () {
        var row = control.closest('.ds-list__product-source-row, .ds-list__product-mobile-row');
        if (row) row.remove();
        announce(control, '商品已删除');
      });
    });
  }

  function initKeyValueLists() {
    document.querySelectorAll('.ds-list__key-value-edit').forEach(function (control) {
      activate(control, 'Edit', function () {
        var row = control.closest('.ds-list__key-value-row');
        beginInlineEdit(control, row && row.querySelector('.ds-list__key-value-content'));
      });
    });
    document.querySelectorAll('.ds-list__key-value-link').forEach(function (control) {
      activate(control, 'Update photo', function () {
        var profile = control.closest('.ds-list__key-value-profile');
        var avatar = profile && profile.querySelector('.ds-list__key-value-avatar');
        var picker = document.createElement('input');
        picker.type = 'file';
        picker.accept = 'image/*';
        picker.hidden = true;
        picker.addEventListener('change', function () {
          var file = picker.files && picker.files[0];
          if (!file || !avatar) return;
          var reader = new FileReader();
          reader.onload = function () {
            avatar.style.backgroundImage = 'url("' + reader.result + '")';
            avatar.style.backgroundSize = 'cover';
            avatar.style.backgroundPosition = 'center';
            avatar.textContent = '';
            avatar.classList.add('has-image');
            announce(control, '头像预览已更新');
          };
          reader.readAsDataURL(file);
        });
        document.body.appendChild(picker);
        picker.click();
        picker.addEventListener('change', function () { picker.remove(); }, { once: true });
      });
    });
  }

  function init() {
    initStructuredLists();
    initOperationLists();
    initProductLists();
    initKeyValueLists();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
