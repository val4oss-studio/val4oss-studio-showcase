import type { JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import { PROJECTS } from '@/config/projects';
import { RevealSection } from '@/app/component/layout';
import { ProjectCard, SectionTitle } from '@/app/component/ui';

interface PortfolioSectionProps {
  id:   string;
  dict: Dictionary['portfolio'];
}

export function PortfolioSection(
  { id, dict }: PortfolioSectionProps
): JSX.Element {
  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow t-eyebrow">
          {dict.eyebrow}
        </p>
        <SectionTitle accent={dict.titleAccent}>
          {dict.title}
        </SectionTitle>
        <p className="section-intro t-body">{dict.subtitle}</p>

        <div className="projects-stage">
          {PROJECTS.map((project, i) => {
            const projectI18n = dict.projects[project.id];
            return (
              <ProjectCard
                key={project.id}
                url={project.url}
                screenshot={project.screenshot}
                name={projectI18n.name}
                tagline={projectI18n.tagline}
                tags={project.tags}
                cta={dict.cta}
                index={i}
                priority={i === 0}
              />
            );
          })}
        </div>

      </div>
    </RevealSection>
  );
}
