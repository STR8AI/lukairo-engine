h<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>LUKAIRO | Delivering Control. Returning Time.</title>
<style>
html,body{margin:0;padding:0;background:#000;color:#fff;font-family:'Inter','SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif;overflow:hidden;height:100%;}
#lukairo-scene{position:fixed;top:0;left:0;width:100%;height:100vh;z-index:1;background:radial-gradient(circle at center,#040404,#000);}
.overlay{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;color:#00E5D1;z-index:5;opacity:0;animation:fadeInOverlay 2s ease 4s forwards;}
.overlay h1{font-size:clamp(3rem,6vw,5rem);margin:0 0 1rem;text-shadow:0 0 50px rgba(0,229,209,0.5);}
.overlay h1::after{content:"";display:block;width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(0,229,209,0.6),transparent);animation:reflect 6s infinite linear;}
.overlay p{color:#b0b0b0;font-size:1.1rem;line-height:1.6;margin:0;}
.maple{display:inline-block;width:22px;height:22px;vertical-align:middle;margin-left:4px;}
footer{position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);color:#444;font-size:.9rem;z-index:10;opacity:0;animation:fadeInOverlay 2s ease 5s forwards;}
.label{position:absolute;color:#00E5D1;font-size:.9rem;text-shadow:0 0 8px #00E5D1;pointer-events:none;font-weight:500;transition:opacity .3s ease;}
@keyframes fadeInOverlay{to{opacity:1}}
@keyframes reflect{0%{opacity:.3;}50%{opacity:1;}100%{opacity:.3;}}
.fade-bg{position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:10;animation:fadeOut 6s ease forwards;}
@keyframes fadeOut{0%{opacity:1;}80%{opacity:0.2;}100%{opacity:0;visibility:hidden;}}
</style>
</head>
<body>
<div id="lukairo-scene"></div>
<div class="overlay">
<h1>LUKAIRO</h1>
<p>Delivering Control. Returning Time.<br>Proudly Canadian <svg class="maple" viewBox="0 0 64 64"><path fill="#ff5b33"><animate attributeName="opacity" values="0.6;1;0.6" dur="6s" repeatCount="indefinite"/></path><path d="M31 2l4 12 9-5-2 12 10-3-9 15 10 2-13 6 3 8-12-5-12 5 3-8-13-6 10-2-9-15 10 3-2-12 9 5z"/></svg></p>
</div>
<footer>© 2025 LUKAIRO LDB INC.</footer>
<div class="fade-bg"></div>
<script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>
<script>
window.addEventListener("load",()=>{
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(65,window.innerWidth/window.innerHeight,0.1,1000);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById("lukairo-scene").appendChild(renderer.domElement);

// lights
const ambient=new THREE.AmbientLight(0x00e5d1,0.4);scene.add(ambient);
const mainLight=new THREE.PointLight(0x00e5d1,1.6,100);scene.add(mainLight);
const rotatingLight=new THREE.PointLight(0x00ffff,1,50);scene.add(rotatingLight);

// core sphere
const loader=new THREE.TextureLoader();
const texture=loader.load("LUKAIRO.png");
const core=new THREE.Mesh(
 new THREE.SphereGeometry(3,64,64),
 new THREE.MeshStandardMaterial({map:texture,metalness:1,roughness:0.25,emissive:0x001111,emissiveIntensity:0.6})
);
scene.add(core);

// systems
const systems=[
{name:"Jobber",orbit:8,color:0x00e5d1},
{name:"Housecall Pro",orbit:10,color:0x00bfff},
{name:"ServiceTitan",orbit:12,color:0x33aaff},
{name:"Workiz",orbit:9,color:0x00ffaa},
{name:"Others",orbit:11,color:0x00ffcc}
];
const nodes=[],beams=[],labels=[];
systems.forEach((sys,i)=>{
 const mat=new THREE.MeshStandardMaterial({emissive:sys.color,emissiveIntensity:2,color:0x001010,metalness:0.9,roughness:0.2});
 const orb=new THREE.Mesh(new THREE.SphereGeometry(0.4,32,32),mat);
 orb.userData={orbit:sys.orbit,phase:i,scale:1,dir:1,color:sys.color,connected:false};
 scene.add(orb);nodes.push(orb);
 const beamGeom=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]);
 const beamMat=new THREE.LineBasicMaterial({color:sys.color,transparent:true,opacity:0});
 const beam=new THREE.Line(beamGeom,beamMat);scene.add(beam);beams.push(beam);
 const lbl=document.createElement("div");lbl.className="label";lbl.textContent=sys.name;document.body.appendChild(lbl);labels.push(lbl);
});

// particles
const geo=new THREE.BufferGeometry();
const pos=new Float32Array(2500);for(let i=0;i<pos.length;i++)pos[i]=(Math.random()-0.5)*100;
geo.setAttribute("position",new THREE.BufferAttribute(pos,3));
const particles=new THREE.Points(geo,new THREE.PointsMaterial({color:0x00e5d1,size:0.05,transparent:true,opacity:0.4}));
scene.add(particles);
camera.position.z=22;

// animate
function animate(){
requestAnimationFrame(animate);
const t=Date.now()*0.001;
core.rotation.y+=0.0025;core.rotation.x+=0.0012;
rotatingLight.position.set(Math.sin(t*0.8)*10,Math.cos(t*0.6)*5,Math.cos(t*0.9)*10);
particles.rotation.y+=0.0004;
nodes.forEach((n,i)=>{
 const angle=t*0.6+i;
 const pull=Math.sin(t*0.4+i)*0.3;
 const r=n.userData.orbit-pull;
 n.position.x=Math.sin(angle)*r;
 n.position.y=Math.cos(angle)*r;
 n.position.z=Math.sin(t*0.2+i)*1.5;
 n.userData.scale+=0.002*n.userData.dir;
 if(n.userData.scale>1.1||n.userData.scale<0.9)n.userData.dir*=-1;
 n.scale.setScalar(n.userData.scale);
 const dist=n.position.length(),beam=beams[i];
 if(dist<9){beam.material.opacity=0.6;beam.geometry.setFromPoints([new THREE.Vector3(),n.position.clone()]);n.userData.connected=true;}
 else if(n.userData.connected){beam.material.opacity*=0.9;if(beam.material.opacity<0.05){n.userData.connected=false;beam.material.opacity=0;}}
 const v=n.position.clone().project(camera);
 const x=(v.x*0.5+0.5)*window.innerWidth;
 const y=(-v.y*0.5+0.5)*window.innerHeight;
 labels[i].style.left=`${x}px`;
 labels[i].style.top=`${y}px`;
 labels[i].style.opacity=n.userData.connected?1:0.6;
});
renderer.render(scene,camera);
}
animate();

// resize
window.addEventListener("resize",()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight);});
});
</script>
</body>
</html>