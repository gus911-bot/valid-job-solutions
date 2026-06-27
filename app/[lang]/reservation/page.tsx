import type { Metadata } from 'next';
import { ReservationForm } from '@/components/sections/ReservationForm';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isLocale, type Locale } from '@/lib/i18n/config';

export function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Metadata {
  const locale = (isLocale(params.lang) ? params.lang : 'fr') as Locale;
  const dict = getDictionary(locale);
  return { title: dict.reservation.title, description: dict.reservation.subtitle };
}

export default function ReservationPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { service?: string };
}) {
  const locale = (isLocale(params.lang) ? params.lang : 'fr') as Locale;
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

        <ReservationForm dict={dict} initialService={searchParams.service} />
      </div>
    </section>
  );
}
