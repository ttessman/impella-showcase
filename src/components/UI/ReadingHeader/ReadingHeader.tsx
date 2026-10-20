import { Icon } from "../Icon/Icon";
export type ReadingNavigationDefinition = {
  overview: { label: string; href: string };
  primaryAction?: { label: string; href: string };
  sectionsLabel: string;
};

import { useRef, useState } from "react";
import { SectionLabel } from "../SectionLabel/SectionLabel";
import * as Popover from "@radix-ui/react-popover";
import { ReadingHeaderFrame } from "./ReadingHeaderFrame";
import { Button } from "../Button/Button";
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
  const sectionsTrigger = useRef<HTMLButtonElement>(null);
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
            <Popover.Root open={expanded} onOpenChange={setExpanded}>
              <Popover.Trigger asChild>
                <Button
                  ref={sectionsTrigger}
                  className="reading-sections-trigger"
                >
                  {navigation.sectionsLabel} <Icon type="chevron-down" />
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="reading-sections"
                  side="bottom"
                  align="end"
                  sideOffset={8}
                  collisionPadding={16}
                  aria-label="Case study sections"
                  onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    sectionsTrigger.current?.focus({ preventScroll: true });
                  }}
                  onOpenAutoFocus={(event) => {
                    event.preventDefault();
                    document
                      .querySelector<HTMLAnchorElement>(
                        '.reading-sections a[aria-current="location"]',
                      )
                      ?.focus();
                  }}
                  onKeyDown={(event) => {
                    if (
                      !["ArrowDown", "ArrowUp", "Home", "End"].includes(
                        event.key,
                      )
                    )
                      return;
                    const links = Array.from(
                      event.currentTarget.querySelectorAll<HTMLAnchorElement>(
                        "a",
                      ),
                    );
                    const index = links.indexOf(
                      document.activeElement as HTMLAnchorElement,
                    );
                    const next =
                      event.key === "Home"
                        ? 0
                        : event.key === "End"
                          ? links.length - 1
                          : (index +
                              (event.key === "ArrowDown" ? 1 : -1) +
                              links.length) %
                            links.length;
                    event.preventDefault();
                    links[next]?.focus();
                  }}
                >
                  <nav aria-label="Case study sections">
                    <ol>
                      {sections.map((section) => (
                        <li key={section.id}>
                          <a
                            href={`#${section.id}`}
                            aria-current={
                              section.id === activeId ? "location" : undefined
                            }
                            onClick={() => setExpanded(false)}
                          >
                            <SectionLabel definition={section} />
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </nav>
        ),
      }}
    />
  );
}
