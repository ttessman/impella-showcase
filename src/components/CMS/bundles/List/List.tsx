import type { NodeOf } from "../../../../types/cms";
import { variantClass } from "../../model/variants";

import { ListItem } from "../ListItem/ListItem";
export function List({ node }: { node: NodeOf<"list"> }) {
  const Element =
    node.metadata.variant === "summary"
      ? "div"
      : node.metadata.ordered
        ? "ol"
        : "ul";
  return (
    <Element
      className={variantClass("list", node.metadata.variant) || undefined}
    >
      {node.content.map((item) =>
        item.bundle === "list_item" ? (
          <ListItem
            key={item.id}
            node={item}
            as={Element === "div" ? "div" : "li"}
          />
        ) : null,
      )}
    </Element>
  );
}
