import playwright from '../../experiments/pelican-comparison/node_modules/playwright/index.js';
import {mkdirSync,writeFileSync,readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const {chromium}=playwright;
const output='/home/pheanor/projects/3d-modeling-workbench/assets/reference-refinement-20261008/browser';mkdirSync(output,{recursive:true});
const base='http://127.0.0.1:8877';
const cases=[['pikachu','pikachu-sol-reference-20261008',1,6],['baseball','sol-baseball-reference-20261008',0,0],['person','sol-traveler-reference-20261008',0,0],['trellis','sol-machine-reference-20261008',0,0],['cesium','cesium',1,2],['pelican','sol-quality-pelican-reviewed',1,3],['lamp','sol-quality-lamp-reviewed',1,3],['garden','sol-quality-garden-reviewed',1,3]];
let browser,server;
const launch=async()=>{
 server=await chromium.launchServer({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--disable-gpu-sandbox']});
 return chromium.connect(server.wsEndpoint());
};
const close=async()=>{await browser?.close().catch(()=>{});await server?.close().catch(()=>{});};
const rows=[];
if(process.argv.includes('--resume'))for(const [,id]of cases){
 const path=`${output}/${id}-samples.json`;
 if(existsSync(path)){const {samples,timeline,...row}=JSON.parse(readFileSync(path,'utf8'));if(row.status==='pass'&&!row.errors.length)rows.push({...row,resumedActualEvidence:path});}
}
try{
 for(const [family,id,clips,duration]of cases){
  if(rows.some(r=>r.id===id))continue;
  browser=await launch();
  const page=await browser.newPage({viewport:{width:640,height:480},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  const url=family==='cesium'?`${base}/?model=cesium&background=default`:`${base}/lab.html?family=${family}&variant=${id}&background=default`;
  await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(id=>window.__orbitTest?.loadedPreset===id&&document.querySelector('#status').textContent.includes('불러옴'),id,{timeout:45000});
  const metadata=await page.evaluate(()=>({clips:window.__orbitTest.activeAnimations,family:window.__orbitTest.modelFamily,duration:Number(document.querySelector('#motionTimeline').max),url:location.href}));
  if(metadata.clips!==clips||(clips&&Math.abs(metadata.duration-duration)>.01))throw Error('Clip/duration contract '+id+' '+JSON.stringify(metadata));
  const samples=[];
  if(clips){
   for(const t of [0,duration*.25,duration*.5,duration*.75]){
    await page.evaluate(t=>{const input=document.querySelector('#motionTimeline');input.value=t;input.dispatchEvent(new Event('input',{bubbles:true}));},t);await page.waitForTimeout(150);
    const nodes=await page.evaluate(()=>{const result=[];window.__orbitTest.modelRoot.updateMatrixWorld(true);window.__orbitTest.modelRoot.traverse(ob=>result.push({name:ob.name,world:ob.matrixWorld.elements,morph:ob.morphTargetInfluences??null}));return result;});samples.push({time:t,nodes});
    await page.screenshot({path:`${output}/${id}-phase-${samples.length-1}.png`});
   }
  }
  const changes=new Set();
  if(samples.length){const first=Object.fromEntries(samples[0].nodes.map(n=>[n.name,n]));for(const s of samples.slice(1))for(const n of s.nodes)if(first[n.name]&&n.world.some((x,i)=>Math.abs(x-first[n.name].world[i])>.0001))changes.add(n.name);if(!changes.size)throw Error('No actual animation transform '+id);}
  let wraps=0;const timeline=[];
  if(family==='pikachu'||family==='cesium'){
   await page.locator('#motionRestart').click();let previous=0;const start=Date.now();
   while(wraps<1&&Date.now()-start<45000){await page.waitForTimeout(100);const value=await page.evaluate(()=>Number(document.querySelector('#motionTimeline').value));timeline.push(value);if(value<previous-.4)wraps++;previous=value;}
   if(wraps<1)throw Error('Actual playback loop missing '+id);
  }
  // Existing camera controls still change actual view independently of motion.
  for(const [view,yaw]of [['front',0],['side',Math.PI/2],['back',Math.PI],['three-quarter',Math.PI/4]]){await page.evaluate(y=>window.__orbitTest.setView(y),yaw);await page.waitForTimeout(100);await page.screenshot({path:`${output}/${id}-${view}.png`});}
  const before=await page.evaluate(()=>window.__orbitTest.yaw);await page.locator('#autoRotate').click();await page.waitForTimeout(400);const after=await page.evaluate(()=>window.__orbitTest.yaw);await page.locator('#autoRotate').click();if(Math.abs(after-before)<.001)throw Error('Camera auto rotation not working '+id);
  await page.locator('#reset').click();
  const row={id,family,status:errors.length?'fail':'pass',metadata,continuousLoopWraps:wraps,changedWorldNodes:[...changes],cameraChanged:true,errors,scope:'actual local Chromium/SwiftShader GLTFLoader images and hierarchy; not manager/blind aesthetic acceptance'};
  writeFileSync(`${output}/${id}-samples.json`,JSON.stringify({...row,samples,timeline},null,2)+'\n');rows.push(row);writeFileSync(output+'/progress.json',JSON.stringify({status:'running',completed:rows},null,2)+'\n');console.log(JSON.stringify({id,status:row.status,clips,continuousLoopWraps:wraps,changedWorldNodes:changes.size,errors}));await page.close();await close();
 }
 browser=await launch();const page=await browser.newPage({viewport:{width:640,height:480}});await page.goto(base+'/?model=cesium&background=default');await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('불러옴'));
 const representatives=await page.locator('#modelChoices [data-model]').evaluateAll(xs=>xs.map(x=>x.dataset.model));if(representatives.length!==8)throw Error('Expected eight representatives');await page.screenshot({path:output+'/main-representatives.png'});
 const checks=[];
 for(const [s,id]of [['pikachu','pikachu-sol-reference-20261008'],['baseball','sol-baseball-reference-20261008'],['traveler','sol-traveler-reference-20261008'],['machine','sol-machine-reference-20261008']]){
  const url=base+`/assets/sol-reference-20261008/${s}/model.glb`;const bytes=Buffer.from(await (await page.request.get(url)).body());const actual=createHash('sha256').update(bytes).digest('hex');const expected=createHash('sha256').update(readFileSync(`/home/pheanor/projects/3d-modeling-workbench/assets/reference-refinement-20261008/${s}/models/model.glb`)).digest('hex');if(actual!==expected)throw Error('HTTP payload mismatch '+id);checks.push({id,url,sha256:actual,byteIdentity:true});
 }
 const summary={status:rows.length===cases.length&&rows.every(r=>r.status==='pass')?'pass':'fail',rows,representatives,representative_count:representatives.length,http_final_model_checks:checks,scope:'One actual continuous loop for new Pikachu and Cesium; native GLB endpoints/grounding checked separately. Completed cases may be resumed from durable actual samples after browser-session termination.',publication:'local only; no push/promote'};writeFileSync(output+'/summary.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({status:summary.status,cases:rows.length,representatives:representatives.length}));if(summary.status!=='pass')process.exitCode=1;
}catch(e){writeFileSync(output+'/failure.json',JSON.stringify({status:'fail',error:e.stack,completed:rows},null,2)+'\n');console.error(e);process.exitCode=1;}finally{await close();}
