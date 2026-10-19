import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("tool screenshots lead with compact copy and disclose the implementation on demand", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#tools");
  const section = page.locator("#tools");
  await expect(
    section.getByRole("heading", {
      name: "Clinical tools within the same mobile experience.",
    }),
  ).toBeVisible();
  await expect(section.locator(".source-reference-trigger")).toHaveCount(2);
  const images = section.locator(".evidence-screenshot img");
  await expect(images).toHaveCount(2);
  for (const image of await images.all()) {
    await image.evaluate((element: HTMLImageElement) => element.decode());
    expect(
      await image.evaluate((element: HTMLImageElement) => element.naturalWidth),
    ).toBeGreaterThan(0);
  }
  const disclosures = section.locator("details.tool-implementation");
  await expect(disclosures).toHaveCount(2);
  for (const detail of await disclosures.all())
    await expect(detail).not.toHaveAttribute("open");
  const cards = section.locator(".tool-experiences > article");
  const first = (await cards.nth(0).boundingBox())!;
  const second = (await cards.nth(1).boundingBox())!;
  if (Math.abs(first.y - second.y) < 2)
    expect(Math.abs(first.height - second.height)).toBeLessThan(1);
  await section.screenshot({
    path: info.outputPath("visual-interactive-tools.png"),
  });
  const enlarge = section.getByRole("button", {
    name: "Enlarge AKI calculator input screenshot",
    exact: true,
  });
  await enlarge.click();
  await expect(
    page.getByRole("dialog", { name: "AKI calculator input" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(enlarge).toBeFocused();
  await section.getByText("How the calculator works", { exact: true }).click();
  await expect(
    section.getByText("Existing helpers", { exact: true }),
  ).toBeVisible();
  await section.getByText("How the checklist works", { exact: true }).click();
  await expect(
    section.getByText("Selection rules", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("JSON-defined checklist updates live for every selection combination inside its modal", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#tools");
  const launch = page
    .locator(".tool-experiences > article")
    .nth(1)
    .getByRole("button", { name: "Try a checklist" });
  await launch.click();
  const dialog = page.getByRole("dialog", {
    name: "Fictional checklist example",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveClass(/dialog-standard/);
  await expect(
    dialog.locator(":scope > .dialog-header .dialog-header-actions button"),
  ).toHaveCount(2);
  await expect(dialog.locator(":scope > .dialog-body")).toHaveCount(1);
  await expect(dialog.locator(":scope > .dialog-footer")).toHaveCount(1);
  await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", "1");
  const demo = dialog.getByRole("region", { name: "Pack a tiny adventure." });
  const group = demo.locator("details.checklist-group");
  await expect(group.locator("fieldset")).toHaveCount(2);
  await group.locator("summary").click();
  await expect(demo.getByRole("checkbox").first()).not.toBeVisible();
  await group.locator("summary").click();
  const options = demo.getByRole("checkbox");
  const result = demo.getByRole("region", {
    name: "Creative checklist result",
  });
  await options.nth(0).focus();
  await page.keyboard.press("Space");
  await expect(result).toContainText("Catch one tiny detail.");
  await expect(options.nth(0)).toBeFocused();
  const titles = [
    "A small adventure awaits.",
    "Catch one tiny detail.",
    "Follow a wandering line.",
    "Sketch something ordinary.",
    "Hunt for a color.",
    "Make a tiny field report.",
    "See it. Sketch it.",
    "Collect a tiny story.",
    "Bring your curiosity.",
    "Write a sky-side note.",
    "Draw a little fresh air.",
    "Sketch under open skies.",
    "Find a color in the wild.",
    "Make a wandering field report.",
    "Chase a shape outdoors.",
    "Make a pocket expedition.",
  ];
  for (let mask = 0; mask < titles.length; mask++) {
    for (let bit = 0; bit < 4; bit++)
      await options.nth(bit).setChecked(Boolean(mask & (1 << bit)));
    await expect(result.getByRole("heading")).toHaveText(titles[mask]);
  }
  await dialog.screenshot({
    path: info.outputPath("visual-checklist-modal.png"),
  });
  const accessibility = await new AxeBuilder({ page })
    .include(".checklist-dialog")
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await group.locator("summary").click();
  await dialog.getByRole("button", { name: "Start over" }).click();
  await expect(
    dialog.getByRole("button", { name: "Start over" }),
  ).toBeFocused();
  await expect(group).toHaveAttribute("open");
  for (const option of await options.all())
    await expect(option).not.toBeChecked();
  await expect(result).toContainText(titles[0]);
  const close = dialog.getByRole("button", { name: "Close checklist example" });
  await close.focus();
  await page.keyboard.press("Shift+Tab");
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(launch).toBeFocused();
  await launch.click();
  await expect(
    dialog.getByRole("region", { name: "Creative checklist result" }),
  ).toContainText(titles[0]);
  await close.click();
  await expect(launch).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});
