import type { ComponentType } from "react";
import type { BundleName, CmsNode, NodeOf } from "./ContentViewRender";
import { PageBundle } from "../bundles/PageBundle/PageBundle";
import { GroupBundle } from "../bundles/GroupBundle/GroupBundle";
import { GridBundle } from "../bundles/GridBundle/GridBundle";
import { SectionBundle } from "../bundles/SectionBundle/SectionBundle";
import { CardBundle } from "../bundles/CardBundle/CardBundle";
import { HeaderBundle } from "../bundles/HeaderBundle/HeaderBundle";
import { FooterBundle } from "../bundles/FooterBundle/FooterBundle";
import { ReadingHeaderBundle } from "../bundles/ReadingHeaderBundle/ReadingHeaderBundle";
import { HeroBundle } from "../bundles/HeroBundle/HeroBundle";
import { HeadingBundle } from "../bundles/HeadingBundle/HeadingBundle";
import { TextBundle } from "../bundles/TextBundle/TextBundle";
import { TextBlockBundle } from "../bundles/TextBlockBundle/TextBlockBundle";
import { MediaBundle } from "../bundles/MediaBundle/MediaBundle";
import { FigureBundle } from "../bundles/FigureBundle/FigureBundle";
import { ListBundle } from "../bundles/ListBundle/ListBundle";
import { ListItemBundle } from "../bundles/ListItemBundle/ListItemBundle";
import { ActionBundle } from "../bundles/ActionBundle/ActionBundle";
import { DisclosureBundle } from "../bundles/DisclosureBundle/DisclosureBundle";
import { CodeBundle } from "../bundles/CodeBundle/CodeBundle";
import { SourceReferenceBundle } from "../bundles/SourceReferenceBundle/SourceReferenceBundle";
import { ChecklistBundle } from "../bundles/ChecklistBundle/ChecklistBundle";
import { ReferencesAccordionBundle } from "../bundles/ReferencesAccordionBundle/ReferencesAccordionBundle";
import { ContentStudioBundle } from "../bundles/ContentStudioBundle/ContentStudioBundle";

type DataBundle =
  | "checklist_group"
  | "checklist_question"
  | "checklist_option"
  | "checklist_rule"
  | "checklist_outcome";
type ViewBundle = Exclude<BundleName, DataBundle>;
const dataBundles: ReadonlySet<BundleName> = new Set([
  "checklist_group",
  "checklist_question",
  "checklist_option",
  "checklist_rule",
  "checklist_outcome",
]);
type Registry = { [B in ViewBundle]: ComponentType<{ node: NodeOf<B> }> };
const bundleRegistry: Registry = {
  page: PageBundle,
  group: GroupBundle,
  grid: GridBundle,
  section: SectionBundle,
  card: CardBundle,
  header: HeaderBundle,
  footer: FooterBundle,
  reading_header: ReadingHeaderBundle,
  hero: HeroBundle,
  heading: HeadingBundle,
  text: TextBundle,
  text_block: TextBlockBundle,
  media: MediaBundle,
  figure: FigureBundle,
  list: ListBundle,
  list_item: ListItemBundle,
  action: ActionBundle,
  disclosure: DisclosureBundle,
  code: CodeBundle,
  source_reference: SourceReferenceBundle,
  checklist: ChecklistBundle,
  references_accordion: ReferencesAccordionBundle,
  content_studio: ContentStudioBundle,
};
/** Registered components share one recursive envelope; external JSON is validated before dispatch. */
export function BundleRender({ block }: { block: CmsNode }) {
  // The registry is checked per bundle above; this erases only the lookup's union correlation.
  if (dataBundles.has(block.bundle)) return null;
  const Component = bundleRegistry[
    block.bundle as ViewBundle
  ] as ComponentType<{
    node: CmsNode;
  }>;
  return Component ? (
    <Component node={block} />
  ) : (
    <p role="status">This block is not supported by this renderer.</p>
  );
}
