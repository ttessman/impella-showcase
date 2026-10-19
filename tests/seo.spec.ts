import { test, expect } from "@playwright/test";
import {
  buildMetadata,
  resolveSiteUrl,
} from "../src/features/CaseStudy/metadata/buildMetadata";

test("built HTML and plain-text companions explain original ownership before JavaScript runs", async ({
  request,
}) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("My role in the modernization");
  expect(html).toContain("Okta employee sign-in frontend");
  expect(html).toContain("favorites and their local app state");
  expect(html).toContain("Clinical tools within the same mobile experience.");
  expect(html).toContain("Content studio · independent reconstruction");
  expect(html).not.toContain('<div id="root"></div>');
  const structured = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
  );
  expect(structured).not.toBeNull();
  const work = JSON.parse(structured![1]);
  expect(work["@type"]).toBe("CreativeWork");
  expect(work.author.name).toBe("Tyler Tessmann");
  expect(work.about.name).toBe("Impella");
  expect(work.about.publisher.name).toBe("Abiomed");
  expect(work.abstract).toContain("independently written");
  expect(work.abstract).toContain("tenant setup");
  expect(html).toContain('property="og:title"');
  expect(html).not.toMatch(/rel="canonical"/);
  expect(work.url).toBeUndefined();
  for (const path of ["case-study.txt", "llms.txt", "robots.txt"]) {
    const file = await request.get(`/${path}`);
    expect(file.ok()).toBe(true);
    expect(file.headers()["content-type"]).toContain("text/plain");
    const text = await file.text();
    expect(text).not.toContain('<div id="root"');
    if (path === "case-study.txt") {
      expect(text).toContain("Tyler Tessmann");
      expect(text).toContain("Okta");
      expect(text).toContain("favorites");
      expect(text).toContain("Original project contribution");
      expect(text).toContain("Generic recursive sections are a demo extension");
    }
    if (path === "robots.txt") expect(text).not.toContain("Sitemap:");
  }
});

test("case study remains readable without JavaScript", async ({
  browser,
  baseURL,
}, info) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: info.project.use.viewport,
  });
  const page = await context.newPage();
  await page.goto(baseURL!);
  await expect(
    page.getByRole("heading", { name: "My role in the modernization" }),
  ).toBeVisible();
  await expect(page.locator(".case-section")).toHaveCount(11);
  await expect(page.locator("#overview")).toContainText("Bounteous");
  await expect(page.locator(".studio-summary")).toContainText(
    "requires JavaScript",
  );
  await expect(
    page.getByRole("button", { name: "Try a checklist" }),
  ).toBeDisabled();
  await expect(page.locator("#tools")).toContainText("Enable JavaScript");
  await expect(page.locator("footer .public-evidence")).toBeAttached();
  await page.getByRole("link", { name: "Explore the content studio" }).click();
  await expect(page).toHaveURL(/#playground$/);
  await expect(page.locator(".studio-summary")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
  await context.close();
});

test("canonical metadata requires an explicit validated deployment URL", () => {
  expect(resolveSiteUrl()).toBeUndefined();
  expect(resolveSiteUrl("https://portfolio.example/work/impella")).toBe(
    "https://portfolio.example/work/impella/",
  );
  for (const value of [
    "javascript:alert(1)",
    "https://name:secret@portfolio.example/",
    "https://portfolio.example/?tracking=1",
    "https://portfolio.example/#tools",
  ]) {
    expect(() => resolveSiteUrl(value)).toThrow();
  }
  const metadata = buildMetadata(
    resolveSiteUrl("https://portfolio.example/impella/"),
  );
  expect(metadata).toContain(
    'rel="canonical" href="https://portfolio.example/impella/"',
  );
  expect(metadata).toContain('property="og:url"');
});
