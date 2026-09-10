'use client';

import { useParams } from 'next/navigation';
import type { JSX } from 'react';
import { Button } from '@/app/component/ui';
import { ERROR_PAGE_COPY } from '@/config/errorPages';
import { defaultLocale, isValidLocale } from '@/config/locale';

interface LocaleErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

/*
 * Frontière d'erreur du sous-arbre [locale] : elle couvre les pages, pas le
 * layout au-dessus (navbar, footer) — celui-ci relève de `global-error.tsx`.
 * Concrètement, un plantage du carrousel de tarifs affiche cet écran au lieu
 * de vider la page entière.
 */
export default function LocaleError({ error, retry }: LocaleErrorProps): JSX.Element {
  const params = useParams<{ locale: string }>();
  const locale = isValidLocale(params.locale) ? params.locale : defaultLocale;
  const copy = ERROR_PAGE_COPY[locale];

  return (
    <section className="section">
      <div className="bg-dots" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <div className="section-container error-page">
        <p className="t-eyebrow">{copy.eyebrow}</p>
        <h1 className="t-h1">{copy.title}</h1>
        <p className="t-body error-page-intro">{copy.subtitle}</p>

        {/* Le digest est le seul lien entre cet écran et les logs serveur */}
        {error.digest && (
          <p className="t-mono">{copy.reference} : {error.digest}</p>
        )}

        <div className="error-actions">
          <Button onClick={retry} variant="primary">
            {copy.retry}
          </Button>
          <Button href={`/${locale}`} variant="secondary">
            {copy.home}
          </Button>
        </div>
      </div>
    </section>
  );
}
