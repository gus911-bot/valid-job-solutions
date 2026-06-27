// Types métier partagés client/serveur.

export type ServiceType = 'coaching_cv' | 'preparation_entretien' | 'consultation';

export type ReservationStatus =
  | 'nouveau'
  | 'contacte'
  | 'en_cours'
  | 'traite'
  | 'annule';

export type PreferredSlot = 'matin' | 'apres_midi';

export interface Reservation {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string;
  service: ServiceType;
  target_country: string | null;
  current_situation: string | null;
  message: string | null;
  preferred_date: string | null;
  preferred_slot: PreferredSlot | null;
  status: ReservationStatus;
  admin_notes: string | null;
  cv_path: string | null;
  cv_filename: string | null;
  cv_size_bytes: number | null;
  cv_mime: string | null;
}

export interface Profile {
  id: string;
  email: string | null;
  role: 'user' | 'admin';
  created_at: string;
}

// Libellés FR pour l'affichage.
export const SERVICE_LABELS: Record<ServiceType, string> = {
  coaching_cv: 'Coaching CV & lettre de motivation',
  preparation_entretien: 'Préparation aux entretiens',
  consultation: 'Consultation générale',
};

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  nouveau: 'Nouveau',
  contacte: 'Contacté',
  en_cours: 'En cours',
  traite: 'Traité',
  annule: 'Annulé',
};

export const SLOT_LABELS: Record<PreferredSlot, string> = {
  matin: 'Matin',
  apres_midi: 'Après-midi',
};
