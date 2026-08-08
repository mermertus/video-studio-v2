#!/usr/bin/env node
// Frame scrub para Hyperframes â€” captura un frame de la composiciÃ³n en vivo
// en `npx hyperframes preview` (localhost:3002) al timestamp exacto que indiques,
// sin pagar un render completo.
//
// Usage:
//   node scripts/frame.mjs <comp-id> <timestamp-sec> [--output renders/frames/custom.png]
//
// Prerequisito: `npx hyperframes preview` corriendo (`localhost:3002`).
// CWD: ejecutÃ¡ siempre desde dentro del proyecto (`video-projects/<slug>/`).
// Output default: renders/frames/scrub-<comp-id>-t<timestamp>.png

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import http from 'http';

const STUDIO_HOST = '127.0.0.1';
const STUDIO_PORT = 3002;
const STUDIO_URL = `http://${STUDIO_HOST}:${STUDIO_PORT}`;

const args = process.argv.slice(2);
if (args.length < 2 || args[0] === '-h' || args[0] === '--help') {
  console.log(`frame.mjs â€” scrub Hyperframes Studio y capturar frame

Usage:
  node scripts/frame.mjs <comp-id> <timestamp-sec> [--output <path>]

Args:
  <comp-id>         data-composition-id de la comp a scrubear
  <timestamp-sec>   segundos dentro de la timeline (e.g. 1.8)

Flags:
  --output <path>   override del output. Default:
                    renders/frames/scrub-<comp-id>-t<timestamp>.png

Prerequisito:
  npx hyperframes preview   (en otro terminal, mismo proyecto, background)
`);
  process.exit(args.length < 2 ? 1 : 0);
}

const compId = args[0];
const timestamp = Number(args[1]);
if (Number.isNaN(timestamp) || timestamp < 0) {
  console.error(`Invalid timestamp: ${args[1]} â€” debe ser un nÃºmero >= 0`);
  process.exit(1);
}

let outputOverride = null;
for (let i = 2; i < args.length; i++) {
  if (args[i] === '--output') {
    outputOverride = args[++i];
  } else {
    console.error(`Unknown flag: ${args[i]}`);
    process.exit(1);
  }
}

// 1. Verificar que Studio estÃ¡ corriendo.
const studioUp = await probeStudio();
if (!studioUp) {
  console.error(
    `Studio no responde en ${STUDIO_URL}.\n` +
      `LevantÃ¡ Hyperframes Studio en otra terminal y volvÃ© a intentar:\n` +
      `  npx hyperframes preview`
  );
  process.exit(2);
}

const url = `${STUDIO_URL}/?comp=${encodeURIComponent(compId)}`;
console.log(`[frame] scrubbing ${compId} @ t=${timestamp}s â†’ ${url}`);

const browser = await chromium.launch({ headless: true });
try {
  // Viewport temporal â€” se ajusta despuÃ©s de leer data-width/height de la comp.
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();

  // Log console errors del Studio en stderr para debugging.
  page.on('pageerror', (err) => console.error(`[studio:pageerror] ${err.message}`));

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // 2. Esperar a que la timeline estÃ© registrada.
  await page.waitForFunction(
    (id) => window.__timelines && typeof window.__timelines[id]?.duration === 'function',
    compId,
    { timeout: 10000, polling: 100 }
  ).catch(() => {
    throw new Error(
      `Timeline window.__timelines["${compId}"] no apareciÃ³ en 10s. ` +
        `Â¿El comp-id es correcto? ProbÃ¡: npx hyperframes compositions`
    );
  });

  // 3. Leer dimensiones reales del root de la comp.
  const dims = await page.evaluate((id) => {
    const root = document.querySelector(`[data-composition-id="${id}"]`);
    if (!root) return null;
    const w = parseInt(root.getAttribute('data-width') || '0', 10);
    const h = parseInt(root.getAttribute('data-height') || '0', 10);
    return { w, h };
  }, compId);

  if (!dims || !dims.w || !dims.h) {
    throw new Error(
      `No pude leer data-width/data-height del root [data-composition-id="${compId}"]`
    );
  }
  console.log(`[frame] dimensiones: ${dims.w}x${dims.h}`);

  // 4. Ajustar viewport al tamaÃ±o exacto de la composiciÃ³n.
  await page.setViewportSize({ width: dims.w, height: dims.h });

  // 5. Validar timestamp contra la duraciÃ³n real, scrub y esperar 2 rAF.
  const seekResult = await page.evaluate(
    async ({ id, t }) => {
      const tl = window.__timelines[id];
      const dur = tl.duration();
      const seekTo = Math.min(Math.max(t, 0), dur);
      tl.pause();
      tl.seek(seekTo);
      // Dos rAF: el primero termina el frame actual, el segundo deja el siguiente pintado.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return { dur, seekTo };
    },
    { id: compId, t: timestamp }
  );

  if (Math.abs(seekResult.seekTo - timestamp) > 0.001) {
    console.warn(
      `[frame] timestamp ${timestamp}s clamped a ${seekResult.seekTo}s ` +
        `(duraciÃ³n total ${seekResult.dur.toFixed(2)}s)`
    );
  }

  // 6. Resolver path de output (relativo al CWD del proyecto).
  const tStr = String(timestamp).replace(/\./g, '_');
  const defaultOut = `renders/frames/scrub-${compId}-t${tStr}.png`;
  const outPath = resolve(process.cwd(), outputOverride || defaultOut);
  const outDir = dirname(outPath);
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

  // 7. Capture del elemento de la composiciÃ³n (no fullPage â€” sÃ³lo la comp).
  const compEl = await page.$(`[data-composition-id="${compId}"]`);
  if (!compEl) throw new Error(`Root [data-composition-id="${compId}"] desapareciÃ³ post-scrub`);
  await compEl.screenshot({ path: outPath });

  console.log(`[frame] saved ${outPath}`);
  await ctx.close();
} finally {
  await browser.close();
}

function probeStudio() {
  return new Promise((resolve) => {
    const req = http.get(STUDIO_URL, { timeout: 1000 }, (res) => {
      resolve(res.statusCode < 500);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

