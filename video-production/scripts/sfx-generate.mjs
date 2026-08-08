#!/usr/bin/env node
// Genera un SFX via ElevenLabs sound-generation, lo mide y lo promueve al manifest.
// Cachea por hash del prompt (no regenera lo mismo).
//
// CLI: node scripts/sfx-generate.mjs "<prompt>" [--name <id>] [--seconds <n>]
// Requiere ELEVENLABS_API_KEY en el entorno (cargar .env antes).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { measureTransientOffset } from './sfx-measure.mjs';
import { upsertEntry, validateManifest } from './sfx-manifest.mjs';

const SFX_DIR = 'assets/sfx';
const MANIFEST = `${SFX_DIR}/sfx-manifest.json`;

export function promptId(prompt) {
  const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24);
  const hash = createHash('sha256').update(prompt).digest('hex').slice(0, 8);
  return `gen-${slug}-${hash}`;
}

async function generate(prompt, { name, seconds } = {}) {
  const id = name || promptId(prompt);
  const wav = `${SFX_DIR}/${id}.wav`;
  if (existsSync(wav)) { console.log(`cache hit: ${wav}`); return id; }

  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('falta ELEVENLABS_API_KEY en el entorno');

  const body = { text: prompt, prompt_influence: 0.3 };
  if (seconds) body.duration_seconds = Number(seconds);

  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);

  const mp3 = `${SFX_DIR}/${id}.mp3`;
  writeFileSync(mp3, Buffer.from(await res.arrayBuffer()));
  execFileSync('ffmpeg', ['-y', '-i', mp3, '-ar', '44100', '-ac', '1', wav], { stdio: 'ignore' });

  const offset = measureTransientOffset(wav);
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries',
    'format=duration', '-of', 'csv=p=0', wav], { encoding: 'utf8' }).trim());

  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  upsertEntry(manifest, id, {
    file: `${id}.wav`, duration: Number(dur.toFixed(3)), transient_offset: offset,
    category: 'transition', default_volume: 0.2, use_for: [], license: 'ElevenLabs generated',
    source: 'generated'
  });
  const errs = validateManifest(manifest);
  if (errs.length) throw new Error('manifest invÃ¡lido tras upsert: ' + errs.join(', '));
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`generado ${wav} (offset ${offset}s, ${dur.toFixed(2)}s) y promovido al manifest`);
  return id;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const prompt = args.find(a => !a.startsWith('--'));
  const opt = {};
  const ni = args.indexOf('--name'); if (ni >= 0) opt.name = args[ni + 1];
  const si = args.indexOf('--seconds'); if (si >= 0) opt.seconds = args[si + 1];
  if (!prompt) { console.error('usage: sfx-generate.mjs "<prompt>" [--name id] [--seconds n]'); process.exit(1); }
  generate(prompt, opt).catch(e => { console.error(e.message); process.exit(1); });
}

