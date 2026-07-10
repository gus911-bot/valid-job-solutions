import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Enregistre un abonnement Web Push — réservé aux administrateurs connectés.
export async function POST(request: Request) {
  // 1. Vérifier que l'appelant est admin.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 403 });
  }

  // 2. Lire l'abonnement.
  let sub: { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  try {
    sub = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }
  if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return NextResponse.json({ error: 'Abonnement invalide.' }, { status: 400 });
  }

  // 3. Upsert (service_role) sur l'endpoint unique.
  const admin = createAdminClient();
  const { error } = await admin.from('push_subscriptions').upsert(
    {
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    },
    { onConflict: 'endpoint' },
  );
  if (error) {
    return NextResponse.json({ error: 'Enregistrement impossible.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
