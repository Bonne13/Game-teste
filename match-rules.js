'use strict';
const MATCH_INTENSITIES={
 light:{label:'Leve',bonus:0,energyCost:10},
 moderate:{label:'Moderada',bonus:1,energyCost:20},
 high:{label:'Alta',bonus:2,energyCost:35}
};
function playerStrength(history,fallback=45){
 const ids=['shoot','vision','pass','speed','technique','freekick'];
 const averages=ids.map(id=>{const values=Array.isArray(history?.[id])?history[id].filter(Number.isFinite):[];return values.length?values.reduce((sum,n)=>sum+Math.max(0,Math.min(100,n)),0)/values.length:null;});
 if(averages.some(n=>n===null))return Math.max(0,Math.min(100,Number.isFinite(fallback)?fallback:45));
 return averages.reduce((sum,n)=>sum+n,0)/averages.length;
}
function chanceRange(strength,intensity='moderate'){
 const key=Object.hasOwn(MATCH_INTENSITIES,intensity)?intensity:'moderate';
 const settings=MATCH_INTENSITIES[key],rating=Math.max(0,Math.min(100,Number.isFinite(strength)?strength:0));
 const min=1+Math.floor(rating/25)+settings.bonus;
 return{intensity:key,label:settings.label,strength:rating,min,max:min+2,energyCost:settings.energyCost};
}
function rollMatchPlan(strength,intensity,random=Math.random){const plan=chanceRange(strength,intensity);const roll=Math.max(0,Math.min(.999999999,random()));return{...plan,total:plan.min+Math.floor(roll*3)};}
// Distribuir o custo inteiro pelas chances, sem arredondamentos acumulados.
function staminaSpent(energyCost,total,completed){if(total<=0)return 0;return Math.round(energyCost*Math.max(0,Math.min(total,completed))/total);}
