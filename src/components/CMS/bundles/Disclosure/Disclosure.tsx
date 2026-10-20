import type { ReactNode } from "react";
export function Disclosure({
  label,
  variant,
  initiallyExpanded,
  children,
}: {
  label: string;
  variant?: "implementation";
  initiallyExpanded?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      className={
        variant === "implementation" ? "tool-implementation" : undefined
      }
      open={initiallyExpanded || undefined}
    >
      <summary>{label}</summary>
      {children}
    </details>
  );
}
