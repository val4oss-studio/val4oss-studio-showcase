import {
  HeroSection,
  AboutSection,
  WhyUsSection,
  PricingDevSection,
  PricingMaintenanceSection,
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
      <WhyUsSection              id={SECTION_IDS.whyUs}              dict={dict.whyUs} />
      <PricingDevSection         id={SECTION_IDS.pricingDev}         dict={dict.pricingDev} />
      <PricingMaintenanceSection id={SECTION_IDS.pricingMaintenance} dict={dict.pricingMaintenance} />
    </>
  );
}
