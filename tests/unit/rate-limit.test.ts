import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getClientIp, rateLimit } from '@/lib/rate-limit';

// Sans UPSTASH_* configuré, rateLimit utilise le limiteur en mémoire.
describe('rateLimit (mémoire)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('autorise jusqu’à la limite puis bloque', async () => {
    const id = `test:${crypto.randomUUID()}`;
    for (let i = 0; i < 5; i++) {
      const { success } = await rateLimit(id, { limit: 5, windowMs: 60_000 });
      expect(success).toBe(true);
    }
    const sixth = await rateLimit(id, { limit: 5, windowMs: 60_000 });
    expect(sixth.success).toBe(false);
    expect(sixth.remaining).toBe(0);
  });

  it('décrémente remaining à chaque appel', async () => {
    const id = `test:${crypto.randomUUID()}`;
    const first = await rateLimit(id, { limit: 3, windowMs: 60_000 });
    const second = await rateLimit(id, { limit: 3, windowMs: 60_000 });
    expect(first.remaining).toBe(2);
    expect(second.remaining).toBe(1);
  });

  it('réinitialise après expiration de la fenêtre', async () => {
    const id = `test:${crypto.randomUUID()}`;
    for (let i = 0; i < 2; i++) {
      await rateLimit(id, { limit: 2, windowMs: 60_000 });
    }
    expect((await rateLimit(id, { limit: 2, windowMs: 60_000 })).success).toBe(
      false,
    );

    vi.advanceTimersByTime(61_000);
    const after = await rateLimit(id, { limit: 2, windowMs: 60_000 });
    expect(after.success).toBe(true);
    expect(after.remaining).toBe(1);
  });
});

describe('getClientIp', () => {
  it('prend le dernier saut de x-forwarded-for (posé par notre proxy)', () => {
    const headers = new Headers({
      'x-forwarded-for': '203.0.113.7, 10.0.0.1',
    });
    expect(getClientIp(headers)).toBe('10.0.0.1');
  });

  it("ignore une IP falsifiée en tête de x-forwarded-for", () => {
    // Le client envoie « 1.2.3.4 » ; notre proxy ajoute la vraie IP en fin.
    const headers = new Headers({
      'x-forwarded-for': '1.2.3.4, 198.51.100.9',
    });
    expect(getClientIp(headers)).toBe('198.51.100.9');
  });

  it('privilégie x-real-ip quand il est présent', () => {
    const headers = new Headers({
      'x-forwarded-for': '1.2.3.4',
      'x-real-ip': '198.51.100.2',
    });
    expect(getClientIp(headers)).toBe('198.51.100.2');
  });

  it('retombe sur x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '198.51.100.2' });
    expect(getClientIp(headers)).toBe('198.51.100.2');
  });

  it("renvoie 'unknown' sans en-tête", () => {
    expect(getClientIp(new Headers())).toBe('unknown');
  });
});
