import * as Primitive from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";

export function DialogClose(props: ComponentProps<typeof Primitive.Close>) {
  return <Primitive.Close {...props} />;
}
