#!/usr/bin/env node
// Mide el transient_offset (onset del primer sonido) de un archivo de audio
// usando ffmpeg silencedetect. Determinista.
//
// Como mÃ³dulo:  import { measureTransientOffset } from './sfx-measure.mjs'
// Como CLI:     node scripts/sfx-measure.mjs <file.wav> [<file2> ...]
import { spawnSync } from 'node:child_process';

const NOISE_DB = '-40dB';   // umbral: por debajo = silencio
const MIN_SILENCE = '0.02'; // 20ms mÃ­nimos para contar como silencio

export function measureTransientOffset(file) {
  // ffmpeg escribe silencedetect en stderr incluso con exit 0.
  // spawnSync captura stderr en ambos casos (Ã©xito y error),
  // mientras que execFileSync con stdio pipe lo pierde cuando exit=0.
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', file,
    '-af', `silencedetect=noise=${NOISE_DB}:d=${MIN_SILENCE}`,
    '-f', 'null', '-'], { encoding: 'utf8' });
  const stderr = r.stderr ?? '';
  // Si el primer evento es un silencio que arranca en ~0, su silence_end es el onset.
  const startsSilent = /silence_start:\s*0(\.0+)?\b/.test(stderr);
  if (!startsSilent) return 0;
  const m = stderr.match(/silence_end:\s*([0-9.]+)/);
  return m ? Number(Number(m[1]).toFixed(3)) : 0;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('usage: sfx-measure.mjs <file> [...]'); process.exit(1); }
  for (const f of files) console.log(`${f}\t${measureTransientOffset(f)}`);
}

