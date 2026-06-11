import { type JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import {
  DEV_PLANS,
  buildDevFeatures as buildFeatures,
  buildBadge,
  buildStatus,
} from '@/config/pricing';
import { RevealSection } from '@/app/component/layout';
import { 
  PlanCard,
  PlanCarousel,
  SectionTitle,
} from '@/app/component/ui';

interface PricingDevSectionProps {
  id: string;
  dictPricing: Dictionary['pricing'];
  dictDev: Dictionary['pricingDev'];
}

export function PricingDevSection(
  { id, dictPricing, dictDev }: PricingDevSectionProps
): JSX.Element {
  const plans = DEV_PLANS.map((planConfig) => {
    const planI18n = dictDev.plans[planConfig.id];
    return {
      id:        planConfig.id,
      icon:      planConfig.icon,
      price:     planConfig.price,
      name:      planI18n.name,
      target:    planI18n.target,
      priceNote: planI18n.priceNote,
      delay:     planI18n.delay,
      features:  buildFeatures(planConfig, dictDev.features),
      badge:     buildBadge(planConfig.badgeKey, dictPricing.badges),
      status:    buildStatus(planConfig.statusKey, dictPricing.status),
    };
  });

  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow section-eyebrow--right t-eyebrow">{dictDev.eyebrow}</p>
        <SectionTitle accent={dictDev.titleAccent}>{dictDev.title}</SectionTitle>
        <p className="section-intro t-body">{dictDev.subtitle}</p>

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
                  priceFrom={dictDev.priceFrom}
                  priceNote={plan.priceNote}
                  features={plan.features}
                  delay={plan.delay}
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
              priceFrom={dictDev.priceFrom}
              priceNote={plan.priceNote}
              features={plan.features}
              delay={plan.delay}
              status={plan.status}
              stagger={i}
            />
          ))}
        </div>

      </div>
    </RevealSection>
  );
}
