import type { ReactNode } from "react";
import { variantClass } from "../../../utils/presentation";
import type { VariantName } from "../../../utils/presentation";
export function Figure({
  variant,
  children,
}: {
  variant?: VariantName<"figure">;
  children: ReactNode;
}) {
  return (
    <figure className={variantClass("figure", variant) || undefined}>
      {children}
    </figure>
  );
}
