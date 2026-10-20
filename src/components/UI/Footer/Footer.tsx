import type { ReactNode } from "react";
export function Footer({
  id,
  variant,
  children,
}: {
  id?: string;
  variant?: "site";
  children: ReactNode;
}) {
  return (
    <footer id={id} className={variant === "site" ? "site-footer" : undefined}>
      {children}
    </footer>
  );
}
