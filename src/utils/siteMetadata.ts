import { pageIndex } from "../components/UI/CaseStudy/CaseStudy";
import { documentText, publicLinks } from "./document";
import type { DocumentIndex } from "../components/CMS/renderers/DocumentRender";

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );

export function resolveSiteUrl(value?: string) {
  if (!value) return undefined;
  const url = new URL(value);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw Error(
      "SITE_URL must be an absolute HTTP(S) deployment URL without credentials, query or fragment.",
    );
  if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html"))
    url.pathname += "/";
  return url.href;
}

export function buildMetadata(
  siteUrl?: string,
  index: DocumentIndex = pageIndex,
) {
  const profile = index.page.metadata.identity;
  const work = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: profile.title,
    description: profile.description,
    author: { "@type": "Person", name: profile.author },
    inLanguage: "en",
    genre: "Frontend engineering portfolio case study",
    abstract: `${profile.role} ${profile.team} ${profile.boundaries} ${profile.reconstruction}`,
    about: {
      "@type": "SoftwareApplication",
      name: index.page.metadata.subject?.name ?? index.page.metadata.title,
      ...(index.page.metadata.subject?.publisher
        ? {
            publisher: {
              "@type": "Organization",
              name: index.page.metadata.subject.publisher,
            },
          }
        : {}),
    },
    citation: publicLinks(index),
    ...(siteUrl ? { url: siteUrl } : {}),
  };
  return [
    `<title>${escapeHtml(profile.title)}</title>`,
    `<meta name="description" content="${escapeHtml(profile.description)}">`,
    `<meta name="author" content="${escapeHtml(profile.author)}">`,
    '<meta name="robots" content="index,follow">',
    `<meta property="og:title" content="${escapeHtml(profile.title)}">`,
    `<meta property="og:description" content="${escapeHtml(profile.description)}">`,
    '<meta property="og:type" content="article">',
    '<meta name="twitter:card" content="summary">',
    `<meta name="twitter:title" content="${escapeHtml(profile.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(profile.description)}">`,
    '<meta name="theme-color" content="#12395d">',
    '<link rel="alternate" type="text/plain" href="./case-study.txt" title="Plain-text case study">',
    ...(siteUrl
      ? [
          `<link rel="canonical" href="${escapeHtml(siteUrl)}">`,
          `<meta property="og:url" content="${escapeHtml(siteUrl)}">`,
        ]
      : []),
    // Escape less-than signs so serialized data cannot terminate its script element.
    `<script type="application/ld+json">${JSON.stringify(work).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
}

export function buildReaderText(index: DocumentIndex = pageIndex) {
  const siteIdentity = index.page.metadata.identity;
  const caseStudySections = index.sections;
  return (
    [
      `# ${siteIdentity.title}`,
      `Author: ${siteIdentity.author}`,
      "## Original project contribution",
      siteIdentity.role,
      siteIdentity.team,
      siteIdentity.boundaries,
      "## Portfolio reconstruction boundary",
      siteIdentity.reconstruction,
      "## Case-study outline",
      ...caseStudySections.map(
        (section) =>
          `${section.number} / ${section.label}\n${section.title}\n${"intro" in section ? section.intro : ""}`,
      ),
      "## Public product evidence",
      ...publicLinks(index),
      "Store records describe the broader product and do not prove individual authorship, measured impact or unchanged production code.",
      "## Full narrative",
      documentText(index),
    ].join("\n\n") + "\n"
  );
}

export function buildAgentIndex(index: DocumentIndex = pageIndex) {
  const profile = index.page.metadata.identity;
  return `# ${profile.title}

Author: ${profile.author}

${profile.description}

- [Case study](./): narrative, architecture and evidence.
- [Plain-text case study](./case-study.txt): contribution, boundaries and full narrative.

${profile.reconstruction}
`;
}
