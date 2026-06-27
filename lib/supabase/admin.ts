// Empêche tout import accidentel de ce module dans un bundle client
// (erreur de build si jamais utilisé côté navigateur).
import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Client privilégié SERVEUR UNIQUEMENT (service_role).
// ⚠️ Ne JAMAIS importer dans un composant client. Contourne la RLS.
// Réservé aux opérations serveur de confiance (ex. insertion validée de réservation).
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante côté serveur.');
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
