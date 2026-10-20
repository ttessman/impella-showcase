import type { ReactNode } from "react";
import { ListItem } from "../ListItem/ListItem";
import { variantClass } from "../../../presentation/variants";
import type { VariantName } from "../../../presentation/variants";
export function List({
  items,
  variant,
  ordered,
}: {
  items: readonly { id: string; content: ReactNode }[];
  variant?: VariantName<"list">;
  ordered?: boolean;
}) {
  const Element = variant === "summary" ? "div" : ordered ? "ol" : "ul";
  return (
    <Element className={variantClass("list", variant) || undefined}>
      {items.map((item) => (
        <ListItem key={item.id} as={Element === "div" ? "div" : "li"}>
          {item.content}
        </ListItem>
      ))}
    </Element>
  );
}
