import type { Dictionary } from '@/app/i18n/translations';
import { RevealSection } from '@/app/component/layout';
import { 
  AccentCard,
  SectionTitle
} from '@/app/component/ui';

interface WhyUsSectionProps {
  id: string;
  dict: Dictionary['whyUs'];
}

export function WhyUsSection({ id, dict }: WhyUsSectionProps) {
  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow section-eyebrow--right t-eyebrow">
          {dict.eyebrow}
        </p>
        <SectionTitle accent={dict.titleAccent}>
          {dict.title}
        </SectionTitle>
        <p className="section-intro t-body">{dict.subtitle}</p>

        <div className="why-grid">
          {
            dict.cards.map((card) => (
              <AccentCard
                key={card.icon}
                icon={card.icon}
                title={card.title}
                body={card.desc}
                accent="left"
              />
            ))
          }
        </div>

      </div>
    </RevealSection>
  );
}
