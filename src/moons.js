import { clamp, degToRad } from './math.js';

const MOON_REF_DIAMETER_KM = 3474;
const MOON_REF_RADIUS = 0.15;
const MOON_MIN_RADIUS = 0.03;
const MOON_MAX_RADIUS = 0.22;
const EARTH_MOON_INCLINATION_DEG = 5.14;
const MOON_PHASE_STEP = 2.399963;

export function moonVisualRadius(diameterKm) {
  const scaled = MOON_REF_RADIUS * Math.pow(diameterKm / MOON_REF_DIAMETER_KM, 0.35);
  return clamp(scaled, MOON_MIN_RADIUS, MOON_MAX_RADIUS);
}

export function moonOrbitRadius(index, config) {
  return config.base + index * config.step;
}

export function moonInclination(index, parentName) {
  if (parentName === 'Earth') return degToRad(EARTH_MOON_INCLINATION_DEG);
  return degToRad(2 + (index * 7.3) % 12);
}

export function moonPhase(index) {
  return (index * MOON_PHASE_STEP) % (2 * Math.PI);
}

export function buildMoonState(moonData, index, parentName, orbitConfig) {
  return {
    orbitRadius: moonOrbitRadius(index, orbitConfig),
    period: moonData.period,
    inclination: moonInclination(index, parentName),
    phase: moonPhase(index),
    retrograde: !!moonData.retrograde,
    visualRadius: moonVisualRadius(moonData.diameter),
  };
}
