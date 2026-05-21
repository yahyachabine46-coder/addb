<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>VOID HUNTER — FPS</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #000; overflow: hidden; font-family: 'Courier New', monospace; }
  #c { display: block; width: 100vw; height: 100vh; }
  #hud {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; color: #0ff;
  }
  #crosshair {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 20px; height: 20px;
  }
  #crosshair::before, #crosshair::after {
    content: ''; position: absolute; background: rgba(0,255,255,0.8);
  }
  #crosshair::before { width: 2px; height: 20px; left: 9px; top: 0; }
  #crosshair::after { width: 20px; height: 2px; left: 0; top: 9px; }
  #health-bar {
    position: absolute; bottom: 30px; left: 30px;
    width: 200px;
  }
  #health-label { font-size: 11px; letter-spacing: 3px; margin-bottom: 6px; color: #0ff; }
  #health-bg { width: 100%; height: 8px; background: rgba(0,255,255,0.15); border: 1px solid #0ff4; }
  #health-fill { height: 100%; background: #0ff; transition: width 0.2s; width: 100%; }
  #ammo {
    position: absolute; bottom: 30px; right: 30px;
    text-align: right; font-size: 36px; font-weight: bold;
    color: #0ff; letter-spacing: -2px;
    text-shadow: 0 0 20px #0ff8;
  }
  #ammo span { font-size: 14px; letter-spacing: 2px; display: block; opacity: 0.5; }
  #score {
    position: absolute; top: 30px; right: 30px;
    font-size: 13px; letter-spacing: 3px; color: #0ff;
    text-align: right;
  }
  #score .num { font-size: 32px; display: block; text-shadow: 0 0 20px #0ff8; }
  #hit-flash {
    position: absolute; inset: 0;
    background: rgba(255,0,0,0);
    transition: background 0.05s;
    pointer-events: none;
  }
  #title-screen {
    position: fixed; inset: 0;
    background: #000;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: #0ff; z-index: 100;
  }
  #title-screen h1 {
    font-size: 64px; letter-spacing: 12px;
    text-shadow: 0 0 40px #0ff, 0 0 80px #0ff4;
    animation: pulse 2s ease-in-out infinite;
  }
  #title-screen p { letter-spacing: 4px; opacity: 0.6; margin-top: 16px; font-size: 13px; }
  #start-btn {
    margin-top: 40px; padding: 14px 40px;
    border: 2px solid #0ff; background: transparent;
    color: #0ff; font-family: 'Courier New', monospace;
    font-size: 14px; letter-spacing: 4px;
    cursor: pointer; transition: all 0.2s;
  }
  #start-btn:hover { background: #0ff; color: #000; }
  #controls-hint {
    position: absolute; bottom: 80px; left: 50%;
    transform: translateX(-50%);
    font-size: 11px; letter-spacing: 3px; opacity: 0.4;
    color: #0ff; white-space: nowrap;
  }
  #kills { font-size: 11px; letter-spacing: 3px; opacity: 0.7; }
  @keyframes pulse {
    0%,100% { text-shadow: 0 0 40px #0ff, 0 0 80px #0ff4; }
    50% { text-shadow: 0 0 60px #0ff, 0 0 120px #0ff6, 0 0 200px #0ff2; }
  }
  #reload-msg {
    position: absolute; bottom: 90px; right: 30px;
    font-size: 11px; letter-spacing: 3px; color: #ff0;
    display: none;
    animation: blink 0.5s step-end infinite;
  }
  @keyframes blink { 50% { opacity: 0; } }
  #wave-msg {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    font-size: 28px; letter-spacing: 6px; color: #0ff;
    text-shadow: 0 0 30px #0ff;
    display: none; text-align: center;
  }
</style>
</head>
<body>
<canvas id="c"></canvas>
<div id="hud">
  <div id="crosshair"></div>
  <div id="hit-flash"></div>
  <div id="health-bar">
    <div id="health-label">SHIELDS</div>
    <div id="health-bg"><div id="health-fill"></div></div>
  </div>
  <div id="ammo">30<span>ROUNDS</span></div>
  <div id="reload-msg">RELOADING...</div>
  <div id="score"><div id="kills">KILLS</div><span class="num" id="score-num">0</span></div>
  <div id="controls-hint">WASD · MOVE &nbsp;|&nbsp; MOUSE · AIM &nbsp;|&nbsp; CLICK · FIRE &nbsp;|&nbsp; R · RELOAD</div>
  <div id="wave-msg" id="wave-msg"></div>
</div>
<div id="title-screen">
  <h1>VOID HUNTER</h1>
  <p>FIRST PERSON SHOOTER</p>
  <button id="start-btn" onclick="startGame()">ENTER THE VOID</button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
let scene, camera, renderer, clock;
let enemies = [], bullets = [], walls = [];
let health = 100, ammo = 30, score = 0, reloading = false;
let keys = {}, mouse = { x: 0, y: 0 }, yaw = 0, pitch = 0;
let moveSpeed = 8, gameActive = false, wave = 1;
const ENEMY_HP = [3,5,8];

function startGame() {
  document.getElementById('title-screen').style.display = 'none';
  initThree();
  buildArena();
  spawnWave();
  document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyR' && !reloading && ammo < 30) reload();
  });
  document.addEventListener('keyup', e => keys[e.code] = false);
  document.addEventListener('click', () => {
    if (!gameActive) return;
    if (!document.pointerLockElement) { document.body.requestPointerLock(); return; }
    shoot();
  });
  document.addEventListener('mousemove', e => {
    if (!document.pointerLockElement) return;
    yaw -= e.movementX * 0.002;
    pitch = Math.max(-1.2, Math.min(1.2, pitch - e.movementY * 0.002));
  });
  gameActive = true;
  animate();
}

function initThree() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000a0f, 0.06);
  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 200);
  camera.position.set(0, 1.7, 0);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('c'), antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = true;
  clock = new THREE.Clock();
  scene.add(new THREE.AmbientLight(0x001122, 0.5));
  let pt = new THREE.PointLight(0x0088ff, 2, 30);
  pt.position.set(0, 8, 0);
  scene.add(pt);
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

function buildArena() {
  const floorG = new THREE.PlaneGeometry(60, 60);
  const floorM = new THREE.MeshLambertMaterial({ color: 0x001a1a });
  const floor = new THREE.Mesh(floorG, floorM);
  floor.rotation.x = -Math.PI/2; scene.add(floor);

  const ceilG = new THREE.PlaneGeometry(60, 60);
  const ceil = new THREE.Mesh(ceilG, new THREE.MeshLambertMaterial({ color: 0x000d0d }));
  ceil.rotation.x = Math.PI/2; ceil.position.y = 5; scene.add(ceil);

  // Outer walls
  const wallM = new THREE.MeshLambertMaterial({ color: 0x002233 });
  const makeWall = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wallM);
    m.position.set(x, y, z); scene.add(m);
    walls.push(m);
  };
  makeWall(60, 5, 1, 0, 2.5, -30);
  makeWall(60, 5, 1, 0, 2.5, 30);
  makeWall(1, 5, 60, -30, 2.5, 0);
  makeWall(1, 5, 60, 30, 2.5, 0);

  // Pillars
  for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) {
    if (Math.abs(i)+Math.abs(j) > 1) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(2, 5, 2),
        new THREE.MeshLambertMaterial({ color: 0x003344 }));
      p.position.set(i*10, 2.5, j*10); scene.add(p); walls.push(p);
    }
  }

  // Neon grid lines on floor
  for (let i = -5; i <= 5; i++) {
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-30, 0.01, i*6), new THREE.Vector3(30, 0.01, i*6)
    ]);
    scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0x003344 })));
    const g2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(i*6, 0.01, -30), new THREE.Vector3(i*6, 0.01, 30)
    ]);
    scene.add(new THREE.Line(g2, new THREE.LineBasicMaterial({ color: 0x003344 })));
  }
}

function spawnWave() {
  const count = 5 + wave * 2;
  for (let i = 0; i < count; i++) {
    setTimeout(() => spawnEnemy(), i * 500);
  }
  const wm = document.getElementById('wave-msg');
  wm.textContent = `WAVE ${wave}`;
  wm.style.display = 'block';
  setTimeout(() => wm.style.display = 'none', 2000);
}

function spawnEnemy() {
  const tier = Math.min(wave - 1, 2);
  const colors = [0xff2200, 0xff6600, 0xff00ff];
  const geo = new THREE.BoxGeometry(0.8, 1.6, 0.8);
  const mat = new THREE.MeshLambertMaterial({ color: colors[tier], emissive: colors[tier], emissiveIntensity: 0.3 });
  const e = new THREE.Mesh(geo, mat);
  const angle = Math.random() * Math.PI * 2;
  const dist = 15 + Math.random() * 10;
  e.position.set(Math.cos(angle)*dist, 0.8, Math.sin(angle)*dist);
  e.userData = { hp: ENEMY_HP[tier], speed: 1.5 + wave * 0.3, tier };
  // Eye lights
  const eyeL = new THREE.PointLight(colors[tier], 1, 3);
  eyeL.position.set(-0.2, 0.3, -0.5); e.add(eyeL);
  scene.add(e); enemies.push(e);
}

function shoot() {
  if (ammo <= 0) { reload(); return; }
  ammo--;
  document.getElementById('ammo').firstChild.textContent = ammo;

  const dir = new THREE.Vector3(0, 0, -1);
  dir.applyQuaternion(camera.quaternion);

  // Muzzle flash
  const flash = new THREE.PointLight(0xffaa00, 5, 8);
  camera.add(flash);
  setTimeout(() => camera.remove(flash), 50);
  scene.add(camera);

  // Raycast against enemies
  const ray = new THREE.Raycaster(camera.position, dir);
  const hits = ray.intersectObjects(enemies);
  if (hits.length > 0) {
    const e = hits[0].object;
    e.userData.hp--;
    flashHit();
    if (e.userData.hp <= 0) killEnemy(e);
  }

  // Visual bullet tracer
  const pts = [camera.position.clone(), camera.position.clone().addScaledVector(dir, 30)];
  const lg = new THREE.BufferGeometry().setFromPoints(pts);
  const line = new THREE.Line(lg, new THREE.LineBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 }));
  scene.add(line);
  setTimeout(() => scene.remove(line), 80);
}

function flashHit() {
  const f = document.getElementById('hit-flash');
  f.style.background = 'rgba(255,0,0,0.3)';
  setTimeout(() => f.style.background = 'rgba(255,0,0,0)', 80);
}

function killEnemy(e) {
  scene.remove(e);
  enemies = enemies.filter(x => x !== e);
  score += (e.userData.tier + 1) * 10;
  document.getElementById('score-num').textContent = score;

  // Particle burst
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.1),
      new THREE.MeshBasicMaterial({ color: 0xff4400 })
    );
    p.position.copy(e.position);
    p.userData.vel = new THREE.Vector3((Math.random()-0.5)*5, Math.random()*5, (Math.random()-0.5)*5);
    p.userData.life = 0.5;
    scene.add(p); bullets.push(p);
  }

  if (enemies.length === 0) {
    wave++;
    setTimeout(spawnWave, 2000);
  }
}

function reload() {
  if (reloading) return;
  reloading = true;
  document.getElementById('reload-msg').style.display = 'block';
  setTimeout(() => {
    ammo = 30;
    reloading = false;
    document.getElementById('ammo').firstChild.textContent = 30;
    document.getElementById('reload-msg').style.display = 'none';
  }, 2000);
}

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  if (!gameActive) return;

  // Player movement
  const moveDir = new THREE.Vector3();
  if (keys['KeyW']) moveDir.z -= 1;
  if (keys['KeyS']) moveDir.z += 1;
  if (keys['KeyA']) moveDir.x -= 1;
  if (keys['KeyD']) moveDir.x += 1;
  moveDir.normalize().multiplyScalar(moveSpeed * dt);
  moveDir.applyEuler(new THREE.Euler(0, yaw, 0));
  const np = camera.position.clone().add(moveDir);
  if (Math.abs(np.x) < 28 && Math.abs(np.z) < 28) camera.position.copy(np);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = yaw;
  camera.rotation.x = pitch;

  // Enemy AI
  enemies.forEach(e => {
    const dir = camera.position.clone().sub(e.position).setY(0).normalize();
    e.position.addScaledVector(dir, e.userData.speed * dt);
    e.lookAt(camera.position);
    if (e.position.distanceTo(camera.position) < 1.2) {
      health -= 15 * dt;
      health = Math.max(0, health);
      document.getElementById('health-fill').style.width = health + '%';
      document.getElementById('hit-flash').style.background = 'rgba(255,0,0,0.15)';
      setTimeout(() => document.getElementById('hit-flash').style.background = '', 100);
    }
  });

  // Particle update
  bullets = bullets.filter(p => {
    if (p.userData.life !== undefined) {
      p.userData.life -= dt;
      p.userData.vel.y -= 9.8 * dt;
      p.position.addScaledVector(p.userData.vel, dt);
      if (p.userData.life <= 0) { scene.remove(p); return false; }
      return true;
    }
    return false;
  });

  renderer.render(scene, camera);
}
</script>
</body>
</html>