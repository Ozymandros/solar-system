import { describe, expect, it } from 'vitest';
import {
  moonVisualRadius,
  moonOrbitRadius,
  moonInclination,
  moonPhase,
  buildMoonState,
} from '../src/moons.js';
import { MOON_ORBIT_CONFIG } from '../src/data/moons.js';
import { degToRad } from '../src/math.js';

describe('moonVisualRadius', () => {
  it('returns reference radius for Earth Moon diameter', () => {
    expect(moonVisualRadius(3474)).toBeCloseTo(0.15, 6);
  });

  it('clamps very small moons to the minimum radius', () => {
    expect(moonVisualRadius(1)).toBe(0.03);
  });

  it('clamps very large moons to the maximum radius', () => {
    expect(moonVisualRadius(100000)).toBe(0.22);
  });

  it('scales larger moons above the minimum', () => {
    expect(moonVisualRadius(5000)).toBeGreaterThan(moonVisualRadius(100));
  });
});

describe('moonOrbitRadius', () => {
  it('uses only the base radius when step is zero', () => {
    expect(moonOrbitRadius(3, MOON_ORBIT_CONFIG.Earth)).toBe(0.8);
  });

  it('increases with index for stepped configs', () => {
    const config = MOON_ORBIT_CONFIG.Mars;
    expect(moonOrbitRadius(1, config)).toBeCloseTo(config.base + config.step, 6);
    expect(moonOrbitRadius(2, config)).toBeCloseTo(config.base + 2 * config.step, 6);
  });
});

describe('moonInclination', () => {
  it('uses a fixed Earth inclination', () => {
    expect(moonInclination(0, 'Earth')).toBeCloseTo(degToRad(5.14), 6);
    expect(moonInclination(5, 'Earth')).toBeCloseTo(degToRad(5.14), 6);
  });

  it('varies inclination for other parents', () => {
    const first = moonInclination(0, 'Jupiter');
    const second = moonInclination(1, 'Jupiter');
    expect(first).not.toBe(second);
  });
});

describe('moonPhase', () => {
  it('is deterministic for a given index', () => {
    expect(moonPhase(4)).toBe(moonPhase(4));
  });

  it('wraps within one revolution', () => {
    expect(moonPhase(1000)).toBeGreaterThanOrEqual(0);
    expect(moonPhase(1000)).toBeLessThan(2 * Math.PI);
  });
});

describe('buildMoonState', () => {
  it('combines orbit helpers into a runtime moon state', () => {
    const moonData = { name: 'Io', diameter: 3643, period: 1.77 };
    const state = buildMoonState(moonData, 2, 'Jupiter', MOON_ORBIT_CONFIG.Jupiter);

    expect(state.period).toBe(1.77);
    expect(state.retrograde).toBe(false);
    expect(state.orbitRadius).toBe(moonOrbitRadius(2, MOON_ORBIT_CONFIG.Jupiter));
    expect(state.visualRadius).toBe(moonVisualRadius(3643));
  });

  it('marks retrograde moons', () => {
    const moonData = { name: 'Triton', diameter: 2707, period: 5.88, retrograde: true };
    const state = buildMoonState(moonData, 0, 'Neptune', MOON_ORBIT_CONFIG.Neptune);
    expect(state.retrograde).toBe(true);
  });
});
