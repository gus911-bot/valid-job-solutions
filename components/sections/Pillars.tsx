'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Search, GraduationCap, Rocket } from 'lucide-react';
import { fadeUp, staggerContainer } from '@/components/ui/Reveal';
import type { Dictionary } from '@/lib/i18n/dictionaries';

const icons = [Search, GraduationCap, Rocket];

export function Pillars({ dict }: { dict: Dictionary }) {
  const pillars = dict.pillars.items.map((item, i) => ({
    icon: icons[i]!,
    ...item,
  }));
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.4'],
  });
  // La ligne dorée se « dessine » au scroll.
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative bg-background py-24" ref={ref}>
      <div className="container-x">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="gold-rule mx-auto mb-5" />
          <h2 className="text-gold-shimmer text-3xl font-bold sm:text-4xl">
            {dict.pillars.title}
          </h2>
          <p className="mt-4 text-muted">{dict.pillars.subtitle}</p>
        </div>

        {/* Ligne dorée animée (stepper) — desktop */}
        <div className="relative hidden lg:block">
          <svg
            className="absolute left-0 top-12 -z-0 h-2 w-full"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="8"
              y1="1"
              x2="92"
              y2="1"
              stroke="url(#goldLine)"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="goldLine" x1="0" x2="1">
                <stop offset="0%" stopColor="#D4A04C" />
                <stop offset="100%" stopColor="#E8A33D" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid gap-8 md:grid-cols-3"
        >
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="group card-lux p-8 text-center"
            >
              <div className="relative z-10 mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gold-gradient shadow-glow transition-transform group-hover:scale-105">
                <p.icon className="h-10 w-10 text-ink-900" strokeWidth={1.8} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-dark">
                {dict.pillars.step} {i + 1}
              </span>
              <h3 className="mt-2 text-2xl font-bold text-cream">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
