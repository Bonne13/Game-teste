'use strict';
const MATCH_MODES={shoot:'Chute',pass:'Passe',header:'Cabeceio',penalty:'Pênalti',freekick:'Falta',corner:'Escanteio',bicycle:'Bicicleta',volley:'Voleio'};
const AIR_WINDOWS={header:[.43,.65],volley:[.66,.86],bicycle:[.25,.42]};
const SHOT_STYLES={
 normal:{name:'Normal',ideal:.75,duration:.65,curve:1,arc:.65,reach:1,help:'Equilíbrio entre força e precisão. Referência: 75%.'},
 placed:{name:'Colocada',ideal:.65,duration:.8,curve:1.35,arc:.55,reach:.9,help:'Mais curva, menos velocidade. Referência: 65%; procure os cantos.'},
 driven:{name:'Potente',ideal:.9,duration:.48,curve:.65,arc:.35,reach:.8,help:'Bola rápida e baixa, com menos curva. Referência: 90%; depende da força do jogador.'},
 chip:{name:'Cavadinha',ideal:.55,duration:1.05,curve:.65,arc:2.2,reach:1.15,help:'Arco alto para superar o goleiro; viagem mais lenta. Referência: 55%.'}
};
class MatchSituation{
 constructor(mode='shoot',skills={}){this.skills=skills;this.shotStyle='normal';this.time=0;this.mode=mode;this.aim={x:325,y:120};this.origin={x:440,y:390};this.teammates=[{number:7,x:230,y:300,tx:230,ty:300},{number:10,x:440,y:235,tx:440,ty:235},{number:11,x:660,y:300,tx:660,ty:300}];this.defenders=[{x:355,y:280},{x:530,y:250}];this.flight=null;this.outcome=null;this.message='';this.crossFinish='header';this.setMode(mode);}
 get busy(){return !!this.flight||!!this.outcome;}
 get phase(){return this.time%2.4/2.4;}
 get keeper(){return 440+Math.sin(this.time*1.8)*105;}
 setMode(mode){if(this.busy||!MATCH_MODES[mode])return false;this.mode=mode;this.time=0;this.userAssisted=false;this.lastReceiver=null;this.origin=mode==='corner'?{x:40,y:50}:mode==='penalty'?{x:440,y:290}:{x:440,y:390};this.message=mode==='corner'?'Posicione um companheiro na área (parte superior do campo) e cruze para ele. Força ideal: 65%. Escolha a finalização aérea antes do cruzamento.':mode==='pass'?'Movimente um companheiro para abrir uma linha livre, mire nele e passe. Força ideal: 55%.':AIR_WINDOWS[mode]?'Mire no gol e solte quando o marcador entrar na faixa verde. Força ideal: 60%. Cada finalização aérea tem seu próprio tempo de contato.':mode==='freekick'?'Mire no gol e use a curva para contornar a barreira. Escolha o estilo de finalização.':mode==='penalty'?'Pênalti: mire longe do goleiro e escolha a finalização abaixo.':'Mire no gol, escolha a finalização e solte o arrasto para chutar.';return true;}
 order(number,point){if(this.busy)return false;const player=this.teammates.find(m=>m.number===number);if(!player)return false;player.tx=clamp(point.x,80,800);player.ty=clamp(point.y,195,430);return true;}
 setShotStyle(style){if(this.busy||!Object.hasOwn(SHOT_STYLES,style))return false;this.shotStyle=style;return true;}
 get shotProfile(){return ['shoot','penalty','freekick'].includes(this.mode)?SHOT_STYLES[this.shotStyle]:SHOT_STYLES.normal;}
 endpoint(power){const mode=this.mode,ideal=mode==='pass'?.55:mode==='corner'?.65:AIR_WINDOWS[mode]?.6:this.shotProfile.ideal;const skill=this.skills[mode==='freekick'?'freekick':mode==='pass'||mode==='corner'?'pass':'shoot']||0;return{x:this.aim.x,y:this.aim.y+(ideal-clamp(power,0,1))*220*(1-clamp(skill,0,100)/100*.35)};}
 strike(power=.75,curve=0){if(this.busy)return false;const mode=this.mode,end=this.endpoint(power);const window=AIR_WINDOWS[mode];const technique=(this.skills.technique||0)/100*.03;const timed=!window||(this.phase>=window[0]-technique&&this.phase<=window[1]+technique);this.flight={from:{...this.origin},end,curve:clamp(curve*this.shotProfile.curve,-1,1),arc:mode==='corner'?3:this.shotProfile.arc,style:['shoot','penalty','freekick'].includes(mode)?this.shotStyle:'normal',elapsed:0,duration:mode==='corner'?1.1:mode==='pass'?.85:AIR_WINDOWS[mode]?.65:this.shotProfile.duration,mode,power,timed,keeper:this.keeper};return true;}
 tick(dt){if(this.outcome)return;dt=clamp(dt,0,.05);this.time+=dt;const stamina=clamp(this.skills.stamina??100,0,100);const speed=(75+(this.skills.speed||0)*.7)*(.65+.35*stamina/100);for(const mate of this.teammates){const dx=mate.tx-mate.x,dy=mate.ty-mate.y,d=Math.hypot(dx,dy),step=Math.min(d,speed*dt);if(d){mate.x+=dx/d*step;mate.y+=dy/d*step;}}
 if(!this.flight)return;const f=this.flight;f.elapsed+=dt;if(f.elapsed<f.duration)return;
 if(f.mode==='pass'||f.mode==='corner'){const mate=[...this.teammates].sort((a,b)=>distance(a,f.end)-distance(b,f.end))[0];const intercepted=f.mode==='pass'&&pathBlocked(f.from,f.end,this.defenders,f.curve);const marked=f.mode==='corner'&&this.defenders.some(d=>distance(d,mate)<32);const inArea=f.mode!=='corner'||mate.y<=300;const radius=26+(this.skills.pass||0)*.25;
 if(intercepted||marked||distance(mate,f.end)>radius||!inArea){this.outcome={goal:false,message:intercepted?'Passe interceptado. Abra uma linha de passe.':marked?'O defensor ganhou o cruzamento. Desmarque seu companheiro.':'A bola não encontrou um companheiro na posição certa.'};}else{this.origin={x:mate.x,y:mate.y};this.userAssisted=true;this.lastReceiver=mate;this.mode=f.mode==='corner'?this.crossFinish:'shoot';this.time=0;this.message=f.mode==='corner'?'Cruzamento recebido! Força ideal: 60%. Mire no gol e acerte o tempo de '+MATCH_MODES[this.mode].toLowerCase()+'.':'Passe recebido! Escolha a finalização e chute para o gol.';this.flight=null;}return;}
 const wall=f.mode==='freekick'&&pathBlocked(f.from,f.end,[350,395,440,485,530].map(x=>({x,y:240})),f.curve);
 const onGoal=f.end.x>293&&f.end.x<587&&f.end.y>69&&f.end.y<184;
 const profile=SHOT_STYLES[f.style]||SHOT_STYLES.normal;
 const saved=Math.abs(f.end.x-f.keeper)<(f.mode==='penalty'?48:38)*profile.reach&&f.end.y>(f.style==='chip'?145:103);
 const woodwork=!onGoal&&f.end.y>=65&&f.end.y<=188&&(Math.abs(f.end.x-293)<5||Math.abs(f.end.x-587)<5||(f.end.x>288&&f.end.x<592&&Math.abs(f.end.y-69)<5));
 const blocked=!['penalty','freekick'].includes(f.mode)&&pathBlocked(f.from,f.end,this.defenders,f.curve);
 const goal=onGoal&&!saved&&!wall&&!blocked&&f.timed;
 this.outcome={goal,kind:!f.timed?'timing':wall?'wall':blocked?'block':woodwork?'post':!onGoal?'wide':saved?'save':'goal',scorerId:this.userAssisted?this.lastReceiver?.playerId:null,scorerName:this.userAssisted?this.lastReceiver?.name:null,userGoal:goal&&!this.userAssisted,userAssist:goal&&this.userAssisted,message:!f.timed?'Errou o tempo de contato da bola.':wall?'A cobrança ficou na barreira. Ajuste a curva.':blocked?'A defesa bloqueou a finalização.':woodwork?'Na trave! Ajuste um pouco a direção.':!onGoal?'Finalização para fora. Ajuste a força e a mira.':saved?'Defesa do goleiro! Busque o canto.':'GOOOL de '+MATCH_MODES[f.mode].toLowerCase()+'!'};
 }
}
