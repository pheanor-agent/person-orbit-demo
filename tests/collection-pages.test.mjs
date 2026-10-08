import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const html = name => readFileSync(new URL(name, root), 'utf8');
const viewer = html('viewer.js');
const catalog = JSON.parse(readFileSync(new URL('collection-catalog.json', root), 'utf8'));

test('representative collection preserves six historical seed buttons and builds current representatives from catalog', () => {
  const page = html('index.html');
  const ids = [...page.matchAll(/data-model="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids, ['cesium', 'trellis', 'person', 'pelican', 'baseball', 'pikachu-sol']);
  assert.match(page, /href="\.\/lab\.html"/);
  assert.doesNotMatch(page, /id="baseballComparison"/);
  assert.match(viewer, /Object\.entries\(collectionCatalog\.representatives\)/);
});

test('lab page is separate and links to representative collection', () => {
  const page = html('lab.html');
  assert.match(page, /id="familySelect"/);
  assert.match(page, /id="labChoices"/);
  assert.match(page, /href="\.\/index\.html"/);
  assert.match(viewer, /collection-catalog\.json/);
});

test('reviewed catalog has one representative per kind and preserves historical multi-version families', () => {
  assert.equal(catalog.schema_version, 1);
  assert.deepEqual(Object.keys(catalog.representatives), ['cesium', 'trellis', 'person', 'pelican', 'baseball', 'pikachu', 'lamp', 'garden']);
  for (const family of ['lamp','garden']) {
    assert.equal(catalog.representatives[family],`sol-quality-${family}-reviewed`);
    assert.deepEqual(catalog.families[family].variants.filter(item=>item.id.startsWith('sol-quality-')).map(item=>item.state),['baseline','preset-first','reviewed']);
  }
  assert.equal(catalog.representatives.baseball, 'sol-baseball-reference-20261008');
  assert.equal(catalog.representatives.pikachu, 'pikachu-sol-reference-20261008');
  assert.deepEqual(catalog.families.baseball.variants.map(item => item.id), ['baseball', 'baseball-geometry', 'baseball-projection', 'baseball-hires', 'baseball-retexture', 'sol-baseball-reference-20261008']);
  assert.deepEqual(catalog.families.pikachu.variants.map(item => item.id), ['pikachu-sol', 'pikachu-astra', 'pikachu-sol-reference-20261008']);
  for (const [family, original, added] of [['person','person','sol-traveler-reference-20261008'],['trellis','trellis','sol-machine-reference-20261008']]) {
    assert.equal(catalog.representatives[family], original);
    assert.deepEqual(catalog.families[family].variants.map(item => item.id), [original, added]);
    assert.equal(catalog.models[added].state, 'manager-reviewed');
  }
  for (const family of Object.values(catalog.families)) {
    for (const variant of family.variants) assert.ok(catalog.models[variant.model], `Missing model: ${variant.model}`);
  }
});

test('benchmark merge script validates schema and omits missing GLBs', () => {
  const script = readFileSync(new URL('scripts/merge-lab-variants.mjs', root), 'utf8');
  assert.match(script, /schema_version/);
  assert.match(script, /existsSync/);
  assert.match(script, /lab-variants\.json/);
  assert.match(script, /status.*success|success.*status/);
  assert.match(script, /resolve\(scriptDir, '\.\.\/\.\.\/experiments\/pelican-comparison\/lab-variants\.json'\)/);
  assert.match(script, /resolve\(scriptDir, '\.\.\/collection-catalog\.json'\)/);
});

test('benchmark merger skips failed null-asset rows and only publishes existing successful GLBs', () => {
  const temp = mkdtempSync(join(tmpdir(), 'orbit-merge-'));
  try {
    const out = join(temp, 'site');
    mkdirSync(out, { recursive: true });
    writeFileSync(join(out, 'collection-catalog.json'), JSON.stringify(catalog));
    const input = join(temp, 'lab-variants.json');
    writeFileSync(input, JSON.stringify({ schema_version: 1, variants: [
      { id: 'trial-failed', family: 'pelican', label: '실패', model: 'trial-failed', route: 'r1', repeat: 1, state: 'failed', asset: null, preview: null, status: 'failed' },
      { id: 'trial-success', family: 'pelican', label: 'TRELLIS · 재시도 2차', model: 'trial-success', route: 'r2', repeat: 2, state: 'ready', asset: './assets/pelican-experiments/trial-success.glb', preview: null, status: 'success' }
    ] }));
    const asset = join(out, 'assets/pelican-experiments');
    mkdirSync(asset, { recursive: true });
    writeFileSync(join(asset, 'trial-success.glb'), 'glTF');
    const run = spawnSync(process.execPath, [new URL('../scripts/merge-lab-variants.mjs', import.meta.url).pathname, input, join(out, 'collection-catalog.json')], { cwd: temp, encoding: 'utf8' });
    assert.equal(run.status, 0, run.stderr);
    const merged = JSON.parse(readFileSync(join(out, 'collection-catalog.json'), 'utf8'));
    assert.deepEqual(merged.families.pelican.variants.map(item => item.id), ['pelican', 'trial-success']);
    assert.equal(merged.models['trial-success'].family, 'pelican');
    assert.equal(merged.models['trial-failed'], undefined);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
});

test('lab has a collapsed version selector and all catalog assets exist', () => {
  assert.match(html('lab.html'), /id="variantSelect"/);
  for (const item of Object.values(catalog.models)) {
    const assetPath = item.asset.replace(/^\.\//, '').split('?')[0];
    assert.ok(readFileSync(new URL(assetPath, root)).length > 0);
  }
});
