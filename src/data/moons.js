export const moonsData = {
  Earth: [
    { name: 'Moon', diameter: 3474, period: 27.3 },
  ],
  Mars: [
    { name: 'Phobos', diameter: 22.4, period: 0.32 },
    { name: 'Deimos', diameter: 12.4, period: 1.26 },
  ],
  Jupiter: [
    { name: 'Io', diameter: 3643, period: 1.77 },
    { name: 'Europa', diameter: 3122, period: 3.55 },
    { name: 'Ganymede', diameter: 5268, period: 7.15 },
    { name: 'Callisto', diameter: 4821, period: 16.69 },
    { name: 'Metis', diameter: 43, period: 0.29 },
    { name: 'Adrastea', diameter: 16, period: 0.30 },
    { name: 'Amalthea', diameter: 167, period: 0.50 },
    { name: 'Thebe', diameter: 99, period: 0.67 },
    { name: 'Himalia', diameter: 170, period: 250.6 },
  ],
  Saturn: [
    { name: 'Titan', diameter: 5149, period: 15.95 },
    { name: 'Rhea', diameter: 1528, period: 4.52 },
    { name: 'Iapetus', diameter: 1470, period: 79.33 },
    { name: 'Dione', diameter: 1123, period: 2.74 },
    { name: 'Tethys', diameter: 1066, period: 1.89 },
    { name: 'Enceladus', diameter: 504, period: 1.37 },
    { name: 'Mimas', diameter: 396, period: 0.94 },
    { name: 'Janus', diameter: 179, period: 0.69 },
    { name: 'Epimetheus', diameter: 116, period: 0.69 },
    { name: 'Prometheus', diameter: 86, period: 0.61 },
    { name: 'Pandora', diameter: 81, period: 0.63 },
    { name: 'Atlas', diameter: 30, period: 0.60 },
    { name: 'Pan', diameter: 28, period: 0.58 },
    { name: 'Daphnis', diameter: 8, period: 0.59 },
    { name: 'Phoebe', diameter: 213, period: 550.3, retrograde: true },
  ],
  Uranus: [
    { name: 'Titania', diameter: 1578, period: 8.71 },
    { name: 'Oberon', diameter: 1523, period: 13.46 },
    { name: 'Umbriel', diameter: 1169, period: 4.14 },
    { name: 'Ariel', diameter: 1158, period: 2.52 },
    { name: 'Miranda', diameter: 472, period: 1.41 },
    { name: 'Puck', diameter: 162, period: 0.76 },
    { name: 'Portia', diameter: 135, period: 0.51 },
    { name: 'Juliet', diameter: 106, period: 0.49 },
    { name: 'Belinda', diameter: 90, period: 0.62 },
    { name: 'Cressida', diameter: 80, period: 0.46 },
    { name: 'Rosalind', diameter: 72, period: 0.56 },
    { name: 'Desdemona', diameter: 64, period: 0.47 },
    { name: 'Bianca', diameter: 51, period: 0.43 },
    { name: 'Cordelia', diameter: 40, period: 0.34 },
    { name: 'Ophelia', diameter: 43, period: 0.38 },
    { name: 'Perdita', diameter: 30, period: 0.64 },
    { name: 'Mab', diameter: 25, period: 0.92 },
    { name: 'Cupid', diameter: 18, period: 0.62 },
  ],
  Neptune: [
    { name: 'Triton', diameter: 2707, period: 5.88, retrograde: true },
    { name: 'Proteus', diameter: 420, period: 1.12 },
    { name: 'Nereid', diameter: 340, period: 360.1 },
    { name: 'Larissa', diameter: 194, period: 0.55 },
    { name: 'Galatea', diameter: 176, period: 0.43 },
    { name: 'Despina', diameter: 150, period: 0.33 },
    { name: 'Thalassa', diameter: 82, period: 0.31 },
    { name: 'Naiad', diameter: 58, period: 0.29 },
    { name: 'Hippocamp', diameter: 35, period: 0.95 },
  ],
};

export const MOON_ORBIT_CONFIG = {
  Earth:   { base: 0.80, step: 0.00 },
  Mars:    { base: 0.55, step: 0.25 },
  Jupiter: { base: 2.80, step: 0.35 },
  Saturn:  { base: 3.30, step: 0.28 },
  Uranus:  { base: 1.80, step: 0.22 },
  Neptune: { base: 1.80, step: 0.28 },
};

export const moonColors = {
  Moon: 0xbbbbbb,
  Phobos: 0x886655,
  Deimos: 0x776655,
  Io: 0xeedd88,
  Europa: 0xdde8f0,
  Ganymede: 0x998877,
  Callisto: 0x665544,
  Titan: 0xcc9944,
  Enceladus: 0xeeeeee,
  Triton: 0xddbbaa,
};

export function countMoons(moons) {
  return Object.values(moons).reduce((total, list) => total + list.length, 0);
}

export function getMoonParents(moons) {
  return Object.keys(moons);
}
