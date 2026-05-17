import type { Dictionary } from '@/app/i18n/translations';
import {
  MAINTENANCE_FEATURE_KEYS,
  MAINTENANCE_PLANS,
  type PlanStaticConfig
} from '@/config/pricing';
import { RevealSection } from '@/app/component/layout';
import {
  type FeatureItem,
  PlanCard,
  SectionTitle
} from '@/app/component/ui';

interface PricingMaintenanceSectionProps {
  id: string;
  dict: Dictionary['pricingMaintenance'];
}
  function buildFeatures(
    planConfig: PlanStaticConfig,
    featuresDict: Record<string, string>,
  ): FeatureItem[] {
    return MAINTENANCE_FEATURE_KEYS.map((key) => {
      const isIncluded = planConfig.featureKeys.includes(key);
      return {
        key,
        label: featuresDict[key] ?? key,
        status: isIncluded ? 'included' : 'excluded',
      };
    });
  }

export function PricingMaintenanceSection({ id, dict }: PricingMaintenanceSectionProps) {
  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow section-eyebrow--right t-eyebrow">
          {dict.eyebrow}
        </p>
        <SectionTitle accent={dict.titleAccent}>{dict.title}</SectionTitle>
        <p className="section-intro t-body">{dict.subtitle}</p>

        <div className="plans-grid">
          {MAINTENANCE_PLANS.map((planConfig, i) => {
            const planI18n = dict.plans[planConfig.id];
            const features = buildFeatures(planConfig, dict.features);

            return (
              <PlanCard
                key={planConfig.id}
                icon={planConfig.icon}
                name={planI18n.name}
                target={planI18n.target}
                price={planConfig.price}
                // pas de priceFrom pour les abonnements
                priceNote={planI18n.priceNote}
                features={features}
                featured={planConfig.featured}
                featuredLabel={planI18n.featuredLabel}
                badge={planI18n.badge}
                stagger={i}
              />
            );
          })}
        </div>

        {/* Note de réactivité */}
        <p className="pricing-reactivity-note">
          <span className="t-accent">{dict.reactivityAccent}</span>
          {' '}{dict.reactivityNote}
        </p>

      </div>
    </RevealSection>
  );
}
