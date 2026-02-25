// 30 named lunar nights of the Hawaiian lunar calendar
// Anchored to 2021-01-13 (known new moon)
const ANCHOR_NEW_MOON = new Date('2021-01-13T00:00:00Z');
const LUNAR_CYCLE_MS = 29.53059 * 24 * 60 * 60 * 1000;

export const LUNAR_NIGHTS = [
  'Hilo', 'Hoaka', 'Kū-kahi', 'Kū-lua', 'Kū-kolu',
  'Kū-pau', 'ʻOle-kū-kahi', 'ʻOle-kū-lua', 'ʻOle-kū-kolu', 'ʻOle-kū-pau',
  'Huna', 'Mohalu', 'Hua', 'Akua', 'Hoku',
  'Māhea', 'Kulu', 'Lāʻau-kahi', 'Lāʻau-lua', 'Lāʻau-pau',
  'ʻOleʻole-kahi', 'ʻOleʻole-lua', 'ʻOleʻole-pau', 'Kāloa-kū-kahi', 'Kāloa-kū-lua',
  'Kāloa-pau', 'Kāne', 'Lono', 'Māuli', 'Muku',
] as const;

export type LunarNight = typeof LUNAR_NIGHTS[number];

export interface LunarDay {
  name: LunarNight;
  day: number;
}

export function getLunarDay(date: Date = new Date()): LunarDay {
  const msFromAnchor = date.getTime() - ANCHOR_NEW_MOON.getTime();
  const cyclePosition = ((msFromAnchor % LUNAR_CYCLE_MS) + LUNAR_CYCLE_MS) % LUNAR_CYCLE_MS;
  const dayIndex = Math.floor((cyclePosition / LUNAR_CYCLE_MS) * 30);
  return {
    name: LUNAR_NIGHTS[dayIndex],
    day: dayIndex + 1,
  };
}

export function getHawaiianSeason(date: Date = new Date()): 'Kau' | "Hoʻoilo" {
  const month = date.getMonth() + 1;
  // Kau (summer/dry): May–October; Hoʻoilo (winter/wet): November–April
  return month >= 5 && month <= 10 ? 'Kau' : "Hoʻoilo";
}

export function formatHawaiianDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
