import { JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import { RevealSection } from '@/app/component/layout';
import { 
  AccentCard,
  SectionTitle
} from '@/app/component/ui';
import { PILLARS } from '@/config/sections';

interface AboutSectionClientProps {
  id: string;
  dict: Dictionary['about'];
}

export function AboutSection({ id, dict }: AboutSectionClientProps): JSX.Element {
  return (
    <RevealSection id={id}>

      {/* Fading dot grid — visual continuity from hero */}
      <div className="bg-dots-end" aria-hidden="true" />

      <div className="section-container">

        <p className="section-eyebrow t-eyebrow">
          {dict.eyebrow}
        </p>

        <SectionTitle accent={dict.titleAccent}>{dict.title}</SectionTitle>

        <p className="section-intro t-body">
          {dict.intro}
        </p>

        <div className="about-pillars">
          {
            PILLARS.map((pillar) => {
              const pillarI18n = dict.pillars[pillar.id];
              return (
                <AccentCard
                  key={pillar.id}
                  icon={pillar.icon}
                  title={pillarI18n.label}
                  body={pillarI18n.body}
                  strike={pillarI18n.strike}
                  accent="top"
                />
              );
            })
          }
        </div>

      </div>
    </RevealSection>
  );
}
