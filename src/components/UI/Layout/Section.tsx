import type { ReactNode } from "react";
import { SectionLabel } from "../SectionLabel/SectionLabel";
export function Section({
  "data-bundle-name": bundleName,
  id,
  variant,
  headingId,
  previewTitle,
  label,
  slots,
  headerAttributes,
  footerAttributes,
}: {
  "data-bundle-name"?: string;
  id?: string;
  variant?: "preview" | "paper" | "full-bleed";
  headingId?: string;
  previewTitle?: string;
  label?: { number: string; label: string };
  headerAttributes?: { "data-bundle-name"?: string };
  footerAttributes?: { "data-bundle-name"?: string };
  slots: { header?: ReactNode; content: ReactNode; footer?: ReactNode };
}) {
  if (variant === "preview")
    return (
      <section data-bundle-name={bundleName} className="preview-section">
        {previewTitle && <h3>{previewTitle}</h3>}
        {slots.content}
      </section>
    );
  return (
    <section
      data-bundle-name={bundleName}
      id={id}
      className={`case-section${variant === "full-bleed" ? " demo-section" : variant === "paper" ? " section-paper" : ""}`}
      aria-labelledby={headingId}
    >
      <div {...headerAttributes} className="section-heading">
        {label && <SectionLabel as="p" definition={label} />}
        {slots.header}
      </div>
      {slots.content}
      {footerAttributes ? (
        <footer {...footerAttributes}>{slots.footer}</footer>
      ) : (
        slots.footer
      )}
    </section>
  );
}
