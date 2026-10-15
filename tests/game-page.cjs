// Existing gameplay suites enter a career directly; menu suites exercise onboarding separately.
module.exports=async page=>page.addInitScript(()=>{sessionStorage.setItem('proxima-enter-game','1');if(!localStorage.getItem('proxima-estrela-v1'))localStorage.setItem('proxima-estrela-v1',JSON.stringify({name:'Alex Silva',energy:100,skill:45,rep:0,money:150,matches:0,goals:0,wins:0,points:0}));});
