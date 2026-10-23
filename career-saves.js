'use strict';
const CareerSaves=(()=>{
 const KEY='proxima-carreiras-v1',LEGACY='proxima-estrela-v1',COUNT=6;let playingSlot=null,playingId=null;const identity=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
 const valid=player=>player&&typeof player==='object'&&['name','energy','skill','rep','money','matches','goals','wins','points'].every(k=>typeof player[k]===(k==='name'?'string':'number'));
 function read(){const raw=localStorage.getItem(KEY);if(raw){const bank=JSON.parse(raw);if(bank.version!==1||!Array.isArray(bank.slots)||bank.slots.length!==COUNT)throw Error('Não foi possível ler seus slots. Seus dados foram preservados.');return bank;}
  const bank={version:1,active:null,slots:Array(COUNT).fill(null)},old=localStorage.getItem(LEGACY);
  if(old){const player=JSON.parse(old);if(!valid(player))throw Error('O save anterior não pôde ser lido. Seus dados foram preservados.');bank.slots[0]={player,updatedAt:new Date().toISOString()};bank.active=0;localStorage.setItem(KEY,JSON.stringify(bank));}
  return bank;
 }
 function persist(player){const bank=read();if(!valid(player))throw Error('Dados de carreira inválidos.');const slot=playingSlot??bank.active,entry=bank.slots[slot];if(!entry||(playingSlot!==null&&entry.id!==playingId))throw Error('Esta carreira foi excluída ou substituída. Volte ao menu inicial.');bank.slots[slot]={...entry,player,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(bank));if(bank.active===slot)localStorage.setItem(LEGACY,JSON.stringify(player));}
 function remove(index){const bank=read();if(!Number.isInteger(index)||index<0||index>=COUNT)throw Error('Slot inválido.');bank.slots[index]=null;if(bank.active===index)bank.active=null;localStorage.setItem(KEY,JSON.stringify(bank));if(bank.active===null)localStorage.removeItem(LEGACY);}
 function activate(index,player){const bank=read();if(!Number.isInteger(index)||index<0||index>=COUNT)throw Error('Slot inválido.');if(bank.slots[index]&&player)throw Error('Este slot já tem uma carreira.');const selected=player||bank.slots[index]?.player;if(!valid(selected))throw Error('Carreira inválida.');
  // Commit the bank first; never erase the previous career if storage is full.
  bank.active=index;bank.slots[index]={id:bank.slots[index]?.id||identity(),player:selected,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(bank));localStorage.setItem(LEGACY,JSON.stringify(selected));return selected;
 }
 function create(profile){if(!NATIONALITIES.some(n=>n.id===profile.nationality)||!LEAGUES.some(l=>l.id===profile.startingLeague)||!PLAYER_POSITIONS.some(p=>p.id===profile.position))throw Error('Escolha nacionalidade, liga e posição válidas.');return{appearance:typeof normalizePlayerLook==='function'?normalizePlayerLook(profile.appearance):undefined,name:profile.name.trim().slice(0,24)||'Alex Silva',nationality:profile.nationality,position:profile.position,startingLeague:profile.startingLeague,birthDate:'2010-01-01',careerStart:'2026-01-01',energy:100,skill:45,rep:0,money:150,matches:0,goals:0,wins:0,points:0};}
 function bind(slot){if(!Number.isInteger(slot)||!valid(read().slots[slot]?.player))throw Error('Escolha uma carreira válida.');const bank=read();if(!bank.slots[slot].id){bank.slots[slot].id=identity();localStorage.setItem(KEY,JSON.stringify(bank));}playingSlot=slot;playingId=bank.slots[slot].id;}
 function current(){return playingSlot===null?null:read().slots[playingSlot]?.player;}
 return{read,persist,activate,create,bind,current,remove,COUNT};
})();
const CAREER_ACHIEVEMENTS=[
 {id:'training',name:'Primeiros fundamentos',description:'Conclua os seis fundamentos de treino.',earned:p=>['shoot','vision','pass','speed','technique','freekick'].every(k=>p.training?.[k]?.length)},
 {id:'contract',name:'O primeiro contrato',description:'Seja contratado por um clube.',earned:p=>p.recruited},
 {id:'debut',name:'Estreia profissional',description:'Complete uma partida.',earned:p=>p.matches>=1},
 {id:'goal',name:'Rede balançando',description:'Marque seu primeiro gol.',earned:p=>p.goals>=1},
 {id:'scorer',name:'Faro de gol',description:'Marque dez gols na carreira.',earned:p=>p.goals>=10},
 {id:'assist',name:'Visão de jogo',description:'Registre sua primeira assistência.',earned:p=>p.assists>=1},
 {id:'win',name:'Primeira vitória',description:'Vença uma partida.',earned:p=>p.wins>=1},
 {id:'award',name:'Entre os melhores',description:'Conquiste um prêmio individual de temporada.',earned:p=>p.awardHistory?.some(s=>s.awards?.some(a=>a.winner?.id==='user'))},
 {id:'ballon',name:'Melhor do mundo',description:'Conquiste a Bola de Ouro.',earned:p=>p.awardHistory?.some(s=>s.awards?.some(a=>a.id==='ballon'&&a.winner?.id==='user'))}
];
