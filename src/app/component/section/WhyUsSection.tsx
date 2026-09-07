import type { Dictionary } from '@/app/i18n/translations';
import { RevealSection } from '@/app/component/layout';
import { 
  AccentCard,
  SectionTitle
} from '@/app/component/ui';
import { WHY_CARDS } from '@/config/sections';

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
            WHY_CARDS.map((card) => {
              const cardI18n = dict.cards[card.id];
              return (
                <AccentCard
                  key={card.id}
                  icon={card.icon}
                  title={cardI18n.title}
                  body={cardI18n.desc}
                  accent="left"
                />
              );
            })
          }
        </div>

      </div>
    </RevealSection>
  );
}
