'use client';
/*
 * Navbar — Barre fixe, transparente au-dessus du hero.
 *
 * Desktop : les liens se répartissent autour du logo (qui tient le rôle du
 * lien « accueil »), et l'ensemble se rétracte légèrement dès que la page
 * quitte le haut — classe `is-scrolled`, tout le reste est en CSS.
 * Mobile  : bouton hamburger dont les trois traits se replient en croix,
 * ouvrant un overlay plein écran.
 *
 * Les libellés et les ancres viennent des mêmes sources que le Footer
 * (dictionnaire `nav` + SECTION_IDS) : une seule liste de sections à tenir.
 */

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';
import { SECTION_IDS, NAV_SECTION_KEYS } from '@/config/sections';
import type { Locale } from '@/config/locale';
import type { Dictionary } from '@/app/i18n/translations';
import { LanguageToggle } from '@/app/component/layout/LanguageToggle';
import { SectionLink } from '@/app/component/ui';

type NavKey = typeof NAV_SECTION_KEYS[number];

interface NavbarProps {
  dictNav: Dictionary['nav'];
  locale: Locale;
}

/* Le logo porte déjà « home » — il ne repasse pas dans la liste des liens */
const LINK_KEYS: NavKey[] = NAV_SECTION_KEYS.filter((key) => key !== 'home');

/* Coupure gauche / droite du bandeau desktop, de part et d'autre du logo */
const SPLIT_INDEX = Math.ceil(LINK_KEYS.length / 2);

/* Distance de scroll au-delà de laquelle la barre se rétracte */
const SCROLL_THRESHOLD = 40;

export function Navbar({ dictNav, locale }: NavbarProps): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    /* passive: true — le listener ne bloque jamais le thread principal */
    const sync = (): void => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);

    sync(); /* position restaurée, lien avec ancre… */
    window.addEventListener('scroll', sync, { passive: true });

    return () => window.removeEventListener('scroll', sync);
  }, []);

  /* Overlay ouvert : la page derrière ne doit plus défiler, et Échap ferme */
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenu = (): void => setIsMenuOpen(false);
  const sectionHref = (key: NavKey): string =>
    `/${locale}#${SECTION_IDS[key]}`;

  const homeLink = (className: string): JSX.Element => (
    <SectionLink
      href={sectionHref('home')}
      className={className}
      aria-label={dictNav.home}
      onClick={closeMenu}
    >
      <Image
        src="/val4oss_logo_white.png"
        alt={dictNav.home}
        width={280}
        height={200}
        className="navbar-logo-image"
        /* Toujours au-dessus de la ligne de flottaison, et LCP sur les pages
           sans hero (documents légaux) : jamais de chargement différé. */
        loading="eager"
      />
    </SectionLink>
  );

  return (
    <header
      className={['navbar', isScrolled && 'is-scrolled']
        .filter(Boolean)
        .join(' ')}
    >
      <div className="section-container navbar-inner">

        {/* ── Bandeau desktop : liens · logo · liens ── */}
        <nav className="navbar-desktop" aria-label={dictNav.label}>
          <ul className="navbar-links navbar-links--left">
            {
              LINK_KEYS.slice(0, SPLIT_INDEX).map((key) => (
                <li key={key}>
                  <SectionLink href={sectionHref(key)} className="navbar-link">
                    {dictNav[key]}
                  </SectionLink>
                </li>
              ))
            }
          </ul>

          {homeLink('navbar-logo')}

          <ul className="navbar-links navbar-links--right">
            {
              LINK_KEYS.slice(SPLIT_INDEX).map((key) => (
                <li key={key}>
                  <SectionLink href={sectionHref(key)} className="navbar-link">
                    {dictNav[key]}
                  </SectionLink>
                </li>
              ))
            }
          </ul>
        </nav>

        <div className="navbar-actions">
          <LanguageToggle locale={locale} label={dictNav.language} />
        </div>

        {/* ── Bandeau mobile : logo · hamburger ── */}
        <div className="navbar-mobile">
          {homeLink('navbar-logo')}

          <button
            type="button"
            className={['navbar-burger', isMenuOpen && 'is-open']
              .filter(Boolean)
              .join(' ')}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? dictNav.menuClose : dictNav.menuOpen}
            aria-expanded={isMenuOpen}
            aria-controls="navbar-menu"
          >
            <span className="navbar-burger-line" />
            <span className="navbar-burger-line" />
            <span className="navbar-burger-line" />
          </button>
        </div>

      </div>

      {/* Filet or dégradé — écho du bord haut du footer, révélé au scroll */}
      <div className="navbar-border" aria-hidden="true" />

      {/* ── Overlay mobile ── */}
      <div
        id="navbar-menu"
        className={['navbar-menu', isMenuOpen && 'is-open']
          .filter(Boolean)
          .join(' ')}
      >
        <nav aria-label={dictNav.label}>
          <ul className="navbar-menu-links">
            {
              NAV_SECTION_KEYS.map((key) => (
                <li key={key}>
                  <SectionLink
                    href={sectionHref(key)}
                    className="navbar-menu-link"
                    onClick={closeMenu}
                  >
                    {dictNav[key]}
                  </SectionLink>
                </li>
              ))
            }
          </ul>
        </nav>

        <div className="navbar-menu-actions">
          <LanguageToggle locale={locale} label={dictNav.language} />
        </div>
      </div>

    </header>
  );
}
