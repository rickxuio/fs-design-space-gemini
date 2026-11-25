/* Card hover shows card elevation only; TextButton owns its own :hover underline state. */
(function () {
  'use strict';
  if (document.__fsCardCurrentHover) return;
  document.__fsCardCurrentHover = true;
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
