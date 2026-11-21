/* ============================================================
   tokens-data.js — 设计令牌展示的单一数据源
   ------------------------------------------------------------
   · 只维护「元数据」：token 规范名(token) + CSS 变量(var) + 标签 + 分组
   · 数值（颜色/字号/间距/描边/圆角/阴影）一律用 getComputedStyle 从 tokens.css 实时读取
   · 每个元素渲染出 id="tok-<token 规范名，点换成短横>"，供依赖表锚点直达
   · tokens.html（总览）与 color/font/spacing/stroke/radius/shadow.html（拆分页）共用本文件
   ============================================================ */
(function () {
  var rootStyle = getComputedStyle(document.documentElement);
  function val(v) { return v ? rootStyle.getPropertyValue(v).trim() : ''; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function anchorId(token) { return token ? 'tok-' + token.replace(/\./g, '-') : ''; }

  // 同一 token 在多个分组重复出现时，只给首次出现加 id，避免重复 id
  var usedIds;
  function idAttr(token) {
    if (!token) return '';
    var id = anchorId(token);
    if (usedIds[id]) return '';
    usedIds[id] = true;
    return ' id="' + id + '"';
  }

  /* ---------- 元数据（token=规范名，var=CSS 变量，数值实时读取） ---------- */
  var COLOR_GROUPS = [
    { group: '品牌 & 强调', items: [
      { token: 'color.brand-red', var: '--brand-red', name: 'Brand Red' },
      { token: 'color.blue', var: '--color-blue', name: 'Blue' },
      { token: 'color.white', var: '--color-white', name: 'White', border: true },
    ]},
    { group: '灰阶', items: [
      { token: 'color.gray-1', var: '--color-gray-1', name: 'Gray 1' },
      { token: 'color.gray-2', var: '--color-gray-2', name: 'Gray 2' },
      { token: 'color.gray-3', var: '--color-gray-3', name: 'Gray 3' },
      { token: 'color.gray-5', var: '--color-gray-5', name: 'Gray 5' },
      { token: 'color.gray-6', var: '--color-gray-6', name: 'Gray 6' },
      { token: 'color.gray-7', var: '--color-gray-7', name: 'Gray 7' },
      { token: 'color.gray-8', var: '--color-gray-8', name: 'Gray 8' },
      { token: 'color.gray-9', var: '--color-gray-9', name: 'Gray 9' },
    ]},
    { group: '状态 & 标签', items: [
      { token: 'color.success', var: '--color-success', name: 'Success' },
      { token: 'color.warning', var: '--color-warning', name: 'Warning' },
      { token: 'color.error', var: '--color-error', name: 'Error' },
      { token: 'color.text-purple', var: '--color-text-purple', name: 'Purple Tag' },
      { token: 'color.yellow', var: '--color-yellow', name: 'Yellow (Featured / Pending)' },
      { token: 'color.sold-label', var: '--color-sold-label', name: 'Sold Label' },
    ]},
    { group: '成功标签底 / 文字', items: [
      { token: 'color.success-bg', var: '--color-success-bg', name: 'Success BG' },
      { token: 'color.success-tag-bg', var: '--color-success-tag-bg', name: 'Success Tag BG' },
      { token: 'color.success-tag-text', var: '--color-success-tag-text', name: 'Success Tag Text' },
    ]},
    { group: '文字状态', items: [
      { token: 'color.text-disabled', var: '--color-text-disabled', name: 'Text Disabled' },
    ]},
    { group: '允许的 UI 表面背景 Allowed Surface Backgrounds',
      intro: '仅以下颜色可用于 UI 表面背景。禁止使用黄色、橙色、青色、绿色、紫色或任何非系统色。<br><code>color.gray-1</code> 的典型背景场景是深色 Banner，禁止作为 Banner 之外任何组件或页面模块的背景色。深色 Banner 内文字仅允许白色 <code>#FFFFFF</code> — 不允许彩色 span。',
      items: [
        { token: 'color.white', var: '--color-white', name: 'White', border: true, desc: 'section bg, card surfaces' },
        { token: 'color.gray-9', var: '--color-gray-9', name: 'Gray 9', desc: 'gray section bg, topbar' },
        { token: 'color.gray-1', var: '--color-gray-1', name: 'Gray 1', desc: 'typical dark banner bg; forbidden for non-Banner surfaces' },
        { token: 'color.gray-2', var: '--color-gray-2', name: 'Gray 2', desc: 'dark button bg' },
      ]},
    { group: 'Hover 叠加层', items: [
      { token: 'color.hover-overlay', var: '--color-hover-overlay', name: 'Hover Dark' },
      { token: 'color.hover-overlay-light', var: '--color-hover-overlay-light', name: 'Hover Light' },
      { token: 'color.blue-hover-overlay', var: '--color-blue-hover-overlay', name: 'Hover Blue' },
    ]},
    { group: '半透明', items: [
      { token: 'color.dialog-backdrop', var: '--color-dialog-backdrop', name: 'Dialog Backdrop' },
      { token: 'color.white-translucent', var: '--color-white-translucent', name: 'White Translucent' },
    ]},
    { group: '图片遮罩（白字压图）', items: [
      { literal: 'rgba(0,0,0,0.5)', name: 'Image Mask', hexText: 'rgba(0,0,0,0.45~0.55)', desc: 'box-shadow: inset · 未 token 化' },
    ]},
  ];

  var WEIGHT_ROWS = [
    { token: 'typography.font-weight-regular', var: '--font-weight-regular', name: 'Regular', sample: '正文内容 Body text' },
    { token: 'typography.font-weight-semibold', var: '--font-weight-semibold', name: 'SemiBold', sample: '标题 Heading' },
  ];

  var TYPE_ROWS = [
    { level: 'H1', token: 'typography.h1-semibold', sizeToken: 'typography.font-size-h1', sizeVar: '--font-size-h1', lhVar: '--line-height-h1', weight: 600, sample: '标题 Heading' },
    { level: 'H2', token: 'typography.h2-semibold', sizeToken: 'typography.font-size-h2', sizeVar: '--font-size-h2', lhVar: '--line-height-h2', weight: 600, sample: '标题 Heading' },
    { level: 'H3', token: 'typography.h3-semibold', sizeToken: 'typography.font-size-h3', sizeVar: '--font-size-h3', lhVar: '--line-height-h3', weight: 600, sample: 'Section Title' },
    { level: 'H4', token: 'typography.h4-semibold', sizeToken: 'typography.font-size-h4', sizeVar: '--font-size-h4', lhVar: '--line-height-h4', weight: 600, sample: 'Card Title' },
    { level: 'H5', token: 'typography.h5-semibold', sizeToken: 'typography.font-size-h5', sizeVar: '--font-size-h5', lhVar: '--line-height-h5', weight: 600, sample: 'Sub Heading' },
    { level: 'H6', token: 'typography.h6-semibold', sizeToken: 'typography.font-size-h6', sizeVar: '--font-size-h6', lhVar: '--line-height-h6', weight: 600, sample: 'Form Title' },
    { level: 'H6', token: 'typography.h6-regular', sizeToken: 'typography.font-size-h6', sizeVar: '--font-size-h6', lhVar: '--line-height-h6', weight: 400, sample: '16px Body Regular' },
    // H7=14px 即 font-size-md 别名；Body 复用 H7。
    { level: 'H7', token: 'typography.h7-semibold', sizeToken: 'typography.font-size-md', sizeVar: '--font-size-h7', lhVar: '--line-height-h7', weight: 600, sample: 'Card Title (vertical)', varLabel: '--font-size-h7' },
    { level: 'Body', token: 'typography.h7-regular', sizeToken: 'typography.font-size-md', sizeVar: '--font-size-h7', lhVar: '--line-height-h7', weight: 400, sample: '正文内容 Body text', varLabel: '--font-size-h7' },
    { level: 'H8', token: 'typography.h8-semibold', sizeToken: 'typography.font-size-h8', sizeVar: '--font-size-h8', lhVar: '--line-height-h8', weight: 600, sample: 'Compact Label SemiBold' },
    { level: 'H8', token: 'typography.h8-regular', sizeToken: 'typography.font-size-h8', sizeVar: '--font-size-h8', lhVar: '--line-height-h8', weight: 400, sample: 'Form Label 表单标签' },
    // H9=12px 即 font-size-sm 别名。
    { level: 'H9', token: 'typography.h9-semibold', sizeToken: 'typography.font-size-sm', sizeVar: '--font-size-h9', lhVar: '--line-height-h9', weight: 600, sample: 'Caption SemiBold' },
    { level: 'H9', token: 'typography.h9-regular', sizeToken: 'typography.font-size-sm', sizeVar: '--font-size-h9', lhVar: '--line-height-h9', weight: 400, sample: 'Caption 辅助文字', muted: true },
    { level: '10', token: 'typography.10-semibold', size: '10px', lineHeight: '1', weight: 600, sample: 'Mobile Badge' },
  ];

  var RADII = [
    { token: 'border-radius.sm',   var: '--border-radius-sm',   name: 'SM',           w: 80,  h: 80 },
    { token: 'border-radius.md',   var: '--border-radius-md',   name: 'MD (default)', w: 80,  h: 80 },
    { token: 'border-radius.lg',   var: '--border-radius-lg',   name: 'LG',           w: 80,  h: 80 },
    { token: 'border-radius.full', var: '--border-radius-full', name: 'Pill',         w: 120, h: 48 },
  ];

  var SHADOWS = [
    { token: 'shadow.sm', var: '--shadow-sm', name: 'SM' },
    { token: 'shadow.md', var: '--shadow-md', name: 'MD' },
    { token: 'shadow.lg', var: '--shadow-lg', name: 'LG' },
    { literal: '0 15px 15px -10px rgba(0,0,0,0.1)', name: 'Card Hover', note: '未 token 化' },
  ];

  /* ---------- 展示样式（注入一次，命名空间 dst-；含 scroll-margin 便于锚点定位） ---------- */
  var STYLE = ''
    + '.dst-group-label{font-size:12px;font-weight:600;color:var(--color-gray-3);text-transform:uppercase;letter-spacing:.5px;margin:0 0 16px;}'
    + '.dst-intro{font-size:12px;color:var(--color-gray-3);margin-bottom:16px;line-height:20px;}'
    + '.dst-color-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px;margin-bottom:32px;}'
    + '.dst-color-card{border:1px solid var(--color-gray-5);border-radius:8px;overflow:hidden;scroll-margin-top:24px;transition:box-shadow .3s ease;}'
    + '.dst-color-card__swatch{height:72px;}'
    + '.dst-color-card__info{padding:10px 12px;}'
    + '.dst-color-card__name{font-size:12px;font-weight:600;line-height:18px;margin-bottom:2px;}'
    + '.dst-color-card__hex{font-size:11px;color:var(--color-gray-3);line-height:16px;margin-bottom:2px;}'
    + '.dst-color-card__var{font-size:10px;color:var(--color-gray-3);line-height:14px;font-family:"SF Mono",Monaco,Consolas,monospace;}'
    + '.dst-type-table{width:100%;border-collapse:collapse;}'
    + '.dst-type-table th{text-align:left;font-size:11px;font-weight:600;color:var(--color-gray-3);text-transform:uppercase;letter-spacing:.3px;padding:8px 12px;border-bottom:2px solid var(--color-gray-5);}'
    + '.dst-type-table td{padding:16px 12px;border-bottom:1px solid var(--color-gray-5);vertical-align:middle;}'
    + '.dst-type-table tr{scroll-margin-top:24px;}'
    + '.dst-type-table tr:last-child td{border-bottom:none;}'
    + '.dst-type-table .dst-spec{font-size:12px;color:var(--color-gray-3);white-space:nowrap;}'
    + '.dst-type-table code{font-family:"SF Mono",Monaco,Consolas,monospace;font-size:11px;color:var(--color-gray-3);background:var(--color-gray-9);padding:1px 6px;border-radius:3px;}'
    + '.dst-radius-grid{display:flex;gap:32px;align-items:flex-end;flex-wrap:wrap;}'
    + '.dst-radius-item{display:flex;flex-direction:column;align-items:center;gap:10px;scroll-margin-top:24px;}'
    + '.dst-radius-box{border:2px solid var(--color-gray-1);background:var(--color-gray-9);}'
    + '.dst-radius-label{font-size:13px;font-weight:600;line-height:20px;}'
    + '.dst-radius-detail{font-size:11px;color:var(--color-gray-3);}'
    + '.dst-radius-var{font-size:10px;color:var(--color-gray-3);font-family:"SF Mono",Monaco,Consolas,monospace;}'
    + '.dst-shadow-wrap{background:var(--color-gray-9);border-radius:12px;padding:40px;display:flex;gap:32px;flex-wrap:wrap;}'
    + '.dst-shadow-item{display:flex;flex-direction:column;align-items:center;gap:12px;scroll-margin-top:24px;}'
    + '.dst-shadow-box{width:160px;height:100px;background:#fff;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;}'
    + '.dst-shadow-name{font-size:13px;font-weight:600;}'
    + '.dst-shadow-value{font-size:10px;color:var(--color-gray-3);font-family:"SF Mono",Monaco,Consolas,monospace;text-align:center;max-width:180px;}'
    // 锚点命中时的高亮
    + '.dst-flash{box-shadow:0 0 0 2px var(--color-blue), 0 0 0 6px var(--color-blue-hover-overlay) !important;}';

  var styleInjected = false;
  function ensureStyle() {
    if (styleInjected) return;
    var s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);
    styleInjected = true;
  }
  function mount(id) { return typeof id === 'string' ? document.getElementById(id) : id; }

  /* ---------- 渲染 ---------- */
  function renderColors(id) {
    ensureStyle(); usedIds = usedIds || {};
    var el = mount(id); if (!el) return;
    var html = '';
    COLOR_GROUPS.forEach(function (g) {
      html += '<p class="dst-group-label">' + g.group + '</p>';
      if (g.intro) html += '<div class="dst-intro">' + g.intro + '</div>';
      html += '<div class="dst-color-grid">';
      g.items.forEach(function (it) {
        var value = it.literal || val(it.var);
        var swatch = 'background:' + value + (it.border ? ';border-bottom:1px solid #DEE0E3' : '');
        var hexText = it.hexText || value;
        var sub = it.desc || it.var || '';
        html += '<div class="dst-color-card"' + idAttr(it.token) + '>'
              +   '<div class="dst-color-card__swatch" style="' + swatch + '"></div>'
              +   '<div class="dst-color-card__info">'
              +     '<div class="dst-color-card__name">' + esc(it.name) + '</div>'
              +     '<div class="dst-color-card__hex">' + esc(hexText) + '</div>'
              +     '<div class="dst-color-card__var">' + esc(sub) + '</div>'
              +   '</div>'
              + '</div>';
      });
      html += '</div>';
    });
    el.innerHTML = html;
  }

  function renderTypography(id) {
    ensureStyle(); usedIds = usedIds || {};
    var el = mount(id); if (!el) return;
    var rows = '';
    TYPE_ROWS.forEach(function (r) {
      var size = r.size || val(r.sizeVar), lh = r.lineHeight || val(r.lhVar);
      var color = r.muted ? 'color:var(--color-gray-3);' : '';
      var weightMeta = WEIGHT_ROWS.filter(function (w) {
        return val(w.var) === String(r.weight);
      })[0];
      var weightLabel = weightMeta ? weightMeta.name + ' ' + r.weight : String(r.weight);
      var sizeVarLabel = r.varLabel || r.sizeVar || '';
      var primitiveVar = sizeVarLabel
        ? '<br><code' + (r.sizeToken ? idAttr(r.sizeToken) : '') + '>' + esc(sizeVarLabel) + '</code>'
        : '';
      rows += '<tr' + idAttr(r.token) + '>'
            +   '<td class="dst-spec">' + r.level + '</td>'
            +   '<td><span style="font-size:' + size + ';font-weight:' + r.weight + ';line-height:' + lh + ';' + color + '">' + esc(r.sample) + '</span></td>'
            +   '<td class="dst-spec">' + size + ' / ' + lh + '</td>'
            +   '<td class="dst-spec"' + (weightMeta ? idAttr(weightMeta.token) : '') + '>' + esc(weightLabel) + '</td>'
            +   '<td class="dst-spec"><code>' + esc(r.token) + '</code>' + primitiveVar + '</td>'
            + '</tr>';
    });
    el.innerHTML = '<p class="dst-group-label">复合字体 Token · Type Scale</p>'
      + '<table class="dst-type-table">'
      + '<thead><tr><th>级别</th><th>示例</th><th>字号 / 行高</th><th>字重</th><th>字体 Token / CSS 变量</th></tr></thead>'
      + '<tbody>' + rows + '</tbody></table>';
  }

  function renderRadius(id) {
    ensureStyle(); usedIds = usedIds || {};
    var el = mount(id); if (!el) return;
    var html = '<div class="dst-radius-grid">';
    RADII.forEach(function (r) {
      var value = val(r.var);
      html += '<div class="dst-radius-item"' + idAttr(r.token) + '>'
            +   '<div class="dst-radius-box" style="width:' + r.w + 'px;height:' + r.h + 'px;border-radius:' + value + ';"></div>'
            +   '<div class="dst-radius-label">' + esc(r.name) + '</div>'
            +   '<div class="dst-radius-detail">' + value + '</div>'
            +   '<div class="dst-radius-var">' + r.var + '</div>'
            + '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  function renderShadows(id) {
    ensureStyle(); usedIds = usedIds || {};
    var el = mount(id); if (!el) return;
    var html = '<div class="dst-shadow-wrap">';
    SHADOWS.forEach(function (s) {
      var value = s.literal || val(s.var);
      var name = esc(s.name) + (s.note ? ' <span style="font-size:10px;color:var(--color-warning);">(' + s.note + ')</span>' : '');
      html += '<div class="dst-shadow-item"' + idAttr(s.token) + '>'
            +   '<div class="dst-shadow-box" style="box-shadow:' + value + ';">' + esc(s.name) + '</div>'
            +   '<div class="dst-shadow-name">' + name + '</div>'
            +   '<div class="dst-shadow-value">' + value + '</div>'
            + '</div>';
    });
    html += '</div>';
    el.innerHTML = html;
  }

  // 加载后若带 hash，滚动到锚点并短暂高亮（iframe 内的原生滚动已生效，这里补高亮反馈）
  function flashHash() {
    var h = location.hash;
    if (!h || h.length < 2) return;
    var el = document.getElementById(h.slice(1));
    if (!el) return;
    var target = el.classList.contains('dst-color-card') || el.classList.contains('dst-radius-item')
              || el.classList.contains('dst-shadow-item') || el.tagName === 'TR' ? el : el;
    target.classList.add('dst-flash');
    setTimeout(function () { target.classList.remove('dst-flash'); }, 1600);
    el.scrollIntoView({ block: 'center' });
  }

  var SPACING_TOKENS = [
    { token: 'spacing.2', var: '--spacing-2', name: '2px', usage: '微间距 / 精细校正' },
    { token: 'spacing.xs', var: '--spacing-xs', name: 'XS', usage: '图标与紧凑内容' },
    { token: 'spacing.6', var: '--spacing-6', name: '6px', usage: '紧凑图标文字间距' },
    { token: 'spacing.sm', var: '--spacing-sm', name: 'SM', usage: '小型组件与列表项' },
    { token: 'spacing.10', var: '--spacing-10', name: '10px', usage: '小型控件内边距' },
    { token: 'spacing.md', var: '--spacing-md', name: 'MD', usage: '常规组件间距' },
    { token: 'spacing.lg', var: '--spacing-lg', name: 'LG', usage: '组件组与常规内边距' },
    { token: 'spacing.20', var: '--spacing-20', name: '20px', usage: '宽松组件内边距' },
    { token: 'spacing.xl', var: '--spacing-xl', name: 'XL', usage: '卡片与内容区块' },
    { token: 'spacing.2xl', var: '--spacing-2xl', name: '2XL', usage: '大型组件组' },
    { token: 'spacing.40', var: '--spacing-40', name: '40px', usage: '页面区块' },
    { token: 'spacing.48', var: '--spacing-48', name: '48px', usage: '页面章节 / 独立模块' },
    { token: 'spacing.3', var: '--spacing-3', name: '3px', usage: '细粒度微调' },
    { token: 'spacing.5', var: '--spacing-5', name: '5px', usage: '徽标紧凑内边距' },
    { token: 'spacing.9', var: '--spacing-9', name: '9px', usage: '紧凑状态内容间距' },
    { token: 'spacing.14', var: '--spacing-14', name: '14px', usage: '过渡间距' },
    { token: 'spacing.25', var: '--spacing-25', name: '25px', usage: '视频按钮水平内边距' },
    { token: 'spacing.36', var: '--spacing-36', name: '36px', usage: '中大型内容区' },
    { token: 'spacing.banner-content-inset', var: '--spacing-banner-content-inset', name: 'Banner Inset', usage: 'Sub / Mini 内容定位' },
    { token: 'spacing.banner-hero-inset', var: '--spacing-banner-hero-inset', name: 'Hero Inset', usage: 'Hero 内容定位' },
    { token: 'spacing.collapse-status-indent', var: '--spacing-collapse-status-indent', name: 'Collapse Status', usage: '数据状态列缩进' },
    { token: 'spacing.collapse-body-indent', var: '--spacing-collapse-body-indent', name: 'Collapse Body', usage: '特征正文缩进' },
    { token: 'spacing.section-y', var: '--spacing-section-y', name: 'Section Y（页面级）', usage: 'section 区块上下留白' },
    { token: 'spacing.container-x', var: '--spacing-container-x', name: 'Container X（页面级）', usage: '版心不增加水平内边距（固定 0px）' },
    { token: 'spacing.grid-gap', var: '--spacing-grid-gap', name: 'Grid Gap（页面级）', usage: '卡片/内容网格列间距' },
    { token: 'spacing.layout-gap', var: '--spacing-layout-gap', name: 'Layout Gap（页面级）', usage: '双栏/内容块间距' },
  ];

  var BORDER_TOKENS = [
    { group: '描边宽度', items: [
      { token: 'border.width.default', var: '--border-width-default', name: 'Default', preview: 'width' },
      { token: 'border.width.strong', var: '--border-width-strong', name: 'Strong', preview: 'width' },
    ]},
    { group: '描边样式', items: [
      { token: 'border.style.default', var: '--border-style-default', name: 'Solid', preview: 'style' },
      { token: 'border.style.none', var: '--border-style-none', name: 'None', preview: 'style' },
    ]},
    { group: '语义描边颜色（复用 Color Token）', items: [
      { token: 'border.color.default', var: '--border-color-default', name: 'Default · gray-5', preview: 'color' },
      { token: 'border.color.strong', var: '--border-color-strong', name: 'Strong · gray-3', preview: 'color' },
      { token: 'border.color.subtle', var: '--border-color-subtle', name: 'Subtle · gray-6', preview: 'color' },
      { token: 'border.color.emphasis', var: '--border-color-emphasis', name: 'Emphasis · gray-1', preview: 'color' },
      { token: 'border.color.inverse', var: '--border-color-inverse', name: 'Inverse · white', preview: 'color', dark: true },
      { token: 'border.color.focus', var: '--border-color-focus', name: 'Focus · blue', preview: 'color' },
      { token: 'border.color.danger', var: '--border-color-danger', name: 'Danger · error', preview: 'color' },
      { token: 'border.color.brand', var: '--border-color-brand', name: 'Brand · brand-red', preview: 'color' },
      { token: 'border.color.transparent', var: '--border-color-transparent', name: 'Transparent', preview: 'color' },
    ]},
  ];

  var extendedStyleInjected = false;
  function ensureExtendedStyle() {
    if (extendedStyleInjected) return;
    var s = document.createElement('style');
    s.textContent = ''
      + '.dst-token-list{border:1px solid var(--color-gray-5);border-radius:8px;overflow:hidden;}'
      + '.dst-token-row{display:grid;grid-template-columns:minmax(170px,1.1fr) minmax(220px,2fr) 90px minmax(140px,1fr);align-items:center;gap:20px;padding:16px 20px;border-bottom:1px solid var(--color-gray-6);scroll-margin-top:24px;}'
      + '.dst-token-row:last-child{border-bottom:none;}.dst-token-name{font-size:12px;font-weight:600;}.dst-token-name code,.dst-token-var{font-family:"SF Mono",Monaco,Consolas,monospace;font-size:11px;}'
      + '.dst-token-label{font-size:11px;color:var(--color-gray-3);margin-top:3px;}.dst-token-value{font-size:12px;font-weight:600;}.dst-token-var{color:var(--color-gray-3);overflow-wrap:anywhere;}'
      + '.dst-space-track{height:16px;background:var(--color-gray-9);border-radius:4px;display:flex;align-items:center;}.dst-space-bar{height:8px;background:var(--color-blue);border-radius:4px;min-width:2px;}'
      + '.dst-border-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-bottom:32px;}.dst-border-card{padding:16px;border:1px solid var(--color-gray-5);border-radius:8px;scroll-margin-top:24px;}'
      + '.dst-border-preview{height:72px;border-radius:6px;background:var(--color-gray-9);display:flex;align-items:center;justify-content:center;margin-bottom:12px;}.dst-border-preview--dark{background:var(--color-gray-1);}'
      + '.dst-border-sample{width:112px;height:36px;border-radius:4px;background:var(--color-white);}.dst-border-card__name{font-size:12px;font-weight:600;margin-bottom:4px;}.dst-border-card__value,.dst-border-card__var{font-size:11px;color:var(--color-gray-3);line-height:18px;overflow-wrap:anywhere;}.dst-border-card__var{font-family:"SF Mono",Monaco,Consolas,monospace;}'
      + '@media(max-width:760px){.dst-token-row{grid-template-columns:1fr;gap:8px;}}';
    document.head.appendChild(s);
    extendedStyleInjected = true;
  }

  function renderSpacing(id) {
    ensureStyle(); ensureExtendedStyle(); usedIds = usedIds || {};
    var el = mount(id); if (!el) return;
    var rows = SPACING_TOKENS.map(function (t) {
      var value = val(t.var), width = Math.max(2, parseFloat(value || '0') * 4);
      return '<div class="dst-token-row"' + idAttr(t.token) + '>'
        + '<div><div class="dst-token-name"><code>' + esc(t.token) + '</code></div><div class="dst-token-label">' + esc(t.name + ' · ' + t.usage) + '</div></div>'
        + '<div class="dst-space-track"><span class="dst-space-bar" style="width:' + width + 'px"></span></div>'
        + '<div class="dst-token-value">' + esc(value) + '</div><div class="dst-token-var">' + esc(t.var) + '</div></div>';
    });
    el.innerHTML = '<div class="dst-token-list">' + rows.join('') + '</div>';
  }

  function renderBorders(id) {
    ensureStyle(); ensureExtendedStyle(); usedIds = usedIds || {};
    var el = mount(id); if (!el) return;
    var html = '<div class="dst-intro">现有组件有效描边以 1px solid 为主，2px 用于强调状态；语义颜色通过 border.color.* 复用现有颜色 Token。</div>';
    BORDER_TOKENS.forEach(function (group) {
      html += '<p class="dst-group-label">' + esc(group.group) + '</p><div class="dst-border-grid">';
      group.items.forEach(function (t) {
        var value = val(t.var), border;
        if (t.preview === 'width') border = value + ' var(--border-style-default) var(--border-color-emphasis)';
        else if (t.preview === 'style') border = 'var(--border-width-strong) ' + value + ' var(--border-color-emphasis)';
        else border = 'var(--border-width-strong) var(--border-style-default) var(' + t.var + ')';
        html += '<div class="dst-border-card"' + idAttr(t.token) + '><div class="dst-border-preview' + (t.dark ? ' dst-border-preview--dark' : '') + '"><div class="dst-border-sample" style="border:' + border + '"></div></div>'
          + '<div class="dst-border-card__name">' + esc(t.name) + '</div><div class="dst-border-card__value">' + esc(value) + '</div><div class="dst-border-card__var">' + esc(t.token + ' · ' + t.var) + '</div></div>';
      });
      html += '</div>';
    });
    el.innerHTML = html;
  }

  window.DSTokens = {
    renderColors: renderColors,
    renderTypography: renderTypography,
    renderSpacing: renderSpacing,
    renderBorders: renderBorders,
    renderRadius: renderRadius,
    renderShadows: renderShadows,
    flashHash: flashHash
  };
})();
