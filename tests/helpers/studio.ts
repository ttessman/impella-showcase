import type { Page } from "@playwright/test";

export async function openCompose(page: Page) {
  const open = page.getByRole("button", { name: "Open Compose", exact: true });
  if (await open.isVisible()) await open.click();
}

export async function closeCompose(page: Page) {
  const close = page.getByRole("button", {
    name: "Close Compose",
    exact: true,
  });
  if (await close.isVisible()) await close.click();
}

export async function setWorkspaceLayout(
  page: Page,
  layout: "side" | "stacked",
) {
  const button = page.locator(".workspace-output-header button");
  if (!(await button.isEnabled())) return;
  if ((await button.getAttribute("data-layout")) !== layout)
    await button.click();
}
