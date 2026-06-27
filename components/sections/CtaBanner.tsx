'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

export function CtaBanner({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <section className="bg-background py-20">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-gold/20 bg-surface-gradient bg-surface-100 px-8 py-16 text-center shadow-glow"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
          <h2 className="relative text-3xl font-bold text-cream sm:text-4xl">
            {dict.cta.title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-cream/80">
            {dict.cta.subtitle}
          </p>
          <Link href={`/${locale}/reservation`} className="relative mt-8 inline-block">
            <Button size="lg">
              {dict.cta.button} <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
