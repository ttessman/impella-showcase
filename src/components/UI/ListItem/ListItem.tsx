import type { ReactNode } from "react";
export function ListItem({
  as: Element,
  children,
}: {
  as?: "li" | "div";
  children: ReactNode;
}) {
  return Element ? <Element>{children}</Element> : <>{children}</>;
}
