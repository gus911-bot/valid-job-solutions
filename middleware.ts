import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { defaultLocale, locales } from '@/lib/i18n/config';

function localeFromPath(pathname: string): string | null {
  const seg = pathname.split('/')[1] ?? '';
  return locales.includes(seg as (typeof locales)[number]) ? seg : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Espace admin : auth Supabase, hors i18n.
  if (pathname.startsWith('/admin')) {
    return updateSession(request);
  }

  // API : pas de redirection de locale.
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Public : garantir un préfixe de locale (/fr, /ar, /en).
  const current = localeFromPath(pathname);
  if (!current) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  // Propage la locale au layout racine (pour <html lang dir>).
  const res = NextResponse.next();
  res.headers.set('x-locale', current);
  return res;
}

export const config = {
  // Tout sauf les assets Next et les fichiers (sitemap.xml, robots.txt, *.png…).
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
