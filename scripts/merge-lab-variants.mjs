#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const [inputArg, outputArg] = process.argv.slice(2);
const scriptDir = dirname(fileURLToPath(import.meta.url));
const input = resolve(inputArg || resolve(scriptDir, '../../experiments/pelican-comparison/lab-variants.json'));
const output = resolve(outputArg || resolve(scriptDir, '../collection-catalog.json'));
const catalog = JSON.parse(readFileSync(output, 'utf8'));
if (catalog.schema_version !== 1 || !Array.isArray(catalog.families?.pelican?.variants)) {
  throw new Error('Unsupported collection catalog schema');
}
let manifest = { schema_version: 1, variants: [] };
if (existsSync(input)) manifest = JSON.parse(readFileSync(input, 'utf8'));
if (manifest.schema_version !== 1 || !Array.isArray(manifest.variants)) {
  throw new Error(`Invalid benchmark manifest: ${input}`);
}
const seen = new Set();
const variants = [];
for (const row of manifest.variants) {
  if (!row || typeof row.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(row.id) || row.family !== 'pelican' ||
      typeof row.label !== 'string' || !row.label.trim() || typeof row.model !== 'string' ||
      typeof row.route !== 'string' || !Number.isFinite(Number(row.repeat)) ||
      typeof row.state !== 'string' || (row.asset !== null && typeof row.asset !== 'string')) {
    throw new Error(`Invalid pelican variant record: ${JSON.stringify(row)}`);
  }
  if (seen.has(row.id)) throw new Error(`Duplicate variant id: ${row.id}`);
  seen.add(row.id);
  const relAsset = `./assets/pelican-experiments/${row.id}.glb`;
  if (row.status !== 'success' || row.asset !== relAsset || !existsSync(join(dirname(output), relAsset.slice(2)))) continue;
  const model = row.id;
  catalog.models[model] = { asset: relAsset, label: row.label, family: 'pelican', author_model: row.model, route: row.route, repeat: row.repeat, state: row.state, note: row.note || '' };
  variants.push({ ...row, author_model: row.model, model, asset: relAsset });
}
catalog.families.pelican.variants = variants.length
  ? [{ id: 'pelican', label: '대표 · 자전거', model: 'pelican', asset: './assets/pelican-bicycle.glb', status: 'success' }, ...variants]
  : [];
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Merged ${variants.length} successful pelican variant(s) with existing assets into ${output}`);
