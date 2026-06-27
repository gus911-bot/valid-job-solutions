'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  Mail,
  MessageCircle,
  Save,
  Phone,
  FileText,
  Loader2,
} from 'lucide-react';
import { Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { updateReservation, getCvSignedUrl } from '@/app/admin/actions';
import { formatDateTime } from '@/lib/utils';
import {
  SERVICE_LABELS,
  STATUS_LABELS,
  SLOT_LABELS,
  type Reservation,
  type ReservationStatus,
} from '@/types';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-cream">{value}</span>
    </div>
  );
}

export function ReservationDetail({ reservation }: { reservation: Reservation }) {
  const [status, setStatus] = useState<ReservationStatus>(reservation.status);
  const [notes, setNotes] = useState(reservation.admin_notes ?? '');
  const [pending, startTransition] = useTransition();
  const [cvLoading, setCvLoading] = useState(false);

  const openCv = async () => {
    if (!reservation.cv_path) return;
    setCvLoading(true);
    const res = await getCvSignedUrl(reservation.cv_path);
    setCvLoading(false);
    if (res.ok) window.open(res.url, '_blank', 'noopener');
    else toast.error(res.error);
  };

  const cvSizeLabel = reservation.cv_size_bytes
    ? `${(reservation.cv_size_bytes / 1024).toFixed(0)} Ko`
    : '';

  const waUrl = `https://wa.me/${reservation.phone.replace(/[^0-9]/g, '')}`;
  const mailUrl = `mailto:${reservation.email}?subject=${encodeURIComponent(
    'Valid Job Solutions — Votre demande',
  )}`;

  const save = () => {
    startTransition(async () => {
      const res = await updateReservation({
        id: reservation.id,
        status,
        admin_notes: notes,
      });
      if (res.ok) toast.success('Demande mise à jour.');
      else toast.error(res.error ?? 'Échec de la mise à jour.');
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Infos candidat */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-line bg-surface-100 p-6 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-cream">
                {reservation.full_name}
              </h2>
              <p className="text-sm text-muted">
                Reçue le {formatDateTime(reservation.created_at)}
              </p>
            </div>
            <StatusBadge status={status} />
          </div>

          <Row label="Email" value={reservation.email} />
          <Row label="Téléphone" value={reservation.phone} />
          <Row label="Service" value={SERVICE_LABELS[reservation.service]} />
          <Row label="Pays visé" value={reservation.target_country ?? '—'} />
          <Row
            label="Situation actuelle"
            value={reservation.current_situation ?? '—'}
          />
          <Row
            label="Date souhaitée"
            value={reservation.preferred_date ?? '—'}
          />
          <Row
            label="Créneau"
            value={
              reservation.preferred_slot
                ? SLOT_LABELS[reservation.preferred_slot]
                : '—'
            }
          />

          {reservation.message && (
            <div className="mt-4">
              <p className="text-sm text-muted">Message</p>
              <p className="mt-1 whitespace-pre-wrap rounded-xl bg-surface-200 p-4 text-sm text-cream">
                {reservation.message}
              </p>
            </div>
          )}

          {/* CV joint */}
          <div className="mt-4">
            <p className="text-sm text-muted">CV</p>
            {reservation.cv_path ? (
              <div className="mt-1 flex items-center justify-between gap-3 rounded-xl bg-surface-200 p-3">
                <span className="flex min-w-0 items-center gap-2">
                  <FileText className="h-5 w-5 shrink-0 text-gold-dark" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-cream">
                      {reservation.cv_filename ?? 'Document'}
                    </span>
                    {cvSizeLabel && (
                      <span className="text-xs text-muted">{cvSizeLabel}</span>
                    )}
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openCv}
                  disabled={cvLoading}
                >
                  {cvLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  Voir le CV
                </Button>
              </div>
            ) : (
              <p className="mt-1 text-sm text-cream/60">Aucun CV joint.</p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="dark" size="sm">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
            </a>
            <a href={mailUrl}>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4" /> Email
              </Button>
            </a>
            <a href={`tel:${reservation.phone.replace(/\s/g, '')}`}>
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" /> Appeler
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Gestion */}
      <div className="space-y-5">
        <div className="rounded-2xl border border-line bg-surface-100 p-6 shadow-soft">
          <h3 className="mb-4 font-semibold text-cream">Gestion</h3>
          <div className="space-y-4">
            <Select
              id="status"
              label="Statut"
              value={status}
              onChange={(e) => setStatus(e.target.value as ReservationStatus)}
            >
              {(Object.keys(STATUS_LABELS) as ReservationStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Select>

            <Textarea
              id="admin_notes"
              label="Notes internes"
              placeholder="Notes visibles uniquement par l'équipe…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <Button className="w-full" onClick={save} disabled={pending}>
              <Save className="h-4 w-4" /> {pending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
