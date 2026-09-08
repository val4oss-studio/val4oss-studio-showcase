import type { JSX, CSSProperties } from 'react';
import type { FeatureItem } from '@/config/pricing';
import type { IconKey } from '@/config/icons'
import { Icon } from '@/app/component/ui/Icons';
import { PlanFeature } from '@/app/component/ui'

interface PlanCardProps {
  icon: IconKey;
  name: string;
  target: string;
  priceSetup: string;
  priceMonthly: string;
  priceFrom?: string;      // i18n : "à partir de" (absent = pas de préfixe)
  recurringPrefix: string; // i18n : "puis"
  recurringSuffix: string; // i18n : "/ mois"
  groups: { key: string; title: string; features: FeatureItem[] }[];
  status?: string;
  stagger?: number;
}

export function PlanCard({
  icon, name, target, priceSetup, priceMonthly, priceFrom,
  recurringPrefix, recurringSuffix, groups, status, stagger = 0,
}: PlanCardProps): JSX.Element {

  return (
    <article
      className={`plan-card plan-surface${status ? ' plan-card--featured' : ''}`}
      style={{ '--stagger': `${1000 + stagger * 150}ms` } as CSSProperties}
    >

      {/* Badge "Le plus choisi" — positionné en absolu en haut de la carte */}
      {status && (
        <span className="plan-card-badge-featured t-badge t-badge--on-gold">
          {status}
        </span>
      )}

      {/* Rangée 1 — en-tête + prix */}
      <div className="plan-card-head">
        <div className="plan-card-header">
          <div className="plan-card-icon" aria-hidden="true"><Icon name={icon} /></div>
          <div>
            <h3 className="plan-card-name">{name}</h3>
            <p className="plan-card-target">{target}</p>
          </div>
        </div>
      
        {/* Création (one-shot) à gauche, abonnement à droite — même
            structure : étiquette au-dessus, montant accentué en dessous. */}
        <div className="plan-card-prices">
          <div className="plan-card-price-block">
            {priceFrom && <p className="plan-card-price-label">{priceFrom}</p>}
            <p className="plan-card-price">{priceSetup}</p>
          </div>

          <div className="plan-card-price-block plan-card-price-block--recurring">
            <p className="plan-card-price-label">{recurringPrefix}</p>
            <p className="plan-card-price">
              {priceMonthly}
              <span className="plan-card-price-suffix">{recurringSuffix}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Rangées 2..n — un bloc par groupe, chacun ouvert par son filet */}
      {groups.map((group) => (
        <div className="plan-card-group" key={group.key}>
          <hr className="plan-card-divider" />
          <p className="plan-card-group-title" aria-hidden="true">{group.title}</p>
          <ul className="plan-card-features" role="list" aria-label={group.title}>
            {group.features.map((feature) => (
              <PlanFeature key={feature.key} feature={feature} />
            ))}
          </ul>
        </div>
      ))}

    </article>
  );
}
