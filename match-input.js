'use strict';
// First choose the target; a separate gesture on the enlarged ball executes it.
function heldShotPower(milliseconds,strength){return Math.max(0,Math.min(1,milliseconds/1250))*(.8+Math.max(0,Math.min(100,strength))/100*.2);}
function wireMatchShot(view,options){
 if(view.failed)return;
 const field=view.canvas,ball=view.contactCanvas;let phase='aim',hold=null,pointer=null,context=null,mode=null;
 const setPhase=value=>{phase=value;view.shotPhase=value;view.preparingShot=value==='contact'||value==='charging';view.charging=value==='charging';view.showShotPreparation?.(view.preparingShot);};
 const clearHold=()=>{hold=null;view.dragPower=0;};
 const reset=()=>{clearHold();pointer=null;view.aiming=false;view.setAimPoint?.(null);setPhase('aim');};
 const cancel=()=>{clearHold();pointer=null;if(phase==='charging')setPhase('contact');};
 const aim=e=>{const point=['pass','corner'].includes(options.mode())?view.groundAt(e):view.goalAt(e);if(point){options.aim(point);view.aimGround=['pass','corner'].includes(options.mode());view.setAimPoint?.(point);}};
 const sample=()=>({power:heldShotPower(hold?performance.now()-hold.started:0,options.strength()),curve:-view.contact.x,lift:-view.contact.y});
 const update=()=>{
  if(!options.ready()){if(phase!=='aim'&&phase!=='flight')reset();return;}
  const nextContext=options.context?.(),nextMode=options.mode();
  if(nextContext!==context||nextMode!==mode){reset();context=nextContext;mode=nextMode;}
  const value=sample();view.dragPower=hold?value.power:0;options.change(value,!!hold);
 };
 view.updateCharge=update;view.cancelCharge=cancel;view.resetShotInput=reset;
 view.isShotPreparationPaused=()=>phase==='contact'||(phase==='charging'&&!['header','volley','bicycle'].includes(options.mode()));
 field.onpointerdown=e=>{
  update();if(e.isPrimary===false||e.button!==0||pointer||!options.ready()||phase!=='aim')return;
  if(options.onFieldDown?.(e))return;e.preventDefault();aim(e);pointer=e.pointerId;view.aiming=true;field.setPointerCapture(e.pointerId);update();
 };
 field.onpointermove=e=>{if(e.isPrimary===false||!options.ready()||phase!=='aim'||pointer!==null&&pointer!==e.pointerId)return;view.aiming=true;aim(e);update();};
 field.onpointerup=e=>{if(pointer!==e.pointerId||phase!=='aim')return;pointer=null;if(!options.ready())return;e.preventDefault();aim(e);setPhase('contact');update();};
 field.onpointercancel=cancel;field.onlostpointercapture=()=>{pointer=null;};
 ball.onpointerdown=e=>{
  if(e.isPrimary===false||e.button!==0||hold||phase!=='contact'||!options.ready())return;
  if(!view.setContactFromPointer(e,true))return;e.preventDefault();hold={started:performance.now(),pointer:e.pointerId};options.start?.();setPhase('charging');ball.setPointerCapture(e.pointerId);update();
 };
 ball.onpointermove=e=>{if(hold?.pointer===e.pointerId)update();};
 ball.onpointerup=e=>{
  if(!hold||hold.pointer!==e.pointerId)return;const value=sample(),valid=options.ready()&&performance.now()-hold.started>=120&&value.power>.025;clearHold();
  if(valid){view.setAimPoint?.(null);setPhase('flight');options.change(value,true);options.release(value);}else setPhase('contact');
 };
 ball.onpointercancel=e=>{if(hold?.pointer===e.pointerId)cancel();};ball.onlostpointercapture=()=>{if(hold)cancel();};
 if(options.button)options.button.onclick=()=>{update();if(options.ready()&&phase==='aim'){setPhase('contact');update();}};
 window.addEventListener('blur',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
 setPhase('aim');
}
