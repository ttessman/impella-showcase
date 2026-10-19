import { useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { ReadingHeader } from "../../../../components/layout/ReadingHeader/ReadingHeader";
import { Button } from "../../../../components/actions/Button/Button";
import { useElementSize } from "../../../../hooks/useElementSize";
import { useReadingPosition } from "../../../../hooks/useReadingPosition";
import type { SectionDefinition } from "../../../../types/caseStudy";

type Props = { sections: readonly SectionDefinition[] };
/** Navigation is derived from the same definitions that render the case study. */
export function CaseStudyNavigation({ sections }: Props) {
  const ref = useRef<HTMLElement>(null);
  const sectionsTrigger = useRef<HTMLButtonElement>(null);
  const size = useElementSize(ref);
  const { activeId, progress } = useReadingPosition(sections, size.height);
  const [expanded, setExpanded] = useState(false);
  const current =
    sections.find((section) => section.id === activeId) ?? sections[0];
  return (
    <ReadingHeader
      ref={ref}
      expanded={expanded}
      progress={progress}
      slots={{
        identity: (
          <a className="reading-brand" href="#top">
            IMPELLA
          </a>
        ),
        context: (
          <span className="reading-location" aria-label="Current section">
            {current.number} / {current.label}
          </span>
        ),
        actions: (
          <nav className="reading-actions" aria-label="Case study navigation">
            <a href="#top">Overview</a>
            <a href="#playground" className="reading-primary">
              Explore the renderer <span aria-hidden="true">↗</span>
            </a>
            <Popover.Root open={expanded} onOpenChange={setExpanded}>
              <Popover.Trigger asChild>
                <Button
                  ref={sectionsTrigger}
                  className="reading-sections-trigger"
                >
                  Sections <span aria-hidden="true">▾</span>
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
                            <span className="reading-section-number">
                              {section.number}
                            </span>
                            <span>{section.title}</span>
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
