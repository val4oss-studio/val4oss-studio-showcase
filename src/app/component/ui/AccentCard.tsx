import type { JSX } from 'react';
import { getIcon } from './Icons';

export interface AccentCardProps {
  icon: string;
  title: string;
  body: string;
  accent: 'top' | 'left';
}

export function AccentCard({
  icon,
  title,
  body,
  accent,
}: AccentCardProps): JSX.Element {
  const Icon = getIcon(icon);

  return (
    <article className={`accent-card accent-card--${accent}`}>
      {Icon && (
        <div className="accent-card-icon" aria-hidden="true">
          <Icon />
        </div>
      )}
      <h3 className="t-h3">
        {title}
      </h3>
      <p className="t-body">
        {body}
      </p>
    </article>
  );
}
