'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Rafraîchit les données du dashboard sans rechargement manuel :
//  - toutes les 60 s tant que l'onglet est visible ;
//  - immédiatement quand l'onglet redevient actif (focus / visibilité).
// router.refresh() re-exécute le Server Component (nouvelle lecture BDD)
// sans toucher à l'état client (recherche, filtres du tableau conservés).
export function AutoRefresh({ intervalMs = 60_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    // focus + visibilitychange se déclenchent souvent ensemble au retour sur
    // l'onglet : on ignore les rafraîchissements à moins de 5 s d'intervalle.
    let last = 0;
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      if (now - last < 5_000) return;
      last = now;
      router.refresh();
    };
    const id = setInterval(refresh, intervalMs);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [router, intervalMs]);

  return null;
}
