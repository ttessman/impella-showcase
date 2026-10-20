import { useState } from "react";
import { Button } from "../../Button/Button";
import { IconButton } from "../../Button/variants/IconButton";
import { Icon } from "../../Icon/Icon";
import type { IconName } from "../../Icon/Icon";
import { Dropdown } from "../Dropdown";

type Props = {
  label: string;
  items: readonly {
    label: string;
    icon?: IconName;
    disabled?: boolean;
    onSelect: () => void;
  }[];
};

export function ActionDropdown({ label, items }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      label={label}
      open={open}
      onOpenChange={setOpen}
      align="center"
      trigger={
        <IconButton label={label}>
          <Icon type="more" />
        </IconButton>
      }
    >
      {items.map((item) => (
        <Button
          data-dropdown-item
          key={item.label}
          disabled={item.disabled}
          onClick={() => {
            item.onSelect();
            setOpen(false);
          }}
        >
          {item.icon && <Icon type={item.icon} size={14} />}
          {item.label}
        </Button>
      ))}
    </Dropdown>
  );
}
