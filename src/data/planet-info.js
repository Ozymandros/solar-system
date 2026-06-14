export const planetInfo = {
  'Sun': {
    type: 'G-type Main-Sequence Star',
    diameter: '1,392,700 km',
    distanceFromSun: null,
    dayLength: '25 Earth days (equator)',
    yearLength: 'N/A (orbits galactic center)',
    surfaceTemp: '5,500°C (photosphere)',
    moons: 'N/A (star)',
    atmosphere: 'Hydrogen (73%), Helium (25%)',
    funFact: 'The Sun contains 99.86% of all the mass in the entire Solar System. It converts about 600 million tons of hydrogen into helium every second.',
    color: '#FDB813'
  },
  'Mercury': {
    type: 'Terrestrial Planet',
    diameter: '4,879 km',
    distanceFromSun: '57.9 million km (0.39 AU)',
    dayLength: '59 Earth days',
    yearLength: '88 Earth days',
    surfaceTemp: '-180°C to 430°C',
    moons: 0,
    atmosphere: 'Extremely thin exosphere (O₂, Na, H₂, He)',
    funFact: 'Despite being closest to the Sun, Mercury is NOT the hottest planet—Venus is hotter due to its thick greenhouse atmosphere.',
    color: '#B0B0B0'
  },
  'Venus': {
    type: 'Terrestrial Planet',
    diameter: '12,104 km',
    distanceFromSun: '108.2 million km (0.72 AU)',
    dayLength: '243 Earth days (retrograde)',
    yearLength: '225 Earth days',
    surfaceTemp: '462°C (average)',
    moons: 0,
    atmosphere: 'Carbon dioxide (96.5%), Nitrogen (3.5%)',
    funFact: 'Venus rotates backwards (retrograde) compared to most planets. The Sun rises in the west and sets in the east on Venus.',
    color: '#E8CDA0'
  },
  'Earth': {
    type: 'Terrestrial Planet',
    diameter: '12,742 km',
    distanceFromSun: '149.6 million km (1 AU)',
    dayLength: '24 hours',
    yearLength: '365.25 days',
    surfaceTemp: '-89°C to 57°C',
    moons: 1,
    atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon (0.9%)',
    funFact: 'Earth is the only known planet to support life. Its surface is 71% water, earning it the nickname "The Blue Marble."',
    color: '#4B9CD3'
  },
  'Moon': {
    type: 'Natural Satellite (Earth)',
    diameter: '3,474 km',
    distanceFromSun: null,
    dayLength: '29.5 Earth days (tidally locked)',
    yearLength: '27.3 days (orbital period)',
    surfaceTemp: '-233°C to 123°C',
    moons: 'N/A (moon itself)',
    atmosphere: 'None (negligible exosphere)',
    funFact: 'The Moon is slowly moving away from Earth at a rate of about 3.8 cm per year. It always shows the same face to Earth due to tidal locking.',
    color: '#C0C0C0'
  },
  'Mars': {
    type: 'Terrestrial Planet',
    diameter: '6,779 km',
    distanceFromSun: '227.9 million km (1.52 AU)',
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    surfaceTemp: '-140°C to 20°C',
    moons: 2,
    atmosphere: 'Carbon dioxide (95.3%), Nitrogen (2.7%), Argon (1.6%)',
    funFact: 'Mars is home to Olympus Mons, the tallest volcano in the Solar System. It stands 21.9 km tall—nearly 2.5 times the height of Mount Everest.',
    color: '#C1440E'
  },
  'Jupiter': {
    type: 'Gas Giant',
    diameter: '139,820 km',
    distanceFromSun: '778.6 million km (5.2 AU)',
    dayLength: '9.9 hours',
    yearLength: '11.9 Earth years',
    surfaceTemp: '-145°C (cloud top)',
    moons: 95,
    atmosphere: 'Hydrogen (90%), Helium (10%)',
    funFact: 'The Great Red Spot on Jupiter is a persistent anticyclonic storm larger than Earth that has been raging for over 350 years.',
    color: '#D4A574'
  },
  'Saturn': {
    type: 'Gas Giant',
    diameter: '116,460 km',
    distanceFromSun: '1.43 billion km (9.54 AU)',
    dayLength: '10.7 hours',
    yearLength: '29.5 Earth years',
    surfaceTemp: '-178°C (cloud top)',
    moons: 146,
    atmosphere: 'Hydrogen (96.3%), Helium (3.25%)',
    funFact: 'Saturn\'s iconic rings are made almost entirely of water ice, with some rocky debris. The rings span up to 282,000 km wide but are only 10-100 meters thick.',
    color: '#F4D59C'
  },
  'Uranus': {
    type: 'Ice Giant',
    diameter: '50,724 km',
    distanceFromSun: '2.87 billion km (19.2 AU)',
    dayLength: '17.2 hours',
    yearLength: '84 Earth years',
    surfaceTemp: '-224°C (cloud top)',
    moons: 27,
    atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2%)',
    funFact: 'Uranus rotates on its side with an axial tilt of 97.8°, likely caused by a massive collision early in its history.',
    color: '#7EC8E3'
  },
  'Neptune': {
    type: 'Ice Giant',
    diameter: '49,244 km',
    distanceFromSun: '4.5 billion km (30.07 AU)',
    dayLength: '16.1 hours',
    yearLength: '165 Earth years',
    surfaceTemp: '-218°C (cloud top)',
    moons: 16,
    atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1%)',
    funFact: 'Neptune has the fastest sustained winds in the Solar System, reaching over 2,100 km/h (1,300 mph)—supersonic speeds.',
    color: '#3F54BA'
  }
};

export function shouldShowDistanceRow(distanceFromSun) {
  return distanceFromSun !== null;
}

export function getPlanetInfoEntry(planetName, info = planetInfo) {
  return info[planetName] ?? null;
}
