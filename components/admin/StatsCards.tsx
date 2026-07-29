import { Inbox, Sparkles, BarChart3 } from 'lucide-react';
import type { Reservation, ServiceType } from '@/types';
import { SERVICE_LABELS } from '@/types';

export function StatsCards({ reservations }: { reservations: Reservation[] }) {
  const total = reservations.length;

  // Server Component rendu à chaque requête (force-dynamic) : lire l'horloge
  // ici est voulu. La règle purity vise les composants client re-rendus.
  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = reservations.filter(
    (r) => new Date(r.created_at).getTime() >= sevenDaysAgo,
  ).length;

  // Répartition par service.
  const byService = reservations.reduce<Record<string, number>>((acc, r) => {
    acc[r.service] = (acc[r.service] ?? 0) + 1;
    return acc;
  }, {});
  const maxService = Math.max(1, ...Object.values(byService));

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="card-lux p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
            <Inbox className="h-5 w-5" />
          </span>
          <span className="text-sm text-muted">Total demandes</span>
        </div>
        <p className="mt-4 text-3xl font-bold text-cream">{total}</p>
      </div>

      <div className="card-lux p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold-dark">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-sm text-muted">Nouvelles (7 jours)</span>
        </div>
        <p className="mt-4 text-3xl font-bold text-cream">{recent}</p>
      </div>

      <div className="card-lux p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <BarChart3 className="h-5 w-5" />
          </span>
          <span className="text-sm text-muted">Par service</span>
        </div>
        <div className="space-y-2">
          {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) => (
            <div key={s} className="flex items-center gap-2">
              <span className="w-24 shrink-0 text-xs text-muted">
                {SERVICE_LABELS[s]}
              </span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/15">
                <div
                  className="h-full rounded-full bg-gold-gradient"
                  style={{
                    width: `${((byService[s] ?? 0) / maxService) * 100}%`,
                  }}
                />
              </div>
              <span className="w-6 text-right text-xs font-medium text-cream">
                {byService[s] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
