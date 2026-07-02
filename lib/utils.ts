// Petites utilitaires partagées.

type ClassValue = string | false | null | undefined;

/** Concatène des classes conditionnelles (mini-clsx). */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Formate une date ISO en français lisible. */
export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Formate date + heure. */
export function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Numéro WhatsApp de l'agence (format international sans +). */
export const WHATSAPP_NUMBER = '21623529938';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const CONTACT_EMAIL = 'validjobsolution@gmail.com';
export const CONTACT_PHONE = '98 735 633';
// Format international pour les liens tel: (indicatif Tunisie +216).
export const CONTACT_PHONE_TEL = '+21698735633';

// ───────── Localisation de l'agence ─────────
// ⚠️ Remplacez par l'adresse + les coordonnées exactes de Valid Job Solutions.
export const AGENCY_ADDRESS =
  'Rue des Chandelles (près de l\'arrondissement Sahloul El Gharbi), Hammam Sousse 4011';
export const AGENCY_LAT = 35.851267;
export const AGENCY_LNG = 10.588361;

// Carte Google Maps intégrée via l'endpoint /maps/embed (autorisé en iframe,
// sans clé API). Le paramètre pb encode le centre (lat/lng) et le zoom.
export const AGENCY_MAP_EMBED =
  `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3` +
  `!1d3225.5!2d${AGENCY_LNG}!3d${AGENCY_LAT}` +
  `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1` +
  `!3m3!1m2!1s0x0%3A0x0!2sValid%20Job%20Solutions` +
  `!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn`;

// Fiche Google Business officielle (CID dérivé du place ID).
export const AGENCY_PLACE_URL = 'https://www.google.com/maps?cid=4335862039483113036';
// Lien « Itinéraire » : itinéraire Google Maps vers les coordonnées de l'agence.
export const AGENCY_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${AGENCY_LAT},${AGENCY_LNG}`;
