import { MetadataRoute } from 'next'
import { LEGAL_DOC_KEYS, LEGAL_DOC_LOCALE, legalDocHref } from '@/config/legal';
import { locales } from '@/config/locale';

const BASE_URL = 'https://studio.val4oss.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `${BASE_URL}/${l}`])
  );

  const homePages: MetadataRoute.Sitemap = locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: new Date('2026-06-10'),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages },
  }));

  /*
   * Les documents légaux ne sont pas traduits : ils restent atteignables sous
   * chaque locale, mais une seule URL est déclarée — celle de la langue de
   * rédaction, vers laquelle pointent aussi leurs canonical.
   */
  const legalPages: MetadataRoute.Sitemap = LEGAL_DOC_KEYS.map((key) => ({
    url: `${BASE_URL}${legalDocHref(LEGAL_DOC_LOCALE, key)}`,
    lastModified: new Date('2026-09-09'),
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [...homePages, ...legalPages];
}
