#!/usr/bin/env node
// scrub-wrapper.mjs â€” captura screenshots del wrapper standalone (preview-*.html)
// vÃ­a HTTP local server. Ãštil para verificar el iframe scaling tal como lo verÃ­a Maria
// en su browser, no del HTML standalone "limpio".
//
// Usage:
//   node scripts/scrub-wrapper.mjs <wrapper-url> <comp-id> <timestamp-sec> [out-path] [viewport-w] [viewport-h]
//
// Example:
//   node scripts/scrub-wrapper.mjs http://localhost:8080/preview-s01 s01-hook 4.6 \
//     video-projects/_maria_VSL-v3/renders/frames/wrapper-t4_6.png 1440 900

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';

const [, , url, compId, tArg, outPathArg, vwArg, vhArg] = process.argv;
if (!url || !compId || !tArg) {
  console.error('Usage: scrub-wrapper.mjs <wrapper-url> <comp-id> <t> [out-path] [vw] [vh]');
  process.exit(1);
}
const t = parseFloat(tArg);
const vw = parseInt(vwArg || '1440', 10);
const vh = parseInt(vhArg || '900', 10);
const outPath = outPathArg || `renders/frames/wrapper-${compId}-t${String(t).replace(/\./g, '_')}-${vw}x${vh}.png`;
const outAbs = resolve(outPath);
if (!existsSync(dirname(outAbs))) mkdirSync(dirname(outAbs), { recursive: true });

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: vw, height: vh } });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[pageerror]', e.message));
page.on('console', m => { if (m.type() === 'error') console.error('[console:err]', m.text()); });

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

// Reach into the iframe in the wrapper, force-pause the timeline at t, force-pause media.
const ifr = await page.$('#compFrame');
const frame = await ifr.contentFrame();

await frame.waitForFunction(
  (id) => window.__timelines && typeof window.__timelines[id]?.duration === 'function',
  compId,
  { timeout: 30000, polling: 100 }
);

const r = await frame.evaluate(async ({ id, t }) => {
  const tl = window.__timelines[id];
  tl.pause();
  // suppressEvents=false â†’ permite que tl.call callbacks firen durante seek
  tl.seek(t, false);
  document.querySelectorAll('[data-start]').forEach((el) => {
    const s = parseFloat(el.getAttribute('data-start') || '0');
    const d = parseFloat(el.getAttribute('data-duration') || '0');
    const active = t >= s && t <= s + d + 0.01;
    el.style.visibility = active ? 'visible' : 'hidden';
  });
  document.querySelectorAll('video').forEach((v) => {
    v.pause();
    const s = parseFloat(v.getAttribute('data-start') || '0');
    try { v.currentTime = Math.max(0, t - s); } catch (e) {}
  });
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  return { dur: tl.duration() };
}, { id: compId, t });
console.log(`[wrapper-scrub] ${compId} @ ${t}s of ${r.dur}s â€” viewport ${vw}x${vh}`);

await page.waitForTimeout(400);
await page.screenshot({ path: outAbs, fullPage: false });
console.log('saved', outAbs);
await browser.close();

