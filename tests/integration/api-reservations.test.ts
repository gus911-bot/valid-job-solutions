// Tests d'intégration du handler POST /api/reservations.
// Le handler réel est exécuté (validation, honeypot, rate limit, mapping) ;
// seule la frontière Supabase (DB + Storage) et l'envoi push sont mockés.
// Une intégration contre une vraie base nécessite un projet Supabase de test
// (voir docs/testing.md).
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { insertMock, uploadMock, removeMock, sendPushMock } = vi.hoisted(() => ({
  insertMock: vi.fn(),
  uploadMock: vi.fn(),
  removeMock: vi.fn(),
  sendPushMock: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({ insert: insertMock }),
    storage: {
      from: () => ({ upload: uploadMock, remove: removeMock }),
    },
  }),
}));

vi.mock('@/lib/push', () => ({
  sendPushToAll: sendPushMock,
}));

import { POST } from '@/app/api/reservations/route';

const FIELDS: Record<string, string> = {
  full_name: 'Amine Ben Salah',
  email: 'amine@example.com',
  phone: '+216 98 123 456',
  service: 'coaching_cv',
  target_country: 'France',
  message: 'Bonjour',
};

let ipCounter = 0;

function makeRequest(
  overrides: Record<string, string> = {},
  file?: File,
  ip?: string,
): Request {
  const form = new FormData();
  for (const [k, v] of Object.entries({ ...FIELDS, ...overrides })) {
    form.set(k, v);
  }
  if (file) form.set('cv', file);
  return new Request('http://localhost/api/reservations', {
    method: 'POST',
    body: form,
    // IP unique par défaut pour isoler le rate limiter entre les tests.
    headers: { 'x-forwarded-for': ip ?? `192.0.2.${++ipCounter}` },
  });
}

beforeEach(() => {
  insertMock.mockReset().mockResolvedValue({ error: null });
  uploadMock.mockReset().mockResolvedValue({ error: null });
  removeMock.mockReset().mockResolvedValue({ error: null });
  sendPushMock.mockReset().mockResolvedValue(undefined);
});

describe('POST /api/reservations', () => {
  it('201 : réservation valide insérée avec les champs mappés', async () => {
    const res = await POST(makeRequest());
    expect(res.status).toBe(201);
    expect(insertMock).toHaveBeenCalledOnce();
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        full_name: 'Amine Ben Salah',
        email: 'amine@example.com',
        service: 'coaching_cv',
        target_country: 'France',
      }),
    );
    expect(sendPushMock).toHaveBeenCalledOnce();
  });

  it('400 : données invalides (email manquant) sans insertion', async () => {
    const res = await POST(makeRequest({ email: 'pas-un-email' }));
    expect(res.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('200 silencieux : honeypot rempli, aucune insertion (anti-bot)', async () => {
    const res = await POST(makeRequest({ website: 'http://spam.example' }));
    expect(res.status).toBe(200);
    expect(insertMock).not.toHaveBeenCalled();
    expect(sendPushMock).not.toHaveBeenCalled();
  });

  it('400 : fichier CV au contenu non autorisé (magic bytes)', async () => {
    const fake = new File(['ceci n est pas un pdf'], 'cv.pdf', {
      type: 'application/pdf',
    });
    const res = await POST(makeRequest({}, fake));
    expect(res.status).toBe(400);
    expect(uploadMock).not.toHaveBeenCalled();
    expect(insertMock).not.toHaveBeenCalled();
  });

  it('201 : CV PDF valide uploadé puis référencé dans l’insertion', async () => {
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const pdf = new File([pdfBytes], 'Mon CV.pdf', { type: 'application/pdf' });
    const res = await POST(makeRequest({}, pdf));
    expect(res.status).toBe(201);
    expect(uploadMock).toHaveBeenCalledOnce();
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        cv_filename: 'Mon CV.pdf',
        cv_mime: 'application/pdf',
        cv_path: expect.stringMatching(/^uploads\/.+\.pdf$/),
      }),
    );
  });

  it('500 + nettoyage du fichier si l’insertion échoue après upload', async () => {
    insertMock.mockResolvedValue({ error: { message: 'db down' } });
    const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const pdf = new File([pdfBytes], 'cv.pdf', { type: 'application/pdf' });
    const res = await POST(makeRequest({}, pdf));
    expect(res.status).toBe(500);
    expect(removeMock).toHaveBeenCalledOnce(); // pas de fichier orphelin
  });

  it('429 : au-delà de 5 requêtes/minute pour la même IP', async () => {
    const ip = '198.51.100.99';
    for (let i = 0; i < 5; i++) {
      await POST(makeRequest({}, undefined, ip));
    }
    const res = await POST(makeRequest({}, undefined, ip));
    expect(res.status).toBe(429);
  });
});
