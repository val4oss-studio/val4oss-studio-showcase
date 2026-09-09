'use client';
/*
 * LanguageToggle — Bascule FR ⇄ EN par redirection.
 *
 * Le href pointe vers la route courante dans l'autre locale : le lien reste
 * valide sans JavaScript et lisible par les crawlers. Au clic, le hash de la
 * page (#pricing…) est réinjecté pour retomber sur la même section — il n'est
 * pas connu au rendu serveur, d'où la navigation manuelle.
 */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { JSX, MouseEvent } from 'react';
import { isValidLocale, locales, type Locale } from '@/config/locale';
import { Icon } from '@/app/component/ui';

interface LanguageToggleProps {
  locale: Locale;
  /** Libellé accessible — « Changer de langue » */
  label: string;
}

/** Remplace le segment de locale du chemin courant par `next`. */
function swapLocale(pathname: string, next: Locale): string {
  /* Le chemin commence par « / » : segments[0] est vide */
  const segments = pathname.split('/');

  if (isValidLocale(segments[1] ?? '')) {
    segments[1] = next;
    return segments.join('/');
  }

  return `/${next}${pathname}`;
}

export function LanguageToggle({
  locale,
  label,
}: LanguageToggleProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();

  const index = locales.indexOf(locale);
  const nextLocale = locales[(index + 1) % locales.length];
  const href = swapLocale(pathname, nextLocale);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    /* Clic modifié (nouvel onglet, etc.) : laisser le navigateur décider */
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const { hash } = window.location;
    if (!hash) return;

    event.preventDefault();
    router.push(`${href}${hash}`);
  };

  return (
    <Link
      href={href}
      hrefLang={nextLocale}
      onClick={handleClick}
      className="lang-toggle"
      aria-label={`${label} (${nextLocale.toUpperCase()})`}
      title={label}
    >
      <Icon name="language" />
      <span className="lang-toggle-code">{nextLocale.toUpperCase()}</span>
    </Link>
  );
}
