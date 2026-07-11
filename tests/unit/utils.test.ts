import { describe, expect, it } from 'vitest';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import { defaultLocale, isLocale, isRtl, locales } from '@/lib/i18n/config';

describe('cn', () => {
  it('concatène et filtre les valeurs falsy', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });
});

describe('formatDate / formatDateTime', () => {
  it("renvoie un tiret cadratin pour l'absence de date", () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDateTime(null)).toBe('—');
  });

  it('formate une date ISO en français', () => {
    // Le mois abrégé français doit apparaître.
    expect(formatDate('2026-03-15T12:00:00Z')).toMatch(/mars|mar/);
  });
});

describe('i18n config', () => {
  it('fr est la locale par défaut', () => {
    expect(defaultLocale).toBe('fr');
    expect(locales).toContain('fr');
  });

  it('isLocale reconnaît uniquement les locales supportées', () => {
    expect(isLocale('ar')).toBe(true);
    expect(isLocale('de')).toBe(false);
  });

  it('seul ar est RTL', () => {
    expect(isRtl('ar')).toBe(true);
    expect(isRtl('fr')).toBe(false);
  });
});
