import {
  HeroSection,
  AboutSection,
  PortfolioSection,
  PricingSection,
  ContactSection,
} from '@/app/component/section';
import { SECTION_IDS } from '@/config/sections';
import { type Locale } from '@/config/locale';
import { getDictionary } from '@/app/i18n/translations';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  /* Layout has already verified if the locale is valid */
  const dict = await getDictionary(locale as Locale);
  return (
    <>
      <HeroSection  id={SECTION_IDS.home}  dict={dict.hero}  />
      <AboutSection id={SECTION_IDS.about} dict={dict.about} />
      <PortfolioSection id={SECTION_IDS.portfolio} dict={dict.portfolio} />
      <PricingSection 
        id={SECTION_IDS.pricing}
        dict={dict.pricing}
      />
      <ContactSection id={SECTION_IDS.contact} dict={dict.contact} />
    </>
  );
}
