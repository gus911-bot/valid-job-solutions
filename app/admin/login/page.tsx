import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = { title: 'Connexion admin' };

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-gradient px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
