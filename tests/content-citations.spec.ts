import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openCompose, closeCompose } from "./helpers/studio";
import type { StudioDocument, StudioSectionBundle } from "../src/utils/studio";

test("inline citations insert at the cursor, survive JSON edits and render safely in nested content", async ({
  page,
}) => {
  await page.goto("/");
  const preview = page.getByRole("article", { name: "Mobile content preview" });
  await expect(preview.locator("sup")).toHaveText("Reference 1");
  await openCompose(page);
  await page
    .getByRole("button", { name: /Edit Paragraph: Choose an ordinary object/ })
    .click();
  const field = page.getByLabel("Paragraph text", { exact: true });
  await field.fill("First observation. Second observation.");
  await field.evaluate((el: HTMLTextAreaElement) =>
    el.setSelectionRange(18, 18),
  );
  await page.getByLabel("Reference numbers", { exact: true }).fill("1, 2");
  await page
    .getByRole("button", { name: "Insert citation", exact: true })
    .click();
  await expect(field).toHaveValue(
    "First observation.<sup>1,2</sup> Second observation.",
  );
  await expect(field).toBeFocused();
  await page.getByLabel("Reference numbers", { exact: true }).fill("0,nope");
  await page
    .getByRole("button", { name: "Insert citation", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "positive reference numbers",
  );
  await expect(field).toHaveValue(
    "First observation.<sup>1,2</sup> Second observation.",
  );
  await page
    .getByRole("button", {
      name: "Edit References: Reading notes",
      exact: true,
    })
    .click();
  await page
    .getByLabel("References (one per line)")
    .fill(
      "Fictional field journal, volume one.\nFictional sketchbook, volume two.",
    );
  await closeCompose(page);
  await expect(preview.locator("sup")).toHaveText("References 1,2");
  await expect(preview.locator("details li")).toHaveCount(2);
  const json = page.getByLabel("Editable page JSON");
  const content = JSON.parse(await json.inputValue()) as StudioDocument;
  const section = content.content.find(
    (block) => block.id === "chapter",
  ) as StudioSectionBundle;
  const paragraph = section.content[0];
  if (paragraph.bundle !== "text_block")
    throw Error("Expected nested paragraph");
  expect(paragraph.content).toContain("<sup>1,2</sup>");
  paragraph.content =
    'JSON edit<sup>2</sup> <img src=x onerror="alert(1)"> <sup>nope</sup><sup>1</sup>';
  await json.fill(JSON.stringify(content, null, 2));
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(preview.locator("sup")).toHaveText([
    "Reference 2",
    "Reference 1",
  ]);
  await expect(preview.getByText(/<img src=x onerror/)).toBeAttached();
  await expect(preview.locator('img[src="x"]')).toHaveCount(0);
  const a11y = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(a11y.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Reset example", exact: true })
    .click();
  await expect(preview.locator("sup")).toHaveText("Reference 1");
});

test("rich text works without format flags and keeps HTML and unsafe URLs inert", async ({
  page,
}) => {
  await page.goto("/");
  await openCompose(page);
  await page
    .getByRole("button", { name: /Edit Paragraph: A fictional journal/ })
    .click();
  await page
    .getByLabel("Paragraph text", { exact: true })
    .fill(
      "A **bold** idea, an *unexpected* detail, and [field notes](https://example.com/notes).<sup>1</sup>\n\nAnother paragraph.\n\n- Look closely\n- Make something\n\n<img src=x onerror=alert(1)>\n\n[Unsafe](javascript:alert%281%29)",
    );
  await closeCompose(page);
  const preview = page.getByRole("article", { name: "Mobile content preview" });
  await expect(preview.locator("strong")).toHaveText("bold");
  await expect(preview.locator("em")).toHaveText("unexpected");
  await expect(
    preview.getByRole("link", { name: "field notes" }),
  ).toHaveAttribute("href", "https://example.com/notes");
  await expect(
    preview.getByText("Another paragraph.", { exact: true }),
  ).toBeVisible();
  await expect(preview.locator("ul li")).toHaveText([
    "Look closely",
    "Make something",
  ]);
  await expect(preview.getByText(/<img src=x onerror/)).toBeAttached();
  await expect(
    preview.locator('img[src="x"], [onerror], a[href^="javascript:"]'),
  ).toHaveCount(0);
  await expect(preview.locator("sup").first()).toHaveText("Reference 1");
  const doc = JSON.parse(
    await page.getByLabel("Editable page JSON").inputValue(),
  );
  expect(
    doc.content.find((node: { id: string }) => node.id === "opening").metadata
      .format,
  ).toBeUndefined();
});
