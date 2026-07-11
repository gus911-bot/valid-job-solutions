import { expect, test } from '@playwright/test';

// Flux critique n°1 : le formulaire de réservation (validation côté client,
// aucune base de données requise).
test.describe('Formulaire de réservation', () => {
  test('la page rend le formulaire complet', async ({ page }) => {
    await page.goto('/fr/reservation');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('[name="full_name"]')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="phone"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('soumission vide → erreurs de validation, pas de navigation', async ({
    page,
  }) => {
    await page.goto('/fr/reservation');
    await page.locator('button[type="submit"]').click();
    // La validation Zod côté client doit afficher au moins une erreur.
    await expect(page.locator('form p, form [role="alert"]').first()).toBeVisible();
    await expect(page).toHaveURL(/\/fr\/reservation/);
  });

  test('email invalide → message d’erreur ciblé', async ({ page }) => {
    await page.goto('/fr/reservation');
    await page.locator('[name="full_name"]').fill('Amine Ben Salah');
    await page.locator('[name="email"]').fill('pas-un-email');
    await page.locator('[name="phone"]').fill('98123456');
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/email invalide/i).first()).toBeVisible();
  });
});
