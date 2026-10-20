/** Compatibility types for bounded studio drafts; normalized before ContentView. */
export type StudioHeadingBundle = {
  id: string;
  bundle: "header";
  header: string;
  level: 2 | 3;
};
export type StudioTextBundle = {
  id: string;
  bundle: "text_block";
  text_body: string;
};
export type StudioMediaBundle = {
  id: string;
  bundle: "media";
  media: { bundle: "demo_image"; url: string; alt: string };
  media_caption: string;
};
export type StudioSectionBundle = {
  id: string;
  bundle: "demo_section";
  header: string;
  children: StudioBundle[];
};
export type StudioReferencesBundle = {
  id: string;
  bundle: "references_accordion";
  references_accordion_title: string;
  references_container: { references: string[] };
};
export type StudioBundle =
  | StudioHeadingBundle
  | StudioTextBundle
  | StudioMediaBundle
  | StudioSectionBundle
  | StudioReferencesBundle;
export type StudioBundleName = StudioBundle["bundle"];
export type StudioDocument = {
  title: string;
  primary_content_value: StudioBundle[];
};
