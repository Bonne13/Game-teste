'use strict';
let refreshMobileUI=()=>{};
function setupMobileUI(){
 const hud=document.createElement('section');hud.id='mobileHUD';hud.setAttribute('aria-label','Seu jogador');
 hud.innerHTML='<p id="mobileClub"></p><div class="mobile-stats"><span>Stamina <strong id="mobileEnergy"></strong></span><span>OVR <strong id="mobileOverall"></strong></span><span id="mobileMoney"></span></div><details><summary>Meu jogador</summary><label for="mobileName">Nome</label><input id="mobileName" maxlength="24"><button class="btn" id="mobileRest">Descansar</button><p id="mobileFeedback" class="sub" role="status"></p></details>';
 document.querySelector('header').after(hud);$('mobileName').value=p.name;
 $('mobileName').onchange=()=>{p.name=$('mobileName').value.trim()||'Alex Silva';$('mobileName').value=p.name;$('name').value=p.name;save();refresh();};
 $('mobileRest').onclick=()=>{const outcome=restPlayer(p,active||isTraining());$('mobileFeedback').textContent=outcome.message;if(outcome.ok)save();refresh();};
 refreshMobileUI=()=>{if(document.activeElement!==$('mobileName'))$('mobileName').value=p.name;$('mobileClub').textContent=(p.recruited?competition.club:'Em avaliação · complete os seis treinos')+(p.position?' · '+p.position:'')+(p.nationality&&typeof NATIONALITIES!=='undefined'?' · '+(NATIONALITIES.find(n=>n.id===p.nationality)?.name||p.nationality):'');$('mobileEnergy').textContent=p.energy+'/100';$('mobileOverall').textContent=Math.round(effectiveStrength(p));$('mobileMoney').textContent=careerMoney(p.money);$('mobileRest').disabled=active||isTraining()||p.energy>=100;};
 if(window.matchMedia?.('(pointer:coarse)').matches){for(const view of Football3D.views){const help=view.contactWrapper?.querySelector('p');if(help)help.textContent=help.textContent.replaceAll('Clique','Toque').replaceAll('clique','toque').replaceAll('mouse','dedo');}}
 refreshMobileUI();
}
