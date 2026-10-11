import { cn } from '@/lib/utils';
import type { ReservationStatus, ServiceType } from '@/types';
import { STATUS_LABELS, SERVICE_LABELS } from '@/types';

// Une couleur distincte par service, cohérente avec la palette or/charbon.
const serviceStyles: Record<ServiceType, string> = {
  coaching_cv: 'bg-gold/10 text-gold border-gold/20',
  preparation_entretien: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
  consultation: 'bg-white/5 text-cream/80 border-white/10',
};

export function ServiceBadge({ service }: { service: ServiceType }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
        serviceStyles[service],
      )}
    >
      {SERVICE_LABELS[service]}
    </span>
  );
}

const statusStyles: Record<ReservationStatus, string> = {
  nouveau: 'bg-blue-500/15 text-blue-300 border-blue-400/25',
  contacte: 'bg-amber-500/15 text-amber-300 border-amber-400/25',
  en_cours: 'bg-purple-500/15 text-purple-300 border-purple-400/25',
  traite: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25',
  annule: 'bg-rose-500/15 text-rose-300 border-rose-400/25',
};

export function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status],
      )}
    >
      <span className="me-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark',
        className,
      )}
    >
      {children}
    </span>
  );
}
