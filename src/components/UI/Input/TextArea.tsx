import type { ComponentProps } from "react";

/** Native multiline field with shared theme, sizing and invalid/disabled states. */
export function TextArea({
  className = "",
  ...props
}: ComponentProps<"textarea">) {
  return <textarea {...props} className={`text-area ${className}`.trim()} />;
}
