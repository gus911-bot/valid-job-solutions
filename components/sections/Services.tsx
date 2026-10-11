'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  MessagesSquare,
  Plane,
  Stamp,
  Building2,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/ui/Reveal';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

const meta: { icon: typeof FileText; service?: string }[] = [
  { icon: FileText, service: 'coaching_cv' },
  { icon: MessagesSquare, service: 'preparation_entretien' },
  { icon: Plane },
  { icon: Stamp },
  { icon: Building2 },
  { icon: Compass },
];

export function Services({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const services = dict.services.items.map((item, i) => ({
    ...item,
    icon: meta[i]!.icon,
    href: meta[i]!.service
      ? `/${locale}/reservation?service=${meta[i]!.service}`
      : undefined,
  }));
  return (
    <section id="services" className="bg-background py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="gold-rule mx-auto mb-5" />
          <h2 className="text-3xl font-semibold text-cream sm:text-5xl">
            {dict.services.title}
          </h2>
          <p className="mt-4 text-muted">{dict.services.subtitle}</p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group card-lux p-7"
            >
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold-dark transition-colors group-hover:bg-gold-gradient group-hover:text-ink-900">
                <s.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-cream">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              {s.href && (
                <Link
                  href={s.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-dark transition-colors hover:text-gold"
                >
                  {dict.services.reserve}{' '}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
