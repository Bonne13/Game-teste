const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.clock.install();await page.goto('http://127.0.0.1:8000/');await page.locator('#drillButtons button').first().waitFor();
for(const [index,id] of ['shoot','vision','pass','speed','technique','freekick'].entries()){
 await page.locator('#drillButtons button').nth(index).click();assert(await page.locator('#play').isDisabled());
 for(let attempt=1;attempt<=5;attempt++){
 if(id==='shoot'&&attempt===1){const r=await page.locator('#trainingCanvas').boundingBox();await page.mouse.move(r.x+r.width*285/880,r.y+r.height*55/320);const button=await page.locator('#chargeBall').boundingBox();await page.mouse.move(button.x+20,button.y+15);await page.mouse.down();await page.clock.runFor(1050);await page.mouse.up();await page.clock.runFor(1000);assert.match(await page.locator('#trainingFeedback').innerText(),/Nota:/);}
 else if(id==='vision'){await page.locator('#visionChoices button').nth((attempt-1)%4).click();await page.clock.runFor(50);}
 else if(id==='speed'){await page.locator('#trainingCanvas').focus();for(let step=0;step<16;step++){await page.keyboard.press(step%2?'d':'a');await page.clock.runFor(300);}await page.clock.runFor(50);}
 else if(id==='technique'&&attempt===1){await page.locator('#trainingCanvas').focus();await page.keyboard.down('ArrowRight');await page.clock.runFor(400);await page.keyboard.up('ArrowRight');await page.clock.runFor(19000);}
 else await page.clock.runFor(20000);
 await page.locator('#nextAttempt').click();
 }
 const history=await page.evaluate(()=>JSON.parse(localStorage.getItem('proxima-estrela-v1')).training);assert.equal(history[id].length,1);assert(Number.isFinite(history[id][0]));
}
await page.locator('#joinLeague').click();assert(!(await page.locator('#play').isDisabled()));assert.notEqual(await page.locator('#playerclub').textContent(),'Em avaliação');
await page.reload();await page.locator('#drillButtons button').first().waitFor();const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('proxima-estrela-v1')));assert(saved.recruited);assert.equal(Object.keys(saved.training).length,6);
await page.locator('#drillButtons button').nth(5).click();await page.locator('#curve').fill('-0.8');await page.screenshot({path:'/tmp/proxima-training.png',fullPage:true});await page.locator('#cancelTraining').click();await page.clock.runFor(50);assert.match(await page.locator('#trainingFeedback').innerText(),/nota 0/);
assert.deepEqual(errors,[]);console.log('PASS: navegador Chromium, controles de chute/visão/corrida/drible/curva, seis sessões, contratação, recarga e cancelamento sem erros JavaScript.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
