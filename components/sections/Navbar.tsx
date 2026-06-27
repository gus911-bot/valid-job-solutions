'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { locales, localeNames, type Locale } from '@/lib/i18n/config';

export function Navbar({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#approche`, label: dict.nav.approach },
    { href: `/${locale}#services`, label: dict.nav.services },
    { href: `/${locale}/reservation`, label: dict.nav.reservation },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 px-3 transition-all duration-300 sm:px-5',
        scrolled ? 'pt-2' : 'pt-4',
      )}
    >
      <nav
        className={cn(
          'glass-ios mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 transition-all duration-300',
          scrolled ? 'py-2' : 'py-2.5',
        )}
      >
        <Logo href={`/${locale}`} />

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-medium text-cream/80 transition hover:text-gold"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitcher current={locale} />
          <Link href={`/${locale}/reservation`}>
            <Button size="sm">{dict.nav.cta}</Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-cream lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer' : 'Menu'}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-ios mx-auto mt-3 max-w-6xl overflow-hidden rounded-2xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-cream/80 hover:bg-cream/5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2 px-3 pt-2">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-lg px-2.5 py-1 text-xs font-medium',
                      l === locale
                        ? 'bg-gold/15 text-gold'
                        : 'text-cream/70 hover:bg-cream/5',
                    )}
                  >
                    {l.toUpperCase()}
                  </Link>
                ))}
              </li>
              <li className="px-3 pt-2">
                <Link href={`/${locale}/reservation`} onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full">
                    {dict.nav.cta}
                  </Button>
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LangSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-cream/80 transition hover:text-gold"
        aria-label="Langue"
      >
        <Globe className="h-4 w-4" /> {current.toUpperCase()}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="glass-ios absolute end-0 mt-2 w-36 overflow-hidden rounded-xl py-1"
          >
            {locales.map((l) => (
              <li key={l}>
                <Link
                  href={`/${l}`}
                  className={cn(
                    'block px-3 py-2 text-sm transition hover:bg-cream/5',
                    l === current ? 'text-gold' : 'text-cream/80',
                  )}
                >
                  {localeNames[l]}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
