const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),box={assert};vm.createContext(box);for(const file of ['training-engine.js','match-engine.js','goal-celebrations.js'])vm.runInContext(fs.readFileSync(file,'utf8'),box);
vm.runInContext(`
const opponents=[{x:440,y:55},{x:500,y:160},{x:700,y:250}],ball={x:440,y:290};
assert(offsidePosition({x:200,y:100},ball,opponents));assert(!offsidePosition({x:200,y:160},ball,opponents));assert(!offsidePosition({x:200,y:300},ball,opponents));assert(!offsidePosition({x:200,y:100},{x:440,y:90},opponents));assert(!offsidePosition({x:200,y:1100},{x:440,y:1200},[{y:1150},{y:1180}]));assert(offsidePosition({y:900},{y:1000},[{y:100},{y:950}]));
assert(offsidePosition({y:150},{y:50},[{y:200},{y:100}],{direction:1,halfway:0}));
function finish(t){for(let i=0;i<100&&!t.resolved;i++)t.tick(.05);}
const safe=[0,0,1,1,3];for(let i=0;i<5;i++){const t=new TrainingTrial('vision',i+1);assert(t.mates.some(m=>offsidePosition(m,t.origin,t.opponents)),t.scenario);assert(t.choose(safe[i]));assert(!t.resolved);t.release(.55);finish(t);assert.equal(t.shot.outcome,'received',t.scenario+': '+t.message);assert(t.score>80,t.scenario+': '+t.score);}
const off=new TrainingTrial('vision',1);off.choose(1);off.release(.55);off.mates[1].y=250;off.opponents[1].y=5;finish(off);assert.equal(off.shot.outcome,'offside');assert.equal(off.score,0);assert.equal(off.shot.receiverAtTouch.y,100);
const inaccurate=new TrainingTrial('vision');inaccurate.choose(0);inaccurate.release(.1);finish(inaccurate);assert.notEqual(inaccurate.shot.outcome,'received');
function gamePass(mode='pass'){const m=new MatchSituation(mode,{pass:100});m.defenders=[{x:700,y:220},{x:800,y:300}];m.teammates=[{number:7,x:200,y:200,tx:200,ty:200}];m.aim={x:200,y:200};return m;}
const illegal=gamePass();illegal.strike(.55);illegal.defenders[0].y=100;for(let i=0;i<100&&!illegal.outcome;i++)illegal.tick(.02);assert.equal(illegal.outcome.kind,'offside');assert(!illegal.outcome.goal);
const back=gamePass();back.origin={x:440,y:190};back.strike(.55);for(let i=0;i<50;i++)back.tick(.02);assert.equal(back.mode,'shoot');assert(!back.outcome);
const corner=gamePass('corner');corner.strike(.65);for(let i=0;i<70;i++)corner.tick(.02);assert.equal(corner.mode,'header');assert(!corner.outcome);
assert.equal(new Set(GOAL_CELEBRATIONS.map(v=>v.id)).size,6);for(let i=0;i<6;i++){const c=new GoalCelebration(i,'Teste','Clube');assert.equal(c.stage,'goal');for(let j=0;j<10;j++)c.tick(.1);assert.equal(c.stage,'celebrate');c.skip();assert(c.done);}assert.equal(new GoalCelebration(6,'Teste','Clube').variant.id,GOAL_CELEBRATIONS[0].id);
`,box);console.log('PASS: cinco cenários, passes por força, impedimento no toque, linha/bola/próprio campo, goleiro, snapshot, regra nas partidas, exceção de escanteio e seis comemorações.');
