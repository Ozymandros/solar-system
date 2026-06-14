import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { SIM_RATE, SUN_RADIUS } from './src/constants.js';
import { planetsData } from './src/data/planets.js';
import { moonsData, MOON_ORBIT_CONFIG, moonColors } from './src/data/moons.js';
import { textureFiles } from './src/data/textures.js';
import { formatPlanetDistanceLabel } from './src/format.js';
import { isPointerClick, pointerToNormalizedDeviceCoords } from './src/input.js';
import { buildMoonState, moonVisualRadius } from './src/moons.js';
import { getMoonOffset, getPlanetPosition, orbitalToScene } from './src/orbital.js';
import { makeGlowTexture, makeRingTexture, makeSunTexture } from './src/textures.js';
import { buildTrackables, findTrackableByName, getDesiredCameraDistance } from './src/trackables.js';
import { createInfoPanelUpdater } from './src/ui/info-panel.js';

const CAN_LOAD_LOCAL_TEXTURES = window.location.protocol !== 'file:';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 60, 110);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.id = 'label-container';
document.body.appendChild(labelRenderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 1;
controls.maxDistance = 3000;

const sunLight = new THREE.PointLight(0xfff2dd, 1.5, 0, 0);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

const sunMaterial = new THREE.MeshBasicMaterial({ map: makeSunTexture() });
const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(SUN_RADIUS, 64, 64), sunMaterial);
sunMesh.name = 'Sun';
sunMesh.userData.planetName = 'Sun';
scene.add(sunMesh);

const glowSprite = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeGlowTexture(),
  blending: THREE.AdditiveBlending,
  transparent: true,
  depthWrite: false,
}));
glowSprite.scale.set(15, 15, 1);
scene.add(glowSprite);

const textureLoader = new THREE.TextureLoader();
function tryLoadTexture(url, material) {
  if (!CAN_LOAD_LOCAL_TEXTURES) return;
  textureLoader.load(
    url,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      material.map = tex;
      material.color.set(0xffffff);
      material.needsUpdate = true;
    },
    undefined,
    () => {
      material.map = null;
      material.needsUpdate = true;
    }
  );
}

if (CAN_LOAD_LOCAL_TEXTURES) {
  textureLoader.load(textureFiles.Sun, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    sunMaterial.map = tex;
    sunMaterial.needsUpdate = true;
  }, undefined, () => { /* keep canvas sun */ });
} else {
  const warn = document.createElement('div');
  warn.id = 'file-warning';
  warn.innerHTML =
    'Opened via <code>file://</code> — planet textures are disabled (browser CORS). ' +
    'Run <code>serve.bat</code> or <code>python -m http.server 8080</code>, then open ' +
    '<a href="http://localhost:8080/index.html">http://localhost:8080/index.html</a>';
  document.body.appendChild(warn);
}

const planets = [];
const planetMeshes = [];

for (const data of planetsData) {
  const group = new THREE.Group();
  group.name = data.name + 'Group';

  const material = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: 0.9,
    metalness: 0.0,
  });
  tryLoadTexture(textureFiles[data.name], material);

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.radius, 64, 64), material);
  mesh.name = data.name;
  mesh.userData.planetName = data.name;
  group.add(mesh);

  if (data.name === 'Saturn') {
    const ringGeo = new THREE.RingGeometry(2.2, 3.0, 64);
    const pos = ringGeo.attributes.position;
    const uv = ringGeo.attributes.uv;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const r = v3.length();
      uv.setXY(i, (r - 2.2) / (3.0 - 2.2), 0.5);
    }
    uv.needsUpdate = true;

    const ringMat = new THREE.MeshBasicMaterial({
      map: makeRingTexture(),
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2 + THREE.MathUtils.degToRad(26.7);
    group.add(ring);
  }

  scene.add(group);
  const entry = { data, group, mesh };

  const labelEl = document.createElement('div');
  labelEl.className = 'planet-label';
  const nameEl = document.createElement('span');
  nameEl.className = 'label-name';
  nameEl.textContent = data.name;
  const distEl = document.createElement('span');
  distEl.className = 'label-dist';
  distEl.textContent = '— AU';
  labelEl.appendChild(nameEl);
  labelEl.appendChild(distEl);
  labelEl.addEventListener('click', (e) => {
    e.stopPropagation();
    selectPlanet(entry);
  });

  const labelObj = new CSS2DObject(labelEl);
  labelObj.position.set(0, data.radius * 1.6 + 0.4, 0);
  group.add(labelObj);

  entry.labelEl = labelEl;
  entry.distEl = distEl;
  entry.labelObj = labelObj;

  planets.push(entry);
  planetMeshes.push(mesh);
}

const moons = [];
const planetMap = Object.fromEntries(planets.map((p) => [p.data.name, p]));
let earthMoonMesh = null;

for (const [parentName, moonList] of Object.entries(moonsData)) {
  const parentEntry = planetMap[parentName];
  if (!parentEntry) continue;
  const orbitConfig = MOON_ORBIT_CONFIG[parentName];

  moonList.forEach((moonData, index) => {
    const moonState = buildMoonState(moonData, index, parentName, orbitConfig);
    const color = moonColors[moonData.name] ?? 0x999999;
    const material = new THREE.MeshStandardMaterial({ color, roughness: 1.0 });
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(moonState.visualRadius, 16, 16),
      material
    );
    mesh.name = moonData.name;

    if (parentName === 'Earth' && moonData.name === 'Moon') {
      mesh.userData.planetName = 'Moon';
      earthMoonMesh = mesh;
    }

    scene.add(mesh);
    moons.push({
      mesh,
      parentEntry,
      ...moonState,
    });
  });
}

const sunEntry = { data: { name: 'Sun', radius: SUN_RADIUS }, group: sunMesh, mesh: sunMesh };
const moonEntry = {
  data: { name: 'Moon', radius: earthMoonMesh ? moonVisualRadius(3474) : 0.15 },
  group: earthMoonMesh,
  mesh: earthMoonMesh,
};

const trackables = buildTrackables(sunEntry, planets, moonEntry);
const selectableBodies = trackables.map((t) => t.mesh);

const orbitLines = [];
for (const data of planetsData) {
  const points = [];
  for (let j = 0; j <= 360; j++) {
    const E = (j / 360) * 2 * Math.PI;
    const xOrb = data.a * (Math.cos(E) - data.e);
    const yOrb = data.a * Math.sqrt(1 - data.e * data.e) * Math.sin(E);
    points.push(orbitalToScene(xOrb, yOrb, data));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color: data.color,
    transparent: true,
    opacity: 0.3,
  });
  const line = new THREE.Line(geo, mat);
  scene.add(line);
  orbitLines.push(line);
}

{
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < starCount; i++) {
    v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
      .normalize()
      .multiplyScalar(1800 + Math.random() * 400);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2.0,
    sizeAttenuation: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));
}

const planetSelect = document.getElementById('planet-select');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const orbitsToggle = document.getElementById('orbits-toggle');
const labelsToggle = document.getElementById('labels-toggle');
const selectedNameEl = document.getElementById('selected-name');

for (const t of trackables) {
  const opt = document.createElement('option');
  opt.value = t.data.name;
  opt.textContent = t.data.name;
  planetSelect.appendChild(opt);
}

let timeSpeed = parseFloat(speedSlider.value);
let selectedPlanet = null;
let cameraTransition = 0;
let desiredDistance = 0;

speedSlider.addEventListener('input', () => {
  timeSpeed = parseFloat(speedSlider.value);
  speedValue.textContent = speedSlider.value;
});

orbitsToggle.addEventListener('change', () => {
  for (const line of orbitLines) line.visible = orbitsToggle.checked;
});

labelsToggle.addEventListener('change', () => {
  for (const p of planets) p.labelObj.visible = labelsToggle.checked;
});

const infoPanel = document.getElementById('info-panel');
const updateInfoPanel = createInfoPanelUpdater({
  panel: infoPanel,
  name: document.getElementById('planet-name'),
  icon: document.getElementById('planet-icon'),
  type: document.getElementById('info-type'),
  diameter: document.getElementById('info-diameter'),
  day: document.getElementById('info-day'),
  year: document.getElementById('info-year'),
  temp: document.getElementById('info-temp'),
  atmosphere: document.getElementById('info-atmosphere'),
  funFact: document.getElementById('info-funfact'),
  moons: document.getElementById('info-moons'),
  distanceRow: document.getElementById('row-distance'),
  distance: document.getElementById('info-distance'),
});

function hideInfoPanel() {
  infoPanel.classList.add('hidden');
}

document.getElementById('close-panel').addEventListener('click', (e) => {
  e.stopPropagation();
  selectPlanet(null);
});

function selectPlanet(entry) {
  selectedPlanet = entry;
  for (const p of planets) p.labelEl.classList.toggle('tracked', p === entry);
  if (entry) {
    planetSelect.value = entry.data.name;
    selectedNameEl.textContent = 'Tracking: ' + entry.data.name;
    cameraTransition = 1.0;
    desiredDistance = getDesiredCameraDistance(entry.data.radius);
    updateInfoPanel(entry.data.name);
  } else {
    planetSelect.value = 'free';
    selectedNameEl.textContent = 'Tracking: —';
    cameraTransition = 0;
    hideInfoPanel();
  }
}

planetSelect.addEventListener('change', () => {
  if (planetSelect.value === 'free') {
    selectPlanet(null);
  } else {
    selectPlanet(findTrackableByName(trackables, planetSelect.value));
  }
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downX = 0;
let downY = 0;

renderer.domElement.addEventListener('pointerdown', (e) => {
  downX = e.clientX;
  downY = e.clientY;
});

renderer.domElement.addEventListener('pointerup', (e) => {
  const dx = e.clientX - downX;
  const dy = e.clientY - downY;
  if (!isPointerClick(dx, dy)) return;
  if (e.button !== 0) return;

  const ndc = pointerToNormalizedDeviceCoords(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
  pointer.x = ndc.x;
  pointer.y = ndc.y;
  raycaster.setFromCamera(pointer, camera);

  const hits = raycaster.intersectObjects(selectableBodies, false);
  if (hits.length > 0) {
    const planetName = hits[0].object.userData.planetName;
    selectPlanet(findTrackableByName(trackables, planetName));
  } else {
    selectPlanet(null);
  }
});

renderer.domElement.addEventListener('mousemove', (e) => {
  const ndc = pointerToNormalizedDeviceCoords(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
  pointer.x = ndc.x;
  pointer.y = ndc.y;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(selectableBodies, false);
  renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
});

const clock = new THREE.Clock();
let simTime = 0;
let labelTimer = 1;
const tmpTarget = new THREE.Vector3();
const tmpDelta = new THREE.Vector3();
const tmpDir = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.1);
  simTime += dt * timeSpeed * SIM_RATE;

  sunMesh.rotation.y += dt * 0.05;

  for (const p of planets) {
    p.group.position.copy(getPlanetPosition(p.data, simTime));
    p.mesh.rotation.y += dt * 0.3;
  }

  for (const moon of moons) {
    moon.mesh.position.copy(moon.parentEntry.group.position).add(getMoonOffset(moon, simTime));
    moon.mesh.rotation.y += dt * 0.3;
  }

  labelTimer += dt;
  if (labelTimer > 0.1) {
    labelTimer = 0;
    for (const p of planets) {
      p.distEl.textContent = formatPlanetDistanceLabel(p.group.position.length());
    }
  }

  if (selectedPlanet) {
    const planetPos = selectedPlanet.group.position;

    if (cameraTransition > 0) {
      cameraTransition -= dt;

      tmpTarget.copy(controls.target).lerp(planetPos, 1 - Math.pow(0.001, dt));
      tmpDelta.copy(tmpTarget).sub(controls.target);
      camera.position.add(tmpDelta);
      controls.target.copy(tmpTarget);

      const currentDist = camera.position.distanceTo(controls.target);
      tmpDir.copy(camera.position).sub(controls.target).normalize();
      const newDist = THREE.MathUtils.lerp(currentDist, desiredDistance, 1 - Math.pow(0.01, dt));
      camera.position.copy(controls.target).addScaledVector(tmpDir, newDist);

      if (controls.target.distanceTo(planetPos) < 0.05) cameraTransition = 0;
    } else {
      tmpDelta.copy(planetPos).sub(controls.target);
      camera.position.add(tmpDelta);
      controls.target.copy(planetPos);
    }
  }

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
