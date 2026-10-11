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
    <div className="mt-10 border-t border-line pt-8 text-start">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-semibold tracking-tight text-cream">{t.title}</h3>
        <p className="mt-1 text-sm text-muted">{t.subtitle}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-white/5 px-3 py-1 text-xs text-muted">
          {t.holder} : <span className="font-medium text-cream">{PAYMENT_HOLDER}</span>
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {PAYMENT_METHODS.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-line bg-surface-200 p-4 transition hover:border-white/15"
          >
            {/* En-tête : logo + nom */}
            <div className="flex items-center gap-3">
              {m.logo ? (
                <Image
                  src={m.logo}
                  alt={t.methods[m.id]}
                  width={160}
                  height={48}
                  className="h-10 w-14 shrink-0 rounded-lg bg-white object-contain p-1"
                />
              ) : (
                <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-gold/10">
                  <Landmark className="h-5 w-5 text-gold" />
                </span>
              )}
              <p className="text-sm font-semibold text-cream">{t.methods[m.id]}</p>
            </div>

            {/* Champs (RIB / IBAN / numéro) : valeur sur une ligne + copie */}
            <div className="mt-3 space-y-2">
              {m.fields.map((f) => {
                const id = `${m.id}-${f.key}`;
                const isCopied = copied === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => copy(id, f.value)}
                    aria-label={`${t.copy} — ${t[f.key]}`}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-background/60 px-3 py-2.5 text-start transition hover:border-gold/40"
                  >
                    <span className="min-w-0">
                      <span className="block text-[11px] font-medium uppercase tracking-wider text-muted">
                        {t[f.key]}
                      </span>
                      <bdi
                        dir="ltr"
                        className="block whitespace-nowrap font-mono text-[15px] font-medium tracking-wide text-cream tabular-nums"
                      >
                        {f.value}
                      </bdi>
                    </span>
                    <span
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-lg transition',
                        isCopied
                          ? 'bg-emerald-400/15 text-emerald-400'
                          : 'text-muted group-hover:bg-gold/10 group-hover:text-gold',
                      )}
                    >
                      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-center text-xs text-muted">{t.note}</p>

      <div className="mt-5 flex justify-center">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
        >
          <MessageCircle className="h-4 w-4" fill="white" strokeWidth={0} />
          {t.whatsapp}
        </a>
      </div>
    </div>
  );
}
