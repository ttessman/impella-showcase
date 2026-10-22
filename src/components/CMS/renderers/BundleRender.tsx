import type { ComponentType } from "react";
import type { BundleName, CmsNode, NodeOf } from "./ContentViewRender";
import { PageBundle } from "../bundles/LayoutBundle/PageBundle";
import { GroupBundle } from "../bundles/LayoutBundle/GroupBundle";
import { GridBundle } from "../bundles/LayoutBundle/GridBundle";
import { SectionBundle } from "../bundles/LayoutBundle/SectionBundle";
import { CardBundle } from "../bundles/CardBundle/CardBundle";
import { HeaderBundle } from "../bundles/HeaderBundle/HeaderBundle";
import { FooterBundle } from "../bundles/FooterBundle/FooterBundle";
import { ReadingHeaderBundle } from "../bundles/HeaderBundle/variants/ReadingHeaderBundle";
import { HeroBundle } from "../bundles/HeroBundle/HeroBundle";
import { HeadingBundle } from "../bundles/HeadingBundle/HeadingBundle";
import { TextBundle } from "../bundles/TextBundle/TextBundle";
import { TextBlockBundle } from "../bundles/TextBundle/variants/TextBlockBundle";
import { MediaBundle } from "../bundles/MediaBundle/MediaBundle";
import { FigureBundle } from "../bundles/FigureBundle/FigureBundle";
import { ListBundle } from "../bundles/ListBundle/ListBundle";
import { ListItemBundle } from "../bundles/ListBundle/ListItemBundle";
import { ButtonBundle } from "../bundles/ButtonBundle/ButtonBundle";
import { AccordionBundle } from "../bundles/AccordionBundle/AccordionBundle";
import { CodeBundle } from "../bundles/CodeBundle/CodeBundle";
import { SourceReferenceBundle } from "../bundles/PopoverBundle/variants/SourceReferenceBundle";
import { ChecklistBundle } from "../bundles/ChecklistBundle/ChecklistBundle";
import { ReferencesAccordionBundle } from "../bundles/AccordionBundle/variants/ReferencesAccordionBundle";
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
  button: ButtonBundle,
  accordion: AccordionBundle,
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
