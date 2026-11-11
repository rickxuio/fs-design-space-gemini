#!/usr/bin/env node
/**
 * FS Design System — Headless Geometry Verifier
 *
 * 补 validate.js 的几何/视觉盲区：用 puppeteer-core 驱动系统 Chrome，
 * 渲染页面后量真实 bounding box，做数值断言。
 *
 *   node verify.js                      # 校验 page-specs/ + pages/
 *   node verify.js path/to/page.html    # 校验指定文件
 *
 * 依赖：puppeteer-core（不下载 Chromium，复用系统 Chrome）。
 * Chrome 路径：环境变量 CHROME_PATH 优先，否则默认 macOS Chrome。
 *
 * 检查项：
 *   CARD_ALIGN     同一网格行卡片尾部 link/tags 的 bottom Y 必须一致（error）
 *   CAROUSEL_BTN   走马灯按钮必须可见、垂直居中、不被 overflow 裁、不出视口（error）
 *   IMG_BROKEN     <img> 加载失败（naturalWidth=0）——降级为 warning（避免离线误报）
 */

'use strict';

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const PAGE_SPECS_DIR = path.join(__dirname, 'fs-components', 'page-specs');
const PAGES_DIR = path.join(__dirname, 'pages');

const CHROME_PATH = process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// 在页面上下文运行的几何断言。返回 {errors:[], warns:[]}
function pageProbe() {
  const round = (n) => Math.round(n);
  const errors = [];
  const warns = [];

  // ── 1. 卡片尾部元素同行居底对齐 ──
  const CARD_SEL = '.ds-card--vertical, .ds-icon-card';
  const TRAIL_SEL = '.ds-card__link, .ds-card__tags, .ds-icon-card__link';
  const grids = new Set();
  document.querySelectorAll(CARD_SEL).forEach((c) => { if (c.parentElement) grids.add(c.parentElement); });
  grids.forEach((grid) => {
    const cards = Array.from(grid.children).filter((el) => el.matches && el.matches(CARD_SEL));
    if (cards.length < 2) return;
    const rows = {};
    cards.forEach((c) => {
      const top = round(c.getBoundingClientRect().top);
      (rows[top] = rows[top] || []).push(c);
    });
    Object.values(rows).forEach((rowCards) => {
      if (rowCards.length < 2) return;
      const bottoms = rowCards
        .map((c) => { const el = c.querySelector(TRAIL_SEL); return el ? round(el.getBoundingClientRect().bottom) : null; })
        .filter((v) => v !== null);
      if (bottoms.length < 2) return;
      const min = Math.min(...bottoms), max = Math.max(...bottoms);
      if (max - min > 2) {
        errors.push(`CARD_ALIGN: 同行卡片尾部元素未居底对齐（bottom Y 差 ${max - min}px：[${bottoms.join(', ')}]）— 查 components.css 的 margin-top:auto`);
      }
    });
  });

  // ── 2. 走马灯按钮几何 ──
  document.querySelectorAll('.ds-carousel').forEach((car) => {
    const cr = car.getBoundingClientRect();
    const cy = cr.top + cr.height / 2;
    const btns = new Set(car.querySelectorAll('.ds-carousel__btn'));
    if (car.parentElement) car.parentElement.querySelectorAll('.ds-carousel__btn').forEach((b) => btns.add(b));
    btns.forEach((b) => {
      const br = b.getBoundingClientRect();
      if (br.width === 0 || br.height === 0) {
        errors.push(`CAROUSEL_BTN: 按钮不可见/被裁（${round(br.width)}×${round(br.height)}）`); return;
      }
      const bcy = br.top + br.height / 2;
      if (Math.abs(bcy - cy) > 4) {
        errors.push(`CAROUSEL_BTN: 按钮未垂直居中（按钮中心 ${round(bcy)} vs 轮播中心 ${round(cy)}）`);
      }
      if (car.contains(b) && (br.left < cr.left - 1 || br.right > cr.right + 1)) {
        errors.push('CAROUSEL_BTN: 按钮在 overflow:hidden 的 .ds-carousel 内且超出边界，会被裁（应移到版心外、.ds-carousel 之外）');
      }
      if (br.right < 0 || br.left > window.innerWidth) {
        errors.push(`CAROUSEL_BTN: 按钮跑出视口（left=${round(br.left)} right=${round(br.right)}）`);
      }
    });
  });

  // ── 3. 坏图 ──
  document.querySelectorAll('img').forEach((img) => {
    if (!img.src) return;
    if (img.complete && img.naturalWidth === 0) {
      warns.push(`IMG_BROKEN: 图片加载失败 ${img.src.slice(0, 90)}`);
    }
  });

  return { errors, warns };
}

function collectTargets(args) {
  const fileArgs = args.filter((a) => !a.startsWith('--'));
  if (fileArgs.length > 0) return fileArgs.map((f) => path.resolve(f));
  let targets = [];
  for (const dir of [PAGE_SPECS_DIR, PAGES_DIR]) {
    if (fs.existsSync(dir)) {
      targets = targets.concat(
        fs.readdirSync(dir).filter((f) => f.endsWith('.html')).map((f) => path.join(dir, f))
      );
    }
  }
  return targets;
}

async function main() {
  const args = process.argv.slice(2);
  const targets = collectTargets(args);
  if (targets.length === 0) { console.log('No HTML to verify.'); process.exit(0); }

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`✗ 找不到 Chrome：${CHROME_PATH}\n  设置环境变量 CHROME_PATH 指向 Chrome 可执行文件后重试。`);
    process.exit(2);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let totalErrors = 0;
  let totalWarns = 0;

  for (const file of targets) {
    const rel = path.relative(__dirname, file);
    const page = await browser.newPage();
    await page.setViewport({ width: 1680, height: 1000, deviceScaleFactor: 1 });
    let result = { errors: [], warns: [] };
    try {
      await page.goto('file://' + file, { waitUntil: 'networkidle2', timeout: 30000 });
      result = await page.evaluate(pageProbe);
    } catch (e) {
      result.warns.push(`LOAD: 页面加载/求值异常（${String(e.message).slice(0, 80)}）`);
    }
    await page.close();

    totalErrors += result.errors.length;
    totalWarns += result.warns.length;
    if (result.errors.length === 0 && result.warns.length === 0) {
      console.log(`✓ ${rel} — 几何校验通过`);
    } else {
      console.log(`\n${rel}`);
      result.errors.forEach((m) => console.log(`  ✗ ERROR ${m}`));
      result.warns.forEach((m) => console.log(`  ⚠ WARN  ${m}`));
    }
  }

  await browser.close();

  console.log(`\n────────────────────────────────────`);
  console.log(`几何校验完成：${targets.length} 个文件，${totalErrors} 个 error，${totalWarns} 个 warning`);
  if (totalErrors > 0) { console.log('结果：未通过 ✗'); process.exit(1); }
  console.log('结果：通过 ✓');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(2); });
