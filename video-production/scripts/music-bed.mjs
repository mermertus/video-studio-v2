#!/usr/bin/env node
// Hornea un bed de mÃºsica Ãºnico a partir de un plan multi-track con fades/crossfades.
// Como mÃ³dulo:  import { buildFilterComplex } from './music-bed.mjs'
// CLI: node scripts/music-bed.mjs --plan <plan.json> [--manifest <music-manifest.json>] --out <bed.wav>
//
// Plan = array de { track, start, fade_in?, fade_out?, duration? }.
// Dos tracks que se solapan con fade_out/fade_in matcheados = crossfade.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUSIC_DIR = 'assets/music';

// Pura y testeable: arma {inputs, filter} para ffmpeg desde el plan + el manifest.
export function buildFilterComplex(plan, tracks, musicDir = MUSIC_DIR) {
  const inputs = [];
  const parts = [];
  plan.forEach((e, i) => {
    const t = tracks[e.track];
    if (!t) throw new Error(`track no estÃ¡ en el manifest: ${e.track}`);
    inputs.push(`${musicDir}/${t.file}`);
    const start = Number(e.start ?? 0);
    const playDur = Number(e.duration ?? t.duration);
    const fadeIn = Number(e.fade_in ?? 0);
    const fadeOut = Number(e.fade_out ?? 0);
    const delayMs = Math.round(start * 1000);
    let chain = `[${i}:a]atrim=0:${playDur},asetpts=PTS-STARTPTS`;
    if (fadeIn > 0) chain += `,afade=t=in:st=0:d=${fadeIn}`;
    if (fadeOut > 0) chain += `,afade=t=out:st=${(playDur - fadeOut).toFixed(3)}:d=${fadeOut}`;
    chain += `,adelay=${delayMs}|${delayMs}[a${i}]`;
    parts.push(chain);
  });
  const labels = plan.map((_, i) => `[a${i}]`).join('');
  parts.push(`${labels}amix=inputs=${plan.length}:normalize=0:dropout_transition=0[out]`);
  return { inputs, filter: parts.join(';') };
}

function main(args) {
  const get = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : undefined; };
  const planPath = get('--plan');
  const manifestPath = get('--manifest') || `${MUSIC_DIR}/music-manifest.json`;
  const out = get('--out');
  if (!planPath || !out) { console.error('usage: music-bed.mjs --plan <plan.json> [--manifest <m.json>] --out <bed.wav>'); process.exit(1); }
  const plan = JSON.parse(readFileSync(planPath, 'utf8'));
  const tracks = JSON.parse(readFileSync(manifestPath, 'utf8')).tracks;
  const { inputs, filter } = buildFilterComplex(plan, tracks);
  const ffArgs = ['-y'];
  for (const f of inputs) ffArgs.push('-i', f);
  ffArgs.push('-filter_complex', filter, '-map', '[out]', '-ar', '44100', '-ac', '2', out);
  const r = spawnSync('ffmpeg', ffArgs, { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr || 'ffmpeg fallÃ³'); process.exit(1); }
  console.log(`bed generado: ${out} (${inputs.length} tracks)`);
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv.slice(2));

