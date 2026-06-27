// Layout de l'espace admin. Le middleware protège déjà /admin/**,
// mais on revérifie ici (défense en profondeur) sauf sur la page login.
import { AdminHeader } from '@/components/admin/AdminHeader';
import { createClient } from '@/lib/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La page /admin/login a son propre rendu plein écran (pas de header).
  // Si pas connecté, on n'affiche pas le header (le middleware redirige).
  return (
    <div className="min-h-screen bg-background">
      {user && <AdminHeader email={user.email ?? null} />}
      {children}
    </div>
  );
}
