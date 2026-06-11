import { type JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import {
  MAINTENANCE_PLANS,
  buildMaintenanceFeatures as buildFeatures,
  buildBadge,
  buildStatus,
} from '@/config/pricing';
import { RevealSection } from '@/app/component/layout';
import {
  PlanCard,
  PlanCarousel,
  SectionTitle,
} from '@/app/component/ui';

interface PricingMaintenanceSectionProps {
  id: string;
  dictPricing: Dictionary['pricing'];
  dictMaint: Dictionary['pricingMaintenance'];
}

export function PricingMaintenanceSection(
  { id, dictPricing, dictMaint }: PricingMaintenanceSectionProps
): JSX.Element {
  const plans = MAINTENANCE_PLANS.map((planConfig) => {
    const planI18n = dictMaint.plans[planConfig.id];
    return {
      id:        planConfig.id,
      icon:      planConfig.icon,
      price:     planConfig.price,
      name:      planI18n.name,
      target:    planI18n.target,
      priceNote: planI18n.priceNote,
      features:  buildFeatures(planConfig, dictMaint.features),
      badge:     buildBadge(planConfig.badgeKey, dictPricing.badges),
      status:    buildStatus(planConfig.statusKey, dictPricing.status),
    };
  });

  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow t-eyebrow">
          {dictMaint.eyebrow}
        </p>
        <SectionTitle accent={dictMaint.titleAccent}>{dictMaint.title}</SectionTitle>
        <p className="section-intro t-body">{dictMaint.subtitle}</p>

        {/* Mobile — carousel natif */}
        <div className="plan-carousel-wrapper" aria-hidden="true">
          <PlanCarousel featuredIndex={1}>
            {plans.map((plan, i) => (
              <div key={plan.id} className="plan-carousel-item">
                <PlanCard
                  icon={plan.icon}
                  name={plan.name}
                  target={plan.target}
                  badge={plan.badge}
                  price={plan.price}
                  priceNote={plan.priceNote}
                  features={plan.features}
                  status={plan.status}
                  stagger={i}
                />
              </div>
            ))}
          </PlanCarousel>
        </div>

        {/* Desktop — grid inchangée */}
        <div className="plans-grid">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              icon={plan.icon}
              name={plan.name}
              target={plan.target}
              badge={plan.badge}
              price={plan.price}
              priceNote={plan.priceNote}
              features={plan.features}
              status={plan.status}
              stagger={i}
            />
          ))}
        </div>

        <p className="pricing-note t-caption">
        <span className="t-accent">{dictPricing.saasNoteAccent}{' '}</span>
        {dictPricing.saasNote}</p>

      </div>
    </RevealSection>
  );
}
