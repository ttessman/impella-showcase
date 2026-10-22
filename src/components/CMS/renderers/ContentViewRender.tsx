import type { variants } from "../../../utils/presentation";
import { BundleRender } from "./BundleRender";

export type PageNavigation = {
  overview: { label: string; target_id: string };
  primary_action?: { label: string; target_id: string };
  sections_label: string;
};

type Variant<Family extends keyof typeof variants> =
  keyof (typeof variants)[Family];

/** Authored document contract. The version is declared once, on the page root. */
export type SiteIdentity = {
  title: string;
  description: string;
  author: string;
  role: string;
  team: string;
  boundaries: string;
  reconstruction: string;
};
export type MetadataByBundle = {
  page: {
    schema_version: 1;
    title: string;
    subject?: { name: string; publisher?: string };
    identity: SiteIdentity;
    navigation: PageNavigation;
    skip_label: string;
    component_library?: { enabled: boolean; label: string; href: string };
  };
  group: {
    variant?: Variant<"group">;
    element?: "div" | "main" | "article" | "p" | "figcaption";
  };
  grid: { variant: Variant<"grid"> };
  section: {
    label: string;
    navigation?: boolean;
    variant?: "full-bleed" | "preview" | "paper";
  };
  header: Record<string, never>;
  footer: { variant?: "site" };
  reading_header: Record<string, never>;
  hero: {
    variant: "split" | "background";
    aside_padding?: "default" | "none";
    content_width?: "narrow" | "default" | "wide";
    background?: {
      src: string;
      position?: "center" | "top" | "bottom" | "left" | "right";
    };
    header: { eyebrow?: string; title: string; tags?: string[] };
    content: CmsNode[];
    actions: NodeOf<"button">[];
    aside: CmsNode[];
    footer: CmsNode[];
  };
  card: { variant: "outlined" | "tinted" | "source-summary" };
  heading: { level: 1 | 2 | 3 | 4 | 5 | 6 };
  text: { mark?: "code" | "bold" | "emphasis"; break_after?: boolean };
  text_block: {
    variant?: Variant<"text_block">;
    element?: "p" | "span" | "div" | "strong" | "b" | "small" | "figcaption";
  };
  media: {
    src: string;
    alt: string;
    width: number;
    height: number;
    title: string;
    variant: "hero" | "original" | "linked" | "evidence" | "gallery" | "inline";
    body?: string;
    caption_label?: string;
    trigger_label?: string;
    close_label?: string;
    original_link_label?: string;
    provenance?: "approved-original-documentation";
    dialog?: {
      title?: string;
      close_label?: string;
      size?: "small" | "default" | "large";
    };
  };
  figure: { variant?: Variant<"figure"> };
  list: { variant?: Variant<"list">; ordered?: boolean };
  list_item: Record<string, never>;
  button: {
    href: string;
    variant?: "text" | "primary" | "secondary";
    size?: "small" | "default" | "large";
    new_tab?: boolean;
    action?: "reader" | "image";
    target_id?: string;
  };
  accordion: {
    label: string;
    variant?: "implementation";
    initially_expanded?: boolean;
  };
  code: {
    language: string;
    variant?: "inline";
    path?: string;
    context?: string;
  };
  source_reference: {
    title: string;
    summary: string;
    disclaimer: string;
    initial_file?: string;
  };
  content_studio: Record<string, never>;
  references_accordion: { label: string };
  checklist: {
    presentation: "dialog";
    title: string;
    description: string;
    dialog_heading: string;
    trigger_label: string;
    close_label: string;
    reset_label: string;
    intro_label: string;
    result_label: string;
    empty_result_label: string;
    result_region_label: string;
    caption: string;
    requires_javascript_label: string;
    empty_outcome_id: string;
    fallback_outcome_id: string;
  };
  checklist_group: { label: string };
  checklist_question: { label: string };
  checklist_option: Record<string, never>;
  checklist_rule: {
    operator: "and" | "or";
    selected_ids: string[];
    outcome_id: string;
  };
  checklist_outcome: Record<string, never>;
};
export type BundleName = keyof MetadataByBundle;
type TextBundle = "text" | "reading_header" | "code" | "checklist_option";
type RichBundle = "heading" | "text_block" | "button";
export type ContentByBundle<B extends BundleName> = B extends TextBundle
  ? string
  : B extends "checklist_rule"
    ? null
    : B extends RichBundle
      ? string | CmsNode[]
      : CmsNode[];
export type NodeOf<B extends BundleName> = {
  id: string;
  bundle: B;
  metadata: MetadataByBundle[B];
  content: ContentByBundle<B>;
};
export type CmsNode = { [B in BundleName]: NodeOf<B> }[BundleName];
export type PageDocument = NodeOf<"page">;

/** Render validated authored nodes in their original order. */
export function ContentViewRender({ blocks }: { blocks: readonly CmsNode[] }) {
  return blocks.map((node) => <BundleRender key={node.id} block={node} />);
}
