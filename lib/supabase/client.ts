'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Client Supabase pour les composants client.
// N'utilise QUE la clé anon publique — jamais la service_role.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
