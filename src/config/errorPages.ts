import type { Locale } from '@/config/locale';

interface ErrorPageCopy {
  eyebrow:   string;
  title:     string;
  subtitle:  string;
  reference: string;
  retry:     string;
  home:      string;
}

/*
 * Textes de la frontière d'erreur.
 *
 * React impose qu'une error boundary soit un Client Component : `error.tsx` ne
 * peut donc pas appeler `getDictionary`, marqué `server-only`. Ces libellés
 * vivent ici plutôt que dans le dictionnaire, sur le même modèle que
 * `siteContent` dans le layout. C'est la seule copie de l'interface qui y
 * échappe — la 404, elle, est un Server Component et lit bien le dictionnaire.
 */
export const ERROR_PAGE_COPY: Record<Locale, ErrorPageCopy> = {
  en: {
    eyebrow:   'Unexpected error',
    title:     'Something went wrong',
    subtitle:  'This page could not be displayed. Trying again often clears it; '
             + 'if it does not, the rest of the site is still reachable.',
    reference: 'Reference',
    retry:     'Try again',
    home:      'Back to home',
  },
  fr: {
    eyebrow:   'Erreur inattendue',
    title:     'Quelque chose s\'est mal passé',
    subtitle:  'Cette page n\'a pas pu s\'afficher. Réessayer suffit le plus '
             + 'souvent ; sinon, le reste du site reste accessible.',
    reference: 'Référence',
    retry:     'Réessayer',
    home:      'Retour à l\'accueil',
  },
};
