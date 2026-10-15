const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const page=await browser.newPage({viewport:{width:393,height:851},isMobile:true,hasTouch:true}),errors=[];page.on('pageerror',e=>errors.push(e.message));await require('./game-page.cjs')(page);await page.goto(process.env.GAME_URL||'http://127.0.0.1:8011/');await page.locator('#drillButtons button').first().tap();await page.locator('#trainingCanvas').scrollIntoViewIfNeeded();
 await page.evaluate(()=>{const v=Football3D.views.find(v=>v.training),render=v.renderTrial.bind(v);v.renderTrial=(trial,player)=>render(window.destinationTrial||trial,player);});
 const cases=[['goal','shoot',285,55,.75,/GOL/],['save','shoot',440,60,.75,/DEFESA/],['wall','freekick',285,55,.75,/BARREIRA/],['short','shoot',285,55,.15,/antes do gol/],['right','shoot',820,55,.75,/direita/],['left','shoot',50,55,.75,/esquerda/],['high','shoot',285,0,.75,/acima do travessão/]];
 for(const [id,kind,x,y,power,label] of cases){
  await page.evaluate(({kind,x,y,power})=>{const t=new TrainingTrial(kind);t.aim={x,y};t.started=true;t.release(power);for(let i=0;i<100&&!t.resolved;i++)t.tick(.05);window.destinationTrial=t;},{kind,x,y,power});
  await page.waitForTimeout(700);assert.match(await page.locator('.shot-destination-caption').innerText(),label,id);assert(await page.locator('.shot-destination-marker').isVisible(),id);
  const state=await page.evaluate(()=>{const v=Football3D.views.find(v=>v.training),point=v.project(v.ball.position),r=v.canvas.getBoundingClientRect();return{x:point.x,y:point.y,width:r.width,height:r.height,worldY:v.ball.position.y,worldZ:v.ball.position.z,outcome:destinationTrial.shot.outcome};});
  assert(state.worldY>=.17,id+' abaixo do gramado');assert(state.x>=0&&state.x<=state.width&&state.y>=0&&state.y<=state.height,id+' fora do enquadramento');if(id==='goal')assert(state.worldZ<0,'Gol deve terminar dentro da rede.');if(id==='save')assert(state.worldZ>0,'Defesa deve parar antes de cruzar a linha.');
  if(id==='right')await page.screenshot({path:'/tmp/training-final-destination.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS: destino final persistente e enquadrado em gol, defesa, barreira, chute curto, direita, esquerda e por cima; bola nunca sob o gramado.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
