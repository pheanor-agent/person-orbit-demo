#!/usr/bin/env node
// Add quality-production variants without replacing historical families or models.
// Local files only. This script neither commits nor publishes.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const input=resolve(process.argv[2]||resolve(here,'../staging/sol-quality/variants.json'));
const output=resolve(process.argv[3]||resolve(here,'../collection-catalog.json'));
const manifest=JSON.parse(readFileSync(input,'utf8'));
const catalog=JSON.parse(readFileSync(output,'utf8'));
if(manifest.schema_version!==1||catalog.schema_version!==1||!Array.isArray(manifest.variants))throw Error('Unsupported schema');
let added=0;
for(const row of manifest.variants){
  if(!/^[a-z0-9][a-z0-9-]*$/.test(row.id)||!['pelican','lamp','garden'].includes(row.family)||row.status!=='success')throw Error('Invalid quality variant');
  if(!row.asset.startsWith('./assets/sol-quality/')||row.asset.includes('..')||!existsSync(resolve(dirname(output),row.asset)))throw Error('Missing/conflicting local payload '+row.id);
  const existing=catalog.models[row.id];
  if(existing&&existing.asset!==row.asset)throw Error('Refuse to replace historical model '+row.id);
  catalog.models[row.id]={...existing,presentation:row.presentation??existing?.presentation,asset:row.asset,label:row.model_label??row.label,family:row.family,author_model:'gpt-6.1-sol',route:'selected-source-production',state:row.state,note:row.note};
  catalog.families[row.family] ||= {label:row.family==='lamp'?'디자이너 램프':'등대 정원',variants:[]};
  const variants=catalog.families[row.family].variants;
  const index=variants.findIndex(item=>item.id===row.id);
  if(index<0){variants.push({...row,model:row.id,author_model:'gpt-6.1-sol',route:'quality-production'});added++;}
}
for(const [family,id] of Object.entries(manifest.representatives)){
  if(!catalog.models[id]||catalog.models[id].family!==family)throw Error('Missing representative '+family);
  catalog.representatives[family]=id;
}
writeFileSync(output,JSON.stringify(catalog,null,2)+'\n');
console.log(JSON.stringify({status:'staged-local',added,qualityVariants:manifest.variants.length,representatives:Object.keys(catalog.representatives).length,catalog:output,published:false}));
