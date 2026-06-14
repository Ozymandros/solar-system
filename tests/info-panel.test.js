import { describe, expect, it, beforeEach } from 'vitest';
import { shouldShowDistanceRow, getPlanetInfoEntry } from '../src/data/planet-info.js';
import { createInfoPanelUpdater } from '../src/ui/info-panel.js';

describe('planet info helpers', () => {
  it('hides distance for Sun and Moon', () => {
    expect(shouldShowDistanceRow(null)).toBe(false);
    expect(shouldShowDistanceRow(getPlanetInfoEntry('Sun').distanceFromSun)).toBe(false);
    expect(shouldShowDistanceRow(getPlanetInfoEntry('Moon').distanceFromSun)).toBe(false);
  });

  it('shows distance for planets with heliocentric data', () => {
    expect(shouldShowDistanceRow(getPlanetInfoEntry('Earth').distanceFromSun)).toBe(true);
  });

  it('returns null for unknown bodies', () => {
    expect(getPlanetInfoEntry('Pluto')).toBeNull();
  });
});

describe('createInfoPanelUpdater', () => {
  let panel;
  let distanceRow;
  let updater;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="info-panel" class="hidden">
        <h2 id="planet-name"></h2>
        <div id="planet-icon"></div>
        <span id="info-type"></span>
        <span id="info-diameter"></span>
        <span id="info-day"></span>
        <span id="info-year"></span>
        <span id="info-temp"></span>
        <span id="info-atmosphere"></span>
        <p id="info-funfact"></p>
        <span id="info-moons"></span>
        <div id="row-distance"><span id="info-distance"></span></div>
      </div>
    `;

    panel = document.getElementById('info-panel');
    distanceRow = document.getElementById('row-distance');
    updater = createInfoPanelUpdater({
      panel,
      name: document.getElementById('planet-name'),
      icon: document.getElementById('planet-icon'),
      type: document.getElementById('info-type'),
      diameter: document.getElementById('info-diameter'),
      day: document.getElementById('info-day'),
      year: document.getElementById('info-year'),
      temp: document.getElementById('info-temp'),
      atmosphere: document.getElementById('info-atmosphere'),
      funFact: document.getElementById('info-funfact'),
      moons: document.getElementById('info-moons'),
      distanceRow,
      distance: document.getElementById('info-distance'),
    });
  });

  it('populates Earth info and shows the panel', () => {
    const result = updater('Earth');

    expect(result).toEqual({ visible: true, planetName: 'Earth' });
    expect(panel.classList.contains('hidden')).toBe(false);
    expect(document.getElementById('planet-name').textContent).toBe('Earth');
    expect(document.getElementById('info-type').textContent).toContain('Terrestrial');
    expect(distanceRow.style.display).toBe('flex');
    expect(document.getElementById('info-distance').textContent).toContain('AU');
  });

  it('hides distance row for the Sun', () => {
    updater('Sun');
    expect(distanceRow.style.display).toBe('none');
  });

  it('hides the panel for unknown bodies', () => {
    const result = updater('Ceres');
    expect(result).toEqual({ visible: false, planetName: null });
    expect(panel.classList.contains('hidden')).toBe(true);
  });
});
