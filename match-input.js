'use strict';
// Shared field gesture for shots, passes, set pieces and aerial finishes.
function heldShotPower(milliseconds,strength){return Math.max(0,Math.min(1,milliseconds/1250))*(.8+Math.max(0,Math.min(100,strength))/100*.2);}
function wireMatchShot(view,options){
 if(view.failed)return;
 const field=view.canvas;const timing=view.shotDialog?.querySelector('#airTiming');if(timing)field.parentElement.before(timing);let carry=null;let drag=null,context=null,mode=null;
 const cancel=()=>{view.effectOpen=false;if(carry||['dribble','carry'].includes(mode))options.stopCarry?.();carry=null;drag=null;view.dragPower=0;view.aiming=false;view.charging=false;view.shotPhase='aim';view.setAimPoint?.(null);};
 const update=()=>{if(!options.ready()){cancel();context=null;mode=null;return;}const next=options.context?.(),nextMode=options.mode();if(next!==context||nextMode!==mode){cancel();context=next;mode=nextMode;}};
 const sample=e=>{const value=fieldDragSample(drag.anchor,e,options.origin(),options.strength(),drag.maxPull);const origin=options.origin(),range=['corner','cross'].includes(options.mode())?1800:options.mode()==='pass'?Math.max(700,origin.y+150):Math.max(650,Math.hypot(origin.x-440,origin.y-120)*1.4);value.end={x:origin.x+(value.end.x-origin.x)*range/600,y:origin.y+(value.end.y-origin.y)*range/600};value.curve=-(view.contact?.x||0);value.lift=-(view.contact?.y||0);if(!['pass','corner','cross'].includes(options.mode()))value.end.y-=value.lift*(view.rect().bottom-view.rect().top)*.35;view.dragPower=value.power;view.aimGround=['pass','corner','cross'].includes(options.mode());view.setAimPoint?.(value.end);options.change(value,true);return value;};
 view.updateCharge=update;view.cancelCharge=cancel;view.resetShotInput=cancel;
 view.isShotPreparationPaused=()=>!!view.effectOpen||!!drag&&!['header','volley','bicycle'].includes(options.mode());
 field.onpointerdown=e=>{update();if(e.isPrimary===false||e.button!==0||drag||!options.ready())return;if(options.onFieldDown?.(e))return;if(['dribble','carry'].includes(options.mode())){e.preventDefault();carry={pointer:e.pointerId,x:e.clientX};options.steer?.(0);field.setPointerCapture(e.pointerId);return;}e.preventDefault();view.effectOpen=false;drag={pointer:e.pointerId,anchor:{x:e.clientX,y:e.clientY},maxPull:Math.max(75,Math.min(120,field.clientHeight*.32))};view.aiming=true;view.charging=true;view.shotPhase='charging';sample(e);field.setPointerCapture(e.pointerId);};
 field.onpointermove=e=>{if(carry?.pointer===e.pointerId){e.preventDefault();options.steer?.((e.clientX-carry.x)/65);return;}if(drag?.pointer!==e.pointerId)return;e.preventDefault();if(!options.ready()){cancel();return;}sample(e);};
 field.onpointerup=e=>{if(carry?.pointer===e.pointerId){carry=null;options.steer?.(0);return;}if(drag?.pointer!==e.pointerId)return;e.preventDefault();if(!options.ready()){cancel();return;}const value=sample(e);cancel();if(value.fraction>.08){view.effectOpen=false;view.shotPhase='flight';options.release(value);}};
 field.onpointercancel=cancel;field.onlostpointercapture=()=>{if(drag||carry)cancel();};
 field.addEventListener?.('keydown',e=>{if(e.key==='Escape'){cancel();return;}if(!options.ready()||!['dribble','carry'].includes(options.mode()))return;if(['ArrowLeft','a','ArrowRight','d'].includes(e.key)){e.preventDefault();options.steer?.(['ArrowLeft','a'].includes(e.key)?-1:1);}});field.addEventListener?.('keyup',e=>{if(['ArrowLeft','a','ArrowRight','d'].includes(e.key)&&['dribble','carry'].includes(mode))options.steer?.(0);});
 if(options.button)wireFieldEffects(view,options.button,options.ready);
 window.addEventListener('blur',cancel);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel();});cancel();
}
