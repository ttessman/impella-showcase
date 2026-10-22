import { Button } from "../../Button/Button";
import { Icon } from "../../Icon/Icon";
import { SectionLabel } from "../../SectionLabel/SectionLabel";
import type { SectionDefinition } from "../../SectionLabel/SectionLabel";
import { Dropdown } from "../Dropdown";

type Props = {
  label: string;
  sections: readonly SectionDefinition[];
  activeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SectionDropdown({
  label,
  sections,
  activeId,
  open,
  onOpenChange,
}: Props) {
  return (
    <Dropdown
      label="Case study sections"
      variant="navigation"
      className="reading-sections"
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <Button className="reading-sections-trigger">
          {label}
          <Icon type="chevron-down" />
        </Button>
      }
    >
      <nav aria-label="Case study sections">
        <ol>
          {sections.map((section) => (
            <li key={section.id}>
              <a
                data-dropdown-item
                href={`#${section.id}`}
                aria-current={section.id === activeId ? "location" : undefined}
                onClick={() => onOpenChange(false)}
              >
                <SectionLabel definition={section} />
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </Dropdown>
  );
}
