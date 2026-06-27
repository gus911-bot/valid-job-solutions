import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Adresse email invalide.'),
  password: z.string().min(6, 'Mot de passe trop court (min 6 caractères).'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const updateReservationSchema = z.object({
  id: z.string().uuid(),
  status: z
    .enum(['nouveau', 'contacte', 'en_cours', 'traite', 'annule'])
    .optional(),
  admin_notes: z.string().trim().max(4000).optional(),
});

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
