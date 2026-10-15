const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const box={assert,console};vm.createContext(box);vm.runInContext(fs.readFileSync('training-engine.js','utf8'),box);
vm.runInContext(`
function advance(trial,seconds,keys={}){for(let i=0;i<Math.ceil(seconds/.01);i++)trial.tick(.01,keys);}
const shot=new TrainingTrial('shoot');shot.aim={...shot.target};shot.release(.75);advance(shot,1);assert.equal(shot.score,100);assert(shot.resolved);
const miss=new TrainingTrial('shoot');miss.aim={x:440,y:0};miss.release(1);advance(miss,1);assert.equal(miss.score,0);
const save=new TrainingTrial('shoot');save.aim={x:440,y:60};save.release(.75);advance(save,1);assert.equal(save.score,0);assert.match(save.message,/defendeu/);
const straight=new TrainingTrial('freekick');straight.aim={...straight.target};straight.release(.75);advance(straight,1);assert.equal(straight.score,0);assert.match(straight.message,/barreira/);
const curve=new TrainingTrial('freekick');curve.aim={...curve.target};curve.curve=-1;curve.release(.75);advance(curve,1);assert.equal(curve.score,100);
// Passe deve antecipar a posição do companheiro no instante da chegada.
const pass=new TrainingTrial('pass');advance(pass,2);pass.aim=pass.teammate(2.85);pass.release(.55);advance(pass,1);assert(pass.score>=98,pass.message);
const interception=new TrainingTrial('pass');interception.aim={x:440,y:80};interception.release(.55);advance(interception,1);assert.equal(interception.score,0);assert.match(interception.message,/interceptado/);
for(let attempt=1;attempt<=5;attempt++){const vision=new TrainingTrial('vision',attempt);vision.choose((attempt-1)%4);assert.equal(vision.score,100);const wrong=new TrainingTrial('vision',attempt);wrong.choose(attempt%4);assert.equal(wrong.score,0);}
const sprint=new TrainingTrial('speed');for(let i=0;i<16;i++){sprint.step(i%2?'d':'a');if(!sprint.resolved)advance(sprint,.3);}assert(sprint.resolved);assert(sprint.score>80);
const spam=new TrainingTrial('speed');for(let i=0;i<16;i++)spam.step('a');advance(spam,9);assert(spam.score<sprint.score);
const dribble=new TrainingTrial('technique');advance(dribble,.5,{ArrowRight:true});assert(dribble.player.x>75);assert.equal(dribble.gate,0);
// Percorrer os portões com movimento, em vez de alterar o estado do jogador.
for(const gate of dribble.gates){let guard=0;while(distance(dribble.player,gate)>=15&&!dribble.resolved&&guard++<2000){dribble.tick(.01,{ArrowRight:gate.x-dribble.player.x>5,ArrowLeft:gate.x-dribble.player.x< -5,ArrowDown:gate.y-dribble.player.y>5,ArrowUp:gate.y-dribble.player.y< -5});}}
assert.equal(dribble.gate,5);assert(dribble.resolved);assert(dribble.score>0);
for(const kind of ['shoot','pass','vision','speed','technique','freekick']){const timeout=new TrainingTrial(kind);advance(timeout,20);assert(timeout.resolved);assert.equal(timeout.score,0);const score=timeout.score;timeout.choose(0);timeout.release(.75);timeout.step('a');assert.equal(timeout.score,score);}
`,box);
console.log('PASS: chute, goleiro, força, passe antecipado, interceptação, visão, ritmo de corrida, drible, barreira, curva e tempos limite.');
