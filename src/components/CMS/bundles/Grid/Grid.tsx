import type { ReactNode } from "react";
import { Group } from "../Group/Group";
import { variantClass } from "../../../presentation/variants";
import type { VariantName } from "../../../presentation/variants";
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
