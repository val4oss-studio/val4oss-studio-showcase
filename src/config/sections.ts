import type { IconKey } from '@/config/icons';

export interface PillarConfig {
  id:   string;      // Key used in i18n pillars dict
  icon: IconKey;
}

export const PILLARS: PillarConfig[] = [
  { id: 'hosting',    icon: 'server' },
  { id: 'workspace',  icon: 'workspace' },
  { id: 'openSource', icon: 'open-source' },
];

export interface WhyCardConfig {
  id:   string;      // Key used in i18n cards dict
  icon: IconKey;
}

export const WHY_CARDS: WhyCardConfig[] = [
  { id: 'craft',       icon: 'code' },
  { id: 'pricing',     icon: 'currency-euro' },
  { id: 'sovereignty', icon: 'lock' },
  { id: 'followUp',    icon: 'layout-dashboard' },
];

export const SECTION_IDS = {
  home:               'home',
  about:              'about',
  whyUs:              'why-us',
  portfolio:          'portfolio',
  pricingDev:         'pricing-dev',
  pricingMaintenance: 'pricing-maintenance',
  contact:            'contact',
} as const;

export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];
export const NAV_SECTION_KEYS = Object.keys(SECTION_IDS) as Array<keyof typeof SECTION_IDS>;
