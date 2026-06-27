export const locales = ['fr', 'ar', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export function isRtl(locale: Locale): boolean {
  return locale === 'ar';
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  ar: 'العربية',
  en: 'English',
};
