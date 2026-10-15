const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let now=0;const listeners={};const ctx=vm.createContext({performance:{now:()=>now},window:{addEventListener:(name,fn)=>listeners[name]=fn},document:{addEventListener:(name,fn)=>listeners[name]=fn},assert});
vm.runInContext(fs.readFileSync('match-input.js','utf8')+';globalThis.api={wireMatchShot,heldShotPower};',ctx);
assert.equal(ctx.api.heldShotPower(0,80),0);assert(Math.abs(ctx.api.heldShotPower(625,80)-.48)<1e-12);assert.equal(ctx.api.heldShotPower(5000,100),1);assert.equal(ctx.api.heldShotPower(5000,0),.8);
const element=()=>({setPointerCapture(){}}),field=element(),button=element(),contact=element(),shots=[],changes=[];let ready=true,mode='shoot',lastAim=null,positioning=false;
const view={canvas:field,contactCanvas:contact,contact:{x:.2,y:-.3},goalAt:e=>({x:e.clientX,y:e.clientY,ground:false}),groundAt:e=>({x:e.clientX,y:e.clientY,ground:true}),setContactFromPointer(){this.contact={x:.4,y:-.5};return true;},startDrag(){throw Error('Partidas não devem usar arrasto.');}};
ctx.api.wireMatchShot(view,{button,ready:()=>ready,mode:()=>mode,strength:()=>80,aim:value=>lastAim=value,change:(value,held)=>changes.push({value,held}),release:value=>shots.push(value),onFieldDown:()=>positioning});
function event(source,x=10,y=20){return{currentTarget:source,pointerId:1,button:0,clientX:x,clientY:y,preventDefault(){}};}
field.onpointerdown(event(field));now=625;view.updateCharge();const before=view.dragPower;field.onpointermove(event(field,10000,20000));assert.equal(view.dragPower,before,'Distância do mouse não determina a força.');field.onpointerup(event(field));assert.equal(shots.length,1);assert(Math.abs(shots[0].power-.48)<1e-12);assert.equal(view.dragPower,0);
contact.onpointerdown(event(contact));assert.equal(shots.length,1);assert.equal(view.charging,false);assert.equal(view.contact.x,.4);
field.onpointerdown(event(field));now+=500;listeners.blur();field.onpointerup(event(field));assert.equal(shots.length,1,'Perder foco cancela a carga.');
field.onpointerdown(event(field));field.onpointercancel();field.onpointerup(event(field));assert.equal(shots.length,1);
mode='pass';field.onpointermove(event(field,123,234));assert.equal(lastAim.ground,true);const previousAim=lastAim;button.onpointerdown(event(button));now+=800;button.onpointerup(event(button));assert.equal(shots.length,2);assert.equal(lastAim,previousAim);
positioning=true;field.onpointerdown(event(field));assert.equal(view.charging,false);positioning=false;ready=false;field.onpointerdown(event(field));assert.equal(view.charging,false);ready=true;
field.onpointerdown(event(field));now+=1;field.onpointerup(event(field));assert.equal(shots.length,2,'Toque instantâneo não dispara.');
console.log('PASS: partida sem arrasto, força por duração/atributo, mira, efeito separado, passe no gramado, botão, cancelamento, bloqueios e toque sem disparo.');
