import type { JSX } from 'react';
import { Icon } from './Icons';

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

  return (
    <article className={`accent-card accent-card--${accent}`}>
      <div className="accent-card-icon" aria-hidden="true">
        <Icon name={icon}/>
      </div>
      <h3 className="t-h3">
        {title}
      </h3>
      <p className="t-body">
        {body}
      </p>
    </article>
  );
}
