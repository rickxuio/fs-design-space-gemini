/* Finite opt-in split/feature disclosure runtime; legacy collapse.js remains unchanged. */
(function () {
  if (document.__fsCollapseCurrentReady) return;
  document.__fsCollapseCurrentReady = true;
  function currentGroup(group) {
    return group && group.hasAttribute('data-collapse-current') &&
      (group.classList.contains('ds-collapse--split') || group.classList.contains('ds-collapse--feature'));
  }
  function disabledHeader(item) {
    var header = item && item.querySelector('.ds-collapse__header');
    return !header || header.matches(':disabled') ||
      !!header.closest('[hidden], [aria-disabled="true"]');
  }
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
    var group = t.closest('.ds-collapse');
    if (!currentGroup(group)) return;

    // 1) 开关：独立切换，不触发折叠
    var sw = t.closest('.ds-toggle');
    if (sw) return;

    var item = t.closest('.ds-collapse__item');
    if (!item || disabledHeader(item)) return;

    // Source Cookies paragraph is a copy region; the surrounding body space closes.
    if (group.classList.contains('ds-collapse--split') &&
        group.getAttribute('data-collapse-source-cookies') === 'official' &&
        (t.closest('.ds-collapse__body') || t === item)) {
      if (e.defaultPrevented || t.closest('.ds-collapse__copy-region')) return;
      toggleItem(group, item);
      return;
    }

    // Feature rows open on mouse hover; keep click for keyboard-generated activation.
    if (group.classList.contains('ds-collapse--feature') && e.detail !== 0) return;

    // Only the supported disclosure header may toggle its body.
    if (t.closest('.ds-collapse__header, .ds-collapse__row')) {
      toggleItem(group, item);
    }
  });

  document.addEventListener('mouseover', function (e) {
    var group = e.target.closest('.ds-collapse--feature');
    if (!currentGroup(group)) return;
    var item = e.target.closest('.ds-collapse__item');
    if (!item || disabledHeader(item) || !group.contains(item) || (e.relatedTarget && item.contains(e.relatedTarget))) return;
    openItem(group, item);
  });

  document.querySelectorAll('.ds-collapse[data-collapse-current]').forEach(function (group) {
    if (!currentGroup(group)) return;
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
