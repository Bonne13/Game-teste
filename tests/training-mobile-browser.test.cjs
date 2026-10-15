const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const context=await browser.newContext({viewport:{width:393,height:851},deviceScaleFactor:2,isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const cdp=await context.newCDPSession(page);
 await require('./game-page.cjs')(page);await page.goto(process.env.GAME_URL||'http://127.0.0.1:8011/');await page.locator('#buildVersion').waitFor();assert.match(await page.locator('#buildVersion').innerText(),/0.5.0/);
 for(const [index,kind] of [[0,'shoot'],[2,'pass'],[5,'freekick']]){
  await page.locator('#drillButtons button').nth(index).tap();
  for(let attempt=0;attempt<5;attempt++){
   assert(await page.locator('#trainingCanvas').evaluate(c=>!c.parentElement.querySelector('.shot-aim-marker').hidden),'A mira deve aparecer sem qualquer toque no campo.');
   await page.locator('#chargeBall').tap();await page.locator('#trainingShotDialog').waitFor({state:'visible'});
   const clock=await page.locator('#trainingClock').innerText();await page.waitForTimeout(450);assert.equal(await page.locator('#trainingClock').innerText(),clock);assert(!await page.locator('#nextAttempt').isVisible());
   assert(await page.locator('#trainingContactBall').evaluate(c=>{const p=c.getContext('2d').getImageData(0,0,190,190).data;let white=0,dark=0;for(let i=0;i<p.length;i+=4){if(p[i]>160&&p[i+1]>160)white++;if(p[i]<80&&p[i+3]>0)dark++;}return white>500&&dark>100;}),'A bola precisa estar desenhada, e não apenas ter um canvas visível.');
   const b=await page.locator('#trainingContactBall').boundingBox(),x=b.x+b.width/2,y=b.y+b.height/2;
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+85}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await page.locator('#nextAttempt').waitFor({state:'visible',timeout:15000});await page.locator('#nextAttempt').tap();
  }
  assert.equal(await page.evaluate(kind=>p.training[kind].length,kind),1,'As cinco tentativas devem salvar uma sessão completa.');
 }
 assert.deepEqual(errors,[]);console.log('PASS: celular, mira inicial, botão sem toque no campo, bola com pixels, pausa, 15 finalizações e sessões completas de chute, passe e falta.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
