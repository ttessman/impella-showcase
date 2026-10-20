import type { DocumentIndex } from "./document";
import { textContent, walkContent } from "./document";
export function buildReaderDocument(index: DocumentIndex) {
  const identity = index.page.metadata.identity;
  return {
    title: index.page.metadata.title,
    subtitle: `Case-study summary · ${identity.author}`,
    sections: [
      {
        heading: "My contribution",
        paragraphs: [identity.role, identity.team],
      },
      ...index.sections.map((section) => ({
        heading: `${section.number} / ${section.label}`,
        paragraphs: [section.title, ...(section.intro ? [section.intro] : [])],
      })),
      {
        heading: "Ownership and evidence",
        paragraphs: [identity.boundaries, identity.reconstruction],
      },
    ],
  };
}
/** Full authored narrative; private code illustrations and inactive outcomes are omitted. */
export function documentText(index: DocumentIndex) {
  const lines: string[] = [];
  function visit(node: Parameters<typeof textContent>[0]) {
    if (
      ["code", "source_reference", "checklist", "reading_header"].includes(
        node.bundle,
      )
    )
      return;
    if (node.bundle === "heading" || node.bundle === "text_block") {
      lines.push(textContent(node));
      return;
    }
    if (Array.isArray(node.content)) node.content.forEach(visit);
  }
  visit(index.page);
  return lines.join("\n\n");
}
export function publicLinks(index: DocumentIndex) {
  const links = new Set<string>();
  walkContent(index.page, (node) => {
    if (node.bundle === "action" && /^https?:/.test(node.metadata.href))
      links.add(node.metadata.href);
  });
  return [...links];
}
