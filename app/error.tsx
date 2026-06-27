'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

// Capture les erreurs de rendu — n'expose jamais la stack à l'utilisateur.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-screen place-items-center bg-ink-gradient px-5 text-center">
      <div>
        <p className="font-script text-5xl text-gold">Oups</p>
        <h1 className="mt-4 text-2xl font-bold text-cream">
          Une erreur est survenue
        </h1>
        <p className="mt-2 text-cream/70">
          Veuillez réessayer. Si le problème persiste, contactez-nous.
        </p>
        <Button className="mt-6" onClick={reset}>
          Réessayer
        </Button>
      </div>
    </div>
  );
}
