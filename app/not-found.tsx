import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-gradient px-5 text-center">
      <div>
        <p className="font-semibold tracking-tight text-6xl text-gold">404</p>
        <h1 className="mt-4 text-2xl font-bold text-cream">
          Page introuvable
        </h1>
        <p className="mt-2 text-cream/70">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Retour à l&apos;accueil</Button>
        </Link>
      </div>
    </div>
  );
}
