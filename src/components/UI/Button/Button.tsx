import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";

type Appearance = {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "text";
  size?: "small" | "default" | "large";
};
type Props = Appearance &
  (
    | (ComponentProps<"button"> & { href?: never })
    | (Omit<ComponentProps<"a">, "type"> & {
        href: string;
        disabled?: never;
        asChild?: false;
      })
  );

/** One appearance API; href renders a link and ordinary actions render a button. */
export function Button({
  asChild = false,
  variant,
  size = "default",
  className = "",
  ...props
}: Props) {
  const appearance =
    variant === "text"
      ? "button-text text-link"
      : variant
        ? `button button-${variant}${variant === "primary" ? " primary" : ""}`
        : "";
  const classes = `button-size-${size} ${appearance} ${className}`.trim();
  if (asChild) return <Slot {...props} className={classes} />;
  if (props.href !== undefined) return <a {...props} className={classes} />;
  return (
    <button {...props} type={props.type ?? "button"} className={classes} />
  );
}
