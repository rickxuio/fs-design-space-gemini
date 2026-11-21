#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const puppeteer = require('puppeteer-core');

const CHROME_PATH = process.env.PUPPETEER_EXECUTABLE_PATH
  || process.env.CHROME_PATH
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: CHROME_PATH,
    args: ['--no-sandbox', '--allow-file-access-from-files']
  });
  const page = await browser.newPage();

  try {
    await page.goto(`file://${path.join(__dirname, '..', 'component-library.html')}#input-number`);
    await page.waitForSelector('.nav__item[data-id="stepper"]');
    await page.evaluate(() => {
      localStorage.setItem('fs-library-sidebar-collapsed', '1');
      location.reload();
    });
    await page.waitForSelector('body.sidebar-collapsed .nav__item[data-id="stepper"]');

    const stepper = '.nav__item[data-id="stepper"]';
    await page.hover(stepper);
    await new Promise(resolve => setTimeout(resolve, 300));
    const pointerState = await page.$eval(stepper, (target) => {
      const items = Array.from(document.querySelectorAll('.nav__item[data-id]'))
        .filter(item => item.offsetParent !== null);
      const index = items.indexOf(target);
      const widthAt = offset => getComputedStyle(items[index + offset].querySelector('.nav__compact-mark')).width;
      return {
        widths: [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(widthAt),
        itemHeight: getComputedStyle(target).height,
        markHeight: getComputedStyle(target.querySelector('.nav__compact-mark')).height,
        color: getComputedStyle(target.querySelector('.nav__compact-mark')).backgroundColor,
        tooltip: document.querySelector('.sidebar-tooltip__title').textContent,
        tooltipVisible: document.getElementById('sidebar-tooltip').classList.contains('is-visible')
      };
    });
    assert.deepEqual(pointerState.widths, ['6px', '10px', '14px', '20px', '26px', '20px', '14px', '10px', '6px']);
    assert.equal(pointerState.itemHeight, '10px');
    assert.equal(pointerState.markHeight, '1.5px');
    assert.equal(pointerState.color, 'rgb(25, 25, 26)');
    assert.equal(pointerState.tooltip, '步骤条 Step Bar');
    assert.equal(pointerState.tooltipVisible, true);

    await page.mouse.move(200, 200);
    await new Promise(resolve => setTimeout(resolve, 220));
    assert.equal(await page.$eval(stepper, target => getComputedStyle(target.querySelector('.nav__compact-mark')).width), '6px');
    await page.focus(stepper);
    await new Promise(resolve => setTimeout(resolve, 220));
    assert.equal(await page.$eval(stepper, target => getComputedStyle(target.querySelector('.nav__compact-mark')).width), '26px');
    await page.$eval(stepper, target => target.blur());
    await new Promise(resolve => setTimeout(resolve, 220));
    assert.equal(await page.$eval(stepper, target => getComputedStyle(target.querySelector('.nav__compact-mark')).width), '6px');

    await page.click('#sidebar-toggle');
    assert.equal(await page.$eval('body', body => body.classList.contains('sidebar-collapsed')), false);
    assert.equal(await page.$$eval('.nav__compact-mark', marks => marks.every(mark => !mark.style.getPropertyValue('--compact-mark-width'))), true);
    console.log('✓ Component library collapsed-sidebar interaction checks passed');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
