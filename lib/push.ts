import 'server-only';
import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

let configured = false;

function configure(): boolean {
  if (configured) return true;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:validjobsolution@gmail.com';
  if (!publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  configured = true;
  return true;
}

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Envoie une notification à tous les abonnements admin.
 * Ne jette jamais (best-effort) : supprime les abonnements expirés.
 */
export async function sendPushToAll(payload: PushPayload): Promise<void> {
  if (!configure()) return;

  const supabase = createAdminClient();
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth');
  if (!subs || subs.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          body,
        );
      } catch (err: unknown) {
        const code = (err as { statusCode?: number })?.statusCode;
        // 404/410 : abonnement expiré → on le supprime.
        if (code === 404 || code === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', s.endpoint);
        }
      }
    }),
  );
}
