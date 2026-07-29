'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { updateReservationSchema } from '@/lib/validations/admin';
import type { ReservationStatus } from '@/types';

// Vérifie que l'appelant est bien admin (défense en profondeur, en plus du middleware).
async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/admin/login?error=forbidden');
  return supabase;
}

export async function updateReservation(formData: {
  id: string;
  status?: ReservationStatus;
  admin_notes?: string;
}) {
  const parsed = updateReservationSchema.safeParse(formData);
  if (!parsed.success) {
    return { ok: false, error: 'Données invalides.' };
  }

  const supabase = await assertAdmin();
  const { id, ...changes } = parsed.data;

  // La RLS « admin_can_update_reservations » s'applique aussi côté serveur.
  const { error } = await supabase
    .from('reservations')
    .update(changes)
    .eq('id', id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin');
  revalidatePath(`/admin/${id}`);
  return { ok: true };
}

// Génère une URL signée (60 s) pour télécharger un CV.
// Vérifie d'abord le rôle admin, puis utilise le service_role (bucket privé).
export async function getCvSignedUrl(
  path: string,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await assertAdmin();

  if (!path || path.includes('..')) {
    return { ok: false, error: 'Chemin invalide.' };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from('cvs')
    .createSignedUrl(path, 60);

  if (error || !data) {
    return { ok: false, error: error?.message ?? 'Fichier introuvable.' };
  }
  return { ok: true, url: data.signedUrl };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
