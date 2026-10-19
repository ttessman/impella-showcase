export type InlineContent = string | { code: string };
export type TextContent = string | readonly InlineContent[];
export type SectionDefinition = {
  id: string;
  number: string;
  label: string;
  title: string;
  intro?: string;
  tone?: string;
};
