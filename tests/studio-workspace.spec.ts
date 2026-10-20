import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { StudioDocument } from "../src/utils/studio";
import {
  openCompose,
  closeCompose,
  setWorkspaceLayout,
} from "./helpers/studio";

test("collapse Compose and change output layouts without losing edits or JSON drafts", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) <= 650,
    "Desktop pane controls are replaced by the tested mobile modal.",
  );
  await page.goto("/");
  await setWorkspaceLayout(page, "side");
  await page.getByLabel("Heading text", { exact: true }).fill("Keep this edit");
  const json = page.getByLabel("Editable page JSON");
  const current = JSON.parse(await json.inputValue()) as StudioDocument;
  const draft = JSON.stringify({
    ...current,
    metadata: { ...current.metadata, title: "Layout changes preserve drafts" },
  });
  await page
    .getByRole("button", { name: "Collapse Compose", exact: true })
    .click();
  await expect(
    page.getByLabel("Page title", { exact: true }),
  ).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Show Compose", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("separator", { name: "Resize Compose", exact: true }),
  ).not.toBeVisible();
  await expect(
    page
      .getByRole("article", { name: "Mobile content preview" })
      .getByRole("heading", { name: "Keep this edit" }),
  ).toBeVisible();
  await json.fill(draft);
  await setWorkspaceLayout(page, "stacked");
  await expect(
    page.getByRole("button", { name: "Show panels side by side", exact: true }),
  ).toHaveAttribute("data-layout", "stacked");
  expect(await json.inputValue()).toBe(draft);
  await expect(
    page.getByRole("button", { name: "Discard draft", exact: true }),
  ).toBeVisible();
  const inspect = await page.locator(".workspace-inspect").boundingBox();
  const preview = await page.locator(".workspace-preview").boundingBox();
  expect(inspect!.y).toBeGreaterThan(preview!.y + preview!.height - 2);
  await setWorkspaceLayout(page, "side");
  const sideInspect = await page.locator(".workspace-inspect").boundingBox();
  const sidePreview = await page.locator(".workspace-preview").boundingBox();
  if (
    await page
      .getByRole("separator", {
        name: "Resize Inspect and Preview",
        exact: true,
      })
      .isVisible()
  ) {
    expect(sidePreview!.x).toBeGreaterThan(
      sideInspect!.x + sideInspect!.width - 2,
    );
  } else {
    expect(sidePreview!.y).toBeLessThan(sideInspect!.y);
  }
  await page
    .locator(".panel-workspace")
    .screenshot({ path: test.info().outputPath("collapsed-workspace.png") });
  await page.getByRole("button", { name: "Reset layout", exact: true }).click();
  await expect(page.getByLabel("Page title", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Page title", { exact: true })).toBeDisabled();
  expect(await json.inputValue()).toBe(draft);
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(page.getByLabel("Page title", { exact: true })).toHaveValue(
    "Layout changes preserve drafts",
  );
  await expect(page.getByLabel("Heading text", { exact: true })).toHaveValue(
    "Keep this edit",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("workspace dividers resize with pointer and keyboard and respect limits", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) <= 650,
    "Desktop pane controls are replaced by the tested mobile modal.",
  );
  await page.goto("/");
  await setWorkspaceLayout(page, "side");
  const compose = page.getByRole("separator", {
    name: "Resize Compose",
    exact: true,
  });
  if (await compose.isVisible()) {
    await compose.focus();
    await page.keyboard.press("ArrowRight");
    await expect(compose).toHaveAttribute("aria-valuenow", "36");
    await page.keyboard.press("Home");
    await expect(compose).toHaveAttribute("aria-valuenow", "26");
    await page.keyboard.press("End");
    await expect(compose).toHaveAttribute("aria-valuenow", "46");
    await page.keyboard.press("Enter");
    await expect(compose).toHaveAttribute("aria-valuenow", "34");
    await compose.scrollIntoViewIfNeeded();
    const box = (await compose.boundingBox())!;
    const pointerY = Math.max(
      70,
      Math.min(
        box.y + box.height / 2,
        (page.viewportSize()?.height ?? 1000) - 70,
      ),
    );
    await page.mouse.move(box.x + box.width / 2, pointerY);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 50, pointerY, { steps: 5 });
    await page.mouse.up();
    expect(Number(await compose.getAttribute("aria-valuenow"))).toBeGreaterThan(
      34,
    );
    await compose.dblclick();
    await expect(compose).toHaveAttribute("aria-valuenow", "34");
  }
  await page
    .getByRole("button", { name: "Collapse Compose", exact: true })
    .click();
  const output = page.getByRole("separator", {
    name: "Resize Inspect and Preview",
    exact: true,
  });
  if (await output.isVisible()) {
    await output.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(output).toHaveAttribute("aria-valuenow", "48");
    await page.keyboard.press("End");
    await expect(output).toHaveAttribute("aria-valuenow", "70");
    await page.keyboard.press("Enter");
    await expect(output).toHaveAttribute("aria-valuenow", "50");
    await setWorkspaceLayout(page, "stacked");
    await expect(output).toHaveAttribute("aria-orientation", "horizontal");
    await output.focus();
    await page.keyboard.press("ArrowDown");
    await expect(output).toHaveAttribute("aria-valuenow", "50");
    await page.keyboard.press("Home");
    await expect(output).toHaveAttribute("aria-valuenow", "30");
    const inspectBox = (await page
      .locator(".workspace-inspect")
      .boundingBox())!;
    const applyBox = (await page
      .getByRole("button", { name: "Apply JSON", exact: true })
      .boundingBox())!;
    expect(applyBox.y + applyBox.height).toBeLessThanOrEqual(
      inspectBox.y + inspectBox.height + 1,
    );
    await page.keyboard.press("End");
    await expect(output).toHaveAttribute("aria-valuenow", "70");
    await page.keyboard.press("Enter");
    await expect(output).toHaveAttribute("aria-valuenow", "48");
    await output.scrollIntoViewIfNeeded();
    const box = (await output.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 40, {
      steps: 5,
    });
    await page.mouse.up();
    expect(Number(await output.getAttribute("aria-valuenow"))).toBeGreaterThan(
      48,
    );
    await page
      .locator(".panel-workspace")
      .screenshot({ path: test.info().outputPath("stacked-workspace.png") });
  }
  await page.getByRole("button", { name: "Reset layout", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Show panels side by side", exact: true }),
  ).toHaveAttribute("data-layout", "stacked");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});

test("collapsed and stacked workspace remains accessible", async ({ page }) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) <= 650,
    "Desktop pane controls are replaced by the tested mobile modal.",
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Collapse Compose", exact: true })
    .click();

  const results = await new AxeBuilder({ page })
    .include(".panel-workspace")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  const preview = (await page.locator(".workspace-preview").boundingBox())!;
  const phone = (await page.locator(".phone-preview").boundingBox())!;
  expect(phone.y + phone.height).toBeLessThanOrEqual(
    preview.y + preview.height + 1,
  );
});

test("pane header icons, full-height Compose rail and preview-first default match the workspace controls", async ({
  page,
}) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) <= 650,
    "Desktop pane controls are replaced by the tested mobile modal.",
  );
  await page.goto("/");
  const collapse = page.getByRole("button", {
    name: "Collapse Compose",
    exact: true,
  });
  await expect(collapse).toHaveAttribute("title", "Collapse Compose");
  expect((await collapse.textContent())?.trim()).toBe("");
  await expect(collapse.locator("svg")).toHaveCount(1);
  const head = (await page
    .locator(".compose-pane-shell > .workspace-pane-header")
    .boundingBox())!;
  const icon = (await collapse.boundingBox())!;
  expect(icon.width).toBeLessThanOrEqual(32);
  expect(icon.x).toBeGreaterThan(head.x + head.width / 2);
  await expect(
    page
      .locator(".playground-actions")
      .getByRole("button", { name: "Reset layout", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator(".playground-actions")
      .getByRole("button", { name: "Reset example", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".playground-actions button svg")).toHaveCount(2);
  await expect(
    page.getByText("Inspect + Preview", { exact: true }),
  ).toHaveCount(0);
  const toggle = page.locator(".workspace-output-header").getByRole("button");
  await expect(toggle).toHaveAttribute("data-layout", "stacked");
  await expect(toggle).toHaveAttribute("title", /Preview above JSON/);
  const inspect = (await page.locator(".workspace-inspect").boundingBox())!;
  const preview = (await page.locator(".workspace-preview").boundingBox())!;
  expect(preview.y + preview.height).toBeLessThanOrEqual(inspect.y + 1);
  await page.getByLabel("Editable page JSON").evaluate((el) => {
    el.dataset.mountCheck = "preserve";
  });
  await collapse.click();
  const rail = page.getByRole("button", { name: "Show Compose", exact: true });
  await expect(rail).toBeFocused();
  await expect(rail).toHaveAttribute("title", "Show Compose");
  await expect(rail.locator(".compose-rail-content > span")).toHaveText(
    "Compose",
  );
  const railBox = (await rail.boundingBox())!;
  const workspace = (await page.locator(".compose-split").boundingBox())!;
  expect(railBox.height).toBeCloseTo(workspace.height, 0);
  expect(railBox.width).toBe(48);
  if (await toggle.isEnabled()) {
    await toggle.click();
    await expect(toggle).toHaveAttribute("data-layout", "side");
    await toggle.click();
  }
  await expect(toggle).toHaveAttribute("data-layout", "stacked");
  await expect(page.getByLabel("Editable page JSON")).toHaveAttribute(
    "data-mount-check",
    "preserve",
  );
  const outputChildren = await page
    .locator(".output-split > .split-slot")
    .evaluateAll((elements) =>
      elements.map((el) =>
        el.querySelector(".workspace-preview") ? "preview" : "inspect",
      ),
    );
  expect(outputChildren).toEqual(["preview", "inspect"]);
  await page
    .locator(".panel-workspace")
    .screenshot({ path: test.info().outputPath("pane-header-controls.png") });
  await rail.click();
  await expect(collapse).toBeFocused();
  await expect(page.getByLabel("Page title", { exact: true })).toBeVisible();
});

test("Content studio stays within the viewport with its disclaimer inside the header", async ({
  page,
}) => {
  await page.goto("/");
  const studio = page.locator(".playground");
  await studio.scrollIntoViewIfNeeded();
  const bounds = (await studio.boundingBox())!;
  expect(bounds.height).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
  await expect(page.locator(".playground-title")).toContainText(
    "Content studio",
  );
  await expect(page.locator(".playground-bar .demo-note")).toContainText(
    "Fictional creative journal",
  );
  await expect(page.locator(".playground > .demo-note")).toHaveCount(0);
  await expect(
    page.getByText("Interactive reconstruction", { exact: true }),
  ).toHaveCount(0);
  const workspace = page.getByRole("region", {
    name: "Content studio workspace",
    exact: true,
  });
  const header = (await page.locator(".playground-bar").boundingBox())!;
  await workspace.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  const after = (await page.locator(".playground-bar").boundingBox())!;
  expect(after.y).toBeCloseTo(header.y, 1);
  await expect(
    page
      .locator(".playground-actions")
      .getByRole("button", { name: "Reset layout", exact: true }),
  ).toBeVisible();
  await workspace.evaluate((el) => {
    el.scrollTop = 0;
  });
  const collapse = page.getByRole("button", {
    name: "Collapse Compose",
    exact: true,
  });
  if (await collapse.isVisible()) await collapse.click();
  await studio.screenshot({
    path: test.info().outputPath("content-studio.png"),
  });
  expect((await studio.boundingBox())!.height).toBeLessThanOrEqual(
    page.viewportSize()!.height + 1,
  );
});

test("mobile preview preserves device aspect ratio and scrolls content across layouts", async ({
  page,
}) => {
  await page.goto("/");
  const phone = page.locator(".phone-preview");
  const stage = page.locator(".preview-device-stage");
  async function checkDevice() {
    await expect
      .poll(async () => {
        const box = (await phone.boundingBox())!;
        const available = (await stage.boundingBox())!;
        return Math.max(
          Math.abs(box.width / box.height - 390 / 844),
          box.width - available.width,
          box.height - available.height,
        );
      })
      .toBeLessThan(0.01);
  }
  await checkDevice();
  await openCompose(page);
  await page
    .getByLabel("Heading text", { exact: true })
    .fill("A fictional observation from the field. ".repeat(45));
  await closeCompose(page);
  await checkDevice();
  const content = page.getByRole("article", { name: "Mobile content preview" });
  expect(
    await content.evaluate((el) => el.scrollHeight > el.clientHeight),
  ).toBe(true);
  await content.evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
  expect(await content.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
  await checkDevice();
  const collapse = page.getByRole("button", {
    name: "Collapse Compose",
    exact: true,
  });
  if (await collapse.isVisible()) await collapse.click();
  await setWorkspaceLayout(page, "side");
  await checkDevice();
  await setWorkspaceLayout(page, "stacked");
  await checkDevice();
  await page.locator(".playground").screenshot({
    path: test.info().outputPath("fixed-aspect-content-studio.png"),
  });
});

test("mobile Compose modal supports the full authoring and JSON workflow with focus restoration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const studio = page.locator(".playground");
  await studio.scrollIntoViewIfNeeded();
  const open = page.getByRole("button", { name: "Open Compose", exact: true });
  const modal = page.getByRole("dialog", { name: "01 Compose" });
  const json = page.getByLabel("Editable page JSON");
  const preview = page.getByRole("article", { name: "Mobile content preview" });
  const original = await json.inputValue();
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByLabel("Page title", { exact: true }),
  ).not.toBeVisible();
  await expect(page.locator(".compose-rail")).toHaveCount(0);
  const output = (await page.locator(".workspace-output").boundingBox())!;
  const work = (await page.locator(".panel-workspace").boundingBox())!;
  expect(output.width).toBeCloseTo(work.width, 0);
  for (const label of ["Open Compose", "Reset layout", "Reset example"]) {
    const button = page
      .locator(".playground-actions")
      .getByRole("button", { name: label, exact: true });
    await expect(button).toHaveAttribute("title", label);
    expect((await button.boundingBox())!.width).toBeGreaterThanOrEqual(44);
  }
  await open.click();
  await expect(modal).toBeVisible();
  const pageTitle = modal.getByLabel("Page title", { exact: true });
  await expect(pageTitle).toHaveCSS("min-height", "40px");
  await expect(pageTitle.locator("..")).toHaveCSS("flex-direction", "column");
  const close = page.getByRole("button", {
    name: "Close Compose",
    exact: true,
  });
  await expect(close).toBeFocused();
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).toBe("hidden");
  await page.keyboard.press("Shift+Tab");
  expect(
    await modal.evaluate((el) => el.contains(document.activeElement)),
  ).toBe(true);
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(a11y.violations).toEqual([]);
  await page.getByRole("button", { name: "+ Heading", exact: true }).click();
  await page.getByLabel("Heading text", { exact: true }).fill("Mobile journal");
  await page.getByRole("button", { name: "+ Section", exact: true }).click();
  await page
    .getByLabel("Section title", { exact: true })
    .fill("Mobile chapter");
  await close.click();
  await expect(open).toBeFocused();
  await expect(
    preview.getByRole("heading", { name: "Mobile journal", exact: true }),
  ).toBeVisible();
  const data = JSON.parse(await json.inputValue()) as StudioDocument;
  const section = data.content.at(-1)!;
  await open.click();
  await page
    .getByLabel("Add blocks to", { exact: true })
    .selectOption(section.id);
  await page.getByRole("button", { name: "+ Paragraph", exact: true }).click();
  await page
    .getByLabel("Paragraph text", { exact: true })
    .fill("A mobile observation.");
  await page
    .getByRole("button", {
      name: "Move Section Mobile chapter up",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Remove Heading Mobile journal", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(modal).not.toBeVisible();
  await expect(open).toBeFocused();
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe("hidden");
  await expect(preview.getByText("A mobile observation.")).toBeVisible();
  await expect(
    preview.getByRole("heading", { name: "Mobile journal", exact: true }),
  ).toHaveCount(0);
  const changed = JSON.parse(await json.inputValue()) as StudioDocument;
  expect(changed.content.at(-1)).toMatchObject({
    id: section.id,
    content: [{ content: "A mobile observation." }],
  });
  const draft = JSON.stringify({
    ...changed,
    metadata: { ...changed.metadata, title: "Applied on mobile" },
  });
  await json.fill(draft);
  await open.click();
  await expect(page.getByLabel("Page title", { exact: true })).toBeDisabled();
  await close.click();
  expect(await json.inputValue()).toBe(draft);
  await page
    .getByRole("button", { name: "Validate JSON", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("JSON is valid");
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(
    preview.getByRole("heading", { name: "Applied on mobile", exact: true }),
  ).toBeVisible();
  await json.fill("{ invalid");
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("JSON syntax error");
  await page.getByRole("button", { name: "Reset layout", exact: true }).click();
  expect(await json.inputValue()).toBe("{ invalid");
  await page
    .getByRole("button", { name: "Reset example", exact: true })
    .click();
  expect(await json.inputValue()).toBe(original);
  await open.click();
  await page
    .getByLabel("Heading text", { exact: true })
    .fill("Preserved across breakpoints");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('.compose-dialog[data-state="open"]')).toHaveCount(
    0,
  );
  await expect(page.getByLabel("Heading text", { exact: true })).toHaveValue(
    "Preserved across breakpoints",
  );
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe("hidden");
  await setWorkspaceLayout(page, "side");
  await page.setViewportSize({ width: 650, height: 844 });
  await expect(open).toBeVisible();
  await expect(page.locator(".output-split")).toHaveClass(/axis-y/);
  await expect(
    page.getByRole("separator", {
      name: "Resize Inspect and Preview",
      exact: true,
    }),
  ).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(open).toHaveAttribute("aria-expanded", "false");
  await studio.screenshot({
    path: test.info().outputPath("mobile-output.png"),
  });
  await open.click();
  await expect(page.getByLabel("Heading text", { exact: true })).toHaveValue(
    "Preserved across breakpoints",
  );
  await modal.screenshot({
    path: test.info().outputPath("mobile-compose-modal.png"),
  });
});

test("studio background spans the viewport and minimum height stays within short screens", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.locator("#playground");
  const bg = await section.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(bg).not.toBe("none");
  const studio = page.locator(".playground");
  expect((await studio.boundingBox())!.height).toBeGreaterThanOrEqual(
    Math.min(740, page.viewportSize()!.height),
  );
  await expect(studio).toHaveCSS("border-top-width", "0px");
  await page.setViewportSize({ width: 390, height: 600 });
  await studio.scrollIntoViewIfNeeded();
  const box = (await studio.boundingBox())!;
  expect(box.height).toBeLessThanOrEqual(600);
  expect(box.height).toBeGreaterThanOrEqual(599);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
