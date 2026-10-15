const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const page=await browser.newPage({viewport:{width:393,height:851},isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await require('./game-page.cjs')(page);await page.goto(process.env.GAME_URL||'http://127.0.0.1:8011/');await page.locator('#drillButtons button').nth(1).tap();const client=await page.context().newCDPSession(page),scenarios=[];
 assert.equal(await page.locator('#visionChoices button').count(),0);assert.match(await page.locator('#chargeBall').innerText(),/Efeito/);
 await page.locator('#trainingCanvas').tap();await page.locator('#trainingCanvas').press('1');assert(!await page.locator('#trainingShotDialog').isVisible());assert(!await page.locator('#nextAttempt').isVisible());
 for(let i=0;i<5;i++){
  await page.locator('#trainingCanvas').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
  scenarios.push(await page.locator('#trainingInstructions').innerText());
  const data=await page.evaluate(i=>{const v=Football3D.views.find(v=>v.training),r=v.canvas.getBoundingClientRect(),scenario=VISION_SCENARIOS[i],o=scenario.origin,t=scenario.mates[[1,0,1,1,3][i]],dx=t.x-o.x,dy=t.y-o.y,dist=Math.hypot(dx,dy),max=Math.max(90,Math.min(140,r.height*.4)),pull=dist/600/(.8+baseCareerSkills(p).shoot/100*.2)*max;return{x:r.x+r.width/2,y:r.y+r.height*.4,dx:-dx/dist*pull,dy:-dy/dist*pull};},i);
  const {x,y,dx,dy}=data;
  await client.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*.4,y:y+dy*.4}]});
  const weak=await page.locator('#powerValue').innerText();
  if(i===0){const clock=await page.locator('#trainingClock').innerText();await page.waitForTimeout(500);assert.equal(await page.locator('#trainingClock').innerText(),clock);const aim=await page.evaluate(()=>Football3D.views.find(v=>v.training).selectedAim);assert(Math.abs(aim.x-(440+(340-440)*.4))<2);assert(Math.abs(aim.y-(290+(100-290)*.4))<2);}

  await client.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx,y:y+dy}]});
  await page.waitForFunction(weak=>document.getElementById('powerValue').textContent!==weak,weak);assert(!await page.locator('#trainingShotDialog').isVisible());assert(!await page.locator('#nextAttempt').isVisible());assert(await page.evaluate(()=>Football3D.views.find(v=>v.training).aimLine.visible));
  await client.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.locator('#nextAttempt').waitFor({state:'visible',timeout:20000});assert.match(await page.locator('#trainingFeedback').innerText(),i===0?/Impedimento/:/posição legal/);await page.locator('#nextAttempt').tap();
 }
 assert.equal(new Set(scenarios).size,5);assert(await page.evaluate(()=>p.training.vision[0]>=75));assert.deepEqual(errors,[]);console.log('PASS: mira livre por arrasto no campo, potência ao vivo, sem botões/seleção/modal; impedimento e quatro passes legais salvos.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
