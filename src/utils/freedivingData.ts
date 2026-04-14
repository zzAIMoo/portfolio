

export interface FreedivingRecord {
  depth: number;
  diver: string;
  year: number | string;
  descriptionKey: string;
  sectionId: string;
}

export const FREEDIVING_RECORDS: FreedivingRecord[] = [
  {
    depth: 0,
    diver: '',
    year: '',
    descriptionKey: 'records.surface',
    sectionId: 'hero',
  },
  {
    depth: 22,
    diver: 'Simone Sechi',
    year: 'current',
    descriptionKey: 'records.personal',
    sectionId: 'about',
  },
  {
    depth: 50,
    diver: 'Enzo Maiorca',
    year: 1961,
    descriptionKey: 'records.maiorca',
    sectionId: 'skills',
  },
  {
    depth: 100,
    diver: 'Jacques Mayol',
    year: 1976,
    descriptionKey: 'records.mayol',
    sectionId: 'projects',
  },
  {
    depth: 123,
    diver: 'Alessia Zecchini',
    year: 2023,
    descriptionKey: 'records.zecchini',
    sectionId: 'legacy',
  },
  {
    depth: 136,
    diver: 'Alexey Molchanov',
    year: 2023,
    descriptionKey: 'records.molchanov',
    sectionId: 'contact',
  },
];

export const SECTIONS = [
  { id: 'hero', depth: 0 },
  { id: 'about', depth: 22 },
  { id: 'skills', depth: 50 },
  { id: 'projects', depth: 100 },
  { id: 'legacy', depth: 123 },
  { id: 'contact', depth: 136 },
  { id: 'abyss', depth: 180 },
] as const;

export type SectionId = typeof SECTIONS[number]['id'];