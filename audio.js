'use strict';
const GameAudio=(()=>{
 const KEY='proxima-audio-v1';let settings={volume:.6,muted:false},context=null,master=null;
 try{const old=JSON.parse(localStorage.getItem(KEY));if(old&&Number.isFinite(old.volume))settings={volume:Math.max(0,Math.min(1,old.volume)),muted:old.muted===true};}catch{}
 function apply(){if(master)master.gain.setValueAtTime(settings.muted?0:settings.volume,context.currentTime);}
 function set(next){settings={volume:Math.max(0,Math.min(1,next.volume??settings.volume)),muted:next.muted??settings.muted};apply();localStorage.setItem(KEY,JSON.stringify(settings));}
 function play(kind='click'){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;if(!context){context=new Audio();master=context.createGain();master.connect(context.destination);apply();}if(context.state==='suspended')context.resume().catch(()=>{});if(settings.muted||settings.volume===0)return;const t=context.currentTime,o=context.createOscillator(),g=context.createGain(),kick=kind==='kick';o.type=kick?'triangle':'sine';o.frequency.setValueAtTime(kick?170:660,t);o.frequency.exponentialRampToValueAtTime(kick?45:880,t+.07);g.gain.setValueAtTime(kick?.18:.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(g);g.connect(master);o.start(t);o.stop(t+.12);o.onended=()=>{o.disconnect();g.disconnect();};}catch{}}
 return{get:()=>({...settings}),set,play};
})();
