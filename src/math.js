export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}
