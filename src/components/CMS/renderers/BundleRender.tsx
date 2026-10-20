import type { ComponentType } from "react";
import type { BundleName, CmsNode, NodeOf } from "../../../types/cms";
import { PageBundle } from "../bundles/Page/PageBundle";
import { GroupBundle } from "../bundles/Group/GroupBundle";
import { GridBundle } from "../bundles/Grid/GridBundle";
import { SectionBundle } from "../bundles/Section/SectionBundle";
import { CardBundle } from "../bundles/Card/CardBundle";
import { HeaderBundle } from "../bundles/Header/HeaderBundle";
import { FooterBundle } from "../bundles/Footer/FooterBundle";
import { ReadingHeaderBundle } from "../bundles/ReadingHeader/ReadingHeaderBundle";
import { HeroBundle } from "../bundles/Hero/HeroBundle";
import { HeadingBundle } from "../bundles/Heading/HeadingBundle";
import { TextBundle } from "../bundles/Text/TextBundle";
import { TextBlockBundle } from "../bundles/TextBlock/TextBlockBundle";
import { MediaBundle } from "../bundles/Media/MediaBundle";
import { FigureBundle } from "../bundles/Figure/FigureBundle";
import { ListBundle } from "../bundles/List/ListBundle";
import { ListItemBundle } from "../bundles/ListItem/ListItemBundle";
import { ActionBundle } from "../bundles/Action/ActionBundle";
import { DisclosureBundle } from "../bundles/Disclosure/DisclosureBundle";
import { CodeBundle } from "../bundles/Code/CodeBundle";
import { SourceReferenceBundle } from "../bundles/SourceReference/SourceReferenceBundle";
import { ChecklistBundle } from "../bundles/Checklist/ChecklistBundle";
import { ReferencesAccordionBundle } from "../bundles/ReferencesAccordion/ReferencesAccordionBundle";
import { ContentStudioBundle } from "../bundles/ContentStudio/ContentStudioBundle";

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
