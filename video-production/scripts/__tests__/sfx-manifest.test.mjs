import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateManifest, upsertEntry } from '../sfx-manifest.mjs';

const valid = {
  version: 1,
  samples: {
    'whoosh-up': {
      file: 'whoosh-up.wav', duration: 0.62, transient_offset: 0.18,
      category: 'transition', default_volume: 0.2, use_for: ['whip-up'],
      license: 'CC0', source: 'curated'
    }
  }
};

test('manifest vÃ¡lido pasa', () => {
  assert.deepEqual(validateManifest(valid), []);
});

test('entry sin transient_offset falla', () => {
  const bad = JSON.parse(JSON.stringify(valid));
  delete bad.samples['whoosh-up'].transient_offset;
  const errs = validateManifest(bad);
  assert.ok(errs.some(e => e.includes('transient_offset')), errs.join(','));
});

test('upsertEntry agrega manteniendo orden alfabÃ©tico', () => {
  const m = { version: 1, samples: {} };
  upsertEntry(m, 'click', { file: 'click.wav', duration: 0.1, transient_offset: 0,
    category: 'ui', default_volume: 0.2, use_for: ['click'], license: 'CC0', source: 'curated' });
  assert.ok('click' in m.samples);
  assert.equal(m.samples.click.transient_offset, 0);
});

