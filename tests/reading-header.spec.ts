import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("floating site header hides down, reveals up and stays reachable by keyboard", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.locator(".site-header-shell");
  const scrollTo = async (top: number) =>
    page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), top);
  await expect(header).toHaveAttribute("data-hidden", "false");
  const initialHeight = (await header.boundingBox())!.height;
  await scrollTo(500);
  await expect(header).toHaveAttribute("data-hidden", "true");
  await expect
    .poll(async () => {
      const box = (await header.boundingBox())!;
      return box.y + box.height;
    })
    .toBeLessThanOrEqual(1);
  await scrollTo(498);
  await expect(header).toHaveAttribute("data-hidden", "true");
  await scrollTo(440);
  await expect(header).toHaveAttribute("data-hidden", "false");
  await expect
    .poll(async () => (await header.boundingBox())!.y)
    .toBeCloseTo(0, 0);
  expect((await header.boundingBox())!.height).toBe(initialHeight);
  await expect(header).toHaveAttribute("data-floating", "true");
  await scrollTo(650);
  await expect(header).toHaveAttribute("data-hidden", "true");
  await header
    .getByRole("link", {
      name: "IMPELLA",
      exact: true,
    })
    .focus();
  await expect(header).toHaveAttribute("data-hidden", "false");
  await expect
    .poll(async () => (await header.boundingBox())!.y)
    .toBeCloseTo(0, 0);
  // Using navigation must not leave focus pinning the header during later scrolling.
  await scrollTo(850);
  await expect(header).toHaveAttribute("data-hidden", "true");
  await expect
    .poll(async () => {
      const box = (await header.boundingBox())!;
      return box.y + box.height;
    })
    .toBeLessThanOrEqual(1);
  await scrollTo(790);
  await expect(header).toHaveAttribute("data-hidden", "false");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await scrollTo(0);
  await expect(header).toHaveAttribute("data-floating", "false");
  await expect(header).toHaveAttribute("data-hidden", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(header).toHaveCSS("transition-duration", "0s");
});

test("contextual header tracks actual sections, document progress and renderer navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const header = page.locator(".site-header-shell");
  const location = page.getByLabel("Current section", { exact: true });
  const progress = page.getByRole("progressbar", {
    name: "Case study reading progress",
  });
  await expect(location).toHaveText("01 / Context & ownership");
  await expect(progress).toHaveAttribute("aria-valuenow", "0");
  for (const [id, label] of [
    ["architecture", "02 / The architectural decision"],
    ["navigation", "07 / Dynamic navigation"],
    ["ownership", "10 / Impact & ownership"],
  ]) {
    await page.evaluate((id) => {
      const target = document.getElementById(id)!;
      window.scrollTo({
        top: scrollY + target.getBoundingClientRect().top - 100,
        behavior: "instant",
      });
    }, id);
    await expect(location).toHaveText(label);
  }
  expect(Number(await progress.getAttribute("aria-valuenow"))).toBeGreaterThan(
    50,
  );
  await header
    .getByRole("link", { name: "Explore the renderer", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#playground$/);
  await expect(location).toHaveText("03 / Content studio");
  const heading = (await page.locator("#playground-heading").boundingBox())!;
  const head = (await header.boundingBox())!;
  expect(heading.y).toBeGreaterThanOrEqual(head.y + head.height);
  await header.getByRole("link", { name: "Overview", exact: true }).click();
  await expect(page).toHaveURL(/#top$/);
  await expect(location).toHaveText("01 / Context & ownership");
  expect(Number(await progress.getAttribute("aria-valuenow"))).toBeLessThan(5);
});

test("section dropdown uses page definitions, keyboard navigation and keeps the header visible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const header = page.locator(".site-header-shell");
  const trigger = header.getByRole("button", { name: "Sections", exact: true });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const popup = page.getByRole("dialog", { name: "Case study sections" });
  await expect(popup).toBeVisible();
  const links = popup.getByRole("link");
  await expect(links).toHaveCount(11);
  const sizing = await popup.evaluate((el) => ({
    visible: el.clientHeight,
    full: el.scrollHeight,
  }));
  expect(sizing.full).toBeLessThanOrEqual(sizing.visible + 1);
  await expect(links.nth(10)).toBeInViewport();

  const actual = await page.locator(".case-section").evaluateAll((sections) =>
    sections.map((section) => ({
      id: section.id,
      label: section.querySelector(".eyebrow")!.textContent,
      number: section.querySelector(".eyebrow span")!.textContent,
    })),
  );
  expect(actual.map((section) => section.id)).toEqual([
    "overview",
    "architecture",
    "playground",
    "contract",
    "articles",
    "collections",
    "navigation",
    "tools",
    "product",
    "ownership",
    "reflection",
  ]);
  expect(actual.map((section) => section.number)).toEqual(
    Array.from({ length: 11 }, (_, index) =>
      String(index + 1).padStart(2, "0"),
    ),
  );
  await expect(
    page
      .locator(".hero-actions")
      .getByRole("link", { name: "Explore the content studio" }),
  ).toHaveAttribute("href", "#playground");
  await expect(
    page
      .locator("#overview")
      .getByRole("heading", { name: "My role in the modernization" }),
  ).toBeAttached();
  for (let index = 0; index < actual.length; index++) {
    await expect(links.nth(index)).toHaveAttribute(
      "href",
      `#${actual[index].id}`,
    );
    await expect(links.nth(index)).toHaveText(actual[index].label!);
    await expect(links.nth(index)).toContainText(actual[index].number!);
  }
  const sectionLabel = page.locator("#overview .section-heading .eyebrow");
  for (const property of [
    "font-size",
    "font-weight",
    "letter-spacing",
    "text-transform",
    "color",
  ]) {
    const expected = await sectionLabel.evaluate(
      (el, key) => getComputedStyle(el).getPropertyValue(key),
      property,
    );
    await expect(links.nth(0).locator(".eyebrow")).toHaveCSS(
      property,
      expected,
    );
  }
  await expect(links.nth(0).locator(".eyebrow span")).toHaveCSS(
    "color",
    "rgb(138, 100, 30)",
  );
  await popup.screenshot({
    path: test.info().outputPath("section-label-menu.png"),
  });
  await expect(links.nth(0)).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(links.nth(1)).toBeFocused();
  await page.keyboard.press("End");
  await expect(links.nth(10)).toBeFocused();
  await page.keyboard.press("Home");
  await expect(links.nth(0)).toBeFocused();
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await expect(header).toHaveAttribute("data-hidden", "false");
  await page.keyboard.press("Escape");
  await expect(popup).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await popup
    .getByRole("link", { name: /02 \/ The architectural decision/ })
    .click();
  await expect(popup).not.toBeVisible();
  await expect(page).toHaveURL(/#architecture$/);
  await expect(page.getByLabel("Current section", { exact: true })).toHaveText(
    "02 / The architectural decision",
  );
  await trigger.click();
  await expect(
    popup.getByRole("link", { name: /02 \/ The architectural decision/ }),
  ).toHaveAttribute("aria-current", "location");
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(a11y.violations).toEqual([]);
  await page.keyboard.press("Escape");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await header.screenshot({
    path: test.info().outputPath("contextual-reading-header.png"),
  });
});
