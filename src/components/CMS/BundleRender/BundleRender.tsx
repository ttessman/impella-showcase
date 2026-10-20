import type { ComponentType } from "react";
import type { BundleName, CmsNode, NodeOf } from "../../../types/cms";
import { ContentView } from "../ContentView/ContentView";
import {
  Page,
  Group,
  Section,
  Card,
  Hero,
  ReadingNavigation,
  Footer,
} from "../adapters/Layout";
import {
  Text,
  Heading,
  TextBlock,
  Figure,
  List,
  Action,
  Disclosure,
  Code,
  References,
} from "../adapters/Content";
import { Media } from "../adapters/Media";
import { Source } from "../adapters/Source";
import { Checklist } from "../adapters/Checklist";
import { StudioIsland } from "../../../features/ContentStudio/components/StudioIsland/StudioIsland";

type Registry = { [B in BundleName]: ComponentType<{ node: NodeOf<B> }> };
const Nested = ({ node }: { node: CmsNode }) => (
  <ContentView blocks={Array.isArray(node.content) ? node.content : []} />
);
// Checklist structure is consumed by its owner; it is not independently mounted UI.
const OwnedData = () => null;
const bundleRegistry: Registry = {
  page: Page,
  group: Group,
  grid: Group,
  section: Section,
  card: Card,
  header: Nested,
  footer: Footer,
  reading_header: ReadingNavigation,
  hero: Hero,
  heading: Heading,
  text: Text,
  text_block: TextBlock,
  media: Media,
  figure: Figure,
  list: List,
  list_item: Nested,
  action: Action,
  disclosure: Disclosure,
  code: Code,
  source_reference: Source,
  checklist: Checklist,
  references_accordion: References,
  content_studio: ({ node }) => (
    <StudioIsland fallback={<ContentView blocks={node.content} />} />
  ),
  checklist_group: OwnedData,
  checklist_question: OwnedData,
  checklist_option: OwnedData,
  checklist_rule: OwnedData,
  checklist_outcome: OwnedData,
};
/** Registered components share one recursive envelope; external JSON is validated before dispatch. */
export function BundleRender({ block }: { block: CmsNode }) {
  // The registry is checked per bundle above; this erases only the lookup's union correlation.
  const Component = bundleRegistry[block.bundle] as ComponentType<{
    node: CmsNode;
  }>;
  return Component ? (
    <Component node={block} />
  ) : (
    <p role="status">This block is not supported by this renderer.</p>
  );
}
