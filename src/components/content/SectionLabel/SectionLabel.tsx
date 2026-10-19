import type { SectionDefinition } from "../../../types/caseStudy";

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
