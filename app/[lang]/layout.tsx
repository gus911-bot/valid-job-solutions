import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HtmlLangSync } from '@/components/i18n/HtmlLangSync';
import { Navbar } from '@/components/sections/Navbar';
import { Footer } from '@/components/sections/Footer';
import { WhatsAppButton } from '@/components/sections/WhatsAppButton';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, type Locale } from '@/lib/i18n/config';

// Rendu dynamique : le layout racine lit l'en-tête x-locale (fourni par le
// middleware) pour fixer <html lang dir> correctement par requête.
export const dynamic = 'force-dynamic';

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : 'fr';
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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <HtmlLangSync locale={locale} />
      <Navbar dict={dict} locale={locale} />
      <main>{children}</main>
      <Footer dict={dict} locale={locale} />
      <WhatsAppButton />
    </>
  );
}
