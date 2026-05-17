export const SECTION_IDS = {
  home:               'home',
  about:              'about',
  whyUs:              'why-us',
  pricingDev:         'pricing-dev',
  pricingMaintenance: 'pricing-maintenance',
} as const;

export type SectionId = typeof SECTION_IDS[keyof typeof SECTION_IDS];
