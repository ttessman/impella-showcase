import { test, expect } from "@playwright/test";
import type { ContentPage } from "../src/types/content";
import { relocateBlock } from "../src/features/ContentStudio/model/contentTree";
import { defaultPage } from "../src/content/studioExample";
import { parsePage } from "../src/features/ContentStudio/model/parseContentPage";
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
