import * as THREE from 'https://unpkg.com/three@0.169.0/build/three.module.js';

const el = (id) => document.getElementById(id);
const scene = new THREE.Scene(); scene.background = new THREE.Color(0x8cc5e8); scene.fog = new THREE.Fog(0x8cc5e8, 18, 95);
const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 150); camera.position.set(0, 5.8, 10.5);
const renderer = new THREE.WebGLRenderer({ canvas: el('scene'), antialias: true }); renderer.setPixelRatio(devicePixelRatio); renderer.shadowMap.enabled = true;
const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(9, 15, 4); sun.castShadow = true; scene.add(sun, new THREE.HemisphereLight(0xd8edff,0x425a36,1.4));
const grass = new THREE.Mesh(new THREE.PlaneGeometry(220,220),new THREE.MeshStandardMaterial({color:0x497a43})); grass.rotation.x=-Math.PI/2; scene.add(grass);
const road = new THREE.Mesh(new THREE.PlaneGeometry(8,130),new THREE.MeshStandardMaterial({color:0x283139,roughness:.9})); road.rotation.x=-Math.PI/2; road.position.z=-42; scene.add(road);
for(let z=-104;z<22;z+=8){const mark=new THREE.Mesh(new THREE.PlaneGeometry(.14,4),new THREE.MeshBasicMaterial({color:0xffffff}));mark.rotation.x=-Math.PI/2;mark.position.set(0,.012,z);scene.add(mark)}
const car = new THREE.Group(); const body=new THREE.Mesh(new THREE.BoxGeometry(2,0.55,4),new THREE.MeshStandardMaterial({color:0x1c8dce,metalness:.4,roughness:.3}));body.position.y=.62;body.castShadow=true;car.add(body);const glass=new THREE.Mesh(new THREE.BoxGeometry(1.65,.55,1.75),new THREE.MeshStandardMaterial({color:0x162b45,metalness:.7,roughness:.15}));glass.position.set(0,1.12,-.1);car.add(glass);scene.add(car);
function resize(){const r=el('scene').getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
let displayed={lane_offset_m:0,heading_deg:0,vehicle_speed_kph:42}; function animate(){requestAnimationFrame(animate);car.position.x+=(displayed.lane_offset_m-car.position.x)*.12;car.rotation.y+=(displayed.heading_deg*Math.PI/180-car.rotation.y)*.1;renderer.render(scene,camera)}animate();
const protocol=location.protocol==='https:'?'wss':'ws'; const socket=new WebSocket(`${protocol}://${location.host}/ws`);
socket.onopen=()=>el('connection').textContent='Live simulation connected'; socket.onclose=()=>el('connection').textContent='Disconnected — refresh to reconnect';
socket.onmessage=(event)=>{const d=JSON.parse(event.data);displayed=d;el('hr').textContent=d.heart_rate_bpm;el('gsr').textContent=d.gsr_us;el('wheel').textContent=Math.round(d.wheel_angle_deg);el('lane').textContent=d.lane_offset_m;el('speed').textContent=`${d.vehicle_speed_kph} km/h`;el('sequence').textContent=`packet ${d.sequence}`;const risk=el('risk');risk.textContent=d.risk;risk.className=`risk ${d.risk}`;el('alert').textContent=d.alert};
function steer(value){el('steeringOut').textContent=`${value}%`;if(socket.readyState===WebSocket.OPEN)socket.send(JSON.stringify({type:'wheel',normalized:Number(value)/100}))}el('steering').oninput=(e)=>steer(e.target.value);
addEventListener('keydown',(e)=>{if(['a','d'].includes(e.key.toLowerCase())){const slider=el('steering');slider.value=Math.max(-100,Math.min(100,Number(slider.value)+(e.key.toLowerCase()==='a'?-8:8)));steer(slider.value)}});
document.querySelectorAll('[data-scenario]').forEach((b)=>b.onclick=()=>socket.send(JSON.stringify({type:'scenario',name:b.dataset.scenario})));
