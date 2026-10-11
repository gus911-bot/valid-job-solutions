'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Globe } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { signOut } from '@/app/admin/actions';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/', label: 'Voir le site', icon: Globe, external: true },
];

// Barre latérale (desktop) + barre supérieure (mobile) de l'espace admin.
export function AdminHeader({ email }: { email: string | null }) {
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const initial = email?.[0]?.toUpperCase() ?? 'A';

  const logout = () => startTransition(() => void signOut());

  return (
    <>
      {/* Desktop : sidebar fixe */}
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-64 flex-col border-e border-line bg-ink-900/60 backdrop-blur-xl lg:flex">
        <div className="flex h-16 items-center gap-2 px-5">
          <Logo href="/admin" />
          <span className="rounded-md border border-line px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map(({ href, label, icon: Icon, external }) => {
            const active =
              !external && (pathname === href || pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                target={external ? '_blank' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                  active
                    ? 'bg-white/[0.06] text-cream shadow-[inset_2px_0_0_0_#E0B15E]'
                    : 'text-muted hover:bg-white/[0.04] hover:text-cream',
                )}
              >
                <Icon className={cn('h-4 w-4', active && 'text-gold')} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold/15 text-sm font-semibold text-gold">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-cream">{email}</p>
              <p className="text-xs text-muted">Administrateur</p>
            </div>
            <button
              onClick={logout}
              disabled={pending}
              title="Déconnexion"
              aria-label="Déconnexion"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted transition hover:bg-white/5 hover:text-cream disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile : barre supérieure */}
      <header className="glass sticky top-0 z-40 flex h-16 items-center justify-between border-b border-line px-4 lg:hidden">
        <Logo href="/admin" />
        <button
          onClick={logout}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:text-cream disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </header>
    </>
  );
}
