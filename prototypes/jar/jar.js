// Shape/interaction proof of concept. Original PNGs are sampled as textures,
// never overwritten. Three approximate 120-degree projections are NOT a
// production label master: source typography, seams and ingredients need review.
import * as THREE from './vendor/three.module.js';

const source={front:'./banana-front.png',left:'../../assets/SEA%20MOSS%20GEL%20-%20BANANA%2016%20OZ%20-%20LEFT.png',right:'../../assets/SEA%20MOSS%20GEL%20-%20BANANA%2016%20OZ%20-%20RIGHT.png',composite:'../../assets/SEA%20MOSS%20GEL%20-%20BANANA%2016%20OZ%20-%203%20In%201.jpg'};
const $=id=>document.getElementById(id);
const host=$('canvas-host'), photo=$('photo');
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let renderer,scene,camera,jar,ready=false,initializing=null,activeView='spin';
let rotation=0,targetRotation=0,zoom=1,targetZoom=1,frame=0,drag=null;

function schedule(){if(!frame&&ready&&activeView==='spin')frame=requestAnimationFrame(render);}
function render(){
  frame=0;
  const ease=reducedMotion.matches?1:.18;
  rotation+=(targetRotation-rotation)*ease;
  zoom+=(targetZoom-zoom)*ease;
  jar.rotation.y=rotation;
  camera.zoom=zoom;camera.updateProjectionMatrix();
  renderer.render(scene,camera);
  $('degrees').textContent=`${Math.round(((rotation*180/Math.PI)%360+360)%360)%360}°`;
  if(Math.abs(targetRotation-rotation)>.0001||Math.abs(targetZoom-zoom)>.0001)schedule();
}
function turn(amount){targetRotation+=amount*Math.PI/180;schedule();}
function setZoom(value){targetZoom=Math.max(.85,Math.min(1.6,value));schedule();}
function resize(){
  if(!renderer)return;
  const w=host.clientWidth,h=host.clientHeight;
  if(!w||!h)return;
  const aspect=w/h;
  const halfHeight=Math.max(2.2,1.3/aspect);
  camera.left=-halfHeight*aspect;camera.right=halfHeight*aspect;
  camera.top=halfHeight;camera.bottom=-halfHeight;
  camera.updateProjectionMatrix();renderer.setSize(w,h);schedule();
}
function lathe(points,material){
  const mesh=new THREE.Mesh(new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),128),material);
  jar.add(mesh);return mesh;
}
function cylinder(radius,height,y,material){const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,height,128),material);m.position.y=y;jar.add(m);return m;}
function ring(radius,tube,y,material){const m=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,12,128),material);m.rotation.x=Math.PI/2;m.position.y=y;jar.add(m);return m;}

function labelSector(texture,panel){
  // Cylindrical inverse projection samples the central readable portion of each
  // original. Vertical bounds follow the curved top/bottom edges in the mockups.
  const n=96,rows=16,positions=[],uvs=[],indices=[];
  const radius=1.013,top=.56,bottom=-1.22;
  for(let j=0;j<=rows;j++){
    const v=j/rows;
    for(let i=0;i<=n;i++){
      const a0=Math.asin((panel.x0-700)/425),a1=Math.asin((panel.x1-700)/425); const local=a0+i/n*(a1-a0),theta=(panel.start+i/n*(panel.end-panel.start))*Math.PI/180;
      positions.push(radius*Math.sin(theta),bottom+v*(top-bottom),radius*Math.cos(theta));
      const x=700+425*Math.sin(local);
      const edge=1-Math.cos(local);
      const yTop=597+22*edge,yBottom=1490-48*edge;
      uvs.push(x/1354,1-(yBottom-v*(yBottom-yTop))/1836);
      if(j<rows&&i<n){const a=j*(n+1)+i,b=a+n+1;indices.push(a,a+1,b,a+1,b+1,b);}
    }
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();
  const material=new THREE.MeshStandardMaterial({map:texture,roughness:.77,metalness:0,side:THREE.DoubleSide});
  jar.add(new THREE.Mesh(g,material));
}

async function init(){
  if(initializing)return initializing;
  initializing=(async()=>{
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
    host.append(renderer.domElement);
    renderer.domElement.setAttribute('aria-hidden','true');
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;$('loading').hidden=false;$('loading').textContent='3D paused. Reload to try again, or choose an original photo.';});
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-2,2,2,-2,.1,30);
    camera.position.set(0,1.4,9);camera.lookAt(0,.0,0);
    scene.add(new THREE.HemisphereLight(0xfffbed,0x8b8b6d,1.5));
    const key=new THREE.DirectionalLight(0xffffff,2.2);key.position.set(-3,5,5);scene.add(key);
    const fill=new THREE.DirectionalLight(0xe5f5ff,.8);fill.position.set(4,2,2);scene.add(fill);
    const rim=new THREE.DirectionalLight(0xffffff,1.5);rim.position.set(0,4,-4);scene.add(rim);
    jar=new THREE.Group();scene.add(jar);
    const gel=new THREE.MeshPhysicalMaterial({color:0xcac276,roughness:.35,metalness:0,clearcoat:.65,clearcoatRoughness:.12});
    lathe([[0,-1.59],[.65,-1.59],[.86,-1.56],[.97,-1.46],[.998,-1.3],[.998,.73],[.985,.91],[.92,1.03],[.91,1.14],[.92,1.28],[0,1.28]],gel);
    const glass=new THREE.MeshPhysicalMaterial({color:0xf3f7e5,transparent:true,opacity:.12,roughness:.12,metalness:.1,clearcoat:1,depthWrite:false,side:THREE.FrontSide});
    lathe([[0,-1.63],[.68,-1.63],[.90,-1.60],[1.015,-1.44],[1.022,-1.25],[1.022,.73],[1.00,.96],[.946,1.08],[.942,1.26],[.98,1.30]],glass);
    const clearRim=new THREE.MeshStandardMaterial({color:0xdfdfc5,roughness:.24,metalness:.38});
    ring(.92,.018,-1.57,clearRim);ring(.978,.017,1.20,clearRim);
    const black=new THREE.MeshStandardMaterial({color:0x171b19,roughness:.38,metalness:.12});
    const edgeBlack=new THREE.MeshStandardMaterial({color:0x30342f,roughness:.34,metalness:.18});
    lathe([[0,1.17],[.95,1.17],[1.01,1.20],[1.025,1.25],[1.02,1.48],[.99,1.54],[.89,1.56],[0,1.56]],black);
    cylinder(1.01,.12,1.25,black);ring(1.005,.018,1.20,edgeBlack);ring(1.017,.014,1.32,edgeBlack);ring(.99,.017,1.51,edgeBlack);
    const ribs=new THREE.InstancedMesh(new THREE.BoxGeometry(.011,.16,.021),edgeBlack,180);
    const dummy=new THREE.Object3D();
    for(let i=0;i<180;i++){const angle=i/180*Math.PI*2;dummy.position.set(1.025*Math.sin(angle),1.41,1.025*Math.cos(angle));dummy.rotation.y=angle;dummy.updateMatrix();ribs.setMatrixAt(i,dummy.matrix);}
    jar.add(ribs);
    // Procedural ground shadow: no modifications to source product artwork.
    const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;
    const ctx=shadowCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,4,64,64,64);
    gradient.addColorStop(0,'rgba(60,48,17,.34)');gradient.addColorStop(.45,'rgba(60,48,17,.18)');gradient.addColorStop(1,'rgba(60,48,17,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(3.6,3.1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-1.65;scene.add(ground);
    const loader=new THREE.TextureLoader();
    const textures=await Promise.all(['front','right','left'].map(async name=>{const t=await loader.loadAsync(source[name]);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}));
    const panels=[{start:-80,end:80,x0:280,x1:1116},{start:80,end:190,x0:457,x1:1118},{start:190,end:280,x0:508,x1:1118}]; textures.forEach((t,i)=>labelSector(t,panels[i]));
    ready=true;$('loading').hidden=true;resize();schedule();
  })().catch(error=>{
    console.error('Jar preview could not load:',error);
    $('loading').hidden=false;$('loading').textContent='3D is unavailable here. You can still explore the original photos below.';
    $('hint').textContent='Original photos remain available';
  });
  return initializing;
}

function selectView(view){
  activeView=view;
  document.querySelectorAll('[data-view]').forEach(button=>{const selected=button.dataset.view===view;button.classList.toggle('selected',selected);button.setAttribute('aria-pressed',String(selected));});
  const spin=view==='spin';host.hidden=!spin;photo.hidden=spin;$('viewer-controls').hidden=!spin;$('degrees').hidden=!spin;
  $('view-label').textContent=spin?'360° VIEW':'ORIGINAL PHOTO';
  $('hint').textContent=spin?'Drag to discover every side':'Explore the original artwork';
  $('loading').hidden=!spin||ready;
  if(spin){init();resize();schedule();}else{photo.src=source[view];photo.alt=`Banana Sea Moss Gel ${view} original mockup`;}
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>selectView(button.dataset.view)));
$('turn-left').addEventListener('click',()=>turn(30));$('turn-right').addEventListener('click',()=>turn(-30));
document.querySelectorAll('[data-angle]').forEach(button=>button.addEventListener('click',()=>{
  const desired=Number(button.dataset.angle)*Math.PI/180;
  targetRotation+=Math.atan2(Math.sin(desired-targetRotation),Math.cos(desired-targetRotation));schedule();
}));
$('zoom-in').addEventListener('click',()=>setZoom(targetZoom+.15));$('zoom-out').addEventListener('click',()=>setZoom(targetZoom-.15));
$('reset').addEventListener('click',()=>{targetRotation+=Math.atan2(Math.sin(-targetRotation),Math.cos(-targetRotation));targetZoom=1;schedule();});
host.addEventListener('keydown',event=>{
  if(event.ctrlKey||event.metaKey||event.altKey)return;
  if(event.key==='ArrowLeft')turn(15);else if(event.key==='ArrowRight')turn(-15);else if(event.key==='+'||event.key==='=')setZoom(targetZoom+.15);else if(event.key==='-')setZoom(targetZoom-.15);else if(event.key==='Home'){$('reset').click();}else return;
  event.preventDefault();
});
host.addEventListener('pointerdown',event=>{if(event.button!==0||!event.isPrimary)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,start:targetRotation};host.setPointerCapture(event.pointerId);});
host.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;targetRotation=drag.start+(event.clientX-drag.x)/host.clientWidth*Math.PI*2;rotation=targetRotation;schedule();});
function endDrag(event){if(drag?.id===event.pointerId)drag=null;}
host.addEventListener('pointerup',endDrag);host.addEventListener('pointercancel',endDrag);host.addEventListener('lostpointercapture',endDrag);
new ResizeObserver(resize).observe(host);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();});

const dialog=$('label-dialog');let lastFocus;
function labelView(view){$('label-image').src=source[view];$('label-image').alt=`Original Banana ${view} label artwork`;document.querySelectorAll('[data-label]').forEach(b=>{const active=b.dataset.label===view;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});dialog.querySelector('.label-scroll').scrollTo(0,0);}
$('read-label').addEventListener('click',()=>{lastFocus=document.activeElement;labelView(['front','left','right'].includes(activeView)?activeView:'right');dialog.showModal();});
$('close-label').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>lastFocus?.focus());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelectorAll('[data-label]').forEach(button=>button.addEventListener('click',()=>labelView(button.dataset.label)));
selectView('spin');

