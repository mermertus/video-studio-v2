#!/usr/bin/env node
// Validador + upsert del sfx-manifest.json.
// CLI:  node scripts/sfx-manifest.mjs validate [path]
import { readFileSync } from 'node:fs';

const REQUIRED = ['file', 'duration', 'transient_offset', 'category',
  'default_volume', 'use_for', 'license', 'source'];
const CATEGORIES = ['transition', 'impact', 'reveal', 'ui', 'riser', 'drop'];

export function validateManifest(m) {
  const errs = [];
  if (m?.version !== 1) errs.push('version debe ser 1');
  if (!m?.samples || typeof m.samples !== 'object') { errs.push('falta samples'); return errs; }
  for (const [id, e] of Object.entries(m.samples)) {
    for (const k of REQUIRED) if (!(k in e)) errs.push(`${id}: falta ${k}`);
    if (e.category && !CATEGORIES.includes(e.category)) errs.push(`${id}: category invÃ¡lida (${e.category})`);
    if (typeof e.transient_offset === 'number' && e.transient_offset < 0) errs.push(`${id}: transient_offset < 0`);
    if (e.use_for && !Array.isArray(e.use_for)) errs.push(`${id}: use_for debe ser array`);
  }
  return errs;
}

export function upsertEntry(manifest, id, entry) {
  manifest.samples[id] = entry;
  // re-ordenar claves alfabÃ©ticamente para diffs estables
  manifest.samples = Object.fromEntries(
    Object.entries(manifest.samples).sort(([a], [b]) => a.localeCompare(b)));
  return manifest;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, path = 'assets/sfx/sfx-manifest.json'] = process.argv.slice(2);
  if (cmd === 'validate') {
    const m = JSON.parse(readFileSync(path, 'utf8'));
    const errs = validateManifest(m);
    if (errs.length) { console.error('INVÃLIDO:\n' + errs.map(e => ' - ' + e).join('\n')); process.exit(1); }
    console.log(`OK â€” ${Object.keys(m.samples).length} samples`);
  } else {
    console.error('usage: sfx-manifest.mjs validate [path]'); process.exit(1);
  }
}

