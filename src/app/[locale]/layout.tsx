import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import { isValidLocale, locales, type Locale } from '@/config/locale';
import '@/app/globals.css';
import { getDictionary } from '@/app/i18n/translations';
import { Footer } from '@/app/component/layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const baseMetadata = {
  keywords: [
    'val4oss',
    'open source software',
    'internet presence',
    'web development',
    'software maintenance',
    'deployment',
    'security',
    'SEO',
    'content creation',
    'social media management',
    'SaaS', 'SaaS solutions',
    'web hosting',
    'domain registration',
    'analytics',
    'performance optimization',
    'cybersecurity',
    'data privacy',
    'cloud services',
    'digital marketing',
    'e-commerce solutions',
    'mobile app development',
    'UI/UX design',
    'API development',
    'open source contributions',
  ],
  authors: [
    {
      name: 'val4oss',
      url: 'https://val4oss.com',
    },
  ],
  creator: 'val4oss',
  publisher: 'val4oss',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'business',
  classification: 'technology',
} satisfies Partial<Metadata>;

const siteContent = {
  en: {
    title: 'val4oss Creator of internet presence',
    description: 'Develop, maintain, deploy and secure your online presence with val4oss',
    ogLocale: 'en_US',
  },
  fr: {
    title: 'val4oss Créateur de présence internet',
    description: 'Développez, maintenez, déployez et sécurisez votre présence en ligne avec val4oss',
    ogLocale: 'fr_FR',
  },
} satisfies Record<Locale, { title: string; description: string; ogLocale: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  const content = siteContent[locale];

  return {
    metadataBase: new URL('https://val4oss.com'),
    ...baseMetadata,
    title: content.title,
    description: content.description,
    openGraph: {
      type: 'website',
      locale: content.ogLocale,
      title: content.title,
      description: content.description,
      url: `https://val4oss.com/${locale}`,
      siteName: 'val4oss',
      images: [
        {
          url: '/val4oss_main_logo.png',
          width: 1200,
          height: 630,
          alt: 'val4oss logo',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      creator: '@val4oss',
      images: ['/val4oss_main_logo.png'],
    },
    alternates: {
      canonical: `https://val4oss.com/${locale}`,
      languages: {
        en: 'https://val4oss.com/en',
        fr: 'https://val4oss.com/fr',
      },
    },
  };
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F0EBE0' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">
          {children}
        </main>
        <Footer 
          dictFooter={dict.footer}
          dictNav={dict.nav}
          dictSocial={dict.social}
          locale={locale} />
      </body>
    </html>
  );
}
