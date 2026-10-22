import { test, expect } from "@playwright/test";
import { readdir } from "node:fs/promises";

type Entry = { id: string; type: string; title: string; importPath: string };

test("every UI and CMS story renders from the packaged route", async ({
  page,
  request,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "All stories smoke-tested once; responsive interactions run below.",
  );
  test.setTimeout(180_000);
  const response = await request.get("/storybook/index.json");
  expect(response.ok()).toBe(true);
  const { entries } = (await response.json()) as {
    entries: Record<string, Entry>;
  };
  const stories = Object.values(entries).filter(
    (entry) => entry.type === "story",
  );
  const components = (await readdir("stories", { recursive: true })).filter(
    (path) => path.endsWith(".stories.tsx"),
  );
  expect(new Set(stories.map((entry) => entry.importPath)).size).toBe(
    components.length,
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const story of stories) {
    await page.goto(`/storybook/iframe.html?id=${story.id}&viewMode=story`);
    await expect(page.locator("[data-story-canvas]")).toBeVisible({
      timeout: 10_000,
    });
    expect(errors, story.id).toEqual([]);
    await expect(page.locator(".sb-errordisplay")).not.toBeVisible();
    const broken = await page
      .locator("[data-story-canvas] img")
      .evaluateAll((images) =>
        images
          .filter(
            (image) =>
              (image as HTMLImageElement).complete &&
              !(image as HTMLImageElement).naturalWidth,
          )
          .map((image) => image.getAttribute("src")),
      );
    expect(broken, story.id).toEqual([]);
  }
});

test("library navigation, dialog and editable CMS JSON work", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("link", {
    name: "Explore Storybook",
    exact: true,
  });
  await expect(link).toHaveAttribute("href", "./storybook/");
  await expect(
    page
      .locator(".site-footer .footer-actions")
      .getByRole("link", { name: "Explore Storybook", exact: true }),
  ).toBeVisible();
  await link.click();
  await expect(page).toHaveURL(/\/storybook\//);
  const menu = page.getByRole("button", {
    name: "Open navigation menu",
    exact: true,
  });
  // The mobile manager loads with its story tree behind a navigation toggle.
  if ((page.viewportSize()?.width ?? 1440) < 600) await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Stories", exact: true }),
  ).toBeVisible();
  await page.goto(
    "/storybook/iframe.html?id=ui-dialog--default&viewMode=story",
  );
  await page.getByRole("button", { name: "Open dialog", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Close dialog", exact: true }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.goto(
    "/storybook/iframe.html?id=cms-bundles-heading--default&viewMode=story",
  );
  await page.getByText("Edit example JSON", { exact: true }).click();
  const field = page.getByLabel("CMS node JSON", { exact: true });
  const node = JSON.parse(await field.inputValue());
  node.content = "A freshly authored heading";
  await field.fill(JSON.stringify(node));
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "A freshly authored heading",
      exact: true,
    }),
  ).toBeVisible();
  await field.fill('{"id":');
  await page.getByRole("button", { name: "Apply JSON", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "A freshly authored heading",
      exact: true,
    }),
  ).toBeVisible();
});

test("component previews honor the library dark theme", async ({ page }) => {
  await page.goto(
    "/storybook/iframe.html?id=ui-card--default&viewMode=story&globals=theme:dark",
  );
  await expect(page.locator("[data-story-canvas]")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".card")).toBeVisible();
});

test("Button variants retain native button and navigation semantics", async ({
  page,
}) => {
  await page.goto(
    "/storybook/iframe.html?id=ui-button--navigation&viewMode=story",
  );
  const navigation = page.getByRole("link", {
    name: "Explore the journal",
    exact: true,
  });
  await expect(navigation).toHaveAttribute("href", "#overview");
  await expect(navigation).toHaveClass(/button-primary/);
  await expect(navigation).not.toHaveAttribute("type");
  await page.goto(
    "/storybook/iframe.html?id=ui-button--external-navigation&viewMode=story",
  );
  const external = page.getByRole("link", {
    name: "Visit example site",
    exact: true,
  });
  await expect(external).toHaveAttribute("target", "_blank");
  await expect(external).toHaveAttribute("rel", "noreferrer");
  await expect(external).toHaveClass(/button-text/);
  await page.goto(
    "/storybook/iframe.html?id=ui-button--disabled&viewMode=story",
  );
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeDisabled();
});

test("component parts and variants are nested under their owning families", async ({
  request,
}) => {
  const response = await request.get("/storybook/index.json");
  const { entries } = (await response.json()) as {
    entries: Record<string, Entry>;
  };
  const titles = new Set(Object.values(entries).map((entry) => entry.title));
  for (const title of [
    "UI/Button",
    "UI/Button/IconButton",
    "UI/Dialog",
    "UI/Dialog/ImageDialog",
    "UI/Dialog/ImageDialog/Trigger",
    "UI/List",
    "UI/List/ListItem",
    "UI/Accordion",
    "UI/Accordion/ReferencesAccordion",
    "UI/Header/ReadingHeader",
    "UI/Header/ReadingHeader/Frame",
    "UI/Input/Select",
    "UI/Input/TextInput",
    "UI/Input/TextArea",
    "UI/Popover/PreviewPopover",
    "UI/Popover/PreviewPopover/SourceReference",
    "UI/Popover/Dropdown",
    "UI/Popover/Dropdown/ActionDropdown",
    "UI/Popover/Dropdown/SectionDropdown",
    "CMS/Bundles/Button",
    "CMS/Bundles/Layout/Page",
    "CMS/Bundles/Layout/Group",
    "CMS/Bundles/Layout/Grid",
    "CMS/Bundles/Layout/Section",
    "CMS/Bundles/Layout/Section/Fields",
    "CMS/Bundles/Popover/PreviewPopover/SourceReference",
    "CMS/Bundles/List/ListItem",
    "CMS/Bundles/Accordion/ReferencesAccordion",
    "CMS/Bundles/Heading/Fields",
    "CMS/Bundles/Text/BlockText",
    "CMS/Bundles/Text/BlockText/Fields",
  ])
    expect(titles.has(title), title).toBe(true);
  for (const title of [
    "UI/ListItem",
    "UI/Disclosure",
    "UI/Select",
    "UI/Dropdown",
    "UI/PreviewPopover",
    "UI/ReferencesAccordion",
    "CMS/Bundles/Disclosure",
    "CMS/Bundles/Action",
  ])
    expect(titles.has(title), title).toBe(false);
});

test("shared text fields remain editable and preserve native disabled states", async ({
  page,
}) => {
  await page.goto(
    "/storybook/iframe.html?id=ui-input-textinput--default&viewMode=story",
  );
  const title = page.getByRole("textbox", {
    name: "Journal title",
    exact: true,
  });
  await title.fill("A new journal title");
  await expect(title).toHaveValue("A new journal title");
  await page.goto(
    "/storybook/iframe.html?id=ui-input-textarea--default&viewMode=story",
  );
  const notes = page.getByRole("textbox", {
    name: "Journal notes",
    exact: true,
  });
  await notes.fill("One observation.\nAnother detail.");
  await expect(notes).toHaveValue("One observation.\nAnother detail.");
  await page.goto(
    "/storybook/iframe.html?id=ui-input-textinput--disabled&viewMode=story",
  );
  await expect(
    page.getByRole("textbox", { name: "Journal title", exact: true }),
  ).toBeDisabled();
});

test("CMS Button uses the same appearance and size variants as UI Button", async ({
  page,
}) => {
  await page.goto(
    "/storybook/iframe.html?id=cms-bundles-button--secondary&viewMode=story",
  );
  const button = page.locator('a[data-bundle-name="button"]');
  await expect(button).toHaveClass(/button-secondary/);
  await expect(button).toHaveAttribute("href", /#.+/);
  await page.goto(
    "/storybook/iframe.html?id=cms-bundles-button--small&viewMode=story",
  );
  await expect(button).toHaveClass(/button-size-small/);
  await page.goto(
    "/storybook/iframe.html?id=cms-bundles-button--text&viewMode=story",
  );
  await expect(button).toHaveClass(/button-text/);
});
