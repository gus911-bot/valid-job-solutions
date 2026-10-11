// Config ESLint 9 (flat). `next lint` a été retiré dans Next 16 :
// le lint passe désormais par la CLI ESLint (`npm run lint`).
import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'public/**/*.js', // service workers (scripts navigateur autonomes)
    'next-env.d.ts',
  ]),
]);
