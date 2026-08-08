import { test } from 'node:test';
import assert from 'node:assert/strict';
import { promptId } from '../sfx-generate.mjs';

test('promptId es determinista y kebab', () => {
  const a = promptId('Metallic chrome whoosh with sub bump');
  const b = promptId('Metallic chrome whoosh with sub bump');
  assert.equal(a, b);
  assert.match(a, /^gen-[a-z0-9-]+-[0-9a-f]{8}$/);
});

test('prompts distintos â†’ ids distintos', () => {
  assert.notEqual(promptId('whoosh a'), promptId('whoosh b'));
});

