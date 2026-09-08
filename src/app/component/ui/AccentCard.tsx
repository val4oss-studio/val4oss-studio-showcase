import type { JSX } from 'react';
import { Icon } from './Icons';
import type { IconKey } from '@/config/icons';

export interface AccentCardProps {
  icon: IconKey;
  title: string;
  body: string;
  accent: 'top' | 'left';
  strike?: string; // Optional struck-through gold lead-in
}

export function AccentCard({
  icon,
  title,
  body,
  accent,
  strike,
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
