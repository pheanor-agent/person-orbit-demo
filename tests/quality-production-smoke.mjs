import playwright from '../../experiments/pelican-comparison/node_modules/playwright/index.js';
const {chromium}=playwright;
import {mkdirSync,writeFileSync} from 'node:fs';
const output='/home/pheanor/.hermes/workspace/jobs/JOB-4222-sol-visual-quality-pipeline/artifacts/reviewed-browser';
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader']});
const rows=[];
for(const subject of ['pelican','lamp','garden']){
  const page=await browser.newPage({viewport:{width:640,height:480},deviceScaleFactor:1});const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  const id=`sol-quality-${subject}-reviewed`;
  await page.goto(`http://127.0.0.1:8886/lab.html?family=${subject}&variant=${id}&background=default`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(id=>window.__orbitTest?.loadedPreset===id&&document.querySelector('#status').textContent.includes('불러옴'),id,{timeout:30000});
  const metadata=await page.evaluate(()=>({clips:window.__orbitTest.activeAnimations,family:window.__orbitTest.modelFamily,duration:Number(document.querySelector('#motionTimeline').max)}));
  writeFileSync(`${output}/${subject}-load.json`,JSON.stringify({metadata,errors},null,2)+'\n');
  if(metadata.clips!==1||Math.abs(metadata.duration-3)>.01)throw Error('Clip contract failed '+subject+' '+JSON.stringify(metadata));
  await page.locator('#motionRestart').click();
  const times=[];let wraps=0;let previous=0;
  for(let tick=0;tick<700&&wraps<3;tick++){
    await page.waitForTimeout(100);
    const value=await page.evaluate(()=>Number(document.querySelector('#motionTimeline').value));times.push(value);
    if(value<previous-.5)wraps++;previous=value;
  }
  if(wraps<3)throw Error('Three actual playback loops not observed '+subject);
  const phases=subject==='pelican'?[0,.375,.75,1.125]:[0,.75,1.5,2.25];const samples=[];
  for(let i=0;i<phases.length;i++){
    await page.evaluate(time=>{const input=document.querySelector('#motionTimeline');input.value=time;input.dispatchEvent(new Event('input',{bubbles:true}));},phases[i]);
    await page.waitForTimeout(120);
    const sample=await page.evaluate(()=>{const nodes=[];window.__orbitTest.modelRoot.updateMatrixWorld(true);window.__orbitTest.modelRoot.traverse(ob=>{nodes.push({name:ob.name,world:ob.matrixWorld.elements,morph:ob.morphTargetInfluences||null});});return nodes;});
    samples.push({time:phases[i],nodes:sample});
    await page.screenshot({path:`${output}/${subject}-phase-${i}.png`});
  }
  const first=Object.fromEntries(samples[0].nodes.map(n=>[n.name,n]));const changed=new Set();let morphDelta=0;
  for(const sample of samples.slice(1))for(const node of sample.nodes){const a=first[node.name];if(!a)continue;if(node.world.some((v,i)=>Math.abs(v-a.world[i])>.0001))changed.add(node.name);if(node.morph&&a.morph)node.morph.forEach((v,i)=>morphDelta=Math.max(morphDelta,Math.abs(v-a.morph[i])));}
  if(!changed.size||errors.length||(subject==='pelican'&&morphDelta<.01))throw Error('Motion/morph/browser error '+subject+JSON.stringify(errors));
  writeFileSync(`${output}/${subject}-samples.json`,JSON.stringify({metadata,wraps,times,samples,changedNodes:[...changed],morphDelta,errors},null,2)+'\n');
  for(const [name,yaw]of [['front',0],['side',Math.PI/2],['back',Math.PI],['three-quarter',Math.PI/4]]){
    await page.evaluate(y=>window.__orbitTest.setView(y),yaw+(subject==='pelican'?Math.PI/2:0));await page.waitForTimeout(120);await page.screenshot({path:`${output}/${subject}-${name}.png`});
  }
  const row={subject,status:'pass',clips:metadata.clips,duration:metadata.duration,actualContinuousLoopWraps:wraps,changedWorldNodes:changed.size,morphDelta,errors,details:`${output}/${subject}-samples.json`};rows.push(row);console.log(JSON.stringify(row));
  await page.close();
}
const page=await browser.newPage();await page.goto('http://127.0.0.1:8886/?model=sol-quality-lamp-reviewed&background=default');await page.waitForFunction(()=>document.querySelector('#status')?.textContent.includes('불러옴'));
const main=await page.locator('#modelChoices [data-model]').count();if(main!==8)throw Error('Main must have eight representatives');
await page.screenshot({path:`${output}/representative-main.png`});
writeFileSync(`${output}/summary.json`,JSON.stringify({status:'pass',rows,mainRepresentatives:main,scope:'Actual local browser playback 3 loops, hierarchy and morph deltas, four phases/four views; not manager aesthetic judgement'},null,2)+'\n');
await browser.close();
