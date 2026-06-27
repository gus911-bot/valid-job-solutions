-- 003_cv_upload.sql
-- Pièce jointe CV sur les réservations + bucket de stockage privé.

-- 1. Colonnes CV sur reservations (toutes nullables : CV optionnel).
alter table public.reservations
  add column if not exists cv_path text,
  add column if not exists cv_filename text,
  add column if not exists cv_size_bytes integer,
  add column if not exists cv_mime text;

-- 2. Bucket privé "cvs" (public = false : aucun accès direct par URL).
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

-- 3. Sécurité du bucket :
-- storage.objects a déjà la RLS activée par défaut. On ne crée AUCUNE policy
-- pour anon/authenticated → personne ne peut lire/écrire avec la clé publique.
-- Seul le client service_role (serveur) accède : il bypasse la RLS.
--   • Upload : route serveur /api/reservations (service_role).
--   • Lecture : signed URL générée côté serveur (admin) via service_role.
