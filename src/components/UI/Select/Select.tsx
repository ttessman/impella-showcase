import type { ComponentProps } from "react";
import { Icon } from "../Icon/Icon";

/** Keep native selection and keyboard behavior with a consistently inset indicator. */
export function Select({ className = "", ...props }: ComponentProps<"select">) {
  return (
    <span className="select-field">
      <select {...props} className={`native-select ${className}`} />
      <Icon type="chevron-down" size={16} />
    </span>
  );
}
