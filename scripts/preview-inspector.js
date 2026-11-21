/* FS Design System — Local Preview Inspector Overlay (non-invasive, dev preview only) */
(function () {
  if (window.__FS_PREVIEW_INSPECTOR__) return;
  window.__FS_PREVIEW_INSPECTOR__ = true;

  const pathname = window.location.pathname || '';
  const m = /\/pages\/([a-z0-9_-]+)\.html$/i.exec(pathname);
  const slug = m ? m[1] : null;

  const style = document.createElement('style');
  style.id = 'fs-inspector-style';
  style.textContent = `
    #fs-insp-fab {
      position: fixed; right: 20px; bottom: 20px; z-index: 99999;
      display: inline-flex; align-items: center; gap: 6px;
      height: 36px; padding: 0 14px; border-radius: 18px;
      border: 1px solid #19191A; background: #19191A; color: #FFFFFF;
      font: 600 13px/1 "Open Sans", Arial, sans-serif; cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
    }
    #fs-insp-fab:hover { background: #C00000; border-color: #C00000; }
    #fs-insp-drawer {
      position: fixed; top: 0; right: 0; bottom: 0; width: 380px; z-index: 99998;
      background: #FFFFFF; border-left: 1px solid #DEDEDE;
      box-shadow: -6px 0 24px rgba(0,0,0,0.12);
      display: flex; flex-direction: column;
      font: 400 13px/1.5 "Open Sans", Arial, sans-serif; color: #19191A;
    }
    #fs-insp-drawer[hidden] { display: none; }
    .fs-insp-head {
      padding: 14px 16px; border-bottom: 1px solid #ECECEC;
      display: flex; align-items: center; justify-content: space-between;
    }
    .fs-insp-title { font-size: 14px; font-weight: 600; margin: 0; }
    .fs-insp-close {
      border: 0; background: transparent; font-size: 18px; line-height: 1;
      cursor: pointer; color: #6B6B6E; padding: 2px 6px;
    }
    .fs-insp-body { flex: 1 1 auto; overflow-y: auto; padding: 14px 16px; display: flex; flex-direction: column; gap: 14px; }
    .fs-insp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .fs-insp-stat { background: #FAFBFB; border: 1px solid #ECECEC; border-radius: 6px; padding: 8px 10px; }
    .fs-insp-stat-k { font-size: 11px; color: #6B6B6E; }
    .fs-insp-stat-v { font-size: 16px; font-weight: 600; color: #19191A; margin-top: 2px; }
    .fs-insp-toggles { display: flex; flex-direction: column; gap: 8px; }
    .fs-insp-toggle {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 10px; border: 1px solid #DEDEDE; border-radius: 6px; cursor: pointer;
    }
    .fs-insp-sec-title { font-size: 12px; font-weight: 600; color: #6B6B6E; text-transform: uppercase; letter-spacing: 0.4px; margin: 0 0 6px; }
    .fs-insp-list { display: flex; flex-direction: column; gap: 8px; }
    .fs-insp-item { border: 1px solid #ECECEC; border-radius: 6px; padding: 8px 10px; background: #FFFFFF; }
    .fs-insp-item-h { font-weight: 600; font-size: 12px; color: #19191A; }
    .fs-insp-item-m { font-size: 11px; color: #6B6B6E; margin-top: 3px; }
    .fs-insp-thumb { width: 100%; height: auto; border-radius: 4px; border: 1px solid #ECECEC; margin-top: 6px; display: block; cursor: pointer; }
    body.fs-insp-hl-extend [data-fs-extend] {
      outline: 2px dashed #7C3AED !important; outline-offset: 2px; position: relative;
    }
    body.fs-insp-hl-absent [data-fs-insp-absent="1"] {
      outline: 2px dashed #D97706 !important; outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);

  // Tag elements whose data-library-props includes sourceAbsent
  const libNodes = Array.from(document.querySelectorAll('[data-library-component]'));
  const absentNodes = [];
  libNodes.forEach((el) => {
    const raw = el.getAttribute('data-library-props') || '';
    if (raw.includes('sourceAbsent')) {
      el.setAttribute('data-fs-insp-absent', '1');
      absentNodes.push(el);
    }
  });
  const extendNodes = Array.from(document.querySelectorAll('[data-fs-extend]'));
  const allImgs = Array.from(document.querySelectorAll('img'));
  const loadedImgs = allImgs.filter((i) => i.complete && i.naturalWidth > 0);

  const fab = document.createElement('button');
  fab.id = 'fs-insp-fab';
  fab.type = 'button';
  fab.textContent = 'FS 核对';
  document.body.appendChild(fab);

  const drawer = document.createElement('aside');
  drawer.id = 'fs-insp-drawer';
  drawer.hidden = true;
  drawer.innerHTML = `
    <div class="fs-insp-head">
      <h3 class="fs-insp-title">FS 页面核对浮层 ${slug ? '(' + slug + ')' : ''}</h3>
      <button type="button" class="fs-insp-close" aria-label="关闭">×</button>
    </div>
    <div class="fs-insp-body">
      <div class="fs-insp-grid">
        <div class="fs-insp-stat"><div class="fs-insp-stat-k">原生组件实例</div><div class="fs-insp-stat-v">${libNodes.length}</div></div>
        <div class="fs-insp-stat"><div class="fs-insp-stat-k">图片加载率</div><div class="fs-insp-stat-v">${loadedImgs.length}/${allImgs.length}</div></div>
        <div class="fs-insp-stat"><div class="fs-insp-stat-k">data-fs-extend</div><div class="fs-insp-stat-v" style="color:#7C3AED">${extendNodes.length}</div></div>
        <div class="fs-insp-stat"><div class="fs-insp-stat-k">sourceAbsent</div><div class="fs-insp-stat-v" style="color:#D97706">${absentNodes.length}</div></div>
      </div>
      <div class="fs-insp-toggles">
        <label class="fs-insp-toggle"><span>高亮业务扩展 (data-fs-extend)</span><input type="checkbox" id="fs-insp-cb-extend"></label>
        <label class="fs-insp-toggle"><span>高亮省略槽位 (sourceAbsent)</span><input type="checkbox" id="fs-insp-cb-absent"></label>
      </div>
      <div>
        <div class="fs-insp-sec-title">扩展点明细 (${extendNodes.length})</div>
        <div class="fs-insp-list" id="fs-insp-extend-list">${
          extendNodes.length
            ? extendNodes.map((n, i) => `<div class="fs-insp-item"><div class="fs-insp-item-h">#${i + 1} ${n.getAttribute('data-fs-extend')}</div><div class="fs-insp-item-m">&lt;${n.tagName.toLowerCase()} class="${n.className || ''}"&gt;</div></div>`).join('')
            : '<div class="fs-insp-item-m">本页未使用 data-fs-extend</div>'
        }</div>
      </div>
      <div>
        <div class="fs-insp-sec-title">原站区块信号对照 (Page IR / Scan)</div>
        <div class="fs-insp-list" id="fs-insp-source-list"><div class="fs-insp-item-m">点击展开后自动加载原站快照...</div></div>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);

  let loadedSource = false;
  async function loadSourceSignals() {
    if (loadedSource || !slug) return;
    loadedSource = true;
    const box = drawer.querySelector('#fs-insp-source-list');
    try {
      const res = await fetch(`/reference-inputs/${slug}/page-ir.json`);
      if (res.ok) {
        const ir = await res.json();
        const secs = ir.sections || [];
        box.innerHTML = secs.map((s) => {
          const title = (s.headings && s.headings[0]) || s.id || `Section ${s.index}`;
          const flags = [
            s.tabs && s.tabs.length ? `Tab(${s.tabs.length})` : '',
            s.hasForm ? 'Form' : '',
            s.hasVideo ? 'Video' : '',
            s.collapsedDrawers && s.collapsedDrawers.length ? `折叠(${s.collapsedDrawers.length})` : '',
            s.imageCount ? `图(${s.imageCount})` : '',
          ].filter(Boolean).join(' · ');
          const thumb = s.sourceScreenshot ? `<img class="fs-insp-thumb" src="/${s.sourceScreenshot}" alt="${title}" loading="lazy" onclick="window.open(this.src,'_blank')">` : '';
          return `<div class="fs-insp-item"><div class="fs-insp-item-h">SEC ${s.index}: ${title}</div><div class="fs-insp-item-m">${flags || '常规内容区块'}</div>${thumb}</div>`;
        }).join('') || '<div class="fs-insp-item-m">page-ir.json 中无区块记录</div>';
        return;
      }
      const sres = await fetch(`/reference-inputs/${slug}/scan-report.json`);
      if (sres.ok) {
        const sr = await sres.json();
        const secs = sr.sections || [];
        box.innerHTML = secs.map((s, i) => `<div class="fs-insp-item"><div class="fs-insp-item-h">SEC ${i + 1}: ${s.title || s.id || 'Section'}</div><div class="fs-insp-item-m">${(s.signals || []).join(' · ') || '常规内容'}</div></div>`).join('');
        return;
      }
      box.innerHTML = `<div class="fs-insp-item-m">未找到 reference-inputs/${slug}/page-ir.json 或 scan-report.json</div>`;
    } catch (e) {
      box.innerHTML = `<div class="fs-insp-item-m">加载原站信号失败: ${e.message}</div>`;
    }
  }

  fab.addEventListener('click', () => {
    drawer.hidden = !drawer.hidden;
    if (!drawer.hidden) loadSourceSignals();
  });
  drawer.querySelector('.fs-insp-close').addEventListener('click', () => {
    drawer.hidden = true;
  });
  drawer.querySelector('#fs-insp-cb-extend').addEventListener('change', (e) => {
    document.body.classList.toggle('fs-insp-hl-extend', e.target.checked);
  });
  drawer.querySelector('#fs-insp-cb-absent').addEventListener('change', (e) => {
    document.body.classList.toggle('fs-insp-hl-absent', e.target.checked);
  });
})();
