import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': root,
      // Le paquet 'server-only' jette hors contexte React Server — neutralisé en test.
      'server-only': fileURLToPath(
        new URL('./tests/stubs/server-only.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'node',
    // Les specs Playwright (tests/e2e, tests/smoke) ne sont PAS du ressort de Vitest.
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      // Périmètre : la logique métier pure de lib/.
      // Exclus (adaptateurs nécessitant des services vivants, couverts par les
      // tests d'intégration via mocks) : clients Supabase, envoi Web Push.
      include: ['lib/**/*.ts'],
      exclude: ['lib/supabase/**', 'lib/push.ts'],
      // Seuil de départ : 60 % (à relever au fil du temps).
      thresholds: { lines: 60, functions: 60, branches: 60, statements: 60 },
      reporter: ['text', 'lcov'],
    },
  },
});
