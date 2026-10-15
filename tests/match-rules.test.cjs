const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const box={assert,console};vm.createContext(box);vm.runInContext(fs.readFileSync('match-rules.js','utf8'),box);
vm.runInContext(`
const history=Object.fromEntries(['shoot','vision','pass','speed','technique','freekick'].map(id=>[id,[60,100]]));assert.equal(playerStrength(history),80);assert.equal(playerStrength({},45),45);
assert.equal(chanceRange(80,'light').min,4);assert.equal(chanceRange(80,'light').max,6);assert.equal(chanceRange(80,'moderate').min,5);assert.equal(chanceRange(80,'high').min,6);assert.equal(chanceRange(80,'high').max,8);
assert.equal(chanceRange(0,'light').min,1);assert.equal(chanceRange(100,'high').max,9);
assert.equal(chanceRange(80,'light').energyCost,10);assert.equal(chanceRange(80,'moderate').energyCost,20);assert.equal(chanceRange(80,'high').energyCost,35);
for(let strength=0;strength<=100;strength++)for(const intensity of Object.keys(MATCH_INTENSITIES)){
 const range=chanceRange(strength,intensity);const totals=new Set();for(const roll of [0,.1,.34,.5,.67,.9,.999999999,1]){const plan=rollMatchPlan(strength,intensity,()=>roll);assert(Number.isInteger(plan.total));assert(plan.total>=range.min&&plan.total<=range.max);totals.add(plan.total);}assert.equal(totals.size,3);
 if(strength<100)assert(chanceRange(strength+1,intensity).min>=range.min);
 assert(chanceRange(strength,'high').min>chanceRange(strength,'light').min);
}
// Gerador com semente: verificar sorteio, distribuição e médias sem testes instáveis.
let seed=12345;function rng(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
for(const [strength,intensity] of [[0,'light'],[50,'moderate'],[100,'high']]){const range=chanceRange(strength,intensity),counts=[0,0,0];let sum=0;for(let i=0;i<12000;i++){const total=rollMatchPlan(strength,intensity,rng).total;counts[total-range.min]++;sum+=total;}assert(Math.abs(sum/12000-(range.min+1))<.05);assert(counts.every(n=>n>3700&&n<4300));}
assert.equal(chanceRange(NaN,'invalid').intensity,'moderate');assert.equal(chanceRange(-100,'light').min,1);assert.equal(chanceRange(500,'high').max,9);
`,box);console.log('PASS: força dos seis fundamentos, três intensidades, limites, custos de energia, monotonicidade e distribuição aleatória com semente.');
