export type SectionDefinition = {
  id: string;
  number: string;
  label: string;
  title: string;
  intro?: string;
};

export type PageNavigation = {
  overview: { label: string; target_id: string };
  primary_action?: { label: string; target_id: string };
  sections_label: string;
};
