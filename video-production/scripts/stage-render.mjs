#!/usr/bin/env node
// Render por capa para el modo step-by-step: saca los <audio data-layer> de las capas
// que todavÃ­a no tocan y renderiza un draft de esa etapa.
//   visual â†’ sin sfx ni mÃºsica   |   sfx â†’ con sfx, sin mÃºsica   |   music/full â†’ todo
//
// Como mÃ³dulo:  import { stripLayers } from './stage-render.mjs'
// CLI: node scripts/stage-render.mjs <project-slug> <visual|sfx|music|full>
//   (correr desde el root del workspace; el slug es la carpeta en video-projects/)
import { readFileSync, writeFileSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const STRIP = { visual: ['sfx', 'music'], sfx: ['music'], music: [], full: [] };

// Pura y testeable: quita los <audio data-layer="X"> de las capas no activas en esta etapa.
export function stripLayers(html, stage) {
  const strip = STRIP[stage];
  if (strip === undefined) throw new Error(`stage invÃ¡lido: ${stage} (visual|sfx|music|full)`);
  let out = html;
  for (const layer of strip) {
    const re = new RegExp(`[ \\t]*<audio\\b[^>]*\\bdata-layer="${layer}"[^>]*>\\s*(?:</audio>)?\\n?`, 'gi');
    out = out.replace(re, '');
  }
  return out;
}

function main([slug, stage]) {
  if (!slug || !stage) { console.error('usage: stage-render.mjs <project-slug> <visual|sfx|music|full>'); process.exit(1); }
  if (!(stage in STRIP)) { console.error(`stage invÃ¡lido: ${stage}`); process.exit(1); }
  const dir = `video-projects/${slug}`;
  const index = `${dir}/index.html`;
  if (!existsSync(index)) { console.error(`no existe ${index}`); process.exit(1); }
  const bak = `${index}.stagebak`;
  copyFileSync(index, bak);
  try {
    writeFileSync(index, stripLayers(readFileSync(index, 'utf8'), stage));
    const out = `renders/${slug}-${stage}.mp4`;
    const r = spawnSync('npx', ['hyperframes', 'render', '--quality', 'draft', '--output', out],
      { cwd: dir, stdio: 'inherit' });
    if (r.status !== 0) { console.error('render fallÃ³'); process.exit(1); }
    console.log(`etapa ${stage} renderizada: ${dir}/${out}`);
  } finally {
    copyFileSync(bak, index);   // restaurar SIEMPRE el index original
    rmSync(bak, { force: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv.slice(2));

