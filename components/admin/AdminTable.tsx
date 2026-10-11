'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, ChevronRight } from 'lucide-react';
import { StatusBadge, ServiceBadge } from '@/components/ui/Badge';
import { Input, Select } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import {
  SERVICE_LABELS,
  STATUS_LABELS,
  type Reservation,
  type ReservationStatus,
  type ServiceType,
} from '@/types';

type SortDir = 'desc' | 'asc';

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface-200 text-xs font-semibold text-cream/80">
      {initials || '?'}
    </span>
  );
}

export function AdminTable({ reservations }: { reservations: Reservation[] }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | ''>('');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | ''>('');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reservations
      .filter((r) => {
        if (statusFilter && r.status !== statusFilter) return false;
        if (serviceFilter && r.service !== serviceFilter) return false;
        if (q) {
          const hay = `${r.full_name} ${r.email} ${r.phone} ${r.target_country ?? ''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const diff =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        return sortDir === 'asc' ? diff : -diff;
      });
  }, [reservations, query, statusFilter, serviceFilter, sortDir]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface-100">
      {/* Barre de filtres */}
      <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            id="search"
            placeholder="Rechercher (nom, email, pays…)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          id="filter-status"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ReservationStatus | '')
          }
        >
          <option value="">Tous les statuts</option>
          {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select
          id="filter-service"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value as ServiceType | '')}
        >
          <option value="">Tous les services</option>
          {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((s) => (
            <option key={s} value={s}>
              {SERVICE_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {/* Mobile : liste de cartes */}
      <ul className="divide-y divide-line md:hidden">
        {filtered.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/${r.id}`}
              className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-white/[0.03]"
            >
              <Avatar name={r.full_name} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-medium text-cream">{r.full_name}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-0.5 truncate text-xs text-muted">
                  {formatDate(r.created_at)} · {SERVICE_LABELS[r.service]}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-12 text-center text-sm text-muted">
            Aucune demande ne correspond aux filtres.
          </li>
        )}
      </ul>

      {/* Desktop : tableau */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-white/[0.02] text-xs font-medium text-muted">
            <tr>
              <th className="px-4 py-3">
                <button
                  className="inline-flex items-center gap-1 hover:text-cream"
                  onClick={() =>
                    setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
                  }
                >
                  Date <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Pays</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="group border-b border-line/60 transition last:border-0 hover:bg-white/[0.03]"
              >
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {formatDate(r.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={r.full_name} />
                    <div className="min-w-0">
                      <p className="font-medium text-cream">{r.full_name}</p>
                      <p className="text-xs text-muted">{r.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <ServiceBadge service={r.service} />
                </td>
                <td className="px-4 py-3 text-cream/80">
                  {r.target_country ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/${r.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-cream/80 transition group-hover:border-gold/40 group-hover:text-gold"
                  >
                    Détail <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  Aucune demande ne correspond aux filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-line px-4 py-3 text-xs text-muted">
        {filtered.length} demande{filtered.length > 1 ? 's' : ''} affichée
        {filtered.length > 1 ? 's' : ''} sur {reservations.length}.
      </div>
    </div>
  );
}
