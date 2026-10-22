import {
  parseDocument,
  indexDocument,
  walkContent,
  buildReaderDocument,
} from "../../src/utils/document";
import type {
  BundleName,
  NodeOf,
  CmsNode,
} from "../../src/components/CMS/renderers/ContentViewRender";
import data from "../../src/content/impella.json";
import { defaultPage } from "../../src/hooks/useContentEditor";
import { checklistDefinition } from "../../src/components/CMS/bundles/ChecklistBundle/checklistDefinition";
const authored = parseDocument(structuredClone(data));
const main = authored.content.find(
  (node) => node.bundle === "group" && node.metadata.element === "main",
);
// Add the studio-only references bundle to the valid host document for adapter stories.
if (main && Array.isArray(main.content))
  main.content.push(
    defaultPage().content.find(
      (node) => node.bundle === "references_accordion",
    )!,
  );
export const document = parseDocument(authored);
export const documentIndex = indexDocument(document);
export const studioPage = defaultPage();
export function nodeOf<B extends BundleName>(bundle: B): NodeOf<B> {
  let found: CmsNode | undefined;
  walkContent(document, (node) => {
    if (!found && node.bundle === bundle) found = node;
  });
  if (!found) throw Error(`Missing story fixture for ${bundle}`);
  return structuredClone(found) as NodeOf<B>;
}
export const image = {
  src: "./assets/demo/field-notes.svg",
  alt: "Fictional field journal mountains",
  width: 800,
  height: 480,
};
export const checklist = checklistDefinition(nodeOf("checklist"));
export const reader = buildReaderDocument(documentIndex);
export const sections = [
  {
    id: "overview",
    number: "01",
    label: "Overview",
    title: "An authored experience",
  },
  {
    id: "composition",
    number: "02",
    label: "Composition",
    title: "Content, composed",
  },
  {
    id: "delivery",
    number: "03",
    label: "Delivery",
    title: "A reusable foundation",
  },
];
export const source = {
  title: "An independent source illustration",
  summary: "A small fictional example for component documentation.",
  disclaimer:
    "Independently written demonstration, not original production source.",
  files: [
    {
      path: "example/compose.ts",
      context: "Maps ordered fictional content.",
      example: "const titles = blocks.map(block => block.title);",
    },
    {
      path: "example/content.json",
      context: "Authored demo content.",
      example: '{ "title": "Field notes" }',
    },
  ],
};
