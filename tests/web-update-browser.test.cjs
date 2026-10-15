// Exercise migration from an already installed cache-first worker with an open tab.
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const fixture=path.resolve('dist/update-fixture');fs.rmSync(fixture,{recursive:true,force:true});fs.cpSync('dist/web',fixture,{recursive:true});
 fs.writeFileSync(path.join(fixture,'index.html'),'<p id="webAvailability">Controles v0.5.1</p><script src="web-app.js"></script>');
 const current=fs.readFileSync(path.join(fixture,'service-worker.js'),'utf8');
 fs.writeFileSync(path.join(fixture,'service-worker.js'),current.replace(/proxima-web-[a-f0-9]+/,'proxima-web-old').replace('await self.skipWaiting();','').replace("url.searchParams.get('atualizar')==='mira-pausada'","false"));
 // Python's test server compares Last-Modified at whole-second resolution.
 const oldTime=new Date(Date.now()-120000);fs.utimesSync(path.join(fixture,'service-worker.js'),oldTime,oldTime);
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
  const context=await browser.newContext(),normal=await context.newPage();const url=(process.env.GAME_URL||'http://127.0.0.1:8010/')+'dist/update-fixture/';
  await normal.goto(url);await normal.waitForFunction(()=>!!navigator.serviceWorker.controller);await normal.evaluate(()=>{localStorage.setItem('update-test-career','preserved');window.originalTab=true;});
  const recovery=await context.newPage();await recovery.goto(url+'?atualizar=mira-pausada');assert(recovery.url().includes('atualizar='));
  fs.writeFileSync(path.join(fixture,'service-worker.js'),current);
  await recovery.evaluate(()=>{navigator.serviceWorker.ready.then(r=>r.update());});
  await recovery.waitForURL(/versao=/,{timeout:30000,waitUntil:'domcontentloaded'});
  assert.equal(await recovery.evaluate(()=>localStorage.getItem('update-test-career')),'preserved');assert.equal(await normal.evaluate(()=>window.originalTab),true);
  assert.match(await recovery.locator('#webAvailability').innerText(),/v0.5.1/);
  console.log('PASS: worker antigo substituído com abas abertas, link de recuperação recarrega só a aba solicitada e preserva carreira.');
 }finally{await browser.close();fs.rmSync(fixture,{recursive:true,force:true});}
})().catch(e=>{console.error(e);process.exitCode=1;});
