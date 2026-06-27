import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ReservationDetail } from '@/components/admin/ReservationDetail';
import type { Reservation } from '@/types';

export const metadata = { title: 'Détail de la demande' };

export default async function ReservationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!data) notFound();

  return (
    <div className="container-x space-y-6 py-10">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-cream"
      >
        <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
      </Link>

      <ReservationDetail reservation={data as Reservation} />
    </div>
  );
}
