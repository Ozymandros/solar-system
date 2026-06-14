import { describe, expect, it } from 'vitest';
import {
  validatePlanetData,
  validateMoonsData,
  validatePlanetInfo,
  validateTextureFiles,
} from '../src/validation.js';
import { planetsData } from '../src/data/planets.js';
import { moonsData, MOON_ORBIT_CONFIG } from '../src/data/moons.js';
import { planetInfo } from '../src/data/planet-info.js';
import { textureFiles } from '../src/data/textures.js';
import { TRACKABLE_NAMES } from '../src/trackables.js';

describe('validation helpers', () => {
  it('detects invalid planet orbital elements', () => {
    const errors = validatePlanetData([
      { name: 'Bad', a: -1, e: 1.2, period: 0, radius: 0 },
    ]);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((error) => error.includes('semi-major axis'))).toBe(true);
    expect(errors.some((error) => error.includes('eccentricity'))).toBe(true);
  });

  it('detects missing moon orbit config', () => {
    const errors = validateMoonsData({ Fake: [{ name: 'X', diameter: 10, period: 1 }] }, {});
    expect(errors.some((error) => error.includes('MOON_ORBIT_CONFIG'))).toBe(true);
  });

  it('detects missing info panel entries', () => {
    const errors = validatePlanetInfo({}, planetsData, TRACKABLE_NAMES);
    expect(errors.some((error) => error.includes('missing planetInfo'))).toBe(true);
  });

  it('detects missing texture mappings', () => {
    const errors = validateTextureFiles({ Sun: 'textures/2k_sun.jpg' }, planetsData);
    expect(errors.some((error) => error.includes('missing texture mapping'))).toBe(true);
  });

  it('accepts the production dataset', () => {
    expect(validatePlanetData(planetsData)).toEqual([]);
    expect(validateMoonsData(moonsData, MOON_ORBIT_CONFIG)).toEqual([]);
    expect(validatePlanetInfo(planetInfo, planetsData, TRACKABLE_NAMES)).toEqual([]);
    expect(validateTextureFiles(textureFiles, planetsData)).toEqual([]);
  });
});
