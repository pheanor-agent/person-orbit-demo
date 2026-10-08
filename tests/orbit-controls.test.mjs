import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('model choices use persistent accessible list buttons and grouped variants', () => {
  assert.match(html, /id="modelChoices"/);
  assert.match(html, /<details[^>]*data-model-group="baseball"/);
  assert.match(html, /<details[^>]*data-model-group="pikachu"/);
  assert.doesNotMatch(html, /<select[^>]+id="modelPreset"/);
});

test('background list, CC0 panoramas, URL synchronization and latest-load guard exist', () => {
  assert.match(html, /id="backgroundChoices"/);
  assert.match(html, /backgrounds\/autumn_park\.jpg/);
  assert.match(html, /backgrounds\/monks_forest\.jpg/);
  assert.match(html, /EquirectangularReflectionMapping/);
  assert.match(html, /searchParams\.set\("background"/);
  assert.match(html, /popstate/);
  assert.match(html, /backgroundLoadVersion/);
});
