import Link from 'next/link';
import type { JSX } from 'react';
import type { Dictionary } from '@/app/i18n/translations';
import { SECTION_IDS } from '@/config/sections';

interface FooterProps {
  id: string;
  dictFooter: Dictionary['footer'];
  dictNav: Dictionary['nav'];
  dictSocial: Dictionary['social'];
  locale: string;
}

/* GitHub mark — inline SVG, no external dependency */
function GitHubIcon(): JSX.Element {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839
        9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703
        -2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466
        -1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032
        1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088
        .636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988
        1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75
        1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337
        1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
        .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943
        .359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747
        0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484
        17.522 2 12 2z"
      />
    </svg>
  );
}

export function Footer({ dictFooter, dictNav, dictSocial, locale }: FooterProps) {
  const year = new Date().getFullYear();
  const copyright = dictFooter.legal.copyright.replace('{year}', String(year));

  return (
    <footer className="footer" role="contentinfo" aria-label={dictFooter.arialabel}>

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
              <li>
                <Link
                  href={`/${locale}#${SECTION_IDS.home}`}
                  className="t-link t-caption"
                >
                  {dictNav.home}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#${SECTION_IDS.about}`}
                  className="t-link t-caption"
                >
                  {dictNav.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#${SECTION_IDS.whyUs}`}
                  className="t-link t-caption"
                >
                  {dictNav.whyUs}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#${SECTION_IDS.pricingDev}`}
                  className="t-link t-caption"
                >
                  {dictNav.pricingDev}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}#${SECTION_IDS.pricingMaintenance}`}
                  className="t-link t-caption"
                >
                  {dictNav.pricingMaintenance}
                </Link>
              </li>
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
                  <GitHubIcon />
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
