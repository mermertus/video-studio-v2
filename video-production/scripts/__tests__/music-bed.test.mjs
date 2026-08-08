import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildFilterComplex } from '../music-bed.mjs';

const tracks = {
  'a': { file: 'a.wav', duration: 30 },
  'b': { file: 'b.wav', duration: 40 },
};

test('inputs resuelven file desde el manifest, en orden', () => {
  const plan = [{ track: 'a', start: 0 }, { track: 'b', start: 10 }];
  const { inputs } = buildFilterComplex(plan, tracks);
  assert.deepEqual(inputs, ['assets/music/a.wav', 'assets/music/b.wav']);
});

test('aplica adelay por start y afades cuando hay fade', () => {
  const plan = [{ track: 'a', start: 0, fade_out: 2 }, { track: 'b', start: 28, fade_in: 2 }];
  const { filter } = buildFilterComplex(plan, tracks);
  assert.match(filter, /adelay=0\|0/);          // track a en t=0
  assert.match(filter, /adelay=28000\|28000/);  // track b en t=28s
  assert.match(filter, /afade=t=out/);          // fade_out de a
  assert.match(filter, /afade=t=in:st=0:d=2/);  // fade_in de b
  assert.match(filter, /amix=inputs=2/);
});

test('sin fade no inyecta afade', () => {
  const plan = [{ track: 'a', start: 0 }];
  const { filter } = buildFilterComplex(plan, tracks);
  assert.ok(!filter.includes('afade'));
});

test('track ausente del manifest tira error', () => {
  assert.throws(() => buildFilterComplex([{ track: 'x', start: 0 }], tracks), /no estÃ¡ en el manifest/);
});

