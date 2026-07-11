import { expect, test } from '@playwright/test';

test.describe('Site public — i18n', () => {
  test('/ redirige vers la locale par défaut /fr', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  });

  test("la page d'accueil rend le contenu principal", async ({ page }) => {
    await page.goto('/fr');
    await expect(page.locator('h1')).toBeVisible();
    // Le lien vers la réservation (CTA principal) est présent.
    await expect(
      page.locator('a[href*="/reservation"]').first(),
    ).toBeVisible();
  });

  test('/ar est rendue en RTL', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  });
});
