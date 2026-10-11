'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { LogIn, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, type LoginInput } from '@/lib/validations/admin';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(
    searchParams.get('error') === 'forbidden'
      ? 'Accès refusé : votre compte n\'est pas administrateur.'
      : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError('Identifiants incorrects.');
      return;
    }

    // Vérifie le rôle admin côté serveur via une requête profil.
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user!.id)
      .single();

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut();
      setServerError('Accès refusé : votre compte n\'est pas administrateur.');
      return;
    }

    toast.success('Connexion réussie');
    // N'accepter qu'un chemin interne à /admin (anti open-redirect :
    // refuse « https://… », « //evil.com », « /\evil.com »…).
    const requested = searchParams.get('redirect') ?? '';
    const redirect = /^\/admin(\/[\w-]*)*$/.test(requested) ? requested : '/admin';
    router.replace(redirect);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-5"
      noValidate
    >
      <div>
        <Image src="/nb.png" alt="Valid Job Solutions" width={498} height={501} className="mb-8 h-16 w-auto" />
        <h1 className="text-3xl font-semibold tracking-tight text-cream">Bon retour 👋</h1>
        <p className="mt-2 text-sm text-muted">Connectez-vous à l&apos;espace administrateur.</p>
      </div>

      {serverError && (
        <p className="rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {serverError}
        </p>
      )}

      <Input
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        id="password"
        type="password"
        label="Mot de passe"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Connexion…
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" /> Se connecter
          </>
        )}
      </Button>
    </form>
  );
}
