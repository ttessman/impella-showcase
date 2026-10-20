import { Icon } from "../Icon/Icon";
export type ReadingNavigationDefinition = {
  overview: { label: string; href: string };
  primaryAction?: { label: string; href: string };
  sectionsLabel: string;
};

import { useRef, useState } from "react";
import { SectionLabel } from "../SectionLabel/SectionLabel";
import { SectionDropdown } from "../Dropdown/variants/SectionDropdown";
import { ReadingHeaderFrame } from "./ReadingHeaderFrame";
import { useElementSize } from "../../../hooks/useElementSize";
import { useReadingPosition } from "../../../hooks/useReadingPosition";
import type { SectionDefinition } from "../SectionLabel/SectionLabel";

type Props = {
  sections: readonly SectionDefinition[];
  identity: string;
  navigation: ReadingNavigationDefinition;
};
/** Navigation is derived from the same definitions that render the case study. */
export function ReadingHeader({ sections, identity, navigation }: Props) {
  const ref = useRef<HTMLElement>(null);
  const size = useElementSize(ref);
  const { activeId, progress } = useReadingPosition(sections, size.height);
  const [expanded, setExpanded] = useState(false);
  const current =
    sections.find((section) => section.id === activeId) ?? sections[0];
  return (
    <ReadingHeaderFrame
      ref={ref}
      expanded={expanded}
      progress={progress}
      slots={{
        identity: (
          <a className="reading-brand" href={navigation.overview.href}>
            {identity}
          </a>
        ),
        context: (
          <span className="reading-location" aria-label="Current section">
            {current && <SectionLabel definition={current} />}
          </span>
        ),
        actions: (
          <nav className="reading-actions" aria-label="Case study navigation">
            <a href={navigation.overview.href}>{navigation.overview.label}</a>
            {navigation.primaryAction && (
              <a
                href={navigation.primaryAction.href}
                className="reading-primary"
              >
                {navigation.primaryAction.label} <Icon type="external" />
              </a>
            )}
            <SectionDropdown
              label={navigation.sectionsLabel}
              sections={sections}
              activeId={activeId}
              open={expanded}
              onOpenChange={setExpanded}
            />
          </nav>
        ),
      }}
    />
  );
}
