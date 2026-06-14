import { getPlanetInfoEntry, shouldShowDistanceRow } from '../data/planet-info.js';

export function createInfoPanelUpdater(elements) {
  return function updateInfoPanel(planetName) {
    const data = getPlanetInfoEntry(planetName);

    if (!data) {
      elements.panel.classList.add('hidden');
      return { visible: false, planetName: null };
    }

    elements.name.textContent = planetName;
    elements.icon.style.backgroundColor = data.color;
    elements.icon.style.boxShadow = `0 0 14px ${data.color}`;
    elements.type.textContent = data.type;
    elements.diameter.textContent = data.diameter;
    elements.day.textContent = data.dayLength;
    elements.year.textContent = data.yearLength;
    elements.temp.textContent = data.surfaceTemp;
    elements.atmosphere.textContent = data.atmosphere;
    elements.funFact.textContent = data.funFact;
    elements.moons.textContent = data.moons;

    if (shouldShowDistanceRow(data.distanceFromSun)) {
      elements.distanceRow.style.display = 'flex';
      elements.distance.textContent = data.distanceFromSun;
    } else {
      elements.distanceRow.style.display = 'none';
    }

    elements.panel.classList.remove('hidden');
    return { visible: true, planetName };
  };
}
