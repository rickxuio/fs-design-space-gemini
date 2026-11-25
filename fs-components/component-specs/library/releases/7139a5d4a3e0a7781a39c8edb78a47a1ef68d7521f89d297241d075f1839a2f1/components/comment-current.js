(function () {
  'use strict';
  if (document.__fsCommentCurrentReady) return;
  document.__fsCommentCurrentReady = true;

  function setActionState(button, active) {
    button.classList.toggle('ds-comment__action--active', active);
    button.setAttribute('aria-pressed', String(active));
  }

  function updateCount(button, delta) {
    var count = button.querySelector('[data-comment-count]');
    if (!count) return;
    var value = Number(count.textContent) || 0;
    count.textContent = String(Math.max(0, value + delta));
  }

  function togglePanel(button) {
    var panelId = button.getAttribute('aria-controls');
    var panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;
    var open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (button.dataset.commentAction === 'comment') setActionState(button, open);
    var review = button.closest('.ds-comment--review-thread');
    if (review) review.classList.toggle('ds-comment--comments-open', open);
    if (open) {
      var field = panel.querySelector('textarea');
      if (field) field.focus();
    }
  }

  function closeComposer(button) {
    var panel = button.closest('.ds-comment__comments, .ds-comment__answer-composer');
    if (!panel) return;
    var field = panel.querySelector('textarea');
    if (field) field.value = '';
    panel.hidden = true;
    var review = panel.closest('.ds-comment--review-thread');
    if (review) review.classList.remove('ds-comment--comments-open');
    var trigger = document.querySelector('[aria-controls="' + panel.id + '"]');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
      if (trigger.dataset.commentAction === 'comment') setActionState(trigger, false);
      trigger.focus();
    }
  }

  function submitComment(form) {
    var field = form.querySelector('textarea');
    var value = field ? field.value.trim() : '';
    if (!value) {
      if (field) field.focus();
      return;
    }

    if (form.dataset.composerType === 'answer') {
      var thread = form.closest('.ds-comment--qa-thread');
      var empty = thread && thread.querySelector('.ds-comment__empty-answer');
      var composerPanel = form.closest('.ds-comment__answer-composer');
      var answer = document.createElement('div');
      answer.className = 'ds-comment__answer';
      answer.tabIndex = -1;
      answer.innerHTML = '<span class="ds-comment__marker">A:</span><div class="ds-comment__body"><p class="ds-comment__text"></p><p class="ds-comment__meta">by You · just now</p></div>';
      answer.querySelector('.ds-comment__text').textContent = value;
      if (empty) empty.replaceWith(answer);
      if (composerPanel) composerPanel.hidden = true;
      field.value = '';
      answer.focus();
      return;
    }

    var panel = form.closest('.ds-comment__comments');
    var list = panel && panel.querySelector('.ds-comment__comment-list');
    if (list) {
      var item = document.createElement('li');
      var copy = document.createElement('span');
      var meta = document.createElement('span');
      item.className = 'ds-comment__comment-item';
      copy.className = 'ds-comment__comment-copy';
      meta.className = 'ds-comment__comment-meta';
      copy.textContent = String(list.children.length + 1) + '. ' + value;
      meta.textContent = 'by you';
      item.appendChild(copy);
      item.appendChild(meta);
      list.appendChild(item);
      var total = list.children.length;
      var heading = panel.querySelector('[data-comment-heading]');
      if (heading) heading.textContent = 'Showing ' + total + ' Comments';
      var trigger = document.querySelector('[aria-controls="' + panel.id + '"]');
      if (trigger) {
        var count = trigger.querySelector('[data-comment-count]');
        if (count) count.textContent = String(total);
      }
    }
    field.value = '';
    field.focus();
  }

  function setFilter(button) {
    var group = button.closest('[data-comment-filter-group]');
    if (!group) return;
    group.querySelectorAll('[data-comment-filter]').forEach(function (item) {
      var active = item === button;
      item.classList.toggle('ds-comment__filter-button--active', active);
      item.classList.toggle('ds-tag--checked', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }

  function setGalleryView(dialog, view) {
    if (!dialog) return;
    dialog.classList.toggle('ds-comment--gallery-detail-view', view === 'detail');
    dialog.querySelectorAll('[data-gallery-view]').forEach(function (panel) {
      panel.hidden = panel.dataset.galleryView !== view;
    });
  }

  function updateCarousel(carousel, index) {
    if (!carousel) return;
    var slides = carousel.querySelectorAll('.ds-comment__gallery-slide');
    if (!slides.length) return;
    var nextIndex = ((index % slides.length) + slides.length) % slides.length;
    carousel.dataset.index = String(nextIndex);
    var track = carousel.querySelector('.ds-comment__gallery-track');
    if (track) track.style.transform = 'translateX(-' + (nextIndex * 100) + '%)';
    var dialog = carousel.closest('.ds-comment--customer-gallery');
    if (dialog) {
      dialog.querySelectorAll('[data-gallery-thumb]').forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('ds-comment__gallery-thumb--active', thumbIndex === nextIndex);
        thumb.setAttribute('aria-pressed', String(thumbIndex === nextIndex));
      });
    }
  }

  function getGalleryIndex(trigger) {
    if (trigger.dataset.galleryIndex !== undefined) {
      return Number(trigger.dataset.galleryIndex) || 0;
    }
    var parent = trigger.parentElement;
    if (!parent) return 0;
    var detailTriggers = Array.prototype.slice.call(parent.querySelectorAll('[data-gallery-start="detail"]'));
    return Math.max(0, detailTriggers.indexOf(trigger));
  }

  function restoreGalleryFocus(dialog) {
    var trigger = dialog && dialog._commentReturnFocus;
    if (trigger && trigger.isConnected) trigger.focus();
  }

  function closeGallery(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else {
      dialog.removeAttribute('open');
      restoreGalleryFocus(dialog);
    }
  }

  function openGallery(trigger) {
    var selector = trigger.dataset.commentGalleryOpen || '#comment-gallery-demo';
    var dialog = document.querySelector(selector);
    if (!dialog) return;
    var view = trigger.dataset.galleryStart || 'grid';
    dialog._commentReturnFocus = trigger;
    setGalleryView(dialog, view);
    if (view === 'detail') updateCarousel(dialog.querySelector('[data-gallery-carousel]'), getGalleryIndex(trigger));
    if (typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-comment-call]')) return;
    var control = event.target.closest('button');
    if (control && (control.matches(':disabled') || control.closest('[hidden],[aria-disabled="true"]'))) return;
    var helpful = event.target.closest('[data-comment-action="helpful"]');
    if (helpful) {
      var active = helpful.getAttribute('aria-pressed') !== 'true';
      setActionState(helpful, active);
      updateCount(helpful, active ? 1 : -1);
      return;
    }

    var comment = event.target.closest('[data-comment-action="comment"], [data-comment-action="answer"]');
    if (comment) {
      togglePanel(comment);
      return;
    }

    var cancel = event.target.closest('[data-comment-cancel]');
    if (cancel) {
      closeComposer(cancel);
      return;
    }

    var textToggle = event.target.closest('[data-comment-text-toggle]');
    if (textToggle) {
      var textId = textToggle.getAttribute('aria-controls');
      var text = textId ? document.getElementById(textId) : null;
      if (text) {
        var expanded = textToggle.getAttribute('aria-expanded') !== 'true';
        text.classList.toggle('ds-comment__text--expanded', expanded);
        textToggle.setAttribute('aria-expanded', String(expanded));
        textToggle.textContent = expanded ? 'See less' : 'See more';
      }
      return;
    }

    var filter = event.target.closest('[data-comment-filter]');
    if (filter) {
      setFilter(filter);
      return;
    }

    var galleryOpen = event.target.closest('[data-comment-gallery-open]');
    if (galleryOpen) {
      openGallery(galleryOpen);
      return;
    }

    var galleryClose = event.target.closest('[data-comment-gallery-close]');
    if (galleryClose) {
      closeGallery(galleryClose.closest('dialog'));
      return;
    }

    var galleryBack = event.target.closest('[data-gallery-back]');
    if (galleryBack) {
      var gridDialog = galleryBack.closest('dialog');
      setGalleryView(gridDialog, 'grid');
      var firstGridItem = gridDialog.querySelector('[data-gallery-item]');
      if (firstGridItem) firstGridItem.focus();
      return;
    }

    var galleryItem = event.target.closest('[data-gallery-item]');
    if (galleryItem) {
      var itemDialog = galleryItem.closest('dialog');
      setGalleryView(itemDialog, 'detail');
      var itemCarousel = itemDialog.querySelector('[data-gallery-carousel]');
      updateCarousel(itemCarousel, Number(galleryItem.dataset.galleryItem) || 0);
      var backButton = itemDialog.querySelector('[data-gallery-back]');
      if (backButton) backButton.focus();
      return;
    }

    var thumb = event.target.closest('[data-gallery-thumb]');
    if (thumb) {
      updateCarousel(thumb.closest('dialog').querySelector('[data-gallery-carousel]'), Number(thumb.dataset.galleryThumb) || 0);
      return;
    }

    var previous = event.target.closest('[data-gallery-prev]');
    var next = event.target.closest('[data-gallery-next]');
    if (previous || next) {
      var carousel = (previous || next).closest('[data-gallery-carousel]');
      var index = Number(carousel.dataset.index) || 0;
      updateCarousel(carousel, index + (next ? 1 : -1));
    }
  });

  document.addEventListener('submit', function (event) {
    if (event.target.closest('[data-comment-call]')) return;
    if (event.defaultPrevented) return;
    var form = event.target.closest('[data-comment-composer]');
    if (!form) return;
    event.preventDefault();
    var field = form.querySelector('textarea');
    if (form.closest('[hidden],[aria-disabled="true"]') || !field || field.matches(':disabled')
      || (event.submitter && (event.submitter.matches(':disabled') || event.submitter.closest('[hidden],[aria-disabled="true"]')))) return;
    submitComment(form);
  });

  function initialize(root) {
    root.querySelectorAll('[data-comment-action="helpful"]').forEach(function (button) {
      setActionState(button, button.getAttribute('aria-pressed') === 'true');
    });
    root.querySelectorAll('.ds-comment--review-thread').forEach(function (review) {
      var trigger = review.querySelector('[data-comment-action="comment"]');
      var panelId = trigger && trigger.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;
      var open = Boolean(panel && !panel.hidden);
      review.classList.toggle('ds-comment--comments-open', open);
      if (trigger) {
        trigger.setAttribute('aria-expanded', String(open));
        setActionState(trigger, open);
      }
    });
    root.querySelectorAll('[data-gallery-carousel]').forEach(function (carousel) {
      updateCarousel(carousel, Number(carousel.dataset.index) || 0);
    });
    root.querySelectorAll('.ds-comment--customer-gallery').forEach(function (dialog) {
      dialog.addEventListener('close', function () { restoreGalleryFocus(dialog); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { initialize(document); });
  else initialize(document);
}());
