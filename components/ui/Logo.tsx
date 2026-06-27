import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Variante sombre = texte clair (sur fond charbon). */
  dark?: boolean;
  className?: string;
  href?: string;
}

export function Logo({ dark = false, className, href = '/' }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn('group inline-flex items-center gap-2', className)}
      aria-label="Valid Job Solutions — Accueil"
    >
      <Image
        src="/nb.png"
        alt="Valid Job Solutions"
        width={498}
        height={501}
        priority
        className="h-11 w-auto object-contain"
      />
    </Link>
  );
}
