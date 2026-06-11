import type { JSX, CSSProperties } from 'react';
import { type FeatureItem } from '@/config/pricing';
import { getIcon } from '@/app/component/ui/Icons';

interface PlanCardProps {
  icon: string;
  name: string;
  target: string;
  price: string;          // Donnée statique : "490 – 690 €"
  priceFrom?: string;     // i18n : "à partir de" (absent = pas de préfixe)
  priceNote: string;      // i18n : "tarif unique" | "par mois"
  features: FeatureItem[];
  delay?: string;
  status?: string;
  badge?: string;
  stagger?: number;
}

export function PlanCard({
  icon, name, target, price, priceFrom, priceNote,
  features, delay, status, badge,
  stagger = 0,
}: PlanCardProps): JSX.Element {
  const Icon = getIcon(icon);

  return (
    <article
      className={`plan-card${status ? ' plan-card--featured' : ''}`}
      style={{ '--stagger': `${1000 + stagger * 150}ms` } as CSSProperties}
    >

      {/* Badge "Le plus choisi" — positionné en absolu en haut de la carte */}
      {status && (
        <span className="plan-card-badge-featured t-badge t-badge--on-gold">
          {status}
        </span>
      )}

      {/* Badge secondaire inline (ex: "Accès SaaS inclus") */}
      {badge && (
        <span className="plan-card-badge-secondary t-badge t-badge--secondary">
          {badge}
        </span>
      )}

      {/* En-tête : icône + nom + cible */}
      <div className="plan-card-header">
        {Icon && (
          <div className="plan-card-icon" aria-hidden="true">
            <Icon />
          </div>
        )}
        <div>
          <h3 className="plan-card-name">{name}</h3>
          <p className="plan-card-target">{target}</p>
        </div>
      </div>

      {/* Prix — préfixe i18n + montant statique + note */}
      <div>
        {priceFrom && (
          <p className="plan-card-price-from">{priceFrom}</p>
        )}
        <p className="plan-card-price">{price}</p>
        <p className="plan-card-price-note">{priceNote}</p>
      </div>

      {/* Divider */}
      <hr className="plan-card-divider" />

      {/* Features — liste exhaustive avec 3 états visuels */}
      <ul className="plan-card-features" role="list">
        {features.map((feature) => {
          const isExcluded = feature.status === 'excluded';
          const isOption   = feature.status === 'option';

          return (
            <li
              key={feature.key}
              className={[
                'plan-card-feature',
                isExcluded ? 'plan-card-feature--excluded' : '',
                isOption   ? 'plan-card-feature--option'   : '',
              ].filter(Boolean).join(' ')}
            >
              {/* Icône : ✕ si exclu, check gold si option, check vert si inclus */}
              {isExcluded ? (
                <span className="plan-card-cross" aria-hidden="true" />
              ) : (
                <span
                  className={`plan-card-check${isOption ? ' plan-card-check--option' : ''}`}
                  aria-hidden="true"
                />
              )}

              {/* Libellé + prix delta pour les options */}
              <span>
                {feature.label}
                {isOption && feature.priceLabel && (
                  <span className="plan-card-option-price"> {feature.priceLabel}</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Délai de livraison — plans dev seulement */}
      {delay && (
        <p className="plan-card-delay">
          <span className="plan-card-delay-dot" aria-hidden="true" />
          {delay}
        </p>
      )}

    </article>
  );
}
