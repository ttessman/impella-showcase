import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

type Props = ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "secondary";
  size?: "small" | "default" | "large";
};
/** Shared semantics; asChild composes behavior onto the caller's element. */
export function Button({
  asChild = false,
  type = "button",
  variant,
  size = "default",
  className = "",
  ...props
}: Props) {
  const classes =
    `button-size-${size} ${variant ? `button button-${variant}` : ""} ${className}`.trim();
  return asChild ? (
    <Slot {...props} className={classes} />
  ) : (
    <button type={type} {...props} className={classes} />
  );
}
