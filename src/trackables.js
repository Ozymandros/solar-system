export const TRACKABLE_NAMES = [
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
];

export function buildTrackables(sunEntry, planets, moonEntry) {
  return [
    sunEntry,
    ...planets.slice(0, 3),
    moonEntry,
    ...planets.slice(3),
  ];
}

export function findTrackableByName(trackables, name) {
  return trackables.find((entry) => entry.data.name === name) ?? null;
}

export function getDesiredCameraDistance(radius, minimum = 1.5, multiplier = 8) {
  return Math.max(radius * multiplier, minimum);
}
