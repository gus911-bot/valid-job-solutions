import { describe, expect, it } from 'vitest';
import { reservationSchema } from '@/lib/validations/reservation';
import { loginSchema, updateReservationSchema } from '@/lib/validations/admin';

const validReservation = {
  full_name: 'Amine Ben Salah',
  email: 'AMINE@Example.com',
  phone: '+216 98 123 456',
  service: 'coaching_cv',
  target_country: 'France',
  current_situation: '',
  message: 'Bonjour',
  preferred_date: '2026-08-01',
  preferred_slot: 'matin',
  website: '',
};

describe('reservationSchema', () => {
  it('accepte une réservation valide et normalise l’email', () => {
    const parsed = reservationSchema.safeParse(validReservation);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.email).toBe('amine@example.com');
    }
  });

  it('refuse un nom trop court', () => {
    expect(
      reservationSchema.safeParse({ ...validReservation, full_name: 'A' })
        .success,
    ).toBe(false);
  });

  it('refuse un email invalide', () => {
    expect(
      reservationSchema.safeParse({ ...validReservation, email: 'pas-un-email' })
        .success,
    ).toBe(false);
  });

  it('refuse un téléphone invalide', () => {
    expect(
      reservationSchema.safeParse({ ...validReservation, phone: 'abc' }).success,
    ).toBe(false);
  });

  it('refuse un service inconnu', () => {
    expect(
      reservationSchema.safeParse({ ...validReservation, service: 'autre' })
        .success,
    ).toBe(false);
  });

  it('refuse une date mal formatée', () => {
    expect(
      reservationSchema.safeParse({
        ...validReservation,
        preferred_date: '01/08/2026',
      }).success,
    ).toBe(false);
  });

  it('laisse passer un honeypot rempli (la route le rejette en silence)', () => {
    // Le schéma ne doit PAS rejeter : un 400 révélerait le piège aux bots.
    // C'est la route /api/reservations qui répond 200 sans insertion.
    const parsed = reservationSchema.safeParse({
      ...validReservation,
      website: 'spam.com',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.website).toBe('spam.com');
  });

  it('accepte les champs optionnels vides', () => {
    expect(
      reservationSchema.safeParse({
        full_name: 'Amine Ben Salah',
        email: 'a@b.com',
        phone: '98123456',
        service: 'consultation',
        target_country: '',
        current_situation: '',
        message: '',
        preferred_date: '',
        preferred_slot: '',
        website: '',
      }).success,
    ).toBe(true);
  });
});

describe('loginSchema', () => {
  it('accepte des identifiants valides et normalise l’email', () => {
    const parsed = loginSchema.safeParse({
      email: '  Admin@Example.com ',
      password: 'secret123',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBe('admin@example.com');
  });

  it('refuse un mot de passe trop court', () => {
    expect(
      loginSchema.safeParse({ email: 'a@b.com', password: '123' }).success,
    ).toBe(false);
  });
});

describe('updateReservationSchema', () => {
  it('accepte un statut valide avec un UUID', () => {
    expect(
      updateReservationSchema.safeParse({
        id: '4fa0e5b2-1a5b-4c1e-9df7-2c3a44a1f111',
        status: 'contacte',
      }).success,
    ).toBe(true);
  });

  it('refuse un id non-UUID', () => {
    expect(
      updateReservationSchema.safeParse({ id: '123', status: 'contacte' })
        .success,
    ).toBe(false);
  });

  it('refuse un statut inconnu', () => {
    expect(
      updateReservationSchema.safeParse({
        id: '4fa0e5b2-1a5b-4c1e-9df7-2c3a44a1f111',
        status: 'archive',
      }).success,
    ).toBe(false);
  });
});
