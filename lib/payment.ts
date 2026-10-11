// Moyens de paiement affichés après l'envoi d'une demande de réservation.
// (Affichage de coordonnées bancaires — aucun traitement de paiement.)

export const PAYMENT_HOLDER = 'Ben Hazez Marwen';

export type PaymentFieldKey = 'rib' | 'iban' | 'number';

export interface PaymentField {
  key: PaymentFieldKey;
  /** Valeur affichée (peut contenir des espaces pour la lisibilité). */
  value: string;
}

export interface PaymentMethod {
  id: 'biat' | 'wafacash' | 'zitouna' | 'd17';
  /** Logo dans /public (optionnel : sinon on affiche le nom stylisé). */
  logo?: string;
  fields: PaymentField[];
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'biat',
    logo: '/biat.png',
    fields: [{ key: 'rib', value: '08138 030092 001986 650' }],
  },
  {
    id: 'wafacash',
    logo: '/wafacash.jpg',
    fields: [{ key: 'number', value: '23 529 938' }],
  },
  {
    id: 'zitouna',
    logo: '/izi.png',
    fields: [{ key: 'number', value: '23 529 938' }],
  },
  {
    id: 'd17',
    logo: '/d17.png',
    fields: [{ key: 'number', value: '23 529 938' }],
  },
];
