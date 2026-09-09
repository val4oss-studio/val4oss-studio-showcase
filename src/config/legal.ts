import type { Locale } from '@/config/locale';

/*
 * Documents légaux — source de vérité unique.
 *
 * Chaque clé correspond à un dossier `src/app/[locale]/legal/<slug>/` (qui
 * contient `page.mdx` et son `layout.tsx` de métadonnées) et à une entrée
 * `footer.legal.links` du dictionnaire. Ajouter un document : une ligne ici,
 * sa description ci-dessous, le dossier, et le libellé dans les deux JSON.
 */
export const LEGAL_DOC_SLUGS = {
  legalNotice: 'mentions-legales',
  privacy:     'politique-de-confidentialite',
  terms:       'cgv',
} as const;

export type LegalDocKey = keyof typeof LEGAL_DOC_SLUGS;
export type LegalDocSlug = typeof LEGAL_DOC_SLUGS[LegalDocKey];

export const LEGAL_DOC_KEYS = Object.keys(LEGAL_DOC_SLUGS) as LegalDocKey[];

/*
 * Les documents ne sont pas traduits : ils sont rédigés en français et servis
 * tels quels sous toutes les locales. Le corps du document porte donc
 * `lang="fr"` (voir le layout), et chaque page pointe sa canonical vers la
 * version française pour éviter le contenu dupliqué aux yeux des moteurs.
 */
export const LEGAL_DOC_LOCALE: Locale = 'fr';

/*
 * Descriptions SEO — rédigées en français, comme les documents eux-mêmes.
 * Le titre de l'onglet, lui, suit la locale de l'interface : il est repris
 * du dictionnaire (`footer.legal.links`) par le layout de chaque document.
 */
export const LEGAL_DOC_DESCRIPTIONS: Record<LegalDocKey, string> = {
  legalNotice:
    'Éditeur, directeur de la publication et hébergeur du site ' +
    'studio.val4oss.com.',
  privacy:
    'Données personnelles traitées par val4oss studio : finalités, durées ' +
    'de conservation et exercice de vos droits RGPD.',
  terms:
    'Conditions générales de vente des prestations de développement web ' +
    'et de maintenance de val4oss studio.',
};

/** URL publique d'un document légal pour une locale d'interface donnée. */
export function legalDocHref(locale: string, key: LegalDocKey): string {
  return `/${locale}/legal/${LEGAL_DOC_SLUGS[key]}`;
}
