import type { ReactNode } from "react";
export function ListItem({
  "data-bundle-name": bundleName,
  as: Element = "li",
  children,
}: {
  "data-bundle-name"?: string;
  as?: "li" | "div";
  children: ReactNode;
}) {
  return <Element data-bundle-name={bundleName}>{children}</Element>;
}
