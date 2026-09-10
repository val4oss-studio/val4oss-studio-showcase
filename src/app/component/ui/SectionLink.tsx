'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { JSX, MouseEvent, ReactNode } from 'react';

interface SectionLinkProps {
  /** Ancre absolue, locale comprise — `/fr#about` */
  href: string;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  /** Fermeture du menu mobile, le cas échéant */
  onClick?: () => void;
}

/*
 * Lien vers une section de la page d'accueil.
 *
 * Il n'existe que pour rattraper un angle mort de `next/link` : la navigation
 * est côté client, et pousser l'URL courante est un no-op. Quand on est déjà
 * sur `/fr#about`, qu'on a fait défiler ailleurs, puis qu'on reclique « À
 * propos », l'URL ne change pas — donc rien ne bouge. Un `<a>` natif, lui,
 * redéfile vers l'ancre à chaque clic.
 *
 * On rétablit ce comportement, et uniquement dans ce cas : dès que le chemin
 * ou l'ancre diffèrent, `next/link` reprend la main.
 */
export function SectionLink({
  href,
  children,
  className,
  'aria-label': ariaLabel,
  onClick,
}: SectionLinkProps): JSX.Element {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    onClick?.();

    /* Ctrl/Cmd/Maj-clic : ouverture dans un onglet, on ne s'en mêle pas */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const [path, hash] = href.split('#');
    if (!hash) return;
    if (path !== pathname || window.location.hash !== `#${hash}`) return;

    event.preventDefault();

    /*
     * Reporté d'une frame : `onClick` peut être `closeMenu`, et tant que
     * l'overlay est ouvert le `<body>` porte `overflow: hidden`, qui empêche
     * tout défilement. React vide sa file avant le rAF, donc l'overflow est
     * rétabli quand celui-ci s'exécute.
     */
    requestAnimationFrame(() => {
      /* `scrollIntoView` honore le `scroll-padding-top` de <html>, qui dégage
         la navbar fixe, et son `scroll-behavior: smooth`. */
      document.getElementById(hash)?.scrollIntoView();
    });
  };

  return (
    <Link
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
