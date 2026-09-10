import { type JSX, type CSSProperties } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import {
  PLANS, PLAN_GROUP_KEYS,
  buildFeatureGroups, buildSharedOptions, buildStatus,
} from '@/config/pricing';
import { RevealSection } from '@/app/component/layout';
import { 
  PlanGroupLabel,
  PlanCard,
  PlanCarousel,
  PlanFeature,
  SectionTitle,
} from '@/app/component/ui';

interface PricingSectionProps {
  id: string;
  dict: Dictionary['pricing'];
}

export function PricingSection({ id, dict }: PricingSectionProps): JSX.Element {
  const plans = PLANS.map((planConfig) => {
    const planI18n = dict.plans[planConfig.id];
    return {
      id: planConfig.id,
      icon: planConfig.icon,
      priceSetup: planConfig.priceSetup,
      priceMonthly: planConfig.priceMonthly,
      name: planI18n.name,
      target: planI18n.target,
      groups: buildFeatureGroups(planConfig, dict.features).map((group) => ({
        ...group,
        title: dict.groups[group.key].title,
      })),
      status: buildStatus(planConfig.statusKey, dict.status),
    };
  });

  const sharedOptions = buildSharedOptions(dict.features);

  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow t-eyebrow">{dict.eyebrow}</p>
        <SectionTitle accent={dict.titleAccent}>{dict.title}</SectionTitle>
        <p className="section-intro t-body">{dict.subtitle}</p>

        {/* Mobile — carousel natif */}
        <div className="plan-carousel-wrapper" aria-hidden="true">
          <PlanCarousel featuredIndex={1}>
            {plans.map((plan, i) => (
              <div key={plan.id} className="plan-carousel-item">
                <PlanCard
                  icon={plan.icon}
                  name={plan.name}
                  target={plan.target}
                  priceSetup={plan.priceSetup}
                  priceMonthly={plan.priceMonthly}
                  priceFrom={dict.priceFrom}
                  recurringPrefix={dict.recurringPrefix}
                  recurringSuffix={dict.recurringSuffix}
                  groups={plan.groups}
                  status={plan.status}
                  stagger={i}
                />
              </div>
            ))}
          </PlanCarousel>
        </div>

        {/* Les trois rangées partagent la colonne de libellés via `subgrid` :
            elles doivent donc vivre sous une même grille de référence. */}
        <div className="plans-block">

          {/* Desktop — en-tête + les 3 plans */}
          <div className="plans-layout">
            {
              PLAN_GROUP_KEYS.map((groupKey, i) => (
                <PlanGroupLabel
                  key={groupKey}
                  order={i + 1}
                  title={dict.groups[groupKey].title}
                  subtitle={dict.groups[groupKey].subtitle}
                />
              ))
            }
            {plans.map((plan, i) => (
              <PlanCard
                key={plan.id}
                icon={plan.icon}
                name={plan.name}
                target={plan.target}
                priceSetup={plan.priceSetup}
                priceMonthly={plan.priceMonthly}
                priceFrom={dict.priceFrom}
                recurringPrefix={dict.recurringPrefix}
                recurringSuffix={dict.recurringSuffix}
                groups={plan.groups}
                status={plan.status}
                stagger={i}
              />
            ))}
          </div>

          {/* Bande options — visible desktop ET mobile, en dehors du carousel */}
          <div className="plan-row">
            <PlanGroupLabel
              order={PLAN_GROUP_KEYS.length + 1}
              title={dict.options.title}
              subtitle={dict.options.subtitle}
            />
            {/* La liste EST la surface : pas de wrapper décoratif autour. */}
            <ul
              className="plan-options-list plan-surface"
              role="list"
              aria-label={dict.options.title}
              style={{ '--stagger': '1500ms' } as CSSProperties}
            >
              {sharedOptions.map((option) => (
                <PlanFeature key={option.key} feature={option} />
              ))}
            </ul>
          </div>

          {/* Espace client inclus — même gabarit que la bande options */}
          <div className="plan-row">
            <PlanGroupLabel
              order={PLAN_GROUP_KEYS.length + 2}
              title={dict.saasNote.title}
              subtitle={dict.saasNote.subtitle}
            />
            <p
              className="plan-note plan-surface t-caption"
              style={{ '--stagger': '1650ms' } as CSSProperties}
            >
              {dict.saasNote.body}
            </p>
          </div>

        </div>
      </div>
    </RevealSection>
  );
}
