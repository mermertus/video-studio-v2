import { chromium } from 'playwright';

const compId = process.argv[2] || 's01-hook';
const t = parseFloat(process.argv[3] || '0.6');
const outDir = process.argv[4] || 'renders/frames';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[pageerror]', e.message));
page.on('console', m => console.error(`[console:${m.type()}]`, m.text()));
page.on('response', r => {
  if (r.status() >= 400) console.error(`[resp ${r.status()}]`, r.url());
});

const url = `http://127.0.0.1:3002/?comp=${encodeURIComponent(compId)}`;
console.log('goto', url);
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

// Studio loads comps inside an iframe nested in <hyperframes-player>'s shadowRoot.
// Drill in to find it.
await page.waitForFunction(() => {
  const p = document.querySelector('hyperframes-player');
  return p && p.shadowRoot && p.shadowRoot.querySelector('iframe');
}, null, { timeout: 30000, polling: 250 });

const frameInfo = await page.evaluate(() => {
  const p = document.querySelector('hyperframes-player');
  const iframes = [...p.shadowRoot.querySelectorAll('iframe')];
  return iframes.map(f => ({ src: f.src, name: f.name, srcdoc: !!f.srcdoc }));
});
console.log('iframes in player:', JSON.stringify(frameInfo));

const frameHandle = await page.evaluateHandle(() => {
  const p = document.querySelector('hyperframes-player');
  return p.shadowRoot.querySelector('iframe');
});
const frame = await frameHandle.contentFrame();
if (!frame) throw new Error('Could not access iframe contentFrame');
console.log('iframe URL:', frame.url());

// Wait for the timeline INSIDE the iframe.
await frame.waitForFunction(
  (id) => window.__timelines && typeof window.__timelines[id]?.duration === 'function',
  compId,
  { timeout: 30000, polling: 100 }
);

const dims = await frame.evaluate((id) => {
  const root = document.querySelector(`[data-composition-id="${id}"]`);
  return { w: +root.getAttribute('data-width'), h: +root.getAttribute('data-height') };
}, compId);
console.log('dims', dims);
await page.setViewportSize({ width: dims.w, height: dims.h });

const r = await frame.evaluate(async ({id, t}) => {
  const master = window.__timelines['vsl-v3-master'];
  master.pause(); master.seek(t);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const subRoot = document.querySelector(`[data-composition-id="${id}"]`);
  return {
    dur: master.duration(),
    fullDocHtml: document.documentElement.outerHTML,
  };
}, { id: compId, t });
// Print just enough to see structure
console.log('--- DOC PEEK (first 2500 chars) ---');
console.log(r.fullDocHtml.slice(0, 2500));
console.log('--- DOC PEEK (chars 5000-7500) ---');
console.log(r.fullDocHtml.slice(5000, 7500));
console.log('seekto', t, 'of', r.dur);
console.log('stats', JSON.stringify(r.stats));

// Screenshot the iframe content via the contentFrame's body.
const tStr = String(t).replace(/\./g, '_');
const outPath = `${outDir}/scrub-${compId}-t${tStr}.png`;
const bodyHandle = await frame.locator('body').first();
await bodyHandle.screenshot({ path: outPath });
console.log('saved', outPath);
await browser.close();

