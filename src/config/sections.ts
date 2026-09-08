import type { IconKey } from '@/config/icons';

export const PILLARS_IDS = [
  'craft', 'openSource', 'fairPrice', 'hosting', 'followUp', 'workspace',
] as const
export type PillarId = typeof PILLARS_IDS[number];

export interface PillarConfig {
  id:   PillarId;
  icon: IconKey;
}

export const PILLARS: PillarConfig[] = [
  { id: 'craft',      icon: 'code' },
  { id: 'openSource', icon: 'open-source' },
  { id: 'fairPrice',  icon: 'currency-euro' },
  { id: 'hosting',    icon: 'server' },
  { id: 'followUp',   icon: 'star' },
  { id: 'workspace',  icon: 'workspace' },
];

export const SECTION_IDS = {
  home:               'home',
  about:              'about',
  portfolio:          'portfolio',
  pricing:            'pricing',
  contact:            'contact',
} as const;

export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];
export const NAV_SECTION_KEYS = Object.keys(SECTION_IDS) as Array<keyof typeof SECTION_IDS>;
