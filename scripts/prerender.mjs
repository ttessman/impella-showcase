import { readFile, writeFile } from "node:fs/promises";
import { URL, fileURLToPath } from "node:url";
import { env } from "node:process";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = new URL("../dist/", import.meta.url);
const server = await createServer({
  root,
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
  logLevel: "error",
});
try {
  const {
    renderPage,
    buildMetadata,
    buildReaderText,
    buildAgentIndex,
    resolveSiteUrl,
  } = await server.ssrLoadModule("/src/entry-server.ts");
  const siteUrl = resolveSiteUrl(env.SITE_URL);
  const index = new URL("index.html", output);
  const template = await readFile(index, "utf8");
  if (
    !template.includes('<div id="root"></div>') ||
    !template.includes("<!-- portfolio:metadata -->")
  )
    throw Error("Prerender template markers are missing.");
  const html = template
    .replace(
      /<!-- portfolio:metadata -->[\s\S]*?<!-- \/portfolio:metadata -->/,
      buildMetadata(siteUrl),
    )
    .replace(
      '<div id="root"></div>',
      () => `<div id="root">${renderPage()}</div>`,
    );
  await writeFile(index, html);
  await writeFile(new URL("case-study.txt", output), buildReaderText());
  await writeFile(new URL("llms.txt", output), buildAgentIndex());
  const sitemapUrl = siteUrl ? new URL("sitemap.xml", siteUrl).href : undefined;
  await writeFile(
    new URL("robots.txt", output),
    `User-agent: *\nAllow: /\n${sitemapUrl ? `Sitemap: ${sitemapUrl}\n` : ""}`,
  );
  if (siteUrl) {
    const escaped = siteUrl.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    await writeFile(
      new URL("sitemap.xml", output),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escaped}</loc></url></urlset>\n`,
    );
  }
} finally {
  await server.close();
}
