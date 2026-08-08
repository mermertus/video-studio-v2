#!/usr/bin/env node
// scrub-crop.mjs â€” captura una sub-region de la composition (e.g. caption strip)
// para auto-review de detalles. Carga la comp standalone via file://.
//
// Usage: node scripts/scrub-crop.mjs <comp.html> <comp-id> <t> <crop-x,y,w,h> <out>

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { pathToFileURL } from 'url';

const [, , compPath, compId, tArg, cropArg, outArg] = process.argv;
if (!compPath || !compId || !tArg || !cropArg || !outArg) {
  console.error('Usage: scrub-crop.mjs <comp-http-url-or-path> <id> <t> <x,y,w,h> <out>');
  process.exit(1);
}
const t = parseFloat(tArg);
const [x, y, w, h] = cropArg.split(',').map(Number);
// If it looks like an HTTP URL, use it directly; otherwise treat as file path.
const url = compPath.startsWith('http') ? compPath : pathToFileURL(resolve(compPath)).href;
const outAbs = resolve(outArg);
if (!existsSync(dirname(outAbs))) mkdirSync(dirname(outAbs), { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[pageerror]', e.message));

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForFunction(
  (id) => window.__timelines && window.__timelines[id] && typeof window.__timelines[id].duration === 'function',
  compId,
  { timeout: 60000, polling: 150 }
);
await page.evaluate(async ({ id, t }) => {
  const tl = window.__timelines[id];
  tl.pause(); tl.seek(t);
  document.querySelectorAll('[data-start]').forEach((el) => {
    const s = parseFloat(el.getAttribute('data-start') || '0');
    const d = parseFloat(el.getAttribute('data-duration') || '0');
    el.style.visibility = (t >= s && t <= s + d + 0.01) ? 'visible' : 'hidden';
  });
  document.querySelectorAll('video').forEach((v) => {
    v.pause();
    const s = parseFloat(v.getAttribute('data-start') || '0');
    try { v.currentTime = Math.max(0, t - s); } catch (e) {}
  });
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
}, { id: compId, t });
await page.waitForTimeout(300);
await page.screenshot({ path: outAbs, clip: { x, y, width: w, height: h } });
console.log('saved', outAbs);
await browser.close();

