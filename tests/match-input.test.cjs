const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),listeners={};
const ctx=vm.createContext({window:{addEventListener:(n,f)=>listeners[n]=f},document:{addEventListener:(n,f)=>listeners[n]=f}});
vm.runInContext(fs.readFileSync('football-3d.js','utf8')+'\n'+fs.readFileSync('match-input.js','utf8')+';globalThis.wire=wireMatchShot;',ctx);
const field={clientHeight:300,setPointerCapture(){}},shots=[];let ready=true,mode='shoot',context={},positioning=false,preview;
const view={canvas:field,contact:{x:0,y:0},rect:()=>({bottom:184,top:69}),setAimPoint(p){this.aim=p;}};
ctx.wire(view,{ready:()=>ready,context:()=>context,mode:()=>mode,origin:()=>({x:440,y:390}),strength:()=>80,change:s=>preview=s,release:s=>shots.push(s),onFieldDown:()=>positioning});
const e=(x=100,y=100)=>({button:0,pointerId:1,clientX:x,clientY:y,preventDefault(){}});
for(mode of ['shoot','pass','penalty','freekick','corner','header','volley','bicycle']){
 view.updateCharge();field.onpointerdown(e());assert.equal(preview.power,0);view.updateCharge();assert.equal(preview.power,0,'Holding alone cannot add power');field.onpointermove(e(120,150));const weak=preview.power;field.onpointermove(e(80,190));assert(preview.power>weak);assert(preview.end.x>440);assert.equal(view.isShotPreparationPaused(),!['header','volley','bicycle'].includes(mode));field.onpointerup(e(80,190));assert.equal(shots.length,['shoot','pass','penalty','freekick','corner','header','volley','bicycle'].indexOf(mode)+1);
}
field.onpointerdown(e());listeners.blur();field.onpointerup(e(100,200));assert.equal(shots.length,8);field.onpointerdown(e());field.onpointerup(e());assert.equal(shots.length,8);positioning=true;field.onpointerdown(e());field.onpointerup(e(100,200));assert.equal(shots.length,8);positioning=false;field.onpointerdown(e());ready=false;view.updateCharge();field.onpointerup(e(100,200));assert.equal(shots.length,8);
console.log('PASS: oito jogadas com arrasto livre, força por distância, pausa, direção, toque sem disparo, cancelamento e posicionamento.');
