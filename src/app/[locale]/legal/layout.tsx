import type { JSX, ReactNode } from 'react';
import { LEGAL_DOC_LOCALE } from '@/config/legal';

interface LegalLayoutProps {
  children: ReactNode;
}

/*
 * Enveloppe commune aux documents légaux rendus depuis MDX.
 *
 * Les documents ne sont pas traduits : le corps porte `lang="fr"` même quand
 * l'interface est en anglais, pour que les lecteurs d'écran et les moteurs
 * sachent dans quelle langue le texte est rédigé.
 */
export default function LegalLayout({ children }: LegalLayoutProps): JSX.Element {
  return (
    <div className="legal-page">
      <article className="legal-prose" lang={LEGAL_DOC_LOCALE}>
        {children}
      </article>
    </div>
  );
}
