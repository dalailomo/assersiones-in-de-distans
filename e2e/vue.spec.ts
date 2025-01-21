import { test, expect } from "@playwright/test";
import { levenshteinDistance } from "./lib/helpers.js";

const MAXIMUM_DISTANCE = 15;

// See here how to get started:
// https://playwright.dev/docs/intro
test("visits the app root url", async ({ page }) => {
    await page.goto("/");

    await page.getByTestId("start-recording").click();
    await page.waitForTimeout(11000); // matches the audio length on fixtures
    await page.getByTestId("stop-recording").click();
    expect(await page.getByTestId("transcription-status").textContent()).toBe(
        "running",
    );

    await page.waitForTimeout(10000); // give it some time
    expect(
        levenshteinDistance(
            "Buenos días. Me gustaría cancelar una reserva que tenía con vosotros para este próximo sábado.",
            (await page
                .getByTestId("transcription-result")
                .textContent()) as string,
        ),
    ).toBeLessThan(MAXIMUM_DISTANCE);
    // await expect(page.locator('div.greetings > h1')).toHaveText('You did it!');
});
