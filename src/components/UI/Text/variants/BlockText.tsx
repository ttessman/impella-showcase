import { RichText } from "../RichText";
import { hasRichTextBlocks } from "../../../../utils/markdown";
import type { ReactNode } from "react";
import { variantClass } from "../../../../utils/presentation";
import type { VariantName } from "../../../../utils/presentation";
export function BlockText({
  as,
  variant,
  children,
}: {
  as?: "p" | "span" | "div" | "strong" | "b" | "small" | "figcaption";
  variant?: VariantName<"text_block">;
  children: ReactNode;
}) {
  const Element =
    as ??
    (typeof children === "string" && hasRichTextBlocks(children) ? "div" : "p");
  return (
    <Element className={variantClass("text_block", variant) || undefined}>
      {typeof children === "string" ? (
        <RichText
          text={children}
          block={Element === "div" || Element === "figcaption"}
        />
      ) : (
        children
      )}
    </Element>
  );
}
