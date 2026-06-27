'use client';

import { useEffect } from 'react';
import { isRtl, type Locale } from '@/lib/i18n/config';

// Le <html lang/dir> est posé par le layout racine et ne se rafraîchit pas
// lors d'une navigation côté client (changement de langue). On le resynchronise
// ici à chaque changement de locale.
export function HtmlLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr';
  }, [locale]);
  return null;
}
