import type { CmsNode, PageDocument, NodeOf } from "../../../types/cms";
import type { SectionDefinition } from "../../../types/caseStudy";

export function children(node: CmsNode): CmsNode[] {
  return Array.isArray(node.content) ? node.content : [];
}
export function walkContent(
  node: CmsNode,
  visit: (node: CmsNode, parent?: CmsNode) => void,
  parent?: CmsNode,
) {
  visit(node, parent);
  children(node).forEach((child) => walkContent(child, visit, node));
}
export function textContent(node: CmsNode): string {
  return typeof node.content === "string"
    ? node.content +
        (node.bundle === "text" && node.metadata.break_after ? "\n" : "")
    : children(node).map(textContent).join("");
}
export function frameParts(node: CmsNode) {
  const items = children(node);
  return {
    header: items.find((item) => item.bundle === "header"),
    footer: items.find((item) => item.bundle === "footer"),
    content: items.filter(
      (item) => item.bundle !== "header" && item.bundle !== "footer",
    ),
  };
}
function ownedNodes(node: CmsNode): CmsNode[] {
  return children(node).flatMap((child) =>
    child.bundle === "section" ? [] : [child, ...ownedNodes(child)],
  );
}
export function sectionDefinition(
  node: NodeOf<"section">,
  number: number,
): SectionDefinition {
  const owned = ownedNodes(node);
  const heading = owned.find(
    (child) => child.bundle === "heading" && child.metadata.level === 2,
  );
  const intro = owned.find(
    (child) =>
      child.bundle === "text_block" &&
      child.metadata.variant === "section-intro",
  );
  return {
    id: node.id,
    number: String(number).padStart(2, "0"),
    label: node.metadata.label,
    title: heading ? textContent(heading) : node.metadata.label,
    intro: intro ? textContent(intro) : undefined,
  };
}
export function indexDocument(page: PageDocument) {
  const nodes = new Map<string, CmsNode>();
  const sections: SectionDefinition[] = [];
  walkContent(page, (node) => {
    nodes.set(node.id, node);
    if (node.bundle === "section" && node.metadata.navigation)
      sections.push(sectionDefinition(node, sections.length + 1));
  });
  return { page, nodes, sections };
}
export type DocumentIndex = ReturnType<typeof indexDocument>;
