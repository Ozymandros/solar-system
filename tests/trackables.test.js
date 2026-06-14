import { describe, expect, it } from 'vitest';
import {
  TRACKABLE_NAMES,
  buildTrackables,
  findTrackableByName,
  getDesiredCameraDistance,
} from '../src/trackables.js';

describe('TRACKABLE_NAMES', () => {
  it('lists bodies in UI display order', () => {
    expect(TRACKABLE_NAMES).toEqual([
      'Sun',
      'Mercury',
      'Venus',
      'Earth',
      'Moon',
      'Mars',
      'Jupiter',
      'Saturn',
      'Uranus',
      'Neptune',
    ]);
  });
});

describe('buildTrackables', () => {
  it('inserts the Moon between Earth and Mars', () => {
    const planets = [
      { data: { name: 'Mercury' } },
      { data: { name: 'Venus' } },
      { data: { name: 'Earth' } },
      { data: { name: 'Mars' } },
      { data: { name: 'Jupiter' } },
    ];
    const trackables = buildTrackables(
      { data: { name: 'Sun' } },
      planets,
      { data: { name: 'Moon' } }
    );

    expect(trackables.map((entry) => entry.data.name)).toEqual([
      'Sun',
      'Mercury',
      'Venus',
      'Earth',
      'Moon',
      'Mars',
      'Jupiter',
    ]);
  });
});

describe('findTrackableByName', () => {
  const trackables = [
    { data: { name: 'Sun' } },
    { data: { name: 'Earth' } },
  ];

  it('returns the matching entry', () => {
    expect(findTrackableByName(trackables, 'Earth')).toEqual(trackables[1]);
  });

  it('returns null when not found', () => {
    expect(findTrackableByName(trackables, 'Pluto')).toBeNull();
  });
});

describe('getDesiredCameraDistance', () => {
  it('uses radius times multiplier when above the minimum', () => {
    expect(getDesiredCameraDistance(2)).toBe(16);
  });

  it('enforces the minimum framing distance', () => {
    expect(getDesiredCameraDistance(0.1)).toBe(1.5);
  });
});
