import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { measureTransientOffset } from '../sfx-measure.mjs';

// Genera un wav: 0.2s de silencio + 0.3s de tono 880Hz
function makeFixture(dir) {
  const out = join(dir, 'fx.wav');
  execFileSync('ffmpeg', ['-y',
    '-f', 'lavfi', '-t', '0.2', '-i', 'anullsrc=r=44100:cl=mono',
    '-f', 'lavfi', '-t', '0.3', '-i', 'sine=frequency=880:r=44100',
    '-filter_complex', '[0][1]concat=n=2:v=0:a=1', out], { stdio: 'ignore' });
  return out;
}

test('transient_offset â‰ˆ duraciÃ³n del silencio inicial', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sfx-'));
  try {
    const file = makeFixture(dir);
    const offset = measureTransientOffset(file);
    assert.ok(offset > 0.12 && offset < 0.28, `offset fuera de rango: ${offset}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('archivo que arranca con sonido â†’ offset 0', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sfx-'));
  try {
    const out = join(dir, 'tone.wav');
    execFileSync('ffmpeg', ['-y', '-f', 'lavfi', '-t', '0.3',
      '-i', 'sine=frequency=880:r=44100', out], { stdio: 'ignore' });
    const offset = measureTransientOffset(out);
    assert.ok(offset < 0.05, `esperaba ~0, dio ${offset}`);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

