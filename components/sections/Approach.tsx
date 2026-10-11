'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, Globe2, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import type { Dictionary } from '@/lib/i18n/dictionaries';

const pointIcons = [Heart, Globe2, ShieldCheck];

const images = [
  '/approach-1.webp',
  '/approach-2.webp',
  '/approach-3.webp',
];

export function Approach({ dict }: { dict: Dictionary }) {
  const points = dict.approach.points.map((p, i) => ({
    icon: pointIcons[i]!,
    ...p,
  }));
  return (
    <section id="approche" className="bg-surface-100 py-24">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        {/* Texte */}
        <Reveal>
          <div className="gold-rule mb-5" />
          <h2 className="text-3xl font-semibold text-cream sm:text-5xl">
            {dict.approach.title}
          </h2>
          <p className="mt-4 text-muted">{dict.approach.text}</p>

          <ul className="mt-8 space-y-5">
            {points.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold-dark">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-cream">{p.title}</h3>
                  <p className="text-sm text-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Collage d'images */}
        <div className="grid grid-cols-2 gap-4">
          {images.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className={`relative overflow-hidden rounded-2xl shadow-soft ${
                i === 0 ? 'col-span-2 h-56' : 'h-44'
              }`}
            >
              <Image src={src} alt="" fill className="object-cover transition-transform duration-500 hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
