import type { ReactNode } from "react";
import { variantClass } from "../../../presentation/variants";
import type { VariantName } from "../../../presentation/variants";
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
