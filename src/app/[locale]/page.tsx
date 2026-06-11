import {
  HeroSection,
  AboutSection,
  WhyUsSection,
  PortfolioSection,
  PricingDevSection,
  PricingMaintenanceSection,
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
      <WhyUsSection id={SECTION_IDS.whyUs} dict={dict.whyUs} />
      <PortfolioSection id={SECTION_IDS.portfolio} dict={dict.portfolio} />
      <PricingDevSection 
        id={SECTION_IDS.pricingDev}
        dictPricing={dict.pricing}
        dictDev={dict.pricingDev} />
      <PricingMaintenanceSection
        id={SECTION_IDS.pricingMaintenance}
        dictPricing={dict.pricing}
        dictMaint={dict.pricingMaintenance}
      />
      <ContactSection id={SECTION_IDS.contact} dict={dict.contact} />
    </>
  );
}
