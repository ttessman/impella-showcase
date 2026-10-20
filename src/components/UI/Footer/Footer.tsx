import type { ReactNode } from "react";
export function Footer({
  "data-bundle-name": bundleName,
  id,
  variant,
  children,
}: {
  "data-bundle-name"?: string;
  id?: string;
  variant?: "site";
  children: ReactNode;
}) {
  return (
    <footer
      data-bundle-name={bundleName}
      id={id}
      className={variant === "site" ? "site-footer" : undefined}
    >
      {children}
    </footer>
  );
}
