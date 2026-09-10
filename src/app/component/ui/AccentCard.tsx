import type { JSX } from 'react';
import { Icon } from './Icons';
import type { IconKey } from '@/config/icons';

export interface AccentCardProps {
  /** Identifiant stable — relie la case à cocher à son étiquette */
  id: string;
  icon: IconKey;
  title: string;
  body: string;
  accent: 'top' | 'left';
  strike?: string; // Optional struck-through gold lead-in
}

/*
 * Carte à accent — dépliable en mobile, statique au-delà de 48rem.
 *
 * Le repli s'appuie sur une case à cocher masquée plutôt que sur `<details>` :
 * forcer un `<details>` ouvert en desktop demande
 * `details::details-content { content-visibility: visible }`, trop récent pour
 * être la seule chose qui tienne la mise en page de bureau. Ici, c'est la
 * media query qui décide, et l'absence de règle en desktop suffit à tout
 * afficher — aucun repli à annuler.
 *
 * `<label>` n'accepte que du contenu de phrasé : il enveloppe le texte du
 * titre, pas le `<h3>`. Sa zone tactile est étendue à toute la ligne par un
 * `::after` en recouvrement (voir `.accent-card-summary`).
 */
export function AccentCard({
  id,
  icon,
  title,
  body,
  accent,
  strike,
}: AccentCardProps): JSX.Element {
  const toggleId = `accent-card-${id}`;

  return (
    <article className={`accent-card accent-card--${accent}`}>
      <input type="checkbox" id={toggleId} className="accent-card-toggle" />

      <div className="accent-card-summary">
        <div className="accent-card-icon" aria-hidden="true">
          <Icon name={icon}/>
        </div>
        <h3 className="t-h3">
          <label htmlFor={toggleId}>{title}</label>
        </h3>
        <span className="accent-card-chevron" aria-hidden="true">
          <Icon name="chevron-down"/>
        </span>
      </div>

      <p className="t-body accent-card-body">
        {
          strike && <>
            <span className="line-through t-accent">{strike}</span>{' '}
          </>
        }
        {body}
      </p>
    </article>
  );
}
