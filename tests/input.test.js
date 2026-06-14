import { describe, expect, it } from 'vitest';
import { isPointerClick, pointerToNormalizedDeviceCoords } from '../src/input.js';

describe('isPointerClick', () => {
  it('treats small movement as a click', () => {
    expect(isPointerClick(0, 0)).toBe(true);
    expect(isPointerClick(3, 4)).toBe(true);
  });

  it('treats large movement as a drag', () => {
    expect(isPointerClick(10, 0)).toBe(false);
    expect(isPointerClick(0, 8)).toBe(false);
  });

  it('respects a custom threshold', () => {
    expect(isPointerClick(8, 0, 10)).toBe(true);
    expect(isPointerClick(12, 0, 10)).toBe(false);
  });
});

describe('pointerToNormalizedDeviceCoords', () => {
  it('maps the viewport center to the origin', () => {
    expect(pointerToNormalizedDeviceCoords(400, 300, 800, 600)).toEqual({ x: 0, y: 0 });
  });

  it('maps the top-left corner to (-1, 1)', () => {
    expect(pointerToNormalizedDeviceCoords(0, 0, 800, 600)).toEqual({ x: -1, y: 1 });
  });

  it('maps the bottom-right corner to (1, -1)', () => {
    expect(pointerToNormalizedDeviceCoords(800, 600, 800, 600)).toEqual({ x: 1, y: -1 });
  });
});
