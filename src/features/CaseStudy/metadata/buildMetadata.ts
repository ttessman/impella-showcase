import { siteIdentity } from "../../../content/siteIdentity";
import { caseStudySections } from "../../../content/caseStudy";
import { storeLinks } from "../../../content/evidence";

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

export function buildMetadata(siteUrl?: string) {
  const profile = siteIdentity;
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
      name: "Impella",
      publisher: { "@type": "Organization", name: "Abiomed" },
    },
    citation: [storeLinks.apple, storeLinks.google],
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

export function buildReaderText() {
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
      storeLinks.apple,
      storeLinks.google,
      "Store records describe the broader product and do not prove individual authorship, measured impact or unchanged production code.",
    ].join("\n\n") + "\n"
  );
}
