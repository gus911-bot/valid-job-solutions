import { expect, test } from '@playwright/test';

// Tests de fumée post-déploiement : exécutés contre l'URL LIVE.
//   PLAYWRIGHT_TEST_BASE_URL=https://... npx playwright test tests/smoke --config=playwright.smoke.config.ts
test.describe('Smoke — production', () => {
  test("la page d'accueil répond et rend le contenu", async ({ page }) => {
    const res = await page.goto('/');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('/api/health renvoie ok', async ({ request }) => {
    const res = await request.get('/api/health');
    expect(res.status()).toBe(200);
    const body = (await res.json()) as { status: string };
    expect(body.status).toBe('ok');
  });

  test("la page de connexion admin est servie (l'auth fonctionne)", async ({
    page,
  }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
