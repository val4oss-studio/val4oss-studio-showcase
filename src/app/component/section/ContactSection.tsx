import type { JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import { CONTACT_CHANNELS } from '@/config/contact';
import { RevealSection } from '@/app/component/layout';
import { SectionTitle, getIcon } from '@/app/component/ui';

interface ContactSectionProps {
  id:   string;
  dict: Dictionary['contact'];
}

export function ContactSection(
  { id, dict }: ContactSectionProps
): JSX.Element {
  return (
    <RevealSection id={id}>
      <div className="section-container">

        <p className="section-eyebrow section-eyebrow--right t-eyebrow">{dict.eyebrow}</p>
        <SectionTitle accent={dict.titleAccent}>{dict.title}</SectionTitle>
        <p className="section-intro t-body">{dict.subtitle}</p>

        {/*
          * Réutilise about-pillars (grille 3 colonnes) et accent-card--top.
          * Les <a> reçoivent les mêmes classes que les <article> de AboutSection
          * — le CSS est agnostique au type d'élément.
          */}
        <div className="about-pillars">
          {CONTACT_CHANNELS.map((channel) => {
            const channelI18n = dict.channels[channel.id];
            const Icon = getIcon(channel.icon);
            const isExternal = !channel.href.startsWith('mailto:');

            return (
              <a
                key={channel.id}
                href={channel.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer': undefined}
                className="accent-card accent-card--top"
                aria-label={`${channelI18n.label} — ${channel.handle}`}
              >
                {Icon && (
                  <div className="accent-card-icon" aria-hidden="true">
                    <Icon />
                  </div>
                )}

                <h3 className="t-h3">{channelI18n.label}</h3>

                <p className="t-body">{channelI18n.desc}</p>

                {/* Adresse visible — mise en valeur en or */}
                <p className="t-caption t-accent" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                  {channel.handle} ↗
                </p>
              </a>
            );
          })}
        </div>

      </div>
    </RevealSection>
  );
}
