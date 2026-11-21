(function () {
  'use strict';
  if (document.__fsCarouselCurrent) return;
  document.__fsCarouselCurrent = true;
  function initialize(root) {
    if (root.dataset.carouselReady === 'true') return;
    var track = root.querySelector(':scope > .ds-carousel__track');
    var prev = root.querySelector(':scope > .ds-carousel__btn--prev');
    var next = root.querySelector(':scope > .ds-carousel__btn--next');
    var group = root.querySelector(':scope > .ds-carousel__dots');
    var light = root.getAttribute('data-carousel-current') === 'light-five';
    if (!track || !prev || !next || (!light && !group) || (light && group)) return;
    var slides = Array.from(track.children), dots = group ? Array.from(group.children) : [];
    if (slides.length !== (light ? 5 : 7) || (!light && dots.length !== 7) || dots.some(function (dot, i) { return dot.dataset.index !== String(i); })) return;
    function unavailable(control) { return !control.isConnected || control.matches(':disabled') || !!control.closest('[hidden], [aria-disabled="true"]'); }
    root.dataset.carouselReady = 'true';
    var current = 0;
    function goTo(index) {
      if (!Number.isInteger(index) || index < 0 || index >= slides.length) return;
      current = index;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('ds-carousel__dot--active', i === current);
        if (i === current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      slides.forEach(function (slide, i) { slide.setAttribute('aria-hidden', String(i !== current)); });
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
    }
    prev.addEventListener('click', function () { if (!unavailable(prev) && current > 0) goTo(current - 1); });
    next.addEventListener('click', function () { if (!unavailable(next) && current < slides.length - 1) goTo(current + 1); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { if (!unavailable(dot)) goTo(i); }); });
    goTo(0);
  }
  function start() { document.querySelectorAll('[data-carousel-current].ds-carousel').forEach(initialize); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}());
