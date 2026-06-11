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
