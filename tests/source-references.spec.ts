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
  await expect(popup.getByRole("tab")).toHaveCount(4);
  const componentTab = popup.getByRole("tab", {
    name: "components/{AKI,PAPi,CPO,Heparin}Calculator",
    exact: true,
  });
  await expect(componentTab).toHaveAttribute("aria-selected", "true");
  for (const mechanism of [
    "no clinical math",
    "watch()",
    "CalculatorSlider",
    "providedCalculationHelper",
    "toolSpecificResultCheck",
    "ResultsBlock",
    '"blur", () => reset()',
  ]) {
    await expect(popup.locator("pre")).toContainText(mechanism);
  }
  const tabRows = await popup
    .getByRole("tab")
    .evaluateAll((elements) =>
      elements.map((element) => Math.round(element.getBoundingClientRect().y)),
    );
  expect(new Set(tabRows).size).toBe(1);
  const closeIcon = popup.getByRole("button", { name: "Close source preview" });
  const centered = await closeIcon.evaluate((element) => {
    const button = element.getBoundingClientRect();
    const icon = element.querySelector("svg")!.getBoundingClientRect();
    return (
      Math.abs(button.x + button.width / 2 - icon.x - icon.width / 2) < 1 &&
      Math.abs(button.y + button.height / 2 - icon.y - icon.height / 2) < 1
    );
  });
  expect(centered).toBe(true);
  const initialPopup = (await popup.boundingBox())!;
  const anchorBounds = (await trigger.boundingBox())!;
  const gap =
    initialPopup.y >= anchorBounds.y + anchorBounds.height
      ? initialPopup.y - anchorBounds.y - anchorBounds.height
      : anchorBounds.y - initialPopup.y - initialPopup.height;
  expect(gap).toBeGreaterThanOrEqual(9);
  expect(gap).toBeLessThanOrEqual(22);

  await expect(popup.locator(".preview-popover-arrow")).toBeAttached();
  await componentTab.focus();
  await page.keyboard.press("Home");
  await expect(
    popup.getByRole("tab", {
      name: "screens/CalculatorScreen.tsx",
      exact: true,
    }),
  ).toBeFocused();
  await expect(popup.getByRole("tabpanel")).toContainText("supportedTools");
  await page.keyboard.press("End");
  await expect(popup.getByRole("tabpanel")).toContainText("Fixed order");
  await expect
    .poll(async () =>
      popup
        .getByRole("tab")
        .last()
        .evaluate((element) => {
          const tab = element.getBoundingClientRect();
          const list = element.parentElement!.getBoundingClientRect();
          return tab.right <= list.right + 1 && tab.left >= list.left - 1;
        }),
    )
    .toBe(true);

  await expect
    .poll(async () => {
      const bounds = (await popup.boundingBox())!;
      return Math.max(
        Math.abs(bounds.y - initialPopup.y),
        Math.abs(bounds.height - initialPopup.height),
      );
    })
    .toBeLessThan(1);
  await popup.getByText("About this file", { exact: true }).click();
  await expect(popup.locator(".source-file-context")).toContainText(
    "CMS-authored labels",
  );
  await popup.getByText("About this file", { exact: true }).click();
  await componentTab.click();
  await expect(popup.getByRole("tabpanel")).toContainText("watch()");
  await popup.screenshot({
    path: test.info().outputPath("source-code-preview.png"),
  });
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
  const collectionPopup = page.getByRole("dialog", {
    name: "One collection model, two layouts",
  });
  await expect
    .poll(async () => {
      const link = (await triggers.nth(0).boundingBox())!;
      const panel = (await collectionPopup.boundingBox())!;
      return panel.y >= link.y + link.height
        ? panel.y - link.y - link.height
        : link.y - panel.y - panel.height;
    })
    .toBeLessThanOrEqual(22);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(
    page.locator('.source-reference-popup[data-state="open"]'),
  ).toHaveCount(0);
});
