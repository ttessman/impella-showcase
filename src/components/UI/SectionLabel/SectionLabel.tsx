export type SectionDefinition = {
  id: string;
  number: string;
  label: string;
  title: string;
  intro?: string;
};

/** One editorial label treatment for section headings and reading navigation. */
export function SectionLabel({
  definition,
  as: Element = "span",
}: {
  definition: Pick<SectionDefinition, "number" | "label">;
  as?: "p" | "span";
}) {
  return (
    <Element className="eyebrow">
      <span>{definition.number}</span> / {definition.label}
    </Element>
  );
}
