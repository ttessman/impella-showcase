import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openCompose, closeCompose } from "./helpers/studio";
import type {
  StudioDocument,
  StudioSectionBundle,
} from "../src/features/ContentStudio/model/studioDocument";

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
  const section = content.primary_content_value.find(
    (block) => block.id === "chapter",
  ) as StudioSectionBundle;
  const paragraph = section.children[0];
  if (paragraph.bundle !== "text_block")
    throw Error("Expected nested paragraph");
  expect(paragraph.text_body).toContain("<sup>1,2</sup>");
  paragraph.text_body =
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
