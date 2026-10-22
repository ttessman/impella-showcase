import { test, expect } from "@playwright/test";
import { openCompose } from "./helpers/studio";

test("theme follows system, remembers a choice and keeps mobile navigation within bounds", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const toggle = page.getByRole("button", {
    name: "Switch to light mode",
    exact: true,
  });
  const sections = page.getByRole("button", { name: "Sections", exact: true });
  const toggleBox = (await toggle.boundingBox())!;
  const sectionBox = (await sections.boundingBox())!;
  expect(toggleBox.x).toBeGreaterThanOrEqual(sectionBox.x + sectionBox.width);
  await expect(toggle).toHaveCSS("border-color", "rgba(0, 0, 0, 0)");
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.locator(".reading-actions")).toBeVisible();
});

test("move several blocks into a section and back out without JSON edits", async ({
  page,
}) => {
  await page.goto("/");
  await openCompose(page);
  for (const id of ["intro", "opening"]) {
    await page
      .locator(`[data-drag-row][data-block-id="${id}"] .block-select`)
      .click();
    await page
      .getByLabel("Move block to", { exact: true })
      .selectOption("chapter");
    await expect(
      page.locator(
        `[data-drop-container][data-parent-id="chapter"] > li[data-block-id="${id}"]`,
      ),
    ).toHaveCount(1);
  }
  await page
    .locator('[data-drag-row][data-block-id="prompt"] .block-select')
    .click();
  await page.getByLabel("Move block to", { exact: true }).selectOption("root");
  await expect(
    page
      .getByRole("list", { name: "Page blocks", exact: true })
      .locator(':scope > li[data-block-id="prompt"]'),
  ).toHaveCount(1);
  await page
    .locator('[data-drag-row][data-block-id="chapter"] .block-select')
    .click();
  await expect(
    page
      .getByLabel("Move block to", { exact: true })
      .locator('option[value="chapter"]'),
  ).toHaveCount(0);
});

test("drag a nested block out using the section gutter", async ({ page }) => {
  await page.goto("/");
  await openCompose(page);
  const grip = page.locator('[data-drag-handle="prompt"]');
  await grip.scrollIntoViewIfNeeded();
  const from = (await grip.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2 + 10);
  const nested = page.locator(
    '[data-drop-container][data-parent-id="chapter"]',
  );
  const bounds = (await nested.boundingBox())!;
  await page.mouse.move(bounds.x + 3, from.y + from.height / 2);
  await expect(page.locator(".drop-active")).toHaveAttribute(
    "data-parent-id",
    "",
  );
  await expect(page.locator(".drop-active")).toHaveAttribute(
    "data-before-id",
    "sources",
  );
  await page.mouse.up();
  await expect(
    page
      .getByRole("list", { name: "Page blocks", exact: true })
      .locator(':scope > li[data-block-id="prompt"]'),
  ).toHaveCount(1);
});
