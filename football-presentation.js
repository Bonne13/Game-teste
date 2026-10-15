'use strict';
const FOOTBALL_VISUAL_DEFAULTS={camera:'close',quality:'medium',light:'day',guide:true};
function readFootballVisuals(){try{return{...FOOTBALL_VISUAL_DEFAULTS,...JSON.parse(localStorage.getItem('proxima-estrela-visuals')||'{}')};}catch{return{...FOOTBALL_VISUAL_DEFAULTS};}}
class FootballPresentation{
 constructor(view){
  this.view=view;this.scene=view.scene;this.settings=readFootballVisuals();this.look=new THREE.Vector3(0,.8,1.5);this.lastTime=performance.now();
  this.buildPitch();this.buildStadium();this.apply(this.settings);
 }
 material(color,extra={}){return new THREE.MeshStandardMaterial({color,roughness:.85,...extra});}
 box(w,h,d,x,y,z,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);mesh.position.set(x,y,z);mesh.receiveShadow=true;this.scene.add(mesh);return mesh;}
 buildPitch(){
  // A deterministic grass texture is generated locally; no image downloads.
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,256,256);
  for(let i=0;i<6500;i++){const x=(i*73)%256,y=(i*137+Math.floor(i/256)*19)%256;ctx.fillStyle=i%3?'#b7c5ad':'#d6dfc7';ctx.fillRect(x,y,1,2);}
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(16,22);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(4,this.view.renderer.capabilities.getMaxAnisotropy());
  this.box(38,.15,39,0,-.14,8,this.material('#263d36'));
  for(let i=0;i<18;i++){const grass=this.material(i%2?'#3d9658':'#34874e',{map:texture});const stripe=new THREE.Mesh(new THREE.PlaneGeometry(25,1.4),grass);stripe.rotation.x=-Math.PI/2;stripe.position.set(0,.002,-1.4+i*1.4);stripe.receiveShadow=true;this.scene.add(stripe);}
  const points=[],line=(a,b)=>points.push(...a,...b),segment=(x,z,a,b)=>line([x,.025,z],[a,.025,b]);
  for(const p of [[-11,0,11,0],[-11,0,-11,22],[11,0,11,22],[-11,22,11,22],[-7,0,-7,5.5],[-7,5.5,7,5.5],[7,5.5,7,0],[-4,0,-4,2],[-4,2,4,2],[4,2,4,0],[-11,17,11,17]])segment(...p);
  for(let a=0;a<Math.PI;a+=.06)segment(Math.cos(a)*3,5.5+Math.sin(a)*3,Math.cos(a+.06)*3,5.5+Math.sin(a+.06)*3);
  for(let a=0;a<Math.PI*2;a+=.06)segment(Math.cos(a)*2.7,17+Math.sin(a)*2.7,Math.cos(a+.06)*2.7,17+Math.sin(a+.06)*2.7);
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));this.scene.add(new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:'#eff5df',transparent:true,opacity:.9})));
  for(const z of [3.6,17]){const dot=new THREE.Mesh(new THREE.CircleGeometry(.075,12),new THREE.MeshBasicMaterial({color:'#eff5df'}));dot.rotation.x=-Math.PI/2;dot.position.set(0,.03,z);this.scene.add(dot);}
  for(const x of [-11,11]){this.box(.035,1.1,.035,x,.55,.02,this.material('#e4eed8'));const flag=new THREE.Mesh(new THREE.PlaneGeometry(.4,.25),new THREE.MeshStandardMaterial({color:'#ffcf54',side:THREE.DoubleSide}));flag.position.set(x+.18,.96,.02);this.scene.add(flag);}
 }
 sign(text,w,h,x,y,z,rotation=0){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const c=canvas.getContext('2d');c.fillStyle='#142e32';c.fillRect(0,0,1024,128);c.fillStyle='#d3fa6a';c.font='bold 56px sans-serif';c.textAlign='center';c.fillText(text,512,84);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sign=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));sign.position.set(x,y,z);sign.rotation.y=rotation;this.scene.add(sign);}
 buildStadium(){
  const concrete=this.material('#536472'),roof=this.material('#203743',{metalness:.2}),trim=this.material('#bdcbd0');
  for(let tier=0;tier<4;tier++){const y=.6+tier*.65,z=-3.8-tier*1.1;this.box(33,.6,1.5,0,y,z,concrete);for(const side of [-1,1])this.box(1.5,.6,31,side*(13.4+tier*.9),y,10,concrete);}
  this.box(36,.2,5.8,0,4.9,-6.2,roof);for(const side of [-1,1]){this.box(5,.2,32,side*15,4.9,10,roof);for(const z of [-3,6,15,23])this.box(.12,5,.12,side*17.2,2.5,z,trim);}
  this.sign('PRÓXIMA ESTRELA  /  O SEU FUTEBOL',25,.72,0,.65,-2.4);for(const side of [-1,1])this.sign('TREINE • EVOLUA • CONQUISTE',23,.65,side*12,.5,9,side>0?-Math.PI/2:Math.PI/2);
  this.crowds=[];const matrix=new THREE.Matrix4();
  for(let color=0;color<4;color++){const crowd=new THREE.InstancedMesh(new THREE.BoxGeometry(.24,.4,.22),this.material(['#e6ece1','#5e9eae','#d9ac63','#a45060'][color]),180);for(let j=0;j<180;j++){const i=j*4+color,row=Math.floor(i/60),column=i%60;let x,y,z;if(row<4){x=-15+column*.5;y=1.05+row*.65;z=-3.6-row*1.1;}else{const side=row<8?-1:1,r=(row-4)%4;x=side*(13.4+r*.9);y=1.05+r*.65;z=-2+column*.42;}matrix.makeTranslation(x,y,z);crowd.setMatrixAt(j,matrix);}this.scene.add(crowd);this.crowds.push(crowd);}
  const lampMat=new THREE.MeshBasicMaterial({color:'#f8efd2'});for(const x of [-13,13])for(const z of [-3,20]){this.box(.12,9,.12,x,4.5,z,trim);this.box(2,.55,.3,x,8.7,z,lampMat);}
 }
 apply(settings){
  this.settings={...FOOTBALL_VISUAL_DEFAULTS,...settings};const {renderer,scene}=this.view,quality=['low','medium','high'].includes(this.settings.quality)?this.settings.quality:'medium';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,quality==='high'?1.75:quality==='low'?.85:1.25));renderer.shadowMap.enabled=quality!=='low';renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=this.settings.light==='night'?1.1:1.25;
  this.crowds.forEach(c=>c.visible=quality!=='low');const sun=scene.children.find(o=>o.isDirectionalLight),ambient=scene.children.find(o=>o.isHemisphereLight);
  const night=this.settings.light==='night',sunset=this.settings.light==='sunset',sky=night?'#152b48':sunset?'#dbad89':'#a7cfde';scene.background.set(sky);scene.fog.color.set(sky);sun.color.set(sunset?'#ffd0a0':night?'#e7efff':'#fff6df');sun.intensity=night?2:2.6;sun.position.set(sunset?-15:-10,sunset?9:18,8);ambient.intensity=night?1.2:1.8;this.view.resize?.();
 }
 makeActor(color,label){
  const body=new THREE.Group(),shirt=this.material(color),skin=this.material('#d6a17b'),shorts=this.material('#17272e'),socks=this.material('#e5ede3'),boot=this.material('#24333a');
  const mesh=(geometry,mat,parent,x,y,z)=>{const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
  mesh(new THREE.CylinderGeometry(.2,.16,.56,10),shirt,body,0,1.1,0);mesh(new THREE.SphereGeometry(.16,12,10),skin,body,0,1.58,0);mesh(new THREE.SphereGeometry(.163,12,8,0,Math.PI*2,0,1.45),this.material('#30241f'),body,0,1.6,-.01);
  const limbs=[];for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.105,.86,0);mesh(new THREE.CylinderGeometry(.085,.07,.35,8),shorts,leg,0,-.16,0);mesh(new THREE.CylinderGeometry(.06,.05,.33,8),socks,leg,0,-.49,0);mesh(new THREE.BoxGeometry(.14,.1,.27),boot,leg,0,-.68,.05);body.add(leg);limbs.push(leg);}
  for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.23,1.3,0);mesh(new THREE.CylinderGeometry(.06,.05,.48,8),skin,arm,0,-.22,0);mesh(new THREE.SphereGeometry(.065,8,6),skin,arm,0,-.47,0);arm.rotation.z=side*.15;body.add(arm);limbs.push(arm);}
  body.userData={shirt,limbs,label:this.view.label(label),lastPoint:null};body.add(body.userData.label);return body;
 }
 animateActor(actor,point){const data=actor.userData,previous=data.lastPoint,moving=previous?Math.hypot(point.x-previous.x,point.y-previous.y):0,time=performance.now()/1000;
  if(moving>.02){actor.rotation.y=Math.atan2(point.x-previous.x,-(point.y-previous.y));data.walkUntil=time+.15;}else actor.rotation.y=0;
  const walk=time<(data.walkUntil||0),swing=walk?Math.sin(time*11)*.65:Math.sin(time*1.8)*.025;data.limbs.forEach((limb,i)=>limb.rotation.x=swing*(i%2?1:-1));data.lastPoint={x:point.x,y:point.y};
 }
 update(origin,flight,mode,outcome){
  const now=performance.now(),dt=Math.min(.1,(now-this.lastTime)/1000);this.lastTime=now;const v=this.view,setting=this.settings.camera;
  const ball=origin?v.point(origin):new THREE.Vector3(0,.2,8),wide=setting==='wide',broadcast=setting==='broadcast';let position=new THREE.Vector3(wide?0:broadcast?11:ball.x*.24,wide?13:broadcast?11:7.4,wide?20:broadcast?15:Math.max(12,ball.z+9));
  let target=new THREE.Vector3(ball.x*.12,.9,Math.max(1,ball.z*.22));if(flight){target.lerp(v.ball.position,.18);position.x+=v.ball.position.x*.12;}
  const smooth=1-Math.exp(-dt*5);if(!this.cameraReady){v.camera.position.copy(position);this.look.copy(target);this.cameraReady=true;}else{v.camera.position.lerp(position,smooth);this.look.lerp(target,smooth);}v.camera.lookAt(this.look);v.camera.updateMatrixWorld();
  if(!this.settings.guide)v.aimLine.visible=false;
  if(v.net){if(outcome?.goal&&this.goalOutcome!==outcome){this.goalOutcome=outcome;this.goalAt=now;}const age=(now-(this.goalAt||0))/1000,pulse=outcome?.goal&&age<1?Math.sin(age*18)*Math.exp(-age*4)*.22:0,vertices=v.net.geometry.attributes.position;for(let i=0;i<vertices.count;i++){const z=v.netBase[i*3+2];vertices.array[i*3+2]=z+pulse*(z<-.1?1:.1);}vertices.needsUpdate=true;}

 }
 animateStrike(actor,flight){if(!flight)return;const u=Math.min(1,flight.elapsed/.35);actor.userData.limbs[1].rotation.x=-Math.sin(u*Math.PI)*1.3;actor.userData.limbs[2].rotation.x=Math.sin(u*Math.PI)*.5;}
 animateKeeper(actor,flight){if(!flight)return;const progress=Math.min(1,flight.elapsed/flight.duration),dive=Math.max(0,(progress-.2)/.8),target=this.view.point(flight.end,true),direction=Math.sign(target.x-actor.position.x)||1;actor.position.x+=direction*dive*.8;actor.position.y=Math.sin(dive*Math.PI)*.35;actor.rotation.z=-direction*dive*.85;actor.userData.limbs[2].rotation.z=-1.5;actor.userData.limbs[3].rotation.z=1.5;}
}
function setupFootballVisualControls(){
 const details=document.createElement('details');details.className='visual-settings';details.innerHTML='<summary>Imagem e câmera</summary><div class="visual-options"><label>Câmera<select id="visualCamera"><option value="close">Perto da bola</option><option value="wide">Campo aberto</option><option value="broadcast">Lateral de transmissão</option></select></label><label>Gráficos<select id="visualQuality"><option value="low">Leve</option><option value="medium">Equilibrado</option><option value="high">Alto</option></select></label><label>Iluminação<select id="visualLight"><option value="day">Dia</option><option value="sunset">Fim de tarde</option><option value="night">Noite</option></select></label><label class="guide-option"><input type="checkbox" id="visualGuide"> Mostrar trajetória ao mirar</label></div>';
 document.getElementById('mainNavigation').after(details);const settings=readFootballVisuals(),fields={camera:'visualCamera',quality:'visualQuality',light:'visualLight',guide:'visualGuide'};
 for(const [key,id] of Object.entries(fields)){const field=document.getElementById(id);if(key==='guide')field.checked=!!settings[key];else field.value=settings[key];field.onchange=()=>{settings[key]=key==='guide'?field.checked:field.value;for(const view of Football3D.views)view.presentation?.apply(settings);try{localStorage.setItem('proxima-estrela-visuals',JSON.stringify(settings));}catch{}};}
}
