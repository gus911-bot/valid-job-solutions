// Constantes et helpers partagés pour l'upload de CV (client + serveur).

export const CV_MAX_BYTES = 5 * 1024 * 1024; // 5 Mo
export const CV_MAX_LABEL = '5 Mo';

// Types acceptés : PDF, DOC, DOCX.
export const CV_ACCEPTED = {
  'application/pdf': { ext: 'pdf' },
  'application/msword': { ext: 'doc' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    ext: 'docx',
  },
} as const;

export type CvMime = keyof typeof CV_ACCEPTED;

export const CV_ACCEPT_ATTR = '.pdf,.doc,.docx';
export const CV_EXT_LABEL = 'PDF, DOC ou DOCX';

/** Validation CLIENT rapide par extension + MIME annoncé + taille. */
export function validateCvClient(file: File): string | null {
  if (file.size > CV_MAX_BYTES) {
    return `Fichier trop volumineux (max ${CV_MAX_LABEL}).`;
  }
  const name = file.name.toLowerCase();
  const okExt = /\.(pdf|doc|docx)$/.test(name);
  if (!okExt) return `Format non accepté. Joindre un ${CV_EXT_LABEL}.`;
  return null;
}

/**
 * Détection SERVEUR par magic bytes (ne pas se fier à l'extension/MIME annoncé).
 * Renvoie le MIME réel détecté, ou null si non reconnu.
 */
export function detectCvMime(bytes: Uint8Array): CvMime | null {
  // PDF : "%PDF"
  if (
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  ) {
    return 'application/pdf';
  }
  // DOC (OLE2 Compound File) : D0 CF 11 E0 A1 B1 1A E1
  if (
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0 &&
    bytes[4] === 0xa1 &&
    bytes[5] === 0xb1 &&
    bytes[6] === 0x1a &&
    bytes[7] === 0xe1
  ) {
    return 'application/msword';
  }
  // DOCX (ZIP) : "PK\x03\x04"
  if (
    bytes[0] === 0x50 &&
    bytes[1] === 0x4b &&
    bytes[2] === 0x03 &&
    bytes[3] === 0x04
  ) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return null;
}

/** Slug sûr pour le nom de fichier stocké. */
export function slugifyFilename(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
