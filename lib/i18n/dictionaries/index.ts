import type { Locale } from '../config';
import { fr, type Dictionary } from './fr';
import { ar } from './ar';
import { en } from './en';

const dictionaries: Record<Locale, Dictionary> = { fr, ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? fr;
}

export type { Dictionary };
