import { useEffect, useState } from "react";
import type { RefObject } from "react";

/** Observe an element's content box without coupling measurement to presentation. */
export function useElementSize<T extends HTMLElement>(
  ref: RefObject<T | null>,
) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}
