import { z } from 'zod';

// Regex simples et robustes (validation côté client ET serveur).
const phoneRegex = /^[+]?[0-9\s().-]{6,20}$/;

export const reservationSchema = z.object({
  full_name: z
    .string({ required_error: 'Le nom complet est requis.' })
    .trim()
    .min(2, 'Veuillez saisir votre nom complet.')
    .max(120, 'Nom trop long.'),
  email: z
    .string({ required_error: "L'email est requis." })
    .trim()
    .toLowerCase()
    .email('Adresse email invalide.')
    .max(160),
  phone: z
    .string({ required_error: 'Le téléphone est requis.' })
    .trim()
    .regex(phoneRegex, 'Numéro de téléphone invalide.'),
  service: z.enum(['coaching_cv', 'preparation_entretien', 'consultation'], {
    required_error: 'Veuillez choisir un service.',
  }),
  target_country: z.string().trim().max(80).optional().or(z.literal('')),
  current_situation: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide.')
    .optional()
    .or(z.literal('')),
  preferred_slot: z.enum(['matin', 'apres_midi']).optional().or(z.literal('')),
  // Honeypot anti-spam : rempli par les bots. La validation le laisse passer
  // volontairement — la route répond ensuite un 200 silencieux sans insertion
  // (un rejet 400 révélerait le piège aux bots). La borne reste très haute :
  // un `.max()` bas ferait échouer Zod AVANT la branche silencieuse et
  // exposerait `fieldErrors.website` dans la réponse 400.
  website: z.string().max(5000).optional().or(z.literal('')),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
