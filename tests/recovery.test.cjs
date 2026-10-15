const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const box={assert,console};vm.createContext(box);for(const file of ['training-engine.js','match-engine.js','match-rules.js','recovery.js'])vm.runInContext(fs.readFileSync(file,'utf8'),box);
vm.runInContext(`
const player={energy:20,money:150};prepareInventory(player);assert.equal(player.inventory.energyDrink,0);
assert(buyRecovery(player,'energyDrink').ok);assert.equal(player.money,90);assert.equal(player.inventory.energyDrink,1);
assert(useRecovery(player,'energyDrink').ok);assert.equal(player.energy,60);assert.equal(player.inventory.energyDrink,0);
assert(!useRecovery(player,'energyDrink').ok);assert.equal(player.energy,60);
assert(buyRecovery(player,'energyDrink').ok);player.energy=95;const partial=useRecovery(player,'energyDrink');assert.equal(partial.recovered,5);assert.equal(player.energy,100);
player.money=60;assert(buyRecovery(player,'energyDrink').ok);assert(!useRecovery(player,'energyDrink').ok);assert.equal(player.inventory.energyDrink,1);
player.energy=20;const snapshot=JSON.stringify(player);assert(!buyRecovery(player,'meal',true).ok);assert(!useRecovery(player,'energyDrink',true).ok);assert(!restPlayer(player,true).ok);assert.equal(JSON.stringify(player),snapshot);
assert(!buyRecovery(player,'meal').ok);assert.equal(player.money,0);player.money=35;assert(buyRecovery(player,'meal').ok);assert(useRecovery(player,'meal').ok);assert.equal(player.energy,45);assert.equal(player.money,0);
assert.equal(restPlayer(player).recovered,30);assert.equal(player.energy,75);assert.equal(restPlayer(player).recovered,25);assert.equal(player.energy,100);assert(!restPlayer(player).ok);
const restored=JSON.parse(JSON.stringify(player));prepareInventory(restored);assert.equal(restored.inventory.energyDrink,1);assert.equal(restored.energy,100);
assert.equal(staminaCondition(60),'Boa condição');assert.match(staminaCondition(30),/Cansado/);assert.match(staminaCondition(0),/Exausto/);
for(const total of [1,2,3,5,7,9])for(const cost of [10,20,35]){let previous=0,sum=0;for(let completed=1;completed<=total;completed++){const spent=staminaSpent(cost,total,completed);assert(spent>=previous);sum+=spent-previous;previous=spent;}assert.equal(sum,cost);}
const fresh=new MatchSituation('shoot',{speed:80,stamina:100}),tired=new MatchSituation('shoot',{speed:80,stamina:10});fresh.order(7,{x:700,y:300});tired.order(7,{x:700,y:300});for(let i=0;i<100;i++){fresh.tick(.01);tired.tick(.01);}assert(fresh.teammates[0].x>tired.teammates[0].x);
`,box);console.log('PASS: compra, inventário, saldo insuficiente, consumo, recuperação parcial, limite 100, descanso, bloqueios, persistência, desgaste progressivo e cansaço na movimentação.');
