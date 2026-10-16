'use strict';
const LIFE_SKILLS={shoot:'Chute / força',vision:'Visão',pass:'Passe',speed:'Velocidade',technique:'Técnica',freekick:'Tiro livre',accuracy:'Precisão'};
const CAREER_JOURNALISTS=['Marcelo Bechler','Fred Caldeira','Fabrizio Romano'];
const lifeLimit=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
function careerDate(player,day=player.economy?.calendarDay||0){const date=new Date(Date.UTC(2026,0,1+day));return date.toISOString().slice(0,10);}
function careerAge(player){return Number(careerDate(player).slice(0,4))-2010;}
function prepareCareerLife(player){
 player.nationality??=({eng:'GB-ENG',eng2:'GB-ENG',esp:'ES',esp2:'ES',ita:'IT',ita2:'IT',ger:'DE',ger2:'DE',fra:'FR',fra2:'FR',bra:'BR',bra2:'BR'})[player.competition.leagueId]||'BR';
 if(!player.development){const attrs=Object.fromEntries(Object.keys(LIFE_SKILLS).map(id=>{const h=player.training?.[id]||[];return[id,id==='accuracy'?40:h.length?Math.round(h.reduce((a,b)=>a+b,0)/h.length):25];}));player.development={points:0,xp:0,level:1,attributes:attrs,lastRewardMatch:player.matches||0};}
 for(const key of Object.keys(LIFE_SKILLS))player.development.attributes[key]=lifeLimit(Number(player.development.attributes[key])||25,1,100);
 player.life??={version:1,birthDate:'2010-01-01',coach:20,team:40,press:Object.fromEntries(CAREER_JOURNALISTS.map(n=>[n,40])),health:100,injury:null,retired:false,news:[],decisions:{},offers:[],lastMatch:player.matches||0,appearances:0,minutes:0,assessmentDone:!!player.recruited};
 player.life.news??=[];player.life.decisions??={};player.life.offers??=[];player.life.appearances??=0;player.life.minutes??=0;
 if(!player.life.news.length)addCareerNews(player,'Bem-vindo à base','Aos 16 anos, '+player.name+' começa sua jornada. O treinador avaliará os fundamentos antes do primeiro contrato.','carreira');
}
function addCareerNews(player,title,body,category='clube',byline='Redação do jogo'){
 const item={id:(player.life.newsSerial=(player.life.newsSerial||0)+1),date:careerDate(player),title,body,category,byline,fictional:true};player.life.news.unshift(item);player.life.news=player.life.news.slice(0,100);return item;
}
function playerRole(player){if(player.life?.retired)return 'Aposentado';return player.life?.coach>=70?'Titular':player.life?.coach>=40?'Rotação':'Reserva';}
function careerOpportunity(player,total){return Math.max(1,Math.min(total,playerRole(player)==='Titular'?total:playerRole(player)==='Rotação'?Math.ceil(total*.65):Math.min(2,total)));}
function upgradeCareerSkill(player,id,blocked=false){
 const d=player.development;if(blocked||player.life.retired)return{ok:false,message:'Evolua entre partidas e treinos, durante a carreira ativa.'};if(!Object.hasOwn(LIFE_SKILLS,id))return{ok:false,message:'Atributo inválido.'};const cost=1+Math.floor(d.attributes[id]/25);if(d.points<cost)return{ok:false,message:'São necessários '+cost+' pontos.'};if(d.attributes[id]>=100)return{ok:false,message:'Atributo no máximo.'};d.points-=cost;d.attributes[id]=Math.min(100,d.attributes[id]+2);player.skill=d.attributes.shoot;return{ok:true,message:LIFE_SKILLS[id]+' aumentou para '+d.attributes[id]+'.'};
}
function assessTrainingStar(trial){if(['shoot','freekick'].includes(trial.kind))return trial.shot?.outcome==='goal';if(['vision','pass'].includes(trial.kind))return trial.shot?.outcome==='received';if(trial.kind==='speed')return trial.score>=60;return trial.gate===5&&trial.score>=60;}
function careerDecision(player,id,choice,blocked=false){
 const l=player.life,key=id+':'+player.matches;if(blocked||!player.recruited||l.retired)return{ok:false,message:'Ação disponível entre jogos da carreira.'};if(l.decisions[key])return{ok:false,message:'Essa conversa já aconteceu. Dispute a próxima partida.'};if(!['coach','team','press'].includes(id)||!['humble','bold'].includes(choice))return{ok:false,message:'Escolha uma resposta.'};l.decisions[key]=choice;
 if(id==='coach'){l.coach=lifeLimit(l.coach+(choice==='humble'?4:-3));l.team=lifeLimit(l.team+(choice==='humble'?1:-2));}
 if(id==='team'){l.team=lifeLimit(l.team+(choice==='humble'?5:-4));l.coach=lifeLimit(l.coach+(choice==='humble'?1:0));}
 if(id==='press'){for(const n of CAREER_JOURNALISTS)l.press[n]=lifeLimit(l.press[n]+(choice==='humble'?3:5));l.team=lifeLimit(l.team+(choice==='humble'?2:-3));addCareerNews(player,player.name+' fala após o jogo',choice==='humble'?'O jovem destacou o trabalho coletivo e agradeceu a confiança do treinador.':'O jovem prometeu disputar a titularidade; a declaração aumentou a atenção da imprensa.','entrevista',CAREER_JOURNALISTS[player.matches%2]+' · personagem simulado');}
 return{ok:true,message:'Conversa registrada. As relações foram atualizadas.'};
}
function applyCareerInjury(player,random=Math.random){
 const l=player.life;if(l.injury&&player.economy.calendarDay>=l.injury.until)recoverCareerDays(player);if(l.injury||l.retired)return;const age=careerAge(player),risk=.025+(player.intensity==='high'?.025:0)+(player.energy<30?.035:0)+(age>32?.025:0);if(random()>=risk)return;
 const severe=random()<.055,days=severe?180+Math.floor(random()*181):7+Math.floor(random()*22);l.injury={name:severe?'Lesão grave no joelho':'Lesão muscular',start:player.economy.calendarDay,until:player.economy.calendarDay+days,severe};l.health=lifeLimit(l.health-(severe?30:5));addCareerNews(player,player.name+' sofre '+l.injury.name.toLowerCase(),'O departamento médico prevê '+days+' dias de recuperação. O atleta está indisponível nesse período.','saúde');
 if(severe&&random()<(.015+(age>32?.10:0)+(l.health<50?.12:0))){retireCareerPlayer(player,'A lesão grave impediu o retorno seguro ao futebol.');addCareerNews(player,'Carreira encerrada por lesão',l.retirementReason,'carreira');}
}
function careerMatchRewards(player,performance,random=Math.random){
 const l=player.life,d=player.development;if(l.lastMatch>=player.matches)return null;l.lastMatch=player.matches;const minutes=performance.minutes??(playerRole(player)==='Titular'?90:playerRole(player)==='Rotação'?55:20);l.appearances++;l.minutes+=minutes;
 const rating=Math.min(10,5.5+performance.goals*.9+performance.assists*.6+(performance.won?.5:0));const xp=Math.round(40+minutes*.5+performance.goals*20+performance.assists*15+(performance.won?15:0));d.xp+=xp;const points=1+(rating>=8?1:0);d.points+=points;while(d.xp>=d.level*120){d.xp-=d.level*120;d.level++;d.points+=2;}d.lastRewardMatch=player.matches;
 l.coach=lifeLimit(l.coach+(rating>=7?6:rating>=6?3:-2));l.team=lifeLimit(l.team+(performance.assists?3:performance.won?2:-1));for(const name of CAREER_JOURNALISTS)l.press[name]=lifeLimit(l.press[name]+(rating>=8?3:rating<6?-1:1));
 l.lastPerformance={rating:Number(rating.toFixed(1)),xp,points,minutes,goals:performance.goals,assists:performance.assists};
 if(performance.goals>=2||performance.assists>=2||player.matches===1||rating>=8||performance.derby||performance.knockout)addCareerNews(player,player.matches===1?player.name+' faz sua estreia':performance.goals>=2?player.name+' decide com '+performance.goals+' gols':player.name+' é destaque da rodada',minutes+' minutos, '+performance.goals+' gols, '+performance.assists+' assistências e nota '+rating.toFixed(1)+'. '+playerRole(player)+' na avaliação do treinador.','partida',CAREER_JOURNALISTS[player.matches%2]+' · personagem simulado');
 applyCareerInjury(player,random);const age=careerAge(player),form=(player.economy.form||[]).reduce((n,m)=>n+m.goals,0);if(!l.retired&&age>=35&&random()<Math.min(.9,.035+(age-35)*.06+(l.health<50?.12:0)+(form===0?.04:0))){retireCareerPlayer(player,'Aposentadoria aos '+age+' anos, considerando idade, condição física e desempenho.');addCareerNews(player,'Fim de uma trajetória',l.retirementReason,'carreira');}
 return l.lastPerformance;
}
function careerAvailability(player){if(player.life?.retired)return player.life.retirementReason||'Carreira encerrada.';const injury=player.life?.injury;if(injury&&player.economy.calendarDay<injury.until)return injury.name+' · retorno em '+careerDate(player,injury.until);return null;}
function recoverCareerDays(player){const injury=player.life.injury;if(!injury||player.life.retired||player.economy.calendarDay<injury.until)return{ok:false,message:'Você não está em recuperação.'};player.life.injury=null;player.life.health=lifeLimit(player.life.health+10);player.energy=100;return{ok:true,message:'Recuperação concluída. O retorno respeitou o calendário médico.'};}
function precisionEndpoint(end,accuracy=100,random=Math.random){const error=(100-lifeLimit(accuracy))/100;return{x:end.x+(random()-.5)*40*error,y:end.y+(random()-.5)*24*error};}

function advanceIdleCareerDays(player,until){const economy=player.economy,weekly=economy.contract?.remaining>0?economy.contract.salary:0;while(economy.calendarDay<until){economy.calendarDay++;economy.accruedSalary+=weekly/7;if(economy.calendarDay%7===0){player.money+=Math.round(economy.accruedSalary);economy.accruedSalary=0;}}}

function retireCareerPlayer(player,reason){player.life.retired=true;player.life.retirementReason=reason;player.life.offers=[];if(player.economy?.contract)player.economy.contract.remaining=0;if(player.economy){player.money+=Math.round(player.economy.accruedSalary||0);player.economy.accruedSalary=0;}if(player.international){player.international.eligible=false;player.international.selectedFor=null;}}
