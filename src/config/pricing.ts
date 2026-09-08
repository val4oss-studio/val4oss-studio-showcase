import type { IconKey } from '@/config/icons';

export const STATUS_KEYS = ['recommended'] as const;
export type StatusKey = typeof STATUS_KEYS[number];

export const PLAN_GROUP_KEYS = ['development', 'maintenance'] as const;
export type PlanGroupKey = typeof PLAN_GROUP_KEYS[number];

export const GROUP_FEATURE_KEYS = {
  development: [
    'onepage', 'seo', 'googleIndex', 'responsive',
    'unlimitedPages', 'admin', 'addonServices',
  ],
  maintenance: [
    'vmEurope', 'monitoring', 'perfTracking', 'thirdParty', 'monthlyDebug',
    'modifications', 'perfReport', 'prioritySupport',
  ],
} as const satisfies Record<PlanGroupKey, readonly string[]>;
export type PlanFeatureKey = typeof GROUP_FEATURE_KEYS[PlanGroupKey][number];

export const SHARED_OPTION_KEYS = [
  'domainAuto', 'https', 'cloudflare', 'backups', 'i18n', 'themes',
] as const;
export type SharedOptionKey = typeof SHARED_OPTION_KEYS[number];

export type FeatureKey = PlanFeatureKey | SharedOptionKey;

export interface FeatureOption<K extends FeatureKey = PlanFeatureKey> {
  key: K;
  priceLabel: string;
}

export const SHARED_OPTIONS: readonly FeatureOption<SharedOptionKey>[] = [
  { key: 'domainAuto', priceLabel: '+20 €'  },
  { key: 'https',      priceLabel: '+10 €'  },
  { key: 'cloudflare', priceLabel: '+10 €'  },
  { key: 'backups',    priceLabel: '+100 €' },
  { key: 'i18n',       priceLabel: '+10 €'  },
  { key: 'themes',     priceLabel: '+10 €'  },
];

export interface PlanStaticConfig {
  id: string;                                // Key used in i18n plans dict
  icon: IconKey;
  statusKey?: StatusKey;                     // Optional status key (e.g. "mostPopular")
  priceSetup: string;                        // Pre-formatted one-shot "549€"
  priceMonthly: string;                      // Pre-formatted recurring "45€"
  featureKeys: readonly PlanFeatureKey[];    // Features included in this plan
  optionFeatures?: readonly FeatureOption[]; // Optional upgrades with price delta
}

export const PLANS: PlanStaticConfig[] = [
  {
    id: 'essentiel', icon: 'browser',
    priceSetup: '549 €', priceMonthly: '45 €',
    featureKeys: [
      'onepage', 'seo', 'googleIndex', 'responsive',
      'vmEurope', 'monitoring',
    ],
  },
  {
    id: 'presence', icon: 'rocket', statusKey: 'recommended',
    priceSetup: '949 €', priceMonthly: '79 €',
    featureKeys: [
      'onepage', 'seo', 'googleIndex', 'responsive', 'unlimitedPages',
      'vmEurope', 'monitoring', 'perfTracking', 'thirdParty', 'monthlyDebug',
    ],
  },
  {
    id: 'signature', icon: 'star',
    priceSetup: '1 449 €', priceMonthly: '120 €',
    featureKeys: PLAN_GROUP_KEYS.flatMap((g) => GROUP_FEATURE_KEYS[g]),
  },
];

export type FeatureStatus = 'included' | 'option' | 'excluded';
export interface FeatureItem {
  key: string;
  label: string;
  status: FeatureStatus;
  priceLabel?: string;  // Affiché uniquement si status === 'option', ex: "+200 €"
}

export interface FeatureGroup {
  key: PlanGroupKey;
  features: FeatureItem[];
}

export function buildFeatureGroups(
  planConfig: PlanStaticConfig,
  featuresDict: Record<FeatureKey, string>,
): FeatureGroup[] {
  return PLAN_GROUP_KEYS.map((groupKey) => ({
    key: groupKey,
    features: GROUP_FEATURE_KEYS[groupKey].map((key) => {
      const optionFeature = planConfig.optionFeatures?.find(
        (o) => o.key === key
      );
      const isIncluded    = planConfig.featureKeys.includes(key);

      return {
        key,
        label: featuresDict[key] ?? key,
        status: isIncluded ? 'included' : optionFeature ? 'option' : 'excluded',
        priceLabel: optionFeature?.priceLabel,
      };
    }),
  }));
}

export function buildSharedOptions(
  featuresDict: Record<FeatureKey, string>,
): FeatureItem[] {
  return SHARED_OPTIONS.map(({ key, priceLabel }) => ({
    key,
    label: featuresDict[key] ?? key,
    status: 'option',
    priceLabel,
  }));
}

/**
 * Resolves a plan's status key to its i18n label, or undefined if no status
 * @param statusKey - The status key from the plan config (e.g. "mostPopular")
 * @param statusDict - The i18n dictionary for statuses { key → translate label }
 * @returns The translated status label, or undefined if no valid status
 */
export function buildStatus(
  statusKey: StatusKey | undefined,
  statusDict: Record<string, string>,
): string | undefined {
  if (!statusKey) return undefined;
  return statusDict[statusKey];
}
