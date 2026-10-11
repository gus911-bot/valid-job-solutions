import { describe, expect, it } from 'vitest';
import {
  CV_MAX_BYTES,
  detectCvMime,
  slugifyFilename,
  validateCvClient,
} from '@/lib/cv';

describe('detectCvMime (magic bytes)', () => {
  it('détecte un PDF (%PDF)', () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    expect(detectCvMime(bytes)).toBe('application/pdf');
  });

  it('détecte un DOC (OLE2)', () => {
    const bytes = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    expect(detectCvMime(bytes)).toBe('application/msword');
  });

  it('détecte un DOCX (ZIP)', () => {
    const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x06, 0x00]);
    expect(detectCvMime(bytes)).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
  });

  it("refuse un type inconnu (l'extension ne suffit pas)", () => {
    const bytes = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x00, 0x00, 0x00]);
    expect(detectCvMime(bytes)).toBeNull();
  });

  it('refuse un buffer vide', () => {
    expect(detectCvMime(new Uint8Array(0))).toBeNull();
  });
});

describe('slugifyFilename', () => {
  it('normalise accents, espaces et caractères spéciaux', () => {
    expect(slugifyFilename('Mon CV — Développeur (2024).pdf')).toBe(
      'mon-cv-developpeur-2024-pdf',
    );
  });

  it('tronque à 60 caractères', () => {
    expect(slugifyFilename('a'.repeat(100)).length).toBeLessThanOrEqual(60);
  });

  it('supprime les tirets en tête/queue', () => {
    expect(slugifyFilename('---cv---')).toBe('cv');
  });

  it('renvoie une chaîne vide si rien de valide', () => {
    expect(slugifyFilename('***')).toBe('');
  });
});

describe('validateCvClient', () => {
  it('accepte un PDF de taille normale', () => {
    const file = new File(['contenu'], 'cv.pdf', { type: 'application/pdf' });
    expect(validateCvClient(file)).toBeNull();
  });

  it('refuse un fichier trop volumineux', () => {
    const big = new File([new Uint8Array(CV_MAX_BYTES + 1)], 'cv.pdf');
    expect(validateCvClient(big)).toMatch(/volumineux/);
  });

  it('refuse une extension non autorisée', () => {
    const file = new File(['x'], 'script.exe');
    expect(validateCvClient(file)).toMatch(/Format non accepté/);
  });
});
