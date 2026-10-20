import type { ReactNode } from "react";
import { Disclosure } from "../Disclosure/Disclosure";
import { List } from "../List/List";
export function ReferencesAccordion({
  label,
  items,
}: {
  label: string;
  items: readonly { id: string; content: ReactNode }[];
}) {
  return (
    <Disclosure label={label} initiallyExpanded>
      <List ordered items={items} />
    </Disclosure>
  );
}
