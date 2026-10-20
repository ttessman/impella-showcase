import * as Primitive from "@radix-ui/react-tooltip";
import type { ComponentProps } from "react";

export function TooltipProvider(
  props: ComponentProps<typeof Primitive.Provider>,
) {
  return <Primitive.Provider {...props} />;
}
