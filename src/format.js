import { AU_KM, DISTANCE_SCALE } from './constants.js';

export function sceneDistanceToAU(sceneDistance) {
  return sceneDistance / DISTANCE_SCALE;
}

export function formatPlanetDistanceLabel(sceneDistance) {
  const distAU = sceneDistanceToAU(sceneDistance);
  const distMkm = (distAU * AU_KM) / 1e6;
  return `${distAU.toFixed(3)} AU · ${distMkm.toFixed(1)} M km`;
}
