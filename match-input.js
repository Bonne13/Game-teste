'use strict';
// Shared field gesture for shots, passes, set pieces and aerial finishes.
function heldShotPower(milliseconds,strength){return Math.max(0,Math.min(1,milliseconds/1250))*(.8+Math.max(0,Math.min(100,strength))/100*.2);}
function wireMatchShot(view,options){
 if(view.failed)return;
 const field=view.canvas;const timing=view.shotDialog?.querySelector('#airTiming');if(timing)field.parentElement.before(timing);let drag=null,context=null,mode=null;
 const cancel=()=>{view.effectOpen=false;drag=null;view.dragPower=0;view.aiming=false;view.charging=false;view.shotPhase='aim';view.setAimPoint?.(null);};
 const update=()=>{if(!options.ready()){cancel();context=null;mode=null;return;}const next=options.context?.(),nextMode=options.mode();if(next!==context||nextMode!==mode){cancel();context=next;mode=nextMode;}};
 const sample=e=>{const value=fieldDragSample(drag.anchor,e,options.origin(),options.strength(),drag.maxPull);value.curve=-(view.contact?.x||0);value.lift=-(view.contact?.y||0);if(!['pass','corner'].includes(options.mode()))value.end.y-=value.lift*(view.rect().bottom-view.rect().top)*.35;view.dragPower=value.power;view.aimGround=['pass','corner'].includes(options.mode());view.setAimPoint?.(value.end);options.change(value,true);return value;};
 view.updateCharge=update;view.cancelCharge=cancel;view.resetShotInput=cancel;
 view.isShotPreparationPaused=()=>!!view.effectOpen||!!drag&&!['header','volley','bicycle'].includes(options.mode());
 field.onpointerdown=e=>{update();if(e.isPrimary===false||e.button!==0||drag||!options.ready())return;if(options.onFieldDown?.(e))return;e.preventDefault();view.effectOpen=false;drag={pointer:e.pointerId,anchor:{x:e.clientX,y:e.clientY},maxPull:Math.max(90,Math.min(140,field.clientHeight*.4))};view.aiming=true;view.charging=true;view.shotPhase='charging';sample(e);field.setPointerCapture(e.pointerId);};
 field.onpointermove=e=>{if(drag?.pointer!==e.pointerId)return;e.preventDefault();if(!options.ready()){cancel();return;}sample(e);};
 field.onpointerup=e=>{if(drag?.pointer!==e.pointerId)return;e.preventDefault();if(!options.ready()){cancel();return;}const value=sample(e);cancel();if(value.fraction>.08){view.effectOpen=false;view.shotPhase='flight';options.release(value);}};
 field.onpointercancel=cancel;field.onlostpointercapture=()=>{if(drag)cancel();};
 if(options.button)wireFieldEffects(view,options.button,options.ready);
 window.addEventListener('blur',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});cancel();
}
