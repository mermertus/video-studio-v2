import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[err]', e.message));
await page.goto('http://localhost:8080/preview-full', { waitUntil: 'domcontentloaded', timeout: 30000 });
const ifr = await page.$('#compFrame');
const frame = await ifr.contentFrame();
await frame.waitForFunction(() => window.__timelines && window.__timelines['full-pt1'] && typeof window.__timelines['full-pt1'].duration === 'function', null, { timeout: 60000, polling: 200 });
const r = await frame.evaluate(() => {
  const tl = window.__timelines['full-pt1'];
  tl.pause(); tl.seek(23.5);
  const fn = (id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    return { 
      style: el.getAttribute('style'),
      computed_transform: getComputedStyle(el).transform
    };
  };
  return {
    duration: tl.duration(),
    time: tl.time(),
    knobA: fn('s3-knob-a'),
    knobC: fn('s3-knob-c'),
    fillA: fn('s3-fill-a'),
    fillC: fn('s3-fill-c'),
    slA: fn('s3-sl-a'),
    cursor: fn('s3-cursor')
  };
});
console.log(JSON.stringify(r, null, 2));
await browser.close();

