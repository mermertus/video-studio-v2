import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:8080/preview-testimonios';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1100 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[pageerror]', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('[console:err]', m.text()); });
page.on('response', r => { if (r.status() >= 400) console.error(`[resp ${r.status()}]`, r.url()); });

console.log('goto', url);
await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(3000);

// Seek to mid-Olga
await page.evaluate(() => {
  const seek = document.getElementById('seek');
  if (seek) {
    const pct = (60 / 338) * 100;
    seek.value = String(pct);
    seek.dispatchEvent(new Event('input', { bubbles: true }));
  }
});
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/wrapper-olga-mid.png' });
console.log('saved /tmp/wrapper-olga-mid.png');

await browser.close();

