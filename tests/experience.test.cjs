const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const box=vm.createContext({assert});for(const f of ['career-data.js','career-economy.js','football-presentation.js'])vm.runInContext(fs.readFileSync(f,'utf8'),box);vm.runInContext(`
const attributes={shoot:70,accuracy:70,speed:70,technique:70,vision:70,pass:70,freekick:70};
const player={position:'ATA',energy:100,development:{attributes}};
assert(Math.abs(effectiveStrength(player)-70)<1e-9);attributes.shoot=100;const striker=effectiveStrength(player);player.position='MEI';assert(effectiveStrength(player)<striker);player.position='ATA';player.energy=0;assert.equal(effectiveStrength(player),striker);attributes.accuracy=90;assert(effectiveStrength(player)>striker);
assert(stadiumAtmosphere(1,.5).occupancy>stadiumAtmosphere(2,.5).occupancy);assert(stadiumAtmosphere(2,.9).occupancy>stadiumAtmosphere(2,.1).occupancy);assert(stadiumAtmosphere(1,1).occupancy<=1);
`,box);console.log('PASS: overall por posição, precisão, energia independente e ocupação por divisão/desempenho.');
