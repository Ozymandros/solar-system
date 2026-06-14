# 3D Solar System Simulator

An interactive, browser-based 3D model of the Solar System built with [Three.js](https://threejs.org/). Explore the Sun, all eight planets, and **54 major moons** with real orbital mechanics, adjustable time speed, camera tracking, and an educational info panel.

No build step or install required — open the HTML file in a modern browser and fly through the solar system.

## Features

- **Keplerian orbits** — Planets follow elliptical paths using J2000.0 orbital elements (semi-major axis, eccentricity, inclination, etc.), solved with Kepler's equation.
- **54 moons (Tier 2)** — Major and inner moons of Earth, Mars, Jupiter, Saturn, Uranus, and Neptune, each on a simplified circular orbit with correct relative periods. Retrograde moons (Phoebe, Triton) orbit in the opposite direction.
- **Interactive camera** — Orbit, zoom, and pan freely, or lock the camera onto any selectable body.
- **Time control** — Speed simulation from 0× to 100× (at 1×, one real second equals ten simulated days).
- **Planet labels** — Name and live distance-from-Sun readout (AU and million km).
- **Info panel** — Click a planet (or the Sun / Earth's Moon) for diameter, orbital period, temperature, atmosphere, and a fun fact.
- **Visual polish** — Procedural sun texture and glow, Saturn's rings with Cassini-like gap, starfield background, and optional 2K surface textures.

## Quick Start

### Option 1: Local web server (required for textures)

Browsers **block loading local image files** (`textures/*.jpg`) when the page is opened via `file://` (double-click). This is a CORS security restriction — not a bug in the simulator.

Use any of these from the project folder:

```bash
# pnpm (recommended — see package.json)
pnpm install
pnpm start

# Windows: double-click serve.bat

# Python 3
python -m http.server 8080
```

Then open [http://localhost:8080/index.html](http://localhost:8080/index.html).

### Option 2: Open directly (no textures)

Double-click `solar-system.html` to run without a server. The simulator works with procedural/fallback colors, but **planet textures are skipped** to avoid CORS console errors. A banner at the bottom explains how to enable textures.

## Controls

| Input | Action |
|-------|--------|
| **Left-drag** | Rotate camera around the target |
| **Scroll** | Zoom in / out |
| **Right-drag** | Pan |
| **Click a planet** | Track it and open the info panel |
| **Click empty space** | Release tracking and close the panel |
| **Camera Target** dropdown | Jump to Sun, a planet, Earth's Moon, or free camera |
| **Time Speed** slider | Adjust simulation rate (0–100×) |
| **Show Orbits** | Toggle planetary orbit lines |
| **Show Labels** | Toggle planet name / distance labels |

Only the **Sun**, **planets**, and **Earth's Moon** are selectable. Other moons are rendered but not interactive.

## What's Included

### Planets

Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune — plus the Sun.

### Moons (54 total)

| Parent | Count | Notable moons |
|--------|------:|---------------|
| Earth | 1 | Moon (Luna) |
| Mars | 2 | Phobos, Deimos |
| Jupiter | 9 | Io, Europa, Ganymede, Callisto, Metis, Adrastea, Amalthea, Thebe, Himalia |
| Saturn | 15 | Titan, Rhea, Iapetus, Dione, Tethys, Enceladus, Mimas, Janus, Epimetheus, Prometheus, Pandora, Atlas, Pan, Daphnis, Phoebe |
| Uranus | 18 | Titania, Oberon, Umbriel, Ariel, Miranda, and 13 inner moons |
| Neptune | 9 | Triton, Proteus, Nereid, Larissa, Galatea, Despina, Thalassa, Naiad, Hippocamp |

Pluto and its moons are not included (Pluto is not modeled as a body in this version).

## Optional Textures

Place 2K equirectangular maps in a `textures/` folder next to the HTML file:

```
textures/
  2k_sun.jpg          # or 2k_sun.webp (solar-system-moons.html uses .webp)
  2k_mercury.jpg
  2k_venus_atmosphere.jpg
  2k_earth_daymap.jpg
  2k_mars.jpg
  2k_jupiter.jpg
  2k_saturn.jpg
  2k_uranus.jpg
  2k_neptune.jpg
```

If a texture is missing, the simulator falls back to procedural (Sun) or solid-color materials. Free maps are available from [Solar System Scope textures](https://www.solarsystemscope.com/textures/) and similar sources.

## Project Structure

```
solar-system/
├── solar-system.html      # Main simulator (self-contained)
├── solar-system-moons.html # Same content as solar-system.html including all moons
├── textures/              # Optional planet textures (not bundled)
└── README.md
```

Everything lives in a single HTML file: markup, styles, and JavaScript (ES modules). There is no bundler, `package.json`, or backend.

## How It Works

### Planetary motion

Each planet's position is computed from classical orbital elements at epoch J2000.0:

1. Advance mean anomaly with simulation time.
2. Solve Kepler's equation for eccentric anomaly (Newton–Raphson).
3. Convert to heliocentric coordinates in the orbital plane.
4. Rotate into the ecliptic frame and scale to scene units (`1 AU = 30` units).

### Lunar motion

Moons use simplified **circular, tilted orbits** around their parent planet. Sizes and orbit radii are **visually compressed** so small inner moons remain visible next to gas giants — this is not true-scale astronomy.

Key data structures in `solar-system.html`:

- `planetsData` — orbital elements and display properties per planet
- `moonsData` — diameter (km), orbital period (days), and retrograde flag per moon
- `MOON_ORBIT_CONFIG` — per-planet base/step spacing for moon orbit radii
- `planetInfo` — text shown in the info panel

### Rendering

- **Three.js** r160 (loaded from unpkg via import map)
- **OrbitControls** for camera manipulation
- **CSS2DRenderer** for HTML overlay labels
- Low-poly moon meshes (16 segments) for performance with 54 satellites

## Customization

- **Add moons** — Append entries to `moonsData` under the parent planet key. Tune `MOON_ORBIT_CONFIG` if orbits overlap.
- **Change time rate** — Edit `SIM_RATE` (simulated days per real second at 1× speed).
- **Adjust scale** — `DISTANCE_SCALE` controls AU-to-scene mapping; `moonVisualRadius()` controls moon sphere sizes.

## Accuracy Notes

This is an **educational visualization**, not a precision ephemeris:

- Planet orbits use two-body Keplerian mechanics (no perturbations).
- Moon orbits are circular approximations, not full satellite ephemerides.
- Distances and sizes are scaled for clarity, not physical proportion.
- Simulation epoch is J2000.0; positions drift from real sky coordinates over long time spans.

## Requirements

- A modern browser with WebGL 2 support (Chrome, Firefox, Edge, Safari)
- Network access on first load (Three.js is fetched from unpkg)

## License

See repository license. Planet texture assets from third-party sources may carry their own terms — check the provider before redistributing.
