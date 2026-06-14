export function isPointerClick(dx, dy, threshold = 5) {
  return Math.hypot(dx, dy) <= threshold;
}

export function pointerToNormalizedDeviceCoords(clientX, clientY, width, height) {
  return {
    x: (clientX / width) * 2 - 1,
    y: -(clientY / height) * 2 + 1,
  };
}
