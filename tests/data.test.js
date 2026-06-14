import { describe, expect, it } from 'vitest';
import { planetsData } from '../src/data/planets.js';
import { moonsData, countMoons, getMoonParents, MOON_ORBIT_CONFIG } from '../src/data/moons.js';
import { planetInfo } from '../src/data/planet-info.js';
import { textureFiles } from '../src/data/textures.js';
import { TRACKABLE_NAMES } from '../src/trackables.js';
import { validateSolarSystemData } from '../src/validation.js';

describe('solar system data integrity', () => {
  it('has no validation errors in the bundled dataset', () => {
    expect(validateSolarSystemData()).toEqual([]);
  });

  it('includes eight planets in canonical order', () => {
    expect(planetsData.map((planet) => planet.name)).toEqual([
      'Mercury',
      'Venus',
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune',
    ]);
  });

  it('includes 54 moons across six parents', () => {
    expect(countMoons(moonsData)).toBe(54);
    expect(getMoonParents(moonsData)).toEqual([
      'Earth',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune',
    ]);
  });

  it('defines orbit config for every moon parent', () => {
    for (const parent of getMoonParents(moonsData)) {
      expect(MOON_ORBIT_CONFIG[parent]).toBeDefined();
    }
  });

  it('provides info panel content for every trackable body', () => {
    for (const name of TRACKABLE_NAMES) {
      expect(planetInfo[name]).toBeDefined();
      expect(planetInfo[name].funFact.length).toBeGreaterThan(10);
    }
  });

  it('maps textures for the Sun and all planets', () => {
    expect(textureFiles.Sun).toBe('textures/2k_sun.jpg');
    for (const planet of planetsData) {
      expect(textureFiles[planet.name]).toMatch(/^textures\/2k_/);
    }
  });
});
