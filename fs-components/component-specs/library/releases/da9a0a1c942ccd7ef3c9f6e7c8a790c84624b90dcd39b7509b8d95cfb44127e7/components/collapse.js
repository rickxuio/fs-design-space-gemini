/* ============================================================
   collapse.js — 折叠面板交互行为（手风琴式）
   ------------------------------------------------------------
   · 事件委托：整页只挂一个 click + mouseover 监听，动态内容也生效
   · 默认同组单开；仅 split 可用 data-collapse-mode="multiple" 显式启用多开
   · 各类型：
       split       → 点 header 切换；同时切换 +/− 指示图标
       feature     → 鼠标悬浮 header 展开；键盘 Enter/Space 切换
       data-preview→ 点整行(row)切换；View Order/更多/info 不触发
       inline-edit → 点 Edit 展开编辑态；Cancel/Save 收起；输入区不触发
   · .ds-toggle 开关独立切换（on/off），不影响折叠展开
   ============================================================ */
(function () {
  var PLUS = 'icon-collapse-plus';
  var MINUS = 'icon-collapse-minus';

  function allowsMultiple(group) {
    return group.classList.contains('ds-collapse--split') &&
      group.getAttribute('data-collapse-mode') === 'multiple';
  }

  function swapIcon(item, open) {
    var img = item.querySelector('.ds-collapse__title > img');
    if (!img) return;
    var src = img.getAttribute('src') || '';
    if (open && src.indexOf(PLUS) !== -1) {
      img.setAttribute('src', src.replace(PLUS, MINUS));
    } else if (!open && src.indexOf(MINUS) !== -1) {
      img.setAttribute('src', src.replace(MINUS, PLUS));
    }
  }

  function closeItem(item) {
    if (!item.classList.contains('ds-collapse__item--open')) return;
    item.classList.remove('ds-collapse__item--open');
    swapIcon(item, false);
    var closedHeader = item.querySelector('.ds-collapse__header[aria-expanded]');
    var closedBody = item.querySelector('.ds-collapse__body');
    if (closedHeader) closedHeader.setAttribute('aria-expanded', 'false');
    if (closedBody) {
      closedBody.setAttribute('aria-hidden', 'true');
      closedBody.hidden = true;
    }
  }

  function openItem(group, item) {
    // 手风琴：先收起同组其它已展开项
    if (!allowsMultiple(group)) {
      group.querySelectorAll('.ds-collapse__item--open').forEach(function (i) {
        if (i !== item) closeItem(i);
      });
    }
    item.classList.add('ds-collapse__item--open');
    swapIcon(item, true);
    var openHeader = item.querySelector('.ds-collapse__header[aria-expanded]');
    var openBody = item.querySelector('.ds-collapse__body');
    if (openHeader) openHeader.setAttribute('aria-expanded', 'true');
    if (openBody) {
      openBody.setAttribute('aria-hidden', 'false');
      openBody.hidden = false;
    }
  }

  function toggleItem(group, item) {
    if (item.classList.contains('ds-collapse__item--open')) closeItem(item);
    else openItem(group, item);
  }

  document.addEventListener('click', function (e) {
    var t = e.target;

    // 1) 开关：独立切换，不触发折叠
    var sw = t.closest('.ds-toggle');
    if (sw && !sw.classList.contains('ds-toggle--disabled')) {
      sw.classList.toggle('ds-toggle--on');
      return;
    }

    var group = t.closest('.ds-collapse');
    if (!group) return;
    var item = t.closest('.ds-collapse__item');
    if (!item) return;

    // Feature rows open on mouse hover; keep click for keyboard-generated activation.
    if (group.classList.contains('ds-collapse--feature') && e.detail !== 0) return;

    // 2) 行内编辑型：Edit 开、Cancel/Save 关、输入区不触发
    if (group.classList.contains('ds-collapse--inline-edit')) {
      if (t.closest('.ds-collapse__edit-actions')) { closeItem(item); return; }
      if (t.closest('.ds-collapse__edit-field')) return; // 让用户在输入区内操作
      if (t.closest('.ds-collapse__edit')) { toggleItem(group, item); return; }
      return;
    }

    // 3) 数据预览型：更多菜单 / info / View Order 不触发展开
    if (t.closest('.ds-collapse__actions') || t.closest('.ds-collapse__row-info')) return;

    // 4) 通用：点 header 或 row 切换
    if (t.closest('.ds-collapse__header, .ds-collapse__row')) {
      toggleItem(group, item);
    }
  });

  document.addEventListener('mouseover', function (e) {
    var group = e.target.closest('.ds-collapse--feature');
    if (!group) return;
    var item = e.target.closest('.ds-collapse__item');
    if (!item || !group.contains(item) || (e.relatedTarget && item.contains(e.relatedTarget))) return;
    openItem(group, item);
  });

  document.querySelectorAll('.ds-collapse').forEach(function (group) {
    var openItemNode = group.querySelector('.ds-collapse__item--open');
    group.querySelectorAll('.ds-collapse__item').forEach(function (item) {
      var open = allowsMultiple(group) ? item.classList.contains('ds-collapse__item--open') : item === openItemNode;
      item.classList.toggle('ds-collapse__item--open', open);
      var header = item.querySelector('.ds-collapse__header[aria-expanded]');
      var body = item.querySelector('.ds-collapse__body');
      if (header) header.setAttribute('aria-expanded', String(open));
      if (body) {
        body.setAttribute('aria-hidden', String(!open));
        body.hidden = !open;
      }
      swapIcon(item, open);
    });
  });
})();
