import { test, expect } from "@playwright/test";
import type { StudioDocument } from "../src/utils/studio";
import { relocateBlock } from "../src/utils/studio";
import { defaultPage } from "../src/hooks/useContentEditor";
import { parsePage } from "../src/utils/studio";
import { openCompose, closeCompose } from "./helpers/studio";

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
  const initial = JSON.parse(await json.inputValue()) as StudioDocument;
  expect(initial).toEqual(defaultPage());
  await expect(
    preview.getByRole("heading", { name: initial.metadata.title }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add Heading", exact: true }).click();
  await page
    .getByLabel("Heading text", { exact: true })
    .fill("A new perspective");
  await expect(
    preview.getByRole("heading", { name: "A new perspective" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add Section", exact: true }).click();
  await page.getByLabel("Section title", { exact: true }).fill("Sketchbook");
  const data = JSON.parse(await json.inputValue()) as StudioDocument;
  const section = data.content.find(
    (b) => b.bundle === "section" && b.metadata.label === "Sketchbook",
  )!;
  await page
    .getByLabel("Add blocks to", { exact: true })
    .selectOption(section.id);
  await page
    .getByRole("button", { name: "Add Paragraph", exact: true })
    .click();
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
  const updated = JSON.parse(await json.inputValue()) as StudioDocument;
  const last = updated.content.at(-1)!;
  expect(last.bundle).toBe("section");
  if (last.bundle === "section")
    expect(last.content[0]).toMatchObject({
      bundle: "text_block",
      content: "Observe the color of the afternoon sky.",
    });
  const draft = {
    ...updated,
    metadata: { ...updated.metadata, title: "Applied from JSON" },
  };
  await json.fill(JSON.stringify(draft));
  await expect(page.getByLabel("Page title", { exact: true })).toBeDisabled();
  await expect(
    preview.getByRole("heading", { name: initial.metadata.title }),
  ).toBeVisible();
  await page.getByRole("button", { name: "JSON actions", exact: true }).click();
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
      ...updated,
      content: [
        { id: "x", bundle: "heading", metadata: { level: 2 }, content: 42 },
      ],
    }),
  );
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "content[0].content: expected text",
  );
  await page
    .getByRole("button", { name: "Reset example", exact: false })
    .click();
  expect(JSON.parse(await json.inputValue())).toEqual(initial);
  await expect(
    preview.getByRole("heading", { name: initial.metadata.title }),
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
  await page.getByRole("button", { name: "Add Section", exact: true }).click();
  await page.getByLabel("Section title", { exact: true }).fill("Nested study");
  const json = page.getByLabel("Editable page JSON");
  const data = JSON.parse(await json.inputValue()) as StudioDocument;
  const parent = data.content.find((b) => b.id === "chapter");
  expect(parent?.bundle).toBe("section");
  if (parent?.bundle !== "section") throw Error("Expected section");
  const nested = parent.content.find((b) => b.bundle === "section")!;
  await page
    .getByLabel("Add blocks to", { exact: true })
    .selectOption(nested.id);
  await page.getByRole("button", { name: "Add Image", exact: true }).click();
  await page
    .getByLabel("Image asset", { exact: true })
    .selectOption("/assets/demo/studio-notes.svg");
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
  await page
    .getByRole("button", { name: "Add References", exact: true })
    .click();
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

test("strict validation rejects dangerous or ambiguous content", () => {
  const raw = (node: unknown) =>
    JSON.stringify({
      id: "test-page",
      bundle: "page",
      metadata: { schema_version: 1, title: "Test" },
      content: [node],
    });
  const text = { id: "a", bundle: "text_block", metadata: {}, content: "Text" };
  const invalid: [unknown, RegExp][] = [
    [{ ...text, bundle: "unknown" }, /unsupported bundle/],
    [{ ...text, bundle: ["text_block"] }, /unsupported bundle/],
    [{ ...text, content: [] }, /expected text/],
    [
      {
        id: "a",
        bundle: "section",
        metadata: { label: "Group", variant: "preview", navigation: false },
        content: null,
      },
      /expected an array/,
    ],
    [
      { ...text, bundle: "heading", metadata: { level: 8 } },
      /unsupported value|choose 2 or 3/,
    ],
    [{ ...text, children: [] }, /unsupported property/],
    [{ ...text, metadata: { schema_version: 1 } }, /unknown property/],
    [
      {
        id: "a",
        bundle: "media",
        metadata: {
          src: "javascript:alert(1)",
          alt: "x",
          title: "x",
          width: 800,
          height: 480,
          variant: "inline",
        },
        content: [],
      },
      /bundled demo image/,
    ],
    [
      {
        id: "a",
        bundle: "references_accordion",
        metadata: { label: "Sources" },
        content: [{ ...text, id: "b", content: 123 }],
      },
      /expected text/,
    ],
  ];
  for (const [node, match] of invalid)
    expect(() => parsePage(raw(node))).toThrow(match);
  const duplicate = defaultPage();
  duplicate.content.push(duplicate.content[0]);
  expect(() => parsePage(JSON.stringify(duplicate))).toThrow(/duplicate ID/);
  expect(() => parsePage("x".repeat(100_001))).toThrow(/maximum size/);
  const nested = (depth: number): unknown => ({
    id: `s${depth}`,
    bundle: "section",
    metadata: { label: "Section", variant: "preview", navigation: false },
    content: depth > 0 ? [nested(depth - 1)] : [],
  });
  expect(() => parsePage(raw(nested(6)))).toThrow(/at most 5/);
  const tooMany = {
    ...defaultPage(),
    content: Array.from({ length: 101 }, (_, i) => ({ ...text, id: `b${i}` })),
  };
  expect(() => parsePage(JSON.stringify(tooMany))).toThrow(/maximum 100/);
  expect(
    parsePage(raw({ ...text, content: "<script>alert(1)</script>" }))
      .content[0],
  ).toMatchObject({ content: "<script>alert(1)</script>" });
  expect(() =>
    parsePage(
      JSON.stringify({ title: "Old schema", primary_content_value: [] }),
    ),
  ).toThrow(/unsupported property/);
  const versioned = {
    ...defaultPage(),
    metadata: { schema_version: 2, title: "Unknown version" },
  };
  expect(() => parsePage(JSON.stringify(versioned))).toThrow(/schema_version/);
  const colliding = defaultPage();
  colliding.content[0].id = colliding.id;
  expect(() => parsePage(JSON.stringify(colliding))).toThrow(/duplicate ID/);
});

test("subtree moves reject cycles and invalid destinations without dropping content", () => {
  const blocks = defaultPage().content;
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
    content: [{ id: "intro" }, { id: "prompt" }],
  });
  const subtree = {
    ...blocks[3],
    content: [
      {
        id: "inner",
        bundle: "section" as const,
        metadata: {
          label: "Inside",
          variant: "preview" as const,
          navigation: false,
        },
        content: [],
      },
    ],
  };
  const tree = [subtree] as StudioDocument["content"];
  expect(
    relocateBlock(tree, "chapter", { parentId: "inner", beforeId: null }),
  ).toBe(tree);
});

test("JSON action menu validates visibly and reverts without moving its toolbar", async ({
  page,
}) => {
  await page.goto("/");
  const json = page.getByRole("textbox", { name: "Editable page JSON" });
  const initial = await json.inputValue();
  const trigger = page.getByRole("button", {
    name: "JSON actions",
    exact: true,
  });
  await json.fill("{broken");
  await trigger.click();
  await page
    .getByRole("button", { name: "Validate JSON", exact: true })
    .click();
  await expect(json).toHaveAttribute("aria-invalid", "true");
  await expect(page.locator(".json-pane > .editor-feedback")).not.toBeEmpty();
  expect(await json.inputValue()).toBe("{broken");
  await trigger.click();
  const before = await trigger.boundingBox();
  await page.getByRole("button", { name: "Revert JSON", exact: true }).click();
  await expect(json).toHaveValue(initial);
  await expect(json).not.toHaveAttribute("aria-invalid");
  await expect(trigger).toBeFocused();
  const after = await trigger.boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
  await trigger.click();
  await expect(
    page.getByRole("button", { name: "Revert JSON", exact: true }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.keyboard.press("Home");
  await page.keyboard.press("Enter");
  await expect(page.locator(".json-pane > .editor-feedback")).toContainText(
    "JSON is valid",
  );
});

test("JSON editor grows with content and wrapping instead of scrolling internally", async ({
  page,
}) => {
  await page.goto("/");
  const json = page.getByRole("textbox", { name: "Editable page JSON" });
  const initial = await json.inputValue();
  const firstHeight = await json.evaluate((el) => el.clientHeight);
  await json.fill(initial + "\n".repeat(120) + " ".repeat(1500));
  await expect
    .poll(() => json.evaluate((el) => el.clientHeight))
    .toBeGreaterThan(firstHeight);
  for (const width of [390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect
      .poll(() => json.evaluate((el) => el.scrollHeight - el.clientHeight))
      .toBeLessThanOrEqual(1);
    await expect
      .poll(() => json.evaluate((el) => el.scrollWidth - el.clientWidth))
      .toBeLessThanOrEqual(1);
    await expect(json).toHaveCSS("overflow-y", "hidden");
  }
});

test("validation bar stays below Inspect actions and reports syntax locations with state colors", async ({
  page,
}) => {
  await page.goto("/");
  const json = page.getByRole("textbox", { name: "Editable page JSON" });
  const initial = await json.inputValue();
  const header = page.locator(".json-pane-header");
  const bar = page.locator(".json-pane > .editor-feedback");
  const studioHeight = (await page.locator(".playground").boundingBox())!
    .height;
  const initialHeader = (await header.boundingBox())!;
  const initialBar = (await bar.boundingBox())!;
  expect(initialBar.y).toBeCloseTo(initialHeader.y + initialHeader.height, 1);
  await expect(bar).toHaveAttribute("data-tone", "neutral");
  await json.fill('{\n  "id": "demo",\n  "bundle": ?\n}');
  await page.getByRole("button", { name: "JSON actions", exact: true }).click();
  await page
    .getByRole("button", { name: "Validate JSON", exact: true })
    .click();
  await expect(bar).toHaveAttribute("data-tone", "error");
  await expect(bar.getByRole("alert")).toContainText("line 3, column 13");
  await expect(json).toHaveCSS("border-color", "rgb(184, 107, 99)");
  await json.fill(initial);
  await expect(bar).toHaveAttribute("data-tone", "neutral");
  await expect(json).toHaveCSS("border-color", "rgb(16, 46, 75)");
  await page.getByRole("button", { name: "JSON actions", exact: true }).click();
  await page
    .getByRole("button", { name: "Validate JSON", exact: true })
    .click();
  await expect(bar).toHaveAttribute("data-tone", "success");
  await expect(bar.getByRole("status")).toContainText("JSON is valid");
  await page.getByRole("button", { name: "JSON actions", exact: true }).click();
  await page.getByRole("button", { name: "Revert JSON", exact: true }).click();
  await expect(bar).toHaveAttribute("data-tone", "neutral");
  await expect(bar.getByRole("status")).toBeEmpty();
  await expect(page.locator(".studio-footer")).toBeEmpty();
  expect((await bar.boundingBox())!.height).toBe(initialBar.height);
  expect((await header.boundingBox())!.height).toBe(initialHeader.height);
  expect((await page.locator(".playground").boundingBox())!.height).toBe(
    studioHeight,
  );
});
