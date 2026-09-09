import type { Metadata } from 'next';
import { getDictionary } from '@/app/i18n/translations';
import {
  LEGAL_DOC_DESCRIPTIONS,
  LEGAL_DOC_LOCALE,
  legalDocHref,
  type LegalDocKey,
} from '@/config/legal';
import type { Locale } from '@/config/locale';

interface LegalDocumentProps {
  params: Promise<{ locale: string }>;
}

type GenerateMetadata = (props: LegalDocumentProps) => Promise<Metadata>;

/*
 * Fabrique le `generateMetadata` d'un document légal.
 *
 * Les métadonnées ne peuvent pas être exportées depuis le `.mdx` lui-même :
 * @next/mdx compile la page hors de la couche serveur, et Next refuse alors
 * l'export `metadata`. Chaque document a donc un `layout.tsx` minimal qui ne
 * rend rien de plus, mais porte ses métadonnées — d'où cette fabrique, pour
 * qu'ils restent à une ligne chacun.
 *
 * La canonical pointe vers la version française : le document n'est pas
 * traduit, il est seulement servi sous chaque locale d'interface.
 */
export function createLegalMetadata(key: LegalDocKey): GenerateMetadata {
  return async ({ params }: LegalDocumentProps): Promise<Metadata> => {
    const { locale } = await params;
    const dict = await getDictionary(locale as Locale);

    return {
      title: `${dict.footer.legal.links[key]} — ${dict.footer.brand}`,
      description: LEGAL_DOC_DESCRIPTIONS[key],
      alternates: { canonical: legalDocHref(LEGAL_DOC_LOCALE, key) },
    };
  };
}
