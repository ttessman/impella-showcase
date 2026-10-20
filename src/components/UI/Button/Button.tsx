import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & { asChild?: boolean };
/** Shared semantics; asChild composes behavior onto the caller's element. */
export function Button({ asChild = false, type = "button", ...props }: Props) {
  return asChild ? <Slot {...props} /> : <button type={type} {...props} />;
}
