import type { ReactNode } from "react";
import type { SectionDefinition } from "../../../types/caseStudy";

/** Shared editorial frame; children are the composed section-body slot. */
export function Section({
  definition,
  children,
}: {
  definition: SectionDefinition;
  children: ReactNode;
}) {
  const { id, number, label, title, intro, tone = "" } = definition;
  return (
    <section
      id={id}
      className={`case-section ${tone}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="section-heading">
        <p className="eyebrow">
          <span>{number}</span> / {label}
        </p>
        <h2 id={`${id}-heading`}>{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
