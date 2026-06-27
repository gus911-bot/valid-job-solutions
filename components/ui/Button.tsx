'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gold-gradient text-ink-900 font-semibold shadow-glow hover:brightness-110',
  outline:
    'border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold/70 font-semibold',
  ghost: 'text-cream/80 hover:bg-cream/5 hover:text-cream font-medium',
  dark: 'bg-surface-200 text-cream border border-line hover:bg-surface-300 font-semibold',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';
