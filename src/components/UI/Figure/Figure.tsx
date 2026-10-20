import type { ReactNode } from "react";
import { variantClass } from "../../../utils/presentation";
import type { VariantName } from "../../../utils/presentation";
export function Figure({
  "data-bundle-name": bundleName,
  variant,
  children,
}: {
  "data-bundle-name"?: string;
  variant?: VariantName<"figure">;
  children: ReactNode;
}) {
  return (
    <figure
      data-bundle-name={bundleName}
      className={variantClass("figure", variant) || undefined}
    >
      {children}
    </figure>
  );
}
