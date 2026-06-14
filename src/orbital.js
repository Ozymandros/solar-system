import * as THREE from 'three';
import { DISTANCE_SCALE, DEG } from './constants.js';

export function solveKepler(M, e) {
  let E = M;
  for (let k = 0; k < 10; k++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  return E;
}

export function orbitalToScene(xOrb, yOrb, data) {
  const w = data.ω * DEG;
  const inc = data.i * DEG;
  const O = data.Ω * DEG;

  const x1 = xOrb * Math.cos(w) - yOrb * Math.sin(w);
  const y1 = xOrb * Math.sin(w) + yOrb * Math.cos(w);

  const x2 = x1;
  const y2 = y1 * Math.cos(inc);
  const z2 = y1 * Math.sin(inc);

  const xEcl = x2 * Math.cos(O) - y2 * Math.sin(O);
  const yEcl = x2 * Math.sin(O) + y2 * Math.cos(O);
  const zEcl = z2;

  return new THREE.Vector3(
    xEcl * DISTANCE_SCALE,
    zEcl * DISTANCE_SCALE,
    yEcl * DISTANCE_SCALE
  );
}

export function getPlanetPosition(data, t) {
  let M = (data.M0 + (360 / data.period) * t) * DEG;
  M = M % (2 * Math.PI);
  if (M < 0) M += 2 * Math.PI;

  const E = solveKepler(M, data.e);

  const xOrb = data.a * (Math.cos(E) - data.e);
  const yOrb = data.a * Math.sqrt(1 - data.e * data.e) * Math.sin(E);

  return orbitalToScene(xOrb, yOrb, data);
}

export function getMoonOffset(moon, t) {
  const direction = moon.retrograde ? -1 : 1;
  const angle = moon.phase + direction * 2 * Math.PI * (t / moon.period);
  const r = moon.orbitRadius;
  return new THREE.Vector3(
    r * Math.cos(angle),
    r * Math.sin(angle) * Math.sin(moon.inclination),
    r * Math.sin(angle) * Math.cos(moon.inclination)
  );
}

export function getHeliocentricDistanceAU(data, t) {
  return getPlanetPosition(data, t).length() / DISTANCE_SCALE;
}
