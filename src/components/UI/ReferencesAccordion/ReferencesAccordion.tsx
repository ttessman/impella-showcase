import type { ReactNode } from "react";
import { Disclosure } from "../Disclosure/Disclosure";
import { List } from "../List/List";
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
    <Disclosure data-bundle-name={bundleName} label={label} initiallyExpanded>
      <List ordered items={items} />
    </Disclosure>
  );
}
