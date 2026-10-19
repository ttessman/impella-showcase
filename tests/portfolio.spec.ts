import type { Page } from "@playwright/test";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { ContentPage } from "../src/builder/model";
import { relocateBlock } from "../src/builder/tree";
import { defaultPage, parsePage } from "../src/builder/model";

async function openCompose(page: Page) {
  const open = page.getByRole("button", { name: "Open Compose", exact: true });
  if (await open.isVisible()) await open.click();
}
async function closeCompose(page: Page) {
  const close = page.getByRole("button", {
    name: "Close Compose",
    exact: true,
  });
  if (await close.isVisible()) await close.click();
}

async function setWorkspaceLayout(page: Page, layout: "side" | "stacked") {
  const button = page.locator(".workspace-output-header button");
  if (!(await button.isEnabled())) return;
  if ((await button.getAttribute("data-layout")) !== layout)
    await button.click();
}

test("complete visual → JSON → preview workflow", async ({ page }) => {
  test.skip(
    (page.viewportSize()?.width ?? 0) <= 650,
    "Mobile workflow is covered by the Compose modal scenario.",
  );
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  const json = page.getByRole("textbox", { name: "Editable page JSON" });
  const preview = page.getByRole("article", { name: "Mobile content preview" });
  const initial = JSON.parse(await json.inputValue()) as ContentPage;
  expect(initial).toEqual(defaultPage());
  await expect(
    preview.getByRole("heading", { name: initial.title }),
  ).toBeVisible();
  await page.getByRole("button", { name: "+ Heading", exact: true }).click();
  await page
    .getByLabel("Heading text", { exact: true })
    .fill("A new perspective");
  await expect(
    preview.getByRole("heading", { name: "A new perspective" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "+ Section", exact: true }).click();
  await page.getByLabel("Section title", { exact: true }).fill("Sketchbook");
  const data = JSON.parse(await json.inputValue()) as ContentPage;
  const section = data.primary_content_value.find(
    (b) => b.bundle === "demo_section" && b.header === "Sketchbook",
  )!;
  await page
    .getByLabel("Add blocks to", { exact: true })
    .selectOption(section.id);
  await page.getByRole("button", { name: "+ Paragraph", exact: true }).click();
  await page
    .getByLabel("Paragraph text", { exact: true })
    .fill("Observe the color of the afternoon sky.");
  await expect(
    preview.getByText("Observe the color of the afternoon sky."),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Move Section Sketchbook up", exact: true })
    .click();
  await page
    .getByRole("button", {
      name: "Remove Heading A new perspective",
      exact: true,
    })
    .click();
  await expect(
    preview.getByRole("heading", { name: "A new perspective" }),
  ).toHaveCount(0);
  const updated = JSON.parse(await json.inputValue()) as ContentPage;
  const last = updated.primary_content_value.at(-1)!;
  expect(last.bundle).toBe("demo_section");
  if (last.bundle === "demo_section")
    expect(last.children[0]).toMatchObject({
      bundle: "text_block",
      text_body: "Observe the color of the afternoon sky.",
    });
  const draft = { ...updated, title: "Applied from JSON" };
  await json.fill(JSON.stringify(draft));
  await expect(page.getByLabel("Page title", { exact: true })).toBeDisabled();
  await expect(
    preview.getByRole("heading", { name: initial.title }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Validate JSON", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("JSON is valid");
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(page.getByLabel("Page title", { exact: true })).toHaveValue(
    "Applied from JSON",
  );
  await expect(
    preview.getByRole("heading", { name: "Applied from JSON" }),
  ).toBeVisible();
  await json.fill("{ invalid");
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("JSON syntax error");
  await expect(
    preview.getByRole("heading", { name: "Applied from JSON" }),
  ).toBeVisible();
  await json.fill(
    JSON.stringify({
      title: "Bad",
      primary_content_value: [
        { id: "x", bundle: "header", header: 42, level: 2 },
      ],
    }),
  );
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "primary_content_value[0].header: expected text",
  );
  await page
    .getByRole("button", { name: "Reset example", exact: false })
    .click();
  expect(JSON.parse(await json.inputValue())).toEqual(initial);
  await expect(
    preview.getByRole("heading", { name: initial.title }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("image editing, nested sections, references and safe removal", async ({
  page,
}) => {
  await page.goto("/");
  await openCompose(page);
  await page
    .getByRole("button", {
      name: "Edit Section: Take a closer look",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "+ Section", exact: true }).click();
  await page.getByLabel("Section title", { exact: true }).fill("Nested study");
  const json = page.getByLabel("Editable page JSON");
  const data = JSON.parse(await json.inputValue()) as ContentPage;
  const parent = data.primary_content_value.find((b) => b.id === "chapter");
  expect(parent?.bundle).toBe("demo_section");
  if (parent?.bundle !== "demo_section") throw Error("Expected section");
  const nested = parent.children.find((b) => b.bundle === "demo_section")!;
  await page
    .getByLabel("Add blocks to", { exact: true })
    .selectOption(nested.id);
  await page.getByRole("button", { name: "+ Image", exact: true }).click();
  await page
    .getByLabel("Image asset", { exact: true })
    .selectOption("assets/demo/studio-notes.svg");
  await page
    .getByLabel("Alternative text", { exact: true })
    .fill("A fictional studio notebook");
  await page
    .getByLabel("Image caption", { exact: true })
    .fill("Notebook study");
  await closeCompose(page);
  const preview = page.getByRole("article", { name: "Mobile content preview" });
  await expect(
    preview.getByRole("img", { name: "A fictional studio notebook" }),
  ).toHaveAttribute("src", /studio-notes.svg/);
  await openCompose(page);
  await page.getByRole("button", { name: "+ References", exact: true }).click();
  await page
    .getByLabel("References (one per line)", { exact: true })
    .fill("Fictional notebook one\nFictional notebook two");
  await closeCompose(page);
  await expect(preview.getByText("Fictional notebook two")).toBeAttached();
  await openCompose(page);
  await page
    .getByRole("button", {
      name: "Remove Section Take a closer look",
      exact: true,
    })
    .click();
  await expect(page.getByLabel("Add blocks to", { exact: true })).toHaveValue(
    "root",
  );
  await expect(
    page.getByText("Select a block to edit its properties."),
  ).toBeVisible();
  expect(await json.inputValue()).not.toContain("Nested study");
});

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
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: `test-results/${info.project.name}-page.png`,
    fullPage: true,
  });
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
});

test("strict validation rejects dangerous or ambiguous content", () => {
  const raw = (node: unknown) =>
    JSON.stringify({ title: "Test", primary_content_value: [node] });
  const invalid: [unknown, RegExp][] = [
    [{ id: "a", bundle: "unknown" }, /unsupported bundle/],
    [{ id: "a", bundle: "text_block", text_body: [] }, /expected text/],
    [{ id: "a", bundle: "demo_section", header: "Group" }, /expected an array/],
    [{ id: "a", bundle: "header", header: "Hello", level: 8 }, /choose 2 or 3/],
    [
      { id: "a", bundle: "text_block", text_body: "Hi", children: [] },
      /unsupported property/,
    ],
    [
      {
        id: "a",
        bundle: "media",
        media: { bundle: "demo_image", url: "javascript:alert(1)", alt: "x" },
        media_caption: "",
      },
      /bundled demo image/,
    ],
    [
      {
        id: "a",
        bundle: "references_accordion",
        references_accordion_title: "Sources",
        references_container: { references: [123] },
      },
      /expected text/,
    ],
  ];
  for (const [node, match] of invalid)
    expect(() => parsePage(raw(node))).toThrow(match);
  const duplicate = defaultPage();
  duplicate.primary_content_value.push(duplicate.primary_content_value[0]);
  expect(() => parsePage(JSON.stringify(duplicate))).toThrow(/duplicate ID/);
  expect(() => parsePage("x".repeat(100_001))).toThrow(/maximum size/);
  const nested = (depth: number): unknown => ({
    id: `s${depth}`,
    bundle: "demo_section",
    header: "Section",
    children: depth > 0 ? [nested(depth - 1)] : [],
  });
  expect(() => parsePage(raw(nested(6)))).toThrow(/at most 5/);
  const tooMany = {
    title: "Long",
    primary_content_value: Array.from({ length: 101 }, (_, i) => ({
      id: `b${i}`,
      bundle: "text_block",
      text_body: "Text",
    })),
  };
  expect(() => parsePage(JSON.stringify(tooMany))).toThrow(/maximum 100/);
  expect(
    parsePage(
      raw({
        id: "text",
        bundle: "text_block",
        text_body: "<script>alert(1)</script>",
      }),
    ).primary_content_value[0],
  ).toMatchObject({ text_body: "<script>alert(1)</script>" });
});

test("drag sections across containers, preserve IDs, and sync preview", async ({
  page,
}) => {
  await page.goto("/");
  await openCompose(page);
  const json = page.getByLabel("Editable page JSON");
  const read = async () => JSON.parse(await json.inputValue()) as ContentPage;
  const start = await read();
  const grip = page.getByRole("button", {
    name: "Drag Section Take a closer look",
    exact: true,
  });
  await grip.evaluate((el) =>
    el.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "instant",
    }),
  );
  const from = (await grip.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    from.x + from.width / 2,
    from.y + from.height / 2 + 10,
    { steps: 3 },
  );
  const top = page.locator('[data-drag-row][data-block-id="intro"]');
  await top.scrollIntoViewIfNeeded();
  const to = (await top.boundingBox())!;
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 4, {
    steps: 10,
  });
  await page.mouse.up();
  const moved = await read();
  await closeCompose(page);
  expect(moved.primary_content_value[0]).toEqual(
    start.primary_content_value.find((b) => b.id === "chapter"),
  );
  await expect(
    page
      .getByRole("article", { name: "Mobile content preview" })
      .locator(":scope > section"),
  ).toHaveCount(1);
  await expect(page.getByRole("status")).toContainText("Block moved");

  await openCompose(page);
  // Keyboard uses the same drop targets to move a root block inside the section.
  const headingGrip = page.getByRole("button", {
    name: "Drag Heading Small observations. New ideas.",
    exact: true,
  });
  await headingGrip.focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator(".drop-active")).toHaveAttribute(
    "data-parent-id",
    "chapter",
  );
  await page.keyboard.press("Enter");
  const nested = (await read()).primary_content_value[0];
  expect(nested.bundle).toBe("demo_section");
  if (nested.bundle === "demo_section")
    expect(nested.children.map((b) => b.id)).toEqual(["intro", "prompt"]);
  await expect(headingGrip).toBeFocused();

  await headingGrip.press("Space");
  await page.keyboard.press("End");
  await page.keyboard.press("Enter");
  expect((await read()).primary_content_value.at(-1)?.id).toBe("intro");
  await headingGrip.press("Space");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(page.locator(".drop-active")).toHaveCount(0);
  expect((await read()).primary_content_value.at(-1)?.id).toBe("intro");

  await grip.focus();
  await page.keyboard.press("Space");
  await expect(
    page.locator('[data-parent-id="chapter"][data-drop-disabled="true"]'),
  ).toHaveCount(2);
  await page.keyboard.press("Escape");
  await closeCompose(page);
  await json.fill("{invalid");
  await openCompose(page);
  await expect(grip).toBeDisabled();
});

test("touch grip moves a section", async ({ page, context }, info) => {
  test.skip(
    info.project.name !== "mobile",
    "Touch interaction runs in the mobile project.",
  );
  await page.goto("/");
  await openCompose(page);
  const grip = page.getByRole("button", {
    name: "Drag Section Take a closer look",
    exact: true,
  });
  await grip.evaluate((el) =>
    el.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "instant",
    }),
  );
  const box = (await grip.boundingBox())!;
  const cdp = await context.newCDPSession(page);
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [point],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ ...point, y: point.y + 12 }],
  });
  const target = page.locator('[data-drag-row][data-block-id="intro"]');
  await target.scrollIntoViewIfNeeded();
  const to = (await target.boundingBox())!;
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: to.x + to.width / 2, y: to.y + to.height / 4 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await closeCompose(page);
  await expect(page.getByRole("status")).toContainText("Block moved");
  const data = JSON.parse(
    await page.getByLabel("Editable page JSON").inputValue(),
  ) as ContentPage;
  expect(data.primary_content_value[0].id).toBe("chapter");
  await cdp.detach();
});

test("subtree moves reject cycles and invalid destinations without dropping content", () => {
  const blocks = defaultPage().primary_content_value;
  expect(
    relocateBlock(blocks, "chapter", { parentId: "chapter", beforeId: null }),
  ).toBe(blocks);
  expect(
    relocateBlock(blocks, "chapter", { parentId: "missing", beforeId: null }),
  ).toBe(blocks);
  expect(
    relocateBlock(blocks, "intro", { parentId: null, beforeId: "missing" }),
  ).toBe(blocks);
  const nested = relocateBlock(blocks, "intro", {
    parentId: "chapter",
    beforeId: "prompt",
  });
  expect(nested.find((b) => b.id === "intro")).toBeUndefined();
  expect(blocks[0].id).toBe("intro");
  expect(nested.find((b) => b.id === "chapter")).toMatchObject({
    children: [{ id: "intro" }, { id: "prompt" }],
  });
  const subtree = {
    ...blocks[3],
    children: [
      {
        id: "inner",
        bundle: "demo_section" as const,
        header: "Inside",
        children: [],
      },
    ],
  };
  const tree = [subtree] as ContentPage["primary_content_value"];
  expect(
    relocateBlock(tree, "chapter", { parentId: "inner", beforeId: null }),
  ).toBe(tree);
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

test("selected properties stay with the block and row halves show one insertion line without shifting layout", async ({
  page,
}) => {
  await page.goto("/");
  await openCompose(page);
  await page
    .getByRole("button", {
      name: "Edit Heading: Small observations. New ideas.",
      exact: true,
    })
    .click();
  const panel = page.getByRole("region", { name: "Block properties" });
  await expect(panel).toHaveAttribute("id", "properties-intro");
  await expect(panel.getByLabel("Heading text", { exact: true })).toBeVisible();
  expect(
    await panel.evaluate((el) =>
      el.previousElementSibling?.getAttribute("data-block-id"),
    ),
  ).toBe("intro");
  await page
    .getByRole("button", {
      name: "Edit Paragraph: A fictional journal about making time to look closely. Collect a color, sketch a shape, and write down one unexpected detail.",
      exact: true,
    })
    .click();
  await expect(panel).toHaveAttribute("id", "properties-opening");
  await expect(
    panel.getByLabel("Paragraph text", { exact: true }),
  ).toBeVisible();

  const grip = page.getByRole("button", {
    name: "Drag Section Take a closer look",
    exact: true,
  });
  await grip.evaluate((el) =>
    el.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "instant",
    }),
  );
  const beforeHeight = await page
    .getByRole("list", { name: "Page blocks", exact: true })
    .evaluate((el) => el.getBoundingClientRect().height);
  const box = (await grip.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 10);
  expect(
    await page
      .getByRole("list", { name: "Page blocks", exact: true })
      .evaluate((el) => el.getBoundingClientRect().height),
  ).toBe(beforeHeight);
  const target = page.locator('[data-drag-row][data-block-id="opening"]');
  await target.scrollIntoViewIfNeeded();
  const bounds = (await target.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 4,
  );
  await expect(page.locator(".drop-active")).toHaveCount(1);
  await expect(page.locator(".drop-active")).toHaveAttribute(
    "data-before-id",
    "opening",
  );
  await expect(page.locator(".drop-active")).toHaveText("");
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height * 0.75,
  );
  await expect(page.locator(".drop-active")).toHaveCount(1);
  await expect(page.locator(".drop-active")).toHaveAttribute(
    "data-before-id",
    "landscape",
  );
  await page.mouse.up();
  const json = JSON.parse(
    await page.getByLabel("Editable page JSON").inputValue(),
  ) as ContentPage;
  expect(json.primary_content_value.map((b) => b.id)).toEqual([
    "intro",
    "opening",
    "chapter",
    "landscape",
    "sources",
  ]);
  await expect(panel).toHaveAttribute("id", "properties-chapter");
  await page
    .locator(".author-pane")
    .screenshot({ path: test.info().outputPath("authoring.png") });
});

test("drop a block directly inside an empty section", async ({ page }) => {
  await page.goto("/");
  await openCompose(page);
  await page.getByRole("button", { name: "+ Section", exact: true }).click();
  await page.getByLabel("Section title", { exact: true }).fill("Empty chapter");
  const json = page.getByLabel("Editable page JSON");
  const initial = JSON.parse(await json.inputValue()) as ContentPage;
  const section = initial.primary_content_value.at(-1)!;
  const grip = page.getByRole("button", {
    name: "Drag Heading Small observations. New ideas.",
    exact: true,
  });
  await grip.evaluate((el) =>
    el.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "instant",
    }),
  );
  const from = (await grip.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2 + 10);
  const target = page.getByRole("list", {
    name: "Blocks in Empty chapter",
    exact: true,
  });
  await target.scrollIntoViewIfNeeded();
  const bounds = (await target.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await expect(page.locator(".drop-active")).toHaveAttribute(
    "data-parent-id",
    section.id,
  );
  await page.mouse.up();
  const updated = JSON.parse(await json.inputValue()) as ContentPage;
  expect(updated.primary_content_value.some((b) => b.id === "intro")).toBe(
    false,
  );
  expect(updated.primary_content_value.at(-1)).toMatchObject({
    id: section.id,
    children: [{ id: "intro" }],
  });
  await expect(
    page.getByRole("region", { name: "Block properties" }),
  ).toHaveAttribute("id", "properties-intro");
});

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
  const current = JSON.parse(await json.inputValue()) as ContentPage;
  const draft = JSON.stringify({
    ...current,
    title: "Layout changes preserve drafts",
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
  const close = page.getByRole("button", {
    name: "Close Compose",
    exact: true,
  });
  await expect(close).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
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
  const data = JSON.parse(await json.inputValue()) as ContentPage;
  const section = data.primary_content_value.at(-1)!;
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
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  await expect(preview.getByText("A mobile observation.")).toBeVisible();
  await expect(
    preview.getByRole("heading", { name: "Mobile journal", exact: true }),
  ).toHaveCount(0);
  const changed = JSON.parse(await json.inputValue()) as ContentPage;
  expect(changed.primary_content_value.at(-1)).toMatchObject({
    id: section.id,
    children: [{ text_body: "A mobile observation." }],
  });
  const draft = JSON.stringify({ ...changed, title: "Applied on mobile" });
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
  await expect(page.locator("dialog[open]")).toHaveCount(0);
  await expect(page.getByLabel("Heading text", { exact: true })).toHaveValue(
    "Preserved across breakpoints",
  );
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
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
      name: "TYLER TESSMANN Design engineering / Selected work",
    })
    .focus();
  await expect(header).toHaveAttribute("data-hidden", "false");
  await expect
    .poll(async () => (await header.boundingBox())!.y)
    .toBeCloseTo(0, 0);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await scrollTo(0);
  await expect(header).toHaveAttribute("data-floating", "false");
  await expect(header).toHaveAttribute("data-hidden", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(header).toHaveCSS("transition-duration", "0s");
});

test("source previews support hover, keyboard, tap, dismissal and viewport bounds", async ({
  page,
}) => {
  await page.goto("/");
  const triggers = page.locator(".source-reference-trigger");
  await expect(triggers).toHaveCount(3);
  const popup = page.getByRole("dialog", {
    name: "Dedicated calculator behavior",
  });
  const trigger = triggers.nth(2);
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
    page.locator(".source-reference-popup:popover-open"),
  ).toHaveCount(0);
});
