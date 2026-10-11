import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

// Rafraîchit la session et protège /admin/**.
// Vérifie l'authentification ET le rôle admin via la table profiles (pas seulement la session).
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  try {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // getClaims() vérifie la signature du JWT localement (clés JWKS mises en
    // cache) au lieu d'un aller-retour vers Supabase Auth à chaque requête
    // comme getUser(). Il rafraîchit aussi la session si le jeton a expiré.
    // Les écritures (server actions) gardent getUser() : contrôle strict.
    const { data: claimsData } = await supabase.auth.getClaims();
    const user = claimsData?.claims?.sub ? { id: claimsData.claims.sub } : null;

    if (isAdminArea && !isLoginPage) {
    // Pas connecté → redirection vers le login.
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Connecté mais pas admin → refus.
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(url);
    }
  }

    // Déjà connecté en admin et sur la page login → vers le dashboard.
    if (isLoginPage && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role === 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
    }

    return response;
  } catch (err) {
    // Le middleware ne doit JAMAIS faire planter le site (sinon 500 global).
    // En cas d'erreur d'auth côté Edge : on échoue en sécurité.
    console.error('Middleware auth error:', err);
    if (isAdminArea && !isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    // Pages publiques / page de login : on laisse rendre normalement.
    return NextResponse.next({ request });
  }
}
