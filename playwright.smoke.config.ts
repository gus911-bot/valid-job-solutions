import { defineConfig, devices } from '@playwright/test';

// Config dédiée aux tests de fumée post-déploiement.
// Nécessite PLAYWRIGHT_TEST_BASE_URL (URL live) — aucun serveur local démarré.
if (!process.env.PLAYWRIGHT_TEST_BASE_URL) {
  throw new Error('PLAYWRIGHT_TEST_BASE_URL est requise pour les tests de fumée.');
}

export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: true,
  retries: 2,
  reporter: process.env.CI ? [['github']] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
