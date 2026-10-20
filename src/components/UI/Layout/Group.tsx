import type { ReactNode } from "react";
import { variantClass } from "../../../utils/presentation";
import type { VariantName } from "../../../utils/presentation";
export function Group({
  id,
  as: Element = "div",
  variant,
  className = "",
  children,
}: {
  id?: string;
  as?: "div" | "main" | "article" | "p" | "figcaption";
  variant?: VariantName<"group">;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Element
      id={id}
      className={
        [variantClass("group", variant), className].filter(Boolean).join(" ") ||
        undefined
      }
    >
      {children}
    </Element>
  );
}
