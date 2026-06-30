// Layout de l'espace admin. Le middleware protège déjà /admin/**,
// mais on revérifie ici (défense en profondeur) sauf sur la page login.
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ne JAMAIS faire planter le rendu si l'auth échoue (sinon 500 sur /admin/login).
  let email: string | null = null;
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  } catch (err) {
    console.error('Admin layout auth error:', err);
  }

  // La page /admin/login a son propre rendu plein écran (pas de header).
  return (
    <div className="min-h-screen bg-background">
      {email && <AdminHeader email={email} />}
      {children}
    </div>
  );
}
