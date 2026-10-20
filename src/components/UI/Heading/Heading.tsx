import type { ReactNode } from "react";
export function Heading({
  id,
  level,
  children,
}: {
  id?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
}) {
  const Element = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  return <Element id={id}>{children}</Element>;
}
