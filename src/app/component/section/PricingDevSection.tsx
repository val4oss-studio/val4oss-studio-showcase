import type { Dictionary } from '@/app/i18n/translations';
import {
  DEV_FEATURE_KEYS, DEV_PLANS,
  type PlanStaticConfig
} from '@/config/pricing';
import { RevealSection } from '@/app/component/layout';
import { 
  type FeatureItem,
  PlanCard,
  SectionTitle
} from '@/app/component/ui';

interface PricingDevSectionProps {
  id: string;
  dict: Dictionary['pricingDev'];
}

/** Construit la liste exhaustive des features pour un plan donné */
function buildFeatures(
  planConfig: PlanStaticConfig,
  featuresDict: Record<string, string>,
): FeatureItem[] {
  return DEV_FEATURE_KEYS.map((key) => {
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

export function PricingDevSection({ id, dict }: PricingDevSectionProps) {
  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow t-eyebrow">{dict.eyebrow}</p>
        <SectionTitle accent={dict.titleAccent}>{dict.title}</SectionTitle>
        <p className="section-intro t-body">{dict.subtitle}</p>

        <div className="plans-grid">
          {DEV_PLANS.map((planConfig, i) => {
            const planI18n = dict.plans[planConfig.id];
            const features = buildFeatures(planConfig, dict.features);

            return (
              <PlanCard
                key={planConfig.id}
                icon={planConfig.icon}
                name={planI18n.name}
                target={planI18n.target}
                price={planConfig.price}
                priceFrom={dict.priceFrom}
                priceNote={planI18n.priceNote}
                features={features}
                delay={planI18n.delay}
                featured={planConfig.featured}
                featuredLabel={planI18n.featuredLabel}
                stagger={i}
              />
            );
          })}
        </div>

      </div>
    </RevealSection>
  );
}
