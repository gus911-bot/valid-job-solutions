import type { Metadata } from 'next';
import { ReservationForm } from '@/components/sections/ReservationForm';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, type Locale } from '@/lib/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (isLocale(lang) ? lang : 'fr') as Locale;
  const dict = getDictionary(locale);
  return { title: dict.reservation.title, description: dict.reservation.subtitle };
}

export default async function ReservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { lang } = await params;
  const { service } = await searchParams;
  const locale = (isLocale(lang) ? lang : 'fr') as Locale;
  const dict = getDictionary(locale);

  return (
    <section className="bg-background pb-24 pt-32">
      <div className="container-x max-w-3xl">
        <div className="mb-10 text-center">
          <div className="gold-rule mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-cream sm:text-4xl">
            {dict.reservation.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            {dict.reservation.subtitle}
          </p>
        </div>

        <ReservationForm dict={dict} initialService={service} />
      </div>
    </section>
  );
}
