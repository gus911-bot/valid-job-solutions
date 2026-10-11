import { defineConfig, devices } from '@playwright/test';

// Deux modes :
//  - Local/CI : démarre `npm run start` (le build doit exister : `npm run build`).
//  - Contre un déploiement : PLAYWRIGHT_TEST_BASE_URL=https://... (pas de webServer).
const externalBaseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalBaseUrl ?? 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: 'npm run start',
        url: 'http://localhost:3000/api/health',
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
