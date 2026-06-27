'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TnFlag, EuFlag } from '@/components/ui/Flags';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

// Variant : reveal mot à mot du titre (text masking + stagger).
const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const word = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const titleWords = dict.hero.title;
  return (
    <section
      id="accueil"
      className="relative flex min-h-screen items-center overflow-hidden bg-ink-gradient"
    >
      {/* Fond image + léger zoom parallax au chargement */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0.35 }}
        animate={{ scale: 1, opacity: 0.45 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-gradient/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
      </motion.div>

      {/* Emblème de marque flottant (côté droit) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
        className="pointer-events-none absolute end-[8%] top-[32%] z-10 hidden -translate-y-1/2 lg:block"
      >
        <Image
          src="/nb.png"
          alt="Valid Job Solutions"
          width={498}
          height={501}
          className="h-64 w-64 animate-float-slow object-contain opacity-95 drop-shadow-2xl xl:h-80 xl:w-80"
        />
      </motion.div>

      <div className="container-x relative z-10 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-cream"
        >
          <TnFlag /> {dict.hero.badge} <EuFlag />
        </motion.div>

        <motion.h1
          variants={titleContainer}
          initial="hidden"
          animate="show"
          className="max-w-3xl text-4xl font-bold leading-tight text-cream drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] sm:text-6xl"
        >
          {titleWords.map((w, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden pb-[0.18em] align-bottom"
            >
              <motion.span
                variants={word}
                className={`inline-block ${i === 2 ? 'text-gold-shimmer' : ''}`}
              >
                {w}
              </motion.span>
              {i < titleWords.length - 1 ? ' ' : ''}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 max-w-xl text-lg text-cream/80"
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link href={`/${locale}/reservation`}>
            <Button size="lg">
              {dict.hero.ctaPrimary} <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href={`/${locale}#approche`}>
            <Button size="lg" variant="outline" className="border-cream/40 text-cream hover:bg-cream/10">
              <Compass className="h-5 w-5" /> {dict.hero.ctaSecondary}
            </Button>
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-12 max-w-md font-script text-xl italic text-gold/90"
        >
          {dict.hero.quote}
        </motion.p>
      </div>
    </section>
  );
}
