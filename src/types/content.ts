export type HeaderBlock = {
  id: string;
  bundle: "header";
  header: string;
  level: 2 | 3;
};
export type TextBlock = { id: string; bundle: "text_block"; text_body: string };
export type MediaBlock = {
  id: string;
  bundle: "media";
  media: { bundle: "demo_image"; url: string; alt: string };
  media_caption: string;
};
export type SectionBlock = {
  id: string;
  bundle: "demo_section";
  header: string;
  children: ContentBlock[];
};
export type ReferencesBlock = {
  id: string;
  bundle: "references_accordion";
  references_accordion_title: string;
  references_container: { references: string[] };
};
export type ContentBlock =
  HeaderBlock | TextBlock | MediaBlock | SectionBlock | ReferencesBlock;
export type Bundle = ContentBlock["bundle"];
export type ContentPage = {
  title: string;
  primary_content_value: ContentBlock[];
};
