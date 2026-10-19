import type { ComponentProps } from "react";
import { Button } from "../Button/Button";
import { Tooltip } from "../../overlays/Tooltip/Tooltip";

type Props = ComponentProps<typeof Button> & {
  label: string;
  tooltip?: string;
};
export function IconButton({
  label,
  tooltip,
  className = "",
  ...props
}: Props) {
  return (
    <Tooltip label={tooltip ?? label}>
      <Button
        {...props}
        aria-label={label}
        className={`workspace-icon-button ${className}`}
      />
    </Tooltip>
  );
}
