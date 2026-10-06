import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  await mkdir("output/playwright", { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(process.env.UI_VIEWER_URL || 'http://127.0.0.1:5173/ui-viewer/');
  await page.locator('iframe[data-ready="true"]').first().waitFor();
  assert.equal(await page.locator('.explorer-hero .library-filters').count(), 0);
  for (const group of await page.locator('.library-group').all()) {
    const names = await group.locator('button').evaluateAll(nodes => nodes.map(n => [...n.childNodes].filter(c => c.nodeType === Node.TEXT_NODE).map(c => c.textContent).join('').trim()));
    assert.deepEqual(names, [...names].sort((a,b) => a.localeCompare(b, 'en', {sensitivity:'base'})));
  }
  await page.frameLocator('iframe').first().getByRole('button', {name:'Continue', exact:true}).waitFor();
  await page.waitForFunction(() => [...document.querySelectorAll('.component-tile')].every(n => getComputedStyle(n).opacity === '1'));
  await page.screenshot({path:'output/playwright/hub-desktop.png'});
  await page.getByRole('button', {name:'Headless UI Reference', exact:true}).click();
  assert.equal(await page.locator('.component-tile').count(), 3);
  assert.equal(await page.locator('iframe').count(), 0);
  await page.getByRole('button', {name:'View Headless UI Dialog code', exact:true}).click();
  await page.locator('.source-code').filter({hasText:'Source is not redistributed'}).waitFor();
  await page.getByRole('button', {name:'Clear filters', exact:true}).click();
  await page.getByRole('button', {name:'Hide filters'}).click();
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button', {name:'Show filters'}).click();
  assert(await page.locator('.sidebar-libraries').isVisible());
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({path:'output/playwright/hub-mobile.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.getByRole('button', {name:'SwiftUI', exact:true}).click();
  await page.waitForFunction(() => [...document.querySelectorAll('.component-tile')].every(n => getComputedStyle(n).transform === 'none'));
  console.log('Hub checks passed: alphabetical sidebar, references, source, clear filters, mobile overflow, reduced motion.');
} finally { await browser.close(); }
