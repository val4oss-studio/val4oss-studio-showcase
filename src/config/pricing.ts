export interface FeatureOption {
  key: string;
  priceLabel: string;
}

export interface PlanStaticConfig {
  id: string;                              // Key used in i18n plans dict
  icon: string;                            // Key resolved by getIcon()
  featured: boolean;
  price: string;                           // Pre-formatted: "490 – 690 €"
  featureKeys: string[];                   // Features included in this plan
  optionFeatures?: FeatureOption[];        // Optional upgrades with price delta
}

export const DEV_FEATURE_KEYS: string[] = [
  'onepage',
  'domain',
  'ssl',
  'seoBasic',
  'googleIndex',
  'responsive',
  'multipage',
  'gallery',
  'seoOptimized',
  'admin',
  'i18n',
  'themes',
  'unlimitedPages',
  'custom',
  'animations',
  'seoAdvanced',
  'saasAccessDev',
];

export const DEV_PLANS: PlanStaticConfig[] = [
  {
    id: 'essentiel',
    icon: 'browser',
    featured: false,
    price: '490 – 690 €',
    featureKeys: [
      'onepage', 'domain', 'ssl', 'seoBasic', 'googleIndex', 'responsive'
    ],
  },
  {
    id: 'presence',
    icon: 'rocket',
    featured: true,
    price: '890 – 1 290 €',
    featureKeys: [
      'onepage', 'domain', 'ssl', 'seoBasic', 'googleIndex', 'responsive',
      'multipage', 'gallery', 'seoOptimized', 'admin',
    ],
    optionFeatures: [
      { key: 'i18n',   priceLabel: '+200 €' },
      { key: 'themes', priceLabel: '+200 €' },
    ],
  },
  {
    id: 'signature',
    icon: 'star',
    featured: false,
    price: '1 800 – 2 900 €',
    featureKeys: [
      'onepage', 'domain', 'ssl', 'seoBasic', 'googleIndex', 'responsive',
      'multipage', 'gallery', 'seoOptimized', 'admin',
      'i18n', 'themes',
      'unlimitedPages', 'custom', 'animations', 'seoAdvanced', 'saasAccessDev',
    ],
  },
];

export const MAINTENANCE_FEATURE_KEYS: string[] = [
  'vmEurope',
  'domainAuto',
  'https',
  'cloudflare',
  'backups',
  'googleIndexing',
  'monitoring',
  'perfTracking',
  'monthlyDebug',
  'thirdParty',
  'supportMessage',
  'saasUnlimited',
  'hourModifications',
  'perfReport',
  'prioritySupport',
];

export const MAINTENANCE_PLANS: PlanStaticConfig[] = [
  {
    id: 'hebergement',
    icon: 'server',
    featured: false,
    price: '19 – 29 €',
    featureKeys: [
      'vmEurope', 'domainAuto', 'https', 'cloudflare', 'backups',
      'googleIndexing'
    ],
  },
  {
    id: 'serenite',
    icon: 'shield-check',
    featured: true,
    price: '45 – 65 €',
    featureKeys: [
      'vmEurope', 'domainAuto', 'https', 'cloudflare', 'backups',
      'googleIndexing', 'monitoring', 'perfTracking', 'monthlyDebug',
      'thirdParty', 'supportMessage',
    ],
  },
  {
    id: 'premium',
    icon: 'crown',
    featured: false,
    price: '89 – 119 €',
    featureKeys: [
      'vmEurope', 'domainAuto', 'https', 'cloudflare', 'backups',
      'googleIndexing', 'monitoring', 'perfTracking', 'monthlyDebug',
      'thirdParty', 'supportMessage', 'saasUnlimited', 'hourModifications',
      'perfReport', 'prioritySupport',
    ],
  },
];
