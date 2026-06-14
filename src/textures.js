import * as THREE from 'three';

export function makeSunTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, '#fff7d6');
  grad.addColorStop(0.4, '#ffd24a');
  grad.addColorStop(0.8, '#ff9220');
  grad.addColorStop(1.0, '#e85e00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 2 + 0.5;
    const a = Math.random() * 0.12;
    ctx.fillStyle = Math.random() > 0.5
      ? `rgba(255, 255, 220, ${a})`
      : `rgba(200, 80, 0, ${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, 'rgba(255, 240, 200, 1.0)');
  grad.addColorStop(0.25, 'rgba(255, 200, 90, 0.55)');
  grad.addColorStop(0.55, 'rgba(255, 140, 40, 0.18)');
  grad.addColorStop(1.0, 'rgba(255, 100, 20, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeRingTexture() {
  const w = 256;
  const h = 16;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0.00, 'rgba(180, 150, 110, 0.0)');
  grad.addColorStop(0.10, 'rgba(200, 175, 135, 0.55)');
  grad.addColorStop(0.35, 'rgba(225, 200, 160, 0.85)');
  grad.addColorStop(0.50, 'rgba(150, 125, 95, 0.25)');
  grad.addColorStop(0.62, 'rgba(215, 190, 150, 0.75)');
  grad.addColorStop(0.88, 'rgba(190, 165, 125, 0.5)');
  grad.addColorStop(1.00, 'rgba(170, 145, 105, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
