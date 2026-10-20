import type { ReactNode } from "react";
import { Group } from "./Group";
import { variantClass } from "../../../utils/presentation";
import type { VariantName } from "../../../utils/presentation";
export function Grid({
  id,
  variant,
  children,
}: {
  id?: string;
  variant: VariantName<"grid">;
  children: ReactNode;
}) {
  return (
    <Group id={id} className={variantClass("grid", variant)}>
      {children}
    </Group>
  );
}
