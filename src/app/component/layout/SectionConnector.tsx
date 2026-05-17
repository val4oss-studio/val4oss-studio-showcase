'use client';

/*
 * SectionConnector — Scroll-driven gold thread between sections.
 *
 * Receives the parent section's ref from RevealSection — explicit
 * prop drilling avoids a hidden DOM coupling via closest().
 */

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface SectionConnectorProps {
  sectionRef: RefObject<HTMLElement | null>;
}

export function SectionConnector({ sectionRef }: SectionConnectorProps) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const gemRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line    = lineRef.current;
    const gem     = gemRef.current;
    if (!section || !line || !gem) return;

    let raf = 0;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh   = window.innerHeight;

      /*
       * progress = 0 : le top de la section est au bas du viewport (entrée)
       * progress = 1 : le top de la section atteint le haut du viewport
       * Le scroll en arrière fait rétracter le fil.
       */
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / vh));
      line.style.transform = `scaleY(${progress})`;

      /*
       * Le gem n'apparaît que dans les derniers 30% de progress,
       * simulant un "atterrissage" à la fin du tracé du fil.
       */
      const gemOpacity = Math.max(0, Math.min(1, (progress - 0.7) / 0.3));
      gem.style.opacity = String(gemOpacity);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    /* passive: true — le scroll listener ne bloque jamais le thread principal */
    window.addEventListener('scroll', onScroll, { passive: true });
    update(); /* sync initial avant le premier scroll */

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef]); // sectionRef est stable (useRef) — pas de re-run

  return (
    <div className="section-connector" aria-hidden="true">
      <span className="section-connector-line" ref={lineRef} />
      <span className="section-connector-gem"  ref={gemRef}>
        <span className="section-connector-gem-ring" />
      </span>
    </div>
  );
}
