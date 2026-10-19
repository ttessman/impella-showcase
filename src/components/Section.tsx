import type { ReactNode } from "react";
export function Section({
  id,
  number,
  label,
  title,
  intro,
  children,
  tone = "",
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
  tone?: string;
}) {
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
