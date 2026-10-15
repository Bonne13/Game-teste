'use strict';
// Registration only exists in the browser export, never in the native APK/EXE.
if('serviceWorker' in navigator && location.protocol==='https:' || 'serviceWorker' in navigator && ['localhost','127.0.0.1'].includes(location.hostname)){
 window.addEventListener('load',async()=>{
  try{
   const registration=await navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'});
   const status=document.getElementById('webAvailability');
   const waiting=()=>{if(status)status.textContent='Atualização disponível. Termine sua partida e feche as abas do jogo para atualizar ao reabrir.';};
   if(registration.waiting)waiting();
   registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)waiting();});});
   await navigator.serviceWorker.ready;
   if(status&&!registration.waiting)status.textContent='Controles v0.4.5 · Jogo disponível offline. Sua carreira permanece salva neste aparelho.';
  }catch{
   const status=document.getElementById('webAvailability');
   if(status)status.textContent='Jogue conectado. O modo offline não está disponível neste navegador.';
  }
 });
}
