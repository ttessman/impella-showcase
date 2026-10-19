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

test("fictional checklist evaluates on submit with priority, fallback, reset and keyboard access", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/#tools");
  const demo = page.getByRole("region", { name: "Pack a tiny adventure." });
  const result = demo.getByRole("region", {
    name: "Creative checklist result",
  });
  const submit = demo.getByRole("button", { name: "Find my mini adventure" });
  const notebook = demo.getByRole("checkbox", { name: "A trusty notebook" });
  const pencil = demo.getByRole("checkbox", {
    name: "A pencil with big plans",
  });
  const camera = demo.getByRole("checkbox", {
    name: "A camera for tiny discoveries",
  });
  await expect(submit).toBeEnabled();
  await expect(result).toContainText("A small adventure awaits.");
  await submit.click();
  await expect(result).toContainText("Bring your curiosity.");
  await expect(result).toBeFocused();
  await notebook.focus();
  await page.keyboard.press("Space");
  await expect(notebook).toBeChecked();
  await expect(result).toContainText("Choices changed.");
  await expect(result).toContainText("Bring your curiosity.");
  await submit.focus();
  await page.keyboard.press("Enter");
  await expect(result).toContainText("Catch one tiny detail.");
  await expect(result).not.toContainText("Choices changed.");
  await notebook.uncheck();
  await camera.check();
  await submit.click();
  await expect(result).toContainText("Hunt for a color.");
  await notebook.check();
  await pencil.check();
  await submit.click();
  await expect(result).toContainText("Sketch something ordinary.");
  await expect(result).toContainText("AND rule");
  await demo.screenshot({
    path: info.outputPath("visual-checklist-result.png"),
  });
  const accessibility = await new AxeBuilder({ page })
    .include(".checklist-showcase")
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await demo.getByRole("button", { name: "Start over" }).click();
  await expect(notebook).toBeFocused();
  await expect(notebook).not.toBeChecked();
  await expect(pencil).not.toBeChecked();
  await expect(camera).not.toBeChecked();
  await expect(result).toContainText("A small adventure awaits.");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  expect(errors).toEqual([]);
});
