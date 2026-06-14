import { describe, expect, it } from 'vitest';
import { solveKepler, orbitalToScene, getPlanetPosition, getMoonOffset, getHeliocentricDistanceAU } from '../src/orbital.js';
import { planetsData } from '../src/data/planets.js';
import { DISTANCE_SCALE } from '../src/constants.js';

describe('solveKepler', () => {
  it('returns M for circular orbits (e = 0)', () => {
    expect(solveKepler(1.2, 0)).toBeCloseTo(1.2, 10);
  });

  it('satisfies Kepler equation E - e*sin(E) = M for elliptical orbits', () => {
    const M = 0.8;
    const e = 0.2;
    const E = solveKepler(M, e);
    expect(E - e * Math.sin(E)).toBeCloseTo(M, 8);
  });

  it('handles high eccentricity', () => {
    const M = 2.1;
    const e = 0.7;
    const E = solveKepler(M, e);
    expect(E - e * Math.sin(E)).toBeCloseTo(M, 6);
  });
});

describe('orbitalToScene', () => {
  it('maps a point on the ecliptic plane with zero angles to scaled X axis', () => {
    const data = { ω: 0, i: 0, Ω: 0 };
    const pos = orbitalToScene(1, 0, data);
    expect(pos.x).toBeCloseTo(DISTANCE_SCALE, 6);
    expect(pos.y).toBeCloseTo(0, 6);
    expect(pos.z).toBeCloseTo(0, 6);
  });

  it('applies inclination by moving Y component from orbital plane', () => {
    const data = { ω: 0, i: 90, Ω: 0 };
    const pos = orbitalToScene(0, 1, data);
    expect(pos.x).toBeCloseTo(0, 6);
    expect(pos.y).toBeCloseTo(DISTANCE_SCALE, 6);
    expect(pos.z).toBeCloseTo(0, 6);
  });
});

describe('getPlanetPosition', () => {
  const earth = planetsData.find((planet) => planet.name === 'Earth');

  it('returns a finite position for each planet at t = 0', () => {
    for (const planet of planetsData) {
      const pos = getPlanetPosition(planet, 0);
      expect(Number.isFinite(pos.x)).toBe(true);
      expect(Number.isFinite(pos.y)).toBe(true);
      expect(Number.isFinite(pos.z)).toBe(true);
    }
  });

  it('keeps Earth near 1 AU heliocentric distance', () => {
    const distAU = getHeliocentricDistanceAU(earth, 0);
    expect(distAU).toBeGreaterThan(0.9);
    expect(distAU).toBeLessThan(1.1);
  });

  it('changes position over part of an orbital period', () => {
    const start = getPlanetPosition(earth, 0);
    const midOrbit = getPlanetPosition(earth, earth.period / 4);
    expect(start.distanceTo(midOrbit)).toBeGreaterThan(0.01);
  });
});

describe('getMoonOffset', () => {
  const moon = {
    orbitRadius: 1,
    period: 10,
    inclination: 0,
    phase: 0,
    retrograde: false,
  };

  it('starts on the positive X axis at t = 0 with zero phase', () => {
    const offset = getMoonOffset(moon, 0);
    expect(offset.x).toBeCloseTo(1, 6);
    expect(offset.y).toBeCloseTo(0, 6);
    expect(offset.z).toBeCloseTo(0, 6);
  });

  it('returns to the starting point after one orbital period', () => {
    const start = getMoonOffset(moon, 0);
    const end = getMoonOffset(moon, moon.period);
    expect(start.distanceTo(end)).toBeCloseTo(0, 6);
  });

  it('orbits in the opposite direction when retrograde', () => {
    const prograde = getMoonOffset(moon, moon.period / 4);
    const retrograde = getMoonOffset({ ...moon, retrograde: true }, moon.period / 4);
    expect(prograde.x).toBeCloseTo(-retrograde.x, 4);
  });
});
