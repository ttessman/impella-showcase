import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("footer reading summary supports modal reading, printing and download", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const footer = page.locator(".site-footer");
  expect(
    await footer.evaluate((element) =>
      Boolean(
        element
          .querySelector(".footer-summary")!
          .compareDocumentPosition(element.querySelector(".public-evidence")!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ),
  ).toBe(true);
  const navigationCards = page.locator(".navigation-evidence .card-tinted");
  await expect(navigationCards).toHaveCount(2);
  await expect(navigationCards.locator(".card-header")).toHaveCount(0);
  const launch = footer.getByRole("link", { name: "Read case-study summary" });
  await launch.click();
  const dialog = page.getByRole("dialog", {
    name: "Case-study summary",
    exact: true,
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".document-view")).toContainText(
    "Okta employee sign-in frontend",
  );
  await expect(dialog.locator(".document-view")).toContainText(
    "JSON contracts",
  );
  await expect(
    dialog.getByRole("link", { name: "Download plain text" }),
  ).toHaveAttribute("href", "./case-study.txt");
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printRequested = "true";
    };
  });
  await dialog.getByRole("button", { name: "Print / Save as PDF" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-print-requested",
    "true",
  );
  const accessibility = await new AxeBuilder({ page })
    .include(".case-study-reader")
    .analyze();
  expect(accessibility.violations).toEqual([]);
  await dialog.screenshot({ path: info.outputPath("reading-summary.png") });
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#root")).not.toBeVisible();
  await expect(dialog.locator(".document-view")).toBeVisible();
  await expect(dialog.locator(".dialog-header")).not.toBeVisible();
  const pdf = await page.pdf({
    path: info.outputPath("case-study-summary.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
  });
  expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  expect(pdf.length).toBeGreaterThan(5000);
  await page.emulateMedia({ media: "screen" });
  await dialog
    .getByRole("button", { name: "Close case-study summary" })
    .focus();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(launch).toBeFocused();
  expect(errors).toEqual([]);
});
