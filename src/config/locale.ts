export type Locale = 'en' | 'fr';

export const locales = ['en', 'fr'] as const satisfies readonly Locale[];

export const defaultLocale: Locale = 'en';

/** Pour les champs traduits dans les entités domain */
export type LocalizedText = Record<Locale, string>;

/** Type guard — vérifie qu'une string est une locale supportée */
export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
