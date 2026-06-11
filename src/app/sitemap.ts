import { MetadataRoute } from 'next'
import { locales, defaultLocale } from '@/config/locale';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [l, `https://studio.val4oss.com/${l}`])
  );

  return locales.map((locale) => ({
    url: `https://studio.val4oss.com/${locale}`,
    lastModified: new Date('2026-06-10'),
    changeFrequency: 'weekly',
    priority: 1.0,
    alternates: { languages },
  }));
}
