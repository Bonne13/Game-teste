'use strict';
const SHOP_CATEGORIES={recovery:'Recuperação',houses:'Casas',vehicles:'Veículos',furniture:'Mobílias',personal:'Itens pessoais',boots:'Chuteiras'};
const CAREER_SKILLS={shoot:'Chute',vision:'Visão',pass:'Passe',speed:'Velocidade',technique:'Técnica',freekick:'Tiro livre',accuracy:'Precisão'};
// Marcas, modelos, empresas e profissionais fictícios deste jogo.
const CAREER_CATALOG=[
 {id:'home-loft',category:'houses',name:'Loft Primeiro Passo',price:90000,icon:'🏠',slots:2,rest:4,prestige:1},
 {id:'home-terrace',category:'houses',name:'Apartamento Vista do Campo',price:240000,icon:'🏢',slots:4,rest:8,prestige:3},
 {id:'home-coast',category:'houses',name:'Casa Costa Serena',price:650000,icon:'🏡',slots:6,rest:12,prestige:5},
 {id:'home-estate',category:'houses',name:'Mansão Horizonte',price:1800000,icon:'🏰',slots:8,rest:16,prestige:8},
 {id:'vehicle-bike',category:'vehicles',name:'Vértice Urbana · bicicleta',price:1800,icon:'🚲',prestige:1},
 {id:'vehicle-hatch',category:'vehicles',name:'Rota Livre Uno · compacto',price:48000,icon:'🚗',prestige:3},
 {id:'vehicle-coupe',category:'vehicles',name:'Vértice GT · esportivo',price:220000,icon:'🏎',prestige:6},
 {id:'vehicle-electric',category:'vehicles',name:'Solaris E7 · elétrico',price:180000,icon:'🚙',prestige:8},
 {id:'furniture-bed',category:'furniture',name:'Cama Nuvem',price:1800,icon:'🛏',rest:5},
 {id:'furniture-sofa',category:'furniture',name:'Sofá Abraço',price:2500,icon:'🛋',rest:3},
 {id:'furniture-coffee',category:'furniture',name:'Cafeteira Bom Dia',price:650,icon:'☕',rest:2},
 {id:'furniture-bath',category:'furniture',name:'Banheira Sereno',price:12000,icon:'🛁',rest:8},
 {id:'personal-headset',category:'personal',name:'Fone Brisa Beat',price:180,icon:'🎧',prestige:1},
 {id:'personal-watch',category:'personal',name:'Relógio Prisma Tempo',price:900,icon:'⌚',prestige:2},
 {id:'personal-console',category:'personal',name:'Console Órbita Play',price:3500,icon:'🎮',prestige:3},
 {id:'personal-camera',category:'personal',name:'Câmera Nexo Frame',price:5000,icon:'📷',prestige:3},
 {id:'boots-velox',category:'boots',name:'Brisa Velox',price:350,icon:'👟',bonuses:{speed:8,technique:3}},
 {id:'boots-impact',category:'boots',name:'Aurora Impacto',price:850,icon:'👟',bonuses:{shoot:10,freekick:5}},
 {id:'boots-maestro',category:'boots',name:'Nexo Maestro',price:1300,icon:'👟',bonuses:{pass:10,vision:6}},
 {id:'boots-control',category:'boots',name:'Órbita Controle',price:1700,icon:'👟',bonuses:{technique:12,pass:6}},
 {id:'boots-legend',category:'boots',name:'Aurora Lenda',price:3500,icon:'👟',bonuses:{shoot:6,vision:6,pass:6,speed:6,technique:6,freekick:6}}
];
const CAREER_AGENTS=[
 {id:'marina',name:'Marina Duarte',agency:'Linha de Base',fee:500,commission:.05,salaryBonus:.05,sponsorBonus:.08,renewalBonus:.08},
 {id:'rafael',name:'Rafael Nóbrega',agency:'Ponte Sports',fee:2500,commission:.08,salaryBonus:.10,sponsorBonus:.16,renewalBonus:.16},
 {id:'helena',name:'Helena Prado',agency:'Órbita Elite',fee:10000,commission:.12,salaryBonus:.16,sponsorBonus:.25,renewalBonus:.25}
];
const CAREER_SPONSORS=[
 {id:'brisa',name:'Brisa Urbana',sector:'Moda e acessórios',minRep:0,pay:80,duration:4},
 {id:'vivavolt',name:'VivaVolt',sector:'Bebidas esportivas',minRep:5,pay:150,duration:5},
 {id:'aurora',name:'Aurora Sports',sector:'Material esportivo',minRep:15,pay:250,duration:6},
 {id:'nexo',name:'Nexo Mobile',sector:'Tecnologia e comunicação',minRep:25,pay:400,duration:6},
 {id:'rota',name:'Rota Livre Motors',sector:'Mobilidade',minRep:40,pay:700,duration:8},
 {id:'ambar',name:'Casa Âmbar',sector:'Casa e decoração',minRep:60,pay:1100,duration:8},
 {id:'prisma',name:'Prisma Bank',sector:'Serviços financeiros',minRep:90,pay:1600,duration:10},
 {id:'orbita',name:'Órbita Play',sector:'Entretenimento digital',minRep:130,pay:2500,duration:10}
];
