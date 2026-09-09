// Three.js is injected by the lazy-loading theme component. Source images remain
// unchanged: the UV mapping selects non-overlapping printed panels from them.
export async function createJarScene(THREE, host, sources, onAngle = () => {}) {
  let disposed=false,active=true,frame=0,angle=0,target=0,zoom=1,targetZoom=1,drag=null;
  const textures=[],materials=new Set(),geometries=new Set();
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
  host.append(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(),pose=new THREE.Group(),jar=new THREE.Group();scene.add(pose);pose.add(jar);
  // Keep the presentation tilt independent of the user's horizontal rotation.
  pose.rotation.x=THREE.MathUtils.degToRad(-7);pose.position.y=.08;
  const camera=new THREE.OrthographicCamera(-2,2,2,-2,.1,30);
  camera.position.set(0,2.4,9);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xfffdf7,0xb1aca1,2.0));
  for(const [color,power,x,y,z] of [[0xffffff,2.1,-4,5,4],[0xf5f8ff,1.35,4,2,5],[0xffffff,1.5,1,4,-4]]){const light=new THREE.DirectionalLight(color,power);light.position.set(x,y,z);scene.add(light);}
  const material=(options,physical=false)=>{const m=physical?new THREE.MeshPhysicalMaterial(options):new THREE.MeshStandardMaterial(options);materials.add(m);return m;};
  const mesh=(g,m,parent=jar)=>{geometries.add(g);const o=new THREE.Mesh(g,m);parent.add(o);return o;};
  const lathe=(points,m)=>mesh(new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),160),m);
  const ring=(r,tube,y,m)=>{const o=mesh(new THREE.TorusGeometry(r,tube,12,160),m);o.rotation.x=Math.PI/2;o.position.y=y;};
  const gel=material({color:sources.color || '#e3dc9b',roughness:.55,clearcoat:.28,clearcoatRoughness:.3},true);
  lathe([[0,-1.59],[.68,-1.59],[.88,-1.55],[.975,-1.44],[1,-1.29],[1,.76],[.981,.93],[.923,1.04],[.922,1.24],[0,1.24]],gel);
  const glass=material({color:0xffffff,transparent:true,opacity:.10,roughness:.18,metalness:0,clearcoat:.65,depthWrite:false},true);
  lathe([[0,-1.63],[.68,-1.63],[.9,-1.59],[1.02,-1.43],[1.025,-1.26],[1.025,.76],[1.0,.95],[.949,1.07],[.949,1.28]],glass);
  const glassEdge=material({color:0xe4e4c8,roughness:.22,metalness:.35});ring(.94,.014,-1.57,glassEdge);ring(.969,.013,1.18,glassEdge);
  const black=material({color:sources.lidColor || '#c89545',roughness:.3,metalness:sources.lidColor ? .25 : .72});
  const ribMaterial=material({color:sources.lidColor || '#b8873e',roughness:.35,metalness:sources.lidColor ? .25 : .65});
  lathe([[0,1.16],[.96,1.16],[1.02,1.20],[1.03,1.25],[1.03,1.46],[1.0,1.51],[.88,1.54],[0,1.54]],black);
  ring(1.014,.018,1.20,ribMaterial);ring(1.029,.009,1.30,ribMaterial);ring(1.0,.014,1.50,ribMaterial);
  const ribGeometry=new THREE.BoxGeometry(.009,.095,.018);geometries.add(ribGeometry);
  const ribs=new THREE.InstancedMesh(ribGeometry,ribMaterial,200),dummy=new THREE.Object3D();
  for(let i=0;i<200;i++){const a=i/200*Math.PI*2;dummy.position.set(1.033*Math.sin(a),1.445,1.033*Math.cos(a));dummy.rotation.y=a;dummy.updateMatrix();ribs.setMatrixAt(i,dummy.matrix);}jar.add(ribs);
  // Soft contact shadow, generated procedurally rather than baked into photos.
  const shadow=document.createElement('canvas');shadow.width=128;shadow.height=128;
  const ctx=shadow.getContext('2d'),gradient=ctx.createRadialGradient(64,64,3,64,64,64);
  gradient.addColorStop(0,'rgba(55,44,12,.36)');gradient.addColorStop(.5,'rgba(55,44,12,.17)');gradient.addColorStop(1,'rgba(55,44,12,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const shadowTexture=new THREE.CanvasTexture(shadow);textures.push(shadowTexture);
  const shadowMaterial=new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false});materials.add(shadowMaterial);
  const ground=mesh(new THREE.PlaneGeometry(3.7,3.0),shadowMaterial,scene);ground.rotation.x=-Math.PI/2;ground.position.y=-1.65;

  // One full circumference, three disjoint source windows. Front owns the
  // fruit badge/banana illustration; right starts AFTER those repeated items;
  // directions starts AFTER the repeated ingredient box on the left mockup.
  // Degrees cover [-80,280] exactly, with no overlay meshes at the joins.
  const panels=[
    {name:'front',start:-80,end:80,x0:280,x1:1116},
    {name:'right',start:80,end:190,x0:457,x1:1118},
    {name:'left',start:190,end:280,x0:508,x1:1118}
  ];
  try {
    const loader=new THREE.TextureLoader();
    for(const panel of panels){
      const texture=await loader.loadAsync(sources[panel.name]);textures.push(texture);
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
      const n=100,rows=20,positions=[],uv=[],indices=[];
      const a0=Math.asin(Math.max(-.995,(panel.x0-700)/425)),a1=Math.asin(Math.min(.995,(panel.x1-700)/425));
      for(let j=0;j<=rows;j++)for(let i=0;i<=n;i++){
        const t=i/n,v=j/rows,a=THREE.MathUtils.degToRad(panel.start+t*(panel.end-panel.start));
        const projected=a0+t*(a1-a0),x=700+425*Math.sin(projected),edge=1-Math.cos(projected);
        const top=596+19*edge,bottom=1490-45*edge;
        positions.push(1.03*Math.sin(a),-1.22+v*1.79,1.03*Math.cos(a));
        uv.push(sources.unwrapped ? t : x/1354,sources.unwrapped ? v : 1-(bottom-v*(bottom-top))/1836);
        if(j<rows&&i<n){const p=j*(n+1)+i,q=p+n+1;indices.push(p,p+1,q,p+1,q+1,q);}
      }
      const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
      // A small texture-matched lift keeps printed detail clear on shaded sides.
      mesh(geometry,material({map:texture,emissiveMap:texture,emissive:0xffffff,emissiveIntensity:.06,roughness:.85,metalness:0}));
    }
  } catch(error) {dispose();throw error;}

  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  function schedule(){if(!disposed&&active&&!frame&&!document.hidden)frame=requestAnimationFrame(render);}
  function render(){frame=0;if(disposed||!active)return;const ease=motion.matches?1:.2;angle+=(target-angle)*ease;zoom+=(targetZoom-zoom)*ease;jar.rotation.y=angle;camera.zoom=zoom;camera.updateProjectionMatrix();renderer.render(scene,camera);onAngle(Math.round((angle*180/Math.PI%360+360)%360)%360);if(Math.abs(target-angle)>.0001||Math.abs(targetZoom-zoom)>.0001)schedule();}
  function resize(){if(disposed)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;const aspect=w/h,half=Math.max(2.08,1.27/aspect);camera.left=-half*aspect;camera.right=half*aspect;camera.top=half;camera.bottom=-half;camera.updateProjectionMatrix();renderer.setSize(w,h);schedule();}
  const controller=new AbortController();
  const observer=new ResizeObserver(resize);observer.observe(host);
  host.addEventListener('pointerdown',event=>{if(event.button!==0||!event.isPrimary)return;drag={id:event.pointerId,x:event.clientX,start:target};host.setPointerCapture(event.pointerId);},{signal:controller.signal});
  host.addEventListener('pointermove',event=>{if(drag?.id!==event.pointerId)return;target=drag.start+(event.clientX-drag.x)/host.clientWidth*Math.PI*2;angle=target;schedule();},{signal:controller.signal});
  for(const type of ['pointerup','pointercancel','lostpointercapture'])host.addEventListener(type,()=>{drag=null;},{signal:controller.signal});
  const api={turn(degrees){target+=degrees*Math.PI/180;schedule();},face(degrees){const a=degrees*Math.PI/180;target+=Math.atan2(Math.sin(a-target),Math.cos(a-target));schedule();},zoom(step){targetZoom=Math.max(.85,Math.min(1.6,targetZoom+step));schedule();},reset(){api.face(0);targetZoom=1;},setActive(value){active=value;if(!active){cancelAnimationFrame(frame);frame=0;}else resize();},dispose};
  host.addEventListener('keydown',event=>{if(event.ctrlKey||event.metaKey||event.altKey)return;switch(event.key){case 'ArrowLeft':api.turn(15);break;case 'ArrowRight':api.turn(-15);break;case '+':case '=':api.zoom(.15);break;case '-':api.zoom(-.15);break;case 'Home':api.reset();break;default:return;}event.preventDefault();},{signal:controller.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();},{signal:controller.signal});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();active=false;host.dispatchEvent(new CustomEvent('hx:jar-error',{bubbles:true}));},{signal:controller.signal});
  function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const g of geometries)g.dispose();renderer.dispose();renderer.domElement.remove();}
  const disposeResources=api.dispose;api.dispose=()=>{controller.abort();observer.disconnect();disposeResources();};
  resize();return api;
}
