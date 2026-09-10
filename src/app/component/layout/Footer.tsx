import Link from 'next/link';
import type { JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import { LEGAL_DOC_KEYS, legalDocHref } from '@/config/legal';
import { RESOURCE_KEYS, RESOURCE_URLS } from '@/config/resources';
import { SECTION_IDS, NAV_SECTION_KEYS } from '@/config/sections';
import { Icon, SectionLink } from '@/app/component/ui';

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
                  <SectionLink
                    href={`/${locale}#${SECTION_IDS[key]}`}
                    className="t-link t-caption"
                  >
                    {dictNav[key]}
                  </SectionLink>
                </li>
              ))
            }
            </ul>
          </nav>

          {/* ── Resources column ──
              Services hébergés sur leurs propres sous-domaines : de vrais
              liens sortants, jamais `next/link`. */}
          <nav aria-label={dictFooter.resources.label}>
            <p className="t-eyebrow">{dictFooter.resources.label}</p>
            <ul className="footer-links">
            {
              RESOURCE_KEYS.map((key) => (
                <li key={key}>
                  <a
                    href={RESOURCE_URLS[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-link t-caption"
                  >
                    {dictFooter.resources.links[key]}
                  </a>
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
                  <Icon name="github"/>

                  {dictSocial.github}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Liens légaux + copyright ── */}
        <div className="footer-bottom">
          <nav aria-label={dictFooter.legal.label}>
            <ul className="footer-legal-links">
            {
              LEGAL_DOC_KEYS.map((key) => (
                <li key={key}>
                  <Link
                    href={legalDocHref(locale, key)}
                    className="t-link t-caption"
                  >
                    {dictFooter.legal.links[key]}
                  </Link>
                </li>
              ))
            }
            </ul>
          </nav>

          <p className="t-caption">{copyright}</p>
        </div>
      </div>

    </footer>
  );
}
