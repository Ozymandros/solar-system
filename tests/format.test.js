import { describe, expect, it } from 'vitest';
import { formatPlanetDistanceLabel, sceneDistanceToAU } from '../src/format.js';
import { DISTANCE_SCALE } from '../src/constants.js';

describe('sceneDistanceToAU', () => {
  it('converts scene units using DISTANCE_SCALE', () => {
    expect(sceneDistanceToAU(DISTANCE_SCALE)).toBe(1);
    expect(sceneDistanceToAU(DISTANCE_SCALE * 2)).toBe(2);
  });
});

describe('formatPlanetDistanceLabel', () => {
  it('formats one AU as expected', () => {
    expect(formatPlanetDistanceLabel(DISTANCE_SCALE)).toBe('1.000 AU · 149.6 M km');
  });

  it('formats fractional AU distances', () => {
    const label = formatPlanetDistanceLabel(DISTANCE_SCALE * 0.387);
    expect(label).toMatch(/^0\.387 AU · /);
    expect(label).toContain('M km');
  });
});
