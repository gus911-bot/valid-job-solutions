import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/sections/WhatsAppButton';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, type Locale } from '@/lib/i18n/config';

// Rendu dynamique : le layout racine lit l'en-tête x-locale (fourni par le
// middleware) pour fixer <html lang dir> correctement par requête.
export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const lang = isLocale(params.lang) ? params.lang : 'fr';
  // hreflang : indique à Google les versions linguistiques.
  return {
    alternates: {
      canonical: `${SITE}/${lang}`,
      languages: {
        fr: `${SITE}/fr`,
        ar: `${SITE}/ar`,
        en: `${SITE}/en`,
        'x-default': `${SITE}/fr`,
      },
    },
    openGraph: {
      locale: lang === 'fr' ? 'fr_FR' : lang === 'ar' ? 'ar_TN' : 'en_US',
    },
  };
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const locale = params.lang as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <main>{children}</main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton />
    </>
  );
}
