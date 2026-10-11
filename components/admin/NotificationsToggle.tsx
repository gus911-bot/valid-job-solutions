'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, BellRing, BellOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

type State = 'loading' | 'unsupported' | 'enabled' | 'disabled' | 'blocked';

export function NotificationsToggle() {
  const [state, setState] = useState<State>('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (
        typeof window === 'undefined' ||
        !('serviceWorker' in navigator) ||
        !('PushManager' in window) ||
        !VAPID_PUBLIC_KEY
      ) {
        setState('unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        setState('blocked');
        return;
      }
      const reg = await navigator.serviceWorker.ready.catch(() => null);
      const sub = await reg?.pushManager.getSubscription();
      setState(sub ? 'enabled' : 'disabled');
    })();
  }, []);

  const enable = async () => {
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'blocked' : 'disabled');
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          VAPID_PUBLIC_KEY,
        ) as BufferSource,
      });
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      });
      if (!res.ok) throw new Error();
      setState('enabled');
      toast.success('Notifications activées ✅');
    } catch {
      toast.error("Impossible d'activer les notifications.");
    } finally {
      setBusy(false);
    }
  };

  if (state === 'loading' || state === 'unsupported') return null;

  if (state === 'enabled') {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
        <BellRing className="h-4 w-4" /> Notifications activées
      </span>
    );
  }

  if (state === 'blocked') {
    return (
      <span className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-muted">
        <BellOff className="h-4 w-4" /> Notifications bloquées (autorisez-les dans
        les réglages)
      </span>
    );
  }

  return (
    <Button size="sm" onClick={enable} disabled={busy}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
      Activer les notifications
    </Button>
  );
}
