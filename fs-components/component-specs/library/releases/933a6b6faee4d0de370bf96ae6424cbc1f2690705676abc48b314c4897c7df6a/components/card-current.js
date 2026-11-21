/* Current single-event Card forwards host hover to the real TextButton state.
   Atom CSS owns the state paint. No navigation or historical-card mutation. */
(function () {
  'use strict';
  if (document.__fsCardCurrentHover) return;
  document.__fsCardCurrentHover = true;
  const owned = new WeakMap();
  const selector = '.ds-card[data-card-current="vertical-single-event"]';
  function cardFor(event) {
    return event.target instanceof Element ? event.target.closest(selector) : null;
  }
  function staysInside(card, target) {
    return target instanceof Node && card.contains(target);
  }
  document.addEventListener('mouseover', function (event) {
    const card = cardFor(event);
    if (!card || staysInside(card, event.relatedTarget)) return;
    const child = card.querySelector('.ds-card__link > .ds-text-btn--inline');
    if (!child || child.matches(':disabled') || child.closest('[hidden],[aria-disabled="true"]') || child.classList.contains('ds-text-btn--hover')) return;
    child.classList.add('ds-text-btn--hover');
    owned.set(card, child);
  });
  document.addEventListener('mouseout', function (event) {
    const card = cardFor(event);
    if (!card || staysInside(card, event.relatedTarget)) return;
    const child = owned.get(card);
    if (child) child.classList.remove('ds-text-btn--hover');
    owned.delete(card);
  });
  // Existing Card Preview coordinates mutually exclusive product compatibility.
  // Keep that host behavior on the actual finite call; standalone Tag stays unchanged.
  document.addEventListener('ds:tag-change', function (event) {
    const tag = event.target.closest('button[data-tag-product="current"]');
    const group = tag && tag.closest('.ds-card__compat-tags');
    const card = group && group.closest('[data-card-current="embedded-full"]');
    if (!card || tag.matches(':disabled') || tag.closest('[hidden],[aria-disabled="true"]')) return;
    group.querySelectorAll('button[data-tag-product="current"]').forEach(function (item) {
      item.removeAttribute('data-tag-state');
      item.setAttribute('aria-pressed', String(item === tag));
    });
  });
}());
