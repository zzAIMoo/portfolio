

export interface DepthZone {
  name: string;
  nameKey: string;
  minDepth: number;
  maxDepth: number;
  waterColorTop: string;
  waterColorBottom: string;
  fogDensity: number;
  lightIntensity: number;
  hasCaustics: boolean;
  hasBioluminescence: boolean;
  creatures: string[];
}

export const DEPTH_ZONES: DepthZone[] = [
  {
    name: 'Surface',
    nameKey: 'zones.surface',
    minDepth: 0,
    maxDepth: 22,
    waterColorTop: '#0891b2',
    waterColorBottom: '#0e7490',
    fogDensity: 0.008,
    lightIntensity: 1.0,
    hasCaustics: true,
    hasBioluminescence: false,
    creatures: ['jellyfish', 'smallFish'],
  },
  {
    name: 'Shallow',
    nameKey: 'zones.shallow',
    minDepth: 22,
    maxDepth: 50,
    waterColorTop: '#0e7490',
    waterColorBottom: '#155e75',
    fogDensity: 0.015,
    lightIntensity: 0.7,
    hasCaustics: true,
    hasBioluminescence: false,
    creatures: ['jellyfish', 'smallFish', 'turtle'],
  },
  {
    name: 'Twilight',
    nameKey: 'zones.twilight',
    minDepth: 50,
    maxDepth: 100,
    waterColorTop: '#155e75',
    waterColorBottom: '#0c4a6e',
    fogDensity: 0.025,
    lightIntensity: 0.35,
    hasCaustics: false,
    hasBioluminescence: true,
    creatures: ['squid', 'bioFish'],
  },
  {
    name: 'Deep Twilight',
    nameKey: 'zones.deepTwilight',
    minDepth: 100,
    maxDepth: 123,
    waterColorTop: '#0c4a6e',
    waterColorBottom: '#082f49',
    fogDensity: 0.04,
    lightIntensity: 0.15,
    hasCaustics: false,
    hasBioluminescence: true,
    creatures: ['anglerfish', 'bioJellyfish'],
  },
  {
    name: 'Abyss',
    nameKey: 'zones.abyss',
    minDepth: 123,
    maxDepth: 136,
    waterColorTop: '#082f49',
    waterColorBottom: '#041525',
    fogDensity: 0.06,
    lightIntensity: 0.05,
    hasCaustics: false,
    hasBioluminescence: true,
    creatures: ['anglerfish', 'deepJellyfish', 'octopus'],
  },
  {
    name: 'The Deep',
    nameKey: 'zones.theDeep',
    minDepth: 136,
    maxDepth: 200,
    waterColorTop: '#041525',
    waterColorBottom: '#000508',
    fogDensity: 0.08,
    lightIntensity: 0.01,
    hasCaustics: false,
    hasBioluminescence: true,
    creatures: ['leviathan'],
  },
];

export const MAX_DEPTH = 200;

export function getZoneAtDepth(depth: number): DepthZone {
  for (let i = DEPTH_ZONES.length - 1; i >= 0; i--) {
    if (depth >= DEPTH_ZONES[i].minDepth) {
      return DEPTH_ZONES[i];
    }
  }
  return DEPTH_ZONES[0];
}

export function lerpColor(a: string, b: string, t: number): string {
  const ah = parseInt(a.replace('#', ''), 16);
  const bh = parseInt(b.replace('#', ''), 16);

  const ar = (ah >> 16) & 0xff;
  const ag = (ah >> 8) & 0xff;
  const ab = ah & 0xff;

  const br = (bh >> 16) & 0xff;
  const bg = (bh >> 8) & 0xff;
  const bb = bh & 0xff;

  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);

  return `#${((rr << 16) | (rg << 8) | rb).toString(16).padStart(6, '0')}`;
}

export function getWaterColorAtDepth(depth: number): string {
  const zone = getZoneAtDepth(depth);
  const t = Math.min(1, (depth - zone.minDepth) / Math.max(1, zone.maxDepth - zone.minDepth));
  return lerpColor(zone.waterColorTop, zone.waterColorBottom, t);
}

export function getFogAtDepth(depth: number): number {
  const zone = getZoneAtDepth(depth);
  const zoneIndex = DEPTH_ZONES.indexOf(zone);
  const nextZone = DEPTH_ZONES[Math.min(zoneIndex + 1, DEPTH_ZONES.length - 1)];
  const t = Math.min(1, (depth - zone.minDepth) / Math.max(1, zone.maxDepth - zone.minDepth));
  return zone.fogDensity + (nextZone.fogDensity - zone.fogDensity) * t;
}

export function getLightAtDepth(depth: number): number {
  const zone = getZoneAtDepth(depth);
  const zoneIndex = DEPTH_ZONES.indexOf(zone);
  const nextZone = DEPTH_ZONES[Math.min(zoneIndex + 1, DEPTH_ZONES.length - 1)];
  const t = Math.min(1, (depth - zone.minDepth) / Math.max(1, zone.maxDepth - zone.minDepth));
  return zone.lightIntensity + (nextZone.lightIntensity - zone.lightIntensity) * t;
}