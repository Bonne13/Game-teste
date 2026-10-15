'use strict';
// Snapshots públicos e comunitários; consulte data/SOURCES.md e as notas de cobertura.
const LEAGUES = FOOTBALL_DATABASE.leagues;
function makeSchedule(teams){const ring=[...teams],first=[];for(let r=0;r<teams.length-1;r++){const games=[];for(let i=0;i<ring.length/2;i++){const pair=[ring[i],ring[ring.length-1-i]];games.push(r%2?pair.reverse():pair);}first.push(games);ring.splice(1,0,ring.pop());}return first.concat(first.map(games=>games.map(([a,b])=>[b,a])));}
function newCompetition(id,club,year=1){return{leagueId:id,club,year,round:0,results:[],playerMatches:[]};}
function standings(league,results){const rows=new Map(league.teams.map(club=>[club,{club,played:0,wins:0,draws:0,losses:0,gf:0,ga:0,points:0}]));for(const games of results)for(const g of games){const a=rows.get(g.host),b=rows.get(g.guest);a.played++;b.played++;a.gf+=g.hg;a.ga+=g.ag;b.gf+=g.ag;b.ga+=g.hg;if(g.hg>g.ag){a.wins++;b.losses++;a.points+=3;}else if(g.hg<g.ag){b.wins++;a.losses++;b.points+=3;}else{a.draws++;b.draws++;a.points++;b.points++;}}return [...rows.values()].sort((a,b)=>b.points-a.points||(b.gf-b.ga)-(a.gf-a.ga)||b.gf-a.gf||a.club.localeCompare(b.club));}
