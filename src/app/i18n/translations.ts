import 'server-only';
import { cache } from 'react';
import type { Locale } from '@/config/locale';
import type { StatusKey, FeatureKey, PlanGroupKey } from '@/config/pricing';
import type { PillarId } from '@/config/sections'

interface PlanI18n {
  name: string;
  target: string;
}

export interface Dictionary {
  nav: {
    label: string;
    home: string;
    about: string;
    portfolio: string;
    pricing: string;
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
  };
  about: {
    eyebrow: string;
    title: string;
    titleAccent?: string;
    intro: string;
    pillars: Record< PillarId, {
      label: string;
      body: string;
      strike?: string;                   // Optional struck-through lead-in
    }>;
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
    eyebrow: string;
    title: string;
    titleAccent?: string;
    subtitle: string;
    priceFrom: string;                              // "à partir de"
    recurringPrefix: string;                        // "puis"
    recurringSuffix: string;                        // "/ mois"
    plans: Record<string, PlanI18n>;                // keyed by plan id
    features: Record<FeatureKey, string>;           // keyed by feature key
    groups: Record<PlanGroupKey, {title: string; subtitle: string}>;
    options: {title: string; subtitle: string};
    status: Record<StatusKey, string>;
    saasNote: { title: string; subtitle: string; body: string };
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
  en: () => import('./locales/en.json').then((m) => m.default),
  fr: () => import('./locales/fr.json').then((m) => m.default),
};

export const getDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => {
    return dictionaries[locale]();
  }
);
