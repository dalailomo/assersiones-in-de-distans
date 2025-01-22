import { test, expect } from "@playwright/test";
import { levenshteinDistance } from "./lib/helpers.js";

const MAXIMUM_DISTANCE = 15;

// See here how to get started:
// https://playwright.dev/docs/intro
test("visits the app root url", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.getByTestId("start-recording").click();
    await page.waitForTimeout(11000); // matches the audio length on fixtures, plus a second more just in case
    await page.getByTestId("stop-recording").click();

    expect(await page.getByTestId("transcription-status").textContent()).toBe(
        "running",
    );

    // For this STT API, it takes around 10 seconds to the audio, mooore or less
    await page.waitForTimeout(10000);

    // Assert
    expect(
        levenshteinDistance(
            "Buenos días. Me gustaría cancelar una reserva que tenía con vosotros para este próximo sábado.",
            (await page
                .getByTestId("transcription-result")
                .textContent()) as string,
        ),
    ).toBeLessThan(MAXIMUM_DISTANCE);
});
