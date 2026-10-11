import { Hero } from '@/components/sections/Hero';
import { Pillars } from '@/components/sections/Pillars';
import { Approach } from '@/components/sections/Approach';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, type Locale } from '@/lib/i18n/config';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (isLocale(lang) ? lang : 'fr') as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict} locale={locale} />
      <Pillars dict={dict} />
      <Approach dict={dict} />
      <Services dict={dict} locale={locale} />
      <Testimonials dict={dict} />
      <CtaBanner dict={dict} locale={locale} />
    </>
  );
}
