'use strict';
const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,n));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function pathPoint(a,b,u,curve=0){return {x:a.x+(b.x-a.x)*u+4*u*(1-u)*curve*160,y:a.y+(b.y-a.y)*u};}
function pathBlocked(a,b,defenders,curve=0){for(let i=0;i<=60;i++){const pos=pathPoint(a,b,i/60,curve);if(defenders.some(d=>distance(pos,d)<24))return true;}return false;}
class TrainingTrial{
 constructor(kind,attempt=1){this.kind=kind;this.attempt=attempt;this.time=0;this.limit=kind==='technique'?18:kind==='speed'?8:12;this.resolved=false;this.score=0;this.message='';this.aim={x:440,y:60};this.player={x:75,y:260};this.origin={x:440,y:290};this.curve=0;this.shot=null;this.lastFoot=null;this.lastStep=-1;this.steps=0;this.mistakes=0;this.gate=0;this.collisions=0;this.contact=false;
 this.target={x:attempt%2?285:595,y:55};
 this.gates=[{x:175,y:215},{x:320,y:95},{x:480,y:240},{x:650,y:90},{x:790,y:230}];
 this.cones=[{x:235,y:145},{x:400,y:185},{x:580,y:160},{x:710,y:155}];
 const open=(attempt-1)%4;
 this.mates=[{x:160,y:85},{x:340,y:85},{x:540,y:85},{x:730,y:85}];
 this.markers=this.mates.filter((_,i)=>i!==open).map(a=>({x:a.x+12,y:a.y+35}));
 this.defenders=[{x:440,y:170},{x:590,y:135}];
 }
 teammate(at=this.time){return{x:320+Math.sin(at*1.25)*150,y:85};}
 goalkeeper(at=this.time){return 440+Math.sin(at*1.8)*135;}
 finish(score,message){if(this.resolved)return;this.resolved=true;this.score=Math.round(clamp(score));this.message=message;}
 choose(index){if(this.resolved||this.kind!=='vision'||index<0||index>3)return;const space=this.mates.map(m=>Math.min(...this.markers.map(d=>distance(m,d))));const correct=space[index]===Math.max(...space);this.finish(correct?100-this.time*4:0,correct?'Você encontrou o companheiro com mais espaço.':'Esse companheiro estava marcado. Observe a distância dos defensores.');}
 step(foot){if(this.resolved||this.kind!=='speed')return;if(foot===this.lastFoot||this.time-this.lastStep<.12){this.mistakes++;return;}const interval=this.time-this.lastStep;this.steps+=this.lastFoot===null?1:interval>=.22&&interval<=.55?1:.55;this.lastFoot=foot;this.lastStep=this.time;if(this.steps>=16)this.finish(100-Math.max(0,this.time-4)*12-this.mistakes*4,'Linha de chegada! Ritmo alternado e regular rende mais velocidade.');}
 release(power){if(this.resolved||this.shot||!['shoot','pass','freekick'].includes(this.kind))return;power=clamp(power,0,1);const ideal=this.kind==='pass'?.55:.75;const end={x:this.aim.x,y:this.aim.y+(ideal-power)*230};this.shot={end,power,elapsed:0,duration:this.kind==='pass'?.85:.65,curve:this.kind==='freekick'?this.curve:0,keeper:this.goalkeeper()};}
 tick(dt,keys={}){if(this.resolved)return;dt=Math.max(0,Math.min(dt,.05));this.time+=dt;
 if(this.shot){const s=this.shot;s.elapsed+=dt;if(s.elapsed>=s.duration){if(this.kind==='pass'){const mate=this.teammate(),blocked=pathBlocked(this.origin,s.end,this.defenders);const gap=distance(s.end,mate);this.finish(blocked?0:100-gap*1.8,blocked?'Passe interceptado! Encontre uma linha livre.':gap<45?'Passe recebido pelo companheiro.':'O passe não encontrou o companheiro. Antecipe o movimento.');}else{const wall=this.kind==='freekick'&&pathBlocked(this.origin,s.end,[350,395,440,485,530].map(x=>({x,y:170})),s.curve);const onTarget=s.end.x>240&&s.end.x<640&&s.end.y>=25&&s.end.y<=95;const saved=this.kind==='shoot'&&Math.abs(s.end.x-s.keeper)<40;const gap=distance(s.end,this.target);this.finish(wall||!onTarget||saved?0:100-gap*.75,wall?'A bola bateu na barreira. Ajuste a curva e a mira.':!onTarget?'Fora do gol. Ajuste força e direção.':saved?'O goleiro defendeu. Procure o canto.':gap<35?'No alvo! Excelente finalização.':'Gol! Busque o alvo para uma nota maior.');}}return;}
 if(this.kind==='technique'){let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);const norm=Math.hypot(dx,dy)||1;this.player.x=clamp(this.player.x+dx/norm*155*dt,18,862);this.player.y=clamp(this.player.y+dy/norm*155*dt,20,300);const touching=this.cones.some(c=>distance(c,this.player)<27);if(touching&&!this.contact)this.collisions++;this.contact=touching;if(this.gate<5&&distance(this.player,this.gates[this.gate])<25){this.gate++;if(this.gate===5)this.finish(100-this.collisions*15-Math.max(0,this.time-9)*3,'Circuito completo! Cada cone tocado desconta 15 pontos.');}}
 if(this.time>=this.limit){if(this.kind==='speed')this.finish(this.steps/16*70-this.mistakes*4,'Tempo esgotado. Alterne os pés no ritmo indicado.');else if(this.kind==='technique')this.finish(this.gate*12-this.collisions*15,'Tempo esgotado. Complete os portões em ordem.');else this.finish(0,'Tempo esgotado. Nenhuma ação concluída.');}
 }
}
