'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { PaymentInfo } from '@/components/sections/PaymentInfo';
import {
  reservationSchema,
  type ReservationInput,
} from '@/lib/validations/reservation';
import { validateCvClient } from '@/lib/cv';
import type { ServiceType } from '@/types';
import { SERVICE_LABELS } from '@/types';
import type { Dictionary } from '@/lib/i18n/dictionaries';

const VALID_SERVICES = Object.keys(SERVICE_LABELS) as ServiceType[];

// Services pour lesquels le CV est fortement recommandé.
const CV_RECOMMENDED: ServiceType[] = ['coaching_cv', 'preparation_entretien'];

export function ReservationForm({
  dict,
  initialService,
}: {
  dict: Dictionary;
  initialService?: string;
}) {
  const t = dict.reservation;
  const [submitted, setSubmitted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  // Pré-sélection depuis ?service= (uniquement si valeur valide).
  const preset = VALID_SERVICES.includes(initialService as ServiceType)
    ? (initialService as ServiceType)
    : '';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: { website: '', service: preset || undefined },
  });

  const selectedService = watch('service');
  const cvRecommended = CV_RECOMMENDED.includes(selectedService as ServiceType);

  const handleFile = (f: File | null) => {
    if (!f) {
      setFile(null);
      setFileError(null);
      return;
    }
    const err = validateCvClient(f);
    setFileError(err);
    setFile(err ? null : f);
  };

  const onSubmit = async (data: ReservationInput) => {
    if (fileError) {
      toast.error('Veuillez corriger le fichier joint.');
      return;
    }

    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v ?? ''));
    if (file) fd.append('cv', file);

    try {
      setProgress(0);
      // XHR pour suivre la progression de l'upload.
      const result = await new Promise<{ ok: boolean; error?: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/reservations');
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable)
              setProgress(Math.round((e.loaded / e.total) * 100));
          };
          xhr.onload = () => {
            let body: { ok?: boolean; error?: string } = {};
            try {
              body = JSON.parse(xhr.responseText);
            } catch {
              /* ignore */
            }
            if (xhr.status >= 200 && xhr.status < 300)
              resolve({ ok: true });
            else resolve({ ok: false, error: body.error });
          };
          xhr.onerror = () => reject(new Error('Erreur réseau.'));
          xhr.send(fd);
        },
      );

      if (!result.ok) throw new Error(result.error ?? 'Une erreur est survenue.');

      toast.success('Demande envoyée avec succès !');
      reset();
      setFile(null);
      setSubmitted(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Impossible d\'envoyer la demande.',
      );
    } finally {
      setProgress(null);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-line bg-surface-100 p-6 text-center sm:p-10"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-400/10 ring-8 ring-emerald-400/5">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </span>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-cream sm:text-3xl">{t.successTitle}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">{t.successText}</p>

        {/* Coordonnées de paiement */}
        <PaymentInfo dict={dict} />

        <Button
          variant="outline"
          className="mt-8"
          onClick={() => setSubmitted(false)}
        >
          {t.again}
        </Button>
      </motion.div>
    );
  }

  const busy = isSubmitting || progress !== null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-5 card-lux p-6 sm:p-8"
      noValidate
    >
      {/* Honeypot anti-spam. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('website')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="full_name"
          label={t.fullName}
          required
          placeholder="Marwen Ben Hazez"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <Input
          id="email"
          type="email"
          label={t.email}
          required
          placeholder="vous@exemple.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="phone"
          type="tel"
          label={t.phone}
          required
          placeholder="+216 ..."
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Select
          id="service"
          label={t.service}
          required
          error={errors.service?.message}
          {...register('service')}
        >
          <option value="" disabled>
            {t.servicePlaceholder}
          </option>
          {VALID_SERVICES.map((s) => (
            <option key={s} value={s}>
              {t.services[s]}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="target_country"
          label={t.country}
          placeholder={t.countryPlaceholder}
          error={errors.target_country?.message}
          {...register('target_country')}
        />
        <Input
          id="current_situation"
          label={t.situation}
          placeholder={t.situationPlaceholder}
          error={errors.current_situation?.message}
          {...register('current_situation')}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="preferred_date"
          type="date"
          label={t.date}
          error={errors.preferred_date?.message}
          {...register('preferred_date')}
        />
        <Select
          id="preferred_slot"
          label={t.slot}
          error={errors.preferred_slot?.message}
          {...register('preferred_slot')}
          defaultValue=""
        >
          <option value="">{t.slotAny}</option>
          <option value="matin">{t.slotMorning}</option>
          <option value="apres_midi">{t.slotAfternoon}</option>
        </Select>
      </div>

      <Textarea
        id="message"
        label={t.message}
        placeholder={t.messagePlaceholder}
        error={errors.message?.message}
        {...register('message')}
      />

      {/* Upload CV */}
      <FileDropzone
        label={t.cvLabel}
        browseLabel={t.cvBrowse}
        file={file}
        error={fileError}
        disabled={busy}
        onSelect={handleFile}
        hint={cvRecommended ? t.cvHint : undefined}
      />

      {/* Progression de l'upload */}
      {progress !== null && (
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/20">
            <div
              className="h-full rounded-full bg-gold-gradient transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted">{t.uploading} {progress}%</p>
        </div>
      )}

      <Button type="submit" size="lg" disabled={busy} className="mt-2">
        {busy ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> {t.sending}
          </>
        ) : (
          <>
            <Send className="h-5 w-5" /> {t.submit}
          </>
        )}
      </Button>
    </form>
  );
}
