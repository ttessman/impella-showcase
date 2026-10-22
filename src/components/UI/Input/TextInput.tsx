import type { ComponentProps } from "react";

/** Shared native text field; labels and controlled state belong to its caller. */
export function TextInput({
  type = "text",
  className = "",
  ...props
}: ComponentProps<"input">) {
  return (
    <input
      {...props}
      type={type}
      className={`text-input ${className}`.trim()}
    />
  );
}
