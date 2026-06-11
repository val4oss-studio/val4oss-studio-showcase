import Image from 'next/image';
import { Dot, PulsePoint } from '@/app/component/ui';
import type { Dictionary } from '@/app/i18n/translations';
import { CURRENT_AVAILABILITY, AVAILABILITY_PULSE } from '@/config/availability';

interface HeroSectionProps {
  id: string;
  dict: Dictionary['hero'];
}

export function HeroSection({ id, dict }: HeroSectionProps) {
  return (
    <section id={id} className="section">
      <div className="bg-dots" aria-hidden="true"/>
      <div className="bg-dots bg-dots-fine" aria-hidden="true"/>
      <div className="bg-glow" aria-hidden="true"/>
      <div className="bg-shooting-star" aria-hidden="true"/>
      <div className="section-container">

        <div className="hero-stack mt-24">

          <div className="hero-eyebrow mb-8">
            {
              dict.eyebrow.map((label, index) => (
                <span key={label} className="flex items-center gap-3">
                  {index > 0 && <Dot />}
                  <p className="t-eyebrow">{label}</p>
                </span>
              ))
            }
          </div>

          <div className="hero-title-logo">
            <Image
              src="/val4oss_studio_logo_white.png"
              alt={dict.logoAlt}
              width={1991}
              height={954}
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </div>

          <div className="hero-tagline t-body mt-8">
            {dict.tagline}{' '}
            <span className="t-accent">{dict.taglineAccent}</span>.
            <br />
            {dict.taglineSuffix}
          </div>

          <div className="hero-availability mt-16">
            <PulsePoint status={AVAILABILITY_PULSE[CURRENT_AVAILABILITY]} />
            <p className="t-mono">{dict.availability[CURRENT_AVAILABILITY]}</p>
          </div>
        
        </div>
      </div>
    </section>
  );
}
