const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const elements=new Map();
function element(){return {style:{},value:'',textContent:'',disabled:false,setAttribute(){},getBoundingClientRect(){return {left:0,top:0,width:48,height:48}},children:[],append(...nodes){this.children.push(...nodes)},replaceChildren(...n){this.children=n;if(n.length)this.value=n[0].value},getContext:()=>new Proxy({}, {get:()=>()=>{}}),focus(){}}}
let storage=null;
function load(){const box={document:{getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)},createElement:()=>element()},Option:function(text,value){this.textContent=text;this.value=value},localStorage:{getItem:()=>storage,setItem:(k,v)=>storage=v},performance:{now:()=>0},requestAnimationFrame(){},setTimeout:()=>1,clearTimeout(){},console,assert,Football3D:class{constructor(){this.dragPower=0;this.failed=true;}renderTrial(){}renderMatch(){}},wire3DShot(){},setupInterface(){},refreshNavigation(){},refreshLeagueHub(){},openMainView(){}};vm.createContext(box);for(const file of ['club-database.js','leagues.js','league-world.js','training-engine.js','training.js','match-engine.js','match-rules.js','recovery.js','match-timeline.js','career-data.js','career-economy.js','career-ui.js','season-awards.js','game.js'])vm.runInContext(fs.readFileSync(file,'utf8'),box);return box;}
let box=load();
vm.runInContext(`
assert.equal(LEAGUES.length,12);
assert.equal(LEAGUES.reduce((n,l)=>n+l.teams.length,0),238);
for(const league of LEAGUES){
 const rounds=makeSchedule(league.teams),seen=new Set();
 assert.equal(rounds.length,2*(league.teams.length-1));
 for(const games of rounds){const used=new Set();for(const [a,b] of games){assert.notEqual(a,b);assert(!used.has(a));assert(!used.has(b));used.add(a);used.add(b);assert(!seen.has(a+'|'+b));seen.add(a+'|'+b);}assert.equal(used.size,league.teams.length);}
 assert.equal(seen.size,league.teams.length*(league.teams.length-1));
 p.training=Object.fromEntries(DRILLS.map(([id])=>[id,[70]]));$('leagueSelect').value=league.id;$('joinLeague').onclick();
 const oldGoals=p.goals;let expectedGoals=0;
 for(let round=0;round<rounds.length;round++){
 p.energy=100;$('play').onclick();assert(active);
 const idBefore=competition.leagueId;$('joinLeague').onclick();assert.equal(competition.leagueId,idBefore);
 expectedGoals+=matchPlan.total;const expectedCost=matchPlan.energyCost,rolledTotal=matchPlan.total;assert.equal(p.energy,100);assert.equal($('matchIntensity').disabled,true);const frozenIntensity=p.intensity;$('matchIntensity').value='high';$('matchIntensity').onchange();assert.equal(p.intensity,frozenIntensity);assert.equal(matchPlan.total,rolledTotal);while(active){advanceMatch(.05);if(timeline.phase==='halftime')$('resumeMatch').onclick();if(situation)result({target:{x:310,y:90},keeper:500});}assert.equal(p.energy,100-expectedCost);assert.equal(p.lastMatch.total,rolledTotal);const oldMatches=p.matches;result({goal:true});assert.equal(p.matches,oldMatches);
 assert(!active);assert.equal(competition.round,round+1);
 }
 const table=standings(currentLeague(),competition.results),own=table.find(row=>row.club===competition.club);
 assert.equal(own.points,rounds.length*3);assert.equal(own.gf,expectedGoals);assert.equal(p.goals-oldGoals,expectedGoals);
 for(const row of table){assert.equal(row.played,rounds.length);assert.equal(row.wins+row.draws+row.losses,row.played);assert.equal(row.points,row.wins*3+row.draws);}
 assert.equal(table.reduce((n,r)=>n+r.gf,0),table.reduce((n,r)=>n+r.ga,0));
 const lastYear=competition.year;p.energy=100;if(!hasClubContract(p))assert(renewClubContract(p,false,()=>0).accepted);$('play').onclick();assert.equal(competition.year,lastYear+1);assert.equal(competition.round,0);while(active){advanceMatch(.05);if(timeline.phase==='halftime')$('resumeMatch').onclick();if(situation)result({goal:false});}
}
const testRows=standings(LEAGUES[0],[[{host:'Arsenal',guest:'Chelsea',hg:1,ag:1}]]);assert.equal(testRows.find(r=>r.club==='Arsenal').points,1);
`,box);
vm.runInContext(`
assert.equal(recruit(LEAGUES[0],{}),null);
for(const score of [0,49,50,79,80,100])for(const league of LEAGUES){const h=Object.fromEntries(DRILLS.map(([id])=>[id,[score]]));const offer=recruit(league,h);assert(league.teams.includes(offer.club));assert.equal(offer.score,score);assert.equal(offer.tier,score>=80?'elite':score>=50?'regular':'development');assert.deepEqual(recruit(league,h),offer);}
const h=Object.fromEntries(DRILLS.map(([id])=>[id,[0,100]]));assert.equal(scoutingScore(h),50);delete h.pass;assert(!trainingReady(h));
$('drillButtons').children[0].onclick();$('cancelTraining').onclick();assert.equal(p.training.shoot.at(-1),0);
`,box);
const before=JSON.parse(storage);elements.clear();box=load();vm.runInContext(`assert.equal(competition.round,1);assert.equal(competition.results.length,1);`,box);
assert.equal(JSON.parse(storage).goals,before.goals);
// Energia insuficiente deve bloquear a intensidade alta sem sortear nem começar uma partida.
vm.runInContext(`p.energy=10;$('matchIntensity').value='high';$('matchIntensity').onchange();assert($('play').disabled);const previous=p.matches;$('play').onclick();assert(!active);assert.equal(p.matches,previous);$('matchIntensity').value='light';$('matchIntensity').onchange();assert(!$('play').disabled);$('play').onclick();assert(active);assert.equal(p.energy,10);while(active){advanceMatch(.05);if(timeline.phase==='halftime')$('resumeMatch').onclick();if(situation)result({goal:false});}assert.equal(p.energy,0);`,box);
// Migração de um salvamento anterior às ligas.
storage=JSON.stringify({name:'Veterano',energy:80,skill:60,rep:9,money:500,matches:12,goals:22,wins:8,points:25});elements.clear();box=load();vm.runInContext(`assert.equal(p.inventory.energyDrink,0);assert.equal(p.inventory.meal,0);assert.equal(p.energy,80);assert.equal(p.intensity,'moderate');assert.equal(p.goals,22);assert.equal(p.money,500);assert.equal(competition.leagueId,'eng');assert.equal(competition.round,0);`,box);
console.log('PASS: cancelamento, recrutamento determinístico, limites dos patamares, histórico,  12 divisões, 238 clubes, calendários completos, temporadas simuladas, pontuação, troca de campeonato, nova temporada, persistência e migração.');
