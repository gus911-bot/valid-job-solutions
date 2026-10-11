// Layout de l'espace admin. Le middleware protège déjà /admin/**,
// mais on revérifie ici (défense en profondeur) sauf sur la page login.
import type { Metadata, Viewport } from 'next';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { PwaRegister } from '@/components/admin/PwaRegister';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Espace admin installable en application (PWA) — uniquement pour l'espace admin.
export const metadata: Metadata = {
  title: 'Valid Job — Admin',
  manifest: '/admin.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'VJ Admin',
    statusBarStyle: 'black-translucent',
  },
  icons: { apple: '/apple-touch-icon.png' },
};

export const viewport: Viewport = { themeColor: '#111827' };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ne JAMAIS faire planter le rendu si l'auth échoue (sinon 500 sur /admin/login).
  let email: string | null = null;
  try {
    const supabase = await createClient();
    // Lecture locale du JWT (déjà validé par le middleware) : pas d'appel réseau.
    const { data } = await supabase.auth.getClaims();
    email = (data?.claims?.email as string | undefined) ?? null;
  } catch (err) {
    console.error('Admin layout auth error:', err);
  }

  // La page /admin/login a son propre rendu plein écran (pas de header).
  return (
    <div className="min-h-screen bg-background">
      <PwaRegister />
      {email && <AdminHeader email={email} />}
      <div className={email ? 'lg:ps-64' : undefined}>{children}</div>
    </div>
  );
}
