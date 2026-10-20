import { useLayoutEffect, useRef } from "react";

/** Keep the text field at its full content height; its containing pane owns scrolling. */
export function useAutoSizeTextarea(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const field = ref.current;
    if (!field) return;
    function resize() {
      if (!field || field.clientWidth === 0) return;
      const ancestors: { element: HTMLElement; top: number }[] = [];
      for (
        let element = field.parentElement;
        element;
        element = element.parentElement
      ) {
        if (element.scrollTop)
          ancestors.push({ element, top: element.scrollTop });
      }
      field.style.height = "0px";
      const border = field.offsetHeight - field.clientHeight;
      field.style.height = `${field.scrollHeight + border}px`;
      for (const { element, top } of ancestors) element.scrollTop = top;
    }
    resize();
    let width = field.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      const nextWidth = field.getBoundingClientRect().width;
      if (
        nextWidth === width &&
        Math.abs(field.scrollHeight - field.clientHeight) <= 1
      )
        return;
      width = nextWidth;
      resize();
    });
    observer.observe(field);
    return () => observer.disconnect();
  }, [value]);
  return ref;
}
