-- ============================================================
--  005 — Suppression de l'insertion publique directe (sécurité).
--
--  La clé anon est publique (embarquée dans le JS client) : avec la policy
--  « with check (true) », n'importe qui pouvait insérer directement via l'API
--  REST Supabase en contournant /api/reservations (rate limit, honeypot,
--  validation Zod, contrôle du CV) et en fixant librement status, admin_notes
--  ou cv_path. L'API insère déjà avec le service_role (qui ignore la RLS) :
--  cette policy est donc inutile. Sans policy INSERT, anon/authenticated
--  sont refusés.
-- ============================================================
drop policy if exists "public_can_insert_reservation" on public.reservations;

-- Défense en profondeur : retirer aussi le privilège de table.
revoke insert on public.reservations from anon, authenticated;
