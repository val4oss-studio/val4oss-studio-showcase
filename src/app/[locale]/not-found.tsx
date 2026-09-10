import { locale as localeParam } from 'next/root-params';
import type { JSX } from 'react';
import { Button } from '@/app/component/ui';
import { getDictionary } from '@/app/i18n/translations';
import { defaultLocale, isValidLocale } from '@/config/locale';

/*
 * Frontière 404 du sous-arbre [locale] : elle rend le `notFound()` levé par le
 * catch-all `[...slug]`, à l'intérieur du layout (navbar, footer, fond vidéo)
 * — elle ne rend donc ni <html> ni <body>.
 *
 * Contrairement à `error.tsx`, c'est un Server Component : le dictionnaire lui
 * est accessible, la copie vit dans `i18n/locales/*.json` et non dans
 * `config/errorPages.ts` (réservé aux frontières d'erreur, forcément client).
 */
export default async function NotFound(): Promise<JSX.Element> {
  /*
   * `not-found.tsx` ne reçoit aucune prop — Next l'instancie avec
   * `createElement(Component, null)`. La locale se lit donc via
   * `next/root-params`, seul canal disponible ici : `[locale]` est le segment
   * dynamique au-dessus du root layout, donc un root param.
   */
  const raw = await localeParam();
  const locale = isValidLocale(raw) ? raw : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <section className="section">
      <div className="bg-dots" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      <div className="section-container error-page">
        <p className="t-eyebrow">404</p>
        <h1 className="t-h1">{dict.notFound.title}</h1>
        <p className="t-body error-page-intro">{dict.notFound.description}</p>

        <div className="error-actions">
          <Button href={`/${locale}`} variant="primary">
            {dict.notFound.button}
          </Button>
        </div>
      </div>
    </section>
  );
}
