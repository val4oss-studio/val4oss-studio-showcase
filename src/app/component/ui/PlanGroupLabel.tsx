import type { JSX, CSSProperties } from 'react';

interface PlanGroupLabelProps {
  /** Rang du groupe dans la section — pilote la rangée de grille et le stagger */
  order: number;
  title: string;
  subtitle: string;
}

export function PlanGroupLabel({ order, title, subtitle }: PlanGroupLabelProps): JSX.Element {
  return (
    <div
      className="plan-group-label"
      style={{ '--group-row': order + 1, '--stagger': `${1200 + order * 150}ms` } as CSSProperties}
    >
      <p className="plan-group-label-title">{title}</p>
      <span className="plan-group-label-rule" aria-hidden="true" />
      <p className="plan-group-label-subtitle">{subtitle}</p>
    </div>
  );
}
