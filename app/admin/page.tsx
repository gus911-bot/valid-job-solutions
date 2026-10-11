import { createClient } from '@/lib/supabase/server';
import { StatsCards } from '@/components/admin/StatsCards';
import { AdminTable } from '@/components/admin/AdminTable';
import { NotificationsToggle } from '@/components/admin/NotificationsToggle';
import { AutoRefresh } from '@/components/admin/AutoRefresh';
import type { Reservation } from '@/types';

export const metadata = { title: 'Dashboard' };

// Server Component : la RLS garantit que seul un admin récupère les lignes.
export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false });

  const reservations = (data ?? []) as Reservation[];

  return (
    <div className="container-x space-y-8 py-10">
      {/* Nouvelles réservations visibles sans rafraîchissement manuel. */}
      <AutoRefresh intervalMs={60_000} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gold">
            Vue d&apos;ensemble
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-cream">
            Tableau de bord
          </h1>
          <p className="mt-1 text-sm text-muted">
            Gestion des demandes de réservation.
          </p>
        </div>
        <NotificationsToggle />
      </div>

      <StatsCards reservations={reservations} />
      <AdminTable reservations={reservations} />
    </div>
  );
}
