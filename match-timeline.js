'use strict';
class MatchTimeline{
 constructor(total,random=Math.random){this.total=total;this.half=1;this.elapsed=0;this.phase='firstHalf';this.waiting=false;this.completed=0;this.stoppage=[1+Math.floor(random()*4),2+Math.floor(random()*5)];this.events=[];const counts=[Math.ceil(total/2),Math.floor(total/2)];for(let half=1;half<=2;half++){const duration=45+this.stoppage[half-1],count=counts[half-1];for(let i=0;i<count;i++)this.events.push({half,minute:Math.min(duration-.5,Math.max(1,(i+.3+random()*.4)*duration/count))});}}
 get duration(){return 90+this.stoppage[0]+this.stoppage[1];}
 get elapsedTotal(){return(this.half===2?45+this.stoppage[0]:0)+this.elapsed;}
 get label(){const minute=Math.floor(this.elapsed),base=this.half===1?0:45;return minute>45?(base+45)+'+'+(minute-45)+'′':(base+minute)+'′';}
 tick(dt){if(this.waiting||this.phase==='halftime'||this.phase==='finished')return;const end=45+this.stoppage[this.half-1],event=this.events[this.completed];const next=event&&event.half===this.half?event.minute:end;this.elapsed=Math.min(next,this.elapsed+Math.max(0,Math.min(.05,dt))*12);if(this.elapsed>=next){if(event&&event.half===this.half)this.waiting=true;else this.phase=this.half===1?'halftime':'finished';}}
 completeChance(){if(!this.waiting)return false;this.waiting=false;this.completed++;return true;}
 resume(){if(this.phase!=='halftime')return false;this.half=2;this.elapsed=0;this.phase='secondHalf';return true;}
}
