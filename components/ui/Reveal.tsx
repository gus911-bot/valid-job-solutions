'use client';

import { motion, type Variants } from 'framer-motion';

// Variant réutilisable : apparition depuis le bas au scroll.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Conteneur qui orchestre l'apparition en cascade de ses enfants.
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/** Enveloppe une section : reveal au scroll, une seule fois. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 50 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
