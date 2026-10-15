'use strict';
// Matches use a timed hold. Slingshot displacement belongs exclusively to training.
function heldShotPower(milliseconds,strength){return Math.max(0,Math.min(1,milliseconds/1250))*(.8+Math.max(0,Math.min(100,strength))/100*.2);}
function wireMatchShot(view,options){
 if(view.failed)return;
 const field=view.canvas,button=options.button;let hold=null;
 const cancel=()=>{hold=null;view.charging=false;view.dragPower=0;};
 const aim=e=>{const point=['pass','corner'].includes(options.mode())?view.groundAt(e):view.goalAt(e);if(point)options.aim(point);};
 const sample=()=>({power:heldShotPower(hold?performance.now()-hold.started:0,options.strength()),curve:-view.contact.x,lift:-view.contact.y});
 const update=()=>{if(hold&&!options.ready()){cancel();return;}if(options.ready()){const value=sample();view.dragPower=hold?value.power:0;options.change(value,!!hold);}};
 view.updateCharge=update;view.cancelCharge=cancel;
 const start=(e,fromField)=>{if(e.button!==0||hold)return;if(fromField&&options.onFieldDown?.(e))return;if(!options.ready())return;e.preventDefault();if(fromField)aim(e);hold={started:performance.now(),pointer:e.pointerId,source:e.currentTarget};view.charging=true;view.aiming=true;e.currentTarget.setPointerCapture(e.pointerId);update();};
 const finish=e=>{if(!hold||hold.pointer!==e.pointerId||hold.source!==e.currentTarget)return;const value=sample(),valid=options.ready()&&value.power>.025;cancel();if(valid){options.change(value,true);options.release(value);}};
 field.onpointerdown=e=>start(e,true);field.onpointermove=e=>{if(!options.ready())return;view.aiming=true;aim(e);update();};field.onpointerleave=()=>{if(!hold)view.aiming=false;};field.onpointerup=finish;field.onpointercancel=cancel;field.onlostpointercapture=cancel;
 if(button){button.onpointerdown=e=>start(e,false);button.onpointerup=finish;button.onpointercancel=cancel;button.onlostpointercapture=cancel;}
 view.contactCanvas.onpointerdown=e=>{if(e.button!==0||hold||!options.ready())return;e.preventDefault();if(view.setContactFromPointer(e,true))update();};
 window.addEventListener('blur',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});
}
