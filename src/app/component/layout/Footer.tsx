import Link from 'next/link';
import type { JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import { SECTION_IDS, NAV_SECTION_KEYS } from '@/config/sections';
import { getIcon } from '@/app/component/ui';

interface FooterProps {
  dictFooter: Dictionary['footer'];
  dictNav: Dictionary['nav'];
  dictSocial: Dictionary['social'];
  locale: string;
}

export function Footer({ 
  dictFooter, dictNav, dictSocial, locale 
}: FooterProps): JSX.Element {
  const year = new Date().getFullYear();
  const copyright = dictFooter.legal.copyright.replace('{year}', String(year));
  const Icon = getIcon('github');

  return (
    <footer className="footer" role="contentinfo" aria-label={dictFooter.ariaLabel}>

      {/* Decorative gradient border — echoes the gold accent of the hero */}
      <div className="footer-border" aria-hidden="true" />

      <div className="section-container">
        <div className="footer-grid">

          {/* ── Brand column ── */}
          <div>
            <p className="t-h4">{dictFooter.brand}</p>
            <p className="footer-brand-tagline">{dictFooter.tagline}</p>
          </div>

          {/* ── Navigation column ── */}
          <nav aria-label={dictNav.label}>
            <p className="t-eyebrow">{dictNav.label}</p>
            <ul className="footer-links">
            {
              NAV_SECTION_KEYS.map((key) => (
                <li key={key}>
                  <Link
                    href={`/${locale}#${SECTION_IDS[key]}`}
                    className="t-link t-caption"
                  >
                    {dictNav[key]}
                  </Link>
                </li>
              ))
            }
            </ul>
          </nav>

          {/* ── Social column ── */}
          <div>
            <p className="t-eyebrow">{dictSocial.label}</p>
            <ul className="footer-links">
              <li>
                <a
                  href="https://github.com/val4oss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-link t-caption flex items-center gap-2"
                >
                  {Icon && <Icon />}
                  {dictSocial.github}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Copyright bar ── */}
        <div className="footer-bottom">
          <p className="t-caption">{copyright}</p>
        </div>
      </div>

    </footer>
  );
}
