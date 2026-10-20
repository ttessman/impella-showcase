import type { ReactNode } from "react";
export function Disclosure({
  "data-bundle-name": bundleName,
  label,
  variant,
  initiallyExpanded,
  children,
}: {
  "data-bundle-name"?: string;
  label: string;
  variant?: "implementation";
  initiallyExpanded?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      data-bundle-name={bundleName}
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
