import { JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import { RevealSection } from '@/app/component/layout';
import { 
  AccentCard,
  SectionTitle
} from '@/app/component/ui';

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
            dict.pillars.map((pillar) => (
              <AccentCard
                key={pillar.key}
                icon={pillar.key}
                title={pillar.label}
                body={pillar.body}
                accent="top"
              />
            ))
          }
        </div>

      </div>
    </RevealSection>
  );
}
