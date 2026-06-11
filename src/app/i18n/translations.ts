import 'server-only';
import { cache } from 'react';
import type { Locale } from '@/config/locale';

interface WhyCardData {
  icon: string;
  title: string;
  desc: string;
}

interface PlanI18n {
  name: string;
  target: string;
  priceNote: string;
  delay?: string;          // "1 à 2 semaines" — dev plans only
}

export interface Dictionary {
  nav: {
    label: string;
    home: string;
    about: string;
    whyUs: string;
    portfolio: string;
    pricingDev: string;
    pricingMaintenance: string;
    contact: string;
  };
  social: {
    label: string;
    linkedIn: string;
    github: string;
    instagram: string;
    email: string;
  };
  hero: {
    eyebrow: string[];
    tagline: string;
    taglineAccent: string;
    taglineSuffix: string;
    logoAlt: string;
    availability: {
      available: string;
      busy: string;
      none: string;
    }
  };
  about: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    intro: string;
    pillars: Array<{
      key: string;
      label: string;
      body: string;
    }>;
  };
  whyUs: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subtitle: string;
    cards: WhyCardData[];
  };
  portfolio: {
    eyebrow:      string;
    title:        string;
    titleAccent?: string;
    subtitle:     string;
    cta:          string;
    projects:     Record<string, {
      name:    string;
      tagline: string;
    }>;
  };
  pricing: {
    badges: Record<string, string>;    // keyed by badge key (e.g. "saasIncluded")
    saasNoteAccent: string;
    saasNote: string;
    status: Record<string, string>;    // keyed by status key (e.g. "recommended")
  };
  pricingDev: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subtitle: string;
    priceFrom: string;                    // "à partir de" / "from"
    plans: Record<string, PlanI18n>;      // keyed by plan id (e.g. "essentiel")
    features: Record<string, string>;     // keyed by feature key (e.g. "onepage")
  };
  pricingMaintenance: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subtitle: string;
    reactivityNote: string;
    reactivityAccent: string;
    plans: Record<string, PlanI18n>;
    features: Record<string, string>;
  };
  contact: {
    eyebrow:      string;
    title:        string;
    titleAccent?: string;
    subtitle:     string;
    channels: Record<string, {
      label: string;
      desc:  string;
    }>;
  };
  footer: {
    ariaLabel: string;
    brand: string;
    tagline: string;
    legal: {
      copyright: string;
    };
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./locales/en.json').then((m) => m.default as Dictionary),
  fr: () => import('./locales/fr.json').then((m) => m.default as Dictionary),
};

export const getDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => {
    return dictionaries[locale]();
  }
);
