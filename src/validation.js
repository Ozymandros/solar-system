import { planetsData } from './data/planets.js';
import { moonsData, MOON_ORBIT_CONFIG } from './data/moons.js';
import { textureFiles } from './data/textures.js';
import { planetInfo } from './data/planet-info.js';
import { TRACKABLE_NAMES } from './trackables.js';

export function validatePlanetData(planets) {
  const errors = [];

  if (planets.length !== 8) {
    errors.push(`expected 8 planets, found ${planets.length}`);
  }

  for (const planet of planets) {
    if (!planet.name) errors.push('planet missing name');
    if (planet.a <= 0) errors.push(`${planet.name}: semi-major axis must be positive`);
    if (planet.e < 0 || planet.e >= 1) errors.push(`${planet.name}: eccentricity must be in [0, 1)`);
    if (planet.period <= 0) errors.push(`${planet.name}: orbital period must be positive`);
    if (planet.radius <= 0) errors.push(`${planet.name}: radius must be positive`);
  }

  const names = planets.map((planet) => planet.name);
  if (new Set(names).size !== names.length) {
    errors.push('planet names must be unique');
  }

  return errors;
}

export function validateMoonsData(moons, orbitConfig) {
  const errors = [];

  for (const [parent, moonList] of Object.entries(moons)) {
    if (!orbitConfig[parent]) {
      errors.push(`${parent}: missing MOON_ORBIT_CONFIG entry`);
    }

    for (const moon of moonList) {
      if (!moon.name) errors.push(`${parent}: moon missing name`);
      if (moon.diameter <= 0) errors.push(`${parent}/${moon.name}: diameter must be positive`);
      if (moon.period <= 0) errors.push(`${parent}/${moon.name}: period must be positive`);
    }

    const moonNames = moonList.map((moon) => moon.name);
    if (new Set(moonNames).size !== moonNames.length) {
      errors.push(`${parent}: moon names must be unique`);
    }
  }

  return errors;
}

export function validatePlanetInfo(info, planets, trackableNames) {
  const errors = [];

  for (const name of trackableNames) {
    if (!info[name]) {
      errors.push(`missing planetInfo for trackable body: ${name}`);
      continue;
    }

    const entry = info[name];
    for (const field of ['type', 'diameter', 'dayLength', 'yearLength', 'surfaceTemp', 'atmosphere', 'funFact', 'color']) {
      if (entry[field] == null || entry[field] === '') {
        errors.push(`${name}: missing ${field}`);
      }
    }
  }

  for (const planet of planets) {
    if (!info[planet.name]) {
      errors.push(`missing planetInfo for planet: ${planet.name}`);
    }
  }

  return errors;
}

export function validateTextureFiles(textures, planets) {
  const errors = [];

  if (!textures.Sun) errors.push('missing Sun texture mapping');

  for (const planet of planets) {
    if (!textures[planet.name]) {
      errors.push(`missing texture mapping for ${planet.name}`);
    } else if (!textures[planet.name].startsWith('textures/')) {
      errors.push(`${planet.name}: texture path must live under textures/`);
    }
  }

  return errors;
}

export function validateSolarSystemData({
  planets = planetsData,
  moons = moonsData,
  orbitConfig = MOON_ORBIT_CONFIG,
  info = planetInfo,
  textures = textureFiles,
  trackableNames = TRACKABLE_NAMES,
} = {}) {
  return [
    ...validatePlanetData(planets),
    ...validateMoonsData(moons, orbitConfig),
    ...validatePlanetInfo(info, planets, trackableNames),
    ...validateTextureFiles(textures, planets),
  ];
}
