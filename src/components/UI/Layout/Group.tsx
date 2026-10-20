import type { ReactNode } from "react";
import { variantClass } from "../../../utils/presentation";
import type { VariantName } from "../../../utils/presentation";
export function Group({
  "data-bundle-name": bundleName,
  id,
  as: Element = "div",
  variant,
  className = "",
  children,
}: {
  "data-bundle-name"?: string;
  id?: string;
  as?: "div" | "main" | "article" | "p" | "figcaption";
  variant?: VariantName<"group">;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Element
      data-bundle-name={bundleName}
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
