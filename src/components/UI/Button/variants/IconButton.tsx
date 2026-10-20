import type { ComponentProps } from "react";
import { Button } from "../Button";
import { Tooltip } from "../../Tooltip/Tooltip";

type Props = ComponentProps<typeof Button> & {
  label: string;
  tooltip?: string;
  onEscape?: () => void;
};
export function IconButton({
  label,
  tooltip,
  className = "",
  onEscape,
  onKeyDown,
  ...props
}: Props) {
  return (
    <Tooltip label={tooltip ?? label}>
      <Button
        {...props}
        aria-label={label}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === "Escape" && onEscape) {
            event.preventDefault();
            event.stopPropagation();
            onEscape();
          }
        }}
        className={`icon-button workspace-icon-button ${className}`}
      />
    </Tooltip>
  );
}
