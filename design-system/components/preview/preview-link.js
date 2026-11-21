/* ============================================================
   preview-link.js — 组件预览内「跳转到其它组件/元素」的桥接 + 落地高亮
   ------------------------------------------------------------
   1) 落地高亮：从跨组件链接跳来时，父页会给本页带 #__dsland 标记，
      此时高亮本页标题(h1)，给用户「你到了哪个组件」的明确反馈。
      （token/图标等有真实锚点的跳转，由目标页自身的锚点高亮/:target 处理）
   2) 跨页链接桥接：在组件库 iframe 中点击 <a href="xxx.html[#hash]">，
      拦截并 postMessage({__dsNavigate:id, __dsHash}) 给父页，
      由父页切换组件 + 传递锚点，而不是在 iframe 内部替换预览。
   ============================================================ */
(function () {
  var LAND = '#__dsland';

  // 找页面里第一个「真实组件实例」用来框住高亮：
  // 组件用 ds-*、token 展示用 dst-*、图标总览用 .icon-card
  function firstComponent() {
    var els = document.querySelectorAll(
      '[class*="ds-"],.icon-card,.dst-color-card,.dst-radius-item,.dst-shadow-item,.dst-token-row,.dst-border-card,.dst-type-table'
    );
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var r = el.getBoundingClientRect();
      if (r.width >= 24 && r.height >= 16) return el; // 跳过不可见/过小的内部元素
    }
    return null;
  }

  function landFlash() {
    if (location.hash !== LAND) return;
    var target = firstComponent() || document.querySelector('h1') || document.body;
    if (!document.getElementById('ds-land-flash-style')) {
      var s = document.createElement('style');
      s.id = 'ds-land-flash-style';
      s.textContent = '.ds-land-flash{outline:2px solid var(--color-blue,#0060BF);outline-offset:6px;border-radius:6px;'
        + 'box-shadow:0 0 0 6px rgba(0,96,191,0.12);transition:outline-color .3s ease, box-shadow .3s ease;}';
      document.head.appendChild(s);
    }
    // 清掉标记 hash，避免刷新/残留时重复触发
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    target.classList.add('ds-land-flash');
    try { target.scrollIntoView({ block: 'center' }); } catch (e) {}
    setTimeout(function () { target.classList.remove('ds-land-flash'); }, 2500);
  }

  if (document.readyState !== 'loading') landFlash();
  else document.addEventListener('DOMContentLoaded', landFlash);

  // —— 以下桥接仅在组件库 iframe 中生效；独立打开预览页保持默认行为 ——
  if (window.parent === window) return;

  // 合并视图会由 Preview 自撑高并关闭内部滚动；单组件视图由父页通知恢复自身滚动。
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.__dsFrameMode !== 'single') return;
    if (document.documentElement) {
      document.documentElement.style.setProperty('overflow', 'auto', 'important');
    }
    if (document.body) {
      document.body.style.setProperty('overflow-y', 'auto', 'important');
    }
  });

  // 合并视图中的精确落点由父页滚动，子 iframe 自身始终保持 scrollY=0，
  // 避免 hash 让 iframe 内部滚动后只显示组件页面的一部分。
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !d.__dsRevealAnchor) return;
    var id = String(d.__dsRevealAnchor).replace(/^#/, '');
    var target = id ? document.getElementById(id) : null;
    if (!target) return;
    var offset = target.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0);
    try { window.scrollTo(0, 0); } catch (err) {}
    window.parent.postMessage({
      __dsAnchorOffset: offset,
      __dsAnchorId: id
    }, '*');
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/^(https?:|mailto:)/i.test(href)) return;          // 外链不拦截
    if (href.charAt(0) === '#') return;                     // 页内锚点交给浏览器
    var m = href.match(/^([\w-]+)\.html(#.*)?$/);            // 仅拦截 "<name>.html[#hash]"
    if (!m) return;
    e.preventDefault();
    // 记录被点链接在本页的定位符（全局 a[href] 序号 + href），供返回时精确回到原位并高亮。
    var allLinks = document.querySelectorAll('a[href]');
    var idx = Array.prototype.indexOf.call(allLinks, a);
    window.parent.postMessage({
      __dsNavigate: m[1],
      __dsHash: m[2] || '',
      __dsReturn: { href: href, index: idx }
    }, '*');
  });

  // 返回落点高亮：父页出栈切回来源页后，把当初点击的链接定位符回传（__dsReturnTo），
  // 本页据此找回该链接，滚动到它并高亮 2.5s，让用户知道自己是从哪里点出去的。
  function ensureReturnFlashStyle() {
    if (document.getElementById('ds-return-flash-style')) return;
    var s = document.createElement('style');
    s.id = 'ds-return-flash-style';
    s.textContent = '.ds-return-flash{outline:2px solid var(--color-blue,#0060BF);outline-offset:3px;'
      + 'border-radius:4px;background:rgba(0,96,191,0.10);box-shadow:0 0 0 6px rgba(0,96,191,0.12);'
      + 'transition:outline-color .3s ease,box-shadow .3s ease,background .3s ease;}';
    document.head.appendChild(s);
  }

  function returnFlash(ret) {
    if (!ret) return;
    var links = Array.prototype.slice.call(document.querySelectorAll('a[href]'));
    var el = null;
    if (typeof ret.index === 'number' && links[ret.index] && links[ret.index].getAttribute('href') === ret.href) {
      el = links[ret.index]; // 首选：序号 + href 双重命中（同一页重载后序号稳定）
    }
    if (!el && ret.href) {
      for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute('href') === ret.href) { el = links[i]; break; }
      }
    }
    if (!el) return;
    ensureReturnFlashStyle();
    el.classList.add('ds-return-flash');
    try { el.scrollIntoView({ block: 'center' }); } catch (e) {}
    setTimeout(function () { el.classList.remove('ds-return-flash'); }, 2500);
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.__dsReturnTo) returnFlash(d.__dsReturnTo);
  });

  // 「返回」浮层：父页通过 postMessage({__dsBackTarget:{id,label}}) 通知本页栈顶来源，
  //   为 null 时移除按钮；点击后回传 {__dsGoBack:true}，父页出栈并切回来源预览。
  function ensureBackButtonStyle() {
    if (document.getElementById('ds-back-btn-style')) return;
    var s = document.createElement('style');
    s.id = 'ds-back-btn-style';
    s.textContent = '#ds-back-btn{position:fixed;top:16px;right:16px;z-index:9999;display:inline-flex;'
      + 'align-items:center;gap:6px;padding:8px 14px;background:#19191A;border:1px solid #19191A;'
      + 'border-radius:20px;box-shadow:0 4px 12px rgba(0,0,0,0.18);font-family:inherit;font-size:12px;'
      + 'font-weight:600;line-height:1;color:#FFFFFF;cursor:pointer;transition:background .15s ease,'
      + 'border-color .15s ease,transform .1s ease;}'
      + '#ds-back-btn:hover{background:#3D3D3D;border-color:#3D3D3D;}'
      + '#ds-back-btn:active{transform:translateY(1px);}'
      + '#ds-back-btn__arrow{font-size:14px;line-height:1;color:#FFFFFF;}';
    document.head.appendChild(s);
  }

  function renderBackButton(target) {
    var existing = document.getElementById('ds-back-btn');
    if (!target) {
      if (existing) existing.remove();
      return;
    }
    ensureBackButtonStyle();
    if (existing) existing.remove();
    var btn = document.createElement('button');
    btn.id = 'ds-back-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', '返回 ' + target.label);
    btn.innerHTML = '<span id="ds-back-btn__arrow">←</span><span>返回 ' + target.label + '</span>';
    btn.addEventListener('click', function () {
      window.parent.postMessage({ __dsGoBack: true }, '*');
    });
    // 放在 body 开头，避免各 Preview 的自动高度脚本把 fixed 返回按钮误判为最后一个内容元素，
    // 导致目标分片被压缩到按钮自身高度。
    document.body.insertBefore(btn, document.body.firstChild);
  }

  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || !Object.prototype.hasOwnProperty.call(d, '__dsBackTarget')) return;
    renderBackButton(d.__dsBackTarget);
  });
})();
