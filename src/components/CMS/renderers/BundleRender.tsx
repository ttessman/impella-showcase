import type { ComponentType } from "react";
import type { BundleName, CmsNode, NodeOf } from "../../../types/cms";
import { Page } from "../bundles/Page/Page";
import { Group } from "../bundles/Group/Group";
import { Grid } from "../bundles/Grid/Grid";
import { Section } from "../bundles/Section/Section";
import { Card } from "../bundles/Card/Card";
import { Header } from "../bundles/Header/Header";
import { Footer } from "../bundles/Footer/Footer";
import { ReadingHeader } from "../bundles/ReadingHeader/ReadingHeader";
import { Hero } from "../bundles/Hero/Hero";
import { Heading } from "../bundles/Heading/Heading";
import { Text } from "../bundles/Text/Text";
import { TextBlock } from "../bundles/TextBlock/TextBlock";
import { Media } from "../bundles/Media/Media";
import { Figure } from "../bundles/Figure/Figure";
import { List } from "../bundles/List/List";
import { ListItem } from "../bundles/ListItem/ListItem";
import { Action } from "../bundles/Action/Action";
import { Disclosure } from "../bundles/Disclosure/Disclosure";
import { Code } from "../bundles/Code/Code";
import { SourceReference } from "../bundles/SourceReference/SourceReference";
import { Checklist } from "../bundles/Checklist/Checklist";
import { ReferencesAccordion } from "../bundles/ReferencesAccordion/ReferencesAccordion";
import { ContentStudio } from "../bundles/ContentStudio/ContentStudio";
import { ChecklistGroup } from "../bundles/ChecklistGroup/ChecklistGroup";
import { ChecklistQuestion } from "../bundles/ChecklistQuestion/ChecklistQuestion";
import { ChecklistOption } from "../bundles/ChecklistOption/ChecklistOption";
import { ChecklistRule } from "../bundles/ChecklistRule/ChecklistRule";
import { ChecklistOutcome } from "../bundles/ChecklistOutcome/ChecklistOutcome";

type Registry = { [B in BundleName]: ComponentType<{ node: NodeOf<B> }> };
const bundleRegistry: Registry = {
  page: Page,
  group: Group,
  grid: Grid,
  section: Section,
  card: Card,
  header: Header,
  footer: Footer,
  reading_header: ReadingHeader,
  hero: Hero,
  heading: Heading,
  text: Text,
  text_block: TextBlock,
  media: Media,
  figure: Figure,
  list: List,
  list_item: ListItem,
  action: Action,
  disclosure: Disclosure,
  code: Code,
  source_reference: SourceReference,
  checklist: Checklist,
  references_accordion: ReferencesAccordion,
  content_studio: ContentStudio,
  checklist_group: ChecklistGroup,
  checklist_question: ChecklistQuestion,
  checklist_option: ChecklistOption,
  checklist_rule: ChecklistRule,
  checklist_outcome: ChecklistOutcome,
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
