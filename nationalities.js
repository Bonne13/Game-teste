'use strict';
// Union of UN members/observers and FIFA member associations, not an assertion of licensing.
// https://www.un.org/en/about-us/member-states
// https://www.un.org/en/about-us/non-member-states
// https://inside.fifa.com/associations
const UN_MEMBER_CODES=["AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BT", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "CF", "TD", "CL", "CN", "CO", "KM", "CG", "CD", "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET", "FJ", "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN", "GW", "GY", "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MR", "MU", "MX", "FM", "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NZ", "NI", "NE", "NG", "MK", "NO", "OM", "PK", "PW", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA", "RO", "RU", "RW", "KN", "LC", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA", "SS", "ES", "LK", "SD", "SR", "SE", "CH", "SY", "TJ", "TZ", "TH", "TL", "TG", "TO", "TT", "TN", "TR", "TM", "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VE", "VN", "YE", "ZM", "ZW"];
const FIFA_NON_UN={"GB-ENG": "Inglaterra", "GB-SCT": "Escócia", "GB-WLS": "País de Gales", "GB-NIR": "Irlanda do Norte", "FO": "Ilhas Faroe", "GI": "Gibraltar", "XK": "Kosovo", "TW": "Taipé Chinês", "PS": "Palestina", "HK": "Hong Kong", "MO": "Macau", "GU": "Guam", "AS": "Samoa Americana", "CK": "Ilhas Cook", "PF": "Taiti", "NC": "Nova Caledônia", "PR": "Porto Rico", "VI": "Ilhas Virgens Americanas", "VG": "Ilhas Virgens Britânicas", "AI": "Anguila", "BM": "Bermudas", "KY": "Ilhas Cayman", "TC": "Ilhas Turcas e Caicos", "MS": "Montserrat", "AW": "Aruba", "CW": "Curaçao"};
const NATIONALITIES=(()=>{
 const names=new Intl.DisplayNames(['pt-BR'],{type:'region'}),nonFifa=new Set(['GB','MC','MH','FM','NR','PW','TV','KI']);
 const rows=UN_MEMBER_CODES.map(id=>({id,name:names.of(id),un:'member',fifa:!nonFifa.has(id)}));
 rows.push({id:'VA',name:'Santa Sé (Vaticano)',un:'observer',fifa:false});
 for(const [id,name] of Object.entries(FIFA_NON_UN))rows.push({id,name,un:id==='PS'?'observer':null,fifa:true});
 return rows.sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
})();
const PLAYER_POSITIONS=[{id:'ATA',name:'Atacante',group:'FW',description:'Presença na área e finalização.'},{id:'PE',name:'Ponta esquerda',group:'FW',description:'Ataque pelo lado esquerdo.'},{id:'PD',name:'Ponta direita',group:'FW',description:'Ataque pelo lado direito.'},{id:'MEI',name:'Meia atacante',group:'MF',description:'Criação de jogadas atrás do ataque.'}];
