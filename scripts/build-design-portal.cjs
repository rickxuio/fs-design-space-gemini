#!/usr/bin/env node
'use strict';

/**
 * Build the shadcn/ui-inspired + FS Brand Red Design System Portal (Chinese UI + Smooth Micro-Interactions)
 * Output: design-system/portal.html
 *
 * Reads directly from dist/fs-design-core/ and fs-components/component-specs/library/catalog.json
 * so the portal is always 100% synced with the active Design Core release.
 *
 * Usage:
 *   npm run portal:build
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CORE_DIR = path.join(ROOT, 'dist', 'fs-design-core');
const OUT_FILE = path.join(ROOT, 'design-system', 'portal.html');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const CATEGORY_MAP = {
  基础与操作: ['button', 'text-button', 'icon-button', 'video-button', 'tag', 'badge'],
  导航组件: ['navigation', 'anchor-nav', 'breadcrumb', 'menu-navigation', 'tab', 'pagination', 'stepper'],
  表单与输入: ['form', 'input', 'input-number', 'select', 'checkbox', 'radio', 'dropdown', 'option-selector'],
  数据展示与布局: ['card', 'icon-card', 'carousel', 'banner', 'collapse', 'list', 'table'],
  反馈与评价: ['dialog', 'comment', 'rate']
};

const COMP_CN_NAME = {
  button: '按钮',
  'text-button': '文字按钮',
  'icon-button': '图标按钮',
  'video-button': '视频按钮',
  tag: '标签',
  badge: '徽标',
  navigation: '全局头尾导航',
  'anchor-nav': '锚点导航',
  breadcrumb: '面包屑',
  'menu-navigation': '菜单导航',
  tab: '选项卡',
  pagination: '分页器',
  stepper: '步骤条',
  form: '表单',
  input: '输入框',
  'input-number': '数字步进器',
  select: '选择器',
  checkbox: '复选框',
  radio: '单选框',
  dropdown: '下拉菜单',
  'option-selector': '规格选项器',
  card: '卡片',
  'icon-card': '图标卡片',
  carousel: '轮播',
  banner: '横幅',
  collapse: '折叠面板',
  list: '列表',
  table: '表格',
  dialog: '弹窗',
  comment: '评论与问答',
  rate: '评分'
};

function getCategory(shortId) {
  for (const [cat, list] of Object.entries(CATEGORY_MAP)) {
    if (list.includes(shortId)) return cat;
  }
  return '其他';
}

function main() {
  if (!fs.existsSync(path.join(CORE_DIR, 'manifest.json'))) {
    throw new Error('Missing dist/fs-design-core/. Run `npm run core:export` first.');
  }

  const manifest = readJson(path.join(CORE_DIR, 'manifest.json'));
  const tokens = readJson(path.join(CORE_DIR, 'tokens.json'));
  const rules = readJson(path.join(CORE_DIR, 'rules.json'));
  const principlesData = fs.existsSync(path.join(CORE_DIR, 'principles.json'))
    ? readJson(path.join(CORE_DIR, 'principles.json'))
    : { principles: [] };
  const coreCatalog = readJson(path.join(CORE_DIR, 'catalog.json'));
  const rawCatalog = readJson(path.join(ROOT, 'fs-components/component-specs/library/catalog.json'));
  const iconFamilies = readJson(path.join(CORE_DIR, 'icon-style-families.json'));
  const patternsMd = fs.existsSync(path.join(CORE_DIR, 'section-patterns.md'))
    ? fs.readFileSync(path.join(CORE_DIR, 'section-patterns.md'), 'utf8')
    : '';

  const relVersion = rawCatalog.version;
  const relBase = '../fs-components/component-specs/library/releases/' + relVersion + '/';

  // Collect deduplicated component styles & scripts from the active release
  const styleSet = new Set();
  const scriptSet = new Set();
  for (const raw of Object.values(rawCatalog.components || {})) {
    for (const s of raw.runtime?.styles || []) styleSet.add(relBase + s);
    for (const js of raw.runtime?.scripts || []) scriptSet.add(relBase + js);
  }
  const releaseStylesHtml = [...styleSet]
    .map((href) => `  <link rel="stylesheet" href="${href}">`)
    .join('\n');
  const releaseScriptsHtml = [...scriptSet]
    .map((src) => `  <script src="${src}" defer></script>`)
    .join('\n');

  function rewriteAssetPaths(snippet) {
    if (!snippet) return '';
    return String(snippet)
      .replace(/(src|href)="\.\.\/\.\.\/docs\//g, `$1="${relBase}docs/`)
      .replace(/(src|href)="\.\.\/sources\//g, `$1="${relBase}components/sources/`)
      .replace(/(src|href)="\.\.\/icons\//g, `$1="${relBase}components/icons/`)
      .replace(/(src|href)="\.\.\/assets\//g, `$1="${relBase}docs/assets/`)
      .replace(/(src|href)="components\/icons\//g, `$1="${relBase}components/icons/`)
      .replace(/(src|href)="docs\/assets\//g, `$1="${relBase}docs/assets/`)
      .replace(/url\(['"]?\.\.\/\.\.\/docs\//g, `url('${relBase}docs/`)
      .replace(/url\(['"]?\.\.\/sources\//g, `url('${relBase}components/sources/`)
      .replace(/url\(['"]?\.\.\/assets\//g, `url('${relBase}docs/assets/`);
  }

  const components = Object.entries(coreCatalog.components).map(([key, c]) => {
    const shortId = key.replace(/^library-/, '');
    const raw = rawCatalog.components[key] || {};
    const enrichedVariants = {};
    for (const [vKey, vMeta] of Object.entries(c.variants || {})) {
      const rawVar = (raw.variants && raw.variants[vKey]) || {};
      const sizeDemos = (vMeta.sizeOptions || []).map((opt) => ({
        name: opt.name || '',
        cssClass: opt.cssClass || '',
        specs: [
          opt.styleProperties?.height,
          opt.styleProperties?.fontSize ? opt.styleProperties.fontSize + (opt.styleProperties?.fontWeight ? '/' + opt.styleProperties.fontWeight : '') : '',
          opt.styleProperties?.padding
        ]
          .filter(Boolean)
          .join(' · '),
        exampleHtml: rewriteAssetPaths(opt.exampleHtml || '')
      }));
      enrichedVariants[vKey] = {
        ...vMeta,
        exampleHtml: rewriteAssetPaths(rawVar.exampleHtml || ''),
        sizeDemos,
        callSnippet: `<div data-component="${key}" data-fragment="${vKey}" data-props='{}'></div>`
      };
    }
    return {
      key,
      id: shortId,
      name: c.name,
      cnName: COMP_CN_NAME[shortId] || '',
      category: getCategory(shortId),
      variantCount: c.variantCount,
      callableCount: Object.values(c.variants).filter((v) => v.callable).length,
      parents: c.parents || [],
      dependencies: c.dependencies || [],
      variants: enrichedVariants
    };
  });

  const iconMap = iconFamilies.byFile || iconFamilies.icons || {};
  const icons = Object.entries(iconMap).map(([file, info]) => ({
    file,
    styleFamily: typeof info === 'string' ? info : info.styleFamily || 'unknown',
    src: '../design-system/components/icons/' + file
  }));

  const patternSections = [];
  const pBlocks = patternsMd.split(/^##\s+/m).slice(1);
  for (const blk of pBlocks) {
    const lines = blk.trim().split('\n');
    const title = lines[0].trim();
    const body = lines.slice(1).join('\n').trim();
    if (title) patternSections.push({ title, body });
  }

  const payload = {
    manifest,
    tokens,
    principles: principlesData.principles || [],
    rules: rules.rules,
    categories: Object.keys(CATEGORY_MAP),
    components,
    icons,
    patterns: patternSections
  };

  const safeJson = JSON.stringify(payload).replace(/<\/script>/gi, '<\\/script>');

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FS Design — 企业级设计规范与组件底座</title>
  <link rel="icon" type="image/svg+xml" href="components/icons/icon-logo-fs.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
${releaseStylesHtml}
  <style>
    :root {
      --bg: #FFFFFF;
      --bg-subtle: #FAFBFB;
      --bg-muted: #F4F4F5;
      --ink: #19191A;
      --ink-secondary: #4B4B4D;
      --ink-muted: #71717A;
      --border: #E4E4E7;
      --border-subtle: #F0F0F2;
      --brand: #C00000;
      --brand-hover: #A30000;
      --brand-soft: #FEF2F2;
      --blue: #0060BF;
      --radius-sm: 6px;
      --radius-md: 8px;
      --radius-lg: 10px;
      --header-h: 56px;
      --sidebar-w: 256px;
      --toc-w: 196px;
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    }
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    html, body {
      margin: 0; padding: 0; background: var(--bg); color: var(--ink);
      font-family: "Open Sans", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    a { color: inherit; text-decoration: none; }
    button { font-family: inherit; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; background: var(--bg-muted); padding: 2px 6px; border-radius: 4px; color: var(--ink); }

    /* ===== Top Header (shadcn frosted glass) ===== */
    .topbar {
      position: sticky; top: 0; z-index: 50;
      height: var(--header-h);
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 24px;
    }
    .topbar__left { display: flex; align-items: center; gap: 28px; min-width: 0; }
    .brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; font-size: 15px; color: var(--ink); flex-shrink: 0; }
    .brand__logo { width: 28px; height: 28px; display: block; }
    .brand__ver { font-size: 11px; font-weight: 600; color: var(--brand); background: var(--brand-soft); padding: 2px 8px; border-radius: 999px; }

    .topnav { display: flex; align-items: center; gap: 4px; height: var(--header-h); }
    .topnav__item {
      position: relative; display: inline-flex; align-items: center; height: 100%;
      padding: 0 12px; font-size: 13px; font-weight: 400; color: var(--ink-muted);
      background: transparent; border: 0; cursor: pointer; transition: color 0.15s;
    }
    .topnav__item:hover { color: var(--ink); }
    .topnav__item.is-active { color: var(--ink); font-weight: 600; }
    .topnav__item.is-active::after {
      content: ""; position: absolute; left: 12px; right: 12px; bottom: 0;
      height: 2px; background: var(--brand); border-radius: 2px 2px 0 0;
    }

    .topbar__right { display: flex; align-items: center; gap: 12px; }
    .search-trigger {
      display: inline-flex; align-items: center; justify-content: space-between; gap: 16px;
      height: 34px; min-width: 248px; padding: 0 10px 0 12px;
      background: var(--bg-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm);
      color: var(--ink-muted); font-size: 13px; cursor: pointer; transition: border-color 0.15s, background 0.15s;
    }
    .search-trigger:hover { border-color: #C4C4CA; background: var(--bg); color: var(--ink); }
    .kbd { font-size: 11px; font-weight: 600; padding: 2px 6px; background: var(--bg); border: 1px solid var(--border); border-radius: 4px; color: var(--ink-muted); }

    /* ===== 3-Column App Shell ===== */
    .shell {
      display: grid;
      grid-template-columns: var(--sidebar-w) minmax(0, 1fr) var(--toc-w);
      min-height: calc(100vh - var(--header-h));
      max-width: 1520px;
      margin: 0 auto;
    }
    .shell.is-home { display: block; max-width: 100%; }
    .shell.is-home .sidebar,
    .shell.is-home .toc { display: none; }
    .shell.is-home .main { padding: 0; }

    /* ===== Homepage (shadcn/ui + FS Brand Red) ===== */
    .home-hero {
      position: relative;
      padding: 72px 24px 56px;
      text-align: center;
      border-bottom: 1px solid var(--border-subtle);
      background-color: #FFFFFF;
      background-image: radial-gradient(#E4E4E7 1px, transparent 1px);
      background-size: 24px 24px;
    }
    .home-hero__inner { max-width: 820px; margin: 0 auto; }
    .home-pill {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 5px 14px; border-radius: 999px;
      background: #FFFFFF; border: 1px solid var(--border);
      font-size: 12px; font-weight: 600; color: var(--ink-secondary);
      margin-bottom: 20px; cursor: pointer; transition: border-color 0.15s;
    }
    .home-pill:hover { border-color: var(--brand); }
    .home-pill__dot { width: 7px; height: 7px; border-radius: 50%; background: var(--brand); }
    .home-pill__sep { color: #D4D4D8; }
    .home-pill__link { color: var(--brand); }
    .home-hero__title {
      margin: 0 0 16px;
      font-size: 44px; font-weight: 600; line-height: 56px;
      letter-spacing: -0.025em; color: var(--ink);
    }
    .home-hero__desc {
      margin: 0 auto 28px; max-width: 660px;
      font-size: 16px; line-height: 26px; color: var(--ink-secondary);
    }
    .home-hero__cta { display: inline-flex; align-items: center; gap: 12px; }

    .home-wrap { max-width: 1240px; margin: 0 auto; padding: 40px 24px 80px; }
    .home-bento-head {
      display: flex; align-items: flex-end; justify-content: space-between;
      margin-bottom: 20px;
    }
    .home-bento-head h2 { margin: 0; font-size: 20px; font-weight: 600; color: var(--ink); }
    .home-bento-head p { margin: 4px 0 0; font-size: 13px; color: var(--ink-muted); }

    .bento-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      margin-bottom: 48px;
    }
    .bento-card {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 20px 22px;
      display: flex; flex-direction: column; justify-content: space-between; gap: 16px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .bento-card:hover { border-color: #C4C4CA; box-shadow: 0 6px 20px rgba(0,0,0,0.04); }
    .bento-card__head { display: flex; align-items: center; justify-content: space-between; }
    .bento-card__title { font-size: 14px; font-weight: 600; color: var(--ink); margin: 0; }
    .bento-card__link {
      font-size: 12px; font-weight: 600; color: var(--ink-muted);
      background: transparent; border: 0; cursor: pointer; padding: 0;
    }
    .bento-card__link:hover { color: var(--brand); }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 6px;
      height: 38px; padding: 0 16px; border-radius: var(--radius-sm);
      font-size: 13px; font-weight: 600; cursor: pointer;
      border: 1px solid transparent; transition: background 0.15s, border-color 0.15s;
    }
    .btn--lg { height: 42px; padding: 0 22px; font-size: 14px; }
    .btn--brand { background: var(--brand); color: #FFFFFF; }
    .btn--brand:hover { background: var(--brand-hover); }
    .btn--outline { background: var(--bg); color: var(--ink); border-color: var(--border); }
    .btn--outline:hover { background: var(--bg-subtle); border-color: #C4C4CA; }
    .btn--sm { height: 30px; padding: 0 10px; font-size: 12px; }

    /* Live Mini-Demos inside Bento */
    .demo-size-bar { display: inline-flex; gap: 3px; background: var(--bg-muted); padding: 2px; border-radius: 5px; }
    .demo-size-btn {
      border: 0; background: transparent; padding: 2px 8px; border-radius: 4px;
      font-size: 11px; font-weight: 600; color: var(--ink-muted); cursor: pointer;
    }
    .demo-size-btn.is-on { background: #FFFFFF; color: var(--ink); box-shadow: 0 1px 2px rgba(0,0,0,0.08); }

    .demo-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
    .demo-btn {
      height: 34px; padding: 0 14px; border-radius: 4px; font-size: 12px; font-weight: 600;
      border: 1px solid transparent; cursor: pointer; transition: all 0.15s;
    }
    .demo-btn--xl { height: 40px; padding: 0 18px; font-size: 13px; }
    .demo-btn--m { height: 30px; padding: 0 11px; font-size: 12px; }
    .demo-btn--red { background: #C00000; color: #FFFFFF; }
    .demo-btn--red:hover { background: #A30000; }
    .demo-btn--black { background: #19191A; color: #FFFFFF; }
    .demo-btn--black:hover { background: #333336; }
    .demo-btn--gray { background: #F4F4F5; color: #19191A; }
    .demo-btn--gray:hover { background: #E4E4E7; }
    .demo-btn--outline { background: #FFFFFF; color: #19191A; border-color: #19191A; }
    .demo-btn--outline:hover { background: #FAFBFB; }

    .demo-tag { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 4px; }
    .demo-tag--new { background: #D6F5DF; color: #09832A; }
    .demo-tag--hot { background: #FFEBDD; color: #F56300; }
    .demo-tag--feat { background: #F3F4F6; color: #19191A; }
    .demo-tag--red { background: #FEF2F2; color: #C00000; }

    .demo-input {
      width: 100%; height: 36px; padding: 0 12px; border-radius: 4px;
      border: 1px solid transparent; background: #F6F6F8; font-size: 12px; color: var(--ink);
      outline: none; transition: border-color 0.15s, background 0.15s;
    }
    .demo-input:focus { border-color: var(--ink); background: #FFFFFF; }
    .demo-check-row { display: flex; align-items: center; gap: 14px; font-size: 12px; color: var(--ink-secondary); }
    .demo-check-row label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
    .demo-check-row input { accent-color: #C00000; }

    .demo-swatches { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .demo-sw {
      border-radius: 6px; overflow: hidden; border: 1px solid var(--border);
      cursor: pointer; text-align: left; background: #FFFFFF; padding: 0;
    }
    .demo-sw:hover { border-color: #A1A1AA; }
    .demo-sw__fill { height: 38px; display: block; }
    .demo-sw__lbl { display: block; padding: 5px 6px; font-size: 10px; font-family: ui-monospace, monospace; color: var(--ink-secondary); }

    .demo-nav-box {
      border: 1px solid var(--border); border-radius: 8px; padding: 8px;
      background: #FFFFFF; display: flex; flex-direction: column; gap: 2px;
    }
    .demo-nav-item {
      position: relative; padding: 6px 10px 6px 14px; border-radius: 4px;
      font-size: 12px; color: var(--ink-secondary); background: transparent;
      border: 0; text-align: left; cursor: pointer; transition: background 0.12s, color 0.12s;
    }
    .demo-nav-item:hover { background: #FAFBFB; color: var(--ink); }
    .demo-nav-item.is-on { background: #FAFBFB; color: var(--ink); font-weight: 600; }
    .demo-nav-item.is-on::before {
      content: ""; position: absolute; left: 0; top: 5px; bottom: 5px;
      width: 3px; background: #C00000; border-radius: 2px;
    }

    .demo-icons { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .demo-ic {
      height: 52px; border-radius: 8px; background: #FAFBFB; border: 1px solid var(--border-subtle);
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .demo-ic:hover { border-color: var(--brand); background: #FFFFFF; }
    .demo-ic img { width: 26px; height: 26px; object-fit: contain; }

    .demo-pages { display: flex; flex-direction: column; gap: 6px; }
    .demo-page-link {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 10px; border-radius: 6px; background: #FAFBFB;
      font-size: 12px; font-weight: 600; color: var(--ink); transition: background 0.12s, color 0.12s;
    }
    .demo-page-link:hover { background: #F4F4F5; color: var(--brand); }
    .demo-page-link span:last-child { font-size: 11px; font-weight: 400; color: var(--ink-muted); }

    .home-pillars {
      display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 28px; padding-top: 32px; border-top: 1px solid var(--border-subtle);
    }
    .pillar h3 { margin: 0 0 6px; font-size: 15px; font-weight: 600; color: var(--ink); }
    .pillar p { margin: 0; font-size: 13px; line-height: 21px; color: var(--ink-secondary); }

    /* ===== Left Sidebar (shadcn + FS 3px #C00000 active bar) ===== */
    .sidebar {
      position: sticky; top: var(--header-h);
      height: calc(100vh - var(--header-h));
      overflow-y: auto;
      padding: 20px 14px 32px 16px;
      border-right: 1px solid var(--border-subtle);
    }
    .sidebar__group { margin-bottom: 20px; }
    .sidebar__heading {
      font-size: 12px; font-weight: 600; color: var(--ink);
      padding: 4px 10px 6px; letter-spacing: 0.01em;
      display: flex; align-items: center; justify-content: space-between;
    }
    .sidebar__count { font-size: 11px; font-weight: 400; color: var(--ink-muted); }
    .sidebar__item {
      position: relative;
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; text-align: left;
      padding: 6px 10px 6px 12px; margin: 1px 0;
      border: 0; border-radius: var(--radius-sm);
      background: transparent; color: var(--ink-secondary);
      font-size: 13px; line-height: 20px; cursor: pointer;
      transition: background 0.14s, color 0.14s, padding-left 0.16s var(--ease-out);
    }
    .sidebar__item:hover { background: var(--bg-subtle); color: var(--ink); padding-left: 15px; }
    .sidebar__item.is-active { background: var(--bg-subtle); color: var(--ink); font-weight: 600; }
    .sidebar__item::before {
      content: ""; position: absolute; left: 0; top: 4px; bottom: 4px;
      width: 3px; background: var(--brand); border-radius: 2px;
      transform: scaleY(0); transition: transform 0.2s var(--ease-out);
    }
    .sidebar__item.is-active::before { transform: scaleY(1); }
    .sidebar__badge { font-size: 11px; color: var(--ink-muted); flex-shrink: 0; margin-left: 6px; }

    /* ===== Main Workspace ===== */
    .main { padding: 32px 44px 72px; min-width: 0; }
    .crumb { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--ink-muted); margin-bottom: 12px; }
    .crumb__sep { color: #D4D4D8; }
    .crumb__cur { color: var(--ink); font-weight: 600; }

    .page-title { margin: 0 0 8px; font-size: 30px; font-weight: 600; line-height: 38px; letter-spacing: -0.02em; color: var(--ink); }
    .page-lead { margin: 0 0 24px; font-size: 15px; line-height: 24px; color: var(--ink-secondary); max-width: 720px; }

    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 4px 12px; border-radius: 999px;
      border: 1px solid var(--border); background: var(--bg-subtle);
      font-size: 12px; font-weight: 600; color: var(--ink-secondary); margin-bottom: 16px;
    }
    .hero-title { margin: 0 0 12px; font-size: 36px; font-weight: 600; line-height: 46px; letter-spacing: -0.02em; color: var(--ink); }
    .hero-desc { margin: 0 0 24px; font-size: 15px; line-height: 26px; color: var(--ink-secondary); max-width: 680px; }
    .hero-actions { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }

    .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 36px; }
    .kpi-card {
      background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 18px 20px; transition: border-color 0.18s, transform 0.18s var(--ease-out);
    }
    .kpi-card:hover { border-color: #C4C4CA; transform: translateY(-2px); }
    .kpi-card__num { font-size: 28px; font-weight: 600; line-height: 34px; color: var(--ink); margin-bottom: 4px; }
    .kpi-card__label { font-size: 12px; color: var(--ink-muted); }

    .sec-head { display: flex; align-items: center; justify-content: space-between; margin: 32px 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border-subtle); }
    .sec-head h2 { margin: 0; font-size: 18px; font-weight: 600; color: var(--ink); }
    .sec-head span { font-size: 12px; color: var(--ink-muted); }

    /* ===== Component Gallery Grid ===== */
    .gallery-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
    .gallery-card {
      display: flex; flex-direction: column; justify-content: space-between; gap: 12px;
      padding: 18px 20px; background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--radius-md); cursor: pointer; text-align: left;
      transition: border-color 0.18s, box-shadow 0.2s var(--ease-out), transform 0.2s var(--ease-out);
    }
    .gallery-card:hover { border-color: #A1A1AA; box-shadow: 0 8px 22px rgba(0,0,0,0.06); transform: translateY(-2px); }
    .gallery-card:active { transform: scale(0.98); }
    .gallery-card__top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .gallery-card__name { font-size: 15px; font-weight: 600; color: var(--ink); }
    .gallery-card__cn { font-size: 12px; font-weight: 400; color: var(--ink-muted); margin-left: 6px; }
    .gallery-card__cat { font-size: 11px; color: var(--ink-muted); background: var(--bg-muted); padding: 2px 7px; border-radius: 4px; flex-shrink: 0; }
    .gallery-card__meta { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--ink-muted); }
    .gallery-card__arrow { color: var(--brand); font-weight: 600; opacity: 0; transform: translateX(-4px); transition: opacity 0.18s, transform 0.18s var(--ease-out); }
    .gallery-card:hover .gallery-card__arrow { opacity: 1; transform: translateX(0); }

    /* ===== Component Detail Showcase ===== */
    .detail-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
    .detail-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
    .pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 1px solid var(--border); background: var(--bg-subtle); color: var(--ink-secondary); }
    .pill--brand { border-color: #FECACA; background: var(--brand-soft); color: var(--brand); }

    .stage-box {
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      overflow: hidden; background: var(--bg); margin-bottom: 28px;
    }
    .stage-bar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px; background: var(--bg-subtle); border-bottom: 1px solid var(--border);
    }
    .stage-tabs { display: inline-flex; gap: 4px; background: var(--bg-muted); padding: 3px; border-radius: var(--radius-sm); }
    .stage-tab {
      border: 0; background: transparent; padding: 5px 12px; border-radius: 4px;
      font-size: 12px; font-weight: 600; color: var(--ink-muted); cursor: pointer;
    }
    .stage-tab.is-active { background: var(--bg); color: var(--ink); box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
    .stage-frame-wrap {
      background-color: #FAFBFB;
      background-image: radial-gradient(#E4E4E7 1px, transparent 1px);
      background-size: 16px 16px;
      padding: 16px;
    }
    .stage-iframe {
      width: 100%; height: 640px; border: 1px solid var(--border);
      border-radius: var(--radius-md); background: #FFFFFF; display: block;
    }

    /* ===== shadcn Live Variant Showcase Cards ===== */
    .variant-list { display: flex; flex-direction: column; gap: 22px; }
    .variant-card {
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      overflow: hidden; background: var(--bg);
      transition: border-color 0.2s, box-shadow 0.22s var(--ease-out);
    }
    .variant-card:hover { border-color: #C4C4CA; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
    .variant-card__bar {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 12px 18px; background: var(--bg-subtle); border-bottom: 1px solid var(--border);
    }
    .variant-card__title { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .variant-card__name { font-size: 14px; font-weight: 600; color: var(--ink); }
    .variant-card__tools { display: flex; align-items: center; gap: 8px; }
    .variant-stage {
      min-height: 132px; padding: 32px 28px;
      display: flex; align-items: center; justify-content: center;
      background-color: #FAFBFB;
      background-image: radial-gradient(#E4E4E7 1px, transparent 1px);
      background-size: 16px 16px;
      overflow-x: auto;
    }
    .variant-stage--wide {
      display: block; padding: 24px;
    }
    .variant-stage--dark {
      background-color: #18181B;
      background-image: radial-gradient(#3F3F46 1px, transparent 1px);
    }
    .variant-stage--white {
      background-color: #FFFFFF;
      background-image: none;
    }
    .variant-stage__inner {
      max-width: 100%;
      width: 100%;
    }
    .matrix-group { display: flex; flex-direction: column; gap: 18px; width: 100%; }
    .matrix-block { display: flex; flex-direction: column; gap: 10px; }
    .matrix-block + .matrix-block { padding-top: 16px; border-top: 1px dashed rgba(161, 161, 170, 0.35); }
    .matrix-label {
      font-size: 11px; font-weight: 600; color: var(--ink-muted);
      letter-spacing: 0.03em; text-transform: uppercase;
    }
    .variant-stage--dark .matrix-label { color: #A1A1AA; }
    .matrix-row {
      display: flex; flex-wrap: wrap; align-items: flex-end; gap: 20px 28px;
    }
    .matrix-cell {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
    }
    .matrix-cap {
      font-size: 11px; color: var(--ink-muted); font-family: ui-monospace, monospace;
      text-align: center; line-height: 16px;
    }
    .variant-stage--dark .matrix-cap { color: #A1A1AA; }
    .variant-code {
      background: #18181B; color: #E4E4E7; padding: 18px 20px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px; line-height: 20px; overflow-x: auto;
    }
    .variant-code pre { margin: 0; white-space: pre-wrap; word-break: break-all; }
    .variant-code__label { font-size: 11px; color: #A1A1AA; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.04em; }
    .variant-card__meta {
      padding: 16px 18px; background: var(--bg); border-top: 1px solid var(--border-subtle);
    }
    .do-dont-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .do-box, .dont-box { padding: 10px 12px; border-radius: var(--radius-sm); font-size: 13px; line-height: 20px; }
    .do-box { background: #F0FDF4; border: 1px solid #BBF7D0; color: #14532D; }
    .dont-box { background: #FEF2F2; border: 1px solid #FECACA; color: #7F1D1D; }
    .do-box strong, .dont-box strong { display: block; font-size: 11px; letter-spacing: 0.02em; margin-bottom: 4px; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip {
      font-size: 11px; padding: 2px 8px; border-radius: 4px;
      background: var(--bg-subtle); border: 1px solid var(--border); color: var(--ink-secondary);
      transition: all 0.15s;
    }
    .chip--link { cursor: pointer; }
    .chip--link:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-soft); transform: translateY(-1px); }

    /* ===== Tokens View ===== */
    .swatch-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-bottom: 24px; }
    .swatch {
      border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden;
      background: var(--bg); cursor: pointer; transition: border-color 0.18s, transform 0.18s var(--ease-out), box-shadow 0.18s;
    }
    .swatch:hover { border-color: #A1A1AA; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.06); }
    .swatch:active { transform: scale(0.97); }
    .swatch__color { height: 64px; border-bottom: 1px solid var(--border-subtle); }
    .swatch__info { padding: 10px 12px; }
    .swatch__name { font-size: 12px; font-weight: 600; color: var(--ink); margin-bottom: 2px; word-break: break-all; }
    .swatch__val { font-size: 11px; color: var(--ink-muted); font-family: ui-monospace, monospace; }

    .filter-input {
      width: 100%; max-width: 360px; height: 36px; padding: 0 12px;
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      font-size: 13px; color: var(--ink); background: var(--bg); outline: none;
      transition: border-color 0.18s, box-shadow 0.18s;
    }
    .filter-input:focus { border-color: var(--ink); box-shadow: 0 0 0 3px rgba(25,25,26,0.06); }

    .token-table { width: 100%; border-collapse: collapse; border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; font-size: 13px; }
    .token-table th { text-align: left; padding: 10px 14px; background: var(--bg-subtle); border-bottom: 1px solid var(--border); font-size: 12px; color: var(--ink-muted); font-weight: 600; }
    .token-table td { padding: 9px 14px; border-bottom: 1px solid var(--border-subtle); vertical-align: middle; transition: background 0.12s; }
    .token-table tr:last-child td { border-bottom: 0; }
    .token-table tr:hover td { background: var(--bg-subtle); }
    .color-dot { display: inline-block; width: 14px; height: 14px; border-radius: 3px; border: 1px solid var(--border); vertical-align: middle; margin-right: 8px; }

    /* ===== Icons View ===== */
    .filter-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
    .family-pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .family-pill {
      height: 30px; padding: 0 12px; border-radius: 999px;
      border: 1px solid var(--border); background: var(--bg); color: var(--ink-secondary);
      font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.16s var(--ease-out);
    }
    .family-pill:hover { border-color: #A1A1AA; color: var(--ink); }
    .family-pill.is-active { background: var(--ink); color: #FFFFFF; border-color: var(--ink); }
    .icon-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; }
    .icon-tile {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
      padding: 18px 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-md);
      background: var(--bg); cursor: pointer;
      transition: border-color 0.18s, background 0.18s, transform 0.18s var(--ease-out), box-shadow 0.18s;
    }
    .icon-tile:hover { border-color: var(--brand); background: var(--bg-subtle); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.05); }
    .icon-tile:active { transform: scale(0.96); }
    .icon-tile__stage {
      width: 52px; height: 52px; border-radius: 8px;
      background: #F4F4F5; display: flex; align-items: center; justify-content: center;
    }
    .icon-tile__stage--dark { background: #27272A; }
    .icon-tile img { width: 32px; height: 32px; object-fit: contain; display: block; transition: transform 0.2s var(--ease-out); }
    .icon-tile:hover img { transform: scale(1.12); }
    .icon-tile__name { font-size: 11px; color: var(--ink-secondary); text-align: center; word-break: break-word; line-height: 15px; max-width: 100%; }
    .icon-tile__fam { font-size: 10px; color: var(--ink-muted); background: var(--bg-muted); padding: 1px 6px; border-radius: 4px; }

    /* ===== Design Principles Page ===== */
    .prin-list { display: flex; flex-direction: column; gap: 20px; }
    .prin-card {
      border: 1px solid var(--border); border-radius: var(--radius-lg);
      padding: 24px 26px; background: var(--bg);
      transition: border-color 0.2s, box-shadow 0.22s var(--ease-out);
    }
    .prin-card:hover { border-color: #C4C4CA; box-shadow: 0 8px 24px rgba(0,0,0,0.04); }
    .prin-card__head { display: flex; align-items: baseline; gap: 14px; margin-bottom: 10px; }
    .prin-card__num {
      font-size: 13px; font-weight: 600; color: var(--brand);
      background: var(--brand-soft); border: 1px solid #FECACA;
      padding: 2px 9px; border-radius: 999px; flex-shrink: 0;
    }
    .prin-card__title { margin: 0; font-size: 20px; font-weight: 600; color: var(--ink); }
    .prin-card__en { font-size: 13px; color: var(--ink-muted); font-weight: 400; margin-left: 6px; }
    .prin-card__summary { margin: 0 0 16px; font-size: 14px; line-height: 23px; color: var(--ink-secondary); }
    .prin-card__list { margin: 0; padding-left: 18px; }
    .prin-card__list li { margin: 4px 0; }
    .prin-audit-box {
      margin-top: 12px; padding: 10px 14px; border-radius: var(--radius-sm);
      background: var(--bg-subtle); border: 1px solid var(--border-subtle);
      font-size: 13px; color: var(--ink); display: flex; align-items: baseline; gap: 8px;
    }
    .prin-audit-box strong { color: var(--brand); font-size: 12px; flex-shrink: 0; }

    /* ===== Rules & Patterns ===== */
    .rule-card {
      border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 16px 20px; background: var(--bg); margin-bottom: 12px;
      border-left: 3px solid var(--brand); transition: transform 0.18s var(--ease-out), box-shadow 0.18s;
    }
    .rule-card:hover { transform: translateX(3px); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .rule-card--warning { border-left-color: #D97706; }
    .rule-card__top { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
    .sev-tag { font-size: 11px; font-weight: 600; padding: 2px 7px; border-radius: 4px; }
    .sev-tag--error { background: var(--brand-soft); color: var(--brand); }
    .sev-tag--warning { background: #FFFBEB; color: #B45309; }
    .rule-card__desc { margin: 0; font-size: 13px; line-height: 21px; color: var(--ink-secondary); }

    .pattern-card {
      border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 20px 24px; background: var(--bg); margin-bottom: 16px;
    }
    .pattern-card h3 { margin: 0 0 10px; font-size: 16px; font-weight: 600; color: var(--ink); }
    .pattern-card pre {
      margin: 0; white-space: pre-wrap; font-family: inherit;
      font-size: 13px; line-height: 22px; color: var(--ink-secondary);
    }

    /* ===== Right TOC ===== */
    .toc {
      position: sticky; top: var(--header-h);
      height: calc(100vh - var(--header-h));
      overflow-y: auto;
      padding: 28px 20px 28px 16px;
    }
    .toc__title { font-size: 12px; font-weight: 600; color: var(--ink); margin: 0 0 10px; }
    .toc__link {
      display: block; padding: 4px 0 4px 10px; font-size: 12px; line-height: 18px;
      color: var(--ink-muted); border-left: 2px solid transparent; cursor: pointer;
      transition: color 0.15s, border-color 0.15s;
    }
    .toc__link:hover { color: var(--ink); }
    .toc__link.is-active { color: var(--brand); border-left-color: var(--brand); font-weight: 600; }

    /* ===== Command Palette Modal (⌘K) ===== */
    .cmd-backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(25, 25, 26, 0.45);
      backdrop-filter: blur(4px);
      display: flex; align-items: flex-start; justify-content: center;
      padding-top: 12vh;
      animation: backdropIn 0.16s ease-out;
    }
    .cmd-backdrop[hidden] { display: none; }
    .cmd-dialog {
      width: 560px; max-width: calc(100vw - 32px);
      background: var(--bg); border: 1px solid var(--border);
      border-radius: var(--radius-lg); box-shadow: 0 24px 48px rgba(0,0,0,0.2);
      overflow: hidden;
      animation: modalIn 0.2s var(--ease-out);
    }
    .cmd-input {
      width: 100%; height: 48px; padding: 0 16px; border: 0;
      border-bottom: 1px solid var(--border); font-size: 14px; outline: none;
    }
    .cmd-results { max-height: 360px; overflow-y: auto; padding: 8px; }
    .cmd-item {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 8px 12px; border: 0; border-radius: var(--radius-sm);
      background: transparent; text-align: left; cursor: pointer; font-size: 13px; color: var(--ink);
      transition: background 0.12s, transform 0.12s;
    }
    .cmd-item:hover { background: var(--bg-subtle); transform: translateX(2px); }
    .cmd-item__type { font-size: 11px; color: var(--ink-muted); background: var(--bg-muted); padding: 2px 7px; border-radius: 4px; }

    /* ===== Toast ===== */
    .toast {
      position: fixed; right: 24px; bottom: 24px; z-index: 120;
      background: var(--ink); color: #FFFFFF; padding: 10px 16px;
      border-radius: var(--radius-sm); font-size: 13px; font-weight: 600;
      box-shadow: 0 10px 24px rgba(0,0,0,0.18);
      opacity: 0; transform: translateY(10px) scale(0.96); pointer-events: none;
      transition: all 0.2s var(--ease-out);
    }
    .toast.is-show { opacity: 1; transform: translateY(0) scale(1); }

    @media (max-width: 1220px) {
      .shell { grid-template-columns: var(--sidebar-w) minmax(0, 1fr); }
      .toc { display: none; }
      .gallery-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .icon-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .bento-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <div class="topbar__left">
      <a class="brand" href="#home" data-nav="home">
        <img class="brand__logo" src="components/icons/icon-logo-fs.svg" alt="FS">
        <span>FS Design</span>
        <span class="brand__ver" id="hdr-version">v1.1.0</span>
      </a>
      <nav class="topnav" aria-label="主导航">
        <button class="topnav__item is-active" data-nav="home" type="button">首页</button>
        <button class="topnav__item" data-nav="overview" type="button">总览</button>
        <button class="topnav__item" data-nav="principles" type="button">设计原则</button>
        <button class="topnav__item" data-nav="components" type="button">组件库</button>
        <button class="topnav__item" data-nav="tokens" type="button">设计令牌</button>
        <button class="topnav__item" data-nav="icons" type="button">图标库</button>
        <button class="topnav__item" data-nav="rules" type="button">规范与范式</button>
      </nav>
    </div>
    <div class="topbar__right">
      <button class="search-trigger" id="open-cmd" type="button">
        <span>搜索组件、Token、图标...</span>
        <span class="kbd">⌘K</span>
      </button>
    </div>
  </header>

  <div class="shell is-home" id="shell">
    <aside class="sidebar" id="sidebar"></aside>
    <main class="main" id="main"></main>
    <aside class="toc" id="toc"></aside>
  </div>

  <div class="cmd-backdrop" id="cmd-backdrop" hidden>
    <div class="cmd-dialog" role="dialog" aria-label="快捷搜索">
      <input class="cmd-input" id="cmd-input" type="text" placeholder="输入组件名、中文名、CSS 变量或图标名...">
      <div class="cmd-results" id="cmd-results"></div>
    </div>
  </div>

  <div class="toast" id="toast">已复制</div>

  <script>
    const DATA = ${safeJson};

    const state = {
      view: 'home',
      componentId: 'button',
      iconFamily: 'all',
      iconQuery: '',
      tokenQuery: '',
      demoBtnSize: 'l'
    };

    const $ = (id) => document.getElementById(id);
    function esc(s) {
      return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    let toastTimer;
    function showToast(msg) {
      const t = $('toast');
      t.textContent = msg;
      t.classList.add('is-show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove('is-show'), 1800);
    }
    function copyText(text) {
      if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
      showToast('已复制：' + text);
    }

    function renderSidebar() {
      const coreLinks = [
        { id: 'overview', label: '规范总览' },
        { id: 'principles', label: '设计原则', badge: DATA.principles.length },
        { id: 'tokens', label: '设计令牌 Token', badge: DATA.tokens.cssVariableCount },
        { id: 'icons', label: '官方图标库', badge: DATA.icons.length },
        { id: 'rules', label: '规范与区块范式', badge: DATA.rules.length }
      ];

      let html = '<div class="sidebar__group"><div class="sidebar__heading"><span>基础规范</span></div>';
      for (const item of coreLinks) {
        const active = state.view === item.id ? ' is-active' : '';
        html += \`<button class="sidebar__item\${active}" data-nav="\${item.id}" type="button"><span>\${esc(item.label)}</span>\${item.badge ? \`<span class="sidebar__badge">\${item.badge}</span>\` : ''}</button>\`;
      }
      html += '</div>';

      for (const cat of DATA.categories) {
        const list = DATA.components.filter((c) => c.category === cat);
        if (!list.length) continue;
        html += \`<div class="sidebar__group"><div class="sidebar__heading"><span>\${esc(cat)}</span><span class="sidebar__count">\${list.length}</span></div>\`;
        for (const c of list) {
          const active = state.view === 'components' && state.componentId === c.id ? ' is-active' : '';
          html += \`<button class="sidebar__item\${active}" data-comp="\${c.id}" type="button"><span>\${esc(c.name)} \${c.cnName ? \`<span style="color:var(--ink-muted);font-weight:400;font-size:12px">\${esc(c.cnName)}</span>\` : ''}</span><span class="sidebar__badge">\${c.callableCount}</span></button>\`;
        }
        html += '</div>';
      }
      $('sidebar').innerHTML = html;
    }

    function syncTopNav() {
      document.querySelectorAll('.topnav__item').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.nav === state.view);
      });
    }

    function setToc(items) {
      if (!items.length) { $('toc').innerHTML = ''; return; }
      $('toc').innerHTML =
        '<p class="toc__title">本页目录</p>' +
        items
          .map((it, idx) => \`<a class="toc__link\${idx === 0 ? ' is-active' : ''}" href="#\${it.id}">\${esc(it.label)}</a>\`)
          .join('');
    }

    function renderHome() {
      const m = DATA.manifest;
      const duotoneIcons = DATA.icons.filter((i) => i.styleFamily === 'duotone-line').slice(0, 8);
      const demoIconsHtml = duotoneIcons
        .map((i) => \`<button class="demo-ic" data-copy="\${esc(i.file)}" type="button" title="点击复制 \${esc(i.file)}"><img src="\${esc(i.src)}" alt="\${esc(i.file)}"></button>\`)
        .join('');

      const szCls = state.demoBtnSize === 'xl' ? ' demo-btn--xl' : state.demoBtnSize === 'm' ? ' demo-btn--m' : '';

      $('main').innerHTML = \`
        <section class="home-hero">
          <div class="home-hero__inner">
            <button class="home-pill" data-nav="principles" type="button">
              <span class="home-pill__dot"></span>
              <span>FS Design Core v\${esc(m.version)}</span>
              <span class="home-pill__sep">|</span>
              <span class="home-pill__link">5 大设计原则与 31 族组件规范 →</span>
            </button>
            <h1 class="home-hero__title">打造统一、克制、零偏差的<br>FS 企业级用户界面</h1>
            <p class="home-hero__desc">统一、人机双可读的 UI 设计规范与组件契约体系。覆盖 5 大设计原则、31 族全规格状态组件、154 项设计令牌与 184 枚风格化图标。</p>
            <div class="home-hero__cta">
              <button class="btn btn--brand btn--lg" data-comp="button" type="button">浏览组件库 →</button>
              <button class="btn btn--outline btn--lg" data-nav="principles" type="button">查阅设计原则</button>
            </div>
          </div>
        </section>

        <div class="home-wrap">
          <div class="home-bento-head">
            <div>
              <h2>核心视觉与组件展台</h2>
              <p>所有组件均基于 FS 官方 Token 与 1200px PC 桌面端网格体系构建，支持直接在页面内实时预览。</p>
            </div>
            <button class="btn btn--outline btn--sm" data-nav="overview" type="button">查看全部 \${m.stats.components} 族组件 →</button>
          </div>

          <div class="bento-grid">
            <!-- Card 1: Buttons & Semantic Tags -->
            <article class="bento-card">
              <div class="bento-card__head">
                <h3 class="bento-card__title">按钮与语义标签</h3>
                <div class="demo-size-bar" id="demo-size-bar">
                  <button class="demo-size-btn\${state.demoBtnSize === 'xl' ? ' is-on' : ''}" data-demo-sz="xl" type="button">XL</button>
                  <button class="demo-size-btn\${state.demoBtnSize === 'l' ? ' is-on' : ''}" data-demo-sz="l" type="button">L</button>
                  <button class="demo-size-btn\${state.demoBtnSize === 'm' ? ' is-on' : ''}" data-demo-sz="m" type="button">M</button>
                </div>
              </div>
              <div class="demo-row" id="demo-btn-row">
                <button class="demo-btn\${szCls} demo-btn--red" type="button" data-copy="library-button/filled-red">主操作红</button>
                <button class="demo-btn\${szCls} demo-btn--black" type="button" data-copy="library-button/filled-black">黑色填充</button>
                <button class="demo-btn\${szCls} demo-btn--outline" type="button" data-copy="library-button/outline-black">黑色描边</button>
                <button class="demo-btn\${szCls} demo-btn--gray" type="button" data-copy="library-button/filled-gray">浅灰辅助</button>
              </div>
              <div class="demo-row">
                <span class="demo-tag demo-tag--new">新品 New</span>
                <span class="demo-tag demo-tag--hot">热销 Hot</span>
                <span class="demo-tag demo-tag--feat">精选 Featured</span>
                <span class="demo-tag demo-tag--red">v\${esc(m.version)}</span>
              </div>
            </article>

            <!-- Card 2: Gray-Surface Form Controls -->
            <article class="bento-card">
              <div class="bento-card__head">
                <h3 class="bento-card__title">灰底表单与输入控件</h3>
                <button class="bento-card__link" data-comp="form" type="button">查看契约 →</button>
              </div>
              <div style="display:flex;flex-direction:column;gap:10px">
                <input class="demo-input" type="text" value="FS 园区网融合解决方案" aria-label="演示输入框">
                <div class="demo-check-row">
                  <label><input type="checkbox" checked> 邮件接收方案</label>
                  <label><input type="checkbox"> 专家电话回访</label>
                </div>
                <div><button class="demo-btn demo-btn--red" type="button" data-comp="form">提交咨询</button></div>
              </div>
            </article>

            <!-- Card 3: Core Palette & Type Specimen -->
            <article class="bento-card">
              <div class="bento-card__head">
                <h3 class="bento-card__title">核心色板与字体阶梯</h3>
                <button class="bento-card__link" data-nav="tokens" type="button">全部 \${m.stats.cssVariables} 项 →</button>
              </div>
              <div class="demo-swatches">
                <button class="demo-sw" data-copy="#C00000" type="button"><span class="demo-sw__fill" style="background:#C00000"></span><span class="demo-sw__lbl">#C00000</span></button>
                <button class="demo-sw" data-copy="#19191A" type="button"><span class="demo-sw__fill" style="background:#19191A"></span><span class="demo-sw__lbl">#19191A</span></button>
                <button class="demo-sw" data-copy="#0060BF" type="button"><span class="demo-sw__fill" style="background:#0060BF"></span><span class="demo-sw__lbl">#0060BF</span></button>
                <button class="demo-sw" data-copy="#FAFBFB" type="button"><span class="demo-sw__fill" style="background:#FAFBFB"></span><span class="demo-sw__lbl">#FAFBFB</span></button>
              </div>
              <div style="display:flex;align-items:baseline;justify-content:space-between;padding-top:4px;border-top:1px solid var(--border-subtle)">
                <span style="font-size:20px;font-weight:600">Open Sans 字体</span>
                <span style="font-size:12px;color:var(--ink-muted)">400 / 600 · 1200px 版心</span>
              </div>
            </article>

            <!-- Card 4: Pattern 14 Vertical Sidebar Nav -->
            <article class="bento-card">
              <div class="bento-card__head">
                <h3 class="bento-card__title">品牌红竖条导航（Pattern 14）</h3>
                <button class="bento-card__link" data-nav="rules" type="button">规范 →</button>
              </div>
              <div class="demo-nav-box" id="home-demo-nav">
                <button class="demo-nav-item is-on" type="button">精选核心产品</button>
                <button class="demo-nav-item" type="button">AI 智算与数据中心</button>
                <button class="demo-nav-item" type="button">企业级交换机</button>
                <button class="demo-nav-item" type="button">高速光模块与布线</button>
              </div>
            </article>

            <!-- Card 5: Duotone-Line Official Icons -->
            <article class="bento-card">
              <div class="bento-card__head">
                <h3 class="bento-card__title">官方黑红双色线性图标</h3>
                <button class="bento-card__link" data-nav="icons" type="button">全部 \${DATA.icons.length} 枚 →</button>
              </div>
              <div class="demo-icons">\${demoIconsHtml}</div>
            </article>

            <!-- Card 6: Verified FS Benchmark Pages -->
            <article class="bento-card">
              <div class="bento-card__head">
                <h3 class="bento-card__title">FS 原生标杆参考页</h3>
                <a class="bento-card__link" href="../index.html" target="_blank">目录 ↗</a>
              </div>
              <div class="demo-pages">
                <a class="demo-page-link" href="../pages/fs-homepage-pc.html" target="_blank"><span>FS 官网首页标杆</span><span>Pattern 10 ↗</span></a>
                <a class="demo-page-link" href="../pages/fs-plp-switches-pc.html" target="_blank"><span>PLP · 企业交换机列表页</span><span>Pattern 11 ↗</span></a>
                <a class="demo-page-link" href="../pages/fs-pdp-s5810-pc.html" target="_blank"><span>PDP · S5810 商品详情页</span><span>Pattern 12 ↗</span></a>
                <a class="demo-page-link" href="../pages/fs-campus-fabric-network-pc.html" target="_blank"><span>解决方案 · 园区网专题</span><span>Pattern 9 ↗</span></a>
              </div>
            </article>
          </div>

          <section class="home-pillars">
            <div class="pillar">
              <h3>31 族已集成组件</h3>
              <p>覆盖 150 个可调用变体，全部沉淀明确的使用场景、禁用边界与父子组件级联依赖图。</p>
            </div>
            <div class="pillar">
              <h3>154 项自动同步令牌</h3>
              <p>直接解析自官方 <code>tokens.css</code>，确保全站色板、字号、圆角、间距零漂移。</p>
            </div>
            <div class="pillar">
              <h3>7 大图标画风族谱</h3>
              <p>184 枚官方注册图标全部完成画风归类，配合自动门禁杜绝同区块图标风格混用。</p>
            </div>
            <div class="pillar">
              <h3>独立便携规范底座</h3>
              <p>零依赖导出包 <code>dist/fs-design-core/</code>（&lt;100 KB），随时可直接交付下游团队或 AI 工具消费。</p>
            </div>
          </section>
        </div>
      \`;

      const demoNav = $('home-demo-nav');
      if (demoNav) {
        demoNav.addEventListener('click', (e) => {
          const btn = e.target.closest('.demo-nav-item');
          if (!btn) return;
          demoNav.querySelectorAll('.demo-nav-item').forEach((b) => b.classList.toggle('is-on', b === btn));
        });
      }
      const szBar = $('demo-size-bar');
      if (szBar) {
        szBar.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-demo-sz]');
          if (!btn) return;
          state.demoBtnSize = btn.dataset.demoSz;
          szBar.querySelectorAll('.demo-size-btn').forEach((b) => b.classList.toggle('is-on', b === btn));
          const row = $('demo-btn-row');
          if (row) {
            row.querySelectorAll('.demo-btn').forEach((b) => {
              b.classList.remove('demo-btn--xl', 'demo-btn--m');
              if (state.demoBtnSize === 'xl') b.classList.add('demo-btn--xl');
              if (state.demoBtnSize === 'm') b.classList.add('demo-btn--m');
            });
          }
        });
      }
      setToc([]);
    }

    function renderOverview() {
      const m = DATA.manifest;
      const cards = DATA.components
        .map(
          (c, idx) => \`
        <button class="gallery-card anim-stagger" style="--d:\${Math.min(idx * 18, 280)}ms" data-comp="\${c.id}" type="button">
          <div class="gallery-card__top">
            <span class="gallery-card__name">\${esc(c.name)}\${c.cnName ? \`<span class="gallery-card__cn">\${esc(c.cnName)}</span>\` : ''}</span>
            <span class="gallery-card__cat">\${esc(c.category)}</span>
          </div>
          <div class="gallery-card__meta">
            <span>\${c.callableCount} 个可调用变体</span>
            <span class="gallery-card__arrow">查看详情 →</span>
          </div>
        </button>\`
        )
        .join('');

      $('main').innerHTML = \`
        <div class="anim-view">
          <section id="sec-intro">
            <div class="hero-eyebrow"><span class="hero-dot"></span>FS Design Core v\${esc(m.version)} · Release \${esc(m.releaseHash.slice(0, 12))}</div>
            <h1 class="hero-title">FS 设计规范与组件总览</h1>
            <p class="hero-desc">集中查阅全部 31 族组件的使用边界、实时样板、父子依赖关系，以及官方设计令牌、图标画风与区块组合范式。</p>
            <div class="hero-actions">
              <button class="btn btn--brand" data-comp="button" type="button">浏览组件详情</button>
              <button class="btn btn--outline" data-nav="tokens" type="button">查看设计令牌</button>
              <button class="btn btn--outline" data-nav="icons" type="button">官方图标库 (\${DATA.icons.length})</button>
            </div>
          </section>

          <section id="sec-stats" class="kpi-grid">
            <div class="kpi-card"><div class="kpi-card__num">\${m.stats.components}</div><div class="kpi-card__label">已集成组件族</div></div>
            <div class="kpi-card"><div class="kpi-card__num">\${m.stats.callableVariants}</div><div class="kpi-card__label">可调用变体（0 缺口）</div></div>
            <div class="kpi-card"><div class="kpi-card__num">\${m.stats.cssVariables}</div><div class="kpi-card__label">官方 CSS 令牌</div></div>
            <div class="kpi-card"><div class="kpi-card__num">\${m.stats.registeredIcons}</div><div class="kpi-card__label">已分类官方图标</div></div>
          </section>

          <section id="sec-gallery">
            <div class="sec-head">
              <h2>全部组件族</h2>
              <span>共 \${DATA.components.length} 族 · 点击查看实景预览与适用边界</span>
            </div>
            <div class="gallery-grid">\${cards}</div>
          </section>
        </div>
      \`;

      setToc([
        { id: 'sec-intro', label: '简介' },
        { id: 'sec-stats', label: '核心指标' },
        { id: 'sec-gallery', label: '全部组件 (31)' }
      ]);
    }

    function renderComponentDetail(compId) {
      const comp = DATA.components.find((c) => c.id === compId) || DATA.components[0];
      state.componentId = comp.id;

      const wideSet = new Set([
        'banner', 'card', 'carousel', 'collapse', 'comment', 'dialog',
        'form', 'icon-card', 'list', 'menu-navigation', 'navigation',
        'anchor-nav', 'rate', 'stepper', 'tab', 'table'
      ]);
      const isWideComp = wideSet.has(comp.id);

      function buildStageContent(compId, vKey, v) {
        const hasMultiSize = Array.isArray(v.sizeDemos) && v.sizeDemos.length > 1;
        const isButton = compId === 'button' && vKey !== 'cart-product-card';
        const isTextBtn = compId === 'text-button';
        const isIconBtn = compId === 'icon-button';
        const isCheckOrRadio = compId === 'checkbox' || compId === 'radio';

        if (!hasMultiSize && !isButton && !isTextBtn && !isIconBtn && !isCheckOrRadio) {
          return \`<div style="display:flex;justify-content:center;width:100%">\${v.exampleHtml || '<span style="color:var(--ink-muted);font-size:13px">暂无静态预览片段</span>'}</div>\`;
        }

        const blocks = [];
        if (Array.isArray(v.sizeDemos) && v.sizeDemos.length > 0) {
          const sizeCells = v.sizeDemos
            .map(
              (sd) => \`
            <div class="matrix-cell">
              <div>\${sd.exampleHtml}</div>
              <div class="matrix-cap"><strong>\${esc(sd.name)}</strong>\${sd.specs ? '<br>' + esc(sd.specs) : ''}</div>
            </div>\`
            )
            .join('');
          blocks.push(\`<div class="matrix-block"><div class="matrix-label">规格尺寸（\${v.sizeDemos.length} 种）</div><div class="matrix-row">\${sizeCells}</div></div>\`);
        }

        if (isButton && v.exampleHtml) {
          const base = v.exampleHtml;
          const hoverHtml = base.replace('class="ds-btn ', 'class="ds-btn ds-btn--hover ');
          const disabledHtml = base.replace('<button ', '<button disabled ');
          const loadingHtml = base
            .replace('class="ds-btn ', 'class="ds-btn ds-btn--loading ')
            .replace('<button ', '<button aria-busy="true" ');
          blocks.push(\`
            <div class="matrix-block">
              <div class="matrix-label">交互状态一览（默认 / 悬停 / 禁用 / 加载）</div>
              <div class="matrix-row">
                <div class="matrix-cell"><div>\${base}</div><div class="matrix-cap">默认 Default</div></div>
                <div class="matrix-cell"><div>\${hoverHtml}</div><div class="matrix-cap">悬停 Hover</div></div>
                <div class="matrix-cell"><div>\${disabledHtml}</div><div class="matrix-cap">禁用 Disabled</div></div>
                <div class="matrix-cell"><div>\${loadingHtml}</div><div class="matrix-cap">加载 Loading</div></div>
              </div>
            </div>\`);
        } else if (isTextBtn && v.exampleHtml) {
          const base = v.exampleHtml;
          const hoverHtml = base.replace('class="ds-text-btn ', 'class="ds-text-btn ds-text-btn--hover ');
          blocks.push(\`
            <div class="matrix-block">
              <div class="matrix-label">交互状态一览（默认 / 悬停）</div>
              <div class="matrix-row">
                <div class="matrix-cell"><div>\${base}</div><div class="matrix-cap">默认 Default</div></div>
                <div class="matrix-cell"><div>\${hoverHtml}</div><div class="matrix-cap">悬停 Hover</div></div>
              </div>
            </div>\`);
        } else if (isIconBtn && v.exampleHtml) {
          const base = v.exampleHtml;
          const hoverHtml = base.replace('class="ds-icon-btn ', 'class="ds-icon-btn ds-icon-btn--hover ');
          const disabledHtml = base.replace('<button ', '<button disabled ');
          blocks.push(\`
            <div class="matrix-block">
              <div class="matrix-label">交互状态一览（默认 / 悬停 / 禁用）</div>
              <div class="matrix-row">
                <div class="matrix-cell"><div>\${base}</div><div class="matrix-cap">默认 Default</div></div>
                <div class="matrix-cell"><div>\${hoverHtml}</div><div class="matrix-cap">悬停 Hover</div></div>
                <div class="matrix-cell"><div>\${disabledHtml}</div><div class="matrix-cap">禁用 Disabled</div></div>
              </div>
            </div>\`);
        } else if (isCheckOrRadio && v.exampleHtml) {
          const base = v.exampleHtml.replace(/\\s+checked(?:="[^"]*")?/g, '');
          const checkedHtml = base.replace('<input ', '<input checked ');
          const disabledHtml = base.replace('<input ', '<input disabled ');
          const checkedDisabledHtml = base.replace('<input ', '<input checked disabled ');
          blocks.push(\`
            <div class="matrix-block">
              <div class="matrix-label">交互状态一览（未选 / 选中 / 禁用 / 选中禁用）</div>
              <div class="matrix-row">
                <div class="matrix-cell"><div>\${base}</div><div class="matrix-cap">未选中 Default</div></div>
                <div class="matrix-cell"><div>\${checkedHtml}</div><div class="matrix-cap">已选中 Checked</div></div>
                <div class="matrix-cell"><div>\${disabledHtml}</div><div class="matrix-cap">禁用 Disabled</div></div>
                <div class="matrix-cell"><div>\${checkedDisabledHtml}</div><div class="matrix-cap">选中禁用</div></div>
              </div>
            </div>\`);
        }

        return \`<div class="matrix-group">\${blocks.join('')}</div>\`;
      }

      const variantEntries = Object.entries(comp.variants);
      const variantCards = variantEntries
        .map(([vKey, v], idx) => {
          const edits = (v.allowedEdits || []).map((e) => \`<span class="chip">\${esc(e)}</span>\`).join('');
          const isDark = /white|dark|hero/i.test(vKey) && comp.id !== 'form' && comp.id !== 'input' && comp.id !== 'card';
          const isWhiteStage = comp.id === 'icon-card' || comp.id === 'form' || comp.id === 'card';
          const stageCls =
            'variant-stage' +
            (isWideComp ? ' variant-stage--wide' : '') +
            (isDark ? ' variant-stage--dark' : isWhiteStage ? ' variant-stage--white' : '');
          const cardId = 'var-' + idx;
          const stageInner = isWideComp
            ? (v.exampleHtml || '<span style="color:var(--ink-muted);font-size:13px">暂无静态预览片段</span>')
            : buildStageContent(comp.id, vKey, v);
          return \`
          <article class="variant-card anim-stagger" id="\${cardId}" style="--d:\${Math.min(idx * 45, 240)}ms" data-variant-card="">
            <div class="variant-card__bar">
              <div class="variant-card__title">
                <span class="variant-card__name">\${esc(vKey)}</span>
                \${v.type && v.type !== vKey ? \`<code>\${esc(v.type)}</code>\` : ''}
                <span class="pill \${v.callable ? 'pill--brand' : ''}">\${v.callable ? '已开放调用' : '仅规范参考'}</span>
              </div>
              <div class="variant-card__tools">
                <div class="stage-tabs">
                  <button class="stage-tab is-active" data-vtab="preview" type="button">实时预览</button>
                  <button class="stage-tab" data-vtab="code" type="button">调用代码</button>
                </div>
                <button class="btn btn--outline btn--sm" data-copy="\${esc(v.callSnippet)}" type="button">复制片段</button>
              </div>
            </div>

            <div class="\${stageCls}" data-vpanel="preview">
              <div class="variant-stage__inner">\${stageInner}</div>
            </div>

            <div class="variant-code" data-vpanel="code" hidden>
              <p class="variant-code__label">组件调用语法</p>
              <pre>\${esc(v.callSnippet)}</pre>
            </div>

            <div class="variant-card__meta">
              <div class="do-dont-grid">
                <div class="do-box"><strong>✓ 适用场景（Do）</strong>\${esc(v.whenToUse || '按组件默认规范调用。')}</div>
                <div class="dont-box"><strong>✕ 禁用边界（Don\\'t）</strong>\${esc(v.whenNotToUse || '暂无特殊排除说明。')}</div>
              </div>
              \${edits ? \`<div class="chips"><span class="chip"><strong>可编辑字段：</strong></span>\${edits}</div>\` : ''}
            </div>
          </article>\`;
        })
        .join('');

      const parentChips = comp.parents.length
        ? comp.parents
            .map((p) => {
              const pid = p.replace(/^library-/, '');
              return \`<button class="chip chip--link" data-comp="\${esc(pid)}" type="button">↑ \${esc(pid)}</button>\`;
            })
            .join('')
        : '<span class="chip">顶层组件 / 暂无上游父组件</span>';

      const childChips = comp.dependencies.length
        ? [...new Set(comp.dependencies.map((d) => d.component))]
            .map((dep) => {
              const found = DATA.components.find((x) => x.name.toLowerCase() === dep.toLowerCase() || x.id === dep.toLowerCase());
              return found
                ? \`<button class="chip chip--link" data-comp="\${esc(found.id)}" type="button">↓ \${esc(dep)}</button>\`
                : \`<span class="chip">↓ \${esc(dep)}</span>\`;
            })
            .join('')
        : '<span class="chip">原子组件 / 无嵌套子组件</span>';

      $('main').innerHTML = \`
        <div class="anim-view">
          <div class="crumb"><span>文档</span><span class="crumb__sep">/</span><span>组件库</span><span class="crumb__sep">/</span><span class="crumb__cur">\${esc(comp.name)} \${esc(comp.cnName)}</span></div>
          <div class="detail-head">
            <div>
              <h1 class="page-title">\${esc(comp.name)} <span style="font-weight:400;font-size:22px;color:var(--ink-muted)">\${esc(comp.cnName)}</span></h1>
              <div class="detail-pills">
                <span class="pill pill--brand">\${comp.callableCount} 个可调用变体</span>
                <span class="pill">\${esc(comp.category)}</span>
                <span class="pill"><code>\${esc(comp.key)}</code></span>
              </div>
            </div>
          </div>

          <section id="sec-variants">
            <div class="variant-list">\${variantCards}</div>
          </section>

          <section id="sec-deps">
            <div class="sec-head">
              <h2>父子组件依赖关系</h2>
              <span>修改本组件时的级联影响范围</span>
            </div>
            <div class="variant-card" style="padding:18px 20px">
              <div style="margin-bottom:14px">
                <div style="font-size:12px;font-weight:600;color:var(--ink-muted);margin-bottom:8px">被以下父组件引用（修改本组件会联动影响）：</div>
                <div class="chips">\${parentChips}</div>
              </div>
              <div>
                <div style="font-size:12px;font-weight:600;color:var(--ink-muted);margin-bottom:8px">依赖以下子组件：</div>
                <div class="chips">\${childChips}</div>
              </div>
            </div>
          </section>
        </div>
      \`;

      const tocItems = variantEntries.map(([vKey], idx) => ({
        id: 'var-' + idx,
        label: vKey
      }));
      tocItems.push({ id: 'sec-deps', label: '父子依赖关系' });
      setToc(tocItems);
    }

    function renderTokens() {
      const q = state.tokenQuery.trim().toLowerCase();
      const keySwatches = [
        { name: '品牌主红 Brand Red', val: '#C00000' },
        { name: '链接蓝 Link Blue', val: '#0060BF' },
        { name: '主文字黑 Ink Primary', val: '#19191A' },
        { name: '正文深灰 Ink Secondary', val: '#4B4B4D' },
        { name: '辅助浅灰 Ink Muted', val: '#707070' },
        { name: '默认描边 Border', val: '#DEE0E3' },
        { name: '浅灰背景 Surface Gray', val: '#FAFBFB' },
        { name: '纯白表面 Surface White', val: '#FFFFFF' }
      ];
      const swatchHtml = keySwatches
        .map(
          (s) => \`
        <div class="swatch" data-copy="\${s.val}">
          <div class="swatch__color" style="background:\${s.val}"></div>
          <div class="swatch__info">
            <div class="swatch__name">\${esc(s.name)}</div>
            <div class="swatch__val">\${esc(s.val)}</div>
          </div>
        </div>\`
        )
        .join('');

      const rows = Object.entries(DATA.tokens.cssVariables || {})
        .filter(([k, v]) => !q || k.toLowerCase().includes(q) || v.toLowerCase().includes(q))
        .map(([k, v]) => {
          const isColor = /^#|rgba?\\(/i.test(v);
          return \`
          <tr data-copy="var(\${esc(k)})" style="cursor:pointer">
            <td><code>\${esc(k)}</code></td>
            <td>\${isColor ? \`<span class="color-dot" style="background:\${esc(v)}"></span>\` : ''}<span>\${esc(v)}</span></td>
          </tr>\`;
        })
        .join('');

      $('main').innerHTML = \`
        <div class="anim-view">
          <div class="crumb"><span>文档</span><span class="crumb__sep">/</span><span class="crumb__cur">设计令牌</span></div>
          <h1 class="page-title">设计令牌（Design Tokens）</h1>
          <p class="page-lead">自动解析同步自官方 <code>tokens.css</code>（共 \${DATA.tokens.cssVariableCount} 个 CSS 变量）。点击任意色卡或变量行即可一键复制。</p>

          <section id="sec-colors">
            <div class="sec-head"><h2>核心色板与品牌红边界</h2><span>点击色卡复制色值</span></div>
            <div class="swatch-grid">\${swatchHtml}</div>
            <div class="do-dont-grid" style="margin-bottom:28px">
              <div class="do-box"><strong>✓ #C00000 允许使用场景</strong>• 主转化实心按钮（filled-red）<br>• 导航/切换激活指示器（Tab 底红线、3px 左侧激活竖条）<br>• 价格强调数字与表单报错校验<br>• duotone-line 双色线性图标约 20% 面积点缀</div>
              <div class="dont-box"><strong>✕ #C00000 严禁使用场景</strong>• 客户/第三方机构或品牌名称<br>• 普通分类标签、正文与常规标题<br>• 卡片四周完整红框描边<br>• 普通内容阅读入口（如博客/案例 Read More）</div>
            </div>
          </section>

          <section id="sec-vars">
            <div class="sec-head">
              <h2>全量 CSS 变量表</h2>
              <input class="filter-input" id="token-filter" type="text" placeholder="筛选变量（如 color、spacing、radius）..." value="\${esc(state.tokenQuery)}">
            </div>
            <table class="token-table">
              <thead><tr><th>变量名</th><th>规范值</th></tr></thead>
              <tbody>\${rows}</tbody>
            </table>
          </section>
        </div>
      \`;

      const inp = $('token-filter');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
        inp.addEventListener('input', (e) => {
          state.tokenQuery = e.target.value;
          renderTokens();
        });
      }

      setToc([
        { id: 'sec-colors', label: '核心色板与红线' },
        { id: 'sec-vars', label: '全量 CSS 变量 (154)' }
      ]);
    }

    function renderIcons() {
      const families = ['all', ...new Set(DATA.icons.map((i) => i.styleFamily))];
      const famLabels = {
        all: '全部',
        'line-mono': '单色线性 line-mono',
        'ui-atom': '界面原子 ui-atom',
        'duotone-line': '黑红双色线性 duotone-line',
        'duotone-surface': '双色面性点缀 duotone-surface',
        'flat-illustration': '多色插画 flat-illustration',
        'brand-badge': '品牌徽章 brand-badge',
        'line-mono-lg': '大号线性 line-mono-lg'
      };
      const q = state.iconQuery.trim().toLowerCase();
      const filtered = DATA.icons.filter((i) => {
        if (state.iconFamily !== 'all' && i.styleFamily !== state.iconFamily) return false;
        if (q && !i.file.toLowerCase().includes(q)) return false;
        return true;
      });

      const pills = families
        .map((f) => {
          const count = f === 'all' ? DATA.icons.length : DATA.icons.filter((i) => i.styleFamily === f).length;
          return \`<button class="family-pill\${state.iconFamily === f ? ' is-active' : ''}" data-family="\${esc(f)}" type="button">\${esc(famLabels[f] || f)} (\${count})</button>\`;
        })
        .join('');

      const tiles = filtered
        .map((i) => {
          const isLightIcon = /white|play|pause|cart-add|arrow-white|light/i.test(i.file);
          return \`
        <button class="icon-tile" data-copy="\${esc(i.file)}" type="button" title="点击复制文件名">
          <div class="icon-tile__stage\${isLightIcon ? ' icon-tile__stage--dark' : ''}">
            <img src="\${esc(i.src)}" alt="\${esc(i.file)}" loading="lazy">
          </div>
          <span class="icon-tile__name">\${esc(i.file)}</span>
          <span class="icon-tile__fam">\${esc(i.styleFamily)}</span>
        </button>\`;
        })
        .join('');

      $('main').innerHTML = \`
        <div class="anim-view">
          <div class="crumb"><span>文档</span><span class="crumb__sep">/</span><span class="crumb__cur">官方图标库</span></div>
          <h1 class="page-title">官方注册图标库</h1>
          <p class="page-lead">共收录 \${DATA.icons.length} 枚官方 SVG 图标，按 7 大画风族谱严格分类。同一页面区块内严禁混用不同画风图标，点击任意图标即可复制文件名。</p>
          <div class="filter-bar">
            <div class="family-pills">\${pills}</div>
            <input class="filter-input" id="icon-filter" type="text" placeholder="输入关键词搜索图标..." value="\${esc(state.iconQuery)}">
          </div>
          <div class="icon-grid">\${tiles || '<p style="color:var(--ink-muted)">未找到匹配的图标。</p>'}</div>
        </div>
      \`;

      const inp = $('icon-filter');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
        inp.addEventListener('input', (e) => {
          state.iconQuery = e.target.value;
          renderIcons();
        });
      }

      setToc([]);
    }

    function renderPrinciples() {
      const cards = (DATA.principles || [])
        .map(
          (p, idx) => \`
        <article class="prin-card anim-stagger" id="prin-\${esc(p.id)}" style="--d:\${Math.min(idx * 50, 260)}ms">
          <div class="prin-card__head">
            <span class="prin-card__num">\${esc(p.code)}</span>
            <h2 class="prin-card__title">\${esc(p.title)}<span class="prin-card__en">\${esc(p.enTitle)}</span></h2>
          </div>
          <p class="prin-card__summary">\${esc(p.summary)}</p>
          <div class="do-dont-grid">
            <div class="do-box">
              <strong>✓ 推荐做法（Do）</strong>
              <ul class="prin-card__list">\${(p.doList || []).map((x) => \`<li>\${esc(x)}</li>\`).join('')}</ul>
            </div>
            <div class="dont-box">
              <strong>✕ 严禁踩线（Don\\'t）</strong>
              <ul class="prin-card__list">\${(p.dontList || []).map((x) => \`<li>\${esc(x)}</li>\`).join('')}</ul>
            </div>
          </div>
          <div class="prin-audit-box">
            <strong>评审自检</strong>
            <span>\${esc(p.reviewQuestion)}</span>
          </div>
        </article>\`
        )
        .join('');

      $('main').innerHTML = \`
        <div class="anim-view">
          <div class="crumb"><span>文档</span><span class="crumb__sep">/</span><span class="crumb__cur">设计原则</span></div>
          <h1 class="page-title">FS 设计原则（Design Principles）</h1>
          <p class="page-lead">FS 数字体验的 5 条核心 UI 设计价值观与评审准绳。不局限于具体像素细节，用于在设计方案比选、跨团队评审与视觉验收时，统一品牌审美与体验判断标准。</p>
          <div class="prin-list">\${cards}</div>
        </div>
      \`;

      setToc(
        (DATA.principles || []).map((p) => ({
          id: 'prin-' + p.id,
          label: p.code + ' · ' + p.title
        }))
      );
    }

    function renderRules() {
      const ruleCards = DATA.rules
        .map(
          (r) => \`
        <article class="rule-card rule-card--\${esc(r.severity)}">
          <div class="rule-card__top">
            <span class="sev-tag sev-tag--\${esc(r.severity)}">\${r.severity === 'error' ? '强制红线' : '设计建议'}</span>
            <code>\${esc(r.id)}</code>
            <span style="font-size:12px;color:var(--ink-muted)">\${esc(r.category)}</span>
          </div>
          <p class="rule-card__desc">\${esc(r.description)}</p>
        </article>\`
        )
        .join('');

      const patternCards = DATA.patterns
        .map(
          (p, idx) => \`
        <article class="pattern-card" id="pat-\${idx}">
          <h3>\${esc(p.title)}</h3>
          <pre>\${esc(p.body)}</pre>
        </article>\`
        )
        .join('');

      $('main').innerHTML = \`
        <div class="anim-view">
          <div class="crumb"><span>文档</span><span class="crumb__sep">/</span><span class="crumb__cur">规范与范式</span></div>
          <h1 class="page-title">核心规范与区块组合范式</h1>
          <p class="page-lead">机器可读的 <code>rules.json</code> 核心校验红线，以及从 FS 标杆页与实战中沉淀的 \${DATA.patterns.length} 套黄金区块组合范式。</p>
          <section id="sec-rules">
            <div class="sec-head"><h2>核心红线规则</h2><span>共 \${DATA.rules.length} 条</span></div>
            \${ruleCards}
          </section>
          <section id="sec-patterns">
            <div class="sec-head"><h2>页面区块组合范式（Patterns）</h2><span>共 \${DATA.patterns.length} 套</span></div>
            \${patternCards}
          </section>
        </div>
      \`;

      setToc([
        { id: 'sec-rules', label: '核心红线规则 (' + DATA.rules.length + ')' },
        { id: 'sec-patterns', label: '区块组合范式 (' + DATA.patterns.length + ')' }
      ]);
    }

    function render() {
      $('hdr-version').textContent = 'v' + DATA.manifest.version;
      $('shell').classList.toggle('is-home', state.view === 'home');
      syncTopNav();
      renderSidebar();
      if (state.view === 'home') renderHome();
      else if (state.view === 'overview') renderOverview();
      else if (state.view === 'principles') renderPrinciples();
      else if (state.view === 'components') renderComponentDetail(state.componentId);
      else if (state.view === 'tokens') renderTokens();
      else if (state.view === 'icons') renderIcons();
      else if (state.view === 'rules') renderRules();
      window.scrollTo(0, 0);
    }

    document.addEventListener('click', (e) => {
      const vtab = e.target.closest('[data-vtab]');
      if (vtab) {
        const card = vtab.closest('[data-variant-card]');
        if (card) {
          const target = vtab.dataset.vtab;
          card.querySelectorAll('[data-vtab]').forEach((b) => b.classList.toggle('is-active', b === vtab));
          card.querySelectorAll('[data-vpanel]').forEach((p) => { p.hidden = p.dataset.vpanel !== target; });
        }
        return;
      }
      const compBtn = e.target.closest('[data-comp]');
      if (compBtn) {
        e.preventDefault();
        state.view = 'components';
        state.componentId = compBtn.dataset.comp;
        closeCmd();
        render();
        return;
      }
      const navBtn = e.target.closest('[data-nav]');
      if (navBtn) {
        e.preventDefault();
        state.view = navBtn.dataset.nav;
        closeCmd();
        render();
        return;
      }
      const famBtn = e.target.closest('[data-family]');
      if (famBtn) {
        state.iconFamily = famBtn.dataset.family;
        renderIcons();
        return;
      }
      const copyEl = e.target.closest('[data-copy]');
      if (copyEl) {
        copyText(copyEl.dataset.copy);
        return;
      }
    });

    function openCmd() {
      $('cmd-backdrop').hidden = false;
      $('cmd-input').value = '';
      renderCmdResults('');
      $('cmd-input').focus();
    }
    function closeCmd() {
      $('cmd-backdrop').hidden = true;
    }
    function renderCmdResults(q) {
      const term = q.trim().toLowerCase();
      const out = [];
      for (const c of DATA.components) {
        if (!term || c.name.toLowerCase().includes(term) || c.id.includes(term) || c.cnName.includes(term)) {
          out.push({ label: c.name + (c.cnName ? ' ' + c.cnName : '') + '（' + c.callableCount + ' 变体）', type: '组件', attr: \`data-comp="\${c.id}"\` });
        }
      }
      for (const [k, v] of Object.entries(DATA.tokens.cssVariables || {})) {
        if (term && (k.toLowerCase().includes(term) || v.toLowerCase().includes(term))) {
          out.push({ label: k + ': ' + v, type: '令牌', attr: \`data-copy="var(\${esc(k)})"\` });
        }
        if (out.length >= 24) break;
      }
      for (const ic of DATA.icons) {
        if (term && ic.file.toLowerCase().includes(term)) {
          out.push({ label: ic.file, type: ic.styleFamily, attr: \`data-copy="\${esc(ic.file)}"\` });
        }
        if (out.length >= 32) break;
      }
      $('cmd-results').innerHTML = out.length
        ? out.slice(0, 24).map((r) => \`<button class="cmd-item" \${r.attr} type="button"><span>\${esc(r.label)}</span><span class="cmd-item__type">\${esc(r.type)}</span></button>\`).join('')
        : '<p style="padding:16px;color:var(--ink-muted);font-size:13px;margin:0">未找到匹配结果。</p>';
    }

    document.documentElement.removeAttribute('data-theme');
    $('open-cmd').addEventListener('click', openCmd);
    $('cmd-backdrop').addEventListener('click', (e) => { if (e.target === $('cmd-backdrop')) closeCmd(); });
    $('cmd-input').addEventListener('input', (e) => renderCmdResults(e.target.value));
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCmd();
      } else if (e.key === 'Escape') {
        closeCmd();
      }
    });

    render();
  </script>
${releaseScriptsHtml}
</body>
</html>`;

  fs.writeFileSync(OUT_FILE, html, 'utf8');
  console.log(`Built ${path.relative(ROOT, OUT_FILE)} (${Math.round(Buffer.byteLength(html, 'utf8') / 1024)} KB)`);
}

main();
