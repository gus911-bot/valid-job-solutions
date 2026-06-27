'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/ui/Reveal';
import type { Dictionary } from '@/lib/i18n/dictionaries';

export function Testimonials({ dict }: { dict: Dictionary }) {
  const testimonials = dict.testimonials.items;
  return (
    <section className="bg-background py-24">
      <div className="container-x">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="gold-rule mx-auto mb-5" />
          <h2 className="text-gold-shimmer text-3xl font-bold sm:text-4xl">
            {dict.testimonials.title}
          </h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              className="flex flex-col card-lux p-7"
            >
              <Quote className="h-8 w-8 text-gold/60" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-cream/80">
                {t.text}
              </blockquote>
              <div className="mt-5 flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <figcaption className="mt-3">
                <p className="font-semibold text-cream">{t.name}</p>
                <p className="text-xs text-muted">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
