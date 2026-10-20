import type { ReactNode } from "react";
import { variantClass } from "../../../presentation/variants";
import type { VariantName } from "../../../presentation/variants";
export function TextBlock({
  as: Element = "p",
  variant,
  children,
}: {
  as?: "p" | "span" | "div" | "strong" | "b" | "small" | "figcaption";
  variant?: VariantName<"text_block">;
  children: ReactNode;
}) {
  return (
    <Element className={variantClass("text_block", variant) || undefined}>
      {children}
    </Element>
  );
}
