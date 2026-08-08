import { chromium } from 'playwright';
const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[pageerror]', e.message));
await page.goto('http://127.0.0.1:3002/api/projects/_maria_VSL-v3/preview/compositions/full-pt1.html', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForFunction(() => window.__timelines && window.__timelines['full-pt1'], null, { timeout: 30000 });
await page.evaluate(() => {
  const tl = window.__timelines['full-pt1'];
  tl.pause();
  tl.seek(7.0);
});
await page.waitForTimeout(400);
const info = await page.evaluate(() => {
  const el = document.getElementById('s1-para-ti');
  const words = el ? el.querySelectorAll('.s1-pt-w') : [];
  const w1 = words[0];
  const w1Computed = w1 ? window.getComputedStyle(w1) : null;
  const spotlight = document.getElementById('s1-spotlight');
  const spotComputed = spotlight ? window.getComputedStyle(spotlight) : null;
  return {
    paraTiExists: !!el,
    paraTiHTML: el ? el.outerHTML.substring(0, 400) : 'NULL',
    wordsCount: words.length,
    w1Opacity: w1Computed ? w1Computed.opacity : 'NULL',
    w1Visibility: w1Computed ? w1Computed.visibility : 'NULL',
    spotlightOpacity: spotComputed ? spotComputed.opacity : 'NULL',
    spotlightVisibility: spotComputed ? spotComputed.visibility : 'NULL',
    spotlightDisplay: spotComputed ? spotComputed.display : 'NULL',
  };
});
console.log(JSON.stringify(info, null, 2));
await b.close();

