import { useEffect, useState } from "react";

type SectionLocation = { id: string };
/** A narrow observer band tracks section transitions; one RAF updates document progress. */
export function useReadingPosition(
  sections: readonly SectionLocation[],
  headerHeight: number,
) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));
    let observer: IntersectionObserver;
    let frame = 0;
    const previousOffset = document.documentElement.style.getPropertyValue(
      "--reading-header-offset",
    );
    document.documentElement.style.setProperty(
      "--reading-header-offset",
      `${headerHeight + 16}px`,
    );
    function activationLine() {
      return Math.min(
        innerHeight - 2,
        headerHeight + Math.min(120, innerHeight * 0.15),
      );
    }
    function trackSection() {
      const line = activationLine();
      const current = [...targets]
        .reverse()
        .find((element) => element.getBoundingClientRect().top <= line);
      setActiveId(current?.id ?? sections[0]?.id ?? "");
    }
    function trackProgress() {
      frame = 0;
      const range = document.documentElement.scrollHeight - innerHeight;
      setProgress(range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(trackProgress);
    }
    function observe() {
      observer?.disconnect();
      const line = activationLine();
      observer = new IntersectionObserver(trackSection, {
        rootMargin: `-${line}px 0px -${Math.max(0, innerHeight - line - 2)}px 0px`,
        threshold: 0,
      });
      targets.forEach((target) => observer.observe(target));
      trackSection();
      trackProgress();
    }
    observe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", observe);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", observe);
      if (previousOffset)
        document.documentElement.style.setProperty(
          "--reading-header-offset",
          previousOffset,
        );
      else
        document.documentElement.style.removeProperty(
          "--reading-header-offset",
        );
    };
  }, [sections, headerHeight]);
  return { activeId, progress };
}
