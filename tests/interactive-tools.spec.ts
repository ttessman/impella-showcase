import { test, expect } from "@playwright/test";

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
