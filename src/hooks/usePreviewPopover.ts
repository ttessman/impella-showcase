import { useEffect, useRef, useState } from "react";

/** Hover/focus previews can be pinned by click or tap; Radix owns positioning. */
export function usePreviewPopover() {
  const trigger = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pinned = useRef(false);
  const suppressFocus = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function cancelClose() {
    clearTimeout(timer.current);
  }
  function close(restoreFocus = false) {
    cancelClose();
    pinned.current = false;
    setOpen(false);
    if (restoreFocus && document.activeElement !== trigger.current) {
      suppressFocus.current = true;
      trigger.current?.focus({ preventScroll: true });
    }
  }
  function show() {
    cancelClose();
    setOpen(true);
  }
  function scheduleClose() {
    if (
      pinned.current ||
      document.activeElement === trigger.current ||
      content.current?.contains(document.activeElement)
    )
      return;
    cancelClose();
    timer.current = setTimeout(() => setOpen(false), 180);
  }
  useEffect(() => {
    function checkAnchor(event: Event) {
      if (
        event.target instanceof Node &&
        content.current?.contains(event.target)
      )
        return;
      const anchor = trigger.current?.getBoundingClientRect();
      if (anchor && (anchor.bottom < 0 || anchor.top > innerHeight)) {
        pinned.current = false;
        setOpen(false);
      }
    }
    window.addEventListener("scroll", checkAnchor, true);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener("scroll", checkAnchor, true);
    };
  }, []);
  return {
    open,
    trigger,
    content,
    show,
    close,
    cancelClose,
    scheduleClose,
    onOpenChange(next: boolean) {
      setOpen(next);
      if (!next) pinned.current = false;
    },
    focus() {
      if (suppressFocus.current) suppressFocus.current = false;
      else show();
    },
    toggle() {
      if (pinned.current) close();
      else {
        pinned.current = true;
        show();
      }
    },
  };
}
