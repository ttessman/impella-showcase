import { useEffect, useState } from "react";
import type { RefObject } from "react";

/** Scroll-direction visibility with jitter tolerance; focus can reveal without pinning the header. */
export function useScrollDirection(root: RefObject<HTMLElement | null>) {
  const [hidden, setHidden] = useState(false);
  const [floating, setFloating] = useState(false);
  useEffect(() => {
    let anchor = window.scrollY;
    let frame = 0;
    function update() {
      frame = 0;
      const y = Math.max(
        0,
        Math.min(
          window.scrollY,
          document.documentElement.scrollHeight - innerHeight,
        ),
      );
      const height = root.current?.offsetHeight ?? 100;
      setFloating(y > 20);
      if (y <= height) {
        setHidden(false);
        anchor = y;
      } else if (Math.abs(y - anchor) >= 10) {
        setHidden(y > anchor);
        anchor = y;
      }
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [root]);
  return { hidden, floating, reveal: () => setHidden(false) };
}
