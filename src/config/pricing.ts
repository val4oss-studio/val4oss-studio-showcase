import type { IconKey } from '@/config/icons';

export const STATUS_KEYS = ['recommended', 'mostPopular'] as const;
export type StatusKey = typeof STATUS_KEYS[number];

export const BADGE_KEYS = ['saasAccess'] as const;
export type BadgeKey = typeof BADGE_KEYS[number];

export const DEV_FEATURE_KEYS = [
  'onepage', 'seo', 'googleIndex', 'responsive', 'multipage', 'gallery',
  'admin', 'i18n', 'themes', 'unlimitedPages', 'custom', 'animations',
] as const;
export type DevFeatureKey = typeof DEV_FEATURE_KEYS[number];

export const MAINTENANCE_FEATURE_KEYS = [
  'vmEurope', 'domainAuto', 'https', 'cloudflare', 'backups', 'googleIndexing',
  'monitoring', 'perfTracking', 'monthlyDebug', 'thirdParty', 'supportMessage',
  'modifications', 'perfReport', 'prioritySupport',
] as const;
export type MaintenanceFeatureKey = typeof MAINTENANCE_FEATURE_KEYS[number];

export interface FeatureOption<K extends string> {
  key: K;
  priceLabel: string;
}

export interface PlanStaticConfig<K extends string> {
  id: string;                              // Key used in i18n plans dict
  icon: IconKey;
  badgeKey?: BadgeKey;                     // Optional badge
  statusKey?: StatusKey;                   // Optional status key (e.g. "mostPopular")
  price: string;                           // Pre-formatted: "490 – 690 €"
  featureKeys: readonly K[];                    // Features included in this plan
  optionFeatures?: readonly FeatureOption<K>[]; // Optional upgrades with price delta
}

export const DEV_PLANS: PlanStaticConfig<DevFeatureKey>[] = [
  {
    id: 'essentiel',
    icon: 'browser',
    price: '549 €',
    featureKeys: [ 'onepage', 'seo', 'googleIndex', 'responsive' ],
  },
  {
    id: 'presence',
    icon: 'rocket',
    price: '945 €',
    statusKey: 'recommended',
    featureKeys: [
      'onepage', 'seo', 'googleIndex', 'responsive',
      'multipage', 'gallery', 'admin',
    ],
    optionFeatures: [
      { key: 'i18n', priceLabel: '+200 €' },
      { key: 'themes', priceLabel: '+200 €' },
    ],
  },
  {
    id: 'signature',
    icon: 'star',
    badgeKey: 'saasAccess',
    price: '1 890 €',
    featureKeys: DEV_FEATURE_KEYS,
  },
];

export const MAINTENANCE_PLANS: PlanStaticConfig<MaintenanceFeatureKey>[] = [
  {
    id: 'hebergement',
    icon: 'server',
    price: '39 €',
    featureKeys: [
      'vmEurope', 'domainAuto', 'https', 'cloudflare', 'backups', 'googleIndexing'
    ],
  },
  {
    id: 'serenite',
    icon: 'shield-check',
    statusKey: 'recommended',
    badgeKey: 'saasAccess',
    price: '89 €',
    featureKeys: [
      'vmEurope', 'domainAuto', 'https', 'cloudflare', 'backups', 'googleIndexing',
      'monitoring', 'perfTracking', 'monthlyDebug', 'thirdParty', 'supportMessage',
    ],
  },
  {
    id: 'premium',
    icon: 'crown',
    badgeKey: 'saasAccess',
    price: '149 €',
    featureKeys: MAINTENANCE_FEATURE_KEYS,
  },
];

export type FeatureStatus = 'included' | 'option' | 'excluded';
export interface FeatureItem {
  key: string;
  label: string;
  status: FeatureStatus;
  priceLabel?: string;  // Affiché uniquement si status === 'option', ex: "+200 €"
}

/**
 * Build list of features for given plan
 * 3 states : included / option / excluded.
 *
 * @param featureKeys - List of printing keys ({DEV|MAINTENANCE}_FEATURE_KEYS)
 * @param planConfig  - Static config of the plan (featureKeys includes + some options)
 * @param featuresDict - Dictionary i18n { key → translate label }
 */
function buildFeatures<K extends string>(
  featureKeys: readonly K[],
  planConfig: PlanStaticConfig<K>,
  featuresDict: Record<K, string>,
): FeatureItem[] {
  return featureKeys.map((key) => {
    const optionFeature = planConfig.optionFeatures?.find((o) => o.key === key);
    const isIncluded    = planConfig.featureKeys.includes(key);
    const isOption      = !!optionFeature;

    return {
      key,
      label: featuresDict[key] ?? key,   // fallback sur la clé si label manquant
      status: isIncluded ? 'included' : isOption ? 'option' : 'excluded',
      priceLabel: optionFeature?.priceLabel,
    };
  });
}

export function buildDevFeatures(
  planConfig: PlanStaticConfig<DevFeatureKey>,
  featuresDict: Record<DevFeatureKey, string>,
): FeatureItem[] {
  return buildFeatures(DEV_FEATURE_KEYS, planConfig, featuresDict);
}

export function buildMaintenanceFeatures(
  planConfig: PlanStaticConfig<MaintenanceFeatureKey>,
  featuresDict: Record<MaintenanceFeatureKey, string>,
): FeatureItem[] {
  return buildFeatures(MAINTENANCE_FEATURE_KEYS, planConfig, featuresDict);
}

/**
 * Resolves a plan's badge key to its i18n label, or undefined if no badge
 * @param badgeKey - The badge key from the plan config (e.g. "saasAccess")
 * @param badgesDict - The i18n dictionary for badges { key → translate label }
 * @returns The translated badge label, or undefined if no valid badge
 */
export function buildBadge(
  badgeKey: BadgeKey | undefined,
  badgesDict: Record<string, string>,
): string | undefined {
  if (!badgeKey) return undefined;
  return badgesDict[badgeKey];
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
