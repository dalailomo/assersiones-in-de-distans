import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Recording' }).click();
  await page.waitForTimeout(10000);
  // await expect(page.locator('div.greetings > h1')).toHaveText('You did it!');
})
