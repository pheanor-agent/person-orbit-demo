import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const viewer = readFileSync(new URL('../viewer.js', import.meta.url), 'utf8');

test('model choices use persistent accessible list buttons and grouped variants', () => {
  assert.match(html, /id="modelChoices"/);
  assert.match(html, /data-model="baseball"/);
  assert.match(html, /data-model="pikachu-sol"/);
  assert.doesNotMatch(html, /<select[^>]+id="modelPreset"/);
});

test('background list, CC0 panoramas, URL synchronization and latest-load guard exist', () => {
  assert.match(html, /id="backgroundChoices"/);
  assert.match(viewer, /backgrounds\/autumn_park\.jpg/);
  assert.match(viewer, /backgrounds\/monks_forest\.jpg/);
  assert.match(viewer, /EquirectangularReflectionMapping/);
  assert.match(viewer, /searchParams\.set\("background"/);
  assert.match(viewer, /popstate/);
  assert.match(viewer, /backgroundLoadVersion/);
});
