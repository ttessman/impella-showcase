import type { ReactNode } from "react";
export function Header({
  children,
  "data-bundle-name": bundleName,
}: {
  children: ReactNode;
  "data-bundle-name"?: string;
}) {
  return <header data-bundle-name={bundleName}>{children}</header>;
}
