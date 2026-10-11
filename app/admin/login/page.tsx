import { Suspense } from 'react';
import Image from 'next/image';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = { title: 'Connexion admin' };

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Visuel de marque (desktop) */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="/approach-2.webp"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-cream">
            Gérez les demandes de vos candidats, en un seul endroit.
          </p>
          <p className="mt-3 text-sm text-cream/70">Valid Job Solutions — Espace administrateur</p>
        </div>
      </div>

      <div className="grid place-items-center px-5 py-12">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
