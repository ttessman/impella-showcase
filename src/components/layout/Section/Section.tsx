import type { ReactNode } from "react";
import { SectionLabel } from "../../content/SectionLabel/SectionLabel";
import type { SectionDefinition } from "../../../types/caseStudy";

/** Shared editorial frame; children are the composed section-body slot. */
export function Section({
  definition,
  children,
}: {
  definition: SectionDefinition;
  children: ReactNode;
}) {
  const { id, title, intro, tone = "" } = definition;
  return (
    <section
      id={id}
      className={`case-section ${tone}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="section-heading">
        <SectionLabel as="p" definition={definition} />
        <h2 id={`${id}-heading`}>{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
