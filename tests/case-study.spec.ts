import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openCompose, closeCompose } from "./helpers/studio";

test("responsive layout, images, console and accessible controls", async ({
  page,
}, info) => {
  const errors: string[] = [];
  const failed: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto("/");
  await page
    .getByRole("heading", {
      name: "Modernization starts with why the old system struggled.",
    })
    .scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((img) => {
        img.loading = "eager";
        return img.decode();
      }),
    );
  });
  const images = await page.evaluate(() =>
    Array.from(document.images).map((img) => ({
      src: img.getAttribute("src"),
      loaded: img.complete && img.naturalWidth > 0,
    })),
  );
  expect(images.every((img) => img.loaded)).toBe(true);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(a11y.violations).toEqual([]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to case study" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", {
      name: "Enlarge Browse & embedded media screenshot",
      exact: true,
    })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close screenshot" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Enlarge Browse & embedded media screenshot",
      exact: true,
    }),
  ).toBeFocused();
  await openCompose(page);
  await page.getByRole("button", { name: "+ Heading", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.getByLabel("Heading text", { exact: true }).focus();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("Keyboard-authored heading");
  await closeCompose(page);
  await expect(
    page
      .getByRole("article", { name: "Mobile content preview" })
      .getByRole("heading", { name: "Keyboard-authored heading" }),
  ).toBeAttached();
  await page
    .getByRole("button", { name: "Reset example", exact: false })
    .click();
  await page.locator("#navigation").screenshot({
    path: info.outputPath("dynamic-navigation.png"),
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `test-results/${info.project.name}-page.png`,
    fullPage: true,
  });
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
});

test("original article diagram displays its full height beside the model and opens an accessible enlarged view", async ({
  page,
}) => {
  await page.goto("/");
  const region = page.locator(".original-article-viewport");
  await region.scrollIntoViewIfNeeded();
  const image = region.getByRole("img");
  await expect(image).toHaveAttribute(
    "src",
    /assets\/documentation\/article_diagram_screenshot\.png$/,
  );
  await image.evaluate(async (element: HTMLImageElement) => element.decode());
  expect(
    await image.evaluate((element: HTMLImageElement) => [
      element.naturalWidth,
      element.naturalHeight,
    ]),
  ).toEqual([1980, 7240]);
  const imageBox = (await image.boundingBox())!;
  const regionBox = (await region.boundingBox())!;
  expect(imageBox.height / imageBox.width).toBeCloseTo(7240 / 1980, 2);
  expect(regionBox.height).toBeCloseTo(imageBox.height, 0);
  expect(
    await region.evaluate(
      (element) => element.scrollHeight - element.clientHeight,
    ),
  ).toBeLessThanOrEqual(1);
  await expect(
    page.locator(".original-article-notes .anatomy-figure"),
  ).toHaveCount(1);
  await expect(page.locator("#articles .anatomy-figure")).toHaveCount(1);
  await page.locator(".original-article-evidence").screenshot({
    path: test.info().outputPath("combined-article-evidence.png"),
  });
  await page
    .locator(".hero-band")
    .screenshot({ path: test.info().outputPath("hero-band.png") });
  await expect(page.locator("#overview")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
  const enlarge = page.getByRole("button", {
    name: "Enlarge original article diagram",
    exact: false,
  });
  await enlarge.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", {
    name: "Original article layout diagram",
  });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close diagram" }),
  ).toBeFocused();
  await expect(dialog.getByRole("img")).toHaveAttribute("width", "1980");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(enlarge).toBeFocused();
});
