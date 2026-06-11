'use client';

import { useRef, useEffect, type ReactNode, type JSX } from 'react';

interface PlanCarouselProps {
  /** Index 0-based du plan à afficher par défaut (le plan "featured") */
  featuredIndex?: number;
  children: ReactNode;
}

function scrollToFeatured(
  el: HTMLElement,
  target: HTMLElement,
  behavior: ScrollBehavior = 'auto',
): void {
  el.scrollTo({
    left: target.offsetLeft - (el.offsetWidth - target.offsetWidth) / 2,
    behavior,
  });
}

export function PlanCarousel(
  { featuredIndex = 1, children }: PlanCarouselProps
): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll initial vers le plan featured — s'exécute avant que l'utilisateur
  // ne scrolle jusqu'à la section, donc pas de flash visible
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = Array.from(el.children) as HTMLElement[];
    const target = items[featuredIndex];
    if (!target) return;

    scrollToFeatured(el, target);

    // Apply is-centered immediately without waiting intersection observer, to
    // avoid flash of wrong scale on the featured item during initial scroll.
    items.forEach((item, i) => {
      item.classList.toggle('is-centered', i === featuredIndex);
    });
  }, [featuredIndex]);

  // Détecte quelle carte est centrée (snappée) pour appliquer scale(1)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-centered', entry.intersectionRatio > 0.6);
        });
      },
      { root: el, threshold: [0, 0.6, 1] },
    );

    Array.from(el.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  // Item clickable
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClick = (e: MouseEvent) => {
      const items = Array.from(el.children) as HTMLElement[];
      // Trouve quel enfant direct contient l'élément cliqué
      const clicked = items.find((item) => item.contains(e.target as Node));

      // Ignore si aucune carte trouvée ou si c'est déjà la carte centrée
      if (!clicked || clicked.classList.contains('is-centered')) return;

      scrollToFeatured(el, clicked, 'smooth');
    };

    el.addEventListener('click', handleClick);
    return () => el.removeEventListener('click', handleClick);
  }, []);

  return (
    <div ref={ref} className="plan-carousel">
      {children}
    </div>
  );
}
