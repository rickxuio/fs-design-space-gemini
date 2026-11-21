/* Adapt current local component samples to the existing documentation shell.
   Source HTML, canonical components and standalone validation pages stay intact. */
(function () {
  'use strict';
  window.FSLocalPrototypeFrame = {
    bind: function (frame, options) {
      frame.style.visibility = 'hidden';
      frame.addEventListener('load', function () {
        if (!frame.isConnected) return;
        var doc = frame.contentDocument, child = frame.contentWindow, stage = options.stage;
        var single = stage.classList.contains('stage--single');
        if (!doc || !doc.body) { frame.style.removeProperty('visibility'); return; }
        var style = doc.createElement('style');
        style.id = 'local-prototype-document-mode';
        style.textContent = 'body > [data-library-component="library-navigation"]{display:none!important}'
          + (single ? 'html{overflow:auto!important}' : 'html{overflow-y:hidden!important;overflow-x:auto!important}')
          + '.container:has(>.state-header){overflow-x:auto}'
          + '.local-prototype-return{outline:2px solid #0060BF;outline-offset:4px}';
        doc.head.appendChild(style);
        frame.style.removeProperty('visibility');
        frame.setAttribute('scrolling', single ? 'yes' : 'no');
        var pending = false;
        function measure() {
          if (single) return;
          if (!frame.isConnected) return;
          // Use real content, never viewport-dependent scrollHeight: avoids growth loops.
          var main = doc.querySelector('body > main');
          if (!main) return;
          var height = Math.ceil(main.getBoundingClientRect().bottom + child.scrollY);
          if (Math.abs(parseFloat(frame.style.height || 0) - height) > 1) frame.style.height = height + 'px';
        }
        function schedule() {
          if (pending || !frame.isConnected) return;
          pending = true;
          requestAnimationFrame(function () { pending = false; measure(); });
        }
        function reveal(target) {
          if (!target || !frame.isConnected) return;
          if (single) { child.scrollTo(0, target.getBoundingClientRect().top + child.scrollY - 24); return; }
          child.scrollTo(0, 0);
          stage.scrollTop += frame.getBoundingClientRect().top + target.getBoundingClientRect().top - stage.getBoundingClientRect().top - 24;
        }
        var observer = new ResizeObserver(schedule);
        observer.observe(doc.body);
        child.addEventListener('resize', schedule);
        child.addEventListener('pagehide', function () { observer.disconnect(); });
        if (doc.fonts) doc.fonts.ready.then(schedule);
        schedule();
        child.addEventListener('message', function (event) {
          if (event.source !== window || !frame.isConnected) return;
          var data = event.data || {};
          if (data.__dsRevealAnchor) reveal(doc.getElementById(String(data.__dsRevealAnchor).replace(/^#/, '')));
          var ret = data.__dsReturnTo;
          if (ret && ret.partId === options.partId) {
            var links = Array.from(doc.querySelectorAll('a[href]'));
            var link = links[ret.index];
            if (!link || link.getAttribute('href') !== ret.href) link = links.find(function (n) { return n.getAttribute('href') === ret.href; });
            if (link) {
              // Earlier frames can still grow while loading: restore only after the whole group settles.
              var ready = Array.from(stage.querySelectorAll('iframe')).map(function (other) {
                return new Promise(function (resolve) {
                  function loaded() {
                    try { Promise.resolve(other.contentDocument.fonts && other.contentDocument.fonts.ready).then(resolve, resolve); }
                    catch (error) { resolve(); }
                  }
                  if (other.contentDocument && other.contentDocument.readyState === 'complete' && other.contentDocument.URL !== 'about:blank') loaded();
                  else other.addEventListener('load', loaded, { once: true });
                });
              });
              Promise.all(ready).then(function () {
                requestAnimationFrame(function () { requestAnimationFrame(function () {
                  if (!frame.isConnected) return;
                  reveal(link);
                  link.classList.add('local-prototype-return');
                  setTimeout(function () { link.classList.remove('local-prototype-return'); }, 2500);
                }); });
              });
            }
          }
        });
        doc.addEventListener('click', function (event) {
          var link = event.target.closest('a[href]');
          if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          var href = link.getAttribute('href'), url = new URL(href, doc.baseURI);
          if (href.charAt(0) === '#') {
            var target = doc.getElementById(decodeURIComponent(href.slice(1)));
            if (target) { event.preventDefault(); reveal(target); }
            return;
          }
          if (url.origin !== location.origin) return;
          var match = url.pathname.match(/\/design-system\/components\/preview\/([\w-]+)\.html$/);
          if (match && match[1] !== options.partId && options.navigate(match[1], url.hash, {
            href: href, index: Array.from(doc.querySelectorAll('a[href]')).indexOf(link), partId: options.partId
          })) {
            event.preventDefault();
            return;
          }
          // Original specification, evidence and assets stay accessible without replacing this frame.
          link.target = '_blank';
          link.rel = 'noopener';
        });
      });
    }
  };
})();
