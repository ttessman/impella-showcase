import type { ReactNode } from "react";
import { SectionLabel } from "../SectionLabel/SectionLabel";
export function Section({
  id,
  variant,
  headingId,
  previewTitle,
  label,
  slots,
}: {
  id?: string;
  variant?: "preview" | "paper" | "full-bleed";
  headingId?: string;
  previewTitle?: string;
  label?: { number: string; label: string };
  slots: { header?: ReactNode; content: ReactNode; footer?: ReactNode };
}) {
  if (variant === "preview")
    return (
      <section className="preview-section">
        {previewTitle && <h3>{previewTitle}</h3>}
        {slots.content}
      </section>
    );
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
