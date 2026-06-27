-- ============================================================
--  Valid Job Solutions — Schéma Supabase (idempotent)
--  À exécuter dans : Supabase Studio → SQL Editor.
-- ============================================================

-- Extension pour gen_random_uuid()
create extension if not exists "pgcrypto";

-- ─────────────── ENUMS ───────────────
do $$ begin
  create type reservation_status as enum
    ('nouveau','contacte','en_cours','traite','annule');
exception when duplicate_object then null; end $$;

do $$ begin
  create type service_type as enum
    ('identifier','preparer','propulser','consultation');
exception when duplicate_object then null; end $$;

-- ─────────────── TABLE profiles ───────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now()
);

-- ─────────────── TABLE reservations ───────────────
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  service service_type not null,
  target_country text,
  current_situation text,
  message text,
  preferred_date date,
  preferred_slot text,
  status reservation_status not null default 'nouveau',
  admin_notes text
);

create index if not exists reservations_status_idx on public.reservations (status);
create index if not exists reservations_created_at_idx on public.reservations (created_at desc);
create index if not exists reservations_service_idx on public.reservations (service);

-- ─────────────── TRIGGER updated_at ───────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
  before update on public.reservations
  for each row execute function public.set_updated_at();

-- ─────────────── TRIGGER création de profil ───────────────
-- Crée automatiquement une ligne profiles à l'inscription d'un utilisateur.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================
alter table public.reservations enable row level security;
alter table public.profiles enable row level security;

-- ── reservations ──
-- Insertion publique (formulaire client anonyme) UNIQUEMENT.
drop policy if exists "public_can_insert_reservation" on public.reservations;
create policy "public_can_insert_reservation"
  on public.reservations for insert
  to anon, authenticated
  with check (true);

-- Lecture réservée aux admins.
drop policy if exists "admin_can_select_reservations" on public.reservations;
create policy "admin_can_select_reservations"
  on public.reservations for select
  using (exists (select 1 from public.profiles p
                 where p.id = auth.uid() and p.role = 'admin'));

-- Mise à jour réservée aux admins.
drop policy if exists "admin_can_update_reservations" on public.reservations;
create policy "admin_can_update_reservations"
  on public.reservations for update
  using (exists (select 1 from public.profiles p
                 where p.id = auth.uid() and p.role = 'admin'));

-- Suppression réservée aux admins.
drop policy if exists "admin_can_delete_reservations" on public.reservations;
create policy "admin_can_delete_reservations"
  on public.reservations for delete
  using (exists (select 1 from public.profiles p
                 where p.id = auth.uid() and p.role = 'admin'));

-- ── profiles ──
-- Chacun lit son propre profil.
drop policy if exists "users_read_own_profile" on public.profiles;
create policy "users_read_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

-- ============================================================
--  Promotion d'un admin (à exécuter manuellement après inscription) :
--  update public.profiles set role = 'admin' where email = 'vous@exemple.com';
-- ============================================================
