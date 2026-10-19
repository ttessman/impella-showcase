import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("source previews support hover, keyboard, tap, dismissal and viewport bounds", async ({
  page,
}) => {
  await page.goto("/");
  const triggers = page.locator(".source-reference-trigger");
  await expect(triggers).toHaveCount(4);
  const popup = page.getByRole("dialog", {
    name: "Dedicated calculator behavior",
  });
  await page.getByText("How the calculator works", { exact: true }).click();
  const trigger = page.locator("#tools .source-reference-trigger").first();
  await trigger.scrollIntoViewIfNeeded();
  if (test.info().project.name !== "mobile") {
    await trigger.hover();
    await expect(popup).toBeVisible();
    await popup.hover();
    await expect(popup).toBeVisible();
    await page.mouse.move(1, 1);
    await expect(popup).not.toBeVisible();
  }
  await trigger.click();
  await expect(popup).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(popup).toContainText("Independently written illustration");
  await expect(popup.locator("pre")).toContainText("no clinical math");
  await expect
    .poll(async () => {
      const bounds = (await popup.boundingBox())!;
      return Math.min(
        bounds.x,
        bounds.y,
        page.viewportSize()!.width - bounds.x - bounds.width,
        page.viewportSize()!.height - bounds.y - bounds.height,
      );
    })
    .toBeGreaterThanOrEqual(15);
  const box = (await popup.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(15);
  expect(box.y).toBeGreaterThanOrEqual(15);
  expect(box.x + box.width).toBeLessThanOrEqual(
    page.viewportSize()!.width - 15,
  );
  expect(box.y + box.height).toBeLessThanOrEqual(
    page.viewportSize()!.height - 15,
  );
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(a11y.violations).toEqual([]);
  await popup.getByRole("button", { name: "Close source preview" }).click();
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.blur();
  await trigger.focus();
  await expect(popup).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(popup).toBeVisible();
  await page.locator("#tools-heading").click();
  await expect(popup).not.toBeVisible();
  await triggers.nth(0).click();
  await expect(
    page.getByRole("dialog", { name: "One collection model, two layouts" }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(
    page.locator('.source-reference-popup[data-state="open"]'),
  ).toHaveCount(0);
});
