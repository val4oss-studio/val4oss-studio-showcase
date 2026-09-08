import type { JSX } from 'react';
import type { FeatureItem } from '@/config/pricing';

interface PlanFeatureProps {
  feature: FeatureItem;
}

export function PlanFeature({ feature }: PlanFeatureProps): JSX.Element {
  const isExcluded = feature.status === 'excluded';
  const isOption   = feature.status === 'option';

  return (
    <li
      className={[
        'plan-card-feature',
        isExcluded ? 'plan-card-feature--excluded' : '',
        isOption   ? 'plan-card-feature--option'   : '',
      ].filter(Boolean).join(' ')}
    >
      {isExcluded ? (
        <span className="plan-card-cross" aria-hidden="true" />
      ) : (
        <span
          className={`plan-card-check${isOption ? ' plan-card-check--option' : ''}`}
          aria-hidden="true"
        />
      )}

      <span>
        {feature.label}
        {isOption && feature.priceLabel && (
          <span className="plan-card-option-price"> {feature.priceLabel}</span>
        )}
      </span>
    </li>
  );
}
