-- 004_push_subscriptions.sql
-- Abonnements Web Push pour les notifications admin (nouvelle réservation).

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now()
);

alter table public.push_subscriptions enable row level security;
-- Aucune policy anon/authenticated → seul le service_role (serveur) y accède.
