import type { ReactNode } from "react";
import { ListItem } from "./ListItem";
import { variantClass } from "../../../utils/presentation";
import type { VariantName } from "../../../utils/presentation";
export function List({
  "data-bundle-name": bundleName,
  items,
  variant,
  ordered,
}: {
  "data-bundle-name"?: string;
  items: readonly { id: string; content: ReactNode; bundleName?: string }[];
  variant?: VariantName<"list">;
  ordered?: boolean;
}) {
  const Element = variant === "summary" ? "div" : ordered ? "ol" : "ul";
  return (
    <Element
      data-bundle-name={bundleName}
      className={variantClass("list", variant) || undefined}
    >
      {items.map((item) => (
        <ListItem
          data-bundle-name={item.bundleName}
          key={item.id}
          as={Element === "div" ? "div" : "li"}
        >
          {item.content}
        </ListItem>
      ))}
    </Element>
  );
}
