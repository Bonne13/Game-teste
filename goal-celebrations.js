'use strict';
const GOAL_CELEBRATIONS=[{id:'airplane',name:'Aviãozinho'},{id:'slide',name:'Deslize de joelhos'},{id:'fist',name:'Soco no ar'},{id:'turn',name:'Salto com giro'},{id:'heart',name:'Coração para a torcida'},{id:'team',name:'Abraço da equipe'}];
class GoalCelebration{
 constructor(index,scorer,club,{reducedMotion=false}={}){this.variant=GOAL_CELEBRATIONS[((index%6)+6)%6];this.scorer=scorer;this.club=club;this.elapsed=0;this.duration=reducedMotion?2.2:4;this.reducedMotion=reducedMotion;}
 get done(){return this.elapsed>=this.duration;}
 get stage(){return this.elapsed<.65?'goal':'celebrate';}
 tick(dt){this.elapsed=Math.min(this.duration,this.elapsed+Math.max(0,Math.min(.1,dt)));}
 skip(){this.elapsed=this.duration;}
}
function setupGoalCelebrationUI(){const wrap=document.createElement('div');wrap.id='goalCelebration';wrap.className='goal-celebration';wrap.hidden=true;wrap.innerHTML='<div class="goal-word" aria-hidden="true">GOL!</div><strong id="goalScorer"></strong><span id="goalCelebrationName"></span><span id="goalCelebrationScore"></span><button id="skipCelebration" class="btn">Continuar →</button>';wrap.setAttribute('role','status');document.getElementById('pitch').parentElement.append(wrap);document.getElementById('skipCelebration').onclick=()=>celebration?.skip();}
