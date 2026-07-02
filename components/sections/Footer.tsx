import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  MessageCircle,
  Mail,
  Facebook,
  Instagram,
  MapPin,
  Navigation,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import {
  WHATSAPP_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_TEL,
  AGENCY_ADDRESS,
  AGENCY_MAP_EMBED,
  AGENCY_DIRECTIONS_URL,
} from '@/lib/utils';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import type { Locale } from '@/lib/i18n/config';

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}#approche`, label: dict.nav.approach },
    { href: `/${locale}#services`, label: dict.nav.services },
    { href: `/${locale}/reservation`, label: dict.nav.reservation },
  ];

  return (
    <footer id="contact" className="bg-ink-gradient text-cream">
      {/* Localisation + itinéraire */}
      <div className="container-x pt-16">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="gold-rule mb-4" />
            <h3 className="text-2xl font-bold text-cream">{dict.footer.findUs}</h3>
            <p className="mt-1 flex items-center gap-2 text-sm text-cream/70">
              <MapPin className="h-4 w-4 text-gold" /> {AGENCY_ADDRESS}
            </p>
          </div>
          <a
            href={AGENCY_DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-sm font-semibold text-ink-900 shadow-glow transition hover:brightness-110"
          >
            <Navigation className="h-4 w-4" /> {dict.footer.directions}
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line shadow-soft">
          <iframe
            src={AGENCY_MAP_EMBED}
            title={`Carte — ${AGENCY_ADDRESS}`}
            width="100%"
            height="320"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full grayscale-[0.35] contrast-[1.05]"
            style={{ border: 0 }}
            allowFullScreen
          />
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 md:grid-cols-3 lg:grid-cols-4">
        {/* Marque */}
        <div className="lg:col-span-2">
          <Logo dark href={`/${locale}`} />
          <p className="mt-5 max-w-sm font-script text-lg italic text-gold/90">
            {dict.hero.quote}
          </p>

          {/* Carte signature du fondateur */}
          <Image
            src="/cg.jpeg"
            alt="Ben Hazez Marwen — Valid Job Solutions"
            width={743}
            height={519}
            className="mt-6 w-full max-w-xl rounded-2xl border border-gold/20 shadow-soft"
          />

          <p className="mt-4 text-sm text-cream/70">
            Tunisie <span className="text-gold">+</span> Europe{' '}
            <span className="text-gold">+</span> Canada
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            {dict.footer.navigation}
          </h3>
          <ul className="space-y-2.5 text-sm text-cream/80">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
            {dict.footer.contact}
          </h3>
          <ul className="space-y-3 text-sm text-cream/80">
            <li>
              <a href={`tel:${CONTACT_PHONE_TEL}`} dir="ltr" className="flex items-center gap-2 transition hover:text-gold">
                <Phone className="h-4 w-4 text-gold" /> {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-gold">
                <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp : 23 529 938
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-2 transition hover:text-gold">
                <Mail className="h-4 w-4 text-gold" /> {CONTACT_EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook Ben Hazez Marwen" className="transition hover:text-gold">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/valid_jobsolutions" target="_blank" rel="noopener noreferrer" aria-label="Instagram Valid Job Solutions" className="transition hover:text-gold">
                <Instagram className="h-5 w-5" />
              </a>
              <span className="text-xs text-cream/60">Ben Hazez Marwen</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Valid Job Solutions. {dict.footer.rights}</p>
          <p>{dict.footer.founder}</p>
        </div>
      </div>
    </footer>
  );
}
