import type { ReactNode } from "react";
import { Group } from "./Group";
import { variantClass } from "../../../utils/presentation";
import type { VariantName } from "../../../utils/presentation";
export function Grid({
  "data-bundle-name": bundleName,
  id,
  variant,
  children,
}: {
  "data-bundle-name"?: string;
  id?: string;
  variant: VariantName<"grid">;
  children: ReactNode;
}) {
  return (
    <Group
      data-bundle-name={bundleName}
      id={id}
      className={variantClass("grid", variant)}
    >
      {children}
    </Group>
  );
}
