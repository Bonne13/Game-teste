const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const box={assert,console};vm.createContext(box);for(const f of ['training-engine.js','match-engine.js'])vm.runInContext(fs.readFileSync(f,'utf8'),box);
vm.runInContext(`
function advance(s,seconds){for(let i=0;i<Math.ceil(seconds/.01);i++)s.tick(.01);}
const moving=new MatchSituation();assert(moving.order(7,{x:300,y:220}));advance(moving,2);assert(distance(moving.teammates[0],{x:300,y:220})<1);
moving.order(7,{x:-500,y:0});assert.equal(moving.teammates[0].tx,80);assert.equal(moving.teammates[0].ty,195);
const penalty=new MatchSituation('penalty');penalty.aim={x:310,y:90};penalty.strike(.75);advance(penalty,1);assert(penalty.outcome.goal);
const saved=new MatchSituation('penalty');saved.aim={x:440,y:140};saved.strike(.75);advance(saved,1);assert(!saved.outcome.goal);assert.match(saved.outcome.message,/goleiro/);
const weak=new MatchSituation('penalty');weak.aim={x:310,y:140};weak.strike(0);advance(weak,1);assert(!weak.outcome.goal);
const blocked=new MatchSituation('freekick');blocked.aim={x:310,y:90};blocked.strike(.75,0);advance(blocked,1);assert(!blocked.outcome.goal);assert.match(blocked.outcome.message,/barreira/);
const curved=new MatchSituation('freekick');curved.aim={x:310,y:90};curved.strike(.75,-1);advance(curved,1);assert(curved.outcome.goal);
for(const [mode,window] of Object.entries(AIR_WINDOWS)){
 const s=new MatchSituation(mode);advance(s,(window[0]+window[1])/2*2.4);s.aim={x:310,y:90};s.strike(.6);advance(s,1);assert(s.outcome.goal,mode+': '+s.outcome.message);
 const wrong=new MatchSituation(mode);wrong.aim={x:310,y:90};wrong.strike(.6);advance(wrong,1);assert(!wrong.outcome.goal);assert.match(wrong.outcome.message,/tempo/);
}
const pass=new MatchSituation('pass');pass.aim={x:230,y:300};pass.strike(.55);advance(pass,1);assert.equal(pass.outcome,null);assert.equal(pass.mode,'shoot');assert.equal(pass.origin.x,230);
const interception=new MatchSituation('pass');interception.order(7,{x:270,y:195});advance(interception,3);interception.aim={x:270,y:195};interception.strike(.55);advance(interception,1);assert(interception.outcome&&!interception.outcome.goal);assert.match(interception.outcome.message,/interceptado/);
for(const mode of ['header','volley','bicycle']){const corner=new MatchSituation('corner');corner.crossFinish=mode;corner.order(10,{x:600,y:210});advance(corner,3);corner.aim={x:600,y:210};corner.strike(.65);assert(!corner.order(10,{x:700,y:200}));assert(!corner.setMode('penalty'));advance(corner,1.2);assert.equal(corner.outcome,null);assert.equal(corner.mode,mode);assert.equal(corner.origin.x,600);const window=AIR_WINDOWS[mode];advance(corner,(window[0]+window[1])/2*2.4-corner.time);corner.aim={x:310,y:90};corner.strike(.6);advance(corner,1);assert(corner.outcome.goal,corner.outcome.message);}
const normalStyle=new MatchSituation('penalty');normalStyle.aim={x:440,y:126};normalStyle.strike(.75);advance(normalStyle,1);assert.equal(normalStyle.outcome.kind,'save');
const chipped=new MatchSituation('penalty');assert(chipped.setShotStyle('chip'));chipped.aim={x:440,y:126};chipped.strike(.55);assert(chipped.flight.arc>normalStyle.flight.arc);assert(!chipped.setShotStyle('driven'));advance(chipped,1.2);assert(chipped.outcome.goal,'Cavadinha passa acima do alcance baixo do goleiro.');
const placed=new MatchSituation('penalty');placed.setShotStyle('placed');placed.strike(.65,.4);assert(Math.abs(placed.flight.curve-.54)<1e-8);assert.equal(placed.flight.end.y,placed.aim.y);
const driven=new MatchSituation('penalty');driven.setShotStyle('driven');driven.strike(.9,.4);assert(driven.flight.duration<normalStyle.flight.duration);assert(driven.flight.curve<placed.flight.curve);assert.equal(driven.flight.end.y,driven.aim.y);
const post=new MatchSituation('penalty');post.aim={x:291,y:100};post.strike(.75);advance(post,1);assert.equal(post.outcome.kind,'post');assert(!post.outcome.goal);assert(!post.setShotStyle('invalid'));
const stylePass=new MatchSituation('pass');stylePass.setShotStyle('chip');stylePass.strike(.55);assert.equal(stylePass.flight.style,'normal');assert.equal(stylePass.flight.duration,.85);
const missedCross=new MatchSituation('corner');missedCross.aim={x:800,y:450};missedCross.strike(.65);advance(missedCross,2);assert(!missedCross.outcome.goal);
`,box);console.log('PASS: quatro estilos de chute, cavadinha, trave, movimentação, limites do campo, pênalti, defesa, força, falta com curva, barreira, três tempos de contato aéreo, passe, interceptação e escanteio com três finalizações.');
