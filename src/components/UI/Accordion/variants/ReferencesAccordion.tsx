import type { ReactNode } from "react";
import { Accordion } from "../Accordion";
import { List } from "../../List/List";
export function ReferencesAccordion({
  "data-bundle-name": bundleName,
  label,
  items,
}: {
  "data-bundle-name"?: string;
  label: string;
  items: readonly { id: string; content: ReactNode; bundleName?: string }[];
}) {
  return (
    <Accordion data-bundle-name={bundleName} label={label} initiallyExpanded>
      <List ordered items={items} />
    </Accordion>
  );
}
