'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, Landmark, MessageCircle } from 'lucide-react';
import type { Dictionary } from '@/lib/i18n/dictionaries';
import { PAYMENT_METHODS, PAYMENT_HOLDER } from '@/lib/payment';
import { WHATSAPP_URL, cn } from '@/lib/utils';

export function PaymentInfo({ dict }: { dict: Dictionary }) {
  const t = dict.reservation.payment;
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (id: string, raw: string) => {
    navigator.clipboard?.writeText(raw.replace(/\s/g, ''));
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
  };

  return (
    <div className="mt-8 text-start">
      <div className="mb-5 text-center">
        <h3 className="text-gold-shimmer text-xl font-bold">{t.title}</h3>
        <p className="mt-1 text-sm text-muted">{t.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PAYMENT_METHODS.map((m) => (
          <div key={m.id} className="flex flex-col gap-3 rounded-xl border border-line bg-surface-200 p-4">
            {/* En-tête : logo ou nom */}
            <div className="flex h-10 items-center">
              {m.logo ? (
                <Image
                  src={m.logo}
                  alt={t.methods[m.id]}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="inline-flex items-center gap-2 font-semibold text-cream">
                  <Landmark className="h-5 w-5 text-gold" /> {t.methods[m.id]}
                </span>
              )}
            </div>
            <p className="text-xs font-medium uppercase tracking-wide text-gold-dark">
              {t.methods[m.id]}
            </p>

            {/* Champs (RIB / IBAN / numéro) */}
            <div className="space-y-2">
              {m.fields.map((f) => {
                const id = `${m.id}-${f.key}`;
                return (
                  <div key={id}>
                    <p className="text-[11px] uppercase text-muted">{t[f.key]}</p>
                    <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-300 px-3 py-2">
                      <bdi className="truncate text-sm font-medium text-cream" dir="ltr">
                        {f.value}
                      </bdi>
                      <button
                        type="button"
                        onClick={() => copy(id, f.value)}
                        aria-label={t.copy}
                        className="shrink-0 rounded-md p-1 text-gold transition hover:bg-gold/10"
                      >
                        {copied === id ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-auto text-xs text-muted">
              {t.holder} : <span className="text-cream/80">{PAYMENT_HOLDER}</span>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted">{t.note}</p>

      <div className="mt-4 flex justify-center">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:brightness-110',
          )}
        >
          <MessageCircle className="h-4 w-4" fill="white" strokeWidth={0} />
          {t.whatsapp}
        </a>
      </div>
    </div>
  );
}
