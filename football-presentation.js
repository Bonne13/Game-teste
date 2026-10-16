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
  const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d');ctx.fillStyle='#e2ead3';ctx.fillRect(0,0,512,512);
  for(let i=0;i<18000;i++){ctx.fillStyle=i%3?'#b9c7a4':'#d0dcba';ctx.fillRect((i*73)%512,(i*137+Math.floor(i/512)*19)%512,1,3);}
  const texture=new THREE.CanvasTexture(canvas);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(20,32);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,this.view.renderer.capabilities.getMaxAnisotropy());
  this.box(88,.2,125,0,-.2,52.5,this.material('#34463e'));
  this.box(76,.06,113,0,-.06,52.5,this.material('#376745'));
  for(let i=0;i<14;i++){const stripe=new THREE.Mesh(new THREE.PlaneGeometry(68,7.5),this.material(i%2?'#398151':'#34794b',{map:texture}));stripe.rotation.x=-Math.PI/2;stripe.position.set(0,.002,3.75+i*7.5);stripe.receiveShadow=true;this.scene.add(stripe);}
  const white=new THREE.MeshBasicMaterial({color:'#e8efdb'}),markings=[];
  const line=(x,z,a,b)=>{const length=Math.hypot(a-x,b-z);if(!length)return;const px=-(b-z)/length*.055,pz=(a-x)/length*.055,p1=[x+px,.018,z+pz],p2=[x-px,.018,z-pz],p3=[a+px,.018,b+pz],p4=[a-px,.018,b-pz];markings.push(...p1,...p3,...p2,...p2,...p3,...p4);};

  for(const p of [[-34,0,34,0],[-34,0,-34,105],[34,0,34,105],[-34,105,34,105],[-34,52.5,34,52.5]])line(...p);
  for(const far of [false,true]){const z=v=>far?105-v:v;for(const p of [[-20.16,0,-20.16,16.5],[-20.16,16.5,20.16,16.5],[20.16,16.5,20.16,0],[-9.16,0,-9.16,5.5],[-9.16,5.5,9.16,5.5],[9.16,5.5,9.16,0]])line(p[0],z(p[1]),p[2],z(p[3]));
   for(let a=.65;a<Math.PI-.65;a+=.045)line(Math.cos(a)*9.15,z(11+Math.sin(a)*9.15),Math.cos(a+.045)*9.15,z(11+Math.sin(a+.045)*9.15));
   const dot=new THREE.Mesh(new THREE.CircleGeometry(.12,16),white);dot.rotation.x=-Math.PI/2;dot.position.set(0,.025,z(11));this.scene.add(dot);
  }
  for(let a=0;a<Math.PI*2;a+=.045)line(Math.cos(a)*9.15,52.5+Math.sin(a)*9.15,Math.cos(a+.045)*9.15,52.5+Math.sin(a+.045)*9.15);
  const markingsGeometry=new THREE.BufferGeometry();markingsGeometry.setAttribute('position',new THREE.Float32BufferAttribute(markings,3));this.scene.add(new THREE.Mesh(markingsGeometry,white));
  for(const x of [-34,34])for(const z of [0,105]){this.box(.04,1.5,.04,x,.75,z,this.material('#e8efdb'));const flag=new THREE.Mesh(new THREE.PlaneGeometry(.5,.35),new THREE.MeshStandardMaterial({color:'#ffcc57',side:THREE.DoubleSide}));flag.position.set(x+.23,1.3,z);this.scene.add(flag);}
 }

 sign(text,w,h,x,y,z,rotation=0){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=128;const c=canvas.getContext('2d');c.fillStyle='#142e32';c.fillRect(0,0,1024,128);c.fillStyle='#d3fa6a';c.font='bold 56px sans-serif';c.textAlign='center';c.fillText(text,512,84);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sign=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));sign.position.set(x,y,z);sign.rotation.y=rotation;this.scene.add(sign);}
 buildStadium(){
  const concrete=this.material('#687d88'),roof=this.material('#d3dee1',{metalness:.2}),trim=this.material('#d3dcda');
  for(let tier=0;tier<7;tier++){const y=.55+tier*.8;for(const end of [-1,1])this.box(86,.65,1.6,0,y,end<0?-5-tier*1.6:110+tier*1.6,concrete);for(const side of [-1,1])this.box(1.6,.65,115,side*(38+tier*1.3),y,52.5,concrete);}
  for(const side of [-1,1]){this.box(10,.25,119,side*42,10.4,52.5,roof);for(const z of [-4,24,52.5,81,109])this.box(.16,10,.16,side*46,5,z,trim);}
  for(const z of [-12,117]){this.box(94,.25,9,0,10.4,z,roof);for(const x of [-42,-21,0,21,42])this.box(.16,10,.16,x,5,z+3,trim);}
  const brands=['PRÓXIMA ESTRELA','AURORA SPORTS','VIVAVOLT','O SEU FUTEBOL','NEXO MOBILE'];for(let i=0;i<brands.length;i++)this.sign(brands[i],13,1.1,-28+i*14,.75,-3);
  for(const side of [-1,1])for(let i=0;i<5;i++)this.sign(brands[i],20,1.1,side*35.5,.75,9+i*21,side>0?-Math.PI/2:Math.PI/2);
  this.scoreCanvas=document.createElement('canvas');this.scoreCanvas.width=512;this.scoreCanvas.height=128;this.scoreTexture=new THREE.CanvasTexture(this.scoreCanvas);this.scoreTexture.colorSpace=THREE.SRGBColorSpace;const board=new THREE.Mesh(new THREE.PlaneGeometry(12,3),new THREE.MeshBasicMaterial({map:this.scoreTexture}));board.position.set(0,7.8,-11);this.scene.add(board);this.setScore(this.view.training?'TREINO':'0 : 0');
  this.crowds=[];const matrix=new THREE.Matrix4(),headPositions=[];
  for(let color=0;color<4;color++){
   const crowd=new THREE.InstancedMesh(new THREE.CylinderGeometry(.13,.18,.48,5),this.material(['#d5e3db','#498fb6','#cead72','#ad6662'][color]),480),seats=new THREE.InstancedMesh(new THREE.BoxGeometry(.48,.3,.5),this.material(color%2?'#386a91':'#87a8b9'),480);
   for(let j=0;j<480;j++){const i=j*4+color,side=Math.floor(i/480),local=i%480,row=Math.floor(local/80),column=local%80;let x,y=1+row*.8,z;if(side<2){x=-39+column*.98;z=side===0?-5-row*1.6:110+row*1.6;}else{x=(side===2?-1:1)*(38+row*1.3);z=-1+column*1.36;}matrix.makeTranslation(x,y,z);crowd.setMatrixAt(j,matrix);headPositions.push([x,y+.36,z]);matrix.makeTranslation(x,y-.35,z);seats.setMatrixAt(j,matrix);}this.scene.add(crowd,seats);this.crowds.push(crowd,seats);
  }
  const heads=new THREE.InstancedMesh(new THREE.SphereGeometry(.13,5,4),this.material('#c6a78d'),headPositions.length);headPositions.forEach((p,i)=>{matrix.makeTranslation(...p);heads.setMatrixAt(i,matrix);});this.scene.add(heads);this.crowds.push(heads);
  for(const x of [-37,37])for(const z of [0,105]){this.box(.18,22,.18,x,11,z,trim);this.box(4,.7,.45,x,21.5,z,new THREE.MeshBasicMaterial({color:'#f4f1d4'}));}
 }

 apply(settings){
  this.settings={...FOOTBALL_VISUAL_DEFAULTS,...settings};const {renderer,scene}=this.view,quality=['low','medium','high'].includes(this.settings.quality)?this.settings.quality:'medium';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,quality==='high'?1.75:quality==='low'?.85:1.25));renderer.shadowMap.enabled=quality!=='low';renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=this.settings.light==='night'?1.1:1.25;
  this.crowds.forEach(c=>c.visible=quality!=='low');const sun=scene.children.find(o=>o.isDirectionalLight),ambient=scene.children.find(o=>o.isHemisphereLight);
  const night=this.settings.light==='night',sunset=this.settings.light==='sunset',sky=night?'#172a41':sunset?'#d6bda2':'#b7cfdb';scene.background.set(sky);scene.fog.color.set(sky);sun.color.set(sunset?'#ffd0a0':night?'#e7efff':'#fff6df');sun.intensity=night?1.8:2.3;sun.position.set(sunset?-15:-10,sunset?9:18,8);ambient.intensity=night?1.2:1.8;this.view.resize?.();
 }
 setScore(text){if(this.scoreText===text)return;this.scoreText=text;const c=this.scoreCanvas.getContext('2d');c.fillStyle='#0c2028';c.fillRect(0,0,512,128);c.strokeStyle='#79ba94';c.lineWidth=5;c.strokeRect(3,3,506,122);c.fillStyle='#e9f6c9';c.textAlign='center';c.font='bold 68px sans-serif';c.fillText(text,256,91);this.scoreTexture.needsUpdate=true;}
 groundShadow(size=1){if(!this.shadowTexture){const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),g=ctx.createRadialGradient(32,32,2,32,32,31);g.addColorStop(0,'rgba(5,20,14,.4)');g.addColorStop(1,'rgba(5,20,14,0)');ctx.fillStyle=g;ctx.fillRect(0,0,64,64);this.shadowTexture=new THREE.CanvasTexture(c);}const mesh=new THREE.Mesh(new THREE.PlaneGeometry(size,size),new THREE.MeshBasicMaterial({map:this.shadowTexture,transparent:true,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.y=.026;return mesh;}
 makeBall(){
  const radius=.17,ball=new THREE.Mesh(new THREE.SphereGeometry(radius,32,24),this.material('#f1f1e9',{roughness:.44}));ball.castShadow=true;
  const phi=(1+Math.sqrt(5))/2,directions=[];for(const a of [-1,1])for(const b of [-1,1])directions.push(new THREE.Vector3(0,a,b*phi).normalize(),new THREE.Vector3(a,b*phi,0).normalize(),new THREE.Vector3(b*phi,0,a).normalize());
  const vertices=[],normals=[],emit=(a,b,c,depth)=>{if(depth){const ab=a.clone().add(b).normalize(),bc=b.clone().add(c).normalize(),ca=c.clone().add(a).normalize();emit(a,ab,ca,depth-1);emit(ab,b,bc,depth-1);emit(ca,bc,c,depth-1);emit(ab,bc,ca,depth-1);}else for(const p of [a,b,c]){vertices.push(p.x*.171,p.y*.171,p.z*.171);normals.push(p.x,p.y,p.z);}};
  for(const direction of directions){const tangent=new THREE.Vector3(0,1,0).cross(direction).normalize(),bitangent=direction.clone().cross(tangent),ring=[];for(let i=0;i<5;i++){const angle=i*Math.PI*2/5;ring.push(direction.clone().addScaledVector(tangent,Math.cos(angle)*.3).addScaledVector(bitangent,Math.sin(angle)*.3).normalize());}for(let i=0;i<5;i++)emit(direction,ring[i],ring[(i+1)%5],2);}
  const panels=new THREE.BufferGeometry();panels.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));panels.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));const black=new THREE.Mesh(panels,this.material('#192731',{roughness:.48,side:THREE.DoubleSide}));ball.add(black);return ball;
 }
 makeActor(color,label){
  const body=new THREE.Group(),shirt=this.material(color),skin=this.material('#d6a17b'),shorts=this.material('#17272e'),socks=this.material('#e5ede3'),boot=this.material('#24333a');
  const mesh=(geometry,mat,parent,x,y,z)=>{const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
  mesh(new THREE.CylinderGeometry(.22,.17,.62,12),shirt,body,0,1.12,0);mesh(new THREE.CylinderGeometry(.085,.09,.09,10),skin,body,0,1.47,0);mesh(new THREE.TorusGeometry(.09,.018,5,12),this.material('#e9eee8'),body,0,1.44,.05).rotation.x=Math.PI/2;mesh(new THREE.SphereGeometry(.16,12,10),skin,body,0,1.58,0);mesh(new THREE.SphereGeometry(.163,12,8,0,Math.PI*2,0,1.45),this.material('#30241f'),body,0,1.6,-.01);
  const limbs=[];for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.105,.86,0);mesh(new THREE.CylinderGeometry(.085,.07,.35,8),shorts,leg,0,-.16,0);mesh(new THREE.CylinderGeometry(.06,.05,.33,8),socks,leg,0,-.49,0);mesh(new THREE.BoxGeometry(.14,.1,.27),boot,leg,0,-.68,.05);body.add(leg);limbs.push(leg);}
  for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.23,1.3,0);mesh(new THREE.CylinderGeometry(.085,.07,.2,8),shirt,arm,0,-.08,0);mesh(new THREE.CylinderGeometry(.055,.045,.32,8),skin,arm,0,-.31,0);mesh(new THREE.SphereGeometry(.065,8,6),skin,arm,0,-.47,0);arm.rotation.z=side*.15;body.add(arm);limbs.push(arm);}
  const shadow=this.groundShadow(.9);body.add(shadow);
  body.userData={shirt,limbs,label:this.view.label(label),lastPoint:null};body.add(body.userData.label);return body;
 }
 animateActor(actor,point){const data=actor.userData,previous=data.lastPoint,moving=previous?Math.hypot(point.x-previous.x,point.y-previous.y):0,time=performance.now()/1000;
  if(moving>.02){actor.rotation.y=Math.atan2(point.x-previous.x,-(point.y-previous.y));data.walkUntil=time+.15;}else actor.rotation.y=0;
  const walk=time<(data.walkUntil||0),swing=walk?Math.sin(time*11)*.65:Math.sin(time*1.8)*.025;data.limbs.forEach((limb,i)=>limb.rotation.x=swing*(i%2?1:-1));data.lastPoint={x:point.x,y:point.y};
 }
 update(origin,flight,mode,outcome){
  const now=performance.now(),dt=Math.min(.1,(now-this.lastTime)/1000);this.lastTime=now;const v=this.view,setting=this.settings.camera;
  const ball=origin?v.point(origin):new THREE.Vector3(0,.2,8),wide=setting==='wide',broadcast=setting==='broadcast';let position=new THREE.Vector3(wide?0:broadcast?27:ball.x,wide?29:broadcast?20:this.view.training?6:7.4,wide?Math.max(55,ball.z+25):broadcast?Math.max(34,ball.z+12):Math.max(18,ball.z+12));
  let target=new THREE.Vector3(ball.x*.7,1,wide?Math.max(18,ball.z-12):broadcast?Math.max(13,ball.z-8):Math.max(0,ball.z-8));if(flight){target.lerp(v.ball.position,.18);if(!v.charging)position.x+=v.ball.position.x*.12;}if(v.training&&flight){const at=v.ball.position;target.set(at.x*.5,Math.max(.7,at.y*.7),at.z*.5);position.x=at.x*.25;if(flight.resolved){position.set(at.x*.35,Math.max(5,at.y+4),Math.max(12,at.z+11));target.set(at.x*.65,Math.max(.6,at.y*.8),at.z*.65);}}
  if(['dribble','carry','technique'].includes(mode)&&!flight){position.set(ball.x,5.7,ball.z+10);target.set(ball.x,.7,ball.z-8);}if(!v.training&&['cross','corner'].includes(mode)&&!flight){position.set(ball.x*.5,32,Math.max(46,ball.z+30));target.set(ball.x*.5,.5,ball.z*.4);}if(!v.training&&mode==='pass'&&!flight){position.set(ball.x*.75,16,ball.z+15);target.set(ball.x*.6,.5,ball.z-12);}if(!v.training&&flight){const at=v.ball.position;target.set(at.x,Math.max(.7,at.y),at.z-3);position.set(at.x*.8,9,at.z+17);}if(v.training&&mode==='vision'&&!flight){position.set(0,17,33);target.set(0,.5,6);}if(this.lastMode!==mode){this.cameraReady=false;this.lastMode=mode;}
  const smooth=v.charging?0:1-Math.exp(-dt*5);if(!this.cameraReady){v.camera.position.copy(position);this.look.copy(target);this.cameraReady=true;}else{v.camera.position.lerp(position,smooth);this.look.lerp(target,smooth);}v.camera.lookAt(this.look);v.camera.updateMatrixWorld();
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
