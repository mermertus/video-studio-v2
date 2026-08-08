#!/usr/bin/env node
// scrub-standalone.mjs â€” escena Hyperframes cargada como standalone HTML (file://)
// para iterar look + timing sin necesidad de Studio runtime.
//
// Usage:
//   node scripts/scrub-standalone.mjs <comp-html-path> <comp-id> <timestamp-sec> [out-dir]

import { chromium } from 'playwright';
import { resolve, dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { pathToFileURL } from 'url';

const [, , compPath, compId, tArg, outDirArg] = process.argv;
if (!compPath || !compId || !tArg) {
  console.error('Usage: scrub-standalone.mjs <comp.html> <comp-id> <t> [out-dir]');
  process.exit(1);
}
const t = parseFloat(tArg);
const outDir = outDirArg || 'renders/frames';
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const absPath = resolve(compPath);
const url = pathToFileURL(absPath).href;
console.log('[scrub] loading', url);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.error('[pageerror]', e.message));
page.on('console', m => {
  if (m.type() === 'error') console.error('[console:error]', m.text());
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

// Wait for GSAP timeline to register
await page.waitForFunction(
  (id) => window.__timelines && typeof window.__timelines[id]?.duration === 'function',
  compId,
  { timeout: 10000, polling: 50 }
);

// Read root dimensions and resize viewport
const dims = await page.evaluate((id) => {
  const root = document.querySelector(`[data-composition-id="${id}"]`);
  return { w: +root.getAttribute('data-width'), h: +root.getAttribute('data-height') };
}, compId);
await page.setViewportSize({ width: dims.w, height: dims.h });
console.log('[scrub] dims', dims);

const r = await page.evaluate(async ({ id, t }) => {
  const tl = window.__timelines[id];
  tl.pause();
  tl.seek(t);
  // Force ALL .clip elements that should be visible at t to be visible.
  // Without framework, default visibility is "visible" anyway, but if you
  // set explicit visibility CSS elsewhere this protects against stale states.
  document.querySelectorAll('[data-start]').forEach((el) => {
    const s = parseFloat(el.getAttribute('data-start') || '0');
    const d = parseFloat(el.getAttribute('data-duration') || '0');
    const active = t >= s && t <= s + d + 0.01;
    el.style.visibility = active ? 'visible' : 'hidden';
  });
  // Stop any timer-driven media; pin <video> currentTime to t - data-start.
  document.querySelectorAll('video').forEach((v) => {
    v.pause();
    const s = parseFloat(v.getAttribute('data-start') || '0');
    try { v.currentTime = Math.max(0, t - s); } catch (e) {}
  });
  // 2 rAF for paint settling
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  return { dur: tl.duration() };
}, { id: compId, t });
console.log('[scrub] seekto', t, 'of', r.dur);

// give video an extra moment to seek
await page.waitForTimeout(400);

const el = await page.$(`[data-composition-id="${compId}"]`);
const tStr = String(t).replace(/\./g, '_');
const outPath = resolve(outDir, `standalone-${compId}-t${tStr}.png`);
await el.screenshot({ path: outPath });
console.log('[scrub] saved', outPath);
await browser.close();

