import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { headers } from 'next/headers';
import { Toaster } from 'sonner';
import { JsonLd } from '@/components/seo/JsonLd';
import { defaultLocale, isLocale, isRtl, type Locale } from '@/lib/i18n/config';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Valid Job Solutions — Révélons votre potentiel professionnel',
    template: '%s · Valid Job Solutions',
  },
  description:
    "Agence de recrutement et de développement de talents : nous identifions, préparons et propulsons les talents vers des opportunités professionnelles concrètes à l'international (Tunisie & Europe).",
  keywords: [
    'recrutement',
    'talents',
    'international',
    'Tunisie',
    'Europe',
    'placement',
    'coaching carrière',
  ],
  authors: [{ name: 'Ben Hazez Marwen' }],
  openGraph: {
    title: 'Valid Job Solutions',
    description:
      'Des talents vers des opportunités professionnelles concrètes à l\'international.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Le middleware fournit la locale courante via l'en-tête x-locale.
  const headerLocale = (await headers()).get('x-locale') ?? defaultLocale;
  const locale: Locale = isLocale(headerLocale) ? headerLocale : defaultLocale;

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? 'rtl' : 'ltr'}
      className={jakarta.variable}
    >
      <body>
        <JsonLd />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
