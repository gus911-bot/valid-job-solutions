-- 002_service_types.sql
-- Remplace l'ancien enum (piliers) par les vrais services proposés au client.
-- Les 3 piliers (Identifier/Préparer/Propulser) restent du contenu marketing.

-- Postgres n'autorise pas de renommer/retirer des valeurs d'un enum facilement,
-- donc on crée un nouveau type et on migre la colonne.

create type service_type_new as enum ('coaching_cv', 'preparation_entretien', 'consultation');

-- Migration des données existantes (mapping de transition) :
-- 'preparer' -> 'coaching_cv' ; 'identifier'/'propulser'/'consultation' -> 'consultation'
-- (on ne perd aucune donnée déjà soumise).
alter table public.reservations
  alter column service type service_type_new
  using (
    case service::text
      when 'preparer' then 'coaching_cv'::service_type_new
      else 'consultation'::service_type_new
    end
  );

drop type service_type;
alter type service_type_new rename to service_type;
