"""Gera snapshots locais de fatos públicos. Não executa código das fontes externas.
As fontes devem estar disponíveis nas pastas indicadas; veja data/SOURCES.md.
"""
import csv,json,re,unicodedata,hashlib,collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BASE=Path('/tmp/star-football-json')
def norm(s):return re.sub(r'[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
def clubkey(s):
 s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
 s=re.sub(r'\b(fc|afc|cf|sc|sv|ac|as|us|ssc|ss|rc|rcd|ud|cd|ca|cr|ec|se|fbc|fr|fbpa|sco|osc|calcio|clube|club|esporte|futebol|associacao|atletica|sociedade|de|do|da|the|1907|1909|1913|1901)\b','',s)
 return norm(s)
ALIASES={}
def aliases(text):
 for pair in text.split('|'):
  source,target=pair.split('=');ALIASES[source]=target
aliases('Arsenal FC=Arsenal|Aston Villa FC=Aston Villa|AFC Bournemouth=Bournemouth|Brentford FC=Brentford|Brighton & Hove Albion FC=Brighton|Chelsea FC=Chelsea|Crystal Palace FC=Crystal Palace|Everton FC=Everton|Fulham FC=Fulham|Leeds United FC=Leeds United|Liverpool FC=Liverpool|Manchester City FC=Manchester City|Manchester United FC=Manchester United|Newcastle United FC=Newcastle United|Nottingham Forest FC=Nottingham Forest|Sunderland AFC=Sunderland|Tottenham Hotspur FC=Tottenham|Coventry City FC=Coventry City|Hull City AFC=Hull City|Ipswich Town FC=Ipswich Town|West Ham United FC=West Ham|Wolverhampton Wanderers FC=Wolverhampton')
aliases('Birmingham City FC=Birmingham City|Blackburn Rovers FC=Blackburn Rovers|Bolton Wanderers FC=Bolton Wanderers|Bristol City FC=Bristol City|Burnley FC=Burnley|Cardiff City FC=Cardiff City|Charlton Athletic FC=Charlton Athletic|Derby County FC=Derby County|Lincoln City FC=Lincoln City|Middlesbrough FC=Middlesbrough|Millwall FC=Millwall|Norwich City FC=Norwich City|Portsmouth FC=Portsmouth|Preston North End FC=Preston North End|Queens Park Rangers FC=Queens Park Rangers|Sheffield United FC=Sheffield United|Southampton FC=Southampton|Stoke City FC=Stoke City|Swansea City AFC=Swansea City|Watford FC=Watford|West Bromwich Albion FC=West Bromwich Albion|Wrexham AFC=Wrexham')
aliases('CA Osasuna=Osasuna|Club Atlético de Madrid=Atlético de Madrid|Deportivo Alavés=Alavés|Elche CF=Elche|FC Barcelona=Barcelona|Getafe CF=Getafe|Levante UD=Levante|Málaga CF=Málaga|RC Celta de Vigo=Celta de Vigo|RC Deportivo La Coruña=Deportivo La Coruña|RCD Espanyol de Barcelona=Espanyol|Rayo Vallecano de Madrid=Rayo Vallecano|Real Betis Balompié=Real Betis|Real Madrid CF=Real Madrid|Real Racing Club de Santander=Racing Santander|Real Sociedad de Fútbol=Real Sociedad|Sevilla FC=Sevilla|Valencia CF=Valencia|Villarreal CF=Villarreal')
aliases('1. FC Köln=Köln|1. FC Union Berlin=Union Berlin|1. FSV Mainz 05=Mainz|Bayer 04 Leverkusen=Leverkusen|FC Augsburg=Augsburg|FC Bayern München=Bayern München|FC Schalke 04=Schalke 04|RB Leipzig=Leipzig|SC Freiburg=Freiburg|SC Paderborn 07=Paderborn|SV 07 Elversberg=Elversberg|SV Werder Bremen=Werder Bremen|TSG 1899 Hoffenheim=Hoffenheim|VfB Stuttgart=Stuttgart|1. FC Heidenheim 1846=Heidenheim|1. FC Kaiserslautern=Kaiserslautern|1. FC Magdeburg=Magdeburg|1. FC Nürnberg=Nürnberg|DSC Arminia Bielefeld=Arminia Bielefeld|Eintracht Braunschweig=Braunschweig|FC St. Pauli=St. Pauli|Hannover 96=Hannover|Hertha BSC=Hertha Berlin|SV Darmstadt 98=Darmstadt|SpVgg Greuther Fürth=Greuther Fürth|VfL Bochum=Bochum|VfL Osnabrück=Osnabrück|VfL Wolfsburg=Wolfsburg')
aliases('AJ Auxerre=Auxerre|AS Monaco FC=Monaco|Angers SCO=Angers|ES Troyes AC=Troyes|FC Lorient=Lorient|Le Havre AC=Le Havre|Le Mans FC=Le Mans|Lille OSC=Lille|OGC Nice=Nice|Olympique Lyonnais=Lyon|Olympique de Marseille=Marseille|Paris FC=Paris FC|Paris Saint-Germain FC=Paris Saint-Germain|RC Strasbourg Alsace=Strasbourg|Racing Club de Lens=Lens|Stade Brestois 29=Brest|Stade Rennais FC 1901=Rennes|Toulouse FC=Toulouse')
aliases('AC Milan=Milan|AC Monza=Monza|ACF Fiorentina=Fiorentina|AS Roma=Roma|Atalanta BC=Atalanta|Bologna FC 1909=Bologna|Cagliari Calcio=Cagliari|Como 1907=Como|FC Internazionale Milano=Inter|Frosinone Calcio=Frosinone|Genoa CFC=Genoa|Juventus FC=Juventus|Parma Calcio 1913=Parma|SS Lazio=Lazio|SSC Napoli=Napoli|Torino FC=Torino|US Lecce=Lecce|US Sassuolo Calcio=Sassuolo|Udinese Calcio=Udinese|Venezia FC=Venezia')
aliases('Botafogo FR=Botafogo|CA Mineiro=Atlético-MG|CA Paranaense=Athletico-PR|CR Flamengo=Flamengo|CR Vasco da Gama=Vasco|Chapecoense AF=Chapecoense|Clube do Remo=Remo|Coritiba FBC=Coritiba|Cruzeiro EC=Cruzeiro|EC Bahia=Bahia|EC Vitória=Vitória|Fluminense FC=Fluminense|Grêmio FBPA=Grêmio|Mirassol FC=Mirassol|RB Bragantino=Bragantino|SC Corinthians Paulista=Corinthians|SC Internacional=Internacional|SE Palmeiras=Palmeiras|Santos FC=Santos|São Paulo FC=São Paulo')
aliases('Spurs=Tottenham|Man Utd=Manchester United|Nott\'m Forest=Nottingham Forest|Newcastle Utd=Newcastle United|Ipswich=Ipswich Town|Wolves=Wolverhampton|Bolton=Bolton Wanderers|Charlton Ath=Charlton Athletic|Norwich=Norwich City|Preston=Preston North End|QPR=Queens Park Rangers|Sheffield Utd=Sheffield United|West Brom=West Bromwich Albion|Brighton=Brighton|M\'gladbach=Borussia Mönchengladbach|Frankfurt=Eintracht Frankfurt|FC Schalke 04=Schalke 04|TSG Hoffenheim=Hoffenheim|SV Elversberg=Elversberg|VfL Bochum 1848=Bochum|Düsseldorf=Fortuna Düsseldorf|Fürth=Greuther Fürth|D. Alavés=Alavés|RC Celta=Celta de Vigo|RC Deportivo=Deportivo La Coruña|R. Racing Club=Racing Santander|RCD Espanyol=Espanyol|CD Leganés=Leganés|R. Sporting=Sporting Gijón|R. Valladolid CF=Valladolid|UD Almería=Almería|UD Las Palmas=Las Palmas|CD Castellón=Castellón|CD Eldense=Eldense|CD Tenerife=Tenerife|CE Sabadell FC=Sabadell|FC Andorra=Andorra|Albacete BP=Albacete|SD Eibar=Eibar|RCD Mallorca=Mallorca|R. Oviedo=Real Oviedo|Paris SG=Paris Saint-Germain|OL=Lyon|OM=Marseille|RC Lens=Lens|LOSC Lille=Lille|Havre AC=Le Havre|ESTAC Troyes=Troyes|Stade Rennais FC=Rennes|Bergamo Calcio=Atalanta|Lombardia FC=Inter|Milano FC=Milan|Latium=Lazio|SS Juve Stabia=Juve Stabia|Chiavari=Virtus Entella|L. R. Vicenza=Vicenza|FCSM=Sochaux|FC Sochaux-Montbéliard=Sochaux|Clermont Foot 63=Clermont|Laval MFC=Laval|En Avant Guingamp=Guingamp|FC Annecy=Annecy|Grenoble Foot 38=Grenoble|Pau FC=Pau|Rodez AF=Rodez|Red Star FC=Red Star|AS Saint-Étienne=Saint-Étienne|AS Nancy Lorraine=Nancy|USL Dunkerque=Dunkerque|Stade de Reims=Reims|FC Metz=Metz|FC Nantes=Nantes|Dijon Football Côte d’Or=Dijon|Atlético Mineiro=Atlético-MG|Red Bull Bragantino=Bragantino|Vasco da Gama=Vasco|Athletico Paranaense=Athletico-PR|Operário Ferroviário Esporte Clube (PR)=Operário-PR|Athletic Club (MG)=Athletic-MG|América Futebol Clube (MG)=América-MG|Botafogo Futebol Clube (SP)=Botafogo-SP')
aliases('Dijon FCO=Dijon|EA Guingamp=Guingamp|Montpellier HSC=Montpellier|Stade Lavallois MFC=Laval|Stade Lavallois=Laval|Mantova 1911=Mantova|Albacete Balompié=Albacete|AD Ceuta FC=Ceuta|1.FC Nuremberg=Nürnberg|1. FC Nuremberg=Nürnberg')
def canon(name):return ALIASES.get(name,name)
leagues=[]
def add(id,name,country,tier,teams,source,verified=True):leagues.append(dict(id=id,name=name,country=country,tier=tier,season='2026' if country=='Brasil' else '2026/27',teams=sorted(teams),source=source,membershipVerified=verified))
for id,name,country,file in [('eng','Premier League','Inglaterra','2026-27/en.1.json'),('eng2','Championship','Inglaterra','2026-27/en.2.json'),('esp','La Liga','Espanha','2026-27/es.1.json'),('ita','Serie A','Itália','2026-27/it.1.json'),('ger','Bundesliga','Alemanha','2026-27/de.1.json'),('fra','Ligue 1','França','2026-27/fr.1.json'),('bra','Brasileirão Série A','Brasil','2026/br.1.json')]:
 matches=json.load(open(BASE/file))['matches'];teams={canon(m[key]) for m in matches for key in ['team1','team2']};add(id,name,country,2 if id.endswith('2') else 1,teams,'openfootball/football.json')
teams=set()
for line in Path('/tmp/star-league-deutschland/openliga/2026-27_de.2.txt').read_text().splitlines():
 if ' v ' in line:
  line=re.sub(r'^\s*(?:\d{1,2}:\d{2}\s+)?','',line);a,b=line.split(' v ',1);b=re.split(r'\s{2,}',b.strip())[0];teams.update([canon(a.strip()),canon(b)])
add('ger2','2. Bundesliga','Alemanha',2,teams,'openfootball/deutschland (OpenLigaDB)')
add('bra2','Brasileirão Série B','Brasil',2,'América-MG|Athletic-MG|Atlético-GO|Avaí|Botafogo-SP|CRB|Ceará|Criciúma|Cuiabá|Fortaleza|Goiás|Juventude|Londrina|Náutico|Novorizontino|Operário-PR|Ponte Preta|São Bernardo|Sport|Vila Nova'.split('|'),'cadastro comunitário 2026')
# Cadastros auxiliares de acesso: nomes reais, composição comunitária não verificada.
add('esp2','La Liga 2','Espanha',2,'Albacete|Almería|Andorra|Burgos|Cádiz|Castellón|Ceuta|Córdoba|Eibar|Granada|Las Palmas|Leganés|Real Sociedad B|Valladolid|Sporting Gijón|Girona|Mallorca|Real Oviedo|Celta Fortuna|Tenerife|Eldense|Sabadell'.split('|'),'base comunitária de acesso; composição pendente de verificação',False)
add('ita2','Serie B','Itália',2,'Avellino|Padova|Benevento|Arezzo|Ascoli|Vicenza|Sampdoria|Empoli|Palermo|Modena|Cesena|Carrarese|Juve Stabia|Südtirol|Mantova|Catanzaro|Virtus Entella|Hellas Verona|Pisa|Cremonese'.split('|'),'base comunitária de acesso; composição pendente de verificação',False)
add('fra2','Ligue 2','França',2,'Saint-Étienne|Reims|Montpellier|Clermont|Guingamp|Grenoble|Dunkerque|Rodez|Pau|Laval|Annecy|Bastia|Nancy|Red Star|Metz|Nantes|Sochaux|Dijon'.split('|'),'base comunitária de acesso; composição pendente de verificação',False)
order=['eng','eng2','esp','esp2','ita','ita2','ger','ger2','fra','fra2','bra','bra2'];leagues.sort(key=lambda l:order.index(l['id']))
clubs={club:l for l in leagues for club in l['teams']}
assert len(clubs)==sum(len(l['teams']) for l in leagues),'duplicated club'
lookup={clubkey(name):club for name,club in [(club,club) for club in clubs]+[(raw,canonical) for raw,canonical in ALIASES.items() if canonical in clubs]}
def findclub(name):return canon(name) if canon(name) in clubs else lookup.get(clubkey(name))
profiles=list(csv.DictReader(open('/tmp/star-football-datasets/datalake/transfermarkt/player_profiles/player_profiles.csv')))
profileNames={norm(re.sub(r' \(\d+\)$','',p['player_name'])) for p in profiles}
fc=list(csv.DictReader(open('/tmp/star-fc27/fc27-players-2026-10-11.csv',encoding='utf-8-sig')))
stats=list(csv.DictReader(open('/tmp/star-players2627/data/players_data_light-2026_2027.csv')))
fbNames={norm(r['Player']) for r in stats}
rosters={club:[] for club in clubs};used=set();fcNames={}
def pos(value):
 value=value.upper()
 return 'GK' if 'GOALKEEP' in value or value=='GK' else 'DF' if any(x in value for x in ['DEFENDER','BACK']) or value in ['CB','LB','RB','LWB','RWB','DF'] else 'MF' if 'MIDFIELD' in value or value in ['CM','CDM','CAM','LM','RM','MF'] else 'FW'
def rating(value,default=66):
 try:return max(25,min(99,round(float(value))))
 except:return default
def put(club,name,position,overall,source,attrs=None):
 name=name.strip();key=norm(name)
 if len(name)<2 or not any(c.isalpha() for c in name) or name.lower() in ['unknown','n/a','n.a.']:return False
 if key in used or not club:return False
 used.add(key);rosters[club].append(dict(id='p-'+hashlib.sha1(key.encode()).hexdigest()[:12],name=name,position=position,overall=overall,source=source,attributes=attrs or {}));return True
for r in fc:
 name=r['common_name'] or (r['first_name']+' '+r['last_name']).strip()
 keys=[norm(name),norm((r['first_name']+' '+r['last_name']).strip())]
 if not any(k in profileNames or k in fbNames for k in keys):continue
 for k in keys:fcNames[k]=r
# FBref snapshot is prioritized for current associations in top European leagues.
for r in stats:
 club=findclub(r['Squad'])
 if not club:continue
 name=r['Player'];source=fcNames.get(norm(name));ovr=rating(source['rating']) if source else 65
 attrs={}
 if source:
  attrs={key:rating(source[col],ovr) for key,col in [('shoot','finishing'),('vision','vision'),('pass','short_passing'),('speed','sprint_speed'),('technique','dribbling'),('freekick','free_kick_accuracy')]}
 put(club,name,pos(r['Pos'].split(',')[0]),ovr,'FBref 2026/27; rating público FC27 ou estimativa 65',attrs)
for key,r in fcNames.items():
 name=r['common_name'] or (r['first_name']+' '+r['last_name']).strip();club=findclub(r['club_name'])
 if not club:continue
 attrs={k:rating(r[col],rating(r['rating'])) for k,col in [('shoot','finishing'),('vision','vision'),('pass','short_passing'),('speed','sprint_speed'),('technique','dribbling'),('freekick','free_kick_accuracy')]}
 put(club,name,pos(r['position']),rating(r['rating']),'FC27 comunitário 2026-10-11',attrs)
# Brasil A: snapshot nominal público de 2026, sem fotos e sem copiar código do simulador.
for team in json.load(open('/tmp/star-brasim26/players.json')):
 club=findclub(team['name'])
 if not club:continue
 for r in team['squad']:
  seed=int(hashlib.sha1((club+r['n']).encode()).hexdigest()[:8],16);ovr=rating((team['def'] if r['p'] in ['GK','DF'] else team['att'])+(seed%9)-5)
  put(club,r['n'],r['p'],ovr,'BRASIM26 snapshot 2026-06; associação aproximada, rating próprio')
# Completar apenas com nomes reais do cadastro histórico, explicitamente identificados.
for r in profiles:
 club={'64918':'Athletic-MG','15172':'Atlético-GO','9030':'Botafogo-SP','11449':'CRB','2029':'Ceará','28022':'Cuiabá','1693':'Londrina','37474':'Novorizontino','2646':'Náutico','8718':'Sport','5677':'Vila Nova'}.get(r['current_club_id']) or findclub(r['current_club_name'])
 if not club:continue
 name=re.sub(r' \(\d+\)$','',r['player_name']);name=name.strip();key=norm(name)
 if len(name)<2 or not any(c.isalpha() for c in name) or name.lower() in ['unknown','n/a','n.a.']:continue
 if key in used:continue
 ovr=64 if clubs[club]['tier']==2 else 70
 put(club,name,pos(r['position']),ovr,'Transfermarkt snapshot 2025; vínculo 2026 não confirmado')
for club,players in rosters.items():players.sort(key=lambda p:(['GK','DF','MF','FW'].index(p['position']),-p['overall'],p['name']))
meta={'targetEurope':'2026/27','targetBrazil':'2026','snapshot':'2026-10-11','notice':'Base nominal comunitária: nomes reais; associações e ratings podem estar incompletos. Jogadores com fonte histórica não têm vínculo 2026 confirmado. Esp2/Ita2/Fra2: composição de acesso não verificada. Resultados da carreira são simulados.','clubs':len(clubs),'players':sum(map(len,rosters.values())),'historicalPlayers':sum('2025' in p['source'] for rs in rosters.values() for p in rs)}
data={'meta':meta,'leagues':leagues,'rosters':rosters}
(ROOT/'club-database.js').write_text("'use strict';\nconst FOOTBALL_DATABASE="+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'data/coverage.json').write_text(json.dumps({'meta':meta,'clubs':[{"club":club,"league":clubs[club]['id'],"players":len(rs),"sources":dict(collections.Counter(p['source'] for p in rs))} for club,rs in rosters.items()]},ensure_ascii=False,indent=2))
print(json.dumps(meta,ensure_ascii=False));print('empty clubs',[club for club,rs in rosters.items() if not rs]);print('under eleven',[(club,len(rs)) for club,rs in rosters.items() if len(rs)<11])
