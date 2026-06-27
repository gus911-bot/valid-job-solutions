'use client';

import { useTransition } from 'react';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { signOut } from '@/app/admin/actions';

export function AdminHeader({ email }: { email: string | null }) {
  const [pending, startTransition] = useTransition();

  return (
    <header className="glass sticky top-0 z-40 border-b border-line">
      <div className="container-x flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark sm:inline-flex">
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </span>
        </div>

        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-sm text-muted sm:inline">{email}</span>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => startTransition(() => void signOut())}
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </div>
    </header>
  );
}
