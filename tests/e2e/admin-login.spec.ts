import { expect, test } from '@playwright/test';

// Flux critique n°2 : la protection de l'espace admin.
// La connexion réelle nécessite un projet Supabase avec un compte de test :
// définir E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD pour activer le test complet.
test.describe('Espace admin', () => {
  test('/admin sans session redirige vers /admin/login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test('la page de connexion rend le formulaire', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(
      page.getByRole('heading', { name: /espace administrateur/i }),
    ).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  const adminEmail = process.env.E2E_ADMIN_EMAIL;
  const adminPassword = process.env.E2E_ADMIN_PASSWORD;

  test('connexion admin complète (si identifiants de test fournis)', async ({
    page,
  }) => {
    test.skip(
      !adminEmail || !adminPassword,
      'E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD non définis — test sauté.',
    );
    await page.goto('/admin/login');
    await page.locator('input[type="email"]').fill(adminEmail!);
    await page.locator('input[type="password"]').fill(adminPassword!);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15_000 });
  });
});
