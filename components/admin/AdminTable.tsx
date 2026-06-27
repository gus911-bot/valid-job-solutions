'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, Eye } from 'lucide-react';
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
    <div className="rounded-2xl border border-line bg-surface-100 shadow-soft">
      {/* Barre de filtres */}
      <div className="grid gap-3 border-b border-line p-4 sm:grid-cols-3">
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

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wider text-muted">
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
                className="border-b border-line/60 transition hover:bg-surface-200"
              >
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {formatDate(r.created_at)}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-cream">{r.full_name}</p>
                  <p className="text-xs text-muted">{r.email}</p>
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
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gold-dark hover:bg-gold/10"
                  >
                    <Eye className="h-3.5 w-3.5" /> Détail
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
