import * as Primitive from "@radix-ui/react-tooltip";
import type { ReactElement } from "react";

export const TooltipProvider = Primitive.Provider;
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  return (
    <Primitive.Root>
      <Primitive.Trigger asChild>{children}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          className="tooltip"
          sideOffset={6}
          collisionPadding={12}
        >
          {label}
          <Primitive.Arrow className="tooltip-arrow" />
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
