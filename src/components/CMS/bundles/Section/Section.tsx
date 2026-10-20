import type { ReactNode } from "react";
import { SectionLabel } from "../../../content/SectionLabel/SectionLabel";
export function Section({
  id,
  variant,
  headingId,
  label,
  slots,
}: {
  id?: string;
  variant?: "preview" | "paper" | "full-bleed";
  headingId?: string;
  label?: { number: string; label: string };
  slots: { header?: ReactNode; content: ReactNode; footer?: ReactNode };
}) {
  if (variant === "preview")
    return <section className="preview-section">{slots.content}</section>;
  return (
    <section
      id={id}
      className={`case-section${variant === "full-bleed" ? " demo-section" : variant === "paper" ? " section-paper" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="section-heading">
        {label && <SectionLabel as="p" definition={label} />}
        {slots.header}
      </div>
      {slots.content}
      {slots.footer}
    </section>
  );
}
