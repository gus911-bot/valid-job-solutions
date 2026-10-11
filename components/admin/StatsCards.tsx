import { Inbox, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import type { Reservation, ServiceType } from '@/types';
import { SERVICE_LABELS } from '@/types';

const serviceColors: Record<ServiceType, string> = {
  coaching_cv: 'bg-gold',
  preparation_entretien: 'bg-sky-400',
  consultation: 'bg-slate-400',
};

export function StatsCards({ reservations }: { reservations: Reservation[] }) {
  const total = reservations.length;

  // Server Component rendu à chaque requête (force-dynamic) : lire l'horloge
  // ici est voulu. La règle purity vise les composants client re-rendus.
  // eslint-disable-next-line react-hooks/purity
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = reservations.filter(
    (r) => new Date(r.created_at).getTime() >= sevenDaysAgo,
  ).length;
  const toHandle = reservations.filter(
    (r) => r.status === 'nouveau' || r.status === 'contacte' || r.status === 'en_cours',
  ).length;
  const done = reservations.filter((r) => r.status === 'traite').length;

  // Répartition par service.
  const byService = reservations.reduce<Record<string, number>>((acc, r) => {
    acc[r.service] = (acc[r.service] ?? 0) + 1;
    return acc;
  }, {});

  const kpis = [
    { label: 'Total demandes', value: total, icon: Inbox, tone: 'text-sky-300 bg-sky-400/10' },
    { label: 'Nouvelles (7 jours)', value: recent, icon: Sparkles, tone: 'text-gold bg-gold/10' },
    { label: 'À traiter', value: toHandle, icon: Clock, tone: 'text-amber-300 bg-amber-400/10' },
    { label: 'Traitées', value: done, icon: CheckCircle2, tone: 'text-emerald-300 bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="card-lux p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{label}</span>
              <span className={`grid h-8 w-8 place-items-center rounded-lg ${tone}`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-cream tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Répartition par service : barre empilée + légende */}
      <div className="card-lux p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-cream">Répartition par service</span>
          <span className="text-xs text-muted">{total} au total</span>
        </div>
        <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-white/5">
          {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) =>
            byService[s] ? (
              <div
                key={s}
                className={serviceColors[s]}
                style={{ width: `${(byService[s] / total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) => (
            <div key={s} className="flex items-center gap-2 text-sm">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${serviceColors[s]}`} />
              <span className="truncate text-muted">{SERVICE_LABELS[s]}</span>
              <span className="ms-auto font-medium text-cream tabular-nums">
                {byService[s] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
