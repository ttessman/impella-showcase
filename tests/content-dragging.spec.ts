import { test, expect } from "@playwright/test";
import type { ContentPage } from "../src/types/content";
import { openCompose, closeCompose } from "./helpers/studio";

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
  // Keep the row away from modal scroll edges so edge auto-scroll does not
  // invalidate the coordinates used to compare its two insertion halves.
  await target.evaluate((el) =>
    el.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  let bounds = (await target.boundingBox())!;
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
  bounds = (await target.boundingBox())!;
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
  // Wait for layout/scroll stability before measuring pointer coordinates.
  await grip.scrollIntoViewIfNeeded();
  const from = (await grip.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2 + 10);
  const target = page.getByRole("list", {
    name: "Blocks in Empty chapter",
    exact: true,
  });
  await target.evaluate((el) =>
    el.scrollIntoView({ block: "center", behavior: "instant" }),
  );
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
