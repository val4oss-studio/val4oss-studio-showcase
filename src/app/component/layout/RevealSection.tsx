'use client';
/*
 * RevealSection — Shared wrapper for scroll-animated sections.
 *
 * Combines two behaviors:
 *  1. IntersectionObserver → adds `is-visible` to trigger CSS animations
 *  2. SectionConnector     → scroll-driven gold thread at the section top
 *
 * The section ref is shared with SectionConnector via prop — both effects
 * need to observe the same <section> element.
 *
 * Usage:
 *   <RevealSection id="about">…content…</RevealSection>
 *   <RevealSection id="hero-alt" connector={false}>…no thread…</RevealSection>
 */

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { SectionConnector } from '@/app/component/layout/SectionConnector';

interface RevealSectionProps {
  id: string;
  className?: string;
  connector?: boolean;
  children: ReactNode;
}

export function RevealSection({ 
  id,
  className,
  connector = true,
  children
}: RevealSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { 
        rootMargin: '0px 0px -20% 0px', // Trigger when section is 80% visible
        threshold: 0.15 // + trigger when 15% of the section is visible (for shorter sections)
      }
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={['section', className].filter(Boolean).join(' ')}
    >
      {connector && <SectionConnector sectionRef={sectionRef} />}
      {children}
    </section>
  );
}
