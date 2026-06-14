import { describe, expect, it } from 'vitest';
import { clamp, degToRad } from '../src/math.js';

describe('clamp', () => {
  it('returns the value when inside bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps to the minimum', () => {
    expect(clamp(-2, 0, 10)).toBe(0);
  });

  it('clamps to the maximum', () => {
    expect(clamp(12, 0, 10)).toBe(10);
  });
});

describe('degToRad', () => {
  it('converts degrees to radians', () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
    expect(degToRad(90)).toBeCloseTo(Math.PI / 2, 10);
  });
});
